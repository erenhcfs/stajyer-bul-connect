import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
});

function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container-x py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-500 mb-6">
              <Sparkles className="size-4 animate-pulse text-amber-400" />
              Çok Yakında
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Blog ve Kariyer Rehberi
            </h1>
            
            <p className="mt-4 text-muted-foreground text-base sm:text-lg">
              Staj süreçleri, mülakat ipuçları ve mesleki gelişim yazılarımız yakında burada yerini alacak.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                <ArrowLeft className="size-4" /> Ana Sayfaya Dön
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}