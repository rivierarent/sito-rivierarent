/* Riviera Rent – versione alternativa: illustrazioni generate (borgo ligure e costa). */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  // Generatore pseudo-casuale con seme: il borgo è sempre uguale
  var seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

  /* ---------- Borgo di facciate liguri ---------- */
  function drawTown() {
    var svg = document.getElementById("town");
    if (!svg) return;
    var colors = ["#e9b44c", "#e07a5f", "#f2cc8f", "#d99a7e", "#c8643f", "#f3dcb8", "#e8a05c"];
    el("circle", { cx: 640, cy: 110, r: 52, class: "sun" }, svg);
    el("path", { d: "M0 200 Q160 120 330 170 T640 150 T800 170 V420 H0z", class: "hill" }, svg);
    var x = -10, i = 0;
    while (x < 810) {
      var w = 70 + Math.round(rnd() * 50);
      var h = 150 + Math.round(rnd() * 120);
      var y = 420 - h;
      var g = el("g", { class: "house", style: "--d:" + (i * 0.08).toFixed(2) + "s" }, svg);
      el("rect", { x: x, y: y, width: w, height: h, fill: colors[i % colors.length] }, g);
      // tetto
      el("path", { d: "M" + (x - 4) + " " + y + " L" + (x + w / 2) + " " + (y - 18) + " L" + (x + w + 4) + " " + y + " Z", fill: "#a8492f" }, g);
      // cornicione
      el("rect", { x: x, y: y, width: w, height: 6, fill: "rgba(255,255,255,.55)" }, g);
      // finestre con persiane verdi
      var cols = w > 100 ? 3 : 2;
      var gap = w / cols;
      for (var r = 0; r < Math.floor((h - 50) / 48); r++) {
        for (var c = 0; c < cols; c++) {
          var wx = x + gap * c + gap / 2 - 9, wy = y + 26 + r * 48;
          el("rect", { x: wx - 3, y: wy - 3, width: 24, height: 32, fill: "rgba(255,255,255,.7)" }, g);
          el("rect", { x: wx, y: wy, width: 18, height: 26, fill: "#2b3a36" }, g);
          el("rect", { x: wx, y: wy, width: 9, height: 26, class: "shutter l" }, g);
          el("rect", { x: wx + 9, y: wy, width: 9, height: 26, class: "shutter r" }, g);
        }
      }
      // porta
      el("rect", { x: x + w / 2 - 10, y: 420 - 36, width: 20, height: 36, rx: 10, fill: "#6b3a2a" }, g);
      x += w - 2; i++;
    }
  }

  /* ---------- Costa della Liguria con le località ---------- */
  function drawCoast() {
    var path = document.getElementById("coastline");
    var towns = document.getElementById("towns");
    if (!path || !towns) return;
    var L = path.getTotalLength();
    var list = [
      ["Sanremo", .04], ["Imperia", .11], ["Alassio", .19], ["Savona", .36],
      ["Genova", .52], ["Camogli", .6], ["Sestri Levante", .69], ["Cinque Terre", .83], ["La Spezia", .95]
    ];
    list.forEach(function (t, i) {
      var p = path.getPointAtLength(L * t[1]);
      var above = i % 2 === 1;
      var inZone = false;
      var g = el("g", { class: "town" + (inZone ? " home" : ""), style: "--d:" + (i * 0.12).toFixed(2) + "s" }, towns);
      el("line", { x1: p.x, y1: p.y, x2: p.x, y2: p.y + (above ? -30 : 28) }, g);
      el("circle", { cx: p.x, cy: p.y, r: inZone ? 7 : 5 }, g);
      var label = el("text", { x: p.x, y: p.y + (above ? -38 : 48), "text-anchor": "middle" }, g);
      label.textContent = t[0];
    });
  }

  // Il pulsante "Gestiamo la tua casa" preseleziona il motivo "proprietario" nel modulo
  function preselectOwner() {
    var a = document.querySelector(".half-manage");
    if (!a) return;
    a.addEventListener("click", function () {
      var sel = document.querySelector("#contact-form select[name=topic]");
      if (sel) sel.value = "owner";
    });
  }

  // I link con data-topic (es. B&B Point) preselezionano il motivo nel modulo
  function preselectTopic() {
    document.querySelectorAll("[data-topic]").forEach(function (a) {
      a.addEventListener("click", function () {
        var sel = document.querySelector("#contact-form select[name=topic]");
        if (sel) sel.value = a.getAttribute("data-topic");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    drawTown();
    drawCoast();
    preselectOwner();
    preselectTopic();
    // "Case bike friendly" attiva il filtro corrispondente
    document.querySelectorAll("[data-filter-link]").forEach(function (a) {
      a.addEventListener("click", function () {
        var f = document.querySelector('.filter[data-filter="' + a.getAttribute("data-filter-link") + '"]');
        if (f) f.click();
      });
    });
  });
})();
