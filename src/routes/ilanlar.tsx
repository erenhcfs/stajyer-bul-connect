import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const Route = createFileRoute("/ilanlar")({
  head: () => ({
    meta: [
      { title: "Staj İlanları — StajyerBul" },
      { name: "description", content: "İlan listesi bir sonraki aşamada aktif olacak." },
      { property: "og:title", content: "Staj İlanları — StajyerBul" },
      { property: "og:description", content: "İlan listesi bir sonraki aşamada aktif olacak." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ComingSoon title="Staj İlanları" description="İlan listesi bir sonraki aşamada aktif olacak." />,
});
