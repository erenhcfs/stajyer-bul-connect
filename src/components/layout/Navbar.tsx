import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, User, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function Logo() {
  return (
    <Link to="/" className="flex items-center" aria-label="StajyerBul ana sayfa">
      <span className="text-lg font-extrabold tracking-tight">
        Stajyer <span className="text-primary">Bul</span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      })
      .catch(() => setUser(null));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      await navigate({ to: "/giris" });
    } catch {
      alert("Çıkış yapılamadı. Lütfen yeniden deneyin.");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between">
        {/* Sol Kısım: Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Orta Kısım: Navigasyon */}
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Ana menü">
          <Link
            to="/stajyer-bul"
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            Stajyer Bul
          </Link>
          <Link
            to="/ilanlar"
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            İlanlar
          </Link>
          <Link
            to="/nasil-calisir"
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            Nasıl Çalışır?
          </Link>
          <Link
            to="/isletme-paneli"
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            İşletme Paneli
          </Link>
          <Link
            to="/blog"
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            Blog
          </Link>

          {/* Hakkımızda Menüsü (En Sağda) */}
          <Link
            to="/hakkimizda"
            className="relative inline-flex items-center gap-1.5 px-4 py-2 ml-2 rounded-xl text-xs font-extrabold uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:bg-amber-500/20 hover:scale-105 transition duration-300"
            activeProps={{ className: "bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.4)]" }}
          >
            <Sparkles className="size-3.5 animate-pulse text-amber-400" />
            Hakkımızda
          </Link>
        </nav>

        {/* Sağ Kısım: Kullanıcı / Giriş Butonları */}
        <div className="hidden items-center gap-3 xl:flex">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profil"
                className="inline-flex items-center gap-2 rounded-xl border border-input bg-card px-4 py-2 text-sm font-semibold shadow-sm transition-colors hover:bg-muted"
              >
                <User className="size-4 text-primary" />
                <span>Profilim</span>
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-xl border border-input bg-card px-3.5 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                Çıkış
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/giris"
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Giriş Yap
              </Link>
              <Link
                to="/kayit"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>

        {/* Mobil Menü Butonu */}
        <button
          className="grid size-10 place-items-center rounded-lg text-foreground hover:bg-muted xl:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobil Menü İçeriği */}
      {open && (
        <div className="border-t border-border bg-background xl:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="container-x flex flex-col gap-1 py-3" aria-label="Mobil menü">
            <Link
              to="/stajyer-bul"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              Stajyer Bul
            </Link>
            <Link
              to="/ilanlar"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              İlanlar
            </Link>
            <Link
              to="/nasil-calisir"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              Nasıl Çalışır?
            </Link>
            <Link
              to="/isletme-paneli"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              İşletme Paneli
            </Link>
            <Link
              to="/blog"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              Blog
            </Link>
            <Link
              to="/hakkimizda"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold text-amber-500 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20"
            >
              <Sparkles className="size-4 text-amber-400" />
              Hakkımızda
            </Link>

            <div className="mt-2 pt-3 border-t border-border flex flex-col gap-2">
              {user ? (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/profil"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-2 rounded-lg border border-input bg-card px-4 py-2.5 text-sm font-semibold w-full"
                  >
                    <User className="size-4 text-primary" />
                    <span>Profilim</span>
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-muted w-full"
                  >
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/giris"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted w-full"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    to="/kayit"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 w-full"
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
