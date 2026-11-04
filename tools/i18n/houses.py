"""Pagine delle singole case (/case/<id>/ in italiano, /en/homes/<id>/ in inglese).

Le genera build.py usando la home appena generata (intestazione, piede, script),
i dati delle case (properties.js, tramite prerender.js) e i dettagli scaricati da Kross
(tools/kross/data.json, con tools/kross_sync.py; tools/kross/en_manual.json per gli inglesi mancanti).
"""
import html
import json
import os
import re
from urllib.parse import quote

SITE = "https://rivierarent.it"
PATHS = {"it": "/case/%s/", "en": "/en/homes/%s/"}
HOME = {"it": "/", "en": "/en/"}

TXT = {
    "it": {
        "title": "{name} – {type} a {loc} | Riviera Rent",
        "metaTail": "Prenota diretto: -10% rispetto ai portali.",
        "home": "Home", "homes": "Case vacanza", "allPhotos": "Vedi tutte le {n} foto",
        "about": "La casa", "amenities": "Dotazioni", "beds": "Disposizione dei letti",
        "times": "Arrivo e partenza", "checkin": "Check-in", "checkout": "Check-out",
        "where": "Dove si trova", "whereText": "{loc}, in Liguria. L'indirizzo esatto e le indicazioni per arrivare te li mandiamo con la conferma della prenotazione.",
        "map": "Vedi la zona su Google Maps", "codes": "Codici della struttura",
        "bookTitle": "Prenota diretto", "fromLong": "a partire da", "perNight": "a notte, pulizie e biancheria incluse",
        "bookNote": "Online su questo sito paghi il 10% in meno rispetto ai prezzi OTA (Booking.com, Airbnb…); al telefono o su WhatsApp il 5% in meno. E ad ogni soggiorno accumuli i punti del Riviera Rent Club.",
        "others": "Altre case a {loc}", "othersAny": "Altre case vacanza", "allHomes": "Tutte le case vacanza",
        "sqm": "m²", "gallery": "Galleria foto",
    },
    "en": {
        "title": "{name} – holiday {typel} in {loc}, Liguria | Riviera Rent",
        "metaTail": "Book direct: 10% less than on the big portals.",
        "home": "Home", "homes": "Holiday homes", "allPhotos": "See all {n} photos",
        "about": "The home", "amenities": "Amenities", "beds": "Sleeping arrangements",
        "times": "Arrival and departure", "checkin": "Check-in", "checkout": "Check-out",
        "where": "Location", "whereText": "{loc}, Liguria (Italian Riviera). We send you the exact address and directions with your booking confirmation.",
        "map": "See the area on Google Maps", "codes": "Registration codes",
        "bookTitle": "Book direct", "fromLong": "from", "perNight": "per night, cleaning and linen included",
        "bookNote": "Booking online on this site costs 10% less than OTA prices (Booking.com, Airbnb…); by phone or WhatsApp 5% less. Every stay earns Riviera Rent Club points.",
        "others": "More homes in {loc}", "othersAny": "More holiday homes", "allHomes": "All holiday homes",
        "sqm": "m²", "gallery": "Photo gallery",
    },
}
SCHEMA_TYPE = {"apartment": "Apartment", "villa": "House", "house": "House"}
CIN_PREFIX = re.compile(r"^\s*(?:COD\.?\s*)?CIN\s*:?\s*\S+\s*(?:-\s*(?:COD\.?\s*)?CITR[A]?\s*:?\s*\S+)?\s*", re.I)


def esc(s):
    return html.escape(str(s), quote=True)


def clean_desc(paras):
    out = []
    for i, p in enumerate(paras):
        if i == 0:
            p = CIN_PREFIX.sub("", p)
        p = p.strip()
        if p:
            out.append(p)
    return out


def amenity_labels(k, lang, en_names):
    items = k.get(lang, {}).get("amenities") or []
    if lang == "en" and k.get("_en_missing"):
        items = [[i, en_names.get(i, t)] for i, t in k["it"]["amenities"]]
    seen, out = set(), []
    for _, t in items:
        if t.lower() not in seen:
            seen.add(t.lower())
            out.append(t)
    return sorted(out, key=str.lower)


def beds_for(k, lang):
    beds = k.get(lang, {}).get("beds") or []
    if lang == "en" and k.get("_en_missing"):
        tr = {"Camera da letto": "Bedroom", "Soggiorno": "Living room", "Salotto": "Living room",
              "letto matrimoniale": "double bed", "letto singolo": "single bed", "letti singoli": "single beds",
              "divano letto": "sofa bed", "letto a castello": "bunk bed", "letto alla francese": "small double bed"}
        def t(s):
            for a, b in tr.items():
                s = s.replace(a, b)
            return s
        beds = [[t(r), [t(x) for x in items]] for r, items in k["it"]["beds"]]
    return beds


def header_parts(home_html):
    """Prende intestazione, piede, pulsante WhatsApp, banner cookie e script dalla home generata."""
    get = lambda pat: re.search(pat, home_html, re.S).group(0)
    return {
        "head_fonts": get(r'  <link rel="preconnect" href="https://fonts.googleapis.com">.*?<link rel="stylesheet" href="/alternativa/alt.css">'),
        "header": get(r'  <header class="site-header">.*?</header>'),
        "footer": get(r'  <footer class="site-footer">.*?</footer>'),
        "fab": get(r'  <a class="fab".*?</a>'),
        "cookie": get(r'  <div id="cookie-bar".*?</div>'),
        "scripts": "\n".join(l for l in home_html.splitlines() if l.strip().startswith("<script src=") and "alt.js" not in l),
        "skip": get(r'<a class="skip"[^>]*>[^<]*</a>'),
    }


def lang_menu_for(menu_html, pid, langs):
    """Nel menu lingue della casa: italiano e inglese portano alla stessa casa, le altre lingue alla loro home."""
    def fix(m):
        href, hl = m.group(1), m.group(2)
        code = hl.split("-")[0].lower()
        if hl == "it":
            new = PATHS["it"] % pid
        elif hl == "en":
            new = PATHS["en"] % pid
        else:
            new = href + "#case"
        return '<a href="%s" hreflang="%s"' % (new, hl)
    return re.sub(r'<a href="([^"]+)" hreflang="([^"]+)"', fix, menu_html)


def page(lang, p, k, data, parts, en_names, others):
    t = TXT[lang]
    T = data["T"]
    pid = p["id"]
    url = SITE + PATHS[lang] % pid
    loc = k.get("locality") or "Liguria"
    typ = T["type"][p["type"]]
    desc = clean_desc((k.get(lang) or {}).get("desc") or [])
    if lang == "en" and k.get("_en_missing"):
        desc = k["_en_manual"]
    short = p["desc"]
    facts = []
    for f in ("guest", "bedroom", "bathroom"):
        n = p[f + "s"]
        if n:
            facts.append("%s %s" % (n, T[f] if n == 1 else T[f + "s"]))
    if k.get("sqm"):
        facts.append("%s %s" % (k["sqm"], t["sqm"]))
    tags = [T[f] for f in ("pool", "seaView", "bike") if p[f]]
    title = t["title"].format(name=p["name"], type=typ, typel=typ.lower(), loc=loc)
    meta = "%s %s. %s" % (short.rstrip("."), (" · ".join(facts)) and ("· " + " · ".join(facts)) or "", t["metaTail"])
    meta = re.sub(r"\s+", " ", meta.replace(" .", ".")).strip()
    photos = p["photos"] or 0
    pics = ["/assets/img/case/%s/%02d.jpg" % (pid, i + 1) for i in range(min(photos, 5))] or ([p["image"]] if p["image"] else [])
    amen = amenity_labels(k, lang, en_names)
    beds = beds_for(k, lang)

    # --- header con link alla home e menu lingue della casa
    header = re.sub(r'\s*<a href="#offerte">[^<]*</a>', "", parts["header"])  # le offerte si accendono solo in home
    header = header.replace('href="#', 'href="%s#' % HOME[lang])
    header = re.sub(r"<!-- lang-menu -->.*?<!-- /lang-menu -->", lambda m: lang_menu_for(m.group(0), pid, None), header, flags=re.S)

    mosaic = "".join(
        '<button type="button" class="gal-open house-pic%s" data-gallery="%s" data-index="%d" aria-label="%s – %d">'
        '<img src="%s" alt="%s – %d" %s></button>' % (
            " house-pic-main" if i == 0 else "", pid, i, esc(t["gallery"]), i + 1, esc(src), esc(p["name"]), i + 1,
            'fetchpriority="high"' if i == 0 else 'loading="lazy"')
        for i, src in enumerate(pics))
    more = ('<button type="button" class="gal-open house-all btn btn-line" data-gallery="%s">%s</button>' % (pid, esc(t["allPhotos"].format(n=photos)))) if photos > 5 else ""

    blocks = []
    if desc:
        blocks.append('<section class="house-sec"><h2>%s</h2>%s</section>' % (t["about"], "".join("<p>%s</p>" % esc(x) for x in desc)))
    if amen:
        blocks.append('<section class="house-sec"><h2>%s</h2><ul class="house-amen">%s</ul></section>' % (t["amenities"], "".join("<li>%s</li>" % esc(a) for a in amen)))
    if beds:
        blocks.append('<section class="house-sec"><h2>%s</h2><ul class="house-beds">%s</ul></section>' % (
            t["beds"], "".join("<li><b>%s</b>%s</li>" % (esc(r), "".join("<span>%s</span>" % esc(x) for x in items)) for r, items in beds)))
    if k.get("checkin") or k.get("checkout"):
        blocks.append('<section class="house-sec"><h2>%s</h2><dl class="house-times"><div><dt>%s</dt><dd>%s</dd></div><div><dt>%s</dt><dd>%s</dd></div></dl></section>' % (
            t["times"], t["checkin"], esc(k.get("checkin", "")), t["checkout"], esc(k.get("checkout", ""))))
    blocks.append('<section class="house-sec"><h2>%s</h2><p>%s</p><p><a class="house-map" href="https://www.google.com/maps/search/?api=1&amp;query=%s" target="_blank" rel="noopener">%s →</a></p></section>' % (
        t["where"], esc(t["whereText"].format(loc=loc)), quote(loc + ", Liguria, Italia"), t["map"]))
    codes = [("CIN", p["cin"]), ("CITRA", p["citra"])]
    codes = [c for c in codes if c[1]]
    if codes:
        blocks.append('<section class="house-sec"><h2>%s</h2><p class="cin">%s</p></section>' % (t["codes"], " · ".join("%s %s" % (a, esc(b)) for a, b in codes)))

    wa = "https://wa.me/%s?text=%s" % (data["contacts"]["whatsapp"], quote("%s: %s" % (data["waIntro"], p["name"])))
    price = ('<p class="house-price"><small>%s</small><b>€ %s</b><span>%s</span></p>' % (t["fromLong"], esc(p["fromPrice"]), t["perNight"])) if p["fromPrice"] else ""
    aside = ('<aside class="house-book"><h2>%s</h2>%s'
             '<a class="btn btn-sea" target="_blank" rel="noopener" data-where="house" data-property="%s" href="%s">%s</a>'
             '<a class="btn btn-line" target="_blank" rel="noopener" data-where="house" href="%s">%s</a>'
             '<p>%s</p></aside>') % (t["bookTitle"], price, pid, esc(p["bookingUrl"]), T["book"], esc(wa), T["details"], t["bookNote"])

    other_html = ""
    if others:
        same_loc = all(o[1] == loc for o in others)
        other_html = ('<section class="house-others container"><h2>%s</h2><div class="house-others-grid">%s</div>'
                      '<p><a class="btn btn-line" href="%s#case">%s →</a></p></section>') % (
            t["others"].format(loc=loc) if same_loc else t["othersAny"],
            "".join('<a class="house-other" href="%s"><img src="%s" alt="%s" loading="lazy"><b>%s</b><span>%s · %s</span></a>' % (
                PATHS[lang] % o[0]["id"], esc(o[0]["image"]), esc(o[0]["name"]), esc(o[0]["name"]), esc(T["type"][o[0]["type"]]), esc(o[1]))
                for o in others),
            HOME[lang], t["allHomes"])

    crumbs = [(t["home"], SITE + HOME[lang]), (t["homes"], SITE + HOME[lang] + "#case"), (p["name"], url)]
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "VacationRental", "@id": url + "#rental", "name": p["name"], "url": url, "description": " ".join(desc) or short,
         "image": [SITE + x for x in pics] or None,
         "identifier": p["cin"] or pid,
         "brand": {"@id": SITE + "/#business"},
         "address": {"@type": "PostalAddress", "addressLocality": loc, "postalCode": k.get("postalCode") or None,
                     "addressRegion": "Liguria", "addressCountry": "IT"},
         "checkinTime": (k.get("checkin") or "").split(" ")[0] or None,
         "checkoutTime": (k.get("checkout") or "").split(" ")[0] or None,
         "containsPlace": {"@type": SCHEMA_TYPE.get(p["type"], "Accommodation"), "additionalType": "EntirePlace",
                           "occupancy": {"@type": "QuantitativeValue", "value": p["guests"]} if p["guests"] else None,
                           "numberOfBedrooms": p["bedrooms"], "numberOfBathroomsTotal": p["bathrooms"],
                           "amenityFeature": [{"@type": "LocationFeatureSpecification", "name": a, "value": True} for a in amen] or None}},
        {"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": n, "item": u} for i, (n, u) in enumerate(crumbs)]},
    ]}

    def prune(o):
        if isinstance(o, dict):
            return {a: prune(b) for a, b in o.items() if b not in (None, "", [])}
        if isinstance(o, list):
            return [prune(x) for x in o]
        return o
    ld = prune(ld)

    alt = "\n".join('  <link rel="alternate" hreflang="%s" href="%s%s">' % (h, SITE, PATHS[h] % pid) for h in ("it", "en"))
    alt += '\n  <link rel="alternate" hreflang="x-default" href="%s%s">' % (SITE, PATHS["it"] % pid)
    og_img = SITE + (pics[0] if pics else "/assets/img/og-image.jpg")

    return """<!doctype html>
<html lang="{lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{meta}">
  <link rel="canonical" href="{url}">
{alt}
  <meta property="og:type" content="website">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{meta}">
  <meta property="og:url" content="{url}">
  <meta property="og:locale" content="{locale}">
  <meta property="og:site_name" content="Riviera Rent">
  <meta property="og:image" content="{og_img}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#fbf5ec">
  <link rel="icon" href="/assets/img/logo.svg">
{fonts}
  <script type="application/ld+json">
{ld}
  </script>
</head>
<body class="house-page">
  {skip}
{header}

  <main id="main" class="house container">
    <nav class="crumbs" aria-label="breadcrumb"><a href="{home}">{t_home}</a> › <a href="{home}#case">{t_homes}</a> › <span aria-current="page">{name}</span></nav>
    <div class="house-head">
      <p class="kicker">{typ} · {loc_e} · {area}</p>
      <h1>{name}</h1>
      <p class="house-facts">{facts}</p>
      {tags}
    </div>
    <div class="house-mosaic">{mosaic}</div>
    {more}
    <div class="house-grid">
      <div class="house-main"><p class="lead">{short}</p>{blocks}</div>
      {aside}
    </div>
  </main>
  {others}

{footer}

{fab}

{cookie}

{scripts}
</body>
</html>
""".format(
        lang=lang, title=esc(title), meta=esc(meta), url=url, alt=alt, locale="it_IT" if lang == "it" else "en_GB",
        og_img=og_img, fonts=parts["head_fonts"], ld=json.dumps(ld, ensure_ascii=False, indent=1), skip=parts["skip"],
        header=header, home=HOME[lang], t_home=t["home"], t_homes=t["homes"], name=esc(p["name"]), typ=esc(typ), loc_e=esc(loc),
        area=esc(T["area"][p["area"]]), facts=" · ".join(esc(f) for f in facts),
        tags=('<div class="tags">%s</div>' % "".join('<span class="tag">%s</span>' % esc(x) for x in tags)) if tags else "",
        mosaic=mosaic, more=more, short=esc(short), blocks="".join(blocks), aside=aside, others=other_html,
        footer=parts["footer"], fab=parts["fab"], cookie=parts["cookie"], scripts=parts["scripts"])


def build_houses(root, rendered, write):
    kfile = os.path.join(root, "tools", "kross", "data.json")
    if not os.path.exists(kfile):
        return []
    kross = json.load(open(kfile, encoding="utf-8"))
    manual = json.load(open(os.path.join(root, "tools", "kross", "en_manual.json"), encoding="utf-8"))
    # nomi inglesi delle dotazioni, ricavati dalle case che li hanno su Kross (stessa icona = stessa dotazione)
    en_names = {}
    for k in kross.values():
        k["_en_missing"] = k.get("en", {}).get("desc") == k["it"]["desc"] or not k.get("en", {}).get("desc")
        if k["_en_missing"] and k.get("en") is not None:
            pass
        elif k.get("en"):
            for icon, name in k["en"]["amenities"]:
                en_names.setdefault(icon, name)
    urls = []
    for lang in ("it", "en"):
        data = rendered[lang]
        home_html = open(os.path.join(root, HOME[lang].strip("/"), "index.html") if lang == "en" else os.path.join(root, "index.html"), encoding="utf-8").read()
        parts = header_parts(home_html)
        data["waIntro"] = data.get("waIntro") or ""
        props = [p for p in data["properties"] if p["id"] in kross]
        for p in props:
            k = kross[p["id"]]
            if lang == "en" and k["_en_missing"]:
                if p["id"] not in manual:
                    continue
                k["_en_manual"] = manual[p["id"]]
            loc = k.get("locality")
            same = [(o, kross[o["id"]].get("locality")) for o in props if o["id"] != p["id"] and kross[o["id"]].get("locality") == loc]
            if len(same) < 3:
                same += [(o, kross[o["id"]].get("locality")) for o in props if o["id"] != p["id"] and o["area"] == p["area"] and (o, kross[o["id"]].get("locality")) not in same]
            write((PATHS[lang] % p["id"]).strip("/") + "/index.html", page(lang, p, k, data, parts, en_names, same[:3]))
            urls.append(PATHS[lang] % p["id"])
    return urls
