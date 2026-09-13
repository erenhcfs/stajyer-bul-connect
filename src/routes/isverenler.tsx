import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/isverenler")({
  beforeLoad: () => {
    throw redirect({ to: "/isletme-paneli" });
  },
});
