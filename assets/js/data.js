/* Akıllı Okul — Demo Data Layer */
const AKO = {
  brand: {
    name: 'Akıllı Okul',
    slogan: 'Öğrenmenin Yeni Nesli',
    altSlogan: 'İstediğin Yerde, İstediğin Zaman Öğren.',
    description: 'Alanında uzman eğitmenlerden yüzlerce online eğitim, canlı ders ve sertifikalı program Akıllı Okul\'da.'
  },
  // Security architecture notes (production):
  // RBAC, JWT + Refresh Token, HttpOnly Cookie, CSRF, XSS sanitization,
  // Rate limiting, bcrypt password hashing, MFA, Audit Log
  demoAccounts: [
    { email: 'admin@akilliokul.com', password: '123456', role: 'admin', name: 'Süper Admin', avatar: 'SA' },
    { email: 'egitmen@akilliokul.com', password: '123456', role: 'instructor', name: 'Emre Kaya', avatar: 'EK', instructorId: 1 },
    { email: 'ogrenci@akilliokul.com', password: '123456', role: 'student', name: 'Ayşe Yılmaz', avatar: 'AY' },
    { email: 'finans@akilliokul.com', password: '123456', role: 'finance', name: 'Mehmet Demir', avatar: 'MD' }
  ],
  coupons: [
    { code: 'AKILLI50', type: 'percent', value: 50, minAmount: 0, maxUses: 1000, used: 234, start: '2026-01-01', end: '2026-12-31', courses: [], categories: [] },
    { code: 'HOSGELDIN20', type: 'percent', value: 20, minAmount: 100, maxUses: 500, used: 89, start: '2026-01-01', end: '2026-12-31', courses: [], categories: [] },
    { code: 'YAZILIM60', type: 'percent', value: 60, minAmount: 0, maxUses: 200, used: 45, start: '2026-06-01', end: '2026-09-30', courses: [], categories: ['yazilim'] }
  ],
  campaigns: [
    { id: 1, title: 'Yazılım Eğitimlerinde %60 İndirim', desc: 'Tüm yazılım kurslarında geçerli', discount: 60, category: 'yazilim', active: true, banner: 'linear-gradient(135deg,#2563EB,#7C3AED)' },
    { id: 2, title: 'Yeni Üyelere %20 Hoş Geldin', desc: 'HOSGELDIN20 kodu ile', discount: 20, category: null, active: true, banner: 'linear-gradient(135deg,#06B6D4,#2563EB)' }
  ],
  commission: { platform: 20, instructor: 80 },
  categories: [
    { id: 'yazilim', name: 'Yazılım Geliştirme', icon: 'fa-code', color: '#2563EB', subs: ['Web', 'Mobil', 'Backend', 'DevOps'] },
    { id: 'ai', name: 'Yapay Zeka', icon: 'fa-brain', color: '#7C3AED', subs: ['ML', 'Deep Learning', 'ChatGPT', 'NLP'] },
    { id: 'isletme', name: 'İşletme', icon: 'fa-briefcase', color: '#0891B2', subs: ['Girişimcilik', 'Yönetim', 'Liderlik'] },
    { id: 'pazarlama', name: 'Dijital Pazarlama', icon: 'fa-bullhorn', color: '#EA580C', subs: ['SEO', 'Google Ads', 'Sosyal Medya'] },
    { id: 'tasarim', name: 'Tasarım', icon: 'fa-palette', color: '#DB2777', subs: ['UI/UX', 'Grafik', 'Figma'] },
    { id: 'fotograf', name: 'Fotoğrafçılık', icon: 'fa-camera', color: '#059669', subs: ['Portre', 'Manzara', 'Lightroom'] },
    { id: 'kisisel', name: 'Kişisel Gelişim', icon: 'fa-user-graduate', color: '#CA8A04', subs: ['Motivasyon', 'Zaman Yönetimi'] },
    { id: 'dil', name: 'Yabancı Dil', icon: 'fa-language', color: '#4F46E5', subs: ['İngilizce', 'Almanca', 'Fransızca'] },
    { id: 'finans', name: 'Finans', icon: 'fa-chart-line', color: '#16A34A', subs: ['Borsa', 'Kripto', 'Muhasebe'] },
    { id: 'veri', name: 'Veri Bilimi', icon: 'fa-database', color: '#0D9488', subs: ['Python', 'SQL', 'Power BI'] },
    { id: 'ofis', name: 'Ofis Programları', icon: 'fa-file-excel', color: '#15803D', subs: ['Excel', 'Word', 'PowerPoint'] },
    { id: 'siber', name: 'Siber Güvenlik', icon: 'fa-shield-halved', color: '#DC2626', subs: ['Etik Hacking', 'Ağ Güvenliği'] }
  ],
  popularSearches: ['Yapay Zeka', 'Python', 'Web Tasarım', 'İngilizce', 'Dijital Pazarlama', 'Excel', 'Grafik Tasarım'],
  instructors: [
    { id: 1, name: 'Emre Kaya', title: 'Senior Yazılım Eğitmeni', bio: '10+ yıl yazılım geliştirme deneyimi. Python, AI ve web teknolojileri uzmanı.', rating: 4.9, students: 45200, courses: 8, reviews: 12480, avatar: 'EK', color: '#2563EB' },
    { id: 2, name: 'Zeynep Arslan', title: 'UI/UX Tasarım Uzmanı', bio: 'Google ve Trendyol\'da tasarım lideri. Figma ve Adobe uzmanı.', rating: 4.8, students: 28300, courses: 5, reviews: 8920, avatar: 'ZA', color: '#DB2777' },
    { id: 3, name: 'Can Öztürk', title: 'Dijital Pazarlama Stratejisti', bio: 'Meta ve Google sertifikalı pazarlama uzmanı.', rating: 4.7, students: 35600, courses: 6, reviews: 9340, avatar: 'CO', color: '#EA580C' },
    { id: 4, name: 'Selin Demir', title: 'İngilizce Eğitmeni', bio: 'Cambridge CELTA sertifikalı, 8 yıl deneyim.', rating: 4.9, students: 52100, courses: 4, reviews: 15600, avatar: 'SD', color: '#4F46E5' },
    { id: 5, name: 'Burak Yıldız', title: 'Veri Bilimci', bio: 'PhD, makine öğrenmesi ve büyük veri uzmanı.', rating: 4.8, students: 19800, courses: 4, reviews: 5670, avatar: 'BY', color: '#0D9488' },
    { id: 6, name: 'Elif Korkmaz', title: 'Excel & Ofis Uzmanı', bio: 'Microsoft MVP, kurumsal eğitim deneyimi.', rating: 4.6, students: 41200, courses: 3, reviews: 11200, avatar: 'EK2', color: '#15803D' },
    { id: 7, name: 'Murat Aydın', title: 'Siber Güvenlik Uzmanı', bio: 'CEH, OSCP sertifikalı güvenlik danışmanı.', rating: 4.7, students: 15600, courses: 3, reviews: 4230, avatar: 'MA', color: '#DC2626' },
    { id: 8, name: 'Deniz Çelik', title: 'Fotoğrafçı & Video Editör', bio: 'Uluslararası ödüllü fotoğraf sanatçısı.', rating: 4.8, students: 12400, courses: 3, reviews: 3890, avatar: 'DC', color: '#059669' },
    { id: 9, name: 'Ahmet Şahin', title: 'Finans Eğitmeni', bio: 'CFA, 15 yıl finans sektörü deneyimi.', rating: 4.5, students: 22100, courses: 3, reviews: 6780, avatar: 'AS', color: '#16A34A' },
    { id: 10, name: 'Gamze Polat', title: 'Kişisel Gelişim Koçu', bio: 'ICF sertifikalı profesyonel koç.', rating: 4.7, students: 18900, courses: 2, reviews: 5120, avatar: 'GP', color: '#CA8A04' }
  ],
  students: Array.from({ length: 100 }, (_, i) => ({
    id: i + 1, name: `Öğrenci ${i + 1}`, email: `ogrenci${i + 1}@demo.com`, joined: `2025-${String((i % 12) + 1).padStart(2, '0')}-15`
  })),
  liveSessions: [
    { id: 1, title: 'Yapay Zeka ile İş Süreçleri', date: '2026-08-18', time: '20:00', instructorId: 1, participants: 126, duration: 90, courseId: 2, status: 'upcoming', recording: false },
    { id: 2, title: 'React Hooks Derinlemesine', date: '2026-08-20', time: '19:00', instructorId: 1, participants: 89, duration: 120, courseId: 3, status: 'upcoming', recording: false },
    { id: 3, title: 'UI/UX Portfolio Review', date: '2026-08-15', time: '18:00', instructorId: 2, participants: 64, duration: 90, courseId: 8, status: 'completed', recording: true },
    { id: 4, title: 'Google Ads Canlı Uygulama', date: '2026-08-22', time: '20:30', instructorId: 3, participants: 112, duration: 90, courseId: 6, status: 'upcoming', recording: false },
    { id: 5, title: 'İngilizce Konuşma Kulübü', date: '2026-08-19', time: '17:00', instructorId: 4, participants: 45, duration: 60, courseId: 11, status: 'upcoming', recording: false },
    { id: 6, title: 'Python Veri Analizi Workshop', date: '2026-08-12', time: '20:00', instructorId: 5, participants: 78, duration: 120, courseId: 14, status: 'completed', recording: true },
    { id: 7, title: 'Excel Dashboard Masterclass', date: '2026-08-25', time: '19:30', instructorId: 6, participants: 95, duration: 90, courseId: 10, status: 'upcoming', recording: false },
    { id: 8, title: 'Etik Hacking Demo', date: '2026-08-10', time: '21:00', instructorId: 7, participants: 56, duration: 120, courseId: 14, status: 'completed', recording: true },
    { id: 9, title: 'Fotoğraf Kompozisyon Atölyesi', date: '2026-08-28', time: '18:30', instructorId: 8, participants: 34, duration: 90, courseId: 18, status: 'upcoming', recording: false },
    { id: 10, title: 'Finansal Planlama Q&A', date: '2026-08-14', time: '20:00', instructorId: 9, participants: 67, duration: 60, courseId: 13, status: 'completed', recording: true }
  ],
  // Zoom integration architecture (production):
  // Zoom OAuth 2.0, Meeting SDK, Meeting API
  // Server-side: Meeting ID, Password, Token, signature generation
  // NEVER expose secrets in frontend
  zoomConfig: {
    apiEndpoint: '/api/zoom/meetings',
    sdkEndpoint: '/api/zoom/signature',
    fields: ['meetingId', 'meetingPassword', 'meetingToken', 'signature']
  },
  // Payment integration architecture (production):
  // iyzico, PayTR, Stripe — server-side only
  paymentProviders: ['iyzico', 'paytr', 'stripe'],
  notifications: [
    { id: 1, text: 'Canlı dersiniz 30 dakika sonra başlıyor.', type: 'live', read: false, time: '30 dk önce' },
    { id: 2, text: 'Kursunuza yeni bir video eklendi.', type: 'course', read: false, time: '2 saat önce' },
    { id: 3, text: 'Sertifikanız hazır.', type: 'cert', read: true, time: '1 gün önce' },
    { id: 4, text: 'Eğitmeniniz sorunuzu yanıtladı.', type: 'qa', read: false, time: '3 saat önce' }
  ],
  messages: [
    { id: 1, from: 'Emre Kaya', fromId: 1, toId: 'student', lastMsg: 'Projenizi inceledim, harika olmuş!', time: '14:32', unread: 1 },
    { id: 2, from: 'Zeynep Arslan', fromId: 2, toId: 'student', lastMsg: 'Tasarım dosyalarını gönderdim.', time: 'Dün', unread: 0 }
  ],
  orders: [
    { id: 'AKO-2026-001523', courseId: 1, student: 'Ayşe Yılmaz', date: '2026-08-10', amount: 499, payment: 'Kredi Kartı', status: 'completed' },
    { id: 'AKO-2026-001498', courseId: 2, student: 'Mehmet Kara', date: '2026-08-09', amount: 399, payment: 'Kredi Kartı', status: 'completed' },
    { id: 'AKO-2026-001467', courseId: 3, student: 'Fatma Öz', date: '2026-08-08', amount: 549, payment: 'Kredi Kartı', status: 'completed' },
    { id: 'AKO-2026-001445', courseId: 5, student: 'Ali Veli', date: '2026-08-07', amount: 299, payment: 'Kredi Kartı', status: 'completed' },
    { id: 'AKO-2026-001412', courseId: 8, student: 'Zehra Ak', date: '2026-08-06', amount: 449, payment: 'Kredi Kartı', status: 'completed' },
    { id: 'AKO-2026-001389', courseId: 10, student: 'Can Yılmaz', date: '2026-08-05', amount: 199, payment: 'Kredi Kartı', status: 'completed' },
    { id: 'AKO-2026-001356', courseId: 11, student: 'Selin Ar', date: '2026-08-04', amount: 349, payment: 'Kredi Kartı', status: 'completed' },
    { id: 'AKO-2026-001334', courseId: 14, student: 'Burak Koç', date: '2026-08-03', amount: 599, payment: 'Kredi Kartı', status: 'completed' },
    { id: 'AKO-2026-001301', courseId: 6, student: 'Elif Tan', date: '2026-08-02', amount: 379, payment: 'Kredi Kartı', status: 'completed' },
    { id: 'AKO-2026-001278', courseId: 7, student: 'Murat Efe', date: '2026-08-01', amount: 429, payment: 'Kredi Kartı', status: 'completed' },
    { id: 'AKO-2026-001245', courseId: 12, student: 'Deniz Su', date: '2026-07-30', amount: 279, payment: 'Kredi Kartı', status: 'completed' },
    { id: 'AKO-2026-001212', courseId: 15, student: 'Gamze Pol', date: '2026-07-28', amount: 499, payment: 'Kredi Kartı', status: 'completed' },
    { id: 'AKO-2026-001189', courseId: 16, student: 'Ahmet Bey', date: '2026-07-25', amount: 399, payment: 'Kredi Kartı', status: 'completed' },
    { id: 'AKO-2026-001156', courseId: 17, student: 'Aylin Nur', date: '2026-07-22', amount: 349, payment: 'Kredi Kartı', status: 'completed' },
    { id: 'AKO-2026-001123', courseId: 19, student: 'Kemal Din', date: '2026-07-20', amount: 449, payment: 'Kredi Kartı', status: 'completed' }
  ],
  certificates: [
    { id: 'AKO-2026-000214', student: 'Ayşe Yılmaz', courseId: 1, instructorId: 1, date: '2026-07-15', duration: '42 saat', status: 'valid' },
    { id: 'AKO-2026-000198', student: 'Mehmet Kara', courseId: 2, instructorId: 1, date: '2026-07-10', duration: '28 saat', status: 'valid' },
    { id: 'AKO-2026-000187', student: 'Fatma Öz', courseId: 3, instructorId: 1, date: '2026-07-08', duration: '35 saat', status: 'valid' },
    { id: 'AKO-2026-000176', student: 'Ali Veli', courseId: 5, instructorId: 3, date: '2026-07-05', duration: '22 saat', status: 'valid' },
    { id: 'AKO-2026-000165', student: 'Zehra Ak', courseId: 8, instructorId: 2, date: '2026-07-01', duration: '30 saat', status: 'valid' },
    { id: 'AKO-2026-000154', student: 'Can Yılmaz', courseId: 10, instructorId: 6, date: '2026-06-28', duration: '18 saat', status: 'valid' },
    { id: 'AKO-2026-000143', student: 'Selin Ar', courseId: 11, instructorId: 4, date: '2026-06-25', duration: '40 saat', status: 'valid' },
    { id: 'AKO-2026-000132', student: 'Burak Koç', courseId: 14, instructorId: 7, date: '2026-06-20', duration: '25 saat', status: 'valid' },
    { id: 'AKO-2026-000121', student: 'Elif Tan', courseId: 6, instructorId: 3, date: '2026-06-15', duration: '20 saat', status: 'valid' },
    { id: 'AKO-2026-000110', student: 'Murat Efe', courseId: 7, instructorId: 2, date: '2026-06-10', duration: '32 saat', status: 'valid' }
  ],
  reviews: [
    { id: 1, courseId: 1, student: 'Mehmet K.', rating: 5, text: 'Harika bir kurs! Sıfırdan Python öğrenmek isteyenler için mükemmel.', date: '2026-07-20', helpful: 45 },
    { id: 2, courseId: 1, student: 'Zeynep A.', rating: 5, text: 'Emre Hoca çok iyi anlatıyor, projeler gerçek hayata uygun.', date: '2026-07-18', helpful: 32 },
    { id: 3, courseId: 2, student: 'Can D.', rating: 4, text: 'AI konusunda çok kapsamlı, biraz hızlı ilerliyor.', date: '2026-07-15', helpful: 18 },
    { id: 4, courseId: 3, student: 'Selin Y.', rating: 5, text: 'React öğrenmek için en iyi Türkçe kaynak.', date: '2026-07-12', helpful: 56 },
    { id: 5, courseId: 5, student: 'Ali R.', rating: 4, text: 'Dijital pazarlama temellerini çok iyi öğretiyor.', date: '2026-07-10', helpful: 23 },
    { id: 6, courseId: 8, student: 'Fatma S.', rating: 5, text: 'UI/UX tasarım konusunda gözümü açtı.', date: '2026-07-08', helpful: 41 },
    { id: 7, courseId: 10, student: 'Burak T.', rating: 4, text: 'Excel\'de pivot tablolar artık çocuk oyuncağı.', date: '2026-07-05', helpful: 29 },
    { id: 8, courseId: 11, student: 'Deniz K.', rating: 5, text: 'İngilizce konuşmam inanılmaz gelişti.', date: '2026-07-03', helpful: 67 },
    { id: 9, courseId: 14, student: 'Emre P.', rating: 5, text: 'Siber güvenliğe giriş için ideal.', date: '2026-06-28', helpful: 15 },
    { id: 10, courseId: 6, student: 'Aylin M.', rating: 4, text: 'Google Ads kampanyalarımı kendim yönetiyorum artık.', date: '2026-06-25', helpful: 38 },
    { id: 11, courseId: 7, student: 'Kemal B.', rating: 5, text: 'Sosyal medya stratejileri çok güncel.', date: '2026-06-22', helpful: 22 },
    { id: 12, courseId: 12, student: 'Gamze H.', rating: 4, text: 'Photoshop\'u profesyonelce kullanmayı öğrendim.', date: '2026-06-20', helpful: 31 },
    { id: 13, courseId: 13, student: 'Murat L.', rating: 5, text: 'Finansal okuryazarlık herkes için gerekli.', date: '2026-06-18', helpful: 19 },
    { id: 14, courseId: 15, student: 'Elif C.', rating: 4, text: 'HTML CSS JS temelleri sağlam.', date: '2026-06-15', helpful: 44 },
    { id: 15, courseId: 16, student: 'Ahmet N.', rating: 5, text: 'Veri bilimi yolculuğuma başladım.', date: '2026-06-12', helpful: 27 },
    { id: 16, courseId: 17, student: 'Zehra F.', rating: 4, text: 'Fotoğrafçılık teknikleri çok iyi anlatılmış.', date: '2026-06-10', helpful: 16 },
    { id: 17, courseId: 18, student: 'Can Ö.', rating: 5, text: 'Kişisel gelişim konusunda dönüm noktası.', date: '2026-06-08', helpful: 53 },
    { id: 18, courseId: 19, student: 'Selin D.', rating: 4, text: 'Node.js backend geliştirme çok pratik.', date: '2026-06-05', helpful: 21 },
    { id: 19, courseId: 20, student: 'Burak A.', rating: 5, text: 'Docker ve Kubernetes anlaşılır şekilde.', date: '2026-06-03', helpful: 35 },
    { id: 20, courseId: 21, student: 'Deniz R.', rating: 4, text: 'Power BI ile dashboard yapmayı öğrendim.', date: '2026-06-01', helpful: 28 }
  ],
  qaItems: [
    { id: 1, courseId: 1, student: 'Mehmet K.', question: 'MacOS\'ta kurulum farklı mı?', answer: 'Hayır, 3. derste MacOS kurulumu da gösteriliyor.', instructorId: 1, helpful: 12, date: '2026-07-10' },
    { id: 2, courseId: 1, student: 'Zeynep A.', question: 'Sertifika almak için quiz geçmem gerekiyor mu?', answer: 'Evet, tüm quizleri %70 ve üzeri tamamlamanız gerekiyor.', instructorId: 1, helpful: 28, date: '2026-07-08' },
    { id: 3, courseId: 3, student: 'Can D.', question: 'React 19 destekleniyor mu?', answer: 'Evet, son güncellemede React 19 eklendi.', instructorId: 1, helpful: 15, date: '2026-07-05' }
  ],
  cashMovements: [
    { date: '2026-08-17', type: 'Satış', order: 'AKO-2026-001523', course: 'Sıfırdan Python', user: 'Ayşe Y.', in: 499, out: 0, balance: 245680 },
    { date: '2026-08-17', type: 'Komisyon', order: 'AKO-2026-001523', course: 'Sıfırdan Python', user: 'Emre K.', in: 0, out: 99.8, balance: 245580 },
    { date: '2026-08-16', type: 'Satış', order: 'AKO-2026-001498', course: 'ChatGPT & AI', user: 'Mehmet K.', in: 399, out: 0, balance: 245180 },
    { date: '2026-08-16', type: 'Eğitmen Ödemesi', order: 'PAY-001', course: '-', user: 'Emre K.', in: 0, out: 15000, balance: 230180 },
    { date: '2026-08-15', type: 'İade', order: 'AKO-2026-001234', course: 'Excel Uzmanlığı', user: 'Ali V.', in: 0, out: 199, balance: 245180 }
  ],
  instructorEarnings: {
    totalSales: 1245800, grossRevenue: 1245800, platformCommission: 249160, instructorEarnings: 996640, pendingBalance: 45200,
    monthly: [42000, 58000, 71000, 65000, 89000, 95000, 102000, 88000, 76000, 92000, 105000, 98000],
    sales: [
      { date: '2026-08-17', student: 'Ayşe Y.', course: 'Sıfırdan Python', amount: 499, commission: 99.8, net: 399.2 },
      { date: '2026-08-16', student: 'Mehmet K.', course: 'ChatGPT & AI', amount: 399, commission: 79.8, net: 319.2 },
      { date: '2026-08-15', student: 'Fatma Ö.', course: 'React Modern Web', amount: 549, commission: 109.8, net: 439.2 }
    ],
    withdrawals: [
      { id: 1, amount: 15000, bank: 'Garanti BBVA', iban: 'TR** **** **** 4521', status: 'paid', date: '2026-08-16' },
      { id: 2, amount: 8500, bank: 'İş Bankası', iban: 'TR** **** **** 7832', status: 'pending', date: '2026-08-17' }
    ]
  },
  adminStats: {
    totalUsers: 12450, activeStudents: 8920, instructors: 10, activeCourses: 30,
    totalSales: 4567800, todaySales: 8940, monthlyRevenue: 892000, platformEarnings: 1784000,
    liveSessions: 10, dailySales: [4200, 5800, 7100, 6500, 8900, 9500, 8940],
    monthlySales: [420000, 580000, 710000, 650000, 890000, 950000, 892000],
    newUsers: [120, 145, 132, 156, 178, 165, 142],
    categoryDistribution: [28, 18, 12, 15, 10, 5, 4, 8],
    instructorPerformance: [95, 88, 82, 91, 78, 85, 72, 68, 75, 80],
    completionRates: [72, 68, 75, 62, 58, 70, 65, 55, 60, 78]
  },
  videoAnalytics: [
    { title: 'Python\'a Giriş', views: 2841, avgWatch: 84, avgDuration: '11:28' },
    { title: 'Değişkenler ve Veri Tipleri', views: 2156, avgWatch: 78, avgDuration: '9:45' },
    { title: 'React Hooks', views: 1890, avgWatch: 82, avgDuration: '14:32' }
  ],
  courseAnalytics: {
    enrolled: 3420, active: 2180, avgWatch: 68, completion: 72, dropOff: 28
  },
  i18n: {
    tr: { explore: 'Keşfet', courses: 'Kurslar', login: 'Giriş Yap', signup: 'Kayıt Ol', cart: 'Sepet', search: 'Ne öğrenmek istiyorsun?' },
    en: { explore: 'Explore', courses: 'Courses', login: 'Login', signup: 'Sign Up', cart: 'Cart', search: 'What do you want to learn?' }
  }
};

// Generate 30 courses
(function generateCourses() {
  const courseTemplates = [
    { title: 'Sıfırdan Python ve Yapay Zeka', cat: 'yazilim', inst: 1, price: 499, oldPrice: 1799, hours: 42, lessons: 216, level: 'Başlangıç', bestseller: true, rating: 4.9, students: 12480, lang: 'Türkçe', hasLive: true, hasCert: true },
    { title: 'ChatGPT & Yapay Zeka Uzmanlığı', cat: 'ai', inst: 1, price: 399, oldPrice: 1299, hours: 28, lessons: 142, level: 'Orta', bestseller: true, rating: 4.8, students: 9870, lang: 'Türkçe', hasLive: true, hasCert: true },
    { title: 'React ile Modern Web Geliştirme', cat: 'yazilim', inst: 1, price: 549, oldPrice: 1899, hours: 35, lessons: 178, level: 'Orta', bestseller: true, rating: 4.9, students: 8650, lang: 'Türkçe', hasLive: false, hasCert: true },
    { title: 'HTML CSS JavaScript — Full Stack Temel', cat: 'yazilim', inst: 1, price: 349, oldPrice: 999, hours: 32, lessons: 165, level: 'Başlangıç', bestseller: false, rating: 4.7, students: 15200, lang: 'Türkçe', hasLive: false, hasCert: true },
    { title: 'Dijital Pazarlama Uzmanlığı', cat: 'pazarlama', inst: 3, price: 299, oldPrice: 899, hours: 22, lessons: 98, level: 'Başlangıç', bestseller: true, rating: 4.7, students: 11340, lang: 'Türkçe', hasLive: false, hasCert: true },
    { title: 'Google Ads Sertifika Hazırlık', cat: 'pazarlama', inst: 3, price: 379, oldPrice: 1199, hours: 20, lessons: 86, levels: 'Orta', bestseller: false, rating: 4.6, students: 6780, lang: 'Türkçe', hasLive: true, hasCert: true },
    { title: 'Sosyal Medya Yönetimi Masterclass', cat: 'pazarlama', inst: 3, price: 429, oldPrice: 1299, hours: 18, lessons: 72, level: 'Orta', bestseller: false, rating: 4.8, students: 8920, lang: 'Türkçe', hasLive: false, hasCert: true },
    { title: 'UI/UX Tasarım — Figma ile Profesyonel', cat: 'tasarim', inst: 2, price: 449, oldPrice: 1499, hours: 30, lessons: 124, level: 'Başlangıç', bestseller: true, rating: 4.8, students: 7650, lang: 'Türkçe', hasLive: true, hasCert: true },
    { title: 'Adobe Photoshop Uzmanlığı', cat: 'tasarim', inst: 2, price: 399, oldPrice: 1199, hours: 25, lessons: 108, level: 'Orta', bestseller: false, rating: 4.7, students: 5430, lang: 'Türkçe', hasLive: false, hasCert: true },
    { title: 'Excel Uzmanlığı — Sıfırdan İleri Seviye', cat: 'ofis', inst: 6, price: 199, oldPrice: 599, hours: 18, lessons: 92, level: 'Başlangıç', bestseller: true, rating: 4.6, students: 18900, lang: 'Türkçe', hasLive: true, hasCert: true },
    { title: 'İngilizce A1-A2 — Sıfırdan Başlangıç', cat: 'dil', inst: 4, price: 349, oldPrice: 999, hours: 40, lessons: 180, level: 'Başlangıç', bestseller: true, rating: 4.9, students: 22100, lang: 'Türkçe', hasLive: true, hasCert: true },
    { title: 'İngilizce Konuşma Pratiği', cat: 'dil', inst: 4, price: 279, oldPrice: 799, hours: 24, lessons: 96, level: 'Orta', bestseller: false, rating: 4.8, students: 9870, lang: 'Türkçe', hasLive: true, hasCert: true },
    { title: 'Finansal Okuryazarlık', cat: 'finans', inst: 9, price: 249, oldPrice: 699, hours: 16, lessons: 64, level: 'Başlangıç', bestseller: false, rating: 4.5, students: 6540, lang: 'Türkçe', hasLive: false, hasCert: true },
    { title: 'Siber Güvenliğe Giriş', cat: 'siber', inst: 7, price: 599, oldPrice: 1799, hours: 25, lessons: 112, level: 'Başlangıç', bestseller: true, rating: 4.7, students: 4320, lang: 'Türkçe', hasLive: true, hasCert: true },
    { title: 'Makine Öğrenmesi ile Veri Bilimi', cat: 'veri', inst: 5, price: 499, oldPrice: 1599, hours: 38, lessons: 156, level: 'İleri', bestseller: true, rating: 4.8, students: 5670, lang: 'Türkçe', hasLive: false, hasCert: true },
    { title: 'Node.js Backend Geliştirme', cat: 'yazilim', inst: 1, price: 449, oldPrice: 1399, hours: 28, lessons: 134, level: 'Orta', bestseller: false, rating: 4.7, students: 4890, lang: 'Türkçe', hasLive: false, hasCert: true },
    { title: 'Profesyonel Fotoğrafçılık', cat: 'fotograf', inst: 8, price: 349, oldPrice: 1099, hours: 22, lessons: 88, level: 'Başlangıç', bestseller: false, rating: 4.8, students: 3210, lang: 'Türkçe', hasLive: true, hasCert: true },
    { title: 'Kişisel Gelişim ve Liderlik', cat: 'kisisel', inst: 10, price: 199, oldPrice: 599, hours: 14, lessons: 56, level: 'Başlangıç', bestseller: false, rating: 4.7, students: 8760, lang: 'Türkçe', hasLive: false, hasCert: true },
    { title: 'Docker & Kubernetes DevOps', cat: 'yazilim', inst: 1, price: 549, oldPrice: 1699, hours: 30, lessons: 128, level: 'İleri', bestseller: false, rating: 4.6, students: 3450, lang: 'Türkçe', hasLive: false, hasCert: true },
    { title: 'Power BI ile Veri Görselleştirme', cat: 'veri', inst: 5, price: 299, oldPrice: 899, hours: 20, lessons: 84, level: 'Orta', bestseller: false, rating: 4.5, students: 6780, lang: 'Türkçe', hasLive: false, hasCert: true },
    { title: 'Vue.js 3 ile Frontend Geliştirme', cat: 'yazilim', inst: 1, price: 399, oldPrice: 1199, hours: 26, lessons: 118, level: 'Orta', bestseller: false, rating: 4.7, students: 4120, lang: 'Türkçe', hasLive: false, hasCert: true },
    { title: 'SEO Uzmanlığı — Google Sıralama', cat: 'pazarlama', inst: 3, price: 329, oldPrice: 999, hours: 18, lessons: 76, level: 'Orta', bestseller: false, rating: 4.6, students: 5890, lang: 'Türkçe', hasLive: false, hasCert: true },
    { title: 'Adobe Illustrator Grafik Tasarım', cat: 'tasarim', inst: 2, price: 379, oldPrice: 1099, hours: 24, lessons: 98, level: 'Başlangıç', bestseller: false, rating: 4.7, students: 4560, lang: 'Türkçe', hasLive: false, hasCert: true },
    { title: 'Borsa ve Yatırım Temelleri', cat: 'finans', inst: 9, price: 349, oldPrice: 999, hours: 20, lessons: 82, level: 'Başlangıç', bestseller: false, rating: 4.4, students: 7890, lang: 'Türkçe', hasLive: false, hasCert: true },
    { title: 'Etik Hacking ve Penetrasyon Testi', cat: 'siber', inst: 7, price: 699, oldPrice: 1999, hours: 35, lessons: 148, level: 'İleri', bestseller: false, rating: 4.8, students: 2890, lang: 'Türkçe', hasLive: true, hasCert: true },
    { title: 'Almanca A1 — Başlangıç Seviyesi', cat: 'dil', inst: 4, price: 299, oldPrice: 799, hours: 30, lessons: 120, level: 'Başlangıç', bestseller: false, rating: 4.6, students: 3450, lang: 'Türkçe', hasLive: false, hasCert: true },
    { title: 'Girişimcilik ve Startup Kurma', cat: 'isletme', inst: 10, price: 249, oldPrice: 749, hours: 16, lessons: 68, level: 'Başlangıç', bestseller: false, rating: 4.5, students: 5670, lang: 'Türkçe', hasLive: false, hasCert: true },
    { title: 'Lightroom ile Fotoğraf Düzenleme', cat: 'fotograf', inst: 8, price: 279, oldPrice: 799, hours: 16, lessons: 64, level: 'Orta', bestseller: false, rating: 4.7, students: 2340, lang: 'Türkçe', hasLive: false, hasCert: true },
    { title: 'SQL ve Veritabanı Yönetimi', cat: 'veri', inst: 5, price: 349, oldPrice: 999, hours: 22, lessons: 96, level: 'Başlangıç', bestseller: false, rating: 4.6, students: 6780, lang: 'Türkçe', hasLive: false, hasCert: true },
    { title: 'Word & PowerPoint Ofis Uzmanlığı', cat: 'ofis', inst: 6, price: 149, oldPrice: 449, hours: 12, lessons: 48, level: 'Başlangıç', bestseller: false, rating: 4.5, students: 9870, lang: 'Türkçe', hasLive: false, hasCert: true }
  ];

  const colors = ['2563EB', '7C3AED', '0891B2', 'EA580C', 'DB2777', '059669', 'CA8A04', '4F46E5', '16A34A', '0D9488', '15803D', 'DC2626'];
  AKO.courses = courseTemplates.map((t, i) => {
    const discount = Math.round((1 - t.price / t.oldPrice) * 100);
    const inst = AKO.instructors.find(x => x.id === t.inst);
    return {
      id: i + 1,
      slug: t.title.toLowerCase().replace(/[^a-z0-9ğüşıöç]+/gi, '-').replace(/-+/g, '-'),
      title: t.title,
      subtitle: `${t.level} seviye · ${t.hours} saat · ${t.lessons} ders`,
      description: `${t.title} eğitimi ile alanında uzman ${inst.name} eğitmeninden kapsamlı online eğitim alın. ${t.hours} saat video içerik, projeler, quizler ve sertifika dahil.`,
      category: t.cat,
      subcategory: AKO.categories.find(c => c.id === t.cat)?.subs[0] || '',
      instructorId: t.inst,
      price: t.price,
      oldPrice: t.oldPrice,
      discount,
      hours: t.hours,
      lessons: t.lessons,
      level: t.level || t.levels || 'Başlangıç',
      rating: t.rating,
      reviewCount: Math.floor(t.students * 0.3),
      students: t.students,
      lang: t.lang,
      bestseller: t.bestseller,
      hasLive: t.hasLive,
      hasCert: t.hasCert,
      updated: '2026-08-01',
      image: `https://picsum.photos/seed/ako${i + 1}/640/360`,
      color: colors[i % colors.length],
      includes: { videos: t.hours, pdfs: Math.floor(t.lessons * 0.05), quizzes: Math.floor(t.lessons * 0.04), projects: Math.floor(t.lessons * 0.02), lifetime: true, mobile: true, certificate: t.hasCert },
      curriculum: generateCurriculum(t.title, t.lessons, t.hours),
      ratingDistribution: { 5: 78, 4: 16, 3: 4, 2: 1, 1: 1 }
    };
  });
})();

function generateCurriculum(title, totalLessons, totalHours) {
  const sections = [
    { title: 'Bölüm 1 — Başlangıç', lessons: [
      { id: 'l1', title: 'Platforma Giriş', type: 'video', duration: '8:24', preview: true },
      { id: 'l2', title: 'Eğitim Nasıl Kullanılır?', type: 'video', duration: '6:15', preview: true },
      { id: 'l3', title: 'Dosyaların Kurulumu', type: 'video', duration: '12:30', preview: false },
      { id: 'l4', title: 'Başlangıç PDF', type: 'pdf', duration: '—', preview: false }
    ]},
    { title: 'Bölüm 2 — Temel Eğitim', lessons: [
      { id: 'l5', title: 'Değişkenler', type: 'video', duration: '14:22', preview: false },
      { id: 'l6', title: 'Veri Tipleri', type: 'video', duration: '11:45', preview: false },
      { id: 'l7', title: 'Operatörler', type: 'video', duration: '9:18', preview: false },
      { id: 'l8', title: 'Temel Quiz', type: 'quiz', duration: '15 dk', preview: false }
    ]},
    { title: 'Bölüm 3 — İleri Seviye', lessons: [
      { id: 'l9', title: 'Fonksiyonlar', type: 'video', duration: '18:30', preview: false },
      { id: 'l10', title: 'OOP Kavramları', type: 'video', duration: '22:15', preview: false },
      { id: 'l11', title: 'API Kullanımı', type: 'video', duration: '16:40', preview: false },
      { id: 'l12', title: 'Final Projesi', type: 'assignment', duration: '—', preview: false }
    ]}
  ];
  return sections;
}

AKO.quizzes = {
  1: {
    title: 'Python Temel Quiz',
    questions: [
      { id: 1, type: 'single', question: 'Python\'da liste tanımlamak için hangi sembol kullanılır?', options: ['[]', '{}', '()', '<>'], correct: 0, explanation: 'Köşeli parantez [] liste tanımlamak için kullanılır.', points: 10 },
      { id: 2, type: 'multiple', question: 'Hangileri Python veri tipleridir?', options: ['int', 'string', 'boolean', 'char'], correct: [0, 1, 2], explanation: 'Python\'da char ayrı bir tip değildir.', points: 10 },
      { id: 3, type: 'boolean', question: 'Python yorumlanan bir dildir.', correct: true, explanation: 'Evet, Python yorumlanan bir programlama dilidir.', points: 10 },
      { id: 4, type: 'single', question: 'print() fonksiyonunun görevi nedir?', options: ['Ekrana yazdır', 'Dosya oku', 'Değişken sil', 'Döngü oluştur'], correct: 0, explanation: 'print() ekrana çıktı yazdırır.', points: 10 },
      { id: 5, type: 'single', question: 'for döngüsü ne için kullanılır?', options: ['Tekrarlı işlem', 'Koşul kontrolü', 'Fonksiyon tanımı', 'Sınıf oluşturma'], correct: 0, explanation: 'for döngüsü tekrarlı işlemler için kullanılır.', points: 10 }
    ]
  }
};

AKO.getInstructor = id => AKO.instructors.find(i => i.id === id);
AKO.getCourse = id => AKO.courses.find(c => c.id === Number(id));
AKO.getCategory = id => AKO.categories.find(c => c.id === id);
AKO.getCourseReviews = id => AKO.reviews.filter(r => r.courseId === Number(id));
AKO.getCourseQA = id => AKO.qaItems.filter(q => q.courseId === Number(id));
AKO.searchAll = query => {
  const q = query.toLowerCase();
  const courses = AKO.courses.filter(c => c.title.toLowerCase().includes(q)).slice(0, 5);
  const instructors = AKO.instructors.filter(i => i.name.toLowerCase().includes(q)).slice(0, 3);
  const categories = AKO.categories.filter(c => c.name.toLowerCase().includes(q)).slice(0, 3);
  return { courses, instructors, categories };
};
