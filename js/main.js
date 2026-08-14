(function () {
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", nav.classList.contains("open"));
    });
  }

  document.querySelectorAll("[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var notice = form.querySelector(".notice");
      if (notice) {
        notice.classList.add("show");
      }
      form.reset();
    });
  });

  var lightbox = document.querySelector(".lightbox");
  var lightboxImg = lightbox ? lightbox.querySelector("img") : null;
  document.querySelectorAll("[data-lightbox]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = link.getAttribute("href");
      lightboxImg.alt = link.querySelector("img").alt || "";
      lightbox.classList.add("open");
    });
  });
  if (lightbox) {
    lightbox.addEventListener("click", function () {
      lightbox.classList.remove("open");
    });
  }

  document.querySelectorAll("[data-filter]").forEach(function (button) {
    button.addEventListener("click", function () {
      var value = button.getAttribute("data-filter");
      document.querySelectorAll("[data-filter]").forEach(function (item) {
        item.classList.toggle("active", item === button);
      });
      document.querySelectorAll("[data-cat]").forEach(function (card) {
        var show = value === "hepsi" || card.getAttribute("data-cat") === value;
        card.style.display = show ? "" : "none";
      });
    });
  });
})();
