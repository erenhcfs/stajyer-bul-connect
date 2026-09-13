import { useMemo, useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
});

// ---------------------------------------------------------------------------
// Mock içerik — gerçek verilerle değiştirmek için:
// Supabase'de bir `posts` tablosu oluşturup burada `useQuery` ile çekebilirsin.
// Şimdilik statik veri sayesinde sayfa doğrudan aktif ve kullanılabilir durumda.
// ---------------------------------------------------------------------------

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: { name: string; initials: string };
  date: string;
  readTime: string;
  featured?: boolean;
  gradient: string;
};

const CATEGORIES = [
  "Tümü",
  "Staj Süreçleri",
  "Mülakat İpuçları",
  "CV Hazırlama",
  "Kariyer Planlama",
  "Sektör Haberleri",
];

const POSTS: Post[] = [
  {
    id: "1",
    slug: "staj-basvurusunda-dikkat-edilmesi-gerekenler",
    title: "Staj Başvurusunda Dikkat Edilmesi Gereken 7 Nokta",
    excerpt:
      "İlk staj başvurunu yapmadan önce bilmen gereken pratik ipuçları: doğru pozisyonu seçmekten ön yazı hazırlamaya kadar her şey.",
    category: "Staj Süreçleri",
    author: { name: "Elif Kaya", initials: "EK" },
    date: "8 Eyl 2026",
    readTime: "6 dk",
    featured: true,
    gradient: "from-primary/25 via-primary/10 to-transparent",
  },
  {
    id: "2",
    slug: "mulakatta-en-cok-sorulan-10-soru",
    title: "Mülakatta En Çok Sorulan 10 Soru ve Cevap Stratejileri",
    excerpt:
      "İK uzmanlarının sıkça sorduğu klasik soruları ve bu sorulara özgüvenle nasıl yanıt verebileceğini derledik.",
    category: "Mülakat İpuçları",
    author: { name: "Ahmet Yılmaz", initials: "AY" },
    date: "5 Eyl 2026",
    readTime: "8 dk",
    gradient: "from-amber-500/25 via-amber-500/10 to-transparent",
  },
  {
    id: "3",
    slug: "etkili-bir-cv-nasil-hazirlanir",
    title: "İşe Alım Uzmanlarının Gözünden Etkili Bir CV Nasıl Hazırlanır?",
    excerpt:
      "Ortalama bir CV'ye 7 saniye bakılıyor. Bu sürede fark yaratman için tasarım, içerik ve dil önerileri.",
    category: "CV Hazırlama",
    author: { name: "Zeynep Arslan", initials: "ZA" },
    date: "2 Eyl 2026",
    readTime: "5 dk",
    gradient: "from-sky-500/25 via-sky-500/10 to-transparent",
  },
  {
    id: "4",
    slug: "kariyer-hedefi-belirleme-rehberi",
    title: "Üniversite Sonrası Kariyer Hedefini Nasıl Belirlersin?",
    excerpt:
      "Doğru sektörü ve rolü seçmek için kendine sorman gereken sorular ile adım adım bir yol haritası.",
    category: "Kariyer Planlama",
    author: { name: "Mert Demir", initials: "MD" },
    date: "29 Ağu 2026",
    readTime: "7 dk",
    gradient: "from-violet-500/25 via-violet-500/10 to-transparent",
  },
  {
    id: "5",
    slug: "2026-teknoloji-sektorunde-staj-trendleri",
    title: "2026'da Teknoloji Sektöründe Staj Trendleri",
    excerpt:
      "Uzaktan stajlar, yapay zeka odaklı roller ve şirketlerin genç yeteneklerden beklentileri neler değişti?",
    category: "Sektör Haberleri",
    author: { name: "Selin Aydın", initials: "SA" },
    date: "24 Ağu 2026",
    readTime: "4 dk",
    gradient: "from-emerald-500/25 via-emerald-500/10 to-transparent",
  },
  {
    id: "6",
    slug: "on-yazi-nasil-yazilir",
    title: "Başvurunu Öne Çıkaracak Bir Ön Yazı Nasıl Yazılır?",
    excerpt:
      "Şablon cümlelerden uzak, samimi ve özgün bir ön yazı ile işverenin dikkatini nasıl çekersin?",
    category: "CV Hazırlama",
    author: { name: "Elif Kaya", initials: "EK" },
    date: "20 Ağu 2026",
    readTime: "5 dk",
    gradient: "from-rose-500/25 via-rose-500/10 to-transparent",
  },
  {
    id: "7",
    slug: "staj-sonrasi-tam-zamanli-teklif-almak",
    title: "Stajını Tam Zamanlı Bir Teklife Nasıl Dönüştürürsün?",
    excerpt:
      "Staj boyunca fark yaratıp ekip içinde görünür olmanın, süreç sonunda teklif almanı sağlayan davranış kalıpları.",
    category: "Staj Süreçleri",
    author: { name: "Ahmet Yılmaz", initials: "AY" },
    date: "15 Ağu 2026",
    readTime: "6 dk",
    gradient: "from-primary/25 via-primary/10 to-transparent",
  },
  {
    id: "8",
    slug: "davranissal-mulakat-sorulari",
    title: "Davranışsal Mülakat Soruları İçin STAR Tekniği",
    excerpt:
      "'Bana zorlu bir durumu nasıl yönettiğini anlat' tarzı sorulara yapılandırılmış ve etkili cevaplar verme yöntemi.",
    category: "Mülakat İpuçları",
    author: { name: "Zeynep Arslan", initials: "ZA" },
    date: "10 Ağu 2026",
    readTime: "5 dk",
    gradient: "from-amber-500/25 via-amber-500/10 to-transparent",
  },
];

function BlogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tümü");

  const filteredPosts = useMemo(() => {
    return POSTS.filter((post) => {
      const matchesCategory =
        activeCategory === "Tümü" || post.category === activeCategory;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const featuredPost = POSTS.find((p) => p.featured);
  const gridPosts = filteredPosts.filter((p) => p.id !== featuredPost?.id);
  const showFeatured =
    activeCategory === "Tümü" &&
    search.trim().length === 0 &&
    !!featuredPost;

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
                    className={`relative flex min-h-[220px] items-center justify-center bg-gradient-to-br ${featuredPost.gradient} p-8`}
                  >
                    <Badge className="absolute left-5 top-5 gap-1.5">
                      <TrendingUp className="size-3.5" />
                      Öne Çıkan
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
                          {featuredPost.author.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium text-foreground">
                          {featuredPost.author.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="size-3" />
                            {featuredPost.date}
                          </span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="size-3" />
                            {featuredPost.readTime}
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
              {gridPosts.map((post) => (
                <Link
                  key={post.id}
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group"
                >
                  <Card className="h-full overflow-hidden border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <div
                      className={`flex h-36 items-center justify-center bg-gradient-to-br ${post.gradient}`}
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
                            {post.author.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span>{post.author.name}</span>
                      </div>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" />
                        {post.readTime}
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
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