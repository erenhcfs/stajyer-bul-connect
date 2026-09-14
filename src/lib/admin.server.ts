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

function secureEqual(value: unknown, expected: string) {
  return (
    typeof value === "string" &&
    Buffer.byteLength(value) === Buffer.byteLength(expected) &&
    timingSafeEqual(Buffer.from(value), Buffer.from(expected))
  );
}

type BlogBody = {
  title?: unknown;
  excerpt?: unknown;
  content?: unknown;
  category?: unknown;
  image_url?: unknown;
  keywords?: unknown;
  author_name?: unknown;
  author_initials?: unknown;
  published?: unknown;
  seo_title?: unknown;
  seo_description?: unknown;
};

function blogPayload(body: BlogBody) {
  if (
    ![body.title, body.excerpt, body.content, body.category].every(
      (value) => typeof value === "string" && value.trim(),
    )
  )
    throw new TypeError("Başlık, özet, içerik ve kategori zorunlu.");
  if (String(body.title).length > 180 || String(body.excerpt).length > 320)
    throw new TypeError("Başlık veya özet izin verilen uzunluğu aşıyor.");
  if (
    body.image_url &&
    (typeof body.image_url !== "string" || !/^https?:\/\//.test(body.image_url))
  )
    throw new TypeError("Görsel adresi http veya https ile başlamalı.");
  const keywords = Array.isArray(body.keywords)
    ? body.keywords.filter((value): value is string => typeof value === "string").slice(0, 20)
    : [];
  return {
    title: String(body.title).trim(),
    excerpt: String(body.excerpt).trim(),
    content: String(body.content).trim(),
    category: String(body.category).trim(),
    author_name:
      typeof body.author_name === "string" ? body.author_name.trim() : "Stajyer Bul Ekibi",
    author_initials: typeof body.author_initials === "string" ? body.author_initials.trim() : "SB",
    published: body.published !== false,
    image_url:
      typeof body.image_url === "string" && body.image_url.trim() ? body.image_url.trim() : null,
    seo_title:
      typeof body.seo_title === "string" && body.seo_title.trim()
        ? body.seo_title.trim().slice(0, 70)
        : null,
    seo_description:
      typeof body.seo_description === "string" && body.seo_description.trim()
        ? body.seo_description.trim().slice(0, 180)
        : null,
    keywords: keywords.map((value) => value.trim()).filter(Boolean),
  };
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
      const { username, password } = (await request.json()) ?? {};
      const expectedUsername = process.env["ADMIN_USERNAME"] || "admin";
      const expectedPassword = process.env["ADMIN_PASSWORD"];
      if (!expectedPassword || !process.env["ADMIN_SESSION_SECRET"])
        return json({ error: "Yönetici giriş ayarları eksik." }, 503);
      if (
        (username !== undefined && !secureEqual(username, expectedUsername)) ||
        !secureEqual(password, expectedPassword)
      )
        return json({ error: "Kullanıcı adı veya şifre hatalı." }, 401);
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
                    text: `StajyerBul için Türkçe, özgün ve yararlı bir kariyer makalesi taslağı yaz. Konu: ${prompt}. Kesinleşmemiş gelecek bilgilerini tahmin gibi sunma; doğrulanması gereken noktaları açıkça belirt. Okunabilir ara başlıklar kullan. JSON nesnesinde title, excerpt (en fazla 160 karakter), seo_title (en fazla 60 karakter), seo_description (en fazla 160 karakter), keywords (en fazla 8 Türkçe kelime öbeği), content alanlarını döndür.`,
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
        const [employers, candidates, listings, settings] = await Promise.all([
          db
            .from("profiles")
            .select("*")
            .eq("role", "isveren")
            .order("created_at", { ascending: false }),
          db
            .from("profiles")
            .select("*")
            .in("role", ["stajyer", "ogrenci"])
            .order("created_at", { ascending: false }),
          db.from("job_listings").select("*").order("created_at", { ascending: false }),
          db.from("platform_settings").select("*").eq("id", true).single(),
        ]);
        if (employers.error) throw employers.error;
        if (candidates.error) throw candidates.error;
        if (listings.error) throw listings.error;
        if (settings.error) throw settings.error;
        return json({
          employers: employers.data,
          candidates: candidates.data,
          listings: listings.data,
          settings: settings.data,
        });
      }
      const body = (await request.json()) ?? {};
      if (request.method === "PATCH" && body.resource === "settings") {
        const days = Number(body.candidate_approval_days);
        const limit = Number(body.max_active_listings);
        if (
          !Number.isInteger(days) ||
          days < 1 ||
          days > 90 ||
          !Number.isInteger(limit) ||
          limit < 1 ||
          limit > 50 ||
          typeof body.applications_enabled !== "boolean"
        )
          return json({ error: "Ayar değerleri geçersiz." }, 400);
        const { data, error } = await db
          .from("platform_settings")
          .update({
            candidate_approval_days: days,
            max_active_listings: limit,
            applications_enabled: body.applications_enabled,
            updated_at: new Date().toISOString(),
          })
          .eq("id", true)
          .select("*")
          .single();
        if (error) throw error;
        return json({ settings: data });
      }
      if (typeof body.id !== "string" || !/^[0-9a-f-]{36}$/i.test(body.id))
        return json({ error: "Geçersiz kayıt." }, 400);
      if (
        request.method === "PATCH" &&
        ["employer", "candidate"].includes(body.resource) &&
        ["onaylandi", "reddedildi", "beklemede"].includes(body.status)
      ) {
        const reason = typeof body.reason === "string" ? body.reason.trim() : "";
        if (body.status === "reddedildi" && (reason.length < 5 || reason.length > 500))
          return json({ error: "Red sebebi 5-500 karakter olmalıdır." }, 400);
        const roleFilter = body.resource === "employer" ? ["isveren"] : ["stajyer", "ogrenci"];
        let expiresAt: string | null = null;
        if (body.resource === "candidate" && body.status === "onaylandi") {
          const requestedDays = Number(body.days);
          const { data: setting } = await db
            .from("platform_settings")
            .select("candidate_approval_days")
            .eq("id", true)
            .single();
          const days =
            Number.isInteger(requestedDays) && requestedDays >= 1 && requestedDays <= 90
              ? requestedDays
              : setting?.candidate_approval_days || 10;
          expiresAt = new Date(Date.now() + days * 86_400_000).toISOString();
        }
        const { data, error } = await db
          .from("profiles")
          .update({
            approval_status: body.status,
            approval_expires_at: expiresAt,
            rejection_reason: body.status === "reddedildi" ? reason : null,
          })
          .eq("id", body.id)
          .in("role", roleFilter)
          .select("id")
          .single();
        if (error) throw error;
        if (body.resource === "employer" && body.status === "reddedildi") {
          const { error: closeError } = await db
            .from("job_listings")
            .update({ status: "closed" })
            .eq("employer_id", body.id);
          if (closeError) throw closeError;
        }
        return json({ profile: data });
      }
      if (request.method === "PATCH" && body.resource === "listing") {
        if (!["active", "closed"].includes(body.status))
          return json({ error: "Geçersiz ilan durumu." }, 400);
        const { data, error } = await db
          .from("job_listings")
          .update({ status: body.status })
          .eq("id", body.id)
          .select("id,status")
          .single();
        if (error) throw error;
        return json({ listing: data });
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
        let values;
        try {
          values = blogPayload(body);
        } catch (error) {
          return json({ error: error instanceof Error ? error.message : "Geçersiz makale." }, 400);
        }
        const base = slugify(
          typeof body.slug === "string" && body.slug.trim() ? body.slug : body.title,
        );
        if (!base) return json({ error: "Geçerli bir başlık veya slug girin." }, 400);
        for (let i = 1; i <= 50; i++) {
          const { data, error } = await db
            .from("blog_posts")
            .insert({
              ...values,
              slug: i === 1 ? base : `${base}-${i}`,
            })
            .select()
            .single();
          if (!error) return json({ post: data }, 201);
          if (error.code !== "23505") throw error;
        }
        return json({ error: "Bu slug kullanılıyor. Başka bir slug seçin." }, 409);
      }
      if (request.method === "PATCH") {
        const body = (await request.json()) ?? {};
        if (typeof body.id !== "string" || !/^[0-9a-f-]{36}$/i.test(body.id))
          return json({ error: "Geçersiz yazı." }, 400);
        let values;
        try {
          values = blogPayload(body);
        } catch (error) {
          return json({ error: error instanceof Error ? error.message : "Geçersiz makale." }, 400);
        }
        const slug = slugify(
          typeof body.slug === "string" && body.slug.trim() ? body.slug : values.title,
        );
        if (!slug) return json({ error: "Geçerli bir slug girin." }, 400);
        const { data, error } = await db
          .from("blog_posts")
          .update({ ...values, slug })
          .eq("id", body.id)
          .select()
          .single();
        if (error?.code === "23505")
          return json({ error: "Bu slug başka bir yazıda kullanılıyor." }, 409);
        if (error) throw error;
        return json({ post: data });
      }
      if (request.method === "DELETE") {
        const body = (await request.json()) ?? {};
        if (typeof body.id !== "string" || !/^[0-9a-f-]{36}$/i.test(body.id))
          return json({ error: "Geçersiz yazı." }, 400);
        const { error } = await db.from("blog_posts").delete().eq("id", body.id);
        if (error) throw error;
        return json({ ok: true });
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
