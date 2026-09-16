import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  Check,
  ChevronRight,
  Coins,
  GraduationCap,
  Maximize2,
  Minimize2,
  MousePointer2,
  Printer,
  Search,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import slideCss from "../slayt.css?url";

export const Route = createFileRoute("/slayt")({
  head: () => ({
    meta: [
      { title: "Türkiye'de Staj Pazarı • StajyerBul" },
      {
        name: "description",
        content:
          "StajyerBul pazar sunumu: aylık talep senaryoları, erişim hedefleri ve reklam geliri hesaplaması.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [
      { rel: "stylesheet", href: slideCss },
      { rel: "canonical", href: "https://stajyerbul.com.tr/slayt" },
    ],
  }),
  component: SlidePage,
});

// Illustrative planning data adapted from the supplied reference, not measured traffic.
// Future months deliberately have no values; missing is different from zero.
const months = [
  { month: "Ocak", short: "Oca", students: 160000, businesses: 18000 },
  { month: "Şubat", short: "Şub", students: 250000, businesses: 24000 },
  { month: "Mart", short: "Mar", students: 310000, businesses: 26000 },
  { month: "Nisan", short: "Nis", students: 350000, businesses: 30000 },
  { month: "Mayıs", short: "May", students: 380000, businesses: 35000 },
  { month: "Haziran", short: "Haz", students: 280000, businesses: 39000 },
  { month: "Temmuz", short: "Tem", students: 340000, businesses: 32000 },
  { month: "Ağustos", short: "Ağu", students: 360000, businesses: 42000 },
  { month: "Eylül", short: "Eyl", students: 320000, businesses: 38000 },
  { month: "Ekim", short: "Eki", students: null, businesses: null },
  { month: "Kasım", short: "Kas", students: null, businesses: null },
  { month: "Aralık", short: "Ara", students: null, businesses: null },
];
const number = (value: number) =>
  new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(value);
const sourceUrl =
  "https://www.cbiko.gov.tr/haberler/yuz-binlerce-gence-staj-imkani-sunan-ulusal-staj-programinin-2025-yili-basvurulari-basladi";

function SlidePage() {
  const [series, setSeries] = useState<"all" | "students" | "businesses">("all");
  const [pageviews, setPageviews] = useState(300000);
  const [fullscreen, setFullscreen] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const update = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
      setNotice("");
    } catch {
      setNotice(
        "Bu tarayıcı tam ekranı desteklemiyor. Tarayıcınızın tam ekran seçeneğini kullanabilirsiniz.",
      );
    }
  };
  const ceiling = series === "businesses" ? 60000 : 450000;

  return (
    <div className="slayt-page">
      <div className="slayt-shell">
        <header className="slayt-topbar">
          <Link to="/" className="slayt-brand" aria-label="StajyerBul ana sayfa">
            <span className="slayt-brand-icon">
              <GraduationCap size={29} />
            </span>
            <span>
              Stajyer<span className="slayt-blue">Bul</span>
              <small>Aradığın stajyeri bul.</small>
            </span>
          </Link>
          <div className="slayt-topright">
            <span className="slayt-date">
              <i /> Eylül 2026 · Pazar sunumu
            </span>
            <button
              className="slayt-icon-button"
              type="button"
              onClick={() => window.print()}
              aria-label="Yazdır veya PDF olarak kaydet"
              title="Yazdır / PDF"
            >
              <Printer size={18} />
            </button>
            <button
              className="slayt-icon-button"
              type="button"
              onClick={toggleFullscreen}
              aria-label={fullscreen ? "Tam ekrandan çık" : "Tam ekran sunum"}
              title="Tam ekran"
            >
              {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </header>
        {notice && (
          <p role="status" className="slayt-notice">
            {notice}
          </p>
        )}

        <main>
          <section className="slayt-hero" aria-labelledby="slide-title">
            <div>
              <p className="slayt-eyebrow">
                <span /> TÜRKİYE’DE STAJ EKOSİSTEMİ
              </p>
              <h1 id="slide-title">
                Büyük bir pazar.
                <br />
                <span>Daha güçlü bir gelecek.</span>
              </h1>
              <p className="slayt-intro">
                Staj arayan öğrenciler ile doğru yeteneği arayan işletmeleri buluşturan fırsat.
                Türkiye’nin staj pazarına, büyüme hedeflerimize ve potansiyelimize bir bakış.
              </p>
            </div>
            <div className="slayt-hero-note">
              <ArrowUpRight size={36} />
              <p>
                Öğrenciler için fırsat.
                <br />
                İşletmeler için <strong>doğru yetenek.</strong>
              </p>
              <span>STAJYERBUL / PAZAR GÖRÜNÜMÜ</span>
            </div>
          </section>

          <section className="slayt-metrics" aria-label="Pazar göstergeleri">
            <article className="slayt-card slayt-metric">
              <div className="slayt-card-top">
                <span className="slayt-icon blue">
                  <GraduationCap size={22} />
                </span>
                <span className="slayt-badge">Resmî · kümülatif</span>
              </div>
              <h2>Ulusal Staj Programı</h2>
              <p className="slayt-big">
                1,25 <span>milyon</span>
              </p>
              <p className="slayt-unit">2019’dan 2025 başvuru duyurusuna kadar</p>
              <p className="slayt-muted">
                Programın toplam öğrenci başvurusu. Türkiye’deki staj talebinin ölçeğine bir
                gösterge.
              </p>
              <a className="slayt-source" href={sourceUrl} target="_blank" rel="noreferrer">
                Cumhurbaşkanlığı İnsan Kaynakları Ofisi <ArrowUpRight size={13} />
              </a>
            </article>
            <article className="slayt-card slayt-metric">
              <div className="slayt-card-top">
                <span className="slayt-icon blue">
                  <Users size={22} />
                </span>
                <span className="slayt-badge">Tahmini senaryo</span>
              </div>
              <h2>Aylık öğrenci potansiyeli</h2>
              <p className="slayt-big">
                420<span> bin</span>
              </p>
              <p className="slayt-unit">öğrenci / ay varsayımı</p>
              <p className="slayt-muted">
                Lise, ön lisans ve lisans düzeyindeki staj arayışları için planlama senaryosu.
              </p>
              <span className="slayt-footnote">Platformun mevcut kullanıcı sayısı değildir.</span>
            </article>
            <article className="slayt-card slayt-metric green">
              <div className="slayt-card-top">
                <span className="slayt-icon green">
                  <Building2 size={22} />
                </span>
                <span className="slayt-badge">Tahmini senaryo</span>
              </div>
              <h2>Aylık işletme potansiyeli</h2>
              <p className="slayt-big">
                20<span> bin</span>
              </p>
              <p className="slayt-unit">işletme / ay varsayımı</p>
              <p className="slayt-muted">
                Yeni yeteneklerle buluşmak isteyen işletmeler için öngörülen potansiyel.
              </p>
              <span className="slayt-footnote">Ölçülmüş işletme sayısı değildir.</span>
            </article>
            <article className="slayt-card slayt-metric purple">
              <div className="slayt-card-top">
                <span className="slayt-icon purple">
                  <TrendingUp size={22} />
                </span>
                <span className="slayt-badge">Büyüme hedefi</span>
              </div>
              <h2>Bahar dönemi fırsatı</h2>
              <p className="slayt-big">%120</p>
              <p className="slayt-unit">talep artışı hedef senaryosu</p>
              <p className="slayt-muted">
                Şubat–Mayıs dönemi için kampanya ve içerik planlamasında kullanılan büyüme
                varsayımı.
              </p>
              <span className="slayt-footnote">Doğrulanmış sektör artış oranı değildir.</span>
            </article>
          </section>

          <div className="slayt-main-grid">
            <section className="slayt-card slayt-chart-card" aria-labelledby="chart-title">
              <div className="slayt-section-heading">
                <div>
                  <p className="slayt-kicker">TALEBİN RİTMİ</p>
                  <h2 id="chart-title">Aylık staj arama eğilimi</h2>
                </div>
                <span className="slayt-badge">2026 · Temsilî</span>
              </div>
              <div className="slayt-chart-tools">
                <div className="slayt-legend">
                  <span>
                    <i className="blue" />
                    Öğrenciler
                  </span>
                  <span>
                    <i className="green" />
                    İşletmeler
                  </span>
                </div>
                <div
                  className="slayt-segments"
                  role="group"
                  aria-label="Grafikte gösterilecek seri"
                >
                  {(
                    [
                      ["all", "Tümü"],
                      ["students", "Öğrenci"],
                      ["businesses", "İşletme"],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={series === key}
                      onClick={() => setSeries(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div
                className="slayt-chart-scroll"
                tabIndex={0}
                role="region"
                aria-label="Aylık grafik; küçük ekranda yatay kaydırılabilir"
              >
                <div className="slayt-chart">
                  <div className="slayt-axis">
                    {[1, 2 / 3, 1 / 3, 0].map((value) => (
                      <span key={value}>{number((ceiling * value) / 1000)} bin</span>
                    ))}
                  </div>
                  <div className="slayt-plot">
                    <div className="slayt-gridlines" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                    <div className="slayt-bars">
                      {months.map((item) => (
                        <div
                          className={`slayt-month ${item.students === null ? "future" : ""}`}
                          key={item.month}
                          tabIndex={0}
                          aria-label={
                            item.students === null
                              ? `${item.month}: veri yok`
                              : `${item.month}: ${number(item.students)} öğrenci, ${number(item.businesses!)} işletme, temsilî senaryo`
                          }
                        >
                          <div className="slayt-bar-pair">
                            {item.students !== null && series !== "businesses" && (
                              <div
                                className="slayt-bar student"
                                style={{ height: `${(item.students / ceiling) * 100}%` }}
                              />
                            )}
                            {item.businesses !== null && series !== "students" && (
                              <div
                                className="slayt-bar business"
                                style={{ height: `${(item.businesses / ceiling) * 100}%` }}
                              />
                            )}
                          </div>
                          <span className="slayt-month-label">{item.short}</span>
                          <div className="slayt-tooltip" aria-hidden="true">
                            <strong>{item.month}</strong>
                            {item.students === null ? (
                              <span>Henüz veri yok</span>
                            ) : (
                              <>
                                <span>Öğrenci: {number(item.students)}</span>
                                <span>İşletme: {number(item.businesses!)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <span className="slayt-future-label">
                      Sonraki aylar
                      <br />
                      <strong>Henüz veri yok</strong>
                    </span>
                  </div>
                </div>
              </div>
              <div className="slayt-chart-caption">
                <span>
                  <MousePointer2 size={14} /> Değerler için aya dokun veya üzerine gel.
                </span>
                <span>Ekim – Aralık boş bırakıldı.</span>
              </div>
              <p className="slayt-footnote">
                Ocak–Eylül sütunları referans görselden uyarlanan temsilî değerlerdir; gerçek trafik
                veya Google Trends ölçümü değildir.
              </p>
            </section>

            <section className="slayt-card slayt-search-card">
              <div className="slayt-section-heading">
                <div>
                  <p className="slayt-kicker">ORGANİK KEŞİF</p>
                  <h2>Aramalardaki fırsat</h2>
                </div>
                <span className="slayt-icon blue">
                  <Search size={22} />
                </span>
              </div>
              <p className="slayt-muted">Öğrenci ve işverenin arama niyetine göre içerik planı.</p>
              <div className="slayt-search-row">
                <div>
                  <span className="slayt-search-label">Öğrenci odaklı</span>
                  <p>staj · staj ilanları · staj başvurusu</p>
                </div>
                <strong>
                  300 bin<span>/ ay varsayımı</span>
                </strong>
              </div>
              <div className="slayt-search-row">
                <div>
                  <span className="slayt-search-label green">İşletme odaklı</span>
                  <p>stajyer · stajyer ilanları · stajyer bul</p>
                </div>
                <strong>
                  100 bin<span>/ ay varsayımı</span>
                </strong>
              </div>
              <div className="slayt-search-total">
                <span>
                  Toplam arama senaryosu<small>İki grubun toplamı</small>
                </span>
                <strong>
                  400 bin <ArrowUpRight size={23} />
                </strong>
              </div>
              <p className="slayt-footnote">
                Anahtar kelime hacimleri doğrulanmamış planlama varsayımlarıdır. Arama sayısı, tekil
                kişi veya site ziyareti anlamına gelmez.
              </p>
            </section>
          </div>

          <div className="slayt-bottom-grid">
            <section className="slayt-card slayt-goals">
              <div className="slayt-section-heading">
                <div>
                  <p className="slayt-kicker">BÜYÜME ROTAMIZ</p>
                  <h2>Aylık erişim hedefi</h2>
                </div>
                <Target size={26} />
              </div>
              <div className="slayt-goal-grid">
                {[
                  { time: "İlk 6 ay", value: "50 bin", label: "Başlangıç" },
                  { time: "6–12 ay", value: "150 bin", label: "Büyüme" },
                  { time: "12+ ay", value: "300 bin+", label: "Ölçeklenme" },
                ].map((goal, i) => (
                  <div key={goal.time}>
                    <span className="slayt-step">0{i + 1}</span>
                    <p>{goal.label}</p>
                    <strong>{goal.value}</strong>
                    <span>ziyaretçi / ay</span>
                    <small>{goal.time}</small>
                  </div>
                ))}
              </div>
              <p className="slayt-footnote">
                Başlangıç tarihinden itibaren hedefler; gerçekleşmiş sonuç değildir.
              </p>
            </section>
            <section className="slayt-card slayt-revenue">
              <div className="slayt-section-heading">
                <div>
                  <p className="slayt-kicker">GELİR POTANSİYELİ</p>
                  <h2>AdSense gelir senaryosu</h2>
                </div>
                <span className="slayt-icon blue">
                  <Coins size={23} />
                </span>
              </div>
              <label className="slayt-range-label" htmlFor="slide-pageviews">
                Aylık sayfa görüntüleme <strong>{number(pageviews)}</strong>
              </label>
              <input
                id="slide-pageviews"
                type="range"
                min="10000"
                max="1000000"
                step="10000"
                value={pageviews}
                onChange={(event) => setPageviews(Number(event.target.value))}
                aria-valuetext={`${number(pageviews)} sayfa görüntüleme`}
              />
              <div className="slayt-income-grid" aria-live="polite">
                {[
                  { label: "Düşük", rpm: 25 },
                  { label: "Orta", rpm: 100 },
                  { label: "Yüksek", rpm: 250 },
                ].map((scenario) => (
                  <div key={scenario.rpm}>
                    <span>{scenario.label} senaryo</span>
                    <strong>
                      {number((pageviews / 1000) * scenario.rpm)} <small>TL</small>
                    </strong>
                    <small>{scenario.rpm} TL sayfa RPM / ay</small>
                  </div>
                ))}
              </div>
              <p className="slayt-footnote">
                Hesap: görüntüleme ÷ 1.000 × varsayılan sayfa RPM. RPM değerleri örnektir; gerçek
                gelir ve AdSense onayı garanti edilmez. Ziyaretçi ile sayfa görüntüleme farklıdır.
              </p>
            </section>
          </div>

          <section className="slayt-thesis">
            <span className="slayt-icon blue">
              <TrendingUp size={22} />
            </span>
            <h2>Neden bu pazar?</h2>
            <div>
              {[
                "Her yıl yenilenen öğrenci kitlesi",
                "Farklı sektörlerde yetenek ihtiyacı",
                "İçerikle organik büyüme fırsatı",
              ].map((text) => (
                <span key={text}>
                  <Check size={16} />
                  {text}
                </span>
              ))}
            </div>
          </section>
          <details className="slayt-method">
            <summary>
              Veri notları ve kaynaklar <ChevronRight size={16} />
            </summary>
            <p>
              Bu sayfa bir pazar sunumudur. Ulusal Staj Programı kartındaki 1,25 milyon başvuru,
              resmî 2025 başvuru duyurusunda belirtilen 2019’dan itibaren kümülatif toplamdır; tek
              döneme veya StajyerBul’a ait değildir. Diğer pazar hacimleri, aylık grafik ve büyüme
              hedefleri paylaşılan referans görselden uyarlanan planlama varsayımlarıdır. Arama
              gruplarının toplamı 300 bin + 100 bin = 400 bin olarak hesaplanmıştır. Ekim, Kasım ve
              Aralık için veri girilmemiştir.
            </p>
            <a href={sourceUrl} target="_blank" rel="noreferrer">
              Resmî Ulusal Staj Programı duyurusu <ArrowUpRight size={14} />
            </a>
          </details>
        </main>
        <footer className="slayt-footer">
          <span>
            <strong>StajyerBul</strong> / stajyerbul.com.tr
          </span>
          <p>Doğru staj, daha parlak bir gelecek.</p>
          <span>
            PAZAR SUNUMU <b>01</b>
          </span>
        </footer>
      </div>
    </div>
  );
}
