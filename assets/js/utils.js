window.Avanta = window.Avanta || {};

(function (A) {
  const TR_MONTHS = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];

  A.uid = function uid(prefix) {
    const p = prefix || "id";
    if (crypto && crypto.randomUUID) return p + "-" + crypto.randomUUID();
    return p + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  };

  A.escape = function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  A.money = function money(n) {
    const v = Number(n) || 0;
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 2
    }).format(v);
  };

  A.number = function number(n) {
    return new Intl.NumberFormat("tr-TR").format(Number(n) || 0);
  };

  A.date = function date(value, withTime) {
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    const day = String(d.getDate()).padStart(2, "0");
    const mon = String(d.getMonth() + 1).padStart(2, "0");
    const long = day + " " + TR_MONTHS[d.getMonth()] + " " + d.getFullYear();
    if (!withTime) return long;
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return long + " " + hh + ":" + mm;
  };

  A.shortDate = function shortDate(value) {
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    const day = String(d.getDate()).padStart(2, "0");
    const mon = String(d.getMonth() + 1).padStart(2, "0");
    return day + "." + mon + "." + d.getFullYear();
  };

  A.relative = function relative(value) {
    const d = new Date(value).getTime();
    const diff = Date.now() - d;
    const min = Math.round(diff / 60000);
    if (min < 1) return "şimdi";
    if (min < 60) return min + " dk önce";
    const hr = Math.round(min / 60);
    if (hr < 24) return hr + " saat önce";
    const day = Math.round(hr / 24);
    return day + " gün önce";
  };

  A.hash = function hash(str) {
    let h = 0;
    const s = String(str || "");
    for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
    return Math.abs(h);
  };

  A.placeholder = function placeholder(label, seed) {
    const palettes = [
      ["#EEF2FF", "#4338CA"],
      ["#ECFDF5", "#047857"],
      ["#FEF3C7", "#B45309"],
      ["#FCE7F3", "#BE185D"],
      ["#E0F2FE", "#0369A1"],
      ["#F3E8FF", "#6D28D9"],
      ["#FFEDD5", "#C2410C"],
      ["#E2E8F0", "#334155"]
    ];
    const i = A.hash(seed || label) % palettes.length;
    const [bg, fg] = palettes[i];
    const text = A.escape((label || "A").slice(0, 18));
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="560" viewBox="0 0 640 560">' +
      '<rect width="640" height="560" fill="' + bg + '"/>' +
      '<circle cx="490" cy="90" r="120" fill="' + fg + '" opacity="0.08"/>' +
      '<circle cx="90" cy="470" r="140" fill="' + fg + '" opacity="0.1"/>' +
      '<rect x="180" y="140" width="280" height="220" rx="28" fill="' + fg + '" opacity="0.12"/>' +
      '<text x="320" y="500" text-anchor="middle" font-family="Quicksand, sans-serif" font-size="22" font-weight="700" fill="' + fg + '">' +
      text +
      "</text></svg>";
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  };

  A.qrSvg = function qrSvg(value) {
    const size = 21;
    const cells = [];
    const seed = A.hash(value);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const finder =
          (x < 7 && y < 7) || (x > size - 8 && y < 7) || (x < 7 && y > size - 8);
        const on = finder
          ? x === 0 || y === 0 || x === 6 || y === 6 || x === size - 1 || y === size - 1 ||
            (x > 1 && x < 5 && y > 1 && y < 5) ||
            (x > size - 6 && x < size - 2 && y > 1 && y < 5) ||
            (x > 1 && x < 5 && y > size - 6 && y < size - 2)
          : ((x * 13 + y * 7 + seed) % 5) > 1;
        if (on) cells.push('<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="#111827"/>');
      }
    }
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + size + " " + size + '" shape-rendering="crispEdges">' +
      '<rect width="' + size + '" height="' + size + '" fill="#fff"/>' +
      cells.join("") +
      "</svg>"
    );
  };

  A.barcode = function barcode(value) {
    let bars = "";
    let x = 4;
    const seed = A.hash(value);
    for (let i = 0; i < 48; i++) {
      const w = 1 + ((seed + i * 9) % 3);
      if (i % 2 === 0) bars += '<rect x="' + x + '" y="4" width="' + w + '" height="36" fill="#111827"/>';
      x += w;
    }
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 48">' +
      bars +
      "</svg>"
    );
  };

  A.qs = function qs(sel, root) {
    return (root || document).querySelector(sel);
  };

  A.qsa = function qsa(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  };

  A.debounce = function debounce(fn, wait) {
    let t;
    return function () {
      const args = arguments;
      const ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  };

  A.icon = function icon(name, size) {
    const s = size || 18;
    return '<i data-lucide="' + A.escape(name) + '" width="' + s + '" height="' + s + '"></i>';
  };

  A.stars = function stars(n) {
    const v = Math.round(Number(n) || 0);
    return '<span class="stars" aria-label="' + v + ' yıldız">' + "★".repeat(v) + '<span style="color:#d0d5dd">' + "★".repeat(5 - v) + "</span></span>";
  };

  A.badgeStatus = function badgeStatus(status) {
    const map = {
      "Aktif": "success",
      "Onaylandı": "success",
      "Başarılı": "success",
      "Teslim Edildi": "success",
      "Kullanılabilir": "success",
      "Bağlı": "success",
      "Pasif": "neutral",
      "Taslak": "neutral",
      "Bekliyor": "warning",
      "Başvuru Alındı": "info",
      "İnceleniyor": "info",
      "Evrak Bekleniyor": "warning",
      "Hazırlanıyor": "info",
      "Kargoya Verildi": "info",
      "Ödeme Alındı": "info",
      "Yeni": "info",
      "Reddedildi": "danger",
      "İptal": "danger",
      "Hata": "danger",
      "Askıya Alındı": "danger",
      "İade Talebi": "warning",
      "İade Edildi": "neutral",
      "Kullanıldı": "neutral",
      "Süresi doldu": "neutral",
      "Bağlantı Yok": "neutral",
      "Senkronize Ediliyor": "info"
    };
    const kind = map[status] || "neutral";
    return '<span class="badge badge-' + kind + '">' + A.escape(status) + "</span>";
  };

  A.mask = function mask(value, visible) {
    const s = String(value || "");
    const v = visible == null ? 4 : visible;
    if (s.length <= v) return "••••";
    return "•".repeat(Math.max(4, s.length - v)) + s.slice(-v);
  };

  A.fileAllowed = function fileAllowed(file) {
    const ok = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    return file && ok.indexOf(file.type) !== -1 && file.size < 8 * 1024 * 1024;
  };

  A.copy = function copy(text) {
    if (navigator.clipboard) return navigator.clipboard.writeText(text);
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    el.remove();
    return Promise.resolve();
  };

  A.countdown = function countdown(endIso) {
    const end = new Date(endIso).getTime();
    const now = Date.now();
    let diff = Math.max(0, end - now);
    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const minutes = Math.floor(diff / 60000);
    diff -= minutes * 60000;
    const seconds = Math.floor(diff / 1000);
    return { days, hours, minutes, seconds, expired: end <= now };
  };

  A.pad = function pad(n) {
    return String(n).padStart(2, "0");
  };
})(window.Avanta);
