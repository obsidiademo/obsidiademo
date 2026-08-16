/* Contracts, sales & rental pipelines */
window.REMS = window.REMS || {};
REMS.Contracts = {
  list() {
    const list = REMS.Store.data.contracts;
    return `
    <div class="page-header"><div><h1>Sözleşmeler</h1><p>Yetki, satış, kira, kapora, yer gösterme</p></div>
    <button class="btn btn-primary" onclick="REMS.Contracts.create()"><i data-lucide="plus"></i> Sözleşme Oluştur</button></div>
    <div class="card"><div class="table-wrap"><table class="data"><thead><tr>
      <th>No</th><th>Tür</th><th>Portföy</th><th>Taraf</th><th>Tarih</th><th>Durum</th><th></th>
    </tr></thead><tbody>
    ${list.map(c => {
      const p = REMS.find.property(c.propertyId);
      return `<tr>
        <td>${c.no}</td><td>${c.type}</td><td>${p?.code||'—'}</td><td>${c.party}</td>
        <td>${REMS.fmt.date(c.date)}</td><td>${REMS.UI.statusBadge(c.status)}</td>
        <td><button class="btn btn-sm btn-outline" onclick="REMS.Contracts.print('${c.id}')">Yazdır</button></td>
      </tr>`;
    }).join('')}
    </tbody></table></div></div>`;
  },

  create() {
    REMS.UI.openModal(`
      <div class="modal-header"><h2>Sözleşme Oluştur</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="modal-body"><div class="form-grid">
        <div class="form-group"><label>Tür</label><select class="form-control" id="ctType">
          <option>Portföy Yetki Sözleşmesi</option><option>Yer Gösterme Formu</option>
          <option>Satış Sözleşmesi</option><option>Kira Sözleşmesi</option><option>Kapora Sözleşmesi</option>
        </select></div>
        <div class="form-group"><label>Portföy</label><select class="form-control" id="ctProp">${REMS.Store.data.properties.slice(0,40).map(p=>`<option value="${p.id}">${p.code}</option>`).join('')}</select></div>
        <div class="form-group"><label>Taraf</label><input class="form-control" id="ctParty" placeholder="Ad Soyad"></div>
        <div class="form-group"><label>Tutar</label><input type="number" class="form-control" id="ctPrice"></div>
      </div></div>
      <div class="modal-footer"><button class="btn btn-primary" onclick="REMS.Contracts.save()">Oluştur</button></div>`);
  },

  save() {
    const party = document.getElementById('ctParty').value.trim();
    if (!party) return REMS.toast('Taraf adını giriniz.', 'error');
    const type = document.getElementById('ctType').value;
    const propId = document.getElementById('ctProp').value;
    const ct = {
      id: REMS.uid('ct'), type, propertyId: propId, party,
      no: `${type.slice(0,3).toUpperCase()}-2026-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0,10), status: 'Aktif',
      price: Number(document.getElementById('ctPrice').value) || null
    };
    REMS.Store.data.contracts.unshift(ct);
    REMS.Store.save();
    REMS.UI.closeOverlays();
    REMS.toast('Sözleşme oluşturuldu.');
    this.print(ct.id);
  },

  print(id) {
    const c = REMS.Store.data.contracts.find(x => x.id === id);
    const p = REMS.find.property(c.propertyId);
    REMS.UI.openModal(`
      <div class="modal-header no-print"><h2>Sözleşme Önizleme</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="modal-body"><div class="print-doc" id="printArea">
        <h1>${c.type}</h1>
        <p><strong>Sözleşme No:</strong> ${c.no}</p>
        <p><strong>Tarih:</strong> ${REMS.fmt.date(c.date)}</p>
        <hr style="margin:16px 0;border:none;border-top:1px solid #ccc">
        <p>İşbu sözleşme, <strong>${REMS.Store.data.settings.companyName}</strong> ile <strong>${c.party}</strong> arasında akdedilmiştir.</p>
        <p style="margin-top:12px"><strong>Portföy:</strong> ${p?.code || '—'} — ${p?.title || ''}</p>
        <p><strong>Adres:</strong> ${p?.address?.full || '—'}</p>
        ${c.price ? `<p><strong>Bedel:</strong> ${REMS.fmt.money(c.price)}</p>` : ''}
        <p style="margin-top:24px">Taraflar aşağıdaki hükümleri kabul eder. Bu belge demo HTML çıktısıdır; yazdırma için A4 formatı desteklenir.</p>
        <div style="display:flex;justify-content:space-between;margin-top:48px">
          <div style="text-align:center;width:40%"><div style="border-top:1px solid #333;padding-top:8px">Firma Yetkilisi</div></div>
          <div style="text-align:center;width:40%"><div style="border-top:1px solid #333;padding-top:8px">${c.party}</div></div>
        </div>
      </div></div>
      <div class="modal-footer no-print"><button class="btn btn-outline" onclick="window.print()"><i data-lucide="printer"></i> Yazdır</button>
      <button class="btn btn-primary" data-close>Kapat</button></div>`, { size: 'wide' });
  },

  printAuthority(propId) {
    const p = REMS.find.property(propId);
    const o = REMS.find.owner(p.ownerId);
    REMS.Store.data.contracts.unshift({
      id: REMS.uid('ct'), type: 'Portföy Yetki Sözleşmesi', propertyId: propId,
      party: o?.name || 'Mülk Sahibi', no: p.authorityContractNo, date: p.authorityStart, status: 'Aktif'
    });
    REMS.Store.save();
    this.print(REMS.Store.data.contracts[0].id);
  },

  printShowing(id) {
    const s = REMS.Store.data.showings.find(x => x.id === id);
    const c = REMS.find.customer(s.customerId);
    const p = REMS.find.property(s.propertyId);
    REMS.UI.openModal(`
      <div class="modal-header no-print"><h2>Yer Gösterme Formu</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="modal-body"><div class="print-doc">
        <h1>Yer Gösterme Formu</h1>
        <p><strong>Tarih/Saat:</strong> ${REMS.fmt.date(s.date)} ${s.time}</p>
        <p><strong>Müşteri:</strong> ${c?.name}</p>
        <p><strong>Portföy:</strong> ${p?.code} — ${p?.title}</p>
        <p><strong>Konum:</strong> ${s.location}</p>
        <p style="margin-top:16px">Müşteri gayrimenkulü yerinde incelemiş olup formu dijital olarak imzalamıştır.</p>
        ${s.signature ? `<img src="${s.signature}" style="max-width:280px;border:1px solid #ddd;margin-top:16px;background:#fff">` : '<p>İmza yok</p>'}
      </div></div>
      <div class="modal-footer no-print"><button class="btn btn-primary" onclick="window.print()">Yazdır</button></div>`, { size: 'wide' });
  },

  sales() {
    const list = REMS.Store.data.sales;
    return `
    <div class="page-header"><div><h1>Satış Süreçleri</h1><p>Teklif kabulünden kapanışa</p></div></div>
    ${list.length ? list.map(s => {
      const p = REMS.find.property(s.propertyId);
      const c = REMS.find.customer(s.customerId);
      return `<div class="card card-body mb-16">
        <div class="flex-between mb-16">
          <div><strong>${p?.code}</strong> · ${c?.name}<div class="text-muted" style="font-size:12px">Anlaşılan: ${REMS.fmt.money(s.agreedPrice)} · Kapora: ${REMS.fmt.money(s.deposit)}</div></div>
          ${REMS.UI.statusBadge(s.status)}
        </div>
        <div class="steps">${REMS.CONST.SALE_STEPS.map((st, i) =>
          `<div class="step ${i < s.step ? 'done' : ''} ${i === s.step ? 'current' : ''}">${i+1}. ${st}</div>`
        ).join('')}</div>
        <div class="page-actions mt-16">
          <button class="btn btn-sm btn-outline" onclick="REMS.Contracts.advanceSale('${s.id}')">Sonraki Aşama</button>
          <button class="btn btn-sm btn-outline" onclick="REMS.Finance.openCollection()">Kapora Al</button>
          <button class="btn btn-sm btn-primary" onclick="REMS.Contracts.create()">Sözleşme</button>
        </div>
      </div>`;
    }).join('') : REMS.UI.empty('Aktif satış süreci yok', '', 'Tekliflere Git', () => REMS.Router.go('offers'))}`;
  },

  advanceSale(id) {
    const s = REMS.Store.data.sales.find(x => x.id === id);
    if (s.step < REMS.CONST.SALE_STEPS.length - 1) {
      s.step += 1;
      if (s.step >= 2) s.depositPaid = true;
      if (s.step >= REMS.CONST.SALE_STEPS.length - 1) {
        s.status = 'Kapandı';
        const p = REMS.find.property(s.propertyId);
        if (p) p.status = 'Satıldı';
        REMS.toast('Satış kapandı');
      } else {
        REMS.toast(`Aşama: ${REMS.CONST.SALE_STEPS[s.step]}`);
      }
      REMS.Store.save();
      REMS.Router.render();
    }
  },

  rentals() {
    const list = REMS.Store.data.rentals;
    return `
    <div class="page-header"><div><h1>Kiralama Süreçleri</h1></div></div>
    ${list.map(r => {
      const p = REMS.find.property(r.propertyId);
      const c = REMS.find.customer(r.customerId);
      return `<div class="card card-body mb-16">
        <div class="flex-between mb-16">
          <div><strong>${p?.code}</strong> · ${c?.name}
          <div class="text-muted" style="font-size:12px">${REMS.fmt.money(r.monthlyRent)}/ay · ${REMS.fmt.date(r.startDate)} – ${REMS.fmt.date(r.endDate)}</div></div>
          ${REMS.UI.statusBadge(r.status)}
        </div>
        <div class="steps">${REMS.CONST.RENTAL_STEPS.map((st, i) =>
          `<div class="step ${i < r.step ? 'done' : ''} ${i === r.step ? 'current' : ''}">${i+1}. ${st}</div>`
        ).join('')}</div>
        <div class="page-actions mt-16">
          <button class="btn btn-sm btn-outline" onclick="REMS.Contracts.advanceRental('${r.id}')">Sonraki Aşama</button>
          ${r.increaseDate ? `<span class="badge badge-warning">15 gün sonra kira yenileme · ${p?.code}</span>` : ''}
        </div>
      </div>`;
    }).join('')}`;
  },

  advanceRental(id) {
    const r = REMS.Store.data.rentals.find(x => x.id === id);
    if (r.step < REMS.CONST.RENTAL_STEPS.length - 1) {
      r.step += 1;
      if (r.step >= REMS.CONST.RENTAL_STEPS.length - 1) {
        r.status = 'Tamamlandı';
        const p = REMS.find.property(r.propertyId);
        if (p) p.status = 'Kiralandı';
      }
      REMS.Store.save();
      REMS.toast(`Aşama: ${REMS.CONST.RENTAL_STEPS[r.step]}`);
      REMS.Router.render();
    }
  },

  tenants() {
    return `
    <div class="page-header"><div><h1>Kiracılar</h1></div></div>
    <div class="card"><div class="table-wrap"><table class="data"><thead><tr>
      <th>Kiracı</th><th>Portföy</th><th>Mülk Sahibi</th><th>Kira</th><th>Başlangıç</th><th>Bitiş</th><th>Ödeme Günü</th>
    </tr></thead><tbody>
    ${REMS.Store.data.rentals.map(r => {
      const c = REMS.find.customer(r.customerId);
      const p = REMS.find.property(r.propertyId);
      const o = REMS.find.owner(r.ownerId);
      return `<tr>
        <td><strong>${c?.name}</strong></td><td>${p?.code}</td><td>${o?.name}</td>
        <td>${REMS.fmt.money(r.monthlyRent)}</td>
        <td>${REMS.fmt.date(r.startDate)}</td><td>${REMS.fmt.date(r.endDate)}</td>
        <td>Her ayın ${r.paymentDay}'i</td>
      </tr>`;
    }).join('')}
    </tbody></table></div></div>`;
  }
};
