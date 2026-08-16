/* Leads — list + kanban */
window.REMS = window.REMS || {};
REMS.Leads = {
  pipeline() {
    const statuses = REMS.CONST.LEAD_STATUSES;
    const leads = REMS.Store.data.leads;
    setTimeout(() => this.initSortable(), 60);
    return `
    <div class="page-header"><div><h1>Lead Pipeline</h1><p>Kanban · sürükle-bırak ile aşama değiştir</p></div>
    <div class="page-actions">
      <button class="btn btn-outline" onclick="REMS.Router.go('leads-list')"><i data-lucide="list"></i> Liste</button>
      <button class="btn btn-primary" onclick="REMS.Leads.openCreate()"><i data-lucide="plus"></i> Lead Ekle</button>
    </div></div>
    <div class="kanban" id="leadKanban">
      ${statuses.map(st => {
        const cards = leads.filter(l => l.status === st);
        return `<div class="kanban-col" data-status="${st}">
          <div class="kanban-col-header"><span>${st}</span><span class="badge">${cards.length}</span></div>
          <div class="kanban-list" data-status="${st}">
            ${cards.map(l => `
              <div class="kanban-card" data-id="${l.id}" onclick="REMS.Leads.detail('${l.id}')">
                <h4>${l.name}</h4>
                <p>${l.source} · ${REMS.fmt.money(l.budget)}</p>
                <p>${l.district} · ${l.propertyType}</p>
                <div class="flex-between mt-16"><span class="badge">Skor ${l.score}</span><span class="text-muted" style="font-size:11px">${l.lastContact}</span></div>
              </div>`).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>`;
  },

  initSortable() {
    if (!window.Sortable) return;
    document.querySelectorAll('.kanban-list').forEach(list => {
      Sortable.create(list, {
        group: 'leads',
        animation: 150,
        ghostClass: 'sortable-ghost',
        onAdd: (evt) => {
          const id = evt.item.dataset.id;
          const status = evt.to.dataset.status;
          const lead = REMS.find.lead(id);
          if (!lead) return;
          const prev = lead.status;
          lead.status = status;
          if (status === 'Kaybedildi') {
            setTimeout(() => REMS.Leads.askLostReason(id), 100);
          }
          REMS.Store.save();
          REMS.toast(`Lead: ${prev} → ${status}`);
          REMS.log('Lead aşama değişti', `${lead.name}: ${status}`);
        }
      });
    });
  },

  askLostReason(id) {
    REMS.UI.openModal(`
      <div class="modal-header"><h2>Kayıp Nedeni</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="modal-body">
        <div class="form-group"><label>Neden</label>
          <select class="form-control" id="lostReason">${REMS.CONST.LOST_REASONS.map(r=>`<option>${r}</option>`).join('')}</select>
        </div>
      </div>
      <div class="modal-footer"><button class="btn btn-primary" onclick="REMS.Leads.saveLost('${id}')">Kaydet</button></div>`);
  },

  saveLost(id) {
    const lead = REMS.find.lead(id);
    lead.lostReason = document.getElementById('lostReason').value;
    REMS.Store.save();
    REMS.UI.closeOverlays();
    REMS.toast('Kayıp nedeni kaydedildi');
  },

  list() {
    return `
    <div class="page-header"><div><h1>Lead Listesi</h1></div>
    <div class="page-actions">
      <button class="btn btn-outline" onclick="REMS.Router.go('leads')">Kanban</button>
      <button class="btn btn-primary" onclick="REMS.Leads.openCreate()">Lead Ekle</button>
    </div></div>
    <div class="card"><div class="table-wrap"><table class="data"><thead><tr>
      <th>Ad</th><th>Kaynak</th><th>Bölge</th><th>Bütçe</th><th>Danışman</th><th>Skor</th><th>Durum</th>
    </tr></thead><tbody>
    ${REMS.Store.data.leads.map(l => {
      const a = REMS.find.agent(l.agentId);
      return `<tr onclick="REMS.Leads.detail('${l.id}')">
        <td><strong>${l.name}</strong><div class="text-muted" style="font-size:11px">${l.phone}</div></td>
        <td>${l.source}</td><td>${l.district}</td><td>${REMS.fmt.money(l.budget)}</td>
        <td>${a?.name||'—'}</td><td>${l.score}</td><td>${REMS.UI.statusBadge(l.status)}</td>
      </tr>`;
    }).join('')}
    </tbody></table></div></div>`;
  },

  detail(id) {
    const l = REMS.find.lead(id);
    const p = REMS.find.property(l.propertyId);
    const a = REMS.find.agent(l.agentId);
    REMS.UI.openDrawer(`
      <div class="drawer-header"><h2>${l.name}</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="drawer-body">
        <div class="info-list">
          <div><span>Telefon</span><strong>${l.phone}</strong></div>
          <div><span>E-posta</span><strong>${l.email}</strong></div>
          <div><span>Kaynak</span><strong>${l.source}</strong></div>
          <div><span>Durum</span><strong>${l.status}</strong></div>
          <div><span>Bütçe</span><strong>${REMS.fmt.money(l.budget)}</strong></div>
          <div><span>Skor</span><strong>${l.score}</strong></div>
          <div><span>Portföy</span><strong>${p?.code||'—'}</strong></div>
          <div><span>Danışman</span><strong>${a?.name||'—'}</strong></div>
        </div>
        <p class="mt-16 text-muted">${l.note||''}</p>
        ${l.lostReason ? `<p class="mt-16"><span class="badge badge-danger">Kayıp: ${l.lostReason}</span></p>` : ''}
        <div class="page-actions mt-16">
          <button class="btn btn-primary btn-sm" onclick="REMS.Appointments.openCreate('${l.propertyId||''}','${l.customerId||''}')">Randevu</button>
          <button class="btn btn-outline btn-sm" onclick="REMS.CRM.openRequest('${l.customerId||''}')">Talep</button>
        </div>
      </div>`);
  },

  openCreate() {
    REMS.UI.openModal(`
      <div class="modal-header"><h2>Yeni Lead</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="modal-body"><div class="form-grid">
        <div class="form-group"><label>Ad Soyad *</label><input class="form-control" id="ldName"></div>
        <div class="form-group"><label>Telefon *</label><input class="form-control" id="ldPhone"></div>
        <div class="form-group"><label>E-posta</label><input class="form-control" id="ldEmail"></div>
        <div class="form-group"><label>Kaynak</label><select class="form-control" id="ldSource">${REMS.CONST.LEAD_SOURCES.map(s=>`<option>${s}</option>`).join('')}</select></div>
        <div class="form-group"><label>Bütçe</label><input type="number" class="form-control" id="ldBudget" value="5000000"></div>
        <div class="form-group"><label>Bölge</label><input class="form-control" id="ldDist" value="Bakırköy"></div>
        <div class="form-group"><label>Tür</label><select class="form-control" id="ldType"><option>Daire</option><option>Villa</option><option>Rezidans</option></select></div>
        <div class="form-group"><label>Danışman</label><select class="form-control" id="ldAgent">${REMS.Store.data.agents.map(a=>`<option value="${a.id}">${a.name}</option>`).join('')}</select></div>
        <div class="form-group"><label>İlgili Portföy</label><select class="form-control" id="ldProp"><option value="">—</option>${REMS.Store.data.properties.slice(0,30).map(p=>`<option value="${p.id}">${p.code}</option>`).join('')}</select></div>
        <div class="form-group full"><label>Not</label><textarea class="form-control" id="ldNote"></textarea></div>
      </div></div>
      <div class="modal-footer"><button class="btn btn-outline" data-close>İptal</button>
      <button class="btn btn-primary" onclick="REMS.Leads.save()">Kaydet</button></div>`);
  },

  save() {
    const name = document.getElementById('ldName').value.trim();
    const phone = document.getElementById('ldPhone').value.trim();
    if (!name || !phone) return REMS.toast('Ad ve telefon zorunludur.', 'error');
    const lead = {
      id: REMS.uid('ld'), name, phone,
      email: document.getElementById('ldEmail').value,
      source: document.getElementById('ldSource').value,
      budget: Number(document.getElementById('ldBudget').value),
      district: document.getElementById('ldDist').value,
      propertyType: document.getElementById('ldType').value,
      agentId: document.getElementById('ldAgent').value,
      propertyId: document.getElementById('ldProp').value || null,
      customerId: null, note: document.getElementById('ldNote').value,
      score: 50 + Math.floor(Math.random()*40), status: 'Yeni',
      lostReason: null, lastContact: new Date().toISOString().slice(0,10),
      createdAt: new Date().toISOString().slice(0,10)
    };
    REMS.Store.data.leads.unshift(lead);
    REMS.notify('Yeni Lead', `${lead.source} üzerinden yeni müşteri geldi.`, 'lead');
    REMS.Store.save();
    REMS.UI.closeOverlays();
    REMS.toast('Lead oluşturuldu.');
    REMS.Router.go('leads');
  }
};
