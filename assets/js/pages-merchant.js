window.Avanta = window.Avanta || {};

(function (A) {
  A.Pages = A.Pages || {};

  function u() {
    const user = A.Services.user();
    if (!user) { location.href = A.path.to("login.html"); return null; }
    if (!A.Services.Auth.requireRole(["merchant_admin", "merchant_staff", "super_admin"])) {
      location.href = A.path.to("403.html"); return null;
    }
    return user;
  }

  A.Pages["merchant-dashboard"] = {
    layout: "merchant",
    render: function () {
      if (!u()) return "";
      return A.Views.pageHead("Marka paneli", "UrbanWear operasyon özeti — 18.08.2026") +
        '<div class="kpi-grid">' +
        k("Bugünkü Ciro", "₺482.750") + k("Sipariş", "1.842") + k("Ortalama Sepet", "₺262") + k("Loyalty Müşterisi", "18.420") +
        "</div>" +
        '<div class="ai-card" style="margin:16px 0"><strong>AI Insights</strong> <span class="badge">Demo</span>' +
        "<p>Elektronik kategorisinde hafta sonu %8 kupon oluşturmanız halinde tahmini dönüşüm oranı %12–18 artabilir.</p></div>" +
        '<div class="grid grid-2"><div class="card chart-card"><canvas id="m-rev"></canvas></div>' +
        '<div class="card chart-card"><canvas id="m-ord"></canvas></div></div>' +
        '<div class="card card-pad" style="margin-top:16px"><h3>Marketplace senkron</h3>' +
        "<p>Son Senkronizasyon: 18.08.2026 18:35</p><p><strong>7.482</strong> Ürün · <strong>6</strong> Marketplace · <strong>53</strong> Bekleyen Sipariş</p></div>";
    },
    bind: function () { A.Pages._charts([["m-rev", "Ciro"], ["m-ord", "Sipariş"]]); }
  };

  function k(l, v) { return '<div class="card stat-card"><div class="label">' + l + '</div><div class="value">' + v + "</div></div>"; }

  A.Pages._charts = function (pairs) {
    if (!window.Chart) return;
    pairs.forEach(function (p) {
      const el = document.getElementById(p[0]);
      if (!el) return;
      new Chart(el, {
        type: "line",
        data: { labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], datasets: [{ label: p[1], data: [12, 18, 14, 22, 28, 31, 26], borderColor: "#6d5efc", tension: 0.35, fill: false }] },
        options: { plugins: { legend: { display: false } } }
      });
    });
  };

  A.Pages["merchant-products"] = {
    layout: "merchant",
    render: function () {
      if (!u()) return "";
      const rows = A.state.products.filter(function (p) { return p.brandId === "b-urbanwear" || true; }).slice(0, 12).map(function (p) {
        return {
          id: p.id,
          sku: p.sku,
          name: p.name,
          cat: p.category,
          stock: String(p.stock),
          price: A.money(p.price),
          sold: A.number(p.sold),
          status: A.badgeStatus(p.stock > 0 ? "Aktif" : "Pasif"),
          actions: '<button class="btn btn-sm btn-ghost" data-edit-prod="' + p.id + '">Düzenle</button>'
        };
      });
      return A.Views.pageHead("Ürünler", "Tüm mağaza ürünlerinizi buradan yönetin.", '<button class="btn btn-primary" id="new-prod">+ Yeni Ürün</button>') +
        '<div class="filters-row"><input class="input" placeholder="Ara" style="max-width:240px"><select class="select" style="max-width:160px"><option>Durum</option><option>Aktif</option></select>' +
        '<button class="btn btn-ghost">Excel</button><button class="btn btn-ghost">CSV</button><button class="btn btn-ghost">PDF</button></div>' +
        '<div class="bulk-bar"><span>Toplu işlem</span><button class="btn btn-sm btn-ghost">Stok güncelle</button><button class="btn btn-sm btn-ghost">Fiyat güncelle</button></div>' +
        A.UI.table(
          [{ key: "sku", label: "SKU" }, { key: "name", label: "Ürün" }, { key: "cat", label: "Kategori" }, { key: "stock", label: "Stok" }, { key: "price", label: "Fiyat" }, { key: "sold", label: "Satış" }, { key: "status", label: "Durum" }],
          rows,
          { selectable: true, actions: true }
        );
    },
    bind: function () {
      const b = document.getElementById("new-prod");
      if (b) b.onclick = function () {
        A.UI.modal({
          title: "Yeni ürün",
          body: '<div class="grid" style="gap:8px"><input class="input" placeholder="Ürün adı"><input class="input" placeholder="SKU"><input class="input" placeholder="Fiyat"><input class="input" placeholder="Stok"></div>',
          footer: '<button class="btn btn-primary" data-close-modal>Kaydet (demo)</button>'
        });
      };
    }
  };

  function simpleTablePage(layout, title, desc, columns, rows, cta) {
    return {
      layout: layout,
      render: function () {
        if (!u()) return "";
        return A.Views.pageHead(title, desc, cta || "") +
          '<div class="filters-row"><input class="input" placeholder="Ara" style="max-width:240px">' +
          '<select class="select" style="max-width:160px"><option>Bugün</option><option>Dün</option><option>Son 7 Gün</option><option>Son 30 Gün</option><option>Bu Ay</option><option>Geçen Ay</option><option>Özel Tarih</option></select></div>' +
          A.UI.table(columns, rows);
      }
    };
  }

  A.Pages["merchant-orders"] = simpleTablePage("merchant", "Siparişler", "Satış kanallarındaki siparişler.",
    [{ key: "id", label: "Sipariş" }, { key: "total", label: "Tutar" }, { key: "status", label: "Durum" }, { key: "date", label: "Tarih" }],
    A.SEED.orders.map(function (o) { return { id: o.id, total: A.money(o.total), status: A.badgeStatus(o.status), date: A.shortDate(o.date) }; })
  );

  A.Pages["merchant-deals"] = {
    layout: "merchant",
    render: function () {
      if (!u()) return "";
      return A.Views.pageHead("Fırsatlar", "Günlük fırsat paketleriniz.", '<button class="btn btn-primary" data-mock="Fırsat taslağı oluşturuldu">+ Fırsat</button>') +
        '<div class="grid grid-3">' + A.state.deals.slice(0, 6).map(A.Views.dealCard).join("") + "</div>";
    }
  };

  A.Pages["merchant-campaigns"] = {
    layout: "merchant",
    render: function () {
      if (!u()) return "";
      return A.Views.pageHead("Kampanyalar", "Koşul ve aksiyon motoru.", '<button class="btn btn-primary" id="new-camp">+ Kampanya</button>') +
        A.UI.table(
          [{ key: "name", label: "Kampanya" }, { key: "type", label: "Tip" }, { key: "seg", label: "Segment" }, { key: "status", label: "Durum" }],
          A.state.campaigns.map(function (c) { return { name: c.name, type: c.type, seg: c.segment, status: A.badgeStatus(c.status) }; })
        );
    },
    bind: function () {
      const b = document.getElementById("new-camp");
      if (b) b.onclick = function () {
        A.UI.modal({
          title: "Kampanya kuralı",
          body: "<p>conditions / actions / startDate / endDate / usageLimit / userLimit / segment / channel</p>" +
            '<select class="select"><option>%20 indirim</option><option>2 al 1 öde</option><option>₺1.000 üzerine ₺150</option><option>Gold üyeye ekstra %5</option><option>Happy Hour</option></select>',
          footer: '<button class="btn btn-primary" data-close-modal>Kaydet</button>'
        });
      };
    }
  };

  A.Pages["merchant-branches"] = {
    layout: "merchant",
    render: function () {
      if (!u()) return "";
      return A.Views.pageHead("Şubeler", "Fiziksel noktalar ve QR terminal ID.") +
        A.UI.table(
          [{ key: "name", label: "Şube" }, { key: "addr", label: "Adres" }, { key: "hours", label: "Saat" }, { key: "term", label: "Terminal" }, { key: "disc", label: "Kampanya" }],
          A.state.stores.map(function (s) {
            return { name: s.name, addr: s.address, hours: s.hours, term: s.terminal, disc: "%" + s.discount };
          })
        );
    }
  };

  A.Pages["merchant-customers"] = simpleTablePage("merchant", "Müşteriler", "Segmentasyon: yeni, aktif, kayıp, yüksek harcama, Gold.",
    [{ key: "name", label: "Müşteri" }, { key: "tier", label: "Seviye" }, { key: "points", label: "Puan" }, { key: "city", label: "Şehir" }],
    A.SEED.users.filter(function (x) { return x.role === "customer"; }).map(function (x) {
      return { name: x.firstName + " " + x.lastName, tier: x.tier || "Bronze", points: A.number(x.points || 0), city: x.city };
    })
  );

  A.Pages["merchant-loyalty"] = {
    layout: "merchant",
    render: function () {
      if (!u()) return "";
      return A.Views.pageHead("Loyalty", "Marka kampanyaları ve puan dağıtımı.") +
        '<div class="grid grid-3"><div class="card stat-card"><div class="label">Dağıtılan puan</div><div class="value">2.4M</div></div>' +
        '<div class="card stat-card"><div class="label">Aktif Gold</div><div class="value">1.204</div></div>' +
        '<div class="card stat-card"><div class="label">Mağaza QR işlem</div><div class="value">318</div></div></div>';
    }
  };

  A.Pages["merchant-coupons"] = {
    layout: "merchant",
    render: function () {
      if (!u()) return "";
      return A.Views.pageHead("Kuponlar", "Yüzde, sabit, kargo ve segment kuponları.") +
        A.UI.table(
          [{ key: "code", label: "Kod" }, { key: "title", label: "Kural" }, { key: "status", label: "Durum" }],
          A.state.coupons.map(function (c) { return { code: c.code, title: c.title, status: A.badgeStatus(c.status) }; })
        );
    }
  };

  A.Pages["merchant-integrations"] = {
    layout: "merchant",
    render: function () {
      if (!u()) return "";
      return A.Views.pageHead("Marketplace entegrasyonları", "TrendyolAdapter, HepsiburadaAdapter, AmazonAdapter, N11Adapter, PazaramaAdapter, CiceksepetiAdapter") +
        '<div class="grid grid-3">' + A.state.integrations.map(function (i) {
          return '<div class="card card-pad"><h3>' + i.name + "</h3>" + A.badgeStatus(i.status) +
            "<p>" + A.number(i.products) + " ürün</p><p class='text-muted'>Son: " + (i.lastSync ? A.date(i.lastSync, true) : "—") + "</p>" +
            '<button class="btn btn-sm btn-primary" data-mock="Senkron başlatıldı">Senkronize et</button></div>';
        }).join("") + "</div>" +
        '<div class="card card-pad" style="margin-top:16px"><h3>Ürün aktarımı</h3><p>Fiyat güncelleme · Stok · Sipariş çekme · Kargo · Kategori eşleştirme · Varyant eşleştirme</p>' +
        '<div class="quick-actions"><button class="btn btn-ghost" data-mock="Fiyatlar güncellendi">Fiyat güncelle</button>' +
        '<button class="btn btn-ghost" data-mock="Stoklar güncellendi">Stok güncelle</button>' +
        '<button class="btn btn-ghost" data-mock="53 sipariş çekildi">Sipariş çek</button></div></div>';
    }
  };

  A.Pages["merchant-messages"] = A.Pages["user-messages"];

  A.Pages["merchant-finance"] = {
    layout: "merchant",
    render: function () {
      if (!u()) return "";
      const p = A.state.payouts[0];
      return A.Views.pageHead("Finans", "Hakediş ve komisyon dökümü.") +
        '<div class="kpi-grid">' +
        k("Toplam Satış", A.money(p.gross)) + k("Komisyon", A.money(p.commission)) + k("İadeler", A.money(p.refund)) + k("Ödenebilir", A.money(p.net)) +
        "</div>" + A.UI.table(
          [{ key: "brand", label: "Marka" }, { key: "period", label: "Dönem" }, { key: "gross", label: "Brüt" }, { key: "commission", label: "Komisyon" }, { key: "refund", label: "İade" }, { key: "net", label: "Net" }, { key: "status", label: "Durum" }],
          A.state.payouts.map(function (x) {
            return { brand: x.brand, period: x.period, gross: A.money(x.gross), commission: A.money(x.commission), refund: A.money(x.refund), net: A.money(x.net), status: A.badgeStatus(x.status === "Ödendi" ? "Başarılı" : x.status === "Ödenebilir" ? "Bekliyor" : "İnceleniyor") };
          })
        );
    }
  };

  A.Pages["merchant-reports"] = {
    layout: "merchant",
    render: function () {
      if (!u()) return "";
      return A.Views.pageHead("Raporlar", "Ciro, sipariş, müşteri, conversion, puan, kampanya.") +
        '<div class="filters-row"><button class="chip active">Son 7 Gün</button><button class="chip">Son 30 Gün</button>' +
        '<button class="btn btn-ghost">Excel</button><button class="btn btn-ghost">CSV</button><button class="btn btn-ghost">PDF</button></div>' +
        '<div class="grid grid-2"><div class="card chart-card"><canvas id="r1"></canvas></div><div class="card chart-card"><canvas id="r2"></canvas></div></div>';
    },
    bind: function () { A.Pages._charts([["r1", "Ciro"], ["r2", "Conversion"]]); }
  };

  A.Pages["merchant-settings"] = {
    layout: "merchant",
    render: function () {
      if (!u()) return "";
      return A.Views.pageHead("Ayarlar", "Mağaza profili ve API erişimi.") +
        '<div class="card card-pad"><p>Paket: Professional · Marketplace: 4 kanal · API: açık</p>' +
        '<button class="btn btn-primary" data-mock="Ayarlar kaydedildi">Kaydet</button></div>';
    }
  };

  A.Pages.pos = {
    layout: "pos",
    render: function () {
      return '<div class="pos-screen"><div class="logo" style="margin-bottom:16px"><span class="logo-mark">A</span><span>Avanta POS</span></div>' +
        '<div class="card card-pad"><h1>Müşteri QR Kodunu Tara</h1>' +
        '<input class="input" id="pos-code" placeholder="LYT-95847291 veya DEAL-A8F73C" value="LYT-95847291">' +
        '<button class="btn btn-primary btn-block" style="margin-top:12px" id="pos-scan">QR Oku</button></div>' +
        '<div id="pos-result" style="margin-top:16px"></div></div>';
    },
    bind: function () {
      document.getElementById("pos-scan").onclick = function () {
        const code = document.getElementById("pos-code").value.trim();
        const user = A.state.users.find(function (x) { return x.loyaltyId === code; }) || A.state.users.find(function (x) { return x.email === "user@demo.com"; });
        const voucher = A.state.vouchers.find(function (v) { return v.code === code; });
        const total = 1250;
        const discRate = 0.1;
        const disc = total * discRate;
        const pay = total - disc;
        const pts = Math.round(pay * 0.1);
        const box = document.getElementById("pos-result");
        if (voucher) {
          voucher.status = "Kullanıldı";
          A.Services.persist();
          box.innerHTML = '<div class="card card-pad"><h3>Voucher kullanıldı</h3><p>' + voucher.code + "</p></div>";
          return;
        }
        box.innerHTML = '<div class="card card-pad"><h2>' + user.firstName + " " + (user.lastName || "").charAt(0) + ".</h2>" +
          "<p>" + (user.tier || "Gold") + " Üye · " + A.number(user.points) + " Puan</p>" +
          "<h3>Geçerli Kampanyalar</h3><p>%10 Gold İndirimi · 2X Loyalty Puan</p>" +
          "<p>Toplam: ₺1.250<br>Gold İndirimi: %10<br>İndirim: ₺125<br><strong>Ödenecek: ₺1.125</strong><br>Kazanılan Puan: 112</p>" +
          '<button class="btn btn-success btn-block" id="pos-apply">İndirimi Uygula ve Puan Kazandır</button></div>';
        document.getElementById("pos-apply").onclick = function () {
          A.Services.Loyalty.earn(user.id, 112, "mağaza", "POS-UW-001");
          A.UI.toast("İşlem tamamlandı. 112 puan yüklendi.", "success");
        };
      };
    }
  };
})(window.Avanta);
