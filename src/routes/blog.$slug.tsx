import { Fragment } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, BookOpen } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { AdUnit } from "@/components/AdUnit";
import {
  categoryGradient,
  estimateReadTime,
  formatPostDate,
  type BlogPost,
} from "@/lib/blog-helpers";

const SITE_URL = "https://stajyerbul.com"; // kendi canlı domaninle değiştir

export const Route = createFileRoute("/blog/$slug")({
  component: BlogDetailPage,
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", params.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw notFound();

    const { data: related } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("category", data.category)
      .eq("published", true)
      .neq("slug", data.slug)
      .limit(3);

    return { post: data as BlogPost, related: (related ?? []) as BlogPost[] };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { post } = loaderData;
    const url = `${SITE_URL}/blog/${post.slug}`;
    return {
      meta: [
        { title: `${post.title} | Stajyer Bul Blog` },
        { name: "description", content: post.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:url", content: url },
        { property: "article:published_time", content: post.created_at },
        { property: "article:section", content: post.category },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.excerpt },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

function BlogDetailPage() {
  const { post, related } = Route.useLoaderData();
  const url = `${SITE_URL}/blog/${post.slug}`;
  const paragraphs = post.content.split(/\n{2,}/).filter(Boolean);
  const midpoint = Math.ceil(paragraphs.length / 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author_name },
    datePublished: post.created_at,
    articleSection: post.category,
    mainEntityOfPage: url,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-1">
        {/* Cover */}
        <div
          className={`flex h-56 items-center justify-center bg-gradient-to-br ${categoryGradient(
            post.category,
          )} sm:h-72`}
        >
          <BookOpen className="size-14 text-foreground/20" />
        </div>

        <article className="container-x max-w-3xl py-10 sm:py-14">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Tüm yazılar
          </Link>

          <Badge variant="secondary" className="mt-6 w-fit">
            {post.category}
          </Badge>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {post.title}
          </h1>

          <div className="mt-5 flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="text-xs">
                {post.author_initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium text-foreground">
                {post.author_name}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3" />
                  {formatPostDate(post.created_at)}
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" />
                  {estimateReadTime(post.content)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/90">
            {paragraphs.map((paragraph, index) => (
              <Fragment key={index}>
                <p>{paragraph}</p>
                {index === midpoint - 1 && paragraphs.length > 2 && (
                  <AdUnit slot="0000000001" className="my-6 min-h-[120px]" />
                )}
              </Fragment>
            ))}
          </div>

          <AdUnit slot="0000000002" className="mt-10 min-h-[120px]" />
        </article>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="border-t bg-muted/30">
            <div className="container-x max-w-3xl py-12">
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                Bu kategoride diğer yazılar
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {related.map((r) => (
                  <Link key={r.id} to="/blog/$slug" params={{ slug: r.slug }}>
                    <Card className="h-full p-4 transition-shadow hover:shadow-md">
                      <p className="line-clamp-3 text-sm font-semibold text-foreground">
                        {r.title}
                      </p>
                      <p className="mt-3 text-xs text-muted-foreground">
                        {estimateReadTime(r.content)}
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
