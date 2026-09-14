import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { User, Save, CheckCircle2, Briefcase, Camera } from "lucide-react";
import type { CandidateApplication, InternshipOffer } from "@/lib/models";

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Profil Düzenle — StajyerBul" },
      { name: "description", content: "Kullanıcı profil bilgilerinizi güncelleyin." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ProfilPage,
});

// Türkiye'nin Büyükşehirleri / Önemli İlleri Listesi
const TURKEY_CITIES = [
  "İstanbul (Anadolu)",
  "İstanbul (Avrupa)",
  "Ankara",
  "İzmir",
  "Bursa",
  "Kocaeli",
  "Konya",
  "Antalya",
  "Adana",
  "Gaziantep",
  "Tekirdağ",
  "Sakarya",
  "Manisa",
  "Diğer",
];

// MESEM, Meslek Liseleri ve Üniversite / MYO Popüler Bölümleri Listesi
const POPULAR_DEPARTMENTS = [
  "CNC / Talaşlı Üretim",
  "Bilişim Teknolojileri / Yazılım",
  "Bilgisayar Mühendisliği",
  "Yazılım Mühendisliği",
  "Elektrik - Elektronik Teknolojisi / Mühendisliği",
  "Makine Teknolojisi / Mühendisliği",
  "Metal Teknolojisi",
  "Motorlu Araçlar Teknolojisi",
  "Muhasebe ve Finansman",
  "Grafik ve Fotoğraf / Tasarım",
  "Tesisat Teknolojisi ve İklimlendirme",
  "Endüstriyel Otomasyon / Mekatronik",
  "Yönetim Bilişim Sistemleri",
  "Diğer",
];

// Yaş Listesi
const AGES = Array.from({ length: 13 }, (_, i) => 15 + i); // 15'ten 27'ye kadar

function ProfilPage() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [userRole, setUserRole] = useState<string>("stajyer");

  // Stajyer Form Alanları
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("İstanbul (Anadolu)");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("11. Sınıf");
  const [department, setDepartment] = useState("CNC / Talaşlı Üretim");
  const [age, setAge] = useState<number>(18);
  const [skills, setSkills] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isLookingForInternship, setIsLookingForInternship] = useState(false);
  const [offers, setOffers] = useState<InternshipOffer[]>([]);
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [approvalStatus, setApprovalStatus] = useState<string | null>(null);
  const [approvalExpiresAt, setApprovalExpiresAt] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  // İşveren Form Alanları
  const [companyName, setCompanyName] = useState("");
  const [sector, setSector] = useState("");
  const [taxNumber, setTaxNumber] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/giris";
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setUserRole(data.role === "isveren" ? "isveren" : "stajyer");
        setFullName(data.full_name || "");
        setPhone(data.phone || "");
        setCity(data.city || data.location || "İstanbul (Anadolu)");
        setSchool(data.school || "");
        setGrade(data.grade || "11. Sınıf");
        setDepartment(data.department || "CNC / Talaşlı Üretim");
        setAge(data.age || 18);
        setSkills(data.skills || "");
        setAvatarUrl(data.avatar_url || "");
        setIsLookingForInternship(!!data.is_looking_for_internship);
        setApprovalStatus(data.approval_status || null);
        setApprovalExpiresAt(data.approval_expires_at || null);
        setRejectionReason(data.rejection_reason || null);

        setCompanyName(data.company_name || "");
        setSector(data.sector || "");
        setTaxNumber(data.tax_number || "");
        if (data.role !== "isveren") await Promise.all([fetchOffers(), fetchApplications()]);
      }
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Profil yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async () => {
    const { data, error } = await supabase.rpc("get_my_offers");
    if (!error) setOffers((data || []) as InternshipOffer[]);
  };

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from("job_applications")
      .select("id,status,created_at,job_listings(title,company_name)")
      .order("created_at", { ascending: false });
    if (!error) setApplications((data || []) as unknown as CandidateApplication[]);
  };

  const updateOffer = async (id: string, status: "accepted" | "rejected") => {
    const { error } = await supabase.from("internship_offers").update({ status }).eq("id", id);
    if (error) {
      setMessage("Teklif güncellenemedi: " + error.message);
      return;
    }
    setOffers((items) => items.map((offer) => (offer.id === id ? { ...offer, status } : offer)));
  };

  // Profil Resmi Yükleme Fonksiyonu
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingImage(true);
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      if (!file) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Resim yüklemek için giriş yapın.");
      const extension = (
        { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" } as Record<string, string>
      )[file.type];
      if (!extension || file.size > 5 * 1024 * 1024)
        throw new Error("En fazla 5 MB boyutunda JPG, PNG veya WebP seçin.");
      const filePath = `${user.id}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
    } catch (error: unknown) {
      alert(
        "Resim yüklenirken hata oluştu: " +
          (error instanceof Error ? error.message : "Bilinmeyen hata"),
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      setMessage("");

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Oturumunuz sona erdi. Yeniden giriş yapın.");
      }

      const profileData = {
        id: user.id,
        email: user.email,
        role: userRole,
        full_name: fullName,
        phone: phone,
        city: city,
        location: city,
        school: school,
        grade: grade,
        department: department,
        age: Number(age),
        skills: skills,
        avatar_url: avatarUrl,
        is_looking_for_internship: isLookingForInternship,
        company_name: companyName,
        sector: sector,
        tax_number: taxNumber,
      };

      const { error } = await supabase.from("profiles").upsert(profileData, { onConflict: "id" });

      if (error) {
        setMessage("Güncellenirken hata oluştu: " + error.message);
      } else {
        setMessage("Profiliniz başarıyla kaydedildi!");
        fetchProfile();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Profil kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  if (loadError)
    return (
      <div className="container-x py-12">
        <p role="alert">{loadError}</p>
        <button onClick={fetchProfile}>Yeniden dene</button>
      </div>
    );

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Profil yükleniyor...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 container-x py-10 max-w-3xl mx-auto space-y-8">
        {userRole !== "isveren" && offers.length > 0 && (
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-bold">Gelen Staj Teklifleri ({offers.length})</h2>
            <div className="mt-4 space-y-3">
              {offers.map((offer) => (
                <article key={offer.id} className="rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{offer.company_name || "İşletme"}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {offer.message || "Sizinle staj fırsatı için görüşmek istiyor."}
                      </p>
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">
                      {offer.status === "pending"
                        ? "Yeni teklif"
                        : offer.status === "accepted"
                          ? "Kabul edildi"
                          : "Reddedildi"}
                    </span>
                  </div>
                  {offer.status === "pending" && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => updateOffer(offer.id, "accepted")}
                      >
                        Kabul Et
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => updateOffer(offer.id, "rejected")}
                      >
                        Reddet
                      </button>
                    </div>
                  )}
                  {offer.status === "accepted" && (
                    <div className="mt-3 flex flex-wrap gap-3 text-sm">
                      {offer.employer_email && (
                        <a
                          className="text-primary hover:underline"
                          href={`mailto:${offer.employer_email}`}
                        >
                          E-posta gönder
                        </a>
                      )}
                      {offer.employer_phone && (
                        <a
                          className="text-primary hover:underline"
                          href={`tel:${offer.employer_phone}`}
                        >
                          Telefonla ara
                        </a>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
        {userRole !== "isveren" && applications.length > 0 && (
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-bold">Başvurularım ({applications.length})</h2>
            <div className="mt-4 space-y-3">
              {applications.map((application) => (
                <article
                  key={application.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4"
                >
                  <div>
                    <h3 className="font-semibold">
                      {application.job_listings?.title || "Staj ilanı"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {application.job_listings?.company_name || "İşletme"} ·{" "}
                      {new Date(application.created_at).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">
                    {application.status === "pending"
                      ? "Gönderildi"
                      : application.status === "reviewing"
                        ? "İnceleniyor"
                        : application.status === "accepted"
                          ? "Kabul edildi"
                          : "Olumsuz"}
                  </span>
                </article>
              ))}
            </div>
          </section>
        )}
        <div className="border-b border-border pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-2">
              <User className="size-8 text-primary" />
              Hesap ve Profil Ayarları
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Profil bilgilerinizi güncelleyin ve staj arama tercihlerinizi yönetin.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-muted p-1.5 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setUserRole("stajyer")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${userRole === "stajyer" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
            >
              Stajyer Modu
            </button>
            <button
              type="button"
              onClick={() => setUserRole("isveren")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${userRole === "isveren" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
            >
              İşveren Modu
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${message.includes("başarıyla") ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-destructive/10 text-destructive border border-destructive/20"}`}
          >
            <CheckCircle2 className="size-5 shrink-0" />
            {message}
          </div>
        )}

        <form
          onSubmit={handleUpdate}
          className="space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm"
        >
          {userRole === "stajyer" ? (
            <>
              {/* Profil Resmi Yükleme Alanı */}
              <div className="flex items-center gap-5 pb-6 border-b border-border">
                <div className="size-20 rounded-2xl bg-muted border-2 border-primary/20 overflow-hidden flex items-center justify-center relative shadow-inner">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profil" className="size-full object-cover" />
                  ) : (
                    <User className="size-8 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-muted-foreground">
                    Profil Fotoğrafı
                  </label>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold cursor-pointer hover:bg-secondary/80 transition">
                    <Camera className="size-4" />
                    {uploadingImage ? "Yükleniyor..." : "Fotoğraf Seç / Değiştir"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-muted-foreground">
                    İşverenlerin sizi daha rahat tanıması için net bir fotoğraf yükleyin.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Adınız Soyadınız"
                    required
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Telefon Numarası
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XX XXX XX XX"
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Okul / Üniversite Adı
                  </label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="Örn: ... Mesleki ve Teknik Anadolu Lisesi / ... Üniversitesi"
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Sınıf / Seviye
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm"
                  >
                    <option value="10. Sınıf">10. Sınıf</option>
                    <option value="11. Sınıf">11. Sınıf (MESEM)</option>
                    <option value="12. Sınıf">12. Sınıf (MESEM / Staj)</option>
                    <option value="Üniversite 1. Sınıf">Üniversite 1. Sınıf</option>
                    <option value="Üniversite 2. Sınıf (MYO)">Üniversite 2. Sınıf (MYO)</option>
                    <option value="Üniversite 3. Sınıf">Üniversite 3. Sınıf</option>
                    <option value="Üniversite 4. Sınıf">Üniversite 4. Sınıf</option>
                    <option value="Mezun">Mezun</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Bölüm / Alan (Listeden Seçiniz)
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm"
                  >
                    {POPULAR_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Yaş
                  </label>
                  <select
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm"
                  >
                    {AGES.map((a) => (
                      <option key={a} value={a}>
                        {a} Yaş
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Oturduğu Şehir / Konum
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm"
                  >
                    {TURKEY_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Yetenekler / Bildiğiniz Programlar
                </label>
                <textarea
                  rows={3}
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Örn: Fanuc, AutoCAD, React, C# (virgülle ayırarak yazın)"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm"
                />
              </div>

              <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-5 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <label
                    htmlFor="internship-toggle"
                    className="font-bold text-base flex items-center gap-2 cursor-pointer"
                  >
                    <Briefcase className="size-5 text-primary" /> Aktif Staj Arıyorum
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Bu seçeneği işaretlediğinizde işletmeler "Stajyer Bul" sayfasında sizi
                    görüntüleyebilir ve teklif gönderebilir.
                  </p>
                </div>
                <input
                  id="internship-toggle"
                  type="checkbox"
                  checked={isLookingForInternship}
                  onChange={(e) => setIsLookingForInternship(e.target.checked)}
                  className="size-5 rounded border-input accent-primary cursor-pointer"
                />
              </div>
              {isLookingForInternship && approvalStatus !== "onaylandi" && (
                <div
                  className={`rounded-xl p-4 text-sm ${approvalStatus === "reddedildi" ? "bg-destructive/10 text-destructive" : "bg-amber-500/10 text-amber-700"}`}
                >
                  <strong>
                    {approvalStatus === "reddedildi"
                      ? "Profiliniz yayınlanmadı."
                      : "Profiliniz yönetici onayı bekliyor."}
                  </strong>
                  {rejectionReason && <p className="mt-1">Sebep: {rejectionReason}</p>}
                </div>
              )}
              {isLookingForInternship && approvalStatus === "onaylandi" && approvalExpiresAt && (
                <p className="rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-700">
                  Profiliniz {new Date(approvalExpiresAt).toLocaleDateString("tr-TR")} tarihine
                  kadar işletmelere açık.
                </p>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  İşletme / Şirket Adı
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Sektör
                  </label>
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Vergi Numarası
                  </label>
                  <input
                    type="text"
                    value={taxNumber}
                    onChange={(e) => setTaxNumber(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    İletişim Telefonu
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Şehir
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm"
                  >
                    {TURKEY_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-border">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition disabled:opacity-50"
            >
              <Save className="size-4" />
              {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
