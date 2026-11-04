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
- La build richiede Python 3 e Node.js. **Va rilanciata anche dopo aver modificato `properties.js` o `config.js`**: scrive le schede delle case direttamente nell'HTML, insieme ai dati strutturati e a `llms.txt`.

## Pagine delle case

- Ogni casa ha la sua pagina: `/case/<id>/` in italiano e `/en/homes/<id>/` in inglese (nelle altre lingue le schede portano alla pagina inglese).
- Descrizione completa, dotazioni, letti e orari arrivano da Kross: `python3 tools/kross_sync.py` li scarica in `tools/kross/data.json`, poi `python3 tools/i18n/build.py` rigenera le pagine.
- Se su Kross manca il testo inglese di una casa, la traduzione va in `tools/kross/en_manual.json` (la sincronizzazione non lo tocca).
- Una casa nuova in `properties.js` ottiene la sua pagina dopo `kross_sync.py` + `build.py`.
- La sitemap la genera la build.

## SEO, GEO e AEO

- Le schede delle case sono già nell'HTML (non solo create dal JavaScript), così le leggono Google e gli assistenti AI (ChatGPT, Claude, Perplexity), che di solito non eseguono gli script.
- Dati strutturati schema.org in ogni lingua: azienda (`LodgingBusiness`), elenco delle case, FAQ. In Riviera News: eventi (`Event`).
- `llms.txt`: riassunto del sito per gli assistenti AI, generato dalla build.
- `robots.txt` accoglie esplicitamente i bot di ricerca delle AI.
- Riviera News: dopo aver cambiato eventi, luoghi o ristoranti, eseguire `node tools/prerender-news.js` (serve Playwright) per riscrivere i contenuti nell'HTML.
- Immagine di anteprima per social e WhatsApp: `assets/img/og-image.jpg` (1200×630).
