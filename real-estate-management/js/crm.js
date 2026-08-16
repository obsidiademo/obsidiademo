/* CRM — customers, owners, requests, offers */
window.REMS = window.REMS || {};
REMS.CRM = {
  customers() {
    const list = REMS.Store.data.customers;
    return `
    <div class="page-header"><div><h1>Müşteriler</h1><p>Alıcı ve kiracı adayları CRM</p></div>
    <button class="btn btn-primary" onclick="REMS.CRM.openCustomer()"><i data-lucide="plus"></i> Müşteri Ekle</button></div>
    <div class="card"><div class="table-wrap"><table class="data"><thead><tr>
      <th>Ad Soyad</th><th>Telefon</th><th>Bütçe</th><th>Bölge</th><th>Tip</th><th>İşlem</th><th></th>
    </tr></thead><tbody>
    ${list.map(c => `<tr onclick="REMS.CRM.customerDetail('${c.id}')">
      <td><strong>${c.name}</strong></td><td>${c.phone}</td>
      <td>${REMS.fmt.money(c.budgetMin)} – ${REMS.fmt.money(c.budgetMax)}</td>
      <td>${(c.preferredDistricts||[]).join(', ')}</td>
      <td>${c.propertyType} ${c.rooms}</td><td>${c.transactionType}</td>
      <td><button class="btn btn-sm btn-outline" onclick="event.stopPropagation();REMS.CRM.openCustomer('${c.id}')">Düzenle</button></td>
    </tr>`).join('')}
    </tbody></table></div></div>`;
  },

  customerDetail(id) {
    const c = REMS.find.customer(id);
    REMS.UI.openDrawer(`
      <div class="drawer-header"><h2>${c.name}</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="drawer-body">
        <div class="info-list">
          <div><span>Telefon</span><strong>${c.phone}</strong></div>
          <div><span>E-posta</span><strong>${c.email}</strong></div>
          <div><span>Meslek</span><strong>${c.job}</strong></div>
          <div><span>Finansman</span><strong>${c.financing}</strong></div>
          <div><span>Bütçe</span><strong>${REMS.fmt.money(c.budgetMin)} – ${REMS.fmt.money(c.budgetMax)}</strong></div>
          <div><span>Tercih</span><strong>${c.transactionType} ${c.rooms} · ${c.minM2}-${c.maxM2} m²</strong></div>
        </div>
        <p class="mt-16 text-muted">${c.notes || ''}</p>
        <div class="page-actions mt-16">
          <button class="btn btn-primary btn-sm" onclick="REMS.CRM.openRequest('${c.id}')">Talep Oluştur</button>
          <button class="btn btn-outline btn-sm" onclick="REMS.CRM.openOffer(null,'${c.id}')">Teklif</button>
        </div>
      </div>`);
  },

  openCustomer(id = null) {
    const c = id ? REMS.find.customer(id) : null;
    REMS.UI.openModal(`
      <div class="modal-header"><h2>${c?'Müşteri Düzenle':'Yeni Müşteri'}</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="modal-body"><div class="form-grid">
        <div class="form-group"><label>Ad Soyad *</label><input class="form-control" id="cuName" value="${c?.name||''}"></div>
        <div class="form-group"><label>Telefon *</label><input class="form-control" id="cuPhone" value="${c?.phone||''}"></div>
        <div class="form-group"><label>E-posta</label><input class="form-control" id="cuEmail" value="${c?.email||''}"></div>
        <div class="form-group"><label>Meslek</label><input class="form-control" id="cuJob" value="${c?.job||''}"></div>
        <div class="form-group"><label>Min Bütçe</label><input type="number" class="form-control" id="cuMin" value="${c?.budgetMin||''}"></div>
        <div class="form-group"><label>Max Bütçe</label><input type="number" class="form-control" id="cuMax" value="${c?.budgetMax||''}"></div>
        <div class="form-group"><label>Bölgeler</label><input class="form-control" id="cuDist" value="${(c?.preferredDistricts||[]).join(', ')}"></div>
        <div class="form-group"><label>Oda</label><select class="form-control" id="cuRooms">${['1+1','2+1','3+1','4+1'].map(t=>`<option ${c?.rooms===t?'selected':''}>${t}</option>`).join('')}</select></div>
        <div class="form-group"><label>İşlem</label><select class="form-control" id="cuTx"><option ${c?.transactionType==='Satılık'?'selected':''}>Satılık</option><option ${c?.transactionType==='Kiralık'?'selected':''}>Kiralık</option></select></div>
        <div class="form-group"><label>Tür</label><select class="form-control" id="cuType">${['Daire','Villa','Rezidans','Dükkan'].map(t=>`<option ${c?.propertyType===t?'selected':''}>${t}</option>`).join('')}</select></div>
        <div class="form-group full"><label>Notlar</label><textarea class="form-control" id="cuNotes">${c?.notes||''}</textarea></div>
      </div></div>
      <div class="modal-footer"><button class="btn btn-outline" data-close>İptal</button>
      <button class="btn btn-primary" onclick="REMS.CRM.saveCustomer('${id||''}')">Kaydet</button></div>`);
  },

  saveCustomer(id) {
    const name = document.getElementById('cuName').value.trim();
    const phone = document.getElementById('cuPhone').value.trim();
    if (!name || !phone) return REMS.toast('Ad ve telefon zorunludur.', 'error');
    const payload = {
      name, phone,
      email: document.getElementById('cuEmail').value,
      job: document.getElementById('cuJob').value,
      budgetMin: Number(document.getElementById('cuMin').value)||0,
      budgetMax: Number(document.getElementById('cuMax').value)||0,
      preferredDistricts: document.getElementById('cuDist').value.split(',').map(s=>s.trim()).filter(Boolean),
      rooms: document.getElementById('cuRooms').value,
      transactionType: document.getElementById('cuTx').value,
      propertyType: document.getElementById('cuType').value,
      notes: document.getElementById('cuNotes').value,
      financing: 'Karma', minM2: 90, maxM2: 160, favorites: []
    };
    if (id) Object.assign(REMS.find.customer(id), payload);
    else REMS.Store.data.customers.unshift({ id: REMS.uid('cu'), ...payload, createdAt: new Date().toISOString().slice(0,10) });
    REMS.Store.save();
    REMS.UI.closeOverlays();
    REMS.toast('Müşteri kaydedildi.');
    REMS.Router.go('customers');
  },

  owners() {
    const list = REMS.Store.data.owners;
    return `
    <div class="page-header"><div><h1>Mülk Sahipleri</h1><p>Portföy ilişkili CRM</p></div>
    <button class="btn btn-primary" onclick="REMS.CRM.openOwner()"><i data-lucide="plus"></i> Mülk Sahibi Ekle</button></div>
    <div class="card"><div class="table-wrap"><table class="data"><thead><tr>
      <th>Ad Soyad</th><th>Telefon</th><th>E-posta</th><th>Aktif Portföy</th><th>Satılan</th><th>Kiralanan</th><th></th>
    </tr></thead><tbody>
    ${list.map(o => {
      const props = REMS.Store.data.properties.filter(p => p.ownerId === o.id);
      return `<tr onclick="REMS.CRM.ownerDetail('${o.id}')">
        <td><strong>${o.name}</strong></td><td>${o.phone}</td><td>${o.email}</td>
        <td>${props.filter(p=>['Aktif','Yeni','Teklif Var','Opsiyonlu'].includes(p.status)).length}</td>
        <td>${props.filter(p=>p.status==='Satıldı').length}</td>
        <td>${props.filter(p=>p.status==='Kiralandı').length}</td>
        <td><button class="btn btn-sm btn-outline" onclick="event.stopPropagation();REMS.CRM.openOwner('${o.id}')">Düzenle</button></td>
      </tr>`;
    }).join('')}
    </tbody></table></div></div>`;
  },

  ownerDetail(id) {
    const o = REMS.find.owner(id);
    const props = REMS.Store.data.properties.filter(p => p.ownerId === id);
    REMS.UI.openDrawer(`
      <div class="drawer-header"><h2>${o.name}</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="drawer-body">
        <div class="info-list">
          <div><span>Telefon</span><strong>${o.phone}</strong></div>
          <div><span>E-posta</span><strong>${o.email}</strong></div>
          <div><span>TC/VKN</span><strong>${o.tc}</strong></div>
          <div><span>Banka</span><strong>${o.bank}</strong></div>
          <div><span>IBAN</span><strong style="font-size:11px">${o.iban}</strong></div>
          <div><span>Adres</span><strong>${o.address}</strong></div>
        </div>
        <p class="mt-16 text-muted">${o.notes||''}</p>
        <h3 class="mt-16">Portföyler</h3>
        ${props.map(p => `<div class="stat-row"><div><strong>${p.code}</strong><div class="text-muted" style="font-size:11px">${REMS.fmt.money(p.currentPrice)}</div></div>${REMS.UI.statusBadge(p.status)}</div>`).join('') || '<p class="text-muted">Portföy yok</p>'}
        <h3 class="mt-16">Fiyat Değişiklikleri</h3>
        ${props.flatMap(p => (p.priceHistory||[]).slice(-2).map(h => `<div class="stat-row"><span>${p.code} · ${REMS.fmt.date(h.date)}</span><strong>${REMS.fmt.money(h.price)}</strong></div>`)).join('') || '<p class="text-muted">—</p>'}
      </div>`);
  },

  openOwner(id = null) {
    const o = id ? REMS.find.owner(id) : null;
    REMS.UI.openModal(`
      <div class="modal-header"><h2>${o?'Düzenle':'Yeni Mülk Sahibi'}</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="modal-body"><div class="form-grid">
        <div class="form-group"><label>Ad Soyad *</label><input class="form-control" id="owName" value="${o?.name||''}"></div>
        <div class="form-group"><label>Telefon *</label><input class="form-control" id="owPhone" value="${o?.phone||''}"></div>
        <div class="form-group"><label>E-posta</label><input class="form-control" id="owEmail" value="${o?.email||''}"></div>
        <div class="form-group"><label>TC/VKN</label><input class="form-control" id="owTc" value="${o?.tc||''}"></div>
        <div class="form-group"><label>Banka</label><input class="form-control" id="owBank" value="${o?.bank||''}"></div>
        <div class="form-group"><label>IBAN</label><input class="form-control" id="owIban" value="${o?.iban||''}"></div>
        <div class="form-group full"><label>Adres</label><input class="form-control" id="owAddr" value="${o?.address||''}"></div>
        <div class="form-group full"><label>Notlar</label><textarea class="form-control" id="owNotes">${o?.notes||''}</textarea></div>
      </div></div>
      <div class="modal-footer"><button class="btn btn-outline" data-close>İptal</button>
      <button class="btn btn-primary" onclick="REMS.CRM.saveOwner('${id||''}')">Kaydet</button></div>`);
  },

  saveOwner(id) {
    const name = document.getElementById('owName').value.trim();
    const phone = document.getElementById('owPhone').value.trim();
    if (!name || !phone) return REMS.toast('Ad ve telefon zorunludur.', 'error');
    const payload = {
      name, phone,
      email: document.getElementById('owEmail').value,
      tc: document.getElementById('owTc').value,
      bank: document.getElementById('owBank').value,
      iban: document.getElementById('owIban').value,
      address: document.getElementById('owAddr').value,
      notes: document.getElementById('owNotes').value
    };
    if (id) Object.assign(REMS.find.owner(id), payload);
    else REMS.Store.data.owners.unshift({ id: REMS.uid('ow'), ...payload, createdAt: new Date().toISOString().slice(0,10) });
    REMS.Store.save();
    REMS.UI.closeOverlays();
    REMS.toast('Mülk sahibi kaydedildi.');
    REMS.Router.go('owners');
  },

  requests() {
    const list = REMS.Store.data.requests;
    return `
    <div class="page-header"><div><h1>Müşteri Talepleri</h1><p>Otomatik portföy eşleştirme</p></div>
    <button class="btn btn-primary" onclick="REMS.CRM.openRequest()"><i data-lucide="plus"></i> Talep Oluştur</button></div>
    <div class="grid-2">${list.map(r => {
      const c = REMS.find.customer(r.customerId);
      const matches = REMS.matchProperties(r);
      return `<div class="card card-body">
        <div class="flex-between"><strong>${c?.name || 'Müşteri'}</strong><span class="badge badge-primary">${r.transactionType}</span></div>
        <p class="text-muted" style="font-size:12px;margin:8px 0">${(r.districts||[]).join(' / ')} · ${(r.rooms||[]).join(' veya ')} · ${REMS.fmt.money(r.budgetMin)} – ${REMS.fmt.money(r.budgetMax)} · min ${r.minM2} m²</p>
        <div class="flex-between mb-16"><strong>${matches.length} Uygun Portföy Bulundu</strong>
          <button class="btn btn-sm btn-outline" onclick="REMS.CRM.showMatches('${r.id}')">Eşleşmeleri Gör</button></div>
        <div class="match-list">${matches.slice(0,3).map(m => `
          <div class="match-item">
            <img src="${REMS.cover(m.property)}" alt="">
            <div><strong>${m.property.title.slice(0,40)}</strong><div class="text-muted" style="font-size:11px">${REMS.fmt.money(m.property.currentPrice)}</div></div>
            <div class="match-score">%${m.score}</div>
          </div>`).join('')}</div>
      </div>`;
    }).join('')}</div>`;
  },

  showMatches(reqId) {
    const r = REMS.Store.data.requests.find(x => x.id === reqId);
    const matches = REMS.matchProperties(r);
    REMS.UI.openDrawer(`
      <div class="drawer-header"><h2>${matches.length} Uygun Portföy</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="drawer-body"><div class="match-list">${matches.map(m => `
        <div class="match-item" style="cursor:pointer" onclick="REMS.UI.closeOverlays();REMS.Router.go('property-detail',{id:'${m.property.id}'})">
          <img src="${REMS.cover(m.property)}" alt="">
          <div><strong>${m.property.title}</strong><div class="text-muted" style="font-size:11px">${m.property.code} · ${REMS.fmt.money(m.property.currentPrice)}</div></div>
          <div class="match-score">%${m.score}</div>
        </div>`).join('')}</div>
        <button class="btn btn-primary mt-16" onclick="REMS.Properties.openShareModal('${matches[0]?.property.id}')">Seçilenleri Paylaş</button>
      </div>`);
  },

  openRequest(customerId = '') {
    REMS.UI.openModal(`
      <div class="modal-header"><h2>Müşteri Talebi</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="modal-body"><div class="form-grid">
        <div class="form-group full"><label>Müşteri *</label><select class="form-control" id="rqCust">${REMS.Store.data.customers.map(c=>`<option value="${c.id}" ${customerId===c.id?'selected':''}>${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label>İşlem</label><select class="form-control" id="rqTx"><option>Satılık</option><option>Kiralık</option></select></div>
        <div class="form-group"><label>Tür</label><select class="form-control" id="rqType"><option>Daire</option><option>Villa</option><option>Rezidans</option></select></div>
        <div class="form-group"><label>Bölgeler</label><input class="form-control" id="rqDist" value="Bakırköy, Ataköy"></div>
        <div class="form-group"><label>Odalar</label><input class="form-control" id="rqRooms" value="3+1, 4+1"></div>
        <div class="form-group"><label>Min Bütçe</label><input type="number" class="form-control" id="rqMin" value="7000000"></div>
        <div class="form-group"><label>Max Bütçe</label><input type="number" class="form-control" id="rqMax" value="9000000"></div>
        <div class="form-group"><label>Min m²</label><input type="number" class="form-control" id="rqMinM2" value="120"></div>
        <div class="form-group"><label>Max m²</label><input type="number" class="form-control" id="rqMaxM2" value="160"></div>
      </div></div>
      <div class="modal-footer"><button class="btn btn-outline" data-close>İptal</button>
      <button class="btn btn-primary" onclick="REMS.CRM.saveRequest()">Kaydet & Eşleştir</button></div>`);
  },

  saveRequest() {
    const req = {
      id: REMS.uid('req'),
      customerId: document.getElementById('rqCust').value,
      transactionType: document.getElementById('rqTx').value,
      propertyType: document.getElementById('rqType').value,
      districts: document.getElementById('rqDist').value.split(',').map(s=>s.trim()),
      rooms: document.getElementById('rqRooms').value.split(',').map(s=>s.trim()),
      budgetMin: Number(document.getElementById('rqMin').value),
      budgetMax: Number(document.getElementById('rqMax').value),
      minM2: Number(document.getElementById('rqMinM2').value),
      maxM2: Number(document.getElementById('rqMaxM2').value),
      notes: '', createdAt: new Date().toISOString().slice(0,10)
    };
    REMS.Store.data.requests.unshift(req);
    REMS.Store.save();
    REMS.UI.closeOverlays();
    const n = REMS.matchProperties(req).length;
    REMS.toast(`${n} uygun portföy bulundu.`);
    REMS.Router.go('requests');
  },

  offers() {
    const list = REMS.Store.data.offers;
    return `
    <div class="page-header"><div><h1>Teklifler</h1><p>Pazarlık süreçleri</p></div>
    <button class="btn btn-primary" onclick="REMS.CRM.openOffer()"><i data-lucide="plus"></i> Yeni Teklif</button></div>
    ${list.length ? `<div class="card"><div class="table-wrap"><table class="data"><thead><tr>
      <th>Müşteri</th><th>Portföy</th><th>İlan</th><th>Teklif</th><th>Ödeme</th><th>Durum</th><th></th>
    </tr></thead><tbody>
    ${list.map(o => {
      const c = REMS.find.customer(o.customerId);
      const p = REMS.find.property(o.propertyId);
      return `<tr>
        <td>${c?.name||'—'}</td><td>${p?.code||'—'}</td>
        <td>${REMS.fmt.money(o.listPrice)}</td><td><strong>${REMS.fmt.money(o.offerPrice)}</strong></td>
        <td>${o.paymentType}</td><td>${REMS.UI.statusBadge(o.status)}</td>
        <td><button class="btn btn-sm btn-outline" onclick="REMS.CRM.offerDetail('${o.id}')">Pazarlık</button></td>
      </tr>`;
    }).join('')}
    </tbody></table></div></div>` : REMS.UI.empty('Henüz aktif teklif bulunmuyor.', '', '+ Yeni Teklif Oluştur', () => REMS.CRM.openOffer())}`;
  },

  offerDetail(id) {
    const o = REMS.Store.data.offers.find(x => x.id === id);
    const p = REMS.find.property(o.propertyId);
    REMS.UI.openDrawer(`
      <div class="drawer-header"><h2>Pazarlık · ${p?.code||''}</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="drawer-body">
        <div class="timeline">${(o.history||[]).map(h => `
          <div class="timeline-item"><div class="timeline-dot"></div>
          <div class="timeline-content"><strong>${h.by}: ${REMS.fmt.money(h.price)}</strong>
          <p>${REMS.fmt.date(h.date)}${h.result ? ' · ' + h.result : ''}</p></div></div>`).join('')}
        </div>
        <div class="form-grid mt-16">
          <div class="form-group"><label>Yeni Teklif</label><input type="number" class="form-control" id="negPrice" value="${o.offerPrice}"></div>
          <div class="form-group"><label>Kim</label><select class="form-control" id="negBy"><option>Müşteri</option><option>Mülk Sahibi</option></select></div>
        </div>
      </div>
      <div class="drawer-footer">
        <button class="btn btn-outline" onclick="REMS.CRM.addNegotiation('${id}')">Versiyon Ekle</button>
        <button class="btn btn-success" onclick="REMS.CRM.acceptOffer('${id}')">Kabul Et</button>
      </div>`);
  },

  addNegotiation(id) {
    const o = REMS.Store.data.offers.find(x => x.id === id);
    const price = Number(document.getElementById('negPrice').value);
    if (!price) return REMS.toast('Teklif fiyatı giriniz.', 'error');
    o.history = o.history || [];
    o.history.push({ by: document.getElementById('negBy').value, price, date: new Date().toISOString().slice(0,10) });
    o.offerPrice = price;
    o.status = 'Pazarlık';
    REMS.Store.save();
    REMS.toast('Teklif güncellendi');
    this.offerDetail(id);
  },

  acceptOffer(id) {
    const o = REMS.Store.data.offers.find(x => x.id === id);
    o.status = 'Kabul';
    o.history.push({ by: 'Sonuç', price: o.offerPrice, date: new Date().toISOString().slice(0,10), result: 'Kabul Edildi' });
    const p = REMS.find.property(o.propertyId);
    if (p) p.status = 'Opsiyonlu';
    REMS.Store.data.sales.unshift({
      id: REMS.uid('sale'), propertyId: o.propertyId, customerId: o.customerId, agentId: o.agentId,
      step: 0, agreedPrice: o.offerPrice, deposit: 0, depositPaid: false,
      createdAt: new Date().toISOString().slice(0,10), status: 'Devam'
    });
    REMS.Store.save();
    REMS.UI.closeOverlays();
    REMS.toast('Teklif kabul edildi. Satış süreci başladı.');
    REMS.Router.go('sales');
  },

  openOffer(propertyId = null, customerId = null) {
    REMS.UI.openModal(`
      <div class="modal-header"><h2>Yeni Teklif</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="modal-body"><div class="form-grid">
        <div class="form-group"><label>Müşteri</label><select class="form-control" id="ofCust">${REMS.Store.data.customers.map(c=>`<option value="${c.id}" ${customerId===c.id?'selected':''}>${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label>Portföy</label><select class="form-control" id="ofProp" onchange="REMS.CRM.fillOfferPrice()">${REMS.Store.data.properties.filter(p=>['Aktif','Yeni','Teklif Var','Opsiyonlu'].includes(p.status)).map(p=>`<option value="${p.id}" ${propertyId===p.id?'selected':''}>${p.code} · ${REMS.fmt.money(p.currentPrice)}</option>`).join('')}</select></div>
        <div class="form-group"><label>İlan Fiyatı</label><input type="number" class="form-control" id="ofList" readonly></div>
        <div class="form-group"><label>Teklif Fiyatı *</label><input type="number" class="form-control" id="ofPrice"></div>
        <div class="form-group"><label>Ödeme</label><select class="form-control" id="ofPay"><option>Peşin</option><option>Kredi</option><option>Karma</option></select></div>
        <div class="form-group"><label>Kredi Durumu</label><select class="form-control" id="ofCredit"><option>-</option><option>Ön Onaylı</option><option>Başvuru Yapıldı</option></select></div>
        <div class="form-group"><label>Tarih</label><input type="date" class="form-control" id="ofDate" value="2026-08-16"></div>
        <div class="form-group"><label>Geçerlilik</label><input type="date" class="form-control" id="ofValid" value="2026-08-23"></div>
      </div></div>
      <div class="modal-footer"><button class="btn btn-outline" data-close>İptal</button>
      <button class="btn btn-primary" onclick="REMS.CRM.saveOffer()">Teklif Gönder</button></div>`);
    this.fillOfferPrice();
  },

  fillOfferPrice() {
    const p = REMS.find.property(document.getElementById('ofProp')?.value);
    if (!p) return;
    document.getElementById('ofList').value = p.currentPrice;
    document.getElementById('ofPrice').value = Math.round(p.currentPrice * 0.96);
  },

  saveOffer() {
    const price = Number(document.getElementById('ofPrice').value);
    if (!price) return REMS.toast('Teklif fiyatı giriniz.', 'error');
    const propId = document.getElementById('ofProp').value;
    const p = REMS.find.property(propId);
    const offer = {
      id: REMS.uid('of'),
      customerId: document.getElementById('ofCust').value,
      propertyId: propId,
      agentId: p.agentId,
      listPrice: Number(document.getElementById('ofList').value),
      offerPrice: price,
      paymentType: document.getElementById('ofPay').value,
      creditStatus: document.getElementById('ofCredit').value,
      date: document.getElementById('ofDate').value,
      validUntil: document.getElementById('ofValid').value,
      status: 'Bekliyor',
      history: [{ by: 'Müşteri', price, date: document.getElementById('ofDate').value }]
    };
    REMS.Store.data.offers.unshift(offer);
    if (p) p.status = 'Teklif Var';
    REMS.notify('Yeni Teklif', `${p.code} için ${REMS.fmt.money(price)} teklif var.`, 'offer');
    REMS.Store.save();
    REMS.UI.closeOverlays();
    REMS.toast('Teklif gönderildi.');
    REMS.Router.go('offers');
  }
};
