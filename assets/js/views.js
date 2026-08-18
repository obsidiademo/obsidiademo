window.Avanta = window.Avanta || {};

(function (A) {
  function img(label, seed) {
    return A.placeholder(label, seed);
  }

  A.Views = {
    productCard: function (p) {
      const disc = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
      const fav = A.Services.Favorites.has("products", p.id);
      return (
        '<article class="product-card">' +
        '<a href="' + A.path.to("product-detail.html") + "?id=" + p.id + '"><div class="thumb">' +
        '<img alt="' + A.escape(p.name) + '" loading="lazy" src="' + img(p.name, p.id) + '">' +
        (p.sponsored ? '<span class="badge badge-purple" style="position:absolute;left:10px;top:10px">Sponsorlu</span>' : "") +
        (disc ? '<span class="discount-tag" style="position:absolute;left:10px;bottom:10px">%' + disc + "</span>" : "") +
        "</div></a>" +
        '<button class="btn-icon" data-fav="products:' + p.id + '" aria-label="Favori" style="position:absolute;margin-top:-200px;right:10px;display:none"></button>' +
        '<div class="card-body">' +
        '<div class="brand-mini">' + A.escape(p.brand) + "</div>" +
        '<a href="' + A.path.to("product-detail.html") + "?id=" + p.id + '"><strong>' + A.escape(p.name) + "</strong></a>" +
        A.stars(p.rating) + " <span class='text-muted'>(" + A.number(p.reviews) + ")</span>" +
        '<div style="display:flex;gap:8px;align-items:baseline;flex-wrap:wrap">' +
        '<span class="price">' + A.money(p.price) + "</span>" +
        (p.oldPrice ? '<span class="price-old">' + A.money(p.oldPrice) + "</span>" : "") +
        "</div>" +
        '<div class="text-muted" style="font-size:12px">+' + (p.points || 0) + " puan · " + (p.freeShipping ? "Ücretsiz kargo" : "Kargo hesaplanır") + "</div>" +
        '<div style="display:flex;gap:8px;margin-top:auto">' +
        '<button class="btn btn-primary btn-sm" data-add-cart="' + p.id + '">Sepete</button>' +
        '<button class="btn btn-ghost btn-sm" data-fav="products:' + p.id + '">' + (fav ? "♥" : "♡") + "</button></div>" +
        "</div></article>"
      );
    },
    dealCard: function (d) {
      const disc = Math.round((1 - d.price / d.oldPrice) * 100);
      const c = A.countdown(d.left);
      return (
        '<article class="deal-card">' +
        '<a href="' + A.path.to("deal-detail.html") + "?id=" + d.id + '"><div class="thumb">' +
        '<img alt="" loading="lazy" src="' + img(d.title, d.id) + '">' +
        '<span class="discount-tag" style="position:absolute;left:10px;top:10px">%' + disc + " İNDİRİM</span></div></a>" +
        '<div class="card-body">' +
        '<div class="brand-mini">' + A.escape(d.business) + " · " + A.escape(d.city) + "</div>" +
        "<strong>" + A.escape(d.title) + "</strong>" +
        '<div><span class="price-old">' + A.money(d.oldPrice) + '</span> <span class="price">' + A.money(d.price) + "</span></div>" +
        '<div class="text-muted">' + c.days + " gün " + A.pad(c.hours) + ":" + A.pad(c.minutes) + " kaldı · " + d.sold + " kişi satın aldı</div>" +
        A.stars(d.rating) +
        "</div></article>"
      );
    },
    listingCard: function (l) {
      return (
        '<article class="listing-card"><a href="' + A.path.to("listing-detail.html") + "?id=" + l.id + '">' +
        '<div class="thumb"><img alt="" loading="lazy" src="' + img(l.title, l.id) + '"></div>' +
        '<div class="card-body"><strong>' + A.escape(l.title) + "</strong>" +
        '<div class="price">' + A.money(l.price) + (l.negotiable ? ' <span class="badge">Pazarlık</span>' : "") + "</div>" +
        '<div class="text-muted">' + A.escape(l.city) + " / " + A.escape(l.district) + " · " + A.escape(l.condition) + "</div>" +
        "</div></a></article>"
      );
    },
    storeCard: function (s) {
      return (
        '<article class="store-card"><div class="card-body">' +
        '<div style="display:flex;gap:12px"><div class="avatar">' + A.escape((s.name || "?").charAt(0)) + "</div><div>" +
        "<strong>" + A.escape(s.name) + '</strong><div class="text-muted">' + A.escape(s.category) + " · " + s.distance + " km</div></div></div>" +
        "<p class='text-muted' style='margin-top:8px'>" + A.escape(s.address) + "</p>" +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">' +
        '<span class="badge badge-orange">%' + s.discount + " indirim</span>" +
        '<span class="badge badge-neutral">' + A.escape(s.hours) + "</span>" +
        A.stars(s.rating) +
        "</div>" +
        '<div style="display:flex;gap:8px;margin-top:12px">' +
        '<a class="btn btn-primary btn-sm" href="' + A.path.to("store-detail.html") + "?id=" + s.id + '">Detay</a>' +
        '<a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="https://maps.google.com/?q=' + s.lat + "," + s.lng + '">Yol tarifi</a></div>' +
        "</div></article>"
      );
    },
    brandCard: function (b) {
      return (
        '<a class="brand-card card-pad" href="' + A.path.to("brand.html") + "?id=" + b.id + '" style="display:flex;gap:12px;align-items:center">' +
        '<div class="avatar avatar-lg">' + A.escape(b.logo) + "</div><div><strong>" + A.escape(b.name) + "</strong>" +
        '<div class="text-muted">' + A.stars(b.rating) + " · " + A.number(b.followers) + " takipçi</div></div></a>"
      );
    },
    pageHead: function (title, desc, cta) {
      return '<div class="page-head"><div><h1>' + A.escape(title) + "</h1><p>" + A.escape(desc || "") + "</p></div>" + (cta || "") + "</div>";
    }
  };
})(window.Avanta);
