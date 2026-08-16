/* Leaflet maps — portfolio & field team */
window.REMS = window.REMS || {};
REMS.Maps = {
  _map: null,

  statusColor(status, tx) {
    if (status === 'Satıldı') return '#059669';
    if (status === 'Kiralandı') return '#0284c7';
    if (status === 'Opsiyonlu') return '#d97706';
    if (tx === 'Kiralık' || tx === 'Günlük Kiralık') return '#6366f1';
    return '#0d9488';
  },

  portfolioMap() {
    setTimeout(() => this.renderPortfolio(), 80);
    return `
    <div class="page-header"><div><h1>Portföy Haritası</h1>
    <p>Marker renkleri: Satılık · Kiralık · Opsiyonlu · Satıldı · Kiralandı</p></div>
    <div class="page-actions">
      <span class="badge" style="background:#0d9488;color:#fff">Satılık</span>
      <span class="badge" style="background:#6366f1;color:#fff">Kiralık</span>
      <span class="badge" style="background:#d97706;color:#fff">Opsiyonlu</span>
      <span class="badge" style="background:#059669;color:#fff">Satıldı</span>
      <span class="badge" style="background:#0284c7;color:#fff">Kiralandı</span>
    </div></div>
    <div class="card card-body"><div id="portfolioMap" style="height:620px"></div></div>`;
  },

  renderPortfolio() {
    const el = document.getElementById('portfolioMap');
    if (!el || !window.L) return;
    if (this._map) { this._map.remove(); this._map = null; }
    const map = L.map(el).setView([41.02, 28.95], 11);
    this._map = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    REMS.Store.data.properties.forEach(p => {
      if (!p.address?.lat) return;
      const color = this.statusColor(p.status, p.transactionType);
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.25)"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
      const agent = REMS.find.agent(p.agentId);
      const marker = L.marker([p.address.lat, p.address.lng], { icon }).addTo(map);
      marker.bindPopup(`
        <div class="map-popup">
          <img src="${REMS.cover(p)}" alt="">
          <div class="price">${REMS.fmt.money(p.currentPrice)}</div>
          <strong>${p.title}</strong>
          <div style="font-size:12px;color:#64748b;margin-top:4px">
            ${p.housing?.brutM2 || p.land?.m2 || '—'} m² · ${p.housing?.rooms || p.propertyType}<br>
            ${p.transactionType} · ${agent?.name || ''}
          </div>
          <button onclick="REMS.Router.go('property-detail',{id:'${p.id}'})" style="margin-top:8px;width:100%;padding:6px;border:none;border-radius:8px;background:#0d9488;color:#fff;font-weight:700;cursor:pointer;font-family:Quicksand,sans-serif">Detay</button>
        </div>
      `, { maxWidth: 240 });
    });
  },

  fieldMap() {
    const el = document.getElementById('fieldMap');
    if (!el || !window.L) return;
    const map = L.map(el).setView([41.02, 28.95], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM' }).addTo(map);
    REMS.Store.data.agents.filter(a => a.sharing).forEach(a => {
      const marker = L.marker([a.lat, a.lng]).addTo(map);
      marker.bindPopup(`<strong>${a.name}</strong><br>${a.role}<br><span style="color:#059669">Konum paylaşımı açık</span>`);
    });
  }
};
