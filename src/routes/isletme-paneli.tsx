import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Building2, Briefcase, Plus, ShieldCheck, Clock, AlertCircle, 
  CheckCircle2, Trash2, MapPin 
} from "lucide-react";

export const Route = createFileRoute("/isletme-paneli")({
  head: () => ({
    meta: [
      { title: "İşletme Paneli — StajyerBul" },
      { name: "description", content: "Kapsamlı işletme ve ilan yönetim merkezi." },
    ],
  }),
  component: IsletmePaneliPage,
});

// Basit bir yasaklı kelime / küfür filtresi (Anti-Cheat / Filtre)
const PROFANITY_LIST = ["anan", "amık", "sik", "orospu", "piç", "am ", " am", "oç", "kahpe"];
const VALID_CITIES = [
  "adana", "adıyaman", "afyonkarahisar", "ağrı", "amasya", "ankara", "antalya", "artvin", 
  "aydın", "balıkesir", "bilecik", "bingöl", "bitlis", "bolu", "burdur", "bursa", "çanakkale", 
  "çankırı", "çorum", "denizli", "diyarbakır", "edirne", "elazığ", "erzincan", "erzurum", 
  "eskişehir", "gaziantep", "giresun", "gümüşhane", "hakkari", "hatay", "ısparta", "mersin", 
  "istanbul", "izmir", "kars", "kastamonu", "kayseri", "kırklareli", "kırşehir", "kocaeli", 
  "konya", "kütahya", "malatya", "manisa", "kahramanmaraş", "mardin", "muğla", "muş", "nevşehir", 
  "niğde", "ordu", "rize", "sakarya", "samsun", "siirt", "sinop", "sivas", "tekirdağ", "tokat", 
  "trabzon", "tunceli", "şanlıurfa", "uşak", "van", "yozgat", "zonguldak", "aksaray", "bayburt", 
  "karaman", "kırıkkale", "batman", "şırnak", "bartın", "ardahan", "ığdır", "yalova", "karabük", 
  "kilis", "osmaniye", "düzce"
];

function IsletmePaneliPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Başvuru Formu State'leri
  const [companyName, setCompanyName] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [sector, setSector] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submittingApp, setSubmittingApp] = useState(false);
  const [appError, setAppError] = useState("");

  // Profil Düzenleme State'leri
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [about, setAbout] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  // İlanlar ve Yeni İlan Formu
  const [myListings, setMyListings] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [workType, setWorkType] = useState("Yüz Yüze");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const MAX_LISTING_LIMIT = 5;

  useEffect(() => {
    checkUserAndProfile();
  }, []);

  const checkUserAndProfile = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate({ to: "/giris" });
      return;
    }

    setUser(session.user);
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
      setCompanyName(profileData.company_name || "");
      setTaxNumber(profileData.tax_number || "");
      setSector(profileData.sector || "");
      setPhone(profileData.phone || "");
      setAddress(profileData.location || "");
      setLogoUrl(profileData.logo_url || "");
      setBannerUrl(profileData.banner_url || "");
      setAbout(profileData.about || "");

      if (profileData.role === "isveren" && profileData.approval_status === "onaylandi") {
        fetchMyListings(session.user.id);
      }
    }
    setLoading(false);
  };

  const fetchMyListings = async (employerId: string) => {
    const { data } = await supabase
      .from("job_listings")
      .select("*")
      .eq("employer_id", employerId)
      .order("created_at", { ascending: false });
    if (data) setMyListings(data);
  };

  // Güvenlik ve Doğrulama Kontrollü Başvuru Gönderimi
  const handleEmployerApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppError("");

    // 1. Vergi Numarası Kontrolü (Kesinlikle 10 hane olmalı)
    const cleanTax = taxNumber.replace(/\D/g, "");
    if (cleanTax.length !== 10) {
      setAppError("Vergi numarası eksiksiz ve tam olarak 10 haneli rakamlardan oluşmalıdır!");
      return;
    }

    // 2. Şehir / Konum Anti-Cheat Kontrolü
    const lowerAddress = address.toLowerCase().trim();
    const hasProfanity = PROFANITY_LIST.some((word) => lowerAddress.includes(word) || companyName.toLowerCase().includes(word));
    
    if (hasProfanity) {
      setAppError("Lütfen form alanlarına geçerli ve uygun şirket/şehir bilgileri giriniz.");
      return;
    }

    // Şehir adına geçersiz/anlamsız yazı yazılmasını engellemek için kontrol
    const isCityValid = VALID_CITIES.some((city) => lowerAddress.includes(city));
    if (!isCityValid) {
      setAppError("Lütfen geçerli bir il/şehir adı giriniz (Örn: Kocaeli, İstanbul vb.).");
      return;
    }

    setSubmittingApp(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        role: "isveren",
        company_name: companyName,
        tax_number: cleanTax,
        sector,
        phone,
        location: address,
        approval_status: "beklemede",
      })
      .eq("id", user.id);

    if (error) {
      setAppError("Başvuru gönderilemedi: " + error.message);
      setSubmittingApp(false);
    } else {
      // Başarılı olduğunda state'i anında güncelleyerek "Onay Sürecindesiniz" ekranına düşür
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setProfile(data);
      }
      setSubmittingApp(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess("");

    const { error } = await supabase
      .from("profiles")
      .update({ logo_url: logoUrl, banner_url: bannerUrl, about })
      .eq("id", user.id);

    if (!error) {
      setProfileSuccess("Şirket profili başarıyla güncellendi!");
      setTimeout(() => setProfileSuccess(""), 3000);
    } else {
      alert("Güncelleme hatası: " + error.message);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (myListings.length >= MAX_LISTING_LIMIT) {
      setFormError(`Maksimum ilan limitine (${MAX_LISTING_LIMIT}) ulaştınız.`);
      return;
    }

    const { error } = await supabase.from("job_listings").insert({
      employer_id: user.id,
      title,
      company_name: profile.company_name || "Şirket",
      location: profile.location || "Türkiye",
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
      setDepartment("");
      setDescription("");
      setRequirements("");
      fetchMyListings(user.id);
      setTimeout(() => {
        setIsModalOpen(false);
        setFormSuccess("");
      }, 1500);
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("job_listings").delete().eq("id", id);
    if (!error) {
      setMyListings(myListings.filter((item) => item.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 container-x py-20 text-center text-muted-foreground">Paneller yükleniyor...</main>
        <Footer />
      </div>
    );
  }

  const hasApplied = profile?.role === "isveren";
  const isApproved = profile?.approval_status === "onaylandi";
  const isPending = profile?.approval_status === "beklemede" || profile?.approval_status === "reddedildi";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 container-x py-10">

        {/* 1. Başvuru Yapılmamışsa Form */}
        {!hasApplied && (
          <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="text-center mb-8">
              <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                <Building2 className="size-7" />
              </div>
              <h1 className="text-2xl font-bold">İşletme Hesabı Başvuru Formu</h1>
              <p className="text-sm text-muted-foreground mt-1">Stajyer ilanları yayınlayabilmek için şirket bilgilerinizi eksiksiz doldurun.</p>
            </div>

            {appError && (
              <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                <AlertCircle className="size-5 shrink-0" /> {appError}
              </div>
            )}

            <form onSubmit={handleEmployerApplication} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-xs text-muted-foreground">Şirket / İşletme Adı</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    placeholder="Örn: Yıldız CNC Mühendislik"
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5"
                  />
                </div>
                <div>
                  <label className="font-semibold text-xs text-muted-foreground">Vergi Numarası (Tam 10 Hane)</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={taxNumber}
                    onChange={(e) => setTaxNumber(e.target.value.replace(/\D/g, ""))}
                    required
                    placeholder="1234567890"
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-xs text-muted-foreground">Faaliyet Sektörü</label>
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    required
                    placeholder="Örn: İmalat / Yazılım"
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5"
                  />
                </div>
                <div>
                  <label className="font-semibold text-xs text-muted-foreground">İşletme Telefonu</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="0262 000 00 00"
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-xs text-muted-foreground">Şehir / Konum (Örn: Kocaeli)</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="Kocaeli"
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5"
                />
              </div>

              <button
                type="submit"
                disabled={submittingApp}
                className="w-full mt-4 rounded-xl bg-primary py-3 font-semibold text-primary-foreground shadow hover:bg-primary/90 transition"
              >
                {submittingApp ? "Gönderiliyor..." : "İşletme Başvurusunu Tamamla"}
              </button>
            </form>
          </div>
        )}

        {/* 2. Başvuru Yapılmış ve Onay Bekleniyorsa */}
        {hasApplied && isPending && (
          <div className="max-w-xl mx-auto text-center p-10 rounded-2xl border border-amber-500/20 bg-amber-500/5 shadow-sm">
            <Clock className="size-14 mx-auto text-amber-500 mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold">Onaylama Sürecindesiniz</h2>
            <p className="text-muted-foreground text-sm mt-2">
              <strong>{profile.company_name}</strong> adına yaptığınız işletme başvurusu şu anda yöneticilerimiz tarafından incelenmektedir. Onaylandığında tam yetkili işletme paneline erişebileceksiniz.
            </p>
          </div>
        )}

        {/* 3. Onaylanmış İşletme Paneli */}
        {hasApplied && isApproved && (
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 md:p-8 rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex items-center gap-4">
                {profile.logo_url ? (
                  <img src={profile.logo_url} alt="Logo" className="size-16 rounded-xl object-cover border border-border" />
                ) : (
                  <div className="size-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl">
                    {profile.company_name?.charAt(0) || "İ"}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
                      <ShieldCheck className="size-3.5" /> Onaylı İşletme
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold">{profile.company_name}</h1>
                  <p className="text-xs text-muted-foreground">{profile.sector} — {profile.location}</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition"
              >
                <Plus className="size-4" /> Yeni Staj İlanı Ekle ({myListings.length}/{MAX_LISTING_LIMIT})
              </button>
            </div>

            {/* Profil Düzenleme */}
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Building2 className="size-5 text-primary" /> Şirket Profili ve Görselleri
              </h2>
              {profileSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0" /> {profileSuccess}
                </div>
              )}
              <form onSubmit={handleUpdateProfile} className="space-y-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-xs text-muted-foreground">Logo URL</label>
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://ornek.com/logo.png"
                      className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-xs text-muted-foreground">Kapak / Banner URL</label>
                    <input
                      type="url"
                      value={bannerUrl}
                      onChange={(e) => setBannerUrl(e.target.value)}
                      placeholder="https://ornek.com/banner.png"
                      className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-xs text-muted-foreground">Şirket Hakkında</label>
                  <textarea
                    rows={3}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Şirket açıklaması..."
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5"
                  />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="rounded-xl bg-secondary px-6 py-2.5 font-semibold text-secondary-foreground hover:bg-secondary/80 transition">
                    Profili Güncelle
                  </button>
                </div>
              </form>
            </div>

            {/* İlan Listesi */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Yayınlanan İlanlar ({myListings.length} / {MAX_LISTING_LIMIT})</h2>
              {myListings.length === 0 ? (
                <div className="text-center py-12 rounded-2xl border border-border bg-card p-8">
                  <Briefcase className="size-10 mx-auto text-muted-foreground mb-3 opacity-50" />
                  <h3 className="font-semibold">Aktif İlanınız Bulunmuyor</h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myListings.map((item) => (
                    <div key={item.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm">
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">{item.work_type}</span>
                          <button onClick={() => handleDeleteListing(item.id)} className="text-muted-foreground hover:text-destructive transition p-1">
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        <h3 className="font-bold text-lg">{item.title}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1"><MapPin className="size-3.5" /> {item.location} — {item.department}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* İlan Ekleme Modalı */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Yeni Staj İlanı Yayınla</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground">✕</button>
              </div>
              {formError && <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-medium">{formError}</div>}
              {formSuccess && <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-medium">{formSuccess}</div>}
              <form onSubmit={handleCreateListing} className="space-y-4 text-sm">
                <div>
                  <label className="font-semibold text-xs text-muted-foreground">İlan Başlığı</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Örn: Yaz Stajyeri" className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-xs text-muted-foreground">Şehir / Lokasyon</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="Kocaeli" className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5" />
                  </div>
                  <div>
                    <label className="font-semibold text-xs text-muted-foreground">Çalışma Şekli</label>
                    <select value={workType} onChange={(e) => setWorkType(e.target.value)} className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5">
                      <option value="Yüz Yüze">Yüz Yüze</option>
                      <option value="Uzaktan">Uzaktan</option>
                      <option value="Hibrit">Hibrit</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-xs text-muted-foreground">Departman</label>
                  <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} required placeholder="Üretim" className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5" />
                </div>
                <div>
                  <label className="font-semibold text-xs text-muted-foreground">Açıklama</label>
                  <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5" />
                </div>
                <div>
                  <label className="font-semibold text-xs text-muted-foreground">Aranan Nitelikler</label>
                  <textarea rows={3} value={requirements} onChange={(e) => setRequirements(e.target.value)} required className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 rounded-xl bg-primary py-3 font-semibold text-primary-foreground">Yayınla</button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl bg-muted px-6 py-3 font-semibold">İptal</button>
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