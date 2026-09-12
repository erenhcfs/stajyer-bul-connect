import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const Route = createFileRoute("/giris")({
  head: () => ({
    meta: [
      { title: "Giriş Yap — StajyerBul" },
      { name: "description", content: "Giriş sistemi bir sonraki aşamada kurulacak." },
      { property: "og:title", content: "Giriş Yap — StajyerBul" },
      { property: "og:description", content: "Giriş sistemi bir sonraki aşamada kurulacak." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ComingSoon title="Giriş Yap" description="Giriş sistemi bir sonraki aşamada kurulacak." />,
});
