/* Public marketplace — Sahibinden-like UI with 10 themes */
(function () {
  const THEME_KEY = 'emlakpro_vitrin_theme';
  const FAV_KEY = 'emlakpro_vitrin_favs';
  const STORE_KEY = 'rems_proptech_v3';

  const themes = ['teal','ocean','forest','sunset','slate','rose','indigo','amber','mint','night'];

  function loadData() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return REMS.generateSeed();
  }

  let data = loadData();
  let viewMode = 'grid';
  let filters = { tx: '', type: '', district: '', min: '', max: '', rooms: '', q: '' };

  function money(n) {
    return '₺' + Number(n || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 });
  }
  function cover(p) {
    const ph = (p.photos || []).find(x => x.isCover) || (p.photos || [])[0];
    return ph?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&h=600&q=80';
  }
  function agent(id) { return data.agents.find(a => a.id === id); }
  function getFavs() { try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); } catch { return []; } }
  function setFavs(arr) { localStorage.setItem(FAV_KEY, JSON.stringify(arr)); updateFavCount(); }
  function updateFavCount() {
    const btn = document.getElementById('favBtn');
    if (btn) btn.textContent = `Favoriler (${getFavs().length})`;
  }

  function applyTheme(name) {
    if (!themes.includes(name)) name = 'teal';
    document.documentElement.setAttribute('data-theme', name);
    localStorage.setItem(THEME_KEY, name);
    document.querySelectorAll('.theme-dot').forEach(d => d.classList.toggle('active', d.dataset.t === name));
  }

  function publishedProps() {
    return data.properties.filter(p =>
      (p.channels?.web !== false) &&
      ['Aktif', 'Yeni', 'Teklif Var', 'Opsiyonlu'].includes(p.status)
    );
  }

  function filtered(baseTx) {
    let list = publishedProps();
    if (baseTx === 'sale') list = list.filter(p => p.transactionType === 'Satılık');
    if (baseTx === 'rent') list = list.filter(p => p.transactionType === 'Kiralık' || p.transactionType === 'Günlük Kiralık');
    if (filters.tx) list = list.filter(p => p.transactionType === filters.tx);
    if (filters.type) list = list.filter(p => p.propertyType === filters.type);
    if (filters.district) list = list.filter(p => p.address.ilce === filters.district);
    if (filters.rooms) list = list.filter(p => p.housing?.rooms === filters.rooms);
    if (filters.min) list = list.filter(p => p.currentPrice >= Number(filters.min));
    if (filters.max) list = list.filter(p => p.currentPrice <= Number(filters.max));
    if (filters.q) {
      const q = filters.q.toLowerCase();
      list = list.filter(p => `${p.title} ${p.address.mahalle} ${p.address.ilce} ${p.code}`.toLowerCase().includes(q));
    }
    return list;
  }

  function card(p) {
    return `<article class="listing-card" onclick="Market.go('listing/${p.id}')">
      <img src="${cover(p)}" alt="${p.title}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&h=600&q=80'">
      <div class="listing-body">
        <div class="price">${money(p.currentPrice)}</div>
        <div class="title">${p.title}</div>
        <div class="meta">
          <span class="badge">${p.transactionType}</span>
          <span>${p.housing?.brutM2 || p.land?.m2 || '—'} m²</span>
          <span>${p.housing?.rooms || p.propertyType}</span>
          <span>${p.address.ilce}</span>
        </div>
      </div>
    </article>`;
  }

  function filterAside(mode) {
    const districts = [...new Set(data.properties.map(p => p.address.ilce))];
    const types = [...new Set(data.properties.map(p => p.propertyType))];
    return `<aside class="filters">
      <h3>Filtrele</h3>
      <div class="form-group"><label>Arama</label><input class="form-control" id="fQ" value="${filters.q}" placeholder="Mahalle, başlık..."></div>
      <div class="form-group"><label>İşlem</label><select class="form-control" id="fTx">
        <option value="">Tümü</option>
        <option ${filters.tx==='Satılık'?'selected':''}>Satılık</option>
        <option ${filters.tx==='Kiralık'?'selected':''}>Kiralık</option>
        <option ${filters.tx==='Günlük Kiralık'?'selected':''}>Günlük Kiralık</option>
      </select></div>
      <div class="form-group"><label>Tür</label><select class="form-control" id="fType"><option value="">Tümü</option>${types.map(t=>`<option ${filters.type===t?'selected':''}>${t}</option>`).join('')}</select></div>
      <div class="form-group"><label>İlçe</label><select class="form-control" id="fDistrict"><option value="">Tümü</option>${districts.map(t=>`<option ${filters.district===t?'selected':''}>${t}</option>`).join('')}</select></div>
      <div class="form-group"><label>Oda</label><select class="form-control" id="fRooms"><option value="">Tümü</option>${['1+1','2+1','3+1','4+1','5+1'].map(t=>`<option ${filters.rooms===t?'selected':''}>${t}</option>`).join('')}</select></div>
      <div class="form-group"><label>Min Fiyat</label><input type="number" class="form-control" id="fMin" value="${filters.min}"></div>
      <div class="form-group"><label>Max Fiyat</label><input type="number" class="form-control" id="fMax" value="${filters.max}"></div>
      <button class="btn btn-primary" style="width:100%" onclick="Market.applyFilters('${mode}')">Uygula</button>
    </aside>`;
  }

  function listingsPage(mode, title) {
    const list = filtered(mode === 'home' ? '' : mode);
    return `
    ${mode === 'home' ? `<section class="hero"><div class="hero-inner">
      <div class="hero-copy">
        <h1>EmlakPro Vitrin</h1>
        <p><span class="typed" id="heroTyped" aria-live="polite"></span><span class="typed-cursor" aria-hidden="true"></span></p>
      </div>
      <div class="search-panel">
        <select id="heroTx" aria-label="İşlem tipi"><option value="">Satılık / Kiralık</option><option>Satılık</option><option>Kiralık</option></select>
        <select id="heroDist" aria-label="İlçe"><option value="">İlçe</option>${[...new Set(data.properties.map(p=>p.address.ilce))].map(d=>`<option>${d}</option>`).join('')}</select>
        <select id="heroType" aria-label="Konut tipi"><option value="">Konut tipi</option>${['Daire','Villa','Rezidans','Dükkan','Arsa'].map(t=>`<option>${t}</option>`).join('')}</select>
        <input id="heroQ" placeholder="Mahalle veya anahtar kelime" aria-label="Arama">
        <button class="btn btn-primary" type="button" onclick="Market.heroSearch()">Ara</button>
      </div>
    </div></section>` : ''}
    <div class="layout">
      ${filterAside(mode)}
      <section>
        <div class="results-head">
          <h2>${title} <span style="color:var(--muted);font-weight:600;font-size:14px">${list.length} ilan</span></h2>
          <div class="view-toggle">
            <button class="${viewMode==='grid'?'active':''}" onclick="Market.setView('grid')">Kart</button>
            <button class="${viewMode==='list'?'active':''}" onclick="Market.setView('list')">Liste</button>
          </div>
        </div>
        <div class="listing-grid ${viewMode==='list'?'listing-list':''}">
          ${list.length ? list.map(card).join('') : '<div class="empty">Bu kriterlere uygun ilan bulunamadı.</div>'}
        </div>
      </section>
    </div>`;
  }

  function detailPage(id) {
    const p = data.properties.find(x => x.id === id);
    if (!p) return `<div class="detail-wrap"><div class="empty">İlan bulunamadı. <a href="#home">Ana sayfaya dön</a></div></div>`;
    const a = agent(p.agentId);
    const photos = p.photos || [];
    const similar = publishedProps().filter(x => x.id !== p.id && x.address.ilce === p.address.ilce).slice(0, 3);
    const favs = getFavs();
    const isFav = favs.includes(p.id);
    setTimeout(() => {
      const el = document.getElementById('detailMap');
      if (el && window.L && p.address.lat) {
        const map = L.map(el).setView([p.address.lat, p.address.lng], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM' }).addTo(map);
        L.marker([p.address.lat, p.address.lng]).addTo(map);
      }
    }, 80);
    return `<div class="detail-wrap">
      <button class="btn btn-outline" onclick="history.back()" style="margin-bottom:12px">← Geri</button>
      <div class="gallery">
        <div class="gallery-main"><img src="${cover(p)}" alt=""></div>
        <div class="gallery-side">
          <div><img src="${photos[1]?.url || cover(p)}" alt=""></div>
          <div><img src="${photos[2]?.url || cover(p)}" alt=""></div>
        </div>
      </div>
      <div class="detail-grid">
        <div class="panel">
          <span class="badge">${p.transactionType}</span>
          <h1 style="font-size:26px;margin:8px 0">${p.title}</h1>
          <div class="price" style="font-size:28px">${money(p.currentPrice)}</div>
          <p style="margin-top:8px;color:var(--muted);font-weight:600">${p.address.full} · ${p.code}</p>
          <p style="margin-top:16px;line-height:1.65;font-weight:500">${p.description}</p>
          <div class="info-grid">
            <div><span>Brüt / Net</span><strong>${p.housing?.brutM2 || '—'} / ${p.housing?.netM2 || '—'} m²</strong></div>
            <div><span>Oda</span><strong>${p.housing?.rooms || '—'}</strong></div>
            <div><span>Kat</span><strong>${p.housing?.floor || '—'} / ${p.housing?.buildingFloors || '—'}</strong></div>
            <div><span>Yaş</span><strong>${p.housing?.buildingAge ?? '—'}</strong></div>
            <div><span>Isıtma</span><strong>${p.housing?.heating || '—'}</strong></div>
            <div><span>m² Fiyatı</span><strong>${money(p.pricePerM2)}</strong></div>
          </div>
          <h3 style="margin-top:18px">Konum</h3>
          <div id="detailMap"></div>
          <h3 style="margin-top:18px">Benzer İlanlar</h3>
          <div class="listing-grid" style="margin-top:10px">${similar.map(card).join('')}</div>
        </div>
        <div>
          <div class="panel" style="position:sticky;top:90px">
            <div class="agent-card">
              <div class="avatar">${a?.avatar || 'EP'}</div>
              <div><strong>${a?.name || 'EmlakPro'}</strong><div style="font-size:12px;color:var(--muted)">${a?.phone || ''}</div></div>
            </div>
            <button class="btn btn-primary" style="width:100%;margin-bottom:8px" onclick="alert('Demo: Danışman aranıyor — ${a?.phone || ''}')">Hemen Ara</button>
            <button class="btn btn-outline" style="width:100%;margin-bottom:8px" onclick="alert('Demo: Mesaj gönderildi')">Mesaj Gönder</button>
            <button class="btn btn-outline" style="width:100%" onclick="Market.toggleFav('${p.id}')">${isFav ? '♥ Favoriden Çıkar' : '♡ Favoriye Ekle'}</button>
            <p style="margin-top:12px;font-size:12px;color:var(--muted)">Bu ilan EmlakPro yönetim panelinden yayınlanmıştır.</p>
          </div>
        </div>
      </div>
    </div>`;
  }

  function agentsPage() {
    return `<div class="detail-wrap">
      <h1 style="margin-bottom:16px">Danışmanlarımız</h1>
      <div class="listing-grid">${data.agents.filter(a => a.role.includes('Danışman') || a.sales).map(a => `
        <div class="panel">
          <div class="agent-card"><div class="avatar">${a.avatar}</div>
          <div><strong>${a.name}</strong><div style="font-size:12px;color:var(--muted)">${a.role}</div></div></div>
          <div style="font-size:13px;font-weight:600;color:var(--muted)">${a.phone}<br>${a.email}</div>
          <div style="margin-top:10px;font-weight:700">${a.sales} satış · ${a.rentals} kiralama</div>
        </div>`).join('')}
      </div>
    </div>`;
  }

  function favoritesPage() {
    const favs = getFavs();
    const list = data.properties.filter(p => favs.includes(p.id));
    return `<div class="detail-wrap">
      <h1 style="margin-bottom:16px">Favorilerim</h1>
      <div class="listing-grid">${list.length ? list.map(card).join('') : '<div class="empty">Henüz favori ilan yok.</div>'}</div>
    </div>`;
  }

  function projectsPage() {
    const villas = publishedProps().filter(p => ['Villa','Rezidans','Bina'].includes(p.propertyType));
    return `<div class="detail-wrap">
      <h1 style="margin-bottom:8px">Öne Çıkan Projeler</h1>
      <p style="color:var(--muted);font-weight:600;margin-bottom:16px">Villa, rezidans ve proje portföyleri</p>
      <div class="listing-grid">${villas.length ? villas.map(card).join('') : '<div class="empty">Proje ilanı yok</div>'}</div>
    </div>`;
  }

  window.Market = {
    go(hash) { location.hash = hash; },
    setView(mode) { viewMode = mode; render(); },
    applyFilters(mode) {
      filters = {
        q: document.getElementById('fQ')?.value || '',
        tx: document.getElementById('fTx')?.value || '',
        type: document.getElementById('fType')?.value || '',
        district: document.getElementById('fDistrict')?.value || '',
        rooms: document.getElementById('fRooms')?.value || '',
        min: document.getElementById('fMin')?.value || '',
        max: document.getElementById('fMax')?.value || ''
      };
      render();
    },
    heroSearch() {
      filters.tx = document.getElementById('heroTx')?.value || '';
      filters.district = document.getElementById('heroDist')?.value || '';
      filters.type = document.getElementById('heroType')?.value || '';
      filters.q = document.getElementById('heroQ')?.value || '';
      location.hash = filters.tx === 'Kiralık' ? 'rent' : 'sale';
    },
    toggleFav(id) {
      const favs = getFavs();
      const i = favs.indexOf(id);
      if (i >= 0) favs.splice(i, 1); else favs.push(id);
      setFavs(favs);
      render();
    }
  };

  function render() {
    data = loadData();
    const hash = (location.hash || '#home').slice(1);
    const [route, id] = hash.split('/');
    const app = document.getElementById('app');
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === route || (route === 'home' && a.dataset.nav === 'home')));

    if (route === 'listing' && id) app.innerHTML = detailPage(id);
    else if (route === 'sale') app.innerHTML = listingsPage('sale', 'Satılık İlanlar');
    else if (route === 'rent') app.innerHTML = listingsPage('rent', 'Kiralık İlanlar');
    else if (route === 'agents') app.innerHTML = agentsPage();
    else if (route === 'favorites') app.innerHTML = favoritesPage();
    else if (route === 'projects') app.innerHTML = projectsPage();
    else app.innerHTML = listingsPage('home', 'Tüm İlanlar');
  }

  document.querySelectorAll('.theme-dot').forEach(btn => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.t));
  });
  document.getElementById('favBtn').onclick = () => { location.hash = 'favorites'; };

  applyTheme(localStorage.getItem(THEME_KEY) || 'teal');
  updateFavCount();
  window.addEventListener('hashchange', render);
  render();
})();
