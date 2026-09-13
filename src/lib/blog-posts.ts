export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  author: { name: string; initials: string };
  date: string;
  readTime: string;
  featured?: boolean;
  gradient: string;
};

// ---------------------------------------------------------------------------
// Mock içerik — gerçek verilerle değiştirmek için:
// Supabase'de bir `posts` tablosu oluşturup burada `useQuery` ile çekebilirsin.
// Şimdilik statik veri sayesinde blog aktif ve kullanılabilir durumda.
// ---------------------------------------------------------------------------

export const POSTS: Post[] = [
  {
    id: "1",
    slug: "staj-basvurusunda-dikkat-edilmesi-gerekenler",
    title: "Staj Başvurusunda Dikkat Edilmesi Gereken 7 Nokta",
    excerpt:
      "İlk staj başvurunu yapmadan önce bilmen gereken pratik ipuçları: doğru pozisyonu seçmekten ön yazı hazırlamaya kadar her şey.",
    content: [
      "Staj başvuru sürecine başlamadan önce hangi sektörde ve hangi rolde deneyim kazanmak istediğini netleştirmek, zamanını doğru yerlere ayırmanı sağlar.",
      "İlan metnini dikkatli oku ve şirketin aradığı yetkinliklerle senin CV'nde vurguladığın noktaların örtüştüğünden emin ol.",
      "Ön yazıyı her başvuru için ayrı ayrı, o şirkete özel yazmak; genel bir şablon göndermekten çok daha fazla dikkat çeker.",
      "Referanslarını ve varsa daha önceki proje çıktılarını başvurunla birlikte paylaşmak, seni diğer adaylardan ayırabilir.",
      "Başvurudan sonra bir hafta içinde nazik bir takip e-postası göndermek profesyonel bir izlenim bırakır.",
      "Sosyal medya hesaplarını gözden geçir; işverenler başvurudan önce bu hesaplara göz atabilir.",
      "Son olarak, ret cevabı almaktan çekinme — her başvuru, bir sonraki için deneyim kazandırır.",
    ],
    category: "Staj Süreçleri",
    author: { name: "Elif Kaya", initials: "EK" },
    date: "8 Eyl 2026",
    readTime: "6 dk",
    featured: true,
    gradient: "from-primary/25 via-primary/10 to-transparent",
  },
  {
    id: "2",
    slug: "mulakatta-en-cok-sorulan-10-soru",
    title: "Mülakatta En Çok Sorulan 10 Soru ve Cevap Stratejileri",
    excerpt:
      "İK uzmanlarının sıkça sorduğu klasik soruları ve bu sorulara özgüvenle nasıl yanıt verebileceğini derledik.",
    content: [
      "\"Kendinden bahseder misin?\" sorusu genellikle mülakatın açılışıdır; kısa, öz ve pozisyonla ilgili bir özet hazırlamak işini kolaylaştırır.",
      "\"Neden bizi seçtin?\" sorusuna hazırlıksız yakalanmamak için şirket hakkında önceden araştırma yapmak şart.",
      "Güçlü ve zayıf yönlerini anlatırken somut örneklerle desteklemek, cevabını daha inandırıcı kılar.",
      "\"Beş yıl sonra kendini nerede görüyorsun?\" gibi sorular, kariyer hedeflerinin şirketin sunduklarıyla uyumunu ölçmek içindir.",
      "Maaş beklentisi sorulduğunda araştırılmış bir aralık vermek, ne çok düşük ne de çok yüksek bir rakamla karşılaşmanı önler.",
    ],
    category: "Mülakat İpuçları",
    author: { name: "Ahmet Yılmaz", initials: "AY" },
    date: "5 Eyl 2026",
    readTime: "8 dk",
    gradient: "from-amber-500/25 via-amber-500/10 to-transparent",
  },
  {
    id: "3",
    slug: "etkili-bir-cv-nasil-hazirlanir",
    title: "İşe Alım Uzmanlarının Gözünden Etkili Bir CV Nasıl Hazırlanır?",
    excerpt:
      "Ortalama bir CV'ye 7 saniye bakılıyor. Bu sürede fark yaratman için tasarım, içerik ve dil önerileri.",
    content: [
      "CV'nin en üst kısmında iletişim bilgilerin ve kısa bir profesyonel özet yer almalı; bu alan ilk göze çarpan kısımdır.",
      "Deneyimlerini anlatırken görev tanımı yerine ölçülebilir sonuçlara odaklanmak, katkını daha net gösterir.",
      "Tek sayfa kuralı yeni mezunlar için genellikle geçerlidir; gereksiz detaylardan kaçınmak okunabilirliği artırır.",
      "Kullandığın yazı tipi ve boşluk düzeni kadar, dosya adını da düzenli bırakmak profesyonel bir izlenim yaratır.",
    ],
    category: "CV Hazırlama",
    author: { name: "Zeynep Arslan", initials: "ZA" },
    date: "2 Eyl 2026",
    readTime: "5 dk",
    gradient: "from-sky-500/25 via-sky-500/10 to-transparent",
  },
  {
    id: "4",
    slug: "kariyer-hedefi-belirleme-rehberi",
    title: "Üniversite Sonrası Kariyer Hedefini Nasıl Belirlersin?",
    excerpt:
      "Doğru sektörü ve rolü seçmek için kendine sorman gereken sorular ile adım adım bir yol haritası.",
    content: [
      "Hangi işlerde zaman kavramını kaybettiğini fark etmek, doğal olarak ilgi duyduğun alanları ortaya çıkarır.",
      "Farklı sektörlerden kişilerle kısa görüşmeler yapmak (informational interview), o alanın gerçek yüzünü görmene yardımcı olur.",
      "Kısa vadeli hedeflerini (1 yıl) ve uzun vadeli hedeflerini (5 yıl) ayrı ayrı yazmak, yol haritanı netleştirir.",
    ],
    category: "Kariyer Planlama",
    author: { name: "Mert Demir", initials: "MD" },
    date: "29 Ağu 2026",
    readTime: "7 dk",
    gradient: "from-violet-500/25 via-violet-500/10 to-transparent",
  },
  {
    id: "5",
    slug: "2026-teknoloji-sektorunde-staj-trendleri",
    title: "2026'da Teknoloji Sektöründe Staj Trendleri",
    excerpt:
      "Uzaktan stajlar, yapay zeka odaklı roller ve şirketlerin genç yeteneklerden beklentileri neler değişti?",
    content: [
      "Hibrit ve tamamen uzaktan staj programları artık pek çok teknoloji şirketinde standart hale geldi.",
      "Yapay zeka araçlarını günlük iş akışına entegre edebilme becerisi, adaylar arasında ayırt edici bir kriter olmaya başladı.",
      "Şirketler artık teknik bilgi kadar, takım içinde etkili iletişim kurabilme yetkinliğine de önem veriyor.",
    ],
    category: "Sektör Haberleri",
    author: { name: "Selin Aydın", initials: "SA" },
    date: "24 Ağu 2026",
    readTime: "4 dk",
    gradient: "from-emerald-500/25 via-emerald-500/10 to-transparent",
  },
  {
    id: "6",
    slug: "on-yazi-nasil-yazilir",
    title: "Başvurunu Öne Çıkaracak Bir Ön Yazı Nasıl Yazılır?",
    excerpt:
      "Şablon cümlelerden uzak, samimi ve özgün bir ön yazı ile işverenin dikkatini nasıl çekersin?",
    content: [
      "Ön yazına genel bir giriş yerine, o şirketle ilgili gerçekten dikkatini çeken bir detayla başlamak samimiyet katar.",
      "CV'nde zaten yazılı olan bilgileri tekrar etmek yerine, oradaki deneyimlerin arkasındaki motivasyonu anlatmak daha etkilidir.",
      "Kapanışta net bir sonraki adım önerisi (görüşme talebi gibi) bırakmak, ön yazını eyleme geçiren bir hale getirir.",
    ],
    category: "CV Hazırlama",
    author: { name: "Elif Kaya", initials: "EK" },
    date: "20 Ağu 2026",
    readTime: "5 dk",
    gradient: "from-rose-500/25 via-rose-500/10 to-transparent",
  },
  {
    id: "7",
    slug: "staj-sonrasi-tam-zamanli-teklif-almak",
    title: "Stajını Tam Zamanlı Bir Teklife Nasıl Dönüştürürsün?",
    excerpt:
      "Staj boyunca fark yaratıp ekip içinde görünür olmanın, süreç sonunda teklif almanı sağlayan davranış kalıpları.",
    content: [
      "Verilen görevleri zamanında teslim etmenin ötesinde, süreç hakkında proaktif geri bildirim istemek görünürlüğünü artırır.",
      "Takımdaki farklı kişilerle düzenli, kısa bir araya gelmeler kurmak, staj sonunda seni destekleyecek bir ağ oluşturur.",
      "Staj bitmeden yöneticinle açıkça tam zamanlı ilgini konuşmak, sürecin nasıl ilerleyeceğini netleştirir.",
    ],
    category: "Staj Süreçleri",
    author: { name: "Ahmet Yılmaz", initials: "AY" },
    date: "15 Ağu 2026",
    readTime: "6 dk",
    gradient: "from-primary/25 via-primary/10 to-transparent",
  },
  {
    id: "8",
    slug: "davranissal-mulakat-sorulari",
    title: "Davranışsal Mülakat Soruları İçin STAR Tekniği",
    excerpt:
      "'Bana zorlu bir durumu nasıl yönettiğini anlat' tarzı sorulara yapılandırılmış ve etkili cevaplar verme yöntemi.",
    content: [
      "STAR tekniği; Durum (Situation), Görev (Task), Aksiyon (Action) ve Sonuç (Result) olmak üzere dört adımdan oluşur.",
      "Cevabına önce kısaca bağlamı (durum ve görev) anlatarak başlamak, dinleyenin seni takip etmesini kolaylaştırır.",
      "Aksiyon kısmında 'biz' değil 'ben ne yaptım' diline odaklanmak, kendi katkını net şekilde ortaya koyar.",
      "Sonuç kısmını mümkünse sayılarla desteklemek (örn. süreyi %20 kısalttım), cevabını daha somut hale getirir.",
    ],
    category: "Mülakat İpuçları",
    author: { name: "Zeynep Arslan", initials: "ZA" },
    date: "10 Ağu 2026",
    readTime: "5 dk",
    gradient: "from-amber-500/25 via-amber-500/10 to-transparent",
  },
];