window.Avanta = window.Avanta || {};

(function (A) {
  A.Security = {
    sanitize: function (input) {
      return A.escape(String(input || "").trim());
    },
    emailValid: function (email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
    },
    phoneValid: function (phone) {
      return /^(\+90|0)?5\d{9}$/.test(String(phone || "").replace(/\s/g, ""));
    },
    passwordValid: function (pw) {
      return String(pw || "").length >= 6;
    },
    loginAttempts: {},
    canAttempt: function (email) {
      const rec = this.loginAttempts[email] || { n: 0, until: 0 };
      if (Date.now() < rec.until) return { ok: false, wait: Math.ceil((rec.until - Date.now()) / 1000) };
      return { ok: true };
    },
    recordFail: function (email) {
      const rec = this.loginAttempts[email] || { n: 0, until: 0 };
      rec.n += 1;
      if (rec.n >= 5) rec.until = Date.now() + 30000;
      this.loginAttempts[email] = rec;
    },
    recordOk: function (email) {
      this.loginAttempts[email] = { n: 0, until: 0 };
    },
    csrf: function () {
      let t = sessionStorage.getItem("avanta.csrf");
      if (!t) {
        t = A.uid("csrf");
        sessionStorage.setItem("avanta.csrf", t);
      }
      return t;
    },
    hasPermission: function (user, permission) {
      if (!user) return false;
      if (user.role === "super_admin") return true;
      const map = A.RBAC[user.role] || [];
      return map.indexOf("*") !== -1 || map.indexOf(permission) !== -1;
    }
  };

  A.RBAC = {
    super_admin: ["*"],
    admin: ["users.view", "merchants.view", "merchants.approve", "orders.view", "products.view", "finance.view"],
    finance_manager: ["finance.view", "payout.approve", "reports.view"],
    merchant_admin: ["products.view", "products.create", "products.update", "orders.view", "orders.update", "campaigns.manage", "finance.view"],
    merchant_staff: ["products.view", "orders.view", "orders.update"],
    store_staff: ["pos.scan", "loyalty.apply"],
    customer: ["shop", "deals", "listings", "chat", "loyalty"]
  };
})(window.Avanta);
