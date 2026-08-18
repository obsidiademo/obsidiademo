window.Avanta = window.Avanta || {};

(function (A) {
  function asset(path) {
    const depth = Number(document.body.getAttribute("data-depth") || "0");
    return "../".repeat(depth) + path;
  }

  A.path = {
    asset: asset,
    to: function (file) { return asset(file); }
  };

  function logo() {
    return '<a class="logo" href="' + asset("index.html") + '"><span class="logo-mark">A</span><span>Avanta</span></a>';
  }

  A.Layouts = {
    publicHeader: function () {
      const u = A.Services.user();
      const cartN = (A.Services.Cart.items() || []).reduce(function (s, i) { return s + i.qty; }, 0);
      const notifN = (A.state.notifications || []).filter(function (n) { return n.unread; }).length;
      const msgN = (A.state.conversations || []).length;
      return (
        '<header class="site-header"><div class="container header-inner">' +
        logo() +
        '<form class="search-bar" data-global-search>' +
        A.icon("search") +
        '<input name="q" placeholder="' + A.i18n.t("searchPlaceholder") + '" autocomplete="off" aria-label="Arama">' +
        '<button class="btn btn-primary btn-sm" type="submit">Ara</button>' +
        '<div class="dropdown-menu hidden" id="search-suggest" style="left:0;right:0;top:calc(100% + 8px)"></div>' +
        "</form>" +
        '<nav class="header-nav" aria-label="Ana menü">' +
        '<a href="' + asset("deals.html") + '">Fırsatlar</a>' +
        '<a href="' + asset("marketplace.html") + '">Marketplace</a>' +
        '<a href="' + asset("stores.html") + '">Mağazalar</a>' +
        '<a href="' + asset("brands.html") + '">Markalar</a>' +
        '<a href="' + asset("compare.html") + '">Karşılaştır</a>' +
        "</nav>" +
        '<div class="header-actions">' +
        '<a class="btn-icon hide-sm" href="' + asset("user/favorites.html") + '" aria-label="Favoriler">' + A.icon("heart") + "</a>" +
        '<a class="btn-icon" href="' + asset("user/messages.html") + '" aria-label="Mesajlar">' + A.icon("message-circle") + (msgN ? '<span class="icon-badge">' + msgN + "</span>" : "") + "</a>" +
        '<button class="btn-icon" data-open-notifs aria-label="Bildirimler">' + A.icon("bell") + (notifN ? '<span class="icon-badge">' + notifN + "</span>" : "") + "</button>" +
        '<a class="btn-icon" href="' + asset("cart.html") + '" aria-label="Sepet">' + A.icon("shopping-bag") + (cartN ? '<span class="icon-badge">' + cartN + "</span>" : "") + "</a>" +
        (u
          ? '<a class="btn btn-soft btn-sm hide-sm" href="' + A.Layouts.roleHome(u) + '">' + A.escape(u.firstName) + "</a>"
          : '<a class="btn btn-primary btn-sm hide-sm" href="' + asset("login.html") + '">Giriş</a>') +
        "</div></div></header>"
      );
    },
    publicFooter: function () {
      const col = function (title, links) {
        return "<div><h4>" + title + "</h4>" + links.map(function (l) {
          return '<a href="' + asset(l[1]) + '">' + l[0] + "</a>";
        }).join("") + "</div>";
      };
      return (
        '<footer class="site-footer"><div class="container footer-grid">' +
        "<div>" + logo().replace("logo", "logo") + "<p style='margin-top:12px;color:#98a2b3'>Alışveriş Yap. Puan Kazan. Avantajı Her Yerde Kullan.</p></div>" +
        col("Platform", [["Ana Sayfa", "index.html"], ["Ürünler", "products.html"], ["Fiyat Karşılaştır", "compare.html"], ["Sadakat", "loyalty.html"]]) +
        col("Fırsatlar", [["Günün Fırsatları", "deals.html"], ["Restoran", "deals.html"], ["Otel & Tatil", "deals.html"]]) +
        col("Marketplace", [["İkinci El", "marketplace.html"], ["İlan Ver", "sell.html"], ["Satıcı Ol", "merchant-apply.html"]]) +
        col("Kurumsal", [["Yardım Merkezi", "help/index.html"], ["KVKK", "legal/privacy.html"], ["İletişim", "help/contact.html"], ["Satıcı Paneli", "merchant/dashboard.html"]]) +
        '</div><div class="container footer-bottom"><span>© 2026 Avanta Ticaret ve Sadakat A.Ş.</span><span>App Store · Google Play · Visa · Mastercard · Troy</span></div></footer>'
      );
    },
    bottomNav: function (active) {
      const items = [
        ["home", "index.html", "home", "Ana Sayfa"],
        ["deals", "deals.html", "zap", "Fırsatlar"],
        ["marketplace", "marketplace.html", "store", "Marketplace"],
        ["messages", "user/messages.html", "message-circle", "Mesajlar"],
        ["profile", "user/dashboard.html", "user", "Profil"]
      ];
      return '<nav class="bottom-nav" aria-label="Mobil">' + items.map(function (i) {
        return '<a class="' + (active === i[0] ? "active" : "") + '" href="' + asset(i[1]) + '">' + A.icon(i[2], 20) + "<span>" + i[3] + "</span></a>";
      }).join("") + "</nav>";
    },
    cookie: function () {
      if (A.state.cookie) return "";
      return '<div class="cookie-banner" id="cookie-banner"><div><strong>Çerez tercihleri</strong><p class="text-muted">' +
        A.i18n.t("cookieText") + '</p></div><div style="display:flex;gap:8px;flex-wrap:wrap">' +
        '<button class="btn btn-ghost btn-sm" data-cookie="reject">Reddet</button>' +
        '<button class="btn btn-ghost btn-sm" data-cookie="prefs">Tercihleri Yönet</button>' +
        '<button class="btn btn-primary btn-sm" data-cookie="accept">Tümünü Kabul Et</button></div></div>';
    },
    roleHome: function (u) {
      if (!u) return asset("login.html");
      if (u.role === "super_admin" || u.role === "admin" || u.role === "finance_manager") return asset("admin/dashboard.html");
      if (u.role === "merchant_admin" || u.role === "merchant_staff") return asset("merchant/dashboard.html");
      if (u.role === "store_staff") return asset("pos/index.html");
      return asset("user/dashboard.html");
    },
    userNav: [
      ["dashboard", "Dashboard", "user/dashboard.html", "layout-dashboard"],
      ["orders", "Siparişlerim", "user/orders.html", "package"],
      ["loyalty", "Loyalty", "user/loyalty.html", "gem"],
      ["wallet", "Cüzdanım", "user/wallet.html", "wallet"],
      ["coupons", "Kuponlarım", "user/coupons.html", "ticket"],
      ["vouchers", "Fırsatlarım", "user/vouchers.html", "qr-code"],
      ["favorites", "Favoriler", "user/favorites.html", "heart"],
      ["alerts", "Fiyat Alarmlarım", "user/alerts.html", "bell-ring"],
      ["listings", "İlanlarım", "user/listings.html", "tag"],
      ["messages", "Mesajlar", "user/messages.html", "message-circle"],
      ["addresses", "Adresler", "user/addresses.html", "map-pin"],
      ["notifications", "Bildirimler", "user/notifications.html", "bell"],
      ["privacy", "Gizlilik Merkezi", "user/privacy.html", "shield"],
      ["profile", "Ayarlar", "user/profile.html", "settings"]
    ],
    merchantNav: [
      ["dashboard", "Dashboard", "merchant/dashboard.html", "layout-dashboard"],
      ["products", "Ürünler", "merchant/products.html", "box"],
      ["orders", "Siparişler", "merchant/orders.html", "package"],
      ["deals", "Fırsatlar", "merchant/deals.html", "zap"],
      ["campaigns", "Kampanyalar", "merchant/campaigns.html", "megaphone"],
      ["branches", "Şubeler", "merchant/branches.html", "store"],
      ["customers", "Müşteriler", "merchant/customers.html", "users"],
      ["loyalty", "Loyalty", "merchant/loyalty.html", "gem"],
      ["coupons", "Kuponlar", "merchant/coupons.html", "ticket"],
      ["integrations", "Marketplace", "merchant/integrations.html", "plug"],
      ["messages", "Mesajlar", "merchant/messages.html", "message-circle"],
      ["finance", "Finans", "merchant/finance.html", "banknote"],
      ["reports", "Raporlar", "merchant/reports.html", "bar-chart-3"],
      ["settings", "Ayarlar", "merchant/settings.html", "settings"]
    ],
    adminNav: [
      ["dashboard", "Dashboard", "admin/dashboard.html", "layout-dashboard"],
      ["_u", "KULLANICILAR"],
      ["users", "Kullanıcılar", "admin/users.html", "users"],
      ["tiers", "Üyelik Seviyeleri", "admin/tiers.html", "layers"],
      ["complaints", "Şikayetler", "admin/complaints.html", "flag"],
      ["_m", "MARKALAR"],
      ["merchants", "Markalar", "admin/merchants.html", "store"],
      ["applications", "Başvurular", "admin/applications.html", "file-check"],
      ["branches", "Şubeler", "admin/branches.html", "map-pin"],
      ["sellers", "Satıcılar", "admin/sellers.html", "briefcase"],
      ["_t", "TİCARET"],
      ["products", "Ürünler", "admin/products.html", "box"],
      ["orders", "Siparişler", "admin/orders.html", "package"],
      ["returns", "İadeler", "admin/returns.html", "undo-2"],
      ["categories", "Kategoriler", "admin/categories.html", "folder-tree"],
      ["_d", "FIRSATLAR"],
      ["deals", "Günlük Fırsatlar", "admin/deals.html", "zap"],
      ["vouchers", "Voucherlar", "admin/vouchers.html", "qr-code"],
      ["_c", "MARKETPLACE"],
      ["listings", "C2C İlanlar", "admin/listings.html", "tag"],
      ["listing-flags", "İlan Şikayetleri", "admin/listing-flags.html", "shield-alert"],
      ["_l", "LOYALTY"],
      ["loyalty", "Puan Sistemi", "admin/loyalty.html", "gem"],
      ["loyalty-tx", "Puan Hareketleri", "admin/loyalty-tx.html", "arrow-left-right"],
      ["campaigns", "Kampanyalar", "admin/campaigns.html", "megaphone"],
      ["_p", "PAZARLAMA"],
      ["coupons", "Kuponlar", "admin/coupons.html", "ticket"],
      ["notifications", "Bildirimler", "admin/notifications.html", "bell"],
      ["banners", "Bannerlar", "admin/banners.html", "image"],
      ["referral", "Referral", "admin/referral.html", "share-2"],
      ["_f", "FİNANS"],
      ["payments", "Ödemeler", "admin/payments.html", "credit-card"],
      ["commissions", "Komisyonlar", "admin/commissions.html", "percent"],
      ["payouts", "Hakedişler", "admin/payouts.html", "banknote"],
      ["_i", "ENTEGRASYONLAR"],
      ["integrations", "Marketplace", "admin/integrations.html", "plug"],
      ["payments-int", "Ödeme", "admin/payments-int.html", "wallet"],
      ["channels", "SMS / E-posta", "admin/channels.html", "mail"],
      ["_r", "RAPORLAR"],
      ["reports", "Raporlar", "admin/reports.html", "bar-chart-3"],
      ["_s", "SİSTEM"],
      ["roles", "Roller", "admin/roles.html", "key"],
      ["logs", "Loglar", "admin/logs.html", "scroll-text"],
      ["settings", "Ayarlar", "admin/settings.html", "settings"]
    ],
    sidebar: function (items, active) {
      const u = A.Services.user();
      let html = '<aside class="sidebar" id="sidebar">' + logo().replace("Avanta", "Avanta Panel") +
        '<div style="padding:12px 12px 8px;font-size:12px;color:#7a869c">' + (u ? A.escape(u.email) : "") + "</div>";
      items.forEach(function (it) {
        if (it[0].charAt(0) === "_") {
          html += '<div class="section-label">' + it[1] + "</div>";
          return;
        }
        html += '<a class="' + (active === it[0] ? "active" : "") + '" href="' + asset(it[2]) + '">' + A.icon(it[3], 18) + "<span>" + it[1] + "</span></a>";
      });
      html += '<a href="#" data-logout>' + A.icon("log-out") + "<span>Çıkış</span></a></aside>";
      return html;
    },
    panelTop: function (placeholder) {
      return (
        '<div class="panel-topbar">' +
        '<button class="btn-icon mobile-menu-btn" data-toggle-sidebar aria-label="Menü">' + A.icon("menu") + "</button>" +
        '<form class="search-bar panel-search" data-global-search>' + A.icon("search") +
        '<input name="q" placeholder="' + A.escape(placeholder || "Kullanıcı, sipariş, marka, ürün ara...") + '">' +
        "</form>" +
        '<div class="header-actions">' +
        '<button class="btn-icon" data-toggle-theme aria-label="Tema">' + A.icon("moon") + "</button>" +
        '<button class="btn-icon" data-open-notifs aria-label="Bildirimler">' + A.icon("bell") + "</button>" +
        '<button class="btn btn-soft btn-sm" data-open-command>⌘K</button>' +
        "</div></div>"
      );
    },
    commandPalette: function () {
      const commands = [
        ["Kullanıcı Ara", "admin/users.html"],
        ["Sipariş Bul", "admin/orders.html"],
        ["Marka Ekle", "admin/merchants.html"],
        ["Ürün Ekle", "merchant/products.html"],
        ["Kampanya Oluştur", "admin/campaigns.html"],
        ["Kupon Oluştur", "admin/coupons.html"],
        ["Fırsatlar", "deals.html"],
        ["POS / QR", "pos/index.html"]
      ];
      return '<div class="command-palette hidden" id="command-palette"><div class="command-box">' +
        '<input placeholder="Komut veya sayfa ara..." id="command-input">' +
        '<div id="command-list">' + commands.map(function (c) {
          return '<a class="command-item" href="' + asset(c[1]) + '"><span>' + c[0] + "</span><span class='text-muted'>Git</span></a>";
        }).join("") + "</div></div></div>";
    },
    notifDropdown: function () {
      const items = (A.state.notifications || []).slice(0, 6).map(function (n) {
        return '<a class="dropdown-item" href="' + asset("user/notifications.html") + '"><div><strong>' + A.escape(n.title) +
          '</strong><div class="text-muted">' + A.escape(n.body) + " · " + A.relative(n.at) + "</div></div></a>";
      }).join("");
      return '<div class="dropdown-menu" id="notif-menu" style="display:none;position:fixed;right:16px;top:70px;z-index:50">' +
        items + "</div>";
    }
  };
})(window.Avanta);
