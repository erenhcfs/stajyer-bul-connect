import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/kullanim-kosullari")({
  head: () => ({
    meta: [
      { title: "Kullanım Koşulları — StajyerBul" },
      { name: "description", content: "StajyerBul platformu kullanım koşulları." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="container-x flex-1 py-12">
        <article className="legal-content mx-auto max-w-3xl">
          <h1>Kullanım Koşulları</h1>
          <p className="text-sm text-muted-foreground">Son güncelleme: 14 Eylül 2026</p>
          <p>
            StajyerBul, öğrenciler ile işletmelerin staj ilanı, başvuru ve teklif yoluyla iletişim
            kurmasını sağlayan bir aracılık platformudur. Siteyi kullanarak bu koşulları kabul etmiş
            olursunuz.
          </p>
          <h2>Hesap ve içerik sorumluluğu</h2>
          <p>
            Kullanıcılar doğru ve güncel bilgi vermek, hesap güvenliğini korumak ve yalnızca
            paylaşmaya yetkili oldukları içerikleri yüklemekle sorumludur. Yanıltıcı ilanlar,
            ayrımcı içerik, taciz, spam ve hukuka aykırı kullanım yasaktır.
          </p>
          <h2>İşletme ve staj süreçleri</h2>
          <p>
            İşletme hesapları ilan yayınlamadan önce yönetim onayından geçebilir. StajyerBul,
            tarafların işe veya staja kabulünü, ücretini, çalışma koşullarını ya da taraflar
            arasında kurulacak sözleşmeyi garanti etmez. Taraflar karar vermeden önce gerekli
            doğrulamaları kendileri yapmalıdır.
          </p>
          <h2>Moderasyon</h2>
          <p>
            Güvenliği veya platform bütünlüğünü tehdit eden ilanlar kaldırılabilir; hesapların
            erişimi sınırlandırılabilir. Teknik bakım, güvenlik veya zorunlu sebeplerle hizmet
            geçici olarak kesilebilir.
          </p>
          <h2>İletişim</h2>
          <p>
            Koşullar ve platform kullanımıyla ilgili sorular için{" "}
            <Link to="/hakkimizda">iletişim sayfasından</Link> bize ulaşabilirsiniz.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
