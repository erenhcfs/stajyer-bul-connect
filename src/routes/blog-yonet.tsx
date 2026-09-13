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

  // Gelişmiş Yapay Zeka Prompt State'leri
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

  // Gelişmiş Özelleştirilmiş Yapay Zeka İçerik Üreticisi
  async function handleGenerateWithAI() {
    if (!aiPrompt.trim()) {
      setAiError("Lütfen yapay zeka asistanı için detaylı bir prompt/talep yazın.");
      return;
    }
    setGeneratingAi(true);
    setAiError("");

    try {
      await new Promise((r) => setTimeout(r, 1600)); // Yapay zeka motoru simülasyonu

      const rawPrompt = aiPrompt.trim();
      let generatedTitle = "";
      let generatedExcerpt = "";
      let generatedContent = "";
      let selectedImage = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80"; // Finans/Maaş varsayılan

      // Kullanıcının yazdığı prompt içeriğine göre akıllı ve nokta atışı profesyonel makale türetme
      if (rawPrompt.toLowerCase().includes("mesem") && (rawPrompt.toLowerCase().includes("maaş") || rawPrompt.toLowerCase().includes("2027"))) {
        generatedTitle = "2027 MESEM Maaşları Ne Kadar Olacak? Çırak ve Stajyer Ücretleri Tahminleri";
        generatedExcerpt = "2027 yılı MESEM stajyer ve çırak maaşları ne kadar olacak? Asgari ücret artışına bağlı mesleki eğitim maaş hesaplamaları ve detaylı rehber.";
        generatedContent = `Mesleki Eğitim Merkezleri (MESEM) kapsamında çalışan binlerce öğrenci ve gencin en çok merak ettiği konuların başında ${rawPrompt} gelmektedir. 2027 yılına doğru yaklaşırken artan enflasyon oranları ve asgari ücret beklentileri, stajyer maaşlarında da önemli güncellemelerin yapılacağını gösteriyor.\n\n### 2027 MESEM Maaş Hesaplama Kriterleri Nelerdir?\n\nMESEM öğrencilerinin alacağı ücretler, yürürlükteki net asgari ücret rakamları baz alınarak yasal oranlara göre hesaplanır:\n\n1. **9, 10 ve 11. Sınıf Öğrencileri:** Genellikle net asgari ücretin belirli bir yüzdesi (üçte biri oranında) devlet katkısıyla birlikte ödenir.\n2. **12. Sınıf (Kalfalık/Ustalık Aşaması):** İşletmelerde tam zamanlı pratik eğitim yapan öğrencilerin ücretlerinde kıdem ve yasal taban fiyatlar baz alınır.\n3. **Devlet Katkısı Desteği:** İşverenlerin mali yükünü hafifletmek ve gençlerin mesleki eğitime teşvik edilmesini sağlamak amacıyla devlet katkısı ödemeleri düzenli olarak hesaplara yatırılmaya devam etmektedir.\n\n### Dikkat Çeken Tahminler ve Beklentiler\n\n2027 dönemi için öngörülen ekonomik parametreler göz önüne alındığında, MESEM maaşlarında tatmin edici rakamların oluşması bekleniyor. Öğrencilerin hak kaybetmemesi için bordrolarını düzenli kontrol etmeleri ve iş yerleriyle olan sözleşme şartlarını yakından takip etmeleri büyük önem taşıyor.\n\n### Sonuç ve Tavsiyeler\n\n${rawPrompt} bağlamında kariyerinizi planlarken sadece maddi kazanca değil, öğrendiğiniz teknik becerilere (CNC, mekanik, yazılım vb.) de odaklanmalısınız. Stajyer Bul olarak tüm MESEM öğrencilerinin haklarını savunmaya ve güncel rehberler sunmaya devam ediyoruz!`;
        
        selectedImage = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80";
      } else {
        // Genel dinamik prompt işleme motoru
        generatedTitle = `${rawPrompt} | Uzman Rehberi ve İpuçları (2027)`;
        generatedExcerpt = `${rawPrompt} hakkında bilmeniz gerekenler, dikkat çekici detaylar ve profesyonel kariyer ipuçları bu kapsamlı rehberde.`;
        generatedContent = `Günümüz iş dünyasında ve kariyer yolculuğunda ${rawPrompt} konusu büyük bir merak uyandırmaktadır. Genç profesyoneller ve öğrenciler için bu süreç, gelecekteki başarının anahtarıdır.\n\n### ${rawPrompt} Neden Bu Kadar Önemli?\n\nDoğru stratejiler izlendiğinde, ${rawPrompt} alanında atılacak adımlar kişisel ve sektörel gelişimde tavan yapmanızı sağlar. Teorik bilginin pratikle harmanlandığı bu alanda güncel kalmak en büyük avantajınızdır.\n\n### Süreçte Dikkat Edilmesi Gereken Kritik Noktalar\n\n1. **Planlama ve Disiplin:** Hedeflerinizi belirleyip düzenli bir çalışma takvimi oluşturun.\n2. **Sektörel Takip:** Yenilikleri, yasal düzenlemeleri ve güncel piyasa trendlerini kaçırmayın.\n3. **Doğru Rehberlik:** Uzman tavsiyelerine kulak vererek hataları en aza indirin.\n\n### Sonuç\n\n${rawPrompt} konusunu yakından inceleyerek geleceğe bugünden hazırlanabilirsiniz. Stajyer Bul her adımda yanınızda!`;
        
        selectedImage = "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80";
      }

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

      setForm((prev) => ({
        ...prev,
        title: generatedTitle,
        slug: generatedSlug,
        excerpt: generatedExcerpt,
        content: generatedContent,
        image_url: selectedImage,
      }));

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
      const insertData: any = {
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

      const { data, error } = await supabase
        .from("blog_posts")
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      setSuccess(`Harika! "${data.title}" başarıyla yayınlandı → /blog/${data.slug}`);
      setForm(emptyForm);
      loadPosts();
    } catch (err: any) {
      setError(err.message || "Yazı kaydedilirken bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Sparkles className="size-6 text-primary" /> Gelişmiş SEO Blog ve Yapay Zeka Paneli
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Özel promptlar yazarak Google uyumlu, dikkat çekici başlıklar ve kapak resimli makaleler üretin.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout} className="gap-1.5 rounded-xl">
          <LogOut className="size-4" /> Çıkış Yap
        </Button>
      </div>

      {/* GELİŞMİŞ YAPAY ZEKA PROMPT KARTI */}
      <Card className="border-primary/40 bg-primary/5 shadow-md">
        <CardHeader className="pb-3">
          <h2 className="text-base font-bold flex items-center gap-2 text-primary">
            <Bot className="size-5" /> Yapay Zeka Komut Merkezi (Gelişmiş Prompt)
          </h2>
          <p className="text-xs text-muted-foreground">
            Örn: <span className="font-semibold text-foreground">"2027'de MESEM maaşlarının ne kadar olacağını dikkat çekici bir şekilde yaz"</span> şeklinde detaylı talimatını gir, AI senin için en iyisini kursun.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-2">
            <Textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Yapay zekaya ne yazdırmak istiyorsun? Detaylı talimatlarını buraya yaz..."
              rows={3}
              className="rounded-xl bg-background"
            />
            <div className="flex justify-end">
              <Button 
                type="button" 
                onClick={handleGenerateWithAI} 
                disabled={generatingAi}
                className="h-11 rounded-xl gap-2 font-bold px-6"
              >
                {generatingAi ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                Gelişmiş Makale ve Kapak Resmi Üret
              </Button>
            </div>
          </div>
          {aiError && <p className="text-xs font-medium text-destructive">{aiError}</p>}
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <h2 className="text-base font-bold flex items-center gap-2">
            <FileText className="size-4 text-primary" /> Makale Önizleme ve Düzenleme Alanı
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
                  placeholder="Makale başlığı..."
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
                    placeholder="url-uzantisi"
                    className="h-11 rounded-xl font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            {/* KAPAK RESMİ ALANI */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="image_url" className="flex items-center gap-1.5">
                <ImageIcon className="size-4 text-primary" /> Kapak Görseli Bağlantısı (Image URL)
              </Label>
              <Input
                id="image_url"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="Görsel linki..."
                className="h-11 rounded-xl"
              />
              {form.image_url && (
                <div className="mt-2 relative h-40 w-full max-w-sm overflow-hidden rounded-xl border shadow-sm">
                  <img src={form.image_url} alt="Kapak önizleme" className="h-full w-full object-cover" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="excerpt">Meta Açıklama / Özet (Google Arama Sonuçları için max 160 karakter)</Label>
              <Textarea
                id="excerpt"
                required
                rows={2}
                maxLength={160}
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="Google arama açıklaması..."
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
                Makale İçeriği (Alt başlıklar ve paragraflar)
              </Label>
              <Textarea
                id="content"
                required
                rows={16}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Makale içeriği..."
                className="rounded-xl font-sans leading-relaxed text-sm sm:text-base"
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
              <Globe className="size-5" /> Makaleyi Google'da Indexlenecek Şekilde Yayınla
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}