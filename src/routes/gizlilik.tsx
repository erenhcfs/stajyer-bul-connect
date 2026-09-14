import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/gizlilik")({
  head: () => ({
    meta: [
      { title: "Gizlilik ve KVKK — StajyerBul" },
      {
        name: "description",
        content: "StajyerBul gizlilik, çerez ve kişisel veri bilgilendirmesi.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="container-x flex-1 py-12">
        <article className="legal-content mx-auto max-w-3xl">
          <h1>Gizlilik ve Kişisel Veriler</h1>
          <p className="text-sm text-muted-foreground">Son güncelleme: 14 Eylül 2026</p>
          <p>
            StajyerBul; hesap oluşturma, profil yayınlama, ilan verme, başvuru ve teklif süreçlerini
            sunabilmek için kullanıcının forma yazdığı kimlik, eğitim, iletişim ve şirket
            bilgilerini işler.
          </p>
          <h2>Verileri neden kullanıyoruz?</h2>
          <p>
            Veriler; hesabı çalıştırmak, tarafları eşleştirmek, kötüye kullanımı önlemek, destek
            vermek ve yasal yükümlülükleri yerine getirmek için kullanılır. Aday iletişim bilgileri
            herkese açık listelerde gösterilmez; yalnızca ilgili başvuru veya kabul edilen teklif
            akışındaki taraflarla paylaşılır.
          </p>
          <h2>Saklama ve hizmet sağlayıcılar</h2>
          <p>
            Kimlik doğrulama, veritabanı ve dosyalar Supabase altyapısında; site dağıtımı Vercel
            veya yapılandırılan barındırma sağlayıcısında tutulabilir. Reklam etkinleştirildiğinde
            Google AdSense çerez veya benzer tanımlayıcılar kullanabilir. Tarayıcı ayarlarından
            çerezleri sınırlandırabilirsiniz.
          </p>
          <h2>Haklarınız</h2>
          <p>
            Profilinizi hesabınızdan güncelleyebilirsiniz. Verilerinize erişme, düzeltme veya silme
            talebi ile diğer KVKK talepleri için <Link to="/hakkimizda">iletişim sayfasından</Link>{" "}
            hesabınızda kullandığınız e-posta adresiyle bize ulaşabilirsiniz.
          </p>
          <h2>Güvenlik</h2>
          <p>
            Yetkilendirme kuralları, sınırlı erişim ve güvenli oturum çerezleri kullanılır. İnternet
            üzerinden hiçbir aktarım yöntemi mutlak güvenlik garantisi vermez; şüpheli bir durum
            fark ederseniz bizimle iletişime geçin.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
