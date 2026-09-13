import { createClient } from "@supabase/supabase-js";
import { createHmac, timingSafeEqual } from "node:crypto";
import { slugify } from "./blog-helpers.ts";

const cookieName = "admin_session";
const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

function signature(payload: string) {
  const secret = process.env["ADMIN_SESSION_SECRET"];
  if (!secret) throw new Error("Yönetici oturum ayarları eksik.");
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function authenticated(cookie: string | null) {
  const token = cookie
    ?.split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${cookieName}=`))
    ?.slice(cookieName.length + 1);
  if (!token || !process.env["ADMIN_SESSION_SECRET"]) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, signed] = parts;
  if (!payload || !signed || !/^\d+$/.test(payload) || !/^[a-f0-9]{64}$/.test(signed)) return false;
  return (
    Number(payload) > Date.now() &&
    timingSafeEqual(Buffer.from(signed), Buffer.from(signature(payload)))
  );
}

function sessionCookie(request: Request, token: string, maxAge: number) {
  const secure =
    new URL(request.url).protocol === "https:" || process.env["NODE_ENV"] === "production";
  return `${cookieName}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;
}

function serviceClient() {
  const url = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) throw new Error("Sunucu veritabanı ayarları eksik.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function handleAdminRequest(request: Request): Promise<Response | null> {
  const path = new URL(request.url).pathname;
  if (
    ![
      "/api/admin-check",
      "/api/admin-login",
      "/api/admin-logout",
      "/api/admin-data",
      "/api/blog-posts",
      "/api/blog-generate",
    ].includes(path)
  )
    return null;
  try {
    if (!["GET", "POST", "DELETE", "PATCH"].includes(request.method))
      return json({ error: "Yöntem desteklenmiyor." }, 405);
    if (request.method !== "GET") {
      const origin = request.headers.get("origin");
      if (origin && origin !== new URL(request.url).origin)
        return json({ error: "Geçersiz kaynak." }, 403);
    }
    if (path === "/api/admin-check" && request.method === "GET")
      return json({ authenticated: authenticated(request.headers.get("cookie")) });
    if (path === "/api/admin-login" && request.method === "POST") {
      const { password } = (await request.json()) ?? {};
      const expected = process.env["ADMIN_PASSWORD"];
      if (!expected || !process.env["ADMIN_SESSION_SECRET"])
        return json({ error: "Yönetici giriş ayarları eksik." }, 503);
      if (
        typeof password !== "string" ||
        Buffer.byteLength(password) !== Buffer.byteLength(expected) ||
        !timingSafeEqual(Buffer.from(password), Buffer.from(expected))
      )
        return json({ error: "Şifre hatalı." }, 401);
      const payload = String(Date.now() + 12 * 3600_000);
      return json({ ok: true }, 200, {
        "Set-Cookie": sessionCookie(request, `${payload}.${signature(payload)}`, 12 * 3600),
      });
    }
    if (path === "/api/admin-logout" && request.method === "POST")
      return json({ ok: true }, 200, { "Set-Cookie": sessionCookie(request, "", 0) });
    if (!authenticated(request.headers.get("cookie")))
      return json({ error: "Yönetici girişi gerekli." }, 401);

    if (path === "/api/blog-generate" && request.method === "POST") {
      const { prompt } = (await request.json()) ?? {};
      if (typeof prompt !== "string" || !prompt.trim() || prompt.length > 2000)
        return json({ error: "Geçerli bir konu girin (en fazla 2000 karakter)." }, 400);
      const key = process.env["GEMINI_API_KEY"];
      if (!key)
        return json(
          { error: "Yapay zeka hizmeti yapılandırılmamış. Makaleyi formdan yazabilirsiniz." },
          503,
        );
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": key },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `StajyerBul için Türkçe kariyer makalesi yaz. Konu: ${prompt}. JSON nesnesinde title, excerpt (en fazla 160 karakter), content alanlarını döndür.`,
                  },
                ],
              },
            ],
            generationConfig: { responseMimeType: "application/json" },
          }),
          signal: AbortSignal.timeout(45000),
        },
      );
      if (!response.ok)
        return json({ error: "Yapay zeka hizmeti yanıt vermedi. Yeniden deneyin." }, 502);
      const data = await response.json();
      const article = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
      if (
        ![article.title, article.excerpt, article.content].every(
          (v) => typeof v === "string" && v.trim(),
        )
      )
        return json({ error: "Geçerli makale üretilemedi." }, 502);
      return json({ article });
    }

    if (["/api/admin-login", "/api/admin-check", "/api/admin-logout"].includes(path))
      return json({ error: "Yöntem desteklenmiyor." }, 405);
    const db = serviceClient();
    if (path === "/api/admin-data") {
      if (request.method === "GET") {
        const [employers, listings] = await Promise.all([
          db
            .from("profiles")
            .select("*")
            .eq("role", "isveren")
            .order("created_at", { ascending: false }),
          db.from("job_listings").select("*").order("created_at", { ascending: false }),
        ]);
        if (employers.error) throw employers.error;
        if (listings.error) throw listings.error;
        return json({ employers: employers.data, listings: listings.data });
      }
      const body = (await request.json()) ?? {};
      if (typeof body.id !== "string" || !/^[0-9a-f-]{36}$/i.test(body.id))
        return json({ error: "Geçersiz kayıt." }, 400);
      if (request.method === "PATCH" && ["onaylandi", "reddedildi"].includes(body.status)) {
        const { data, error } = await db
          .from("profiles")
          .update({ approval_status: body.status })
          .eq("id", body.id)
          .eq("role", "isveren")
          .select("id")
          .single();
        if (error) throw error;
        if (body.status === "reddedildi") {
          const { error: deleteError } = await db
            .from("job_listings")
            .delete()
            .eq("employer_id", body.id);
          if (deleteError)
            return json(
              {
                error:
                  "İşveren reddedildi ancak ilanları kaldırılamadı. İlanları yönetim panelinden kontrol edin.",
              },
              500,
            );
        }
        return json({ profile: data });
      }
      if (request.method === "DELETE") {
        const { error } = await db
          .from("job_listings")
          .delete()
          .eq("id", body.id)
          .select("id")
          .single();
        if (error) throw error;
        return json({ ok: true });
      }
    }
    if (path === "/api/blog-posts") {
      if (request.method === "GET") {
        const { data, error } = await db
          .from("blog_posts")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return json({ posts: data });
      }
      if (request.method === "POST") {
        const body = (await request.json()) ?? {};
        if (
          ![body.title, body.excerpt, body.content, body.category].every(
            (v) => typeof v === "string" && v.trim(),
          )
        )
          return json({ error: "Başlık, özet, içerik ve kategori zorunlu." }, 400);
        const base = slugify(
          typeof body.slug === "string" && body.slug.trim() ? body.slug : body.title,
        );
        if (!base) return json({ error: "Geçerli bir başlık veya slug girin." }, 400);
        if (
          body.image_url &&
          (typeof body.image_url !== "string" || !/^https?:\/\//.test(body.image_url))
        )
          return json({ error: "Görsel adresi http veya https ile başlamalı." }, 400);
        for (let i = 1; i <= 50; i++) {
          const { data, error } = await db
            .from("blog_posts")
            .insert({
              title: body.title.trim(),
              excerpt: body.excerpt.trim(),
              content: body.content,
              category: body.category,
              slug: i === 1 ? base : `${base}-${i}`,
              author_name:
                typeof body.author_name === "string" ? body.author_name : "Stajyer Bul Ekibi",
              author_initials:
                typeof body.author_initials === "string" ? body.author_initials : "SB",
              published: body.published !== false,
              ...(body.image_url ? { image_url: body.image_url } : {}),
            })
            .select()
            .single();
          if (!error) return json({ post: data }, 201);
          if (error.code !== "23505") throw error;
        }
        return json({ error: "Bu slug kullanılıyor. Başka bir slug seçin." }, 409);
      }
    }
    return json({ error: "Yöntem desteklenmiyor." }, 405);
  } catch (error) {
    if (error instanceof SyntaxError) return json({ error: "Geçersiz istek." }, 400);
    console.error("Admin API:", error);
    return json(
      { error: "İşlem tamamlanamadı. Sunucu ayarlarını ve veritabanı bağlantısını kontrol edin." },
      500,
    );
  }
}
