import { Link } from "@tanstack/react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container-x flex flex-1 flex-col items-center justify-center py-24 text-center">
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">Yakında</span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-md text-muted-foreground">{description}</p>
        <Link to="/" className="btn btn-outline mt-8">
          Ana sayfaya dön
        </Link>
      </main>
      <Footer />
    </div>
  );
}
