import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Sparkles, HeartHandshake, Rocket, Code2, Mail, ExternalLink, X, Copy, Check } from "lucide-react";

export const Route = createFileRoute("/hakkimizda")({
  head: () => ({
    meta: [
      { title: "Hakkımızda — StajyerBul" },
      { name: "description", content: "StajyerBul projesi hakkında hikayemiz, geliştirilme aşamamız ve destek arayışımız." },
    ],
  }),
  component: HakkimizdaPage,
});

function HakkimizdaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const email = "erenayaz6941@gmail.com";
  const startupMarketUrl = "https://startupmarket.co/stajyer-bul-hizli-ve-kolay-staj-eslestirme-platformu";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      
      <main className="flex-1 container-x py-12 max-w-4xl mx-auto space-y-12">
        
        {/* Başlık Bölümü */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20 shadow-sm animate-pulse">
            <Sparkles className="size-4" /> Vizyon ve Gelişim Süreci
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            StajyerBul Hikayesi ve <span className="text-amber-500">Gelecek Hedefleri</span>
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            MESEM, meslek lisesi ve üniversite öğrencilerinin iş dünyasına ilk adımlarını kolaylaştırmak için yola çıkan yenilikçi bir girişim platformuyuz.
          </p>
        </div>

        {/* Bilgi Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Geliştirilme Aşaması */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 text-primary">
              <Code2 className="size-24" />
            </div>
            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Rocket className="size-6" />
            </div>
            <h2 className="text-xl font-bold">Henüz Geliştirilme Aşamasındayız</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              StajyerBul şu anda aktif olarak geliştirilmekte olan bir prototip ve büyüme aşamasındaki bir projedir. Öğrencilerin işletmelerle en doğru eşleşmeyi yapabilmesi için yeni yapay zeka ve filtreleme özelliklerini her geçen gün sisteme ekliyoruz. Geri bildirimleriniz bizim için çok değerli!
            </p>
          </div>

          {/* Destek Arayışı */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8 shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 text-amber-500">
              <Sparkles className="size-24" />
            </div>
            <div className="size-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <HeartHandshake className="size-6" />
            </div>
            <h2 className="text-xl font-bold text-amber-600 dark:text-amber-400">Girişimimize Destek Arıyoruz</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bu vizyonu büyütecek, genç istihdamına katkı sağlayacak yatırımcılar, mentorlar ve teknoloji ortakları arıyoruz. Projemize katkı sunmak, ortak olmak veya destek vermek isterseniz Startup Market üzerinden inceleyip bizimle iletişime geçebilirsiniz.
            </p>
          </div>

        </div>

        {/* İletişim / Destek Çağrısı */}
        <div className="rounded-2xl border border-border bg-muted/40 p-8 text-center space-y-4">
          <h3 className="text-lg font-bold">Bize Katılın veya Destek Olun</h3>
          <p className="text-xs text-muted-foreground max-w-xl mx-auto">
            Projenin gelişim sürecini takip etmek, işbirliği yapmak veya destek olmak için bizimle iletişime geçin.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-slate-950 shadow hover:bg-amber-400 transition"
            >
              <Mail className="size-4" /> Bize Ulaşın / Destek Ol
            </button>
            <a
              href={startupMarketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-bold shadow-sm hover:bg-muted transition"
            >
              <ExternalLink className="size-4 text-amber-500" /> Startup Market Detayları
            </a>
          </div>
        </div>

      </main>

      {/* İletişim & Destek Popup (Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 md:p-8 shadow-2xl space-y-6">
            
            {/* Kapat Butonu */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
              aria-label="Kapat"
            >
              <X className="size-5" />
            </button>

            <div className="space-y-2 text-center">
              <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-amber-500/10 text-amber-500 mb-2">
                <HeartHandshake className="size-6" />
              </div>
              <h3 className="text-2xl font-bold">İletişim ve Girişim Detayları</h3>
              <p className="text-xs text-muted-foreground">
                StajyerBul projesine destek olmak, yatırım yapmak veya işbirliği kurmak için aşağıdaki kanalları kullanabilirsiniz.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* E-posta Kartı */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">E-Posta Adresi</span>
                  <p className="text-sm font-bold text-foreground select-all">{email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-input bg-card text-xs font-medium hover:bg-muted transition"
                    title="Kopyala"
                  >
                    {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
                    {copied ? "Kopyalandı" : "Kopyala"}
                  </button>
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition"
                  >
                    <Mail className="size-4" /> Gönder
                  </a>
                </div>
              </div>

              {/* Startup Market Kartı */}
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Startup Market Profilimiz</span>
                <p className="text-xs text-muted-foreground">
                  Girişimimizin tüm detaylarını, hedeflerini ve aşamalarını Startup Market üzerinden inceleyebilirsiniz:
                </p>
                <div className="pt-1">
                  <a
                    href={startupMarketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline break-all"
                  >
                    <ExternalLink className="size-3.5 shrink-0" />
                    {startupMarketUrl}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-2.5 rounded-xl border border-input bg-card text-sm font-medium hover:bg-muted transition"
              >
                Kapat
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}