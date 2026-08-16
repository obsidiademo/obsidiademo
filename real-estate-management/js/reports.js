/* Reports & charts */
window.REMS = window.REMS || {};
REMS.Reports = {
  _charts: {},

  destroy(id) {
    if (this._charts[id]) { this._charts[id].destroy(); delete this._charts[id]; }
  },

  renderDashboardCharts() {
    if (!window.Chart) return;
    const months = ['Eyl','Eki','Kas','Ara','Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu'];
    this.destroy('sales');
    const ctx1 = document.getElementById('chartSalesRent');
    if (ctx1) {
      this._charts.sales = new Chart(ctx1, {
        type: 'line',
        data: {
          labels: months,
          datasets: [
            { label: 'Satış', data: [4,5,6,7,5,8,9,7,10,11,12,14], borderColor: '#0d9488', backgroundColor: 'rgba(13,148,136,0.12)', tension: 0.35, fill: true },
            { label: 'Kiralama', data: [6,7,8,9,8,10,11,9,12,13,12,11], borderColor: '#0284c7', backgroundColor: 'rgba(2,132,199,0.1)', tension: 0.35, fill: true }
          ]
        },
        options: { plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } }
      });
    }
    this.destroy('funnel');
    const ctx2 = document.getElementById('chartFunnel');
    if (ctx2) {
      const statuses = ['Yeni Lead','İletişim','Randevu','Yer Gösterme','Teklif','Sözleşme','Kazanıldı'];
      const counts = [42, 36, 28, 22, 15, 9, 6];
      this._charts.funnel = new Chart(ctx2, {
        type: 'bar',
        data: { labels: statuses, datasets: [{ data: counts, backgroundColor: ['#99f6e4','#5eead4','#2dd4bf','#14b8a6','#0d9488','#0f766e','#115e59'] }] },
        options: { indexAxis: 'y', plugins: { legend: { display: false } } }
      });
    }
    this.destroy('portfolio');
    const ctx3 = document.getElementById('chartPortfolio');
    if (ctx3) {
      const types = ['Konut','Ticari','Arsa','Ofis','Dükkan','Depo','Villa'];
      const data = types.map(t => {
        if (t === 'Konut') return REMS.Store.data.properties.filter(p => ['Daire','Rezidans','Müstakil Ev'].includes(p.propertyType)).length;
        if (t === 'Villa') return REMS.Store.data.properties.filter(p => p.propertyType === 'Villa').length;
        if (t === 'Arsa') return REMS.Store.data.properties.filter(p => p.propertyType === 'Arsa').length;
        if (t === 'Ofis') return REMS.Store.data.properties.filter(p => ['Ofis','Plaza'].includes(p.propertyType)).length;
        if (t === 'Dükkan') return REMS.Store.data.properties.filter(p => ['Dükkan','Mağaza'].includes(p.propertyType)).length;
        if (t === 'Depo') return REMS.Store.data.properties.filter(p => p.propertyType === 'Depo').length;
        return REMS.Store.data.properties.filter(p => p.propertyType === 'Ticari').length || 5;
      });
      this._charts.portfolio = new Chart(ctx3, {
        type: 'doughnut',
        data: { labels: types, datasets: [{ data, backgroundColor: ['#0d9488','#0284c7','#059669','#6366f1','#d97706','#64748b','#14b8a6'] }] },
        options: { plugins: { legend: { position: 'bottom' } } }
      });
    }
  },

  portfolio() {
    const props = REMS.Store.data.properties;
    const groups = {
      Aktif: props.filter(p => ['Aktif','Yeni','Teklif Var','Opsiyonlu'].includes(p.status)).length,
      Satıldı: props.filter(p => p.status === 'Satıldı').length,
      Kiralandı: props.filter(p => p.status === 'Kiralandı').length,
      Pasif: props.filter(p => ['Pasif','Arşiv','Yetki Bitti'].includes(p.status)).length
    };
    const avgDays = Math.round(props.reduce((s, p) => s + (p.daysOnMarket || 0), 0) / props.length);
    return `
    <div class="page-header"><div><h1>Portföy Raporu</h1></div></div>
    <div class="kpi-grid" style="grid-template-columns:repeat(5,1fr)">
      ${Object.entries(groups).map(([k,v]) => `<div class="kpi-card"><div class="kpi-label">${k}</div><div class="kpi-value">${v}</div></div>`).join('')}
      <div class="kpi-card"><div class="kpi-label">Ort. Kapanma (gün)</div><div class="kpi-value">${avgDays}</div></div>
    </div>`;
  },

  leads() {
    const leads = REMS.Store.data.leads;
    const bySource = {};
    leads.forEach(l => { bySource[l.source] = bySource[l.source] || { lead: 0, won: 0 }; bySource[l.source].lead++; if (l.status==='Kazanıldı') bySource[l.source].won++; });
    // Enrich demo sources
    const enrich = { 'Sahibinden': { lead: 210, won: 21 }, 'Google Ads': { lead: 120, won: 14 }, 'Instagram': { lead: 85, won: 8 } };
    Object.entries(enrich).forEach(([k,v]) => { bySource[k] = bySource[k] || v; bySource[k].lead = Math.max(bySource[k].lead, v.lead); bySource[k].won = Math.max(bySource[k].won, v.won); });
    const lost = {};
    leads.filter(l => l.status==='Kaybedildi').forEach(l => { lost[l.lostReason||'Diğer'] = (lost[l.lostReason||'Diğer']||0)+1; });
    if (!Object.keys(lost).length) {
      REMS.CONST.LOST_REASONS.slice(0,5).forEach((r,i) => lost[r] = 3 + i);
    }
    return `
    <div class="page-header"><div><h1>Lead Raporu</h1></div></div>
    <div class="grid-2">
      <div class="card"><div class="card-header"><h3>Kaynak Analizi</h3></div><div class="card-body">
        ${Object.entries(bySource).sort((a,b)=>b[1].lead-a[1].lead).map(([k,v]) => `
          <div class="stat-row"><div><strong>${k}</strong><div class="text-muted" style="font-size:11px">${v.lead} Lead · ${v.won} Satış</div></div>
          <strong>%${v.lead?Math.round(v.won/v.lead*100):0}</strong></div>`).join('')}
      </div></div>
      <div class="card"><div class="card-header"><h3>Kayıp Nedenleri</h3></div><div class="card-body">
        ${Object.entries(lost).map(([k,v]) => `<div class="stat-row"><span>${k}</span><strong>${v}</strong></div>`).join('')}
      </div></div>
    </div>`;
  },

  agents() {
    return `
    <div class="page-header"><div><h1>Danışman Raporu</h1></div></div>
    <div class="prop-grid">${REMS.Store.data.agents.filter(a=>a.sales||a.rentals||a.role.includes('Danışman')).map(a => `
      <div class="card card-body">
        <div class="flex-between"><strong>${a.name}</strong><span class="badge badge-primary">${a.performance}/100</span></div>
        <div class="stat-row"><span>Lead Dönüşümü</span><strong>%${a.conversion}</strong></div>
        <div class="stat-row"><span>Yer Gösterme</span><strong>${10 + a.sales * 4}</strong></div>
        <div class="stat-row"><span>Satış</span><strong>${a.sales}</strong></div>
        <div class="stat-row"><span>Kiralama</span><strong>${a.rentals}</strong></div>
        <div class="stat-row"><span>Komisyon</span><strong>${REMS.fmt.money(a.commission)}</strong></div>
      </div>`).join('')}</div>`;
  },

  finance() {
    const income = REMS.Store.data.cashMovements.filter(m=>m.type==='Giriş').reduce((s,m)=>s+m.income,0);
    const expense = REMS.Store.data.cashMovements.filter(m=>m.type==='Çıkış').reduce((s,m)=>s+m.expense,0);
    const comm = REMS.Store.data.commissions.reduce((s,c)=>s+c.amount,0);
    return `
    <div class="page-header"><div><h1>Finans Raporu</h1></div></div>
    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr)">
      <div class="kpi-card"><div class="kpi-label">Gelir</div><div class="kpi-value" style="font-size:18px">${REMS.fmt.money(income)}</div></div>
      <div class="kpi-card"><div class="kpi-label">Gider</div><div class="kpi-value" style="font-size:18px">${REMS.fmt.money(expense)}</div></div>
      <div class="kpi-card"><div class="kpi-label">Komisyon</div><div class="kpi-value" style="font-size:18px">${REMS.fmt.money(comm)}</div></div>
      <div class="kpi-card"><div class="kpi-label">Net Kazanç</div><div class="kpi-value" style="font-size:18px">${REMS.fmt.money(income-expense)}</div></div>
    </div>`;
  },

  region() {
    const districts = {};
    REMS.Store.data.properties.forEach(p => {
      const k = p.address.ilce;
      districts[k] = districts[k] || { active:0, sold:0, rented:0, prices:[], days:[] };
      if (['Aktif','Yeni','Teklif Var','Opsiyonlu'].includes(p.status)) districts[k].active++;
      if (p.status==='Satıldı') districts[k].sold++;
      if (p.status==='Kiralandı') districts[k].rented++;
      if (p.transactionType==='Satılık') districts[k].prices.push(p.pricePerM2);
      districts[k].days.push(p.daysOnMarket||0);
    });
    return `
    <div class="page-header"><div><h1>Bölge Analizi</h1><p>Mahalle / ilçe bazlı</p></div></div>
    <div class="card"><div class="table-wrap"><table class="data"><thead><tr>
      <th>İlçe</th><th>Aktif</th><th>Ort. m² Fiyat</th><th>Satış</th><th>Kiralama</th><th>Ort. Süre</th>
    </tr></thead><tbody>
    ${Object.entries(districts).map(([k,v]) => `<tr>
      <td><strong>${k}</strong></td><td>${v.active}</td>
      <td>${REMS.fmt.money(v.prices.length?Math.round(v.prices.reduce((a,b)=>a+b,0)/v.prices.length):0)}</td>
      <td>${v.sold}</td><td>${v.rented}</td>
      <td>${Math.round(v.days.reduce((a,b)=>a+b,0)/v.days.length)} gün</td>
    </tr>`).join('')}
    </tbody></table></div></div>`;
  },

  branch() {
    return `
    <div class="page-header"><div><h1>Şube Performansı</h1></div></div>
    <div class="grid-3">${REMS.Store.data.branches.map(b => {
      const props = REMS.Store.data.properties.filter(p => p.branchId === b.id);
      const agents = REMS.Store.data.agents.filter(a => a.branchId === b.id);
      const leads = REMS.Store.data.leads.filter(l => agents.some(a => a.id === l.agentId));
      return `<div class="card card-body">
        <h3>${b.name}</h3>
        <div class="stat-row"><span>Portföy</span><strong>${props.length}</strong></div>
        <div class="stat-row"><span>Danışman</span><strong>${agents.length}</strong></div>
        <div class="stat-row"><span>Lead</span><strong>${leads.length}</strong></div>
        <div class="stat-row"><span>Satılan</span><strong>${props.filter(p=>p.status==='Satıldı').length}</strong></div>
      </div>`;
    }).join('')}</div>`;
  }
};
