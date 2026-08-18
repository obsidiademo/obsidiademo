window.Avanta = window.Avanta || {};

(function (A) {
  A.Pages = A.Pages || {};

  function gate() {
    const user = A.Services.user();
    if (!user) { location.href = A.path.to("login.html"); return null; }
    if (!A.Services.Auth.requireRole(["super_admin", "admin", "finance_manager"])) {
      location.href = A.path.to("403.html"); return null;
    }
    return user;
  }

  function kpi(l, v, h) {
    return '<div class="card stat-card"><div class="label">' + l + '</div><div class="value">' + v + "</div>" + (h ? '<div class="hint">' + h + "</div>" : "") + "</div>";
  }

  A.Pages["admin-dashboard"] = {
    layout: "admin",
    render: function () {
      if (!gate()) return "";
      return A.Views.pageHead("Süper Admin", "Platform ekonomisi ve operasyon sağlığı.",
        '<div class="quick-actions"><button class="btn btn-primary" data-go="admin/merchants.html">+ Marka Ekle</button>' +
        '<button class="btn btn-ghost" data-go="admin/campaigns.html">+ Kampanya</button>' +
        '<button class="btn btn-ghost" data-go="admin/coupons.html">+ Kupon</button>' +
        '<button class="btn btn-ghost" data-go="admin/users.html">+ Kullanıcı</button>' +
        '<button class="btn btn-ghost" data-go="admin/deals.html">+ Fırsat</button></div>') +
        '<div class="kpi-grid" style="grid-template-columns:repeat(3,1fr)">' +
        kpi("GMV", "₺8.428.530", "+%12 haftalık") +
        kpi("Platform Geliri", "₺612.430") +
        kpi("Aktif Kullanıcı", "184.250") +
        kpi("Marka", "3.842") +
        kpi("Sipariş", "12.472") +
        kpi("Loyalty Puan", "24.8M") +
        "</div>" +
        '<div class="grid grid-2" style="margin-top:16px"><div class="card chart-card"><h3>GMV</h3><canvas id="gmv"></canvas></div>' +
        '<div class="card chart-card"><h3>Yeni Üye</h3><canvas id="users-c"></canvas></div></div>' +
        '<div class="grid grid-2" style="margin-top:16px">' +
        '<div class="card card-pad"><h3>Son İşlemler</h3>' + A.state.logs.slice(0, 6).map(function (l) {
          return "<p>" + A.escape(l.action) + " · " + A.escape(l.entity) + " · " + A.relative(l.at) + "</p>";
        }).join("") + "</div>" +
        '<div class="card card-pad"><h3>Platform Health</h3>' +
        [["API", "Çalışıyor"], ["Ödeme", "Çalışıyor"], ["Marketplace Sync", "Çalışıyor"], ["Notification", "Çalışıyor"]].map(function (x) {
          return "<p><span class='health-dot'></span> " + x[0] + " · " + x[1] + "</p>";
        }).join("") +
        '<div class="ai-card" style="margin-top:12px"><strong>AI Fraud Detection</strong> <span class="badge">Demo</span><p>Son 24 saatte 3 şüpheli C2C teklifi işaretlendi.</p></div></div></div>';
    },
    bind: function () {
      A.Pages._charts && A.Pages._charts([["gmv", "GMV"], ["users-c", "Üye"]]);
      A.qsa("[data-go]").forEach(function (b) {
        b.onclick = function () { location.href = A.path.to(b.getAttribute("data-go")); };
      });
    }
  };

  function adminTable(id, title, desc, columns, rowsFn, extra) {
    A.Pages[id] = {
      layout: "admin",
      render: function () {
        if (!gate()) return "";
        const rows = typeof rowsFn === "function" ? rowsFn() : rowsFn;
        return A.Views.pageHead(title, desc, extra || "") +
          '<div class="filters-row"><input class="input" id="tbl-q" placeholder="Tabloda ara" style="max-width:260px">' +
          '<select class="select" style="max-width:150px"><option>Tüm durumlar</option><option>Aktif</option><option>Bekliyor</option></select>' +
          '<select class="select" style="max-width:120px"><option>25 / sayfa</option><option>50 / sayfa</option></select>' +
          '<button class="btn btn-ghost">Excel</button><button class="btn btn-ghost">CSV</button></div>' +
          '<div id="tbl-box">' + A.UI.table(columns, rows, { selectable: true, actions: true }) + "</div>" +
          A.UI.pagination(1, 3);
      }
    };
  }

  adminTable("admin-users", "Kullanıcılar", "Rol tabanlı hesaplar.",
    [{ key: "name", label: "Ad" }, { key: "email", label: "E-posta" }, { key: "role", label: "Rol" }, { key: "city", label: "Şehir" }],
    function () { return A.state.users.map(function (u) {
      return { id: u.id, name: u.firstName + " " + u.lastName, email: u.email, role: u.role, city: u.city || "—", actions: '<button class="btn btn-sm btn-ghost" data-mock="Kullanıcı güncellendi">Düzenle</button>' };
    }); },
    '<button class="btn btn-primary" data-mock="Kullanıcı davet edildi">+ Kullanıcı</button>'
  );

  A.Pages["admin-tiers"] = {
    layout: "admin",
    render: function () {
      if (!gate()) return "";
      return A.Views.pageHead("Üyelik Seviyeleri", "Eşikler admin tarafından değiştirilebilir.") +
        A.UI.table(
          [{ key: "name", label: "Seviye" }, { key: "min", label: "Min" }, { key: "max", label: "Max" }, { key: "cb", label: "Cashback" }],
          A.state.tiers.map(function (t) { return { name: t.name, min: A.number(t.min), max: t.max > 1e8 ? "+" : A.number(t.max), cb: "%" + t.cashback }; })
        );
    }
  };

  A.Pages["admin-complaints"] = {
    layout: "admin",
    render: function () {
      if (!gate()) return "";
      return A.Views.pageHead("Şikayetler", "Mesaj ve ilan şikayetleri.") +
        A.UI.table(
          [{ key: "id", label: "ID" }, { key: "type", label: "Tür" }, { key: "status", label: "Durum" }],
          [
            { id: "CMP-201", type: "Mesaj — ödeme talebi", status: A.badgeStatus("İnceleniyor") },
            { id: "CMP-188", type: "İlan — yanıltıcı fiyat", status: A.badgeStatus("Bekliyor") }
          ]
        );
    }
  };

  A.Pages["admin-merchants"] = {
    layout: "admin",
    render: function () {
      if (!gate()) return "";
      return A.Views.pageHead("Markalar", "Onaylı ve bekleyen markalar.", '<button class="btn btn-primary" data-mock="Marka taslağı">+ Marka Ekle</button>') +
        A.UI.table(
          [{ key: "name", label: "Marka" }, { key: "cat", label: "Kategori" }, { key: "pack", label: "Paket" }, { key: "com", label: "Komisyon" }, { key: "status", label: "Durum" }],
          A.state.brands.map(function (b) {
            return { name: b.name, cat: b.category, pack: b.package, com: "%" + b.commission, status: A.badgeStatus(b.status), actions: '<a class="btn btn-sm btn-ghost" href="' + A.path.to("brand.html") + "?id=" + b.id + '">Gör</a>' };
          }),
          { actions: true }
        );
    }
  };

  A.Pages["admin-applications"] = {
    layout: "admin",
    render: function () {
      if (!gate()) return "";
      return A.Views.pageHead("Marka Başvuruları", "Evrak, risk ve onay kuyruğu.") +
        A.UI.table(
          [{ key: "brand", label: "Marka" }, { key: "firm", label: "Firma" }, { key: "cat", label: "Kategori" }, { key: "date", label: "Başvuru" }, { key: "docs", label: "Evrak" }, { key: "risk", label: "Risk" }, { key: "status", label: "Durum" }],
          A.state.applications.map(function (a) {
            return {
              id: a.id, brand: a.brand, firm: a.firm, cat: a.category, date: A.shortDate(a.date), docs: a.docs, risk: a.risk,
              status: A.badgeStatus(a.status),
              actions: '<button class="btn btn-sm btn-primary" data-app="' + a.id + '">İncele</button>'
            };
          }),
          { actions: true }
        );
    },
    bind: function () {
      A.qsa("[data-app]").forEach(function (b) {
        b.onclick = function () {
          const a = A.state.applications.find(function (x) { return x.id === b.getAttribute("data-app"); });
          A.UI.modal({
            title: a.brand + " başvurusu",
            body: "<p><strong>Firma:</strong> " + a.firm + "</p><p>Yetkili, belgeler, banka, adres, faaliyet ve sözleşme incelenebilir.</p>" +
              "<p>Durum: " + a.status + " · Risk: " + a.risk + "</p>",
            footer:
              '<button class="btn btn-success" data-app-act="Onaylandı">Onayla</button>' +
              '<button class="btn btn-ghost" data-app-act="Evrak Bekleniyor">Evrak İste</button>' +
              '<button class="btn btn-danger" data-app-act="Reddedildi">Reddet</button>' +
              '<button class="btn btn-ghost" data-app-act="Askıya Alındı">Askıya Al</button>',
            onOpen: function (root) {
              A.qsa("[data-app-act]", root).forEach(function (x) {
                x.onclick = function () {
                  const brand = A.state.brands.find(function (br) { return br.name === a.brand; });
                  A.Services.Admin.setMerchantStatus(brand ? brand.id : a.id, x.getAttribute("data-app-act"));
                  a.status = x.getAttribute("data-app-act");
                  A.UI.closeModal();
                  A.UI.toast("Durum güncellendi: " + a.status, "success");
                  A.App.refresh();
                };
              });
            }
          });
        };
      });
    }
  };

  adminTable("admin-branches", "Şubeler", "Tüm fiziksel noktalar.",
    [{ key: "name", label: "Şube" }, { key: "city", label: "Şehir" }, { key: "term", label: "Terminal" }],
    A.SEED.stores.map(function (s) { return { id: s.id, name: s.name, city: s.city, term: s.terminal, actions: "—" }; })
  );

  adminTable("admin-sellers", "Satıcılar", "Merchant kullanıcıları.",
    [{ key: "email", label: "E-posta" }, { key: "role", label: "Rol" }],
    [{ id: "u-brand", email: "brand@demo.com", role: "merchant_admin", actions: "—" }]
  );

  adminTable("admin-products", "Ürünler", "Katalog moderasyonu.",
    [{ key: "name", label: "Ürün" }, { key: "brand", label: "Marka" }, { key: "price", label: "Fiyat" }, { key: "sp", label: "Sponsorlu" }],
    A.SEED.products.map(function (p) {
      return { id: p.id, name: p.name, brand: p.brand, price: A.money(p.price), sp: p.sponsored ? "Evet" : "Hayır", actions: '<button class="btn btn-sm btn-ghost" data-mock="Ürün güncellendi">Düzenle</button>' };
    })
  );

  adminTable("admin-orders", "Siparişler", "Platform siparişleri.",
    [{ key: "id", label: "No" }, { key: "total", label: "Tutar" }, { key: "status", label: "Durum" }],
    A.SEED.orders.map(function (o) { return { id: o.id, total: A.money(o.total), status: A.badgeStatus(o.status), actions: "—" }; })
  );

  adminTable("admin-returns", "İadeler", "İade talepleri.",
    [{ key: "id", label: "Sipariş" }, { key: "status", label: "Durum" }],
    [{ id: "AV-10482", status: A.badgeStatus("İade Talebi"), actions: '<button class="btn btn-sm btn-ghost" data-mock="İade onaylandı">Onayla</button>' }]
  );

  adminTable("admin-categories", "Kategoriler", "E-ticaret ağacı.",
    [{ key: "name", label: "Kategori" }],
    A.SEED.categories.map(function (c) { return { id: c.id, name: c.name, actions: "—" }; })
  );

  adminTable("admin-deals", "Günlük Fırsatlar", "Fırsat moderasyonu.",
    [{ key: "title", label: "Fırsat" }, { key: "price", label: "Fiyat" }, { key: "sold", label: "Satış" }],
    A.SEED.deals.map(function (d) { return { id: d.id, title: d.title, price: A.money(d.price), sold: String(d.sold), actions: "—" }; })
  );

  adminTable("admin-vouchers", "Voucherlar", "Dijital kuponlar.",
    [{ key: "code", label: "Kod" }, { key: "status", label: "Durum" }],
    A.SEED.vouchers.map(function (v) { return { id: v.id, code: v.code, status: A.badgeStatus(v.status), actions: "—" }; })
  );

  adminTable("admin-listings", "C2C İlanlar", "İkinci el pazar.",
    [{ key: "title", label: "İlan" }, { key: "price", label: "Fiyat" }, { key: "status", label: "Durum" }],
    A.SEED.listings.map(function (l) { return { id: l.id, title: l.title, price: A.money(l.price), status: A.badgeStatus(l.status), actions: "—" }; })
  );

  adminTable("admin-listing-flags", "İlan Şikayetleri", "Moderasyon kuyruğu.",
    [{ key: "listing", label: "İlan" }, { key: "reason", label: "Sebep" }],
    [{ id: "1", listing: "2021 Volkswagen Golf", reason: "Fiyat tutarsız", actions: '<button class="btn btn-sm btn-danger" data-mock="İlan kaldırıldı">Kaldır</button>' }]
  );

  A.Pages["admin-loyalty"] = {
    layout: "admin",
    render: function () {
      if (!gate()) return "";
      return A.Views.pageHead("Puan Sistemi", "₺100 = 10 puan oranı değiştirilebilir.") +
        '<div class="card card-pad"><label>Kazanç oranı</label><input class="input" value="0.10" id="rate"><button class="btn btn-primary" id="save-rate">Kaydet</button></div>';
    },
    bind: function () {
      const b = document.getElementById("save-rate");
      if (b) b.onclick = function () {
        A.state.rate = Number(document.getElementById("rate").value) || 0.1;
        A.Services.persist();
        A.UI.toast("Puan oranı güncellendi", "success");
      };
    }
  };

  adminTable("admin-loyalty-tx", "Puan Hareketleri", "earn / spend / expire / refund / bonus",
    [{ key: "user", label: "Kullanıcı" }, { key: "type", label: "Tip" }, { key: "amount", label: "Tutar" }, { key: "src", label: "Kaynak" }],
    A.SEED.loyaltyTx.map(function (t) { return { id: t.id, user: t.userId, type: t.type, amount: String(t.amount), src: t.source, actions: "—" }; })
  );

  adminTable("admin-campaigns", "Kampanyalar", "Kampanya kural motoru.",
    [{ key: "name", label: "Ad" }, { key: "type", label: "Tip" }, { key: "status", label: "Durum" }],
    A.SEED.campaigns.map(function (c) { return { id: c.id, name: c.name, type: c.type, status: A.badgeStatus(c.status), actions: "—" }; }),
    '<button class="btn btn-primary" data-mock="Kampanya oluşturuldu">+ Kampanya</button>'
  );

  adminTable("admin-coupons", "Kuponlar", "Pazarlama kuponları.",
    [{ key: "code", label: "Kod" }, { key: "title", label: "Kural" }],
    A.SEED.coupons.map(function (c) { return { id: c.id, code: c.code, title: c.title, actions: "—" }; })
  );

  adminTable("admin-notifications", "Bildirimler", "Push, SMS, e-posta, site içi, WhatsApp hazır.",
    [{ key: "title", label: "Başlık" }, { key: "type", label: "Kanal" }],
    A.SEED.notifications.map(function (n) { return { id: n.id, title: n.title, type: n.type, actions: "—" }; })
  );

  A.Pages["admin-banners"] = {
    layout: "admin",
    render: function () {
      if (!gate()) return "";
      return A.Views.pageHead("Bannerlar", "Sponsorlu ürün ve ana sayfa alanları.") +
        '<div class="card card-pad"><p>Ana sayfa hero · Kategori şeridi · Sponsorlu ürün etiketi</p><button class="btn btn-primary" data-mock="Banner kaydedildi">Yeni banner</button></div>';
    }
  };

  A.Pages["admin-referral"] = {
    layout: "admin",
    render: function () {
      if (!gate()) return "";
      return A.Views.pageHead("Referral", "Davet ekonomisi.") +
        "<p>Davet eden: 500 puan · Davet edilen: 250 puan · Kod örneği FATIH250</p>";
    }
  };

  adminTable("admin-payments", "Ödemeler", "iyzico / PayTR / Stripe adapter UI.",
    [{ key: "id", label: "Sipariş" }, { key: "method", label: "Yöntem" }, { key: "status", label: "Durum" }],
    A.SEED.orders.map(function (o) { return { id: o.id, method: "Kredi kartı", status: A.badgeStatus("Başarılı"), actions: "—" }; })
  );

  A.Pages["admin-commissions"] = {
    layout: "admin",
    render: function () {
      if (!gate()) return "";
      return A.Views.pageHead("Komisyonlar", "Global %8, kategori ve marka bazlı.") +
        A.UI.table(
          [{ key: "scope", label: "Kapsam" }, { key: "name", label: "Ad" }, { key: "rate", label: "Oran" }],
          A.state.commissions.map(function (c) { return { scope: c.scope, name: c.name, rate: "%" + c.rate }; })
        ) +
        A.Views.pageHead("Marka paketleri", "Starter / Professional / Enterprise") +
        A.UI.table(
          [{ key: "name", label: "Paket" }, { key: "products", label: "Ürün" }, { key: "price", label: "Aylık" }],
          A.state.packages.map(function (p) { return { name: p.name, products: String(p.products), price: A.money(p.price) }; })
        );
    }
  };

  adminTable("admin-payouts", "Satıcı Hakedişleri", "Brüt, komisyon, iade, net.",
    [{ key: "brand", label: "Marka" }, { key: "period", label: "Dönem" }, { key: "net", label: "Net" }, { key: "status", label: "Durum" }],
    A.SEED.payouts.map(function (p) { return { id: p.id, brand: p.brand, period: p.period, net: A.money(p.net), status: p.status, actions: '<button class="btn btn-sm btn-primary" data-mock="Payout onaylandı">Onayla</button>' }; })
  );

  A.Pages["admin-integrations"] = {
    layout: "admin",
    render: function () { return A.Pages["merchant-integrations"].render(); },
    bind: function () { if (A.Pages["merchant-integrations"].bind) A.Pages["merchant-integrations"].bind(); }
  };

  A.Pages["admin-payments-int"] = {
    layout: "admin",
    render: function () {
      if (!gate()) return "";
      return A.Views.pageHead("Ödeme entegrasyonları", "Anahtarlar sunucuda saklanır, frontend’de gösterilmez.") +
        '<div class="grid grid-3">' + ["iyzico", "PayTR", "Stripe"].map(function (n) {
          return '<div class="card card-pad"><h3>' + n + "</h3>" + A.badgeStatus("Bağlı") + "<p>API anahtarı: " + A.mask("sk_live_avanta_demo_key") + "</p></div>";
        }).join("") + "</div>";
    }
  };

  A.Pages["admin-channels"] = {
    layout: "admin",
    render: function () {
      if (!gate()) return "";
      return A.Views.pageHead("SMS / E-posta", "İletişim kanalları.") +
        '<div class="grid grid-2"><div class="card card-pad"><h3>SMS</h3>' + A.badgeStatus("Çalışıyor") + "</div>" +
        '<div class="card card-pad"><h3>E-posta</h3>' + A.badgeStatus("Çalışıyor") + "</div></div>";
    }
  };

  A.Pages["admin-reports"] = {
    layout: "admin",
    render: function () {
      if (!gate()) return "";
      return A.Views.pageHead("Raporlar", "GMV, gelir, sipariş, üye, loyalty, kategori, marka, fırsat, C2C.") +
        '<div class="grid grid-2"><div class="card chart-card"><canvas id="a1"></canvas></div><div class="card chart-card"><canvas id="a2"></canvas></div></div>' +
        '<div class="grid grid-3" style="margin-top:12px">' +
        kpi("En çok satan", "Elektronik") + kpi("En başarılı marka", "Aether Store") + kpi("C2C ilan", String(A.state.listings.length)) + "</div>";
    },
    bind: function () { A.Pages._charts && A.Pages._charts([["a1", "GMV"], ["a2", "Fırsat satışları"]]); }
  };

  A.Pages["admin-roles"] = {
    layout: "admin",
    render: function () {
      if (!gate()) return "";
      const rows = Object.keys(A.RBAC).map(function (r) {
        return { role: r, perm: (A.RBAC[r].slice(0, 4).join(", ")) + (A.RBAC[r].length > 4 ? "…" : "") };
      });
      return A.Views.pageHead("Roller ve yetkiler", "RBAC: products.view, merchant.approve, payout.approve…") +
        A.UI.table([{ key: "role", label: "Rol" }, { key: "perm", label: "Yetkiler" }], rows);
    }
  };

  adminTable("admin-logs", "Audit Log", "Kritik işlem kayıtları.",
    [{ key: "user", label: "Kullanıcı" }, { key: "action", label: "İşlem" }, { key: "entity", label: "Entity" }, { key: "ip", label: "IP" }, { key: "at", label: "Tarih" }],
    A.SEED.logs.map(function (l) { return { id: l.at, user: l.user, action: l.action, entity: l.entity, ip: l.ip, at: A.date(l.at, true), actions: "—" }; })
  );

  A.Pages["admin-settings"] = {
    layout: "admin",
    render: function () {
      if (!gate()) return "";
      return A.Views.pageHead("Sistem ayarları", "Gelir modelleri ve bakım.") +
        "<ul class='card card-pad'><li>Marketplace komisyonu</li><li>Fırsat satış komisyonu</li><li>Marka üyelik paketi</li><li>Sponsorlu ürün / fırsat</li><li>Premium listing</li><li>Reklam alanları</li><li>Loyalty kampanya ücretleri</li><li>Fiziksel mağaza anlaşmaları</li></ul>" +
        '<p style="margin-top:12px"><a class="btn btn-ghost" href="' + A.path.to("maintenance.html") + '">Bakım modu sayfası</a></p>';
    }
  };
})(window.Avanta);
