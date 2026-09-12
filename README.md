# Stajyer Bul Platform

STAJYERBUL.COM.TR - TAM PLATFORM GELİŞTİRME PROMPTU

Modern, profesyonel ve mobil uyumlu bir web platformu geliştir.

Platform adı:

StajyerBul

Ana fikir:

Stajyer arayan işletmeler ile staj arayan öğrencileri/adayları bir araya getiren modern bir platform.

Slogan:

"Aradığın stajyeri bul."

TASARIM:

- Tam ekran modern web uygulaması

- Ana arka plan beyaz

- Ana renkler: modern mavi tonları

- Beyaz + mavi + çok açık gri renk paleti

- Temiz, premium ve güven veren görünüm

- Kesinlikle eski tip kariyer sitesi gibi görünmesin

- Kariyer.net klonu gibi tasarlama

- Modern SaaS/startup hissi

- Büyük ve temiz tipografi

- Yuvarlatılmış kartlar

- Hafif gölgeler

- İnce borderlar

- Bol beyaz alan

- Responsive

- Mobilde kusursuz çalışmalı

- Desktop'ta tam ekran kullanılmalı

- Animasyonlar abartılı olmamalı

- Hover, loading, modal ve geçiş animasyonları modern olmalı

ANA SAYFA:

Navbar:

Logo:

STAJYERBUL

Menüler:

- Stajyer Bul

- İlanlar

- Nasıl Çalışır?

- İşverenler

Sağ taraf:

- Giriş Yap

- Kayıt Ol

Hero:

Büyük başlık:

"Aradığın stajyeri bul."

Alt açıklama:

"İhtiyacın olan stajyeri keşfet, profilleri incele veya kendi staj ilanını oluştur."

Hero içerisinde iki ana CTA:

"Stajyer Bul"

"Staj İlanı Oluştur"

Arama alanı:

"Pozisyon, beceri veya alan ara"

Şehir seçimi:

"Şehir seç"

Buton:

"Ara"

Hero altında popüler kategoriler:

- Yazılım

- CNC / Makine

- Elektrik

- Muhasebe

- Grafik Tasarım

- Otomotiv

- Pazarlama

- E-Ticaret

- İnsan Kaynakları

- Diğer

--------------------------------------------------

KULLANICI TİPLERİ

--------------------------------------------------

Sistemde iki ana kullanıcı tipi olacak:

1. STAJYER / İŞ ARAYAN

2. İŞVEREN / STAJYER ARAYAN

Kullanıcı kayıt sırasında hesap tipini seçebilmeli.

--------------------------------------------------

GİRİŞ SİSTEMİ

--------------------------------------------------

Google ile giriş:

- Google OAuth

- Google hesabıyla kayıt/giriş

- İsim

- Soyisim

- E-posta

- Profil fotoğrafı mümkün olduğunda otomatik alınmalı

LinkedIn ile giriş:

- LinkedIn OAuth

- LinkedIn profilinden mümkün olan temel bilgiler alınmalı

- İsim

- Soyisim

- Profil fotoğrafı

- E-posta

- LinkedIn profil bağlantısı mümkün olduğunda alınmalı

LinkedIn profili kullanıcı hesabına bağlanabilmeli.

Profilde:

"LinkedIn doğrulandı ✓"

gibi bir rozet göster.

OAuth client secret gibi gizli bilgiler frontend'e kesinlikle yazılmamalı.

Environment variables kullanılmalı.

--------------------------------------------------

STAJYER / İŞ ARAYAN PROFİLİ

--------------------------------------------------

Stajyer hesabı oluşturulduktan sonra kendi profilini tamamen düzenleyebilmeli.

Profil alanları:

- Profil fotoğrafı

- Ad soyad

- Hakkında

- Şehir

- İlçe

- Okul

- Bölüm

- Sınıf

- Eğitim seviyesi

- Staj alanı

- İlgilendiği pozisyonlar

- Beceriler

- Sertifikalar

- Programlar / yazılımlar

- Deneyimler

- Projeler

- Portföy bağlantısı

- LinkedIn bağlantısı

- CV yükleme

- Staj başlangıç tarihi

- Staj süresi

- Çalışabileceği günler

- Çalışma tercihi

- Ücret beklentisi

- Ulaşım tercihi

Profil durumları:

🟢 Staj arıyorum

🟡 Şu anda değerlendiriyorum

⚪ Staj aramıyorum

Stajyer kendi profilini istediği zaman düzenleyebilmeli.

Profil tamamlanma göstergesi:

"Profilin %85 tamamlandı"

Eksik alanları kullanıcıya göstermeli.

--------------------------------------------------

STAJYER KEŞFET

--------------------------------------------------

İşverenler "Stajyer Bul" sayfasından adayları keşfedebilmeli.

Filtreler:

- Şehir

- İlçe

- Alan

- Pozisyon

- Okul

- Bölüm

- Sınıf

- Beceri

- Staj başlangıç tarihi

- Staj süresi

- Ücret beklentisi

- Çalışma tipi

Aday kartlarında:

Profil fotoğrafı

Ad soyad

Alan

Şehir

Okul

Beceriler

Staj durumu

Profil tamamlanma yüzdesi

Butonlar:

"Profili İncele"

"Teklif Gönder"

--------------------------------------------------

İŞVEREN SİSTEMİ

--------------------------------------------------

İşverenler Google veya LinkedIn ile kayıt olabilmeli.

İşveren hesabı oluşturulduğunda otomatik olarak:

"Onay Bekliyor"

durumunda olmalı.

İşveren doğrulanmadan:

- İlan açamamalı

- Adaylara teklif gönderememeli

- Tam işveren özelliklerini kullanamamalı

Panelde:

"İşveren hesabınız inceleniyor."

göster.

--------------------------------------------------

İŞVEREN DOĞRULAMA

--------------------------------------------------

Admin panelinden işveren hesapları incelenebilmeli.

İşveren kayıt olurken:

- Firma adı

- Yetkili adı

- Telefon

- E-posta

- Şehir

- İlçe

- Firma web sitesi

- Vergi bilgileri / işletme bilgileri için gerekli alanlar

- Firma açıklaması

- Firma logosu

- Firma adresi

gibi bilgiler alınabilir.

Admin:

[Onayla]

[Reddet]

[İncelemeye Al]

butonlarına sahip olmalı.

Durumlar:

🟡 Onay bekliyor

🟢 Onaylı işveren

🔴 Reddedildi

⚫ Askıya alındı

Onaylı işveren profillerinde:

"✓ Onaylı İşveren"

rozeti göster.

--------------------------------------------------

İŞVEREN PROFİLİ

--------------------------------------------------

Firma sayfasında:

- Firma logosu

- Firma adı

- Onaylı İşveren rozeti

- Hakkında

- Sektör

- Konum

- Web sitesi

- Açık staj ilanları

- Aradığı pozisyonlar

- Firma fotoğrafları

göster.

--------------------------------------------------

STAJ İLANI OLUŞTURMA

--------------------------------------------------

Onaylı işverenler "Staj İlanı Oluştur" butonuna sahip olmalı.

İlan alanları:

- İlan başlığı

- Pozisyon

- Kategori

- Açıklama

- Aranan beceriler

- Şehir

- İlçe

- Staj başlangıç tarihi

- Staj bitiş tarihi

- Staj süresi

- Çalışma günleri

- Çalışma saatleri

- Ücret

- Yemek

- Yol

- Servis

- Diğer imkanlar

- Kontenjan

İlan yayınlanmadan önce önizleme göster.

İlan yayınlandıktan sonra:

- Düzenle

- Pasife al

- Yeniden yayınla

- Başvuruları görüntüle

özellikleri olsun.

--------------------------------------------------

BAŞVURU SİSTEMİ

--------------------------------------------------

Stajyer ilanı görüntülediğinde:

"Başvur"

butonuna basabilmeli.

Başvuru sırasında kısa mesaj ekleyebilmeli.

İşveren panelinde:

Yeni başvurular

İnceleniyor

Görüşme

Kabul

Reddedildi

şeklinde başvuru durumları bulunmalı.

--------------------------------------------------

TEKLİF SİSTEMİ

--------------------------------------------------

İşveren herhangi bir stajyer profilini inceleyip doğrudan teklif gönderebilmeli.

Teklif:

- Pozisyon

- Firma

- Konum

- Başlangıç tarihi

- Staj süresi

- Çalışma saatleri

- Ücret

- Yemek

- Yol

- Servis

- Açıklama

içermeli.

Stajyer:

"Teklifi Kabul Et"

"Reddet"

seçeneklerine sahip olmalı.

--------------------------------------------------

MESAJLAŞMA

--------------------------------------------------

İşveren ve stajyer arasında güvenli mesajlaşma sistemi oluştur.

Mesajlaşma mümkün olduğunca:

- Başvuru

- İlan

- Teklif

bağlamında çalışmalı.

Spam ve kötüye kullanımı engellemek için mesajlaşma limitleri ve raporlama sistemi oluştur.

--------------------------------------------------

İŞVEREN PANELİ

--------------------------------------------------

Dashboard:

"Hoş geldiniz, Firma Adı"

Kartlar:

Aktif ilanlar

Toplam başvuru

Yeni başvurular

Gönderilen teklifler

Kabul edilen teklifler

Alt bölüm:

"Size uygun stajyerler"

Burada algoritmik olarak uygun adaylar göster.

--------------------------------------------------

STAJYER PANELİ

--------------------------------------------------

Dashboard:

Profil tamamlanma yüzdesi

Staj arama durumu

Gelen teklifler

Başvurular

Favoriler

Mesajlar

Ana CTA:

"Profilimi düzenle"

--------------------------------------------------

FAVORİLER

--------------------------------------------------

İşveren adayları favoriye ekleyebilmeli.

Stajyerler de firmaları ve ilanları favoriye ekleyebilmeli.

--------------------------------------------------

BİLDİRİMLER

--------------------------------------------------

Bildirim sistemi oluştur.

Örnek:

"Profilinize yeni bir teklif geldi."

"Başvurunuz görüntülendi."

"Başvurunuz kabul edildi."

"Yeni bir staj ilanı yayınlandı."

"İşveren hesabınız onaylandı."

--------------------------------------------------

ADMİN PANELİ

--------------------------------------------------

Admin paneli tamamen ayrı ve güvenli olmalı.

Admin:

- Kullanıcıları görüntüleyebilir

- İşverenleri inceleyebilir

- İşveren onaylayabilir/reddedebilir

- İlanları silebilir

- İlanları düzenleyebilir

- Kullanıcıları askıya alabilir

- Şikayetleri inceleyebilir

- Mesaj raporlarını inceleyebilir

- Kategorileri yönetebilir

- Şehirleri yönetebilir

- İstatistikleri görebilir

Dashboard:

Toplam kullanıcı

Stajyer sayısı

İşveren sayısı

Onaylı işveren

Bekleyen işveren

Aktif ilan

Toplam başvuru

Toplam teklif

--------------------------------------------------

GÜVENLİK

--------------------------------------------------

- Role-based authorization

- Stajyer ve işveren yetkilerini kesinlikle ayır

- Admin yetkilerini koru

- OAuth güvenli şekilde uygulanmalı

- Secret keyler frontend'e koyulmamalı

- Dosya yükleme güvenliği

- CV dosyalarının erişimi kontrollü olmalı

- Rate limiting

- Spam koruması

- Report / block sistemi

- KVKK uyumuna uygun temel gizlilik yapısı

- Hesap silme

- Verilerin silinmesi için kullanıcı talebi

--------------------------------------------------

VERİTABANI

--------------------------------------------------

Gerçek backend ve veritabanı kullan.

Ana tablolar:

users

profiles

job_seekers

employers

employer_verifications

companies

job_listings

applications

offers

messages

notifications

favorites

skills

certificates

experiences

portfolio_items

reports

admin_actions

İlişkileri düzgün kur.

Demo veriler yalnızca geliştirme ortamında kullanılmalı.

Canlı sistemde sahte kullanıcılar gerçek kullanıcı gibi gösterilmemeli.

--------------------------------------------------

TASARIM DETAYI

--------------------------------------------------

Desktop:

Tam genişlikte modern layout.

Sol tarafta gerektiğinde sidebar.

İçerik alanı geniş.

Mobil:

Bottom navigation kullanılabilir.

Mobil menü sade olmalı.

Kartlar responsive olmalı.

Renk paleti:

Primary:

#2563EB

Dark blue:

#1D4ED8

Light blue:

#EFF6FF

Background:

#FFFFFF

Secondary background:

#F8FAFC

Text:

#0F172A

Secondary text:

#64748B

Border:

#E2E8F0

Mavi ana marka rengi olmalı ancak ekranı tamamen maviye boğma.

--------------------------------------------------

ANA SAYFANIN ANA MESAJI

--------------------------------------------------

Büyük:

"Aradığın stajyeri bul."

Altında:

"Stajyer profillerini keşfet, ilanını yayınla ve ihtiyacın olan adaya ulaş."

CTA:

"Stajyer Bul"

"İlan Oluştur"

İkinci bölüm:

"StajyerBul nasıl çalışır?"

1. İşletmeni doğrula

2. Stajyerleri keşfet veya ilan oluştur

3. Uygun adaylarla iletişime geç

4. Stajyerini bul

--------------------------------------------------

GENEL KURAL

--------------------------------------------------

Bu proje sadece frontend demo olmasın.

Gerçek çalışan:

- Authentication

- OAuth

- Database

- User roles

- Employer verification

- Profiles

- Listings

- Applications

- Offers

- Messaging

- Notifications

- Admin panel

oluştur.

Kod temiz, modüler ve production'a hazırlanabilir yapıda olsun.

Öncelik:

1. Kullanıcı deneyimi

2. Güvenlik

3. Modern tasarım

4. Hız

5. Mobil uyumluluk

6. Ölçeklenebilir backend

Site boş görünmemeli. Geliştirme ortamında gerçekçi demo içerikleri oluştur ancak bunları açıkça demo olarak işaretle ve production'da otomatik olarak kaldır.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3169f824-aef4-4eed-b38d-1935d4dc159c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
