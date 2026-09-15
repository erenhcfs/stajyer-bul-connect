import type { JobListing, PlatformSettings, Profile } from "@/lib/models";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { adminRequest } from "@/lib/admin-client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  BarChart3,
  Briefcase,
  Building2,
  CheckCircle2,
  RefreshCw,
  Save,
  Settings,
  ShieldAlert,
  Trash2,
  Users,
  X,
  XCircle,
} from "lucide-react";

export const Route = createFileRoute("/yonetim")({
  head: () => ({
    meta: [
      { title: "Yönetim Paneli — StajyerBul" },
      { name: "description", content: "StajyerBul yönetim kontrol merkezi" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: YonetimPage,
});

type Tab = "ozet" | "stajyerler" | "isletmeler" | "ilanlar" | "ayarlar";
type RejectTarget = { resource: "candidate" | "employer"; id: string; name: string };
const initialSettings: PlatformSettings = {
  candidate_approval_days: 10,
  max_active_listings: 5,
  applications_enabled: true,
};

function expired(profile: Profile) {
  return (
    profile.approval_status === "onaylandi" &&
    !!profile.approval_expires_at &&
    new Date(profile.approval_expires_at).getTime() <= Date.now()
  );
}

function StatusBadge({ profile }: { profile: Profile }) {
  const label = expired(profile)
    ? "Süresi doldu"
    : profile.approval_status === "onaylandi"
      ? "Onaylandı"
      : profile.approval_status === "reddedildi"
        ? "Reddedildi"
        : "Bekliyor";
  const style =
    label === "Onaylandı"
      ? "bg-emerald-500/10 text-emerald-700"
      : label === "Bekliyor"
        ? "bg-amber-500/10 text-amber-700"
        : "bg-destructive/10 text-destructive";
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}>
      {label}
    </span>
  );
}

function YonetimPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("ozet");
  const [employers, setEmployers] = useState<Profile[]>([]);
  const [candidates, setCandidates] = useState<Profile[]>([]);
  const [listings, setListings] = useState<JobListing[]>([]);
  const [settings, setSettings] = useState<PlatformSettings>(initialSettings);
  const [databaseSetupRequired, setDatabaseSetupRequired] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<RejectTarget | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await adminRequest("admin-data");
      setEmployers(data.employers || []);
      setCandidates(data.candidates || []);
      setListings(data.listings || []);
      setSettings(data.settings || initialSettings);
      setDatabaseSetupRequired(data.database_setup_required === true);
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : "Veriler yüklenemedi.",
        error: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    adminRequest("admin-check")
      .then((data) => {
        if (data.authenticated) {
          setIsLoggedIn(true);
          void fetchData();
        }
      })
      .catch(() => undefined);
  }, []);

  const stats = useMemo(
    () => ({
      pendingCandidates: candidates.filter(
        (item) => !item.approval_status || item.approval_status === "beklemede",
      ).length,
      activeCandidates: candidates.filter(
        (item) => item.approval_status === "onaylandi" && !expired(item),
      ).length,
      pendingEmployers: employers.filter(
        (item) => !item.approval_status || item.approval_status === "beklemede",
      ).length,
      activeListings: listings.filter((item) => item.status !== "closed").length,
    }),
    [candidates, employers, listings],
  );

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      await adminRequest("admin-login", { username, password });
      setIsLoggedIn(true);
      await fetchData();
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : "Giriş yapılamadı.",
        error: true,
      });
    } finally {
      setBusy(false);
    }
  };

  const updateProfile = async (
    resource: "candidate" | "employer",
    id: string,
    status: "onaylandi" | "reddedildi",
    reason?: string,
  ) => {
    setBusy(true);
    setMessage(null);
    try {
      await adminRequest(
        "admin-data",
        { resource, id, status, reason, days: settings.candidate_approval_days },
        "PATCH",
      );
      setRejectTarget(null);
      setRejectReason("");
      setMessage({ text: status === "onaylandi" ? "Profil onaylandı." : "Profil reddedildi." });
      await fetchData();
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : "Profil güncellenemedi.",
        error: true,
      });
    } finally {
      setBusy(false);
    }
  };

  const updateListing = async (item: JobListing) => {
    setBusy(true);
    try {
      await adminRequest(
        "admin-data",
        {
          resource: "listing",
          id: item.id,
          status: item.status === "closed" ? "active" : "closed",
        },
        "PATCH",
      );
      await fetchData();
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : "İlan güncellenemedi.",
        error: true,
      });
    } finally {
      setBusy(false);
    }
  };

  const deleteListing = async (id: string) => {
    if (!confirm("Bu ilanı kalıcı olarak silmek istediğinize emin misiniz?")) return;
    setBusy(true);
    try {
      await adminRequest("admin-data", { id }, "DELETE");
      await fetchData();
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : "İlan silinemedi.",
        error: true,
      });
    } finally {
      setBusy(false);
    }
  };

  const saveSettings = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const data = await adminRequest("admin-data", { resource: "settings", ...settings }, "PATCH");
      setSettings(data.settings);
      setMessage({ text: "Platform ayarları kaydedildi." });
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : "Ayarlar kaydedilemedi.",
        error: true,
      });
    } finally {
      setBusy(false);
    }
  };

  if (!isLoggedIn)
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="container-x flex flex-1 items-center justify-center py-20">
          <form
            onSubmit={login}
            className="w-full max-w-md space-y-5 rounded-2xl border border-border bg-card p-8 shadow-sm"
          >
            <div className="text-center">
              <ShieldAlert className="mx-auto mb-2 size-12 text-primary" />
              <h1 className="text-2xl font-bold">Yönetim Girişi</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Yalnızca yetkili yöneticiler erişebilir.
              </p>
            </div>
            {message && (
              <p className="rounded-xl bg-destructive/10 p-3 text-center text-xs text-destructive">
                {message.text}
              </p>
            )}
            <label className="block text-xs font-semibold">
              Kullanıcı adı
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 font-normal"
              />
            </label>
            <label className="block text-xs font-semibold">
              Şifre
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 font-normal"
              />
            </label>
            <button
              disabled={busy}
              className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-60"
            >
              {busy ? "Giriş yapılıyor..." : "Yönetim Paneline Gir"}
            </button>
          </form>
        </main>
        <Footer />
      </div>
    );

  const tabs: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
    { id: "ozet", label: "Özet", icon: BarChart3 },
    { id: "stajyerler", label: "Stajyerler", icon: Users },
    { id: "isletmeler", label: "İşletmeler", icon: Building2 },
    { id: "ilanlar", label: "İlanlar", icon: Briefcase },
    { id: "ayarlar", label: "Ayarlar", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="container-x flex-1 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-3xl font-extrabold">Yönetim Kontrol Paneli</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Üyeleri, ilanları ve platform kurallarını yönetin.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => void fetchData()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-semibold"
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
              Yenile
            </button>
            <button
              onClick={async () => {
                await adminRequest("admin-logout", {});
                setIsLoggedIn(false);
              }}
              className="rounded-xl border border-border px-4 py-2 text-xs font-semibold"
            >
              Çıkış
            </button>
          </div>
        </div>
        {message && (
          <div
            className={`mb-5 rounded-xl p-3 text-sm ${message.error ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-700"}`}
          >
            {message.text}
          </div>
        )}
        {databaseSetupRequired && (
          <div className="mb-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-800">
            <strong>Veritabanı kurulumu eksik.</strong> Stajyer süreli onayı, red sebebi ve platform
            ayarları için <code>20260915000000_advanced_admin.sql</code> migration dosyasını
            Supabase SQL Editor’da çalıştırın.
          </div>
        )}
        <div className="mb-7 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${tab === item.id ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}
            >
              <item.icon className="size-4" />
              {item.label}
            </button>
          ))}
        </div>
        {loading ? (
          <p className="py-20 text-center text-muted-foreground">Yönetim verileri yükleniyor...</p>
        ) : (
          <>
            {tab === "ozet" && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Onay bekleyen stajyer", stats.pendingCandidates, "stajyerler"],
                  ["Aktif stajyer profili", stats.activeCandidates, "stajyerler"],
                  ["Onay bekleyen işletme", stats.pendingEmployers, "isletmeler"],
                  ["Aktif ilan", stats.activeListings, "ilanlar"],
                ].map(([label, value, target]) => (
                  <button
                    key={String(label)}
                    onClick={() => setTab(target as Tab)}
                    className="rounded-2xl border border-border bg-card p-5 text-left shadow-sm"
                  >
                    <strong className="block text-3xl text-primary">{String(value)}</strong>
                    <span className="text-sm text-muted-foreground">{String(label)}</span>
                  </button>
                ))}
              </div>
            )}
            {tab === "stajyerler" && (
              <ProfileSection
                title={`Stajyer profilleri (${candidates.length})`}
                description={`Onaylanan profiller ${settings.candidate_approval_days} gün boyunca işletmelere görünür.`}
                items={candidates}
                resource="candidate"
                days={settings.candidate_approval_days}
                busy={busy}
                onApprove={updateProfile}
                onReject={setRejectTarget}
              />
            )}
            {tab === "isletmeler" && (
              <ProfileSection
                title={`İşletme profilleri (${employers.length})`}
                description="İşletmeleri inceleyin; red sebebi kullanıcıya gösterilir ve aktif ilanları kapatılır."
                items={employers}
                resource="employer"
                busy={busy}
                onApprove={updateProfile}
                onReject={setRejectTarget}
              />
            )}
            {tab === "ilanlar" && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold">Tüm staj ilanları ({listings.length})</h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {listings.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === "closed" ? "bg-muted text-muted-foreground" : "bg-emerald-500/10 text-emerald-700"}`}
                        >
                          {item.status === "closed" ? "Kapalı" : "Aktif"}
                        </span>
                        <button
                          disabled={busy}
                          onClick={() => void deleteListing(item.id)}
                          title="Kalıcı olarak sil"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <h3 className="mt-3 font-bold">{item.title}</h3>
                      <p className="text-xs font-medium text-primary">{item.company_name}</p>
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                      <button
                        disabled={busy}
                        onClick={() => void updateListing(item)}
                        className="mt-4 w-full rounded-xl border border-border py-2 text-xs font-semibold"
                      >
                        {item.status === "closed" ? "Yeniden yayınla" : "Yayından kaldır"}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {tab === "ayarlar" && (
              <form
                onSubmit={saveSettings}
                className="max-w-2xl space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div>
                  <h2 className="text-xl font-bold">Platform ayarları</h2>
                  <p className="text-sm text-muted-foreground">
                    Kurallar kaydedildiğinde site genelinde uygulanır.
                  </p>
                </div>
                <NumberField
                  label="Stajyer onay süresi (gün)"
                  min={1}
                  max={90}
                  value={settings.candidate_approval_days}
                  onChange={(value) => setSettings({ ...settings, candidate_approval_days: value })}
                />
                <NumberField
                  label="İşletme başına aktif ilan sınırı"
                  min={1}
                  max={50}
                  value={settings.max_active_listings}
                  onChange={(value) => setSettings({ ...settings, max_active_listings: value })}
                />
                <label className="flex items-center justify-between gap-4 rounded-xl border border-border p-4">
                  <span>
                    <strong className="block text-sm">İlan başvuruları</strong>
                    <span className="text-xs text-muted-foreground">
                      Kapalıyken yeni başvuru kabul edilmez.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.applications_enabled}
                    onChange={(event) =>
                      setSettings({ ...settings, applications_enabled: event.target.checked })
                    }
                    className="size-5 accent-primary"
                  />
                </label>
                <button
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
                >
                  <Save className="size-4" />
                  Ayarları kaydet
                </button>
              </form>
            )}
          </>
        )}
      </main>
      <Footer />
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void updateProfile(
                rejectTarget.resource,
                rejectTarget.id,
                "reddedildi",
                rejectReason,
              );
            }}
            className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{rejectTarget.name} reddedilsin mi?</h2>
              <button type="button" onClick={() => setRejectTarget(null)}>
                <X className="size-5" />
              </button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Sebep kullanıcıya gösterilecek.</p>
            <textarea
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              required
              minLength={5}
              maxLength={500}
              rows={4}
              placeholder="Red sebebini açıkça yazın..."
              className="mt-4 w-full rounded-xl border border-input bg-background p-3 text-sm"
            />
            <button
              disabled={busy || rejectReason.trim().length < 5}
              className="mt-3 w-full rounded-xl bg-destructive py-3 text-sm font-semibold text-destructive-foreground disabled:opacity-50"
            >
              Reddi kaydet
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function ProfileSection({
  title,
  description,
  items,
  resource,
  days,
  busy,
  onApprove,
  onReject,
}: {
  title: string;
  description: string;
  items: Profile[];
  resource: "candidate" | "employer";
  days?: number;
  busy: boolean;
  onApprove: (
    resource: "candidate" | "employer",
    id: string,
    status: "onaylandi" | "reddedildi",
  ) => Promise<void>;
  onReject: (target: RejectTarget) => void;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((profile) => {
          const name =
            resource === "employer"
              ? profile.company_name || "İsimsiz işletme"
              : profile.full_name || "İsimsiz stajyer";
          return (
            <div
              key={profile.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold">{name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {resource === "employer"
                      ? `${profile.sector || "Sektör yok"} · ${profile.location || "Konum yok"}`
                      : `${profile.school || "Okul belirtilmemiş"} · ${profile.department || "Bölüm belirtilmemiş"}`}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {profile.email || "E-posta yok"} · {profile.phone || "Telefon yok"}
                  </p>
                </div>
                <StatusBadge profile={profile} />
              </div>
              {profile.approval_expires_at && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Onay bitişi: {new Date(profile.approval_expires_at).toLocaleString("tr-TR")}
                </p>
              )}
              {profile.rejection_reason && (
                <p className="mt-3 rounded-lg bg-destructive/10 p-2.5 text-xs text-destructive">
                  <strong>Red sebebi:</strong> {profile.rejection_reason}
                </p>
              )}
              <div className="mt-4 flex gap-2 border-t border-border pt-4">
                <button
                  disabled={busy}
                  onClick={() => void onApprove(resource, profile.id, "onaylandi")}
                  className="flex-1 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-700"
                >
                  <CheckCircle2 className="mr-1 inline size-4" />
                  {days ? `${days} gün onayla` : "Onayla"}
                </button>
                <button
                  disabled={busy}
                  onClick={() => onReject({ resource, id: profile.id, name })}
                  className="rounded-xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive"
                >
                  <XCircle className="mr-1 inline size-4" />
                  Reddet
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function NumberField({
  label,
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 font-normal"
      />
    </label>
  );
}
