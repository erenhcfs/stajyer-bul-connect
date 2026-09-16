import { createClient } from "@supabase/supabase-js";
import { STATIC_BLOG_POSTS } from "./blog-posts.js";
const json = (body, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
export async function blogViewResponse(request) {
    if (!["GET", "POST"].includes(request.method))
        return json({ error: "Yöntem desteklenmiyor." }, 405);
    const url = new URL(request.url);
    if (request.method === "POST" &&
        ((request.headers.get("origin") && request.headers.get("origin") !== url.origin) ||
            request.headers.get("sec-fetch-site") === "cross-site"))
        return json({ error: "Geçersiz kaynak." }, 403);
    const slug = url.searchParams.get("slug");
    if (!slug || slug.length > 200 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
        return json({ error: "Geçersiz yazı." }, 400);
    try {
        const databaseUrl = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
        const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
        if (!databaseUrl || !key)
            throw new Error("Blog counter configuration missing");
        const db = createClient(databaseUrl, key, {
            auth: { persistSession: false, autoRefreshToken: false },
        });
        if (request.method === "POST") {
            const editorial = STATIC_BLOG_POSTS.find((post) => post.slug === slug);
            if (editorial) {
                // Create a durable row for bundled articles. Never overwrite existing edits,
                // publication status, or counts, including during concurrent first visits.
                const { id: _id, sources: _sources, faqs: _faqs, ...record } = editorial;
                const { error } = await db
                    .from("blog_posts")
                    .upsert({ ...record, view_count: 0 }, { onConflict: "slug", ignoreDuplicates: true });
                if (error)
                    throw error;
            }
            // The existing database function performs an atomic increment on published rows.
            const { data, error } = await db.rpc("increment_blog_view", { post_slug: slug });
            if (error)
                throw error;
            if (data === null)
                return json({ error: "Yazı bulunamadı." }, 404);
            if (!Number.isSafeInteger(data) || data < 0)
                throw new Error("Invalid blog count");
            return json({ count: data });
        }
        const { data, error } = await db
            .from("blog_posts")
            .select("view_count")
            .eq("slug", slug)
            .eq("published", true)
            .maybeSingle();
        if (error)
            throw error;
        if (!data)
            return json({ count: null });
        if (!Number.isSafeInteger(data.view_count) || data.view_count < 0)
            throw new Error("Invalid blog count");
        return json({ count: data.view_count });
    }
    catch (error) {
        console.error("Blog view counter unavailable:", error instanceof Error ? error.message : "database error");
        return json({ error: "Görüntülenme sayısı şu anda alınamıyor." }, 503);
    }
}
export default { fetch: blogViewResponse };
