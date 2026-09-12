import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/stajyer-bul", label: "Stajyer Bul" },
  { to: "/ilanlar", label: "İlanlar" },
  { to: "/nasil-calisir", label: "Nasıl Çalışır?" },
  { to: "/isverenler", label: "İşverenler" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="StajyerBul ana sayfa">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-glow">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </span>
      <span className="text-lg font-extrabold tracking-tight">
        STAJYER<span className="text-primary">BUL</span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Ana menü">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/giris" className="btn btn-ghost h-10">
            Giriş Yap
          </Link>
          <Link to="/kayit" className="btn btn-primary h-10">
            Kayıt Ol
          </Link>
        </div>

        <button
          className="grid size-10 place-items-center rounded-lg text-foreground hover:bg-muted md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="container-x flex flex-col gap-1 py-3" aria-label="Mobil menü">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-3">
              <Link to="/giris" className="btn btn-outline" onClick={() => setOpen(false)}>
                Giriş Yap
              </Link>
              <Link to="/kayit" className="btn btn-primary" onClick={() => setOpen(false)}>
                Kayıt Ol
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
