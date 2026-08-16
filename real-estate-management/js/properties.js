/* Portfolio module */
window.REMS = window.REMS || {};
REMS.Properties = {
  viewMode: 'card',
  filters: {},

  list() {
    const d = REMS.Store.data;
    let props = [...d.properties];
    const f = this.filters;
    if (f.q) {
      const q = f.q.toLowerCase();
      props = props.filter(p =>
        p.code.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.address.mahalle.toLowerCase().includes(q) ||
        p.address.ilce.toLowerCase().includes(q) ||
        (p.land && (`${p.land.ada}${p.land.parsel}`).includes(q))
      );
    }
    if (f.transaction) props = props.filter(p => p.transactionType === f.transaction);
    if (f.type) props = props.filter(p => p.propertyType === f.type);
    if (f.status) props = props.filter(p => p.status === f.status);
    if (f.district) props = props.filter(p => p.address.ilce === f.district);
    if (f.agent) props = props.filter(p => p.agentId === f.agent);
    if (f.branch) props = props.filter(p => p.branchId === f.branch);
    if (f.authority) props = props.filter(p => p.authorityType === f.authority);
    if (f.minPrice) props = props.filter(p => p.currentPrice >= Number(f.minPrice));
    if (f.maxPrice) props = props.filter(p => p.currentPrice <= Number(f.maxPrice));
    if (f.rooms) props = props.filter(p => p.housing?.rooms === f.rooms);
    if (f.minM2) props = props.filter(p => (p.housing?.brutM2 || p.land?.m2 || 0) >= Number(f.minM2));
    if (f.maxM2) props = props.filter(p => (p.housing?.brutM2 || p.land?.m2 || 0) <= Number(f.maxM2));

    setTimeout(() => {
      ['fltQ','fltTx','fltType','fltStatus','fltDistrict','fltAgent','fltBranch','fltAuth','fltMin','fltMax','fltRooms','fltMinM2','fltMaxM2'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.onchange = el.oninput = () => {
          this.filters = {
            q: document.getElementById('fltQ')?.value || '',
            transaction: document.getElementById('fltTx')?.value || '',
            type: document.getElementById('fltType')?.value || '',
            status: document.getElementById('fltStatus')?.value || '',
            district: document.getElementById('fltDistrict')?.value || '',
            agent: document.getElementById('fltAgent')?.value || '',
            branch: document.getElementById('fltBranch')?.value || '',
            authority: document.getElementById('fltAuth')?.value || '',
            minPrice: document.getElementById('fltMin')?.value || '',
            maxPrice: document.getElementById('fltMax')?.value || '',
            rooms: document.getElementById('fltRooms')?.value || '',
            minM2: document.getElementById('fltMinM2')?.value || '',
            maxM2: document.getElementById('fltMaxM2')?.value || ''
          };
          REMS.Router.render();
        };
      });
    }, 0);

    const districts = [...new Set(d.properties.map(p => p.address.ilce))];
    return `
    <div class="page-header">
      <div><h1>Portföyler</h1><p>${props.length} kayıt · kart / liste / harita görünümü</p></div>
      <div class="page-actions">
        <button class="btn btn-outline" onclick="REMS.Router.go('compare')"><i data-lucide="columns-2"></i> Karşılaştır</button>
        <button class="btn btn-outline" onclick="REMS.Router.go('map')"><i data-lucide="map"></i> Harita</button>
        <button class="btn btn-primary" onclick="REMS.Properties.openCreate()"><i data-lucide="plus"></i> Yeni Portföy</button>
      </div>
    </div>
    <div class="toolbar">
      <input class="form-control" id="fltQ" style="max-width:200px" placeholder="Ara: kod, mahalle, ada..." value="${f.q || ''}">
      <select class="form-control" id="fltTx" style="max-width:130px"><option value="">İşlem</option>${REMS.CONST.TRANSACTION_TYPES.map(t => `<option ${f.transaction===t?'selected':''}>${t}</option>`).join('')}</select>
      <select class="form-control" id="fltType" style="max-width:130px"><option value="">Tür</option>${REMS.CONST.PROPERTY_TYPES.map(t => `<option ${f.type===t?'selected':''}>${t}</option>`).join('')}</select>
      <select class="form-control" id="fltStatus" style="max-width:130px"><option value="">Durum</option>${REMS.CONST.PROPERTY_STATUSES.map(t => `<option ${f.status===t?'selected':''}>${t}</option>`).join('')}</select>
      <select class="form-control" id="fltDistrict" style="max-width:140px"><option value="">İlçe</option>${districts.map(t => `<option ${f.district===t?'selected':''}>${t}</option>`).join('')}</select>
      <select class="form-control" id="fltAgent" style="max-width:150px"><option value="">Danışman</option>${d.agents.map(a => `<option value="${a.id}" ${f.agent===a.id?'selected':''}>${a.name}</option>`).join('')}</select>
      <select class="form-control" id="fltBranch" style="max-width:130px"><option value="">Şube</option>${d.branches.map(b => `<option value="${b.id}" ${f.branch===b.id?'selected':''}>${b.name}</option>`).join('')}</select>
      <select class="form-control" id="fltAuth" style="max-width:130px"><option value="">Yetki</option>${REMS.CONST.AUTHORITY_TYPES.map(t => `<option ${f.authority===t?'selected':''}>${t}</option>`).join('')}</select>
      <input class="form-control" id="fltMin" style="max-width:110px" type="number" placeholder="Min ₺" value="${f.minPrice||''}">
      <input class="form-control" id="fltMax" style="max-width:110px" type="number" placeholder="Max ₺" value="${f.maxPrice||''}">
      <select class="form-control" id="fltRooms" style="max-width:100px"><option value="">Oda</option>${['1+1','2+1','3+1','4+1','5+1'].map(t => `<option ${f.rooms===t?'selected':''}>${t}</option>`).join('')}</select>
      <input class="form-control" id="fltMinM2" style="max-width:90px" type="number" placeholder="Min m²" value="${f.minM2||''}">
      <input class="form-control" id="fltMaxM2" style="max-width:90px" type="number" placeholder="Max m²" value="${f.maxM2||''}">
      <div class="view-toggle">
        <button class="${this.viewMode==='card'?'active':''}" onclick="REMS.Properties.setView('card')"><i data-lucide="layout-grid"></i></button>
        <button class="${this.viewMode==='list'?'active':''}" onclick="REMS.Properties.setView('list')"><i data-lucide="list"></i></button>
        <button class="${this.viewMode==='map'?'active':''}" onclick="REMS.Router.go('map')"><i data-lucide="map"></i></button>
      </div>
    </div>
    ${props.length === 0 ? REMS.UI.empty('Portföy bulunamadı', 'Filtreleri temizleyin veya yeni portföy ekleyin.', '+ Yeni Portföy', () => REMS.Properties.openCreate()) : ''}
    ${this.viewMode === 'list' ? this.renderList(props) : this.renderCards(props)}`;
  },

  setView(mode) {
    this.viewMode = mode;
    REMS.Router.render();
  },

  renderCards(props) {
    return `<div class="prop-grid">${props.map(p => {
      const agent = REMS.find.agent(p.agentId);
      return `<div class="prop-card" onclick="REMS.Router.go('property-detail',{id:'${p.id}'})">
        <div class="prop-card-img">
          <img src="${REMS.cover(p)}" alt="${p.title}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&h=600&q=80'">
          <div class="prop-card-badges">
            <span class="badge badge-primary">${p.transactionType}</span>
            ${REMS.UI.statusBadge(p.status)}
          </div>
        </div>
        <div class="prop-card-body">
          <div class="prop-card-price">${REMS.fmt.money(p.currentPrice)}</div>
          <div class="prop-card-title">${p.title}</div>
          <div class="prop-card-meta">
            <span>${p.code}</span>
            <span>${p.housing?.brutM2 || p.land?.m2 || '—'} m²</span>
            <span>${p.housing?.rooms || p.propertyType}</span>
          </div>
          <div class="prop-card-footer">
            <span>${p.address.ilce} / ${p.address.mahalle}</span>
            <span>${agent?.name?.split(' ')[0] || ''}</span>
          </div>
        </div>
      </div>`;
    }).join('')}</div>`;
  },

  renderList(props) {
    return `<div class="card"><div class="table-wrap"><table class="data"><thead><tr>
      <th>Kod</th><th>Başlık</th><th>İşlem</th><th>Fiyat</th><th>m²</th><th>Oda</th><th>Lokasyon</th><th>Danışman</th><th>Durum</th>
    </tr></thead><tbody>
    ${props.map(p => {
      const agent = REMS.find.agent(p.agentId);
      return `<tr onclick="REMS.Router.go('property-detail',{id:'${p.id}'})">
        <td><strong>${p.code}</strong></td>
        <td>${p.title.slice(0, 42)}${p.title.length>42?'…':''}</td>
        <td>${p.transactionType}</td>
        <td>${REMS.fmt.money(p.currentPrice)}</td>
        <td>${p.housing?.brutM2 || p.land?.m2 || '—'}</td>
        <td>${p.housing?.rooms || '—'}</td>
        <td>${p.address.ilce}</td>
        <td>${agent?.name || '—'}</td>
        <td>${REMS.UI.statusBadge(p.status)}</td>
      </tr>`;
    }).join('')}
    </tbody></table></div></div>`;
  },

  detail(id) {
    const p = REMS.find.property(id);
    if (!p) return REMS.UI.empty('Portföy bulunamadı', '', 'Listeye Dön', () => REMS.Router.go('properties'));
    const agent = REMS.find.agent(p.agentId);
    const owner = REMS.find.owner(p.ownerId);
    const branch = REMS.find.branch(p.branchId);
    const photos = [...(p.photos || [])].sort((a, b) => a.order - b.order);
    const cover = photos.find(x => x.isCover) || photos[0];

    setTimeout(() => {
      if (window.L && p.address.lat) {
        const el = document.getElementById('propDetailMap');
        if (el && !el._leaflet_id) {
          const map = L.map(el).setView([p.address.lat, p.address.lng], 14);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM' }).addTo(map);
          L.marker([p.address.lat, p.address.lng]).addTo(map);
        }
      }
    }, 100);

    return `
    <div class="page-header">
      <div>
        <div class="flex-center gap-8 mb-16">${REMS.UI.statusBadge(p.status)}<span class="badge">${p.code}</span><span class="badge badge-accent">${p.authorityType}</span></div>
        <h1>${p.title}</h1>
        <p>${p.address.full} · ${agent?.name || ''} · ${branch?.name || ''}</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" onclick="REMS.Properties.toggleFavorite('${p.id}')"><i data-lucide="heart"></i></button>
        <button class="btn btn-outline" onclick="REMS.Properties.addCompare('${p.id}')"><i data-lucide="columns-2"></i></button>
        <button class="btn btn-outline" onclick="REMS.Router.go('share',{id:'${p.id}'})"><i data-lucide="share-2"></i> Paylaş</button>
        <button class="btn btn-outline" onclick="REMS.Properties.openEdit('${p.id}')"><i data-lucide="pencil"></i> Düzenle</button>
        <button class="btn btn-danger" onclick="REMS.Properties.remove('${p.id}')"><i data-lucide="trash-2"></i></button>
      </div>
    </div>
    <div class="detail-hero">
      <div>
        <div class="gallery-main"><img id="galleryMain" src="${cover?.url || REMS.cover(p)}" alt=""></div>
        <div class="gallery-thumbs">${photos.slice(0, 8).map((ph, i) =>
          `<img class="${ph.isCover?'active':''}" src="${ph.url}" onclick="document.getElementById('galleryMain').src='${ph.url}'" alt="foto ${i}">`
        ).join('')}</div>
      </div>
      <div class="card card-body">
        <div class="prop-card-price" style="font-size:28px">${REMS.fmt.money(p.currentPrice)}</div>
        <div class="text-muted" style="font-size:12px;margin-bottom:12px">${REMS.fmt.money(p.pricePerM2)} / m² · İlk: ${REMS.fmt.money(p.firstPrice)} · Min: ${REMS.fmt.money(p.minPrice)}</div>
        <div class="info-list">
          <div><span>Tür</span><strong>${p.propertyType}</strong></div>
          <div><span>İşlem</span><strong>${p.transactionType}</strong></div>
          <div><span>Brüt / Net</span><strong>${p.housing?.brutM2 || '—'} / ${p.housing?.netM2 || '—'} m²</strong></div>
          <div><span>Oda</span><strong>${p.housing?.rooms || '—'}</strong></div>
          <div><span>Kat</span><strong>${p.housing?.floor || '—'} / ${p.housing?.buildingFloors || '—'}</strong></div>
          <div><span>Yaş</span><strong>${p.housing?.buildingAge ?? '—'}</strong></div>
          <div><span>Mülk Sahibi</span><strong>${owner?.name || '—'}</strong></div>
          <div><span>Danışman</span><strong>${agent?.name || '—'}</strong></div>
        </div>
        <div class="mt-16 flex-center gap-8" style="flex-wrap:wrap">
          <button class="btn btn-primary btn-sm" onclick="REMS.CRM.openOffer('${p.id}')">Teklif Al</button>
          <button class="btn btn-outline btn-sm" onclick="REMS.Appointments.openCreate('${p.id}')">Randevu</button>
          <button class="btn btn-outline btn-sm" onclick="REMS.Appointments.startShowing('${p.id}')">Yer Gösterme Başlat</button>
          <button class="btn btn-outline btn-sm" onclick="REMS.Properties.openShareModal('${p.id}')">WhatsApp / SMS</button>
        </div>
        <div class="mt-16">
          <div class="flex-between"><strong>İlan Kalite Skoru</strong><span>${p.qualityScore.total}/100</span></div>
          <div class="score-ring mt-16" style="--score:${p.qualityScore.total};margin:12px auto"><span>${p.qualityScore.total}</span></div>
          ${['photo','description','completeness','location','video'].map(k => {
            const labels = {photo:'Fotoğraf',description:'Açıklama',completeness:'Bilgi Tamamlığı',location:'Konum',video:'Video'};
            return `<div class="stat-row"><span>${labels[k]}</span><strong>${p.qualityScore[k]}</strong></div>`;
          }).join('')}
          <div class="mt-16"><span class="badge badge-warning">${p.daysOnMarket} gündür yayında · Risk: ${p.agingRisk}</span></div>
        </div>
      </div>
    </div>

    <div class="tabs mt-16" id="propTabs">
      ${['Özet','Detaylar','Fiyat','Yetki','Yayın','Belgeler','Sohbet','Konum'].map((t,i) =>
        `<button class="tab ${i===0?'active':''}" onclick="REMS.Properties.switchTab(this,'${t}')">${t}</button>`).join('')}
    </div>
    <div id="propTabBody">${this.tabContent(p, 'Özet')}</div>`;
  },

  switchTab(btn, name) {
    document.querySelectorAll('#propTabs .tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    const p = REMS.find.property(REMS.Router.params.id);
    document.getElementById('propTabBody').innerHTML = this.tabContent(p, name);
    REMS.UI.icons();
    if (name === 'Konum') {
      setTimeout(() => {
        const el = document.getElementById('propDetailMap');
        if (el && window.L && !el._leaflet_id) {
          const map = L.map(el).setView([p.address.lat, p.address.lng], 14);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM' }).addTo(map);
          L.marker([p.address.lat, p.address.lng]).addTo(map);
        }
      }, 50);
    }
  },

  tabContent(p, tab) {
    if (tab === 'Özet') {
      return `<div class="grid-2"><div class="card card-body"><h3>Açıklama</h3><p style="margin-top:10px;font-weight:500;line-height:1.6">${p.description}</p>
        ${p.videoUrl ? `<p class="mt-16"><a href="${p.videoUrl}" target="_blank" class="text-primary">Video İzle</a></p>` : ''}
        ${p.virtualTour ? `<p><a href="${p.virtualTour}" target="_blank" class="text-primary">360° Sanal Tur</a></p>` : ''}
      </div>
      <div class="card card-body"><h3>Fiyat Geçmişi</h3>
        <div class="price-history mt-16">${(p.priceHistory||[]).map((h,i,arr) => `
          <div class="price-history-item"><div><div class="text-muted" style="font-size:11px">${REMS.fmt.date(h.date)}</div>
          <strong>${REMS.fmt.money(h.price)}</strong></div>
          ${i < arr.length-1 ? '<span class="arrow">↓</span>' : ''}</div>`).join('')}
        </div>
      </div></div>`;
    }
    if (tab === 'Detaylar') {
      const h = p.housing || {};
      const l = p.land || {};
      const c = p.commercial || {};
      return `<div class="card card-body"><div class="info-list">
        ${h.brutM2 ? `
          <div><span>Brüt m²</span><strong>${h.brutM2}</strong></div>
          <div><span>Net m²</span><strong>${h.netM2}</strong></div>
          <div><span>Oda / Salon</span><strong>${h.rooms} / ${h.livingRooms}</strong></div>
          <div><span>Banyo / WC</span><strong>${h.bathrooms} / ${h.wc}</strong></div>
          <div><span>Kat</span><strong>${h.floor} / ${h.buildingFloors}</strong></div>
          <div><span>Bina Yaşı</span><strong>${h.buildingAge}</strong></div>
          <div><span>Isıtma</span><strong>${h.heating}</strong></div>
          <div><span>Balkon / Asansör</span><strong>${h.balcony?'Var':'Yok'} / ${h.elevator?'Var':'Yok'}</strong></div>
          <div><span>Otopark / Eşyalı</span><strong>${h.parking?'Var':'Yok'} / ${h.furnished?'Evet':'Hayır'}</strong></div>
          <div><span>Site / Aidat</span><strong>${h.inSite?'Evet':'Hayır'} / ${REMS.fmt.money(h.dues)}</strong></div>
          <div><span>Tapu / Kredi</span><strong>${h.deed} / ${h.creditSuitable?'Uygun':'Değil'}</strong></div>
          <div><span>Cephe / Manzara</span><strong>${h.facade} / ${h.view}</strong></div>
          <div><span>Takas</span><strong>${h.swap?'Açık':'Kapalı'}</strong></div>` : ''}
        ${l.m2 ? `
          <div><span>Ada / Parsel</span><strong>${l.ada} / ${l.parsel}</strong></div>
          <div><span>Pafta / m²</span><strong>${l.pafta} / ${l.m2}</strong></div>
          <div><span>İmar / KAKS</span><strong>${l.zoning} / ${l.kaks}</strong></div>
          <div><span>TAKS / Gabari</span><strong>${l.taks} / ${l.gabari}</strong></div>
          <div><span>Tapu Türü</span><strong>${l.deedType}</strong></div>
          <div><span>Yola Cephe</span><strong>${l.roadFrontage?'Var':'Yok'}</strong></div>
          <div><span>Altyapı / Zemin</span><strong>${l.infrastructure} / ${l.ground}</strong></div>` : ''}
        ${c.usageArea ? `
          <div><span>Kullanım Alanı</span><strong>${c.usageArea} m²</strong></div>
          <div><span>Giriş Yüksekliği</span><strong>${c.entranceHeight} m</strong></div>
          <div><span>Elektrik</span><strong>${c.electricity}</strong></div>
          <div><span>Depo</span><strong>${c.storage} m²</strong></div>
          <div><span>İskan / Ruhsat</span><strong>${c.occupancyPermit?'Var':'Yok'} / ${c.license}</strong></div>
          <div><span>Kiracılı</span><strong>${c.withTenant?'Evet':'Hayır'}</strong></div>` : ''}
      </div></div>`;
    }
    if (tab === 'Fiyat') {
      return `<div class="card card-body">
        <div class="form-grid">
          <div class="form-group"><label>Güncel Fiyat</label><input type="number" class="form-control" id="priceNew" value="${p.currentPrice}"></div>
          <div class="form-group"><label>Minimum Kabul</label><input type="number" class="form-control" id="priceMin" value="${p.minPrice}"></div>
        </div>
        <button class="btn btn-primary mt-16" onclick="REMS.Properties.updatePrice('${p.id}')">Fiyat Güncelle</button>
        <div class="price-history mt-16">${(p.priceHistory||[]).map(h => `
          <div class="price-history-item"><div><div class="text-muted" style="font-size:11px">${REMS.fmt.date(h.date)}</div><strong>${REMS.fmt.money(h.price)}</strong></div></div>`).join('')}
        </div>
      </div>`;
    }
    if (tab === 'Yetki') {
      return `<div class="card card-body"><div class="info-list">
        <div><span>Yetki Tipi</span><strong>${p.authorityType}</strong></div>
        <div><span>Sözleşme No</span><strong>${p.authorityContractNo}</strong></div>
        <div><span>Başlangıç</span><strong>${REMS.fmt.date(p.authorityStart)}</strong></div>
        <div><span>Bitiş</span><strong>${REMS.fmt.date(p.authorityEnd)}</strong></div>
        <div><span>Komisyon Oranı</span><strong>%${p.commissionRate}</strong></div>
      </div>
      <p class="text-muted mt-16" style="font-size:12px">Yetki bitmeden önce bildirim merkezi uyarır.</p>
      <button class="btn btn-outline mt-16" onclick="REMS.Contracts.printAuthority('${p.id}')">Yetki Sözleşmesi Yazdır</button>
      </div>`;
    }
    if (tab === 'Yayın') {
      const ch = p.channels || {};
      return `<div class="card card-body">
        <h3>Yayın Kanalları</h3>
        ${[
          ['web','Kurumsal Web'],['sahibinden','Sahibinden'],['hepsiemlak','Hepsiemlak'],
          ['emlakjet','Emlakjet'],['social','Sosyal Medya']
        ].map(([k,l]) => `<div class="channel-row"><span>${l}</span>
          <button class="toggle ${ch[k]?'on':''}" onclick="REMS.Properties.toggleChannel('${p.id}','${k}')"></button></div>`).join('')}
        <p class="text-muted mt-16" style="font-size:12px">Gerçek API anahtarları hard-code edilmez; entegrasyon ayarlarından yönetilir.</p>
      </div>`;
    }
    if (tab === 'Belgeler') {
      return `<div class="card card-body">
        <button class="btn btn-primary btn-sm mb-16" onclick="REMS.Pages.uploadDoc()">Belge Yükle</button>
        ${(p.documents||[]).map(d => `<div class="stat-row"><div><strong>${d.name}</strong><div class="text-muted" style="font-size:11px">${d.category} · ${d.uploader}</div></div>
        <button class="btn btn-sm btn-outline" onclick="REMS.Pages.previewDoc('${d.name}','${d.category}')">Önizle</button></div>`).join('') || '<p class="text-muted">Belge yok</p>'}
      </div>`;
    }
    if (tab === 'Sohbet') {
      return `<div class="card card-body">
        <h3>${p.code} / Ekip</h3>
        <div class="chat-messages" style="max-height:280px;margin:12px 0">${(p.chat||[]).map(m => `
          <div class="chat-bubble"><div class="meta">${m.user} · ${m.at}</div>${m.text.replace(/@(\S+)/g,'<span class="mention">@$1</span>')}</div>`).join('') || '<p class="text-muted">Henüz mesaj yok</p>'}
        </div>
        <div class="chat-input">
          <input class="form-control" id="propChatInput" placeholder="Mesaj yazın... @Ahmet">
          <button class="btn btn-primary" onclick="REMS.Properties.sendChat('${p.id}')">Gönder</button>
        </div>
      </div>`;
    }
    if (tab === 'Konum') {
      return `<div class="card card-body">
        <div class="info-list mb-16">
          <div><span>İl / İlçe</span><strong>${p.address.il} / ${p.address.ilce}</strong></div>
          <div><span>Mahalle</span><strong>${p.address.mahalle}</strong></div>
          <div><span>Adres</span><strong>${p.address.sokak} No:${p.address.bina} D:${p.address.daire}</strong></div>
          <div><span>Koordinat</span><strong>${p.address.lat.toFixed(5)}, ${p.address.lng.toFixed(5)}</strong></div>
        </div>
        <div id="propDetailMap" style="height:320px;border-radius:12px"></div>
      </div>`;
    }
    return '';
  },

  sendChat(id) {
    const input = document.getElementById('propChatInput');
    const text = input?.value?.trim();
    if (!text) return;
    const p = REMS.find.property(id);
    p.chat = p.chat || [];
    p.chat.push({
      id: REMS.uid('pc'),
      user: REMS.Store.data.currentUser.name,
      text,
      at: new Date().toISOString().slice(0, 16).replace('T', ' ')
    });
    const mentions = text.match(/@\S+/g);
    if (mentions) REMS.notify('Mention', `${REMS.Store.data.currentUser.name} sizi ${p.code} sohbetinde etiketledi.`, 'mention');
    REMS.Store.save();
    REMS.toast('Mesaj gönderildi');
    REMS.Router.render();
    setTimeout(() => {
      const btn = [...document.querySelectorAll('#propTabs .tab')].find(t => t.textContent === 'Sohbet');
      if (btn) REMS.Properties.switchTab(btn, 'Sohbet');
    }, 50);
  },

  toggleChannel(id, key) {
    const p = REMS.find.property(id);
    p.channels[key] = !p.channels[key];
    REMS.Store.save();
    REMS.toast(`${key} yayın ${p.channels[key] ? 'açıldı' : 'kapatıldı'}`);
    const btn = [...document.querySelectorAll('#propTabs .tab')].find(t => t.textContent === 'Yayın');
    if (btn) this.switchTab(btn, 'Yayın');
  },

  updatePrice(id) {
    const p = REMS.find.property(id);
    const price = Number(document.getElementById('priceNew').value);
    const min = Number(document.getElementById('priceMin').value);
    if (!price) return REMS.toast('Lütfen portföy fiyatını giriniz.', 'error');
    const old = p.currentPrice;
    p.priceHistory = p.priceHistory || [];
    p.priceHistory.push({ date: new Date().toISOString().slice(0, 10), price });
    p.currentPrice = price;
    p.minPrice = min || p.minPrice;
    p.pricePerM2 = Math.round(price / (p.housing?.brutM2 || p.land?.m2 || 1));
    REMS.log(`${p.code} fiyatını değiştirdi.`, `${REMS.fmt.money(old)} → ${REMS.fmt.money(price)}`);
    REMS.notify('Fiyat Güncellendi', `${p.code} yeni fiyat: ${REMS.fmt.money(price)}`, 'price');
    REMS.Store.save();
    REMS.toast('Fiyat güncellendi');
    REMS.Router.render();
  },

  openCreate(editId = null) {
    const d = REMS.Store.data;
    const p = editId ? REMS.find.property(editId) : null;
    REMS.UI.openDrawer(`
      <div class="drawer-header"><h2>${p ? 'Portföy Düzenle' : 'Yeni Portföy'}</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="drawer-body">
        <div class="form-grid">
          <div class="form-group full"><label>İlan Başlığı *</label><input class="form-control" id="pfTitle" value="${p?.title || ''}"></div>
          <div class="form-group"><label>İşlem Tipi *</label><select class="form-control" id="pfTx">${REMS.CONST.TRANSACTION_TYPES.map(t => `<option ${p?.transactionType===t?'selected':''}>${t}</option>`).join('')}</select></div>
          <div class="form-group"><label>Gayrimenkul Tipi *</label><select class="form-control" id="pfType">${REMS.CONST.PROPERTY_TYPES.map(t => `<option ${p?.propertyType===t?'selected':''}>${t}</option>`).join('')}</select></div>
          <div class="form-group"><label>Durum</label><select class="form-control" id="pfStatus">${REMS.CONST.PROPERTY_STATUSES.map(t => `<option ${ (p?.status||'Yeni')===t?'selected':''}>${t}</option>`).join('')}</select></div>
          <div class="form-group"><label>Yetki Tipi</label><select class="form-control" id="pfAuth">${REMS.CONST.AUTHORITY_TYPES.map(t => `<option ${p?.authorityType===t?'selected':''}>${t}</option>`).join('')}</select></div>
          <div class="form-group"><label>Mülk Sahibi *</label><select class="form-control" id="pfOwner">${d.owners.map(o => `<option value="${o.id}" ${p?.ownerId===o.id?'selected':''}>${o.name}</option>`).join('')}</select></div>
          <div class="form-group"><label>Danışman *</label><select class="form-control" id="pfAgent">${d.agents.map(a => `<option value="${a.id}" ${p?.agentId===a.id?'selected':''}>${a.name}</option>`).join('')}</select></div>
          <div class="form-group"><label>Şube</label><select class="form-control" id="pfBranch">${d.branches.map(b => `<option value="${b.id}" ${p?.branchId===b.id?'selected':''}>${b.name}</option>`).join('')}</select></div>
          <div class="form-group"><label>Kaynak</label><select class="form-control" id="pfSource">${['Sahibinden','Referans','Ofis','Web Sitesi','Hepsiemlak','Diğer'].map(t => `<option ${p?.source===t?'selected':''}>${t}</option>`).join('')}</select></div>
          <div class="form-group"><label>Güncel Fiyat *</label><input type="number" class="form-control" id="pfPrice" value="${p?.currentPrice || ''}"></div>
          <div class="form-group"><label>Min. Kabul Fiyatı</label><input type="number" class="form-control" id="pfMin" value="${p?.minPrice || ''}"></div>
          <div class="form-group"><label>Komisyon %</label><input type="number" class="form-control" id="pfCom" value="${p?.commissionRate || 2}"></div>
          <div class="form-group"><label>Brüt m²</label><input type="number" class="form-control" id="pfBrut" value="${p?.housing?.brutM2 || ''}"></div>
          <div class="form-group"><label>Net m²</label><input type="number" class="form-control" id="pfNet" value="${p?.housing?.netM2 || ''}"></div>
          <div class="form-group"><label>Oda</label><select class="form-control" id="pfRooms">${['1+1','2+1','3+1','4+1','5+1'].map(t => `<option ${p?.housing?.rooms===t?'selected':''}>${t}</option>`).join('')}</select></div>
          <div class="form-group"><label>Kat</label><input type="number" class="form-control" id="pfFloor" value="${p?.housing?.floor || ''}"></div>
          <div class="form-group"><label>İlçe</label><input class="form-control" id="pfIlce" value="${p?.address?.ilce || 'Bakırköy'}"></div>
          <div class="form-group"><label>Mahalle</label><input class="form-control" id="pfMahalle" value="${p?.address?.mahalle || 'Ataköy'}"></div>
          <div class="form-group"><label>Latitude</label><input type="number" step="any" class="form-control" id="pfLat" value="${p?.address?.lat || 40.9785}"></div>
          <div class="form-group"><label>Longitude</label><input type="number" step="any" class="form-control" id="pfLng" value="${p?.address?.lng || 28.8550}"></div>
          <div class="form-group full"><label>Açıklama</label><textarea class="form-control" id="pfDesc">${p?.description || ''}</textarea></div>
          <div class="form-group full"><label>Video URL</label><input class="form-control" id="pfVideo" value="${p?.videoUrl || ''}"></div>
          <div class="form-group full"><label>360 Sanal Tur URL</label><input class="form-control" id="pfTour" value="${p?.virtualTour || ''}"></div>
          <div class="form-group full"><label>Fotoğraflar</label>
            <div class="dropzone" id="pfDrop">Sürükle bırak veya tıkla · mobil kamera destekli
              <input type="file" id="pfFiles" accept="image/*" capture="environment" multiple hidden>
            </div>
            <div class="photo-grid" id="pfPhotoGrid"></div>
          </div>
        </div>
      </div>
      <div class="drawer-footer">
        <button class="btn btn-outline" data-close>İptal</button>
        <button class="btn btn-primary" onclick="REMS.Properties.save('${editId || ''}')">Kaydet</button>
      </div>`, { size: 'wide' });

    this._pendingPhotos = p ? [...(p.photos || [])] : [];
    this.renderPhotoGrid();
    const drop = document.getElementById('pfDrop');
    const files = document.getElementById('pfFiles');
    drop.onclick = () => files.click();
    drop.ondragover = (e) => { e.preventDefault(); drop.classList.add('dragover'); };
    drop.ondragleave = () => drop.classList.remove('dragover');
    drop.ondrop = (e) => {
      e.preventDefault();
      drop.classList.remove('dragover');
      this.handleFiles(e.dataTransfer.files);
    };
    files.onchange = () => this.handleFiles(files.files);
  },

  _pendingPhotos: [],

  handleFiles(fileList) {
    [...fileList].forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = () => {
        this._pendingPhotos.push({
          id: REMS.uid('ph'),
          url: reader.result,
          isCover: this._pendingPhotos.length === 0,
          order: this._pendingPhotos.length
        });
        this.renderPhotoGrid();
      };
      reader.readAsDataURL(file);
    });
  },

  renderPhotoGrid() {
    const grid = document.getElementById('pfPhotoGrid');
    if (!grid) return;
    grid.innerHTML = this._pendingPhotos.map((ph, i) => `
      <div class="photo-item ${ph.isCover ? 'cover' : ''}">
        <img src="${ph.url}" alt="">
        <div class="actions">
          <button onclick="REMS.Properties.setCover(${i})">Kapak</button>
          <button onclick="REMS.Properties.removePhoto(${i})">Sil</button>
        </div>
      </div>`).join('');
  },

  setCover(i) {
    this._pendingPhotos.forEach((p, idx) => p.isCover = idx === i);
    this.renderPhotoGrid();
  },

  removePhoto(i) {
    this._pendingPhotos.splice(i, 1);
    if (this._pendingPhotos.length && !this._pendingPhotos.some(p => p.isCover)) {
      this._pendingPhotos[0].isCover = true;
    }
    this.renderPhotoGrid();
  },

  openEdit(id) { this.openCreate(id); },

  save(editId) {
    const title = document.getElementById('pfTitle').value.trim();
    const price = Number(document.getElementById('pfPrice').value);
    const ownerId = document.getElementById('pfOwner').value;
    const agentId = document.getElementById('pfAgent').value;
    if (!title) return REMS.toast('Lütfen ilan başlığını giriniz.', 'error');
    if (!price) return REMS.toast('Lütfen portföy fiyatını giriniz.', 'error');
    if (!ownerId) return REMS.toast('Mülk sahibisiz portföy oluşturulamaz.', 'error');
    if (!agentId) return REMS.toast('Lütfen danışman seçiniz.', 'error');

    const brut = Number(document.getElementById('pfBrut').value) || 100;
    const payload = {
      title,
      transactionType: document.getElementById('pfTx').value,
      propertyType: document.getElementById('pfType').value,
      status: document.getElementById('pfStatus').value,
      authorityType: document.getElementById('pfAuth').value,
      ownerId, agentId,
      branchId: document.getElementById('pfBranch').value,
      source: document.getElementById('pfSource').value,
      currentPrice: price,
      firstPrice: price,
      minPrice: Number(document.getElementById('pfMin').value) || Math.round(price * 0.95),
      commissionRate: Number(document.getElementById('pfCom').value) || 2,
      currency: 'TRY',
      pricePerM2: Math.round(price / brut),
      description: document.getElementById('pfDesc').value,
      videoUrl: document.getElementById('pfVideo').value,
      virtualTour: document.getElementById('pfTour').value,
      photos: this._pendingPhotos.length ? this._pendingPhotos : undefined,
      housing: {
        brutM2: brut,
        netM2: Number(document.getElementById('pfNet').value) || Math.round(brut * 0.85),
        rooms: document.getElementById('pfRooms').value,
        livingRooms: 1, bathrooms: 1, wc: 1,
        floor: Number(document.getElementById('pfFloor').value) || 1,
        buildingFloors: 10, buildingAge: 5, heating: 'Kombi',
        balcony: true, elevator: true, parking: true, furnished: false,
        usage: 'Boş', inSite: false, dues: 750, deed: 'Kat Mülkiyetli',
        creditSuitable: true, facade: 'Güney', view: 'Şehir', swap: false
      },
      address: {
        il: 'İstanbul',
        ilce: document.getElementById('pfIlce').value,
        mahalle: document.getElementById('pfMahalle').value,
        sokak: '', bina: '', daire: '',
        full: `İstanbul / ${document.getElementById('pfIlce').value} / ${document.getElementById('pfMahalle').value}`,
        lat: Number(document.getElementById('pfLat').value),
        lng: Number(document.getElementById('pfLng').value)
      }
    };

    if (editId) {
      const p = REMS.find.property(editId);
      Object.assign(p, payload);
      if (payload.photos) p.photos = payload.photos;
      REMS.log('Portföy güncellendi', p.code);
      REMS.toast('Portföy başarıyla güncellendi.');
    } else {
      const code = REMS.Store.nextCode('property');
      const neo = {
        id: REMS.uid('pr'),
        code,
        ...payload,
        photos: payload.photos || [],
        priceHistory: [{ date: new Date().toISOString().slice(0, 10), price }],
        authorityStart: new Date().toISOString().slice(0, 10),
        authorityEnd: '2026-12-31',
        authorityContractNo: `YTK-2026-${Date.now().toString().slice(-4)}`,
        channels: { web: true, sahibinden: false, hepsiemlak: false, emlakjet: false, social: false },
        qualityScore: { total: 70, photo: this._pendingPhotos.length ? 90 : 40, description: payload.description ? 80 : 40, completeness: 75, location: 100, video: payload.videoUrl ? 80 : 30 },
        listedAt: new Date().toISOString().slice(0, 10),
        daysOnMarket: 0,
        agingRisk: 'Düşük',
        documents: [],
        chat: [],
        land: null,
        commercial: null,
        createdAt: new Date().toISOString().slice(0, 10)
      };
      REMS.Store.data.properties.unshift(neo);
      REMS.log('Portföy oluşturuldu', code);
      REMS.notify('Yeni Portföy', `${code} sisteme eklendi.`, 'property');
      REMS.toast('Portföy başarıyla oluşturuldu.');
      REMS.UI.closeOverlays();
      REMS.Store.save();
      REMS.Router.go('property-detail', { id: neo.id });
      return;
    }
    REMS.Store.save();
    REMS.UI.closeOverlays();
    REMS.Router.go('property-detail', { id: editId });
  },

  remove(id) {
    if (!confirm('Portföy silinsin mi?')) return;
    const p = REMS.find.property(id);
    REMS.Store.data.properties = REMS.Store.data.properties.filter(x => x.id !== id);
    REMS.log('Portföy silindi', p?.code || id);
    REMS.Store.save();
    REMS.toast('Portföy silindi');
    REMS.Router.go('properties');
  },

  toggleFavorite(id) {
    const fav = REMS.Store.data.favorites || [];
    const i = fav.indexOf(id);
    if (i >= 0) fav.splice(i, 1); else fav.push(id);
    REMS.Store.data.favorites = fav;
    REMS.Store.save();
    REMS.toast(i >= 0 ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi');
  },

  addCompare(id) {
    const ids = REMS.Store.data.compareIds || [];
    if (ids.includes(id)) return REMS.toast('Zaten karşılaştırma listesinde', 'warning');
    if (ids.length >= 4) return REMS.toast('En fazla 4 portföy karşılaştırılabilir', 'warning');
    ids.push(id);
    REMS.Store.data.compareIds = ids;
    REMS.Store.save();
    REMS.toast('Karşılaştırmaya eklendi');
  },

  compare() {
    const ids = REMS.Store.data.compareIds || [];
    const props = ids.map(id => REMS.find.property(id)).filter(Boolean);
    if (!props.length) {
      return `<div class="page-header"><div><h1>Portföy Karşılaştırma</h1></div></div>
        ${REMS.UI.empty('Karşılaştırılacak portföy yok', 'Portföy detayından ekleyin.', 'Portföylere Git', () => REMS.Router.go('properties'))}`;
    }
    const rows = [
      ['Fiyat', p => REMS.fmt.money(p.currentPrice)],
      ['m²', p => p.housing?.brutM2 || p.land?.m2 || '—'],
      ['Oda', p => p.housing?.rooms || '—'],
      ['Yaş', p => p.housing?.buildingAge ?? '—'],
      ['Kat', p => p.housing?.floor ?? '—'],
      ['Aidat', p => REMS.fmt.money(p.housing?.dues)],
      ['Lokasyon', p => p.address.ilce],
      ['m² Fiyatı', p => REMS.fmt.money(p.pricePerM2)]
    ];
    return `
    <div class="page-header"><div><h1>Portföy Karşılaştırma</h1></div>
    <button class="btn btn-outline" onclick="REMS.Store.data.compareIds=[];REMS.Store.save();REMS.Router.render()">Temizle</button></div>
    <div class="card"><div class="table-wrap"><table class="data compare-table"><thead><tr><th>Özellik</th>
    ${props.map(p => `<th><img src="${REMS.cover(p)}" style="height:80px;width:100%;object-fit:cover;border-radius:8px;margin-bottom:6px"><div>${p.code}</div></th>`).join('')}
    </tr></thead><tbody>
    ${rows.map(([label, fn]) => `<tr><td><strong>${label}</strong></td>${props.map(p => `<td>${fn(p)}</td>`).join('')}</tr>`).join('')}
    </tbody></table></div></div>`;
  },

  openShareModal(id) {
    const p = REMS.find.property(id);
    REMS.UI.openModal(`
      <div class="modal-header"><h2>Portföy Paylaş</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="modal-body">
        <p class="mb-16"><strong>${p.code}</strong> — ${p.title}</p>
        <div class="form-group"><label>Alıcı telefon / e-posta</label><input class="form-control" id="shareTo" placeholder="05xx... veya e-posta"></div>
        <div class="form-group mt-16"><label>Mesaj</label><textarea class="form-control" id="shareMsg">${p.title}\n${REMS.fmt.money(p.currentPrice)}\n${p.address.full}\nDetay: public/index.html#listing/${p.id}</textarea></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="REMS.Properties.doShare('WhatsApp')">WhatsApp</button>
        <button class="btn btn-outline" onclick="REMS.Properties.doShare('E-posta')">E-posta</button>
        <button class="btn btn-primary" onclick="REMS.Properties.doShare('SMS')">SMS</button>
      </div>`);
  },

  doShare(channel) {
    const to = document.getElementById('shareTo')?.value?.trim();
    if (!to) return REMS.toast('Lütfen alıcı bilgisini giriniz.', 'error');
    REMS.UI.closeOverlays();
    REMS.toast(`Portföy ${channel} ile paylaşıldı (demo)`);
    REMS.log('Portföy paylaşıldı', channel);
  },

  sharePage(id) {
    const p = REMS.find.property(id);
    if (!p) return REMS.UI.empty('Portföy yok');
    const agent = REMS.find.agent(p.agentId);
    const similar = REMS.Store.data.properties.filter(x => x.id !== p.id && x.address.ilce === p.address.ilce).slice(0, 3);
    return `
    <div class="page-header"><div><h1>Paylaşım Sayfası</h1><p>Müşteriye gönderilebilir temiz görünüm</p></div>
    <div class="page-actions">
      <a class="btn btn-primary" href="public/index.html#listing/${p.id}" target="_blank">Vitrinde Aç</a>
      <button class="btn btn-outline" onclick="window.print()"><i data-lucide="printer"></i> Yazdır</button>
    </div></div>
    <div class="print-doc card card-body">
      <img src="${REMS.cover(p)}" style="width:100%;height:320px;object-fit:cover;border-radius:16px;margin-bottom:16px">
      <h1>${p.title}</h1>
      <div class="prop-card-price" style="font-size:28px;margin:8px 0">${REMS.fmt.money(p.currentPrice)}</div>
      <p>${p.description}</p>
      <div class="info-list mt-16">
        <div><span>m²</span><strong>${p.housing?.brutM2 || '—'}</strong></div>
        <div><span>Oda</span><strong>${p.housing?.rooms || '—'}</strong></div>
        <div><span>Kat</span><strong>${p.housing?.floor || '—'}</strong></div>
        <div><span>Lokasyon</span><strong>${p.address.full}</strong></div>
      </div>
      <div class="mt-16 card card-body" style="background:var(--bg-soft)">
        <strong>Danışman: ${agent?.name}</strong>
        <div class="text-muted">${agent?.phone} · ${agent?.email}</div>
      </div>
      <h3 class="mt-16">Benzer Portföyler</h3>
      <div class="prop-grid mt-16">${similar.map(s => `
        <div class="prop-card" onclick="REMS.Router.go('share',{id:'${s.id}'})">
          <div class="prop-card-img"><img src="${REMS.cover(s)}"></div>
          <div class="prop-card-body"><div class="prop-card-price">${REMS.fmt.money(s.currentPrice)}</div>
          <div class="prop-card-title">${s.title}</div></div>
        </div>`).join('')}
      </div>
    </div>`;
  },

  quickWizard() {
    this._wizard = this._wizard || { step: 1, data: {} };
    const step = this._wizard.step;
    const steps = ['Konum', 'Tür', 'Fotoğraf', 'Mülk Sahibi', 'Fiyat', 'Detay', 'Kaydet'];
    return `
    <div class="page-header"><div><h1>Hızlı Portföy Ekle</h1><p>Saha danışmanı için adım adım giriş</p></div></div>
    <div class="wizard-steps">${steps.map((s, i) => `<div class="wizard-step ${i+1===step?'active':''} ${i+1<step?'done':''}">${i+1}. ${s}</div>`).join('')}</div>
    <div class="card card-body" id="wizardBody">${this.wizardStep(step)}</div>
    <div class="page-actions mt-16">
      ${step > 1 ? `<button class="btn btn-outline" onclick="REMS.Properties.wiz(-1)">Geri</button>` : ''}
      ${step < 7 ? `<button class="btn btn-primary" onclick="REMS.Properties.wiz(1)">İleri</button>` :
        `<button class="btn btn-primary" onclick="REMS.Properties.wizSave()">Kaydet</button>`}
    </div>`;
  },

  wizardStep(step) {
    const w = this._wizard.data;
    if (step === 1) return `<div class="form-grid">
      <div class="form-group"><label>İlçe</label><input class="form-control" id="wIlce" value="${w.ilce||'Bakırköy'}"></div>
      <div class="form-group"><label>Mahalle</label><input class="form-control" id="wMahalle" value="${w.mahalle||'Ataköy'}"></div>
      <div class="form-group"><label>Lat</label><input class="form-control" id="wLat" value="${w.lat||40.9785}"></div>
      <div class="form-group"><label>Lng</label><input class="form-control" id="wLng" value="${w.lng||28.855}"></div>
      <button class="btn btn-outline" onclick="navigator.geolocation.getCurrentPosition(pos=>{document.getElementById('wLat').value=pos.coords.latitude;document.getElementById('wLng').value=pos.coords.longitude;REMS.toast('Konum alındı')})">Mevcut Konumu Al</button>
    </div>`;
    if (step === 2) return `<div class="form-grid">
      <div class="form-group"><label>İşlem</label><select class="form-control" id="wTx">${REMS.CONST.TRANSACTION_TYPES.map(t=>`<option ${w.tx===t?'selected':''}>${t}</option>`).join('')}</select></div>
      <div class="form-group"><label>Tür</label><select class="form-control" id="wType">${REMS.CONST.PROPERTY_TYPES.map(t=>`<option ${w.type===t?'selected':''}>${t}</option>`).join('')}</select></div>
      <div class="form-group"><label>Oda</label><select class="form-control" id="wRooms">${['1+1','2+1','3+1','4+1'].map(t=>`<option ${w.rooms===t?'selected':''}>${t}</option>`).join('')}</select></div>
      <div class="form-group"><label>Brüt m²</label><input type="number" class="form-control" id="wBrut" value="${w.brut||120}"></div>
    </div>`;
    if (step === 3) return `<div class="dropzone" onclick="document.getElementById('wCam').click()">Kamera / Galeri
      <input type="file" id="wCam" accept="image/*" capture="environment" multiple hidden onchange="REMS.Properties.wizPhotos(this.files)">
    </div><div class="photo-grid" id="wPhotoGrid"></div>`;
    if (step === 4) return `<div class="form-group"><label>Mülk Sahibi</label>
      <select class="form-control" id="wOwner">${REMS.Store.data.owners.map(o=>`<option value="${o.id}" ${w.ownerId===o.id?'selected':''}>${o.name}</option>`).join('')}</select></div>`;
    if (step === 5) return `<div class="form-group"><label>Fiyat</label><input type="number" class="form-control" id="wPrice" value="${w.price||''}"></div>`;
    if (step === 6) return `<div class="form-group"><label>Başlık</label><input class="form-control" id="wTitle" value="${w.title||''}"></div>
      <div class="form-group mt-16"><label>Açıklama</label><textarea class="form-control" id="wDesc">${w.desc||''}</textarea></div>`;
    return `<p>Kayda hazır. Kaydet butonuna basın.</p>`;
  },

  wizCollect() {
    const step = this._wizard.step;
    const w = this._wizard.data;
    if (step === 1) {
      w.ilce = document.getElementById('wIlce')?.value;
      w.mahalle = document.getElementById('wMahalle')?.value;
      w.lat = Number(document.getElementById('wLat')?.value);
      w.lng = Number(document.getElementById('wLng')?.value);
    }
    if (step === 2) {
      w.tx = document.getElementById('wTx')?.value;
      w.type = document.getElementById('wType')?.value;
      w.rooms = document.getElementById('wRooms')?.value;
      w.brut = Number(document.getElementById('wBrut')?.value);
    }
    if (step === 4) w.ownerId = document.getElementById('wOwner')?.value;
    if (step === 5) w.price = Number(document.getElementById('wPrice')?.value);
    if (step === 6) { w.title = document.getElementById('wTitle')?.value; w.desc = document.getElementById('wDesc')?.value; }
  },

  wiz(dir) {
    this.wizCollect();
    this._wizard.step = Math.min(7, Math.max(1, this._wizard.step + dir));
    REMS.Router.render();
    if (this._wizard.data.photos) {
      setTimeout(() => {
        const g = document.getElementById('wPhotoGrid');
        if (g) g.innerHTML = this._wizard.data.photos.map(p => `<div class="photo-item"><img src="${p.url}"></div>`).join('');
      }, 50);
    }
  },

  wizPhotos(files) {
    this._wizard.data.photos = this._wizard.data.photos || [];
    [...files].forEach(file => {
      const r = new FileReader();
      r.onload = () => {
        this._wizard.data.photos.push({ id: REMS.uid('ph'), url: r.result, isCover: this._wizard.data.photos.length===0, order: this._wizard.data.photos.length });
        const g = document.getElementById('wPhotoGrid');
        if (g) g.innerHTML = this._wizard.data.photos.map(p => `<div class="photo-item"><img src="${p.url}"></div>`).join('');
      };
      r.readAsDataURL(file);
    });
  },

  wizSave() {
    this.wizCollect();
    const w = this._wizard.data;
    if (!w.price) return REMS.toast('Lütfen portföy fiyatını giriniz.', 'error');
    if (!w.ownerId) return REMS.toast('Mülk sahibi seçiniz.', 'error');
    const code = REMS.Store.nextCode('property');
    const neo = {
      id: REMS.uid('pr'), code,
      title: w.title || `${w.mahalle} ${w.rooms || ''} ${w.tx} ${w.type}`,
      transactionType: w.tx || 'Satılık', propertyType: w.type || 'Daire', status: 'Yeni',
      agentId: REMS.Store.data.currentUser.id, branchId: REMS.Store.data.currentUser.branchId,
      ownerId: w.ownerId, source: 'Ofis', authorityType: 'Yetkili',
      authorityStart: new Date().toISOString().slice(0,10), authorityEnd: '2026-12-31',
      authorityContractNo: `YTK-${Date.now().toString().slice(-6)}`, commissionRate: 2,
      firstPrice: w.price, currentPrice: w.price, minPrice: Math.round(w.price*0.95),
      currency: 'TRY', pricePerM2: Math.round(w.price/(w.brut||100)),
      priceHistory: [{ date: new Date().toISOString().slice(0,10), price: w.price }],
      description: w.desc || 'Saha üzerinden hızlı portföy girişi.',
      address: { il:'İstanbul', ilce:w.ilce, mahalle:w.mahalle, sokak:'', bina:'', daire:'', full:`İstanbul / ${w.ilce} / ${w.mahalle}`, lat:w.lat, lng:w.lng },
      housing: { brutM2:w.brut||100, netM2:Math.round((w.brut||100)*0.85), rooms:w.rooms||'3+1', livingRooms:1, bathrooms:1, wc:1, floor:1, buildingFloors:8, buildingAge:5, heating:'Kombi', balcony:true, elevator:true, parking:true, furnished:false, usage:'Boş', inSite:false, dues:700, deed:'Kat Mülkiyetli', creditSuitable:true, facade:'Güney', view:'Şehir', swap:false },
      land:null, commercial:null, photos:w.photos||[], videoUrl:'', virtualTour:'',
      channels:{web:false,sahibinden:false,hepsiemlak:false,emlakjet:false,social:false},
      qualityScore:{total:65,photo:w.photos?.length?85:40,description:60,completeness:70,location:100,video:20},
      listedAt:new Date().toISOString().slice(0,10), daysOnMarket:0, agingRisk:'Düşük',
      documents:[], chat:[], createdAt:new Date().toISOString().slice(0,10)
    };
    REMS.Store.data.properties.unshift(neo);
    REMS.Store.save();
    this._wizard = { step: 1, data: {} };
    REMS.toast('Portföy başarıyla oluşturuldu.');
    REMS.Router.go('property-detail', { id: neo.id });
  }
};
