import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Lock,
  LogOut,
  Loader2,
  CheckCircle2,
  Globe,
  Sparkles,
  FileText,
  Bot,
  Image as ImageIcon,
  Wand2,
} from "lucide-react";
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
import { adminRequest } from "@/lib/admin-client";
import { BLOG_CATEGORIES, slugify, type BlogPost } from "@/lib/blog-helpers";

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
    adminRequest("admin-check")
      .then((data) => setAuthed(data.authenticated))
      .catch(() => setAuthed(false))
      .finally(() => setLoadingCheck(false));
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
            <AdminPanel
              onLogout={async () => {
                try {
                  await adminRequest("admin-logout", {});
                  setAuthed(false);
                } catch (error) {
                  alert(error instanceof Error ? error.message : "Çıkış yapılamadı.");
                }
              }}
            />
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
  const [busy, setBusy] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await adminRequest("admin-login", { password });
      onSuccess();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Giriş yapılamadı.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="mx-auto max-w-md shadow-lg border-border/85">
      <CardHeader className="items-center text-center pb-2">
        <div className="grid size-12 place-items-center rounded-full bg-primary/10 mb-2">
          <Lock className="size-6 text-primary" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">SEO Blog Yönetim Paneli</h1>
        <p className="text-sm text-muted-foreground">Lütfen yönetici bilgilerinizi girin.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <Label htmlFor="password">Şifre</Label>
            <Input
              autoFocus
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              value={password}
              autoComplete="current-password"
              className="h-11 rounded-xl"
            />
          </div>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <Button
            className="h-11 rounded-xl gap-2 mt-2 font-semibold"
            type="submit"
            disabled={busy}
          >
            {busy ? "Giriş yapılıyor..." : "Giriş Yap"}
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
  image_url: "",
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

  const [aiPrompt, setAiPrompt] = useState("");
  const [generatingAi, setGeneratingAi] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
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

  async function handleGenerateAdvancedGemini() {
    if (!aiPrompt.trim()) {
      setAiError("Lütfen yapay zeka için bir konu yazın.");
      return;
    }

    setGeneratingAi(true);
    setAiError("");
    try {
      const { article } = await adminRequest("blog-generate", { prompt: aiPrompt });
      setForm((prev) => ({
        ...prev,
        title: article.title,
        excerpt: article.excerpt.slice(0, 160),
        content: article.content,
        slug: slugify(article.title),
      }));
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "Makale üretilemedi.");
    } finally {
      setGeneratingAi(false);
    }
  }

  async function loadPosts() {
    setLoadingPosts(true);
    try {
      const { posts } = await adminRequest("blog-posts");
      setPosts(posts ?? []);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Yazılar yüklenemedi.");
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
      const insertData: Omit<BlogPost, "id" | "created_at"> = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        category: form.category,
        author_name: form.author_name,
        author_initials: form.author_initials,
        published: form.published,
      };

      if (form.image_url.trim()) {
        insertData.image_url = form.image_url.trim();
      }

      const { post: data } = await adminRequest("blog-posts", insertData);

      setSuccess(
        `Yazı başarıyla ${data.published ? "yayınlandı" : "taslak olarak kaydedildi"}: ${data.title}`,
      );
      setForm(emptyForm);
      loadPosts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Kayıt sırasında hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Sparkles className="size-6 text-primary" /> Blog Yönetim Paneli
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Makalenizi yazın veya yapay zekayla taslak oluşturup kontrol ederek yayınlayın.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout} className="gap-1.5 rounded-xl">
          <LogOut className="size-4" /> Çıkış Yap
        </Button>
      </div>

      <Card className="border-primary/40 bg-primary/5 shadow-md">
        <CardHeader className="pb-3">
          <h2 className="text-base font-bold flex items-center gap-2 text-primary">
            <Bot className="size-5" /> Yapay Zeka Asistanı
          </h2>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Örn: 2027 MESEM maaşları ne kadar olacak..."
            rows={3}
            className="rounded-xl bg-background"
          />
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleGenerateAdvancedGemini}
              disabled={generatingAi || generatingImage}
              className="h-11 rounded-xl gap-2 font-bold px-6"
            >
              {generatingAi || generatingImage ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Wand2 className="size-4" />
              )}
              {generatingAi ? "Yazılıyor..." : "AI ile Makale Üret"}
            </Button>
          </div>
          {aiError && <p className="text-xs font-medium text-destructive">{aiError}</p>}
        </CardContent>
      </Card>

      <section aria-label="Mevcut yazılar">
        <h2 className="font-bold mb-3">Mevcut yazılar</h2>
        {loadingPosts ? (
          <p>Yükleniyor...</p>
        ) : posts.length ? (
          posts.map((post) => (
            <p key={post.id}>
              {post.title} — {post.published ? "Yayında" : "Taslak"}
            </p>
          ))
        ) : (
          <p>Henüz yazı yok.</p>
        )}
      </section>
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <h2 className="text-base font-bold flex items-center gap-2">
            <FileText className="size-4 text-primary" /> Makale Formu
          </h2>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Başlık (H1)</Label>
              <Input
                id="title"
                required
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Makale başlığı..."
                className="h-11 rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="h-11 rounded-xl font-mono text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="image_url">Kapak Görseli URL</Label>
              <Input
                id="image_url"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                className="h-11 rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="excerpt">Meta Özet (max 160 karakter)</Label>
              <Textarea
                id="excerpt"
                required
                rows={2}
                maxLength={160}
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="content">Makale İçeriği (Markdown)</Label>
              <Textarea
                id="content"
                required
                rows={12}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="rounded-xl font-sans"
              />
            </div>

            <label className="flex gap-2">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />{" "}
              Yayınla (kapalıysa taslak kaydedilir)
            </label>
            <label>
              Kategori
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {BLOG_CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            {error && (
              <p role="alert" className="text-sm font-medium text-destructive">
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm font-semibold text-emerald-600 bg-emerald-500/10 p-3 rounded-xl">
                {success}
              </p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="h-12 rounded-xl gap-2 font-bold text-base"
            >
              {submitting && <Loader2 className="size-5 animate-spin" />}
              <Globe className="size-5" /> Makaleyi Yayınla
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
