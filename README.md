# StajyerBul

React, TanStack Start, Vite ve Supabase uygulaması. Aktif sayfalar `src/routes/` altında; rota ağacı otomatik üretilir.

## Geliştirme

Node.js 24 ile doğrulandı. `npm ci` çalıştırın, `.env.example` dosyasını `.env` olarak kopyalayıp Supabase değerlerini doldurun ve `npm run dev` çalıştırın.

`VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` (veya `VITE_SUPABASE_PUBLISHABLE_KEY`) değişince yeniden build gerekir. `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, isteğe bağlı `GEMINI_API_KEY` yalnızca sunucu ortamındadır; bunlara `VITE_` öneki eklemeyin. Yerel yönetim API'si için sunucu işleminin ortam değişkenlerini kullanın.

## Kontroller

```sh
npm run build
npm run typecheck
npm test
npm run lint
```

Vercel'de Nitro hedefi otomatik seçilir; Lovable yapılandırması korunmuştur. `/yonetim` ve `/blog-yonet` aynı sunucu oturumunu kullanır.

## Onarılan başlıca sorunlar

- AdSense betiği ilk React yüklemesi sonrasına alındı; reklamların SSR HTML yapısını erken değiştirerek hydration hatası oluşturması giderildi.
- Blog yönetimindeki derlemeyi bozan JSX, geçersiz rota ağacı ve iç içe blog detay rotası.
- Eksik Supabase ayarlarında başlangıç çökmesi, doğrulama e-postası akışı, sessiz yükleme/kaydetme hataları.
- Yönetimde tarayıcıya gömülü şifreler ve sahte yerel oturumlar: imzalı HttpOnly çerez ve sunucu API'sine taşındı. Yönetim yazmaları service-role istemcisiyle yapılır.
- Yeni kullanıcının işletme başvurusunda eksik profil, reddedilen başvurudan dönüş, Türkçe şehir kontrolü, ilan konumu, tekrar gönderme ve iki ekrandaki ilan sınırı tutarsızlığı.
- Ana sayfa araması/şehir filtresi, boş ilan alanlarında çökme, blog filtresinde ilk yazının kaybolması, taslakların detay sorgusunda görünmesi, yanlış canonical/sitemap adresleri.
- Görsel yükleme tür/boyut kontrolü ve kullanıcı klasörü; dar ekranlarda mobil menü.
- Sahte başvuru/teklif başarıları kaldırıldı. Paylaşılmış e-posta adresiyle taslak açılır; platform içi mesaj/başvuru kaydı oluşturulmaz. İşlevsiz bülten formu kaldırıldı.
- Gemini sunucuya taşındı; sahte görsel üretimi kaldırıldı. Üretilen taslak yayınlamadan önce düzenlenir. Blog slug, kapak görseli ve taslak durumunu API korur.
- Kullanılmayan kök sayfa kopyaları kaldırıldı. Sırlar için `.gitignore` ve `.env.example` eklendi.

## Canlı ortamda doğrulanması gerekenler

Canlı Supabase anahtarları/şeması bu çalışma alanında bulunmadığından RLS, OAuth, e-posta teslimi ve Storage canlı olarak doğrulanmadı. Testler gerçek kullanıcı verilerini değiştirmez.

- `profiles`, `job_listings`, `blog_posts` tabloları ve beklenen sütunlar mevcut olmalı. `src/lib/models.ts` istemci beklentilerini belgeler; otomatik şema kurulumu değildir. `blog_posts.slug` benzersiz olmalı.
- RLS: kullanıcı yalnızca kendi profilini/ilanlarını değiştirebilmeli, kendi `approval_status` değerini onaylanmış yapamamalı. Onaylı işveren ve beş ilan sınırı veritabanında da uygulanmalı; tarayıcı kontrolleri güvenlik sınırı değildir.
- Aday iletişim bilgilerinin görünürlüğü ve yayın izni RLS ile belirlenmeli. İletişim adresi okunamıyorsa e-posta akışı hata gösterir.
- `avatars` bucket'ı; JPG/PNG/WebP, 5 MB sınırı, `auth.uid()/dosya` yükleme izni ve public URL okuma ayarı kontrol edilmeli.
- Auth Site URL, `/profil` dönüş adresi, e-posta doğrulaması, Google/LinkedIn sağlayıcıları doğrulanmalı.
- Yönetim sunucu değişkenleri doldurulmalı. Eski kaynak kodda bulunan şifreler tekrar kullanılmamalı. Gemini REST referansı: https://ai.google.dev/api/generate-content

## Doğrulama sonucu

- Varsayılan üretim build'i ve TypeScript kontrolü geçti.
- 9 otomatik test: yetkisiz erişim, hatalı giriş, çerez imzası/süresi, kaynak kontrolü, çıkış, eksik ayarlar, blog doğrulama/slug çakışması. Veritabanı çağrıları test içinde taklit edilir.
- Lint hatası yok; mevcut ortak UI Fast Refresh ve iki sayfada hook bağımlılığı uyarıları kalıyor.
- Tarayıcı: ana sayfa araması, null alanlı ilan, blog kategori filtresi, detay geçişi, yönetim girişi ve mobil görünüm yerel test verileriyle kontrol edildi.
- Vercel hedefi ayrıca denendi; Windows izinleri nedeniyle Nitro dosya izleme adımı `EPERM: readlink C:\Users\ereno` hatası verdi. Vercel hedefinin tamamlandığı veya canlı dağıtımın doğrulandığı iddia edilmiyor.
