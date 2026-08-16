/* Core store, helpers, router, shell */
window.REMS = window.REMS || {};

REMS.Store = {
  data: null,
  load() {
    try {
      const raw = localStorage.getItem(REMS.CONST.STORAGE_KEY);
      if (raw) {
        this.data = JSON.parse(raw);
        return this.data;
      }
    } catch (e) {
      console.warn('localStorage okunamadı, seed yükleniyor', e);
    }
    this.data = REMS.generateSeed();
    this.save();
    return this.data;
  },
  save() {
    localStorage.setItem(REMS.CONST.STORAGE_KEY, JSON.stringify(this.data));
  },
  reset() {
    localStorage.removeItem(REMS.CONST.STORAGE_KEY);
    this.data = REMS.generateSeed();
    this.save();
    return this.data;
  },
  nextCode(type) {
    if (type === 'property') {
      this.data.counters.property += 1;
      this.save();
      return `PRT-2026-${String(this.data.counters.property).padStart(6, '0')}`;
    }
    if (type === 'cash') {
      this.data.counters.cash += 1;
      this.save();
      return `KSH-2026-${this.data.counters.cash}`;
    }
    if (type === 'offer') {
      this.data.counters.offer += 1;
      this.save();
      return `of-${this.data.counters.offer}`;
    }
    if (type === 'lead') {
      this.data.counters.lead += 1;
      this.save();
      return `ld-${this.data.counters.lead}`;
    }
    return `${type}-${Date.now()}`;
  }
};

REMS.fmt = {
  money(n, currency = 'TRY') {
    if (n == null || isNaN(n)) return '—';
    const v = Number(n);
    if (currency === 'TRY' || !currency) {
      return '₺' + v.toLocaleString('tr-TR', { maximumFractionDigits: 0 });
    }
    return v.toLocaleString('tr-TR') + ' ' + currency;
  },
  date(d) {
    if (!d) return '—';
    const p = String(d).slice(0, 10).split('-');
    if (p.length === 3) return `${p[2]}.${p[1]}.${p[0]}`;
    return d;
  },
  phone(p) { return p || '—'; },
  pct(n) { return `%${Math.round(n)}`; }
};

REMS.uid = (prefix = 'id') => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 999)}`;

REMS.toast = function (message, type = 'success') {
  const stack = document.getElementById('toastStack');
  if (!stack) return;
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  stack.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(20px)';
    setTimeout(() => el.remove(), 220);
  }, 2800);
};

REMS.log = function (action, detail = '') {
  const d = REMS.Store.data;
  d.activityLogs.unshift({
    id: REMS.uid('log'),
    at: new Date().toISOString().slice(0, 16).replace('T', ' '),
    user: d.currentUser.name,
    action,
    detail
  });
  REMS.Store.save();
};

REMS.notify = function (title, body, type = 'info') {
  REMS.Store.data.notifications.unshift({
    id: REMS.uid('nt'),
    title,
    body,
    type,
    read: false,
    at: new Date().toISOString().slice(0, 16).replace('T', ' ')
  });
  REMS.Store.save();
  REMS.UI.updateNotifBadge();
};

REMS.find = {
  agent: (id) => REMS.Store.data.agents.find(a => a.id === id),
  branch: (id) => REMS.Store.data.branches.find(b => b.id === id),
  owner: (id) => REMS.Store.data.owners.find(o => o.id === id),
  customer: (id) => REMS.Store.data.customers.find(c => c.id === id),
  property: (id) => REMS.Store.data.properties.find(p => p.id === id),
  lead: (id) => REMS.Store.data.leads.find(l => l.id === id)
};

REMS.cover = function (prop) {
  if (!prop || !prop.photos || !prop.photos.length) {
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&h=600&q=80';
  }
  const cover = prop.photos.find(p => p.isCover) || prop.photos[0];
  return cover.url;
};

REMS.matchProperties = function (request) {
  const props = REMS.Store.data.properties.filter(p =>
    ['Aktif', 'Yeni', 'Teklif Var', 'Opsiyonlu'].includes(p.status)
  );
  const results = [];
  props.forEach(p => {
    let score = 0;
    // İşlem tipi
    if (p.transactionType === request.transactionType) score += 25;
    else score += 5;
    // Tür
    if (!request.propertyType || p.propertyType === request.propertyType) score += 15;
    else if (['Daire', 'Rezidans'].includes(p.propertyType) && ['Daire', 'Rezidans'].includes(request.propertyType)) score += 10;
    // Bölge
    const loc = `${p.address.ilce} ${p.address.mahalle}`.toLocaleLowerCase('tr-TR');
    const distOk = (request.districts || []).some(d => {
      const dd = String(d).toLocaleLowerCase('tr-TR');
      return loc.includes(dd) || dd.includes(p.address.ilce.toLocaleLowerCase('tr-TR'));
    });
    if (distOk) score += 20;
    // Oda
    const rooms = p.housing?.rooms || '';
    const roomOk = !(request.rooms || []).length || (request.rooms || []).some(r => {
      const rr = String(r).trim();
      return rooms === rr || rooms.startsWith(rr.split('+')[0] + '+');
    });
    if (roomOk) score += 15;
    // Bütçe
    const price = p.currentPrice;
    if (price >= (request.budgetMin || 0) && price <= (request.budgetMax || Infinity)) score += 15;
    else if (price >= (request.budgetMin || 0) * 0.9 && price <= (request.budgetMax || Infinity) * 1.1) score += 8;
    // m²
    const m2 = p.housing?.brutM2 || p.land?.m2 || 0;
    if (m2 >= (request.minM2 || 0) && m2 <= (request.maxM2 || Infinity)) score += 10;
    else if (m2 >= (request.minM2 || 0) * 0.85) score += 5;

    const pct = Math.min(100, Math.round(score));
    if (pct >= 55) results.push({ property: p, score: pct });
  });
  return results.sort((a, b) => b.score - a.score);
};

REMS.calcCommission = function (price, rate = 2, withVat = true) {
  let base = price * (rate / 100);
  if (withVat) base = base * 1.2;
  return Math.round(base);
};

REMS.UI = {
  icons() {
    if (window.lucide) lucide.createIcons();
  },
  openModal(html, opts = {}) {
    const overlay = document.getElementById('overlay');
    const modal = document.getElementById('modal');
    modal.className = `modal open ${opts.size || ''}`;
    modal.innerHTML = html;
    overlay.classList.add('open');
    this.icons();
    this.bindClose();
  },
  openDrawer(html, opts = {}) {
    const overlay = document.getElementById('overlay');
    const drawer = document.getElementById('drawer');
    drawer.className = `drawer open ${opts.size || ''}`;
    drawer.innerHTML = html;
    overlay.classList.add('open');
    this.icons();
    this.bindClose();
  },
  closeOverlays() {
    document.getElementById('overlay')?.classList.remove('open');
    document.getElementById('modal')?.classList.remove('open');
    document.getElementById('drawer')?.classList.remove('open');
    document.getElementById('cmdk')?.classList.remove('open');
    document.getElementById('notifPanel')?.classList.remove('open');
    document.getElementById('profileMenu')?.classList.remove('open');
  },
  bindClose() {
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.onclick = () => this.closeOverlays();
    });
  },
  updateNotifBadge() {
    const unread = REMS.Store.data.notifications.filter(n => !n.read).length;
    const dot = document.getElementById('notifDot');
    if (dot) dot.style.display = unread ? 'block' : 'none';
    const count = document.getElementById('navNotifCount');
    if (count) {
      count.textContent = unread || '';
      count.style.display = unread ? 'inline-flex' : 'none';
    }
  },
  updateUserChip() {
    const u = REMS.Store.data.currentUser;
    const branch = REMS.find.branch(u.branchId);
    const chip = document.getElementById('userChip');
    if (!chip) return;
    chip.querySelector('.avatar').textContent = u.avatar || u.name.slice(0, 2).toUpperCase();
    chip.querySelector('.user-meta strong').textContent = u.name;
    chip.querySelector('.user-meta span').textContent = `${u.role} · ${branch?.name || ''}`;
  },
  empty(title, desc, actionLabel, actionFn) {
    const id = REMS.uid('empty');
    setTimeout(() => {
      const btn = document.getElementById(id);
      if (btn && actionFn) btn.onclick = actionFn;
    }, 0);
    return `<div class="empty-state">
      <i data-lucide="inbox" style="width:40px;height:40px;margin:0 auto;color:var(--muted)"></i>
      <h3>${title}</h3>
      <p>${desc || ''}</p>
      ${actionLabel ? `<button class="btn btn-primary" id="${id}">${actionLabel}</button>` : ''}
    </div>`;
  },
  statusBadge(status) {
    const map = {
      'Aktif': 'success', 'Yeni': 'info', 'Satıldı': 'primary', 'Kiralandı': 'accent',
      'Opsiyonlu': 'warning', 'Teklif Var': 'warning', 'Pasif': '', 'Yetki Bitti': 'danger',
      'Arşiv': '', 'Kazanıldı': 'success', 'Kaybedildi': 'danger', 'Bekliyor': 'warning',
      'Ödendi': 'success', 'Gecikti': 'danger', 'Tamamlandı': 'success', 'Planlandı': 'info',
      'Devam Ediyor': 'info', 'Yapılacak': 'warning', 'Kabul': 'success', 'Red': 'danger',
      'Pazarlık': 'warning', 'Nitelikli': 'primary'
    };
    return `<span class="badge badge-${map[status] || ''}">${status}</span>`;
  }
};

REMS.Router = {
  current: 'dashboard',
  go(route, params = {}) {
    this.current = route;
    this.params = params;
    location.hash = route + (params.id ? '/' + params.id : '');
    this.render();
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.route === route);
    });
    document.querySelectorAll('.mobile-nav button').forEach(el => {
      el.classList.toggle('active', el.dataset.route === route);
    });
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebarBackdrop')?.classList.remove('open');
    window.scrollTo(0, 0);
  },
  parse() {
    const hash = (location.hash || '#dashboard').slice(1);
    const [route, id] = hash.split('/');
    this.current = route || 'dashboard';
    this.params = id ? { id } : {};
    this.render();
  },
  render() {
    const root = document.getElementById('appContent');
    if (!root) return;
    REMS.UI.closeOverlays();
    const map = {
      dashboard: () => REMS.Pages.dashboard(),
      properties: () => REMS.Properties.list(),
      'property-detail': () => REMS.Properties.detail(REMS.Router.params.id),
      map: () => REMS.Maps.portfolioMap(),
      calendar: () => REMS.Appointments.calendar(),
      leads: () => REMS.Leads.pipeline(),
      'leads-list': () => REMS.Leads.list(),
      customers: () => REMS.CRM.customers(),
      owners: () => REMS.CRM.owners(),
      requests: () => REMS.CRM.requests(),
      appointments: () => REMS.Appointments.list(),
      showings: () => REMS.Appointments.showings(),
      offers: () => REMS.CRM.offers(),
      sales: () => REMS.Contracts.sales(),
      rentals: () => REMS.Contracts.rentals(),
      tenants: () => REMS.Contracts.tenants(),
      rents: () => REMS.Finance.rents(),
      deposits: () => REMS.Finance.deposits(),
      contracts: () => REMS.Contracts.list(),
      collections: () => REMS.Finance.collections(),
      commissions: () => REMS.Finance.commissions(),
      primes: () => REMS.Finance.primes(),
      cash: () => REMS.Finance.cash(),
      income: () => REMS.Finance.incomeExpense(),
      accounts: () => REMS.Finance.accounts(),
      tasks: () => REMS.Pages.tasks(),
      documents: () => REMS.Pages.documents(),
      messages: () => REMS.Messages.view(),
      notifications: () => REMS.Pages.notifications(),
      agents: () => REMS.Pages.agents(),
      branches: () => REMS.Pages.branches(),
      users: () => REMS.Pages.users(),
      roles: () => REMS.Pages.roles(),
      'report-portfolio': () => REMS.Reports.portfolio(),
      'report-lead': () => REMS.Reports.leads(),
      'report-agent': () => REMS.Reports.agents(),
      'report-finance': () => REMS.Reports.finance(),
      'report-region': () => REMS.Reports.region(),
      'report-branch': () => REMS.Reports.branch(),
      settings: () => REMS.Pages.settings(),
      integrations: () => REMS.Pages.integrations(),
      logs: () => REMS.Pages.logs(),
      field: () => REMS.Pages.fieldTeam(),
      advisor: () => REMS.Pages.advisorMobile(),
      'quick-property': () => REMS.Properties.quickWizard(),
      compare: () => REMS.Properties.compare(),
      share: () => REMS.Properties.sharePage(REMS.Router.params.id),
      profile: () => REMS.Pages.profile(),
      scenario: () => REMS.Pages.scenario()
    };
    const fn = map[this.current] || map.dashboard;
    try {
      root.innerHTML = `<div class="fade-in">${fn()}</div>`;
      REMS.UI.icons();
      if (typeof REMS.afterRender === 'function') REMS.afterRender(this.current);
    } catch (err) {
      console.error(err);
      root.innerHTML = `<div class="card card-body"><h3>Sayfa yüklenirken hata</h3><p class="text-muted">${err.message}</p></div>`;
    }
  }
};

REMS.Pages = {};

REMS.Pages.dashboard = function () {
  const d = REMS.Store.data;
  const props = d.properties;
  const active = props.filter(p => ['Aktif', 'Yeni', 'Teklif Var', 'Opsiyonlu'].includes(p.status));
  const sale = active.filter(p => p.transactionType === 'Satılık').length;
  const rent = active.filter(p => p.transactionType === 'Kiralık').length;
  const newLeads = d.leads.filter(l => l.status === 'Yeni' || l.createdAt >= '2026-08-10').length;
  const todayAppts = d.appointments.filter(a => a.date === '2026-08-16' || a.date === new Date().toISOString().slice(0, 10)).length;
  const showings = d.appointments.filter(a => a.type === 'Yer Gösterme' && a.status === 'Planlandı').length;
  const pendingOffers = d.offers.filter(o => ['Bekliyor', 'Pazarlık'].includes(o.status)).length;
  const inContract = d.sales.filter(s => s.status === 'Devam').length + d.rentals.filter(r => r.step < 8).length;
  const monthSales = d.properties.filter(p => p.status === 'Satıldı').length + d.sales.filter(s => s.status === 'Kapandı').length;
  const monthRent = d.properties.filter(p => p.status === 'Kiralandı').length;
  const delayed = d.rentals.flatMap(r => r.payments.filter(p => p.status === 'Gecikti'));
  const pendingCollect = delayed.reduce((s, p) => s + p.amount, 0) + d.offers.filter(o => o.status === 'Kabul').length * 50000;
  const totalComm = d.commissions.reduce((s, c) => s + c.amount, 0) + 1285000;

  const kpis = [
    { label: 'Toplam Aktif Portföy', value: active.length, icon: 'building-2', sub: '+12 bu ay' },
    { label: 'Satılık Portföy', value: sale, icon: 'home', sub: '' },
    { label: 'Kiralık Portföy', value: rent, icon: 'key', sub: '' },
    { label: 'Yeni Lead', value: newLeads, icon: 'user-plus', sub: '+8 bugün' },
    { label: 'Bugünkü Randevu', value: Math.max(todayAppts, 4), icon: 'calendar', sub: '' },
    { label: 'Yer Gösterme', value: showings || 6, icon: 'map-pin', sub: '' },
    { label: 'Teklif Bekleyen', value: pendingOffers, icon: 'handshake', sub: '' },
    { label: 'Sözleşme Aşamasında', value: inContract || 5, icon: 'file-text', sub: '' },
    { label: 'Bu Ay Satış', value: monthSales || 14, icon: 'badge-check', sub: '' },
    { label: 'Bu Ay Kiralama', value: monthRent || 11, icon: 'home', sub: '' },
    { label: 'Bekleyen Tahsilat', value: REMS.fmt.money(pendingCollect || 84500), icon: 'wallet', sub: `${delayed.length} geciken` },
    { label: 'Toplam Komisyon', value: REMS.fmt.money(totalComm), icon: 'coins', sub: 'Bu ay ₺1.285.000' }
  ];

  setTimeout(() => {
    REMS.Reports.renderDashboardCharts();
    REMS.UI.icons();
  }, 50);

  const delayedHtml = delayed.slice(0, 5).map(p => {
    const rental = d.rentals.find(r => r.payments.includes(p));
    const cust = rental ? REMS.find.customer(rental.customerId) : null;
    return `<div class="stat-row">
      <div><strong>${p.tenantName || cust?.name || 'Kiracı'}</strong><div class="text-muted" style="font-size:11px">${p.daysLate || 3} gün gecikti</div></div>
      <span class="badge badge-danger">${REMS.fmt.money(p.amount)}</span>
    </div>`;
  }).join('') || '<p class="text-muted">Geciken tahsilat yok.</p>';

  const topAgents = [...d.agents].filter(a => a.role.includes('Danışman') || a.sales > 0)
    .sort((a, b) => b.performance - a.performance).slice(0, 5)
    .map(a => `<div class="agent-row">
      <div class="avatar">${a.avatar}</div>
      <div style="flex:1"><strong>${a.name}</strong><div class="text-muted" style="font-size:11px">Satış ${a.sales} · Kiralama ${a.rentals}</div>
      <div class="bar mt-16" style="margin-top:6px"><span style="width:${a.performance}%"></span></div></div>
      <div style="text-align:right"><strong>${a.performance}</strong><div class="text-muted" style="font-size:11px">${REMS.fmt.money(a.commission)}</div></div>
    </div>`).join('');

  return `
  <div class="page-header">
    <div>
      <h1>Operasyon Merkezi</h1>
      <p>Portföy, lead, randevu, teklif ve tahsilatların tek bakışta yönetimi</p>
    </div>
    <div class="page-actions">
      <button class="btn btn-outline" onclick="REMS.Router.go('scenario')"><i data-lucide="play"></i> Senaryo Demo</button>
      <button class="btn btn-outline" onclick="REMS.Router.go('advisor')"><i data-lucide="smartphone"></i> Danışman Paneli</button>
      <button class="btn btn-primary" onclick="REMS.Properties.openCreate()"><i data-lucide="plus"></i> Yeni Portföy</button>
    </div>
  </div>
  <div class="kpi-grid">
    ${kpis.map((k, i) => `<div class="kpi-card" style="animation-delay:${i * 0.03}s">
      <div class="kpi-icon"><i data-lucide="${k.icon}"></i></div>
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value">${k.value}</div>
      ${k.sub ? `<div class="kpi-sub">${k.sub}</div>` : ''}
    </div>`).join('')}
  </div>
  <div class="grid-2 mt-16">
    <div class="card"><div class="card-header"><h3>Satış / Kiralama (12 Ay)</h3></div><div class="card-body"><canvas id="chartSalesRent" height="140"></canvas></div></div>
    <div class="card"><div class="card-header"><h3>Lead Funnel</h3></div><div class="card-body"><canvas id="chartFunnel" height="140"></canvas></div></div>
  </div>
  <div class="grid-3 mt-16">
    <div class="card"><div class="card-header"><h3>Portföy Dağılımı</h3></div><div class="card-body"><canvas id="chartPortfolio" height="160"></canvas></div></div>
    <div class="card"><div class="card-header"><h3>Danışman Performansı</h3></div><div class="card-body">${topAgents}</div></div>
    <div class="card"><div class="card-header"><h3>Geciken Tahsilatlar</h3><span class="badge badge-danger">${delayed.length} Geciken</span></div>
      <div class="card-body">${delayedHtml}
        <button class="btn btn-outline btn-sm mt-16" onclick="REMS.Router.go('rents')">Kira Takibine Git</button>
      </div>
    </div>
  </div>
  <div class="grid-2 mt-16">
    <div class="card"><div class="card-header"><h3>Son Aktiviteler</h3></div><div class="card-body">
      ${d.activityLogs.slice(0, 6).map(l => `<div class="stat-row"><div><strong>${l.user}</strong><div class="text-muted" style="font-size:11px">${l.at} · ${l.action}</div></div><span class="text-muted" style="font-size:12px">${l.detail || ''}</span></div>`).join('')}
    </div></div>
    <div class="card"><div class="card-header"><h3>Bugünkü Randevular</h3></div><div class="card-body">
      ${d.appointments.filter(a => a.date >= '2026-08-16').slice(0, 6).map(a => {
        const c = REMS.find.customer(a.customerId);
        const p = REMS.find.property(a.propertyId);
        return `<div class="stat-row"><div><strong>${a.time} · ${a.type}</strong><div class="text-muted" style="font-size:11px">${c?.name || ''} · ${p?.code || ''}</div></div>${REMS.UI.statusBadge(a.status)}</div>`;
      }).join('')}
    </div></div>
  </div>`;
};

REMS.Pages.tasks = function () {
  const tasks = REMS.Store.data.tasks;
  return `
  <div class="page-header"><div><h1>Görevler</h1><p>Danışman ve operasyon görev takibi</p></div>
  <div class="page-actions"><button class="btn btn-primary" onclick="REMS.Pages.openTaskForm()"><i data-lucide="plus"></i> Görev Ekle</button></div></div>
  <div class="card"><div class="table-wrap"><table class="data"><thead><tr>
    <th>Görev</th><th>Danışman</th><th>Portföy</th><th>Termin</th><th>Öncelik</th><th>Durum</th><th></th>
  </tr></thead><tbody>
  ${tasks.map(t => {
    const a = REMS.find.agent(t.agentId);
    const p = REMS.find.property(t.propertyId);
    return `<tr>
      <td><strong>${t.title}</strong></td>
      <td>${a?.name || '—'}</td>
      <td>${p?.code || '—'}</td>
      <td>${REMS.fmt.date(t.due)}</td>
      <td>${t.priority}</td>
      <td>${REMS.UI.statusBadge(t.status)}</td>
      <td><button class="btn btn-sm btn-outline" onclick="REMS.Pages.cycleTask('${t.id}')">Durum Değiştir</button></td>
    </tr>`;
  }).join('')}
  </tbody></table></div></div>`;
};

REMS.Pages.cycleTask = function (id) {
  const t = REMS.Store.data.tasks.find(x => x.id === id);
  if (!t) return;
  const order = ['Yapılacak', 'Devam Ediyor', 'Tamamlandı', 'Gecikti'];
  t.status = order[(order.indexOf(t.status) + 1) % order.length];
  REMS.Store.save();
  REMS.toast('Görev durumu güncellendi');
  REMS.Router.render();
};

REMS.Pages.openTaskForm = function () {
  const agents = REMS.Store.data.agents;
  const props = REMS.Store.data.properties.slice(0, 30);
  REMS.UI.openModal(`
    <div class="modal-header"><h2>Yeni Görev</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
    <div class="modal-body"><div class="form-grid">
      <div class="form-group full"><label>Görev</label><input class="form-control" id="tkTitle" placeholder="Mülk sahibini ara"></div>
      <div class="form-group"><label>Danışman</label><select class="form-control" id="tkAgent">${agents.map(a => `<option value="${a.id}">${a.name}</option>`).join('')}</select></div>
      <div class="form-group"><label>Portföy</label><select class="form-control" id="tkProp">${props.map(p => `<option value="${p.id}">${p.code}</option>`).join('')}</select></div>
      <div class="form-group"><label>Termin</label><input type="date" class="form-control" id="tkDue" value="2026-08-20"></div>
      <div class="form-group"><label>Öncelik</label><select class="form-control" id="tkPri"><option>Yüksek</option><option selected>Orta</option><option>Düşük</option></select></div>
    </div></div>
    <div class="modal-footer"><button class="btn btn-outline" data-close>İptal</button>
    <button class="btn btn-primary" onclick="REMS.Pages.saveTask()">Kaydet</button></div>`);
};

REMS.Pages.saveTask = function () {
  const title = document.getElementById('tkTitle').value.trim();
  if (!title) return REMS.toast('Lütfen görev başlığını giriniz.', 'error');
  REMS.Store.data.tasks.unshift({
    id: REMS.uid('tk'), title,
    agentId: document.getElementById('tkAgent').value,
    propertyId: document.getElementById('tkProp').value,
    due: document.getElementById('tkDue').value,
    status: 'Yapılacak',
    priority: document.getElementById('tkPri').value
  });
  REMS.Store.save();
  REMS.UI.closeOverlays();
  REMS.toast('Görev oluşturuldu');
  REMS.Router.go('tasks');
};

REMS.Pages.documents = function () {
  const docs = REMS.Store.data.properties.flatMap(p =>
    (p.documents || []).map(d => ({ ...d, property: p }))
  );
  return `
  <div class="page-header"><div><h1>Belgeler</h1><p>Portföy evrakları ve önizleme</p></div>
  <button class="btn btn-primary" onclick="REMS.Pages.uploadDoc()"><i data-lucide="upload"></i> Belge Yükle</button></div>
  <div class="card"><div class="table-wrap"><table class="data"><thead><tr>
    <th>Dosya</th><th>Kategori</th><th>Portföy</th><th>Yükleyen</th><th>Tarih</th><th></th>
  </tr></thead><tbody>
  ${docs.map(d => `<tr>
    <td><strong>${d.name}</strong></td><td>${d.category}</td><td>${d.property.code}</td>
    <td>${d.uploader}</td><td>${REMS.fmt.date(d.date)}</td>
    <td><button class="btn btn-sm btn-outline" onclick="REMS.Pages.previewDoc('${d.name}','${d.category}')">Önizle</button></td>
  </tr>`).join('')}
  </tbody></table></div></div>`;
};

REMS.Pages.previewDoc = function (name, category) {
  REMS.UI.openModal(`
    <div class="modal-header"><h2>Belge Önizleme</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
    <div class="modal-body">
      <div class="print-doc" style="background:var(--bg-soft);border-radius:12px;padding:24px;min-height:320px">
        <h3>${category}</h3>
        <p class="text-muted">${name}</p>
        <hr style="margin:16px 0;border:none;border-top:1px solid var(--border)">
        <p>Bu demo belgesi ${category} kategorisinde örnek önizlemedir. Gerçek uygulamada PDF/görsel S3 üzerinden sunulur.</p>
        <p style="margin-top:24px">EmlakPro Gayrimenkul — Resmi Evrak Önizlemesi</p>
      </div>
    </div>
    <div class="modal-footer"><button class="btn btn-outline" onclick="window.print()"><i data-lucide="printer"></i> Yazdır</button>
    <button class="btn btn-primary" data-close>Kapat</button></div>`, { size: 'wide' });
};

REMS.Pages.uploadDoc = function () {
  REMS.UI.openModal(`
    <div class="modal-header"><h2>Belge Yükle</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
    <div class="modal-body"><div class="form-grid">
      <div class="form-group"><label>Portföy</label><select class="form-control" id="docProp">${REMS.Store.data.properties.slice(0, 40).map(p => `<option value="${p.id}">${p.code}</option>`).join('')}</select></div>
      <div class="form-group"><label>Kategori</label><select class="form-control" id="docCat">
        ${['Tapu','Kimlik','Yetki Belgesi','İmar Belgesi','Ruhsat','Ekspertiz','DASK','Kira Sözleşmesi','Satış Sözleşmesi','Yer Gösterme Formu','Diğer'].map(c => `<option>${c}</option>`).join('')}
      </select></div>
      <div class="form-group full"><label>Dosya</label><input type="file" class="form-control" id="docFile" accept=".pdf,image/*"></div>
    </div></div>
    <div class="modal-footer"><button class="btn btn-outline" data-close>İptal</button>
    <button class="btn btn-primary" onclick="REMS.Pages.saveDoc()">Yükle</button></div>`);
};

REMS.Pages.saveDoc = function () {
  const prop = REMS.find.property(document.getElementById('docProp').value);
  const file = document.getElementById('docFile').files[0];
  const cat = document.getElementById('docCat').value;
  if (!file) return REMS.toast('Lütfen bir dosya seçiniz.', 'error');
  prop.documents = prop.documents || [];
  prop.documents.unshift({
    id: REMS.uid('doc'),
    name: file.name,
    category: cat,
    uploader: REMS.Store.data.currentUser.name,
    date: new Date().toISOString().slice(0, 10),
    type: file.type.includes('image') ? 'image' : 'pdf'
  });
  REMS.Store.save();
  REMS.log('Belge yüklendi', `${prop.code} · ${file.name}`);
  REMS.UI.closeOverlays();
  REMS.toast('Belge yüklendi');
  REMS.Router.go('documents');
};

REMS.Pages.notifications = function () {
  const list = REMS.Store.data.notifications;
  return `
  <div class="page-header"><div><h1>Bildirimler</h1><p>Sistem uyarıları ve mentionlar</p></div>
  <button class="btn btn-outline" onclick="REMS.Pages.markAllRead()">Tümünü Okundu İşaretle</button></div>
  <div class="card">${list.map(n => `
    <div class="notif-item ${n.read ? '' : 'unread'}" onclick="REMS.Pages.readNotif('${n.id}')">
      <strong>${n.title}</strong>
      <p>${n.body}</p>
      <div class="text-muted" style="font-size:11px;margin-top:4px">${n.at}</div>
    </div>`).join('')}</div>`;
};

REMS.Pages.readNotif = function (id) {
  const n = REMS.Store.data.notifications.find(x => x.id === id);
  if (n) { n.read = true; REMS.Store.save(); REMS.UI.updateNotifBadge(); REMS.Router.render(); }
};

REMS.Pages.markAllRead = function () {
  REMS.Store.data.notifications.forEach(n => n.read = true);
  REMS.Store.save();
  REMS.UI.updateNotifBadge();
  REMS.toast('Tüm bildirimler okundu');
  REMS.Router.render();
};

REMS.Pages.agents = function () {
  const agents = REMS.Store.data.agents;
  return `
  <div class="page-header"><div><h1>Danışmanlar</h1><p>Performans ve portföy dağılımı</p></div></div>
  <div class="prop-grid">${agents.map(a => {
    const branch = REMS.find.branch(a.branchId);
    const props = REMS.Store.data.properties.filter(p => p.agentId === a.id).length;
    return `<div class="card card-body">
      <div class="flex-center gap-8 mb-16"><div class="avatar" style="width:48px;height:48px;font-size:14px">${a.avatar}</div>
      <div><strong>${a.name}</strong><div class="text-muted" style="font-size:12px">${a.role} · ${branch?.name || ''}</div></div></div>
      <div class="stat-row"><span>Performans</span><strong>${a.performance}/100</strong></div>
      <div class="stat-row"><span>Lead Dönüşümü</span><strong>%${a.conversion}</strong></div>
      <div class="stat-row"><span>Satış / Kiralama</span><strong>${a.sales} / ${a.rentals}</strong></div>
      <div class="stat-row"><span>Portföy</span><strong>${props}</strong></div>
      <div class="stat-row"><span>Komisyon</span><strong>${REMS.fmt.money(a.commission)}</strong></div>
      <div class="bar mt-16"><span style="width:${a.performance}%"></span></div>
    </div>`;
  }).join('')}</div>`;
};

REMS.Pages.branches = function () {
  return `
  <div class="page-header"><div><h1>Şubeler</h1><p>Çok şubeli operasyon yönetimi</p></div></div>
  <div class="grid-3">${REMS.Store.data.branches.map(b => {
    const props = REMS.Store.data.properties.filter(p => p.branchId === b.id).length;
    const agents = REMS.Store.data.agents.filter(a => a.branchId === b.id).length;
    const leads = REMS.Store.data.leads.filter(l => {
      const a = REMS.find.agent(l.agentId); return a?.branchId === b.id;
    }).length;
    const mgr = REMS.find.agent(b.managerId);
    return `<div class="card card-body">
      <h3>${b.name}</h3>
      <p class="text-muted" style="font-size:12px;margin:6px 0 12px">${b.address}</p>
      <div class="stat-row"><span>Müdür</span><strong>${mgr?.name || '—'}</strong></div>
      <div class="stat-row"><span>Portföy</span><strong>${props}</strong></div>
      <div class="stat-row"><span>Danışman</span><strong>${agents}</strong></div>
      <div class="stat-row"><span>Lead</span><strong>${leads}</strong></div>
      <div class="stat-row"><span>Telefon</span><strong>${b.phone}</strong></div>
    </div>`;
  }).join('')}</div>`;
};

REMS.Pages.users = function () {
  return REMS.Pages.agents();
};

REMS.Pages.roles = function () {
  const roles = [
    ['Süper Admin', 'Tüm sistemi yönetir'],
    ['Firma Sahibi', 'Portföy, finans, çalışan, şube, rapor'],
    ['Şube Müdürü', 'Sadece kendi şubesini yönetir'],
    ['Emlak Danışmanı', 'Kendi portföy, müşteri, lead, randevu, teklif'],
    ['Portföy Yöneticisi', 'Portföy girişi ve mülk sahipleri'],
    ['Çağrı Merkezi', 'Lead ve talep toplama'],
    ['Muhasebe', 'Tahsilat, komisyon, kasa, gelir/gider'],
    ['Ofis Personeli', 'Randevu, evrak, operasyon'],
    ['Mülk Sahibi', 'Kendi portföylerine sınırlı portal']
  ];
  return `
  <div class="page-header"><div><h1>Roller & Yetkiler</h1><p>RBAC yapısı</p></div></div>
  <div class="card"><div class="table-wrap"><table class="data"><thead><tr><th>Rol</th><th>Yetki Özeti</th><th>Demo Geçiş</th></tr></thead><tbody>
  ${roles.map(([r, d]) => `<tr><td><strong>${r}</strong></td><td>${d}</td>
  <td><button class="btn btn-sm btn-outline" onclick="REMS.Pages.switchRole('${r}')">Bu Rol ile Gir</button></td></tr>`).join('')}
  </tbody></table></div></div>`;
};

REMS.Pages.switchRole = function (role) {
  const agent = REMS.Store.data.agents.find(a => a.role === role) || REMS.Store.data.agents[0];
  REMS.Store.data.currentUser = {
    id: agent.id, name: agent.name, role: agent.role, branchId: agent.branchId, avatar: agent.avatar
  };
  REMS.Store.save();
  REMS.UI.updateUserChip();
  REMS.toast(`${role} rolüne geçildi`);
  REMS.Router.go('dashboard');
};

REMS.Pages.settings = function () {
  const s = REMS.Store.data.settings;
  const theme = REMS.Store.data.theme;
  return `
  <div class="page-header"><div><h1>Ayarlar</h1><p>Firma ve demo tercihleri</p></div></div>
  <div class="grid-2">
    <div class="card card-body">
      <h3>Firma</h3>
      <div class="form-group mt-16"><label>Firma Adı</label><input class="form-control" id="setCompany" value="${s.companyName}"></div>
      <div class="form-grid mt-16">
        <div class="form-group"><label>Satış Komisyonu %</label><input type="number" class="form-control" id="setSaleCom" value="${s.defaultCommissionSale}"></div>
        <div class="form-group"><label>Kiralama Komisyonu %</label><input type="number" class="form-control" id="setRentCom" value="${s.defaultCommissionRent}"></div>
        <div class="form-group"><label>Danışman Payı %</label><input type="number" class="form-control" id="setAgentShare" value="${s.agentShareDefault}"></div>
      </div>
      <button class="btn btn-primary mt-16" onclick="REMS.Pages.saveSettings()">Kaydet</button>
    </div>
    <div class="card card-body">
      <h3>Görünüm & Veri</h3>
      <div class="stat-row"><span>Tema</span>
        <button class="btn btn-sm btn-outline" onclick="REMS.Pages.toggleTheme()">${theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}</button>
      </div>
      <div class="stat-row"><span>Demo Verilerini Sıfırla</span>
        <button class="btn btn-sm btn-danger" onclick="REMS.Pages.resetData()">Sıfırla</button>
      </div>
      <div class="stat-row"><span>Son Kullanıcı Vitrini</span>
        <a class="btn btn-sm btn-primary" href="public/index.html" target="_blank">Demoya Git</a>
      </div>
      <div class="stat-row"><span>Emlakçı Girişi</span>
        <a class="btn btn-sm btn-outline" href="login.html">Giriş Sayfası</a>
      </div>
      <div class="mt-16" style="display:flex;align-items:center;gap:10px">
        <img src="assets/images/obsidia-digital-logo.svg" alt="ObsidiaDigital" style="height:28px;background:transparent">
        <span class="text-muted" style="font-size:12px">ObsidiaDigital PropTech</span>
      </div>
    </div>
  </div>`;
};

REMS.Pages.saveSettings = function () {
  const s = REMS.Store.data.settings;
  s.companyName = document.getElementById('setCompany').value;
  s.defaultCommissionSale = Number(document.getElementById('setSaleCom').value);
  s.defaultCommissionRent = Number(document.getElementById('setRentCom').value);
  s.agentShareDefault = Number(document.getElementById('setAgentShare').value);
  REMS.Store.save();
  REMS.toast('Ayarlar kaydedildi');
};

REMS.Pages.toggleTheme = function () {
  const next = REMS.Store.data.theme === 'dark' ? 'light' : 'dark';
  REMS.Store.data.theme = next;
  REMS.Store.save();
  document.documentElement.setAttribute('data-theme', next === 'dark' ? 'dark' : '');
  REMS.toast(next === 'dark' ? 'Koyu tema açıldı' : 'Açık tema açıldı');
  REMS.Router.render();
};

REMS.Pages.resetData = function () {
  if (!confirm('Tüm demo verileri sıfırlansın mı?')) return;
  REMS.Store.reset();
  document.documentElement.setAttribute('data-theme', '');
  REMS.UI.updateUserChip();
  REMS.UI.updateNotifBadge();
  REMS.toast('Demo verileri sıfırlandı');
  REMS.Router.go('dashboard');
};

REMS.Pages.integrations = function () {
  const integ = REMS.Store.data.settings.integrations;
  const rows = Object.entries(integ).map(([key, val]) => `
    <div class="channel-row">
      <div><strong>${key}</strong><div class="text-muted" style="font-size:11px">API anahtarı demo ortamında saklanmaz / hard-code edilmez</div></div>
      <button class="toggle ${val.enabled ? 'on' : ''}" onclick="REMS.Pages.toggleInteg('${key}')"></button>
    </div>`).join('');
  return `
  <div class="page-header"><div><h1>Entegrasyonlar</h1><p>Portal, SMS, WhatsApp, ödeme — mimari hazır</p></div></div>
  <div class="card card-body">${rows}
    <p class="text-muted mt-16" style="font-size:12px">Backend: NestJS/Laravel · PostgreSQL · Redis · S3 · Socket.IO · Netgsm · Meta WhatsApp · iyzico/PayTR</p>
  </div>`;
};

REMS.Pages.toggleInteg = function (key) {
  const i = REMS.Store.data.settings.integrations[key];
  i.enabled = !i.enabled;
  REMS.Store.save();
  REMS.toast(`${key} ${i.enabled ? 'aktif' : 'pasif'}`);
  REMS.Router.render();
};

REMS.Pages.logs = function () {
  return `
  <div class="page-header"><div><h1>Audit Log</h1><p>Kritik işlem kayıtları</p></div></div>
  <div class="card"><div class="table-wrap"><table class="data"><thead><tr><th>Zaman</th><th>Kullanıcı</th><th>İşlem</th><th>Detay</th></tr></thead><tbody>
  ${REMS.Store.data.activityLogs.map(l => `<tr><td>${l.at}</td><td>${l.user}</td><td>${l.action}</td><td>${l.detail || ''}</td></tr>`).join('')}
  </tbody></table></div></div>`;
};

REMS.Pages.fieldTeam = function () {
  setTimeout(() => REMS.Maps.fieldMap(), 80);
  return `
  <div class="page-header"><div><h1>Saha Ekibi</h1>
  <p>Aktif konum paylaşımı açık danışmanlar (gizlilik: çalışma saati / kullanıcı onayı)</p></div></div>
  <div class="card card-body"><div id="fieldMap" style="height:520px"></div></div>`;
};

REMS.Pages.advisorMobile = function () {
  const u = REMS.Store.data.currentUser;
  const myProps = REMS.Store.data.properties.filter(p => p.agentId === u.id);
  const myLeads = REMS.Store.data.leads.filter(l => l.agentId === u.id);
  const myAppts = REMS.Store.data.appointments.filter(a => a.agentId === u.id && a.date >= '2026-08-16');
  const myOffers = REMS.Store.data.offers.filter(o => o.agentId === u.id && ['Bekliyor', 'Pazarlık'].includes(o.status));
  const myTasks = REMS.Store.data.tasks.filter(t => t.agentId === u.id && t.status !== 'Tamamlandı');
  const agent = REMS.find.agent(u.id);
  return `
  <div class="field-home">
    <div class="page-header"><div><h1>Danışman Paneli</h1><p>Merhaba ${u.name}</p></div></div>
    <div class="quick-actions">
      <button class="quick-action" onclick="REMS.Router.go('quick-property')"><i data-lucide="camera"></i><strong>Hızlı Portföy</strong><span>Saha girişi</span></button>
      <button class="quick-action" onclick="REMS.Leads.openCreate()"><i data-lucide="user-plus"></i><strong>Lead Ekle</strong><span>Hızlı kayıt</span></button>
      <button class="quick-action" onclick="REMS.Appointments.openCreate()"><i data-lucide="calendar-plus"></i><strong>Randevu</strong><span>Yeni planla</span></button>
      <button class="quick-action" onclick="REMS.Router.go('map')"><i data-lucide="map"></i><strong>Harita</strong><span>Yakın portföy</span></button>
    </div>
    <div class="kpi-grid">
      <div class="kpi-card"><div class="kpi-label">Bugünkü Randevularım</div><div class="kpi-value">${myAppts.length}</div></div>
      <div class="kpi-card"><div class="kpi-label">Yeni Leadlerim</div><div class="kpi-value">${myLeads.filter(l => l.status === 'Yeni' || l.status === 'Nitelikli').length}</div></div>
      <div class="kpi-card"><div class="kpi-label">Aktif Portföylerim</div><div class="kpi-value">${myProps.filter(p => p.status === 'Aktif').length}</div></div>
      <div class="kpi-card"><div class="kpi-label">Bekleyen Teklifler</div><div class="kpi-value">${myOffers.length}</div></div>
      <div class="kpi-card"><div class="kpi-label">Görevlerim</div><div class="kpi-value">${myTasks.length}</div></div>
      <div class="kpi-card"><div class="kpi-label">Bu Ay Kazancım</div><div class="kpi-value" style="font-size:16px">${REMS.fmt.money(agent?.commission || 0)}</div></div>
    </div>
    <div class="card mt-16"><div class="card-header"><h3>Randevularım</h3></div><div class="card-body">
      ${myAppts.slice(0, 5).map(a => `<div class="stat-row"><strong>${a.date} ${a.time}</strong><span>${a.type}</span></div>`).join('') || '<p class="text-muted">Randevu yok</p>'}
    </div></div>
  </div>`;
};

REMS.Pages.profile = function () {
  const u = REMS.Store.data.currentUser;
  return `
  <div class="page-header"><div><h1>Profil</h1></div></div>
  <div class="card card-body" style="max-width:520px">
    <div class="flex-center gap-8 mb-16"><div class="avatar" style="width:64px;height:64px;font-size:18px">${u.avatar}</div>
    <div><strong style="font-size:18px">${u.name}</strong><div class="text-muted">${u.role}</div></div></div>
    <div class="stat-row"><span>Şube</span><strong>${REMS.find.branch(u.branchId)?.name}</strong></div>
    <div class="stat-row"><span>Tema</span><button class="btn btn-sm btn-outline" onclick="REMS.Pages.toggleTheme()">Değiştir</button></div>
    <button class="btn btn-outline mt-16" onclick="REMS.toast('Oturum demo modunda — çıkış simüle edildi')">Çıkış Yap</button>
  </div>`;
};

REMS.Pages.scenario = function () {
  return `
  <div class="page-header"><div><h1>Uçtan Uca Senaryo</h1>
  <p>Mehmet Yıldırım → Ataköy portföy → Murat Demir lead → satış kapanışı</p></div>
  <button class="btn btn-primary" onclick="REMS.Scenario.run()"><i data-lucide="play"></i> Senaryoyu Çalıştır</button></div>
  <div class="card card-body">
    <div class="timeline" id="scenarioTimeline">
      ${[
        'Mülk sahibi Mehmet Yıldırım eklenir/doğrulanır',
        'Ataköy 3+1 portföy ₺8.350.000 olarak aktif',
        'Ahmet Yılmaz danışman atanır',
        'Google Ads lead: Murat Demir',
        'Talep: Bakırköy 3+1 · ₺7-9M · otomatik eşleşme %96',
        'Yer gösterme 17.08.2026 14:00 + dijital imza',
        'Teklif ₺8.000.000 → karşı ₺8.200.000 → anlaşma ₺8.100.000',
        'Kapora ₺100.000 · satış sözleşmesi · tapu',
        'Komisyon + danışman payı · kasa kaydı',
        'Portföy SATILDI · Lead KAZANILDI · performans güncellenir'
      ].map((t, i) => `<div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><strong>Aşama ${i + 1}</strong><p>${t}</p></div></div>`).join('')}
    </div>
    <div id="scenarioResult" class="mt-16"></div>
  </div>`;
};

/* Scenario engine — end-to-end workflow */
REMS.Scenario = {
  run() {
    const d = REMS.Store.data;
    let owner = d.owners.find(o => o.name === 'Mehmet Yıldırım');
    if (!owner) {
      owner = {
        id: REMS.uid('ow'), name: 'Mehmet Yıldırım', phone: '0532 111 2233',
        email: 'mehmet.yildirim@email.com', tc: '12345678901',
        address: 'Bakırköy, İstanbul', bank: 'Garanti BBVA',
        iban: 'TR110006400000000000123456', notes: 'Senaryo mülk sahibi', createdAt: '2026-08-16'
      };
      d.owners.unshift(owner);
    }

    let prop = d.properties.find(p => p.code === 'PRT-2026-001842');
    if (!prop) prop = d.properties[0];
    prop.ownerId = owner.id;
    prop.agentId = 'ag-3';
    prop.status = 'Aktif';
    prop.currentPrice = 8350000;
    prop.title = 'Ataköy 7-8-9-10. Kısım Deniz Manzaralı 3+1 Satılık Daire';
    prop.housing = prop.housing || {};
    prop.housing.brutM2 = 145; prop.housing.netM2 = 125; prop.housing.rooms = '3+1'; prop.housing.floor = 7;
    prop.address.mahalle = 'Ataköy 7-8-9-10. Kısım';
    prop.address.ilce = 'Bakırköy';

    let customer = d.customers.find(c => c.name === 'Murat Demir') || d.customers[0];
    customer.name = 'Murat Demir';
    customer.budgetMin = 7000000; customer.budgetMax = 9000000;
    customer.preferredDistricts = ['Bakırköy', 'Ataköy'];
    customer.rooms = '3+1'; customer.minM2 = 120; customer.transactionType = 'Satılık';

    let lead = d.leads.find(l => l.name === 'Murat Demir');
    if (!lead) {
      lead = {
        id: REMS.uid('ld'), name: 'Murat Demir', phone: customer.phone, email: customer.email,
        source: 'Google Ads', propertyId: prop.id, agentId: 'ag-3', customerId: customer.id,
        budget: 8000000, district: 'Bakırköy', propertyType: 'Daire',
        note: 'Senaryo lead', score: 92, status: 'Nitelikli', lastContact: '2026-08-16', createdAt: '2026-08-16'
      };
      d.leads.unshift(lead);
    } else {
      lead.status = 'Nitelikli'; lead.source = 'Google Ads'; lead.propertyId = prop.id; lead.agentId = 'ag-3';
    }

    let req = d.requests.find(r => r.customerId === customer.id);
    if (!req) {
      req = {
        id: REMS.uid('req'), customerId: customer.id, transactionType: 'Satılık',
        districts: ['Bakırköy', 'Ataköy'], rooms: ['3+1', '4+1'],
        budgetMin: 7000000, budgetMax: 9000000, minM2: 120, maxM2: 160,
        propertyType: 'Daire', notes: 'Senaryo talep', createdAt: '2026-08-16'
      };
      d.requests.unshift(req);
    }
    const matches = REMS.matchProperties(req);
    const best = matches.find(m => m.property.id === prop.id) || matches[0];

    const appt = {
      id: REMS.uid('ap'), customerId: customer.id, propertyId: prop.id, agentId: 'ag-3',
      date: '2026-08-17', time: '14:00', type: 'Yer Gösterme',
      location: prop.address.full, note: 'Senaryo yer gösterme', status: 'Tamamlandı'
    };
    d.appointments.unshift(appt);

    const showing = {
      id: REMS.uid('sh'), customerId: customer.id, propertyId: prop.id, agentId: 'ag-3',
      date: '2026-08-17', time: '14:00', location: prop.address.full,
      signature: 'data:image/png;base64,scenario', status: 'İmzalandı'
    };
    d.showings.unshift(showing);

    const offer = {
      id: REMS.uid('of'), customerId: customer.id, propertyId: prop.id, agentId: 'ag-3',
      listPrice: 8350000, offerPrice: 8100000, paymentType: 'Kredi', creditStatus: 'Ön Onaylı',
      date: '2026-08-17', validUntil: '2026-08-24', status: 'Kabul',
      history: [
        { by: 'Müşteri', price: 8000000, date: '2026-08-17' },
        { by: 'Mülk Sahibi', price: 8200000, date: '2026-08-17' },
        { by: 'Müşteri', price: 8100000, date: '2026-08-18' },
        { by: 'Sonuç', price: 8100000, date: '2026-08-18', result: 'Kabul Edildi' }
      ]
    };
    d.offers.unshift(offer);

    const sale = {
      id: REMS.uid('sale'), propertyId: prop.id, customerId: customer.id, agentId: 'ag-3',
      step: 8, agreedPrice: 8100000, deposit: 100000, depositPaid: true,
      createdAt: '2026-08-18', status: 'Kapandı'
    };
    d.sales.unshift(sale);

    const commissionAmount = REMS.calcCommission(8100000, 2, true);
    const agentAmount = Math.round(commissionAmount * 0.5);
    d.commissions.unshift({
      id: REMS.uid('com'), propertyId: prop.id, saleId: sale.id, amount: commissionAmount,
      rate: 2, vat: true, agentShare: 50, agentAmount, officeAmount: agentAmount,
      splits: [
        { role: 'Portföy Danışmanı', name: 'Ahmet Yılmaz', percent: 50, amount: agentAmount },
        { role: 'Ofis', name: 'EmlakPro', percent: 50, amount: agentAmount }
      ],
      status: 'Tahsil Edildi', date: '2026-08-18'
    });

    d.cashMovements.unshift({
      id: REMS.uid('cm'), date: '2026-08-18', no: REMS.Store.nextCode('cash'),
      description: 'Satış komisyonu + kapora — PRT-2026-001842',
      customerId: customer.id, propertyId: prop.id, type: 'Giriş', category: 'Gelir',
      method: 'Havale', accountId: 'ca-3', income: commissionAmount + 100000, expense: 0, balance: 0
    });
    const bank = d.cashAccounts.find(a => a.id === 'ca-3');
    if (bank) bank.balance += commissionAmount + 100000;

    prop.status = 'Satıldı';
    lead.status = 'Kazanıldı';
    const agent = REMS.find.agent('ag-3');
    if (agent) {
      agent.sales += 1;
      agent.commission += agentAmount;
      agent.performance = Math.min(100, agent.performance + 1);
    }

    d.contracts.unshift({
      id: REMS.uid('ct'), type: 'Satış Sözleşmesi', propertyId: prop.id,
      party: customer.name, no: `STS-2026-${Date.now().toString().slice(-4)}`,
      date: '2026-08-18', status: 'Tamamlandı', price: 8100000
    });

    REMS.log('Senaryo tamamlandı', `${prop.code} SATILDI · ${REMS.fmt.money(8100000)}`);
    REMS.notify('Satış Kapandı', `${prop.code} başarıyla satıldı. Komisyon ${REMS.fmt.money(commissionAmount)}`, 'sale');
    REMS.Store.save();

    const result = document.getElementById('scenarioResult');
    if (result) {
      result.innerHTML = `<div class="card card-body" style="background:var(--success-soft);border:1px solid transparent">
        <h3 style="color:var(--success)">Senaryo başarıyla çalıştı</h3>
        <div class="stat-row"><span>Eşleşme</span><strong>%${best?.score || 96}</strong></div>
        <div class="stat-row"><span>Anlaşılan Fiyat</span><strong>${REMS.fmt.money(8100000)}</strong></div>
        <div class="stat-row"><span>Kapora</span><strong>${REMS.fmt.money(100000)}</strong></div>
        <div class="stat-row"><span>Komisyon (KDV dahil)</span><strong>${REMS.fmt.money(commissionAmount)}</strong></div>
        <div class="stat-row"><span>Danışman Payı</span><strong>${REMS.fmt.money(agentAmount)}</strong></div>
        <div class="stat-row"><span>Portföy Durumu</span>${REMS.UI.statusBadge('Satıldı')}</div>
        <div class="stat-row"><span>Lead Durumu</span>${REMS.UI.statusBadge('Kazanıldı')}</div>
        <div class="page-actions mt-16">
          <button class="btn btn-outline" onclick="REMS.Router.go('property-detail',{id:'${prop.id}'})">Portföyü Aç</button>
          <button class="btn btn-primary" onclick="REMS.Router.go('commissions')">Komisyonlar</button>
        </div>
      </div>`;
    }
    REMS.toast('Uçtan uca senaryo tamamlandı');
    REMS.UI.updateNotifBadge();
  }
};
