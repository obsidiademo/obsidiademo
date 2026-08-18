window.Avanta = window.Avanta || {};

(function (A) {
  A.UI = {
    toast: function (message, type) {
      let stack = document.querySelector(".toast-stack");
      if (!stack) {
        stack = document.createElement("div");
        stack.className = "toast-stack";
        document.body.appendChild(stack);
      }
      const el = document.createElement("div");
      el.className = "toast " + (type || "info");
      el.innerHTML = "<div><strong>" + (type === "error" ? "Hata" : type === "success" ? "Tamam" : "Bilgi") +
        "</strong><div class='text-muted'>" + A.escape(message) + "</div></div>";
      stack.appendChild(el);
      setTimeout(function () { el.remove(); }, 3800);
    },
    modal: function (opts) {
      this.closeModal();
      const back = document.createElement("div");
      back.className = "modal-backdrop";
      back.innerHTML =
        '<div class="modal ' + (opts.size === "lg" ? "modal-lg" : "") + '" role="dialog" aria-modal="true">' +
        '<div class="modal-head"><h3>' + A.escape(opts.title || "") + '</h3>' +
        '<button class="btn-icon" data-close-modal aria-label="Kapat">' + A.icon("x") + "</button></div>" +
        '<div class="modal-body">' + (opts.body || "") + "</div>" +
        (opts.footer ? '<div class="modal-foot">' + opts.footer + "</div>" : "") +
        "</div>";
      back.addEventListener("click", function (e) {
        if (e.target === back || e.target.closest("[data-close-modal]")) A.UI.closeModal();
      });
      document.body.appendChild(back);
      A.UI.icons();
      if (opts.onOpen) opts.onOpen(back);
      return back;
    },
    closeModal: function () {
      A.qsa(".modal-backdrop").forEach(function (el) { el.remove(); });
    },
    confirm: function (title, body, onYes) {
      this.modal({
        title: title,
        body: "<p>" + A.escape(body) + "</p>",
        footer: '<button class="btn btn-ghost" data-close-modal>Vazgeç</button><button class="btn btn-primary" id="confirm-yes">Onayla</button>',
        onOpen: function (root) {
          root.querySelector("#confirm-yes").onclick = function () {
            A.UI.closeModal();
            onYes && onYes();
          };
        }
      });
    },
    icons: function () {
      if (window.lucide && lucide.createIcons) lucide.createIcons();
    },
    empty: function (title, text, cta, href) {
      return '<div class="empty-state card">' +
        "<div style='font-size:36px'>🗂️</div><h3>" + A.escape(title) + "</h3>" +
        "<p>" + A.escape(text) + "</p>" +
        (cta ? '<p style="margin-top:14px"><a class="btn btn-primary" href="' + href + '">' + A.escape(cta) + "</a></p>" : "") +
        "</div>";
    },
    skeletonCards: function (n) {
      let h = "";
      for (let i = 0; i < (n || 4); i++) {
        h += '<div class="card"><div class="skeleton" style="height:160px"></div><div class="card-pad"><div class="skeleton" style="height:14px;width:70%"></div><div class="skeleton" style="height:14px;width:40%;margin-top:8px"></div></div></div>';
      }
      return h;
    },
    pagination: function (page, pages, attr) {
      let h = '<div class="pagination">';
      for (let i = 1; i <= pages; i++) {
        h += '<button class="btn btn-sm ' + (i === page ? "btn-primary" : "btn-ghost") + '" data-page-to="' + i + '" ' + (attr || "") + ">" + i + "</button>";
      }
      h += "</div>";
      return h;
    },
    table: function (columns, rows, opts) {
      opts = opts || {};
      let head = columns.map(function (c) { return "<th>" + A.escape(c.label) + "</th>"; }).join("");
      if (opts.selectable) head = "<th><input type='checkbox' data-select-all></th>" + head;
      if (opts.actions) head += "<th>İşlem</th>";
      const body = rows.length ? rows.map(function (r) {
        let tds = columns.map(function (c) { return "<td>" + (r[c.key] || "—") + "</td>"; }).join("");
        if (opts.selectable) tds = "<td><input type='checkbox' data-row-id='" + A.escape(r.id || "") + "'></td>" + tds;
        if (opts.actions) tds += "<td>" + (r.actions || "") + "</td>";
        return "<tr>" + tds + "</tr>";
      }).join("") : "<tr><td colspan='12'><div class='empty-state'>Kayıt bulunamadı.</div></td></tr>";
      return '<div class="table-wrap"><table class="data"><thead><tr>' + head + "</tr></thead><tbody>" + body + "</tbody></table></div>";
    }
  };
})(window.Avanta);
