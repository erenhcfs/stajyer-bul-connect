import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Lock, LogOut, Loader2, CheckCircle2, Globe, Sparkles, FileText, Trash2 } from "lucide-react";
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
import { BLOG_CATEGORIES, type BlogPost } from "@/lib/blog-helpers";

export const Route = createFileRoute("/blog-yonet")({
  component: BlogYonetimPage,
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
});

function BlogYonetimPage() {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    fetch("/api/admin-check", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setAuthed(Boolean(d.authenticated)))
      .catch(() => setAuthed(false))
      .finally(() => setChecking(false));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container-x max-w-4xl py-12">
          {checking ? (
            <div className="flex justify-center py-20">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : authed ? (
            <AdminPanel onLogout={() => setAuthed(false)} />
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Giriş başarısız. Kullanıcı adı veya şifre hatalı.");
        return;
      }
      onSuccess();
    } catch {
      setError("Bağlantı hatası oluştu, tekrar dene.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-md shadow-lg border-border/80">
      <CardHeader className="items-center text-center pb-2">
        <div className="grid size-12 place-items-center rounded-full bg-primary/10 mb-2">
          <Lock className="size-6 text-primary" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">SEO Blog Yönetim Paneli</h1>
        <p className="text-sm text-muted-foreground">
          Yönetici bilgileri ile giriş yapın.
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
          <Button type="submit" disabled={loading} className="h-11 rounded-xl gap-2 mt-2 font-semibold">
            {loading && <Loader2 className="size-4 animate-spin" />}
            Güvenli Giriş Yap
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

  // Başlığa göre otomatik SEO uyumlu slug oluşturan fonksiyon
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

  async function loadPosts() {
    setLoadingPosts(true);
    try {
      const res = await fetch("/api/blog-posts", { credentials: "include" });
      const data = await res.json();
      setPosts(data.posts ?? []);
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
      const res = await fetch("/api/blog-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Yazı kaydedilemedi.");
        return;
      }
      setSuccess(`Harika! "${data.post.title}" başarıyla yayınlandı → /blog/${data.post.slug}`);
      setForm(emptyForm);
      loadPosts();
    } catch {
      setError("Bağlantı hatası oluştu, tekrar dene.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin-logout", { method: "POST", credentials: "include" });
    onLogout();
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Sparkles className="size-6 text-primary" /> SEO Blog Yönetim Paneli
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Google uyumlu, optimize edilmiş yeni staj ve kariyer yazıları oluşturun.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5 rounded-xl">
          <LogOut className="size-4" /> Çıkış Yap
        </Button>
      </div>

      <Card className="border-border/80 shadow-sm">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <h2 className="text-base font-bold flex items-center gap-2">
            <FileText className="size-4 text-primary" /> Yeni Makale Ekle
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
                placeholder="Staj arayan öğrenciler için başvuru adımları ve mülakat taktikleri..."
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
                Makale İçeriği (Paragrafları boş satır bırakarak ayırın)
              </Label>
              <Textarea
                id="content"
                required
                rows={12}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Makale detaylarını buraya girin..."
                className="rounded-xl font-sans"
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