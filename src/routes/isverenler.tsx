import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const Route = createFileRoute("/isverenler")({
  head: () => ({
    meta: [
      { title: "İşverenler — StajyerBul" },
      { name: "description", content: "İşveren kayıt ve doğrulama süreci yakında." },
      { property: "og:title", content: "İşverenler — StajyerBul" },
      { property: "og:description", content: "İşveren kayıt ve doğrulama süreci yakında." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ComingSoon title="İşverenler" description="İşveren kayıt ve doğrulama süreci yakında." />,
});
