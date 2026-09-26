import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarDays,
  ExternalLink,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { findExternalListing } from "@/lib/external-listings";

const SITE_URL = "https://stajyerbul.com.tr";

export const Route = createFileRoute("/ilanlar_/$slug")({
  loader: ({ params }) => {
    const listing = findExternalListing(params.slug);
    if (!listing) throw notFound();
    return listing;
  },
  head: ({ loaderData }) => {
    const title = loaderData
      ? `${loaderData.title} | ${loaderData.company_name} | StajyerBul`
      : "Staj Fırsatı | StajyerBul";
    const description = loaderData?.description || "Doğrulanmış staj ve öğrenci programları.";
    const url = `${SITE_URL}/ilanlar/${loaderData?.slug || ""}`;
    return {
      links: [{ rel: "canonical", href: url }],
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
      ],
      scripts: loaderData
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "EducationalOccupationalProgram",
                name: loaderData.title,
                description: loaderData.description,
                provider: { "@type": "Organization", name: loaderData.company_name },
                occupationalCategory: loaderData.department,
                url,
                sameAs: loaderData.source_url,
              }),
            },
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Staj İlanları",
                    item: `${SITE_URL}/ilanlar`,
                  },
                  { "@type": "ListItem", position: 3, name: loaderData.title, item: url },
                ],
              }),
            },
          ]
        : [],
    };
  },
  component: ExternalListingPage,
});

function ExternalListingPage() {
  const listing = Route.useLoaderData();
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="container-x flex-1 py-10 md:py-16">
        <div className="mx-auto max-w-3xl">
          <Link to="/ilanlar" className="mb-6 inline-flex items-center gap-2 text-sm text-primary">
            <ArrowLeft className="size-4" /> Tüm staj fırsatları
          </Link>
          <article className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-10">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="size-3.5" /> Resmî kaynaktan doğrulandı
              </span>
              <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                {listing.source_status_label}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{listing.title}</h1>
            <p className="mt-3 flex items-center gap-2 text-lg font-semibold text-primary">
              <Building2 className="size-5" /> {listing.company_name}
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                {listing.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="size-4" />
                {listing.department}
              </span>
              {listing.application_period && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-4" />
                  {listing.application_period}
                </span>
              )}
            </div>
            <div className="mt-8 space-y-6 border-t border-border pt-8">
              <section>
                <h2 className="text-lg font-bold">Program hakkında</h2>
                <p className="mt-2 leading-7 text-muted-foreground">{listing.description}</p>
              </section>
              <section>
                <h2 className="text-lg font-bold">Başvurmadan önce</h2>
                <p className="mt-2 leading-7 text-muted-foreground">{listing.requirements}</p>
              </section>
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">
                Bu fırsat {listing.source_name} kaynağından{" "}
                {new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(
                  new Date(listing.verified_at),
                )}{" "}
                tarihinde kontrol edildi. Tarih ve koşullar değişebileceği için başvuru öncesinde
                resmî sayfayı inceleyin.
              </div>
              <a
                href={listing.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow hover:bg-primary/90 sm:w-auto"
              >
                Resmî Sayfada Başvur <ExternalLink className="size-4" />
              </a>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
