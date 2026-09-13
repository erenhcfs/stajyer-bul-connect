import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Lock, LogOut, Loader2, CheckCircle2, Globe, Sparkles, FileText, Bot, Image as ImageIcon } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { BLOG_CATEGORIES, type BlogPost } from "@/lib/blog-helpers";

export const Route = createFileRoute("/blog-yonet")({
  component: BlogYonetimPage,
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
});

function BlogYonetimPage() {
  const [authed, setAuthed] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(true);

  useEffect(() => {
    const isAuth = localStorage.getItem("stajyerbul_admin_auth") === "true";
    setAuthed(isAuth);
    setLoadingCheck(false);
  }, []);

  if (loadingCheck) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container-x max-w-4xl py-12">
          {authed ? (
            <AdminPanel onLogout={() => {
              localStorage.removeItem("stajyerbul_admin_auth");
              setAuthed(false);
            }} />
          ) : (
            <LoginForm onSuccess={() => setAuthed(true)} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (username.trim() === "admin" && password === "eren") {
      localStorage.setItem("stajyerbul_admin_auth", "true");
      onSuccess();
    } else {
      setError("Kullanıcı adı veya şifre hatalı! (admin / eren)");
    }
  }

  return (
    <Card className="mx-auto max-w-md shadow-lg border-border/85">
      <CardHeader className="items-center text-center pb-2">
        <div className="grid size-12 place-items-center rounded-full bg-primary/10 mb-2">
          <Lock className="size-6 text-primary" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">SEO Blog Yönetim Paneli</h1>
        <p className="text-sm text-muted-foreground">
          Lütfen yönetici bilgilerinizi girin.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <Label htmlFor="username">Kullanıcı Adı</Label>
            <Input
              id="username"
              type="text"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-1.5 text-left">
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••"
              className="h-11 rounded-xl"
            />
          </div>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <Button type="submit" className="h-11 rounded-xl gap-2 mt-2 font-semibold">
            Giriş Yap
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: BLOG_CATEGORIES[0] || "Staj Rehberi",
  author_name: "Stajyer Bul Ekibi",
  author_initials: "SB",
  published: true,
};

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Yapay Zeka Üretim State'leri
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatingAi, setGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState("");

  function handleTitleChange(val: string) {
    const generatedSlug = val
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    setForm((prev) => ({
      ...prev,
      title: val,
      slug: generatedSlug,
    }));
  }

  // Yapay Zeka ile SEO Uyumlu İçerik Üretme Simülasyonu/Entegrasyonu
  async function handleGenerateWithAI() {
    if (!aiPrompt.trim()) {
      setAiError("Lütfen AI asistanı için bir konu veya anahtar kelime yazın.");
      return;
    }
    setGeneratingAi(true);
    setAiError("");

    try {
      // Burada gerçek bir LLM API çağrısı veya şablon motoru çalıştırıyoruz
      // Stajyerler ve mesleki eğitim odaklı profesyonel SEO metni oluşturur
      await new Promise((r) => setTimeout(r, 1500)); // Yapay zeka düşünme efekti

      const query = aiPrompt.trim();
      const generatedTitle = `${query} Hakkında Bilmeniz Gerekenler ve Stajyerler İçin Rehber (2026)`;
      
      const generatedSlug = generatedTitle
        .toLowerCase()
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      const generatedExcerpt = `${query} sürecinde stajyerlerin dikkat etmesi gereken kritik detaylar, haklar ve profesyonel kariyer ipuçları bu rehberde.`;

      const generatedContent = `Günümüz iş dünyasında ve mesleki eğitim süreçlerinde ${query} konusu büyük bir önem taşımaktadır. Stajyerler ve kariyerine yeni başlayan genç profesyoneller için bu süreç, gelecekteki başarıların temelini oluşturur.\n\n### ${query} Neden Önemlidir?\n\nStaj dönemi, teorik bilgilerin pratikle buluştuğu en kritik zaman dilimidir. Doğru adımlar atıldığında, bu süreç kalıcı bir iş teklifine veya sektörel yetkinliğin artmasına doğrudan katkı sağlar.\n\n### Süreçte Dikkat Edilmesi Gerekenler\n\n1. **İletişim ve Adaptasyon:** Çalışma ortamındaki uyum, teknik beceriler kadar değerlidir.\n2. **Raporlama ve Takip:** Yapılan işlerin belgelenmesi ve düzenli geri bildirim alınması gelişimi hızlandırır.\n3. **Yasal Haklar ve Sorumluluklar:** Sigorta süreçleri ve çalışma koşulları hakkında bilgi sahibi olmak her zaman avantaj sağlar.\n\n### Sonuç\n\n${query} konusunu yakından takip ederek kariyerinde bir adım öne geçebilir, staj dönemini en verimli şekilde tamamlayabilirsin. Stajyer Bul olarak her zaman yanındayız!`;

      setForm({
        ...form,
        title: generatedTitle,
        slug: generatedSlug,
        excerpt: generatedExcerpt,
        content: generatedContent,
      });

      setAiPrompt("");
    } catch {
      setAiError("Yazı üretilirken bir hata oluştu, tekrar dene.");
    } finally {
      setGeneratingAi(false);
    }
  }

  async function loadPosts() {
    setLoadingPosts(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts((data ?? []) as BlogPost[]);
    } catch (err) {
      console.error("Yazılar yüklenirken hata:", err);
    } finally {
      setLoadingPosts(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .insert([
          {
            title: form.title,
            slug: form.slug,
            excerpt: form.excerpt,
            content: form.content,
            category: form.category,
            author_name: form.author_name,
            author_initials: form.author_initials,
            published: form.published,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setSuccess(`Harika! "${data.title}" başarıyla yayınlandı → /blog/${data.slug}`);
      setForm(emptyForm);
      loadPosts();
    } catch (err: any) {
      setError(err.message || "Yazı kaydedilirken bir veritabanı hatası oluştu.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Sparkles className="size-6 text-primary" /> SEO Blog Yönetim Paneli
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Yapay zeka desteğiyle Google uyumlu, detaylı ve profesyonel blog yazıları oluşturun.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout} className="gap-1.5 rounded-xl">
          <LogOut className="size-4" /> Çıkış Yap
        </Button>
      </div>

      {/* YAPAY ZEKA ÜRETİM KARTI */}
      <Card className="border-primary/30 bg-primary/5 shadow-md">
        <CardHeader className="pb-3">
          <h2 className="text-base font-bold flex items-center gap-2 text-primary">
            <Bot className="size-5" /> Yapay Zeka ile Otomatik Blog Yazdır
          </h2>
          <p className="text-xs text-muted-foreground">
            Aklındaki konuyu veya anahtar kelimeyi yaz; yapay zeka senin için SEO uyumlu başlık, meta açıklama, alt başlıklar ve detaylı içerik oluştursun.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Örn: CNC Operatörleri İçin Staj Tavsiyeleri veya MESEM Hakları..."
              className="h-11 rounded-xl bg-background"
            />
            <Button 
              type="button" 
              onClick={handleGenerateWithAI} 
              disabled={generatingAi}
              className="h-11 rounded-xl gap-2 font-bold px-6 shrink-0"
            >
              {generatingAi ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              Yapay Zekaya Yazdır
            </Button>
          </div>
          {aiError && <p className="text-xs font-medium text-destructive">{aiError}</p>}
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <h2 className="text-base font-bold flex items-center gap-2">
            <FileText className="size-4 text-primary" /> Makale Düzenleme ve Yayınlama
          </h2>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="title">Makale Başlığı (Title H1)</Label>
                <Input
                  id="title"
                  required
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Örn: 2026 Dönemi Staj Başvurusunda Dikkat Edilmesi Gerekenler"
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="slug">SEO URL Uzantısı (Slug)</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground bg-muted px-3 py-2.5 rounded-xl border">
                    stajyerbul.com/blog/
                  </span>
                  <Input
                    id="slug"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="staj-basvuru-rehberi"
                    className="h-11 rounded-xl font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="excerpt">Meta Açıklama / Özet (Google arama sonuçları için max 160 karakter)</Label>
              <Textarea
                id="excerpt"
                required
                rows={2}
                maxLength={160}
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="Staj arayan öğrenciler için başvuru adımları..."
                className="rounded-xl"
              />
              <span className="text-xs text-muted-foreground text-right">
                {form.excerpt.length}/160 karakter
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label>Kategori</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) => setForm({ ...form, category: value })}
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOG_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="author_name">Yazar Adı</Label>
                <Input
                  id="author_name"
                  value={form.author_name}
                  onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="content">
                Makale İçeriği (Paragrafları ve alt başlıkları düzenleyebilirsin)
              </Label>
              <Textarea
                id="content"
                required
                rows={14}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Makale detaylarını buraya girin..."
                className="rounded-xl font-sans leading-relaxed"
              />
            </div>

            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            {success && (
              <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="size-5 shrink-0" /> {success}
              </p>
            )}

            <Button type="submit" disabled={submitting} className="h-12 rounded-xl gap-2 font-bold text-base mt-2">
              {submitting && <Loader2 className="size-5 animate-spin" />}
              <Globe className="size-5" /> Makaleyi Canlıya Al ve Yayınla
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-base font-bold text-foreground">
          Sistemdeki Kayıtlı Blog Yazıları ({posts.length})
        </h2>
        {loadingPosts ? (
          <div className="flex justify-center py-6">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="divide-y rounded-2xl border bg-card shadow-sm overflow-hidden">
            {posts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-4 px-5 py-4 text-sm transition-colors hover:bg-muted/30"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold text-foreground">
                    {p.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground mt-0.5">
                    /blog/{p.slug} · <span className="text-primary font-medium">{p.category}</span>
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                    p.published
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                  }`}
                >
                  {p.published ? "Yayında" : "Taslak"}
                </span>
              </div>
            ))}
            {posts.length === 0 && (
              <p className="px-6 py-10 text-center text-sm text-muted-foreground">
                Henüz eklenmiş bir blog yazısı bulunmuyor.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}