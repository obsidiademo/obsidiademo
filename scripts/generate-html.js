#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const scripts = [
  "utils.js", "i18n.js", "data.js", "security.js", "store.js",
  "services.js", "ui.js", "layouts.js", "views.js",
  "pages-public.js", "pages-user.js", "pages-merchant.js", "pages-admin.js", "app.js"
];

function html(opts) {
  const depth = opts.depth || 0;
  const prefix = "../".repeat(depth);
  const title = opts.title;
  const desc = opts.desc || "Avanta — alışveriş, sadakat, günlük fırsatlar, ikinci el pazar ve fiziksel mağaza indirimleri tek platformda.";
  const page = opts.page;
  const layout = opts.layout;
  const nav = opts.nav || "";
  const canon = "https://avanta.demo/" + (opts.file || "");
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${canon}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:type" content="website">
  <meta name="theme-color" content="#24356a">
  <link rel="icon" href="${prefix}assets/icons/logo.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${prefix}assets/css/main.css">
  ${opts.schema ? `<script type="application/ld+json">${opts.schema}</script>` : ""}
</head>
<body data-layout="${layout}" data-page="${page}" data-depth="${depth}"${nav ? ` data-nav="${nav}"` : ""}>
  <div id="app-root">
    <noscript>Avanta demosu JavaScript gerektirir. Lütfen tarayıcınızda JS’i açın.</noscript>
  </div>
  <script defer src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
  <script defer src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js"></script>
  <script defer src="${prefix}assets/js/vendor-shim.js"></script>
  ${scripts.map((s) => `<script defer src="${prefix}assets/js/${s}"></script>`).join("\n  ")}
</body>
</html>
`;
}

const pages = [
  ["index.html", 0, "public", "home", "home", "Avanta — Alışveriş Yap. Puan Kazan. Avantajı Her Yerde Kullan.", "Online alışverişten günlük fırsatlara, ikinci el ürünlerden fiziksel mağaza indirimlerine kadar tüm avantajlar tek platformda."],
  ["login.html", 0, "auth", "login", "", "Giriş Yap | Avanta", "Demo hesaplarla Avanta’ya giriş yapın."],
  ["register.html", 0, "auth", "register", "", "Üye Ol | Avanta", "Tek üyelikle alışveriş, fırsat ve sadakat."],
  ["otp.html", 0, "auth", "otp", "", "Doğrulama | Avanta", "OTP doğrulama ekranı."],
  ["merchant-apply.html", 0, "auth", "merchant-apply", "", "Satıcı Ol | Avanta", "Marka ve mağaza başvurusu."],
  ["merchant-pending.html", 0, "auth", "merchant-pending", "", "Başvurunuz İnceleniyor | Avanta", "Marka başvuru durumu."],
  ["products.html", 0, "public", "products", "home", "Ürünler | Avanta", "Avanta e-ticaret kataloğu."],
  ["product-detail.html", 0, "public", "product-detail", "home", "Ürün Detayı | Avanta", "Ürün galerisi, varyant, puan ve satıcı bilgisi."],
  ["deals.html", 0, "public", "deals", "deals", "Günlük Fırsatlar | Avanta", "Restoran, spa, otel ve aktivite fırsatları."],
  ["deal-detail.html", 0, "public", "deal-detail", "deals", "Fırsat Detayı | Avanta", "Fırsat paketi ve dijital voucher."],
  ["marketplace.html", 0, "public", "marketplace", "marketplace", "İkinci El Pazarı | Avanta", "C2C ilanlar ve güvenli mesajlaşma."],
  ["listing-detail.html", 0, "public", "listing-detail", "marketplace", "İlan Detayı | Avanta", "İkinci el ilan ve satıcı mesajı."],
  ["sell.html", 0, "public", "sell", "marketplace", "İlan Ver | Avanta", "C2C ilan oluştur."],
  ["compare.html", 0, "public", "compare", "home", "Fiyat Karşılaştır | Avanta", "Mağaza fiyatları ve fiyat geçmişi."],
  ["stores.html", 0, "public", "stores", "home", "Mağazalar | Avanta", "Yakındaki anlaşmalı işletmeler."],
  ["store-detail.html", 0, "public", "store-detail", "home", "Mağaza | Avanta", "Fiziksel mağaza ve QR indirimi."],
  ["brands.html", 0, "public", "brands", "home", "Markalar | Avanta", "Avanta marka vitrinleri."],
  ["brand.html", 0, "public", "brand", "home", "Marka | Avanta", "Marka storefront, ürün ve kampanyalar."],
  ["cart.html", 0, "public", "cart", "home", "Sepet | Avanta", "Satıcı bazlı sepet ve loyalty puanı."],
  ["checkout.html", 0, "public", "checkout", "home", "Ödeme | Avanta", "Adres, teslimat, ödeme ve puan kullanımı."],
  ["loyalty.html", 0, "public", "loyalty", "home", "Loyalty | Avanta", "Bronze, Silver, Gold, Platinum avantajları."],
  ["search.html", 0, "public", "search", "home", "Arama | Avanta", "Ürün, marka, fırsat ve ilan araması."],
  ["404.html", 0, "auth", "404", "", "404 | Avanta", "Sayfa bulunamadı."],
  ["403.html", 0, "auth", "403", "", "403 | Avanta", "Erişim yok."],
  ["500.html", 0, "auth", "500", "", "500 | Avanta", "Sunucu hatası."],
  ["maintenance.html", 0, "auth", "maintenance", "", "Bakım Modu | Avanta", "Kısa süreli bakım."],
  ["offline.html", 0, "auth", "offline", "", "Çevrimdışı | Avanta", "Bağlantı yok."],
  ["help/index.html", 1, "public", "help", "home", "Yardım Merkezi | Avanta", "Sipariş, ödeme, iade, loyalty ve satıcı yardımı."],
  ["help/contact.html", 1, "public", "contact", "home", "Destek Talebi | Avanta", "Ticket oluşturun."],
  ["legal/privacy.html", 1, "public", "privacyLegal", "home", "KVKK | Avanta", "Kişisel verilerin korunması."],
  ["pos/index.html", 1, "pos", "pos", "", "Avanta POS | QR Okut", "Fiziksel mağaza QR ve indirim ekranı."]
];

const userPages = [
  ["dashboard", "Dashboard | Avanta", "Kullanıcı özeti, puan ve siparişler."],
  ["orders", "Siparişlerim | Avanta", "Sipariş takibi."],
  ["loyalty", "Loyalty Kartım | Avanta", "Dijital sadakat kartı ve QR."],
  ["wallet", "Cüzdanım | Avanta", "Bakiye, puan, cashback, kupon."],
  ["coupons", "Kuponlarım | Avanta", "Aktif kuponlar."],
  ["vouchers", "Fırsatlarım | Avanta", "Dijital voucherlar."],
  ["favorites", "Favoriler | Avanta", "Favori ürünler."],
  ["alerts", "Fiyat Alarmlarım | Avanta", "Hedef fiyat bildirimleri."],
  ["listings", "İlanlarım | Avanta", "C2C ilan yönetimi."],
  ["messages", "Mesajlar | Avanta", "Kullanıcılar arası sohbet."],
  ["addresses", "Adresler | Avanta", "Teslimat adresleri."],
  ["notifications", "Bildirimler | Avanta", "Bildirim merkezi."],
  ["privacy", "Gizlilik Merkezi | Avanta", "KVKK tercihleri."],
  ["profile", "Ayarlar | Avanta", "Profil ve tema."]
];

userPages.forEach(function (p) {
  pages.push(["user/" + p[0] + ".html", 1, "user", "user-" + p[0], p[0] === "messages" ? "messages" : "profile", p[1], p[2]]);
});

const merchant = ["dashboard", "products", "orders", "deals", "campaigns", "branches", "customers", "loyalty", "coupons", "integrations", "messages", "finance", "reports", "settings"];
merchant.forEach(function (p) {
  const page = p === "messages" ? "user-messages" : "merchant-" + p;
  pages.push(["merchant/" + p + ".html", 1, "merchant", page, "profile", "Satıcı / " + p + " | Avanta", "Marka operasyon paneli."]);
});

const admin = [
  "dashboard", "users", "tiers", "complaints", "merchants", "applications", "branches", "sellers",
  "products", "orders", "returns", "categories", "deals", "vouchers", "listings", "listing-flags",
  "loyalty", "loyalty-tx", "campaigns", "coupons", "notifications", "banners", "referral",
  "payments", "commissions", "payouts", "integrations", "payments-int", "channels", "reports",
  "roles", "logs", "settings"
];
admin.forEach(function (p) {
  pages.push(["admin/" + p + ".html", 1, "admin", "admin-" + p, "profile", "Admin / " + p + " | Avanta", "Süper admin paneli."]);
});

const schema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Avanta",
  "slogan": "Alışveriş Yap. Puan Kazan. Avantajı Her Yerde Kullan.",
  "url": "https://avanta.demo/"
});

pages.forEach(function (p) {
  const file = p[0];
  const abs = path.join("/workspace", file);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, html({
    file: file,
    depth: p[1],
    layout: p[2],
    page: p[3],
    nav: p[4],
    title: p[5],
    desc: p[6],
    schema: file === "index.html" ? schema : ""
  }));
});

console.log("Wrote", pages.length, "html files");
