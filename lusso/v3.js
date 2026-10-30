/* Riviera Rent – versione 3 "Lusso": preselezione del modulo e foto delle case se presenti. */
(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    var manage = document.querySelector(".panel-choice.manage");
    if (manage) manage.addEventListener("click", function () {
      var sel = document.querySelector("#contact-form select[name=topic]");
      if (sel) sel.value = "owner";
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-topic]"), function (a) {
      a.addEventListener("click", function () {
        var sel = document.querySelector("#contact-form select[name=topic]");
        if (sel) sel.value = a.getAttribute("data-topic");
      });
    });
    // Le schede senza foto mostrano un numero elegante al posto dell'immagine
    Array.prototype.forEach.call(document.querySelectorAll(".card"), function (c, i) {
      var ph = c.querySelector(".ph");
      if (ph) ph.setAttribute("data-n", (i < 9 ? "0" : "") + (i + 1));
    });
  });
})();
