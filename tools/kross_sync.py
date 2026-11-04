"""Scarica da Kross i dettagli delle case (descrizione completa, dotazioni, letti, orari, località)
in italiano e inglese, per le pagine delle singole case.

Uso (dalla cartella del sito):  python3 tools/kross_sync.py
Poi rigenerare il sito:        python3 tools/i18n/build.py

Scrive tools/kross/data.json. Le case sono quelle di assets/js/properties.js (campo bookingUrl).
"""
import html
import http.cookiejar
import json
import os
import re
import subprocess
import time
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORTAL = "https://italianrivierarent.kross.travel"
OUT = os.path.join(ROOT, "tools", "kross", "data.json")


def properties():
    js = "global.window={};require(%r);process.stdout.write(JSON.stringify(window.RR_PROPERTIES))" % os.path.join(ROOT, "assets/js/properties.js")
    return json.loads(subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True).stdout)


def session(lang):
    """Kross sceglie la lingua per sessione: si apre prima la home nella lingua voluta."""
    jar = http.cookiejar.CookieJar()
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
    op.addheaders = [("User-Agent", "Mozilla/5.0 (compatible; RivieraRentSync/1.0)")]
    op.open(PORTAL + "/" + lang, timeout=30).read()
    return op


def text(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()


def section(page, name):
    m = re.search(r'apt-detail-section-%s">(.*?)<a name=' % name, page, re.S)
    return m.group(1) if m else ""


def parse(page):
    d = {}
    m = re.search(r'id="description-apartment-p"[^>]*>(.*?)</div>', page, re.S)
    if m:
        paras = [text(p) for p in re.split(r"(?:<br\s*/?>\s*){2,}", m.group(1))]
        d["desc"] = [p for p in paras if p]
    # [icona, testo]: l'icona e' uguale in tutte le lingue e serve a tradurre le dotazioni
    am = re.findall(r'<div class="apt-amenity[^"]*"[^>]*>\s*<i class="[^"]*?\b(icon-[\w-]+)[^"]*"></i>\s*<span[^>]*>([^<]+)</span>', section(page, "dotazioni"))
    seen = []
    for icon, a in ((i, html.unescape(x).strip()) for i, x in am):
        if a and a.lower() not in [s[1].lower() for s in seen]:
            seen.append([icon, a])
    d["amenities"] = seen
    beds = []
    m = re.search(r'apt-detail-section-letti">(.*?)(?:buttonMoreAmenities|reservationSummary)', page, re.S)
    for col in (m.group(1).split('<div class="col mb-1">')[1:] if m else []):
        room = re.search(r'font-weight: 600;">([^<]+)<', col)
        items = [html.unescape(x).strip() for x in re.findall(r"</i>\s*<span>([^<]+)</span>", col)]
        if room and items:
            beds.append([html.unescape(room.group(1)).strip(), items])
    d["beds"] = beds
    ci = re.search(r"<b>Check-in</b>:\s*([^<]+)<", page)
    co = re.search(r"<b>Check-out</b>:\s*([^<]+)<", page)
    d["checkin"] = ci.group(1).strip() if ci else ""
    d["checkout"] = co.group(1).strip() if co else ""
    for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>', page, re.S):
        try:
            j = json.loads(b)
        except ValueError:
            continue
        if j.get("@type") == "VacationRental":
            a = j.get("address", {})
            d["locality"] = " ".join(w.capitalize() for w in (a.get("addressLocality") or "").split())
            d["postalCode"] = (a.get("postalCode") or "").strip()
            size = (j.get("containsPlace", {}).get("floorSize") or {}).get("value")
            d["sqm"] = size or None
    return d


def main():
    props = [p for p in properties() if p.get("bookingUrl", "").startswith(PORTAL)]
    data = {}
    if os.path.exists(OUT):
        data = json.load(open(OUT, encoding="utf-8"))
    ops = {l: session(l) for l in ("it", "en")}
    for p in props:
        entry = {}
        for lang, op in ops.items():
            try:
                op.open(PORTAL + "/" + lang, timeout=30).read()  # Kross dopo qualche pagina torna all'italiano
                page = op.open(p["bookingUrl"], timeout=30).read().decode("utf-8", "replace")
            except Exception as e:  # noqa: BLE001
                print("  %s (%s): errore %s" % (p["id"], lang, e))
                continue
            d = parse(page)
            for k in ("checkin", "checkout", "locality", "postalCode", "sqm"):
                if d.get(k) and not entry.get(k):
                    entry[k] = d.pop(k)
                else:
                    d.pop(k, None)
            entry[lang] = d
            time.sleep(0.5)
        if entry.get("it", {}).get("desc"):
            data[p["id"]] = entry
            print("%-24s %-16s %2d paragrafi, %2d dotazioni, %d camere" % (
                p["id"], entry.get("locality", ""), len(entry["it"]["desc"]), len(entry["it"]["amenities"]), len(entry["it"]["beds"])))
        else:
            print("%-24s nessuna descrizione trovata su Kross" % p["id"])
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(data, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("Salvate %d case in %s" % (len(data), os.path.relpath(OUT, ROOT)))


if __name__ == "__main__":
    main()
