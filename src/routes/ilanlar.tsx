import type { Profile, JobListing } from "@/lib/models";
import type { User } from "@supabase/supabase-js";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Briefcase,
  MapPin,
  Building2,
  Plus,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/ilanlar")({
  validateSearch: (search: Record<string, unknown>): { q?: string; city?: string } => ({
    ...(typeof search["q"] === "string" ? { q: search["q"] } : {}),
    ...(typeof search["city"] === "string" ? { city: search["city"] } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Staj İlanları — StajyerBul" },
      { name: "description", content: "En güncel staj ve kariyer fırsatlarını keşfedin." },
      { property: "og:title", content: "Staj İlanları — StajyerBul" },
      { property: "og:description", content: "En güncel staj ve kariyer fırsatlarını keşfedin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IlanlarPage,
});

function IlanlarPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [loadError, setLoadError] = useState("");
  const [creating, setCreating] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [listings, setListings] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const searchQuery = search.q || "";
  const setSearchQuery = (q: string) => {
    void navigate({ search: (previous) => ({ ...previous, q }), replace: true });
  };
  const [selectedWorkType, setSelectedWorkType] = useState("tumu");

  // Kullanıcı ve Yetki Durumu
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<JobListing | null>(null);
  const [maxListingLimit, setMaxListingLimit] = useState(5);
  const [applicationsEnabled, setApplicationsEnabled] = useState(true);

  // Yeni İlan Form State'leri
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [workType, setWorkType] = useState("Yüz Yüze");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    fetchUserAndProfile();
    fetchListings();
    supabase.rpc("get_public_platform_settings").then(({ data }) => {
      if (data?.[0]) {
        setMaxListingLimit(data[0].max_active_listings || 5);
        setApplicationsEnabled(data[0].applications_enabled !== false);
      }
    });
  }, []);

  const fetchUserAndProfile = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (data) setUserProfile(data);
      }
    } catch {
      setUser(null);
      setUserProfile(null);
    }
  };

  const fetchListings = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const { data, error } = await supabase
        .from("job_listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) {
        setListings(data);
      }
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "İlanlar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (
      !user ||
      !userProfile ||
      userProfile.role !== "isveren" ||
      userProfile.approval_status !== "onaylandi"
    ) {
      setFormError("İlan oluşturmak için onaylı bir işveren hesabına sahip olmalısınız.");
      return;
    }

    if (creating) return;
    setCreating(true);
    try {
      const { count, error: countError } = await supabase
        .from("job_listings")
        .select("id", { count: "exact", head: true })
        .eq("employer_id", user.id)
        .eq("status", "active");
      if (countError) throw countError;
      if ((count ?? 0) >= maxListingLimit)
        throw new Error(`En fazla ${maxListingLimit} aktif ilan yayınlayabilirsiniz.`);
      const { error } = await supabase.from("job_listings").insert({
        employer_id: user.id,
        title,
        company_name: userProfile.company_name || "Şirket",
        location,
        work_type: workType,
        department,
        description,
        requirements,
      });

      if (error) {
        setFormError("İlan eklenirken hata oluştu: " + error.message);
      } else {
        setFormSuccess("İlanınız başarıyla yayınlandı!");
        setTitle("");
        setLocation("");
        setDepartment("");
        setDescription("");
        setRequirements("");
        fetchListings();
        setTimeout(() => {
          setIsModalOpen(false);
          setFormSuccess("");
        }, 1500);
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "İlan oluşturulamadı.");
    } finally {
      setCreating(false);
    }
  };

  const handleApply = async () => {
    if (!applicationsEnabled) {
      setApplicationMessage("Yeni başvurular geçici olarak durduruldu.");
      return;
    }
    if (!user) {
      void navigate({ to: "/giris" });
      return;
    }
    if (!selectedListing || applying) return;
    if (!userProfile || !["stajyer", "ogrenci"].includes(userProfile.role)) {
      setApplicationMessage("Başvuru göndermek için öğrenci profili oluşturmalısınız.");
      return;
    }
    setApplying(true);
    setApplicationMessage("");
    try {
      const { error } = await supabase.from("job_applications").insert({
        listing_id: selectedListing.id,
        candidate_id: user.id,
        cover_letter: coverLetter.trim() || null,
      });
      if (error?.code === "23505") throw new Error("Bu ilana daha önce başvurdunuz.");
      if (error) throw error;
      setApplicationMessage("Başvurunuz işletmeye iletildi.");
      setCoverLetter("");
    } catch (error) {
      setApplicationMessage(error instanceof Error ? error.message : "İletişim bilgisi alınamadı.");
    } finally {
      setApplying(false);
    }
  };

  // Filtreleme
  const filteredListings = listings.filter((item) => {
    const matchesSearch =
      (item.title || "")
        .toLocaleLowerCase("tr-TR")
        .includes(searchQuery.toLocaleLowerCase("tr-TR")) ||
      (item.company_name || "")
        .toLocaleLowerCase("tr-TR")
        .includes(searchQuery.toLocaleLowerCase("tr-TR")) ||
      (item.department || "")
        .toLocaleLowerCase("tr-TR")
        .includes(searchQuery.toLocaleLowerCase("tr-TR"));
    const matchesType = selectedWorkType === "tumu" || item.work_type === selectedWorkType;
    return (
      matchesSearch &&
      matchesType &&
      (!search.city ||
        (item.location || "")
          .toLocaleLowerCase("tr-TR")
          .includes(search.city.toLocaleLowerCase("tr-TR")))
    );
  });

  const canCreateListing =
    userProfile && userProfile.role === "isveren" && userProfile.approval_status === "onaylandi";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 container-x py-10">
        {/* Üst Kısım & Başlık */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Staj İlanları</h1>
            <p className="text-muted-foreground mt-1">
              Geleceğinizi şekillendirecek en güncel staj ve çalışma fırsatlarını keşfedin.
            </p>
          </div>

          {/* Sadece onaylı işverenlere görünen "İlan Oluştur" butonu */}
          {canCreateListing && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90 shrink-0"
            >
              <Plus className="size-5" /> İlan Oluştur
            </button>
          )}
        </div>

        {search.city && (
          <button
            className="mb-3 text-sm text-primary"
            onClick={() => {
              void navigate({ search: (previous) => ({ ...previous, city: "" }) });
            }}
          >
            {search.city} filtresini kaldır ×
          </button>
        )}
        {/* Arama ve Filtre Çubuğu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pozisyon, firma veya departman ara..."
              className="w-full rounded-xl border border-input bg-card pl-10 pr-4 py-3 text-sm shadow-sm"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedWorkType}
              onChange={(e) => setSelectedWorkType(e.target.value)}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm shadow-sm"
            >
              <option value="tumu">Tüm Çalışma Tipleri</option>
              <option value="Yüz Yüze">Yüz Yüze</option>
              <option value="Uzaktan">Uzaktan</option>
              <option value="Hibrit">Hibrit</option>
            </select>
          </div>
        </div>

        {/* İlan Listesi */}
        {loadError ? (
          <div role="alert">
            <p>{loadError}</p>
            <button onClick={fetchListings}>Yeniden dene</button>
          </div>
        ) : loading ? (
          <p className="text-center text-muted-foreground py-20">İlanlar yükleniyor...</p>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-border bg-card p-8">
            <Briefcase className="size-12 mx-auto text-muted-foreground mb-3 opacity-50" />
            <h3 className="text-lg font-semibold">İlan Bulunamadı</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Arama kriterlerinize uygun aktif staj ilanı bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedListing(item);
                  setApplicationMessage("");
                }}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50 cursor-pointer"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                      {item.company_name?.charAt(0) || "F"}
                    </div>
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
                      {item.work_type}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 mt-1">
                    <Building2 className="size-4 shrink-0" /> {item.company_name}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5" /> {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="size-3.5" /> {item.department}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Detayları İncele</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* İlan Detay Modalı */}
        {selectedListing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2">
                    {selectedListing.work_type}
                  </span>
                  <h2 className="text-2xl font-bold">{selectedListing.title}</h2>
                  <p className="text-muted-foreground font-medium flex items-center gap-1.5 mt-1">
                    <Building2 className="size-4" /> {selectedListing.company_name} —{" "}
                    {selectedListing.location}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedListing(null)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6 text-sm">
                <div>
                  <h4 className="font-semibold text-primary mb-1">Departman</h4>
                  <p className="text-muted-foreground">{selectedListing.department}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-1">İlan Açıklaması</h4>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {selectedListing.description}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-1">Aranan Nitelikler & Şartlar</h4>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {selectedListing.requirements}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-border flex gap-3">
                <label className="block flex-1 text-sm">
                  <span className="mb-1.5 block font-medium">Kısa ön yazı (isteğe bağlı)</span>
                  <textarea
                    value={coverLetter}
                    onChange={(event) => setCoverLetter(event.target.value.slice(0, 1000))}
                    rows={3}
                    placeholder="Kendinizi ve bu ilanla neden ilgilendiğinizi kısaca anlatın."
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5"
                  />
                </label>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                {applicationMessage && (
                  <p role="status" className="flex-1 text-sm">
                    {applicationMessage}
                  </p>
                )}
                <button
                  onClick={handleApply}
                  disabled={applying || !applicationsEnabled}
                  className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
                >
                  {applying
                    ? "Gönderiliyor..."
                    : applicationsEnabled
                      ? "Başvuruyu Gönder"
                      : "Başvurular geçici olarak kapalı"}
                </button>
                <button
                  onClick={() => setSelectedListing(null)}
                  className="rounded-xl bg-muted px-6 py-3 text-sm font-semibold"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* İlan Oluşturma Modalı */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Yeni Staj İlanı Yayınla</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              {formError && (
                <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" /> {formError}
                </div>
              )}
              {formSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0" /> {formSuccess}
                </div>
              )}

              <form onSubmit={handleCreateListing} className="space-y-4 text-sm">
                <div>
                  <label className="font-semibold text-muted-foreground text-xs">
                    İlan Başlığı
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Örn: Yaz Stajyeri - Frontend Developer"
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-muted-foreground text-xs">
                      Şehir / Lokasyon
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      placeholder="Örn: Kocaeli / İzmit"
                      className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-muted-foreground text-xs">
                      Çalışma Şekli
                    </label>
                    <select
                      value={workType}
                      onChange={(e) => setWorkType(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5"
                    >
                      <option value="Yüz Yüze">Yüz Yüze</option>
                      <option value="Uzaktan">Uzaktan</option>
                      <option value="Hibrit">Hibrit</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-muted-foreground text-xs">Departman</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    placeholder="Örn: Bilgi İşlem / Yazılım"
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5"
                  />
                </div>

                <div>
                  <label className="font-semibold text-muted-foreground text-xs">
                    İlan Açıklaması
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Stajyerin yapacağı görevler..."
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5"
                  />
                </div>

                <div>
                  <label className="font-semibold text-muted-foreground text-xs">
                    Aranan Nitelikler
                  </label>
                  <textarea
                    rows={3}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    required
                    placeholder="Mesem öğrencisi, ilgili teknik liseler..."
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 rounded-xl bg-primary py-3 font-semibold text-primary-foreground shadow hover:bg-primary/90"
                  >
                    İlanı Yayınla
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl bg-muted px-6 py-3 font-semibold"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
