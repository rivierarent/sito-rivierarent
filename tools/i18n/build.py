"""Genera le home nelle altre lingue a partire dalla home italiana (index.html).

Uso (dalla cartella del sito):
  python3 tools/i18n/build.py            genera /en/, /fr/, /de/, ... e aggiorna il menu lingue
  python3 tools/i18n/build.py --source   aggiorna tools/i18n/source.json (testi italiani da tradurre)

Le traduzioni stanno in tools/i18n/<lingua>.json. Se nella home italiana cambia un testo,
la build si ferma e indica quali frasi mancano: aggiungerle nei file .json e rilanciare
(controllo: python3 tools/i18n/check.py <lingua>).
"""
import html as html_mod
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
import houses  # noqa: E402
import segments  # noqa: E402

SITE = "https://rivierarent.it"

# codice, percorso, lang html, nome nel menu, bandiera, sigla, og:locale, traduzione usata
LANGS = [
    ("it", "/", "it", "Italiano", "it", "IT", "it_IT", None),
    ("en", "/en/", "en", "English", "gb", "EN", "en_GB", "en"),
    ("fr", "/fr/", "fr", "Français", "fr", "FR", "fr_FR", "fr"),
    ("fr-be", "/fr-be/", "fr-BE", "Français (Belgique)", "be", "FR", "fr_BE", "fr"),
    ("de", "/de/", "de", "Deutsch", "de", "DE", "de_DE", "de"),
    ("de-at", "/de-at/", "de-AT", "Deutsch (Österreich)", "at", "DE", "de_AT", "de"),
    ("nl", "/nl/", "nl", "Nederlands", "nl", "NL", "nl_NL", "nl"),
    ("nl-be", "/nl-be/", "nl-BE", "Nederlands (België)", "be", "NL", "nl_BE", "nl"),
    ("zh", "/zh/", "zh-Hans", "中文（简体）", "cn", "ZH", "zh_CN", "zh"),
    ("ja", "/ja/", "ja", "日本語", "jp", "JA", "ja_JP", "ja"),
    ("ar", "/ar/", "ar", "العربية", "ae", "AR", "ar_AE", "ar"),
]
RTL = {"ar"}
MENU_RE = re.compile(r"[ \t]*<!-- lang-menu -->.*?<!-- /lang-menu -->\n?", re.S)
MENU_MARK = "<!--LANGMENU-->"
CARDS_MARK = "<!--CARDS-->"
JSONLD_MARK = "<!--JSONLD-->"
DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def read(path):
    with open(os.path.join(ROOT, path), encoding="utf-8") as f:
        return f.read()


def write(path, text):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(text)


def strip_menu(src):
    """Toglie le parti generate (menu lingue, schede, dati strutturati) lasciando dei segnaposto."""
    src = MENU_RE.sub(MENU_MARK, src, count=1)
    src = re.sub(r"<!-- cards -->.*?<!-- /cards -->", CARDS_MARK, src, count=1, flags=re.S)
    src = re.sub(r"[ \t]*<!-- jsonld -->.*?<!-- /jsonld -->\n?", JSONLD_MARK, src, count=1, flags=re.S)
    return src


def prerender(lang):
    """Schede delle case e dati per una lingua, calcolati da tools/i18n/prerender.js (serve Node)."""
    out = subprocess.run(["node", os.path.join(HERE, "prerender.js"), lang],
                         capture_output=True, text=True, encoding="utf-8", check=True).stdout
    return json.loads(out)


def plain(s):
    return re.sub(r"\s+", " ", html_mod.unescape(re.sub(r"<[^>]+>", " ", s))).strip()


SCHEMA_TYPE = {"apartment": "Apartment", "villa": "House", "house": "House"}


def jsonld(page, code, data):
    _, path, hl, *_ = next(l for l in LANGS if l[0] == code)
    k = data["contacts"]
    desc = re.search(r'<meta name="description" content="([^"]*)"', page).group(1)
    business = {
        "@type": "LodgingBusiness", "@id": SITE + "/#business",
        "name": "Riviera Rent", "alternateName": "Italian Riviera Rent",
        "url": SITE + path, "logo": SITE + "/assets/img/logo.svg", "image": SITE + "/assets/img/og-image.jpg",
        "description": html_mod.unescape(desc),
        "telephone": k["phoneHref"].replace("tel:", ""), "email": k["email"],
        "address": {"@type": "PostalAddress", "streetAddress": "Via Brunenghi 87/100", "postalCode": "17024",
                    "addressLocality": "Finale Ligure", "addressRegion": "SV", "addressCountry": "IT"},
        "areaServed": {"@type": "AdministrativeArea", "name": "Liguria"},
        "openingHoursSpecification": [
            {"@type": "OpeningHoursSpecification", "dayOfWeek": DAYS, "opens": "09:00", "closes": "12:30"},
            {"@type": "OpeningHoursSpecification", "dayOfWeek": DAYS, "opens": "15:00", "closes": "18:00"}],
        "contactPoint": {"@type": "ContactPoint", "telephone": k["phoneHref"].replace("tel:", ""), "email": k["email"],
                         "contactType": "customer service", "availableLanguage": ["Italian", "English"]},
        "priceRange": "€€", "currenciesAccepted": "EUR", "vatID": "IT10293860960",
        "sameAs": [u for u in [k.get("facebook"), k.get("instagram"), k.get("youtube"), k.get("tiktok")] if u],
    }
    T = data["T"]
    items = []
    for i, p in enumerate(data["properties"]):
        a = {"@type": SCHEMA_TYPE.get(p["type"], "Accommodation"), "name": p["name"], "description": p["desc"],
             "url": p["bookingUrl"],
             "address": {"@type": "PostalAddress", "addressRegion": "Liguria", "addressCountry": "IT"}}
        if p["image"]:
            a["image"] = SITE + p["image"]
        if p["guests"]:
            a["occupancy"] = {"@type": "QuantitativeValue", "maxValue": p["guests"], "unitCode": "C62"}
        if p["bedrooms"]:
            a["numberOfBedrooms"] = p["bedrooms"]
        if p["bathrooms"]:
            a["numberOfBathroomsTotal"] = p["bathrooms"]
        feats = [{"@type": "LocationFeatureSpecification", "name": T[f], "value": True} for f in ("pool", "seaView", "bike") if p[f]]
        if feats:
            a["amenityFeature"] = feats
        ids = [{"@type": "PropertyValue", "propertyID": n.upper(), "value": p[n]} for n in ("cin", "citra") if p[n]]
        if ids:
            a["identifier"] = ids
        if p["fromPrice"]:
            a["additionalProperty"] = {"@type": "PropertyValue", "name": "%s € / %s" % (T["from"], T["night"].strip("/ ")),
                                       "value": int(p["fromPrice"]), "unitText": "EUR"}
        items.append({"@type": "ListItem", "position": i + 1, "item": a})
    faq = [{"@type": "Question", "name": plain(q), "acceptedAnswer": {"@type": "Answer", "text": plain(a)}}
           for q, a in re.findall(r"<details[^>]*><summary>(.*?)</summary><p>(.*?)</p></details>", page, re.S)]
    graph = [
        {"@type": "WebSite", "@id": SITE + "/#website", "url": SITE + "/", "name": "Riviera Rent",
         "inLanguage": hl, "publisher": {"@id": SITE + "/#business"}},
        business,
        {"@type": "ItemList", "name": "Riviera Rent", "numberOfItems": len(items), "itemListElement": items},
    ]
    if faq:
        graph.append({"@type": "FAQPage", "inLanguage": hl, "mainEntity": faq})
    body = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=1)
    return '  <!-- jsonld -->\n  <script type="application/ld+json">\n%s\n  </script>\n  <!-- /jsonld -->\n' % body


def fill(page, code, label, data):
    page = fix_head(page, code).replace(MENU_MARK, lang_menu(code, label), 1)
    page = page.replace(CARDS_MARK, "<!-- cards -->\n" + data["cards"] + "\n<!-- /cards -->", 1)
    return page.replace(JSONLD_MARK, jsonld(page, code, data), 1)


def lang_menu(cur, label):
    c = next(l for l in LANGS if l[0] == cur)
    items = []
    for code, path, hl, name, flag, short, _, _ in LANGS:
        current = ' aria-current="page"' if code == cur else ""
        items.append(
            '          <li><a href="%s" hreflang="%s" lang="%s"%s><img src="/assets/img/flags/%s.svg" alt="" width="21" height="14">%s</a></li>'
            % (path, hl, hl, current, flag, name))
    return (
        '      <!-- lang-menu -->\n'
        '      <div class="lang-menu">\n'
        '        <button type="button" class="lang-btn" aria-expanded="false" aria-controls="lang-list" aria-label="%s: %s">'
        '<img src="/assets/img/flags/%s.svg" alt="" width="21" height="14"><span>%s</span>'
        '<svg class="chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3"/></svg></button>\n'
        '        <ul id="lang-list" class="lang-list" hidden>\n%s\n        </ul>\n'
        '      </div>\n'
        '      <!-- /lang-menu -->\n'
    ) % (label, c[3], c[4], c[5], "\n".join(items))


def alternates():
    lines = ['  <link rel="alternate" hreflang="%s" href="%s%s">' % (hl, SITE, path)
             for _, path, hl, *_ in LANGS]
    lines.append('  <link rel="alternate" hreflang="x-default" href="%s/">' % SITE)
    return "\n".join(lines) + "\n"


def fix_head(html, code):
    _, path, hl, _, _, _, locale, _ = next(l for l in LANGS if l[0] == code)
    dir_attr = ' dir="rtl"' if code in RTL else ""
    html = re.sub(r'<html lang="[^"]*"( dir="rtl")?>', '<html lang="%s"%s>' % (hl, dir_attr), html, count=1)
    html = re.sub(r'(<link rel="canonical" href=")[^"]*', r"\g<1>%s%s" % (SITE, path), html, count=1)
    html = re.sub(r'(?:  <link rel="alternate" hreflang="[^"]*" href="[^"]*">\n)+', lambda m: alternates(), html, count=1)
    html = re.sub(r'(<meta property="og:url" content=")[^"]*', r"\g<1>%s%s" % (SITE, path), html, count=1)
    html = re.sub(r'(<meta property="og:locale" content=")[^"]*', r"\g<1>%s" % locale, html, count=1)
    html = html.replace('<a class="logo" href="/"', '<a class="logo" href="%s"' % path, 1)
    return html


def ui_label(code, tr):
    return tr["ui"]["langLabel"] if tr else "Lingua"


def sitemap(house_urls):
    today = __import__("datetime").date.today().isoformat()
    def url(loc, alts=None):
        x = "  <url>\n    <loc>%s%s</loc>\n    <lastmod>%s</lastmod>" % (SITE, loc, today)
        for hl, href in (alts or []):
            x += '\n    <xhtml:link rel="alternate" hreflang="%s" href="%s%s"/>' % (hl, SITE, href)
        return x + "\n  </url>"
    homes = [(hl, path) for _, path, hl, *_ in LANGS] + [("x-default", "/")]
    out = [url(path, homes) for _, path, *_ in LANGS]
    owners = [("it", "/proprietari/"), ("en", "/en/owners/")]
    out += [url("/proprietari/", owners), url("/en/owners/", owners)]
    out += [url(p) for p in ("/lusso/", "/bb-point/", "/riviera-news/")]
    for u in house_urls:
        if u.startswith("/case/"):
            pid = u.split("/")[2]
            alts = [("it", u), ("en", houses.PATHS["en"] % pid), ("x-default", u)]
            out.append(url(u, alts))
            if houses.PATHS["en"] % pid in house_urls:
                out.append(url(houses.PATHS["en"] % pid, alts))
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
            + "\n".join(out) + "\n</urlset>\n")


def llms_txt(rendered):
    """llms.txt: riassunto del sito per gli assistenti AI (ChatGPT, Claude, Perplexity...)."""
    en = rendered["en"]
    k, b = en["contacts"], en["bbPoint"]
    T = en["T"]
    page = read("en/index.html")
    faq = re.findall(r"<details[^>]*><summary>(.*?)</summary><p>(.*?)</p></details>", page, re.S)
    out = [
        "# Riviera Rent",
        "",
        "> Holiday homes in Liguria (Italian Riviera) bookable directly, and short-let property management "
        "for owners across Liguria. Based in Finale Ligure (SV), Italy, for over 20 years. "
        "Operated by Italianrivierarent.com S.r.l., VAT IT10293860960.",
        "",
        "## Key facts",
        "",
        "- %s holiday homes in Liguria, mostly in Finale Ligure (seafront, the medieval village of Finalborgo, the hills inland) and nearby towns such as Pietra Ligure, Borgio Verezzi, Spotorno and Alassio." % en["homesCount"],
        "- Booking direct online on rivierarent.it costs 10% less than the same home and dates on OTAs (Booking.com, Airbnb, Expedia); by phone or WhatsApp 5% less.",
        "- Free loyalty programme (Riviera Rent Club): 1 point per € 10 spent, 100 points = € 50 off the next stay.",
        "- Official partner of Finale Enduro; several bike-friendly homes with bike storage and washing.",
        "- Info point / office: %s. Opening hours: %s." % (k["address"], en["hours"].lower()),
        "- Phone %s · WhatsApp %s · Email %s" % (k["phone"], k["mobile"], k["email"]),
        "- Online booking: %s" % en["engine"],
        "",
        "## Pages",
        "",
        "- [Home (Italian)](%s/): holiday homes, offers, owner services, B&B Point, FAQ, contacts" % SITE,
    ]
    for _, path, hl, name, *_ in LANGS[1:]:
        out.append("- [%s](%s%s): same content in %s" % (name, SITE, path, name))
    out += [
        "- [Owners (Italian)](%s/proprietari/) · [Owners (English)](%s/en/owners/): short-let management for owners" % (SITE, SITE),
        "- [Luxury collection](%s/lusso/): villas with concierge, private chef, driver, tours" % SITE,
        "- [B&B Point](%s/bb-point/): à-la-carte services for owners who self-manage" % SITE,
        "- [Riviera News](%s/riviera-news/): events, things to do and where to eat between Genoa and the Côte d'Azur" % SITE,
        "",
        "## Services for owners",
        "",
        "- Full management: listings and photos, channel manager on Booking.com/Airbnb/Expedia/Vrbo, pricing, guest communication, check-in, cleaning, linen, maintenance, Italian paperwork (CIN, police guest registration, tourist tax). Commission only on actual bookings.",
        "- B&B Point (no management contract): key handover € %s (office hours) or € %s (after hours); linen pack € %s per person (deposit € %s); cleaning from € %s (studio) to € %s (villa); paperwork € %s per booking or € %s per month." % (
            b["keysOffice"], b["keysAfter"], b["linenPack"], b["linenDeposit"], b["cleanStudio"], b["cleanHouse"], b["bureauBooking"], b["bureauMonth"]),
        "",
        "## Holiday homes",
        "",
    ]
    for p in en["properties"]:
        facts = []
        for f in ("guest", "bedroom", "bathroom"):
            n = p[f + "s"]
            if n:
                facts.append("%s %s" % (n, T[f] if n == 1 else T[f + "s"]))
        facts += [T[f] for f in ("pool", "seaView", "bike") if p[f]]
        if p["fromPrice"]:
            facts.append("from € %s per night" % p["fromPrice"])
        link = SITE + p["page"] if p.get("page") else p["bookingUrl"]
        line = "- [%s](%s) — %s, %s. %s" % (p["name"], link, T["type"][p["type"]], T["area"][p["area"]].lower(), p["desc"])
        if facts:
            line += " (%s)" % ", ".join(facts)
        if p["cin"]:
            line += " CIN %s." % p["cin"]
        if p.get("page"):
            line += " Book: %s" % p["bookingUrl"]
        out.append(line)
    if faq:
        out += ["", "## FAQ", ""]
        for q, a in faq:
            out += ["### " + plain(q), "", plain(a), ""]
    return "\n".join(out).rstrip() + "\n"


def build():
    src = read("index.html")
    for mark in ("<!-- lang-menu -->", "<!-- cards -->", "<!-- jsonld -->"):
        if mark not in src:
            sys.exit("Manca il segnaposto %s in index.html" % mark)
    base = strip_menu(src)
    it_ui = json.load(open(os.path.join(HERE, "source.json"), encoding="utf-8"))["ui_it"]

    # 1) traduzioni e testi per main.js (schede delle case, galleria, modulo...)
    loaded = {}
    for tr_code in sorted({l[7] for l in LANGS if l[7]}):
        tr = loaded[tr_code] = json.load(open(os.path.join(HERE, tr_code + ".json"), encoding="utf-8"))
        data = {"lang": tr_code, "ui": tr["ui"], "hours": tr["hours"], "desc": tr["desc"]}
        write("assets/js/i18n/%s.js" % tr_code,
              "/* Generato da tools/i18n/build.py: non modificare a mano, modificare tools/i18n/%s.json */\n"
              "window.RR_I18N = %s;\n" % (tr_code, json.dumps(data, ensure_ascii=False, indent=1)))
    rendered = {c: prerender(c) for c in ["it"] + sorted(loaded)}

    # 2) home italiana: menu, schede e dati strutturati
    write("index.html", fill(base, "it", it_ui["langLabel"], rendered["it"]))

    # 3) le altre lingue
    problems = {}
    for code, path, hl, name, flag, short, locale, tr_code in LANGS[1:]:
        tr = loaded[tr_code]
        missing = []
        page = segments.apply(base, tr["page"], missing)
        if missing:
            problems[tr_code] = sorted(set(missing))
            continue
        page = fill(page, code, tr["ui"]["langLabel"], rendered[tr_code])
        page = page.replace('  <script src="/assets/js/main.js"></script>',
                            '  <script src="/assets/js/i18n/%s.js"></script>\n  <script src="/assets/js/main.js"></script>' % tr_code, 1)
        write(path.strip("/") + "/index.html", page)

    # 4) pagine delle singole case (italiano e inglese), sitemap e scheda del sito per gli assistenti AI
    house_urls = houses.build_houses(ROOT, rendered, write) if not problems else []
    write("sitemap.xml", sitemap(house_urls))
    write("llms.txt", llms_txt(rendered))

    if problems:
        for k, v in problems.items():
            print("\n[%s] mancano %d traduzioni:" % (k, len(v)))
            for s in v:
                print("  - " + s[:120])
        sys.exit(1)
    print("OK: generate %d lingue" % (len(LANGS) - 1))


def make_source():
    base = strip_menu(read("index.html"))
    seen = []
    for _, _, t in segments.extract(base):
        if t not in seen:
            seen.append(t)
        # unita' di prezzo dentro gli attributi dei segmenti (es. data-unit="a pulizia")
        for v in re.findall(r'\sdata-unit="([^"]+)"', t):
            if v not in seen:
                seen.append(v)
    p = os.path.join(HERE, "source.json")
    data = json.load(open(p, encoding="utf-8"))
    data["page"] = seen
    json.dump(data, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("source.json: %d testi" % len(seen))


if __name__ == "__main__":
    make_source() if "--source" in sys.argv else build()
