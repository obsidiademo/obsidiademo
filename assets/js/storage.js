/* Akıllı Okul — Storage Layer */
const Storage = {
  KEYS: {
    user: 'ako_user', role: 'ako_role', theme: 'ako_theme', lang: 'ako_lang',
    cart: 'ako_cart', favorites: 'ako_favorites', progress: 'ako_progress',
    quizResults: 'ako_quiz_results', lastWatched: 'ako_last_watched',
    notifications: 'ako_notifications', enrolled: 'ako_enrolled',
    orders: 'ako_orders', profile: 'ako_profile', coupons: 'ako_coupons_used',
    zoom: 'ako_zoom_settings', payments: 'ako_payment_settings'
  },
  get(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
  remove(key) { localStorage.removeItem(key); },
  getUser() { return this.get(this.KEYS.user); },
  setUser(u) { this.set(this.KEYS.user, u); },
  getRole() { return this.get(this.KEYS.role); },
  setRole(r) { this.set(this.KEYS.role, r); },
  logout() {
    Object.values(this.KEYS).forEach(k => { if (!['ako_theme','ako_lang'].includes(k)) this.remove(k); });
  },
  getTheme() { return localStorage.getItem(this.KEYS.theme) || 'light'; },
  setTheme(t) { localStorage.setItem(this.KEYS.theme, t); document.documentElement.setAttribute('data-theme', t); },
  getLang() { return localStorage.getItem(this.KEYS.lang) || 'tr'; },
  setLang(l) { localStorage.setItem(this.KEYS.lang, l); },
  getCart() { return this.get(this.KEYS.cart) || []; },
  setCart(c) { this.set(this.KEYS.cart, c); App.updateCartBadge(); },
  addToCart(courseId) {
    const cart = this.getCart();
    if (!cart.find(c => c.id === courseId)) {
      const course = AKO.getCourse(courseId);
      if (course) { cart.push({ id: course.id, title: course.title, price: course.price, oldPrice: course.oldPrice, instructor: AKO.getInstructor(course.instructorId).name }); this.setCart(cart); return true; }
    }
    return false;
  },
  removeFromCart(courseId) { this.setCart(this.getCart().filter(c => c.id !== courseId)); },
  getFavorites() { return this.get(this.KEYS.favorites) || []; },
  toggleFavorite(courseId) {
    let favs = this.getFavorites();
    const idx = favs.indexOf(courseId);
    if (idx >= 0) favs.splice(idx, 1); else favs.push(courseId);
    this.set(this.KEYS.favorites, favs);
    return favs.includes(courseId);
  },
  isFavorite(courseId) { return this.getFavorites().includes(courseId); },
  getProgress(courseId) {
    const all = this.get(this.KEYS.progress) || {};
    return all[courseId] || { completed: [], percent: 0, lastLesson: null };
  },
  setProgress(courseId, data) {
    const all = this.get(this.KEYS.progress) || {};
    all[courseId] = data;
    this.set(this.KEYS.progress, all);
  },
  markLessonComplete(courseId, lessonId) {
    const p = this.getProgress(courseId);
    if (!p.completed.includes(lessonId)) p.completed.push(lessonId);
    const course = AKO.getCourse(courseId);
    const total = course.curriculum.reduce((s, sec) => s + sec.lessons.length, 0);
    p.percent = Math.round((p.completed.length / total) * 100);
    p.lastLesson = lessonId;
    this.setProgress(courseId, p);
    this.setLastWatched(courseId, lessonId);
    return p;
  },
  getLastWatched() { return this.get(this.KEYS.lastWatched) || {}; },
  setLastWatched(courseId, lessonId) {
    const lw = this.getLastWatched();
    lw[courseId] = { lessonId, time: Date.now() };
    this.set(this.KEYS.lastWatched, lw);
  },
  getEnrolled() { return this.get(this.KEYS.enrolled) || [1]; },
  enrollCourse(courseId) {
    const e = this.getEnrolled();
    if (!e.includes(courseId)) { e.push(courseId); this.set(this.KEYS.enrolled, e); }
  },
  isEnrolled(courseId) { return this.getEnrolled().includes(Number(courseId)); },
  getOrders() { return this.get(this.KEYS.orders) || []; },
  addOrder(order) { const o = this.getOrders(); o.unshift(order); this.set(this.KEYS.orders, o); },
  getProfile() {
    return this.get(this.KEYS.profile) || { firstName: 'Ayşe', lastName: 'Yılmaz', email: 'ogrenci@akilliokul.com', phone: '0532 123 4567', job: 'Yazılım Geliştirici', bio: 'Online eğitim tutkunu.' };
  },
  setProfile(p) { this.set(this.KEYS.profile, p); },
  getQuizResult(courseId) { return (this.get(this.KEYS.quizResults) || {})[courseId]; },
  setQuizResult(courseId, result) {
    const all = this.get(this.KEYS.quizResults) || {};
    all[courseId] = result;
    this.set(this.KEYS.quizResults, all);
  },
  isCouponUsed(code) { return (this.get(this.KEYS.coupons) || []).includes(code); },
  markCouponUsed(code) { const u = this.get(this.KEYS.coupons) || []; u.push(code); this.set(this.KEYS.coupons, u); },
  getZoomSettings() {
    return this.get(this.KEYS.zoom) || {
      enabled: false, accountId: '', clientId: '', clientSecret: '', sdkKey: '', sdkSecret: '',
      webhookUrl: '', meetingSdk: true, oauthConnected: false
    };
  },
  setZoomSettings(s) { this.set(this.KEYS.zoom, s); }
};
