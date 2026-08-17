/* Akıllı Okul — All Views */
const Views = {
  layout(content, opts = {}) {
    const role = Storage.getRole() || 'student';
    const showSidebar = opts.sidebar;
    return `${Components.navbar()}${showSidebar ? `<div class="panel-layout">${Components.sidebar(role, opts.active)}<main class="panel-main">${content}</main></div>` : content}${Components.footer()}${Components.mobileNav()}${Components.cartDrawer()}${Components.notifDrawer()}${Components.aiAssistant()}`;
  },

  notFound() {
    return this.layout(`<div class="error-page"><div class="error-code">404</div><h1>Sayfa Bulunamadı</h1><p>Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p><a href="#/" class="btn btn-primary">Ana Sayfaya Dön</a></div>`);
  },

  forbidden() {
    return this.layout(`<div class="error-page"><div class="error-code">403</div><h1>Erişim Engellendi</h1><p>Bu sayfaya erişim yetkiniz bulunmuyor.</p><a href="#/" class="btn btn-primary">Ana Sayfaya Dön</a></div>`);
  },

  error(msg) {
    return this.layout(`<div class="error-page"><div class="error-code">!</div><h1>Bir sorun oluştu</h1><p>${msg || 'Sayfa görüntülenemedi.'}</p><div class="d-flex gap-2 justify-content-center flex-wrap"><a href="#/" class="btn btn-primary">Ana Sayfaya Dön</a><button class="btn btn-outline-primary" onclick="location.reload()">Yeniden Dene</button></div></div>`);
  },

  home() {
    const courses = AKO.courses.slice(0, 8);
    const enrolled = Storage.getEnrolled();
    const recommended = AKO.courses.filter(c => !enrolled.includes(c.id)).slice(0, 3);
    return this.layout(`
      <div class="promo-strip" id="promoStrip">
        ${AKO.campaigns.filter(c => c.active).map((c, i) => `<a href="#/courses${c.category ? '?cat=' + c.category : ''}" class="promo-slide ${i === 0 ? 'active' : ''}" style="background:${c.banner}" data-promo="${i}">
          <span class="promo-kicker">Kampanya</span>
          <strong>${c.title}</strong>
          <span class="promo-desc">— ${c.desc}</span>
          <span class="promo-cta">Keşfet <i class="fa-solid fa-arrow-right"></i></span>
        </a>`).join('')}
        <div class="promo-dots">${AKO.campaigns.filter(c => c.active).map((_, i) => `<button type="button" class="promo-dot ${i === 0 ? 'active' : ''}" data-promo-dot="${i}" aria-label="Kampanya ${i + 1}"></button>`).join('')}</div>
      </div>
      <section class="hero-section">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <span class="hero-badge">Öğrenmenin Yeni Nesli</span>
              <h1 class="hero-title">Geleceğin İçin<br><span class="text-gradient">Bugün Öğren</span></h1>
              <p class="hero-desc">Teknoloji, yazılım, tasarım, iş dünyası, yabancı dil ve daha yüzlerce alanda uzman eğitmenlerden online eğitimler.</p>
              <div class="hero-search">
                <i class="fa-solid fa-search"></i>
                <input type="text" id="heroSearch" placeholder="Ne öğrenmek istiyorsun?">
                <button class="btn btn-primary" onclick="document.getElementById('heroSearch').dispatchEvent(new Event('keydown',{key:'Enter'}))">Ara</button>
              </div>
              <div class="popular-tags">${AKO.popularSearches.map(s => `<a href="#/courses?q=${encodeURIComponent(s)}" class="tag">${s}</a>`).join('')}</div>
              <div class="hero-cta mt-4">
                <a href="#/courses" class="btn btn-primary btn-lg">Kursları Keşfet</a>
                <a href="#/become-instructor" class="btn btn-outline-primary btn-lg">Eğitmen Ol</a>
              </div>
            </div>
            <div class="col-lg-6 d-none d-lg-block">
              <div class="hero-visual">
                <div class="hero-card hero-card-1"><i class="fa-solid fa-play-circle"></i><span>216 Video Ders</span></div>
                <div class="hero-card hero-card-2"><i class="fa-solid fa-certificate"></i><span>Sertifikalı</span></div>
                <div class="hero-card hero-card-3"><i class="fa-solid fa-video"></i><span>Canlı Ders</span></div>
                <div class="hero-mockup"><img src="https://picsum.photos/seed/akillokul/600/400" alt="Platform" class="rounded-4 shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section-categories py-5">
        <div class="container"><h2 class="section-title">Popüler Kategoriler</h2>
          <div class="category-grid">${AKO.categories.map(c => `<a href="#/courses?cat=${c.id}" class="category-card" style="--cat-color:${c.color}"><div class="cat-icon"><i class="fa-solid ${c.icon}"></i></div><span>${c.name}</span></a>`).join('')}</div>
        </div>
      </section>
      <section class="section-courses py-5 bg-light-subtle">
        <div class="container"><div class="d-flex justify-content-between align-items-center mb-4"><h2 class="section-title mb-0">En Popüler Kurslar</h2><a href="#/courses" class="btn btn-link">Tümünü Gör →</a></div>
          <div class="course-grid" id="homeCourses">${courses.map(c => Components.courseCard(c)).join('')}</div>
        </div>
      </section>
      ${recommended.length ? `<section class="section-ai py-5"><div class="container"><h2 class="section-title"><i class="fa-solid fa-wand-magic-sparkles text-primary"></i> Sana Özel</h2>
        <div class="ai-recommend">${recommended.map(c => `<div class="ai-rec-card"><p>Python eğitimini tamamladığın için <strong>${c.title}</strong> eğitimini öneriyoruz.</p><a href="#/course/${c.id}" class="btn btn-sm btn-primary">İncele</a></div>`).join('')}</div></div></section>` : ''}
      <section class="section-stats py-5"><div class="container"><div class="stats-row">
        <div class="stat-item"><strong>30+</strong><span>Online Kurs</span></div>
        <div class="stat-item"><strong>10</strong><span>Uzman Eğitmen</span></div>
        <div class="stat-item"><strong>100K+</strong><span>Öğrenci</span></div>
        <div class="stat-item"><strong>4.8</strong><span>Ortalama Puan</span></div>
      </div></div></section>
    `);
  },

  courses(params) {
    let filtered = [...AKO.courses];
    const q = params.q || Router.currentParams.q;
    const cat = params.cat || Router.currentParams.cat;
    const sort = params.sort || Router.currentParams.sort || 'popular';
    const level = params.level || Router.currentParams.level;
    const minPrice = params.minPrice || Router.currentParams.minPrice;
    const maxPrice = params.maxPrice || Router.currentParams.maxPrice;
    const rating = params.rating || Router.currentParams.rating;
    const hasLive = params.live || Router.currentParams.live;
    const hasCert = params.cert || Router.currentParams.cert;

    if (q) filtered = filtered.filter(c => c.title.toLowerCase().includes(q.toLowerCase()) || AKO.getInstructor(c.instructorId).name.toLowerCase().includes(q.toLowerCase()));
    if (cat) filtered = filtered.filter(c => c.category === cat);
    if (level) filtered = filtered.filter(c => c.level === level);
    if (minPrice) filtered = filtered.filter(c => c.price >= Number(minPrice));
    if (maxPrice) filtered = filtered.filter(c => c.price <= Number(maxPrice));
    if (rating) filtered = filtered.filter(c => c.rating >= Number(rating));
    if (hasLive) filtered = filtered.filter(c => c.hasLive);
    if (hasCert) filtered = filtered.filter(c => c.hasCert);

    const sorters = { popular: (a, b) => b.students - a.students, newest: (a, b) => b.id - a.id, bestseller: (a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0), rating: (a, b) => b.rating - a.rating, 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price };
    filtered.sort(sorters[sort] || sorters.popular);

    const levels = [...new Set(AKO.courses.map(c => c.level))];
    return this.layout(`
      <div class="courses-page py-4"><div class="container">
        <h1 class="page-title">${cat ? AKO.getCategory(cat)?.name || 'Kurslar' : q ? `"${q}" Arama Sonuçları` : 'Tüm Kurslar'}</h1>
        <p class="text-muted">${filtered.length} kurs bulundu</p>
        <div class="row g-4">
          <div class="col-lg-3"><div class="filter-panel">
            <h5>Filtreler</h5>
            <div class="filter-group"><label>Kategori</label><select id="filterCat" class="form-select form-select-sm"><option value="">Tümü</option>${AKO.categories.map(c => `<option value="${c.id}" ${cat === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}</select></div>
            <div class="filter-group"><label>Seviye</label><select id="filterLevel" class="form-select form-select-sm"><option value="">Tümü</option>${levels.map(l => `<option value="${l}" ${level === l ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
            <div class="filter-group"><label>Min Rating</label><select id="filterRating" class="form-select form-select-sm"><option value="">Tümü</option>${[4.5, 4.0, 3.5].map(r => `<option value="${r}" ${rating == r ? 'selected' : ''}>${r}+ ⭐</option>`).join('')}</select></div>
            <div class="filter-group"><label>Fiyat Aralığı</label><div class="d-flex gap-2"><input type="number" id="filterMinPrice" class="form-control form-control-sm" placeholder="Min" value="${minPrice || ''}"><input type="number" id="filterMaxPrice" class="form-control form-control-sm" placeholder="Max" value="${maxPrice || ''}"></div></div>
            <div class="filter-group"><label class="d-flex align-items-center gap-2"><input type="checkbox" id="filterLive" ${hasLive ? 'checked' : ''}> Canlı Eğitim</label></div>
            <div class="filter-group"><label class="d-flex align-items-center gap-2"><input type="checkbox" id="filterCert" ${hasCert ? 'checked' : ''}> Sertifikalı</label></div>
            <button class="btn btn-primary btn-sm w-100" id="applyFilters">Filtrele</button>
          </div></div>
          <div class="col-lg-9">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div></div>
              <select id="sortCourses" class="form-select form-select-sm w-auto"><option value="popular" ${sort === 'popular' ? 'selected' : ''}>En Popüler</option><option value="newest" ${sort === 'newest' ? 'selected' : ''}>En Yeni</option><option value="bestseller" ${sort === 'bestseller' ? 'selected' : ''}>En Çok Satan</option><option value="rating" ${sort === 'rating' ? 'selected' : ''}>En Yüksek Puan</option><option value="price-asc" ${sort === 'price-asc' ? 'selected' : ''}>Fiyat Artan</option><option value="price-desc" ${sort === 'price-desc' ? 'selected' : ''}>Fiyat Azalan</option></select>
            </div>
            <div class="course-grid">${filtered.length ? filtered.map(c => Components.courseCard(c)).join('') : '<p class="text-muted">Kurs bulunamadı.</p>'}</div>
          </div>
        </div>
      </div></div>
    `);
  },

  courseDetail(params) {
    const course = AKO.getCourse(params.id);
    if (!course) return this.notFound();
    const inst = AKO.getInstructor(course.instructorId);
    const reviews = AKO.getCourseReviews(course.id);
    const qa = AKO.getCourseQA(course.id);
    const isFav = Storage.isFavorite(course.id);
    const isEnrolled = Storage.isEnrolled(course.id);
    const dist = course.ratingDistribution;
    return this.layout(`
      <div class="course-detail-page">
        <div class="course-hero" style="background:linear-gradient(135deg,#${course.color}22,#2563EB11)">
          <div class="container py-5"><div class="row">
            <div class="col-lg-8">
              <nav class="breadcrumb-nav"><a href="#/">Ana Sayfa</a> / <a href="#/courses?cat=${course.category}">${AKO.getCategory(course.category)?.name}</a> / ${course.title}</nav>
              <h1>${course.title}</h1>
              <p class="lead">${course.subtitle}</p>
              <div class="course-meta-row">
                <span class="rating-num">${course.rating} ⭐</span>
                <span>(${course.reviewCount.toLocaleString('tr-TR')} değerlendirme)</span>
                <span>${course.students.toLocaleString('tr-TR')} öğrenci</span>
              </div>
              <p>Eğitmen: <a href="#/instructor/${inst.id}">${inst.name}</a> · Son güncelleme: ${course.updated} · Dil: ${course.lang}</p>
            </div>
          </div></div>
        </div>
        <div class="container py-4"><div class="row g-4">
          <div class="col-lg-8">
            <div class="content-section"><h3>Bu Eğitim Hakkında</h3><p>${course.description}</p></div>
            <div class="content-section"><h3>Bu eğitim şunları içerir:</h3>
              <ul class="includes-list"><li><i class="fa-solid fa-play"></i> ${course.includes.videos} saat video</li><li><i class="fa-solid fa-file-pdf"></i> ${course.includes.pdfs} PDF</li><li><i class="fa-solid fa-question"></i> ${course.includes.quizzes} Quiz</li><li><i class="fa-solid fa-code"></i> ${course.includes.projects} Proje</li><li><i class="fa-solid fa-infinity"></i> Ömür boyu erişim</li><li><i class="fa-solid fa-mobile"></i> Mobil erişim</li>${course.hasCert ? '<li><i class="fa-solid fa-certificate"></i> Sertifika</li>' : ''}</ul>
            </div>
            <div class="content-section"><h3>Kurs İçeriği</h3>
              <div class="curriculum-accordion accordion">${course.curriculum.map((sec, si) => `
                <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button ${si ? 'collapsed' : ''}" data-bs-toggle="collapse" data-bs-target="#sec${si}">${sec.title} <span class="ms-auto text-muted small">${sec.lessons.length} ders</span></button></h2>
                <div id="sec${si}" class="accordion-collapse collapse ${si ? '' : 'show'}"><div class="accordion-body p-0">
                  ${sec.lessons.map(l => `<div class="lesson-row"><i class="fa-solid fa-${l.type === 'video' ? 'play-circle' : l.type === 'pdf' ? 'file-pdf' : l.type === 'quiz' ? 'question-circle' : 'file'}"></i><span>${l.title}</span><span class="lesson-duration">${l.duration}</span>${l.preview ? '<span class="badge-preview">Preview</span>' : ''}</div>`).join('')}
                </div></div></div>`).join('')}
            </div></div>
            <div class="content-section"><h3>Eğitmen</h3><div class="instructor-mini"><div class="avatar-lg">${inst.avatar}</div><div><h4><a href="#/instructor/${inst.id}">${inst.name}</a></h4><p>${inst.title}</p><p>${inst.bio}</p></div></div></div>
            <div class="content-section"><h3>Değerlendirmeler</h3>
              <div class="rating-overview"><div class="rating-big">${course.rating}</div><div class="rating-bars">${[5,4,3,2,1].map(star => `<div class="rating-bar-row"><span>${star} ⭐</span><div class="bar"><div class="fill" style="width:${dist[star]}%"></div></div><span>${dist[star]}%</span></div>`).join('')}</div></div>
              ${reviews.slice(0, 5).map(r => `<div class="review-item"><div class="review-header"><strong>${r.student}</strong><span>${'★'.repeat(r.rating)}</span><small>${r.date}</small></div><p>${r.text}</p></div>`).join('')}
            </div>
            <div class="content-section"><h3>Soru & Cevap</h3>
              ${qa.map(q => `<div class="qa-item"><strong>${q.student}:</strong> ${q.question}<div class="qa-answer"><i class="fa-solid fa-reply"></i> ${q.answer} <button class="btn btn-sm btn-link helpful-btn" data-id="${q.id}">Faydalı (${q.helpful})</button></div></div>`).join('')}
              <button class="btn btn-outline-primary btn-sm mt-2" id="askQuestion">Soru Sor</button>
            </div>
          </div>
          <div class="col-lg-4"><div class="purchase-card sticky-top">
            <div class="purchase-video"><img src="${course.image}" alt="${course.title}"><div class="play-overlay"><i class="fa-solid fa-play"></i></div></div>
            <div class="purchase-body">
              <div class="purchase-price"><span class="price-current">₺${course.price.toLocaleString('tr-TR')}</span><span class="price-old">₺${course.oldPrice.toLocaleString('tr-TR')}</span><span class="price-discount">%${course.discount} İndirim</span></div>
              ${isEnrolled ? `<a href="#/player/${course.id}" class="btn btn-primary w-100 mb-2">Eğitime Devam Et</a>` : `<button class="btn btn-primary w-100 mb-2 btn-add-cart" data-cart="${course.id}">Sepete Ekle</button><button class="btn btn-accent w-100 mb-2 btn-buy-now" data-buy="${course.id}">Hemen Satın Al</button>`}
              <button class="btn btn-outline-secondary w-100 btn-fav-toggle ${isFav ? 'active' : ''}" data-fav="${course.id}"><i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i> Favorilere Ekle</button>
            </div>
          </div></div>
        </div></div>
      </div>
    `);
  },

  player(params) {
    const course = AKO.getCourse(params.id);
    if (!course) return this.notFound();
    if (!Storage.isEnrolled(course.id) && Storage.getRole() !== 'admin') {
      Components.toast('Bu kursa erişim için satın almanız gerekiyor.', 'error');
      Router.navigate('/course/' + course.id);
      return '';
    }
    const progress = Storage.getProgress(course.id);
    const lastWatched = Storage.getLastWatched()[course.id];
    let currentLesson = course.curriculum[0].lessons[0];
    if (lastWatched) {
      for (const sec of course.curriculum) {
        const found = sec.lessons.find(l => l.id === lastWatched.lessonId);
        if (found) { currentLesson = found; break; }
      }
    }
    const totalLessons = course.curriculum.reduce((s, sec) => s + sec.lessons.length, 0);
    return `<div class="player-page">
      ${Components.navbar(false)}
      <div class="player-layout">
        <div class="player-main">
          <div class="video-container" id="videoContainer">
            <div class="video-player-wrap">
              <video id="courseVideo" poster="${course.image}" controlsList="nodownload">
                <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4">
              </video>
              <div class="custom-controls" id="customControls">
                <div class="progress-bar-wrap" id="progressWrap"><div class="progress-bar-fill" id="progressFill"></div></div>
                <div class="controls-row">
                  <button id="btnPlayPause"><i class="fa-solid fa-play"></i></button>
                  <button id="btnRewind10" title="10 sn geri"><i class="fa-solid fa-rotate-left"></i> 10</button>
                  <button id="btnForward10" title="10 sn ileri"><i class="fa-solid fa-rotate-right"></i> 10</button>
                  <div class="volume-wrap"><button id="btnMute"><i class="fa-solid fa-volume-high"></i></button><input type="range" id="volumeSlider" min="0" max="1" step="0.1" value="1"></div>
                  <span class="time-display" id="timeDisplay">0:00 / 0:00</span>
                  <select id="speedSelect" class="control-select"><option value="0.75">0.75x</option><option value="1" selected>1x</option><option value="1.25">1.25x</option><option value="1.5">1.5x</option><option value="1.75">1.75x</option><option value="2">2x</option></select>
                  <select id="qualitySelect" class="control-select"><option>1080p</option><option>720p</option><option>480p</option><option>360p</option></select>
                  <select id="subtitleSelect" class="control-select"><option value="">Altyazı Yok</option><option value="tr">Türkçe</option><option value="en">English</option></select>
                  <button id="btnFullscreen"><i class="fa-solid fa-expand"></i></button>
                </div>
              </div>
            </div>
          </div>
          <div class="player-info"><h2 id="lessonTitle">${currentLesson.title}</h2>
            <div class="progress-tracker"><div class="progress"><div class="progress-bar bg-success" style="width:${progress.percent}%"></div></div>
            <span>%${progress.percent} tamamlandı · ${progress.completed.length} / ${totalLessons} ders</span></div>
          </div>
          <ul class="player-tabs nav nav-tabs" role="tablist">
            <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tabOverview">Genel Bakış</button></li>
            <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabNotes">Ders Notları</button></li>
            <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabQA">Soru & Cevap</button></li>
            <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabResources">Kaynaklar</button></li>
            <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabAnnounce">Duyurular</button></li>
            <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabComments">Yorumlar</button></li>
          </ul>
          <div class="tab-content player-tab-content">
            <div class="tab-pane fade show active" id="tabOverview"><p>${course.description}</p></div>
            <div class="tab-pane fade" id="tabNotes"><textarea class="form-control" rows="6" placeholder="Notlarınızı buraya yazın..." id="lessonNotes"></textarea><button class="btn btn-primary btn-sm mt-2" id="saveNotes">Kaydet</button></div>
            <div class="tab-pane fade" id="tabQA">${AKO.getCourseQA(course.id).map(q => `<div class="qa-item"><strong>Q:</strong> ${q.question}<br><strong>A:</strong> ${q.answer}</div>`).join('')}</div>
            <div class="tab-pane fade" id="tabResources"><ul><li><a href="#"><i class="fa-solid fa-download"></i> Ders Kaynakları.zip</a></li><li><a href="#"><i class="fa-solid fa-file-pdf"></i> Ders Notları.pdf</a></li></ul></div>
            <div class="tab-pane fade" id="tabAnnounce"><p class="text-muted">Henüz duyuru yok.</p></div>
            <div class="tab-pane fade" id="tabComments">${AKO.getCourseReviews(course.id).slice(0,3).map(r => `<div class="review-item"><strong>${r.student}</strong> ${'★'.repeat(r.rating)}<p>${r.text}</p></div>`).join('')}</div>
          </div>
        </div>
        <aside class="player-sidebar" id="playerSidebar">
          <div class="sidebar-header"><h5>${course.title}</h5><button id="toggleSidebar" class="d-lg-none"><i class="fa-solid fa-times"></i></button></div>
          <div class="sidebar-content">${course.curriculum.map(sec => `<div class="sidebar-section"><div class="sidebar-sec-title">${sec.title}</div>
            ${sec.lessons.map(l => `<div class="sidebar-lesson ${progress.completed.includes(l.id) ? 'completed' : ''} ${l.id === currentLesson.id ? 'active' : ''}" data-lesson="${l.id}" data-type="${l.type}">
              <input type="checkbox" ${progress.completed.includes(l.id) ? 'checked' : ''} data-complete="${l.id}">
              <i class="fa-solid fa-${l.type === 'video' ? 'play' : l.type === 'pdf' ? 'file-pdf' : l.type === 'quiz' ? 'question' : 'file'}"></i>
              <span>${l.title}</span><small>${l.duration}</small>
            </div>`).join('')}</div>`).join('')}
          </div>
        </aside>
      </div>
      ${Components.aiAssistant()}
    </div>`;
  },

  dashboard() {
    if (!Storage.getUser()) { window.location.href = 'login.html'; return ''; }
    const enrolled = Storage.getEnrolled();
    const courses = enrolled.map(id => AKO.getCourse(id)).filter(Boolean);
    const inProgress = courses.filter(c => { const p = Storage.getProgress(c.id); return p.percent > 0 && p.percent < 100; });
    const completed = courses.filter(c => Storage.getProgress(c.id).percent >= 100);
    const favs = Storage.getFavorites().length;
    const user = Storage.getUser();
    const lastWatched = Storage.getLastWatched();
    const continueCourses = Object.keys(lastWatched).map(cid => AKO.getCourse(Number(cid))).filter(Boolean).slice(0, 3);
    return this.layout(`
      <div class="dashboard-page"><div class="container py-4">
        <h1>Tekrar Hoş Geldin 👋 <span class="text-muted fs-5">${user.name}</span></h1>
        <div class="kpi-grid mt-4">${Components.kpiCard('Devam Eden', inProgress.length, 'fa-play', 'orange')}${Components.kpiCard('Tamamlanan', completed.length, 'fa-check-circle', 'green')}${Components.kpiCard('Sertifikalar', AKO.certificates.filter(c => c.student === user.name).length || 2, 'fa-certificate', 'primary')}${Components.kpiCard('Favoriler', favs, 'fa-heart', 'pink')}</div>
        ${continueCourses.length ? `<section class="mt-5"><h3>Öğrenmeye Devam Et</h3><div class="course-grid">${continueCourses.map(c => Components.courseCard(c)).join('')}</div></section>` : ''}
        <section class="mt-5"><h3>Kurslarım</h3><div class="course-grid">${courses.length ? courses.map(c => Components.courseCard(c)).join('') : '<p class="text-muted">Henüz kursunuz yok. <a href="#/courses">Kursları keşfedin</a></p>'}</div></section>
      </div></div>
    `, { sidebar: true, active: 'dashboard' });
  },

  myCourses() {
    const filter = Router.currentParams.filter;
    const enrolled = Storage.getEnrolled();
    let courses = enrolled.map(id => AKO.getCourse(id)).filter(Boolean);
    if (filter === 'progress') courses = courses.filter(c => { const p = Storage.getProgress(c.id); return p.percent > 0 && p.percent < 100; });
    if (filter === 'completed') courses = courses.filter(c => Storage.getProgress(c.id).percent >= 100);
    return this.layout(`<div class="container py-4"><h1>Kurslarım</h1><div class="course-grid mt-4">${courses.map(c => Components.courseCard(c)).join('')}</div></div>`, { sidebar: true, active: filter === 'progress' ? 'in-progress' : filter === 'completed' ? 'completed' : 'my-courses' });
  },

  favorites() {
    const favs = Storage.getFavorites().map(id => AKO.getCourse(id)).filter(Boolean);
    return this.layout(`<div class="container py-4"><h1>Favorilerim</h1><div class="course-grid mt-4">${favs.length ? favs.map(c => Components.courseCard(c)).join('') : '<p class="text-muted">Henüz favori kursunuz yok.</p>'}</div></div>`, { sidebar: true, active: 'favorites' });
  },

  certificates() {
    const user = Storage.getUser();
    const certs = AKO.certificates.filter(c => c.student === (user?.name || 'Ayşe Yılmaz'));
    return this.layout(`<div class="container py-4"><h1>Sertifikalarım</h1><div class="cert-grid mt-4">${certs.length ? certs.map(c => {
      const course = AKO.getCourse(c.courseId);
      const inst = AKO.getInstructor(c.instructorId);
      return `<div class="cert-card"><div class="cert-preview"><img src="assets/images/logo.svg" height="30"><h4>Sertifika</h4><p>${c.student}</p><p>${course?.title}</p><small>${c.id}</small></div><div class="cert-actions"><a href="#/certificate/${c.id}" class="btn btn-primary btn-sm">Görüntüle</a><button class="btn btn-outline-primary btn-sm btn-download-cert" data-id="${c.id}">PDF İndir</button><button class="btn btn-outline-secondary btn-sm btn-share-linkedin" data-id="${c.id}">LinkedIn</button></div></div>`;
    }).join('') : '<p class="text-muted">Henüz sertifikanız yok.</p>'}</div></div>`, { sidebar: true, active: 'certificates' });
  },

  certificateView(params) {
    const cert = AKO.certificates.find(c => c.id === params.id);
    if (!cert) return this.notFound();
    const course = AKO.getCourse(cert.courseId);
    const inst = AKO.getInstructor(cert.instructorId);
    return this.layout(`<div class="container py-5"><div class="certificate-display">
      <div class="cert-border"><img src="assets/images/logo.svg" height="50" class="mb-4">
        <h2>Sertifika</h2><p class="cert-student">${cert.student}</p>
        <p><strong>${course?.title}</strong> eğitimini başarıyla tamamlamıştır.</p>
        <p>Eğitmen: ${inst?.name} · Süre: ${cert.duration} · Tarih: ${cert.date}</p>
        <p class="cert-id">Sertifika ID: ${cert.id}</p>
        <div class="cert-qr"><i class="fa-solid fa-qrcode fa-4x"></i><small>QR Doğrulama</small></div>
      </div>
      <div class="mt-4 d-flex gap-2 justify-content-center"><button class="btn btn-primary btn-download-cert" data-id="${cert.id}">PDF İndir</button><button class="btn btn-outline-primary btn-share-linkedin" data-id="${cert.id}">LinkedIn'de Paylaş</button></div>
    </div></div>`);
  },

  certificateVerify(params) {
    const id = params.id || Router.currentParams.id;
    const cert = id ? AKO.certificates.find(c => c.id === id) : null;
    return this.layout(`<div class="container py-5"><div class="verify-page mx-auto" style="max-width:500px">
      <h1>Sertifika Doğrulama</h1><p class="text-muted">Sertifika numaranızı girerek doğrulayın.</p>
      <div class="input-group mb-4"><input type="text" class="form-control" id="certVerifyInput" placeholder="AKO-2026-000214" value="${id || ''}"><button class="btn btn-primary" id="btnVerifyCert">Doğrula</button></div>
      ${cert ? `<div class="verify-result valid"><i class="fa-solid fa-check-circle"></i><h4>Geçerli Sertifika</h4><p><strong>Öğrenci:</strong> ${cert.student}</p><p><strong>Kurs:</strong> ${AKO.getCourse(cert.courseId)?.title}</p><p><strong>Tarih:</strong> ${cert.date}</p><p><strong>Durum:</strong> ${cert.status === 'valid' ? 'Geçerli ✓' : 'Geçersiz'}</p></div>` : id ? '<div class="verify-result invalid"><i class="fa-solid fa-times-circle"></i><h4>Sertifika Bulunamadı</h4></div>' : ''}
    </div></div>`);
  },

  liveSessions() {
    const sessions = AKO.liveSessions;
    return this.layout(`<div class="container py-4"><h1>Canlı Dersler</h1><div class="live-grid mt-4">${sessions.map(s => {
      const inst = AKO.getInstructor(s.instructorId);
      return `<div class="live-card ${s.status}"><div class="live-badge">${s.status === 'upcoming' ? 'Yaklaşan' : 'Tamamlandı'}</div><h4>${s.title}</h4><div class="live-meta"><span><i class="fa-regular fa-calendar"></i> ${s.date} ${s.time}</span><span><i class="fa-solid fa-user"></i> ${inst.name}</span><span><i class="fa-solid fa-users"></i> ${s.participants} katılımcı</span><span><i class="fa-regular fa-clock"></i> ${s.duration} dk</span></div>
      ${s.status === 'upcoming' ? `<button class="btn btn-live btn-join-live" data-id="${s.id}"><i class="fa-solid fa-video"></i> Canlı Derse Katıl</button>` : s.recording ? `<button class="btn btn-outline-primary btn-watch-recording" data-id="${s.id}"><i class="fa-solid fa-play"></i> Kayıt Mevcut — İzle</button>` : '<span class="text-muted">Kayıt yok</span>'}
      </div>`;
    }).join('')}</div></div>`, { sidebar: true, active: 'live' });
  },

  liveRoom(params) {
    const session = AKO.liveSessions.find(s => s.id === Number(params.id));
    if (!session) return this.notFound();
    return `<div class="live-room-page">
      <div class="live-room-header"><span>${session.title}</span><button class="btn btn-danger btn-sm" id="leaveLive"><i class="fa-solid fa-phone-slash"></i> Dersten Ayrıl</button></div>
      <div class="live-room-body">
        <div class="live-video-area"><div class="live-main-video"><i class="fa-solid fa-user fa-4x"></i><span>Eğitmen — ${AKO.getInstructor(session.instructorId).name}</span></div>
          <div class="live-participant-grid"><div class="live-participant"><i class="fa-solid fa-user"></i></div><div class="live-participant"><i class="fa-solid fa-user"></i></div><div class="live-participant"><i class="fa-solid fa-user"></i></div></div>
        </div>
        <div class="live-chat-drawer" id="liveChatDrawer"><div class="chat-header">Chat <button id="closeChatDrawer"><i class="fa-solid fa-times"></i></button></div><div class="chat-messages"><div class="chat-msg"><strong>Eğitmen:</strong> Hoş geldiniz!</div><div class="chat-msg"><strong>Öğrenci:</strong> Merhaba hocam</div></div><div class="chat-input"><input type="text" placeholder="Mesaj yaz..." id="liveChatInput"><button id="sendLiveChat"><i class="fa-solid fa-paper-plane"></i></button></div></div>
      </div>
      <div class="live-toolbar">
        <button class="live-tool" id="toggleMic"><i class="fa-solid fa-microphone"></i></button>
        <button class="live-tool" id="toggleCam"><i class="fa-solid fa-video"></i></button>
        <button class="live-tool" id="showParticipants"><i class="fa-solid fa-users"></i></button>
        <button class="live-tool" id="openChat"><i class="fa-solid fa-comment"></i></button>
        <button class="live-tool" id="raiseHand"><i class="fa-solid fa-hand"></i></button>
        <button class="live-tool" id="shareScreen"><i class="fa-solid fa-desktop"></i></button>
        <button class="live-tool" id="liveFullscreen"><i class="fa-solid fa-expand"></i></button>
      </div>
    </div>`;
  },

  checkout() {
    const cart = Storage.getCart();
    if (!cart.length) { Router.navigate('/courses'); return ''; }
    const subtotal = cart.reduce((s, c) => s + c.price, 0);
    return this.layout(`<div class="container py-4"><h1>Ödeme</h1><div class="row g-4 mt-2">
      <div class="col-lg-5"><div class="checkout-summary"><h4>Sepet Özeti</h4>${cart.map(c => `<div class="checkout-item"><span>${c.title}</span><span>₺${c.price}</span></div>`).join('')}
        <div class="coupon-section mt-3"><label>Kupon Kodu</label><div class="input-group"><input type="text" class="form-control" id="couponCode" placeholder="AKILLI50"><button class="btn btn-outline-primary" id="applyCoupon">Uygula</button></div><small class="text-muted">Demo: AKILLI50 (%50), HOSGELDIN20 (%20)</small></div>
        <div class="checkout-totals mt-3"><div class="d-flex justify-content-between"><span>Ara Toplam</span><span id="subtotal">₺${subtotal.toLocaleString('tr-TR')}</span></div><div class="d-flex justify-content-between text-success" id="discountRow" style="display:none!important"><span>İndirim</span><span id="discountAmount">-₺0</span></div><div class="d-flex justify-content-between fw-bold fs-5 mt-2"><span>Toplam</span><span id="totalAmount">₺${subtotal.toLocaleString('tr-TR')}</span></div></div>
      </div></div>
      <div class="col-lg-7"><div class="checkout-payment"><h4>Ödeme Bilgileri</h4>
        <p class="text-muted small">Demo ödeme simülasyonu. Gerçek entegrasyon: iyzico, PayTR, Stripe (server-side)</p>
        <div class="mb-3"><label>Kart Sahibi</label><input type="text" class="form-control" id="cardName" placeholder="Ad Soyad"></div>
        <div class="mb-3"><label>Kart Numarası</label><input type="text" class="form-control" id="cardNumber" placeholder="4242 4242 4242 4242" maxlength="19"></div>
        <div class="row"><div class="col-6 mb-3"><label>SKT</label><input type="text" class="form-control" id="cardExpiry" placeholder="MM/YY" maxlength="5"></div><div class="col-6 mb-3"><label>CVV</label><input type="text" class="form-control" id="cardCvv" placeholder="123" maxlength="3"></div></div>
        <button class="btn btn-primary btn-lg w-100" id="btnPay">₺${subtotal.toLocaleString('tr-TR')} Öde</button>
      </div></div>
    </div></div>`);
  },

  orderSuccess(params) {
    const courseId = params.courseId || Storage.getCart()[0]?.id;
    const course = AKO.getCourse(courseId);
    return this.layout(`<div class="order-success-page text-center py-5"><div class="success-icon">🎉</div><h1>Eğitimin Hazır!</h1><p class="lead">${course?.title || 'Kursunuz'} artık hesabına tanımlandı.</p><a href="#/player/${courseId}" class="btn btn-primary btn-lg">Eğitime Başla</a><a href="#/dashboard" class="btn btn-outline-primary btn-lg ms-2">Dashboard'a Git</a></div>`);
  },

  purchases() {
    const orders = [...Storage.getOrders(), ...AKO.orders.slice(0, 5)];
    return this.layout(`<div class="container py-4"><h1>Satın Almalarım</h1>${Components.table(['Sipariş No', 'Kurs', 'Tarih', 'Tutar', 'Ödeme', 'Fatura'], orders.map(o => {
      const course = AKO.getCourse(o.courseId);
      return `<tr><td>${o.id || o.orderId}</td><td>${course?.title || o.course}</td><td>${o.date}</td><td>₺${o.amount}</td><td>${o.payment || 'Kredi Kartı'}</td><td><button class="btn btn-sm btn-outline-primary btn-invoice" data-id="${o.id}">Fatura</button></td></tr>`;
    }))}</div>`, { sidebar: true, active: 'purchases' });
  },

  profile() {
    const p = Storage.getProfile();
    return this.layout(`<div class="container py-4"><h1>Profil Ayarları</h1><form id="profileForm" class="mt-4" style="max-width:600px">
      <div class="text-center mb-4"><div class="avatar-xl">${p.firstName[0]}${p.lastName[0]}</div><button type="button" class="btn btn-sm btn-outline-primary mt-2">Fotoğraf Değiştir</button></div>
      <div class="row g-3"><div class="col-md-6"><label>Ad</label><input type="text" class="form-control" name="firstName" value="${p.firstName}"></div><div class="col-md-6"><label>Soyad</label><input type="text" class="form-control" name="lastName" value="${p.lastName}"></div>
      <div class="col-12"><label>E-posta</label><input type="email" class="form-control" name="email" value="${p.email}"></div>
      <div class="col-md-6"><label>Telefon</label><input type="tel" class="form-control" name="phone" value="${p.phone}"></div><div class="col-md-6"><label>Meslek</label><input type="text" class="form-control" name="job" value="${p.job}"></div>
      <div class="col-12"><label>Biyografi</label><textarea class="form-control" name="bio" rows="3">${p.bio}</textarea></div>
      <div class="col-12"><hr><h5>Şifre Değiştir</h5></div><div class="col-md-4"><label>Mevcut Şifre</label><input type="password" class="form-control" name="currentPass"></div><div class="col-md-4"><label>Yeni Şifre</label><input type="password" class="form-control" name="newPass"></div><div class="col-md-4"><label>Tekrar</label><input type="password" class="form-control" name="confirmPass"></div>
      <div class="col-12"><button type="submit" class="btn btn-primary">Kaydet</button></div></div>
    </form></div>`, { sidebar: true, active: 'profile' });
  },

  messages() {
    return this.layout(`<div class="container py-4"><h1>Mesajlar</h1><div class="messages-layout mt-4">
      <div class="msg-sidebar">${AKO.messages.map(m => `<div class="msg-conv ${m.unread ? 'unread' : ''}" data-id="${m.id}"><strong>${m.from}</strong><p>${m.lastMsg}</p><small>${m.time}</small></div>`).join('')}</div>
      <div class="msg-chat"><div class="msg-chat-header"><strong id="chatWith">Emre Kaya</strong></div><div class="msg-chat-body" id="chatBody"><div class="chat-bubble received">Projenizi inceledim, harika olmuş!</div><div class="chat-bubble sent">Teşekkür ederim hocam!</div></div>
      <div class="msg-chat-input"><input type="text" placeholder="Mesaj yaz..." id="msgInput"><button id="sendMsg"><i class="fa-solid fa-paper-plane"></i></button><button id="attachFile"><i class="fa-solid fa-paperclip"></i></button></div></div>
    </div></div>`, { sidebar: true, active: 'messages' });
  },

  quiz(params) {
    const courseId = Number(params.courseId || params.id);
    const quiz = AKO.quizzes[courseId] || AKO.quizzes[1];
    return this.layout(`<div class="container py-4"><div class="quiz-page mx-auto" style="max-width:700px">
      <h1>${quiz.title}</h1><div class="quiz-progress"><div class="progress"><div class="progress-bar" id="quizProgressBar" style="width:0%"></div></div><span id="quizProgressText">Soru 1 / ${quiz.questions.length}</span></div>
      <div id="quizContainer"></div>
      <div class="quiz-nav mt-4"><button class="btn btn-outline-secondary" id="quizPrev">Önceki</button><button class="btn btn-primary" id="quizNext">Sonraki</button><button class="btn btn-success d-none" id="quizFinish">Quiz'i Bitir</button></div>
      <div id="quizResult" class="d-none"></div>
    </div></div>`);
  },

  instructorProfile(params) {
    const inst = AKO.instructors.find(i => i.id === Number(params.id));
    if (!inst) return this.notFound();
    const courses = AKO.courses.filter(c => c.instructorId === inst.id);
    return this.layout(`<div class="instructor-page"><div class="instructor-hero" style="background:linear-gradient(135deg,${inst.color}22,#2563EB11)"><div class="container py-5"><div class="d-flex gap-4 align-items-center"><div class="avatar-xl" style="background:${inst.color}">${inst.avatar}</div><div><h1>${inst.name}</h1><p class="lead">${inst.title}</p><div class="inst-stats"><span>⭐ ${inst.rating}</span><span>${inst.students.toLocaleString('tr-TR')} öğrenci</span><span>${inst.courses} kurs</span><span>${inst.reviews.toLocaleString('tr-TR')} yorum</span></div></div></div><p class="mt-3">${inst.bio}</p></div></div>
      <div class="container py-4"><h3>Kursları</h3><div class="course-grid mt-3">${courses.map(c => Components.courseCard(c)).join('')}</div></div></div>`);
  },

  becomeInstructor() {
    return this.layout(`<div class="container py-5 text-center"><h1>Eğitmen Ol</h1><p class="lead mx-auto" style="max-width:600px">Bilginizi paylaşın, binlerce öğrenciye ulaşın ve kazanmaya başlayın.</p><div class="row g-4 mt-4 justify-content-center"><div class="col-md-4"><div class="feature-card"><i class="fa-solid fa-users fa-2x"></i><h4>Geniş Kitle</h4><p>100K+ aktif öğrenci</p></div></div><div class="col-md-4"><div class="feature-card"><i class="fa-solid fa-wallet fa-2x"></i><h4>%80 Kazanç</h4><p>Adil komisyon modeli</p></div></div><div class="col-md-4"><div class="feature-card"><i class="fa-solid fa-tools fa-2x"></i><h4>Profesyonel Araçlar</h4><p>Kurs oluşturma wizard'ı</p></div></div></div><a href="#/instructor/create" class="btn btn-primary btn-lg mt-4">Hemen Başla</a></div>`);
  },

  // Instructor views
  instructorDashboard() {
    if (!['instructor', 'admin'].includes(Storage.getRole())) return this.forbidden();
    const e = AKO.instructorEarnings;
    return this.layout(`<div class="container py-4"><h1>Eğitmen Dashboard</h1><div class="kpi-grid mt-4">
      ${Components.kpiCard('Toplam Kurs', '8', 'fa-book', 'primary')}${Components.kpiCard('Toplam Öğrenci', '45.2K', 'fa-users', 'cyan')}${Components.kpiCard('Toplam Satış', '₺1.2M', 'fa-shopping-cart', 'green')}${Components.kpiCard('Bu Ay Kazanç', '₺98K', 'fa-wallet', 'orange')}
      ${Components.kpiCard('Ort. Puan', '4.9', 'fa-star', 'yellow')}${Components.kpiCard('Yorum', '12.4K', 'fa-comment', 'pink')}${Components.kpiCard('Canlı Ders', '4', 'fa-video', 'purple')}${Components.kpiCard('Tamamlanma', '%72', 'fa-chart-pie', 'teal')}
    </div><div class="row mt-4"><div class="col-lg-8"><canvas id="earningsChart"></canvas></div><div class="col-lg-4"><h5>Son Satışlar</h5>${Components.table(['Tarih','Öğrenci','Tutar'], e.sales.map(s => `<tr><td>${s.date}</td><td>${s.student}</td><td>₺${s.net}</td></tr>`))}</div></div></div>`, { sidebar: true, active: 'instructor-dash' });
  },

  instructorCreate() {
    return this.layout(`<div class="container py-4"><h1>Yeni Kurs Oluştur</h1><div class="wizard mt-4"><div class="wizard-steps"><div class="wizard-step active" data-step="1">1. Temel</div><div class="wizard-step" data-step="2">2. Kapak</div><div class="wizard-step" data-step="3">3. Müfredat</div><div class="wizard-step" data-step="4">4. Fiyat</div><div class="wizard-step" data-step="5">5. SEO</div><div class="wizard-step" data-step="6">6. Yayın</div></div>
      <div class="wizard-content"><div class="wizard-panel active" data-panel="1"><div class="row g-3"><div class="col-12"><label>Kurs Adı</label><input type="text" class="form-control" id="wcTitle"></div><div class="col-12"><label>Alt Başlık</label><input type="text" class="form-control" id="wcSubtitle"></div><div class="col-12"><label>Açıklama</label><textarea class="form-control" rows="4" id="wcDesc"></textarea><button class="btn btn-sm btn-outline-primary mt-1 ai-gen-desc">AI ile Oluştur</button></div><div class="col-md-4"><label>Kategori</label><select class="form-select" id="wcCat">${AKO.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}</select></div><div class="col-md-4"><label>Seviye</label><select class="form-select" id="wcLevel"><option>Başlangıç</option><option>Orta</option><option>İleri</option></select></div><div class="col-md-4"><label>Dil</label><select class="form-select"><option>Türkçe</option><option>English</option></select></div></div></div>
      <div class="wizard-panel" data-panel="2"><div class="upload-zone" id="coverUpload"><i class="fa-solid fa-cloud-arrow-up fa-3x"></i><p>Kapak görseli sürükle veya seç</p><input type="file" accept="image/*" hidden></div><div class="mt-3"><label>Tanıtım Videosu URL</label><input type="url" class="form-control" placeholder="https://..."></div></div>
      <div class="wizard-panel" data-panel="3"><div id="curriculumBuilder"><div class="curriculum-section"><div class="section-header"><input type="text" class="form-control" value="Bölüm 1 — Giriş"><button class="btn btn-sm btn-outline-danger"><i class="fa-solid fa-trash"></i></button></div><div class="section-lessons"><div class="lesson-item"><i class="fa-solid fa-grip-vertical drag-handle"></i><select class="form-select form-select-sm"><option>Video</option><option>PDF</option><option>Quiz</option><option>Dosya</option><option>Ödev</option><option>Canlı Ders</option></select><input type="text" class="form-control form-control-sm" placeholder="Ders adı"><button class="btn btn-sm btn-outline-primary">+ Ekle</button></div></div></div><button class="btn btn-outline-primary mt-3" id="addSection">+ Bölüm Ekle</button></div></div>
      <div class="wizard-panel" data-panel="4"><div class="row g-3"><div class="col-md-6"><label>Fiyat (₺)</label><input type="number" class="form-control" value="499"></div><div class="col-md-6"><label>İndirimli Fiyat (₺)</label><input type="number" class="form-control" value="1799"></div></div></div>
      <div class="wizard-panel" data-panel="5"><div class="mb-3"><label>SEO Başlık</label><input type="text" class="form-control" id="wcSeoTitle"><button class="btn btn-sm btn-outline-primary ai-gen-seo">AI ile Oluştur</button></div><div class="mb-3"><label>Meta Açıklama</label><textarea class="form-control" rows="3"></textarea></div></div>
      <div class="wizard-panel" data-panel="6"><div class="text-center py-4"><i class="fa-solid fa-check-circle fa-4x text-success"></i><h3>Kurs Yayına Hazır!</h3><p>Kursunuzu inceleyip yayınlayın.</p><button class="btn btn-primary btn-lg" id="publishCourse">Yayınla</button></div></div>
      </div><div class="wizard-nav mt-4"><button class="btn btn-outline-secondary" id="wizardPrev">Geri</button><button class="btn btn-primary" id="wizardNext">İleri</button></div></div></div>`, { sidebar: true, active: 'create-course' });
  },

  instructorEarnings() {
    const e = AKO.instructorEarnings;
    return this.layout(`<div class="container py-4"><h1>Kazançlar</h1><div class="kpi-grid mt-4">${Components.kpiCard('Toplam Satış', '₺' + e.totalSales.toLocaleString('tr-TR'), 'fa-shopping-cart')}${Components.kpiCard('Brüt Gelir', '₺' + e.grossRevenue.toLocaleString('tr-TR'), 'fa-money-bill')}${Components.kpiCard('Platform Komisyonu', '₺' + e.platformCommission.toLocaleString('tr-TR'), 'fa-percent')}${Components.kpiCard('Eğitmen Kazancı', '₺' + e.instructorEarnings.toLocaleString('tr-TR'), 'fa-wallet', 'green')}${Components.kpiCard('Ödenecek Bakiye', '₺' + e.pendingBalance.toLocaleString('tr-TR'), 'fa-clock', 'orange')}</div>
      <div class="row mt-4"><div class="col-lg-8"><canvas id="monthlyEarningsChart" height="120"></canvas></div><div class="col-lg-4"><h5>Ödeme Talebi</h5><form id="withdrawForm"><div class="mb-2"><label>Tutar</label><input type="number" class="form-control" name="amount"></div><div class="mb-2"><label>Banka</label><input type="text" class="form-control" name="bank"></div><div class="mb-2"><label>IBAN</label><input type="text" class="form-control" name="iban"></div><button type="submit" class="btn btn-primary w-100">Ödeme Talebi Oluştur</button></form><h5 class="mt-4">Talepler</h5>${Components.table(['Tutar','Durum','Tarih'], e.withdrawals.map(w => `<tr><td>₺${w.amount.toLocaleString('tr-TR')}</td><td><span class="badge bg-${w.status === 'paid' ? 'success' : w.status === 'pending' ? 'warning' : 'danger'}">${w.status === 'paid' ? 'Ödendi' : w.status === 'pending' ? 'Bekliyor' : 'Reddedildi'}</span></td><td>${w.date}</td></tr>`))}</div></div>
      <h4 class="mt-4">Satış Tablosu</h4>${Components.table(['Tarih','Öğrenci','Kurs','Satış','Komisyon','Eğitmen Payı'], e.sales.map(s => `<tr><td>${s.date}</td><td>${s.student}</td><td>${s.course}</td><td>₺${s.amount}</td><td>₺${s.commission}</td><td>₺${s.net}</td></tr>`))}
    </div>`, { sidebar: true, active: 'earnings' });
  },

  instructorAnalytics() {
    const a = AKO.courseAnalytics;
    return this.layout(`<div class="container py-4"><h1>Kurs Analitiği</h1><div class="kpi-grid mt-4">${Components.kpiCard('Kayıtlı', a.enrolled, 'fa-users')}${Components.kpiCard('Aktif', a.active, 'fa-user-check', 'green')}${Components.kpiCard('Ort. İzleme', '%' + a.avgWatch, 'fa-play')}${Components.kpiCard('Tamamlama', '%' + a.completion, 'fa-check', 'green')}${Components.kpiCard('Drop-off', '%' + a.dropOff, 'fa-arrow-down', 'red')}</div>
      <h4 class="mt-4">Video Analitiği</h4>${Components.table(['Video','Görüntüleme','Ort. İzleme','Ort. Süre'], AKO.videoAnalytics.map(v => `<tr><td>${v.title}</td><td>${v.views.toLocaleString('tr-TR')}</td><td>%${v.avgWatch}</td><td>${v.avgDuration}</td></tr>`))}
    </div>`, { sidebar: true, active: 'analytics' });
  },

  instructorAI() {
    return this.layout(`<div class="container py-4"><h1>AI Eğitmen Araçları</h1><div class="ai-tools-grid mt-4">
      <div class="ai-tool-card"><i class="fa-solid fa-file-lines"></i><h4>AI ile Kurs Açıklaması</h4><button class="btn btn-primary btn-sm ai-tool-btn" data-tool="desc">Oluştur</button><div class="ai-output"></div></div>
      <div class="ai-tool-card"><i class="fa-solid fa-question"></i><h4>AI ile Quiz Oluştur</h4><button class="btn btn-primary btn-sm ai-tool-btn" data-tool="quiz">Oluştur</button><div class="ai-output"></div></div>
      <div class="ai-tool-card"><i class="fa-solid fa-list"></i><h4>AI ile Eğitim Özeti</h4><button class="btn btn-primary btn-sm ai-tool-btn" data-tool="summary">Oluştur</button><div class="ai-output"></div></div>
      <div class="ai-tool-card"><i class="fa-solid fa-search"></i><h4>AI ile SEO Başlığı</h4><button class="btn btn-primary btn-sm ai-tool-btn" data-tool="seo">Oluştur</button><div class="ai-output"></div></div>
    </div></div>`, { sidebar: true, active: 'ai-tools' });
  },

  instructorCourses() {
    const courses = AKO.courses.filter(c => c.instructorId === 1);
    return this.layout(`<div class="container py-4"><div class="d-flex justify-content-between"><h1>Kurslarım</h1><a href="#/instructor/create" class="btn btn-primary">+ Yeni Kurs</a></div>${Components.table(['Kurs','Öğrenci','Puan','Fiyat','Durum','İşlem'], courses.map(c => `<tr><td>${c.title}</td><td>${c.students.toLocaleString('tr-TR')}</td><td>${c.rating} ⭐</td><td>₺${c.price}</td><td><span class="badge bg-success">Yayında</span></td><td><a href="#/course/${c.id}" class="btn btn-sm btn-outline-primary">Görüntüle</a></td></tr>`))}</div>`, { sidebar: true, active: 'my-courses-i' });
  },

  instructorLive() {
    const sessions = AKO.liveSessions;
    return this.layout(`<div class="container py-4"><div class="d-flex justify-content-between"><h1>Canlı Derslerim</h1><button class="btn btn-primary btn-sm" id="scheduleLive">+ Yeni Canlı Ders</button></div><div class="live-grid mt-4">${sessions.map(s => {
      const inst = AKO.getInstructor(s.instructorId);
      return `<div class="live-card ${s.status}"><div class="live-badge">${s.status === 'upcoming' ? 'Yaklaşan' : 'Tamamlandı'}</div><h4>${s.title}</h4><div class="live-meta"><span><i class="fa-regular fa-calendar"></i> ${s.date} ${s.time}</span><span><i class="fa-solid fa-users"></i> ${s.participants} katılımcı</span></div>
      ${s.status === 'upcoming' ? `<button class="btn btn-live btn-join-live" data-id="${s.id}">Canlı Derse Katıl</button>` : s.recording ? `<button class="btn btn-outline-primary btn-watch-recording" data-id="${s.id}">Kayıt Mevcut</button>` : ''}</div>`;
    }).join('')}</div></div>`, { sidebar: true, active: 'live-i' });
  },

  // Admin views
  adminDashboard() {
    if (!['admin', 'finance'].includes(Storage.getRole())) return this.forbidden();
    const s = AKO.adminStats;
    return this.layout(`<div class="container py-4"><h1>Süper Admin Dashboard</h1><div class="kpi-grid mt-4">
      ${Components.kpiCard('Toplam Kullanıcı', s.totalUsers.toLocaleString('tr-TR'), 'fa-users')}${Components.kpiCard('Aktif Öğrenci', s.activeStudents.toLocaleString('tr-TR'), 'fa-user-graduate', 'cyan')}${Components.kpiCard('Eğitmen', s.instructors, 'fa-chalkboard-user')}${Components.kpiCard('Aktif Kurs', s.activeCourses, 'fa-book', 'green')}
      ${Components.kpiCard('Toplam Satış', '₺' + s.totalSales.toLocaleString('tr-TR'), 'fa-shopping-cart')}${Components.kpiCard('Bugünkü Satış', '₺' + s.todaySales.toLocaleString('tr-TR'), 'fa-calendar-day', 'orange')}${Components.kpiCard('Aylık Ciro', '₺' + s.monthlyRevenue.toLocaleString('tr-TR'), 'fa-chart-line')}${Components.kpiCard('Platform Kazancı', '₺' + s.platformEarnings.toLocaleString('tr-TR'), 'fa-wallet', 'green')}
    </div><div class="row mt-4"><div class="col-lg-6"><canvas id="dailySalesChart"></canvas></div><div class="col-lg-6"><canvas id="categoryChart"></canvas></div></div><div class="row mt-4"><div class="col-lg-6"><canvas id="newUsersChart"></canvas></div><div class="col-lg-6"><canvas id="completionChart"></canvas></div></div></div>`, { sidebar: true, active: 'admin-dash' });
  },

  adminCourses() {
    return this.layout(`<div class="container py-4"><h1>Kurs Yönetimi</h1>${Components.table(['ID','Kurs','Eğitmen','Kategori','Fiyat','Öğrenci','Durum'], AKO.courses.map(c => `<tr><td>${c.id}</td><td>${c.title}</td><td>${AKO.getInstructor(c.instructorId).name}</td><td>${AKO.getCategory(c.category)?.name}</td><td>₺${c.price}</td><td>${c.students.toLocaleString('tr-TR')}</td><td><span class="badge bg-success">Aktif</span></td></tr>`))}</div>`, { sidebar: true, active: 'admin-courses' });
  },

  adminCategories() {
    return this.layout(`<div class="container py-4"><div class="d-flex justify-content-between"><h1>Kategoriler</h1><button class="btn btn-primary btn-sm" id="addCategory">+ Yeni Kategori</button></div><div class="category-grid mt-4">${AKO.categories.map(c => `<div class="category-card admin-cat" style="--cat-color:${c.color}"><div class="cat-icon"><i class="fa-solid ${c.icon}"></i></div><span>${c.name}</span><small>${c.subs.join(', ')}</small></div>`).join('')}</div></div>`, { sidebar: true, active: 'admin-categories' });
  },

  adminInstructors() {
    return this.layout(`<div class="container py-4"><h1>Eğitmenler</h1>${Components.table(['Ad','Ünvan','Kurs','Öğrenci','Puan','İşlem'], AKO.instructors.map(i => `<tr><td><div class="d-flex align-items-center gap-2"><span class="avatar-sm">${i.avatar}</span>${i.name}</div></td><td>${i.title}</td><td>${i.courses}</td><td>${i.students.toLocaleString('tr-TR')}</td><td>${i.rating} ⭐</td><td><a href="#/instructor/${i.id}" class="btn btn-sm btn-outline-primary">Profil</a></td></tr>`))}</div>`, { sidebar: true, active: 'admin-instructors' });
  },

  adminStudents() {
    return this.layout(`<div class="container py-4"><h1>Öğrenciler</h1>${Components.table(['ID','Ad','E-posta','Kayıt'], AKO.students.slice(0, 20).map(s => `<tr><td>${s.id}</td><td>${s.name}</td><td>${s.email}</td><td>${s.joined}</td></tr>`))}<p class="text-muted mt-2">Toplam ${AKO.students.length} öğrenci (simülasyon)</p></div>`, { sidebar: true, active: 'admin-students' });
  },

  adminOrders() {
    return this.layout(`<div class="container py-4"><h1>Siparişler</h1>${Components.table(['Sipariş No','Öğrenci','Kurs','Tarih','Tutar','Durum'], AKO.orders.map(o => { const c = AKO.getCourse(o.courseId); return `<tr><td>${o.id}</td><td>${o.student}</td><td>${c?.title}</td><td>${o.date}</td><td>₺${o.amount}</td><td><span class="badge bg-success">${o.status}</span></td></tr>`; }))}</div>`, { sidebar: true, active: 'admin-orders' });
  },

  adminCoupons() {
    return this.layout(`<div class="container py-4"><div class="d-flex justify-content-between"><h1>Kupon Yönetimi</h1><button class="btn btn-primary btn-sm" id="newCoupon">+ Yeni Kupon</button></div>${Components.table(['Kod','Tip','Değer','Min Tutar','Kullanım','Başlangıç','Bitiş'], AKO.coupons.map(c => `<tr><td><strong>${c.code}</strong></td><td>${c.type === 'percent' ? 'Yüzde' : 'TL'}</td><td>${c.type === 'percent' ? '%' + c.value : '₺' + c.value}</td><td>₺${c.minAmount}</td><td>${c.used}/${c.maxUses}</td><td>${c.start}</td><td>${c.end}</td></tr>`))}</div>`, { sidebar: true, active: 'admin-coupons' });
  },

  adminCampaigns() {
    return this.layout(`<div class="container py-4"><h1>Kampanyalar</h1><div class="row g-3 mt-2">${AKO.campaigns.map(c => `<div class="col-md-6"><div class="campaign-card" style="background:${c.banner}"><h4>${c.title}</h4><p>${c.desc}</p><span class="badge bg-light text-dark">%${c.discount} İndirim</span></div></div>`).join('')}</div></div>`, { sidebar: true, active: 'admin-campaigns' });
  },

  adminCash() {
    return this.layout(`<div class="container py-4"><h1>Kasa</h1><div class="kpi-grid mt-4">${Components.kpiCard('Bugünkü Ciro', '₺8.940', 'fa-calendar-day')}${Components.kpiCard('Aylık Ciro', '₺892.000', 'fa-chart-line', 'green')}${Components.kpiCard('İade', '₺199', 'fa-undo', 'red')}${Components.kpiCard('Net Platform Geliri', '₺178.400', 'fa-wallet')}${Components.kpiCard('Eğitmen Borcu', '₺45.200', 'fa-clock', 'orange')}${Components.kpiCard('Kasa Bakiyesi', '₺245.680', 'fa-cash-register', 'green')}</div>
      <h4 class="mt-4">Kasa Hareketleri</h4>${Components.table(['Tarih','İşlem','Sipariş','Kurs','Kullanıcı','Gelen','Giden','Bakiye'], AKO.cashMovements.map(m => `<tr><td>${m.date}</td><td>${m.type}</td><td>${m.order}</td><td>${m.course}</td><td>${m.user}</td><td class="text-success">${m.in ? '₺' + m.in : '-'}</td><td class="text-danger">${m.out ? '₺' + m.out : '-'}</td><td>₺${m.balance.toLocaleString('tr-TR')}</td></tr>`))}
    </div>`, { sidebar: true, active: 'admin-cash' });
  },

  adminPayments() {
    return this.layout(`<div class="container py-4"><h1>Eğitmen Ödemeleri</h1>${Components.table(['Eğitmen','Tutar','Banka','IBAN','Durum','Tarih'], AKO.instructorEarnings.withdrawals.map(w => `<tr><td>Emre Kaya</td><td>₺${w.amount.toLocaleString('tr-TR')}</td><td>${w.bank}</td><td>${w.iban}</td><td><span class="badge bg-${w.status === 'paid' ? 'success' : 'warning'}">${w.status === 'paid' ? 'Ödendi' : 'Bekliyor'}</span></td><td>${w.date}</td></tr>`))}</div>`, { sidebar: true, active: 'admin-payments' });
  },

  adminCommission() {
    return this.layout(`<div class="container py-4"><h1>Komisyon Ayarları</h1><form id="commissionForm" class="mt-4" style="max-width:400px"><div class="mb-3"><label>Platform Komisyonu (%)</label><input type="number" class="form-control" id="platformComm" value="${AKO.commission.platform}"></div><div class="mb-3"><label>Eğitmen Payı (%)</label><input type="number" class="form-control" id="instructorComm" value="${AKO.commission.instructor}"></div><button type="submit" class="btn btn-primary">Kaydet</button></form></div>`, { sidebar: true, active: 'admin-commission' });
  },

  adminSettings() {
    return this.layout(`<div class="container py-4"><h1>Sistem Ayarları</h1>
      <div class="row g-3 mt-2">
        <div class="col-md-6"><a href="#/admin/integrations" class="integration-card d-block text-reset"><h3><i class="fa-solid fa-video" style="color:#2D8CFF"></i> Entegrasyonlar</h3><p class="text-muted mb-0">Zoom, iyzico, PayTR ve Stripe bağlantılarını yönetin.</p></a></div>
        <div class="col-md-6"><div class="integration-card"><h3><i class="fa-solid fa-shield-halved"></i> Güvenlik</h3><p class="text-muted mb-0">RBAC, JWT, Refresh Token, HttpOnly Cookie, CSRF, XSS, Rate Limiting, bcrypt, MFA, Audit Log — production mimarisi server-side uygulanmalıdır.</p></div></div>
      </div></div>`, { sidebar: true, active: 'admin-settings' });
  },

  adminIntegrations() {
    const z = Storage.getZoomSettings();
    const connected = z.oauthConnected;
    return this.layout(`<div class="container py-4"><h1>Entegrasyonlar</h1><p class="text-muted">API anahtarları tarayıcıda yalnızca demo amaçlı saklanır. Canlı ortamda tüm secret'lar backend'de tutulmalıdır.</p>

      <div class="integration-card" id="zoomIntegration">
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
          <h3><i class="fa-solid fa-video" style="color:#2D8CFF"></i> Zoom Entegrasyonu</h3>
          <span class="integration-status ${connected ? 'on' : 'off'}" id="zoomStatusBadge">${connected ? 'Bağlı' : 'Bağlı değil'}</span>
        </div>
        <p class="text-muted">Canlı dersler için Zoom OAuth, Meeting SDK ve Meeting API. Secret bilgileri frontend'e hard-code edilmez.</p>
        <form id="zoomForm" class="row g-3">
          <div class="col-12"><label class="form-check"><input type="checkbox" class="form-check-input" id="zoomEnabled" ${z.enabled ? 'checked' : ''}> Zoom canlı dersleri aktif</label></div>
          <div class="col-md-6"><label>Account ID</label><input type="text" class="form-control" id="zoomAccountId" value="${z.accountId || ''}" placeholder="Zoom Account ID" autocomplete="off"></div>
          <div class="col-md-6"><label>OAuth Client ID</label><input type="text" class="form-control" id="zoomClientId" value="${z.clientId || ''}" placeholder="Client ID" autocomplete="off"></div>
          <div class="col-md-6"><label>OAuth Client Secret</label><input type="password" class="form-control" id="zoomClientSecret" value="${z.clientSecret || ''}" placeholder="Server-side tutulur" autocomplete="off"></div>
          <div class="col-md-6"><label>Meeting SDK Key</label><input type="text" class="form-control" id="zoomSdkKey" value="${z.sdkKey || ''}" placeholder="SDK Key" autocomplete="off"></div>
          <div class="col-md-6"><label>Meeting SDK Secret</label><input type="password" class="form-control" id="zoomSdkSecret" value="${z.sdkSecret || ''}" placeholder="Server-side signature" autocomplete="off"></div>
          <div class="col-md-6"><label>Webhook URL</label><input type="url" class="form-control" id="zoomWebhook" value="${z.webhookUrl || ''}" placeholder="https://api.akilliokul.com/webhooks/zoom"></div>
          <div class="col-12"><label class="form-check"><input type="checkbox" class="form-check-input" id="zoomMeetingSdk" ${z.meetingSdk ? 'checked' : ''}> Meeting SDK ile tarayıcı içi ders</label></div>
          <div class="col-12 d-flex flex-wrap gap-2">
            <button type="submit" class="btn btn-primary"><i class="fa-solid fa-floppy-disk me-1"></i> Zoom Ayarlarını Kaydet</button>
            <button type="button" class="btn btn-outline-primary" id="btnZoomOAuth"><i class="fa-solid fa-link me-1"></i> Zoom OAuth Bağla</button>
            <button type="button" class="btn btn-outline-secondary" id="btnZoomTest"><i class="fa-solid fa-vial me-1"></i> Test Toplantısı Oluştur</button>
            <button type="button" class="btn btn-outline-danger" id="btnZoomDisconnect">Bağlantıyı Kes</button>
          </div>
        </form>
        <div class="mt-3 small text-muted">
          Backend alanları: Zoom OAuth · Zoom Meeting SDK · Meeting API · Meeting ID · Meeting Password · Meeting Token · Server-side signature
        </div>
      </div>

      <div class="row g-3">
        <div class="col-md-4"><div class="integration-card h-100"><h3><i class="fa-solid fa-credit-card"></i> iyzico</h3><p class="text-muted small">API Key ve Secret backend'de tutulur.</p><input class="form-control mb-2" placeholder="API Key" id="iyzicoKey"><button class="btn btn-sm btn-outline-primary" id="saveIyzico">Kaydet</button></div></div>
        <div class="col-md-4"><div class="integration-card h-100"><h3><i class="fa-solid fa-building-columns"></i> PayTR</h3><p class="text-muted small">Merchant ID / Key / Salt server-side.</p><input class="form-control mb-2" placeholder="Merchant ID" id="paytrId"><button class="btn btn-sm btn-outline-primary" id="savePaytr">Kaydet</button></div></div>
        <div class="col-md-4"><div class="integration-card h-100"><h3><i class="fa-brands fa-stripe"></i> Stripe</h3><p class="text-muted small">Secret Key frontend'e yazılmaz.</p><input class="form-control mb-2" placeholder="Publishable Key" id="stripePk"><button class="btn btn-sm btn-outline-primary" id="saveStripe">Kaydet</button></div></div>
      </div>
    </div>`, { sidebar: true, active: 'admin-integrations' });
  },

  adminLive() {
    const sessions = AKO.liveSessions;
    return this.layout(`<div class="container py-4"><div class="d-flex justify-content-between align-items-center flex-wrap gap-2"><h1>Canlı Dersler</h1><a href="#/admin/integrations" class="btn btn-outline-primary btn-sm">Zoom Ayarları</a></div>
      ${Components.table(['Ders','Tarih','Eğitmen','Katılımcı','Süre','Durum','İşlem'], sessions.map(s => {
        const inst = AKO.getInstructor(s.instructorId);
        return `<tr><td>${s.title}</td><td>${s.date} ${s.time}</td><td>${inst?.name || ''}</td><td>${s.participants}</td><td>${s.duration} dk</td><td><span class="badge bg-${s.status === 'upcoming' ? 'primary' : 'success'}">${s.status === 'upcoming' ? 'Yaklaşan' : 'Tamamlandı'}</span></td><td>${s.status === 'upcoming' ? `<button class="btn btn-sm btn-live btn-join-live" data-id="${s.id}">Katıl</button>` : (s.recording ? `<button class="btn btn-sm btn-outline-primary btn-watch-recording" data-id="${s.id}">Kayıt</button>` : '-')}</td></tr>`;
      }))}</div>`, { sidebar: true, active: 'admin-live' });
  },

  adminCertificates() {
    return this.layout(`<div class="container py-4"><h1>Sertifikalar</h1>${Components.table(['Sertifika No','Öğrenci','Kurs','Tarih','Durum'], AKO.certificates.map(c => `<tr><td><a href="#/certificate/${c.id}">${c.id}</a></td><td>${c.student}</td><td>${AKO.getCourse(c.courseId)?.title || ''}</td><td>${c.date}</td><td><span class="badge bg-success">${c.status === 'valid' ? 'Geçerli' : c.status}</span></td></tr>`))}</div>`, { sidebar: true, active: 'admin-certs' });
  },

  adminLogs() {
    return this.layout(`<div class="container py-4"><h1>Sistem Logları</h1>${Components.table(['Tarih','Seviye','Kullanıcı','İşlem','IP'], [
      `<tr><td>2026-08-17 09:00</td><td><span class="badge bg-info">INFO</span></td><td>admin@akilliokul.com</td><td>Dashboard görüntülendi</td><td>192.168.1.1</td></tr>`,
      `<tr><td>2026-08-17 08:45</td><td><span class="badge bg-success">SUCCESS</span></td><td>ogrenci@akilliokul.com</td><td>Kurs satın alındı #AKO-001523</td><td>10.0.0.5</td></tr>`,
      `<tr><td>2026-08-17 08:30</td><td><span class="badge bg-warning">WARN</span></td><td>egitmen@akilliokul.com</td><td>Ödeme talebi oluşturuldu</td><td>172.16.0.2</td></tr>`
    ])}</div>`, { sidebar: true, active: 'admin-logs' });
  },

  adminUsers() {
    return this.layout(`<div class="container py-4"><h1>Kullanıcılar & Roller</h1>${Components.table(['E-posta','Ad','Rol','Durum'], AKO.demoAccounts.map(a => `<tr><td>${a.email}</td><td>${a.name}</td><td><span class="badge bg-primary">${a.role}</span></td><td><span class="badge bg-success">Aktif</span></td></tr>`))}</div>`, { sidebar: true, active: 'admin-users' });
  },

  financeDashboard() {
    return this.adminCash();
  }
};
