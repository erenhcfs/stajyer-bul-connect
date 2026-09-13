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
import { useEffect, type ReactNode } from "react";

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
        rel: "canonical",
        href: "https://stajyerbul.com.tr/",
      },
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
  useEffect(() => {
    // Auto ads mutate the head and body. Load only after React has hydrated them.
    if (document.getElementById("stajyerbul-adsense")) return;
    const script = document.createElement("script");
    script.id = "stajyerbul-adsense";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2311108731423361";
    document.head.appendChild(script);
  }, []);

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
