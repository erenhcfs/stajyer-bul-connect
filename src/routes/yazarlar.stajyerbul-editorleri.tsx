import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, Mail } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/yazarlar/stajyerbul-editorleri")({
  head: () => ({
    links: [{ rel: "canonical", href: "https://stajyerbul.com.tr/yazarlar/stajyerbul-editorleri" }],
    meta: [
      { title: "StajyerBul Editörleri | Yazar Profili" },
      {
        name: "description",
        content: "StajyerBul içerik ekibinin çalışma, kaynak kullanımı ve güncelleme ilkeleri.",
      },
    ],
  }),
  component: AuthorPage,
});

function AuthorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="container-x flex-1 py-14">
        <article className="mx-auto max-w-3xl">
          <div className="flex items-center gap-5">
            <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-primary text-2xl font-extrabold text-primary-foreground">
              SB
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">Yazar profili</p>
              <h1 className="text-3xl font-extrabold">StajyerBul Editörleri</h1>
              <p className="mt-1 text-muted-foreground">
                Eğitim, staj ve genç kariyer içerik ekibi
              </p>
            </div>
          </div>
          <div className="mt-10 space-y-8 leading-8">
            <section>
              <h2 className="text-2xl font-bold">Ne yazıyoruz?</h2>
              <p className="mt-3 text-muted-foreground">
                Öğrencilerin staj ararken, MESEM ücretlerini hesaplarken ve ilk iş deneyimine
                hazırlanırken ihtiyaç duyduğu pratik bilgileri yayımlıyoruz. İşverenler için de ilan
                hazırlama, aday değerlendirme ve güvenli iletişim konularını açıklıyoruz.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold">Bilgileri nasıl doğruluyoruz?</h2>
              <ul className="mt-4 space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-1 size-5 shrink-0 text-emerald-600" /> Ücret ve
                  mevzuat içeriklerinde resmî kurumların güncel açıklamalarını temel alırız.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-1 size-5 shrink-0 text-emerald-600" /> Tahminleri
                  kesinleşmiş bilgi gibi sunmayız; varsayımı ve hesaplama tarihini açıkça yazarız.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-1 size-5 shrink-0 text-emerald-600" /> Eskiyen veya
                  hatalı bilgileri bildirim üzerine inceler, gerekli düzeltmeyi yaparız.
                </li>
              </ul>
            </section>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                to="/editorial-politika"
                className="rounded-2xl border bg-card p-5 hover:border-primary"
              >
                <BookOpen className="size-6 text-primary" />
                <h2 className="mt-3 font-bold">Yayın ilkelerimiz</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Kaynak, düzeltme ve güncelleme yaklaşımımız.
                </p>
              </Link>
              <Link to="/iletisim" className="rounded-2xl border bg-card p-5 hover:border-primary">
                <Mail className="size-6 text-primary" />
                <h2 className="mt-3 font-bold">Bize ulaşın</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Hata bildirimi, öneri ve iş birliği talepleri.
                </p>
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
