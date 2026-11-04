# sito-rivierarent

Sorgenti statiche di https://rivierarent.it/ (HTML, CSS, JS, immagini), importate dal sito pubblicato il 30/10/2026.

- `index.html`, `en/` – home IT/EN
- `proprietari/`, `en/owners/` – pagine per i proprietari
- `lusso/`, `bb-point/`, `classico/`, `privacy.html`
- `assets/js/properties.js` – elenco delle case (dati, prezzi, numero di foto)
- `assets/img/case/<id>/` – copertina e galleria di ogni casa

Note: `assets/img/affitta.jpg` e `assets/img/gestiamo.jpg` sono referenziate nel codice ma non presenti sul sito online (404).
Le cartelle `/anteprime/`, `/cartellone/` e `/offerte-mondiali/` indicate in robots.txt non risultano pubblicate.

## Lingue della home

La home italiana (`index.html`) è il modello: le versioni `/en/`, `/fr/`, `/fr-be/`, `/de/`, `/de-at/`, `/nl/`, `/nl-be/`, `/zh/`, `/ja/`, `/ar/` si generano da lì e **non vanno modificate a mano**.

- Traduzioni: `tools/i18n/<lingua>.json` (testi della pagina, testi delle schede, descrizioni delle case).
- Dopo aver cambiato un testo in `index.html`:
  1. `python3 tools/i18n/build.py --source` aggiorna l'elenco dei testi italiani;
  2. `python3 tools/i18n/build.py` rigenera le pagine e, se manca una traduzione, elenca le frasi da aggiungere nei `.json`;
  3. `python3 tools/i18n/check.py <lingua>` controlla una traduzione (tag HTML, numeri, chiavi mancanti).
- Una casa nuova in `properties.js` senza traduzione mostra la descrizione inglese nelle altre lingue finché non si aggiunge in `desc` dei `.json`.
