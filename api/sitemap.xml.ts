import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const SITE_URL = "https://stajyerbul.com"; // kendi canlı domaninle değiştir

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

  const staticUrls = [
    { loc: `${SITE_URL}/`, priority: "1.0" },
    { loc: `${SITE_URL}/blog`, priority: "0.8" },
    { loc: `${SITE_URL}/ilanlar`, priority: "0.8" },
    { loc: `${SITE_URL}/giris`, priority: "0.3" },
    { loc: `${SITE_URL}/hakkimizda`, priority: "0.3" },
  ];

  let postUrls: { loc: string; lastmod: string; priority: string }[] = [];

  if (url && anonKey) {
    const supabase = createClient(url, anonKey);
    const { data } = await supabase
      .from("blog_posts")
      .select("slug, created_at")
      .eq("published", true);

    postUrls = (data ?? []).map((post) => ({
      loc: `${SITE_URL}/blog/${post.slug}`,
      lastmod: new Date(post.created_at).toISOString(),
      priority: "0.7",
    }));
  }

  const allUrls = [...staticUrls, ...postUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${"lastmod" in u ? `\n    <lastmod>${(u as { lastmod: string }).lastmod}</lastmod>` : ""}
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  return res.status(200).send(xml);
}
