/* Appointments, calendar, showings, signature */
window.REMS = window.REMS || {};
REMS.Appointments = {
  list() {
    const list = REMS.Store.data.appointments;
    return `
    <div class="page-header"><div><h1>Randevular</h1><p>Ofis, telefon, yer gösterme, tapu</p></div>
    <div class="page-actions">
      <button class="btn btn-outline" onclick="REMS.Router.go('calendar')"><i data-lucide="calendar"></i> Takvim</button>
      <button class="btn btn-primary" onclick="REMS.Appointments.openCreate()"><i data-lucide="plus"></i> Randevu Oluştur</button>
    </div></div>
    <div class="card"><div class="table-wrap"><table class="data"><thead><tr>
      <th>Tarih</th><th>Saat</th><th>Tür</th><th>Müşteri</th><th>Portföy</th><th>Danışman</th><th>Durum</th>
    </tr></thead><tbody>
    ${list.map(a => {
      const c = REMS.find.customer(a.customerId);
      const p = REMS.find.property(a.propertyId);
      const ag = REMS.find.agent(a.agentId);
      return `<tr>
        <td>${REMS.fmt.date(a.date)}</td><td>${a.time}</td><td>${a.type}</td>
        <td>${c?.name||'—'}</td><td>${p?.code||'—'}</td><td>${ag?.name||'—'}</td>
        <td>${REMS.UI.statusBadge(a.status)}</td>
      </tr>`;
    }).join('')}
    </tbody></table></div></div>`;
  },

  calendar() {
    setTimeout(() => this.renderCalendar(), 80);
    return `
    <div class="page-header"><div><h1>Takvim</h1><p>Günlük / haftalık / aylık görünüm</p></div>
    <button class="btn btn-primary" onclick="REMS.Appointments.openCreate()">Randevu Ekle</button></div>
    <div class="card card-body"><div id="calendar"></div></div>`;
  },

  renderCalendar() {
    const el = document.getElementById('calendar');
    if (!el || !window.FullCalendar) return;
    if (el._fc) { el._fc.destroy(); }
    const colors = {
      'Yer Gösterme': '#0d9488', 'Ofis Görüşmesi': '#0284c7', 'Telefon Görüşmesi': '#6366f1',
      'Video Görüşme': '#8b5cf6', 'Tapu': '#d97706', 'Sözleşme': '#059669', 'Görev': '#64748b'
    };
    const events = [
      ...REMS.Store.data.appointments.map(a => ({
        title: `${a.type} · ${REMS.find.customer(a.customerId)?.name || ''}`,
        start: `${a.date}T${a.time}:00`,
        backgroundColor: colors[a.type] || '#0d9488',
        borderColor: 'transparent'
      })),
      ...REMS.Store.data.tasks.map(t => ({
        title: `Görev: ${t.title}`,
        start: t.due,
        backgroundColor: colors['Görev'],
        borderColor: 'transparent',
        allDay: true
      })),
      ...REMS.Store.data.sales.filter(s => s.status === 'Devam').map(s => ({
        title: `Satış süreci · ${REMS.find.property(s.propertyId)?.code || ''}`,
        start: s.createdAt,
        backgroundColor: '#d97706',
        borderColor: 'transparent',
        allDay: true
      }))
    ];
    try {
      const cal = new FullCalendar.Calendar(el, {
        initialView: window.innerWidth < 768 ? 'timeGridDay' : 'dayGridMonth',
        initialDate: '2026-08-16',
        locale: (FullCalendar.globalLocales || []).some(l => l.code === 'tr') ? 'tr' : undefined,
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        height: 560,
        events,
        eventClick(info) {
          REMS.toast(info.event.title);
        }
      });
      cal.render();
      el._fc = cal;
    } catch (err) {
      console.warn('Takvim yüklenemedi', err);
      el.innerHTML = '<p class="text-muted">Takvim bileşeni yüklenemedi. Randevu listesini kullanın.</p>';
    }
  },

  openCreate(propertyId = '', customerId = '') {
    REMS.UI.openModal(`
      <div class="modal-header"><h2>Randevu Oluştur</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="modal-body"><div class="form-grid">
        <div class="form-group"><label>Müşteri *</label><select class="form-control" id="apCust">${REMS.Store.data.customers.map(c=>`<option value="${c.id}" ${customerId===c.id?'selected':''}>${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label>Portföy</label><select class="form-control" id="apProp">${REMS.Store.data.properties.slice(0,40).map(p=>`<option value="${p.id}" ${propertyId===p.id?'selected':''}>${p.code}</option>`).join('')}</select></div>
        <div class="form-group"><label>Danışman</label><select class="form-control" id="apAgent">${REMS.Store.data.agents.map(a=>`<option value="${a.id}">${a.name}</option>`).join('')}</select></div>
        <div class="form-group"><label>Tür</label><select class="form-control" id="apType">${REMS.CONST.APPOINTMENT_TYPES.map(t=>`<option>${t}</option>`).join('')}</select></div>
        <div class="form-group"><label>Tarih</label><input type="date" class="form-control" id="apDate" value="2026-08-17"></div>
        <div class="form-group"><label>Saat</label><input type="time" class="form-control" id="apTime" value="14:00"></div>
        <div class="form-group full"><label>Konum</label><input class="form-control" id="apLoc" value=""></div>
        <div class="form-group full"><label>Not</label><textarea class="form-control" id="apNote"></textarea></div>
      </div></div>
      <div class="modal-footer"><button class="btn btn-outline" data-close>İptal</button>
      <button class="btn btn-primary" onclick="REMS.Appointments.save()">Kaydet</button></div>`);
    const p = REMS.find.property(document.getElementById('apProp').value);
    if (p) document.getElementById('apLoc').value = p.address.full;
  },

  save() {
    const customerId = document.getElementById('apCust').value;
    if (!customerId) return REMS.toast('Müşteri seçiniz.', 'error');
    const ap = {
      id: REMS.uid('ap'),
      customerId,
      propertyId: document.getElementById('apProp').value,
      agentId: document.getElementById('apAgent').value,
      date: document.getElementById('apDate').value,
      time: document.getElementById('apTime').value,
      type: document.getElementById('apType').value,
      location: document.getElementById('apLoc').value,
      note: document.getElementById('apNote').value,
      status: 'Planlandı'
    };
    REMS.Store.data.appointments.unshift(ap);
    REMS.Store.save();
    REMS.UI.closeOverlays();
    REMS.toast('Randevu oluşturuldu.');
    REMS.Router.go('appointments');
  },

  showings() {
    const list = REMS.Store.data.showings;
    return `
    <div class="page-header"><div><h1>Yer Göstermeler</h1><p>Dijital imza destekli formlar</p></div>
    <button class="btn btn-primary" onclick="REMS.Appointments.startShowing()"><i data-lucide="map-pin"></i> Yer Gösterme Başlat</button></div>
    <div class="card"><div class="table-wrap"><table class="data"><thead><tr>
      <th>Tarih</th><th>Saat</th><th>Müşteri</th><th>Portföy</th><th>Danışman</th><th>İmza</th><th>Durum</th><th></th>
    </tr></thead><tbody>
    ${list.map(s => {
      const c = REMS.find.customer(s.customerId);
      const p = REMS.find.property(s.propertyId);
      const a = REMS.find.agent(s.agentId);
      return `<tr>
        <td>${REMS.fmt.date(s.date)}</td><td>${s.time}</td><td>${c?.name||'—'}</td>
        <td>${p?.code||'—'}</td><td>${a?.name||'—'}</td>
        <td>${s.signature ? '✓' : '—'}</td><td>${REMS.UI.statusBadge(s.status)}</td>
        <td><button class="btn btn-sm btn-outline" onclick="REMS.Appointments.openSignature('${s.id}')">İmza</button>
        <button class="btn btn-sm btn-outline" onclick="REMS.Contracts.printShowing('${s.id}')">Yazdır</button></td>
      </tr>`;
    }).join('')}
    </tbody></table></div></div>`;
  },

  startShowing(propertyId = '') {
    REMS.UI.openModal(`
      <div class="modal-header"><h2>Yer Gösterme Başlat</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="modal-body"><div class="form-grid">
        <div class="form-group"><label>Müşteri</label><select class="form-control" id="shCust">${REMS.Store.data.customers.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label>Portföy</label><select class="form-control" id="shProp">${REMS.Store.data.properties.slice(0,40).map(p=>`<option value="${p.id}" ${propertyId===p.id?'selected':''}>${p.code}</option>`).join('')}</select></div>
        <div class="form-group"><label>Danışman</label><select class="form-control" id="shAgent">${REMS.Store.data.agents.map(a=>`<option value="${a.id}">${a.name}</option>`).join('')}</select></div>
        <div class="form-group"><label>Tarih</label><input type="date" class="form-control" id="shDate" value="2026-08-17"></div>
        <div class="form-group"><label>Saat</label><input type="time" class="form-control" id="shTime" value="14:00"></div>
        <div class="form-group"><label>Konum</label><input class="form-control" id="shLoc" value=""></div>
      </div></div>
      <div class="modal-footer"><button class="btn btn-outline" data-close>İptal</button>
      <button class="btn btn-primary" onclick="REMS.Appointments.saveShowing()">Başlat & İmza Al</button></div>`);
    const p = REMS.find.property(document.getElementById('shProp').value);
    if (p) document.getElementById('shLoc').value = p.address.full;
  },

  saveShowing() {
    const sh = {
      id: REMS.uid('sh'),
      customerId: document.getElementById('shCust').value,
      propertyId: document.getElementById('shProp').value,
      agentId: document.getElementById('shAgent').value,
      date: document.getElementById('shDate').value,
      time: document.getElementById('shTime').value,
      location: document.getElementById('shLoc').value,
      signature: null,
      status: 'Devam Ediyor'
    };
    REMS.Store.data.showings.unshift(sh);
    REMS.Store.data.appointments.unshift({
      id: REMS.uid('ap'), customerId: sh.customerId, propertyId: sh.propertyId,
      agentId: sh.agentId, date: sh.date, time: sh.time, type: 'Yer Gösterme',
      location: sh.location, note: '', status: 'Planlandı'
    });
    REMS.Store.save();
    REMS.UI.closeOverlays();
    REMS.toast('Yer gösterme başlatıldı');
    this.openSignature(sh.id);
  },

  openSignature(id) {
    REMS.UI.openModal(`
      <div class="modal-header"><h2>Dijital İmza</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="modal-body">
        <p class="mb-16 text-muted">Müşteri yer gösterme formunu imzalasın.</p>
        <canvas id="sigPad" class="signature-pad" width="700" height="180"></canvas>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="REMS.Appointments.clearSig()">Temizle</button>
        <button class="btn btn-primary" onclick="REMS.Appointments.saveSig('${id}')">Kaydet</button>
      </div>`, { size: 'wide' });
    setTimeout(() => this.initPad(), 50);
  },

  _drawing: false,

  initPad() {
    const canvas = document.getElementById('sigPad');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      const src = e.touches ? e.touches[0] : e;
      return { x: (src.clientX - r.left) * (canvas.width / r.width), y: (src.clientY - r.top) * (canvas.height / r.height) };
    };
    const start = (e) => { e.preventDefault(); this._drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
    const move = (e) => { if (!this._drawing) return; e.preventDefault(); const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); };
    const end = () => { this._drawing = false; };
    canvas.onmousedown = start; canvas.onmousemove = move; canvas.onmouseup = end; canvas.onmouseleave = end;
    canvas.ontouchstart = start; canvas.ontouchmove = move; canvas.ontouchend = end;
  },

  clearSig() {
    const canvas = document.getElementById('sigPad');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },

  saveSig(id) {
    const canvas = document.getElementById('sigPad');
    const sh = REMS.Store.data.showings.find(s => s.id === id);
    if (!sh) return;
    sh.signature = canvas.toDataURL('image/png');
    sh.status = 'İmzalandı';
    REMS.Store.save();
    REMS.UI.closeOverlays();
    REMS.toast('İmza kaydedildi');
    REMS.Router.go('showings');
  }
};
