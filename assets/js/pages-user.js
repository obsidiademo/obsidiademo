window.Avanta = window.Avanta || {};

(function (A) {
  A.Pages = A.Pages || {};

  function needAuth(roles) {
    const u = A.Services.user();
    if (!u) {
      location.href = A.path.to("login.html");
      return null;
    }
    if (roles && !A.Services.Auth.requireRole(roles)) {
      location.href = A.path.to("403.html");
      return null;
    }
    return u;
  }

  A.Pages["user-dashboard"] = {
    layout: "user",
    nav: "profile",
    render: function () {
      const u = needAuth(["customer", "super_admin"]);
      if (!u) return "";
      const orders = A.state.orders.filter(function (o) { return o.userId === u.id; });
      return A.Views.pageHead("Merhaba, " + u.firstName + " 👋", "Gold üyeliğinizle mağaza ve online avantajlarınız aktif.") +
        '<div class="kpi-grid">' +
        stat("Loyalty Puanı", A.number(u.points)) +
        stat("Cüzdan", A.money(u.wallet || 0)) +
        stat("Aktif Kupon", String(A.state.coupons.length)) +
        stat("Devam Eden Sipariş", String(orders.filter(function (o) { return o.status !== "Teslim Edildi"; }).length)) +
        "</div>" +
        '<div class="grid grid-2" style="margin-top:16px">' +
        '<div class="card card-pad"><h3>Son siparişler</h3>' + orders.slice(0, 3).map(function (o) {
          return "<div style='display:flex;justify-content:space-between;padding:8px 0'><span>" + o.id + "</span>" + A.badgeStatus(o.status) + "</div>";
        }).join("") + '<a href="' + A.path.to("user/orders.html") + '">Tümü</a></div>' +
        '<div class="card card-pad"><h3>Sana özel kampanyalar</h3><p>Gold Extra %5 · WELCOME250 · Happy Hour 18:00–21:00</p>' +
        "<h3 style='margin-top:12px'>Fiyat alarmları</h3>" + (A.state.priceAlerts.map(function (a) {
          const p = A.Services.Catalog.product(a.productId);
          return "<p>" + (p ? p.name : a.productId) + " → " + A.money(a.target) + "</p>";
        }).join("") || "Alarm yok") + "</div></div>";
    }
  };

  function stat(label, value) {
    return '<div class="card stat-card"><div class="label">' + label + '</div><div class="value">' + value + "</div></div>";
  }

  A.Pages["user-orders"] = {
    layout: "user",
    render: function () {
      const u = needAuth(["customer", "super_admin"]);
      if (!u) return "";
      const orders = A.state.orders.filter(function (o) { return o.userId === u.id || u.role === "super_admin"; });
      return A.Views.pageHead("Siparişlerim", "Teslimat ve iade süreçlerini buradan izleyin.") +
        orders.map(function (o) {
          return '<div class="card card-pad" style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px">' +
            "<div><strong>" + o.id + "</strong><div class='text-muted'>" + A.date(o.date, true) + " · " + A.money(o.total) + "</div></div>" +
            A.badgeStatus(o.status) + "</div>" +
            '<div class="timeline" style="margin-top:12px">' +
            ["Yeni", "Ödeme Alındı", "Hazırlanıyor", "Kargoya Verildi", "Teslim Edildi"].map(function (s) {
              const done = ["Yeni", "Ödeme Alındı", "Hazırlanıyor", "Kargoya Verildi", "Teslim Edildi"].indexOf(s) <= ["Yeni", "Ödeme Alındı", "Hazırlanıyor", "Kargoya Verildi", "Teslim Edildi"].indexOf(o.status);
              return '<div class="timeline-item"><div class="dot" style="background:' + (done ? "var(--success)" : "#d0d5dd") + '"></div><div>' + s + "</div></div>";
            }).join("") + "</div></div>";
        }).join("");
    }
  };

  A.Pages["user-loyalty"] = {
    layout: "user",
    render: function () {
      const u = needAuth(["customer", "super_admin"]);
      if (!u) return "";
      const tier = A.Services.tier(u);
      const next = A.state.tiers[A.state.tiers.findIndex(function (t) { return t.id === tier.id; }) + 1];
      const pct = next ? Math.min(100, ((u.points - tier.min) / (next.min - tier.min)) * 100) : 100;
      return A.Views.pageHead("Dijital Sadakat Kartı", "Mağazada QR gösterin, indirim ve puan kazanın.") +
        '<div class="grid grid-2"><div class="loyalty-card">' +
        "<div style='position:relative;z-index:1'><div class='text-muted' style='color:#e0e7ff'>Avanta Card</div>" +
        "<h2>" + A.escape(u.firstName + " " + u.lastName) + "</h2>" +
        "<p>" + tier.name + " Üye · " + u.loyaltyId + "</p>" +
        "<p>Güncel puan: <strong>" + A.number(u.points) + "</strong><br>Harcanabilir: <strong>" + A.number(u.spendable) + "</strong></p>" +
        '<div class="qr-box" style="margin-top:8px">' + A.qrSvg(u.loyaltyId) + "</div>" +
        '<div style="max-width:220px;margin-top:8px">' + A.barcode(u.loyaltyId) + "</div></div></div>" +
        '<div class="card card-pad"><h3>Seviye ilerlemesi</h3><p>' + (next ? next.name + " için " + A.number(next.min - u.points) + " puan kaldı." : "En üst seviyesiniz.") + "</p>" +
        '<div class="progress"><span style="width:' + pct + '%"></span></div>' +
        '<button class="btn btn-primary" style="margin-top:12px" id="checkin">Günlük check-in (+20)</button>' +
        "<h3 style='margin-top:18px'>Görevler</h3>" + A.state.tasks.map(function (t) {
          return "<div style='margin:10px 0'><div style='display:flex;justify-content:space-between'><span>" + t.title + "</span><strong>+" + t.points + "</strong></div>" +
            '<div class="progress"><span style="width:' + t.progress + '%"></span></div></div>';
        }).join("") +
        "<h3 style='margin-top:18px'>Rozetler</h3><div class='chips'>" + A.state.badges.map(function (b) {
          return '<span class="chip ' + (b.owned ? "active" : "") + '">' + b.name + "</span>";
        }).join("") + "</div></div></div>" +
        "<h3 style='margin-top:20px'>Puan hareketleri</h3>" +
        A.UI.table(
          [{ key: "at", label: "Tarih" }, { key: "type", label: "Tip" }, { key: "amount", label: "Tutar" }, { key: "source", label: "Kaynak" }, { key: "ref", label: "Referans" }],
          A.state.loyaltyTx.filter(function (t) { return t.userId === u.id; }).map(function (t) {
            return { at: A.date(t.createdAt, true), type: t.type, amount: (t.amount > 0 ? "+" : "") + t.amount, source: t.source, ref: t.referenceId };
          })
        );
    },
    bind: function () {
      const b = document.getElementById("checkin");
      if (!b) return;
      b.onclick = function () {
        const r = A.Services.Loyalty.checkin();
        if (!r.ok) return A.UI.toast(r.error, "error");
        A.UI.toast("+20 puan eklendi", "success");
        A.App.refresh();
      };
    }
  };

  A.Pages["user-wallet"] = {
    layout: "user",
    render: function () {
      const u = needAuth(["customer", "super_admin"]);
      if (!u) return "";
      return A.Views.pageHead("Cüzdanım", "Bakiye, puan, cashback ve kuponlarınız.") +
        '<div class="kpi-grid">' +
        stat("Kullanılabilir Bakiye", A.money(u.wallet || 0)) +
        stat("Loyalty Puanı", A.number(u.points)) +
        stat("Bekleyen Cashback", A.money(u.cashbackPending || 0)) +
        stat("Kuponlarım", String(A.state.coupons.length)) +
        "</div>" +
        '<div class="card card-pad" style="margin-top:16px"><h3>Arkadaş davet</h3><p>Kodunuz: <strong>' + u.referral + "</strong></p>" +
        "<p>Arkadaşın ilk alışverişini yaptığında sen 500 puan, arkadaşın 250 puan kazansın.</p>" +
        '<div class="quick-actions"><button class="btn btn-ghost" data-copy="' + u.referral + '">Linki kopyala</button>' +
        '<button class="btn btn-ghost" data-share>WhatsApp</button><button class="btn btn-ghost" data-share>SMS</button><button class="btn btn-ghost" data-share>Instagram</button></div></div>';
    }
  };

  A.Pages["user-coupons"] = {
    layout: "user",
    render: function () {
      if (!needAuth(["customer", "super_admin"])) return "";
      return A.Views.pageHead("Kuponlarım", "Sepette kodu uygulayın.") +
        '<div class="grid grid-3">' + A.state.coupons.map(function (c) {
          return '<div class="card card-pad"><span class="badge">' + c.type + "</span><h3>" + c.code + "</h3><p>" + c.title + "</p>" +
            '<button class="btn btn-primary btn-sm" data-copy="' + c.code + '">Kopyala</button></div>';
        }).join("") + "</div>";
    }
  };

  A.Pages["user-vouchers"] = {
    layout: "user",
    render: function () {
      if (!needAuth(["customer", "super_admin"])) return "";
      const list = A.state.vouchers;
      if (!list.length) return A.UI.empty("Henüz fırsat voucher’ınız yok", "Günün fırsatlarından birini satın alın.", "Fırsatları Keşfet", A.path.to("deals.html"));
      return A.Views.pageHead("Fırsatlarım", "Dijital voucher ve QR kodlarınız.") +
        list.map(function (v) {
          const d = A.state.deals.find(function (x) { return x.id === v.dealId; });
          return '<div class="card card-pad" style="display:flex;gap:16px;align-items:center;margin-bottom:12px;flex-wrap:wrap">' +
            '<div class="qr-box">' + A.qrSvg(v.code) + "</div><div><h3>" + (d ? d.title : "Fırsat") + "</h3>" +
            "<p>VOUCHER: <strong>" + v.code + "</strong></p>" + A.badgeStatus(v.status) +
            ' <a class="btn btn-sm btn-ghost" href="' + A.path.to("pos/index.html") + "?voucher=" + v.code + '">İşletmede kullan</a></div></div>';
        }).join("");
    }
  };

  A.Pages["user-favorites"] = {
    layout: "user",
    render: function () {
      if (!needAuth(["customer", "super_admin"])) return "";
      const ids = A.state.favorites.products || [];
      const prods = A.state.products.filter(function (p) { return ids.indexOf(p.id) !== -1; });
      return A.Views.pageHead("Favoriler", "Ürün, mağaza, fırsat ve ilanlarınız.") +
        (prods.length ? '<div class="grid grid-4">' + prods.map(A.Views.productCard).join("") + "</div>"
          : A.UI.empty("Henüz favori ürününüz bulunmuyor.", "Beğendiğiniz ürünleri ♥ simgesine dokunarak kaydedebilirsiniz.", "Ürünleri Keşfet", A.path.to("products.html")));
    }
  };

  A.Pages["user-alerts"] = {
    layout: "user",
    render: function () {
      if (!needAuth(["customer", "super_admin"])) return "";
      return A.Views.pageHead("Fiyat Alarmlarım", "Hedef fiyata düşünce haber verelim.") +
        (A.state.priceAlerts.length ? A.UI.table(
          [{ key: "p", label: "Ürün" }, { key: "now", label: "Güncel" }, { key: "t", label: "Hedef" }],
          A.state.priceAlerts.map(function (a) {
            const p = A.Services.Catalog.product(a.productId);
            return { p: p ? p.name : a.productId, now: p ? A.money(p.price) : "—", t: A.money(a.target) };
          })
        ) : A.UI.empty("Alarm yok", "Ürün detayından alarm kurun.", "Karşılaştır", A.path.to("compare.html")));
    }
  };

  A.Pages["user-listings"] = {
    layout: "user",
    render: function () {
      const u = needAuth(["customer", "super_admin"]);
      if (!u) return "";
      const mine = A.state.listings.filter(function (l) { return l.sellerId === u.id; });
      return A.Views.pageHead("İlanlarım", "C2C ürünlerinizi yönetin.", '<a class="btn btn-primary" href="' + A.path.to("sell.html") + '">Yeni İlan</a>') +
        (mine.length ? A.UI.table(
          [{ key: "title", label: "İlan" }, { key: "price", label: "Fiyat" }, { key: "status", label: "Durum" }],
          mine.map(function (l) { return { title: l.title, price: A.money(l.price), status: A.badgeStatus(l.status) }; })
        ) : A.UI.empty("İlanınız yok", "Birkaç dakikada ilan verin.", "İlan Ver", A.path.to("sell.html")));
    }
  };

  A.Pages["user-messages"] = {
    layout: "user",
    nav: "messages",
    render: function () {
      const u = needAuth(["customer", "super_admin", "merchant_admin"]);
      if (!u) return "";
      const convs = A.state.conversations.filter(function (c) { return c.userIds.indexOf(u.id) !== -1; });
      const active = convs[0];
      return A.Views.pageHead("Mesajlar", "Teklif, ürün paylaşımı ve konum gönderebilirsiniz.") +
        '<div class="chat-layout"><div class="chat-list" id="chat-list">' +
        convs.map(function (c, i) {
          return '<button class="dropdown-item ' + (i === 0 ? "active" : "") + '" data-conv="' + c.id + '"><div><strong>' + A.escape(c.with) + "</strong><div class='text-muted'>" + A.escape(c.title) + "</div></div></button>";
        }).join("") + '</div><div class="chat-thread" id="chat-thread"></div></div>';
    },
    bind: function () {
      const u = A.Services.user();
      if (!u) return;
      const convs = A.state.conversations.filter(function (c) { return c.userIds.indexOf(u.id) !== -1; });
      function draw(id) {
        const c = convs.find(function (x) { return x.id === id; }) || convs[0];
        if (!c) return;
        const thread = document.getElementById("chat-thread");
        thread.innerHTML =
          '<div style="padding:12px;border-bottom:1px solid var(--border)"><strong>' + A.escape(c.with) + "</strong> · " + A.escape(c.title) +
          '<div style="float:right"><button class="btn btn-sm btn-ghost" data-block>Engelle</button> <button class="btn btn-sm btn-ghost" data-report>Şikayet et</button></div></div>' +
          '<div class="text-muted" style="padding:8px 12px;background:#fff8eb">' + A.i18n.t("safetyChat") + "</div>" +
          '<div style="flex:1;padding:12px;overflow:auto" id="msgs">' + c.messages.map(function (m) {
            const me = m.from === u.id;
            return '<div class="msg ' + (me ? "me" : "them") + '">' + A.escape(m.text) +
              (m.offer ? '<div class="offer-card" style="margin-top:8px">TEKLİF: ' + A.money(m.offer) +
                (me ? "" : ' <button class="btn btn-sm btn-success" data-accept-offer>Teklifi Kabul Et</button>') + "</div>" : "") +
              "</div>";
          }).join("") + "</div>" +
          '<form id="chat-form" style="display:flex;gap:8px;padding:10px;border-top:1px solid var(--border)">' +
          '<input class="input" name="text" placeholder="Mesaj veya teklif yazın">' +
          '<button class="btn btn-ghost" type="button" id="send-offer">Teklif</button>' +
          '<button class="btn btn-primary" type="submit">Gönder</button></form>';
        document.getElementById("chat-form").onsubmit = function (e) {
          e.preventDefault();
          const t = new FormData(e.target).get("text");
          A.Services.Chat.send(c.id, t);
          draw(c.id);
        };
        document.getElementById("send-offer").onclick = function () {
          A.Services.Chat.send(c.id, "Teklif gönderildi", { offer: 8500 });
          draw(c.id);
        };
        A.qsa("[data-accept-offer]", thread).forEach(function (b) {
          b.onclick = function () {
            A.Services.Chat.send(c.id, "Teklif kabul edildi. İlan satıldı olarak işaretlendi.");
            const listing = A.state.listings.find(function (l) { return l.id === c.listingId; });
            if (listing) listing.status = "Satıldı";
            A.Services.persist();
            A.UI.toast("Teklif kabul edildi", "success");
            draw(c.id);
          };
        });
        A.UI.icons();
      }
      A.qsa("[data-conv]").forEach(function (b) {
        b.onclick = function () { draw(b.getAttribute("data-conv")); };
      });
      if (convs[0]) draw(convs[0].id);
    }
  };

  A.Pages["user-addresses"] = {
    layout: "user",
    render: function () {
      const u = needAuth(["customer", "super_admin"]);
      if (!u) return "";
      return A.Views.pageHead("Adresler", "Teslimat adresleriniz.") +
        '<div class="card card-pad"><strong>Ev</strong><p>Caferağa Mah. Moda Cad. No:14<br>' + u.district + " / " + u.city + "</p>" +
        '<button class="btn btn-primary" id="add-address">Yeni adres</button></div>';
    },
    bind: function () {
      const b = document.getElementById("add-address");
      if (b) b.onclick = function () {
        A.UI.modal({ title: "Yeni adres", body: '<input class="input" placeholder="Açık adres">', footer: '<button class="btn btn-primary" data-close-modal>Kaydet</button>' });
      };
    }
  };

  A.Pages["user-notifications"] = {
    layout: "user",
    render: function () {
      if (!needAuth(["customer", "super_admin"])) return "";
      return A.Views.pageHead("Bildirimler", "Sipariş, loyalty, fiyat alarmı ve mesajlar.") +
        A.state.notifications.map(function (n) {
          return '<div class="card card-pad" style="margin-bottom:8px"><strong>' + A.escape(n.title) + "</strong><p class='text-muted'>" + A.escape(n.body) + " · " + A.relative(n.at) + "</p></div>";
        }).join("");
    }
  };

  A.Pages["user-privacy"] = {
    layout: "user",
    render: function () {
      if (!needAuth(["customer", "super_admin"])) return "";
      return A.Views.pageHead("Gizlilik Merkezi", "KVKK tercihleriniz.") +
        ["İletişim İzinleri", "Kişisel Veri Tercihleri", "Hesap Verilerimi İndir", "Hesabımı Sil", "KVKK Metni", "Açık Rıza", "Çerez Tercihleri"].map(function (x) {
          return '<div class="card card-pad" style="margin-bottom:8px;display:flex;justify-content:space-between;align-items:center"><span>' + x + '</span><button class="btn btn-ghost btn-sm" data-privacy="' + x + '">Yönet</button></div>';
        }).join("");
    }
  };

  A.Pages["user-profile"] = {
    layout: "user",
    render: function () {
      const u = needAuth(["customer", "super_admin"]);
      if (!u) return "";
      return A.Views.pageHead("Ayarlar", "Profil ve görünüm tercihleri.") +
        '<form id="prof-form" class="card card-pad grid grid-2" style="gap:12px">' +
        '<div class="field"><label>Ad</label><input class="input" name="firstName" value="' + A.escape(u.firstName) + '"></div>' +
        '<div class="field"><label>Soyad</label><input class="input" name="lastName" value="' + A.escape(u.lastName) + '"></div>' +
        '<div class="field"><label>E-posta</label><input class="input" value="' + A.escape(u.email) + '" disabled></div>' +
        '<div class="field"><label>Telefon</label><input class="input" name="phone" value="' + A.escape(u.phone || "") + '"></div>' +
        '<label style="grid-column:1/-1">Tema <button type="button" class="switch" data-toggle-theme></button></label>' +
        '<button class="btn btn-primary">Kaydet</button></form>';
    },
    bind: function () {
      const f = document.getElementById("prof-form");
      if (!f) return;
      f.onsubmit = function (e) {
        e.preventDefault();
        const u = A.Services.user();
        const fd = new FormData(f);
        u.firstName = A.Security.sanitize(fd.get("firstName"));
        u.lastName = A.Security.sanitize(fd.get("lastName"));
        u.phone = fd.get("phone");
        A.Services.persist();
        A.UI.toast("Profil güncellendi", "success");
      };
    }
  };
})(window.Avanta);
