/* Demo seed data — realistic Turkish PropTech dataset */
window.REMS = window.REMS || {};

const PHOTO = (id, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const PROPERTY_PHOTOS = [
  '1560518883-ce09059eeffa', '1600596542815-ffad4c1539a9', '1600585154340-be6161a56a0c',
  '1600607687939-ce8a6c25118c', '1600566753190-17f0baa2a6c3', '1600047509807-ba2260eeea5f',
  '1600585154526-990dced4db0d', '1502672260266-1c1ef2d93688', '1493809842364-78817add7ffb',
  '1512917774080-9991f1c4c750', '1522708323590-d24dbb6b0267', '1560448204-e02f11c3d0e2',
  '1570129477492-45c003edd2be', '1605276374104-ded2bb5b5e8a', '1600210492486-724fe5c67fb0',
  '1613490493576-7fde63acd811', '1605146768851-eda79da39897', '1580587771525-78b9dba3b914',
  '1600047509358-9dc4651000f0', '1600573472550-8090b5e0745e'
];

function pickPhotos(n = 8, seed = 0) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push({
      id: `ph-${seed}-${i}`,
      url: PHOTO(PROPERTY_PHOTOS[(seed + i) % PROPERTY_PHOTOS.length]),
      isCover: i === 0,
      order: i
    });
  }
  return arr;
}

REMS.CONST = {
  STORAGE_KEY: 'rems_proptech_v2',
  ROLES: [
    'Süper Admin', 'Firma Sahibi', 'Şube Müdürü', 'Emlak Danışmanı',
    'Portföy Yöneticisi', 'Çağrı Merkezi', 'Muhasebe', 'Ofis Personeli', 'Mülk Sahibi'
  ],
  PROPERTY_TYPES: [
    'Daire', 'Rezidans', 'Villa', 'Müstakil Ev', 'Arsa', 'Tarla', 'Dükkan', 'Mağaza',
    'Ofis', 'Plaza', 'Depo', 'Fabrika', 'Otel', 'Bina', 'Devremülk', 'Ticari', 'Diğer'
  ],
  TRANSACTION_TYPES: ['Satılık', 'Kiralık', 'Günlük Kiralık'],
  PROPERTY_STATUSES: [
    'Yeni', 'Aktif', 'Pasif', 'Opsiyonlu', 'Teklif Var', 'Satıldı', 'Kiralandı', 'Yetki Bitti', 'Arşiv'
  ],
  AUTHORITY_TYPES: ['Yetkili', 'Tek Yetkili', 'Yetkisiz', 'Ortak Portföy'],
  LEAD_SOURCES: [
    'Web Sitesi', 'Sahibinden', 'Hepsiemlak', 'Emlakjet', 'Instagram', 'Facebook',
    'Google Ads', 'WhatsApp', 'Telefon', 'Referans', 'Ofis', 'Diğer'
  ],
  LEAD_STATUSES: [
    'Yeni', 'Aranacak', 'İletişim Kuruldu', 'Nitelikli', 'Randevu', 'Yer Gösterme',
    'Teklif', 'Pazarlık', 'Sözleşme', 'Kazanıldı', 'Kaybedildi'
  ],
  LOST_REASONS: [
    'Bütçe', 'Fiyat', 'Bölge', 'Vazgeçti', 'Rakip', 'Ulaşılamadı', 'Kredi', 'Portföy satıldı', 'Diğer'
  ],
  APPOINTMENT_TYPES: [
    'Ofis Görüşmesi', 'Telefon Görüşmesi', 'Video Görüşme', 'Yer Gösterme', 'Tapu', 'Sözleşme'
  ],
  SALE_STEPS: [
    'Teklif Kabul Edildi', 'Kapora Bekleniyor', 'Kapora Alındı', 'Evrak Hazırlanıyor',
    'Kredi İşlemleri', 'Tapu Randevusu', 'Tapu Gerçekleşti', 'Komisyon Tahsil Edildi', 'Satış Kapandı'
  ],
  RENTAL_STEPS: [
    'Teklif', 'Mülk Sahibi Onayı', 'Kiracı Evrakları', 'Kira Sözleşmesi',
    'Depozito', 'İlk Kira', 'Komisyon', 'Anahtar Teslim', 'Kiralama Tamamlandı'
  ],
  DISTRICTS: [
    { il: 'İstanbul', ilce: 'Bakırköy', mahalle: ['Ataköy 7-8-9-10. Kısım', 'Kartaltepe', 'Yeşilköy', 'Florya', 'Şenlikköy', 'Osmaniye'] },
    { il: 'İstanbul', ilce: 'Zeytinburnu', mahalle: ['Merkezefendi', 'Nuripaşa', 'Maltepe', 'Gökalp'] },
    { il: 'İstanbul', ilce: 'Bahçelievler', mahalle: ['Şirinevler', 'Yenibosna', 'Kocasinan', 'Soğanlı'] },
    { il: 'İstanbul', ilce: 'Güngören', mahalle: ['Merter', 'Güneştepe', 'Tozkoparan'] },
    { il: 'İstanbul', ilce: 'Beşiktaş', mahalle: ['Levent', 'Etiler', 'Bebek', 'Ortaköy', 'Akatlar'] },
    { il: 'İstanbul', ilce: 'Şişli', mahalle: ['Nişantaşı', 'Mecidiyeköy', 'Osmanbey', 'Bomonti'] },
    { il: 'İstanbul', ilce: 'Kadıköy', mahalle: ['Moda', 'Caferağa', 'Fenerbahçe', 'Göztepe', 'Kozyatağı'] },
    { il: 'İstanbul', ilce: 'Ataşehir', mahalle: ['Barbaros', 'Küçükbakkalköy', 'Atatürk', 'İçerenköy'] },
    { il: 'İstanbul', ilce: 'Başakşehir', mahalle: ['Bahçeşehir', 'Kayaşehir', 'Başak'] },
    { il: 'İstanbul', ilce: 'Üsküdar', mahalle: ['Çengelköy', 'Kuzguncuk', 'Altunizade'] }
  ],
  COORDS: {
    'Bakırköy': [40.9801, 28.8726],
    'Ataköy 7-8-9-10. Kısım': [40.9785, 28.8550],
    'Yeşilköy': [40.9590, 28.8230],
    'Florya': [40.9740, 28.7900],
    'Zeytinburnu': [40.9930, 28.9040],
    'Bahçelievler': [41.0020, 28.8590],
    'Beşiktaş': [41.0430, 29.0060],
    'Levent': [41.0810, 29.0120],
    'Şişli': [41.0600, 28.9870],
    'Kadıköy': [40.9900, 29.0300],
    'Moda': [40.9840, 29.0250],
    'Ataşehir': [40.9920, 29.1270],
    'Başakşehir': [41.0970, 28.8020],
    'Üsküdar': [41.0250, 29.0150]
  }
};

const FIRST = ['Ahmet', 'Mehmet', 'Murat', 'Ayşe', 'Fatma', 'Zeynep', 'Emre', 'Can', 'Elif', 'Burak', 'Selin', 'Deniz', 'Merve', 'Cem', 'Gizem', 'Hakan', 'İrem', 'Onur', 'Seda', 'Tolga', 'Yasemin', 'Kerem', 'Pınar', 'Serkan', 'Derya'];
const LAST = ['Yılmaz', 'Demir', 'Kaya', 'Çelik', 'Şahin', 'Yıldız', 'Öztürk', 'Aydın', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Kara', 'Koç', 'Aksoy', 'Erdoğan', 'Güneş', 'Polat', 'Özdemir', 'Yıldırım', 'Acar', 'Kurt', 'Özer', 'Tekin'];

function nameAt(i) {
  return `${FIRST[i % FIRST.length]} ${LAST[(i * 3) % LAST.length]}`;
}
function phoneAt(i) {
  const n = String(500000000 + i * 137).slice(0, 10);
  return `0${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6, 8)} ${n.slice(8, 10)}`;
}
function emailAt(name, i) {
  const slug = name.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/\s+/g, '.');
  return `${slug}${i}@email.com`;
}

REMS.generateSeed = function () {
  const branches = [
    { id: 'br-1', name: 'Merkez', address: 'Ataköy Marina Plaza, Bakırköy', phone: '0212 555 0101', managerId: 'ag-2' },
    { id: 'br-2', name: 'Bakırköy', address: 'Kartaltepe Mah. İncirli Cad. No:42', phone: '0212 555 0102', managerId: 'ag-3' },
    { id: 'br-3', name: 'Zeytinburnu', address: 'Merkezefendi Mah. 58. Sk.', phone: '0212 555 0103', managerId: 'ag-4' },
    { id: 'br-4', name: 'Beşiktaş', address: 'Levent Mah. Büyükdere Cad.', phone: '0212 555 0104', managerId: 'ag-5' },
    { id: 'br-5', name: 'Kadıköy', address: 'Caferağa Mah. Moda Cad.', phone: '0216 555 0105', managerId: 'ag-6' }
  ];

  const agents = [
    { id: 'ag-1', name: 'Sistem Yöneticisi', role: 'Süper Admin', branchId: 'br-1', phone: '0532 100 0001', email: 'admin@emlakpro.com', avatar: 'SY', performance: 100, sales: 0, rentals: 0, commission: 0, conversion: 0, lat: 40.980, lng: 28.872, sharing: true },
    { id: 'ag-2', name: 'Selin Arslan', role: 'Firma Sahibi', branchId: 'br-1', phone: '0532 100 0002', email: 'selin@emlakpro.com', avatar: 'SA', performance: 96, sales: 8, rentals: 12, commission: 920000, conversion: 32, lat: 40.981, lng: 28.870, sharing: true },
    { id: 'ag-3', name: 'Ahmet Yılmaz', role: 'Emlak Danışmanı', branchId: 'br-2', phone: '0532 411 2847', email: 'ahmet@emlakpro.com', avatar: 'AY', performance: 94, sales: 6, rentals: 11, commission: 685000, conversion: 28, lat: 40.978, lng: 28.855, sharing: true },
    { id: 'ag-4', name: 'Merve Aksoy', role: 'Emlak Danışmanı', branchId: 'br-3', phone: '0533 522 3391', email: 'merve@emlakpro.com', avatar: 'MA', performance: 91, sales: 5, rentals: 14, commission: 540000, conversion: 26, lat: 40.993, lng: 28.904, sharing: true },
    { id: 'ag-5', name: 'Can Öztürk', role: 'Şube Müdürü', branchId: 'br-4', phone: '0534 633 4482', email: 'can@emlakpro.com', avatar: 'CO', performance: 88, sales: 4, rentals: 7, commission: 410000, conversion: 22, lat: 41.081, lng: 29.012, sharing: false },
    { id: 'ag-6', name: 'Elif Demir', role: 'Emlak Danışmanı', branchId: 'br-5', phone: '0535 744 5573', email: 'elif@emlakpro.com', avatar: 'ED', performance: 90, sales: 7, rentals: 9, commission: 620000, conversion: 30, lat: 40.984, lng: 29.025, sharing: true },
    { id: 'ag-7', name: 'Burak Kaya', role: 'Portföy Yöneticisi', branchId: 'br-1', phone: '0536 855 6684', email: 'burak@emlakpro.com', avatar: 'BK', performance: 85, sales: 2, rentals: 4, commission: 180000, conversion: 18, lat: 40.980, lng: 28.875, sharing: true },
    { id: 'ag-8', name: 'Zeynep Şahin', role: 'Çağrı Merkezi', branchId: 'br-1', phone: '0537 966 7795', email: 'zeynep@emlakpro.com', avatar: 'ZS', performance: 80, sales: 0, rentals: 0, commission: 0, conversion: 15, lat: 40.979, lng: 28.871, sharing: false },
    { id: 'ag-9', name: 'Hakan Çelik', role: 'Muhasebe', branchId: 'br-1', phone: '0538 077 8806', email: 'hakan@emlakpro.com', avatar: 'HC', performance: 87, sales: 0, rentals: 0, commission: 0, conversion: 0, lat: 40.982, lng: 28.868, sharing: false },
    { id: 'ag-10', name: 'Ayşe Yıldız', role: 'Ofis Personeli', branchId: 'br-2', phone: '0539 188 9917', email: 'ayse@emlakpro.com', avatar: 'AY', performance: 82, sales: 1, rentals: 3, commission: 95000, conversion: 12, lat: 40.977, lng: 28.860, sharing: true }
  ];

  const owners = [];
  for (let i = 0; i < 25; i++) {
    const name = i === 0 ? 'Mehmet Yıldırım' : nameAt(i + 5);
    owners.push({
      id: `ow-${i + 1}`,
      name,
      phone: phoneAt(200 + i),
      email: emailAt(name, i),
      tc: String(10000000000 + i * 137),
      address: `${REMS.CONST.DISTRICTS[i % REMS.CONST.DISTRICTS.length].ilce}, İstanbul`,
      bank: i % 2 === 0 ? 'Garanti BBVA' : 'İş Bankası',
      iban: `TR${String(10 + i).padStart(2, '0')}0006400000000000${String(1000 + i)}`,
      notes: i === 0 ? 'Ataköy portföyünün mülk sahibi. Fiyat esnekliği orta seviye.' : 'Düzenli iletişim tercih ediyor.',
      createdAt: '2025-11-01'
    });
  }

  const customers = [];
  for (let i = 0; i < 50; i++) {
    const name = i === 0 ? 'Murat Demir' : nameAt(i + 12);
    const dist = REMS.CONST.DISTRICTS[i % REMS.CONST.DISTRICTS.length];
    customers.push({
      id: `cu-${i + 1}`,
      name,
      phone: phoneAt(300 + i),
      email: emailAt(name, 50 + i),
      job: ['Mühendis', 'Doktor', 'Avukat', 'Girişimci', 'Öğretmen', 'Finansçı'][i % 6],
      budgetMin: 3000000 + (i % 10) * 500000,
      budgetMax: 7000000 + (i % 10) * 800000,
      financing: i % 3 === 0 ? 'Kredi' : i % 3 === 1 ? 'Peşin' : 'Karma',
      preferredDistricts: [dist.ilce, dist.mahalle[0]],
      propertyType: ['Daire', 'Villa', 'Rezidans', 'Dükkan'][i % 4],
      minM2: 80 + (i % 5) * 10,
      maxM2: 140 + (i % 5) * 20,
      rooms: ['2+1', '3+1', '4+1'][i % 3],
      transactionType: i % 3 === 0 ? 'Kiralık' : 'Satılık',
      notes: i === 0 ? 'Bakırköy / Ataköy bölgesinde 3+1 arıyor. Bütçe 7-9 milyon.' : '',
      favorites: [],
      createdAt: `2026-0${(i % 7) + 1}-1${i % 9}`
    });
  }

  // Scenario customer budget
  customers[0].budgetMin = 7000000;
  customers[0].budgetMax = 9000000;
  customers[0].rooms = '3+1';
  customers[0].preferredDistricts = ['Bakırköy', 'Ataköy 7-8-9-10. Kısım'];
  customers[0].minM2 = 120;
  customers[0].maxM2 = 160;
  customers[0].propertyType = 'Daire';
  customers[0].transactionType = 'Satılık';

  const titles = {
    Daire: ['Deniz Manzaralı', 'Metroya Yakın', 'Yeni Yapı', 'Geniş Balkonlu', 'Site İçerisinde', 'Güney Cephe'],
    Villa: ['Bahçeli', 'Havuzlu', 'Müstakil', 'Lüks', 'Deniz Görmez'],
    Ofis: ['Plaza Katı', 'Köşe Ofis', 'Hazır Ofis', 'Açık Ofis'],
    Dükkan: ['Ana Cadde', 'Cadde Üzeri', 'İşlek Lokasyon', 'Köşe Dükkan'],
    Arsa: ['İmarlı', 'Yola Cepheli', 'Konut İmarlı', 'Ticari İmarlı'],
    Rezidans: ['Full Sosyal Tesis', 'Güvenlikli', 'Manzaralı'],
    Depo: ['Yüksek Tavan', 'Rampa Girişli']
  };

  const properties = [];
  const statusesCycle = ['Aktif', 'Aktif', 'Aktif', 'Aktif', 'Yeni', 'Opsiyonlu', 'Teklif Var', 'Satıldı', 'Kiralandı', 'Pasif'];
  const typesCycle = ['Daire', 'Daire', 'Daire', 'Rezidans', 'Villa', 'Arsa', 'Dükkan', 'Ofis', 'Depo', 'Mağaza', 'Müstakil Ev', 'Plaza'];

  for (let i = 0; i < 50; i++) {
    const type = typesCycle[i % typesCycle.length];
    const dist = REMS.CONST.DISTRICTS[i % REMS.CONST.DISTRICTS.length];
    const mahalle = dist.mahalle[i % dist.mahalle.length];
    const isRent = i % 4 === 1 || type === 'Depo' && i % 2 === 0;
    const transactionType = isRent ? 'Kiralık' : (i % 17 === 0 ? 'Günlük Kiralık' : 'Satılık');
    const status = i === 0 ? 'Aktif' : statusesCycle[i % statusesCycle.length];
    const rooms = type === 'Arsa' || type === 'Depo' ? '-' : ['1+1', '2+1', '3+1', '4+1', '5+1'][i % 5];
    const brut = type === 'Arsa' ? 450 + i * 20 : type === 'Villa' ? 280 + i * 5 : type === 'Dükkan' ? 80 + i * 3 : 95 + (i % 12) * 8;
    const net = type === 'Arsa' ? brut : Math.round(brut * 0.86);
    let price;
    if (transactionType === 'Kiralık') price = 18000 + (i % 20) * 2500;
    else if (transactionType === 'Günlük Kiralık') price = 1500 + (i % 10) * 200;
    else if (type === 'Arsa') price = 4500000 + i * 180000;
    else if (type === 'Villa') price = 18500000 + i * 250000;
    else price = 4250000 + i * 165000;

    // Featured scenario property
    if (i === 0) {
      price = 8350000;
    }

    const prefix = titles[type] || titles.Daire;
    const titleBase = i === 0
      ? 'Ataköy 7-8-9-10. Kısım Deniz Manzaralı 3+1 Satılık Daire'
      : `${mahalle} ${prefix[i % prefix.length]} ${rooms !== '-' ? rooms + ' ' : ''}${transactionType} ${type}`;

    const coordKey = mahalle in REMS.CONST.COORDS ? mahalle : dist.ilce;
    const base = REMS.CONST.COORDS[coordKey] || [41.01, 28.97];
    const lat = base[0] + ((i % 7) - 3) * 0.004;
    const lng = base[1] + ((i % 5) - 2) * 0.005;

    const firstPrice = Math.round(price * 1.07);
    const midPrice = Math.round(price * 1.035);

    properties.push({
      id: `pr-${i + 1}`,
      code: `PRT-2026-${String(1842 - i).padStart(6, '0')}`,
      title: titleBase,
      transactionType,
      propertyType: type,
      status,
      agentId: ['ag-3', 'ag-4', 'ag-6', 'ag-5', 'ag-7'][i % 5],
      branchId: branches[i % branches.length].id,
      ownerId: owners[i % owners.length].id,
      source: ['Sahibinden', 'Referans', 'Ofis', 'Web Sitesi', 'Hepsiemlak'][i % 5],
      authorityType: REMS.CONST.AUTHORITY_TYPES[i % 4],
      authorityStart: '2026-01-15',
      authorityEnd: '2026-12-31',
      authorityContractNo: `YTK-2026-${1000 + i}`,
      commissionRate: transactionType === 'Kiralık' ? 8 : 2,
      firstPrice,
      currentPrice: price,
      minPrice: Math.round(price * 0.94),
      currency: 'TRY',
      pricePerM2: Math.round(price / brut),
      priceHistory: i === 0 ? [
        { date: '2026-06-01', price: 8950000 },
        { date: '2026-07-15', price: 8650000 },
        { date: '2026-08-16', price: 8350000 }
      ] : [
        { date: '2026-03-01', price: firstPrice },
        { date: '2026-06-01', price: midPrice },
        { date: '2026-08-01', price: price }
      ],
      description: i === 0
        ? 'Ataköy 7-8-9-10. Kısım\'da deniz manzaralı, bakımlı 3+1 daire. Geniş salon, açık mutfak, 2 banyo. Site içerisinde güvenlik, otopark ve sosyal tesisler mevcut. Krediye uygun, takasa açık.'
        : `${dist.ilce} ${mahalle} konumunda ${transactionType.toLowerCase()} ${type.toLowerCase()}. Ulaşım imkanları güçlü, yaşam alanına yakın.`,
      address: {
        il: 'İstanbul',
        ilce: dist.ilce,
        mahalle,
        sokak: `${10 + (i % 40)}. Sokak`,
        bina: String(1 + (i % 30)),
        daire: type === 'Arsa' ? '-' : String(1 + (i % 20)),
        full: `İstanbul / ${dist.ilce} / ${mahalle}`,
        lat,
        lng
      },
      housing: type === 'Arsa' || type === 'Depo' ? null : {
        brutM2: i === 0 ? 145 : brut,
        netM2: i === 0 ? 125 : net,
        rooms: i === 0 ? '3+1' : rooms,
        livingRooms: 1,
        bathrooms: i % 2 === 0 ? 2 : 1,
        wc: 1,
        floor: i === 0 ? 7 : (i % 12) + 1,
        buildingFloors: i === 0 ? 12 : 8 + (i % 8),
        buildingAge: i % 15,
        heating: ['Kombi', 'Merkezi', 'Yerden Isıtma'][i % 3],
        balcony: true,
        elevator: true,
        parking: i % 3 !== 2,
        furnished: i % 4 === 0,
        usage: 'Boş',
        inSite: i % 2 === 0,
        dues: 850 + (i % 10) * 50,
        deed: 'Kat Mülkiyetli',
        creditSuitable: true,
        facade: ['Güney', 'Kuzey', 'Doğu', 'Batı'][i % 4],
        view: i === 0 ? 'Deniz' : ['Şehir', 'Boğaz', 'Park', 'Deniz'][i % 4],
        swap: i % 5 === 0
      },
      land: type === 'Arsa' ? {
        ada: String(100 + i),
        parsel: String(10 + i),
        pafta: `P-${i}`,
        m2: brut,
        zoning: 'Konut',
        kaks: '1.50',
        taks: '0.30',
        gabari: '12.50',
        deedType: 'Müstakil',
        roadFrontage: true,
        infrastructure: 'Tam',
        ground: 'Sağlam'
      } : null,
      commercial: ['Dükkan', 'Mağaza', 'Ofis', 'Plaza', 'Depo', 'Ticari'].includes(type) ? {
        usageArea: brut,
        entranceHeight: 3.2 + (i % 3) * 0.4,
        facade: 'Cadde',
        electricity: '22 kW',
        parking: i % 2 === 0,
        storage: 15 + i,
        wc: true,
        kitchen: type === 'Ofis',
        occupancyPermit: true,
        license: 'Var',
        withTenant: i % 3 === 0
      } : null,
      photos: pickPhotos(10 + (i % 5), i),
      videoUrl: i % 5 === 0 ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : '',
      virtualTour: i % 7 === 0 ? 'https://kuula.co/share/collection/7PqXh' : '',
      channels: {
        web: true,
        sahibinden: i % 2 === 0,
        hepsiemlak: i % 3 === 0,
        emlakjet: i % 4 === 0,
        social: i % 5 === 0
      },
      qualityScore: {
        total: i === 0 ? 87 : 60 + (i % 35),
        photo: i === 0 ? 95 : 70 + (i % 25),
        description: i === 0 ? 88 : 65 + (i % 30),
        completeness: i === 0 ? 92 : 70 + (i % 25),
        location: 100,
        video: i === 0 ? 50 : (i % 5 === 0 ? 80 : 40)
      },
      listedAt: i === 0 ? '2026-05-30' : `2026-0${1 + (i % 7)}-${10 + (i % 18)}`,
      daysOnMarket: i === 0 ? 78 : 10 + (i * 3) % 120,
      agingRisk: i === 0 ? 'Orta' : (i % 3 === 0 ? 'Yüksek' : i % 3 === 1 ? 'Düşük' : 'Orta'),
      documents: [
        { id: `doc-${i}-1`, name: 'Tapu.pdf', category: 'Tapu', uploader: 'Ahmet Yılmaz', date: '2026-06-01', type: 'pdf' },
        { id: `doc-${i}-2`, name: 'Yetki_Belgesi.pdf', category: 'Yetki Belgesi', uploader: 'Burak Kaya', date: '2026-06-02', type: 'pdf' }
      ],
      chat: i === 0 ? [
        { id: 'pc-1', user: 'Ahmet Yılmaz', text: 'Mülk sahibi fiyatı 8.350.000 TL\'ye indirdi.', at: '2026-08-16 10:12' },
        { id: 'pc-2', user: 'Merve Aksoy', text: 'Yarın 14:00 için müşteri randevusu oluşturdum.', at: '2026-08-16 11:05' },
        { id: 'pc-3', user: 'Muhasebe', text: 'Kapora hesaba geçti.', at: '2026-08-16 16:40' }
      ] : [],
      createdAt: '2026-05-01'
    });
  }

  // Fix featured property address
  properties[0].address = {
    il: 'İstanbul', ilce: 'Bakırköy', mahalle: 'Ataköy 7-8-9-10. Kısım',
    sokak: '7. Kısım', bina: '12', daire: '34',
    full: 'İstanbul / Bakırköy / Ataköy 7-8-9-10. Kısım',
    lat: 40.9785, lng: 28.8550
  };
  properties[0].agentId = 'ag-3';
  properties[0].ownerId = 'ow-1';
  properties[0].branchId = 'br-2';
  properties[0].authorityType = 'Tek Yetkili';
  properties[0].transactionType = 'Satılık';
  properties[0].propertyType = 'Daire';
  properties[0].status = 'Aktif';
  properties[0].currentPrice = 8350000;
  properties[0].pricePerM2 = Math.round(8350000 / 145);

  const leads = [];
  for (let i = 0; i < 40; i++) {
    const name = i === 0 ? 'Murat Demir' : nameAt(i + 20);
    const status = i === 0 ? 'Nitelikli' : REMS.CONST.LEAD_STATUSES[i % (REMS.CONST.LEAD_STATUSES.length - 1)];
    leads.push({
      id: `ld-${i + 1}`,
      name,
      phone: phoneAt(400 + i),
      email: emailAt(name, 100 + i),
      source: i === 0 ? 'Google Ads' : REMS.CONST.LEAD_SOURCES[i % REMS.CONST.LEAD_SOURCES.length],
      propertyId: properties[i % 20].id,
      agentId: ['ag-3', 'ag-4', 'ag-6', 'ag-8'][i % 4],
      customerId: i === 0 ? 'cu-1' : (i < 30 ? `cu-${i + 1}` : null),
      budget: 5000000 + i * 200000,
      district: REMS.CONST.DISTRICTS[i % REMS.CONST.DISTRICTS.length].ilce,
      propertyType: ['Daire', 'Villa', 'Rezidans'][i % 3],
      note: i === 0 ? 'Google Ads üzerinden geldi. Ataköy 3+1 arıyor.' : 'İlk temas bekleniyor.',
      score: 40 + (i % 55),
      status,
      lostReason: status === 'Kaybedildi' ? REMS.CONST.LOST_REASONS[i % REMS.CONST.LOST_REASONS.length] : null,
      lastContact: `2026-08-${String(1 + (i % 15)).padStart(2, '0')}`,
      createdAt: `2026-08-${String(1 + (i % 14)).padStart(2, '0')}`
    });
  }

  const requests = [
    {
      id: 'req-1',
      customerId: 'cu-1',
      transactionType: 'Satılık',
      districts: ['Bakırköy', 'Ataköy'],
      rooms: ['3+1', '4+1'],
      budgetMin: 7000000,
      budgetMax: 9000000,
      minM2: 120,
      maxM2: 160,
      propertyType: 'Daire',
      notes: 'Deniz manzarası tercih ediyor.',
      createdAt: '2026-08-15'
    }
  ];
  for (let i = 1; i < 12; i++) {
    const c = customers[i];
    requests.push({
      id: `req-${i + 1}`,
      customerId: c.id,
      transactionType: c.transactionType,
      districts: c.preferredDistricts,
      rooms: [c.rooms],
      budgetMin: c.budgetMin,
      budgetMax: c.budgetMax,
      minM2: c.minM2,
      maxM2: c.maxM2,
      propertyType: c.propertyType,
      notes: '',
      createdAt: c.createdAt
    });
  }

  const appointments = [];
  for (let i = 0; i < 20; i++) {
    const day = 10 + (i % 10);
    appointments.push({
      id: `ap-${i + 1}`,
      customerId: customers[i % 20].id,
      propertyId: properties[i % 15].id,
      agentId: ['ag-3', 'ag-4', 'ag-6'][i % 3],
      date: `2026-08-${String(day).padStart(2, '0')}`,
      time: `${10 + (i % 6)}:00`,
      type: REMS.CONST.APPOINTMENT_TYPES[i % REMS.CONST.APPOINTMENT_TYPES.length],
      location: properties[i % 15].address.full,
      note: i === 9 ? 'Yer gösterme — Murat Demir / Ataköy 3+1' : 'Müşteri bilgilendirildi.',
      status: day < 16 ? 'Tamamlandı' : 'Planlandı'
    });
  }
  // Scenario showing appointment
  appointments.push({
    id: 'ap-21',
    customerId: 'cu-1',
    propertyId: 'pr-1',
    agentId: 'ag-3',
    date: '2026-08-17',
    time: '14:00',
    type: 'Yer Gösterme',
    location: 'Ataköy 7-8-9-10. Kısım',
    note: 'Senaryo yer gösterme randevusu',
    status: 'Planlandı'
  });

  const showings = [
    {
      id: 'sh-1',
      customerId: 'cu-2',
      propertyId: 'pr-2',
      agentId: 'ag-4',
      date: '2026-08-12',
      time: '15:00',
      location: properties[1].address.full,
      signature: null,
      status: 'Tamamlandı'
    }
  ];

  const offers = [];
  for (let i = 0; i < 15; i++) {
    const prop = properties[i % 12];
    const offerPrice = Math.round(prop.currentPrice * (0.92 + (i % 5) * 0.015));
    offers.push({
      id: `of-${i + 1}`,
      customerId: customers[i % 20].id,
      propertyId: prop.id,
      agentId: prop.agentId,
      listPrice: prop.currentPrice,
      offerPrice,
      paymentType: i % 2 === 0 ? 'Kredi' : 'Peşin',
      creditStatus: i % 2 === 0 ? 'Ön Onaylı' : '-',
      date: `2026-08-${String(5 + (i % 10)).padStart(2, '0')}`,
      validUntil: `2026-08-${String(15 + (i % 10)).padStart(2, '0')}`,
      status: ['Bekliyor', 'Pazarlık', 'Kabul', 'Red'][i % 4],
      history: [
        { by: 'Müşteri', price: offerPrice, date: `2026-08-${String(5 + (i % 10)).padStart(2, '0')}` },
        { by: 'Mülk Sahibi', price: Math.round(offerPrice * 1.05), date: `2026-08-${String(6 + (i % 9)).padStart(2, '0')}` }
      ]
    });
  }

  const sales = [
    {
      id: 'sale-1', propertyId: 'pr-8', customerId: 'cu-5', agentId: 'ag-3',
      step: 4, agreedPrice: properties[7].currentPrice, deposit: 150000,
      depositPaid: true, createdAt: '2026-07-20', status: 'Devam'
    },
    {
      id: 'sale-2', propertyId: 'pr-15', customerId: 'cu-8', agentId: 'ag-6',
      step: 8, agreedPrice: properties[14].currentPrice, deposit: 200000,
      depositPaid: true, createdAt: '2026-06-10', status: 'Kapandı'
    }
  ];

  const rentals = [];
  for (let i = 0; i < 10; i++) {
    const prop = properties.filter(p => p.transactionType === 'Kiralık')[i] || properties[i];
    rentals.push({
      id: `rn-${i + 1}`,
      propertyId: prop.id,
      customerId: customers[10 + i].id,
      ownerId: prop.ownerId,
      agentId: prop.agentId,
      step: Math.min(i + 2, 8),
      startDate: '2026-01-01',
      endDate: '2027-01-01',
      monthlyRent: prop.transactionType === 'Kiralık' ? prop.currentPrice : 25000 + i * 1500,
      increaseDate: '2027-01-01',
      deposit: (prop.transactionType === 'Kiralık' ? prop.currentPrice : 25000) * 2,
      depositStatus: i % 3 === 0 ? 'İade Edildi' : i % 3 === 1 ? 'Mahsup Edildi' : 'Alındı',
      paymentDay: 1 + (i % 5),
      status: 'Aktif',
      payments: [
        { month: '2026-06', amount: prop.transactionType === 'Kiralık' ? prop.currentPrice : 25000 + i * 1500, status: 'Ödendi' },
        { month: '2026-07', amount: prop.transactionType === 'Kiralık' ? prop.currentPrice : 25000 + i * 1500, status: 'Ödendi' },
        { month: '2026-08', amount: prop.transactionType === 'Kiralık' ? prop.currentPrice : 25000 + i * 1500, status: i < 3 ? 'Gecikti' : i < 6 ? 'Bekliyor' : 'Ödendi' }
      ]
    });
  }
  // Fix delayed amounts for demo
  rentals[0].payments[2] = { month: '2026-08', amount: 28000, status: 'Gecikti', daysLate: 4, tenantName: 'Murat Kaya' };
  rentals[1].payments[2].status = 'Gecikti';
  rentals[1].payments[2].daysLate = 6;
  rentals[2].payments[2].status = 'Gecikti';
  rentals[2].payments[2].daysLate = 2;

  const cashAccounts = [
    { id: 'ca-1', name: 'Merkez Kasa', type: 'Kasa', balance: 485000 },
    { id: 'ca-2', name: 'Bakırköy Şube Kasası', type: 'Kasa', balance: 126500 },
    { id: 'ca-3', name: 'Garanti Bankası', type: 'Banka', balance: 2450000 },
    { id: 'ca-4', name: 'POS Hesabı', type: 'POS', balance: 87500 }
  ];

  const cashMovements = [];
  for (let i = 0; i < 60; i++) {
    const isIn = i % 3 !== 2;
    const amount = isIn ? 15000 + i * 3500 : 5000 + i * 800;
    cashMovements.push({
      id: `cm-${i + 1}`,
      date: `2026-0${5 + (i % 4)}-${String(1 + (i % 27)).padStart(2, '0')}`,
      no: `KSH-2026-${String(1000 + i)}`,
      description: isIn
        ? ['Satış komisyonu', 'Kiralama komisyonu', 'Kapora', 'Danışmanlık ücreti'][i % 4]
        : ['Reklam', 'Portal üyeliği', 'Yakıt', 'Fotoğraf/video', 'Personel'][i % 5],
      customerId: customers[i % 20].id,
      propertyId: properties[i % 25].id,
      type: isIn ? 'Giriş' : 'Çıkış',
      category: isIn ? 'Gelir' : 'Gider',
      method: ['Nakit', 'Havale', 'EFT', 'Kredi Kartı', 'FAST'][i % 5],
      accountId: cashAccounts[i % 4].id,
      income: isIn ? amount : 0,
      expense: isIn ? 0 : amount,
      balance: 2000000 + i * 1000
    });
  }

  const commissions = [
    {
      id: 'com-1', propertyId: 'pr-15', saleId: 'sale-2', amount: 192000,
      rate: 2, vat: true, agentShare: 50, agentAmount: 96000, officeAmount: 96000,
      splits: [
        { role: 'Portföy Danışmanı', name: 'Elif Demir', percent: 40, amount: 76800 },
        { role: 'Alıcı Danışmanı', name: 'Ahmet Yılmaz', percent: 10, amount: 19200 },
        { role: 'Ofis', name: 'EmlakPro', percent: 40, amount: 76800 },
        { role: 'Franchise', name: 'Merkez', percent: 10, amount: 19200 }
      ],
      status: 'Tahsil Edildi',
      date: '2026-07-28'
    }
  ];

  const tasks = [];
  const taskTitles = [
    'Mülk sahibini ara', 'Yeni fotoğraf çek', 'Tapu belgesini yükle', 'Müşteriyi ara',
    'Teklifi takip et', 'Randevu oluştur', 'Yetki sözleşmesini yenile', 'Kira gecikmesini hatırlat'
  ];
  for (let i = 0; i < 18; i++) {
    tasks.push({
      id: `tk-${i + 1}`,
      title: taskTitles[i % taskTitles.length],
      agentId: ['ag-3', 'ag-4', 'ag-6', 'ag-10'][i % 4],
      propertyId: properties[i % 10].id,
      due: `2026-08-${String(14 + (i % 10)).padStart(2, '0')}`,
      status: ['Yapılacak', 'Devam Ediyor', 'Tamamlandı', 'Gecikti'][i % 4],
      priority: ['Yüksek', 'Orta', 'Düşük'][i % 3]
    });
  }

  const channels = [
    { id: 'ch-all', name: 'Tüm Ekip', type: 'channel' },
    { id: 'ch-sales', name: 'Satış Ekibi', type: 'channel' },
    { id: 'ch-rent', name: 'Kiralama Ekibi', type: 'channel' },
    { id: 'ch-acc', name: 'Muhasebe', type: 'channel' },
    { id: 'ch-mgmt', name: 'Yönetim', type: 'channel' },
    { id: 'ch-br2', name: 'Bakırköy Şube', type: 'channel' },
    { id: 'ch-agents', name: 'Danışmanlar', type: 'channel' },
    { id: 'dm-3', name: 'Ahmet Yılmaz', type: 'dm', agentId: 'ag-3' },
    { id: 'dm-4', name: 'Merve Aksoy', type: 'dm', agentId: 'ag-4' }
  ];

  const messages = [];
  const msgSamples = [
    ['Ahmet Yılmaz', 'Bugün Ataköy portföyüne 3 yer gösterme planladım.', 'ch-sales'],
    ['Merve Aksoy', '@Ahmet müşteri bütçesini güncelledi, eşleştirmeyi tekrar çalıştırabilir misin?', 'ch-sales'],
    ['Hakan Çelik', 'Temmuz komisyon bordrosu hazır. @Yönetim onayınızı bekliyorum.', 'ch-acc'],
    ['Selin Arslan', 'Bu ay şube hedeflerini paylaştım. @BakırköyŞube lütfen inceleyin.', 'ch-mgmt'],
    ['Elif Demir', 'Kadıköy\'de yeni villa portföyü eklendi, fotoğraflar yüklendi.', 'ch-all'],
    ['Zeynep Şahin', 'Google Ads\'ten 8 yeni lead geldi, dağıtım yapıyorum.', 'ch-all'],
    ['Burak Kaya', 'Yetki süresi bitmek üzere olan 5 portföy var.', 'ch-agents'],
    ['Ayşe Yıldız', 'Tapu randevusu için evrak listesini güncelledim.', 'ch-br2'],
    ['Can Öztürk', 'Beşiktaş şubesinde bu hafta 4 yer gösterme var.', 'ch-sales'],
    ['Ahmet Yılmaz', 'PRT-2026-001842 için pazarlık sürecine girdik.', 'ch-sales']
  ];
  for (let i = 0; i < 30; i++) {
    const s = msgSamples[i % msgSamples.length];
    messages.push({
      id: `msg-${i + 1}`,
      channelId: s[2],
      user: s[0],
      text: s[1],
      at: `2026-08-${String(10 + (i % 6)).padStart(2, '0')} ${10 + (i % 8)}:${(i * 7) % 60}`.replace(/:(\d)$/, ':0$1'),
      mentions: (s[1].match(/@\S+/g) || []).map(m => m.slice(1))
    });
  }

  const notifications = [
    { id: 'nt-1', title: 'Yeni Lead', body: 'Sahibinden üzerinden yeni müşteri geldi.', type: 'lead', read: false, at: '2026-08-16 09:12' },
    { id: 'nt-2', title: 'Yeni Teklif', body: 'PRT-2026-00452 için ₺8.100.000 teklif var.', type: 'offer', read: false, at: '2026-08-16 10:05' },
    { id: 'nt-3', title: 'Yetki Süresi', body: 'Portföy yetkisi 7 gün sonra sona eriyor.', type: 'authority', read: false, at: '2026-08-16 11:20' },
    { id: 'nt-4', title: 'Kira Gecikmesi', body: 'PRT-2026-00214 kiracısı 4 gün gecikti.', type: 'rent', read: false, at: '2026-08-16 12:00' },
    { id: 'nt-5', title: 'Mention', body: 'Merve sizi mesajda etiketledi.', type: 'mention', read: false, at: '2026-08-16 13:40' }
  ];
  for (let i = 6; i <= 25; i++) {
    notifications.push({
      id: `nt-${i}`,
      title: ['Randevu Hatırlatması', 'Görev', 'Tahsilat', 'Belge', 'Lead'][i % 5],
      body: ['Yarın 14:00 yer gösterme var.', 'Tapu belgesi yüklenmeli.', 'Komisyon tahsilatı bekleniyor.', 'Yeni evrak yüklendi.', 'Instagram lead atandı.'][i % 5],
      type: 'info',
      read: i > 12,
      at: `2026-08-${String(8 + (i % 8)).padStart(2, '0')} ${9 + (i % 8)}:00`
    });
  }

  const contracts = [
    { id: 'ct-1', type: 'Portföy Yetki Sözleşmesi', propertyId: 'pr-1', party: 'Mehmet Yıldırım', no: 'YTK-2026-1000', date: '2026-01-15', status: 'Aktif' },
    { id: 'ct-2', type: 'Kira Sözleşmesi', propertyId: rentals[0].propertyId, party: customers[10].name, no: 'KRA-2026-2001', date: '2026-01-01', status: 'Aktif' }
  ];

  const activityLogs = [
    { id: 'log-1', at: '2026-08-16 14:22', user: 'Ahmet Yılmaz', action: 'PRT-2026-001842 fiyatını değiştirdi.', detail: '₺8.650.000 → ₺8.350.000' },
    { id: 'log-2', at: '2026-08-16 14:37', user: 'Merve Aksoy', action: 'Yeni teklif ekledi.', detail: '₺8.100.000' },
    { id: 'log-3', at: '2026-08-16 15:10', user: 'Zeynep Şahin', action: 'Yeni lead kaydı oluşturdu.', detail: 'Murat Demir — Google Ads' },
    { id: 'log-4', at: '2026-08-16 16:05', user: 'Hakan Çelik', action: 'Kasa hareketi girdi.', detail: 'Kapora ₺100.000' }
  ];
  for (let i = 5; i <= 20; i++) {
    activityLogs.push({
      id: `log-${i}`,
      at: `2026-08-15 ${10 + (i % 8)}:${(i * 3) % 60}`,
      user: agents[i % agents.length].name,
      action: ['Portföy güncellendi', 'Randevu oluşturuldu', 'Müşteri notu eklendi', 'Belge yüklendi'][i % 4],
      detail: properties[i % 10].code
    });
  }

  const currentUser = {
    id: 'ag-3',
    name: 'Ahmet Yılmaz',
    role: 'Emlak Danışmanı',
    branchId: 'br-2',
    avatar: 'AY'
  };

  return {
    version: 1,
    theme: 'light',
    currentUser,
    branches,
    agents,
    owners,
    customers,
    properties,
    leads,
    requests,
    appointments,
    showings,
    offers,
    sales,
    rentals,
    cashAccounts,
    cashMovements,
    commissions,
    tasks,
    channels,
    messages,
    notifications,
    contracts,
    activityLogs,
    favorites: [],
    compareIds: [],
    settings: {
      companyName: 'EmlakPro Gayrimenkul',
      defaultCommissionSale: 2,
      defaultCommissionRent: 8,
      agentShareDefault: 50,
      integrations: {
        sahibinden: { enabled: true, apiKey: '' },
        hepsiemlak: { enabled: false, apiKey: '' },
        emlakjet: { enabled: false, apiKey: '' },
        netgsm: { enabled: false, apiKey: '' },
        whatsapp: { enabled: false, apiKey: '' },
        iyzico: { enabled: false, apiKey: '' }
      }
    },
    counters: {
      property: 1842,
      cash: 1060,
      offer: 15,
      lead: 40
    }
  };
};
