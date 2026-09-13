import { Fragment, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  Clock,
  Calendar,
  ArrowRight,
  Sparkles,
  Mail,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { AdUnit } from "@/components/AdUnit";
import {
  BLOG_CATEGORIES,
  categoryGradient,
  estimateReadTime,
  formatPostDate,
  type BlogPost,
} from "@/lib/blog-helpers";

const SITE_URL = "https://stajyerbul.com"; // kendi canlı domaninle değiştir

export const Route = createFileRoute("/blog")({
  component: BlogPage,
  loader: async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as BlogPost[];
  },
  head: () => ({
    meta: [
      { title: "Blog | Stajyer Bul - Staj ve Kariyer Rehberi" },
      {
        name: "description",
        content:
          "Staj başvuru süreçleri, mülakat ipuçları, CV hazırlama ve kariyer planlama üzerine güncel rehberler.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Blog | Stajyer Bul" },
      {
        property: "og:description",
        content:
          "Staj başvuru süreçleri, mülakat ipuçları ve kariyer planlama rehberleri.",
      },
      { property: "og:url", content: `${SITE_URL}/blog` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/blog` }],
  }),
});

const CATEGORIES = ["Tümü", ...BLOG_CATEGORIES];

function BlogPage() {
  const posts = Route.useLoaderData();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tümü");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === "Tümü" || post.category === activeCategory;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [posts, search, activeCategory]);

  const featuredPost = posts[0];
  const gridPosts = filteredPosts.filter((p) => p.id !== featuredPost?.id);
  const showFeatured =
    activeCategory === "Tümü" && search.trim().length === 0 && !!featuredPost;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b bg-muted/30">
          <div className="container-x py-14 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-6">
                <Sparkles className="size-4" />
                Kariyer Blogu
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                Blog ve Kariyer Rehberi
              </h1>

              <p className="mt-4 text-muted-foreground text-base sm:text-lg">
                Staj süreçleri, mülakat ipuçları ve mesleki gelişim üzerine
                derlediğimiz yazılarla bir adım öne geç.
              </p>

              <div className="mt-8 relative mx-auto max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Yazılarda ara..."
                  className="pl-10 h-11 rounded-xl bg-background"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="container-x pt-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((category) => {
              const isActive = category === activeCategory;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </section>

        {/* Featured post */}
        {showFeatured && featuredPost && (
          <section className="container-x pt-12">
            <Link to="/blog/$slug" params={{ slug: featuredPost.slug }}>
              <Card className="overflow-hidden border-border/60 transition-shadow hover:shadow-lg">
                <div className="grid md:grid-cols-2">
                  <div
                    className={`relative flex min-h-[220px] items-center justify-center bg-gradient-to-br ${categoryGradient(
                      featuredPost.category,
                    )} p-8`}
                  >
                    <Badge className="absolute left-5 top-5 gap-1.5">
                      <TrendingUp className="size-3.5" />
                      En Yeni
                    </Badge>
                    <BookOpen className="size-16 text-foreground/20" />
                  </div>
                  <div className="flex flex-col justify-center p-6 sm:p-8">
                    <Badge variant="secondary" className="w-fit mb-3">
                      {featuredPost.category}
                    </Badge>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                      {featuredPost.title}
                    </h2>
                    <p className="mt-3 text-muted-foreground">
                      {featuredPost.excerpt}
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs">
                          {featuredPost.author_initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium text-foreground">
                          {featuredPost.author_name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="size-3" />
                            {formatPostDate(featuredPost.created_at)}
                          </span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="size-3" />
                            {estimateReadTime(featuredPost.content)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </section>
        )}

        {/* Grid */}
        <section className="container-x py-12">
          {gridPosts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post, index) => (
                <Fragment key={post.id}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="group"
                  >
                    <Card className="h-full overflow-hidden border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-md">
                      <div
                        className={`flex h-36 items-center justify-center bg-gradient-to-br ${categoryGradient(
                          post.category,
                        )}`}
                      >
                        <BookOpen className="size-10 text-foreground/20" />
                      </div>
                      <CardHeader className="pb-2">
                        <Badge variant="secondary" className="w-fit text-xs">
                          {post.category}
                        </Badge>
                        <h3 className="mt-2 line-clamp-2 text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                          {post.title}
                        </h3>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {post.excerpt}
                        </p>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Avatar className="size-6">
                            <AvatarFallback className="text-[10px]">
                              {post.author_initials}
                            </AvatarFallback>
                          </Avatar>
                          <span>{post.author_name}</span>
                        </div>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3" />
                          {estimateReadTime(post.content)}
                        </span>
                      </CardFooter>
                    </Card>
                  </Link>

                  {/* Her 6 karttan sonra bir reklam bloğu */}
                  {(index + 1) % 6 === 0 && (
                    <div className="sm:col-span-2 lg:col-span-3">
                      <AdUnit slot="0000000000" className="min-h-[120px]" />
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          ) : (
            <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
              <div className="grid size-14 place-items-center rounded-full bg-muted">
                <Search className="size-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Sonuç bulunamadı
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Aramanla veya seçtiğin kategoriyle eşleşen bir yazı bulamadık.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("Tümü");
                }}
              >
                Filtreleri Temizle
              </Button>
            </div>
          )}
        </section>

        {/* Newsletter CTA */}
        <section className="border-t bg-muted/30">
          <div className="container-x py-14">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
              <div className="grid size-12 place-items-center rounded-full bg-primary/10">
                <Mail className="size-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Yeni yazılardan haberdar ol
              </h3>
              <p className="text-sm text-muted-foreground">
                Kariyer ve staj rehberi yazılarımızı e-posta ile almak için
                bültenimize katıl.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-2 flex w-full max-w-sm flex-col gap-2 sm:flex-row"
              >
                <Input
                  type="email"
                  required
                  placeholder="E-posta adresin"
                  className="h-11 rounded-xl"
                />
                <Button type="submit" className="h-11 rounded-xl gap-1.5">
                  Abone Ol <ArrowRight className="size-4" />
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
