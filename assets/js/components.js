/* Akıllı Okul — Reusable Components */
const Components = {
  logo(size = 'md') {
    const h = size === 'sm' ? 32 : size === 'lg' ? 48 : 40;
    return `<a href="#/" class="ako-logo"><img src="assets/images/logo.svg" alt="Akıllı Okul" height="${h}"></a>`;
  },

  courseCard(course, opts = {}) {
    const inst = AKO.getInstructor(course.instructorId);
    const isFav = Storage.isFavorite(course.id);
    const discount = course.discount || Math.round((1 - course.price / course.oldPrice) * 100);
    return `<div class="course-card" data-id="${course.id}">
      <div class="course-card-img-wrap">
        <img src="${course.image}" alt="${course.title}" loading="lazy" class="course-card-img">
        ${course.bestseller ? '<span class="badge-bestseller">En Çok Satan</span>' : ''}
        <button class="btn-fav ${isFav ? 'active' : ''}" data-fav="${course.id}" aria-label="Favori"><i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i></button>
      </div>
      <div class="course-card-body">
        <h3 class="course-card-title"><a href="#/course/${course.id}">${course.title}</a></h3>
        <p class="course-card-instructor">${inst.name}</p>
        <div class="course-card-rating">
          <span class="rating-num">${course.rating}</span>
          <span class="stars">${'★'.repeat(Math.floor(course.rating))}${course.rating % 1 >= 0.5 ? '½' : ''}</span>
          <span class="rating-count">(${course.reviewCount.toLocaleString('tr-TR')})</span>
        </div>
        <div class="course-card-meta">
          <span><i class="fa-regular fa-clock"></i> ${course.hours} saat</span>
          <span><i class="fa-solid fa-play"></i> ${course.lessons} ders</span>
          <span class="badge-level">${course.level}</span>
        </div>
        <div class="course-card-price">
          <span class="price-current">₺${course.price.toLocaleString('tr-TR')}</span>
          <span class="price-old">₺${course.oldPrice.toLocaleString('tr-TR')}</span>
          <span class="price-discount">%${discount} İndirim</span>
        </div>
        ${opts.showActions !== false ? `<div class="course-card-actions">
          <button class="btn btn-primary btn-sm btn-add-cart" data-cart="${course.id}"><i class="fa-solid fa-cart-plus"></i> Sepete Ekle</button>
        </div>` : ''}
      </div>
    </div>`;
  },

  courseCardSkeleton() {
    return `<div class="course-card skeleton-card"><div class="skeleton skeleton-img"></div><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text short"></div><div class="skeleton skeleton-text shorter"></div></div>`;
  },

  navbar(showSearch = true) {
    const user = Storage.getUser();
    const role = Storage.getRole();
    const cartCount = Storage.getCart().length;
    const lang = Storage.getLang();
    const t = AKO.i18n[lang];
    return `<header class="ako-header">
      <div class="container-fluid px-lg-4">
        <nav class="navbar navbar-expand-lg">
          ${this.logo()}
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain"><i class="fa-solid fa-bars"></i></button>
          <div class="collapse navbar-collapse" id="navMain">
            <ul class="navbar-nav me-auto">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">Kategoriler</a>
                <ul class="dropdown-menu dropdown-menu-categories">${AKO.categories.map(c => `<li><a class="dropdown-item" href="#/courses?cat=${c.id}"><i class="fa-solid ${c.icon} me-2" style="color:${c.color}"></i>${c.name}</a></li>`).join('')}</ul>
              </li>
              <li class="nav-item"><a class="nav-link" href="#/courses">Kursları Keşfet</a></li>
            </ul>
            ${showSearch ? `<div class="header-search-wrap"><div class="header-search"><i class="fa-solid fa-search"></i><input type="text" id="globalSearch" placeholder="${t.search}" autocomplete="off"><div class="search-results" id="searchResults"></div></div></div>` : ''}
            <ul class="navbar-nav ms-auto align-items-center gap-1">
              <li class="nav-item d-none d-lg-block"><a class="nav-link" href="#/become-instructor">Eğitmen Ol</a></li>
              ${user ? `<li class="nav-item"><a class="nav-link" href="#/dashboard">Kurslarım</a></li>
                <li class="nav-item"><a class="nav-link" href="#/favorites"><i class="fa-regular fa-heart"></i></a></li>` : ''}
              <li class="nav-item"><button class="nav-icon-btn" id="btnCart" aria-label="Sepet"><i class="fa-solid fa-cart-shopping"></i>${cartCount ? `<span class="badge-count">${cartCount}</span>` : ''}</button></li>
              <li class="nav-item"><button class="nav-icon-btn" id="btnNotif" aria-label="Bildirimler"><i class="fa-regular fa-bell"></i><span class="badge-count notif-badge">2</span></button></li>
              <li class="nav-item"><button class="nav-icon-btn" id="btnTheme" aria-label="Tema"><i class="fa-solid fa-${Storage.getTheme() === 'dark' ? 'sun' : 'moon'}"></i></button></li>
              <li class="nav-item dropdown lang-dropdown">
                <button class="nav-icon-btn" data-bs-toggle="dropdown"><i class="fa-solid fa-globe"></i></button>
                <ul class="dropdown-menu dropdown-menu-end"><li><a class="dropdown-item lang-opt" data-lang="tr" href="#">🇹🇷 Türkçe</a></li><li><a class="dropdown-item lang-opt" data-lang="en" href="#">🇬🇧 English</a></li></ul>
              </li>
              ${user ? `<li class="nav-item dropdown">
                <button class="nav-profile-btn" data-bs-toggle="dropdown"><span class="avatar">${user.avatar || user.name[0]}</span></button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><span class="dropdown-header">${user.name}</span></li>
                  <li><a class="dropdown-item" href="#/dashboard"><i class="fa-solid fa-gauge me-2"></i>Panel</a></li>
                  <li><a class="dropdown-item" href="#/profile"><i class="fa-solid fa-user me-2"></i>Profil</a></li>
                  <li><a class="dropdown-item" href="#/messages"><i class="fa-solid fa-envelope me-2"></i>Mesajlar</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="#" id="btnLogout"><i class="fa-solid fa-right-from-bracket me-2"></i>Çıkış</a></li>
                </ul>
              </li>` : `<li class="nav-item"><a class="btn btn-outline-primary btn-sm ms-2" href="login.html">Giriş Yap</a></li>`}
            </ul>
          </div>
        </nav>
      </div>
    </header>`;
  },

  mobileNav() {
    return `<nav class="mobile-bottom-nav d-lg-none">
      <a href="#/" class="mob-nav-item"><i class="fa-solid fa-house"></i><span>Ana Sayfa</span></a>
      <a href="#/courses" class="mob-nav-item"><i class="fa-solid fa-compass"></i><span>Keşfet</span></a>
      <a href="#/dashboard" class="mob-nav-item"><i class="fa-solid fa-book-open"></i><span>Kurslarım</span></a>
      <a href="#/favorites" class="mob-nav-item"><i class="fa-regular fa-heart"></i><span>Favoriler</span></a>
      <a href="#/profile" class="mob-nav-item"><i class="fa-solid fa-user"></i><span>Profil</span></a>
    </nav>`;
  },

  footer() {
    return `<footer class="ako-footer">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-4"><img src="assets/images/logo.svg" alt="Akıllı Okul" height="40" class="mb-3"><p>${AKO.brand.description}</p><p class="slogan">${AKO.brand.slogan}</p></div>
          <div class="col-6 col-lg-2"><h6>Platform</h6><ul><li><a href="#/courses">Kurslar</a></li><li><a href="#/become-instructor">Eğitmen Ol</a></li><li><a href="#/certificate-verify">Sertifika Doğrula</a></li></ul></div>
          <div class="col-6 col-lg-2"><h6>Destek</h6><ul><li><a href="#">Yardım Merkezi</a></li><li><a href="#">SSS</a></li><li><a href="#">İletişim</a></li></ul></div>
          <div class="col-6 col-lg-2"><h6>Yasal</h6><ul><li><a href="#">Kullanım Koşulları</a></li><li><a href="#">Gizlilik</a></li><li><a href="#">KVKK</a></li></ul></div>
          <div class="col-6 col-lg-2"><h6>Sosyal</h6><div class="social-links"><a href="#"><i class="fa-brands fa-instagram"></i></a><a href="#"><i class="fa-brands fa-twitter"></i></a><a href="#"><i class="fa-brands fa-linkedin"></i></a><a href="#"><i class="fa-brands fa-youtube"></i></a></div></div>
        </div>
        <div class="footer-bottom"><p>© 2026 Akıllı Okul. Tüm hakları saklıdır.</p></div>
      </div>
    </footer>`;
  },

  toast(msg, type = 'success') {
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    const el = document.createElement('div');
    el.className = `ako-toast toast-${type}`;
    el.innerHTML = `<i class="fa-solid ${icons[type]}"></i><span>${msg}</span>`;
    document.getElementById('toastContainer').appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 3000);
  },

  modal(id, title, body, footer = '') {
    return `<div class="modal fade" id="${id}" tabindex="-1"><div class="modal-dialog modal-dialog-centered"><div class="modal-content">
      <div class="modal-header"><h5 class="modal-title">${title}</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
      <div class="modal-body">${body}</div>${footer ? `<div class="modal-footer">${footer}</div>` : ''}
    </div></div></div>`;
  },

  sidebar(role, active = '') {
    const menus = {
      student: [
        { section: 'Öğrenim', items: [
          { id: 'dashboard', icon: 'fa-gauge', label: 'Dashboard', href: '#/dashboard' },
          { id: 'my-courses', icon: 'fa-book', label: 'Kurslarım', href: '#/my-courses' },
          { id: 'in-progress', icon: 'fa-play', label: 'Devam Edenler', href: '#/my-courses?filter=progress' },
          { id: 'completed', icon: 'fa-check-circle', label: 'Tamamlananlar', href: '#/my-courses?filter=completed' },
          { id: 'favorites', icon: 'fa-heart', label: 'Favoriler', href: '#/favorites' },
          { id: 'certificates', icon: 'fa-certificate', label: 'Sertifikalar', href: '#/certificates' },
          { id: 'live', icon: 'fa-video', label: 'Canlı Dersler', href: '#/live-sessions' }
        ]},
        { section: 'Hesap', items: [
          { id: 'purchases', icon: 'fa-receipt', label: 'Satın Almalarım', href: '#/purchases' },
          { id: 'messages', icon: 'fa-envelope', label: 'Mesajlar', href: '#/messages' },
          { id: 'profile', icon: 'fa-user', label: 'Profil', href: '#/profile' }
        ]}
      ],
      instructor: [
        { section: 'Eğitmen', items: [
          { id: 'instructor-dash', icon: 'fa-gauge', label: 'Dashboard', href: '#/instructor' },
          { id: 'my-courses-i', icon: 'fa-book', label: 'Kurslarım', href: '#/instructor/courses' },
          { id: 'create-course', icon: 'fa-plus', label: 'Yeni Kurs', href: '#/instructor/create' },
          { id: 'live-i', icon: 'fa-video', label: 'Canlı Dersler', href: '#/instructor/live' },
          { id: 'earnings', icon: 'fa-wallet', label: 'Kazançlar', href: '#/instructor/earnings' },
          { id: 'analytics', icon: 'fa-chart-bar', label: 'Analitik', href: '#/instructor/analytics' },
          { id: 'ai-tools', icon: 'fa-robot', label: 'AI Araçları', href: '#/instructor/ai' }
        ]}
      ],
      admin: [
        { section: 'Dashboard', items: [{ id: 'admin-dash', icon: 'fa-gauge', label: 'Dashboard', href: '#/admin' }] },
        { section: 'Eğitim Yönetimi', items: [
          { id: 'admin-courses', icon: 'fa-book', label: 'Kurslar', href: '#/admin/courses' },
          { id: 'admin-categories', icon: 'fa-folder', label: 'Kategoriler', href: '#/admin/categories' },
          { id: 'admin-instructors', icon: 'fa-chalkboard-user', label: 'Eğitmenler', href: '#/admin/instructors' },
          { id: 'admin-students', icon: 'fa-users', label: 'Öğrenciler', href: '#/admin/students' },
          { id: 'admin-live', icon: 'fa-video', label: 'Canlı Dersler', href: '#/admin/live' },
          { id: 'admin-certs', icon: 'fa-certificate', label: 'Sertifikalar', href: '#/admin/certificates' }
        ]},
        { section: 'Satış', items: [
          { id: 'admin-orders', icon: 'fa-shopping-cart', label: 'Siparişler', href: '#/admin/orders' },
          { id: 'admin-coupons', icon: 'fa-tag', label: 'Kuponlar', href: '#/admin/coupons' },
          { id: 'admin-campaigns', icon: 'fa-bullhorn', label: 'Kampanyalar', href: '#/admin/campaigns' }
        ]},
        { section: 'Finans', items: [
          { id: 'admin-cash', icon: 'fa-cash-register', label: 'Kasa', href: '#/admin/cash' },
          { id: 'admin-payments', icon: 'fa-money-bill', label: 'Eğitmen Ödemeleri', href: '#/admin/payments' },
          { id: 'admin-commission', icon: 'fa-percent', label: 'Komisyonlar', href: '#/admin/commission' }
        ]},
        { section: 'Sistem', items: [
          { id: 'admin-users', icon: 'fa-user-shield', label: 'Kullanıcılar', href: '#/admin/users' },
          { id: 'admin-settings', icon: 'fa-gear', label: 'Ayarlar', href: '#/admin/settings' },
          { id: 'admin-logs', icon: 'fa-list', label: 'Sistem Logları', href: '#/admin/logs' }
        ]}
      ],
      finance: [
        { section: 'Finans', items: [
          { id: 'finance-dash', icon: 'fa-gauge', label: 'Dashboard', href: '#/finance' },
          { id: 'finance-cash', icon: 'fa-cash-register', label: 'Kasa', href: '#/admin/cash' },
          { id: 'finance-payments', icon: 'fa-money-bill', label: 'Ödemeler', href: '#/admin/payments' }
        ]}
      ]
    };
    const menu = menus[role] || menus.student;
    return `<aside class="ako-sidebar d-none d-lg-block"><nav>${menu.map(s => `
      <div class="sidebar-section"><div class="sidebar-section-title">${s.section}</div>
      ${s.items.map(i => `<a href="${i.href}" class="sidebar-link ${active === i.id ? 'active' : ''}"><i class="fa-solid ${i.icon}"></i>${i.label}</a>`).join('')}
      </div>`).join('')}</nav></aside>`;
  },

  kpiCard(label, value, icon, color = 'primary', change = '') {
    return `<div class="kpi-card kpi-${color}"><div class="kpi-icon"><i class="fa-solid ${icon}"></i></div><div class="kpi-body"><div class="kpi-value">${value}</div><div class="kpi-label">${label}</div>${change ? `<div class="kpi-change">${change}</div>` : ''}</div></div>`;
  },

  table(headers, rows, opts = {}) {
    return `<div class="table-responsive"><table class="table ako-table ${opts.className || ''}"><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.length ? rows.join('') : `<tr><td colspan="${headers.length}" class="text-center text-muted py-4">Kayıt bulunamadı</td></tr>`}</tbody></table></div>`;
  },

  aiAssistant() {
    return `<div class="ai-assistant" id="aiAssistant">
      <button class="ai-fab" id="aiFab"><i class="fa-solid fa-wand-magic-sparkles"></i> Akıllı Asistan</button>
      <div class="ai-panel" id="aiPanel">
        <div class="ai-header"><span>🤖 Akıllı Asistan</span><button id="aiClose"><i class="fa-solid fa-times"></i></button></div>
        <div class="ai-body"><p>Merhaba 👋 Eğitimlerinde sana yardımcı olabilirim.</p>
          <div class="ai-actions">
            <button class="ai-action-btn" data-action="summarize">Bu konuyu özetle</button>
            <button class="ai-action-btn" data-action="quiz">Bana quiz hazırla</button>
            <button class="ai-action-btn" data-action="schedule">Çalışma programı oluştur</button>
            <button class="ai-action-btn" data-action="explain">Anlamadığım yeri açıkla</button>
            <button class="ai-action-btn" data-action="notes">Ders notu oluştur</button>
          </div>
          <div class="ai-response" id="aiResponse"></div>
        </div>
      </div>
    </div>`;
  },

  cartDrawer() {
    const cart = Storage.getCart();
    const total = cart.reduce((s, c) => s + c.price, 0);
    return `<div class="offcanvas offcanvas-end" id="cartDrawer" tabindex="-1">
      <div class="offcanvas-header"><h5>Sepetim (${cart.length})</h5><button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button></div>
      <div class="offcanvas-body">${cart.length ? cart.map(c => `<div class="cart-item" data-id="${c.id}">
        <div><strong>${c.title}</strong><br><small class="text-muted">${c.instructor}</small></div>
        <div class="text-end"><div class="price-current">₺${c.price}</div><button class="btn btn-sm btn-link text-danger btn-remove-cart" data-id="${c.id}"><i class="fa-solid fa-trash"></i></button></div>
      </div>`).join('') : '<p class="text-muted text-center py-4">Sepetiniz boş</p>'}
      </div>
      ${cart.length ? `<div class="offcanvas-footer"><div class="cart-total">Toplam: <strong>₺${total.toLocaleString('tr-TR')}</strong></div>
        <a href="#/checkout" class="btn btn-primary w-100" data-bs-dismiss="offcanvas">Ödemeye Geç</a></div>` : ''}
    </div>`;
  },

  notifDrawer() {
    return `<div class="offcanvas offcanvas-end" id="notifDrawer" tabindex="-1">
      <div class="offcanvas-header"><h5>Bildirimler</h5><button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button></div>
      <div class="offcanvas-body">${AKO.notifications.map(n => `<div class="notif-item ${n.read ? '' : 'unread'}"><p>${n.text}</p><small>${n.time}</small></div>`).join('')}</div>
    </div>`;
  }
};
