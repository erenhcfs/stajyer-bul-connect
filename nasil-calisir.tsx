import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  UserCheck, 
  FileText, 
  Briefcase, 
  Building2, 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles 
} from "lucide-react";

export const Route = createFileRoute("/nasil-calisir")({
  head: () => ({
    meta: [
      { title: "Nasıl Çalışır? — StajyerBul" },
      { name: "description", content: "Stajyerler ve işletmeler için StajyerBul platformunun çalışma sistemi rehberi." },
      { property: "og:title", content: "Nasıl Çalışır? — StajyerBul" },
      { property: "og:description", content: "Stajyerler ve işletmeler için StajyerBul platformunun çalışma sistemi rehberi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NasilCalisirPage,
});

function NasilCalisirPage() {
  const [activeTab, setActiveTab] = useState<"stajyer" | "isveren">("stajyer");

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 lg:py-24 border-b border-border bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="container-x max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
              <Sparkles className="size-3.5" /> Adım Adım StajyerBul Rehberi
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Staj Sürecini <span className="text-primary">Kolaylaştırıyoruz</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              MESEM, meslek liseleri ve üniversite öğrencileri ile nitelikli işletmeleri en hızlı ve doğru şekilde buluşturuyoruz.
            </p>

            {/* Tab Switcher */}
            <div className="flex justify-center pt-6">
              <div className="inline-flex items-center gap-2 bg-muted p-1.5 rounded-2xl border border-border shadow-sm">
                <button
                  type="button"
                  onClick={() => setActiveTab("stajyer")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition ${
                    activeTab === "stajyer"
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <GraduationCap className="size-4" /> Stajyerler İçin
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("isveren")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition ${
                    activeTab === "isveren"
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Building2 className="size-4" /> İşletmeler İçin
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 lg:py-20 container-x max-w-5xl mx-auto">
          {activeTab === "stajyer" ? (
            <div className="space-y-12 animate-in fade-in duration-300">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold">Öğrenciler ve Stajyerler Nasıl Başlar?</h2>
                <p className="text-muted-foreground text-sm">Hayalindeki staj yerini bulmak ve işletmelerden teklif almak sadece 3 adım sürer.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Adım 1 */}
                <div className="relative rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                  <div className="absolute -top-4 left-6 size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow">
                    1
                  </div>
                  <div className="pt-2">
                    <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <UserCheck className="size-6" />
                    </div>
                    <h3 className="text-lg font-bold">Profilini Oluştur</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Kayıt ol ve profil sayfasından okulunu, sınıfını, bölümünü ve bildiğin yetenekleri (örn. CNC, Yazılım, AutoCAD) eksiksiz doldur.
                    </p>
                  </div>
                </div>

                {/* Adım 2 */}
                <div className="relative rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                  <div className="absolute -top-4 left-6 size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow">
                    2
                  </div>
                  <div className="pt-2">
                    <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <Briefcase className="size-6" />
                    </div>
                    <h3 className="text-lg font-bold">Aktif Staj Durumunu Aç</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Profilindeki <span className="font-semibold text-foreground">"Aktif Staj Arıyorum"</span> seçeneğini aktif et. Böylece işletmeler seni "Stajyer Bul" sayfasında görebilsin.
                    </p>
                  </div>
                </div>

                {/* Adım 3 */}
                <div className="relative rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                  <div className="absolute -top-4 left-6 size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow">
                    3
                  </div>
                  <div className="pt-2">
                    <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <CheckCircle2 className="size-6" />
                    </div>
                    <h3 className="text-lg font-bold">İlanlara Başvur & Teklif Al</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      İstersen açık staj ilanlarını inceleyip anında başvuru yap, istersen işletmelerin doğrudan sana ulaşmasını sağla!
                    </p>
                  </div>
                </div>
              </div>

              {/* İpucu Kutusu */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-bold text-base flex items-center justify-center sm:justify-start gap-2">
                    <Sparkles className="size-5 text-primary" /> Profilini Güçlendir
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Fotoğraf eklemek ve yeteneklerini detaylı yazmak işverenlerin sana dönüş yapma şansını %80 artırır.
                  </p>
                </div>
                <a
                  href="/profil"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition shrink-0"
                >
                  Hemen Profilini Düzenle <ArrowRight className="size-4" />
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in duration-300">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold">İşletmeler ve Şirketler İçin Sistem</h2>
                <p className="text-muted-foreground text-sm">İşletmenizin ihtiyacı olan nitelikli stajyeri bulmak artık çok kolay.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Adım 1 */}
                <div className="relative rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                  <div className="absolute -top-4 left-6 size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow">
                    1
                  </div>
                  <div className="pt-2">
                    <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <Building2 className="size-6" />
                    </div>
                    <h3 className="text-lg font-bold">Şirket Profilini Tanıt</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      İşveren modu ile kayıt ol, şirket adını, sektörünü ve iletişim bilgilerini profiline ekleyerek kurumsal kimliğini oluştur.
                    </p>
                  </div>
                </div>

                {/* Adım 2 */}
                <div className="relative rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                  <div className="absolute -top-4 left-6 size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow">
                    2
                  </div>
                  <div className="pt-2">
                    <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <Search className="size-6" />
                    </div>
                    <h3 className="text-lg font-bold">Adayları Filtrele</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      <span className="font-semibold text-foreground">"Stajyer Bul"</span> sayfasını kullanarak şehir, bölüm (CNC, Yazılım, Elektrik vb.) ve yeteneklere göre aktif staj arayan öğrencileri hemen görüntüle.
                    </p>
                  </div>
                </div>

                {/* Adım 3 */}
                <div className="relative rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                  <div className="absolute -top-4 left-6 size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow">
                    3
                  </div>
                  <div className="pt-2">
                    <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <ShieldCheck className="size-6" />
                    </div>
                    <h3 className="text-lg font-bold">İletişime Geç</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Uygun gördüğün adayların iletişim numaraları üzerinden doğrudan görüşme başlat ve işletmene en uygun stajyeri kadrona kat.
                    </p>
                  </div>
                </div>
              </div>

              {/* İpucu Kutusu */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-bold text-base flex items-center justify-center sm:justify-start gap-2">
                    <FileText className="size-5 text-primary" /> İlan Yayınlayın
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Dilerseniz işletme panelinden staj ilanları oluşturarak adayların doğrudan size başvurmasını sağlayabilirsiniz.
                  </p>
                </div>
                <a
                  href="/isletme-paneli"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition shrink-0"
                >
                  İşletme Paneline Git <ArrowRight className="size-4" />
                </a>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}