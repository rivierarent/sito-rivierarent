"""Genera le home nelle altre lingue a partire dalla home italiana (index.html).

Uso (dalla cartella del sito):
  python3 tools/i18n/build.py            genera /en/, /fr/, /de/, ... e aggiorna il menu lingue
  python3 tools/i18n/build.py --source   aggiorna tools/i18n/source.json (testi italiani da tradurre)

Le traduzioni stanno in tools/i18n/<lingua>.json. Se nella home italiana cambia un testo,
la build si ferma e indica quali frasi mancano: aggiungerle nei file .json e rilanciare
(controllo: python3 tools/i18n/check.py <lingua>).
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
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


def read(path):
    with open(os.path.join(ROOT, path), encoding="utf-8") as f:
        return f.read()


def write(path, text):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(text)


def strip_menu(src):
    """Toglie il menu lingue (non va tradotto) lasciando un segnaposto."""
    return MENU_RE.sub(MENU_MARK, src, count=1)


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


def build():
    src = read("index.html")
    if "<!-- lang-menu -->" not in src:
        sys.exit("Manca il menu lingue in index.html (segnaposto <!-- lang-menu --> ... <!-- /lang-menu -->)")
    base = strip_menu(src)
    it_ui = json.load(open(os.path.join(HERE, "source.json"), encoding="utf-8"))["ui_it"]

    # 1) home italiana: aggiorna solo menu e link alternativi
    it_html = fix_head(base, "it").replace(MENU_MARK, lang_menu("it", it_ui["langLabel"]), 1)
    write("index.html", it_html)

    problems = {}
    loaded = {}
    for code, path, hl, name, flag, short, locale, tr_code in LANGS[1:]:
        if tr_code not in loaded:
            loaded[tr_code] = json.load(open(os.path.join(HERE, tr_code + ".json"), encoding="utf-8"))
        tr = loaded[tr_code]
        missing = []
        html = segments.apply(base, tr["page"], missing)
        if missing:
            problems[tr_code] = sorted(set(missing))
            continue
        html = fix_head(html, code).replace(MENU_MARK, lang_menu(code, tr["ui"]["langLabel"]), 1)
        html = html.replace('  <script src="/assets/js/main.js"></script>',
                            '  <script src="/assets/js/i18n/%s.js"></script>\n  <script src="/assets/js/main.js"></script>' % tr_code, 1)
        write(path.strip("/") + "/index.html", html)

    # 2) testi per main.js (schede delle case, galleria, modulo...)
    for tr_code, tr in loaded.items():
        data = {"lang": tr_code, "ui": tr["ui"], "hours": tr["hours"], "desc": tr["desc"]}
        write("assets/js/i18n/%s.js" % tr_code,
              "/* Generato da tools/i18n/build.py: non modificare a mano, modificare tools/i18n/%s.json */\n"
              "window.RR_I18N = %s;\n" % (tr_code, json.dumps(data, ensure_ascii=False, indent=1)))

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
