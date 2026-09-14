import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/sifre-yenile")({
  head: () => ({
    meta: [
      { title: "Şifre Yenile — StajyerBul" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PasswordResetPage,
});

function PasswordResetPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    if (password.length < 8) return setMessage("Yeni şifreniz en az 8 karakter olmalı.");
    if (password !== confirmPassword) return setMessage("Şifreler eşleşmiyor.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setMessage(error.message);
    await navigate({ to: "/profil" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="container-x flex flex-1 items-center justify-center py-16">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h1 className="text-2xl font-bold">Yeni Şifre Belirle</h1>
          {!ready ? (
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p>Şifre yenileme bağlantısı geçersiz veya süresi dolmuş.</p>
              <Link to="/giris" className="font-medium text-primary hover:underline">
                Yeni bağlantı iste
              </Link>
            </div>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={submit}>
              {message && (
                <p
                  role="alert"
                  className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive"
                >
                  {message}
                </p>
              )}
              <label className="block text-sm font-medium">
                Yeni şifre
                <input
                  type="password"
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5"
                />
              </label>
              <label className="block text-sm font-medium">
                Yeni şifre tekrar
                <input
                  type="password"
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5"
                />
              </label>
              <button disabled={busy} className="btn btn-primary w-full" type="submit">
                {busy ? "Kaydediliyor..." : "Şifreyi Kaydet"}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
