import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Loader2, Calendar, User, ArrowLeft, Share2, Tag, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { type BlogPost } from "@/lib/blog-helpers";

export const Route = createFileRoute("/blog_/$slug")({
  component: BlogDetailPage,
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", params.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error("Blog yazısı yüklenemedi. Lütfen yeniden deneyin.");
    if (!data) throw notFound();
    return data as BlogPost;
  },
  head: ({ loaderData }) => {
    // Google SEO ve Arama Motoru Optimizasyonu için Dinamik Head Meta Etiketleri
    const title = loaderData?.title
      ? `${loaderData.title} | Stajyer Bul`
      : "Blog Detayı | Stajyer Bul";
    const description = loaderData?.excerpt || "Staj ve kariyer rehberi içerikleri.";
    const image = loaderData?.image_url || "https://stajyerbul.com.tr/logo.png";
    const url = `https://stajyerbul.com.tr/blog/${encodeURIComponent(loaderData?.slug || "")}`;

    return {
      links: [{ rel: "canonical", href: url }],
      meta: [
        { title },
        { name: "description", content: description },
        // Googlebot & OpenGraph (Sosyal Medya & Arama Motoru)
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: image },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
      // Google'ın içeriği daha iyi anlaması için Schema.org JSON-LD Yapısal Verisi
      scripts: loaderData
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                headline: loaderData.title,
                description: loaderData.excerpt,
                image: loaderData.image_url,
                author: {
                  "@type": "Person",
                  name: loaderData.author_name || "Stajyer Bul Ekibi",
                },
                datePublished: loaderData.created_at,
              }),
            },
          ]
        : [],
    };
  },
});

function BlogDetailPage() {
  const post = Route.useLoaderData();
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  useEffect(() => {
    let active = true;
    setRecentPosts([]);
    void supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .neq("slug", post.slug)
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (active) setRecentPosts((data ?? []) as BlogPost[]);
      });
    return () => {
      active = false;
    };
  }, [post.slug]);

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-1 container-x max-w-2xl py-20 text-center">
          <h1 className="text-2xl font-bold">Yazı Bulunamadı</h1>
          <p className="text-muted-foreground mt-2 mb-6">
            Aradığınız blog yazısı silinmiş veya taşınmış olabilir.
          </p>
          <Button asChild className="rounded-xl">
            <Link to="/blog">Blog Anasayfasına Dön</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-10">
        <article className="container-x max-w-3xl">
          {/* Geri Dön Tuşu */}
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="gap-2 rounded-xl text-muted-foreground hover:text-foreground"
            >
              <Link to="/blog">
                <ArrowLeft className="size-4" /> Tüm Blog Yazıları
              </Link>
            </Button>
          </div>

          {/* Kategori ve Tarih */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <Tag className="size-3" /> {post.category || "Staj Rehberi"}
            </span>
            <span className="flex items-center gap-1 text-xs">
              <Calendar className="size-3.5" />{" "}
              {new Date(post.created_at).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Makale Başlığı (H1 - Google SEO için hayati önem taşır) */}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight mb-6">
            {post.title}
          </h1>

          {/* Yazar Bilgisi */}
          <div className="flex items-center justify-between border-y py-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                {post.author_initials || "SB"}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {post.author_name || "Stajyer Bul Ekibi"}
                </p>
                <p className="text-xs text-muted-foreground">Uzman Kariyer Danışmanı</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl gap-2"
              onClick={async () => {
                try {
                  if (navigator.share) {
                    await navigator.share({ title: post.title, url: window.location.href });
                  } else {
                    await navigator.clipboard.writeText(window.location.href);
                    alert("Bağlantı kopyalandı!");
                  }
                } catch {
                  /* Sharing may be cancelled by the user. */
                }
              }}
            >
              <Share2 className="size-4" /> Paylaş
            </Button>
          </div>

          {/* Kapak Görseli */}
          {post.image_url && (
            <div className="mb-8 overflow-hidden rounded-2xl border shadow-md aspect-video">
              <img src={post.image_url} alt={post.title} className="h-full w-full object-cover" />
            </div>
          )}

          {/* GOOGLE ADS / ADSENSE ALANI (Makale Üstü Reklam Slotu) */}
          <div className="my-6 rounded-2xl border border-dashed bg-muted/40 p-4 text-center text-xs text-muted-foreground">
            <span>[ Google Ads / AdSense Reklam Alanı ]</span>
          </div>

          {/* Makale İçeriği (Paragraflar halinde mükemmel okunabilirlik) */}
          <div className="prose prose-slate max-w-none text-foreground/90 leading-relaxed space-y-6 text-base sm:text-lg whitespace-pre-line font-normal">
            {post.content}
          </div>

          {/* GOOGLE ADS / ADSENSE ALANI (Makale Altı Reklam Slotu) */}
          <div className="my-10 rounded-2xl border border-dashed bg-muted/40 p-4 text-center text-xs text-muted-foreground">
            <span>[ Google Ads / AdSense Reklam Alanı ]</span>
          </div>

          {/* İlgili / Diğer Yazılar (SEO İç Linkleme Gücü) */}
          {recentPosts.length > 0 && (
            <div className="mt-16 border-t pt-10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="size-5 text-primary" /> Diğer Faydalı Yazılar
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {recentPosts.map((item) => (
                  <Link
                    key={item.id}
                    to="/blog/$slug"
                    params={{ slug: item.slug }}
                    className="group flex flex-col overflow-hidden rounded-2xl border bg-card p-4 transition-all hover:shadow-md"
                  >
                    {item.image_url && (
                      <div className="mb-3 aspect-video overflow-hidden rounded-xl bg-muted">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <h4 className="font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
