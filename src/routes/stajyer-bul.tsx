import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const Route = createFileRoute("/stajyer-bul")({
  head: () => ({
    meta: [
      { title: "Stajyer Bul — StajyerBul" },
      { name: "description", content: "Aday keşfet sayfası bir sonraki aşamada aktif olacak." },
      { property: "og:title", content: "Stajyer Bul — StajyerBul" },
      { property: "og:description", content: "Aday keşfet sayfası bir sonraki aşamada aktif olacak." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ComingSoon title="Stajyer Bul" description="Aday keşfet sayfası bir sonraki aşamada aktif olacak." />,
});
