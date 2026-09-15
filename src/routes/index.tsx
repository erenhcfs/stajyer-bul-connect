import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Calculator,
  Car,
  Code2,
  Cog,
  MapPin,
  Megaphone,
  MoreHorizontal,
  Palette,
  Search,
  ShoppingBag,
  Users,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import type { Profile } from "@/lib/models";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "StajyerBul | Staj Arayanlar ve İşletmelerin Buluşma Noktası",
      },
      {
        name: "description",
        content:
          "StajyerBul, staj arayan öğrenciler ile stajyer arayan işletmeleri buluşturan güvenilir platformdur. Staj ilanlarını keşfedin, stajyer adaylarına ulaşın ve hemen başvurun.",
      },
      {
        name: "keywords",
        content:
          "staj, staj bul, stajyer bul, staj ilanları, stajyer arayan firmalar, staj arayan öğrenciler, staj platformu, öğrenci staj, stajyer bulma",
      },
      {
        rel: "icon",
        href: "/favicon.ico",
      },
      {
        rel: "icon",
        type: "image/png",
        href: "/favicon.png",
      },
      {
        property: "og:title",
        content: "StajyerBul | Staj Arayanlar ve İşletmelerin Buluşma Noktası",
      },
      {
        property: "og:description",
        content: "Staj arayan öğrenciler ile stajyer arayan işletmeleri buluşturan platform.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:image",
        content: "https://stajyerbul.com.tr/logo.png",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "StajyerBul | Staj Arayanlar ve İşletmelerin Buluşma Noktası",
      },
      {
        name: "twitter:description",
        content: "Staj arayan öğrenciler ile stajyer arayan işletmeleri buluşturan platform.",
      },
      {
        name: "twitter:image",
        content: "https://stajyerbul.com.tr/logo.png",
      },
    ],
    links: [{ rel: "canonical", href: "https://stajyerbul.com.tr/" }],
  }),
  component: Index,
});

const categories = [
  { label: "Yazılım", icon: Code2 },
  { label: "CNC / Makine", icon: Cog },
  { label: "Elektrik", icon: Zap },
  { label: "Muhasebe", icon: Calculator },
  { label: "Grafik Tasarım", icon: Palette },
  { label: "Otomotiv", icon: Car },
  { label: "Pazarlama", icon: Megaphone },
  { label: "E-Ticaret", icon: ShoppingBag },
  { label: "İnsan Kaynakları", icon: Users },
  { label: "Diğer", icon: MoreHorizontal },
];

const steps = [
  {
    n: "01",
    title: "İşletmeni doğrula",
    desc: "Firma bilgilerini gir, ekibimiz hesabını kısa sürede onaylasın.",
  },
  {
    n: "02",
    title: "Stajyerleri keşfet veya ilan oluştur",
    desc: "Filtrelerle adayları incele ya da birkaç dakikada ilanını yayınla.",
  },
  {
    n: "03",
    title: "Uygun adaylarla iletişime geç",
    desc: "Adayların paylaştığı iletişim bilgileriyle e-posta üzerinden görüş.",
  },
  {
    n: "04",
    title: "Stajyerini bul",
    desc: "Doğru adayı seç ve staj sürecini güvenle başlat.",
  },
];

function Index() {
  const navigate = useNavigate();
  const [featuredCandidates, setFeaturedCandidates] = useState<Profile[]>([]);

  useEffect(() => {
    if (!supabaseConfigured) return;
    supabase
      .rpc("list_public_candidates", { limit_count: 3 })
      .then(({ data }) => setFeaturedCandidates((data || []) as Profile[]));
  }, []);
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden />
          <div
            className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-accent blur-3xl"
            aria-hidden
          />

          <div className="container-x relative pt-16 pb-14 sm:pt-24 sm:pb-20">
            <div className="mx-auto max-w-3xl text-center">
              <span className="animate-rise inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-semibold text-muted-foreground shadow-soft">
                <BadgeCheck className="size-3.5 text-primary" />
                Onaylı işverenler · Gerçek adaylar
              </span>

              <h1 className="animate-rise mt-6 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl [animation-delay:60ms]">
                Aradığın <span className="text-gradient">stajyeri</span> bul.
              </h1>

              <p className="animate-rise mx-auto mt-5 max-w-xl text-lg text-muted-foreground [animation-delay:120ms]">
                İhtiyacın olan stajyeri keşfet, profilleri incele veya kendi staj ilanını oluştur.
              </p>

              <div className="animate-rise mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row [animation-delay:180ms]">
                <Link to="/stajyer-bul" className="btn btn-primary btn-lg w-full sm:w-auto">
                  Stajyer Bul <ArrowRight className="size-4" />
                </Link>

                <Link to="/isletme-paneli" className="btn btn-outline btn-lg w-full sm:w-auto">
                  Staj İlanı Oluştur
                </Link>
              </div>
            </div>

            {/* SEARCH */}
            <form
              className="animate-rise card-soft mx-auto mt-12 flex max-w-3xl flex-col gap-2 p-2 sm:flex-row sm:items-center [animation-delay:240ms]"
              onSubmit={(e) => {
                e.preventDefault();
                const values = new FormData(e.currentTarget);
                void navigate({
                  to: "/ilanlar",
                  search: {
                    q: String(values.get("q") || ""),
                    city: String(values.get("city") || ""),
                  },
                });
              }}
              role="search"
            >
              <label className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3 transition-colors focus-within:bg-muted">
                <Search className="size-5 shrink-0 text-muted-foreground" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  name="q"
                  placeholder="Pozisyon, beceri veya alan ara"
                  aria-label="Pozisyon, beceri veya alan ara"
                />
              </label>

              <div className="hidden h-8 w-px bg-border sm:block" />

              <label className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors focus-within:bg-muted sm:w-56">
                <MapPin className="size-5 shrink-0 text-muted-foreground" />
                <select
                  className="w-full bg-transparent text-sm outline-none"
                  defaultValue=""
                  name="city"
                  aria-label="Şehir seç"
                >
                  <option value="">Şehir seç</option>
                  {[
                    "İstanbul",
                    "Ankara",
                    "İzmir",
                    "Bursa",
                    "Kocaeli",
                    "Antalya",
                    "Konya",
                    "Adana",
                  ].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>

              <button type="submit" className="btn btn-primary h-12 rounded-xl sm:px-7">
                Ara
              </button>
            </form>

            {/* CATEGORIES */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Popüler
              </span>

              {categories.map(({ label, icon: Icon }) => (
                <Link
                  key={label}
                  to="/ilanlar"
                  search={{ q: label }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-2 text-sm font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent hover:text-primary"
                >
                  <Icon className="size-4 text-primary" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CANDIDATE PREVIEW */}
        <section className="border-y border-border bg-secondary">
          <div className="container-x py-16 sm:py-20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Stajyer profillerini keşfet
                </h2>

                <p className="mt-2 max-w-lg text-muted-foreground">
                  Beceri, okul, şehir ve müsaitlik durumuna göre filtrele; sana uygun adaya doğrudan
                  teklif gönder.
                </p>
              </div>

              <Link to="/stajyer-bul" className="btn btn-ghost group text-primary hover:bg-accent">
                Tüm adaylar{" "}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {featuredCandidates.length === 0 ? (
              <div className="card-soft mt-10 p-8 text-center text-sm text-muted-foreground">
                Aktif adaylar burada gösterilecek. İlk aday olmak için profilini tamamlayabilirsin.
              </div>
            ) : (
              <div className="mt-10 grid gap-5 md:grid-cols-3">
                {featuredCandidates.map((c) => {
                  const skills = (c.skills || "")
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                    .slice(0, 4);
                  const completed =
                    [c.full_name, c.department, c.city || c.location, c.school, c.skills].filter(
                      Boolean,
                    ).length * 20;
                  return (
                    <article key={c.id} className="card-soft card-hover relative p-5">
                      <div className="flex items-center gap-3">
                        <div className="grid size-12 place-items-center rounded-full bg-accent text-base font-bold text-accent-foreground">
                          {c.full_name?.[0] || "S"}
                        </div>

                        <div>
                          <h3 className="font-bold">{c.full_name || "Stajyer adayı"}</h3>
                          <p className="text-sm text-muted-foreground">
                            {c.department || "Alan belirtilmemiş"} ·{" "}
                            {c.city || c.location || "Konum yok"}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 text-sm text-muted-foreground">
                        {c.school || "Okul belirtilmemiş"}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {skills.map((s) => (
                          <span
                            key={s}
                            className="rounded-md bg-accent px-2 py-1 text-xs font-medium text-accent-foreground"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                          <span className="size-2 rounded-full bg-success" /> Staj arıyor
                        </span>

                        <span className="text-muted-foreground">Profil %{completed}</span>
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${completed}%` }}
                        />
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-2">
                        <Link to="/stajyer-bul" className="btn btn-outline h-10 text-sm">
                          Profili İncele
                        </Link>

                        <Link
                          to="/stajyer-bul"
                          className="btn btn-primary h-10 text-sm shadow-none"
                        >
                          Teklif Gönder
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="nasil-calisir" className="container-x py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              StajyerBul nasıl çalışır?
            </h2>

            <p className="mt-3 text-muted-foreground">Dört adımda doğru stajyere ulaş.</p>
          </div>

          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <li key={s.n} className="card-soft card-hover p-6">
                <span className="text-sm font-extrabold text-primary">{s.n}</span>

                <h3 className="mt-3 text-lg font-bold leading-snug">{s.title}</h3>

                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* DUAL CTA */}
        <section className="container-x pb-20">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="card-soft card-hover flex flex-col justify-between p-8">
              <div>
                <span className="grid size-11 place-items-center rounded-xl bg-accent text-primary">
                  <Briefcase className="size-5" />
                </span>

                <h3 className="mt-5 text-2xl font-extrabold tracking-tight">İşveren misin?</h3>

                <p className="mt-2 text-muted-foreground">
                  Firmanı doğrula, ilan yayınla ve adaylarla e-posta üzerinden iletişim kur.
                </p>
              </div>

              <Link to="/isletme-paneli" className="btn btn-primary mt-6 w-fit">
                İşveren olarak başla
              </Link>
            </div>

            <div className="card-soft card-hover flex flex-col justify-between bg-primary p-8 text-primary-foreground [&_p]:text-primary-foreground/80">
              <div>
                <span className="grid size-11 place-items-center rounded-xl bg-primary-foreground/15">
                  <Users className="size-5" />
                </span>

                <h3 className="mt-5 text-2xl font-extrabold tracking-tight">Staj mı arıyorsun?</h3>

                <p className="mt-2">
                  Profilini oluştur, ilanlara başvur ve işverenlerden teklif al.
                </p>
              </div>

              <Link
                to="/profil"
                className="btn mt-6 w-fit bg-background text-primary hover:bg-accent"
              >
                Profilini oluştur
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
