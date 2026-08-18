window.Avanta = window.Avanta || {};

(function (A) {
  let state = null;

  function persist() {
    A.Store.save(state);
  }

  function currentUser() {
    if (!state.session) return null;
    return state.users.find(function (u) { return u.id === state.session.userId; }) || null;
  }

  function tierOf(points) {
    const p = Number(points) || 0;
    return state.tiers.find(function (t) { return p >= t.min && p <= t.max; }) || state.tiers[0];
  }

  A.Services = {
    boot: function () {
      state = A.Store.load();
      A.state = state;
      return state;
    },
    getState: function () { return state; },
    persist: persist,
    user: currentUser,
    tier: function (user) { return tierOf((user || currentUser() || {}).points); },

    Auth: {
      login: function (email, password) {
        const gate = A.Security.canAttempt(email);
        if (!gate.ok) return { ok: false, error: "Çok fazla deneme. " + gate.wait + " sn bekleyin." };
        const user = state.users.find(function (u) {
          return u.email.toLowerCase() === String(email).toLowerCase() && u.password === password;
        });
        if (!user) {
          A.Security.recordFail(email);
          return { ok: false, error: "E-posta veya şifre hatalı." };
        }
        A.Security.recordOk(email);
        state.session = { userId: user.id, at: new Date().toISOString(), csrf: A.Security.csrf() };
        persist();
        A.Services.Audit.log(user.email, "Giriş yapıldı", "session", user.id);
        return { ok: true, user: user };
      },
      logout: function () {
        const u = currentUser();
        if (u) A.Services.Audit.log(u.email, "Çıkış yapıldı", "session", u.id);
        state.session = null;
        persist();
      },
      register: function (payload) {
        if (!A.Security.emailValid(payload.email)) return { ok: false, error: "Geçerli e-posta girin." };
        if (!A.Security.passwordValid(payload.password)) return { ok: false, error: "Şifre en az 6 karakter olmalı." };
        if (payload.password !== payload.password2) return { ok: false, error: "Şifreler eşleşmiyor." };
        if (!payload.kvkk || !payload.terms) return { ok: false, error: "KVKK ve kullanım koşulları onayı zorunlu." };
        if (state.users.some(function (u) { return u.email === payload.email; })) return { ok: false, error: "Bu e-posta zaten kayıtlı." };
        const user = {
          id: A.uid("u"),
          firstName: A.Security.sanitize(payload.firstName),
          lastName: A.Security.sanitize(payload.lastName),
          email: payload.email.trim(),
          password: payload.password,
          phone: payload.phone,
          role: "customer",
          city: payload.city,
          district: payload.district,
          birthDate: payload.birthDate,
          gender: payload.gender || "",
          loyaltyId: "LYT-" + String(10000000 + (A.hash(payload.email) % 89999999)),
          points: 100,
          spendable: 100,
          wallet: 0,
          cashbackPending: 0,
          referral: (payload.firstName || "AVN").toUpperCase().slice(0, 8) + "250",
          tier: "Bronze",
          marketing: !!payload.marketing
        };
        state.users.push(user);
        state.loyaltyTx.push({
          id: A.uid("t"), userId: user.id, type: "bonus", amount: 100, source: "kayıt",
          referenceId: "WELCOME", balanceBefore: 0, balanceAfter: 100, createdAt: new Date().toISOString()
        });
        persist();
        return { ok: true, user: user };
      },
      requireRole: function (roles) {
        const u = currentUser();
        if (!u) return false;
        if (!roles || !roles.length) return true;
        return roles.indexOf(u.role) !== -1 || u.role === "super_admin";
      }
    },

    Catalog: {
      products: function () { return state.products; },
      product: function (id) { return state.products.find(function (p) { return p.id === id; }); },
      brands: function () { return state.brands; },
      brand: function (id) { return state.brands.find(function (b) { return b.id === id; }); },
      search: function (q) {
        const s = String(q || "").toLowerCase().trim();
        if (!s) return { products: [], brands: [], deals: [], listings: [] };
        function has(obj) {
          return JSON.stringify(obj).toLowerCase().indexOf(s) !== -1;
        }
        return {
          products: state.products.filter(has).slice(0, 6),
          brands: state.brands.filter(has).slice(0, 4),
          deals: state.deals.filter(has).slice(0, 4),
          listings: state.listings.filter(has).slice(0, 4)
        };
      }
    },

    Cart: {
      items: function () {
        return (state.cart || []).map(function (line) {
          const p = A.Services.Catalog.product(line.productId);
          return Object.assign({}, line, { product: p });
        }).filter(function (x) { return x.product; });
      },
      add: function (productId, qty) {
        const n = qty || 1;
        const found = state.cart.find(function (c) { return c.productId === productId; });
        if (found) found.qty += n;
        else state.cart.push({ productId: productId, qty: n });
        persist();
      },
      setQty: function (productId, qty) {
        const found = state.cart.find(function (c) { return c.productId === productId; });
        if (!found) return;
        found.qty = Math.max(1, qty);
        persist();
      },
      remove: function (productId) {
        state.cart = state.cart.filter(function (c) { return c.productId !== productId; });
        persist();
      },
      clear: function () { state.cart = []; persist(); },
      totals: function (opts) {
        opts = opts || {};
        const items = this.items();
        let sub = 0;
        let disc = 0;
        items.forEach(function (i) {
          sub += i.product.price * i.qty;
          disc += Math.max(0, (i.product.oldPrice - i.product.price) * i.qty);
        });
        let coupon = 0;
        if (opts.coupon) {
          const c = state.coupons.find(function (x) { return x.code === opts.coupon && x.status === "Aktif"; });
          if (c && sub >= (c.min || 0)) {
            if (c.type === "sabit") coupon = c.value;
            else if (c.type === "yüzde" || c.type === "kategori") coupon = sub * (c.value / 100);
          }
        }
        const shipBase = items.every(function (i) { return i.product.freeShipping; }) ? 0 : 39.9;
        const ship = (opts.coupon === "KARGO0" && sub >= 250) ? 0 : shipBase;
        let pointsUse = Math.min(Number(opts.points) || 0, (currentUser() || {}).spendable || 0);
        const pointsValue = pointsUse * 0.1;
        const grand = Math.max(0, sub - coupon - pointsValue + ship);
        const earn = Math.round(grand * (state.rate || 0.1));
        return { sub: sub, disc: disc, coupon: coupon, ship: ship, pointsUse: pointsUse, pointsValue: pointsValue, grand: grand, earn: earn };
      }
    },

    Favorites: {
      toggle: function (type, id) {
        const arr = state.favorites[type] || [];
        const i = arr.indexOf(id);
        if (i >= 0) arr.splice(i, 1);
        else arr.push(id);
        state.favorites[type] = arr;
        persist();
        return arr.indexOf(id) !== -1;
      },
      has: function (type, id) {
        return (state.favorites[type] || []).indexOf(id) !== -1;
      }
    },

    Loyalty: {
      checkin: function () {
        const u = currentUser();
        if (!u) return { ok: false, error: "Giriş yapın." };
        const today = A.shortDate(new Date());
        if (state.checkinDate === today) return { ok: false, error: "Bugünkü check-in zaten yapıldı." };
        state.checkinDate = today;
        this.earn(u.id, 20, "check-in", "CHK-" + today.replace(/\./g, ""));
        return { ok: true, amount: 20 };
      },
      earn: function (userId, amount, source, ref) {
        const u = state.users.find(function (x) { return x.id === userId; });
        if (!u) return;
        const before = u.points || 0;
        u.points = before + amount;
        u.spendable = (u.spendable || 0) + amount;
        const t = tierOf(u.points);
        u.tier = t.name;
        state.loyaltyTx.unshift({
          id: A.uid("t"), userId: userId, type: amount >= 0 ? "earn" : "spend", amount: amount,
          source: source, referenceId: ref, balanceBefore: before, balanceAfter: u.points, createdAt: new Date().toISOString()
        });
        persist();
      },
      spend: function (userId, amount, source, ref) {
        const u = state.users.find(function (x) { return x.id === userId; });
        if (!u || (u.spendable || 0) < amount) return false;
        u.spendable -= amount;
        u.points = Math.max(0, (u.points || 0) - 0);
        state.loyaltyTx.unshift({
          id: A.uid("t"), userId: userId, type: "spend", amount: -amount,
          source: source, referenceId: ref, balanceBefore: u.spendable + amount, balanceAfter: u.spendable, createdAt: new Date().toISOString()
        });
        persist();
        return true;
      }
    },

    Orders: {
      checkout: function (payload) {
        const u = currentUser();
        if (!u) return { ok: false, error: "Giriş yapın." };
        const items = A.Services.Cart.items();
        if (!items.length) return { ok: false, error: "Sepet boş." };
        const tot = A.Services.Cart.totals(payload);
        if (tot.pointsUse) A.Services.Loyalty.spend(u.id, tot.pointsUse, "checkout", "ORDER");
        const id = "AV-" + (10660 + state.orders.length);
        const order = {
          id: id,
          userId: u.id,
          items: items.map(function (i) { return { productId: i.productId, name: i.product.name, qty: i.qty, price: i.product.price, seller: i.product.seller }; }),
          total: tot.grand,
          status: "Ödeme Alındı",
          date: new Date().toISOString(),
          pointsEarned: tot.earn,
          address: payload.address || (u.city + " / " + u.district),
          coupon: payload.coupon || "",
          payment: payload.payment || "Kredi kartı"
        };
        state.orders.unshift(order);
        A.Services.Loyalty.earn(u.id, tot.earn, "online", id);
        A.Services.Cart.clear();
        state.notifications.unshift({
          id: A.uid("n"), title: "Siparişiniz alındı", body: id + " numaralı sipariş hazırlanıyor.", at: new Date().toISOString(), type: "sipariş", unread: true
        });
        A.Services.Audit.log(u.email, "Sipariş oluşturuldu", "order", id);
        persist();
        return { ok: true, order: order };
      }
    },

    Deals: {
      buy: function (dealId, packName) {
        const u = currentUser();
        if (!u) return { ok: false, error: "Giriş yapın." };
        const deal = state.deals.find(function (d) { return d.id === dealId; });
        if (!deal) return { ok: false, error: "Fırsat bulunamadı." };
        deal.sold += 1;
        const code = "DEAL-" + A.hash(dealId + Date.now()).toString(16).toUpperCase().slice(0, 6);
        const voucher = { id: A.uid("v"), code: code, dealId: dealId, pack: packName, status: "Kullanılabilir", at: new Date().toISOString() };
        state.vouchers.unshift(voucher);
        A.Services.Loyalty.earn(u.id, deal.points || 5, "fırsat", code);
        persist();
        return { ok: true, voucher: voucher };
      }
    },

    Chat: {
      send: function (convId, text, extra) {
        const u = currentUser();
        if (!u) return { ok: false };
        const conv = state.conversations.find(function (c) { return c.id === convId; });
        if (!conv) return { ok: false };
        const msg = Object.assign({ id: A.uid("m"), from: u.id, text: A.Security.sanitize(text), at: new Date().toISOString() }, extra || {});
        conv.messages.push(msg);
        persist();
        return { ok: true, msg: msg };
      },
      start: function (listingId) {
        const u = currentUser();
        const listing = state.listings.find(function (l) { return l.id === listingId; });
        if (!u || !listing) return null;
        let conv = state.conversations.find(function (c) { return c.listingId === listingId && c.userIds.indexOf(u.id) !== -1; });
        if (!conv) {
          conv = {
            id: A.uid("cv"), listingId: listingId, title: listing.title, with: listing.seller, withId: listing.sellerId,
            userIds: [u.id, listing.sellerId], messages: []
          };
          state.conversations.unshift(conv);
          persist();
        }
        return conv;
      }
    },

    Listings: {
      create: function (payload) {
        const u = currentUser();
        if (!u) return { ok: false, error: "Giriş yapın." };
        const item = {
          id: A.uid("l"),
          title: A.Security.sanitize(payload.title),
          category: payload.category,
          price: Number(payload.price) || 0,
          negotiable: !!payload.negotiable,
          condition: payload.condition,
          city: payload.city,
          district: payload.district,
          sellerId: u.id,
          seller: u.firstName + " " + (u.lastName || "").charAt(0) + ".",
          memberSince: "2026-01-01",
          rating: 5,
          date: new Date().toISOString(),
          status: "Aktif",
          desc: A.Security.sanitize(payload.desc || "")
        };
        state.listings.unshift(item);
        persist();
        return { ok: true, listing: item };
      }
    },

    Alerts: {
      add: function (productId, target) {
        state.priceAlerts = state.priceAlerts.filter(function (a) { return a.productId !== productId; });
        state.priceAlerts.push({ productId: productId, target: Number(target) });
        persist();
      }
    },

    Audit: {
      log: function (user, action, entity, entityId) {
        state.logs.unshift({
          user: user, action: action, entity: entity, entityId: entityId,
          ip: "185.25.12.8", at: new Date().toISOString()
        });
        persist();
      }
    },

    Admin: {
      setMerchantStatus: function (id, status) {
        const b = state.brands.find(function (x) { return x.id === id; });
        if (b) b.status = status;
        const ap = state.applications.find(function (x) { return x.brand === (b && b.name); });
        if (ap) ap.status = status;
        const u = currentUser();
        A.Services.Audit.log(u ? u.email : "system", "Marka durumu: " + status, (b && b.name) || id, id);
        persist();
      }
    }
  };
})(window.Avanta);
