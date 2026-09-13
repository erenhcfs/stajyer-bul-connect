import type { Profile } from "@/lib/models";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Search, MapPin, BookOpen, Send, User, ShieldAlert, School } from "lucide-react";

export const Route = createFileRoute("/stajyer-bul")({
  head: () => ({
    meta: [
      { title: "Stajyer Bul — StajyerBul" },
      { name: "description", content: "İşverenler için gelişmiş stajyer ve aday keşfet sayfası." },
    ],
  }),
  component: StajyerBulPage,
});

function StajyerBulPage() {
  const [loadError, setLoadError] = useState("");
  const [candidates, setCandidates] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  // Filtreler
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("tumu");

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (data) setUserProfile(data);
      }
    } catch {
      setUserProfile(null);
    }
    await fetchCandidates();
  };

  const fetchCandidates = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .in("role", ["stajyer", "ogrenci"])
        .eq("is_looking_for_internship", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) {
        setCandidates(data);
      }
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Adaylar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  // Open a draft; the user sends the email from their email application.
  const handleSendOffer = (candidate: Profile) => {
    if (
      !userProfile ||
      userProfile.role !== "isveren" ||
      userProfile.approval_status !== "onaylandi"
    ) {
      alert("Adayla iletişim kurmak için onaylı işveren hesabıyla giriş yapın.");
      return;
    }
    if (!candidate.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate.email)) {
      alert("Aday e-posta adresini paylaşmamış.");
      return;
    }
    window.location.href = `mailto:${encodeURIComponent(candidate.email)}?subject=${encodeURIComponent("Staj teklifi")}`;
  };

  const filteredCandidates = candidates.filter((item) => {
    const matchesSearch =
      (item.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.skills || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTerm =
      selectedTerm === "tumu" ||
      (item.internship_term || "").toLowerCase().includes(selectedTerm.toLowerCase());
    const matchesLocation =
      !selectedLocation ||
      (item.city || item.location || "").toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesDepartment =
      !selectedDepartment ||
      (item.department || "").toLowerCase().includes(selectedDepartment.toLowerCase());

    return matchesSearch && matchesTerm && matchesLocation && matchesDepartment;
  });

  const isEmployer =
    userProfile && userProfile.role === "isveren" && userProfile.approval_status === "onaylandi";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 container-x py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Stajyer Adayları Keşfet</h1>
          <p className="text-muted-foreground mt-1">
            İşletmeniz için uygun adayları filtreleyin ve e-posta ile iletişim kurun.
          </p>
        </div>

        {!isEmployer && (
          <div className="mb-8 p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-600 flex items-center gap-3">
            <ShieldAlert className="size-5 shrink-0" />
            <p className="text-xs sm:text-sm font-medium">
              Not: Adaylara e-posta ile iletişim kurabilmek için onaylı işveren hesabıyla giriş
              yapmanız gerekir.
            </p>
          </div>
        )}

        {/* Filtre Alanı */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-5 rounded-2xl border border-border bg-card shadow-sm">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
              Arama (İsim / Yetenek)
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Örn: CNC, Yazılım..."
                className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
              Bölüm / Alan
            </label>
            <input
              type="text"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              placeholder="Örn: CNC, Bilişim..."
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
              Şehir / Konum
            </label>
            <input
              type="text"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              placeholder="Örn: İstanbul"
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
              Staj Vadesi
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm"
            >
              <option value="tumu">Tüm Vadeler</option>
              <option value="Kısa Vadeli">Kısa Vadeli (Yaz Stajı)</option>
              <option value="Uzun Vadeli">Uzun Vadeli / MESEM</option>
            </select>
          </div>
        </div>

        {/* Aday Listesi */}
        {loadError ? (
          <div role="alert">
            <p>{loadError}</p>
            <button onClick={fetchCandidates}>Yeniden dene</button>
          </div>
        ) : loading ? (
          <p className="text-center text-muted-foreground py-20">Adaylar yükleniyor...</p>
        ) : filteredCandidates.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-border bg-card p-8">
            <User className="size-12 mx-auto text-muted-foreground mb-3 opacity-50" />
            <h3 className="text-lg font-semibold">Aktif Aday Bulunamadı</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Seçtiğiniz kriterlere uygun aktif staj arayan aday bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    {/* Resmi / Avatar */}
                    <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shrink-0 overflow-hidden border border-primary/20 shadow-inner">
                      {candidate.avatar_url ? (
                        <img
                          src={candidate.avatar_url}
                          alt={candidate.full_name || "Stajyer"}
                          className="size-full object-cover"
                        />
                      ) : (
                        candidate.full_name?.charAt(0) || "S"
                      )}
                    </div>
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      Aktif Staj Arıyor
                    </span>
                  </div>

                  <h3 className="font-bold text-lg">{candidate.full_name || "İsimsiz Aday"}</h3>

                  {/* Bölüm ve Okul Bilgisi */}
                  <div className="space-y-1 mt-2">
                    <p className="text-sm font-semibold text-primary flex items-center gap-1.5">
                      <BookOpen className="size-4 shrink-0" />{" "}
                      {candidate.department || "Bölüm belirtilmemiş"}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <School className="size-4 shrink-0" />{" "}
                      {candidate.school || "Okul belirtilmemiş"}{" "}
                      {candidate.grade ? `(${candidate.grade})` : ""}
                    </p>
                  </div>

                  <div className="space-y-1.5 mt-4 text-xs text-muted-foreground border-t border-border pt-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 shrink-0" />
                      <span>
                        Konum:{" "}
                        <strong className="text-foreground">
                          {candidate.city || candidate.location || "Belirtilmemiş"}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {candidate.skills && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {candidate.skills.split(",").map((skill: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs font-medium"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* İşverenler İçin E-posta ile İletişim Butonu */}
                <div className="mt-6 pt-4 border-t border-border">
                  <button
                    onClick={() => handleSendOffer(candidate)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition shadow"
                  >
                    <Send className="size-3.5" /> Staj Teklifi Gönder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
