# StajyerBul

React, TanStack Start, Vite ve Supabase uygulaması. Aktif sayfalar `src/routes/` altında; rota ağacı otomatik üretilir.

## Geliştirme

Node.js 24 ile doğrulandı. `npm ci` çalıştırın, `.env.example` dosyasını `.env` olarak kopyalayıp Supabase değerlerini doldurun ve `npm run dev` çalıştırın.

`VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` (veya `VITE_SUPABASE_PUBLISHABLE_KEY`) değişince yeniden build gerekir. `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, isteğe bağlı `GEMINI_API_KEY` yalnızca sunucu ortamındadır; bunlara `VITE_` öneki eklemeyin. Yerel yönetim API'si için sunucu işleminin ortam değişkenlerini kullanın.

Supabase SQL Editor'da migration dosyalarını tarih sırasıyla çalıştırın. `20260913000000_blog_system.sql` blogu, `20260914000000_core_platform.sql` ise kullanıcı profilleri, güvenli ilanlar, site içi başvuru/teklif akışları ve avatar depolamasını kurar. Yayınlanan yazılar `/blog`, yönetim paneli `/blog-yonet`, dinamik site haritası `/sitemap.xml` adresindedir. AdSense reklam birimi kimlikleri `VITE_ADSENSE_BLOG_LIST_SLOT`, `VITE_ADSENSE_ARTICLE_TOP_SLOT` ve `VITE_ADSENSE_ARTICLE_BOTTOM_SLOT` değişkenlerinden alınır.

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
- İlan başvuruları ve işletmelerin aday teklifleri artık platform içinde kaydedilir. Aday, gelen teklifleri profilinden; işletme, gelen başvuruları panelinden yönetebilir.
- Ana sayfadaki örnek adaylar kaldırıldı ve kişisel iletişim bilgisi göstermeyen aktif aday listesine bağlandı.
- Şifre sıfırlama isteği ve yeni şifre belirleme ekranı tamamlandı.
- Gemini sunucuya taşındı; sahte görsel üretimi kaldırıldı. Üretilen taslak yayınlamadan önce düzenlenir. Blog slug, kapak görseli ve taslak durumunu API korur.
- Kullanılmayan kök sayfa kopyaları kaldırıldı. Sırlar için `.gitignore` ve `.env.example` eklendi.

## Canlı ortamda doğrulanması gerekenler

Canlı Supabase anahtarları bu çalışma alanında bulunmadığından migration, OAuth, e-posta teslimi ve Storage canlı olarak doğrulanmadı. Testler gerçek kullanıcı verilerini değiştirmez.

- İki migration tarih sırasıyla çalıştırılmalı; ikinci migration eski geniş RLS politikalarını kaldırıp uygulamanın sınırlandırılmış politikalarını kurar.
- `profiles`, `job_listings`, `job_applications`, `internship_offers` ve `blog_posts` tabloları Supabase Table Editor'da görünmeli.
- `avatars` bucket'ının JPG/PNG/WebP, 5 MB sınırı ve kullanıcı klasörü politikaları migration sonrasında kontrol edilmeli.
- Auth Site URL, `/profil` dönüş adresi, e-posta doğrulaması, Google/LinkedIn sağlayıcıları doğrulanmalı.
- Yönetim sunucu değişkenleri doldurulmalı. Üretimde tahmin edilmesi zor bir yönetici şifresi ve uzun, rastgele bir `ADMIN_SESSION_SECRET` kullanılmalı. Gemini REST referansı: https://ai.google.dev/api/generate-content

## Doğrulama sonucu

- Varsayılan üretim build'i ve TypeScript kontrolü geçti.
- 9 otomatik test: yetkisiz erişim, hatalı giriş, çerez imzası/süresi, kaynak kontrolü, çıkış, eksik ayarlar, blog doğrulama/slug çakışması. Veritabanı çağrıları test içinde taklit edilir.
- Lint hatası yok; mevcut ortak UI Fast Refresh ve üç sayfada hook bağımlılığı uyarıları kalıyor.
- Tarayıcı: ana sayfa araması, null alanlı ilan, blog kategori filtresi, detay geçişi, yönetim girişi ve mobil görünüm yerel test verileriyle kontrol edildi.
- Vercel hedefi ayrıca denendi; Windows izinleri nedeniyle Nitro dosya izleme adımı `EPERM: readlink C:\Users\ereno` hatası verdi. Vercel hedefinin tamamlandığı veya canlı dağıtımın doğrulandığı iddia edilmiyor.
