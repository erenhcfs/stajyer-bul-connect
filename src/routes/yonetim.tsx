import type { Profile, JobListing } from "@/lib/models";
import type { User } from "@supabase/supabase-js";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { adminRequest } from "@/lib/admin-client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldAlert, CheckCircle2, XCircle, Trash2, Building2, Briefcase } from "lucide-react";

export const Route = createFileRoute("/yonetim")({
  head: () => ({
    meta: [
      { title: "Yönetim Paneli — StajyerBul" },
      { name: "description", content: "Yönetim Kontrol Merkezi" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: YonetimPage,
});

function YonetimPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [pendingEmployers, setPendingEmployers] = useState<Profile[]>([]);
  const [allListings, setAllListings] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    adminRequest("admin-check")
      .then((data) => {
        if (data.authenticated) {
          setIsLoggedIn(true);
          void fetchData();
        }
      })
      .catch((error) => setLoginError(error.message));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setBusy(true);
    try {
      await adminRequest("admin-login", { password });
      setIsLoggedIn(true);
      await fetchData();
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Giriş yapılamadı.");
    } finally {
      setBusy(false);
    }
  };
  const fetchData = async () => {
    setLoading(true);
    setLoginError("");
    try {
      const { employers, listings } = await adminRequest("admin-data");
      setPendingEmployers(
        employers.filter(
          (emp: { approval_status?: string }) =>
            !emp.approval_status || emp.approval_status === "beklemede",
        ),
      );
      setAllListings(listings);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Veriler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateStatus = async (id: string, status: "onaylandi" | "reddedildi") => {
    setBusy(true);
    try {
      await adminRequest("admin-data", { id, status }, "PATCH");
      await fetchData();
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Güncelleme yapılamadı.");
    } finally {
      setBusy(false);
    }
  };
  const handleDeleteListing = async (id: string) => {
    if (!confirm("Bu ilanı kaldırmak istediğinize emin misiniz?")) return;
    setBusy(true);
    try {
      await adminRequest("admin-data", { id }, "DELETE");
      await fetchData();
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "İlan silinemedi.");
    } finally {
      setBusy(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 container-x flex items-center justify-center py-20">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="text-center mb-6">
              <ShieldAlert className="size-12 mx-auto text-primary mb-2" />
              <h1 className="text-2xl font-bold">Yönetim Girişi</h1>
              <p className="text-xs text-muted-foreground mt-1">
                Bu alan kısıtlıdır. Sadece yetkili yönetim erişebilir.
              </p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-medium text-center">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-sm">
              <div>
                <label className="font-semibold text-xs text-muted-foreground">Şifre</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground shadow hover:bg-primary/90 transition"
              >
                Yönetim Paneline Gir
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 container-x py-10 space-y-10">
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Yönetim Kontrol Paneli</h1>
            <p className="text-sm text-muted-foreground mt-1">
              İşletme başvurularını ve platformdaki staj ilanlarını denetleyin.
            </p>
          </div>
          <button
            onClick={async () => {
              try {
                await adminRequest("admin-logout", {});
                setIsLoggedIn(false);
              } catch (error) {
                setLoginError(error instanceof Error ? error.message : "Çıkış yapılamadı.");
              }
            }}
            className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted transition"
          >
            Çıkış Yap
          </button>
        </div>

        {loading ? (
          <p className="text-center py-20 text-muted-foreground">Yönetim verileri yükleniyor...</p>
        ) : (
          <>
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Building2 className="size-5 text-primary" /> Onay Bekleyen İşletme Başvuruları (
                {pendingEmployers.length})
              </h2>

              {pendingEmployers.length === 0 ? (
                <p className="text-sm text-muted-foreground p-6 rounded-xl border border-border bg-card">
                  Onay bekleyen işletme başvurusu bulunmuyor.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingEmployers.map((emp) => (
                    <div
                      key={emp.id}
                      className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600">
                            Durum: {emp.approval_status || "beklemede"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Vergi No: {emp.tax_number || "Yok"}
                          </span>
                        </div>

                        <h3 className="font-bold text-lg">
                          {emp.company_name || "İsimsiz İşletme"}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Sektör: {emp.sector || "Belirtilmemiş"} — Şehir:{" "}
                          {emp.location || "Belirtilmemiş"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Telefon: {emp.phone || "Belirtilmemiş"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-border">
                        <button
                          disabled={busy}
                          onClick={() => handleUpdateStatus(emp.id, "onaylandi")}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 py-2 text-xs font-semibold hover:bg-emerald-500/20 transition"
                        >
                          <CheckCircle2 className="size-4" /> Onayla
                        </button>
                        <button
                          disabled={busy}
                          onClick={() => handleUpdateStatus(emp.id, "reddedildi")}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-destructive/10 text-destructive py-2 text-xs font-semibold hover:bg-destructive/20 transition"
                        >
                          <XCircle className="size-4" /> Reddet
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4 pt-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Briefcase className="size-5 text-primary" /> Sitedeki Tüm Staj İlanları (
                {allListings.length})
              </h2>

              {allListings.length === 0 ? (
                <p className="text-sm text-muted-foreground p-6 rounded-xl border border-border bg-card">
                  Yayınlanmış ilan bulunmuyor.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {allListings.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                            {item.work_type}
                          </span>
                          <button
                            disabled={busy}
                            onClick={() => handleDeleteListing(item.id)}
                            className="text-muted-foreground hover:text-destructive transition"
                            title="İlanı Sil"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        <h4 className="font-bold text-base">{item.title}</h4>
                        <p className="text-xs font-medium text-primary mt-0.5">
                          {item.company_name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border text-[11px] text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString("tr-TR")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
