import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/blog")({
  component: ComingSoonBlogPage,
});

function ComingSoonBlogPage() {
  return (
    <div className="flex min-h-[80vh] flex-col justify-between">
      {/* Üst Kısım / İçerik */}
      <div className="container-x flex flex-col items-center justify-center py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-500 mb-6">
          <Sparkles className="size-4 animate-pulse text-amber-400" />
          Çok Yakında
        </div>
        
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
          Blog Sistemi Çok Yakında Yayında!
        </h1>
        
        <p className="mt-4 max-w-md text-muted-foreground text-base sm:text-lg">
          Staj süreçleri, kariyer ipuçları ve mesleki rehberlerle dolu blog köşemiz en kısa sürede sizlerle olacak.
        </p>

        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="size-4" /> Ana Sayfaya Dön
          </Link>
        </div>
      </div>

      {/* Alt Bilgi / Footer Alanı */}
      <footer className="border-t border-border/70 py-8 text-center text-sm text-muted-foreground">
        <div className="container-x">
          <p>© {new Date().getFullYear()} StajyerBul. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}