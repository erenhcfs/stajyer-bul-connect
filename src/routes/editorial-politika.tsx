import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/editorial-politika")({
  head: () => ({
    links: [{ rel: "canonical", href: "https://stajyerbul.com.tr/editorial-politika" }],
    meta: [
      { title: "Yayın ve Düzeltme İlkeleri | StajyerBul" },
      {
        name: "description",
        content:
          "StajyerBul içeriklerinin hazırlanma, kaynaklandırma, güncellenme ve düzeltilme ilkeleri.",
      },
    ],
  }),
  component: EditorialPolicyPage,
});

function EditorialPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="container-x flex-1 py-12">
        <article className="legal-content mx-auto max-w-3xl">
          <h1>Yayın ve Düzeltme İlkeleri</h1>
          <p className="text-sm text-muted-foreground">Son güncelleme: 17 Eylül 2026</p>
          <p>
            StajyerBul, öğrencilerin ve işletmelerin karar verirken kullanabileceği açık, anlaşılır
            ve doğrulanabilir içerikler hazırlamayı amaçlar.
          </p>
          <h2>Kaynak kullanımı</h2>
          <p>
            Mevzuat, ücret, sigorta ve kamu programlarıyla ilgili yazılarda öncelikle Resmî Gazete,
            Millî Eğitim Bakanlığı, Çalışma ve Sosyal Güvenlik Bakanlığı, İŞKUR ve SGK gibi birincil
            kaynaklara başvururuz. Bir yazının sonunda kullanılan temel kaynakları listeleriz.
          </p>
          <h2>Tahminler ve hesaplamalar</h2>
          <p>
            Henüz açıklanmamış ücretler hakkında verilen tutarlar yalnızca senaryodur. Varsayılan
            asgari ücret, kullanılan oran ve hesaplama yöntemi yazıda açıkça belirtilir. Tahmini
            tutarlar resmî açıklama olarak sunulmaz ve resmî rakam yayımlandığında içerik
            güncellenir.
          </p>
          <h2>Özgünlük ve reklamlar</h2>
          <p>
            İçerikler StajyerBul için hazırlanır. Reklam verenler yazıların sonucunu veya görüşünü
            belirleyemez. Reklam alanları, editoryal içerikten görsel olarak ayrılır.
          </p>
          <h2>Düzeltme ve güncelleme</h2>
          <p>
            Maddi bir hata tespit edildiğinde yazıyı düzeltir ve güncelleme tarihini yenileriz.
            Okurlar, eksik veya hatalı olduğunu düşündüğü bilgiyi{" "}
            <Link to="/iletisim">iletişim sayfasından</Link> bildirebilir.
          </p>
          <h2>Yazar sorumluluğu</h2>
          <p>
            Yazılar <Link to="/yazarlar/stajyerbul-editorleri">StajyerBul Editörleri</Link>{" "}
            tarafından hazırlanır ve yayımdan önce dil, kaynak ve yanıltıcı ifade kontrolünden
            geçirilir.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
