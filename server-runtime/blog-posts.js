const AUTHOR = "StajyerBul Editörleri";
const DATE = "2026-09-15T09:00:00.000Z";
function post(input) {
    return {
        ...input,
        id: `editorial-${input.slug}`,
        author_name: AUTHOR,
        author_initials: "SB",
        published: true,
        view_count: 0,
        created_at: DATE,
        updated_at: DATE,
        image_url: null,
    };
}
const MEB_RATES = {
    label: "MEB mesleki eğitim ücret oranları",
    url: "https://meb.gov.tr/bakan-ozer-turkiyede-mesleki-egitimin-donusumunu-degerlendirdi/haber/26960/tr",
};
const WAGE_2026 = {
    label: "Çalışma Bakanlığı 2026 asgari ücret hesabı",
    url: "https://www.csgb.gov.tr/poco-pages/asgari-ucret/",
};
export const STATIC_BLOG_POSTS = [
    post({
        slug: "2027-mesem-maaslari-ne-kadar-olacak",
        title: "2027 MESEM Maaşları Ne Kadar Olacak? Güncel Hesaplama",
        excerpt: "2027 MESEM ücretleri henüz açıklanmadı. Mevcut oranlarla olası tutarları ve kesin maaşın nasıl hesaplanacağını inceleyin.",
        category: "Sektör Haberleri",
        seo_title: "2027 MESEM Maaşları Ne Kadar Olacak?",
        seo_description: "2027 MESEM maaşı henüz kesinleşmedi. Çırak ve 12. sınıf kalfa ücretlerini yüzde 30 ve yüzde 50 oranlarıyla senaryolu hesapladık.",
        keywords: ["2027 MESEM maaşı", "MESEM ücretleri", "çırak maaşı 2027", "kalfa maaşı 2027"],
        content: `2027 MESEM maaşı henüz resmî olarak açıklanmadı. Kesin rakam, 2027 yılında geçerli olacak net asgari ücret ilan edildikten sonra hesaplanabilecek. İnternette kesin tutar gibi paylaşılan rakamlara temkinli yaklaşmak gerekir.

## MESEM maaşı hangi kurala göre hesaplanıyor?

Millî Eğitim Bakanlığının açıkladığı mevcut uygulamada 9, 10 ve 11. sınıftaki MESEM öğrencilerine net asgari ücretin en az yüzde 30'u, 12. sınıfta kalfalık yeterliliğini kazanan öğrencilere ise en az yüzde 50'si ödenir. Mevzuat değişirse hesaplama da değişebilir.

## 2026 yılında MESEM maaşı kaç TL?

Çalışma ve Sosyal Güvenlik Bakanlığına göre 2026 net asgari ücret 28.075,50 TL'dir. Mevcut oranlarla yüzde 30 karşılığı 8.422,65 TL, yüzde 50 karşılığı 14.037,75 TL olur.

## 2027 için olası maaş senaryoları

- Net asgari ücret yüzde 20 artarsa 33.690,60 TL olur; yüzde 30 karşılığı 10.107,18 TL, yüzde 50 karşılığı 16.845,30 TL olur.
- Yüzde 25 artarsa yaklaşık 35.094,38 TL olur; yüzde 30 karşılığı yaklaşık 10.528,31 TL, yüzde 50 karşılığı yaklaşık 17.547,19 TL olur.
- Yüzde 30 artarsa 36.498,15 TL olur; yüzde 30 karşılığı 10.949,45 TL, yüzde 50 karşılığı 18.249,08 TL olur.

Bu rakamlar yalnızca hesap örneğidir; zam tahmini veya resmî açıklama değildir.

## Kesin 2027 MESEM ücreti ne zaman belli olur?

Kesin tutar, 2027 asgari ücreti ve ilgili uygulama esasları açıklandığında belli olur. Yeni net asgari ücreti 0,30 ile çarparak 9, 10 ve 11. sınıf tabanını; 0,50 ile çarparak kalfalık yeterliliği bulunan 12. sınıf tabanını hesaplayabilirsin. Okulundan ve resmî kurumlardan güncel bilgiyi ayrıca doğrula.

Son güncelleme: 15 Eylül 2026. Resmî tutar açıklandığında bu yazı güncellenecektir.`,
        sources: [WAGE_2026, MEB_RATES],
        faqs: [
            {
                question: "2027 MESEM maaşı belli oldu mu?",
                answer: "Hayır. 15 Eylül 2026 itibarıyla 2027 net asgari ücret ve kesin MESEM taban ücretleri açıklanmadı.",
            },
            {
                question: "MESEM maaşı nasıl hesaplanır?",
                answer: "Mevcut uygulamada 9, 10 ve 11. sınıflar için net asgari ücretin en az yüzde 30'u; kalfalık yeterliliği bulunan 12. sınıflar için en az yüzde 50'si esas alınır.",
            },
        ],
    }),
    post({
        slug: "2027-stajyer-maasi-ne-kadar-olacak",
        title: "2027 Stajyer Maaşı Ne Kadar Olacak? Hesaplama Rehberi",
        excerpt: "2027 staj ücretinin hangi kurala göre hesaplanacağını, öğrenci türüne ve işletmeye göre değişebilen noktaları öğrenin.",
        category: "Sektör Haberleri",
        seo_title: "2027 Stajyer Maaşı Ne Kadar Olacak?",
        seo_description: "2027 stajyer maaşı henüz açıklanmadı. Mevcut kuralları, net asgari ücret bağlantısını ve hesaplama yöntemini anlattık.",
        keywords: ["2027 stajyer maaşı", "staj ücreti 2027", "zorunlu staj maaşı", "staj parası"],
        content: `2027 stajyer maaşı için bugün kesin bir TL tutarı vermek mümkün değildir. Tutar; 2027 net asgari ücreti, öğrencinin eğitim programı, sınıfı ve tabi olduğu mevzuata göre belirlenir. MESEM öğrencisi ile üniversitede zorunlu staj yapan öğrencinin koşulları aynı olmayabilir.

## Önce öğrenci statünü belirle

MESEM, mesleki ve teknik ortaöğretim, üniversite zorunlu stajı ve isteğe bağlı staj için farklı kurallar veya iş yeri uygulamaları bulunabilir. En güvenilir bilgi okulun staj koordinatörlüğü ile imzalanacak sözleşmededir.

## Ücret sözleşmede açıkça yazmalı

Çalışma günleri, ücret, ödeme tarihi, sigorta işlemini yapacak kurum ve yemek ya da yol desteği yazılı hâle getirilmelidir. Belirsiz ifadeler yerine tutarın veya hesaplama oranının sözleşmede bulunmasını iste.

## 2027 tahmini nasıl yapılabilir?

Yasal tabanı net asgari ücretin belirli bir oranına bağlı olan öğrenciler için yeni asgari ücret açıklandıktan sonra çarpma yapılır. Örneğin programın için yüzde 30 oranı geçerliyse net asgari ücret 0,30 ile çarpılır. Bu yalnızca tabanı gösterir; işveren daha yüksek ödeme yapabilir.

## Kesin bilgi için nereyi takip etmelisin?

Asgari Ücret Tespit Komisyonu açıklamalarını, Resmî Gazete'yi, MEB duyurularını ve okulunun bildirimlerini takip et. Sosyal medyadaki kaynaksız “kesinleşti” paylaşımlarına göre plan yapma.`,
        sources: [WAGE_2026, MEB_RATES],
    }),
    post({
        slug: "mesem-nedir-kayit-sartlari-ve-egitim-sistemi",
        title: "MESEM Nedir? Kayıt Şartları, Eğitim ve İş Yeri Süreci",
        excerpt: "Mesleki Eğitim Merkezi sisteminin nasıl işlediğini, kayıt öncesi hazırlanacakları ve tarafların sorumluluklarını öğrenin.",
        category: "Staj Süreçleri",
        seo_title: "MESEM Nedir? Kayıt Şartları ve Eğitim Sistemi",
        seo_description: "MESEM nedir, kayıt nasıl yapılır, okul ve iş yeri eğitimi nasıl ilerler? Öğrenciler için anlaşılır başlangıç rehberi.",
        keywords: ["MESEM nedir", "MESEM kayıt şartları", "mesleki eğitim merkezi", "MESEM başvuru"],
        content: `MESEM, Mesleki Eğitim Merkezi programının kısa adıdır. Teorik eğitim ile bir işletmedeki uygulamalı meslek eğitimini birlikte yürütmeyi amaçlar. Program sonunda öğrencinin alanına göre kalfalık, ustalık ve diploma süreçleri gündeme gelebilir.

## Kayıttan önce ne yapmalısın?

Yaşadığın yerdeki mesleki eğitim merkezinden güncel alan listesini ve kayıt koşullarını öğren. Mesleğin çalışma ortamına, sağlık ve güvenlik koşullarına ve uzun vadeli gelişim imkânına bak.

## İş yeri bulma aşaması

Uygulamalı eğitim için ilgili meslek alanında uygun bir işletme gerekir. İş yerinin öğrenci eğitmeye uygun olması, sorumlu kişiyi görevlendirmesi ve sözleşmeyi tamamlaması beklenir. Adresi, çalışma saatlerini ve görev tanımını kayıt öncesinde incele.

## Eğitim düzeni nasıl ilerler?

Öğrenci belirli günlerde okulda teorik derslere, diğer günlerde işletmede uygulamalı eğitime katılır. Gün dağılımı ve devam koşulları okul tarafından bildirilir. Devamsızlık, iş güvenliği ve değerlendirme kuralları bağlayıcıdır.

## Sözleşmeyi okumadan imzalama

Ücret, izin, çalışma saatleri, sigorta ve tarafların sorumluluklarını kontrol et. Görev alanın dışında veya tehlikeli bir iş verildiğinde sorumlu öğretmene bildir. Kayıt takvimi ve belgeler değişebileceği için son bilgiyi bağlı olduğun MEB biriminden al.`,
        sources: [
            {
                label: "MEB MESEM kayıt ve program bilgisi",
                url: "https://midyat.meb.gov.tr/www/mesleki-egitim-merkezi-programi-kayit-olma-sureci-basladi/icerik/1296",
            },
        ],
    }),
    post({
        slug: "mesem-maasi-yatmadi-ne-yapmaliyim",
        title: "MESEM Maaşı Yatmadıysa Ne Yapmalısın? Adım Adım Kontrol",
        excerpt: "Ödeme gecikmesinde sözleşme, puantaj, banka ve okul kayıtlarını hangi sırayla kontrol etmeniz gerektiğini öğrenin.",
        category: "Staj Süreçleri",
        seo_title: "MESEM Maaşı Yatmadı: Ne Yapmalıyım?",
        seo_description: "MESEM maaşı yatmadıysa önce hangi kayıtları kontrol etmelisiniz? Okul, işletme ve resmî başvuru adımlarını inceleyin.",
        keywords: ["MESEM maaşı yatmadı", "MESEM ödeme gecikmesi", "çırak maaşı yatmadı", "staj maaşı"],
        content: `MESEM ödemesinin gecikmesi banka bilgisi, eksik puantaj, sözleşme işlemi, devamsızlık kaydı veya işletmenin ödeme sürecinden kaynaklanabilir. Sorunu yazılı kayıtlarla takip etmek çözümü hızlandırır.

## 1. Ödeme gününü ve hesabı kontrol et

Sözleşmedeki ödeme tarihine bak. IBAN'ın kendi adına olup olmadığını ve doğru kaydedilip kaydedilmediğini kontrol et. Kişisel banka bilgilerini başkalarıyla paylaşma.

## 2. İşletmeden yazılı bilgi iste

Muhasebe veya sorumlu usta öğreticiden ödemenin hangi tarihte gönderildiğini ve eksik belge bulunup bulunmadığını sor. Mümkünse yazılı yanıt al; yalnızca sözlü vaatle uzun süre bekleme.

## 3. Okul koordinatörüne bildir

Ödeme yapılmadıysa sözleşme, devam çizelgesi ve işletmeyle yaptığın görüşmenin bilgileriyle okul koordinatörüne başvur. Okul kayıtları karşılaştırıp süreci izleyebilir.

## 4. Belgelerini sakla

Sözleşme örneğini, banka hareketlerini, devam çizelgelerini ve yazışmaları sakla. Gerekirse okul müdürlüğünden veya ilçe millî eğitim müdürlüğünden güncel başvuru yolunu öğren. Bu yazı kişisel hukuki danışmanlık değildir.`,
    }),
    post({
        slug: "mesem-sigortasi-emeklilige-sayilir-mi",
        title: "MESEM Sigortası Emekliliğe Sayılır mı? Kapsamı Nasıl Kontrol Edilir?",
        excerpt: "MESEM öğrencilerinin sigorta kapsamı ile uzun vadeli emeklilik primleri arasındaki farkı ve kontrol adımlarını öğrenin.",
        category: "Staj Süreçleri",
        seo_title: "MESEM Sigortası Emekliliğe Sayılır mı?",
        seo_description: "MESEM sigortasının kapsamı nedir, emeklilik başlangıcı sayılır mı? İş kazası sigortası ile uzun vadeli prim farkı.",
        keywords: ["MESEM sigortası", "MESEM emeklilik", "staj sigortası", "iş kazası sigortası"],
        content: `MESEM ve staj sigortasında sık karıştırılan konu, sigorta kaydı görünmesi ile emekliliğe esas uzun vadeli prim ödenmesinin aynı sanılmasıdır. Öğrenciler için çoğunlukla iş kazası ve meslek hastalığı gibi kısa vadeli sigorta kolları gündeme gelir.

## Sigorta kaydı neden oluşturulur?

Uygulamalı eğitim sırasında yaşanabilecek iş kazası ve meslek hastalığı risklerine karşı öğrencinin korunması amaçlanır. Bu kayıt, normal bir çalışanın tüm sigorta kollarından bildirildiği anlamına gelmeyebilir.

## Emeklilik açısından hangi bilgiye bakılır?

Emeklilik değerlendirmesinde uzun vadeli sigorta kolları, prim günleri ve ilk uzun vadeli sigortalılık tarihi önem taşır. E-Devlet hizmet dökümündeki belge ve sigorta kolu bilgisini incelemek gerekir. Sadece işe giriş tarihi kesin sonuç vermez.

## Kayıt hatalıysa ne yapmalısın?

Okulundan sigorta giriş bildirgesini iste ve hizmet dökümüyle karşılaştır. Hata görürsen okulun ilgili birimi ve SGK ile görüş. Kişisel geçmiş sonucu değiştirebildiği için kesin değerlendirmeyi SGK'dan al.`,
        sources: [
            {
                label: "MEB: MESEM öğrencilerinin sigorta hakkı",
                url: "https://meb.gov.tr/mesleki-egitim-programlariyla-64-bin-mezun-kariyerini-yeniden-planliyor/haber/25855/tr",
            },
        ],
    }),
    post({
        slug: "2026-meslek-lisesi-staj-maasi-hesaplama",
        title: "2026 Meslek Lisesi Staj Maaşı Hesaplama ve Ödeme Rehberi",
        excerpt: "2026 net asgari ücretini temel alarak staj ve mesleki eğitim ücretini nasıl kontrol edeceğinizi öğrenin.",
        category: "Sektör Haberleri",
        seo_title: "2026 Meslek Lisesi Staj Maaşı Hesaplama",
        seo_description: "2026 meslek lisesi staj maaşı nasıl hesaplanır? Net asgari ücret, yüzde 30 oranı, sözleşme ve ödeme kontrolü.",
        keywords: [
            "2026 staj maaşı",
            "meslek lisesi staj maaşı",
            "staj maaşı hesaplama",
            "MESEM maaşı 2026",
        ],
        content: `2026 net asgari ücret 28.075,50 TL'dir. Öğrencinin programında net asgari ücretin yüzde 30'u esas alınıyorsa matematiksel karşılık 8.422,65 TL'dir. Kalfalık yeterliliğini kazanmış MESEM 12. sınıf öğrencileri için yüzde 50 hesabı 14.037,75 TL eder.

## Her stajyer için aynı tutar geçerli mi?

Hayır. Öğrencinin MESEM, mesleki ortaöğretim veya üniversite stajyeri olması sonucu etkileyebilir. İşletmenin çalışan sayısı, okul sözleşmesi ve güncel mevzuat ödeme sürecinde rol oynayabilir.

## Hesaplamayı nasıl kontrol edersin?

Sözleşmendeki oranı ve ücret tanımını bul. Oran net asgari ücrete bağlıysa 28.075,50 TL ile çarp. Eksik gün, devamsızlık veya ay içinde başlayan staj varsa ödeme farklı olabilir; hesap pusulasını iste.

## Ödeme kontrol listesi

- IBAN ve kimlik bilgilerinin doğru olduğunu kontrol et.
- Başlangıç ve bitiş tarihlerini sözleşmeyle karşılaştır.
- Devam çizelgesini zamanında teslim et.
- Ödeme gününü ve sorumlu birimi yazılı öğren.
- Eksik ödeme varsa okul koordinatörüne belgelerle başvur.

Kendi programına uygulanacak kesin tutarı okulundan ve sözleşmenden doğrula.`,
        sources: [WAGE_2026, MEB_RATES],
    }),
    post({
        slug: "zorunlu-staj-yeri-nasil-bulunur",
        title: "Zorunlu Staj Yeri Nasıl Bulunur? Baştan Sona Başvuru Planı",
        excerpt: "Bölümünüze uygun işletmeleri bulmak, başvuruları takip etmek ve okul onayını zamanında almak için uygulanabilir plan.",
        category: "Staj Süreçleri",
        seo_title: "Zorunlu Staj Yeri Nasıl Bulunur?",
        seo_description: "Zorunlu staj yeri bulma süreci: şirket listesi, CV, başvuru takibi, okul onayı ve staj sözleşmesi adımları.",
        keywords: ["zorunlu staj yeri", "staj nasıl bulunur", "staj başvurusu", "üniversite stajı"],
        content: `Zorunlu staj aramaya son haftalarda başlamak seçenekleri azaltır. Okulun staj tarihinden en az iki veya üç ay önce hazırlığa başlamak, görüşmelere ve evrak onayına zaman kazandırır.

## Okul koşullarını yazılı çıkar

Kaç iş günü staj yapacağını, kabul edilen tarihleri, işletmede bulunması gereken birim veya yetkili şartını ve belgeleri öğren. Okulun onaylamayacağı yerde staja başlamak zaman kaybına yol açabilir.

## Hedef işletme listesi oluştur

Büyük şirketlerin yanında KOBİ'leri, organize sanayi bölgelerini, teknopark şirketlerini ve bölümünle ilişkili kurumları araştır. En az 20 işletmelik liste oluştur; iletişim kişisini ve başvuru kanalını kaydet.

## Başvurunu pozisyona göre düzenle

CV'nin üstünde bölümünü, zorunlu staj tarihini ve ilgili becerilerini açıkça belirt. Kısa e-postanda neden o işletmenin alanıyla ilgilendiğini söyle. Aynı genel metni herkese göndermek yerine iki cümleyi işletmeye göre değiştir.

## Takip tablosu kullan

Başvuru tarihi, iletişim adresi, yanıt ve sonraki adımı tek tabloda tut. Beş ila yedi iş günü sonra nazik takip mesajı gönder. Kabul alınca görev tanımını okul koordinatörüne iletip onayı kesinleştir.`,
    }),
    post({
        slug: "staj-icin-cv-nasil-hazirlanir-ornek",
        title: "Staj İçin CV Nasıl Hazırlanır? Deneyimsiz Öğrenci Örneği",
        excerpt: "İş deneyimi olmayan öğrenciler için CV bölümleri, proje anlatımı, beceri seçimi ve sık yapılan hatalar.",
        category: "CV Hazırlama",
        seo_title: "Staj İçin CV Nasıl Hazırlanır? Örnek Rehber",
        seo_description: "Deneyiminiz yoksa staj CV'si nasıl hazırlanır? Eğitim, proje, beceri ve iletişim bölümlerini örneklerle sıralayın.",
        keywords: ["staj CV örneği", "öğrenci CV", "deneyimsiz CV", "staj başvurusu CV"],
        content: `Staj CV'sinin amacı uzun iş geçmişi göstermek değil, öğrenme kapasiteni ve alana ilgini kanıtlamaktır. Bir sayfalık, düzenli ve pozisyona göre uyarlanmış CV çoğu öğrenci için yeterlidir.

## Üst bölümde bulunması gerekenler

Ad soyad, telefon, profesyonel e-posta, şehir ve varsa portfolyo veya proje bağlantısı ekle. Tam açık adres, kimlik numarası, aile bilgileri ve gerekli olmayan hassas verileri yazma.

## Deneyim yerine projelerini anlat

Okul projesi, atölye çalışması, gönüllülük veya kişisel çalışma da deneyim gösterebilir. “Web sitesi yaptım” yerine kullandığın araçları, sorumluluğunu ve sonucu bir veya iki cümlede açıkla.

## Beceri listesini kanıtla

İlanda geçen ve gerçekten kullanabildiğin becerileri seç. Her programa “ileri seviye” yazmak güveni azaltır. Görüşmede uygulama sorusu gelebileceğini unutma.

## Basit CV sıralaması

- İletişim ve kısa profil özeti
- Eğitim bilgileri
- İlgili projeler ve uygulamalar
- Teknik ve kişisel beceriler
- Yabancı dil, sertifika ve gönüllülük

Dosyayı PDF olarak ad-soyad-staj-cv biçiminde kaydet. Yazım hatalarını kontrol et ve her ilandan önce beceri sıralamasını güncelle.`,
    }),
    post({
        slug: "staj-mulakati-sorulari-ve-cevaplari",
        title: "Staj Mülakatında Sorulan 12 Soru ve Cevap Hazırlama Yöntemi",
        excerpt: "Staj görüşmelerinde sık sorulan soruların amacını ve ezber yapmadan güçlü cevap hazırlama yöntemini öğrenin.",
        category: "Mülakat İpuçları",
        seo_title: "Staj Mülakatı Soruları ve Cevapları",
        seo_description: "Staj mülakatında en çok sorulan 12 soru ve deneyimsiz öğrenciler için cevap hazırlama ipuçları.",
        keywords: ["staj mülakatı soruları", "staj görüşmesi", "mülakat cevapları", "stajyer mülakatı"],
        content: `Staj mülakatında senden yıllarca deneyim beklenmez. İşveren temel bilgini, iletişimini, sorumluluk alma biçimini ve öğrenme isteğini anlamaya çalışır. Ezber yerine her soru için kısa örnek hazırla.

## Sık sorulan 12 soru

- Kendinden kısaca bahseder misin?
- Neden bu alanda staj yapmak istiyorsun?
- Neden işletmemizi seçtin?
- En yararlı okul projen hangisiydi?
- Güçlü yönün nedir?
- Geliştirmek istediğin yönün nedir?
- Takımda anlaşmazlık yaşarsan ne yaparsın?
- Çözdüğün zor bir problemi anlatır mısın?
- Bilmediğin görev verilirse nasıl ilerlersin?
- Hangi günler çalışabilirsin?
- Stajdan ne öğrenmek istiyorsun?
- Bize sormak istediğin bir şey var mı?

## Cevapları nasıl hazırlamalısın?

Durum, görev, yaptığın hareket ve sonuç sırasını kullan. Okul projesi, takım ödevi, spor veya gönüllülük deneyimi uygun örnekler sunar. Sonucu mümkün olduğunca somut anlat.

## Sen de soru sor

Görev tanımı, ekip, geri bildirim düzeni ve ilk hafta beklentilerini sor. Ücret, çalışma saatleri, yemek, yol ve evrak sürecini netleştir. Bilmediğin soruda dürüst olup öğrenme yolunu açıklamak tahmin yürütmekten daha güvenlidir.`,
    }),
    post({
        slug: "stajin-ilk-gunu-ne-yapilir",
        title: "Stajın İlk Günü Ne Yapılır? Öğrenciler İçin Hazırlık Listesi",
        excerpt: "Stajın ilk gününde yanınızda bulunması gerekenler, sorulacak sorular ve profesyonel başlangıç için kontrol listesi.",
        category: "Staj Süreçleri",
        seo_title: "Stajın İlk Günü Ne Yapılır? Hazırlık Listesi",
        seo_description: "Stajın ilk gününde ne giyilir, ne götürülür ve hangi sorular sorulur? Öğrenciler için pratik başlangıç rehberi.",
        keywords: ["stajın ilk günü", "stajda ne yapılır", "staj hazırlığı", "ilk gün kıyafet"],
        content: `Stajın ilk günü senden her şeyi bilmen beklenmez. Zamanında gelmen, talimatları dinlemen ve anlamadığın noktaları sorman güçlü başlangıç için yeterlidir. Bir gün önce ulaşım planını ve kıyafet kuralını kontrol et.

## Yanında neler bulunmalı?

Kimlik, okulun istediği belgeler, küçük not defteri, kalem ve gerekiyorsa kişisel koruyucu ekipman bulundur. İşletme özel cihaz istemediyse değerli ekipmanlarını izinsiz götürme.

## İlk gün hangi soruları sorabilirsin?

- Doğrudan sorumlu olduğum kişi kim?
- Çalışma ve mola saatleri nedir?
- Acil durumda hangi prosedürü izlemeliyim?
- Hangi alanlara giriş yetkim var?
- İlk hafta benden ne bekleniyor?
- Devam çizelgesi nasıl onaylanacak?

## İş güvenliğini önceliklendir

Makine, elektrik, kimyasal veya kişisel veri içeren sistemle çalışacaksan eğitim almadan işlem yapma. Koruyucu ekipmanı kullan ve risk gördüğünde sorumluya bildir.

## Gün sonunda değerlendirme yap

Öğrendiğin isimleri, kullanılan araçları ve ertesi günün görevlerini not et. Sorumluna eksik yaptığın bir şey olup olmadığını sor. Bu notlar staj defterini hazırlarken büyük kolaylık sağlar.`,
    }),
];
export function mergeBlogPosts(databasePosts = []) {
    const bySlug = new Map();
    for (const item of STATIC_BLOG_POSTS)
        bySlug.set(item.slug, item);
    for (const item of databasePosts)
        bySlug.set(item.slug, item);
    return [...bySlug.values()].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}
