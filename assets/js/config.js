/*
 * Riviera Rent — configurazione centrale del sito.
 * Tutto ciò che cambia spesso (contatti, link prenotazione, ID pubblicità)
 * si modifica SOLO qui, senza toccare l'HTML.
 */
window.RR_CONFIG = {
  brand: "Riviera Rent",

  contacts: {
    phone: "+39 019 68111",
    phoneHref: "tel:+3901968111",
    freephone: "800 748 974", // numero verde
    freephoneHref: "tel:800748974",
    mobile: "+39 353 476 2946",
    whatsapp: "393534762946", // numero senza + e spazi, per wa.me
    email: "info@italianrivierarent.com",
    address: "Via Brunenghi 87/100, 17024 Finale Ligure (SV)",
    mapsUrl: "https://maps.google.com/?q=Via+Brunenghi+87+Finale+Ligure",
    hours: { it: "Tutti i giorni 9:00–12:30 · 15:00–18:00", en: "Every day 9:00–12:30 · 15:00–18:00" },
    facebook: "https://www.facebook.com/Italianrivierarent/",
    // Social: incollare l'indirizzo completo del profilo. Vuoto = non compare sul sito.
    instagram: "", // es. "https://www.instagram.com/rivierarent/"
    youtube: "",   // es. "https://www.youtube.com/@rivierarent"
    tiktok: ""     // es. "https://www.tiktok.com/@rivierarent"
  },

  /*
   * Motore di prenotazione Krossbooking (lo stesso calendario sincronizzato
   * dal channel manager con Booking.com, Airbnb, Expedia, Vrbo...).
   * dateParams: lasciare null finché non si verifica con il supporto Kross
   * il formato esatto dei parametri di deep-link (date e ospiti).
   * Esempio, se confermato: { checkin: "date_from", checkout: "date_to", guests: "adults", format: "YYYY-MM-DD" }
   */
  booking: {
    // I pulsanti "Prenota" aprono il portale Kross: il vecchio motore v4
    // (https://book.krossbooking.com/v4/italianrivierarent/) mostrava un errore e si ricaricava dopo qualche secondo.
    // Lingue del portale Kross: per cinese e giapponese (non disponibili) si apre la versione inglese.
    engineUrl: {
      it: "https://italianrivierarent.kross.travel/it", en: "https://italianrivierarent.kross.travel/en",
      fr: "https://italianrivierarent.kross.travel/fr", de: "https://italianrivierarent.kross.travel/de",
      nl: "https://italianrivierarent.kross.travel/nl", ar: "https://italianrivierarent.kross.travel/ar"
    },
    portalUrl: { it: "https://italianrivierarent.kross.travel/it", en: "https://italianrivierarent.kross.travel/en" },
    dateParams: null
  },

  /*
   * LISTINI – l'ufficio cambia i prezzi SOLO qui.
   * Scrivere solo il numero (es. "12") oppure un testo (es. "su preventivo").
   * Se un prezzo è vuoto "" sul sito compare uno spazio bianco "€ ____".
   */
  bbPoint: {
    prices: {
      keysOffice: "12",            // consegna chiavi in orario d'ufficio, per consegna
      keysAfter: "20",             // consegna chiavi fuori orario / su appuntamento
      linenPack: "15",             // pacchetto biancheria a persona (lenzuola + asciugamani)
      linenDeposit: "50",          // cauzione biancheria, restituita alla riconsegna
      cleanStudio: "60",           // pulizia monolocale
      cleanOneBed: "80",           // pulizia bilocale
      cleanTwoBed: "90",           // pulizia trilocale
      cleanHouse: "120",         // pulizia villa / casa grande
      bureauBooking: "8",          // burocrazia, per prenotazione
      bureauMonth: "50"            // burocrazia, abbonamento mensile
    }
  },

  // Collezione Lusso – servizi su richiesta dell'ospite (prezzi "a partire da")
  concierge: {
    prices: {
      pass: "150",        // Concierge pass a settimana: consigli, prenotazioni ristoranti/locali/beach club
      chef: "90",         // chef in casa, a persona (spesa inclusa, minimo 4 persone)
      dailyClean: "25",   // pulizie giornaliere, all'ora
      transfer: "150",    // transfer aeroporto (Genova / Nizza) con autista
      driver: "60",       // auto o minivan con autista, all'ora (minimo 3 ore)
      tourRiviera: "650", // tour Costa Azzurra in giornata con autista (fino a 7 persone)
      tourLiguria: "550", // tour Liguria in giornata (Portofino, Cinque Terre...) con autista
      massage: "80"       // massaggio in casa, 50 minuti
    }
  },

  /*
   * OFFERTE (sezione "Offerte"): calendario di tutto l'anno.
   * Ogni offerta compare da sola sul sito tra "start" e "end" (AAAA-MM-GG) e sparisce dopo;
   * senza date resta sempre visibile. highlight: true = anche nella fascia in alto della home.
   * property = id della casa in properties.js; price = prezzo "a partire da" (solo numero).
   * draft: true = prezzo DI ESEMPIO, l'offerta NON compare sul sito. Quando l'ufficio ha
   * controllato prezzo e testo, cancellare "draft: true," e l'offerta si accende da sola.
   * Se non c'è nessuna offerta attiva, la sezione "Offerte" si nasconde da sola.
   */
  offers: [
    // --- Mondiali UCI Enduro, Finale Ligure 15–18 ottobre 2026: pacchetti 2 notti (prezzo TOTALE, casa intera) ---
    { start: "2026-10-01", end: "2026-10-18", highlight: true, short: "2 notti", property: "palazzo-aycardi", badge: "€25 a testa", title: "Weekend Mondiali in gruppo", text: "2 notti per 7 persone a Finalborgo: €25 a testa. Pulizie e biancheria incluse, parcheggio gratuito.", price: "172", unit: "2 notti · casa intera", until: "Ven–Dom · Sab–Lun · Gio–Sab" },
    { start: "2026-10-01", end: "2026-10-18", short: "2 notti", property: "bric-44", badge: "Mondiali", title: "Weekend Mondiali", text: "Bilocale di 70 m² per 4 persone a Finale. Pulizie e biancheria incluse.", price: "172", unit: "2 notti · casa intera", until: "Ven–Dom · Sab–Lun · Gio–Sab" },
    { start: "2026-10-01", end: "2026-10-18", short: "2 notti", property: "orco-cucchiaio", badge: "Tra i trail", title: "Weekend Mondiali tra i trail", text: "Bilocale in pietra a Orco Feglino, partenza diretta per i sentieri. Per 4 persone.", price: "162", unit: "2 notti · casa intera", until: "Ven–Dom · Sab–Lun · Gio–Sab" },
    { start: "2026-10-01", end: "2026-10-18", short: "2 notti", property: "villa-riders-mansion", badge: "Rider", title: "Riders Mansion per 6", text: "La casa pensata per chi va in bici: 6 posti, 2 bagni. €38 a testa.", price: "226", unit: "2 notti · casa intera", until: "Ven–Dom · Sab–Lun · Gio–Sab" },
    { start: "2026-10-01", end: "2026-10-18", short: "2 notti", property: "villa-orizzonte", badge: "Team", title: "Villa per team e gruppi", text: "Villa con terrazza panoramica sul mare a Borgio Verezzi, 6 posti e 3 camere.", price: "630", unit: "2 notti · tutta la villa", until: "Ven–Dom · Sab–Lun · Gio–Sab" },
    // --- Autunno / inverno ---
    { draft: true, start: "2026-10-19", end: "2026-11-30", property: "al-boschetto", badge: "-20%", title: "Autunno al mare", text: "Balcone vista mare e spiaggia a 600 m: il mare d'autunno senza folla.", price: "55", unit: "a notte", until: "fino al 30 novembre" },
    { draft: true, start: "2026-10-19", end: "2027-05-31", property: "terrazza-sul-borgo", badge: "-15%", title: "Weekend nel borgo", text: "Due o tre notti tra i vicoli di Finalborgo, con terrazza panoramica.", price: "67", unit: "a notte", until: "venerdì – domenica" },
    { draft: true, start: "2026-10-19", end: "2027-01-31", property: "villa-riders-mansion", badge: "Prenota presto", title: "Estate 2027 in villa", text: "Villa con piscina in collina: blocca l'estate prossima con il 10% in meno e i punti del Club.", price: "261", unit: "a notte", until: "prenotando entro il 31 gennaio" },
    { draft: true, start: "2026-10-19", end: "2026-12-20", property: "bikers-court", badge: "7 = 6", title: "Settimana bike d'autunno", text: "7 notti al prezzo di 6, deposito e lavaggio bici. Con i vantaggi Finale Enduro.", price: "72", unit: "a notte", until: "fino al 20 dicembre" },
    { draft: true, start: "2026-11-01", end: "2027-03-31", property: "casa-iolanda", badge: "-25%", title: "Soggiorni lunghi", text: "Un mese in Liguria in 4 camere: smart working, famiglie, l'inverno mite sul mare.", price: "89", unit: "a notte (28+ notti)", until: "novembre – marzo" },
    // --- Primavera ---
    { draft: true, start: "2027-02-01", end: "2027-05-31", property: "bikers-court", badge: "7 = 6", title: "Primavera in sella", text: "La stagione migliore per i trail di Finale: 7 notti al prezzo di 6, deposito e lavaggio bici.", price: "72", unit: "a notte", until: "febbraio – maggio" },
    { draft: true, start: "2027-03-01", end: "2027-06-02", property: "la-vela", badge: "-10%", title: "Pasqua e ponti", text: "Pasqua, 25 aprile, 1° maggio e 2 giugno con piscina panoramica sul mare.", price: "80", unit: "a notte", until: "fino al 2 giugno" },
    // --- Estate ---
    { draft: true, start: "2027-07-01", end: "2027-08-31", property: "al-boschetto", badge: "Last minute", title: "Last minute d'estate", text: "Le date rimaste libere dell'estate, con sconto, per chi decide all'ultimo.", price: "79", unit: "a notte", until: "date libere entro 7 giorni" },
  ],

  /*
   * Misurazione (lasciare vuoto = disattivato). Si attivano solo dopo il
   * consenso cookie dell'utente (GDPR).
   *  - ga4:       ID Google Analytics 4, es. "G-XXXXXXXXXX"
   *  - googleAds: ID conversione Google Ads, es. "AW-XXXXXXXXX"
   *  - metaPixel: ID Pixel Meta (Facebook/Instagram), es. "123456789012345"
   */
  analytics: {
    ga4: "",
    googleAds: "",
    metaPixel: ""
  }
};
