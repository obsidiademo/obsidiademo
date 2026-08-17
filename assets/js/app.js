/* Akıllı Okul — Main Application */
const App = {
  checkoutDiscount: 0,
  checkoutCoupon: null,
  quizState: { current: 0, answers: {} },
  wizardStep: 1,

  init() {
    Storage.setTheme(Storage.getTheme());
    this.showLoader();
    this.registerRoutes();
    setTimeout(() => {
      this.hideLoader();
      Router.init();
    }, 1200);
  },

  showLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.remove('hidden');
  },

  hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) { loader.classList.add('hidden'); setTimeout(() => loader.remove(), 500); }
  },

  registerRoutes() {
    Router.register('/', () => Views.home());
    Router.register('/courses', () => Views.courses(Router.currentParams));
    Router.register('/course/:id', p => Views.courseDetail(p));
    Router.register('/player/:id', p => Views.player(p));
    Router.register('/dashboard', () => Views.dashboard());
    Router.register('/my-courses', () => Views.myCourses());
    Router.register('/favorites', () => Views.favorites());
    Router.register('/certificates', () => Views.certificates());
    Router.register('/certificate/:id', p => Views.certificateView(p));
    Router.register('/sertifika/:id', p => Views.certificateVerify(p));
    Router.register('/certificate-verify', () => Views.certificateVerify({}));
    Router.register('/live-sessions', () => Views.liveSessions());
    Router.register('/live/:id', p => Views.liveRoom(p));
    Router.register('/checkout', () => Views.checkout());
    Router.register('/order-success', p => Views.orderSuccess(p));
    Router.register('/purchases', () => Views.purchases());
    Router.register('/profile', () => Views.profile());
    Router.register('/messages', () => Views.messages());
    Router.register('/quiz/:courseId', p => Views.quiz(p));
    Router.register('/instructor/:id', p => Views.instructorProfile(p));
    Router.register('/become-instructor', () => Views.becomeInstructor());
    Router.register('/instructor', () => Views.instructorDashboard());
    Router.register('/instructor/create', () => Views.instructorCreate());
    Router.register('/instructor/courses', () => Views.instructorCourses());
    Router.register('/instructor/earnings', () => Views.instructorEarnings());
    Router.register('/instructor/analytics', () => Views.instructorAnalytics());
    Router.register('/instructor/ai', () => Views.instructorAI());
    Router.register('/instructor/live', () => Views.instructorLive());
    Router.register('/admin', () => Views.adminDashboard());
    Router.register('/admin/courses', () => Views.adminCourses());
    Router.register('/admin/categories', () => Views.adminCategories());
    Router.register('/admin/instructors', () => Views.adminInstructors());
    Router.register('/admin/students', () => Views.adminStudents());
    Router.register('/admin/orders', () => Views.adminOrders());
    Router.register('/admin/coupons', () => Views.adminCoupons());
    Router.register('/admin/campaigns', () => Views.adminCampaigns());
    Router.register('/admin/cash', () => Views.adminCash());
    Router.register('/admin/payments', () => Views.adminPayments());
    Router.register('/admin/commission', () => Views.adminCommission());
    Router.register('/admin/settings', () => Views.adminSettings());
    Router.register('/admin/integrations', () => Views.adminIntegrations());
    Router.register('/admin/live', () => Views.adminLive());
    Router.register('/admin/certificates', () => Views.adminCertificates());
    Router.register('/admin/logs', () => Views.adminLogs());
    Router.register('/admin/users', () => Views.adminUsers());
    Router.register('/finance', () => Views.financeDashboard());
  },

  afterRender(params) {
    this.bindGlobalEvents();
    this.updateCartBadge();
    const hash = window.location.hash.slice(1);
    if (hash.startsWith('/player/')) this.initPlayer(params || {});
    if (hash.startsWith('/checkout')) this.initCheckout();
    if (hash.startsWith('/quiz/')) this.initQuiz(params);
    if (hash.includes('/instructor/create')) this.initWizard();
    if (hash === '/admin' || hash.startsWith('/admin')) this.initAdminCharts();
    if (hash === '/instructor' || hash === '/instructor/earnings') this.initInstructorCharts();
    if (hash.startsWith('/live/') && !hash.includes('sessions')) this.initLiveRoom();
    this.initPromoStrip();
    this.initSkeleton();
  },

  bindGlobalEvents() {
    // Cart
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = Number(e.currentTarget.dataset.cart);
        if (Storage.addToCart(id)) Components.toast('Kurs sepete eklendi.');
        else Components.toast('Kurs zaten sepette.', 'info');
      });
    });
    document.querySelectorAll('.btn-buy-now').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = Number(e.currentTarget.dataset.buy);
        Storage.addToCart(id);
        Router.navigate('/checkout');
      });
    });
    document.querySelectorAll('.btn-fav, .btn-fav-toggle').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = Number(e.currentTarget.dataset.fav);
        const isFav = Storage.toggleFavorite(id);
        Components.toast(isFav ? 'Favorilere eklendi.' : 'Favorilerden çıkarıldı.');
        e.currentTarget.classList.toggle('active', isFav);
        const icon = e.currentTarget.querySelector('i');
        if (icon) { icon.className = isFav ? 'fa-solid fa-heart' : 'fa-regular fa-heart'; }
      });
    });
    // Header buttons
    const btnCart = document.getElementById('btnCart');
    if (btnCart) btnCart.addEventListener('click', () => {
      document.getElementById('cartDrawer')?.classList.contains('show') ? bootstrap.Offcanvas.getInstance(document.getElementById('cartDrawer'))?.hide() : new bootstrap.Offcanvas(document.getElementById('cartDrawer')).show();
    });
    const btnNotif = document.getElementById('btnNotif');
    if (btnNotif) btnNotif.addEventListener('click', () => new bootstrap.Offcanvas(document.getElementById('notifDrawer')).show());
    const btnTheme = document.getElementById('btnTheme');
    if (btnTheme) btnTheme.addEventListener('click', () => {
      const t = Storage.getTheme() === 'dark' ? 'light' : 'dark';
      Storage.setTheme(t);
      btnTheme.querySelector('i').className = `fa-solid fa-${t === 'dark' ? 'sun' : 'moon'}`;
      Components.toast(`${t === 'dark' ? 'Koyu' : 'Açık'} tema aktif.`);
    });
    document.querySelectorAll('.lang-opt').forEach(el => el.addEventListener('click', e => {
      e.preventDefault();
      Storage.setLang(e.currentTarget.dataset.lang);
      Components.toast('Dil değiştirildi.');
      Router.render();
    }));
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) btnLogout.addEventListener('click', e => { e.preventDefault(); Storage.logout(); window.location.href = 'login.html'; });
    // Cart remove
    document.querySelectorAll('.btn-remove-cart').forEach(btn => {
      btn.addEventListener('click', e => { Storage.removeFromCart(Number(e.currentTarget.dataset.id)); Router.render(); Components.toast('Kurs sepetten çıkarıldı.'); });
    });
    // Search
    this.initSearch('globalSearch', 'searchResults');
    const heroSearch = document.getElementById('heroSearch');
    if (heroSearch) heroSearch.addEventListener('keydown', e => { if (e.key === 'Enter') Router.navigate('/courses?q=' + encodeURIComponent(heroSearch.value)); });
    // Filters
    const applyFilters = document.getElementById('applyFilters');
    if (applyFilters) applyFilters.addEventListener('click', () => {
      const q = new URLSearchParams();
      const cat = document.getElementById('filterCat')?.value; if (cat) q.set('cat', cat);
      const level = document.getElementById('filterLevel')?.value; if (level) q.set('level', level);
      const rating = document.getElementById('filterRating')?.value; if (rating) q.set('rating', rating);
      const min = document.getElementById('filterMinPrice')?.value; if (min) q.set('minPrice', min);
      const max = document.getElementById('filterMaxPrice')?.value; if (max) q.set('maxPrice', max);
      if (document.getElementById('filterLive')?.checked) q.set('live', '1');
      if (document.getElementById('filterCert')?.checked) q.set('cert', '1');
      Router.navigate('/courses?' + q.toString());
    });
    const sortCourses = document.getElementById('sortCourses');
    if (sortCourses) sortCourses.addEventListener('change', e => {
      const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
      params.set('sort', e.target.value);
      Router.navigate('/courses?' + params.toString());
    });
    // Live sessions
    document.querySelectorAll('.btn-join-live').forEach(btn => btn.addEventListener('click', e => Router.navigate('/live/' + e.currentTarget.dataset.id)));
    document.querySelectorAll('.btn-watch-recording').forEach(btn => btn.addEventListener('click', () => Components.toast('Kayıt videosu oynatılıyor...', 'info')));
    // Certificate
    document.querySelectorAll('.btn-download-cert').forEach(btn => btn.addEventListener('click', () => Components.toast('Sertifika PDF indiriliyor...')));
    document.querySelectorAll('.btn-share-linkedin').forEach(btn => btn.addEventListener('click', () => { window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(window.location.href), '_blank'); }));
    const btnVerify = document.getElementById('btnVerifyCert');
    if (btnVerify) btnVerify.addEventListener('click', () => Router.navigate('/sertifika/' + document.getElementById('certVerifyInput').value));
    // Profile
    const profileForm = document.getElementById('profileForm');
    if (profileForm) profileForm.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(profileForm);
      Storage.setProfile(Object.fromEntries(fd));
      Components.toast('Profil güncellendi.');
    });
    // Messages
    const sendMsg = document.getElementById('sendMsg');
    if (sendMsg) sendMsg.addEventListener('click', () => {
      const input = document.getElementById('msgInput');
      if (input?.value) { document.getElementById('chatBody').innerHTML += `<div class="chat-bubble sent">${input.value}</div>`; input.value = ''; Components.toast('Mesaj gönderildi.'); }
    });
    // Ask question
    const askQ = document.getElementById('askQuestion');
    if (askQ) askQ.addEventListener('click', () => {
      const q = prompt('Sorunuzu yazın:');
      if (q) Components.toast('Sorunuz gönderildi. Eğitmen yanıtlayacak.');
    });
    document.querySelectorAll('.helpful-btn').forEach(btn => btn.addEventListener('click', () => Components.toast('Faydalı olarak işaretlendi.')));
    // Invoice
    document.querySelectorAll('.btn-invoice').forEach(btn => btn.addEventListener('click', () => this.showInvoice(btn.dataset.id)));
    // AI Assistant
    this.initAI();
    // Commission
    const commForm = document.getElementById('commissionForm');
    if (commForm) commForm.addEventListener('submit', e => { e.preventDefault(); AKO.commission.platform = Number(document.getElementById('platformComm').value); AKO.commission.instructor = Number(document.getElementById('instructorComm').value); Components.toast('Komisyon ayarları kaydedildi.'); });
    // Withdraw
    const withdrawForm = document.getElementById('withdrawForm');
    if (withdrawForm) withdrawForm.addEventListener('submit', e => { e.preventDefault(); Components.toast('Ödeme talebi oluşturuldu. Durum: Bekliyor'); });
    // AI tools
    document.querySelectorAll('.ai-tool-btn').forEach(btn => btn.addEventListener('click', e => {
      const outputs = { desc: 'Bu kapsamlı eğitim, sıfırdan ileri seviyeye programlama öğretir...', quiz: '1. Python nedir?\nA) Programlama dili ✓\nB) İşletim sistemi', summary: 'Bu bölümde temel kavramlar, değişkenler ve veri tipleri ele alınmaktadır.', seo: 'Sıfırdan Python Eğitimi 2026 | Akıllı Okul' };
      e.currentTarget.nextElementSibling.textContent = outputs[e.currentTarget.dataset.tool] || 'AI içerik oluşturuldu.';
      Components.toast('AI içerik oluşturuldu.');
    }));
    document.querySelectorAll('.ai-gen-desc, .ai-gen-seo').forEach(btn => btn.addEventListener('click', () => Components.toast('AI içerik oluşturuldu.')));
    const publishBtn = document.getElementById('publishCourse');
    if (publishBtn) publishBtn.addEventListener('click', () => { Components.toast('Kurs yayınlandı! 🎉'); Router.navigate('/instructor/courses'); });
    const addSection = document.getElementById('addSection');
    if (addSection) addSection.addEventListener('click', () => Components.toast('Yeni bölüm eklendi.'));
    const newCoupon = document.getElementById('newCoupon');
    if (newCoupon) newCoupon.addEventListener('click', () => Components.toast('Kupon oluşturma formu açıldı.'));
    const addCat = document.getElementById('addCategory');
    if (addCat) addCat.addEventListener('click', () => Components.toast('Kategori ekleme formu açıldı.'));
    this.initIntegrations();
  },

  initSearch(inputId, resultsId) {
    const input = document.getElementById(inputId);
    const results = document.getElementById(resultsId);
    if (!input || !results) return;
    input.addEventListener('input', () => {
      const q = input.value.trim();
      if (q.length < 2) { results.classList.remove('show'); return; }
      const r = AKO.searchAll(q);
      results.innerHTML = [
        ...r.courses.map(c => `<a href="#/course/${c.id}" class="search-result-item"><i class="fa-solid fa-book"></i> ${c.title}</a>`),
        ...r.instructors.map(i => `<a href="#/instructor/${i.id}" class="search-result-item"><i class="fa-solid fa-user"></i> ${i.name} — Eğitmen</a>`),
        ...r.categories.map(c => `<a href="#/courses?cat=${c.id}" class="search-result-item"><i class="fa-solid ${c.icon}"></i> ${c.name} — Kategori</a>`)
      ].join('') || '<div class="search-result-item text-muted">Sonuç bulunamadı</div>';
      results.classList.add('show');
    });
    document.addEventListener('click', e => { if (!input.contains(e.target) && !results.contains(e.target)) results.classList.remove('show'); });
  },

  updateCartBadge() {
    const count = Storage.getCart().length;
    const badge = document.querySelector('#btnCart .badge-count');
    if (badge) badge.textContent = count || '';
    else if (count && document.getElementById('btnCart')) document.getElementById('btnCart').innerHTML = `<i class="fa-solid fa-cart-shopping"></i><span class="badge-count">${count}</span>`;
  },

  initPlayer(params) {
    const courseId = Number(params.id);
    const course = AKO.getCourse(courseId);
    const video = document.getElementById('courseVideo');
    if (!video) return;
    const btnPlay = document.getElementById('btnPlayPause');
    const progressFill = document.getElementById('progressFill');
    const timeDisplay = document.getElementById('timeDisplay');
    const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

    btnPlay?.addEventListener('click', () => { video.paused ? video.play() : video.pause(); btnPlay.querySelector('i').className = video.paused ? 'fa-solid fa-play' : 'fa-solid fa-pause'; });
    document.getElementById('btnRewind10')?.addEventListener('click', () => { video.currentTime = Math.max(0, video.currentTime - 10); });
    document.getElementById('btnForward10')?.addEventListener('click', () => { video.currentTime = Math.min(video.duration || 0, video.currentTime + 10); });
    document.getElementById('speedSelect')?.addEventListener('change', e => { video.playbackRate = Number(e.target.value); });
    document.getElementById('volumeSlider')?.addEventListener('input', e => { video.volume = Number(e.target.value); });
    document.getElementById('btnMute')?.addEventListener('click', () => { video.muted = !video.muted; });
    document.getElementById('btnFullscreen')?.addEventListener('click', () => { document.getElementById('videoContainer')?.requestFullscreen?.(); });
    video.addEventListener('timeupdate', () => { if (video.duration) { progressFill.style.width = (video.currentTime / video.duration * 100) + '%'; timeDisplay.textContent = `${fmt(video.currentTime)} / ${fmt(video.duration)}`; } });
    document.getElementById('progressWrap')?.addEventListener('click', e => { const rect = e.currentTarget.getBoundingClientRect(); video.currentTime = ((e.clientX - rect.left) / rect.width) * video.duration; });
    video.addEventListener('ended', () => {
      const active = document.querySelector('.sidebar-lesson.active');
      if (active) {
        const lessonId = active.dataset.lesson;
        Storage.markLessonComplete(courseId, lessonId);
        active.classList.add('completed');
        active.querySelector('input').checked = true;
        const p = Storage.getProgress(courseId);
        document.querySelector('.progress-bar').style.width = p.percent + '%';
        document.querySelector('.progress-tracker span').textContent = `%${p.percent} tamamlandı · ${p.completed.length} / ${course.curriculum.reduce((s, sec) => s + sec.lessons.length, 0)} ders`;
        if (p.percent >= 100) { Components.toast('Tebrikler! Eğitim tamamlandı. 🎉'); Components.toast('Sertifikan hazır.', 'success'); }
      }
    });
    document.querySelectorAll('.sidebar-lesson').forEach(el => {
      el.addEventListener('click', () => {
        if (el.dataset.type === 'quiz') { Router.navigate('/quiz/' + courseId); return; }
        document.querySelectorAll('.sidebar-lesson').forEach(l => l.classList.remove('active'));
        el.classList.add('active');
        document.getElementById('lessonTitle').textContent = el.querySelector('span').textContent;
        Storage.setLastWatched(courseId, el.dataset.lesson);
        if (el.dataset.type === 'video') { video.currentTime = 0; video.play(); btnPlay.querySelector('i').className = 'fa-solid fa-pause'; }
      });
    });
    document.querySelectorAll('[data-complete]').forEach(cb => {
      cb.addEventListener('change', e => { if (e.target.checked) Storage.markLessonComplete(courseId, e.target.dataset.complete); });
    });
    document.getElementById('saveNotes')?.addEventListener('click', () => Components.toast('Notlar kaydedildi.'));
  },

  initCheckout() {
    const applyCoupon = document.getElementById('applyCoupon');
    if (applyCoupon) applyCoupon.addEventListener('click', () => {
      const code = document.getElementById('couponCode').value.toUpperCase();
      const coupon = AKO.coupons.find(c => c.code === code);
      if (!coupon) { Components.toast('Geçersiz kupon kodu.', 'error'); return; }
      const cart = Storage.getCart();
      const subtotal = cart.reduce((s, c) => s + c.price, 0);
      this.checkoutCoupon = coupon;
      this.checkoutDiscount = coupon.type === 'percent' ? subtotal * coupon.value / 100 : coupon.value;
      document.getElementById('discountRow').style.display = 'flex';
      document.getElementById('discountAmount').textContent = '-₺' + Math.round(this.checkoutDiscount).toLocaleString('tr-TR');
      const total = subtotal - this.checkoutDiscount;
      document.getElementById('totalAmount').textContent = '₺' + Math.round(total).toLocaleString('tr-TR');
      Components.toast(`Kupon uygulandı: %${coupon.value} indirim`);
    });
    document.getElementById('btnPay')?.addEventListener('click', () => {
      const name = document.getElementById('cardName')?.value;
      const num = document.getElementById('cardNumber')?.value;
      if (!name || !num) { Components.toast('Lütfen kart bilgilerini doldurun.', 'error'); return; }
      const cart = Storage.getCart();
      const subtotal = cart.reduce((s, c) => s + c.price, 0);
      const total = subtotal - this.checkoutDiscount;
      cart.forEach(c => Storage.enrollCourse(c.id));
      Storage.addOrder({ id: 'AKO-2026-' + String(Math.floor(Math.random() * 999999)).padStart(6, '0'), courseId: cart[0].id, date: new Date().toISOString().slice(0, 10), amount: Math.round(total), payment: 'Kredi Kartı', status: 'completed' });
      const courseId = cart[0]?.id;
      Storage.setCart([]);
      this.checkoutDiscount = 0;
      Router.navigate('/order-success?courseId=' + courseId);
    });
  },

  initQuiz(params) {
    const courseId = Number(params.courseId);
    const quiz = AKO.quizzes[courseId] || AKO.quizzes[1];
    this.quizState = { current: 0, answers: {}, quiz };
    this.renderQuizQuestion();
    document.getElementById('quizPrev')?.addEventListener('click', () => { if (this.quizState.current > 0) { this.quizState.current--; this.renderQuizQuestion(); } });
    document.getElementById('quizNext')?.addEventListener('click', () => {
      if (this.quizState.current < quiz.questions.length - 1) { this.quizState.current++; this.renderQuizQuestion(); }
    });
    document.getElementById('quizFinish')?.addEventListener('click', () => this.finishQuiz(courseId));
  },

  renderQuizQuestion() {
    const { current, quiz, answers } = this.quizState;
    const q = quiz.questions[current];
    const container = document.getElementById('quizContainer');
    const pct = ((current + 1) / quiz.questions.length * 100);
    document.getElementById('quizProgressBar').style.width = pct + '%';
    document.getElementById('quizProgressText').textContent = `Soru ${current + 1} / ${quiz.questions.length}`;
    document.getElementById('quizPrev').disabled = current === 0;
    document.getElementById('quizNext').classList.toggle('d-none', current === quiz.questions.length - 1);
    document.getElementById('quizFinish').classList.toggle('d-none', current !== quiz.questions.length - 1);
    let html = `<div class="quiz-question"><h4>${q.question}</h4>`;
    if (q.type === 'single' || q.type === 'multiple') {
      html += q.options.map((o, i) => `<label class="quiz-option"><input type="${q.type === 'multiple' ? 'checkbox' : 'radio'}" name="q${q.id}" value="${i}" ${answers[q.id]?.includes?.(i) || answers[q.id] === i ? 'checked' : ''}> ${o}</label>`).join('');
    } else if (q.type === 'boolean') {
      html += `<label class="quiz-option"><input type="radio" name="q${q.id}" value="true"> Doğru</label><label class="quiz-option"><input type="radio" name="q${q.id}" value="false"> Yanlış</label>`;
    } else {
      html += `<textarea class="form-control" rows="3" id="openAnswer">${answers[q.id] || ''}</textarea>`;
    }
    html += '</div>';
    container.innerHTML = html;
    container.querySelectorAll('input').forEach(inp => inp.addEventListener('change', () => this.saveQuizAnswer(q)));
    const openAns = document.getElementById('openAnswer');
    if (openAns) openAns.addEventListener('input', () => { answers[q.id] = openAns.value; });
  },

  saveQuizAnswer(q) {
    if (q.type === 'multiple') {
      this.quizState.answers[q.id] = [...document.querySelectorAll(`input[name="q${q.id}"]:checked`)].map(i => Number(i.value));
    } else if (q.type === 'boolean') {
      const checked = document.querySelector(`input[name="q${q.id}"]:checked`);
      this.quizState.answers[q.id] = checked?.value === 'true';
    } else {
      const checked = document.querySelector(`input[name="q${q.id}"]:checked`);
      this.quizState.answers[q.id] = checked ? Number(checked.value) : null;
    }
  },

  finishQuiz(courseId) {
    const { quiz, answers } = this.quizState;
    let correct = 0;
    quiz.questions.forEach(q => {
      const a = answers[q.id];
      if (q.type === 'multiple') { if (JSON.stringify(a?.sort()) === JSON.stringify(q.correct.sort())) correct++; }
      else if (q.type === 'boolean') { if (a === q.correct) correct++; }
      else { if (a === q.correct) correct++; }
    });
    const pct = Math.round(correct / quiz.questions.length * 100);
    Storage.setQuizResult(courseId, { correct, total: quiz.questions.length, percent: pct });
    document.getElementById('quizContainer').classList.add('d-none');
    document.querySelector('.quiz-nav').classList.add('d-none');
    const result = document.getElementById('quizResult');
    result.classList.remove('d-none');
    result.innerHTML = `<div class="quiz-result-card"><h2>${correct} / ${quiz.questions.length}</h2><p class="fs-3">%${pct} Başarı</p><button class="btn btn-primary" onclick="Router.navigate('/player/${courseId}')">Derse Dön</button></div>`;
    Components.toast(`Quiz tamamlandı: %${pct} başarı`);
  },

  initWizard() {
    document.getElementById('wizardNext')?.addEventListener('click', () => { if (this.wizardStep < 6) { this.wizardStep++; this.updateWizard(); } });
    document.getElementById('wizardPrev')?.addEventListener('click', () => { if (this.wizardStep > 1) { this.wizardStep--; this.updateWizard(); } });
    document.getElementById('coverUpload')?.addEventListener('click', () => document.querySelector('#coverUpload input')?.click());
  },

  updateWizard() {
    document.querySelectorAll('.wizard-step').forEach(s => s.classList.toggle('active', Number(s.dataset.step) === this.wizardStep));
    document.querySelectorAll('.wizard-panel').forEach(p => p.classList.toggle('active', Number(p.dataset.panel) === this.wizardStep));
    document.getElementById('wizardPrev').disabled = this.wizardStep === 1;
    document.getElementById('wizardNext').textContent = this.wizardStep === 6 ? 'Tamamla' : 'İleri';
  },

  initLiveRoom() {
    document.getElementById('leaveLive')?.addEventListener('click', () => { Components.toast('Canlı dersten ayrıldınız.'); Router.navigate('/live-sessions'); });
    document.getElementById('openChat')?.addEventListener('click', () => document.getElementById('liveChatDrawer')?.classList.add('open'));
    document.getElementById('closeChatDrawer')?.addEventListener('click', () => document.getElementById('liveChatDrawer')?.classList.remove('open'));
    document.getElementById('sendLiveChat')?.addEventListener('click', () => {
      const input = document.getElementById('liveChatInput');
      if (input?.value) { document.querySelector('.chat-messages').innerHTML += `<div class="chat-msg"><strong>Siz:</strong> ${input.value}</div>`; input.value = ''; }
    });
    ['toggleMic', 'toggleCam', 'raiseHand', 'shareScreen', 'liveFullscreen'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', () => Components.toast(id.replace(/([A-Z])/g, ' $1').trim() + ' toggled', 'info'));
    });
  },

  initAI() {
    document.getElementById('aiFab')?.addEventListener('click', () => document.getElementById('aiPanel')?.classList.toggle('open'));
    document.getElementById('aiClose')?.addEventListener('click', () => document.getElementById('aiPanel')?.classList.remove('open'));
    document.querySelectorAll('.ai-action-btn').forEach(btn => btn.addEventListener('click', e => {
      const responses = { summarize: 'Bu ders, temel programlama kavramlarını kapsar...', quiz: '1. Değişken nedir?\n2. Veri tipleri nelerdir?', schedule: 'Pazartesi: 2 saat video\nSalı: Quiz\nÇarşamba: Proje', explain: 'Değişkenler, verileri saklamak için kullanılan isimlendirilmiş alanlardır.', notes: '• Değişkenler\n• Veri tipleri\n• Operatörler' };
      document.getElementById('aiResponse').textContent = responses[e.currentTarget.dataset.action] || 'Yanıt hazırlanıyor...';
    }));
  },

  initAdminCharts() {
    if (typeof Chart === 'undefined') return;
    const s = AKO.adminStats;
    this.createChart('dailySalesChart', 'line', ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'], [{ label: 'Günlük Satış', data: s.dailySales, borderColor: '#2563EB', fill: true, backgroundColor: '#2563EB22' }]);
    this.createChart('categoryChart', 'doughnut', AKO.categories.slice(0, 8).map(c => c.name), [{ data: s.categoryDistribution, backgroundColor: ['#2563EB','#7C3AED','#0891B2','#EA580C','#DB2777','#059669','#CA8A04','#4F46E5'] }]);
    this.createChart('newUsersChart', 'bar', ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'], [{ label: 'Yeni Kullanıcı', data: s.newUsers, backgroundColor: '#06B6D4' }]);
    this.createChart('completionChart', 'bar', AKO.courses.slice(0, 10).map(c => c.title.slice(0, 15) + '...'), [{ label: 'Tamamlanma %', data: s.completionRates, backgroundColor: '#16A34A' }]);
  },

  initInstructorCharts() {
    if (typeof Chart === 'undefined') return;
    const e = AKO.instructorEarnings;
    this.createChart('earningsChart', 'line', ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'], [{ label: 'Kazanç', data: e.monthly, borderColor: '#2563EB', fill: true, backgroundColor: '#2563EB22' }]);
    this.createChart('monthlyEarningsChart', 'bar', ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'], [{ label: 'Aylık Kazanç', data: e.monthly, backgroundColor: '#2563EB' }]);
  },

  createChart(id, type, labels, datasets) {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    if (canvas._chart) canvas._chart.destroy();
    canvas._chart = new Chart(canvas, { type, data: { labels, datasets }, options: { responsive: true, plugins: { legend: { display: type !== 'bar' || datasets.length > 1 } } } });
  },

  showInvoice(orderId) {
    const order = AKO.orders.find(o => o.id === orderId) || Storage.getOrders().find(o => o.id === orderId);
    const course = order ? AKO.getCourse(order.courseId) : null;
    const html = Components.modal('invoiceModal', 'Fatura — ' + (orderId || ''), `
      <div class="invoice-print" id="invoicePrint"><div class="text-center mb-4"><img src="assets/images/logo.svg" height="40"><h4>FATURA</h4></div>
      <p><strong>Sipariş No:</strong> ${order?.id || orderId}</p><p><strong>Tarih:</strong> ${order?.date || new Date().toISOString().slice(0,10)}</p>
      <p><strong>Müşteri:</strong> ${order?.student || Storage.getUser()?.name}</p><hr>
      <p><strong>Kurs:</strong> ${course?.title || '—'}</p><p><strong>Tutar:</strong> ₺${order?.amount || 0}</p><p><strong>KDV:</strong> Dahil</p></div>`, '<button class="btn btn-primary" onclick="window.print()">Yazdır</button>');
    document.body.insertAdjacentHTML('beforeend', html);
    new bootstrap.Modal(document.getElementById('invoiceModal')).show();
    document.getElementById('invoiceModal').addEventListener('hidden.bs.modal', () => document.getElementById('invoiceModal').remove());
  },

  initIntegrations() {
    const form = document.getElementById('zoomForm');
    if (!form) return;
    const collect = () => ({
      enabled: document.getElementById('zoomEnabled')?.checked || false,
      accountId: document.getElementById('zoomAccountId')?.value.trim() || '',
      clientId: document.getElementById('zoomClientId')?.value.trim() || '',
      clientSecret: document.getElementById('zoomClientSecret')?.value || '',
      sdkKey: document.getElementById('zoomSdkKey')?.value.trim() || '',
      sdkSecret: document.getElementById('zoomSdkSecret')?.value || '',
      webhookUrl: document.getElementById('zoomWebhook')?.value.trim() || '',
      meetingSdk: document.getElementById('zoomMeetingSdk')?.checked || false,
      oauthConnected: Storage.getZoomSettings().oauthConnected
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      Storage.setZoomSettings(collect());
      Components.toast('Zoom ayarları kaydedildi.');
    });
    document.getElementById('btnZoomOAuth')?.addEventListener('click', () => {
      const s = collect();
      if (!s.clientId) { Components.toast('Önce OAuth Client ID girin.', 'error'); return; }
      s.oauthConnected = true;
      s.enabled = true;
      Storage.setZoomSettings(s);
      const badge = document.getElementById('zoomStatusBadge');
      if (badge) { badge.textContent = 'Bağlı'; badge.className = 'integration-status on'; }
      Components.toast('Zoom OAuth bağlantısı simüle edildi.');
    });
    document.getElementById('btnZoomTest')?.addEventListener('click', () => {
      const s = Storage.getZoomSettings();
      if (!s.oauthConnected && !s.clientId) { Components.toast('Önce Zoom OAuth bağlayın.', 'error'); return; }
      Components.toast('Test toplantısı oluşturuldu. Meeting ID: 847-293-116');
      Router.navigate('/live/1');
    });
    document.getElementById('btnZoomDisconnect')?.addEventListener('click', () => {
      const s = collect();
      s.oauthConnected = false;
      s.enabled = false;
      Storage.setZoomSettings(s);
      const badge = document.getElementById('zoomStatusBadge');
      if (badge) { badge.textContent = 'Bağlı değil'; badge.className = 'integration-status off'; }
      Components.toast('Zoom bağlantısı kesildi.', 'info');
    });
    document.getElementById('saveIyzico')?.addEventListener('click', () => Components.toast('iyzico ayarı kaydedildi (demo).'));
    document.getElementById('savePaytr')?.addEventListener('click', () => Components.toast('PayTR ayarı kaydedildi (demo).'));
    document.getElementById('saveStripe')?.addEventListener('click', () => Components.toast('Stripe ayarı kaydedildi (demo).'));
  },

  initPromoStrip() {
    const strip = document.getElementById('promoStrip');
    if (!strip) return;
    const slides = [...strip.querySelectorAll('.promo-slide')];
    const dots = [...strip.querySelectorAll('.promo-dot')];
    if (slides.length < 2) return;
    let idx = 0;
    if (this._promoTimer) clearInterval(this._promoTimer);
    const show = i => {
      idx = (i + slides.length) % slides.length;
      slides.forEach((s, n) => s.classList.toggle('active', n === idx));
      dots.forEach((d, n) => d.classList.toggle('active', n === idx));
    };
    dots.forEach(d => d.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      show(Number(d.dataset.promoDot));
    }));
    this._promoTimer = setInterval(() => show(idx + 1), 4500);
  },

  initSkeleton() {
    document.querySelectorAll('.course-grid.skeleton-loading').forEach(grid => {
      grid.innerHTML = Array(4).fill(Components.courseCardSkeleton()).join('');
      setTimeout(() => Router.render(), 800);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
