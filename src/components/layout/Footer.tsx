import { Link } from "@tanstack/react-router";
import { Logo } from "./Navbar";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="container-x flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
        <div className="space-y-2">
          <Logo />
          <p className="text-sm text-muted-foreground">Aradığın stajyeri bul.</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground" aria-label="Alt menü">
          <Link to="/stajyer-bul" className="hover:text-foreground">Stajyer Bul</Link>
          <Link to="/ilanlar" className="hover:text-foreground">İlanlar</Link>
          <Link to="/nasil-calisir" className="hover:text-foreground">Nasıl Çalışır?</Link>
          <Link to="/isletme-paneli" className="hover:text-foreground">İşletme Paneli</Link>
        </nav>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} StajyerBul · stajyerbul.com.tr</p>
      </div>
    </footer>
  );
}
