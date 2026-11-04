"""Estrae dalla home italiana (index.html) i testi da tradurre, con la loro posizione.

Un "segmento" e' il contenuto di un elemento che contiene solo testo e tag in linea
(b, em, i, br, small, strong, a/span senza classe); gli altri testi sono presi nodo per nodo.
Si traducono anche alcuni attributi (aria-label, placeholder, alt, title, content...).
"""
import re
from html.parser import HTMLParser

INLINE = {"b", "em", "i", "br", "small", "strong", "a", "span"}
VOID = {"br", "img", "input", "meta", "link", "source", "hr", "wbr"}
SKIP = {"script", "style", "svg"}
ATTRS = {"aria-label", "placeholder", "alt", "title", "data-label", "data-unit", "content"}
META_TEXT = {"description", "og:title", "og:description"}
LETTERS = re.compile(r"[A-Za-zÀ-ÿ]")


class _P(HTMLParser):
    def __init__(self, src):
        super().__init__(convert_charrefs=False)
        self.src = src
        self.lines = [0]
        for m in re.finditer("\n", src):
            self.lines.append(m.end())
        self.stack = []  # [tag, content_start, inline_only, is_inline]
        self.skip = 0
        self.segs = []   # (start, end, text)
        self.attrs = []  # (start, end, text) offsets of attribute values

    def off(self):
        l, c = self.getpos()
        return self.lines[l - 1] + c

    def handle_starttag(self, tag, attrs):
        start = self.off()
        raw = self.get_starttag_text()
        end = start + len(raw)
        if self.skip or tag in SKIP:
            if tag in SKIP and tag not in VOID:
                self.skip += 1
            return
        is_inline = tag in INLINE and not dict(attrs).get("class")
        if self.stack and not is_inline:
            self.stack[-1][2] = False
        d = dict(attrs)
        for k, v in attrs:
            if k in ATTRS and v and LETTERS.search(v):
                if k == "content" and (d.get("name") or d.get("property")) not in META_TEXT:
                    continue
                m = re.search(r'\s%s="([^"]*)"' % re.escape(k), raw)
                if m:
                    self.attrs.append((start + m.start(1), start + m.end(1), m.group(1)))
        if tag not in VOID:
            self.stack.append([tag, end, True, is_inline, []])

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

    def handle_endtag(self, tag):
        if tag in SKIP:
            self.skip -= 1
            return
        if self.skip or tag in VOID:
            return
        pos = self.off()
        while self.stack:
            t, cstart, inline_only, is_inline, pending = self.stack.pop()
            if t == tag:
                break
        else:
            return
        inner = self.src[cstart:pos]
        has_text = LETTERS.search(re.sub(r"<[^>]+>", "", inner))
        if inline_only and has_text:
            lead = len(inner) - len(inner.lstrip())
            seg = (cstart + lead, cstart + len(inner.rstrip()), inner.strip())
            if is_inline and self.stack and self.stack[-1][2]:
                self.stack[-1][4].append(seg)  # candidato: vale solo se il genitore non e' un segmento
            else:
                self.segs.append(seg)
        elif not inline_only:
            self.segs.extend(pending)

    def handle_data(self, data):
        if self.skip or not self.stack or not LETTERS.search(data):
            return
        s = self.off()
        lead = len(data) - len(data.lstrip())
        self.stack[-1][4].append((s + lead, s + len(data.rstrip()), data.strip()))

    def handle_entityref(self, name):
        pass


def extract(src):
    p = _P(src)
    p.feed(src)
    items = p.segs + p.attrs
    items.sort()
    # niente sovrapposizioni
    out, last = [], -1
    for s, e, t in items:
        if s >= last:
            out.append((s, e, t))
            last = e
    return out


def apply(src, table, missing):
    parts, pos = [], 0
    for s, e, t in extract(src):
        parts.append(src[pos:s])
        if t in table:
            parts.append(table[t])
        else:
            missing.append(t)
            parts.append(t)
        pos = e
    parts.append(src[pos:])
    # attributi rimasti dentro i segmenti tradotti (es. data-unit="a persona" in "da <b ...>")
    attr_re = r'(\s(?:%s)=")([^"]*)(")' % "|".join(sorted(ATTRS - {"content"}))
    return re.sub(attr_re, lambda m: m.group(1) + table.get(m.group(2), m.group(2)) + m.group(3), "".join(parts))
