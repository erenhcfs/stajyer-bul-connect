import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BriefcaseBusiness, ClipboardCheck, FileText, SearchCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const SITE_URL = "https://stajyerbul.com.tr";

export const Route = createFileRoute("/rehber")({
  head: () => ({
    meta: [
      { title: "Staj Başvuru Rehberi | CV, Mülakat ve İlk Gün" },
      {
        name: "description",
        content:
          "Staj arayan öğrenciler için CV hazırlama, doğru ilana başvurma, mülakat ve stajın ilk günü hakkında kapsamlı rehber.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/rehber` }],
  }),
  component: RehberPage,
});

const sections = [
  {
    id: "cv-hazirlama",
    icon: FileText,
    title: "Staj için etkili CV hazırlama",
    paragraphs: [
      "İyi bir staj CV’si kısa, okunabilir ve başvurduğun alanla ilgili olmalıdır. İş deneyimin azsa eğitim bilgilerini, okul projelerini, atölye çalışmalarını, kullandığın programları ve gönüllü çalışmalarını öne çıkar. Her bilgiyi tek sayfaya sıkıştırmak yerine en ilgili bilgileri seç ve mümkünse CV’yi bir veya iki sayfada tut.",
      "Yeteneklerini yalnızca listelemek yerine nerede kullandığını açıkla. Örneğin “AutoCAD biliyorum” yerine “okul projesinde teknik parça çizimleri hazırladım” demek işletmeye daha somut bilgi verir. Yazılım öğrencileri proje bağlantısı, tasarım öğrencileri portfolyo, teknik bölüm öğrencileri ise kullandıkları makine ve ekipmanları ekleyebilir.",
      "Göndermeden önce telefon, e-posta ve şehir bilgilerinin güncel olduğunu kontrol et. Dosyayı ad-soyad-CV biçiminde anlaşılır bir adla kaydet. Yazım hatalarını düzelt ve aynı CV’yi her ilana göndermek yerine başvuracağın pozisyonun gereksinimlerine göre küçük düzenlemeler yap.",
    ],
  },
  {
    id: "dogru-ilan",
    icon: SearchCheck,
    title: "Doğru staj ilanını seçme ve başvurma",
    paragraphs: [
      "İlan başlığından önce açıklamayı ve aranan nitelikleri dikkatle oku. Bölümün, zorunlu staj tarihlerin, ulaşım imkânın ve çalışma biçimiyle uyuşmayan ilanlara gelişigüzel başvurmak zaman kaybettirir. Tam olarak karşılamadığın birkaç madde varsa yine başvurabilirsin; ancak temel bölüm veya şehir şartı uyuşmuyorsa daha uygun seçeneklere yönel.",
      "Kısa ön yazıda kendini tekrar etmek yerine neden o işletmeyi ve alanı seçtiğini anlat. Hangi becerini geliştirmek istediğini ve işletmeye nasıl katkı sağlayabileceğini iki veya üç kısa paragrafta belirt. İnternetten kopyalanmış genel metinler yerine kendi deneyiminden somut bir örnek kullan.",
      "Başvurularını tarih, işletme ve pozisyon bilgisiyle takip et. Aynı ilana tekrar tekrar başvurma. Yanıt gelmediğinde makul bir süre sonra kısa ve nazik bir takip mesajı gönderebilirsin. İşletme senden para, hesap şifresi veya gereksiz kişisel belge isterse işlemi durdurup durumu platforma bildir.",
    ],
  },
  {
    id: "mulakat",
    icon: ClipboardCheck,
    title: "Mülakat ve ilk gün hazırlığı",
    paragraphs: [
      "Mülakattan önce işletmenin faaliyet alanını, konumunu ve ilan açıklamasını yeniden incele. Kendini tanıtırken okulunu, bölümünü, ilgili becerilerini ve stajdan beklentini bir dakika içinde anlatabilecek şekilde hazırlan. Bilmediğin bir konu sorulursa tahmin yürütmek yerine öğrenmeye açık olduğunu ve benzer bir problemi nasıl ele alacağını açıkla.",
      "Çalışma saatleri, görev tanımı, sorumlu kişi, yemek ve ulaşım gibi konuları nazikçe sor. Zorunlu staj evraklarının kim tarafından ve ne zaman hazırlanacağını önceden netleştir. Görüşmeye zamanında katıl, çevrim içiyse kamera ve mikrofonu önceden dene; yüz yüzeyse adresi ve ulaşım süresini kontrol et.",
      "İlk gün yanında gerekli belgeleri ve not alabileceğin bir araç bulundur. İş güvenliği kurallarını dikkatle dinle, anlamadığın işlemi sormadan uygulama ve verilen görevleri not et. Düzenli geri bildirim istemek, yaptığın işleri kayıt altında tutmak ve profesyonel iletişim kurmak stajdan daha fazla yararlanmanı sağlar.",
    ],
  },
];

function RehberPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <header className="border-b border-border bg-muted/30">
          <div className="container-x py-14 text-center sm:py-20">
            <BriefcaseBusiness className="mx-auto size-10 text-primary" />
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Staj Başvuru Rehberi
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              CV hazırlamadan stajın ilk gününe kadar daha bilinçli hareket etmen için uygulanabilir
              öneriler.
            </p>
          </div>
        </header>
        <div className="container-x grid gap-8 py-12 lg:grid-cols-[220px_1fr]">
          <nav
            className="h-fit rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-24"
            aria-label="Rehber içeriği"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Bu rehberde
            </p>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                {section.title}
              </a>
            ))}
          </nav>
          <div className="space-y-8">
            {sections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
              >
                <section.icon className="size-7 text-primary" />
                <h2 className="mt-4 text-2xl font-bold">{section.title}</h2>
                <div className="mt-4 space-y-4 text-[15px] leading-7 text-muted-foreground">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
            <section className="rounded-2xl bg-primary p-7 text-primary-foreground">
              <h2 className="text-2xl font-bold">Hazırsan fırsatları incele</h2>
              <p className="mt-2 text-sm text-primary-foreground/80">
                Profilini tamamla, uygun ilanları filtrele ve başvurunu gönder.
              </p>
              <Link
                to="/ilanlar"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-background px-5 py-3 text-sm font-semibold text-foreground"
              >
                Staj ilanlarına git <ArrowRight className="size-4" />
              </Link>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
