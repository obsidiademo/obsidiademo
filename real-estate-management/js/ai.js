/* AI-assisted portfolio analysis (demo inference engine) */
window.REMS = window.REMS || {};

REMS.AI = {
  _typingTimer: null,

  analyzeProperty(propertyId) {
    const p = REMS.find.property(propertyId);
    if (!p) return null;

    const peers = REMS.Store.data.properties.filter(x =>
      x.id !== p.id &&
      x.address.ilce === p.address.ilce &&
      x.transactionType === p.transactionType &&
      x.propertyType === p.propertyType
    );
    const peerPrices = peers.map(x => x.pricePerM2).filter(Boolean);
    const districtAvg = peerPrices.length
      ? Math.round(peerPrices.reduce((a, b) => a + b, 0) / peerPrices.length)
      : p.pricePerM2;
    const m2 = p.housing?.brutM2 || p.land?.m2 || 1;
    const deltaPct = districtAvg ? Math.round(((p.pricePerM2 - districtAvg) / districtAvg) * 100) : 0;

    const qs = p.qualityScore || { total: 70, photo: 70, description: 70, completeness: 70, location: 100, video: 40 };
    const days = p.daysOnMarket || 0;
    const offers = REMS.Store.data.offers.filter(o => o.propertyId === p.id);
    const leads = REMS.Store.data.leads.filter(l => l.propertyId === p.id);
    const showings = REMS.Store.data.appointments.filter(a => a.propertyId === p.id && a.type === 'Yer Gösterme');

    // Scoring model (0-100)
    let score = 55;
    score += Math.min(20, Math.round(qs.total / 5));
    if (days < 30) score += 10;
    else if (days < 60) score += 4;
    else if (days > 90) score -= 12;
    else if (days > 60) score -= 6;
    if (deltaPct < -5) score += 8; // underpriced = faster sale potential
    else if (deltaPct > 12) score -= 10;
    else if (deltaPct > 5) score -= 4;
    if (offers.length) score += 6;
    if (leads.length >= 3) score += 5;
    if (showings.length >= 2) score += 4;
    if (p.authorityType === 'Tek Yetkili') score += 3;
    if (!p.photos || p.photos.length < 5) score -= 8;
    if (!p.videoUrl) score -= 2;
    score = Math.max(12, Math.min(98, score));

    let pricingAction = 'Koruyun';
    let suggestedPrice = p.currentPrice;
    if (deltaPct > 10 || (days > 75 && deltaPct > 3)) {
      pricingAction = 'Düşürün';
      suggestedPrice = Math.round(p.currentPrice * (1 - Math.min(0.08, (deltaPct + days / 40) / 100)));
    } else if (deltaPct < -8 && days < 25 && leads.length >= 2) {
      pricingAction = 'Artırın';
      suggestedPrice = Math.round(p.currentPrice * 1.03);
    } else if (days > 45 && offers.length === 0) {
      pricingAction = 'Hafif düşürün';
      suggestedPrice = Math.round(p.currentPrice * 0.97);
    }

    const demand = leads.length + showings.length * 1.5 + offers.length * 2;
    const demandLabel = demand >= 8 ? 'Yüksek' : demand >= 3 ? 'Orta' : 'Düşük';

    const insights = [];
    if (deltaPct > 8) {
      insights.push(`${p.address.ilce} bölgesinde benzer ${p.propertyType.toLowerCase()} ortalamasına göre m² fiyatı %${deltaPct} yüksek.`);
    } else if (deltaPct < -5) {
      insights.push(`Bölge ortalamasının %${Math.abs(deltaPct)} altında fiyatlanmış; hızlı dönüş potansiyeli yüksek.`);
    } else {
      insights.push(`m² fiyatı ${p.address.ilce} emsallerine yakın (%${deltaPct >= 0 ? '+' : ''}${deltaPct}).`);
    }

    if (days >= 60) {
      insights.push(`${days} gündür yayında. Yaşlanma riski ${p.agingRisk || 'Orta'}; fotoğraf yenileme ve fiyat revizyonu önerilir.`);
    } else {
      insights.push(`Portföy ${days} gündür yayında; pazar süresi henüz kritik eşikte değil.`);
    }

    if (qs.photo < 75) insights.push('İlan fotoğraf kalitesi düşük; profesyonel çekim skorunu hızla yükseltebilir.');
    if (qs.video < 60) insights.push('Video / 360 sanal tur eksik; dönüşüm oranı genelde %12–18 artar.');
    if (qs.description < 70) insights.push('Açıklama metni güçlendirilmeli; anahtar kelime ve yaşam avantajları eklenmeli.');

    if (offers.length) {
      const maxOffer = Math.max(...offers.map(o => o.offerPrice));
      insights.push(`${offers.length} aktif teklif var. En yüksek teklif ${REMS.fmt.money(maxOffer)}.`);
    } else {
      insights.push('Henüz kayıtlı teklif yok. Hedefli lead paylaşımı ve yer gösterme yoğunluğu artırılmalı.');
    }

    const actions = [];
    if (pricingAction !== 'Koruyun') {
      actions.push(`Önerilen fiyat: ${REMS.fmt.money(suggestedPrice)} (${pricingAction.toLowerCase()})`);
    } else {
      actions.push('Mevcut fiyatı koruyun; 7 gün içinde teklif gelmezse hafif revizyon planlayın.');
    }
    if ((p.photos || []).length < 8) actions.push('En az 8–12 kaliteli fotoğraf yükleyin; kapak görselini yenileyin.');
    if (!p.channels?.sahibinden) actions.push('Sahibinden yayınını açarak lead hacmini artırın.');
    if (leads.length < 2) actions.push('Müşteri talepleriyle otomatik eşleştirmeyi çalıştırın.');
    actions.push('Bu hafta en az 2 yer gösterme planlayın.');

    const scoreLabel = score >= 80 ? 'Güçlü' : score >= 60 ? 'Orta' : 'Zayıf';
    const narrative = this._narrative(p, {
      score, scoreLabel, deltaPct, districtAvg, demandLabel, pricingAction, suggestedPrice, days, qs
    });

    return {
      property: p,
      score,
      scoreLabel,
      deltaPct,
      districtAvg,
      peerCount: peers.length,
      demandLabel,
      demandScore: Math.round(demand),
      pricingAction,
      suggestedPrice,
      days,
      quality: qs,
      offers: offers.length,
      leads: leads.length,
      showings: showings.length,
      insights,
      actions,
      narrative,
      generatedAt: new Date().toISOString()
    };
  },

  _narrative(p, meta) {
    const agent = REMS.find.agent(p.agentId);
    return `Yapay zeka portföy analizi: ${p.code} (${p.title}). ` +
      `${p.address.ilce} / ${p.address.mahalle} konumunda ${p.transactionType.toLowerCase()} ${p.propertyType.toLowerCase()} için satış/kiralama potansiyel skoru ${meta.score}/100 (${meta.scoreLabel}). ` +
      `Bölge m² ortalaması ${REMS.fmt.money(meta.districtAvg)}; portföy m² fiyatı ${REMS.fmt.money(p.pricePerM2)} (%${meta.deltaPct >= 0 ? '+' : ''}${meta.deltaPct}). ` +
      `Talep seviyesi ${meta.demandLabel}. Fiyat önerisi: ${meta.pricingAction}` +
      (meta.pricingAction !== 'Koruyun' ? ` → ${REMS.fmt.money(meta.suggestedPrice)}.` : '.') +
      ` İlan kalite skoru ${meta.qs.total}/100. Yetkili danışman: ${agent?.name || '—'}. ` +
      `Model; fiyat geçmişi, emsal m², yayında kalma süresi, lead/teklif/yer gösterme yoğunluğu ve içerik tamamlılığını birlikte değerlendirdi.`;
  },

  analyzePortfolio() {
    const active = REMS.Store.data.properties.filter(p =>
      ['Aktif', 'Yeni', 'Teklif Var', 'Opsiyonlu'].includes(p.status)
    );
    const analyses = active.map(p => this.analyzeProperty(p.id)).filter(Boolean);
    analyses.sort((a, b) => a.score - b.score);

    const overpriced = analyses.filter(a => a.deltaPct > 8).length;
    const aging = analyses.filter(a => a.days >= 60).length;
    const weakMedia = analyses.filter(a => (a.quality.photo || 0) < 75 || (a.quality.video || 0) < 50).length;
    const avgScore = analyses.length
      ? Math.round(analyses.reduce((s, a) => s + a.score, 0) / analyses.length)
      : 0;

    const topRisks = analyses.slice(0, 5);
    const topOpportunities = [...analyses].sort((a, b) => b.score - a.score).slice(0, 5);

    const summary = `AI özeti: ${analyses.length} aktif portföy tarandı. Ortalama potansiyel skoru ${avgScore}/100. ` +
      `${overpriced} ilan bölge üstü fiyatlı, ${aging} ilan 60+ gündür yayında, ${weakMedia} ilanda görsel/video açığı var. ` +
      `Öncelik: yaşlanan ve aşırı fiyatlı portföylerde fiyat + içerik optimizasyonu.`;

    return { analyses, avgScore, overpriced, aging, weakMedia, topRisks, topOpportunities, summary, count: analyses.length };
  },

  page() {
    setTimeout(() => this.renderHub(), 40);
    return `
    <div class="page-header">
      <div>
        <h1><i data-lucide="sparkles" style="width:22px;height:22px;display:inline;vertical-align:-3px"></i> AI Portföy Analizi</h1>
        <p>Yapay zeka destekli fiyat, talep, yaşlanma ve içerik analizi</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" onclick="REMS.AI.refreshHub()"><i data-lucide="refresh-cw"></i> Yeniden Analiz Et</button>
        <button class="btn btn-primary" onclick="REMS.Router.go('properties')"><i data-lucide="building-2"></i> Portföyler</button>
      </div>
    </div>
    <div id="aiHubRoot">
      <div class="card card-body ai-loading">
        <div class="skeleton" style="height:18px;width:40%;margin-bottom:12px"></div>
        <div class="skeleton" style="height:12px;width:90%;margin-bottom:8px"></div>
        <div class="skeleton" style="height:12px;width:75%"></div>
        <p class="text-muted mt-16">AI modeli portföyleri tarıyor…</p>
      </div>
    </div>`;
  },

  refreshHub() {
    const root = document.getElementById('aiHubRoot');
    if (!root) return;
    root.innerHTML = `<div class="card card-body ai-loading">
      <div class="skeleton" style="height:18px;width:40%;margin-bottom:12px"></div>
      <div class="skeleton" style="height:12px;width:90%;margin-bottom:8px"></div>
      <p class="text-muted mt-16">Yeniden analiz ediliyor…</p>
    </div>`;
    setTimeout(() => this.renderHub(true), 450);
  },

  renderHub(announce) {
    const root = document.getElementById('aiHubRoot');
    if (!root) return;
    const report = this.analyzePortfolio();
    root.innerHTML = `
      <div class="kpi-grid">
        <div class="kpi-card"><div class="kpi-label">Analiz Edilen</div><div class="kpi-value">${report.count}</div></div>
        <div class="kpi-card"><div class="kpi-label">Ort. AI Skoru</div><div class="kpi-value">${report.avgScore}</div></div>
        <div class="kpi-card"><div class="kpi-label">Aşırı Fiyatlı</div><div class="kpi-value">${report.overpriced}</div></div>
        <div class="kpi-card"><div class="kpi-label">Yaşlanan (60+ gün)</div><div class="kpi-value">${report.aging}</div></div>
      </div>
      <div class="card mt-16"><div class="card-header"><h3>AI Özet</h3><span class="badge badge-primary">Demo AI</span></div>
        <div class="card-body"><p id="aiSummaryText" class="ai-narrative"></p></div>
      </div>
      <div class="grid-2 mt-16">
        <div class="card"><div class="card-header"><h3>Öncelikli Riskler</h3></div><div class="card-body">
          ${report.topRisks.map(a => this._row(a, true)).join('') || '<p class="text-muted">Risk yok</p>'}
        </div></div>
        <div class="card"><div class="card-header"><h3>Fırsat Portföyleri</h3></div><div class="card-body">
          ${report.topOpportunities.map(a => this._row(a, false)).join('') || '<p class="text-muted">Kayıt yok</p>'}
        </div></div>
      </div>
      <div class="card mt-16"><div class="card-header"><h3>Portföy Bazlı AI Skorları</h3></div>
        <div class="table-wrap"><table class="data"><thead><tr>
          <th>Portföy</th><th>Bölge</th><th>AI Skor</th><th>Talep</th><th>m² Sapma</th><th>Fiyat Önerisi</th><th></th>
        </tr></thead><tbody>
        ${report.analyses.map(a => `<tr>
          <td><strong>${a.property.code}</strong><div class="text-muted" style="font-size:11px">${a.property.title.slice(0,36)}…</div></td>
          <td>${a.property.address.ilce}</td>
          <td><span class="badge ${a.score>=80?'badge-success':a.score>=60?'badge-warning':'badge-danger'}">${a.score} · ${a.scoreLabel}</span></td>
          <td>${a.demandLabel}</td>
          <td>%${a.deltaPct >= 0 ? '+' : ''}${a.deltaPct}</td>
          <td>${a.pricingAction}<div class="text-muted" style="font-size:11px">${REMS.fmt.money(a.suggestedPrice)}</div></td>
          <td><button class="btn btn-sm btn-outline" onclick="REMS.AI.openPropertyAnalysis('${a.property.id}')">Detay</button></td>
        </tr>`).join('')}
        </tbody></table></div>
      </div>
      <p class="text-muted mt-16" style="font-size:12px">Not: Bu demo, yerel çıkarım motoru kullanır. Üretimde LLM + emsal veri servisi (NestJS/PostgreSQL) bağlanabilir; API anahtarı hard-code edilmez.</p>`;
    REMS.UI.icons();
    this.typeText('aiSummaryText', report.summary);
    if (announce) REMS.toast('AI portföy analizi güncellendi');
  },

  _row(a, risk) {
    return `<div class="stat-row" style="cursor:pointer" onclick="REMS.AI.openPropertyAnalysis('${a.property.id}')">
      <div>
        <strong>${a.property.code}</strong>
        <div class="text-muted" style="font-size:11px">${a.property.address.ilce} · ${a.days} gün · %${a.deltaPct >= 0 ? '+' : ''}${a.deltaPct} m²</div>
      </div>
      <span class="badge ${risk ? 'badge-danger' : 'badge-success'}">${a.score}</span>
    </div>`;
  },

  openPropertyAnalysis(propertyId) {
    const a = this.analyzeProperty(propertyId);
    if (!a) return REMS.toast('Portföy bulunamadı', 'error');
    REMS.UI.openDrawer(`
      <div class="drawer-header">
        <h2>AI Analiz · ${a.property.code}</h2>
        <button class="icon-btn" data-close><i data-lucide="x"></i></button>
      </div>
      <div class="drawer-body">
        ${this.detailHtml(a)}
      </div>
      <div class="drawer-footer">
        <button class="btn btn-outline" onclick="REMS.UI.closeOverlays();REMS.Router.go('property-detail',{id:'${a.property.id}'})">Portföye Git</button>
        <button class="btn btn-primary" onclick="REMS.AI.applyPriceSuggestion('${a.property.id}')">Fiyat Önerisini Uygula</button>
      </div>`, { size: 'wide' });
    this.typeText('aiPropNarrative', a.narrative);
  },

  detailHtml(a) {
    return `
      <div class="ai-score-wrap">
        <div class="score-ring" style="--score:${a.score}"><span>${a.score}</span></div>
        <div>
          <strong style="font-size:16px">${a.scoreLabel} potansiyel</strong>
          <div class="text-muted" style="font-size:12px;margin-top:4px">Talep: ${a.demandLabel} · ${a.leads} lead · ${a.showings} yer gösterme · ${a.offers} teklif</div>
          <div class="mt-16"><span class="badge badge-primary">${a.pricingAction}</span>
          <span class="badge">${REMS.fmt.money(a.suggestedPrice)}</span></div>
        </div>
      </div>
      <div class="info-list mt-16">
        <div><span>Bölge ort. m²</span><strong>${REMS.fmt.money(a.districtAvg)}</strong></div>
        <div><span>Portföy m²</span><strong>${REMS.fmt.money(a.property.pricePerM2)}</strong></div>
        <div><span>Sapma</span><strong>%${a.deltaPct >= 0 ? '+' : ''}${a.deltaPct}</strong></div>
        <div><span>Emsal sayısı</span><strong>${a.peerCount}</strong></div>
        <div><span>Yayında</span><strong>${a.days} gün</strong></div>
        <div><span>Kalite</span><strong>${a.quality.total}/100</strong></div>
      </div>
      <h3 class="mt-16">AI Değerlendirme</h3>
      <p id="aiPropNarrative" class="ai-narrative mt-16"></p>
      <h3 class="mt-16">İçgörüler</h3>
      <ul class="ai-list">${a.insights.map(i => `<li>${i}</li>`).join('')}</ul>
      <h3 class="mt-16">Önerilen Aksiyonlar</h3>
      <ul class="ai-list actions">${a.actions.map(i => `<li>${i}</li>`).join('')}</ul>`;
  },

  applyPriceSuggestion(propertyId) {
    const a = this.analyzeProperty(propertyId);
    if (!a) return;
    const p = a.property;
    const old = p.currentPrice;
    if (a.suggestedPrice === old) {
      REMS.toast('Mevcut fiyat zaten öneri ile uyumlu');
      return;
    }
    p.priceHistory = p.priceHistory || [];
    p.priceHistory.push({ date: new Date().toISOString().slice(0, 10), price: a.suggestedPrice });
    p.currentPrice = a.suggestedPrice;
    p.pricePerM2 = Math.round(a.suggestedPrice / (p.housing?.brutM2 || p.land?.m2 || 1));
    REMS.log('AI fiyat önerisi uygulandı', `${p.code}: ${REMS.fmt.money(old)} → ${REMS.fmt.money(a.suggestedPrice)}`);
    REMS.notify('AI Fiyat Güncellemesi', `${p.code} fiyatı ${REMS.fmt.money(a.suggestedPrice)} olarak güncellendi.`, 'ai');
    REMS.Store.save();
    REMS.UI.closeOverlays();
    REMS.toast('Fiyat önerisi uygulandı');
    if (REMS.Router.current === 'ai-analysis') this.refreshHub();
    else if (REMS.Router.current === 'property-detail') REMS.Router.render();
  },

  typeText(elId, text) {
    const el = document.getElementById(elId);
    if (!el) return;
    if (this._typingTimer) clearTimeout(this._typingTimer);
    el.textContent = '';
    let i = 0;
    const step = () => {
      if (i >= text.length) return;
      el.textContent += text.charAt(i);
      i += 1;
      this._typingTimer = setTimeout(step, 8 + Math.random() * 10);
    };
    step();
  },

  widgetHtml(propertyId) {
    const a = this.analyzeProperty(propertyId);
    if (!a) return '';
    return `
    <div class="card card-body ai-widget mt-16">
      <div class="flex-between mb-16">
        <h3 style="display:flex;align-items:center;gap:8px"><i data-lucide="sparkles"></i> AI Portföy Analizi</h3>
        <span class="badge ${a.score>=80?'badge-success':a.score>=60?'badge-warning':'badge-danger'}">${a.score}/100 · ${a.scoreLabel}</span>
      </div>
      <div class="stat-row"><span>Bölge m² sapması</span><strong>%${a.deltaPct >= 0 ? '+' : ''}${a.deltaPct}</strong></div>
      <div class="stat-row"><span>Talep</span><strong>${a.demandLabel}</strong></div>
      <div class="stat-row"><span>Fiyat önerisi</span><strong>${a.pricingAction} · ${REMS.fmt.money(a.suggestedPrice)}</strong></div>
      <p class="text-muted mt-16" style="font-size:12px">${a.insights[0] || ''}</p>
      <div class="page-actions mt-16">
        <button class="btn btn-outline btn-sm" onclick="REMS.AI.openPropertyAnalysis('${propertyId}')">Tam Analiz</button>
        <button class="btn btn-primary btn-sm" onclick="REMS.AI.applyPriceSuggestion('${propertyId}')">Öneriyi Uygula</button>
      </div>
    </div>`;
  }
};
