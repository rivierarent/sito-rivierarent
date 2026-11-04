"""Controlla una traduzione: python3 tools/i18n/check.py fr"""
import json, re, sys, os
from collections import Counter

here = os.path.dirname(os.path.abspath(__file__))
src = json.load(open(os.path.join(here, "source.json"), encoding="utf-8"))
lang = sys.argv[1]
tr = json.load(open(os.path.join(here, lang + ".json"), encoding="utf-8"))
errors = []

def tags(s):
    return Counter(re.findall(r"</?[a-z]+[^>]*>", s))

def nums(s):
    s = re.sub(r"<[^>]+>", "", s)
    return set(re.findall(r"\d+", s))


def nums_ok(it, t):
    # ogni numero dell'italiano deve esserci anche nella traduzione (ne puo' avere altri, es. "6月")
    return nums(it) <= nums(t)

page = tr.get("page", {})
for it in src["page"]:
    if it not in page:
        errors.append("page: manca la chiave %r" % it[:80]); continue
    t = page[it]
    if not isinstance(t, str) or not t.strip():
        errors.append("page: traduzione vuota per %r" % it[:80]); continue
    if tags(it) != tags(t):
        errors.append("page: tag HTML diversi in %r -> %r" % (it[:60], t[:60]))
    if not nums_ok(it, t):
        errors.append("page: numeri diversi in %r -> %r" % (it[:60], t[:60]))
    if re.search(r"&(?!amp;|nbsp;|#\d+;)", t):
        errors.append("page: & non codificato (usa &amp;) in %r" % t[:60])
for k in page:
    if k not in src["page"]:
        errors.append("page: chiave in piu' (non esiste nell'italiano) %r" % k[:80])

def same_shape(a, b, path):
    if isinstance(a, dict):
        if not isinstance(b, dict):
            errors.append("ui: %s deve essere un oggetto" % path); return
        for k in a:
            if k not in b: errors.append("ui: manca %s.%s" % (path, k))
            else: same_shape(a[k], b[k], path + "." + k)
    elif not isinstance(b, str) or not b.strip():
        errors.append("ui: %s vuoto" % path)
same_shape(src["ui_it"], tr.get("ui"), "ui")
if not tr.get("hours") or not nums_ok(src["hours_it"], tr["hours"]):
    errors.append("hours mancante o con orari diversi")
for k, v in src["desc_it"].items():
    d = tr.get("desc", {}).get(k)
    if not d: errors.append("desc: manca %s" % k)
    elif not nums_ok(v, d): errors.append("desc: numeri diversi in %s" % k)

print("\n".join(errors) if errors else "OK: %s supera tutti i controlli" % lang)
sys.exit(1 if errors else 0)
