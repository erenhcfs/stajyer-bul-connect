import { createClient } from "@supabase/supabase-js";
const SITE_URL = "https://stajyerbul.com.tr";
const escapeXml = (value) => value.replace(/[<>&"']/g, (ch) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[ch]);
export async function sitemapResponse() {
    const entries = [
        "/",
        "/blog",
        "/ilanlar",
        "/stajyer-bul",
        "/hakkimizda",
        "/iletisim",
        "/rehber",
        "/nasil-calisir",
        "/gizlilik",
        "/kullanim-kosullari",
    ].map((path) => ({ loc: `${SITE_URL}${path}` }));
    const url = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
    const key = process.env["VITE_SUPABASE_ANON_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
    if (url && key) {
        try {
            const { data, error } = await createClient(url, key, { auth: { persistSession: false } })
                .from("blog_posts")
                .select("slug,created_at,updated_at")
                .eq("published", true);
            if (error)
                throw error;
            for (const post of data ?? [])
                if (typeof post.slug === "string")
                    entries.push({
                        loc: `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`,
                        ...(typeof post.updated_at === "string"
                            ? { lastmod: post.updated_at }
                            : typeof post.created_at === "string"
                                ? { lastmod: post.created_at }
                                : {}),
                    });
        }
        catch (error) {
            console.error("Sitemap:", error);
            // Do not cache a partial sitemap when the database is unavailable.
            return new Response("Sitemap geçici olarak kullanılamıyor.", {
                status: 503,
                headers: { "Cache-Control": "no-store" },
            });
        }
    }
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.map(({ loc, lastmod }) => `<url><loc>${escapeXml(loc)}</loc>${lastmod ? `<lastmod>${escapeXml(new Date(lastmod).toISOString())}</lastmod>` : ""}</url>`).join("")}</urlset>`, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=0, s-maxage=3600",
        },
    });
}
