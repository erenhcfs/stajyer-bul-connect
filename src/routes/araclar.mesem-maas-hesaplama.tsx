import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Calculator, Info } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const SITE_URL = "https://stajyerbul.com.tr/araclar/mesem-maas-hesaplama";

export const Route = createFileRoute("/araclar/mesem-maas-hesaplama")({
  head: () => ({
    links: [{ rel: "canonical", href: SITE_URL }],
    meta: [
      { title: "MESEM Maaşı Hesaplama Aracı | StajyerBul" },
      {
        name: "description",
        content:
          "Net asgari ücret tutarına göre 9, 10, 11 ve 12. sınıf MESEM ücretini yüzde 30 ve yüzde 50 oranlarıyla hesaplayın.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "MESEM Maaşı Hesaplama Aracı",
          applicationCategory: "EducationalApplication",
          operatingSystem: "Web",
          url: SITE_URL,
          offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
        }),
      },
    ],
  }),
  component: MesemCalculatorPage,
});

const money = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 2,
});

function MesemCalculatorPage() {
  const [wage, setWage] = useState("28075.50");
  const parsed = Number(wage.replace(",", "."));
  const valid = Number.isFinite(parsed) && parsed > 0 && parsed < 1_000_000;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="container-x flex-1 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Calculator className="size-6" />
            </span>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">MESEM Maaşı Hesaplama</h1>
            <p className="mx-auto mt-3 max-w-2xl leading-7 text-muted-foreground">
              Net asgari ücret tutarını yazarak mevcut yüzde 30 ve yüzde 50 oranlarına göre aylık
              taban ücret senaryosunu anında görün.
            </p>
          </div>

          <section className="mt-10 rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
            <label htmlFor="net-wage" className="text-sm font-bold">
              Net asgari ücret veya hesaplamak istediğiniz tutar
            </label>
            <div className="mt-2 flex items-center rounded-xl border bg-background px-4 focus-within:ring-2 focus-within:ring-primary">
              <input
                id="net-wage"
                inputMode="decimal"
                value={wage}
                onChange={(event) => setWage(event.target.value)}
                className="min-w-0 flex-1 bg-transparent py-3 text-lg outline-none"
                aria-describedby="wage-help"
              />
              <span className="font-semibold text-muted-foreground">TL</span>
            </div>
            <p id="wage-help" className="mt-2 text-xs text-muted-foreground">
              Ondalık ayırıcı olarak nokta veya virgül kullanabilirsiniz.
            </p>

            {valid ? (
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-primary/10 p-6">
                  <p className="text-sm font-semibold text-muted-foreground">
                    9, 10 ve 11. sınıf · %30
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-primary">
                    {money.format(parsed * 0.3)}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">Aylık matematiksel karşılık</p>
                </div>
                <div className="rounded-2xl bg-emerald-500/10 p-6">
                  <p className="text-sm font-semibold text-muted-foreground">
                    12. sınıf kalfa · %50
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-emerald-700">
                    {money.format(parsed * 0.5)}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">Aylık matematiksel karşılık</p>
                </div>
              </div>
            ) : (
              <p
                role="alert"
                className="mt-5 rounded-xl bg-destructive/10 p-4 text-sm text-destructive"
              >
                Geçerli ve pozitif bir tutar yazın.
              </p>
            )}
          </section>

          <article className="legal-content mt-10">
            <h2>Hesaplama nasıl yapılıyor?</h2>
            <p>
              Girilen tutar 9, 10 ve 11. sınıf için 0,30; kalfalık yeterliliği bulunan 12. sınıf
              öğrencisi için 0,50 ile çarpılır. Sonuç bir hesaplama yardımıdır. Öğrencinin programı,
              sözleşmesi, devam durumu ve güncel mevzuat kesin ödemeyi etkileyebilir.
            </p>
            <div className="not-prose mt-6 flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm leading-6">
              <Info className="mt-0.5 size-5 shrink-0 text-amber-700" />
              <p>
                Gelecek yıl için henüz açıklanmamış bir asgari ücret yazarsanız sonuç yalnızca
                senaryodur. Kesin tutarı okulunuzdan, sözleşmenizden ve resmî kurumlardan
                doğrulayın.
              </p>
            </div>
            <h2>Temel kaynaklar</h2>
            <ul>
              <li>
                <a
                  href="https://www.csgb.gov.tr/poco-pages/asgari-ucret/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Çalışma ve Sosyal Güvenlik Bakanlığı asgari ücret bilgisi
                </a>
              </li>
              <li>
                <a
                  href="https://meb.gov.tr/bakan-ozer-turkiyede-mesleki-egitimin-donusumunu-degerlendirdi/haber/26960/tr"
                  target="_blank"
                  rel="noreferrer"
                >
                  Millî Eğitim Bakanlığı mesleki eğitim ücret oranları
                </a>
              </li>
            </ul>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
