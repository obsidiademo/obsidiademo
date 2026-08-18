window.Avanta = window.Avanta || {};

(function (A) {
  const KEY = "avanta.state.v1";
  const THEME_KEY = "avanta.theme";

  A.Store = {
    defaultState: function () {
      return JSON.parse(JSON.stringify(A.SEED || {}));
    },
    load: function () {
      try {
        const raw = localStorage.getItem(KEY);
        if (!raw) {
          const seed = this.defaultState();
          this.save(seed);
          return seed;
        }
        const parsed = JSON.parse(raw);
        return this.merge(this.defaultState(), parsed);
      } catch (e) {
        return this.defaultState();
      }
    },
    save: function (state) {
      localStorage.setItem(KEY, JSON.stringify(state));
    },
    merge: function (base, extra) {
      const out = Object.assign({}, base, extra);
      Object.keys(base).forEach(function (k) {
        if (Array.isArray(base[k]) && extra[k]) out[k] = extra[k];
        else if (base[k] && typeof base[k] === "object" && !Array.isArray(base[k])) {
          out[k] = Object.assign({}, base[k], extra[k] || {});
        }
      });
      return out;
    },
    getTheme: function () {
      return localStorage.getItem(THEME_KEY) || "light";
    },
    setTheme: function (theme) {
      localStorage.setItem(THEME_KEY, theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
  };
})(window.Avanta);
