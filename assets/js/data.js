window.Avanta = window.Avanta || {};

(function (A) {
  const now = new Date("2026-08-18T16:30:00+03:00").getTime();

  function d(offsetHours) {
    return new Date(now + offsetHours * 3600000).toISOString();
  }

  const categories = [
    { id: "elektronik", name: "Elektronik", icon: "smartphone" },
    { id: "moda", name: "Moda", icon: "shirt" },
    { id: "ev", name: "Ev & Yaşam", icon: "sofa" },
    { id: "kozmetik", name: "Kozmetik", icon: "sparkles" },
    { id: "anne", name: "Anne & Bebek", icon: "baby" },
    { id: "spor", name: "Spor", icon: "dumbbell" },
    { id: "otomotiv", name: "Otomotiv", icon: "car" },
    { id: "market", name: "Market", icon: "shopping-basket" },
    { id: "pet", name: "Pet Shop", icon: "paw-print" },
    { id: "hobi", name: "Hobi", icon: "palette" },
    { id: "kitap", name: "Kitap", icon: "book-open" },
    { id: "hizmet", name: "Hizmet", icon: "concierge-bell" }
  ];

  const dealCategories = [
    "Restoran", "Spa", "Masaj", "Güzellik", "Otel", "Tatil", "Aktivite",
    "Eğlence", "Sinema", "Eğitim", "Sağlık", "Araç bakım", "Spor"
  ];

  const listingCategories = [
    "Otomobil", "Elektronik", "Telefon", "Bilgisayar", "Ev Eşyası",
    "Mobilya", "Moda", "Spor", "Koleksiyon", "Anne & Bebek", "Hobi", "Diğer"
  ];

  const cities = [
    { il: "İstanbul", ilce: ["Kadıköy", "Beşiktaş", "Şişli", "Üsküdar", "Ataşehir", "Bakırköy"] },
    { il: "Ankara", ilce: ["Çankaya", "Keçiören", "Yenimahalle"] },
    { il: "İzmir", ilce: ["Konak", "Karşıyaka", "Bornova"] },
    { il: "Bursa", ilce: ["Nilüfer", "Osmangazi"] },
    { il: "Antalya", ilce: ["Muratpaşa", "Konyaaltı"] }
  ];

  const brands = [
    { id: "b-novatech", name: "NovaTech", category: "Elektronik", followers: 48210, rating: 4.7, status: "Onaylandı", package: "Enterprise", commission: 5, logo: "N" },
    { id: "b-urbanwear", name: "UrbanWear", category: "Moda", followers: 18240, rating: 4.6, status: "Onaylandı", package: "Professional", commission: 12, logo: "U" },
    { id: "b-glowlab", name: "GlowLab", category: "Kozmetik", followers: 22190, rating: 4.8, status: "Onaylandı", package: "Professional", commission: 15, logo: "G" },
    { id: "b-evim", name: "Evim Studio", category: "Ev & Yaşam", followers: 9640, rating: 4.5, status: "Onaylandı", package: "Starter", commission: 10, logo: "E" },
    { id: "b-fitpark", name: "FitPark", category: "Spor", followers: 15420, rating: 4.7, status: "Onaylandı", package: "Professional", commission: 8, logo: "F" },
    { id: "b-marketim", name: "Marketim", category: "Market", followers: 31002, rating: 4.4, status: "Onaylandı", package: "Enterprise", commission: 6, logo: "M" },
    { id: "b-apple", name: "Aether Store", category: "Elektronik", followers: 91020, rating: 4.9, status: "Onaylandı", package: "Enterprise", commission: 4, logo: "A" },
    { id: "b-mavi", name: "Mavi Denim", category: "Moda", followers: 54012, rating: 4.6, status: "Onaylandı", package: "Professional", commission: 11, logo: "M" },
    { id: "b-karaca", name: "Karaca Home", category: "Ev & Yaşam", followers: 27800, rating: 4.7, status: "Onaylandı", package: "Professional", commission: 9, logo: "K" },
    { id: "b-watsons", name: "Bloom Beauty", category: "Kozmetik", followers: 19880, rating: 4.5, status: "Onaylandı", package: "Starter", commission: 14, logo: "B" },
    { id: "b-pending", name: "Anadolu Kahve", category: "Restoran", followers: 0, rating: 0, status: "İnceleniyor", package: "Starter", commission: 8, logo: "A" },
    { id: "b-docs", name: "Ege Spa", category: "Sağlık", followers: 0, rating: 0, status: "Evrak Bekleniyor", package: "Starter", commission: 10, logo: "E" }
  ];

  const products = [
    { id: "p1", sku: "NT-IPH-17P-256", name: "Aether Phone 17 Pro 256 GB", brandId: "b-apple", brand: "Aether Store", category: "Elektronik", price: 74999, oldPrice: 82499, rating: 4.8, reviews: 1240, stock: 42, freeShipping: true, seller: "Aether Store", sponsored: true, sold: 3180, points: 750, color: ["Titanyum Siyah", "Çöl Titanyum", "Beyaz"], storage: ["256 GB", "512 GB"], desc: "A18 çip, 48 MP üçlü kamera sistemi ve 120 Hz ProMotion ekran. Avanta Gold üyelere ücretsiz kargo." },
    { id: "p2", sku: "NT-AIR-PRO2", name: "Aether Buds Pro 2", brandId: "b-apple", brand: "Aether Store", category: "Elektronik", price: 7499, oldPrice: 8999, rating: 4.7, reviews: 860, stock: 120, freeShipping: true, seller: "Aether Store", sponsored: false, sold: 5210, points: 75 },
    { id: "p3", sku: "UW-SNK-01", name: "UrbanWear Runner 2026", brandId: "b-urbanwear", brand: "UrbanWear", category: "Moda", price: 2499, oldPrice: 3299, rating: 4.6, reviews: 412, stock: 80, freeShipping: true, seller: "UrbanWear", sponsored: false, sold: 940, points: 25, size: ["40", "41", "42", "43", "44"] },
    { id: "p4", sku: "GL-SER-50", name: "GlowLab C Vitamini Serum 50 ml", brandId: "b-glowlab", brand: "GlowLab", category: "Kozmetik", price: 589, oldPrice: 749, rating: 4.9, reviews: 2104, stock: 300, freeShipping: true, seller: "GlowLab", sponsored: true, sold: 8120, points: 6 },
    { id: "p5", sku: "EV-KAH-01", name: "Evim Studio Espresso Makinesi", brandId: "b-evim", brand: "Evim Studio", category: "Ev & Yaşam", price: 4590, oldPrice: 5290, rating: 4.5, reviews: 188, stock: 24, freeShipping: true, seller: "Evim Studio", sponsored: false, sold: 310, points: 46 },
    { id: "p6", sku: "FP-YOG-01", name: "FitPark Yoga Matı Pro", brandId: "b-fitpark", brand: "FitPark", category: "Spor", price: 429, oldPrice: 599, rating: 4.4, reviews: 96, stock: 150, freeShipping: false, seller: "FitPark", sponsored: false, sold: 670, points: 4 },
    { id: "p7", sku: "MK-ZYT-1L", name: "Marketim Soğuk Sıkım Zeytinyağı 1L", brandId: "b-marketim", brand: "Marketim", category: "Market", price: 289, oldPrice: 349, rating: 4.6, reviews: 540, stock: 400, freeShipping: false, seller: "Marketim", sponsored: false, sold: 2210, points: 3 },
    { id: "p8", sku: "MV-JNS-32", name: "Mavi Denim Slim Jean", brandId: "b-mavi", brand: "Mavi Denim", category: "Moda", price: 1199, oldPrice: 1499, rating: 4.5, reviews: 733, stock: 90, freeShipping: true, seller: "Mavi Denim", sponsored: false, sold: 1540, points: 12, size: ["30", "32", "34", "36"] },
    { id: "p9", sku: "KR-CK-24", name: "Karaca Home 24 Parça Çatal Kaşık Seti", brandId: "b-karaca", brand: "Karaca Home", category: "Ev & Yaşam", price: 1899, oldPrice: 2499, rating: 4.7, reviews: 255, stock: 60, freeShipping: true, seller: "Karaca Home", sponsored: false, sold: 480, points: 19 },
    { id: "p10", sku: "BB-GUN-01", name: "Bloom Beauty Güneş Kremi SPF50", brandId: "b-watsons", brand: "Bloom Beauty", category: "Kozmetik", price: 349, oldPrice: 429, rating: 4.6, reviews: 901, stock: 210, freeShipping: true, seller: "Bloom Beauty", sponsored: false, sold: 3400, points: 3 },
    { id: "p11", sku: "NT-MON-27", name: "NovaTech 27\" 4K Monitör", brandId: "b-novatech", brand: "NovaTech", category: "Elektronik", price: 12990, oldPrice: 15490, rating: 4.6, reviews: 310, stock: 18, freeShipping: true, seller: "NovaTech", sponsored: false, sold: 260, points: 130 },
    { id: "p12", sku: "NT-LAP-14", name: "NovaTech AirBook 14 OLED", brandId: "b-novatech", brand: "NovaTech", category: "Elektronik", price: 42990, oldPrice: 47990, rating: 4.8, reviews: 188, stock: 11, freeShipping: true, seller: "NovaTech", sponsored: true, sold: 140, points: 430 },
    { id: "p13", sku: "FP-AYK-42", name: "FitPark Koşu Ayakkabısı Pulse", brandId: "b-fitpark", brand: "FitPark", category: "Spor", price: 1890, oldPrice: 2390, rating: 4.5, reviews: 220, stock: 55, freeShipping: true, seller: "FitPark", sponsored: false, sold: 410, points: 19 },
    { id: "p14", sku: "UW-CEK-M", name: "UrbanWear Oversize Sweatshirt", brandId: "b-urbanwear", brand: "UrbanWear", category: "Moda", price: 799, oldPrice: 999, rating: 4.3, reviews: 140, stock: 130, freeShipping: true, seller: "UrbanWear", sponsored: false, sold: 880, points: 8, color: ["Antrasit", "Krem", "Lacivert"] },
    { id: "p15", sku: "EV-YTK-01", name: "Evim Studio Robot Süpürge X7", brandId: "b-evim", brand: "Evim Studio", category: "Ev & Yaşam", price: 8990, oldPrice: 10990, rating: 4.4, reviews: 97, stock: 14, freeShipping: true, seller: "Evim Studio", sponsored: false, sold: 120, points: 90 },
    { id: "p16", sku: "GL-RUT-01", name: "GlowLab Nemlendirici Gece Kremi", brandId: "b-glowlab", brand: "GlowLab", category: "Kozmetik", price: 419, oldPrice: 499, rating: 4.7, reviews: 640, stock: 200, freeShipping: true, seller: "GlowLab", sponsored: false, sold: 1900, points: 4 }
  ];

  const deals = [
    { id: "d1", title: "Boğaz Manzaralı İki Kişilik Akşam Yemeği", business: "Salıpazarı Meyhane", category: "Restoran", city: "İstanbul", district: "Beşiktaş", oldPrice: 2400, price: 1299, sold: 368, rating: 4.8, left: d(62), points: 13, packages: [{ name: "Standart Menü", price: 1299 }, { name: "Şarap Eşliğinde", price: 1699 }] },
    { id: "d2", title: "60 Dakika Deep Tissue Masaj", business: "Nişantaşı Spa House", category: "Masaj", city: "İstanbul", district: "Şişli", oldPrice: 1800, price: 890, sold: 512, rating: 4.9, left: d(18), points: 9 },
    { id: "d3", title: "Kapadokya 1 Gece Mağara Otel + Balon", business: "Göreme Vista", category: "Otel", city: "Nevşehir", district: "Göreme", oldPrice: 9800, price: 5490, sold: 94, rating: 4.7, left: d(120), points: 55 },
    { id: "d4", title: "Cilt Bakımı + Hydrafacial Paketi", business: "GlowLab Klinik", category: "Güzellik", city: "İstanbul", district: "Kadıköy", oldPrice: 3200, price: 1590, sold: 210, rating: 4.6, left: d(40), points: 16 },
    { id: "d5", title: "IMAX Sinema 2 Bilet + Büyük Mısır", business: "CinePlus Zorlu", category: "Sinema", city: "İstanbul", district: "Beşiktaş", oldPrice: 690, price: 349, sold: 1280, rating: 4.5, left: d(10), points: 3 },
    { id: "d6", title: "Hafta Sonu Yoga Retreat", business: "FitPark Studio", category: "Spor", city: "İstanbul", district: "Ataşehir", oldPrice: 1500, price: 790, sold: 86, rating: 4.7, left: d(80), points: 8 },
    { id: "d7", title: "Araç Bakım + Yağ Değişimi", business: "OtoCare Zincir", category: "Araç bakım", city: "Ankara", district: "Çankaya", oldPrice: 4200, price: 2490, sold: 73, rating: 4.4, left: d(200), points: 25 },
    { id: "d8", title: "Brunch for 2 — Karaköy", business: "Karaköy Kahve", category: "Restoran", city: "İstanbul", district: "Beyoğlu", oldPrice: 980, price: 549, sold: 640, rating: 4.8, left: d(30), points: 5 }
  ];

  const listings = [
    { id: "l1", title: "iPhone 15 Pro 256GB - Sıfıra Yakın", category: "Telefon", price: 42900, negotiable: true, condition: "Sıfıra yakın", city: "İstanbul", district: "Kadıköy", sellerId: "u-mehmet", seller: "Mehmet K.", memberSince: "2024-03-12", rating: 4.9, date: d(-40), status: "Aktif" },
    { id: "l2", title: "2021 Volkswagen Golf 1.0 TSI", category: "Otomobil", price: 985000, negotiable: true, condition: "İyi", city: "Ankara", district: "Çankaya", sellerId: "u-ayse", seller: "Ayşe T.", memberSince: "2023-11-02", rating: 4.7, date: d(-90), status: "Aktif" },
    { id: "l3", title: "IKEA Koltuk Takımı 3+2", category: "Mobilya", price: 12500, negotiable: true, condition: "Çok iyi", city: "İzmir", district: "Bornova", sellerId: "u-can", seller: "Can Y.", memberSince: "2025-01-20", rating: 4.5, date: d(-12), status: "Aktif" },
    { id: "l4", title: "MacBook Air M2 16GB/512GB", category: "Bilgisayar", price: 28500, negotiable: false, condition: "Çok iyi", city: "İstanbul", district: "Beşiktaş", sellerId: "u-mehmet", seller: "Mehmet K.", memberSince: "2024-03-12", rating: 4.9, date: d(-8), status: "Aktif" },
    { id: "l5", title: "Trek Marlin 7 Dağ Bisikleti", category: "Spor", price: 18500, negotiable: true, condition: "İyi", city: "Bursa", district: "Nilüfer", sellerId: "u-can", seller: "Can Y.", memberSince: "2025-01-20", rating: 4.5, date: d(-20), status: "Aktif" },
    { id: "l6", title: "Bebek Arabası Chicco Trio", category: "Anne & Bebek", price: 3900, negotiable: true, condition: "Kullanılmış", city: "İstanbul", district: "Üsküdar", sellerId: "u-ayse", seller: "Ayşe T.", memberSince: "2023-11-02", rating: 4.7, date: d(-5), status: "Aktif" }
  ];

  const stores = [
    { id: "s1", brandId: "b-urbanwear", name: "UrbanWear Bağdat Caddesi", category: "Giyim", address: "Bağdat Cad. No:182, Kadıköy", city: "İstanbul", distance: 0.8, discount: 15, hours: "10:00–22:00", phone: "0216 333 11 22", rating: 4.7, lat: 40.966, lng: 29.063, terminal: "POS-UW-001" },
    { id: "s2", brandId: "b-glowlab", name: "GlowLab Nişantaşı", category: "Güzellik", address: "Abdi İpekçi Cad. No:40, Şişli", city: "İstanbul", distance: 4.2, discount: 20, hours: "09:00–21:00", phone: "0212 240 80 10", rating: 4.8, lat: 41.05, lng: 28.99, terminal: "POS-GL-014" },
    { id: "s3", brandId: "b-marketim", name: "Marketim Caddebostan", category: "Market", address: "Caddebostan Mah. Noter Sk. 7", city: "İstanbul", distance: 1.4, discount: 10, hours: "08:00–23:00", phone: "0216 411 00 12", rating: 4.4, lat: 40.966, lng: 29.07, terminal: "POS-MK-088" },
    { id: "s4", brandId: "b-fitpark", name: "FitPark Ataşehir", category: "Spor", address: "Ataşehir Bulvarı No:12", city: "İstanbul", distance: 6.1, discount: 25, hours: "06:30–23:00", phone: "0216 570 45 45", rating: 4.6, lat: 40.992, lng: 29.127, terminal: "POS-FP-003" },
    { id: "s5", brandId: "b-novatech", name: "NovaTech Zorlu Center", category: "Teknoloji", address: "Zorlu Center, Beşiktaş", city: "İstanbul", distance: 7.8, discount: 8, hours: "10:00–22:00", phone: "0212 353 10 10", rating: 4.7, lat: 41.067, lng: 29.017, terminal: "POS-NT-221" },
    { id: "s6", brandId: "b-karaca", name: "Karaca Home Akmerkez", category: "Ev & Yaşam", address: "Akmerkez, Etiler", city: "İstanbul", distance: 8.4, discount: 12, hours: "10:00–22:00", phone: "0212 282 01 70", rating: 4.5, lat: 41.08, lng: 29.01, terminal: "POS-KR-019" },
    { id: "s7", name: "Salıpazarı Meyhane", category: "Restoran", address: "Salıpazarı, Karaköy", city: "İstanbul", distance: 9.1, discount: 30, hours: "12:00–00:00", phone: "0212 293 44 11", rating: 4.8, lat: 41.026, lng: 28.984, terminal: "POS-SM-001" },
    { id: "s8", name: "Nişantaşı Spa House", category: "Sağlık", address: "Teşvikiye Cad. No:18", city: "İstanbul", distance: 5.0, discount: 18, hours: "10:00–21:00", phone: "0212 225 67 80", rating: 4.9, lat: 41.05, lng: 28.994, terminal: "POS-SP-007" }
  ];

  const users = [
    { id: "u-admin", firstName: "Selin", lastName: "Aydın", email: "admin@demo.com", password: "123456", phone: "05320000001", role: "super_admin", city: "İstanbul", district: "Beşiktaş" },
    { id: "u-brand", firstName: "Kerem", lastName: "Yıldız", email: "brand@demo.com", password: "123456", phone: "05320000002", role: "merchant_admin", merchantId: "b-urbanwear", city: "İstanbul", district: "Kadıköy" },
    { id: "u-user", firstName: "Fatih", lastName: "Erdem", email: "user@demo.com", password: "123456", phone: "05321234567", role: "customer", city: "İstanbul", district: "Kadıköy", birthDate: "1994-04-12", gender: "Erkek", loyaltyId: "LYT-95847291", points: 22450, spendable: 12450, wallet: 320, cashbackPending: 48, referral: "FATIH250", tier: "Gold" },
    { id: "u-mehmet", firstName: "Mehmet", lastName: "Kaya", email: "mehmet@demo.com", password: "123456", role: "customer", loyaltyId: "LYT-44120911", points: 2100, city: "İstanbul", district: "Beşiktaş" },
    { id: "u-ayse", firstName: "Ayşe", lastName: "Tekin", email: "ayse@demo.com", password: "123456", role: "customer", loyaltyId: "LYT-88210044", points: 8600, city: "Ankara", district: "Çankaya" },
    { id: "u-can", firstName: "Can", lastName: "Yılmaz", email: "can@demo.com", password: "123456", role: "customer", loyaltyId: "LYT-11993320", points: 740, city: "İzmir", district: "Bornova" }
  ];

  const tiers = [
    { id: "bronze", name: "Bronze", min: 0, max: 5000, cashback: 1, extraPoints: 0, freeShipping: false, birthday: 100, earlyAccess: false, vip: false },
    { id: "silver", name: "Silver", min: 5001, max: 20000, cashback: 2, extraPoints: 5, freeShipping: false, birthday: 250, earlyAccess: true, vip: false },
    { id: "gold", name: "Gold", min: 20001, max: 50000, cashback: 3, extraPoints: 10, freeShipping: true, birthday: 500, earlyAccess: true, vip: true },
    { id: "platinum", name: "Platinum", min: 50001, max: 999999999, cashback: 5, extraPoints: 20, freeShipping: true, birthday: 1000, earlyAccess: true, vip: true }
  ];

  const coupons = [
    { id: "c1", code: "WELCOME250", type: "sabit", value: 250, min: 1500, title: "₺1.500 üzeri alışverişe ₺250", status: "Aktif" },
    { id: "c2", code: "GOLD5", type: "yüzde", value: 5, min: 0, title: "Gold üyelere ekstra %5", status: "Aktif", segment: "Gold" },
    { id: "c3", code: "KARGO0", type: "kargo", value: 0, min: 250, title: "Ücretsiz kargo", status: "Aktif" },
    { id: "c4", code: "MODA12", type: "kategori", value: 12, min: 0, title: "Moda kategorisinde %12", category: "Moda", status: "Aktif" },
    { id: "c5", code: "BDAY400", type: "doğum günü", value: 400, min: 0, title: "Doğum günü hediyesi ₺400", status: "Aktif" }
  ];

  const orders = [
    { id: "AV-10482", userId: "u-user", items: [{ productId: "p4", name: "GlowLab C Vitamini Serum 50 ml", qty: 2, price: 589, seller: "GlowLab" }], total: 1178, status: "Teslim Edildi", date: d(-240), pointsEarned: 12, address: "Caferağa Mah. Moda Cad. 14, Kadıköy" },
    { id: "AV-10591", userId: "u-user", items: [{ productId: "p3", name: "UrbanWear Runner 2026", qty: 1, price: 2499, seller: "UrbanWear" }], total: 2499, status: "Kargoya Verildi", date: d(-30), pointsEarned: 25, cargo: "Yurtiçi Kargo • 1Z9982TR", address: "Caferağa Mah. Moda Cad. 14, Kadıköy" },
    { id: "AV-10620", userId: "u-user", items: [{ productId: "p1", name: "Aether Phone 17 Pro 256 GB", qty: 1, price: 74999, seller: "Aether Store" }], total: 74999, status: "Hazırlanıyor", date: d(-8), pointsEarned: 750, address: "Caferağa Mah. Moda Cad. 14, Kadıköy" },
    { id: "AV-10644", userId: "u-ayse", items: [{ productId: "p12", name: "NovaTech AirBook 14 OLED", qty: 1, price: 42990, seller: "NovaTech" }], total: 42990, status: "Ödeme Alındı", date: d(-4), pointsEarned: 430 },
    { id: "AV-10651", userId: "u-mehmet", items: [{ productId: "p8", name: "Mavi Denim Slim Jean", qty: 1, price: 1199, seller: "Mavi Denim" }], total: 1199, status: "Yeni", date: d(-1), pointsEarned: 12 }
  ];

  const conversations = [
    {
      id: "cv1",
      listingId: "l1",
      title: "iPhone 15 Pro 256GB",
      with: "Mehmet K.",
      withId: "u-mehmet",
      userIds: ["u-user", "u-mehmet"],
      messages: [
        { id: "m1", from: "u-user", text: "Merhaba, ürün hala satılık mı?", at: d(-6) },
        { id: "m2", from: "u-mehmet", text: "Evet, satılık.", at: d(-5.8) },
        { id: "m3", from: "u-user", text: "₺8.500 olur mu?", at: d(-5.5), offer: 8500 },
        { id: "m4", from: "u-mehmet", text: "Biraz düşük, 40.000 düşünebilirim.", at: d(-5) }
      ]
    },
    {
      id: "cv2",
      listingId: "l4",
      title: "MacBook Air M2",
      with: "Mehmet K.",
      withId: "u-mehmet",
      userIds: ["u-user", "u-mehmet"],
      messages: [
        { id: "m5", from: "u-user", text: "Cihazın batarya sağlığı nedir?", at: d(-20) },
        { id: "m6", from: "u-mehmet", text: "%92, kutusu da duruyor.", at: d(-19) }
      ]
    }
  ];

  const notifications = [
    { id: "n1", title: "Yeni sipariş alındı", body: "AV-10651 hazırlanmayı bekliyor.", at: d(-0.03), type: "sipariş", unread: true },
    { id: "n2", title: "Gold seviyesine yükseldiniz", body: "Fiziksel mağazalarda %10 indirim aktif.", at: d(-1), type: "loyalty", unread: true },
    { id: "n3", title: "Fiyat alarmınızdaki ürün düştü", body: "Aether Phone 17 Pro ₺74.999 oldu.", at: d(-3), type: "fiyat alarmı", unread: true },
    { id: "n4", title: "Fırsat voucher’ınız hazır", body: "DEAL-A8F73C kodlu kupon kullanılabilir.", at: d(-10), type: "voucher", unread: false },
    { id: "n5", title: "Mehmet size mesaj gönderdi", body: "Evet, satılık.", at: d(-5.8), type: "mesaj", unread: false }
  ];

  const loyaltyTx = [
    { id: "t1", userId: "u-user", type: "earn", amount: 12, source: "online", referenceId: "AV-10482", balanceBefore: 12138, balanceAfter: 12150, createdAt: d(-240) },
    { id: "t2", userId: "u-user", type: "bonus", amount: 250, source: "görev", referenceId: "TASK-FIRST", balanceBefore: 12150, balanceAfter: 12400, createdAt: d(-200) },
    { id: "t3", userId: "u-user", type: "earn", amount: 50, source: "check-in", referenceId: "CHK-0818", balanceBefore: 12400, balanceAfter: 12450, createdAt: d(-2) },
    { id: "t4", userId: "u-user", type: "spend", amount: -200, source: "mağaza", referenceId: "POS-UW-001", balanceBefore: 12650, balanceAfter: 12450, createdAt: d(-20) }
  ];

  const campaigns = [
    { id: "cp1", name: "Gold Extra %5", type: "% indirim", start: d(-48), end: d(200), status: "Aktif", segment: "Gold", channel: "online+mağaza" },
    { id: "cp2", name: "2 Al 1 Öde - Kozmetik", type: "2 al 1 öde", start: d(-10), end: d(80), status: "Aktif", segment: "Tümü", channel: "online" },
    { id: "cp3", name: "Happy Hour 18:00–21:00", type: "saat", start: d(-5), end: d(40), status: "Aktif", segment: "Tümü", channel: "mağaza" },
    { id: "cp4", name: "₺1.000 üzerine ₺150", type: "sepet", start: d(-30), end: d(10), status: "Aktif", segment: "Yeni müşteri", channel: "online" }
  ];

  const integrations = [
    { id: "trendyol", name: "Trendyol", status: "Bağlı", products: 1840, lastSync: d(-2) },
    { id: "hepsiburada", name: "Hepsiburada", status: "Bağlı", products: 1620, lastSync: d(-3) },
    { id: "amazon", name: "Amazon", status: "Senkronize Ediliyor", products: 980, lastSync: d(-0.2) },
    { id: "n11", name: "N11", status: "Bağlı", products: 1210, lastSync: d(-6) },
    { id: "pazarama", name: "Pazarama", status: "Bağlantı Yok", products: 0, lastSync: null },
    { id: "ciceksepeti", name: "ÇiçekSepeti", status: "Hata", products: 412, lastSync: d(-28) }
  ];

  const reviews = [
    { id: "r1", productId: "p1", user: "Ayşe T.", rating: 5, text: "Kutu orijinal, teslimat 1 günde geldi. Gold kargo gerçekten ücretsiz.", date: d(-20), photos: true },
    { id: "r2", productId: "p1", user: "Can Y.", rating: 4, text: "Performans çok iyi, şarj bir gün rahat yetiyor.", date: d(-12), photos: false },
    { id: "r3", productId: "p4", user: "Elif S.", rating: 5, text: "Cilt tonumu eşitledi, ikinci şişeyi aldım.", date: d(-4), photos: true }
  ];

  const questions = [
    { id: "q1", productId: "p1", q: "Türkiye garantili mi?", a: "Evet, 2 yıl Aether Türkiye garantisi ile gönderilir.", user: "Burak", date: d(-9) },
    { id: "q2", productId: "p1", q: "Tramvasız mı gelir?", a: "Fabrika bandrollü, açılmamış kutu.", user: "Deren", date: d(-3) }
  ];

  const priceHistory = {
    p1: [82000, 81500, 80990, 79990, 79200, 78490, 77990, 76990, 75990, 75490, 74999],
    p12: [47990, 46990, 45990, 44990, 43990, 42990]
  };

  const offers = [
    { store: "Avanta", price: 74999, shipping: 0, sellerRating: 4.9, delivery: "Yarın kapında", productId: "p1" },
    { store: "NovaTech Mağaza", price: 75449, shipping: 0, sellerRating: 4.7, delivery: "1-2 gün", productId: "p1" },
    { store: "TeknoPark", price: 76299, shipping: 79, sellerRating: 4.5, delivery: "2-3 gün", productId: "p1" },
    { store: "CityPhone", price: 78990, shipping: 0, sellerRating: 4.2, delivery: "3 gün", productId: "p1" }
  ];

  const tasks = [
    { id: "g1", title: "Profilini Tamamla", points: 100, progress: 80, done: false },
    { id: "g2", title: "İlk Siparişini Ver", points: 250, progress: 100, done: true },
    { id: "g3", title: "3 Farklı Markadan Alışveriş Yap", points: 500, progress: 66, done: false },
    { id: "g4", title: "Günlük check-in yap", points: 20, progress: 0, done: false },
    { id: "g5", title: "Bir fırsat satın al", points: 150, progress: 0, done: false }
  ];

  const badges = [
    { id: "yeni", name: "Yeni Üye", owned: true },
    { id: "avci", name: "Fırsat Avcısı", owned: true },
    { id: "sadik", name: "Sadık Müşteri", owned: true },
    { id: "tech", name: "Teknoloji Sever", owned: true },
    { id: "gold", name: "Gold Shopper", owned: true },
    { id: "plat", name: "Platinum Member", owned: false }
  ];

  const logs = [
    { user: "admin@demo.com", action: "Marka onaylandı", entity: "UrbanWear", entityId: "b-urbanwear", ip: "185.25.12.8", at: d(-40) },
    { user: "admin@demo.com", action: "Kupon oluşturuldu", entity: "WELCOME250", entityId: "c1", ip: "185.25.12.8", at: d(-30) },
    { user: "brand@demo.com", action: "Ürün fiyat güncellendi", entity: "UrbanWear Runner 2026", entityId: "p3", ip: "176.40.2.14", at: d(-12) },
    { user: "user@demo.com", action: "Sipariş oluşturuldu", entity: "AV-10620", entityId: "AV-10620", ip: "88.230.11.9", at: d(-8) },
    { user: "admin@demo.com", action: "Şikayet incelendi", entity: "LST-204", entityId: "l2", ip: "185.25.12.8", at: d(-2) }
  ];

  const payouts = [
    { id: "po1", brand: "UrbanWear", period: "Temmuz 2026", gross: 482750, commission: 57930, refund: 4200, net: 420620, status: "Ödenebilir" },
    { id: "po2", brand: "GlowLab", period: "Temmuz 2026", gross: 210440, commission: 31566, refund: 890, net: 177984, status: "Ödendi" },
    { id: "po3", brand: "NovaTech", period: "Temmuz 2026", gross: 910200, commission: 45510, refund: 12000, net: 852690, status: "İnceleniyor" }
  ];

  const tickets = [
    { id: "TK-1021", category: "Sipariş", subject: "Kargo gecikmesi", orderId: "AV-10591", status: "İşlemde", at: d(-6) },
    { id: "TK-1033", category: "Loyalty", subject: "Puan yansımadı", orderId: "AV-10482", status: "Yanıtlandı", at: d(-20) }
  ];

  const helpArticles = [
    { cat: "Sipariş", title: "Siparişimi nasıl takip ederim?", body: "Hesabım > Siparişlerim ekranından kargo hareketlerini canlı izleyebilirsiniz." },
    { cat: "Ödeme", title: "Hangi ödeme yöntemleri var?", body: "Kredi kartı, banka kartı, havale, cüzdan bakiyesi ve loyalty puanı kullanabilirsiniz." },
    { cat: "İade", title: "İade süresi nedir?", body: "Cayma hakkı 14 gündür. Fırsat voucher’larında işletme koşulları geçerlidir." },
    { cat: "Loyalty", title: "Puan nasıl kazanılır?", body: "₺100 alışveriş = 10 puan. Seviyenize göre ekstra puan ve cashback uygulanır." },
    { cat: "Fırsatlar", title: "Voucher nasıl kullanılır?", body: "İşletmede QR kodu gösterin. Personel POS ekranından okutur." },
    { cat: "İkinci El", title: "Güvenli alışveriş ipuçları", body: "Ödemeyi platform dışında yapmayın. Şüpheli ilanları şikayet edin." },
    { cat: "Satıcı", title: "Marka başvurusu ne kadar sürer?", body: "Evraklar tamamsa ortalama 2 iş günü içinde incelenir." },
    { cat: "Hesap", title: "Hesabımı nasıl silerim?", body: "Gizlilik Merkezi’nden hesap silme talebi oluşturabilirsiniz." }
  ];

  const commissions = [
    { scope: "Global", name: "Varsayılan", rate: 8 },
    { scope: "Kategori", name: "Elektronik", rate: 5 },
    { scope: "Kategori", name: "Moda", rate: 12 },
    { scope: "Kategori", name: "Kozmetik", rate: 15 },
    { scope: "Marka", name: "Aether Store", rate: 4 },
    { scope: "Marka", name: "UrbanWear", rate: 12 }
  ];

  const packages = [
    { name: "Starter", products: 100, branches: 2, users: 3, marketplaces: 1, api: false, price: 1490 },
    { name: "Professional", products: 2500, branches: 15, users: 12, marketplaces: 4, api: true, price: 4990 },
    { name: "Enterprise", products: "Sınırsız", branches: "Sınırsız", users: "Sınırsız", marketplaces: 6, api: true, price: 12990 }
  ];

  const applications = [
    { id: "ap1", brand: "Anadolu Kahve", firm: "Anadolu Kahve A.Ş.", category: "Restoran", date: d(-18), docs: "5/5", risk: "Düşük", status: "İnceleniyor" },
    { id: "ap2", brand: "Ege Spa", firm: "Ege Wellness Ltd.", category: "Sağlık", date: d(-40), docs: "3/5", risk: "Orta", status: "Evrak Bekleniyor" },
    { id: "ap3", brand: "Nordic Kids", firm: "Nordic Bebek A.Ş.", category: "Anne & Bebek", date: d(-2), docs: "5/5", risk: "Düşük", status: "Başvuru Alındı" }
  ];

  A.SEED = {
    categories,
    dealCategories,
    listingCategories,
    cities,
    brands,
    products,
    deals,
    listings,
    stores,
    users,
    tiers,
    coupons,
    orders,
    conversations,
    notifications,
    loyaltyTx,
    campaigns,
    integrations,
    reviews,
    questions,
    priceHistory,
    offers,
    tasks,
    badges,
    logs,
    payouts,
    tickets,
    helpArticles,
    commissions,
    packages,
    applications,
    favorites: { products: ["p4"], deals: ["d1"], listings: ["l1"], stores: ["s1"], brands: ["b-urbanwear"] },
    cart: [{ productId: "p2", qty: 1 }, { productId: "p4", qty: 2 }],
    follows: ["b-urbanwear", "b-glowlab"],
    priceAlerts: [{ productId: "p1", target: 69999 }],
    vouchers: [{ id: "v1", code: "DEAL-A8F73C", dealId: "d5", status: "Kullanılabilir", at: d(-10) }],
    session: null,
    cookie: null,
    profileExtras: { kvkk: true, marketing: false },
    rate: 0.1,
    checkinDate: null
  };
})(window.Avanta);
