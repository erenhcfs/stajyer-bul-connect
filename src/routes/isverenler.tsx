import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Building2, FileSearch, ShieldCheck, Users } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/isverenler")({
  head: () => ({
    links: [{ rel: "canonical", href: "https://stajyerbul.com.tr/isverenler" }],
    meta: [
      { title: "İşverenler İçin Stajyer Bulma ve İlan Verme | StajyerBul" },
      {
        name: "description",
        content:
          "İşletme profilinizi oluşturun, staj ilanı yayınlayın ve uygun adayları güvenli biçimde değerlendirin.",
      },
    ],
  }),
  component: EmployersPage,
});

const steps = [
  {
    icon: Building2,
    title: "İşletme profilini oluşturun",
    text: "Şirket bilgilerinizi ve aradığınız alanları ekleyin. Profil başvuruları güven ve içerik kalitesi için yönetim ekibi tarafından incelenir.",
  },
  {
    icon: FileSearch,
    title: "İlanınızı yayınlayın",
    text: "Pozisyonu, çalışma biçimini, konumu ve adaydan beklediğiniz nitelikleri açıkça yazın. Onaylı işletmeler aktif ilanlarını panelden yönetebilir.",
  },
  {
    icon: Users,
    title: "Uygun adaylarla görüşün",
    text: "Aday havuzunu eğitim alanı, şehir, beceri ve staj dönemine göre filtreleyin. İletişim bilgileri yalnızca yetkili akışlarda paylaşılır.",
  },
];

function EmployersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <section className="border-b bg-gradient-to-b from-primary/10 to-background py-16 sm:py-24">
          <div className="container-x grid items-center gap-10 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                <BadgeCheck className="size-4" /> İşverenler için
              </span>
              <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
                İhtiyacınıza uygun stajyer adayına daha kolay ulaşın
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                StajyerBul, işletmelerin ilan yayınlamasını, adayları karşılaştırmasını ve staj
                sürecini tek panelden takip etmesini sağlar. Açık beklentilerle hazırlanan ilanlar
                öğrencilerin doğru fırsata başvurmasına yardımcı olur.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/kayit"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground"
                >
                  İşletme hesabı oluştur <ArrowRight className="size-4" />
                </Link>
                <Link
                  to="/ilanlar"
                  className="inline-flex items-center rounded-xl border bg-card px-5 py-3 font-semibold"
                >
                  İlanları incele
                </Link>
              </div>
            </div>
            <div className="rounded-3xl border bg-card p-7 shadow-sm">
              <ShieldCheck className="size-10 text-primary" />
              <h2 className="mt-4 text-2xl font-bold">Kontrollü ve şeffaf süreç</h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                İşletme profilleri yayınlanmadan önce incelenir. Adayların özel iletişim bilgileri
                herkese açık değildir. Şüpheli ilanlar ve yanıltıcı içerikler yönetim ekibine
                bildirilebilir.
              </p>
              <ul className="mt-5 space-y-3 text-sm">
                <li className="flex gap-2">
                  <BadgeCheck className="size-5 shrink-0 text-emerald-600" /> Onaylı işletme profili
                </li>
                <li className="flex gap-2">
                  <BadgeCheck className="size-5 shrink-0 text-emerald-600" /> Açık pozisyon ve
                  çalışma biçimi
                </li>
                <li className="flex gap-2">
                  <BadgeCheck className="size-5 shrink-0 text-emerald-600" /> Başvuru ve teklif
                  takibi
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="container-x py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold">Nasıl çalışır?</h2>
            <p className="mt-3 text-muted-foreground">
              Hesap oluşturduktan sonra işletme türünü seçin ve doğrulanabilir şirket bilgilerinizi
              girin. İnceleme tamamlandığında ilan ve aday araçları açılır.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-6" />
                  </span>
                  <span className="text-sm font-bold text-muted-foreground">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y bg-muted/30 py-16">
          <div className="container-x grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-extrabold">İyi bir staj ilanında neler olmalı?</h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                Pozisyonun günlük sorumluluklarını, çalışma günlerini, konumu, bölüm beklentisini ve
                sunulan öğrenme imkânlarını somut biçimde belirtin. Ücret, yemek veya ulaşım desteği
                varsa açıkça yazın. Gerçekçi ve ayrıntılı ilanlar daha uygun başvuru alır.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold">Aday verileri nasıl korunur?</h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                Aday kartları yalnızca mesleki ve eğitim bilgilerini gösterir. İletişim verileri
                herkese açık bir rehber olarak sunulmaz. Verilerin işlenmesi ve kullanıcı hakları
                hakkında ayrıntılar için gizlilik metnimizi inceleyebilirsiniz.
              </p>
              <Link
                to="/gizlilik"
                className="mt-4 inline-flex font-semibold text-primary hover:underline"
              >
                Gizlilik ve KVKK bilgisini oku
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
