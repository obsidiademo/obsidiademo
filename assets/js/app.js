window.Avanta = window.Avanta || {};

(function (A) {
  A.App = {
    boot: function () {
      A.Services.boot();
      A.Store.setTheme(A.Store.getTheme());
      const page = document.body.getAttribute("data-page") || "home";
      const layout = document.body.getAttribute("data-layout") || (A.Pages[page] && A.Pages[page].layout) || "public";
      this.render(page, layout);
      this.bindGlobal();
      A.UI.icons();
    },
    refresh: function () {
      const page = document.body.getAttribute("data-page");
      const layout = document.body.getAttribute("data-layout") || "public";
      this.render(page, layout);
      this.bindGlobal();
      A.UI.icons();
    },
    render: function (page, layout) {
      const view = A.Pages[page];
      if (!view) {
        document.getElementById("app-root").innerHTML = "<div class='container section'><h1>Sayfa yüklenemedi</h1></div>";
        return;
      }
      const inner = view.render() || "";
      const root = document.getElementById("app-root");
      const nav = view.nav || document.body.getAttribute("data-nav") || "";

      if (layout === "auth" || layout === "pos") {
        const visual = layout === "auth"
          ? '<div class="auth-visual"><div><h2>Alışveriş Yap. Puan Kazan. Avantajı Her Yerde Kullan.</h2><p>Online alışverişten günlük fırsatlara, ikinci el ürünlerden fiziksel mağaza indirimlerine kadar tüm avantajlar tek platformda.</p></div><p>Demo ortamı · Gerçek ödeme alınmaz</p></div>'
          : "";
        root.innerHTML = (layout === "auth" ? '<div class="auth-shell">' + visual + '<div class="auth-form">' + inner + "</div></div>" : inner) +
          A.Layouts.cookie() + A.Layouts.commandPalette();
      } else if (layout === "user" || layout === "merchant" || layout === "admin") {
        const items = layout === "admin" ? A.Layouts.adminNav : layout === "merchant" ? A.Layouts.merchantNav : A.Layouts.userNav;
        const active = page.replace(/^(user|merchant|admin)-/, "");
        const crumbs = layout.charAt(0).toUpperCase() + layout.slice(1) + " / " + (document.title.split("|")[0] || page);
        root.innerHTML =
          '<div class="panel-shell">' + A.Layouts.sidebar(items, active) +
          '<div class="panel-main">' + A.Layouts.panelTop() +
          '<main class="panel-content"><div class="breadcrumb">' + crumbs + "</div>" + inner + "</main></div></div>" +
          A.Layouts.bottomNav(nav || "profile") + A.Layouts.cookie() + A.Layouts.commandPalette() + A.Layouts.notifDropdown();
      } else {
        root.innerHTML = A.Layouts.publicHeader() + "<main>" + inner + "</main>" +
          A.Layouts.publicFooter() + A.Layouts.bottomNav(nav || "home") +
          A.Layouts.cookie() + A.Layouts.commandPalette() + A.Layouts.notifDropdown();
      }
      if (view.bind) view.bind();
    },
    bindGlobal: function () {
      document.querySelectorAll("[data-demo-login]").forEach(function (b) {
        b.onclick = function () {
          document.querySelector('[name="email"]').value = b.getAttribute("data-demo-login");
          document.querySelector('[name="password"]').value = "123456";
        };
      });
      document.querySelectorAll("[data-logout]").forEach(function (b) {
        b.onclick = function (e) {
          e.preventDefault();
          A.Services.Auth.logout();
          location.href = A.path.to("index.html");
        };
      });
      document.querySelectorAll("[data-add-cart]").forEach(function (b) {
        b.onclick = function () {
          A.Services.Cart.add(b.getAttribute("data-add-cart"), 1);
          A.UI.toast("Sepete eklendi", "success");
          A.App.refresh();
        };
      });
      document.querySelectorAll("[data-buy-now]").forEach(function (b) {
        b.onclick = function () {
          A.Services.Cart.add(b.getAttribute("data-buy-now"), 1);
          location.href = A.path.to("checkout.html");
        };
      });
      document.querySelectorAll("[data-remove-cart]").forEach(function (b) {
        b.onclick = function () {
          A.Services.Cart.remove(b.getAttribute("data-remove-cart"));
          A.App.refresh();
        };
      });
      document.querySelectorAll("[data-qty]").forEach(function (b) {
        b.onclick = function () {
          const parts = b.getAttribute("data-qty").split(":");
          const line = A.state.cart.find(function (c) { return c.productId === parts[0]; });
          if (line) A.Services.Cart.setQty(parts[0], line.qty + Number(parts[1]));
          A.App.refresh();
        };
      });
      document.querySelectorAll("[data-fav]").forEach(function (b) {
        b.onclick = function () {
          const parts = b.getAttribute("data-fav").split(":");
          const on = A.Services.Favorites.toggle(parts[0], parts[1]);
          A.UI.toast(on ? "Favorilere eklendi" : "Favorilerden çıkarıldı", "success");
        };
      });
      document.querySelectorAll("[data-follow]").forEach(function (b) {
        b.onclick = function () {
          const id = b.getAttribute("data-follow");
          const i = A.state.follows.indexOf(id);
          if (i >= 0) A.state.follows.splice(i, 1);
          else A.state.follows.push(id);
          A.Services.persist();
          A.UI.toast("Takip tercihi kaydedildi", "success");
          A.App.refresh();
        };
      });
      document.querySelectorAll("[data-price-alert]").forEach(function (b) {
        b.onclick = function () {
          const id = b.getAttribute("data-price-alert");
          const p = A.Services.Catalog.product(id);
          A.UI.modal({
            title: "Fiyat Alarmı Oluştur",
            body: "<p>Mevcut fiyat: " + A.money(p.price) + "</p><p>Bana fiyat <input class='input' id='alert-target' value='69999'> altına düşünce haber ver.</p>",
            footer: '<button class="btn btn-primary" id="save-alert">Kaydet</button>',
            onOpen: function (root) {
              root.querySelector("#save-alert").onclick = function () {
                A.Services.Alerts.add(id, root.querySelector("#alert-target").value);
                A.UI.closeModal();
                A.UI.toast("Alarm kuruldu", "success");
              };
            }
          });
        };
      });
      document.querySelectorAll("[data-start-chat]").forEach(function (b) {
        b.onclick = function () {
          if (!A.Services.user()) { location.href = A.path.to("login.html"); return; }
          const conv = A.Services.Chat.start(b.getAttribute("data-start-chat"));
          location.href = A.path.to("user/messages.html") + "?c=" + conv.id;
        };
      });
      document.querySelectorAll("[data-share]").forEach(function (b) {
        b.onclick = function () {
          A.copy(location.href).then(function () { A.UI.toast("Bağlantı kopyalandı", "success"); });
        };
      });
      document.querySelectorAll("[data-copy]").forEach(function (b) {
        b.onclick = function () {
          A.copy(b.getAttribute("data-copy")).then(function () { A.UI.toast("Kopyalandı", "success"); });
        };
      });
      document.querySelectorAll("[data-report]").forEach(function (b) {
        b.onclick = function () {
          A.UI.confirm("Şikayet et", "Bu içeriği incelemeye göndermek istiyor musunuz?", function () {
            A.UI.toast("Şikayetiniz alındı. Admin inceleyecek.", "success");
          });
        };
      });
      document.querySelectorAll("[data-block]").forEach(function (b) {
        b.onclick = function () { A.UI.toast("Kullanıcı engellendi (demo)", "success"); };
      });
      document.querySelectorAll("[data-oauth]").forEach(function (b) {
        b.onclick = function () { A.UI.toast("Google / Apple giriş demo ortamında simüle edilir.", "info"); };
      });
      document.querySelectorAll("[data-cookie]").forEach(function (b) {
        b.onclick = function () {
          const v = b.getAttribute("data-cookie");
          if (v === "prefs") {
            A.UI.modal({
              title: "Çerez tercihleri",
              body: "<label><input type='checkbox' checked> Zorunlu</label><br><label><input type='checkbox' checked> Analitik</label><br><label><input type='checkbox'> Pazarlama</label>",
              footer: '<button class="btn btn-primary" data-close-modal>Kaydet</button>'
            });
          }
          A.state.cookie = v;
          A.Services.persist();
          const el = document.getElementById("cookie-banner");
          if (el) el.remove();
        };
      });
      document.querySelectorAll("[data-toggle-theme]").forEach(function (b) {
        b.onclick = function () {
          const next = A.Store.getTheme() === "dark" ? "light" : "dark";
          A.Store.setTheme(next);
          if (b.classList.contains("switch")) b.classList.toggle("on", next === "dark");
        };
      });
      document.querySelectorAll("[data-toggle-sidebar]").forEach(function (b) {
        b.onclick = function () {
          const sb = document.getElementById("sidebar");
          sb.classList.toggle("open");
          if (sb.classList.contains("open")) {
            const back = document.createElement("div");
            back.className = "drawer-backdrop";
            back.onclick = function () { sb.classList.remove("open"); back.remove(); };
            document.body.appendChild(back);
          }
        };
      });
      document.querySelectorAll("[data-open-notifs]").forEach(function (b) {
        b.onclick = function () {
          const m = document.getElementById("notif-menu");
          if (m) m.style.display = m.style.display === "none" ? "block" : "none";
        };
      });
      document.querySelectorAll("[data-open-command]").forEach(function (b) {
        b.onclick = function () { A.App.toggleCommand(true); };
      });
      document.querySelectorAll("[data-mock]").forEach(function (b) {
        b.onclick = function () { A.UI.toast(b.getAttribute("data-mock"), "success"); };
      });
      document.querySelectorAll("[data-privacy]").forEach(function (b) {
        b.onclick = function () {
          const t = b.getAttribute("data-privacy");
          if (t === "Hesap Verilerimi İndir") {
            const blob = new Blob([JSON.stringify({ user: A.Services.user() }, null, 2)], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "avanta-verilerim.json";
            a.click();
            return;
          }
          if (t === "Hesabımı Sil") {
            A.UI.confirm("Hesabı sil", "Talep demo olarak kaydedilir.", function () { A.UI.toast("Silme talebi alındı", "success"); });
            return;
          }
          A.UI.modal({ title: t, body: "<p>Tercih kaydedildi (demo).</p><button class='switch on' type='button'></button>", footer: '<button class="btn btn-primary" data-close-modal>Tamam</button>' });
        };
      });
      document.querySelectorAll("[data-global-search]").forEach(function (form) {
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          const q = form.querySelector("input").value;
          location.href = A.path.to("search.html") + "?q=" + encodeURIComponent(q);
        });
        const input = form.querySelector("input");
        const box = form.querySelector("#search-suggest") || form.querySelector(".dropdown-menu");
        if (input && box) {
          input.addEventListener("input", A.debounce(function () {
            const q = input.value.trim();
            if (q.length < 2) { box.classList.add("hidden"); return; }
            const res = A.Services.Catalog.search(q);
            box.classList.remove("hidden");
            box.innerHTML =
              group("Ürünler", res.products, "name", "product-detail.html?id=") +
              group("Markalar", res.brands, "name", "brand.html?id=") +
              group("İlanlar", res.listings, "title", "listing-detail.html?id=") +
              '<a class="dropdown-item" href="' + A.path.to("compare.html") + '">Fiyat Karşılaştırma</a>';
          }, 180));
        }
      });
      document.querySelectorAll("[data-hero-search]").forEach(function (form) {
        form.onsubmit = function (e) {
          e.preventDefault();
          const q = form.q.value;
          location.href = A.path.to("search.html") + "?q=" + encodeURIComponent(q);
        };
      });
      if (!A.App._keysBound) {
        A.App._keysBound = true;
        document.addEventListener("keydown", function (e) {
          if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            A.App.toggleCommand(true);
          }
          if (e.key === "Escape") A.App.toggleCommand(false);
        });
      }
      const cmd = document.getElementById("command-palette");
      if (cmd) cmd.addEventListener("click", function (e) {
        if (e.target === cmd) A.App.toggleCommand(false);
      });
    },
    toggleCommand: function (open) {
      const el = document.getElementById("command-palette");
      if (!el) return;
      el.classList.toggle("hidden", !open);
      if (open) {
        const input = document.getElementById("command-input");
        if (input) input.focus();
      }
    }
  };

  function group(title, items, key, hrefPrefix) {
    if (!items.length) return "";
    return "<div class='dropdown-item'><strong>" + title + "</strong></div>" + items.map(function (i) {
      return '<a class="dropdown-item" href="' + A.path.to(hrefPrefix + i.id) + '">' + A.escape(i[key]) + "</a>";
    }).join("");
  }

  document.addEventListener("DOMContentLoaded", function () { A.App.boot(); });
})(window.Avanta);
