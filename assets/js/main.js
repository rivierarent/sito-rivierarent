(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var C = window.RR_CONFIG;
  // Lingua della pagina: "it", "en", oppure quella di assets/js/i18n/<lingua>.js
  var I18N = window.RR_I18N || null;
  var LANG = I18N ? I18N.lang : (document.documentElement.lang === "en" ? "en" : "it");

  var T = {
    it: {
      book: "Prenota", details: "Richiedi info", from: "da", night: "/ notte", fromLong: "a partire da", offerAsk: "Chiedi l'offerta", bedrooms: "camere", bathrooms: "bagni", guests: "ospiti", bedroom: "camera", bathroom: "bagno", guest: "ospite",
      pool: "Piscina", seaView: "Vista mare", bike: "Bike friendly",
      area: { finale: "Al mare", borgo: "Borgo storico", hills: "In collina", cotedazur: "Costa Azzurra" },
      type: { apartment: "Appartamento", villa: "Villa", house: "Casa" },
      empty: "Nessuna struttura corrisponde ai filtri. Contattaci: troviamo noi la casa giusta.",
      dateError: "La data di partenza deve essere successiva a quella di arrivo.",
      photos: "foto", gallery: "Galleria foto", prev: "Foto precedente", next: "Foto successiva", close: "Chiudi",
      waIntro: "Ciao Riviera Rent, vorrei informazioni",
      sent: "Grazie! Si apre WhatsApp/email con il messaggio pronto da inviare.",
      priceTbd: "prezzo da definire"
    },
    en: {
      book: "Book", from: "from", night: "/ night", fromLong: "from", offerAsk: "Ask for this offer", details: "Ask for info", bedrooms: "bedrooms", bathrooms: "bathrooms", guests: "guests", bedroom: "bedroom", bathroom: "bathroom", guest: "guest",
      pool: "Pool", seaView: "Sea view", bike: "Bike friendly",
      area: { finale: "By the sea", borgo: "Historic village", hills: "In the hills", cotedazur: "French Riviera" },
      type: { apartment: "Apartment", villa: "Villa", house: "House" },
      empty: "No property matches these filters. Contact us and we'll find the right home for you.",
      dateError: "Check-out must be after check-in.",
      photos: "photos", gallery: "Photo gallery", prev: "Previous photo", next: "Next photo", close: "Close",
      waIntro: "Hello Riviera Rent, I would like some information",
      sent: "Thank you! WhatsApp/email will open with your message ready to send.",
      priceTbd: "price to be set"
    }
  }[LANG];
  if (I18N) T = I18N.ui;

  // Alcuni dati esistono solo in italiano e inglese: le altre lingue usano la traduzione o l'inglese
  function engineUrl() { return C.booking.engineUrl[LANG] || C.booking.engineUrl.en; }
  function descOf(p) { return (I18N && I18N.desc[p.id]) || p.desc[LANG] || p.desc.en || p.desc.it; }

  function $(s, root) { return (root || document).querySelector(s); }
  function $$(s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---------- Tracking (attivo solo con consenso) ---------- */
  var CONSENT_KEY = "rr_consent";
  function getConsent() { try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(CONSENT_KEY, v); } catch (e) {} }

  function loadScript(src) { var s = document.createElement("script"); s.async = true; s.src = src; document.head.appendChild(s); }

  function initAnalytics() {
    var a = C.analytics;
    if (a.ga4 || a.googleAds) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      loadScript("https://www.googletagmanager.com/gtag/js?id=" + (a.ga4 || a.googleAds));
      window.gtag("js", new Date());
      if (a.ga4) window.gtag("config", a.ga4);
      if (a.googleAds) window.gtag("config", a.googleAds);
    }
    if (a.metaPixel) {
      /* eslint-disable */
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      /* eslint-enable */
      window.fbq("init", a.metaPixel);
      window.fbq("track", "PageView");
    }
  }

  // Eventi: booking_click, whatsapp_click, phone_click, email_click, contact_form
  function track(name, params) {
    params = params || {};
    params.lang = LANG;
    if (window.gtag) window.gtag("event", name, params);
    if (window.fbq) window.fbq("trackCustom", name, params);
    if (window.fbq && name === "booking_click") window.fbq("track", "InitiateCheckout");
    if (window.fbq && name !== "booking_click") window.fbq("track", "Contact");
  }

  function initConsent() {
    var bar = $("#cookie-bar");
    if (!bar) return;
    var c = getConsent();
    if (c === "all") { initAnalytics(); return; }
    if (c === "necessary") return;
    bar.hidden = false;
    $("#cookie-accept").addEventListener("click", function () { setConsent("all"); bar.hidden = true; initAnalytics(); });
    $("#cookie-reject").addEventListener("click", function () { setConsent("necessary"); bar.hidden = true; });
  }

  /* ---------- Contatti dinamici da config ---------- */
  function waLink(text) { return "https://wa.me/" + C.contacts.whatsapp + "?text=" + encodeURIComponent(text || T.waIntro); }

  function fillContacts() {
    var k = C.contacts;
    $$("[data-c=phone]").forEach(function (el) { el.href = k.phoneHref; if (!el.children.length && !el.textContent.trim()) el.textContent = k.phone; });
    $$("[data-c=phone-text]").forEach(function (el) { el.textContent = k.phone; });
    $$("[data-c=mobile-text]").forEach(function (el) { el.textContent = k.mobile; });
    $$("[data-c=email]").forEach(function (el) { el.href = "mailto:" + k.email; });
    $$("[data-c=email-text]").forEach(function (el) { el.textContent = k.email; });
    $$("[data-c=whatsapp]").forEach(function (el) { el.href = waLink(); });
    $$("[data-c=address]").forEach(function (el) { el.textContent = k.address; });
    $$("[data-c=maps]").forEach(function (el) { el.href = k.mapsUrl; });
    $$("[data-c=hours]").forEach(function (el) { el.textContent = k.hours[LANG] || (I18N && I18N.hours) || k.hours.en; });
    $$("[data-c=facebook]").forEach(function (el) { if (k.facebook) el.href = k.facebook; else el.remove(); });
    ["instagram", "youtube", "tiktok"].forEach(function (n) {
      $$("[data-c=" + n + "]").forEach(function (el) { if (k[n]) el.href = k[n]; else el.remove(); });
    });
    // Riga di icone social: <div data-socials></div>
    var SOC = {
      facebook: ["Facebook", '<path d="M14 8.5V6.8c0-.8.5-1 .9-1H17V2.1L14.1 2C10.9 2 10.2 4.4 10.2 5.9v2.6H8v3.8h2.2V22H14v-9.7h2.8l.4-3.8H14z"/>'],
      instagram: ["Instagram", '<path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM21.9 7c-.1-1.6-.4-3-1.6-4.2S17.7 1.3 16.1 1.2C14.4 1.1 9.6 1.1 7.9 1.2 6.3 1.3 4.9 1.6 3.7 2.8S2.2 5.4 2.1 7c-.1 1.7-.1 6.5 0 8.2.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.7.1 6.5.1 8.2 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.7.1-6.5 0-8.2zM19.8 17a3.3 3.3 0 0 1-1.9 1.9c-1.3.5-4.4.4-5.9.4s-4.6.1-5.9-.4A3.3 3.3 0 0 1 4.2 17c-.5-1.3-.4-4.4-.4-5.9s-.1-4.6.4-5.9A3.3 3.3 0 0 1 6.1 3.3c1.3-.5 4.4-.4 5.9-.4s4.6-.1 5.9.4a3.3 3.3 0 0 1 1.9 1.9c.5 1.3.4 4.4.4 5.9s.1 4.6-.4 5.9z"/>'],
      youtube: ["YouTube", '<path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15V9l5.8 3-5.8 3z"/>'],
      tiktok: ["TikTok", '<path d="M16.6 2h-3.4v13.4a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.2a6.3 6.3 0 1 0 5.4 6.2V8.6a8 8 0 0 0 4.6 1.5V6.7a4.6 4.6 0 0 1-4.6-4.7z"/>'],
      whatsapp: ["WhatsApp", '<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.6 2.1 1.1 1 2 1.3 2.3 1.4.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/>']
    };
    $$("[data-socials]").forEach(function (box) {
      box.innerHTML = Object.keys(SOC).map(function (n) {
        var url = n === "whatsapp" ? waLink() : k[n];
        if (!url) return "";
        return '<a class="soc soc-' + n + '" href="' + esc(url) + '" target="_blank" rel="noopener" data-where="socials" aria-label="' + SOC[n][0] + '" title="' + SOC[n][0] + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + SOC[n][1] + "</svg></a>";
      }).join("");
    });
    $$("[data-c=booking]").forEach(function (el) { el.href = engineUrl(); });
    $$(".year").forEach(function (el) { el.textContent = new Date().getFullYear(); });
    $$("[data-c=count]").forEach(function (el) { el.setAttribute("data-count", C.homesCount || (window.RR_PROPERTIES || []).length); });

    // Tracciamento click su tutti i canali di contatto
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a");
      if (!a) return;
      var h = a.getAttribute("href") || "";
      var where = a.getAttribute("data-where") || "page";
      if (h.indexOf("wa.me") > -1) track("whatsapp_click", { where: where });
      else if (h.indexOf("tel:") === 0) track("phone_click", { where: where });
      else if (h.indexOf("mailto:") === 0) track("email_click", { where: where });
      else if (h.indexOf("krossbooking") > -1 || h.indexOf("kross.travel") > -1) track("booking_click", { where: where, property: a.getAttribute("data-property") || "" });
    });
  }

  /* ---------- Prenotazione ---------- */
  function fmtDate(iso, fmt) {
    if (!fmt || fmt === "YYYY-MM-DD") return iso;
    var p = iso.split("-");
    return fmt.replace("YYYY", p[0]).replace("MM", p[1]).replace("DD", p[2]);
  }

  function bookingUrl(base, q) {
    var dp = C.booking.dateParams;
    var url = base || engineUrl();
    if (!dp || !q) return url;
    var parts = [];
    if (q.checkin) parts.push(dp.checkin + "=" + encodeURIComponent(fmtDate(q.checkin, dp.format)));
    if (q.checkout) parts.push(dp.checkout + "=" + encodeURIComponent(fmtDate(q.checkout, dp.format)));
    if (q.guests && dp.guests) parts.push(dp.guests + "=" + encodeURIComponent(q.guests));
    return parts.length ? url + (url.indexOf("?") > -1 ? "&" : "?") + parts.join("&") : url;
  }

  function initSearch() {
    var f = $("#search");
    if (!f) return;
    var today = new Date().toISOString().slice(0, 10);
    f.checkin.min = today;
    f.checkout.min = today;
    f.checkin.addEventListener("change", function () {
      if (!f.checkin.value) return;
      var d = new Date(f.checkin.value); d.setDate(d.getDate() + 1);
      f.checkout.min = d.toISOString().slice(0, 10);
      if (!f.checkout.value || f.checkout.value <= f.checkin.value) f.checkout.value = f.checkout.min;
    });
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = $("#search-msg");
      if (f.checkin.value && f.checkout.value && f.checkout.value <= f.checkin.value) { msg.textContent = T.dateError; return; }
      msg.textContent = "";
      var q = { checkin: f.checkin.value, checkout: f.checkout.value, guests: f.guests.value };
      track("booking_click", { where: "hero_search" });
      window.open(bookingUrl(null, q), "_blank", "noopener");
    });
  }

  /* ---------- Strutture ---------- */
  var ICONS = {
    camera: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/></svg>',
    pool: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 18c2 0 2-1.5 4-1.5S8 18 10 18s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M8 15V5a2 2 0 0 1 4 0M16 15V5a2 2 0 0 0-4 0M8 9h8"/></svg>',
    seaView: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 14c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2M2 19c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2M12 3v5M7 6l1.5 1.5M17 6l-1.5 1.5"/></svg>',
    bike: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5.5" cy="16.5" r="3.5"/><circle cx="18.5" cy="16.5" r="3.5"/><path d="M5.5 16.5 9 9h6l3.5 7.5M9 9 12 16.5 15 9M13 6h3"/></svg>'
  };

  function card(p, i) {
    var facts = [];
    if (p.guests) facts.push(p.guests + " " + (p.guests === 1 ? T.guest : T.guests));
    if (p.bedrooms) facts.push(p.bedrooms + " " + (p.bedrooms === 1 ? T.bedroom : T.bedrooms));
    if (p.bathrooms) facts.push(p.bathrooms + " " + (p.bathrooms === 1 ? T.bathroom : T.bathrooms));
    var tags = ["pool", "seaView", "bike"].filter(function (k) { return p[k]; })
      .map(function (k) { return '<span class="tag">' + ICONS[k] + T[k] + "</span>"; }).join("");
    var media = p.image
      ? '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy">'
      : '<div class="ph ph-' + p.area + '"><span>' + esc(p.name) + "</span></div>";
    if (p.image && p.photos) {
      media = '<button type="button" class="gal-open" data-gallery="' + p.id + '" aria-label="' + T.gallery + " – " + esc(p.name) + '">' + media +
        '<span class="gal-count">' + ICONS.camera + p.photos + " " + T.photos + "</span></button>";
    }
    var wa = waLink(T.waIntro + ": " + p.name);
    return '<article class="card reveal" data-area="' + p.area + '" data-type="' + p.type + '">' +
      '<div class="card-media">' + media +
        '<span class="num">' + (i < 9 ? "0" : "") + (i + 1) + "</span>" +
        '<span class="badge">' + T.type[p.type] + "</span>" +
        (p.fromPrice ? '<span class="from">' + T.from + " <b>€ " + esc(p.fromPrice) + "</b> " + T.night + "</span>" : "") +
        '<a class="go" target="_blank" rel="noopener" data-where="card_media" data-property="' + p.id + '" href="' + esc(bookingUrl(p.bookingUrl)) + '" aria-label="' + T.book + " " + esc(p.name) + '">→</a>' +
      "</div>" +
      '<div class="card-body">' +
        '<p class="card-area">' + T.area[p.area] + "</p>" +
        "<h3>" + esc(p.name) + "</h3>" +
        (facts.length ? '<p class="facts">' + facts.join(" · ") + "</p>" : "") +
        "<p>" + esc(descOf(p)) + "</p>" +
        (tags ? '<div class="tags">' + tags + "</div>" : "") +
        (p.cin || p.citra ? '<p class="cin">' + [p.cin ? "CIN " + esc(p.cin) : "", p.citra ? "CITRA " + esc(p.citra) : ""].filter(Boolean).join(" · ") + "</p>" : "") +
        '<div class="card-actions">' +
          '<a class="btn btn-primary" target="_blank" rel="noopener" data-where="card" data-property="' + p.id + '" href="' + esc(bookingUrl(p.bookingUrl)) + '">' + T.book + "</a>" +
          '<a class="btn btn-ghost" target="_blank" rel="noopener" data-where="card" href="' + esc(wa) + '">' + T.details + "</a>" +
        "</div>" +
      "</div></article>";
  }

  /* ---------- Offerte in evidenza (RR_CONFIG.offers) ---------- */
  function initOffers() {
    var box = $("#offers-grid");
    if (!box) return;
    var props = {};
    (window.RR_PROPERTIES || []).forEach(function (p) { props[p.id] = p; });
    var today = new Date().toISOString().slice(0, 10);
    var active = (C.offers || []).filter(function (o) {
      return !o.draft && (!o.start || o.start <= today) && (!o.end || o.end >= today) && props[o.property];
    });
    // Nessuna offerta attiva: si nasconde la sezione e la voce nel menu
    if (!active.length) {
      var sec = box.closest("section");
      if (sec) sec.style.display = "none";
      $$('a[href="#offerte"]').forEach(function (a) { a.style.display = "none"; });
      return;
    }
    // Fascia in alto con l'offerta speciale del momento
    var flash = $("#offer-flash");
    var hl = active.filter(function (o) { return o.highlight; })[0];
    if (flash && hl) {
      flash.innerHTML = '<a href="#offerte"><b>' + esc(hl.badge) + "</b> " + esc(hl.title) + " · " + T.from + " € " + esc(hl.price) + " " + (hl.short ? "· " + esc(hl.short) : T.night) + ' <i aria-hidden="true">→</i></a>';
      flash.hidden = false;
    }
    box.innerHTML = active.map(function (o) {
      var p = props[o.property];
      if (!p) return "";
      var media = p.image
        ? '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy">'
        : '<div class="ph ph-' + p.area + '"><span>' + esc(p.name) + "</span></div>";
      return '<article class="offer reveal">' +
        '<div class="offer-media">' + media + '<span class="offer-badge">' + esc(o.badge) + "</span></div>" +
        '<div class="offer-body">' +
          '<p class="offer-house">' + esc(p.name) + " · " + T.area[p.area] + "</p>" +
          "<h3>" + esc(o.title) + "</h3>" +
          "<p>" + esc(o.text) + "</p>" +
          '<p class="offer-price"><small>' + T.fromLong + '</small><b>€ ' + esc(o.price) + "</b><span>" + esc(o.unit) + "</span></p>" +
          (o.until ? '<p class="offer-until">' + esc(o.until) + "</p>" : "") +
          '<div class="offer-actions">' +
            '<a class="btn btn-primary" target="_blank" rel="noopener" data-where="offer" data-property="' + p.id + '" href="' + esc(bookingUrl(p.bookingUrl)) + '">' + T.book + "</a>" +
            '<a class="btn btn-ghost" target="_blank" rel="noopener" data-where="offer" href="' + esc(waLink(T.waIntro + ": " + o.title + " – " + p.name)) + '">' + T.offerAsk + "</a>" +
          "</div>" +
        "</div></article>";
    }).join("");
  }

  function initProperties() {
    var grid = $("#grid");
    if (!grid) return;
    var list = window.RR_PROPERTIES || [];
    grid.innerHTML = list.map(card).join("");
    var active = "all";
    function apply() {
      var shown = 0;
      $$(".card", grid).forEach(function (el, i) {
        var p = list[i];
        var ok = active === "all" || p.area === active || p.type === active ||
          (active === "pool" && p.pool) || (active === "bike" && p.bike);
        el.hidden = !ok;
        if (ok) shown++;
      });
      // Bento: le prime schede diventano larghe così le righe da 3 sono sempre piene
      var wide = (3 - shown % 3) % 3;
      var featIdx = [0, 3].slice(0, wide); // riga 1: larga+normale, riga 2: normale+larga
      $$(".card", grid).forEach(function (el) { el.classList.remove("feature"); });
      $$(".card:not([hidden])", grid).forEach(function (el, i) { if (featIdx.indexOf(i) > -1) el.classList.add("feature"); });
      $("#grid-empty").hidden = shown > 0;
      $("#grid-empty").textContent = T.empty;
    }
    $$(".filter").forEach(function (b) {
      b.addEventListener("click", function () {
        $$(".filter").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        active = b.getAttribute("data-filter");
        apply();
      });
    });
    apply();
  }

  /* ---------- Modulo contatti (WhatsApp o email, senza server) ---------- */
  // Ogni campo con data-label finisce nel messaggio; "message" va in fondo.
  function initContactForm() {
    var f = $("#contact-form");
    if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var topicEl = f.topic;
      var topicText = topicEl.tagName === "SELECT" ? topicEl.options[topicEl.selectedIndex].text : topicEl.getAttribute("data-text");
      var intro = f.getAttribute("data-intro") || T.waIntro;
      var lines = [intro + (/[.!?。！？]$/.test(intro) ? "" : (LANG === "zh" || LANG === "ja" ? "。" : "."))];
      $$("[data-label]", f).forEach(function (el) {
        var v = el.tagName === "SELECT" ? el.options[el.selectedIndex].text : el.value.trim();
        if (v) lines.push(el.getAttribute("data-label") + ": " + v);
      });
      lines.push("", f.message.value);
      var text = lines.join("\n");
      var via = (e.submitter && e.submitter.value) || "whatsapp";
      track("contact_form", { via: via, topic: topicEl.value });
      if (via === "email") {
        location.href = "mailto:" + C.contacts.email + "?subject=" + encodeURIComponent("Riviera Rent – " + topicText) + "&body=" + encodeURIComponent(text);
      } else {
        window.open(waLink(text), "_blank", "noopener");
      }
      $("#form-msg").textContent = T.sent;
    });
  }

  /* ---------- UI: menu, header, animazioni, contatori ---------- */
  function initUI() {
    var header = $(".site-header");
    var toggle = $(".nav-toggle");
    var nav = $("#nav");
    var bar = $(".progress");
    function onScroll() {
      header.classList.toggle("scrolled", window.scrollY > 40);
      if (bar) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("open", !open);
      document.body.classList.toggle("nav-open", !open);
      document.body.style.overflow = open ? "" : "hidden";
    });
    function closeNav() { nav.classList.remove("open"); document.body.classList.remove("nav-open"); document.body.style.overflow = ""; toggle.setAttribute("aria-expanded", "false"); }
    $$("#nav a").forEach(function (a) { a.addEventListener("click", closeNav); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { closeNav(); toggle.focus(); } });

    // Carosello "Cosa fare"
    var xp = $(".xp");
    $$(".xp-nav button").forEach(function (b) {
      b.addEventListener("click", function () {
        var step = xp.firstElementChild ? xp.firstElementChild.getBoundingClientRect().width + 18 : 300;
        xp.scrollBy({ left: step * parseInt(b.getAttribute("data-dir"), 10), behavior: "smooth" });
      });
    });

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!("IntersectionObserver" in window) || reduce) {
      $$(".reveal").forEach(function (el) { el.classList.add("in"); });
      $$("[data-count]").forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        io.unobserve(en.target);
        if (en.target.hasAttribute("data-count")) countUp(en.target);
      });
    }, { threshold: 0.15 });
    $$(".reveal, [data-count]").forEach(function (el) { io.observe(el); });
  }

  function countUp(el) {
    var end = parseInt(el.getAttribute("data-count"), 10), t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var k = Math.min((ts - t0) / 1200, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* Listini: data-price="sezione.voce" legge RR_CONFIG[sezione].prices[voce]; vuoto = spazio bianco */
  function fillPrices() {
    $$("[data-price]").forEach(function (n) {
      var parts = n.getAttribute("data-price").split(".");
      var list = (C[parts[0]] && C[parts[0]].prices) || {};
      var v = String(list[parts[1]] || "").trim();
      var unit = n.getAttribute("data-unit");
      n.textContent = "";
      if (!v) {
        n.classList.add("blank");
        n.appendChild(document.createTextNode("€ "));
        var b = document.createElement("span");
        b.className = "blank-line";
        b.setAttribute("aria-label", T.priceTbd);
        n.appendChild(b);
      } else {
        n.appendChild(document.createTextNode(/^[\d.,]+$/.test(v) ? "€ " + v : v));
      }
      if (unit) {
        var u = document.createElement("small");
        u.textContent = " " + unit;
        n.appendChild(u);
      }
    });
  }

  // Elementi con data-until="AAAA-MM-GG" spariscono da soli dopo quella data
  function hideExpired() {
    var today = new Date().toISOString().slice(0, 10);
    $$("[data-until]").forEach(function (el) { if (el.getAttribute("data-until") < today) el.remove(); });
  }

  /* ---------- Galleria foto delle case (foto in /assets/img/case/<id>/01.jpg ...) ---------- */
  function initGallery() {
    var props = {};
    (window.RR_PROPERTIES || []).forEach(function (p) { props[p.id] = p; });
    var css = document.createElement("style");
    css.textContent =
      ".gal-open{all:unset;display:block;width:100%;height:100%;cursor:zoom-in;position:relative}" +
      ".gal-open img{display:block}" +
      ".gal-open:focus-visible{outline:3px solid #fff;outline-offset:-6px}" +
      ".gal-count{position:absolute;left:12px;bottom:12px;z-index:2;display:inline-flex;align-items:center;gap:6px;background:rgba(16,24,30,.72);color:#fff;font:600 .8rem/1 system-ui,sans-serif;padding:.5em .8em;border-radius:999px;pointer-events:none}" +
      ".gal-count svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2}" +
      ".gal{position:fixed;inset:0;z-index:300;background:#0c1014;display:flex;flex-direction:column;color:#fff;font:500 1rem/1.3 system-ui,sans-serif;touch-action:pan-y}" +
      ".gal[hidden]{display:none}" +
      ".gal-top{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px}" +
      ".gal-title{font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
      ".gal-n{opacity:.75;font-size:.9rem;margin-left:8px;font-weight:500}" +
      ".gal-stage{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:0 8px 16px;position:relative}" +
      ".gal-stage img{max-width:100%;max-height:100%;object-fit:contain;border-radius:4px;user-select:none;-webkit-user-drag:none}" +
      ".gal button{appearance:none;border:0;cursor:pointer;color:#fff;background:rgba(255,255,255,.14);border-radius:50%;width:48px;height:48px;display:grid;place-items:center;font-size:1.6rem;line-height:1;flex:0 0 auto}" +
      ".gal button:hover{background:rgba(255,255,255,.26)}" +
      ".gal-prev,.gal-next{position:absolute;top:50%;transform:translateY(-50%)}" +
      ".gal-prev{left:14px}.gal-next{right:14px}" +
      ".gal-book{padding:0 16px 18px;text-align:center}" +
      "@media (max-width:640px){.gal-prev,.gal-next{width:42px;height:42px;font-size:1.3rem}.gal-prev{left:6px}.gal-next{right:6px}}";
    document.head.appendChild(css);

    var box = document.createElement("div");
    box.className = "gal"; box.hidden = true;
    box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", T.gallery);
    box.innerHTML =
      '<div class="gal-top"><p class="gal-title"><span class="gal-name"></span><span class="gal-n"></span></p>' +
      '<button type="button" class="gal-close" aria-label="' + T.close + '">×</button></div>' +
      '<div class="gal-stage"><img alt=""><button type="button" class="gal-prev" aria-label="' + T.prev + '">‹</button>' +
      '<button type="button" class="gal-next" aria-label="' + T.next + '">›</button></div>' +
      '<p class="gal-book"><a class="btn btn-primary" target="_blank" rel="noopener" data-where="gallery">' + T.book + "</a></p>";
    document.body.appendChild(box);
    var img = $("img", box), cur = null, idx = 0, lastFocus = null;

    function src(p, i) { return "/assets/img/case/" + p.id + "/" + (i < 9 ? "0" : "") + (i + 1) + ".jpg"; }
    function show(i) {
      idx = (i + cur.photos) % cur.photos;
      img.src = src(cur, idx);
      img.alt = cur.name + " – " + T.photos + " " + (idx + 1);
      $(".gal-n", box).textContent = (idx + 1) + " / " + cur.photos;
      [idx + 1, idx - 1].forEach(function (j) { new Image().src = src(cur, (j + cur.photos) % cur.photos); });
    }
    function open(id) {
      cur = props[id]; if (!cur || !cur.photos) return;
      lastFocus = document.activeElement;
      $(".gal-name", box).textContent = cur.name;
      var a = $(".gal-book a", box); a.href = bookingUrl(cur.bookingUrl); a.setAttribute("data-property", cur.id);
      box.hidden = false; document.documentElement.style.overflow = "hidden";
      show(0); $(".gal-close", box).focus();
    }
    function close() {
      box.hidden = true; document.documentElement.style.overflow = ""; img.removeAttribute("src");
      if (lastFocus) lastFocus.focus();
    }
    document.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest(".gal-open");
      if (b) { e.preventDefault(); open(b.getAttribute("data-gallery")); }
    });
    $(".gal-close", box).addEventListener("click", close);
    $(".gal-prev", box).addEventListener("click", function () { show(idx - 1); });
    $(".gal-next", box).addEventListener("click", function () { show(idx + 1); });
    box.addEventListener("click", function (e) { if (e.target === box || e.target.classList.contains("gal-stage")) close(); });
    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") show(idx + 1);
      else if (e.key === "ArrowLeft") show(idx - 1);
    });
    var x0 = null;
    box.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
    });
  }

  /* ---------- Menu lingue ---------- */
  function initLangMenu() {
    var btn = $(".lang-btn"), list = $("#lang-list");
    if (!btn || !list) return;
    function links() { return $$("a", list); }
    function open(focusFirst) {
      list.hidden = false; btn.setAttribute("aria-expanded", "true");
      if (focusFirst) (list.querySelector("[aria-current]") || links()[0]).focus();
    }
    function close(focusBtn) {
      if (list.hidden) return;
      list.hidden = true; btn.setAttribute("aria-expanded", "false");
      if (focusBtn) btn.focus();
    }
    btn.addEventListener("click", function () { if (list.hidden) open(false); else close(false); });
    btn.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); open(true); }
    });
    list.addEventListener("keydown", function (e) {
      var a = links(), i = a.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); a[(i + 1) % a.length].focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); a[(i - 1 + a.length) % a.length].focus(); }
      else if (e.key === "Home") { e.preventDefault(); a[0].focus(); }
      else if (e.key === "End") { e.preventDefault(); a[a.length - 1].focus(); }
      else if (e.key === "Escape") close(true);
      else if (e.key === "Tab") close(false);
    });
    document.addEventListener("click", function (e) { if (!e.target.closest(".lang-menu")) close(false); });
    list.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (a) track("language_change", { to: a.getAttribute("hreflang") });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLangMenu();
    hideExpired();
    fillContacts();
    fillPrices();
    initProperties();
    initOffers();
    initGallery();
    initSearch();
    initContactForm();
    initUI();
    initConsent();
  });
})();
