/*
 * Prepara per il generatore (build.py) le schede delle case di una lingua, già in HTML,
 * e i dati delle case per i dati strutturati e llms.txt.
 * Uso: node tools/i18n/prerender.js <lingua>   (it, en, fr, de, nl, zh, ja, ar)
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..", "..");
const lang = process.argv[2] || "it";
const ctx = { window: {} };
ctx.globalThis = ctx.window;
vm.createContext(ctx);
const load = (f) => vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, { filename: f });
load("assets/js/config.js");
load("assets/js/properties.js");
load("assets/js/cards.js");
if (lang !== "it") load("assets/js/i18n/" + lang + ".js");

const w = ctx.window;
const C = w.RR_CONFIG, I18N = lang !== "it" ? w.RR_I18N : null;
const T = I18N ? I18N.ui : w.RR_CARDS.T[lang];
const engine = C.booking.engineUrl[lang] || C.booking.engineUrl.en;
const descOf = (p) => (I18N && I18N.desc[p.id]) || p.desc[lang] || p.desc.en || p.desc.it;
const card = w.RR_CARDS.make({
  T: T,
  waLink: (text) => "https://wa.me/" + C.contacts.whatsapp + "?text=" + encodeURIComponent(text || T.waIntro),
  bookingUrl: (base) => base || engine,
  descOf: descOf,
});
const list = w.RR_PROPERTIES;

process.stdout.write(JSON.stringify({
  cards: list.map(card).join("\n"),
  hours: (C.contacts.hours[lang]) || (I18N && I18N.hours) || C.contacts.hours.en,
  engine: engine,
  contacts: C.contacts,
  homesCount: C.homesCount || list.length,
  bbPoint: C.bbPoint.prices,
  T: { area: T.area, type: T.type, guest: T.guest, guests: T.guests, bedroom: T.bedroom, bedrooms: T.bedrooms, bathroom: T.bathroom, bathrooms: T.bathrooms, from: T.from, night: T.night, pool: T.pool, seaView: T.seaView, bike: T.bike },
  properties: list.map((p) => ({
    id: p.id, name: p.name, area: p.area, type: p.type, guests: p.guests, bedrooms: p.bedrooms, bathrooms: p.bathrooms,
    pool: p.pool, seaView: p.seaView, bike: p.bike, fromPrice: p.fromPrice, image: p.image, photos: p.photos,
    bookingUrl: p.bookingUrl || engine, cin: p.cin, citra: p.citra, desc: descOf(p),
  })),
}));
