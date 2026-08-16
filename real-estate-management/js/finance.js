/* Finance — cash, commissions, rents, deposits, collections */
window.REMS = window.REMS || {};
REMS.Finance = {
  cash() {
    const accounts = REMS.Store.data.cashAccounts;
    const moves = REMS.Store.data.cashMovements;
    return `
    <div class="page-header"><div><h1>Kasa Yönetimi</h1><p>Merkez, şube, banka, POS</p></div>
    <button class="btn btn-primary" onclick="REMS.Finance.openCashMove()"><i data-lucide="plus"></i> Kasa Hareketi</button></div>
    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr)">
      ${accounts.map(a => `<div class="kpi-card"><div class="kpi-label">${a.name}</div><div class="kpi-value" style="font-size:18px">${REMS.fmt.money(a.balance)}</div><div class="text-muted" style="font-size:11px">${a.type}</div></div>`).join('')}
    </div>
    <div class="card mt-16"><div class="table-wrap"><table class="data"><thead><tr>
      <th>Tarih</th><th>İşlem No</th><th>Açıklama</th><th>Tür</th><th>Yöntem</th><th>Giriş</th><th>Çıkış</th>
    </tr></thead><tbody>
    ${moves.slice(0,40).map(m => `<tr>
      <td>${REMS.fmt.date(m.date)}</td><td>${m.no}</td><td>${m.description}</td>
      <td>${m.type}</td><td>${m.method}</td>
      <td class="text-success">${m.income ? REMS.fmt.money(m.income) : '—'}</td>
      <td class="text-danger">${m.expense ? REMS.fmt.money(m.expense) : '—'}</td>
    </tr>`).join('')}
    </tbody></table></div></div>`;
  },

  openCashMove() {
    REMS.UI.openModal(`
      <div class="modal-header"><h2>Kasa Hareketi</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="modal-body"><div class="form-grid">
        <div class="form-group"><label>Kasa</label><select class="form-control" id="cmAcc">${REMS.Store.data.cashAccounts.map(a=>`<option value="${a.id}">${a.name}</option>`).join('')}</select></div>
        <div class="form-group"><label>Tür</label><select class="form-control" id="cmType"><option>Giriş</option><option>Çıkış</option></select></div>
        <div class="form-group"><label>Tutar *</label><input type="number" class="form-control" id="cmAmount"></div>
        <div class="form-group"><label>Yöntem</label><select class="form-control" id="cmMethod">${['Nakit','Kredi Kartı','Havale','EFT','FAST','Online Ödeme','Cari'].map(m=>`<option>${m}</option>`).join('')}</select></div>
        <div class="form-group full"><label>Açıklama</label><input class="form-control" id="cmDesc" placeholder="Satış komisyonu..."></div>
        <div class="form-group"><label>Portföy</label><select class="form-control" id="cmProp"><option value="">—</option>${REMS.Store.data.properties.slice(0,30).map(p=>`<option value="${p.id}">${p.code}</option>`).join('')}</select></div>
        <div class="form-group"><label>Müşteri</label><select class="form-control" id="cmCust"><option value="">—</option>${REMS.Store.data.customers.slice(0,30).map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</select></div>
      </div></div>
      <div class="modal-footer"><button class="btn btn-outline" data-close>İptal</button>
      <button class="btn btn-primary" onclick="REMS.Finance.saveCashMove()">Kaydet</button></div>`);
  },

  saveCashMove() {
    const amount = Number(document.getElementById('cmAmount').value);
    if (!amount) return REMS.toast('Tutar giriniz.', 'error');
    const type = document.getElementById('cmType').value;
    const accId = document.getElementById('cmAcc').value;
    const acc = REMS.Store.data.cashAccounts.find(a => a.id === accId);
    if (type === 'Giriş') acc.balance += amount; else acc.balance -= amount;
    REMS.Store.data.cashMovements.unshift({
      id: REMS.uid('cm'),
      date: new Date().toISOString().slice(0,10),
      no: REMS.Store.nextCode('cash'),
      description: document.getElementById('cmDesc').value || type,
      customerId: document.getElementById('cmCust').value || null,
      propertyId: document.getElementById('cmProp').value || null,
      type, category: type === 'Giriş' ? 'Gelir' : 'Gider',
      method: document.getElementById('cmMethod').value,
      accountId: accId,
      income: type === 'Giriş' ? amount : 0,
      expense: type === 'Çıkış' ? amount : 0,
      balance: acc.balance
    });
    REMS.Store.save();
    REMS.UI.closeOverlays();
    REMS.toast('Tahsilat kaydedildi.');
    REMS.Router.go('cash');
  },

  commissions() {
    const list = REMS.Store.data.commissions;
    return `
    <div class="page-header"><div><h1>Komisyonlar</h1><p>Otomatik hesaplama ve paylaşım</p></div>
    <button class="btn btn-primary" onclick="REMS.Finance.openCommission()">Komisyon Hesapla</button></div>
    <div class="card"><div class="table-wrap"><table class="data"><thead><tr>
      <th>Tarih</th><th>Portföy</th><th>Tutar</th><th>Oran</th><th>Danışman Payı</th><th>Ofis</th><th>Durum</th><th></th>
    </tr></thead><tbody>
    ${list.map(c => {
      const p = REMS.find.property(c.propertyId);
      return `<tr>
        <td>${REMS.fmt.date(c.date)}</td><td>${p?.code||'—'}</td>
        <td><strong>${REMS.fmt.money(c.amount)}</strong></td><td>%${c.rate}${c.vat?' +KDV':''}</td>
        <td>${REMS.fmt.money(c.agentAmount)}</td><td>${REMS.fmt.money(c.officeAmount)}</td>
        <td>${REMS.UI.statusBadge(c.status)}</td>
        <td><button class="btn btn-sm btn-outline" onclick="REMS.Finance.commissionDetail('${c.id}')">Paylaşım</button></td>
      </tr>`;
    }).join('')}
    </tbody></table></div></div>`;
  },

  commissionDetail(id) {
    const c = REMS.Store.data.commissions.find(x => x.id === id);
    REMS.UI.openDrawer(`
      <div class="drawer-header"><h2>Komisyon Paylaşımı</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="drawer-body">
        <div class="stat-row"><span>Toplam Komisyon</span><strong>${REMS.fmt.money(c.amount)}</strong></div>
        ${(c.splits||[]).map(s => `<div class="stat-row"><span>${s.role}<div class="text-muted" style="font-size:11px">${s.name} · %${s.percent}</div></span><strong>${REMS.fmt.money(s.amount)}</strong></div>`).join('')}
      </div>`);
  },

  openCommission() {
    REMS.UI.openModal(`
      <div class="modal-header"><h2>Komisyon Hesapla</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="modal-body"><div class="form-grid">
        <div class="form-group"><label>Satış Tutarı</label><input type="number" class="form-control" id="comPrice" value="8100000" oninput="REMS.Finance.previewCom()"></div>
        <div class="form-group"><label>Oran %</label><input type="number" class="form-control" id="comRate" value="2" oninput="REMS.Finance.previewCom()"></div>
        <div class="form-group"><label>Danışman Payı %</label><input type="number" class="form-control" id="comShare" value="50" oninput="REMS.Finance.previewCom()"></div>
        <div class="form-group"><label>Portföy</label><select class="form-control" id="comProp">${REMS.Store.data.properties.slice(0,40).map(p=>`<option value="${p.id}">${p.code}</option>`).join('')}</select></div>
        <div class="form-group full"><div id="comPreview" class="card card-body" style="background:var(--bg-soft)"></div></div>
      </div></div>
      <div class="modal-footer"><button class="btn btn-outline" data-close>İptal</button>
      <button class="btn btn-primary" onclick="REMS.Finance.saveCommission()">Danışman Payı Oluştur</button></div>`);
    this.previewCom();
  },

  previewCom() {
    const price = Number(document.getElementById('comPrice')?.value)||0;
    const rate = Number(document.getElementById('comRate')?.value)||2;
    const share = Number(document.getElementById('comShare')?.value)||50;
    const total = REMS.calcCommission(price, rate, true);
    const agent = Math.round(total * share / 100);
    const el = document.getElementById('comPreview');
    if (el) el.innerHTML = `<div class="stat-row"><span>Komisyon (%${rate} + KDV)</span><strong>${REMS.fmt.money(total)}</strong></div>
      <div class="stat-row"><span>Danışman Kazancı (%${share})</span><strong>${REMS.fmt.money(agent)}</strong></div>
      <div class="stat-row"><span>Ofis Payı</span><strong>${REMS.fmt.money(total-agent)}</strong></div>`;
  },

  saveCommission() {
    const price = Number(document.getElementById('comPrice').value);
    const rate = Number(document.getElementById('comRate').value);
    const share = Number(document.getElementById('comShare').value);
    const total = REMS.calcCommission(price, rate, true);
    const agentAmount = Math.round(total * share / 100);
    const propId = document.getElementById('comProp').value;
    const agent = REMS.find.agent(REMS.find.property(propId)?.agentId);
    REMS.Store.data.commissions.unshift({
      id: REMS.uid('com'), propertyId: propId, saleId: null, amount: total,
      rate, vat: true, agentShare: share, agentAmount, officeAmount: total - agentAmount,
      splits: [
        { role: 'Portföy Danışmanı', name: agent?.name || 'Danışman', percent: share, amount: agentAmount },
        { role: 'Ofis', name: 'EmlakPro', percent: 100 - share, amount: total - agentAmount }
      ],
      status: 'Tahsil Edildi', date: new Date().toISOString().slice(0,10)
    });
    if (agent) agent.commission += agentAmount;
    REMS.Store.data.cashMovements.unshift({
      id: REMS.uid('cm'), date: new Date().toISOString().slice(0,10), no: REMS.Store.nextCode('cash'),
      description: 'Komisyon tahsilatı', customerId: null, propertyId: propId,
      type: 'Giriş', category: 'Gelir', method: 'Havale', accountId: 'ca-3',
      income: total, expense: 0, balance: 0
    });
    const bank = REMS.Store.data.cashAccounts.find(a => a.id === 'ca-3');
    if (bank) bank.balance += total;
    REMS.Store.save();
    REMS.UI.closeOverlays();
    REMS.toast('Komisyon hesaplandı ve kaydedildi.');
    REMS.Router.go('commissions');
  },

  primes() {
    const agents = REMS.Store.data.agents.filter(a => a.commission > 0);
    return `
    <div class="page-header"><div><h1>Danışman Primleri</h1></div></div>
    <div class="card"><div class="table-wrap"><table class="data"><thead><tr>
      <th>Danışman</th><th>Satış</th><th>Kiralama</th><th>Dönüşüm</th><th>Toplam Prim</th>
    </tr></thead><tbody>
    ${agents.map(a => `<tr>
      <td><strong>${a.name}</strong></td><td>${a.sales}</td><td>${a.rentals}</td>
      <td>%${a.conversion}</td><td>${REMS.fmt.money(a.commission)}</td>
    </tr>`).join('')}
    </tbody></table></div></div>`;
  },

  rents() {
    const rentals = REMS.Store.data.rentals;
    const delayed = rentals.flatMap(r => r.payments.filter(p => p.status === 'Gecikti').map(p => ({ ...p, rental: r })));
    return `
    <div class="page-header"><div><h1>Kira Takibi</h1><p>${delayed.length} geciken tahsilat</p></div>
    <button class="btn btn-primary" onclick="REMS.Finance.collectRent()">Kira Tahsilatı</button></div>
    ${delayed.length ? `<div class="card card-body mb-16" style="border-left:4px solid var(--danger)">
      <strong>${delayed.length} Geciken Tahsilat</strong>
      ${delayed.map(d => {
        const c = REMS.find.customer(d.rental.customerId);
        return `<div class="stat-row"><div><strong>${d.tenantName || c?.name}</strong><div class="text-muted" style="font-size:11px">${d.daysLate||3} gün gecikti</div></div><span class="badge badge-danger">${REMS.fmt.money(d.amount)}</span></div>`;
      }).join('')}
    </div>` : ''}
    <div class="card"><div class="table-wrap"><table class="data"><thead><tr>
      <th>Portföy</th><th>Kiracı</th><th>Aylık</th><th>Ağustos</th><th>Eylül</th><th>Depozito</th>
    </tr></thead><tbody>
    ${rentals.map(r => {
      const p = REMS.find.property(r.propertyId);
      const c = REMS.find.customer(r.customerId);
      const aug = r.payments.find(x => x.month === '2026-08');
      const sep = r.payments.find(x => x.month === '2026-09') || { amount: r.monthlyRent, status: 'Bekliyor' };
      return `<tr>
        <td>${p?.code||'—'}</td><td>${c?.name||'—'}</td><td>${REMS.fmt.money(r.monthlyRent)}</td>
        <td>${REMS.fmt.money(aug?.amount)} ${REMS.UI.statusBadge(aug?.status||'—')}</td>
        <td>${REMS.fmt.money(sep.amount)} ${REMS.UI.statusBadge(sep.status)}</td>
        <td>${REMS.UI.statusBadge(r.depositStatus)}</td>
      </tr>`;
    }).join('')}
    </tbody></table></div></div>`;
  },

  collectRent() {
    REMS.UI.openModal(`
      <div class="modal-header"><h2>Kira Tahsilatı</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="modal-body"><div class="form-grid">
        <div class="form-group full"><label>Kiralama</label><select class="form-control" id="rentSel">${REMS.Store.data.rentals.map(r=>{
          const c = REMS.find.customer(r.customerId); const p = REMS.find.property(r.propertyId);
          return `<option value="${r.id}">${p?.code} · ${c?.name} · ${REMS.fmt.money(r.monthlyRent)}</option>`;
        }).join('')}</select></div>
        <div class="form-group"><label>Ay</label><input class="form-control" id="rentMonth" value="2026-08"></div>
        <div class="form-group"><label>Tutar</label><input type="number" class="form-control" id="rentAmt"></div>
        <div class="form-group"><label>Yöntem</label><select class="form-control" id="rentMethod"><option>Havale</option><option>EFT</option><option>Nakit</option><option>Kredi Kartı</option></select></div>
        <div class="form-group"><label>Durum</label><select class="form-control" id="rentStatus"><option>Ödendi</option><option>Kısmi Ödeme</option></select></div>
      </div></div>
      <div class="modal-footer"><button class="btn btn-primary" onclick="REMS.Finance.saveRentCollect()">Tahsilat Al</button></div>`);
    const r = REMS.Store.data.rentals[0];
    if (r) document.getElementById('rentAmt').value = r.monthlyRent;
  },

  saveRentCollect() {
    const r = REMS.Store.data.rentals.find(x => x.id === document.getElementById('rentSel').value);
    const month = document.getElementById('rentMonth').value;
    const amount = Number(document.getElementById('rentAmt').value);
    const status = document.getElementById('rentStatus').value;
    let pay = r.payments.find(p => p.month === month);
    if (!pay) { pay = { month, amount, status }; r.payments.push(pay); }
    else { pay.amount = amount; pay.status = status; delete pay.daysLate; }
    REMS.Store.data.cashMovements.unshift({
      id: REMS.uid('cm'), date: new Date().toISOString().slice(0,10), no: REMS.Store.nextCode('cash'),
      description: `Kira tahsilatı ${month}`, customerId: r.customerId, propertyId: r.propertyId,
      type: 'Giriş', category: 'Gelir', method: document.getElementById('rentMethod').value,
      accountId: 'ca-3', income: amount, expense: 0, balance: 0
    });
    REMS.Store.save();
    REMS.UI.closeOverlays();
    REMS.toast('Kira tahsilatı kaydedildi.');
    REMS.Router.go('rents');
  },

  deposits() {
    return `
    <div class="page-header"><div><h1>Depozitolar</h1><p>Alınan / iade / mahsup</p></div>
    <button class="btn btn-primary" onclick="REMS.Finance.cycleDeposit()">Durum Güncelle</button></div>
    <div class="card"><div class="table-wrap"><table class="data"><thead><tr>
      <th>Portföy</th><th>Kiracı</th><th>Tutar</th><th>Durum</th>
    </tr></thead><tbody>
    ${REMS.Store.data.rentals.map(r => {
      const p = REMS.find.property(r.propertyId);
      const c = REMS.find.customer(r.customerId);
      return `<tr>
        <td>${p?.code}</td><td>${c?.name}</td><td>${REMS.fmt.money(r.deposit)}</td>
        <td>${REMS.UI.statusBadge(r.depositStatus)}</td>
      </tr>`;
    }).join('')}
    </tbody></table></div></div>`;
  },

  cycleDeposit() {
    const r = REMS.Store.data.rentals[0];
    if (!r) return;
    const order = ['Alındı', 'Mahsup Edildi', 'İade Edildi'];
    r.depositStatus = order[(order.indexOf(r.depositStatus) + 1) % order.length];
    REMS.Store.save();
    REMS.toast(`Depozito: ${r.depositStatus}`);
    REMS.Router.render();
  },

  collections() {
    return `
    <div class="page-header"><div><h1>Tahsilatlar</h1><p>Parçalı ödeme destekli</p></div>
    <button class="btn btn-primary" onclick="REMS.Finance.openCollection()">Tahsilat Al</button></div>
    <div class="card"><div class="table-wrap"><table class="data"><thead><tr>
      <th>Tarih</th><th>Açıklama</th><th>Yöntem</th><th>Tutar</th>
    </tr></thead><tbody>
    ${REMS.Store.data.cashMovements.filter(m=>m.type==='Giriş').slice(0,30).map(m => `
      <tr><td>${REMS.fmt.date(m.date)}</td><td>${m.description}</td><td>${m.method}</td><td>${REMS.fmt.money(m.income)}</td></tr>
    `).join('')}
    </tbody></table></div></div>`;
  },

  openCollection() {
    REMS.UI.openModal(`
      <div class="modal-header"><h2>Tahsilat / Kapora</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="modal-body"><div class="form-grid">
        <div class="form-group"><label>Tür</label><select class="form-control" id="colType"><option>Kapora</option><option>Komisyon</option><option>Kira</option><option>Diğer</option></select></div>
        <div class="form-group"><label>Tutar *</label><input type="number" class="form-control" id="colAmt" value="100000"></div>
        <div class="form-group"><label>Yöntem</label><select class="form-control" id="colMethod">${['Nakit','Kredi Kartı','Havale','EFT','FAST','Online Ödeme','Cari'].map(m=>`<option>${m}</option>`).join('')}</select></div>
        <div class="form-group"><label>Portföy</label><select class="form-control" id="colProp">${REMS.Store.data.properties.slice(0,30).map(p=>`<option value="${p.id}">${p.code}</option>`).join('')}</select></div>
        <div class="form-group"><label>Müşteri</label><select class="form-control" id="colCust">${REMS.Store.data.customers.slice(0,30).map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label>İade Durumu</label><select class="form-control" id="colRefund"><option>Yok</option><option>İade Edilebilir</option><option>İade Edildi</option></select></div>
        <div class="form-group full"><label>Açıklama</label><input class="form-control" id="colDesc" value="Kapora tahsilatı"></div>
      </div></div>
      <div class="modal-footer"><button class="btn btn-primary" onclick="REMS.Finance.saveCollection()">Kaydet</button></div>`);
  },

  saveCollection() {
    const amount = Number(document.getElementById('colAmt').value);
    if (!amount) return REMS.toast('Tutar giriniz.', 'error');
    const propId = document.getElementById('colProp').value;
    REMS.Store.data.cashMovements.unshift({
      id: REMS.uid('cm'), date: new Date().toISOString().slice(0,10), no: REMS.Store.nextCode('cash'),
      description: `${document.getElementById('colType').value}: ${document.getElementById('colDesc').value}`,
      customerId: document.getElementById('colCust').value, propertyId: propId,
      type: 'Giriş', category: 'Gelir', method: document.getElementById('colMethod').value,
      accountId: 'ca-1', income: amount, expense: 0, balance: 0,
      refundStatus: document.getElementById('colRefund').value
    });
    const acc = REMS.Store.data.cashAccounts.find(a => a.id === 'ca-1');
    if (acc) acc.balance += amount;
    const sale = REMS.Store.data.sales.find(s => s.propertyId === propId && s.status === 'Devam');
    if (sale && document.getElementById('colType').value === 'Kapora') {
      sale.deposit = amount; sale.depositPaid = true; sale.step = Math.max(sale.step, 2);
    }
    REMS.Store.save();
    REMS.UI.closeOverlays();
    REMS.toast('Tahsilat kaydedildi.');
    REMS.Router.go('collections');
  },

  incomeExpense() {
    const moves = REMS.Store.data.cashMovements;
    const income = moves.filter(m => m.type === 'Giriş').reduce((s, m) => s + m.income, 0);
    const expense = moves.filter(m => m.type === 'Çıkış').reduce((s, m) => s + m.expense, 0);
    return `
    <div class="page-header"><div><h1>Gelir / Gider</h1></div>
    <button class="btn btn-outline" onclick="REMS.Finance.openCashMove()">Hareket Ekle</button></div>
    <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="kpi-card"><div class="kpi-label">Toplam Gelir</div><div class="kpi-value" style="font-size:20px">${REMS.fmt.money(income)}</div></div>
      <div class="kpi-card"><div class="kpi-label">Toplam Gider</div><div class="kpi-value" style="font-size:20px">${REMS.fmt.money(expense)}</div></div>
      <div class="kpi-card"><div class="kpi-label">Net</div><div class="kpi-value" style="font-size:20px">${REMS.fmt.money(income-expense)}</div></div>
    </div>
    <div class="grid-2 mt-16">
      <div class="card card-body"><h3>Gelir Kalemleri</h3>
        ${['satış komisyonu','kiralama komisyonu','kapora','danışmanlık'].map(k => {
          const sum = moves.filter(m => m.type==='Giriş' && m.description.toLowerCase().includes(k.split(' ')[0])).reduce((s,m)=>s+m.income,0);
          return `<div class="stat-row"><span>${k}</span><strong>${REMS.fmt.money(sum||Math.round(income*0.2))}</strong></div>`;
        }).join('')}
      </div>
      <div class="card card-body"><h3>Gider Kalemleri</h3>
        ${['reklam','portal','personel','yakıt','fotoğraf'].map(k => {
          const sum = moves.filter(m => m.type==='Çıkış' && m.description.toLowerCase().includes(k)).reduce((s,m)=>s+m.expense,0);
          return `<div class="stat-row"><span>${k}</span><strong>${REMS.fmt.money(sum||Math.round(expense*0.15))}</strong></div>`;
        }).join('')}
      </div>
    </div>`;
  },

  accounts() {
    const types = [
      ...REMS.Store.data.owners.slice(0,5).map(o => ({ type:'Mülk Sahibi', name:o.name, phone:o.phone })),
      ...REMS.Store.data.agents.slice(0,5).map(a => ({ type:'Danışman', name:a.name, phone:a.phone })),
      ...REMS.Store.data.customers.slice(0,5).map(c => ({ type:'Müşteri', name:c.name, phone:c.phone })),
      { type:'Tedarikçi', name:'Portal Medya A.Ş.', phone:'0212 444 0000' },
      { type:'Firma', name:'FotoStudio İstanbul', phone:'0216 333 0000' }
    ];
    return `
    <div class="page-header"><div><h1>Cari Hesaplar</h1></div></div>
    <div class="card"><div class="table-wrap"><table class="data"><thead><tr>
      <th>Tip</th><th>Unvan</th><th>Telefon</th><th>Bakiye</th>
    </tr></thead><tbody>
    ${types.map((t,i) => `<tr><td>${t.type}</td><td><strong>${t.name}</strong></td><td>${t.phone}</td><td>${REMS.fmt.money((i%5)*12500)}</td></tr>`).join('')}
    </tbody></table></div></div>`;
  }
};
