import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const Route = createFileRoute("/nasil-calisir")({
  head: () => ({
    meta: [
      { title: "Nasıl Çalışır? — StajyerBul" },
      { name: "description", content: "Detaylı rehber hazırlanıyor." },
      { property: "og:title", content: "Nasıl Çalışır? — StajyerBul" },
      { property: "og:description", content: "Detaylı rehber hazırlanıyor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ComingSoon title="Nasıl Çalışır?" description="Detaylı rehber hazırlanıyor." />,
});
