import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  BookOpen,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { POSTS } from "@/lib/blog-posts";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogDetailPage,
  loader: ({ params }) => {
    const post = POSTS.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return post;
  },
});

function BlogDetailPage() {
  const post = Route.useLoaderData();

  const related = POSTS.filter(
    (p) => p.category === post.category && p.slug !== post.slug,
  ).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Cover */}
        <div
          className={`flex h-56 items-center justify-center bg-gradient-to-br ${post.gradient} sm:h-72`}
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
                {post.author.initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium text-foreground">
                {post.author.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3" />
                  {post.date}
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/90">
            {post.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
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
                        {r.readTime}
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