window.Avanta = window.Avanta || {};

(function (A) {
  A.Pages = A.Pages || {};
  function qs(key) {
    return new URLSearchParams(location.search).get(key);
  }

  A.Pages.home = {
    nav: "home",
    render: function () {
      const products = A.state.products;
      const deals = A.state.deals;
      const cats = A.state.categories;
      const end = deals[4] ? deals[4].left : new Date(Date.now() + 8 * 3600000).toISOString();
      return (
        '<section class="hero"><div class="container">' +
        "<h1>Avantajlarla Dolu Yeni Nesil Alışveriş</h1>" +
        "<p class='lead'>Alışveriş yap, puan kazan, günlük fırsatları keşfet ve avantajlarını online veya mağazada kullan.</p>" +
        '<form class="hero-search" data-hero-search>' +
        '<input class="input" name="q" placeholder="Ürün, marka, mağaza veya fırsat ara...">' +
        '<select class="select" name="city"><option>İstanbul</option><option>Ankara</option><option>İzmir</option></select>' +
        '<select class="select" name="cat"><option>Kategori</option>' + cats.map(function (c) { return "<option>" + c.name + "</option>"; }).join("") + "</select>" +
        '<select class="select" name="brand"><option>Marka</option>' + A.state.brands.slice(0, 8).map(function (b) { return "<option>" + b.name + "</option>"; }).join("") + "</select>" +
        '<button class="btn btn-primary" type="submit">Ara</button></form>' +
        '<div class="hero-cta"><a class="btn btn-accent btn-lg" href="deals.html">Fırsatları Keşfet</a>' +
        '<a class="btn btn-ghost btn-lg" href="register.html">Üye Ol</a></div>' +
        "</div></section>" +

        '<section class="section"><div class="container"><div class="section-title"><h2>Popüler Kategoriler</h2></div>' +
        '<div class="grid grid-6">' + cats.map(function (c) {
          return '<a class="category-tile" href="products.html?cat=' + c.id + '"><span class="cat-icon">' + A.icon(c.icon) + "</span><span>" + c.name + "</span></a>";
        }).join("") + "</div></div></section>" +

        '<section class="section"><div class="container"><div class="section-title"><div><h2>Günün Fırsatı</h2><p class="text-muted">Sınırlı süre · gerçek geri sayım</p></div><a href="deals.html">Tüm fırsatlar</a></div>' +
        '<div class="card card-pad" style="display:flex;gap:24px;flex-wrap:wrap;align-items:center">' +
        '<div class="deal-timer" id="deal-timer" data-end="' + end + '"></div>' +
        "<div><h3>IMAX Sinema 2 Bilet + Büyük Mısır</h3><p class='text-muted'>CinePlus Zorlu · Beşiktaş</p>" +
        "<p><span class='price-old'>₺690,00</span> <span class='price' style='font-size:28px'>₺349,00</span></p>" +
        '<a class="btn btn-orange" href="deal-detail.html?id=d5">Hemen Al</a></div></div></div></section>' +

        '<section class="section"><div class="container"><div class="section-title"><h2>Sana Özel Fırsatlar</h2><a href="deals.html">Tümü</a></div>' +
        '<div class="grid grid-4" id="home-deals">' + A.UI.skeletonCards(4) + "</div></div></section>" +

        '<section class="section"><div class="container"><div class="section-title"><h2>Yakınındaki İndirimler</h2><a href="stores.html">Harita</a></div>' +
        "<p class='text-muted' style='margin-bottom:12px'>2 km içindeki %20+ indirimler · konum izniyle kişiselleştirilir</p>" +
        '<div class="grid grid-4">' + A.state.stores.filter(function (s) { return s.discount >= 15; }).slice(0, 4).map(A.Views.storeCard).join("") + "</div></div></section>" +

        '<section class="section"><div class="container"><div class="section-title"><h2>En Çok Satanlar</h2><a href="products.html">Mağaza</a></div>' +
        '<div class="grid grid-4 product-grid-public" id="home-products">' + products.slice(0, 8).map(A.Views.productCard).join("") + "</div></div></section>" +

        '<section class="section"><div class="container"><div class="section-title"><h2>En Popüler Markalar</h2></div>' +
        '<div class="grid grid-4">' + A.state.brands.filter(function (b) { return b.status === "Onaylandı"; }).slice(0, 8).map(A.Views.brandCard).join("") + "</div></div></section>" +

        '<section class="section"><div class="container"><div class="section-title"><h2>Fiyatı Düşen Ürünler</h2><a href="compare.html">Karşılaştır</a></div>' +
        '<div class="grid grid-4">' + products.filter(function (p) { return p.oldPrice; }).slice(0, 4).map(A.Views.productCard).join("") + "</div></div></section>" +

        '<section class="section"><div class="container"><div class="section-title"><h2>İkinci El Fırsatları</h2><a href="marketplace.html">Pazar</a></div>' +
        '<div class="grid grid-3">' + A.state.listings.slice(0, 3).map(A.Views.listingCard).join("") + "</div></div></section>" +

        '<section class="section"><div class="container"><div class="card loyalty-card"><div style="position:relative;z-index:1">' +
        "<h2>Loyalty Avantajları</h2><p>Gold üyeler fiziksel mağazalarda %10 indirim, 2X puan ve ücretsiz kargo kazanır.</p>" +
        '<div class="hero-cta"><a class="btn btn-accent" href="user/loyalty.html">Kartımı Gör</a>' +
        '<a class="btn btn-ghost" href="loyalty.html" style="border-color:#fff;color:#fff">Nasıl çalışır?</a></div></div></div></div></section>' +

        '<section class="section"><div class="container"><div class="app-cta"><div><h2>Avanta her yerde</h2><p>QR ile mağazada öde, fırsat voucher’ını göster, puanını her yerde kullan.</p></div>' +
        '<div style="display:flex;gap:8px"><span class="btn btn-ghost" style="border-color:#fff;color:#fff">App Store</span><span class="btn btn-ghost" style="border-color:#fff;color:#fff">Google Play</span></div></div></div></section>'
      );
    },
    bind: function () {
      const box = document.getElementById("home-deals");
      if (box) {
        setTimeout(function () {
          box.innerHTML = A.state.deals.slice(0, 4).map(A.Views.dealCard).join("");
          A.UI.icons();
        }, 400);
      }
      A.Pages._timer();
    }
  };

  A.Pages._timer = function () {
    const el = document.getElementById("deal-timer");
    if (!el) return;
    function tick() {
      const c = A.countdown(el.getAttribute("data-end"));
      el.innerHTML = [
        [A.pad(c.hours + c.days * 24), "Saat"],
        [A.pad(c.minutes), "Dakika"],
        [A.pad(c.seconds), "Saniye"]
      ].map(function (x) { return '<div class="time-box"><b>' + x[0] + "</b><span>" + x[1] + "</span></div>"; }).join("");
    }
    tick();
    clearInterval(window.__avantaTimer);
    window.__avantaTimer = setInterval(tick, 1000);
  };

  A.Pages.login = {
    layout: "auth",
    render: function () {
      return (
        '<div class="auth-card">' + logoMini() +
        "<h1>Giriş Yap</h1><p class='text-muted'>Demo hesaplarla tek tıkla deneyin. Şifre: 123456</p>" +
        '<div class="grid" style="gap:8px;margin:16px 0">' +
        demoBtn("Super Admin", "admin@demo.com") +
        demoBtn("Marka / Satıcı", "brand@demo.com") +
        demoBtn("Son Kullanıcı", "user@demo.com") +
        "</div>" +
        '<form id="login-form" class="grid" style="gap:12px">' +
        '<div class="field"><label>E-posta</label><input class="input" name="email" type="email" required></div>' +
        '<div class="field"><label>Şifre</label><input class="input" name="password" type="password" required></div>' +
        '<button class="btn btn-primary btn-block" type="submit">Giriş Yap</button></form>' +
        '<p class="text-muted" style="margin-top:12px">Hesabın yok mu? <a href="register.html">Üye ol</a> · <a href="merchant-apply.html">Satıcı ol</a></p>' +
        '<div style="display:flex;gap:8px;margin-top:16px"><button class="btn btn-ghost btn-block" data-oauth="google">Google</button>' +
        '<button class="btn btn-ghost btn-block" data-oauth="apple">Apple</button></div></div>'
      );
    },
    bind: function () {
      document.getElementById("login-form").onsubmit = function (e) {
        e.preventDefault();
        const fd = new FormData(e.target);
        const res = A.Services.Auth.login(fd.get("email"), fd.get("password"));
        if (!res.ok) return A.UI.toast(res.error, "error");
        A.UI.toast("Hoş geldiniz, " + res.user.firstName, "success");
        location.href = A.Layouts.roleHome(res.user);
      };
    }
  };

  function demoBtn(label, email) {
    return '<button class="btn btn-ghost" type="button" data-demo-login="' + email + '">' + label + " · " + email + "</button>";
  }
  function logoMini() {
    return '<a class="logo" href="index.html" style="margin-bottom:18px"><span class="logo-mark">A</span><span>Avanta</span></a>';
  }

  A.Pages.register = {
    layout: "auth",
    render: function () {
      const cities = A.state.cities;
      return (
        '<div class="auth-card" style="width:min(560px,100%)">' + logoMini() +
        "<h1>Üye Ol</h1><p class='text-muted'>Tek üyelik ile alışveriş, fırsat, ikinci el ve mağaza indirimleri.</p>" +
        '<form id="reg-form" class="grid grid-2" style="gap:12px;margin-top:16px">' +
        field("Ad", "firstName") + field("Soyad", "lastName") +
        field("E-posta", "email", "email") + field("Telefon", "phone", "tel") +
        field("Şifre", "password", "password") + field("Şifre tekrar", "password2", "password") +
        field("Doğum tarihi", "birthDate", "date") +
        '<div class="field"><label>Cinsiyet (opsiyonel)</label><select class="select" name="gender"><option value="">Seçiniz</option><option>Kadın</option><option>Erkek</option><option>Belirtmek istemiyorum</option></select></div>' +
        '<div class="field"><label>İl</label><select class="select" name="city" id="reg-city">' + cities.map(function (c) { return "<option>" + c.il + "</option>"; }).join("") + "</select></div>" +
        '<div class="field"><label>İlçe</label><select class="select" name="district" id="reg-district"></select></div>' +
        '<label class="field" style="grid-column:1/-1"><input type="checkbox" name="kvkk" required> KVKK aydınlatma metnini okudum, onaylıyorum.</label>' +
        '<label class="field" style="grid-column:1/-1"><input type="checkbox" name="terms" required> Kullanım koşullarını kabul ediyorum.</label>' +
        '<label class="field" style="grid-column:1/-1"><input type="checkbox" name="marketing"> Pazarlama iletişimine izin veriyorum.</label>' +
        '<button class="btn btn-primary" style="grid-column:1/-1" type="submit">Kayıt Ol</button></form></div>'
      );
    },
    bind: function () {
      fillDistricts();
      document.getElementById("reg-city").onchange = fillDistricts;
      document.getElementById("reg-form").onsubmit = function (e) {
        e.preventDefault();
        const fd = new FormData(e.target);
        const res = A.Services.Auth.register({
          firstName: fd.get("firstName"), lastName: fd.get("lastName"), email: fd.get("email"),
          phone: fd.get("phone"), password: fd.get("password"), password2: fd.get("password2"),
          birthDate: fd.get("birthDate"), gender: fd.get("gender"), city: fd.get("city"),
          district: fd.get("district"), kvkk: fd.get("kvkk"), terms: fd.get("terms"), marketing: fd.get("marketing")
        });
        if (!res.ok) return A.UI.toast(res.error, "error");
        location.href = "otp.html?email=" + encodeURIComponent(res.user.email);
      };
    }
  };

  function fillDistricts() {
    const city = document.getElementById("reg-city");
    const dist = document.getElementById("reg-district");
    if (!city || !dist) return;
    const found = A.state.cities.find(function (c) { return c.il === city.value; });
    dist.innerHTML = (found ? found.ilce : []).map(function (x) { return "<option>" + x + "</option>"; }).join("");
  }
  function field(label, name, type) {
    return '<div class="field"><label>' + label + '</label><input class="input" name="' + name + '" type="' + (type || "text") + '" required></div>';
  }

  A.Pages.otp = {
    layout: "auth",
    render: function () {
      return '<div class="auth-card">' + logoMini() + "<h1>Telefon / E-posta Doğrulama</h1>" +
        "<p class='text-muted'>Demo kod: <strong>123456</strong></p>" +
        '<form id="otp-form" class="grid" style="gap:12px;margin-top:16px">' +
        '<input class="input" name="otp" maxlength="6" placeholder="6 haneli kod" required>' +
        '<button class="btn btn-primary" type="submit">Doğrula</button></form></div>';
    },
    bind: function () {
      document.getElementById("otp-form").onsubmit = function (e) {
        e.preventDefault();
        const code = new FormData(e.target).get("otp");
        if (code !== "123456") return A.UI.toast("Kod hatalı (demo: 123456)", "error");
        const email = qs("email") || "user@demo.com";
        const user = A.state.users.find(function (u) { return u.email === email; }) || A.state.users.find(function (u) { return u.role === "customer"; });
        A.Services.Auth.login(user.email, user.password);
        A.UI.toast("Hesabınız doğrulandı. 100 hoş geldin puanı tanımlandı.", "success");
        location.href = "user/dashboard.html";
      };
    }
  };

  A.Pages["merchant-apply"] = {
    layout: "auth",
    render: function () {
      return '<div class="auth-card" style="width:min(720px,100%)">' + logoMini() +
        "<h1>Marka / Mağaza Başvurusu</h1><p class='text-muted'>Onay sonrası satıcı paneli açılır.</p>" +
        '<form id="m-apply" class="grid grid-2" style="gap:12px;margin-top:16px">' +
        "<h3 style='grid-column:1/-1'>Firma Bilgileri</h3>" +
        field("Firma ünvanı", "firm") + field("Marka adı", "brand") +
        field("Vergi numarası", "tax") + field("Vergi dairesi", "taxOffice") +
        field("MERSİS", "mersis") + field("Ticaret sicil no", "ticaret") +
        field("Yetkili kişi", "contact") + field("Yetkili telefon", "phone") +
        field("E-posta", "email", "email") + field("Web sitesi", "web") +
        "<h3 style='grid-column:1/-1'>Adres & Finans</h3>" +
        field("İl", "city") + field("İlçe", "district") +
        '<div class="field" style="grid-column:1/-1"><label>Açık adres</label><input class="input" name="address" required></div>' +
        field("IBAN", "iban") + field("Banka", "bank") +
        "<h3 style='grid-column:1/-1'>Belgeler (PDF/JPG, max 8MB)</h3>" +
        '<input class="input" type="file" accept=".pdf,image/jpeg,image/png" style="grid-column:1/-1">' +
        '<button class="btn btn-primary" style="grid-column:1/-1">Başvuruyu Gönder</button></form></div>';
    },
    bind: function () {
      document.getElementById("m-apply").onsubmit = function (e) {
        e.preventDefault();
        const fd = new FormData(e.target);
        A.state.applications.unshift({
          id: A.uid("ap"), brand: fd.get("brand"), firm: fd.get("firm"), category: "Diğer",
          date: new Date().toISOString(), docs: "5/5", risk: "Düşük", status: "Başvuru Alındı"
        });
        A.Services.persist();
        location.href = "merchant-pending.html";
      };
    }
  };

  A.Pages["merchant-pending"] = {
    layout: "auth",
    render: function () {
      return '<div class="auth-card" style="text-align:center">' + logoMini() +
        "<h1>Başvurunuz İnceleniyor</h1><p class='text-muted'>Durum: <span class='badge badge-info'>Başvuru Alındı</span></p>" +
        "<p>Super Admin onayladıktan sonra mağazanız aktifleşir. Demo için admin paneline gidebilirsiniz.</p>" +
        '<p style="margin-top:16px"><a class="btn btn-primary" href="admin/applications.html">Admin başvurular</a></p></div>';
    }
  };

  A.Pages.products = {
    render: function () {
      const cat = qs("cat");
      let list = A.state.products;
      if (cat) list = list.filter(function (p) { return p.category.toLowerCase().indexOf(cat) !== -1 || A.state.categories.some(function (c) { return c.id === cat && c.name === p.category; }); });
      return '<div class="container section"><div class="breadcrumb"><a href="index.html">Ana Sayfa</a> / Ürünler</div>' +
        A.Views.pageHead("Ürünler", "Elektronikten kozmetiğe Avanta mağazası.") +
        '<div class="chips" style="margin-bottom:16px">' + A.state.categories.map(function (c) {
          return '<a class="chip ' + (cat === c.id ? "active" : "") + '" href="products.html?cat=' + c.id + '">' + c.name + "</a>";
        }).join("") + "</div>" +
        '<div class="grid grid-4 product-grid-public">' + list.map(A.Views.productCard).join("") + "</div></div>";
    }
  };

  A.Pages["product-detail"] = {
    render: function () {
      const p = A.Services.Catalog.product(qs("id") || "p1") || A.state.products[0];
      const disc = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
      const similar = A.state.products.filter(function (x) { return x.category === p.category && x.id !== p.id; }).slice(0, 4);
      const revs = A.state.reviews.filter(function (r) { return r.productId === p.id; });
      const qsA = A.state.questions.filter(function (q) { return q.productId === p.id; });
      return '<div class="container section"><div class="breadcrumb"><a href="index.html">Ana Sayfa</a> / <a href="products.html">Ürünler</a> / ' + A.escape(p.name) + "</div>" +
        '<div class="grid grid-2" style="gap:28px">' +
        '<div class="gallery"><div class="gallery-main"><img alt="" src="' + A.placeholder(p.name, p.id) + '"></div>' +
        '<div class="gallery-thumbs"><button><img alt="" src="' + A.placeholder(p.name, p.id + "a") + '"></button>' +
        '<button><img alt="" src="' + A.placeholder(p.name, p.id + "b") + '"></button></div></div>' +
        "<div><div class='brand-mini'>" + A.escape(p.brand) + "</div><h1>" + A.escape(p.name) + "</h1>" +
        A.stars(p.rating) + " " + p.reviews + " değerlendirme" +
        '<div style="margin:14px 0"><span class="price" style="font-size:32px">' + A.money(p.price) + "</span> " +
        (p.oldPrice ? '<span class="price-old">' + A.money(p.oldPrice) + "</span> <span class='discount-tag'>%" + disc + "</span>" : "") + "</div>" +
        "<p>Kazanılacak loyalty puanı: <strong>" + (p.points || 0) + "</strong> · Satıcı: <a href='brand.html?id=" + p.brandId + "'>" + A.escape(p.seller) + "</a></p>" +
        "<p class='text-muted'>Teslimat: Yarın kapında · Stok: " + p.stock + " adet</p>" +
        (p.color ? '<div class="field" style="margin:12px 0"><label>Renk</label><div class="chips">' + p.color.map(function (c) { return '<button class="chip" type="button">' + c + "</button>"; }).join("") + "</div></div>" : "") +
        (p.size ? '<div class="field"><label>Beden</label><div class="chips">' + p.size.map(function (c) { return '<button class="chip">' + c + "</button>"; }).join("") + "</div></div>" : "") +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px">' +
        '<button class="btn btn-primary btn-lg" data-add-cart="' + p.id + '">Sepete Ekle</button>' +
        '<button class="btn btn-accent btn-lg" data-buy-now="' + p.id + '">Hemen Al</button>' +
        '<button class="btn btn-ghost" data-fav="products:' + p.id + '">Favori</button>' +
        '<button class="btn btn-ghost" data-price-alert="' + p.id + '">Fiyat Alarmı</button>' +
        '<a class="btn btn-ghost" href="compare.html?id=' + p.id + '">Fiyat Karşılaştır</a></div>' +
        '<div class="sticky-cta"><button class="btn btn-primary btn-block" data-add-cart="' + p.id + '">Sepete Ekle</button></div>' +
        "</div></div>" +
        '<div class="tabs" style="margin-top:28px">' +
        '<button class="tab active" data-tab="desc">Ürün Açıklaması</button>' +
        '<button class="tab" data-tab="spec">Teknik Özellikler</button>' +
        '<button class="tab" data-tab="seller">Satıcı</button>' +
        '<button class="tab" data-tab="rev">Yorumlar</button>' +
        '<button class="tab" data-tab="qa">Soru & Cevap</button></div>' +
        '<div class="card card-pad" id="tab-body" style="margin-top:12px">' + A.escape(p.desc || "Premium kalite, Avanta güvencesiyle.") + "</div>" +
        '<div class="section-title" style="margin-top:28px"><h2>Benzer Ürünler</h2></div>' +
        '<div class="grid grid-4">' + similar.map(A.Views.productCard).join("") + "</div>" +
        '<div class="section-title" style="margin-top:28px"><h2>Birlikte Satın Alınanlar</h2></div>' +
        '<div class="grid grid-4">' + A.state.products.slice(1, 5).map(A.Views.productCard).join("") + "</div></div>";
    },
    bind: function () {
      const p = A.Services.Catalog.product(qs("id") || "p1") || A.state.products[0];
      const revs = A.state.reviews.filter(function (r) { return r.productId === p.id; });
      const map = {
        desc: A.escape(p.desc || "Premium kalite."),
        spec: "<table class='data'><tr><td>SKU</td><td>" + p.sku + "</td></tr><tr><td>Stok</td><td>" + p.stock + "</td></tr><tr><td>Kategori</td><td>" + p.category + "</td></tr></table>",
        seller: "<p>" + A.escape(p.seller) + " · 4.8 puan · 18.240 takipçi</p><a class='btn btn-soft' href='brand.html?id=" + p.brandId + "'>Mağazaya git</a>",
        rev: (revs.length ? revs.map(function (r) { return "<div style='margin-bottom:12px'><strong>" + r.user + "</strong> " + A.stars(r.rating) + "<p>" + r.text + "</p></div>"; }).join("") : "Henüz yorum yok.") +
          '<form id="rev-form" class="grid" style="gap:8px;margin-top:12px"><textarea class="textarea" name="text" placeholder="Yorumunuz"></textarea><button class="btn btn-primary">Yorum gönder</button></form>',
        qa: A.state.questions.filter(function (q) { return q.productId === p.id; }).map(function (q) { return "<p><strong>S:</strong> " + q.q + "<br><strong>C:</strong> " + q.a + "</p>"; }).join("") || "Sorunuz mu var? Satıcıya sorun."
      };
      A.qsa("[data-tab]").forEach(function (t) {
        t.onclick = function () {
          A.qsa("[data-tab]").forEach(function (x) { x.classList.remove("active"); });
          t.classList.add("active");
          document.getElementById("tab-body").innerHTML = map[t.getAttribute("data-tab")];
        };
      });
    }
  };

  A.Pages.deals = {
    nav: "deals",
    render: function () {
      return '<div class="container section"><h1>Günlük Fırsatlar</h1><p class="text-muted">Groupon benzeri yerel deneyimler, Avanta puanıyla.</p>' +
        '<div class="chips" style="margin:16px 0">' + A.state.dealCategories.map(function (c, i) {
          return '<button class="chip ' + (i === 0 ? "active" : "") + '" data-deal-cat="' + c + '">' + c + "</button>";
        }).join("") + "</div>" +
        '<div class="grid grid-3" id="deal-grid">' + A.state.deals.map(A.Views.dealCard).join("") + "</div></div>";
    },
    bind: function () {
      A.qsa("[data-deal-cat]").forEach(function (b) {
        b.onclick = function () {
          A.qsa("[data-deal-cat]").forEach(function (x) { x.classList.remove("active"); });
          b.classList.add("active");
          const cat = b.getAttribute("data-deal-cat");
          const list = A.state.deals.filter(function (d) { return cat === "Restoran" ? true : d.category === cat; });
          document.getElementById("deal-grid").innerHTML = (list.length ? list : A.state.deals).map(A.Views.dealCard).join("");
        };
      });
    }
  };

  A.Pages["deal-detail"] = {
    nav: "deals",
    render: function () {
      const d = A.state.deals.find(function (x) { return x.id === (qs("id") || "d1"); }) || A.state.deals[0];
      const packs = d.packages || [{ name: "Standart", price: d.price }];
      return '<div class="container section"><div class="breadcrumb"><a href="deals.html">Fırsatlar</a> / ' + A.escape(d.title) + "</div>" +
        '<div class="grid grid-2"><div class="gallery-main"><img alt="" src="' + A.placeholder(d.title, d.id) + '"></div>' +
        "<div><div class='badge badge-orange'>" + d.category + "</div><h1>" + A.escape(d.title) + "</h1>" +
        "<p>" + A.escape(d.business) + " · " + d.city + " / " + d.district + "</p>" +
        "<p><span class='price-old'>" + A.money(d.oldPrice) + "</span> <span class='price' style='font-size:30px'>" + A.money(d.price) + "</span></p>" +
        "<p class='text-muted'>" + d.sold + " kişi satın aldı · +" + d.points + " puan</p>" +
        "<div class='field'><label>Paket seçenekleri</label>" + packs.map(function (p, i) {
          return '<label class="chip" style="display:inline-flex;margin:4px"><input type="radio" name="pack" value="' + A.escape(p.name) + '" ' + (i === 0 ? "checked" : "") + "> " + p.name + " · " + A.money(p.price) + "</label>";
        }).join("") + "</div>" +
        '<button class="btn btn-orange btn-lg" id="buy-deal">Satın Al — Dijital Voucher</button>' +
        '<div class="card card-pad" style="margin-top:16px"><h3>Kullanım koşulları</h3><p>Rezervasyon 24 saat önce yapılmalıdır. Voucher kişiye özeldir, QR ile işletmede kullanılır.</p></div>' +
        "</div></div></div>";
    },
    bind: function () {
      const id = qs("id") || "d1";
      const btn = document.getElementById("buy-deal");
      if (!btn) return;
      btn.onclick = function () {
        if (!A.Services.user()) { location.href = "login.html"; return; }
        const pack = (document.querySelector('input[name="pack"]:checked') || {}).value;
        const res = A.Services.Deals.buy(id, pack);
        if (!res.ok) return A.UI.toast(res.error, "error");
        A.UI.modal({
          title: "Voucher hazır",
          body: "<p>VOUCHER: <strong>" + res.voucher.code + "</strong></p><div class='qr-box'>" + A.qrSvg(res.voucher.code) + "</div><p>Durum: Kullanılabilir</p>",
          footer: '<a class="btn btn-primary" href="user/vouchers.html">Fırsatlarım</a>'
        });
      };
    }
  };

  A.Pages.marketplace = {
    nav: "marketplace",
    render: function () {
      return '<div class="container section"><div class="page-head"><div><h1>İkinci El Pazarı</h1><p>Letgo benzeri C2C ilanlar, güvenli mesajlaşma ile.</p></div>' +
        '<a class="btn btn-primary" href="sell.html">İlan Ver</a></div>' +
        '<div class="chips" style="margin-bottom:16px">' + A.state.listingCategories.map(function (c) {
          return '<button class="chip">' + c + "</button>";
        }).join("") + "</div>" +
        '<div class="grid grid-3">' + A.state.listings.map(A.Views.listingCard).join("") + "</div></div>";
    }
  };

  A.Pages["listing-detail"] = {
    nav: "marketplace",
    render: function () {
      const l = A.state.listings.find(function (x) { return x.id === (qs("id") || "l1"); }) || A.state.listings[0];
      return '<div class="container section"><div class="grid grid-2">' +
        '<div class="gallery-main"><img alt="" src="' + A.placeholder(l.title, l.id) + '"></div>' +
        "<div><h1>" + A.escape(l.title) + "</h1><div class='price' style='font-size:32px'>" + A.money(l.price) + "</div>" +
        "<p>" + A.escape(l.condition) + " · " + A.escape(l.city) + " / " + l.district + "</p>" +
        '<div class="card card-pad" style="margin:12px 0"><strong>' + A.escape(l.seller) + "</strong><div class='text-muted'>Üyelik: " + A.shortDate(l.memberSince) + " · " + A.stars(l.rating) + "</div></div>" +
        '<button class="btn btn-primary btn-lg" data-start-chat="' + l.id + '">Satıcıya Mesaj Gönder</button> ' +
        '<button class="btn btn-ghost" data-fav="listings:' + l.id + '">Favori</button> ' +
        '<button class="btn btn-ghost" data-share>Paylaş</button> ' +
        '<button class="btn btn-ghost" data-report>Şikayet et</button>' +
        "<h3 style='margin-top:20px'>Açıklama</h3><p>Temiz kullanılmış, tramer kayıtsız / orijinal aksesuarlarıyla. Avanta sohbetinden teklif gönderebilirsiniz.</p>" +
        "</div></div></div>";
    }
  };

  A.Pages.sell = {
    render: function () {
      return '<div class="container section"><h1>İlan Ver</h1>' +
        '<form id="sell-form" class="card card-pad grid grid-2" style="gap:12px">' +
        field("Başlık", "title") +
        '<div class="field"><label>Kategori</label><select class="select" name="category">' + A.state.listingCategories.map(function (c) { return "<option>" + c + "</option>"; }).join("") + "</select></div>" +
        field("Fiyat", "price", "number") +
        '<div class="field"><label>Ürün durumu</label><select class="select" name="condition"><option>Sıfır</option><option>Sıfıra yakın</option><option>Çok iyi</option><option>İyi</option><option>Kullanılmış</option></select></div>' +
        field("Şehir", "city") + field("İlçe", "district") +
        '<label class="field"><input type="checkbox" name="negotiable"> Pazarlık payı var</label>' +
        '<div class="field" style="grid-column:1/-1"><label>Açıklama</label><textarea class="textarea" name="desc"></textarea></div>' +
        '<button class="btn btn-primary">Yayınla</button></form></div>';
    },
    bind: function () {
      document.getElementById("sell-form").onsubmit = function (e) {
        e.preventDefault();
        if (!A.Services.user()) { location.href = "login.html"; return; }
        const fd = new FormData(e.target);
        const res = A.Services.Listings.create(Object.fromEntries(fd.entries()));
        if (!res.ok) return A.UI.toast(res.error, "error");
        A.UI.toast("İlan yayınlandı", "success");
        location.href = "listing-detail.html?id=" + res.listing.id;
      };
    }
  };

  A.Pages.compare = {
    render: function () {
      const p = A.Services.Catalog.product(qs("id") || "p1") || A.state.products[0];
      const offers = A.state.offers.filter(function (o) { return o.productId === p.id; });
      const hist = A.state.priceHistory[p.id] || [p.price];
      return '<div class="container section"><h1>Fiyat Karşılaştır</h1><p>' + A.escape(p.name) + "</p>" +
        '<div class="card card-pad" style="margin:12px 0"><strong>Son 90 günün en düşük fiyatına %3 yakın.</strong> Akıllı bilgi demo verisine göredir.</div>' +
        A.UI.table(
          [{ key: "store", label: "Mağaza" }, { key: "price", label: "Fiyat" }, { key: "shipping", label: "Kargo" }, { key: "sellerRating", label: "Satıcı puanı" }, { key: "delivery", label: "Teslimat" }],
          offers.map(function (o) {
            return { store: o.store, price: A.money(o.price), shipping: o.shipping ? A.money(o.shipping) : "Ücretsiz", sellerRating: o.sellerRating, delivery: o.delivery };
          })
        ) +
        '<div class="card chart-card" style="margin-top:16px"><div class="chips" id="range-chips"><button class="chip active" data-range="30">Son 30 Gün</button><button class="chip" data-range="90">Son 3 Ay</button><button class="chip" data-range="180">Son 6 Ay</button><button class="chip" data-range="365">1 Yıl</button></div>' +
        '<canvas id="price-chart" height="110"></canvas></div>' +
        '<p style="margin-top:12px"><button class="btn btn-primary" data-price-alert="' + p.id + '">Fiyat Alarmı Oluştur</button></p></div>';
    },
    bind: function () {
      const canvas = document.getElementById("price-chart");
      if (!canvas || !window.Chart) return;
      const p = A.Services.Catalog.product(qs("id") || "p1") || A.state.products[0];
      const hist = A.state.priceHistory[p.id] || [p.price];
      if (window.__priceChart) window.__priceChart.destroy();
      window.__priceChart = new Chart(canvas, {
        type: "line",
        data: { labels: hist.map(function (_, i) { return "Gün " + (i + 1); }), datasets: [{ label: "Fiyat", data: hist, borderColor: "#6d5efc", backgroundColor: "rgba(109,94,252,.12)", fill: true, tension: 0.3 }] },
        options: { plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: function (v) { return "₺" + v; } } } } }
      });
    }
  };

  A.Pages.stores = {
    render: function () {
      return '<div class="container section"><h1>Fiziksel Mağazalar</h1><p class="text-muted">Yakınındaki anlaşmalı işletmeler ve QR indirimleri.</p>' +
        '<div class="chips" style="margin:16px 0"><button class="chip active">Yakınımdaki</button><button class="chip">En yüksek indirim</button><button class="chip">En popüler</button>' +
        ["Restoran", "Giyim", "Market", "Teknoloji", "Eğlence", "Sağlık", "Güzellik", "Otel", "Seyahat"].map(function (c) { return '<button class="chip">' + c + "</button>"; }).join("") +
        "</div><div class='grid grid-3'>" + A.state.stores.map(A.Views.storeCard).join("") + "</div></div>";
    }
  };

  A.Pages["store-detail"] = {
    render: function () {
      const s = A.state.stores.find(function (x) { return x.id === (qs("id") || "s1"); }) || A.state.stores[0];
      return '<div class="container section"><h1>' + A.escape(s.name) + "</h1><p>" + A.escape(s.address) + " · " + s.phone + "</p>" +
        '<div class="card card-pad"><p>QR Terminal: ' + s.terminal + "</p><p>Geçerli kampanya: %" + s.discount + " seviye indirimi + 2X puan</p>" +
        '<a class="btn btn-primary" href="pos/index.html?store=' + s.id + '">Mağaza POS ekranı</a></div></div>';
    }
  };

  A.Pages.brands = {
    render: function () {
      return '<div class="container section"><h1>Markalar</h1><div class="grid grid-3" style="margin-top:16px">' +
        A.state.brands.filter(function (b) { return b.status === "Onaylandı"; }).map(A.Views.brandCard).join("") + "</div></div>";
    }
  };

  A.Pages.brand = {
    render: function () {
      const b = A.Services.Catalog.brand(qs("id") || "b-urbanwear") || A.state.brands[0];
      const prods = A.state.products.filter(function (p) { return p.brandId === b.id; });
      const followed = (A.state.follows || []).indexOf(b.id) !== -1;
      return '<div class="container section"><div class="card card-pad" style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap">' +
        "<div style='display:flex;gap:14px'><div class='avatar avatar-lg'>" + b.logo + "</div><div><h1>" + A.escape(b.name) + "</h1>" +
        A.stars(b.rating) + " · " + A.number(b.followers) + " takipçi</div></div>" +
        '<button class="btn ' + (followed ? "btn-ghost" : "btn-primary") + '" data-follow="' + b.id + '">' + (followed ? "Takiptesin" : "Markayı Takip Et") + "</button></div>" +
        '<div class="tabs" style="margin:16px 0"><span class="tab active">Ürünler</span><span class="tab">Fırsatlar</span><span class="tab">Mağazalar</span><span class="tab">Kampanyalar</span><span class="tab">Hakkında</span></div>' +
        '<div class="grid grid-4">' + (prods.length ? prods : A.state.products.slice(0, 4)).map(A.Views.productCard).join("") + "</div></div>";
    }
  };

  A.Pages.cart = {
    render: function () {
      const items = A.Services.Cart.items();
      if (!items.length) return '<div class="container section">' + A.UI.empty("Sepetiniz boş", "Beğendiğiniz ürünleri sepete ekleyin.", "Ürünleri Keşfet", "products.html") + "</div>";
      const groups = {};
      items.forEach(function (i) {
        groups[i.product.seller] = groups[i.product.seller] || [];
        groups[i.product.seller].push(i);
      });
      const tot = A.Services.Cart.totals({ coupon: A.state._coupon, points: A.state._pointsUse || 0 });
      let html = '<div class="container section"><h1>Sepet</h1><div class="grid grid-2" style="align-items:start;margin-top:16px"><div>';
      Object.keys(groups).forEach(function (seller) {
        html += '<div class="card card-pad" style="margin-bottom:12px"><h3>' + A.escape(seller) + "</h3>";
        groups[seller].forEach(function (i) {
          html += '<div style="display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)">' +
            "<div><strong>" + A.escape(i.product.name) + "</strong><div class='text-muted'>" + A.money(i.product.price) + "</div></div>" +
            '<div style="display:flex;gap:6px;align-items:center"><button class="btn-icon" data-qty="' + i.productId + ':-1">−</button>' +
            "<span>" + i.qty + "</span><button class='btn-icon' data-qty='" + i.productId + ":1'>+</button>" +
            '<button class="btn btn-ghost btn-sm" data-remove-cart="' + i.productId + '">Sil</button></div></div>';
        });
        html += "</div>";
      });
      html += '</div><aside class="card card-pad"><h3>Sipariş özeti</h3>' +
        row("Ara Toplam", A.money(tot.sub)) + row("Ürün İndirimi", "− " + A.money(tot.disc)) +
        row("Kupon", "− " + A.money(tot.coupon)) + row("Loyalty Puan Kullanımı", "− " + A.money(tot.pointsValue)) +
        row("Kargo", tot.ship ? A.money(tot.ship) : "Ücretsiz") +
        "<hr><div style='display:flex;justify-content:space-between'><strong>Genel Toplam</strong><strong>" + A.money(tot.grand) + "</strong></div>" +
        '<input class="input" id="coupon-code" placeholder="Kupon kodu" style="margin:12px 0" value="' + (A.state._coupon || "") + '">' +
        '<button class="btn btn-ghost btn-block" id="apply-coupon">Kuponu Uygula</button>' +
        '<a class="btn btn-primary btn-block" style="margin-top:8px" href="checkout.html">Ödemeye Geç</a></aside></div></div>';
      return html;
    },
    bind: function () {
      const btn = document.getElementById("apply-coupon");
      if (!btn) return;
      btn.onclick = function () {
        A.state._coupon = document.getElementById("coupon-code").value.trim().toUpperCase();
        A.Services.persist();
        A.UI.toast("Kupon uygulandı (demo)", "success");
        A.App.refresh();
      };
    }
  };

  function row(l, r) {
    return "<div style='display:flex;justify-content:space-between;margin:6px 0'><span class='text-muted'>" + l + "</span><span>" + r + "</span></div>";
  }

  A.Pages.checkout = {
    render: function () {
      const u = A.Services.user();
      const tot = A.Services.Cart.totals({ coupon: A.state._coupon, points: A.state._pointsUse || 0 });
      const points = u ? u.spendable : 0;
      return '<div class="container section"><div class="checkout-steps">' +
        "<span class='done'>Sepet</span><span>›</span><span class='active'>Adres</span><span>›</span><span>Teslimat</span><span>›</span><span>Ödeme</span><span>›</span><span>Onay</span></div>" +
        '<form id="checkout-form" class="grid grid-2">' +
        '<div class="card card-pad"><h3>Teslimat adresi</h3>' +
        '<input class="input" name="address" value="Caferağa Mah. Moda Cad. No:14, Kadıköy / İstanbul" required style="margin:8px 0">' +
        "<h3>Teslimat</h3><label class='chip'><input type='radio' name='ship' checked> Standart (ücretsiz)</label> " +
        "<label class='chip'><input type='radio' name='ship'> Express +₺79</label>" +
        "<h3 style='margin-top:12px'>Ödeme</h3>" +
        ["Kredi kartı", "Banka kartı", "Havale", "Cüzdan bakiyesi"].map(function (p, i) {
          return "<label class='chip'><input type='radio' name='payment' value='" + p + "' " + (i === 0 ? "checked" : "") + "> " + p + "</label> ";
        }).join("") +
        "<p style='margin-top:12px'><strong>" + A.number(points) + " puanınız var.</strong> " +
        Math.min(750, points) + " puan kullanmak ister misiniz?</p>" +
        '<label><input type="checkbox" id="use-points"> 750 puana kadar kullan (₺75)</label>' +
        "</div><aside class='card card-pad'><h3>Özet</h3>" + row("Genel Toplam", A.money(tot.grand)) +
        "<p class='text-muted'>Bu siparişle ~" + tot.earn + " puan kazanacaksınız.</p>" +
        '<button class="btn btn-primary btn-block" type="submit">Ödeme Yap</button>' +
        "<p class='text-muted' style='font-size:12px;margin-top:8px'>iyzico / PayTR / Stripe adapter altyapısına hazır demo.</p></aside></form></div>";
    },
    bind: function () {
      const form = document.getElementById("checkout-form");
      if (!form) return;
      form.onsubmit = function (e) {
        e.preventDefault();
        if (!A.Services.user()) { location.href = "login.html"; return; }
        const use = document.getElementById("use-points").checked;
        A.state._pointsUse = use ? 750 : 0;
        const fd = new FormData(form);
        const res = A.Services.Orders.checkout({
          address: fd.get("address"), payment: fd.get("payment"), coupon: A.state._coupon, points: A.state._pointsUse
        });
        if (!res.ok) return A.UI.toast(res.error, "error");
        A.UI.modal({
          title: "Demo ödeme işlemi başarıyla tamamlandı.",
          body: "<p>Sipariş no: <strong>" + res.order.id + "</strong></p><p>Kazanılan puan: " + res.order.pointsEarned + "</p>",
          footer: '<a class="btn btn-primary" href="user/orders.html">Siparişlerim</a>'
        });
      };
    }
  };

  A.Pages.loyalty = {
    render: function () {
      return '<div class="container section"><h1>Avanta Loyalty</h1><p class="text-muted">₺100 alışveriş = 10 puan. Seviyenize göre cashback ve mağaza indirimi.</p>' +
        '<div class="grid grid-4" style="margin-top:16px">' + A.state.tiers.map(function (t) {
          return '<div class="card card-pad"><h3 class="tier-' + t.id + '">' + t.name + "</h3><p>" + A.number(t.min) + " – " + (t.max > 1e8 ? "+" : A.number(t.max)) + " puan</p>" +
            "<ul><li>Cashback %" + t.cashback + "</li><li>Ekstra puan %" + t.extraPoints + "</li><li>" + (t.freeShipping ? "Ücretsiz teslimat" : "Standart kargo") + "</li>" +
            "<li>Doğum günü +" + t.birthday + "</li><li>" + (t.earlyAccess ? "Erken erişim" : "Standart erişim") + "</li></ul></div>";
        }).join("") + "</div></div>";
    }
  };

  A.Pages.search = {
    render: function () {
      const q = qs("q") || "";
      const res = A.Services.Catalog.search(q);
      return '<div class="container section"><h1>Arama: ' + A.escape(q) + "</h1>" +
        "<h3>Ürünler</h3><div class='grid grid-4'>" + (res.products.map(A.Views.productCard).join("") || A.UI.empty("Sonuç yok", "Farklı bir kelime deneyin.")) + "</div>" +
        "<h3 style='margin-top:20px'>Markalar</h3><div class='grid grid-3'>" + res.brands.map(A.Views.brandCard).join("") + "</div>" +
        "<h3 style='margin-top:20px'>İlanlar</h3><div class='grid grid-3'>" + res.listings.map(A.Views.listingCard).join("") + "</div>" +
        "<h3 style='margin-top:20px'>Fiyat Karşılaştırma</h3><p><a href='compare.html'>Karşılaştırma sonuçları</a></p></div>";
    }
  };

  A.Pages.help = {
    render: function () {
      return '<div class="container section"><h1>Yardım Merkezi</h1>' +
        '<form class="search-bar" style="max-width:640px;margin:16px 0" data-global-search><input name="q" placeholder="Size nasıl yardımcı olabiliriz?"></form>' +
        '<div class="grid grid-4">' + ["Sipariş", "Ödeme", "İade", "Loyalty", "Fırsatlar", "İkinci El", "Satıcı", "Hesap"].map(function (c) {
          return '<div class="card card-pad"><h3>' + c + "</h3>" + A.state.helpArticles.filter(function (a) { return a.cat === c; }).map(function (a) {
            return "<p><strong>" + a.title + "</strong><br>" + a.body + "</p>";
          }).join("") + "</div>";
        }).join("") + "</div>" +
        '<p style="margin-top:20px"><a class="btn btn-primary" href="help/contact.html">Destek talebi oluştur</a></p></div>';
    }
  };

  A.Pages.contact = {
    render: function () {
      return '<div class="container section"><h1>Destek Talebi</h1>' +
        '<form id="ticket-form" class="card card-pad grid" style="gap:12px;max-width:640px">' +
        '<select class="select" name="category"><option>Sipariş</option><option>Ödeme</option><option>Loyalty</option></select>' +
        '<input class="input" name="subject" placeholder="Konu" required>' +
        '<input class="input" name="order" placeholder="Sipariş no (opsiyonel)">' +
        '<textarea class="textarea" name="msg" placeholder="Mesaj"></textarea>' +
        '<button class="btn btn-primary">Gönder</button></form></div>';
    },
    bind: function () {
      document.getElementById("ticket-form").onsubmit = function (e) {
        e.preventDefault();
        A.state.tickets.unshift({ id: "TK-" + (1100 + A.state.tickets.length), category: "Sipariş", subject: "Yeni talep", status: "Yeni", at: new Date().toISOString() });
        A.Services.persist();
        A.UI.toast("Destek talebiniz alındı.", "success");
      };
    }
  };

  A.Pages.privacyLegal = {
    render: function () {
      return '<div class="container section"><h1>KVKK Aydınlatma Metni</h1><p>Avanta, 6698 sayılı Kanun kapsamında kişisel verilerinizi sipariş, sadakat, güvenlik ve yasal yükümlülükler için işler. Haklarınız için Gizlilik Merkezi’ni kullanabilirsiniz.</p></div>';
    }
  };

  ["404", "403", "500", "maintenance", "offline"].forEach(function (code) {
    A.Pages[code] = {
      layout: "auth",
      render: function () {
        const map = {
          "404": ["Sayfa bulunamadı", "Aradığınız içerik taşınmış olabilir."],
          "403": ["Erişim yok", "Bu sayfayı görüntüleme yetkiniz bulunmuyor."],
          "500": ["Bir şeyler ters gitti", "Teknik ekipten destek alıyoruz."],
          maintenance: ["Bakım Modu", "Kısa süreli bakımdayız."],
          offline: ["Çevrimdışısınız", "Bağlantınızı kontrol edin."]
        };
        const t = map[code];
        return '<div class="auth-card" style="text-align:center"><h1>' + t[0] + "</h1><p class='text-muted'>" + t[1] + "</p>" +
          '<p style="margin-top:16px"><a class="btn btn-primary" href="index.html">Ana Sayfa</a></p></div>';
      }
    };
  });
})(window.Avanta);
