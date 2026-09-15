import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock3, Mail, MessageSquareText, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const SITE_URL = "https://stajyerbul.com.tr";
const CONTACT_EMAIL = "erenayaz6941@gmail.com";

export const Route = createFileRoute("/iletisim")({
  head: () => ({
    meta: [
      { title: "Bize Ulaşın | StajyerBul" },
      {
        name: "description",
        content:
          "StajyerBul destek ekibine hesap, ilan, başvuru, iş birliği ve gizlilik konularında ulaşın.",
      },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/iletisim` }],
  }),
  component: IletisimPage,
});

function IletisimPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="container-x flex-1 py-12 sm:py-16">
        <section className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
            <MessageSquareText className="size-4" /> İletişim ve destek
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight">Bize Ulaşın</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Hesabınız, ilanlar, başvurular, işletme doğrulaması, içerikler veya iş birliği hakkında
            bize doğrudan yazabilirsiniz.
          </p>
        </section>

        <section className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-border bg-card p-7 shadow-sm">
            <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <Mail className="size-6" />
            </div>
            <h2 className="mt-5 text-xl font-bold">E-posta desteği</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Mesajınızda hesabınızla ilişkili e-posta adresini ve yaşadığınız sorunu açıklayın.
              Şifre, doğrulama kodu veya özel anahtar göndermeyin.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=StajyerBul%20Destek`}
              className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              {CONTACT_EMAIL}
            </a>
          </article>

          <article className="rounded-2xl border border-border bg-card p-7 shadow-sm">
            <div className="grid size-12 place-items-center rounded-xl bg-emerald-500/10 text-emerald-700">
              <Clock3 className="size-6" />
            </div>
            <h2 className="mt-5 text-xl font-bold">Destek kapsamı</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>• Hesap ve profil işlemleri</li>
              <li>• İlan ve başvuru sorunları</li>
              <li>• İşletme veya stajyer profil incelemeleri</li>
              <li>• Gizlilik, içerik ve iş birliği talepleri</li>
            </ul>
          </article>
        </section>

        <section className="mx-auto mt-8 max-w-4xl rounded-2xl border border-border bg-muted/40 p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <h2 className="font-bold">Gizliliğiniz önemli</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                İletişim sırasında paylaşılan bilgileri yalnızca talebinizi yanıtlamak için
                kullanırız. Ayrıntılar için{" "}
                <Link to="/gizlilik" className="font-semibold text-primary hover:underline">
                  Gizlilik ve KVKK
                </Link>{" "}
                sayfamızı inceleyebilirsiniz.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
