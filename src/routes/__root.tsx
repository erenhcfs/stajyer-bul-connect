import { supabaseConfigured } from "@/lib/supabase";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

// STİLLERİN YÜKLENDİĞİ YER BURASI:
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Sayfa bulunamadı</h2>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  useEffect(() => {
    reportLovableError(error, {
      boundary: "tanstack_root_error_component",
    });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Sayfa yüklenemedi</h1>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Yeniden dene
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "StajyerBul | Staj Bul ve Stajyer Bul",
      },
      {
        name: "description",
        content:
          "StajyerBul, staj arayan öğrenciler ile stajyer arayan işletmeleri buluşturan platformdur. Staj ilanlarını keşfedin, stajyer adaylarına ulaşın ve doğru eşleşmeyi bulun.",
      },
      {
        property: "og:title",
        content: "StajyerBul | Staj Bul ve Stajyer Bul",
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
        property: "og:url",
        content: "https://stajyerbul.com.tr/",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "StajyerBul | Staj Bul ve Stajyer Bul",
      },
      {
        name: "twitter:description",
        content: "Staj arayan öğrenciler ile stajyer arayan işletmeleri buluşturan platform.",
      },
    ],

    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        href: "/favicon.png",
        type: "image/png",
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const [adConsent, setAdConsent] = useState<"accepted" | "rejected" | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("stajyerbul_ad_consent");
    setAdConsent(saved === "accepted" || saved === "rejected" ? saved : null);
  }, []);

  useEffect(() => {
    if (adConsent !== "accepted") return;
    // Advertising and analytics load only after hydration and explicit consent.
    if (!document.getElementById("stajyerbul-adsense")) {
      const script = document.createElement("script");
      script.id = "stajyerbul-adsense";
      script.async = true;
      script.crossOrigin = "anonymous";
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2311108731423361";
      document.head.appendChild(script);
    }
    if (!document.getElementById("stajyerbul-analytics")) {
      const analytics = document.createElement("script");
      analytics.id = "stajyerbul-analytics";
      analytics.async = true;
      analytics.src = "https://www.googletagmanager.com/gtag/js?id=G-5YBEH9YHFJ";
      document.head.appendChild(analytics);
      const analyticsWindow = window as Window & { dataLayer?: unknown[][] };
      const dataLayer = (analyticsWindow.dataLayer ||= []);
      const gtag = (...args: unknown[]) => dataLayer.push(args);
      gtag("js", new Date());
      gtag("config", "G-5YBEH9YHFJ", { send_page_view: true });
    }
  }, [adConsent]);

  const chooseConsent = (value: "accepted" | "rejected") => {
    localStorage.setItem("stajyerbul_ad_consent", value);
    setAdConsent(value);
  };

  return (
    <html lang="tr">
      <head>
        <HeadContent />

        {/* Google için StajyerBul marka bilgisi */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "StajyerBul",
              url: "https://stajyerbul.com.tr/",
              description:
                "Staj arayan öğrenciler ile stajyer arayan işletmeleri buluşturan platform.",
            }),
          }}
        />

        {/* Google için web sitesi bilgisi */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "StajyerBul",
              url: "https://stajyerbul.com.tr/",
            }),
          }}
        />
      </head>

      <body>
        {children}
        {adConsent === null && (
          <aside
            className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-3xl rounded-2xl border border-border bg-card p-5 shadow-xl"
            aria-label="Çerez tercihi"
          >
            <p className="font-semibold">Reklam ve çerez tercihi</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Site işlevleri için zorunlu depolama kullanılır. İzin verirseniz Google AdSense
              reklamları ve ölçüm tanımlayıcıları yüklenir. Ayrıntılar gizlilik sayfasındadır.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => chooseConsent("accepted")}
              >
                İzin Ver
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => chooseConsent("rejected")}
              >
                Reddet
              </button>
              <Link to="/gizlilik" className="btn btn-ghost">
                Ayrıntıları İncele
              </Link>
            </div>
          </aside>
        )}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {supabaseConfigured ? (
        <Outlet />
      ) : (
        <main className="container-x py-20" role="alert">
          <h1 className="text-2xl font-bold">Bağlantı ayarları eksik</h1>
          <p>Site şu anda hizmet veremiyor. Lütfen daha sonra yeniden deneyin.</p>
        </main>
      )}
    </QueryClientProvider>
  );
}
