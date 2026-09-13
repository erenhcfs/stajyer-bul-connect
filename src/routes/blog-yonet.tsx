import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Lock, LogOut, Loader2, CheckCircle2, Globe, Sparkles, FileText, Bot, Image as ImageIcon, Wand2 } from "lucide-react";
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

  // Gelişmiş Gemini AI State'leri
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

  // Google Arama Destekli Gelişmiş Gemini SEO Makale Üreticisi
  async function handleGenerateAdvancedGemini() {
    if (!aiPrompt.trim()) {
      setAiError("Lütfen yapay zeka için bir konu veya arama terimi yazın.");
      return;
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setAiError("Gemini API anahtarı (.env dosyasında VITE_GEMINI_API_KEY) bulunamadı!");
      return;
    }

    setGeneratingAi(true);
    setAiError("");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Sen kıdemli bir SEO uzmanı ve içerik yazarısın. "Stajyer Bul" platformu için şu konuda kapsamlı bir araştırma yap ve özgün bir blog yazısı kaleme al: "${aiPrompt}".
                    
                    Yönergelere kesinlikle uy:
                    1. Önce Google arama aracını kullanarak web'deki güncel yazıları, rehberleri ve tahmini rakamları (maaşlar, oranlar vb.) tara, en iyi içeriklerin kalitesinden ilham al.
                    2. Kesinlikle kopyala-yapıştır yapma; bilgileri sentezleyerek tamamen özgün, akıcı, profesyonel ve Google SEO kurallarına (H1, alt başlıklar, maddeler) tam uyumlu bir makale yaz.
                    3. Çıktıyı SADECE ve SADECE şu saf JSON formatında ver (Markdown veya başka hiçbir metin ekleme):
                    {
                      "title": "Google SEO uyumlu, dikkat çekici H1 başlık",
                      "excerpt": "Google arama sonuçları için en fazla 160 karakterlik meta açıklama",
                      "content": "Markdown formatında, ### alt başlıklar, detaylı paragraflar ve listeler içeren eksiksiz makale içeriği"
                    }`
                  }
                ]
              }
            ],
            // Google Arama Grounding: Web'deki mevcut içerikleri tarayıp analiz etmesini sağlar
            tools: [
              {
                googleSearch: {}
              }
            ]
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Gemini API bağlantı hatası oluştu.");
      }

      const data = await response.json();
      const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!textResult) {
        throw new Error("Yapay zekadan içerik alınamadı.");
      }

      const cleanJsonStr = textResult.replace(/```json/g, "").replace(/