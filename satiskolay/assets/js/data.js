/* SatışKolay — Mock Data */
window.SK = window.SK || {};

SK.BRANDS = {
  BMW: ["320i M Sport", "520d Luxury", "X3 xDrive20i", "iX xDrive40", "M340i"],
  "Mercedes-Benz": ["C200 AMG", "E220d Exclusive", "GLC 300", "EQA 250", "A180"],
  Audi: ["A5 Sportback", "A4 Avant", "Q5 S Line", "e-tron GT", "A3 Sportback"],
  Volkswagen: ["Tiguan Elegance", "Passat Variant", "Golf GTI", "ID.4 Pro", "Caddy Style"],
  Ford: ["Tourneo Courier Titanium", "Focus ST-Line", "Kuga Hybrid", "Puma ST", "Ranger Wildtrak"],
  Renault: ["Megane E-Tech", "Clio Techno", "Austral Iconic", "Captur Techno", "Talisman"],
  Peugeot: ["3008 GT", "208 Allure", "5008 GT", "408 GT", "2008 Allure"],
  Toyota: ["Corolla Hybrid", "RAV4 Hybrid", "C-HR", "Yaris Cross", "Camry"],
  Hyundai: ["Tucson Elite", "i20 Style", "Kona Electric", "Santa Fe", "Ioniq 5"],
  Tesla: ["Model Y", "Model 3", "Model S", "Model X"],
  TOGG: ["T10X", "T10F"]
};

SK.CITIES = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Kocaeli"];

SK.GALLERIES = [
  { id: "g1", name: "Premium Motors İstanbul", city: "İstanbul", district: "Bakırköy", cars: 48, rating: 4.9, verified: true, initials: "PM", color: "#1FA6A8" },
  { id: "g2", name: "Star Auto", city: "İstanbul", district: "Maslak", cars: 36, rating: 4.8, verified: true, initials: "SA", color: "#176B87" },
  { id: "g3", name: "Bosphorus Cars", city: "İstanbul", district: "Beşiktaş", cars: 52, rating: 4.7, verified: true, initials: "BC", color: "#16697A" },
  { id: "g4", name: "Anatolia Motors", city: "Ankara", district: "Çankaya", cars: 41, rating: 4.6, verified: true, initials: "AM", color: "#37B878" },
  { id: "g5", name: "Elite Garage", city: "İzmir", district: "Karşıyaka", cars: 29, rating: 4.8, verified: true, initials: "EG", color: "#1FA6A8" },
  { id: "g6", name: "Ege Premium", city: "İzmir", district: "Bornova", cars: 33, rating: 4.5, verified: true, initials: "EP", color: "#176B87" },
  { id: "g7", name: "Capital Auto", city: "Ankara", district: "Yenimahalle", cars: 44, rating: 4.7, verified: true, initials: "CA", color: "#F6A94A" },
  { id: "g8", name: "Akdeniz Garage", city: "Antalya", district: "Muratpaşa", cars: 27, rating: 4.6, verified: true, initials: "AG", color: "#16697A" }
];

SK.COLORS = [
  { id: "black", name: "Siyah", hex: "#1a1f24" },
  { id: "white", name: "Beyaz", hex: "#f4f7f9" },
  { id: "smoke", name: "Füme", hex: "#6b7280" },
  { id: "gray", name: "Gri", hex: "#9aa3ad" },
  { id: "navy", name: "Lacivert", hex: "#1e3a5f" },
  { id: "red", name: "Kırmızı", hex: "#c0392b" }
];

function carImage(seed, hue) {
  // SVG data URI car illustration placeholders
  const h = hue || (seed * 37) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#EEF6F8"/>
        <stop offset="100%" stop-color="#E3F0F4"/>
      </linearGradient>
      <linearGradient id="car" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="hsl(${h},45%,42%)"/>
        <stop offset="100%" stop-color="hsl(${h},50%,28%)"/>
      </linearGradient>
      <radialGradient id="sh" cx="50%" cy="80%" r="40%">
        <stop offset="0%" stop-color="#173042" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="#173042" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="800" height="500" fill="url(#bg)"/>
    <ellipse cx="400" cy="420" rx="220" ry="28" fill="url(#sh)"/>
    <path d="M140 310c20-70 80-110 160-120h180c70 8 130 50 160 120l40 20v40H100v-40l40-20z" fill="url(#car)"/>
    <path d="M270 195c30-35 70-50 120-50h40c55 5 95 30 120 70l-40 10c-20-25-50-40-85-42h-35c-40 2-70 18-90 42l-30-30z" fill="rgba(255,255,255,0.22)"/>
    <rect x="300" y="210" width="90" height="55" rx="8" fill="rgba(200,230,240,0.45)"/>
    <rect x="410" y="210" width="100" height="55" rx="8" fill="rgba(200,230,240,0.35)"/>
    <circle cx="230" cy="355" r="38" fill="#173042"/><circle cx="230" cy="355" r="18" fill="#8aa0ad"/>
    <circle cx="570" cy="355" r="38" fill="#173042"/><circle cx="570" cy="355" r="18" fill="#8aa0ad"/>
    <rect x="155" y="300" width="28" height="18" rx="4" fill="#f6fafc" opacity="0.85"/>
    <rect x="610" y="300" width="28" height="18" rx="4" fill="#1FA6A8" opacity="0.9"/>
    <text x="400" y="470" text-anchor="middle" font-family="Quicksand,Arial" font-size="18" fill="#176B87" opacity="0.55">SatışKolay</text>
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

SK.CARS = [
  {
    id: "c1", brand: "BMW", model: "320i M Sport", package: "M Sport", year: 2024, km: 12450,
    fuel: "Benzin", transmission: "Otomatik", bodyType: "Sedan", city: "İstanbul", district: "Bakırköy",
    price: 3245000, oldPrice: null, monthlyPayment: 82450, horsepower: 184, engine: "2.0 Turbo",
    torque: "300 Nm", drive: "Arkadan İtiş", accel: "7.1 sn", consumption: "6.5 L", trunk: "480 L",
    color: "Siyah", galleryId: "g1", verified: true, expertise: true, kolayScore: 91,
    marketPrice: 3420000, range: 450, battery: null, charge: null, electric: false,
    trendy: 1, damaged: false, tramer: 17450, painted: 2, replaced: 1, condition: 92,
    tags: ["premium", "sedan"], hue: 210
  },
  {
    id: "c2", brand: "Mercedes-Benz", model: "C200 AMG", package: "AMG Line", year: 2023, km: 21850,
    fuel: "Benzin", transmission: "Otomatik", bodyType: "Sedan", city: "İstanbul", district: "Maslak",
    price: 3480000, oldPrice: null, monthlyPayment: 88900, horsepower: 204, engine: "1.5 Mild Hybrid",
    torque: "300 Nm", drive: "Arkadan İtiş", accel: "7.3 sn", consumption: "6.8 L", trunk: "455 L",
    color: "Beyaz", galleryId: "g2", verified: true, expertise: true, kolayScore: 88,
    marketPrice: 3550000, range: 420, battery: null, charge: null, electric: false,
    trendy: 2, damaged: false, tramer: 0, painted: 0, replaced: 0, condition: 95,
    tags: ["premium", "sedan"], hue: 200
  },
  {
    id: "c3", brand: "Audi", model: "A5 Sportback", package: "S Line", year: 2024, km: 8900,
    fuel: "Benzin", transmission: "Otomatik", bodyType: "Coupe", city: "İstanbul", district: "Beşiktaş",
    price: 4115000, oldPrice: null, monthlyPayment: 104200, horsepower: 204, engine: "2.0 TFSI",
    torque: "320 Nm", drive: "Quattro", accel: "6.8 sn", consumption: "7.1 L", trunk: "465 L",
    color: "Füme", galleryId: "g3", verified: true, expertise: true, kolayScore: 93,
    marketPrice: 4250000, range: 440, battery: null, charge: null, electric: false,
    trendy: 3, damaged: false, tramer: 8500, painted: 1, replaced: 0, condition: 94,
    tags: ["premium", "coupe"], hue: 220
  },
  {
    id: "c4", brand: "Volkswagen", model: "Tiguan Elegance", package: "Elegance", year: 2025, km: 3200,
    fuel: "Benzin", transmission: "Otomatik", bodyType: "SUV", city: "İstanbul", district: "Kadıköy",
    price: 2785000, oldPrice: 2850000, monthlyPayment: 71200, horsepower: 150, engine: "1.5 TSI",
    torque: "250 Nm", drive: "Önden Çekiş", accel: "9.2 sn", consumption: "6.4 L", trunk: "615 L",
    color: "Gri", galleryId: "g1", verified: true, expertise: true, kolayScore: 90,
    marketPrice: 2890000, range: 480, battery: null, charge: null, electric: false,
    trendy: 4, damaged: false, tramer: 0, painted: 0, replaced: 0, condition: 98,
    tags: ["suv", "family"], hue: 185
  },
  {
    id: "c5", brand: "Ford", model: "Tourneo Courier Titanium", package: "Titanium", year: 2025, km: 22000,
    fuel: "Dizel", transmission: "Otomatik", bodyType: "Ticari", city: "Ankara", district: "Çankaya",
    price: 1690000, oldPrice: null, monthlyPayment: 42800, horsepower: 100, engine: "1.5 EcoBlue",
    torque: "250 Nm", drive: "Önden Çekiş", accel: "12.5 sn", consumption: "5.2 L", trunk: "810 L",
    color: "Beyaz", galleryId: "g4", verified: true, expertise: false, kolayScore: 84,
    marketPrice: 1750000, range: 520, battery: null, charge: null, electric: false,
    trendy: null, damaged: false, tramer: 12000, painted: 1, replaced: 0, condition: 88,
    tags: ["commercial", "family"], hue: 195
  },
  {
    id: "c6", brand: "TOGG", model: "T10X", package: "V2 RWD", year: 2025, km: 6500,
    fuel: "Elektrik", transmission: "Otomatik", bodyType: "SUV", city: "Bursa", district: "Nilüfer",
    price: 2150000, oldPrice: null, monthlyPayment: 54800, horsepower: 218, engine: "Elektrik",
    torque: "350 Nm", drive: "Arkadan İtiş", accel: "7.6 sn", consumption: "16.9 kWh", trunk: "481 L",
    color: "Anadolu Kırmızısı", galleryId: "g5", verified: true, expertise: true, kolayScore: 94,
    marketPrice: 2280000, range: 523, battery: "52.4 kWh", charge: "DC 180 kW", electric: true,
    trendy: 5, damaged: false, tramer: 0, painted: 0, replaced: 0, condition: 97,
    tags: ["electric", "suv", "premium"], hue: 5
  },
  {
    id: "c7", brand: "Tesla", model: "Model Y", package: "Long Range", year: 2025, km: 11400,
    fuel: "Elektrik", transmission: "Otomatik", bodyType: "SUV", city: "İstanbul", district: "Ataşehir",
    price: 2680000, oldPrice: 2795000, monthlyPayment: 68200, horsepower: 343, engine: "Dual Motor",
    torque: "493 Nm", drive: "AWD", accel: "5.0 sn", consumption: "15.8 kWh", trunk: "854 L",
    color: "Pearl White", galleryId: "g2", verified: true, expertise: true, kolayScore: 92,
    marketPrice: 2850000, range: 533, battery: "75 kWh", charge: "250 kW", electric: true,
    trendy: 6, damaged: false, tramer: 0, painted: 0, replaced: 0, condition: 96,
    tags: ["electric", "suv", "premium"], hue: 215
  },
  {
    id: "c8", brand: "Peugeot", model: "3008 GT", package: "GT", year: 2024, km: 16500,
    fuel: "Hibrit", transmission: "Otomatik", bodyType: "SUV", city: "İzmir", district: "Karşıyaka",
    price: 2465000, oldPrice: null, monthlyPayment: 62800, horsepower: 180, engine: "1.6 Hybrid",
    torque: "360 Nm", drive: "Önden Çekiş", accel: "8.1 sn", consumption: "5.4 L", trunk: "520 L",
    color: "Lacivert", galleryId: "g5", verified: true, expertise: true, kolayScore: 89,
    marketPrice: 2550000, range: 460, battery: "12.4 kWh", charge: null, electric: false,
    trendy: 7, damaged: false, tramer: 6500, painted: 1, replaced: 0, condition: 91,
    tags: ["suv", "family"], hue: 230
  },
  {
    id: "c9", brand: "Hyundai", model: "Tucson Elite", package: "Elite", year: 2024, km: 19800,
    fuel: "Hibrit", transmission: "Otomatik", bodyType: "SUV", city: "Ankara", district: "Yenimahalle",
    price: 2295000, oldPrice: 2450000, monthlyPayment: 58500, horsepower: 215, engine: "1.6 Hybrid",
    torque: "367 Nm", drive: "AWD", accel: "8.0 sn", consumption: "5.6 L", trunk: "616 L",
    color: "Gri", galleryId: "g7", verified: true, expertise: true, kolayScore: 90,
    marketPrice: 2380000, range: 470, battery: null, charge: null, electric: false,
    trendy: 8, damaged: false, tramer: 0, painted: 0, replaced: 0, condition: 93,
    tags: ["suv", "family"], hue: 175
  },
  {
    id: "c10", brand: "Toyota", model: "Corolla Hybrid", package: "Flame X-Pack", year: 2023, km: 28500,
    fuel: "Hibrit", transmission: "Otomatik", bodyType: "Sedan", city: "İstanbul", district: "Ümraniye",
    price: 1595000, oldPrice: null, monthlyPayment: 40500, horsepower: 122, engine: "1.8 Hybrid",
    torque: "142 Nm", drive: "Önden Çekiş", accel: "10.9 sn", consumption: "4.5 L", trunk: "471 L",
    color: "Beyaz", galleryId: "g3", verified: true, expertise: true, kolayScore: 87,
    marketPrice: 1650000, range: 500, battery: null, charge: null, electric: false,
    trendy: null, damaged: false, tramer: 9200, painted: 2, replaced: 0, condition: 89,
    tags: ["sedan", "city", "economy"], hue: 160
  },
  {
    id: "c11", brand: "Renault", model: "Megane E-Tech", package: "Iconic", year: 2024, km: 9200,
    fuel: "Elektrik", transmission: "Otomatik", bodyType: "Hatchback", city: "İzmir", district: "Bornova",
    price: 1890000, oldPrice: null, monthlyPayment: 48100, horsepower: 220, engine: "Elektrik",
    torque: "300 Nm", drive: "Önden Çekiş", accel: "7.4 sn", consumption: "15.5 kWh", trunk: "440 L",
    color: "Turkuaz", galleryId: "g6", verified: true, expertise: true, kolayScore: 88,
    marketPrice: 1980000, range: 450, battery: "60 kWh", charge: "130 kW", electric: true,
    trendy: null, damaged: false, tramer: 0, painted: 0, replaced: 0, condition: 95,
    tags: ["electric", "city"], hue: 175
  },
  {
    id: "c12", brand: "BMW", model: "iX xDrive40", package: "Sport", year: 2024, km: 14200,
    fuel: "Elektrik", transmission: "Otomatik", bodyType: "SUV", city: "İstanbul", district: "Sarıyer",
    price: 5250000, oldPrice: 5490000, monthlyPayment: 133500, horsepower: 326, engine: "Dual Motor",
    torque: "630 Nm", drive: "AWD", accel: "5.0 sn", consumption: "19.8 kWh", trunk: "500 L",
    color: "Siyah", galleryId: "g1", verified: true, expertise: true, kolayScore: 91,
    marketPrice: 5450000, range: 425, battery: "76.6 kWh", charge: "150 kW", electric: true,
    trendy: 9, damaged: false, tramer: 0, painted: 0, replaced: 0, condition: 96,
    tags: ["electric", "premium", "suv"], hue: 205
  },
  {
    id: "c13", brand: "Mercedes-Benz", model: "EQA 250", package: "Progressive", year: 2023, km: 24500,
    fuel: "Elektrik", transmission: "Otomatik", bodyType: "SUV", city: "Ankara", district: "Çankaya",
    price: 2890000, oldPrice: null, monthlyPayment: 73500, horsepower: 190, engine: "Elektrik",
    torque: "375 Nm", drive: "Önden Çekiş", accel: "8.6 sn", consumption: "16.2 kWh", trunk: "340 L",
    color: "Gri", galleryId: "g4", verified: true, expertise: true, kolayScore: 85,
    marketPrice: 2950000, range: 426, battery: "66.5 kWh", charge: "100 kW", electric: true,
    trendy: null, damaged: false, tramer: 15000, painted: 1, replaced: 1, condition: 90,
    tags: ["electric", "premium", "suv"], hue: 190
  },
  {
    id: "c14", brand: "Audi", model: "Q5 S Line", package: "S Line", year: 2023, km: 31200,
    fuel: "Dizel", transmission: "Otomatik", bodyType: "SUV", city: "Bursa", district: "Osmangazi",
    price: 3695000, oldPrice: 3850000, monthlyPayment: 94000, horsepower: 204, engine: "2.0 TDI",
    torque: "400 Nm", drive: "Quattro", accel: "7.6 sn", consumption: "6.1 L", trunk: "520 L",
    color: "Lacivert", galleryId: "g8", verified: true, expertise: true, kolayScore: 86,
    marketPrice: 3780000, range: 450, battery: null, charge: null, electric: false,
    trendy: null, damaged: false, tramer: 22000, painted: 2, replaced: 1, condition: 87,
    tags: ["suv", "premium", "family"], hue: 225
  },
  {
    id: "c15", brand: "Volkswagen", model: "Golf GTI", package: "GTI", year: 2024, km: 7800,
    fuel: "Benzin", transmission: "Otomatik", bodyType: "Hatchback", city: "İstanbul", district: "Kartal",
    price: 2450000, oldPrice: null, monthlyPayment: 62400, horsepower: 245, engine: "2.0 TSI",
    torque: "370 Nm", drive: "Önden Çekiş", accel: "6.3 sn", consumption: "7.4 L", trunk: "380 L",
    color: "Kırmızı", galleryId: "g2", verified: true, expertise: true, kolayScore: 89,
    marketPrice: 2520000, range: 400, battery: null, charge: null, electric: false,
    trendy: 10, damaged: false, tramer: 0, painted: 0, replaced: 0, condition: 97,
    tags: ["city", "premium"], hue: 0
  },
  {
    id: "c16", brand: "Ford", model: "Kuga Hybrid", package: "ST-Line", year: 2024, km: 15600,
    fuel: "Hibrit", transmission: "Otomatik", bodyType: "SUV", city: "Kocaeli", district: "İzmit",
    price: 2145000, oldPrice: 2290000, monthlyPayment: 54600, horsepower: 190, engine: "2.5 Hybrid",
    torque: "200 Nm", drive: "Önden Çekiş", accel: "9.1 sn", consumption: "5.3 L", trunk: "612 L",
    color: "Gri", galleryId: "g7", verified: true, expertise: false, kolayScore: 87,
    marketPrice: 2220000, range: 480, battery: null, charge: null, electric: false,
    trendy: null, damaged: false, tramer: 4500, painted: 1, replaced: 0, condition: 91,
    tags: ["suv", "family", "economy"], hue: 145
  },
  {
    id: "c17", brand: "Toyota", model: "RAV4 Hybrid", package: "Adventure", year: 2025, km: 4100,
    fuel: "Hibrit", transmission: "Otomatik", bodyType: "SUV", city: "Antalya", district: "Muratpaşa",
    price: 3120000, oldPrice: null, monthlyPayment: 79400, horsepower: 222, engine: "2.5 Hybrid",
    torque: "221 Nm", drive: "AWD", accel: "8.1 sn", consumption: "5.0 L", trunk: "580 L",
    color: "Beyaz", galleryId: "g8", verified: true, expertise: true, kolayScore: 93,
    marketPrice: 3250000, range: 500, battery: null, charge: null, electric: false,
    trendy: null, damaged: false, tramer: 0, painted: 0, replaced: 0, condition: 98,
    tags: ["suv", "family", "premium"], hue: 155
  },
  {
    id: "c18", brand: "Hyundai", model: "Ioniq 5", package: "Progressive", year: 2024, km: 18700,
    fuel: "Elektrik", transmission: "Otomatik", bodyType: "SUV", city: "İstanbul", district: "Maltepe",
    price: 2395000, oldPrice: 2550000, monthlyPayment: 61000, horsepower: 217, engine: "RWD Electric",
    torque: "350 Nm", drive: "Arkadan İtiş", accel: "7.4 sn", consumption: "16.7 kWh", trunk: "527 L",
    color: "Gri", galleryId: "g3", verified: true, expertise: true, kolayScore: 91,
    marketPrice: 2520000, range: 454, battery: "58 kWh", charge: "220 kW", electric: true,
    trendy: null, damaged: false, tramer: 0, painted: 0, replaced: 0, condition: 94,
    tags: ["electric", "suv", "city"], hue: 200
  },
  {
    id: "c19", brand: "Peugeot", model: "208 Allure", package: "Allure", year: 2023, km: 24500,
    fuel: "Benzin", transmission: "Manuel", bodyType: "Hatchback", city: "İzmir", district: "Konak",
    price: 1125000, oldPrice: 1195000, monthlyPayment: 28600, horsepower: 100, engine: "1.2 PureTech",
    torque: "205 Nm", drive: "Önden Çekiş", accel: "10.8 sn", consumption: "5.1 L", trunk: "311 L",
    color: "Sarı", galleryId: "g6", verified: false, expertise: true, kolayScore: 82,
    marketPrice: 1180000, range: 380, battery: null, charge: null, electric: false,
    trendy: null, damaged: false, tramer: 7800, painted: 2, replaced: 0, condition: 86,
    tags: ["city", "economy"], hue: 45
  },
  {
    id: "c20", brand: "BMW", model: "X3 xDrive20i", package: "xLine", year: 2022, km: 42000,
    fuel: "Benzin", transmission: "Otomatik", bodyType: "SUV", city: "İstanbul", district: "Bakırköy",
    price: 2695000, oldPrice: 2850000, monthlyPayment: 68600, horsepower: 184, engine: "2.0 Turbo",
    torque: "300 Nm", drive: "xDrive", accel: "8.3 sn", consumption: "7.4 L", trunk: "550 L",
    color: "Siyah", galleryId: "g1", verified: true, expertise: true, kolayScore: 84,
    marketPrice: 2780000, range: 450, battery: null, charge: null, electric: false,
    trendy: null, damaged: false, tramer: 28500, painted: 3, replaced: 1, condition: 85,
    tags: ["suv", "premium", "family"], hue: 210
  }
];

// Attach images
SK.CARS.forEach((c, i) => {
  c.image = carImage(i + 1, c.hue);
  c.name = `${c.brand} ${c.model}`;
  c.model3d = null;
  c.warranty = c.year >= 2024 ? "2 Yıl Galeri Garantisi" : "1 Yıl Galeri Garantisi";
  c.features = {
    security: ["ABS", "ESP", "Şerit Takip", "Kör Nokta Uyarısı", "Adaptive Cruise Control"],
    comfort: ["Elektrikli Koltuk", "Hafızalı Koltuk", "Isıtmalı Koltuk", "Panoramik Cam Tavan"],
    multimedia: ["Apple CarPlay", "Android Auto", "Harman Kardon", "Dijital Gösterge"]
  };
  c.expertiseMap = {
    hood: "original",
    roof: "original",
    frontLeftFender: c.painted >= 1 ? "painted" : "original",
    frontRightFender: c.painted >= 2 ? "painted" : "original",
    frontLeftDoor: "original",
    frontRightDoor: "original",
    rearLeftDoor: c.painted >= 2 ? "local" : "original",
    rearRightDoor: "original",
    rearLeftFender: c.replaced >= 1 ? "replaced" : "original",
    rearRightFender: "original",
    trunk: c.tramer > 20000 ? "painted" : "original"
  };
});

SK.EXPERTISE_LABELS = {
  original: { label: "Orijinal", color: "#37B878" },
  painted: { label: "Boyalı", color: "#F6A94A" },
  replaced: { label: "Değişen", color: "#E74C3C" },
  local: { label: "Lokal Boya", color: "#9B59B6" }
};

SK.NOTIFICATIONS = [
  { type: "price", title: "Fiyat düştü", text: "Favorindeki BMW 320i'nin fiyatı ₺85.000 düştü.", time: "12 dk" },
  { type: "new", title: "Yeni araç", text: "Kayıtlı aramana uygun 6 yeni araç eklendi.", time: "1 sa" },
  { type: "offer", title: "Teklif", text: "Galeriden yeni teklif aldın.", time: "3 sa" },
  { type: "test", title: "Test sürüşü", text: "Yarın 14:00 test sürüşü hatırlatması.", time: "Dün" }
];

SK.CATEGORIES = [
  { id: "suv", label: "SUV", icon: "car-side", filter: { bodyType: "SUV" } },
  { id: "sedan", label: "Sedan", icon: "car", filter: { bodyType: "Sedan" } },
  { id: "electric", label: "Elektrikli", icon: "bolt", filter: { fuel: "Elektrik" } },
  { id: "family", label: "Aile Arabası", icon: "users", filter: { tag: "family" } },
  { id: "city", label: "Şehir Otomobili", icon: "city", filter: { tag: "city" } },
  { id: "commercial", label: "Ticari", icon: "truck", filter: { bodyType: "Ticari" } },
  { id: "premium", label: "Premium", icon: "gem", filter: { tag: "premium" } },
  { id: "economy", label: "Ekonomik", icon: "coins", filter: { tag: "economy" } }
];
