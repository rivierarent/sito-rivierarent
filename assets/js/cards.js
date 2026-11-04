/*
 * Schede delle case: usate dal browser (main.js) e dal generatore delle pagine
 * (tools/i18n/build.py), che le scrive già nell'HTML per Google e gli assistenti AI.
 */
(function (root) {
  "use strict";

  // Testi di base; le altre lingue arrivano da assets/js/i18n/<lingua>.js
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
  };

  var ICONS = {
    camera: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/></svg>',
    pool: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 18c2 0 2-1.5 4-1.5S8 18 10 18s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M8 15V5a2 2 0 0 1 4 0M16 15V5a2 2 0 0 0-4 0M8 9h8"/></svg>',
    seaView: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 14c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2M2 19c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2M12 3v5M7 6l1.5 1.5M17 6l-1.5 1.5"/></svg>',
    bike: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5.5" cy="16.5" r="3.5"/><circle cx="18.5" cy="16.5" r="3.5"/><path d="M5.5 16.5 9 9h6l3.5 7.5M9 9 12 16.5 15 9M13 6h3"/></svg>'
  };

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  // ctx: { T, waLink(text), bookingUrl(base), descOf(p) }
  function make(ctx) {
    var T = ctx.T, waLink = ctx.waLink, bookingUrl = ctx.bookingUrl, descOf = ctx.descOf;
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
    return card;
  }

  root.RR_CARDS = { T: T, ICONS: ICONS, esc: esc, make: make };
})(typeof window !== "undefined" ? window : globalThis);
