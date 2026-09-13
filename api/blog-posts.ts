import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { isAuthenticated } from "./_auth";
import { slugify } from "../src/lib/blog-helpers";

// DİKKAT: Bu dosya SUPABASE_SERVICE_ROLE_KEY kullanır (RLS'i bypass eder).
// Bu değişken sadece Vercel ortam değişkenlerinde tutulmalı, ASLA "VITE_"
// önekiyle tanımlanmamalı — aksi halde tarayıcıya gönderilen build'e karışır.
function getServiceClient() {
  const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY ortam değişkenleri eksik.",
    );
  }
  return createClient(url, serviceKey);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req.headers.cookie)) {
    return res.status(401).json({ error: "Yetkisiz." });
  }

  const supabase = getServiceClient();

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ posts: data });
  }

  if (req.method === "POST") {
    const { title, excerpt, content, category, author_name, author_initials, published } =
      req.body ?? {};

    if (!title || !excerpt || !content || !category) {
      return res.status(400).json({
        error: "title, excerpt, content ve category alanları zorunlu.",
      });
    }

    const baseSlug = slugify(title);
    let slug = baseSlug;

    // Aynı slug varsa sonuna -2, -3 ... ekleyerek çakışmayı önle.
    for (let i = 2; i < 50; i++) {
      const { data: existing } = await supabase
        .from("blog_posts")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (!existing) break;
      slug = `${baseSlug}-${i}`;
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        slug,
        title,
        excerpt,
        content,
        category,
        author_name: author_name || "Stajyer Bul Ekibi",
        author_initials: author_initials || "SB",
        published: published ?? true,
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ post: data });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
