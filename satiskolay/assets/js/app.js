/* SatışKolay — Application Logic */
(function () {
  "use strict";

  const state = {
    filters: { brand: "", model: "", yearMin: "", yearMax: "", priceMin: "", priceMax: "", fuel: "", transmission: "", bodyType: "", city: "", tag: "" },
    sort: "recommended",
    favorites: new Set(JSON.parse(localStorage.getItem("sk_favs") || "[]")),
    compare: [],
    recentlyViewed: JSON.parse(localStorage.getItem("sk_recent") || "[]"),
    theme: localStorage.getItem("sk_theme") || "light",
    listingReady: false,
    heroViewer: null,
    detailViewer: null,
    showroomViewer: null,
    currentCar: null,
    savedSearchNotify: true,
    wizardStep: 1
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const fmt = (n) => "₺" + Number(n).toLocaleString("tr-TR");
  const fmtKm = (n) => Number(n).toLocaleString("tr-TR") + " KM";

  function toast(msg, type = "success") {
    const wrap = $("#toast-wrap");
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.textContent = msg;
    wrap.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateY(-8px)";
      setTimeout(() => el.remove(), 280);
    }, 2800);
  }

  function saveFavs() {
    localStorage.setItem("sk_favs", JSON.stringify([...state.favorites]));
    updateFavCount();
  }

  function updateFavCount() {
    const el = $("#fav-count");
    if (!el) return;
    el.textContent = state.favorites.size;
    el.classList.toggle("hidden", state.favorites.size === 0);
  }

  function updateCompareUI() {
    const bar = $("#compare-bar");
    const slots = $("#compare-slots");
    const count = $("#compare-count");
    if (!bar) return;
    bar.classList.toggle("open", state.compare.length > 0);
    if (count) {
      count.textContent = state.compare.length;
      count.classList.toggle("hidden", state.compare.length === 0);
    }
    slots.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const car = state.compare[i];
      const slot = document.createElement("div");
      slot.className = "compare-slot" + (car ? " filled" : "");
      if (car) {
        slot.innerHTML = `<span>${car.brand} ${car.model.split(" ")[0]}</span><button type="button" aria-label="Kaldır" data-remove="${car.id}"><i class="fa-solid fa-xmark"></i></button>`;
      } else {
        slot.innerHTML = `<span class="text-muted">Araç ${i + 1}</span>`;
      }
      slots.appendChild(slot);
      if (i < 2) {
        const vs = document.createElement("span");
        vs.className = "vs";
        vs.textContent = "VS";
        slots.appendChild(vs);
      }
    }
    slots.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.compare = state.compare.filter((c) => c.id !== btn.dataset.remove);
        updateCompareUI();
        renderListings();
      });
    });
  }

  function getGallery(id) {
    return SK.GALLERIES.find((g) => g.id === id) || SK.GALLERIES[0];
  }

  function filteredCars() {
    let list = SK.CARS.slice();
    const f = state.filters;
    if (f.brand) list = list.filter((c) => c.brand === f.brand);
    if (f.model) list = list.filter((c) => c.model === f.model);
    if (f.yearMin) list = list.filter((c) => c.year >= +f.yearMin);
    if (f.yearMax) list = list.filter((c) => c.year <= +f.yearMax);
    if (f.priceMin) list = list.filter((c) => c.price >= +f.priceMin);
    if (f.priceMax) list = list.filter((c) => c.price <= +f.priceMax);
    if (f.fuel) list = list.filter((c) => c.fuel === f.fuel);
    if (f.transmission) list = list.filter((c) => c.transmission === f.transmission);
    if (f.bodyType) list = list.filter((c) => c.bodyType === f.bodyType);
    if (f.city) list = list.filter((c) => c.city === f.city);
    if (f.tag) list = list.filter((c) => c.tags.includes(f.tag));

    switch (state.sort) {
      case "newest": list.sort((a, b) => b.year - a.year || a.km - b.km); break;
      case "priceAsc": list.sort((a, b) => a.price - b.price); break;
      case "priceDesc": list.sort((a, b) => b.price - a.price); break;
      case "kmAsc": list.sort((a, b) => a.km - b.km); break;
      case "year": list.sort((a, b) => b.year - a.year); break;
      case "score": list.sort((a, b) => b.kolayScore - a.kolayScore); break;
      default: list.sort((a, b) => b.kolayScore - a.kolayScore || a.price - b.price);
    }
    return list;
  }

  function vehicleCardHTML(car, opts = {}) {
    const fav = state.favorites.has(car.id);
    const inCompare = state.compare.some((c) => c.id === car.id);
    const drop = car.oldPrice ? car.oldPrice - car.price : 0;
    return `
      <article class="vehicle-card reveal" data-id="${car.id}">
        <div class="vehicle-media">
          ${opts.rank ? `<div class="rank-badge">#${opts.rank}</div>` : `
          <div class="v-badges">
            ${car.verified ? `<span class="badge badge-green"><i class="fa-solid fa-certificate"></i> Yetkili Galeri</span>` : ""}
            ${car.expertise ? `<span class="badge"><i class="fa-solid fa-check"></i> KolayCheck™</span>` : ""}
          </div>`}
          <button class="fav-btn ${fav ? "active" : ""}" type="button" data-fav="${car.id}" aria-label="Favorilere ekle">
            <i class="${fav ? "fa-solid" : "fa-regular"} fa-heart"></i>
          </button>
          <img src="${car.image}" alt="${car.name}" loading="lazy" width="800" height="500">
          <button class="kolay360-chip" type="button" data-showroom="${car.id}" aria-label="Kolay360 görüntüle">
            <i class="fa-solid fa-rotate"></i> Kolay360™
          </button>
        </div>
        <div class="vehicle-body">
          <div class="flex between center">
            <h3>${car.name}</h3>
            <span class="score-mini" title="KolaySkor">KS ${car.kolayScore}</span>
          </div>
          <div class="specs-row">
            <span><i class="fa-regular fa-calendar"></i> ${car.year}</span>
            <span><i class="fa-solid fa-road"></i> ${fmtKm(car.km)}</span>
            <span><i class="fa-solid fa-gas-pump"></i> ${car.fuel}</span>
            <span><i class="fa-solid fa-gears"></i> ${car.transmission}</span>
          </div>
          <div class="loc-row"><i class="fa-solid fa-location-dot"></i> ${car.city} / ${car.district}</div>
          <div class="price-row">
            ${car.oldPrice ? `<span class="old-price">${fmt(car.oldPrice)}</span>` : ""}
            <div class="price">${fmt(car.price)}</div>
            ${drop ? `<span class="advantage-badge">₺${drop.toLocaleString("tr-TR")} Avantaj</span>` : ""}
            <div class="monthly">Aylık ${fmt(car.monthlyPayment)}'den başlayan finansman</div>
          </div>
          <div class="card-actions">
            <button class="btn btn-primary btn-sm" type="button" data-detail="${car.id}">Aracı İncele</button>
            <button class="compare-toggle ${inCompare ? "active" : ""}" type="button" data-compare="${car.id}" aria-label="Karşılaştır">
              <i class="fa-solid fa-code-compare"></i>
            </button>
          </div>
        </div>
      </article>`;
  }

  function bindCardActions(root = document) {
    $$("[data-fav]", root).forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.fav;
        const car = SK.CARS.find((c) => c.id === id);
        if (state.favorites.has(id)) {
          state.favorites.delete(id);
          toast(`${car.name} favorilerden çıkarıldı.`, "warn");
        } else {
          state.favorites.add(id);
          toast(`${car.name} favorilerine eklendi.`);
        }
        saveFavs();
        renderListings();
        renderRecent();
        renderPriceDrops();
        renderTrending();
        renderEV();
      });
    });
    $$("[data-compare]", root).forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.compare;
        const car = SK.CARS.find((c) => c.id === id);
        const idx = state.compare.findIndex((c) => c.id === id);
        if (idx >= 0) {
          state.compare.splice(idx, 1);
          toast("Karşılaştırmadan çıkarıldı.", "warn");
        } else {
          if (state.compare.length >= 3) {
            toast("En fazla 3 araç karşılaştırabilirsiniz.", "warn");
            return;
          }
          state.compare.push(car);
          toast("Karşılaştırmaya eklendi.");
        }
        updateCompareUI();
        renderListings();
      });
    });
    $$("[data-detail]", root).forEach((btn) => {
      btn.addEventListener("click", () => openDetail(btn.dataset.detail));
    });
    $$("[data-showroom]", root).forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openShowroom(btn.dataset.showroom);
      });
    });
  }

  function renderListings() {
    const grid = $("#vehicle-grid");
    const countEl = $("#result-count");
    const list = filteredCars();
    if (countEl) countEl.textContent = `${list.length} araç bulundu`;
    if (!state.listingReady) return;
    if (!list.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">Filtrelere uygun araç bulunamadı. Filtreleri genişletmeyi deneyin.</div>`;
      return;
    }
    grid.innerHTML = list.map((c) => vehicleCardHTML(c)).join("");
    bindCardActions(grid);
    observeReveal();
  }

  function showSkeletons() {
    const grid = $("#vehicle-grid");
    grid.innerHTML = Array.from({ length: 8 }, () => `
      <div class="skeleton-card">
        <div class="sk sk-img"></div>
        <div class="sk sk-line w80"></div>
        <div class="sk sk-line w60"></div>
        <div class="sk sk-line w40"></div>
      </div>`).join("");
  }

  function renderCategories() {
    const grid = $("#cat-grid");
    grid.innerHTML = SK.CATEGORIES.map((cat) => `
      <button class="cat-card" type="button" data-cat="${cat.id}" aria-label="${cat.label}">
        <div class="cat-icon"><i class="fa-solid fa-${cat.icon}"></i></div>
        <span>${cat.label}</span>
      </button>`).join("");
    $$("[data-cat]", grid).forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = SK.CATEGORIES.find((c) => c.id === btn.dataset.cat);
        state.filters = { brand: "", model: "", yearMin: "", yearMax: "", priceMin: "", priceMax: "", fuel: "", transmission: "", bodyType: "", city: "", tag: "" };
        Object.assign(state.filters, cat.filter.tag ? { tag: cat.filter.tag } : cat.filter);
        syncFilterForm();
        renderListings();
        document.getElementById("one-cikanlar").scrollIntoView({ behavior: "smooth" });
        toast(`${cat.label} araçlar filtrelendi.`);
      });
    });
  }

  function renderGalleries() {
    const grid = $("#gallery-grid");
    grid.innerHTML = SK.GALLERIES.map((g) => `
      <article class="gallery-card reveal">
        <div class="g-logo" style="background:${g.color}">${g.initials}</div>
        <h3>${g.name}</h3>
        <div class="g-meta">${g.city} / ${g.district}</div>
        <div class="g-stats">
          <span><i class="fa-solid fa-car"></i> ${g.cars} araç</span>
          <span><i class="fa-solid fa-star" style="color:#F6A94A"></i> ${g.rating}</span>
          ${g.verified ? `<span class="badge badge-green"><i class="fa-solid fa-check"></i> Doğrulandı</span>` : ""}
        </div>
        <button class="btn btn-secondary btn-sm btn-block" type="button" data-gallery-profile="${g.id}">Profili Görüntüle</button>
      </article>`).join("");
    $$("[data-gallery-profile]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const g = getGallery(btn.dataset.galleryProfile);
        openModal("modal-generic", {
          title: g.name,
          body: `<p><strong>${g.city} / ${g.district}</strong></p>
            <p class="mt-1 text-muted">${g.cars} aktif ilan · ${g.rating} puan · KolayCheck™ doğrulanmış galeri</p>
            <div class="mt-2 flex gap-1 wrap">
              <button class="btn btn-primary" type="button" id="open-dealer-from-profile">Galeri Paneli (Demo)</button>
              <button class="btn btn-secondary" type="button" data-close-modal>Kapat</button>
            </div>`
        });
        $("#open-dealer-from-profile")?.addEventListener("click", () => {
          closeModal("modal-generic");
          openDealerPanel();
        });
      });
    });
  }

  function renderRecent() {
    const wrap = $("#recent-scroll");
    const ids = state.recentlyViewed.length ? state.recentlyViewed : ["c1", "c4", "c7", "c6"];
    const cars = ids.map((id) => SK.CARS.find((c) => c.id === id)).filter(Boolean);
    wrap.innerHTML = cars.map((c) => vehicleCardHTML(c)).join("");
    bindCardActions(wrap);
  }

  function renderTrending() {
    const wrap = $("#trend-scroll");
    const cars = SK.CARS.filter((c) => c.trendy).sort((a, b) => a.trendy - b.trendy).slice(0, 6);
    wrap.innerHTML = cars.map((c, i) => vehicleCardHTML(c, { rank: i + 1 })).join("");
    bindCardActions(wrap);
  }

  function renderPriceDrops() {
    const grid = $("#price-drop-grid");
    const cars = SK.CARS.filter((c) => c.oldPrice).slice(0, 4);
    grid.innerHTML = cars.map((c) => vehicleCardHTML(c)).join("");
    bindCardActions(grid);
  }

  function renderEV() {
    const grid = $("#ev-grid");
    const cars = SK.CARS.filter((c) => c.electric).slice(0, 3);
    grid.innerHTML = cars.map((c) => `
      <article class="ev-card reveal">
        <div class="vehicle-media">
          <div class="v-badges"><span class="badge badge-green"><i class="fa-solid fa-bolt"></i> Elektrikli</span></div>
          <button class="fav-btn ${state.favorites.has(c.id) ? "active" : ""}" type="button" data-fav="${c.id}" aria-label="Favori">
            <i class="${state.favorites.has(c.id) ? "fa-solid" : "fa-regular"} fa-heart"></i>
          </button>
          <img src="${c.image}" alt="${c.name}" loading="lazy">
        </div>
        <div class="vehicle-body">
          <h3>${c.name}</h3>
          <div class="price">${fmt(c.price)}</div>
        </div>
        <div class="ev-stats">
          <div><strong>${c.range} km</strong><span>Menzil</span></div>
          <div><strong>${c.charge || "—"}</strong><span>Şarj</span></div>
          <div><strong>${c.battery || "—"}</strong><span>Batarya</span></div>
          <div><strong>${c.horsepower} HP</strong><span>Güç</span></div>
        </div>
        <div style="padding:0 1rem 1rem">
          <button class="btn btn-primary btn-sm btn-block" type="button" data-detail="${c.id}">Aracı İncele</button>
        </div>
      </article>`).join("");
    bindCardActions(grid);
  }

  function syncFilterForm() {
    const f = state.filters;
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ""; };
    set("f-brand", f.brand);
    populateModels(f.brand, f.model);
    set("f-year-min", f.yearMin);
    set("f-year-max", f.yearMax);
    set("f-price-min", f.priceMin);
    set("f-price-max", f.priceMax);
    set("f-fuel", f.fuel);
    set("f-transmission", f.transmission);
    set("f-body", f.bodyType);
    set("f-city", f.city);
  }

  function populateModels(brand, selected = "") {
    const sel = $("#f-model");
    const valSel = $("#val-model");
    const models = brand && SK.BRANDS[brand] ? SK.BRANDS[brand] : [];
    const opts = `<option value="">Model</option>` + models.map((m) => `<option value="${m}" ${m === selected ? "selected" : ""}>${m}</option>`).join("");
    if (sel) sel.innerHTML = opts;
    if (valSel && brand) {
      valSel.innerHTML = `<option value="">Seçin</option>` + models.map((m) => `<option value="${m}">${m}</option>`).join("");
    }
  }

  function readFiltersFromForm() {
    state.filters.brand = $("#f-brand").value;
    state.filters.model = $("#f-model").value;
    state.filters.yearMin = $("#f-year-min").value;
    state.filters.yearMax = $("#f-year-max").value;
    state.filters.priceMin = $("#f-price-min").value;
    state.filters.priceMax = $("#f-price-max").value;
    state.filters.fuel = $("#f-fuel").value;
    state.filters.transmission = $("#f-transmission").value;
    state.filters.bodyType = $("#f-body").value;
    state.filters.city = $("#f-city")?.value || "";
    state.filters.tag = "";
  }

  /* ---------- Detail Modal ---------- */
  function openDetail(id) {
    const car = SK.CARS.find((c) => c.id === id);
    if (!car) return;
    state.currentCar = car;
    if (!state.recentlyViewed.includes(id)) {
      state.recentlyViewed.unshift(id);
      state.recentlyViewed = state.recentlyViewed.slice(0, 8);
      localStorage.setItem("sk_recent", JSON.stringify(state.recentlyViewed));
      renderRecent();
    }
    const g = getGallery(car.galleryId);
    const adv = ((car.marketPrice - car.price) / car.marketPrice * 100).toFixed(1);
    const markerPos = Math.max(8, Math.min(92, 50 - adv * 3));

    const body = `
      <div class="detail-grid">
        <div>
          <div class="showroom-mini" id="detail-viewer"></div>
          <div class="control-bar">
            <button type="button" data-dv="rotate"><i class="fa-solid fa-left-right"></i> Döndür</button>
            <button type="button" data-dv="zoom"><i class="fa-solid fa-magnifying-glass-plus"></i> Yaklaştır</button>
            <button type="button" data-showroom="${car.id}"><i class="fa-solid fa-expand"></i> Kolay360™</button>
            <button type="button" data-dv="interior"><i class="fa-solid fa-couch"></i> İç Mekan</button>
            <button type="button" data-dv="fs"><i class="fa-solid fa-up-right-and-down-left-from-center"></i> Tam Ekran</button>
          </div>
          <div class="color-swatches" id="color-swatches">
            ${SK.COLORS.map((c, i) => `<button class="swatch ${i === 0 ? "active" : ""}" type="button" style="background:${c.hex}" data-color="${c.hex}" aria-label="${c.name}" title="${c.name}"></button>`).join("")}
          </div>
          <div class="hotspots">
            ${["Motor", "Jant", "Far", "Bagaj", "İç Mekan"].map((h) => `<button class="hotspot-btn" type="button" data-hotspot="${h}">${h}</button>`).join("")}
          </div>
          <div id="hotspot-info" class="badge" style="display:none"></div>

          <div class="mt-2">
            <h3>KolayCheck™ Ekspertiz Durumu</h3>
            <div class="expertise-wrap">
              <div>
                <div class="car-schema">${expertiseSVG(car)}</div>
                <div class="legend">
                  ${Object.entries(SK.EXPERTISE_LABELS).map(([k, v]) => `<span><i style="background:${v.color}"></i>${v.label}</span>`).join("")}
                </div>
                <div class="mt-2">
                  <div class="flex between center"><strong>Araç Durumu</strong><span>%${car.condition} Kondisyon</span></div>
                  <div class="bar mt-1"><i style="width:${car.condition}%"></i></div>
                </div>
              </div>
              <div class="tramer-grid">
                <div class="tramer-card"><small>Tramer Kaydı</small><strong>${car.tramer ? fmt(car.tramer) : "Yok"}</strong></div>
                <div class="tramer-card"><small>Değişen Parça</small><strong>${car.replaced}</strong></div>
                <div class="tramer-card"><small>Boyalı Parça</small><strong>${car.painted}</strong></div>
                <div class="tramer-card"><small>Ağır Hasar</small><strong style="color:var(--success)">Yok</strong></div>
              </div>
            </div>
          </div>

          <div class="mt-2">
            <h3>Teknik Özellikler</h3>
            <div class="tech-grid">
              ${[
                ["Motor", car.engine], ["Güç", car.horsepower + " HP"], ["Tork", car.torque],
                ["Çekiş", car.drive], ["0–100", car.accel], ["Ortalama Tüketim", car.consumption],
                ["Bagaj", car.trunk], ["Garanti", car.warranty]
              ].map(([k, v]) => `<div class="tech-item"><small>${k}</small><strong>${v}</strong></div>`).join("")}
            </div>
          </div>

          <div class="mt-2">
            <h3>Donanımlar</h3>
            <div class="accordion mt-1">
              ${["security:Güvenlik", "comfort:Konfor", "multimedia:Multimedya"].map((pair) => {
                const [key, label] = pair.split(":");
                return `<div class="acc-item">
                  <button class="acc-btn" type="button">${label}<i class="fa-solid fa-chevron-down"></i></button>
                  <ul class="acc-panel">${car.features[key].map((f) => `<li><i class="fa-solid fa-check"></i>${f}</li>`).join("")}</ul>
                </div>`;
              }).join("")}
            </div>
          </div>

          <div class="mt-2">
            <h3>Konum</h3>
            <div class="map-box mt-1">
              <iframe loading="lazy" title="Harita" src="https://www.openstreetmap.org/export/embed.html?bbox=28.85%2C40.97%2C28.95%2C41.02&layer=mapnik&marker=40.99%2C28.90"></iframe>
              <div class="map-label">${g.name}<br>${g.district} / ${g.city}</div>
            </div>
          </div>
        </div>

        <div>
          <div class="badge">${car.brand}</div>
          <h2 style="margin-top:0.5rem">${car.name}</h2>
          <p class="text-muted mt-1">${car.year} | ${car.fuel} | ${car.transmission} | ${fmtKm(car.km)}</p>
          <div class="detail-price">${fmt(car.price)}</div>
          <p class="text-muted">${g.name} · ${car.city} / ${car.district}</p>

          <div class="detail-actions">
            <button class="btn btn-primary" type="button" data-action="call"><i class="fa-solid fa-phone"></i> Galeriyi Ara</button>
            <button class="btn btn-whatsapp" type="button" data-action="wa"><i class="fa-brands fa-whatsapp"></i> WhatsApp</button>
            <button class="btn btn-secondary" type="button" data-action="offer"><i class="fa-solid fa-hand-holding-dollar"></i> Teklif Ver</button>
            <button class="btn btn-ghost" type="button" data-action="fav"><i class="fa-regular fa-heart"></i> Favorilere Ekle</button>
          </div>
          <button class="btn btn-secondary btn-block" type="button" data-action="testdrive"><i class="fa-solid fa-calendar-check"></i> Test Sürüşü Planla</button>

          <div class="kolay-score-box">
            <div class="flex between center">
              <div>
                <div class="badge">KOLAYSKOR™</div>
                <div class="score-big mt-1">${car.kolayScore} <small style="font-size:1rem;color:#5a7385">/ 100</small></div>
              </div>
              <i class="fa-solid fa-gauge-high" style="font-size:2rem;color:var(--accent);opacity:.5"></i>
            </div>
            <div class="score-bars">
              ${scoreRows(car).map(([l, v]) => `
                <div class="score-row"><span>${l}</span><div class="bar"><i style="width:${v}%"></i></div><span>${v}</span></div>`).join("")}
            </div>
            <p class="mt-1 text-muted" style="font-size:0.85rem;font-weight:600">Benzer araçların %${Math.min(97, car.kolayScore - 4)}'inden daha avantajlı.</p>
          </div>

          <div class="kolay-fiyat">
            <div class="flex between center">
              <strong>KolayFiyat™</strong>
              <span class="badge badge-green">Piyasadan %${adv} daha avantajlı</span>
            </div>
            <div class="fiyat-track"><div class="fiyat-marker" style="left:${markerPos}%"></div></div>
            <div class="flex between" style="font-size:0.8rem;font-weight:600;color:#5a7385">
              <span>Düşük</span><span>Piyasa</span><span>Yüksek</span>
            </div>
            <div class="mt-1 flex between">
              <div><small class="text-muted">Araç</small><div style="font-weight:700;color:var(--price)">${fmt(car.price)}</div></div>
              <div style="text-align:right"><small class="text-muted">Piyasa Ort.</small><div style="font-weight:700">${fmt(car.marketPrice)}</div></div>
            </div>
          </div>

          <div class="finance-box">
            <h3>Finansman Hesaplama</h3>
            <div class="range-field">
              <div class="vals"><span>Peşinat</span><span id="fin-down-label">${fmt(Math.round(car.price * 0.3))}</span></div>
              <input type="range" id="fin-down" min="10" max="70" value="30" aria-label="Peşinat oranı">
            </div>
            <div class="range-field">
              <div class="vals"><span>Vade (ay)</span><span id="fin-term-label">36</span></div>
              <input type="range" id="fin-term" min="12" max="60" step="6" value="36" aria-label="Vade">
            </div>
            <div class="range-field">
              <div class="vals"><span>Faiz oranı</span><span id="fin-rate-label">%2.89</span></div>
              <input type="range" id="fin-rate" min="1.5" max="4.5" step="0.01" value="2.89" aria-label="Faiz">
            </div>
            <div class="text-muted" style="font-size:0.85rem;font-weight:600">Aylık ödeme</div>
            <div class="result" id="fin-result">—</div>
          </div>
        </div>
      </div>`;

    openModal("modal-detail", { title: "Araç Detayı", body, large: true });
    lazyInitDetailViewer(car);

    $$("#color-swatches .swatch").forEach((s) => {
      s.addEventListener("click", () => {
        $$("#color-swatches .swatch").forEach((x) => x.classList.remove("active"));
        s.classList.add("active");
        state.detailViewer?.setColor(s.dataset.color);
        toast(`Renk: ${s.getAttribute("title")}`);
      });
    });

    $$("[data-hotspot]").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$("[data-hotspot]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const info = $("#hotspot-info");
        const texts = {
          Motor: `${car.engine} · ${car.horsepower} HP · ${car.torque}`,
          Jant: "19\" alaşım jant · Performans lastik",
          Far: "LED Matrix far · Adaptif aydınlatma",
          Bagaj: `${car.trunk} bagaj hacmi`,
          "İç Mekan": "Deri döşeme · Dijital kokpit · Ambient ışık"
        };
        info.style.display = "inline-flex";
        info.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${texts[btn.dataset.hotspot]}`;
      });
    });

    $$(".acc-btn").forEach((btn) => {
      btn.addEventListener("click", () => btn.parentElement.classList.toggle("open"));
    });

    $$("[data-dv]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const a = btn.dataset.dv;
        if (a === "rotate") { state.detailViewer?.setAutoRotate(true); toast("Otomatik döndürme açık"); }
        if (a === "zoom") { state.detailViewer?.zoomIn(); }
        if (a === "interior") toast("3D demo: İç mekan görünümüne geçiliyor");
        if (a === "fs") openShowroom(car.id);
      });
    });

    $$("[data-showroom]").forEach((btn) => btn.addEventListener("click", () => openShowroom(btn.dataset.showroom)));

    $$("[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const a = btn.dataset.action;
        if (a === "call") openModal("modal-generic", { title: "Galeriyi Ara", body: `<p><strong>${g.name}</strong></p><p class="mt-1">Demo numara: <strong>0212 555 0${Math.floor(Math.random()*900+100)}</strong></p><p class="text-muted mt-1">Gerçek arama yapılmaz.</p><button class="btn btn-primary mt-2" data-close-modal>Tamam</button>` });
        if (a === "wa") openModal("modal-generic", { title: "WhatsApp", body: `<p>${g.name} ile WhatsApp üzerinden iletişime geçilecek.</p><p class="mt-1 text-muted">Demo: Mesaj şablonu hazırlandı.</p><button class="btn btn-whatsapp mt-2" data-close-modal><i class="fa-brands fa-whatsapp"></i> Gönderildi</button>` });
        if (a === "offer") openOfferModal(car);
        if (a === "fav") {
          state.favorites.add(car.id); saveFavs(); toast(`${car.name} favorilerine eklendi.`);
        }
        if (a === "testdrive") openTestDrive(car);
      });
    });

    setupFinance(car);
  }

  function scoreRows(car) {
    const priceScore = Math.min(99, Math.round(70 + ((car.marketPrice - car.price) / car.marketPrice) * 100));
    const kmScore = Math.min(99, Math.round(95 - car.km / 5000));
    const cond = car.condition;
    const equip = Math.min(99, 80 + car.features.security.length + car.features.comfort.length);
    const market = Math.min(99, Math.round(car.kolayScore - 1));
    return [["Fiyat", priceScore], ["Kondisyon", cond], ["KM", kmScore], ["Donanım", equip], ["Piyasa Avantajı", market]];
  }

  function expertiseSVG(car) {
    const m = car.expertiseMap;
    const col = (k) => SK.EXPERTISE_LABELS[m[k]]?.color || "#37B878";
    return `<svg class="schema-svg" viewBox="0 0 360 180" xmlns="http://www.w3.org/2000/svg" aria-label="Ekspertiz şeması">
      <rect x="70" y="40" width="220" height="90" rx="18" fill="#fff" stroke="#d5e0e7"/>
      <rect x="120" y="28" width="120" height="28" rx="8" fill="${col("roof")}" opacity="0.85"/>
      <rect x="95" y="55" width="70" height="30" rx="6" fill="${col("hood")}" opacity="0.9"/>
      <rect x="195" y="55" width="70" height="30" rx="6" fill="${col("trunk")}" opacity="0.9"/>
      <rect x="55" y="55" width="28" height="35" rx="6" fill="${col("frontLeftFender")}"/>
      <rect x="277" y="55" width="28" height="35" rx="6" fill="${col("frontRightFender")}"/>
      <rect x="85" y="95" width="50" height="28" rx="6" fill="${col("frontLeftDoor")}"/>
      <rect x="140" y="95" width="50" height="28" rx="6" fill="${col("rearLeftDoor")}"/>
      <rect x="195" y="95" width="50" height="28" rx="6" fill="${col("frontRightDoor")}"/>
      <rect x="250" y="95" width="40" height="28" rx="6" fill="${col("rearRightDoor")}"/>
      <circle cx="100" cy="140" r="14" fill="#173042"/><circle cx="260" cy="140" r="14" fill="#173042"/>
      <text x="180" y="170" text-anchor="middle" font-size="11" fill="#5a7385" font-family="Quicksand">KolayCheck™ Kaporta Haritası</text>
    </svg>`;
  }

  function setupFinance(car) {
    const calc = () => {
      const downPct = +$("#fin-down").value;
      const term = +$("#fin-term").value;
      const rate = +$("#fin-rate").value;
      const down = Math.round(car.price * downPct / 100);
      const principal = car.price - down;
      const monthlyRate = rate / 100;
      const payment = monthlyRate === 0 ? principal / term :
        principal * monthlyRate * Math.pow(1 + monthlyRate, term) / (Math.pow(1 + monthlyRate, term) - 1);
      $("#fin-down-label").textContent = fmt(down);
      $("#fin-term-label").textContent = term;
      $("#fin-rate-label").textContent = "%" + rate.toFixed(2);
      $("#fin-result").textContent = fmt(Math.round(payment));
    };
    ["fin-down", "fin-term", "fin-rate"].forEach((id) => $("#" + id).addEventListener("input", calc));
    calc();
  }

  function lazyInitDetailViewer(car) {
    const color = SK.COLORS[0].hex;
    requestAnimationFrame(() => {
      if (state.detailViewer) state.detailViewer.destroy();
      state.detailViewer = new SK.CarViewer("#detail-viewer", { autoRotate: true, color });
    });
  }

  /* ---------- Showroom ---------- */
  function openShowroom(id) {
    const car = SK.CARS.find((c) => c.id === id) || state.currentCar;
    if (!car) return;
    const fs = $("#showroom-fs");
    $("#sr-title").textContent = car.name;
    $("#sr-price").textContent = fmt(car.price);
    $("#sr-meta").textContent = `${car.year} · ${car.fuel} · ${fmtKm(car.km)}`;
    $("#sr-colors").innerHTML = SK.COLORS.map((c, i) =>
      `<button class="swatch ${i === 0 ? "active" : ""}" type="button" style="background:${c.hex}" data-color="${c.hex}" title="${c.name}" aria-label="${c.name}"></button>`
    ).join("");
    fs.classList.add("open");
    document.body.style.overflow = "hidden";
    if (state.showroomViewer) state.showroomViewer.destroy();
    state.showroomViewer = new SK.CarViewer("#sr-viewer", { autoRotate: true, color: SK.COLORS[0].hex });

    $$("#sr-colors .swatch").forEach((s) => {
      s.addEventListener("click", () => {
        $$("#sr-colors .swatch").forEach((x) => x.classList.remove("active"));
        s.classList.add("active");
        state.showroomViewer?.setColor(s.dataset.color);
      });
    });
  }

  function closeShowroom() {
    $("#showroom-fs").classList.remove("open");
    document.body.style.overflow = "";
    if (state.showroomViewer) { state.showroomViewer.destroy(); state.showroomViewer = null; }
  }

  /* ---------- Modals helpers ---------- */
  function openModal(id, { title, body, large } = {}) {
    const root = document.getElementById(id);
    if (!root) return;
    if (title) root.querySelector("[data-modal-title]").textContent = title;
    if (body) root.querySelector("[data-modal-body]").innerHTML = body;
    if (large !== undefined) root.querySelector(".modal").classList.toggle("modal-lg", large);
    root.classList.add("open");
    document.body.style.overflow = "hidden";
    root.querySelectorAll("[data-close-modal]").forEach((b) => b.addEventListener("click", () => closeModal(id)));
  }

  function closeModal(id) {
    const root = document.getElementById(id);
    if (!root) return;
    root.classList.remove("open");
    if (![...$$(".modal-root.open")].length && !$("#showroom-fs").classList.contains("open") && !$("#dealer-panel").classList.contains("open")) {
      document.body.style.overflow = "";
    }
    if (id === "modal-detail" && state.detailViewer) {
      state.detailViewer.destroy();
      state.detailViewer = null;
    }
  }

  function openOfferModal(car) {
    openModal("modal-generic", {
      title: "Teklif Ver",
      body: `<div class="field"><label>Teklif tutarı (₺)</label><input type="number" id="offer-amount" value="${Math.round(car.price * 0.95)}"></div>
        <div class="field mt-1"><label>Mesaj</label><textarea id="offer-msg" rows="3">Merhaba, ${car.name} için teklif vermek istiyorum.</textarea></div>
        <button class="btn btn-primary btn-block mt-2" type="button" id="send-offer">Teklifi Gönder</button>`
    });
    $("#send-offer").addEventListener("click", () => {
      closeModal("modal-generic");
      toast("Teklif talebin galeriye gönderildi.");
    });
  }

  function openTestDrive(car) {
    openModal("modal-generic", {
      title: "Test Sürüşü Planla",
      body: `<p class="text-muted mb-2">${car.name}</p>
        <div class="val-form">
          <div class="field"><label>Tarih</label><input type="date" id="td-date"></div>
          <div class="field"><label>Saat</label><select id="td-time"><option>10:00</option><option>11:30</option><option>14:00</option><option>16:00</option><option>18:00</option></select></div>
          <div class="field"><label>Ad Soyad</label><input type="text" id="td-name" placeholder="Adınız"></div>
          <div class="field"><label>Telefon</label><input type="tel" id="td-phone" placeholder="05xx xxx xx xx"></div>
        </div>
        <button class="btn btn-primary btn-block mt-2" type="button" id="td-submit">Randevu Oluştur</button>`
    });
    const d = new Date(); d.setDate(d.getDate() + 1);
    $("#td-date").value = d.toISOString().slice(0, 10);
    $("#td-submit").addEventListener("click", () => {
      closeModal("modal-generic");
      openModal("modal-generic", {
        title: "Randevu Oluşturuldu",
        body: `<div style="text-align:center;padding:1rem 0">
          <div style="width:64px;height:64px;border-radius:50%;background:rgba(55,184,120,.15);color:var(--success);display:grid;place-items:center;margin:0 auto 1rem;font-size:1.6rem"><i class="fa-solid fa-check"></i></div>
          <p><strong>Test sürüşü randevun hazır.</strong></p>
          <p class="text-muted mt-1">Galeri onayından sonra bilgilendirileceksin.</p>
          <button class="btn btn-primary mt-2" data-close-modal>Harika</button>
        </div>`
      });
    });
  }

  /* ---------- Compare ---------- */
  function openCompare() {
    if (state.compare.length < 2) {
      toast("Karşılaştırmak için en az 2 araç seçin.", "warn");
      return;
    }
    const cars = state.compare;
    const rows = [
      ["Fiyat", (c) => c.price, true, (c) => fmt(c.price)],
      ["Yıl", (c) => c.year, false, (c) => c.year],
      ["Kilometre", (c) => c.km, true, (c) => fmtKm(c.km)],
      ["Motor", (c) => c.engine, null, (c) => c.engine],
      ["Beygir", (c) => c.horsepower, false, (c) => c.horsepower + " HP"],
      ["Yakıt", (c) => c.fuel, null, (c) => c.fuel],
      ["Tüketim", (c) => parseFloat(c.consumption), true, (c) => c.consumption],
      ["Bagaj", (c) => parseInt(c.trunk), false, (c) => c.trunk],
      ["Garanti", (c) => c.warranty, null, (c) => c.warranty],
      ["KolaySkor™", (c) => c.kolayScore, false, (c) => c.kolayScore],
      ["Donanım", (c) => c.features.security.length + c.features.comfort.length, false, (c) => (c.features.security.length + c.features.comfort.length) + " madde"]
    ];
    const head = `<tr><th>Özellik</th>${cars.map((c) => `<th>${c.brand}<br><small>${c.model}</small></th>`).join("")}</tr>`;
    const body = rows.map(([label, getter, lowerBetter, display]) => {
      const vals = cars.map(getter);
      let bestIdx = -1;
      if (lowerBetter === true) bestIdx = vals.indexOf(Math.min(...vals.map(Number)));
      if (lowerBetter === false) bestIdx = vals.indexOf(Math.max(...vals.map(Number)));
      return `<tr><td>${label}</td>${cars.map((c, i) => `<td><span class="${i === bestIdx ? "best" : ""}">${display(c)}</span></td>`).join("")}</tr>`;
    }).join("");
    openModal("modal-generic", {
      title: "Araç Karşılaştırma",
      large: true,
      body: `<div style="overflow:auto"><table class="compare-table"><thead>${head}</thead><tbody>${body}</tbody></table></div>
        <p class="mt-1 text-muted" style="font-size:0.85rem">Yeşil vurgular avantajlı değerleri gösterir.</p>`
    });
  }

  /* ---------- AI ---------- */
  function setupAI() {
    const panel = $("#ai-panel");
    $("#ai-fab").addEventListener("click", () => panel.classList.toggle("open"));
    $("#ai-close").addEventListener("click", () => panel.classList.remove("open"));
    const send = () => {
      const input = $("#ai-input");
      const text = input.value.trim();
      if (!text) return;
      appendAIMsg(text, "user");
      input.value = "";
      setTimeout(() => {
        const sug = SK.CARS.filter((c) => c.tags.includes("suv") && c.price <= 2500000 && c.transmission === "Otomatik").slice(0, 3);
        appendAIMsg("Sana uygun 23 araç buldum. Yakıt ekonomisi ve fiyat/performans açısından Peugeot 3008, Volkswagen Tiguan ve Hyundai Tucson öne çıkıyor.", "bot");
        const wrap = document.createElement("div");
        wrap.className = "ai-suggestions";
        wrap.innerHTML = sug.map((c) => `<div class="ai-sug-card" data-detail="${c.id}"><span>${c.name}</span><span style="color:var(--price)">${fmt(c.price)}</span></div>`).join("");
        $("#ai-body").appendChild(wrap);
        bindCardActions(wrap);
        $("#ai-body").scrollTop = $("#ai-body").scrollHeight;
      }, 500);
    };
    $("#ai-send").addEventListener("click", send);
    $("#ai-input").addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
  }

  function appendAIMsg(text, who) {
    const el = document.createElement("div");
    el.className = `ai-msg ${who}`;
    el.textContent = text;
    $("#ai-body").appendChild(el);
    $("#ai-body").scrollTop = $("#ai-body").scrollHeight;
  }

  /* ---------- Valuation ---------- */
  function setupValuation() {
    $("#val-brand").innerHTML = `<option value="">Marka</option>` + Object.keys(SK.BRANDS).map((b) => `<option>${b}</option>`).join("");
    $("#val-brand").addEventListener("change", () => populateModels($("#val-brand").value));
    $("#val-calc").addEventListener("click", () => {
      const brand = $("#val-brand").value;
      const year = +$("#val-year").value || 2022;
      const km = +$("#val-km").value || 50000;
      const damage = $("#val-damage").value;
      if (!brand) { toast("Lütfen marka seçin.", "warn"); return; }
      const base = 1800000 + (year - 2018) * 120000 - km * 8;
      const mult = { yok: 1, lokal: 0.96, boyali: 0.92, degisen: 0.85, agir: 0.7 }[damage] || 1;
      const mid = Math.round(base * mult / 1000) * 1000;
      const low = mid - 60000;
      const high = mid + 55000;
      const box = $("#val-result-box");
      box.innerHTML = `<div class="badge">Tahmini Piyasa Değeri</div>
        <div class="price-big">${fmt(low)} – ${fmt(high)}</div>
        <p class="text-muted">SatışKolay AI tarafından piyasa verilerine göre hesaplanmıştır.</p>
        <div class="mt-2 flex gap-1 wrap">
          <button class="btn btn-primary" type="button" id="go-sell">Ücretsiz İlan Oluştur</button>
        </div>`;
      box.style.animation = "fadeUp 0.4s ease";
      $("#go-sell")?.addEventListener("click", () => {
        document.getElementById("aracimi-sat").scrollIntoView({ behavior: "smooth" });
        toast("İlan oluşturma adımlarına geçebilirsin.");
      });
    });
  }

  /* ---------- Dealer Panel ---------- */
  function openDealerPanel() {
    const panel = $("#dealer-panel");
    panel.classList.add("open");
    document.body.style.overflow = "hidden";
    showDealerView("dashboard");
  }

  function showDealerView(view) {
    $$("#dealer-nav .nav-item").forEach((a) => a.classList.toggle("active", a.dataset.view === view));
    const main = $("#dealer-main");
    if (view === "dashboard") {
      main.innerHTML = `
        <div class="flex between center wrap gap-1">
          <div>
            <button class="btn btn-ghost btn-sm" type="button" id="dealer-menu-btn" aria-label="Menü"><i class="fa-solid fa-bars"></i></button>
            <h2 style="display:inline">Günaydın, Premium Motors 👋</h2>
            <p class="text-muted">Galeri performans özeti</p>
          </div>
          <button class="btn btn-secondary btn-sm" type="button" id="close-dealer">Çıkış</button>
        </div>
        <div class="dash-cards">
          <div class="dash-card"><small>Aktif İlan</small><strong>48</strong></div>
          <div class="dash-card"><small>Bu Ay Lead</small><strong>327</strong></div>
          <div class="dash-card"><small>Favoriye Eklenme</small><strong>1.248</strong></div>
          <div class="dash-card"><small>Satış</small><strong>19</strong></div>
          <div class="dash-card"><small>Satış Hacmi</small><strong>₺44.870.000</strong></div>
        </div>
        <div class="charts">
          <div class="chart-card">
            <h3>Son 30 Gün İlan Görüntülenme</h3>
            <div class="fake-chart">${[40,55,48,70,62,80,75,90,68,85,95,88,92,78,96].map((h) => `<i style="height:${h}%"></i>`).join("")}</div>
          </div>
          <div class="chart-card">
            <h3>Satış Dönüşüm Oranı</h3>
            <div class="score-big mt-2" style="color:var(--secondary)">4.8%</div>
            <p class="text-muted mt-1">Geçen aya göre +0.6 puan</p>
            <h3 class="mt-2">En Popüler Araçlar</h3>
            <ul class="mt-1" style="display:grid;gap:0.4rem;font-weight:600;font-size:0.9rem">
              <li>1. BMW 320i M Sport</li>
              <li>2. VW Tiguan Elegance</li>
              <li>3. TOGG T10X</li>
            </ul>
          </div>
        </div>`;
      $("#close-dealer").addEventListener("click", () => {
        $("#dealer-panel").classList.remove("open");
        document.body.style.overflow = "";
      });
      $("#dealer-menu-btn")?.addEventListener("click", () => $("#dealer-panel").classList.toggle("side-open"));
    } else if (view === "add") {
      state.wizardStep = 1;
      renderWizard();
    } else if (view === "cars") {
      main.innerHTML = `<h2>Araçlarım</h2><div class="vehicle-grid mt-2" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr))">${SK.CARS.filter(c=>c.galleryId==="g1").map(c=>vehicleCardHTML(c)).join("")}</div>`;
      bindCardActions(main);
    } else {
      const labels = {
        listings: "İlan Yönetimi", offers: "Teklifler", messages: "Mesajlar", customers: "Müşteriler",
        sales: "Satışlar", reservations: "Rezervasyonlar", finance: "Finansman Talepleri", testdrives: "Test Sürüşleri",
        performance: "Performans", views: "İlan Görüntülenme", favs: "Favoriler", leads: "Lead Raporları",
        conversion: "Dönüşüm", package: "Paketim", billing: "Faturalandırma", users: "Kullanıcılar", settings: "Ayarlar"
      };
      main.innerHTML = `<h2>${labels[view] || view}</h2>
        <div class="chart-card mt-2">
          <p class="text-muted">Demo görünüm: <strong>${labels[view] || view}</strong> modülü.</p>
          <p class="mt-1">Bu alanda gerçek SaaS verileri ve tablolar yer alacaktır.</p>
          <button class="btn btn-primary mt-2" type="button" data-view="dashboard">Dashboard'a Dön</button>
        </div>`;
      main.querySelector("[data-view]")?.addEventListener("click", () => showDealerView("dashboard"));
    }
  }

  function renderWizard() {
    const steps = ["Araç Bilgileri", "Teknik Özellikler", "Ekspertiz", "Görseller", "360° Model", "Fiyatlandırma", "Yayınla"];
    const step = state.wizardStep;
    const main = $("#dealer-main");
    let content = "";
    if (step === 1) content = `<div class="val-form">
      <div class="field"><label>Marka</label><select><option>BMW</option><option>Mercedes-Benz</option><option>TOGG</option></select></div>
      <div class="field"><label>Model</label><input value="320i M Sport"></div>
      <div class="field"><label>Yıl</label><input type="number" value="2024"></div>
      <div class="field"><label>KM</label><input type="number" value="12000"></div>
    </div>`;
    if (step === 2) content = `<div class="val-form">
      <div class="field"><label>Motor</label><input value="2.0 Turbo"></div>
      <div class="field"><label>Güç</label><input value="184 HP"></div>
      <div class="field"><label>Yakıt</label><select><option>Benzin</option><option>Dizel</option><option>Elektrik</option></select></div>
      <div class="field"><label>Vites</label><select><option>Otomatik</option><option>Manuel</option></select></div>
    </div>`;
    if (step === 3) content = `<p class="text-muted">KolayCheck™ ekspertiz bilgilerini girin.</p>
      <div class="tramer-grid mt-1">
        <div class="field"><label>Tramer</label><input value="0"></div>
        <div class="field"><label>Boyalı parça</label><input value="0"></div>
        <div class="field"><label>Değişen</label><input value="0"></div>
        <div class="field"><label>Kondisyon %</label><input value="95"></div>
      </div>`;
    if (step === 4) content = `<div class="dropzone" id="dropzone"><i class="fa-solid fa-cloud-arrow-up" style="font-size:2rem;color:var(--accent)"></i>
      <p class="mt-1" style="font-weight:700">Araç fotoğraflarını buraya sürükle</p>
      <p class="text-muted">veya tıklayarak seç (demo)</p>
      <div class="upload-progress"><i id="up-bar"></i></div>
      <p id="up-text" class="mt-1 text-muted" style="font-size:0.85rem"></p></div>`;
    if (step === 5) content = `<div class="charts" style="grid-template-columns:1fr 1fr">
      <div class="chart-card"><h3>Fotoğraf Serisi</h3><p class="text-muted mt-1">36–72 adet araç fotoğrafı yükle</p>
        <button class="btn btn-secondary mt-2" type="button" id="up-360-photos">Yüklemeyi Simüle Et</button>
        <div class="upload-progress"><i id="bar-360"></i></div></div>
      <div class="chart-card"><h3>3D Model</h3><p class="text-muted mt-1">GLB / GLTF model yükle</p>
        <button class="btn btn-secondary mt-2" type="button" id="up-glb">GLB Yükle (Demo)</button>
        <div class="upload-progress"><i id="bar-glb"></i></div></div>
    </div>`;
    if (step === 6) content = `<div class="val-form">
      <div class="field"><label>İlan Fiyatı</label><input type="number" value="3245000"></div>
      <div class="field"><label>Piyasa Referansı</label><input value="KolayFiyat™: ₺3.420.000" disabled></div>
    </div>`;
    if (step === 7) content = `<div style="text-align:center;padding:1.5rem">
      <div style="width:72px;height:72px;border-radius:50%;background:rgba(55,184,120,.15);color:var(--success);display:grid;place-items:center;margin:0 auto 1rem;font-size:1.8rem"><i class="fa-solid fa-rocket"></i></div>
      <h3>İlan yayınlanmaya hazır</h3>
      <p class="text-muted mt-1">Kolay360™, KolayCheck™ ve KolaySkor™ otomatik eklenecek.</p>
    </div>`;

    main.innerHTML = `
      <div class="flex between center wrap gap-1 mb-2">
        <h2>Yeni Araç Ekle</h2>
        <button class="btn btn-secondary btn-sm" type="button" id="close-dealer">Kapat</button>
      </div>
      <div class="wizard-steps">${steps.map((s, i) => `<span class="${i + 1 === step ? "active" : ""} ${i + 1 < step ? "done" : ""}">${i + 1}. ${s}</span>`).join("")}</div>
      <div class="chart-card">${content}</div>
      <div class="flex gap-1 mt-2">
        ${step > 1 ? `<button class="btn btn-secondary" type="button" id="wiz-prev">Geri</button>` : ""}
        <button class="btn btn-primary" type="button" id="wiz-next">${step === 7 ? "Yayınla" : "Devam"}</button>
      </div>`;

    $("#close-dealer")?.addEventListener("click", () => {
      $("#dealer-panel").classList.remove("open");
      document.body.style.overflow = "";
    });
    $("#wiz-prev")?.addEventListener("click", () => { state.wizardStep--; renderWizard(); });
    $("#wiz-next")?.addEventListener("click", () => {
      if (step === 7) {
        toast("İlan yayınlandı (demo).");
        showDealerView("dashboard");
        return;
      }
      state.wizardStep++;
      renderWizard();
    });

    const dz = $("#dropzone");
    if (dz) {
      const simulate = () => {
        let p = 0;
        const bar = $("#up-bar");
        const t = setInterval(() => {
          p += 12;
          bar.style.width = Math.min(p, 100) + "%";
          $("#up-text").textContent = p >= 100 ? "8 fotoğraf yüklendi · Ana fotoğraf seçildi" : `Yükleniyor… %${p}`;
          if (p >= 100) clearInterval(t);
        }, 120);
      };
      dz.addEventListener("click", simulate);
      dz.addEventListener("dragover", (e) => { e.preventDefault(); dz.classList.add("dragover"); });
      dz.addEventListener("dragleave", () => dz.classList.remove("dragover"));
      dz.addEventListener("drop", (e) => { e.preventDefault(); dz.classList.remove("dragover"); simulate(); });
    }
    const simBar = (btnId, barId, done) => {
      $(btnId)?.addEventListener("click", () => {
        let p = 0;
        const bar = $(barId);
        const t = setInterval(() => {
          p += 10; bar.style.width = Math.min(p, 100) + "%";
          if (p >= 100) { clearInterval(t); toast(done); }
        }, 100);
      });
    };
    simBar("#up-360-photos", "#bar-360", "360° fotoğraf serisi yüklendi.");
    simBar("#up-glb", "#bar-glb", "3D model yüklendi.");
  }

  /* ---------- Auth / Profile / Notifs ---------- */
  function setupHeaderUI() {
    const header = $(".site-header");
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 20);
    }, { passive: true });

    $("#menu-toggle").addEventListener("click", () => $("#mobile-nav").classList.add("open"));
    $("#mobile-nav").addEventListener("click", (e) => {
      if (e.target.id === "mobile-nav" || e.target.closest("[data-close-mobile]")) $("#mobile-nav").classList.remove("open");
    });

    $("#btn-login").addEventListener("click", () => {
      openModal("modal-generic", {
        title: "Giriş Yap",
        body: `<div class="field"><label>E-posta</label><input type="email" placeholder="ornek@mail.com"></div>
          <div class="field mt-1"><label>Şifre</label><input type="password" placeholder="••••••••"></div>
          <button class="btn btn-primary btn-block mt-2" type="button" id="do-login">Giriş Yap</button>
          <button class="btn btn-secondary btn-block mt-1" type="button" id="do-dealer">Galeri Girişi</button>`
      });
      $("#do-login").addEventListener("click", () => { closeModal("modal-generic"); toast("Demo hesabına giriş yapıldı."); });
      $("#do-dealer").addEventListener("click", () => { closeModal("modal-generic"); openDealerPanel(); });
    });

    $("#btn-post").addEventListener("click", () => {
      document.getElementById("aracimi-sat").scrollIntoView({ behavior: "smooth" });
      toast("Ücretsiz ilan oluşturma bölümüne yönlendirildin.");
    });

    $("#btn-notif").addEventListener("click", (e) => {
      e.stopPropagation();
      $("#notif-dropdown").classList.toggle("open");
      $("#profile-menu").classList.remove("open");
    });

    $("#btn-profile").addEventListener("click", (e) => {
      e.stopPropagation();
      $("#profile-menu").classList.toggle("open");
      $("#notif-dropdown").classList.remove("open");
    });

    document.addEventListener("click", () => {
      $("#notif-dropdown")?.classList.remove("open");
      $("#profile-menu")?.classList.remove("open");
    });

    $("#btn-favorites-nav").addEventListener("click", () => {
      const favCars = SK.CARS.filter((c) => state.favorites.has(c.id));
      openModal("modal-generic", {
        title: "Favorilerim",
        large: true,
        body: favCars.length
          ? `<div class="vehicle-grid">${favCars.map((c) => vehicleCardHTML(c)).join("")}</div>`
          : `<div class="empty-state">Henüz favori aracın yok.</div>`
      });
      bindCardActions($("#modal-generic"));
    });

    $("#btn-compare-nav").addEventListener("click", () => {
      if (state.compare.length) openCompare();
      else toast("Karşılaştırma listen boş. Araç kartlarından ekleyebilirsin.", "warn");
    });

    $("#theme-toggle").addEventListener("click", () => {
      state.theme = state.theme === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", state.theme === "dark" ? "dark" : "light");
      localStorage.setItem("sk_theme", state.theme);
      toast(state.theme === "dark" ? "Koyu tema (bonus)" : "Açık tema");
    });
  }

  /* ---------- Stats counter ---------- */
  function setupCounters() {
    const els = $$("[data-count]");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.count;
        const suffix = el.dataset.suffix || "";
        let cur = 0;
        const step = Math.ceil(target / 40);
        const t = setInterval(() => {
          cur += step;
          if (cur >= target) { cur = target; clearInterval(t); }
          el.textContent = cur.toLocaleString("tr-TR") + suffix;
        }, 30);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    els.forEach((el) => io.observe(el));
  }

  function observeReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    $$(".reveal:not(.visible)").forEach((el) => io.observe(el));
  }

  /* ---------- Brand selects ---------- */
  function setupSearch() {
    const brandSel = $("#f-brand");
    brandSel.innerHTML = `<option value="">Marka</option>` + Object.keys(SK.BRANDS).map((b) => `<option>${b}</option>`).join("");
    brandSel.addEventListener("change", () => populateModels(brandSel.value));
    populateModels("");

    $("#f-city").innerHTML = `<option value="">Şehir</option>` + SK.CITIES.map((c) => `<option>${c}</option>`).join("");

    $("#btn-search").addEventListener("click", () => {
      readFiltersFromForm();
      renderListings();
      document.getElementById("one-cikanlar").scrollIntoView({ behavior: "smooth" });
      toast(`${filteredCars().length} araç listelendi.`);
    });

    $("#btn-advanced").addEventListener("click", () => {
      $("#advanced-panel").classList.toggle("open");
    });

    $("#btn-save-search").addEventListener("click", () => {
      readFiltersFromForm();
      const f = state.filters;
      openModal("modal-generic", {
        title: "Aramayı Kaydet",
        body: `<div class="saved-search-card">
          <strong>${f.brand || "Tüm markalar"}${f.model ? " / " + f.model : ""}</strong>
          <p class="text-muted mt-1">${f.yearMin || "2018"}+ · Max ${f.priceMax ? fmt(+f.priceMax) : "₺3.500.000"} · ${f.transmission || "Otomatik"} · ${f.city || "İstanbul"}</p>
          <div class="toggle"><span>Yeni ilan geldiğinde haber ver</span>
            <button class="switch ${state.savedSearchNotify ? "on" : ""}" type="button" id="notify-switch" aria-label="Bildirim"><i></i></button>
          </div>
        </div>
        <button class="btn btn-primary btn-block mt-2" type="button" id="confirm-save-search">Kaydet</button>`
      });
      $("#notify-switch").addEventListener("click", (e) => {
        state.savedSearchNotify = !state.savedSearchNotify;
        e.currentTarget.classList.toggle("on", state.savedSearchNotify);
      });
      $("#confirm-save-search").addEventListener("click", () => {
        closeModal("modal-generic");
        toast("Arama kaydedildi. Yeni ilanlarda bildirim alacaksın.");
      });
    });

    $("#sort-select").addEventListener("change", (e) => {
      state.sort = e.target.value;
      renderListings();
    });
  }

  function setupShowroomControls() {
    $("#sr-back").addEventListener("click", closeShowroom);
    $$("[data-sr]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const a = btn.dataset.sr;
        if (a === "rotate") { state.showroomViewer?.setAutoRotate(true); toast("Döndürme aktif"); }
        if (a === "zoom") state.showroomViewer?.zoomIn();
        if (a === "exterior") toast("3D demo: Dış görünüm");
        if (a === "interior") toast("3D demo: İç mekan");
        if (a === "lights") toast("3D demo: Farlar yakılıyor");
        if (a === "doors") toast("3D demo: Kapılar açılıyor");
        if (a === "trunk") toast("3D demo: Bagaj açılıyor");
        if (a === "engine") toast("3D demo: Motor bölmesi");
      });
    });
  }

  function initHeroViewer() {
    // Lazy init when visible
    const stage = $("#hero-viewer");
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        state.heroViewer = new SK.CarViewer(stage, { autoRotate: true, color: 0x1a3a52 });
        io.disconnect();
      }
    }, { threshold: 0.2 });
    io.observe(stage);
  }

  function setupNavLinks() {
    $$("[data-scroll]").forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href")?.slice(1) || a.dataset.scroll;
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth" });
          $("#mobile-nav")?.classList.remove("open");
        }
      });
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    document.documentElement.setAttribute("data-theme", state.theme === "dark" ? "dark" : "light");
    updateFavCount();
    updateCompareUI();
    setupHeaderUI();
    setupSearch();
    setupAI();
    setupValuation();
    setupShowroomControls();
    setupNavLinks();
    setupCounters();
    renderCategories();
    renderGalleries();
    renderTrending();
    renderPriceDrops();
    renderEV();
    renderRecent();
    showSkeletons();
    initHeroViewer();

    setTimeout(() => {
      state.listingReady = true;
      renderListings();
      observeReveal();
    }, 700);

    $("#compare-go").addEventListener("click", openCompare);
    $("#compare-clear").addEventListener("click", () => {
      state.compare = [];
      updateCompareUI();
      renderListings();
      toast("Karşılaştırma temizlendi.", "warn");
    });

    $$("#dealer-nav .nav-item").forEach((btn) => {
      btn.addEventListener("click", () => showDealerView(btn.dataset.view));
    });

    // Generic modal close on backdrop
    $$(".modal-root").forEach((root) => {
      root.addEventListener("click", (e) => { if (e.target === root) closeModal(root.id); });
      root.querySelector(".modal-close")?.addEventListener("click", () => closeModal(root.id));
    });

    // Keyboard
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        $$(".modal-root.open").forEach((m) => closeModal(m.id));
        closeShowroom();
        $("#ai-panel")?.classList.remove("open");
      }
    });

    // CTA hero
    $("#cta-explore")?.addEventListener("click", () => {
      document.getElementById("one-cikanlar").scrollIntoView({ behavior: "smooth" });
    });
    $("#cta-sell")?.addEventListener("click", () => {
      document.getElementById("aracimi-sat").scrollIntoView({ behavior: "smooth" });
    });

    $("#open-create-listing")?.addEventListener("click", () => {
      openDealerPanel();
      showDealerView("add");
    });

    // Mobile bottom nav
    $$(".mobile-bottom-nav [data-mb]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const a = btn.dataset.mb;
        $$(".mobile-bottom-nav [data-mb]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        if (a === "home") window.scrollTo({ top: 0, behavior: "smooth" });
        if (a === "search") document.getElementById("arama").scrollIntoView({ behavior: "smooth" });
        if (a === "sell") document.getElementById("aracimi-sat").scrollIntoView({ behavior: "smooth" });
        if (a === "fav") $("#btn-favorites-nav").click();
        if (a === "profile") $("#btn-login").click();
      });
    });

    observeReveal();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
