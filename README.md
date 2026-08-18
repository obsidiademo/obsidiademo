# Avanta Super App Commerce Platform

Loyalty + e-ticaret + günlük fırsatlar + C2C marketplace + fiyat karşılaştırma + fiziksel mağaza sadakat platformunun çalışan HTML demosu.

**Alışveriş Yap. Puan Kazan. Avantajı Her Yerde Kullan.**

Online alışverişten günlük fırsatlara, ikinci el ürünlerden fiziksel mağaza indirimlerine kadar tüm avantajlar tek platformda.

## Kurulum

Bağımlılık yoktur. Statik dosyaları herhangi bir HTTP sunucusu ile açın:

```bash
npx serve .
# veya
python3 -m http.server 8080
```

Tarayıcıda `http://localhost:8080` adresine gidin.

CDN: Google Fonts (Quicksand), Chart.js, Lucide ikonları.

## Demo Hesapları

Tüm şifreler: `123456`

| Rol | E-posta | Yönlendirme |
| --- | --- | --- |
| Super Admin | admin@demo.com | `/admin/dashboard.html` |
| Marka / Satıcı | brand@demo.com | `/merchant/dashboard.html` |
| Son Kullanıcı | user@demo.com | `/user/dashboard.html` |

Giriş ekranında hesap kartlarına tıklayarak formu doldurabilirsiniz. Bu bir **demo** ortamıdır; gerçek ödeme alınmaz.

## Roller

`super_admin`, `admin`, `finance_manager`, `merchant_admin`, `merchant_staff`, `store_staff`, `customer`

Yetki anahtarları örnekleri: `products.view`, `products.create`, `orders.update`, `finance.view`, `payout.approve`, `merchant.approve`.

## Dosya Yapısı

```
/
├── index.html              Public vitrin
├── login.html / register.html / otp.html
├── products.html / product-detail.html
├── deals.html / deal-detail.html
├── marketplace.html / listing-detail.html / sell.html
├── compare.html / stores.html / brands.html
├── cart.html / checkout.html
├── user/                   Son kullanıcı paneli
├── merchant/               Marka / satıcı paneli
├── admin/                  Süper admin
├── pos/                    Mağaza QR terminali
├── help/  legal/
└── assets/css|js|icons
```

## Modüller

- Loyalty ID, dijital kart, QR, Bronze–Platinum
- E-ticaret, sepet, kupon, puanlı ödeme
- Groupon benzeri fırsatlar ve dijital voucher
- Letgo benzeri C2C ilan + sohbet + teklif
- Fiyat karşılaştırma, Chart.js fiyat geçmişi, fiyat alarmı
- Fiziksel mağaza listesi ve POS QR indirimi
- Marketplace adapter UI (Trendyol, Hepsiburada, Amazon, N11, Pazarama, ÇiçekSepeti)
- Bildirim, destek talebi, KVKK gizlilik merkezi, çerez banner, komut paleti (Ctrl/Cmd+K)

## Entegrasyon Yapısı

Ön yüz servis katmanı (`assets/js/services.js`) backend’e taşınabilir:

`AuthService`, `Catalog`, `Cart`, `Loyalty`, `Orders`, `Deals`, `Chat`, `Listings`, `Alerts`

Marketplace adapter isimleri demo panelde tutulur. Ödeme için iyzico / PayTR / Stripe alanları UI’dadır; **API anahtarları frontend’e yazılmaz**.

## Backend Entegrasyon Notları

- `Avanta.SEED` mock JSON’dur. `localStorage` anahtarı: `avanta.state.v1`
- Gerçek API’de `Services.*` fonksiyonları `fetch` ile değiştirilir
- CSRF token `sessionStorage` içinde üretilir (demo)
- Dosya yüklemede MIME ve 8 MB sınırı kontrol edilir
- UUID benzeri kimlikler `Avanta.uid()` ile üretilir

## Güvenlik

Demo HTML olsa da mimari olarak XSS kaçışı, input sanitization, login deneme sınırı, RBAC, audit log, hassas bilgi maskeleme uygulanmıştır. Üretimde HTTPS, gerçek CSRF, sunucu tarafı doğrulama ve sır yönetimi zorunludur.

## Tema ve dil

Açık tema varsayılandır. Koyu tema ve `tr` / `en` locale `localStorage` içinde saklanır. UI metinleri `assets/js/i18n.js` üzerinden genişletilebilir (TR, EN, DE, AR).
