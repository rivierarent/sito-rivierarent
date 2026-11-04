/*
 * Riviera News: scrive nell'HTML (in italiano) i contenuti che la pagina crea con il JavaScript,
 * così Google e gli assistenti AI li leggono anche senza eseguire gli script.
 * Il JavaScript della pagina li ricrea comunque all'apertura, nella lingua del visitatore.
 *
 * Uso (serve Playwright):  node tools/prerender-news.js
 * Rilanciarlo dopo aver cambiato eventi, luoghi o ristoranti in riviera-news/index.html.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const FILE = path.join(__dirname, "..", "riviera-news", "index.html");
const OPEN = "<!--pre-->", CLOSE = "<!--/pre-->";

const SITE = "https://rivierarent.it";

// Dati strutturati: la pagina e gli eventi non ancora finiti (risultati "Eventi" di Google)
function jsonld(events) {
  const today = new Date().toISOString().slice(0, 10);
  const list = events.filter((e) => (e.end || e.date) >= today).map((e) => {
    const [name, place, desc] = e.t.it || e.t.en;
    const ev = {
      "@type": "Event", name, description: desc, startDate: e.date, endDate: e.end || e.date,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: { "@type": "Place", name: place, address: { "@type": "PostalAddress", addressLocality: place.split(",")[0], addressCountry: e.zone === "azur" ? "FR" : "IT" } },
    };
    if (e.img) ev.image = SITE + e.img;
    if (e.url) ev.url = e.url;
    return ev;
  });
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", "@id": SITE + "/riviera-news/", url: SITE + "/riviera-news/", name: "Riviera News",
        inLanguage: "it", about: ["Liguria", "Côte d'Azur"], publisher: { "@id": SITE + "/#business" } },
      { "@type": "ItemList", name: "Eventi in Liguria e Costa Azzurra", numberOfItems: list.length,
        itemListElement: list.map((item, i) => ({ "@type": "ListItem", position: i + 1, item })) },
    ],
  };
  return '\n<script type="application/ld+json">\n' + JSON.stringify(data, null, 1) + "\n</script>\n";
}

(async () => {
  let src = fs.readFileSync(FILE, "utf8");
  // 1) toglie i contenuti scritti in un giro precedente
  src = src.replace(/<!--pre-->[\s\S]*?<!--\/pre-->/g, "");
  src = src.replace(/(<(\w+)[^>]*\sdata-i18n="[^"]+"[^>]*>)[^<]*(<\/\2>)/g, "$1$3");

  // 2) contenitori vuoti (id="...") che il JavaScript riempie
  const ids = [...src.matchAll(/<(div|g|section|ul)\b[^>]*\sid="([\w-]+)"[^>]*><\/\1>/g)].map((m) => m[2]);

  const browser = await chromium.launch();
  const page = await browser.newPage({ locale: "it-IT" });
  await page.route("**/*", (r) => (r.request().url().startsWith("file:") ? r.continue() : r.abort()));
  await page.addInitScript(() => { try { localStorage.clear(); } catch (e) {} });
  await page.goto("file://" + FILE + "?lang=it&region=all", { waitUntil: "load" });
  await page.waitForTimeout(500);
  const out = await page.evaluate((ids) => ({
    html: Object.fromEntries(ids.map((id) => [id, (document.getElementById(id) || {}).innerHTML || ""])),
    i18n: Object.fromEntries([...document.querySelectorAll("[data-i18n]")].map((e) => [e.dataset.i18n, e.textContent])),
    // eslint-disable-next-line no-undef
    events: typeof EVENTS !== "undefined" ? EVENTS : [],
  }), ids);
  await browser.close();

  // 3) riscrive i contenuti nel file
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  let filled = 0;
  for (const id of ids) {
    const inner = out.html[id];
    if (!inner || !inner.trim()) continue;
    src = src.replace(new RegExp('(<(div|g|section|ul)\\b[^>]*\\sid="' + id + '"[^>]*>)(</\\2>)'), (m, a, t, b) => a + OPEN + inner + CLOSE + b);
    filled++;
  }
  src = src.replace(/(<(\w+)[^>]*\sdata-i18n="([^"]+)"[^>]*>)(<\/\2>)/g, (m, a, t, k, b) => a + esc(out.i18n[k] || "") + b);
  src = src.replace(/<!-- jsonld -->[\s\S]*?<!-- \/jsonld -->/, () => "<!-- jsonld -->" + jsonld(out.events) + "<!-- /jsonld -->");
  fs.writeFileSync(FILE, src);
  console.log("Riviera News: riempiti " + filled + " contenitori e " + Object.keys(out.i18n).length + " testi");
})();
