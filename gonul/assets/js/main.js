// ============================================
// GÖNÜL BAĞLARI - Ana JavaScript Dosyası
// ============================================

document.addEventListener('DOMContentLoaded', function () {

  // ---- Hamburger Menu ----
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
      }
    });
  }

  // ---- Active Nav Link ----
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.split('/').pop() === currentPath) {
      link.classList.add('active');
    }
  });

  // ---- Filter Tabs ----
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', function () {
      const group = this.closest('.filter-tabs');
      group.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.filter;
      const container = document.getElementById('filteredContent');
      if (!container) return;
      container.querySelectorAll('[data-category]').forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ---- Toast Notification ----
  window.showToast = function (msg, type = 'success') {
    let toast = document.getElementById('globalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'globalToast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.className = `toast toast-${type} show`;
    toast.innerHTML = (type === 'success' ? '✅' : '❌') + ' ' + msg;
    setTimeout(() => toast.classList.remove('show'), 3500);
  };

  // ---- Form Validation ----
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#c0392b';
          valid = false;
        } else {
          input.style.borderColor = '';
        }
      });
      if (valid) {
        const msg = form.dataset.successMsg || 'İşlem başarılı!';
        showToast(msg);
        form.reset();
      } else {
        showToast('Lütfen tüm alanları doldurun.', 'error');
      }
    });
  });

  // ---- Search ----
  document.querySelectorAll('.search-bar').forEach(bar => {
    const input = bar.querySelector('input');
    const btn = bar.querySelector('button');
    if (!input || !btn) return;
    function doSearch() {
      const query = input.value.trim().toLowerCase();
      const container = document.getElementById('searchResults');
      if (!container) return;
      container.querySelectorAll('[data-searchable]').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = (!query || text.includes(query)) ? '' : 'none';
      });
    }
    btn.addEventListener('click', doSearch);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });
  });

  // ---- Scroll Animations ----
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.card, .feature-item, .stat-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

  // ---- Counter Animation ----
  document.querySelectorAll('.counter').forEach(counter => {
    const target = parseInt(counter.dataset.target);
    let current = 0;
    const step = Math.ceil(target / 60);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(interval); }
      counter.textContent = current.toLocaleString('tr-TR');
    }, 30);
  });

  // ---- Tabs ----
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const container = this.closest('.tabs-wrapper') || document;
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      const target = document.getElementById(this.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

});
