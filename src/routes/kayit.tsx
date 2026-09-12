import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const Route = createFileRoute("/kayit")({
  head: () => ({
    meta: [
      { title: "Kayıt Ol — StajyerBul" },
      { name: "description", content: "Kayıt sistemi bir sonraki aşamada kurulacak." },
      { property: "og:title", content: "Kayıt Ol — StajyerBul" },
      { property: "og:description", content: "Kayıt sistemi bir sonraki aşamada kurulacak." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ComingSoon title="Kayıt Ol" description="Kayıt sistemi bir sonraki aşamada kurulacak." />,
});
