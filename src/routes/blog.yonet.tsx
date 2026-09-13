import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Lock, LogOut, Loader2, CheckCircle2 } from "lucide-react";
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

export const Route = createFileRoute("/blog/yonet")({
  component: BlogAdminPage,
  // Bu sayfayı arama motorlarından tamamen gizle.
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
});

function BlogAdminPage() {
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
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-x max-w-3xl py-14">
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
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Giriş başarısız.");
        return;
      }
      onSuccess();
    } catch {
      setError("Bir şeyler ters gitti, tekrar dene.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="items-center text-center">
        <div className="grid size-11 place-items-center rounded-full bg-primary/10">
          <Lock className="size-5 text-primary" />
        </div>
        <h1 className="mt-2 text-lg font-bold">Blog Yönetimi</h1>
        <p className="text-sm text-muted-foreground">
          Devam etmek için admin şifresini gir.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="gap-2">
            {loading && <Loader2 className="size-4 animate-spin" />}
            Giriş Yap
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  category: BLOG_CATEGORIES[0],
  author_name: "Stajyer Bul Ekibi",
  author_initials: "SB",
};

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

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
      setSuccess(`"${data.post.title}" yayınlandı → /blog/${data.post.slug}`);
      setForm(emptyForm);
      loadPosts();
    } catch {
      setError("Bir şeyler ters gitti, tekrar dene.");
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
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Yeni Blog Yazısı</h1>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5">
          <LogOut className="size-4" /> Çıkış
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Başlık</Label>
              <Input
                id="title"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="excerpt">Özet (kart ve meta description için)</Label>
              <Textarea
                id="excerpt"
                required
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Kategori</Label>
              <Select
                value={form.category}
                onValueChange={(value) => setForm({ ...form, category: value })}
              >
                <SelectTrigger>
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
              <Label htmlFor="content">
                İçerik (paragrafları boş satırla ayır)
              </Label>
              <Textarea
                id="content"
                required
                rows={12}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="author_name">Yazar adı</Label>
                <Input
                  id="author_name"
                  value={form.author_name}
                  onChange={(e) =>
                    setForm({ ...form, author_name: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="author_initials">Yazar baş harfleri</Label>
                <Input
                  id="author_initials"
                  maxLength={2}
                  value={form.author_initials}
                  onChange={(e) =>
                    setForm({ ...form, author_initials: e.target.value })
                  }
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && (
              <p className="flex items-center gap-1.5 text-sm text-emerald-600">
                <CheckCircle2 className="size-4" /> {success}
              </p>
            )}

            <Button type="submit" disabled={submitting} className="w-fit gap-2">
              {submitting && <Loader2 className="size-4 animate-spin" />}
              Yayınla
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
          Yayınlanan yazılar ({posts.length})
        </h2>
        {loadingPosts ? (
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        ) : (
          <div className="divide-y rounded-lg border">
            {posts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">
                    {p.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    /blog/{p.slug}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    p.published
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-amber-500/10 text-amber-600"
                  }`}
                >
                  {p.published ? "Yayında" : "Taslak"}
                </span>
              </div>
            ))}
            {posts.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                Henüz yazı yok.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
