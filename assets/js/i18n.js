window.Avanta = window.Avanta || {};

(function (A) {
  A.i18n = {
    locale: localStorage.getItem("avanta.locale") || "tr",
    strings: {
      tr: {
        slogan: "Alışveriş Yap. Puan Kazan. Avantajı Her Yerde Kullan.",
        searchPlaceholder: "Ürün, marka, mağaza veya fırsat ara...",
        exploreDeals: "Fırsatları Keşfet",
        register: "Üye Ol",
        login: "Giriş Yap",
        home: "Ana Sayfa",
        deals: "Fırsatlar",
        marketplace: "Marketplace",
        messages: "Mesajlar",
        profile: "Profil",
        cart: "Sepet",
        cookieText: "Deneyimi kişiselleştirmek için çerezler kullanıyoruz. Tercihlerinizi yönetebilirsiniz.",
        acceptAll: "Tümünü Kabul Et",
        reject: "Reddet",
        managePrefs: "Tercihleri Yönet",
        safetyChat: "Güvenliğiniz için ödeme veya kişisel bilgilerinizi platform dışına taşımayın."
      },
      en: {
        slogan: "Shop. Earn points. Use benefits everywhere.",
        searchPlaceholder: "Search products, brands, stores or deals...",
        exploreDeals: "Explore Deals",
        register: "Sign up",
        login: "Log in",
        home: "Home",
        deals: "Deals",
        marketplace: "Marketplace",
        messages: "Messages",
        profile: "Profile",
        cart: "Cart",
        cookieText: "We use cookies to personalize your experience.",
        acceptAll: "Accept all",
        reject: "Reject",
        managePrefs: "Manage preferences",
        safetyChat: "For your safety, do not move payments or personal data off-platform."
      },
      de: {},
      ar: {}
    },
    t: function (key) {
      const loc = this.strings[this.locale] || this.strings.tr;
      return loc[key] || this.strings.tr[key] || key;
    },
    setLocale: function (locale) {
      this.locale = locale;
      localStorage.setItem("avanta.locale", locale);
    }
  };
})(window.Avanta);
