/*
 * Elenco strutture. Per aggiungere/modificare una casa basta modificare
 * questo file. Campi:
 *  id, name, area (finale | borgo | hills | cotedazur), type (apartment | villa | house),
 *  guests (null = non mostrato), bedrooms, bathrooms (null = da completare), features[], pool, seaView, bike,
 *  image (foto di copertina della scheda; vuoto = sfondo grafico),
 *  photos (numero di foto della galleria: /assets/img/case/<id>/01.jpg, 02.jpg, ...; 0 o assente = niente galleria),
 *  bookingUrl (pagina della casa sul portale Kross; vuoto = elenco di tutte le case),
 *  cin (Codice Identificativo Nazionale) e citra (codice regionale Liguria): obbligatori, copiarli dal sito attuale,
 *  fromPrice: prezzo "a partire da" a notte, pulizie e biancheria incluse (solo il numero; vuoto = non mostrato).
 *  Le prime 15 case e Al Boschetto, La Vela, Riders Mansion hanno i prezzi reali di Kross (ottobre 2026); le altre hanno il prezzo vuoto (non mostrato) finché l'ufficio non lo inserisce.
 *  desc { it, en }
 *  archived: true = casa archiviata: resta qui con tutti i dati ma non compare sul sito
 *  (per rimetterla basta cancellare la riga "archived: true" e rilanciare la build).
 *
 * NB: i dati sotto provengono da schede pubbliche. Verificare posti letto,
 * CIN e foto prima della pubblicazione.
 */
window.RR_PROPERTIES = [
  {
    id: "palazzo-aycardi", name: "Palazzo Aycardi", area: "borgo", type: "apartment",
    guests: 7, bedrooms: 1, bathrooms: 2, pool: false, seaView: false, bike: true,
    features: ["wifi"],
    fromPrice: "86", image: "/assets/img/case/palazzo-aycardi/copertina.jpg", photos: 20, bookingUrl: "https://italianrivierarent.kross.travel/palazzo-aycardi", cin: "IT009029B442M5FVEE", citra: "009029-LT-2878",
    desc: {
      it: "Ampio appartamento per 7 ospiti con 2 bagni, ideale per gruppi e famiglie numerose.",
      en: "Spacious apartment for 7 guests with 2 bathrooms, ideal for groups and large families."
    }
  },
  {
    id: "bric-44", name: "Bric 44", area: "finale", type: "apartment",
    guests: 4, bedrooms: 1, bathrooms: 1, pool: false, seaView: false, bike: false,
    features: ["wifi"],
    fromPrice: "86", image: "/assets/img/case/bric-44/copertina.jpg", photos: 13, bookingUrl: "https://italianrivierarent.kross.travel/bric-44", cin: "IT009029B4M3KLWJZW", citra: "009029-LT-2939",
    desc: {
      it: "Bilocale luminoso di 70 m² per 4 ospiti, a Finale Ligure.",
      en: "Bright 70 m² one-bedroom apartment for 4 guests in Finale Ligure."
    }
  },
  {
    id: "bettina-holiday", name: "Bettina Holiday", area: "finale", type: "apartment",
    guests: 2, bedrooms: 1, bathrooms: 1, pool: false, seaView: false, bike: false,
    features: ["wifi"],
    fromPrice: "86", image: "/assets/img/case/bettina-holiday/copertina.jpg", photos: 23, bookingUrl: "https://italianrivierarent.kross.travel/bettina-holiday", cin: "IT009029B4YRQWE74A", citra: "009029-LT-2873",
    desc: {
      it: "Bilocale per 2 con cortile privato fiorito, perfetto per una coppia.",
      en: "One-bedroom apartment for 2 with a private flowered courtyard, perfect for a couple."
    }
  },
  {
    id: "casa-nemo", name: "Casa Nemo", area: "finale", type: "apartment",
    guests: 4, bedrooms: 1, bathrooms: 1, pool: false, seaView: false, bike: false,
    features: ["wifi"],
    fromPrice: "95", image: "/assets/img/case/casa-nemo/copertina.jpg", photos: 10, bookingUrl: "https://italianrivierarent.kross.travel/rivierarent-casa-nemo", cin: "IT009029B44EGMVLRJ", citra: "009029-LT-3297",
    desc: {
      it: "Bilocale colorato di 55 m² nel centro storico di Finale Marina.",
      en: "Colourful 55 m² apartment in the historic centre of Finale Marina."
    }
  },
  {
    id: "castelfranco-25", name: "Castelfranco 25", area: "finale", type: "apartment",
    guests: 4, bedrooms: 1, bathrooms: 1, pool: false, seaView: false, bike: false,
    features: ["wifi"],
    fromPrice: "113", image: "/assets/img/case/castelfranco-25/copertina.jpg", photos: 31, bookingUrl: "https://italianrivierarent.kross.travel/castelfranco-25", cin: "IT009029B4RVBLSG6L", citra: "009029-LT-2886",
    desc: {
      it: "Appartamento di 75 m² a 100 metri dal mare.",
      en: "75 m² apartment 100 metres from the sea."
    }
  },
  {
    id: "castelfranco-23", name: "Castelfranco 23", area: "finale", type: "apartment",
    guests: null, bedrooms: 1, bathrooms: 1, pool: false, seaView: false, bike: false,
    features: ["wifi"],
    fromPrice: "99", image: "/assets/img/case/castelfranco-23/copertina.jpg", photos: 14, bookingUrl: "https://italianrivierarent.kross.travel/castelfranco-appartamenti-a-100-metri-dal-mare-n23", cin: "IT009029B4KG7B7ZC4", citra: "009029-LT-2879",
    desc: {
      it: "Appartamento luminoso a 100 metri dal mare, con balcone.",
      en: "Bright apartment 100 metres from the sea, with balcony."
    }
  },
  {
    id: "giardino-navigatore", name: "Il Giardino del Navigatore", area: "finale", type: "apartment",
    guests: 5, bedrooms: 1, bathrooms: 2, pool: false, seaView: false, bike: false,
    features: ["wifi"],
    fromPrice: "104", image: "/assets/img/case/giardino-navigatore/copertina.jpg", photos: 24, bookingUrl: "https://italianrivierarent.kross.travel/rivierarent-il-giardino-del-navigatore", cin: "IT009029B4BSM7NT7B", citra: "009029-LT-3298",
    desc: {
      it: "Appartamento con giardino e terrazza vista colline, 2 bagni, per 5 ospiti.",
      en: "Apartment with garden and terrace overlooking the hills, 2 bathrooms, for 5 guests."
    }
  },
  {
    id: "appartamento-elisa", name: "Appartamento Elisa", area: "finale", type: "apartment",
    guests: 6, bedrooms: 2, bathrooms: 2, pool: false, seaView: false, bike: false,
    features: ["wifi"],
    fromPrice: "108", image: "/assets/img/case/appartamento-elisa/copertina.jpg", photos: 33, bookingUrl: "https://italianrivierarent.kross.travel/appartamento-elisa-a-100-metri-dal-mare", cin: "IT009029B4XUCCRZXS", citra: "009029-LT-2910",
    desc: {
      it: "Trilocale di 80 m² con 2 bagni a 100 metri dal mare, per 6 ospiti.",
      en: "80 m² two-bedroom apartment with 2 bathrooms, 100 metres from the sea, for 6 guests."
    }
  },
  {
    id: "spazio-mare", name: "Spazio Mare", area: "finale", type: "apartment",
    guests: 5, bedrooms: 2, bathrooms: 2, pool: false, seaView: false, bike: false,
    features: ["wifi"],
    fromPrice: "130", image: "/assets/img/case/spazio-mare/copertina.jpg", photos: 19, bookingUrl: "https://italianrivierarent.kross.travel/rivierarent-spazio-mare", cin: "IT009029B4TSBW238S", citra: "009029-LT3296",
    desc: {
      it: "Trilocale elegante di 75 m² con 2 bagni, vicino al mare.",
      en: "Elegant 75 m² two-bedroom apartment with 2 bathrooms, close to the sea."
    }
  },
  {
    id: "orco-cucchiaio", name: "Il Cucchiaio – Appartamenti sul portico", area: "hills", type: "apartment",
    guests: 4, bedrooms: 1, bathrooms: 1, pool: false, seaView: false, bike: true,
    features: ["wifi"],
    fromPrice: "81", image: "/assets/img/case/orco-cucchiaio/copertina.jpg", photos: 16, bookingUrl: "https://italianrivierarent.kross.travel/gli-appartamenti-sul-portico-il-cucchiaio", cin: "IT009044B4BVWJFZFZ", citra: "009044-LT-0050",
    desc: {
      it: "Bilocale in pietra in un borgo dell'entroterra, tra ulivi e sentieri MTB.",
      en: "Stone one-bedroom apartment in an inland village, among olive groves and MTB trails."
    }
  },
  {
    id: "orco-forchetta", name: "La Forchetta – Appartamenti sul portico", area: "hills", type: "apartment",
    guests: 4, bedrooms: 1, bathrooms: 1, pool: false, seaView: false, bike: true,
    features: ["wifi"],
    fromPrice: "81", image: "/assets/img/case/orco-forchetta/copertina.jpg", photos: 9, bookingUrl: "https://italianrivierarent.kross.travel/gli-appartamenti-sul-portico-la-forchetta", cin: "IT009044B4HTVSRIZL", citra: "009044-LT-0051",
    desc: {
      it: "Bilocale in pietra con travi a vista nel borgo di Orco Feglino.",
      en: "Stone apartment with exposed beams in the village of Orco Feglino."
    }
  },
  {
    id: "pietra-di-mare", name: "Pietra di mare", area: "finale", type: "apartment",
    guests: 5, bedrooms: 1, bathrooms: 1, pool: false, seaView: false, bike: false,
    features: ["wifi"],
    fromPrice: "95", image: "/assets/img/case/pietra-di-mare/copertina.jpg", photos: 18, bookingUrl: "https://italianrivierarent.kross.travel/rivierarent-pietra-di-mare", cin: "IT009049B45FULRGVC", citra: "009049-LT-2163",
    desc: {
      it: "Mansarda luminosa di 75 m² a Pietra Ligure, per 5 ospiti.",
      en: "Bright 75 m² attic apartment in Pietra Ligure, for 5 guests."
    }
  },
  {
    id: "golfo-isola", name: "Golfo dell'Isola", area: "finale", type: "apartment",
    guests: 5, bedrooms: 2, bathrooms: 1, pool: false, seaView: false, bike: false,
    features: ["wifi"],
    fromPrice: "108", image: "/assets/img/case/golfo-isola/copertina.jpg", photos: 17, bookingUrl: "https://italianrivierarent.kross.travel/golfo-dell-isola", cin: "IT009057B4EX7OGTOK", citra: "009057-LT-0725",
    desc: {
      it: "Trilocale a Spotorno, vicino alla spiaggia con vista sull'isola di Bergeggi.",
      en: "Two-bedroom apartment in Spotorno, close to the beach facing Bergeggi island."
    }
  },
  {
    archived: true, // archiviata il 12/11/2026: non compare sul sito (togliere la riga per rimetterla)
    id: "villa-orizzonte", name: "Villa L'Orizzonte", area: "hills", type: "villa",
    guests: 6, bedrooms: 3, bathrooms: 2, pool: false, seaView: false, bike: false,
    features: ["wifi"],
    fromPrice: "315", image: "/assets/img/case/villa-orizzonte/copertina.jpg", photos: 57, bookingUrl: "https://italianrivierarent.kross.travel/villa-l-orizzonte", cin: "IT009013B45JXVB693", citra: "009013-LT-0277",
    desc: {
      it: "Villa di 130 m² con grande terrazza panoramica sul mare a Borgio Verezzi.",
      en: "130 m² villa with a large panoramic sea-view terrace in Borgio Verezzi."
    }
  },
  {
    id: "casa-iolanda", name: "Casa Iolanda", area: "finale", type: "apartment",
    guests: null, bedrooms: 4, bathrooms: 2, pool: false, seaView: false, bike: false,
    features: ["wifi", "ac", "dishwasher", "washer"],
    fromPrice: "", image: "/assets/img/case/casa-iolanda/copertina.jpg", photos: 33, bookingUrl: "https://italianrivierarent.kross.travel/casa-iolanda", cin: "IT009029B4YVEYPVGF", citra: "009029-LT-2913",
    desc: {
      it: "Ampio appartamento con 4 camere e 2 bagni, a 3 minuti a piedi dalla spiaggia. Ideale per famiglie numerose e gruppi.",
      en: "Spacious 4-bedroom, 2-bathroom apartment, a 3-minute walk from the beach. Perfect for large families and groups."
    }
  },
  {
    id: "al-boschetto", name: "Al Boschetto", area: "finale", type: "apartment",
    guests: 4, bedrooms: 2, bathrooms: 1, pool: false, seaView: true, bike: false,
    features: ["wifi", "ac", "balcony"],
    fromPrice: "90", image: "/assets/img/case/al-boschetto/copertina.jpg", photos: 16, bookingUrl: "https://italianrivierarent.kross.travel/al-boschetto", cin: "IT009029B4EUIKTBF8", citra: "009029-LT-2905",
    desc: {
      it: "Bilocale luminoso con balcone vista mare e aria condizionata, a 600 m dalla spiaggia.",
      en: "Bright 2-bedroom apartment with sea-view balcony and air conditioning, 600 m from the beach."
    }
  },
  {
    id: "la-vela", name: "La Vela", area: "finale", type: "apartment",
    guests: 6, bedrooms: null, bathrooms: null, pool: true, seaView: true, bike: false,
    features: ["wifi", "pool"],
    fromPrice: "104", image: "/assets/img/case/la-vela/copertina.jpg", photos: 42, bookingUrl: "https://italianrivierarent.kross.travel/la-vela", cin: "IT009029B48KA6PDQQ", citra: "009029-LT-2871",
    desc: {
      it: "Appartamento sulla Via Aurelia in residence con piscina panoramica affacciata sul mare.",
      en: "Apartment on Via Aurelia in a residence with a panoramic pool overlooking the sea."
    }
  },
  {
    id: "terrazza-sul-borgo", name: "La Terrazza sul Borgo", area: "borgo", type: "apartment",
    guests: null, bedrooms: null, bathrooms: null, pool: false, seaView: false, bike: true,
    features: ["wifi", "terrace"],
    fromPrice: "", image: "/assets/img/case/terrazza-sul-borgo/copertina.jpg", photos: 33, bookingUrl: "https://italianrivierarent.kross.travel/rivierarent-la-terrazza-sul-borgo", cin: "", citra: "",
    desc: {
      it: "Terrazza con vista sui tetti di un borgo medievale tra i più belli d'Italia.",
      en: "Terrace overlooking the rooftops of one of Italy's most beautiful medieval villages."
    }
  },
  {
    id: "bikers-court", name: "Bikers' Court", area: "finale", type: "apartment",
    guests: null, bedrooms: null, bathrooms: null, pool: false, seaView: false, bike: true,
    features: ["wifi"],
    fromPrice: "", image: "/assets/img/case/bikers-court/copertina.jpg", photos: 9, bookingUrl: "https://italianrivierarent.kross.travel/bikers-court", cin: "IT009029B4ZZ4MJ853", citra: "009029-LT-2900",
    desc: {
      it: "Pensato per chi viene in Riviera per la mountain bike e l'outdoor.",
      en: "Designed for guests coming to the Riviera for mountain biking and the outdoors."
    }
  },
  {
    id: "villa-riders-mansion", name: "Riders Mansion MTB Paradise", area: "hills", type: "villa",
    guests: 6, bedrooms: 2, bathrooms: 2, pool: true, seaView: true, bike: true,
    features: ["wifi", "pool", "garden", "bikestorage", "parking"],
    fromPrice: "113", image: "/assets/img/case/villa-riders-mansion/copertina.jpg", photos: 40, bookingUrl: "https://italianrivierarent.kross.travel/riders-mansion-mtb-paradise", cin: "IT009029B4K9FT3S63", citra: "009029-LT-2866",
    desc: {
      it: "Villa sulle colline con piscina e giardino: un'oasi di tranquillità a due passi dai sentieri MTB.",
      en: "Hillside villa with pool and garden: a peaceful retreat right by the MTB trails."
    }
  },
  // --- Case aggiunte dal portale Kross il 16 ottobre 2026 (prezzo "da" da inserire) ---
  {
    id: "lilium", name: "Appartamento Lilium", area: "finale", type: "apartment",
    guests: 4, bedrooms: 1, bathrooms: 1, pool: false, seaView: true, bike: false,
    features: ["wifi", "balcony"],
    fromPrice: "", image: "/assets/img/case/lilium/copertina.jpg", photos: 9, bookingUrl: "https://italianrivierarent.kross.travel/appartamento-lilium", cin: "IT009049B437HCF6GP", citra: "009049-LT-1936",
    desc: {
      it: "Monolocale a 100 m dal mare di Pietra Ligure, al secondo piano con ascensore e terrazzino vista mare.",
      en: "Studio 100 m from the sea in Pietra Ligure, second floor with lift and a small sea-view terrace."
    }
  },
  {
    id: "magnolia", name: "Appartamento Magnolia", area: "finale", type: "apartment",
    guests: 4, bedrooms: 1, bathrooms: 1, pool: false, seaView: true, bike: false,
    features: ["wifi", "balcony"],
    fromPrice: "", image: "/assets/img/case/magnolia/copertina.jpg", photos: 20, bookingUrl: "https://italianrivierarent.kross.travel/appartamento-magnolia", cin: "IT009049B4D6ON59ZN", citra: "009049-LT-1937",
    desc: {
      it: "Su due livelli a 100 m dal mare di Pietra Ligure: terrazzino vista mare e camera con cabina armadio.",
      en: "On two levels 100 m from the sea in Pietra Ligure: small sea-view terrace and bedroom with walk-in wardrobe."
    }
  },
  {
    id: "moma", name: "Appartamento Moma", area: "finale", type: "apartment",
    guests: 4, bedrooms: 2, bathrooms: 1, pool: false, seaView: true, bike: false,
    features: ["wifi", "balcony", "parking"],
    fromPrice: "", image: "/assets/img/case/moma/copertina.jpg", photos: 21, bookingUrl: "https://italianrivierarent.kross.travel/appartamento-moma-100-metri-dal-mare", cin: "IT009029B4TA6EMGL4", citra: "009029-LT-2911",
    desc: {
      it: "A 100 m dal mare di Finale, al sesto piano con ascensore: due balconi, uno vista mare, e posto auto.",
      en: "100 m from the sea in Finale, sixth floor with lift: two balconies, one with sea view, and a parking space."
    }
  },
  {
    id: "cristina", name: "Appartamento Cristina", area: "finale", type: "apartment",
    guests: 4, bedrooms: 1, bathrooms: 1, pool: false, seaView: false, bike: false,
    features: ["wifi", "ac", "balcony", "parking"],
    fromPrice: "", image: "/assets/img/case/cristina/copertina.jpg", photos: 19, bookingUrl: "https://italianrivierarent.kross.travel/appartamento-cristina", cin: "IT009049B4MGCRFGID", citra: "009049-LT-1938",
    desc: {
      it: "A 50 m dal mare di Pietra Ligure, con balcone, aria condizionata e posto auto.",
      en: "50 m from the sea in Pietra Ligure, with balcony, air conditioning and parking space."
    }
  },
  {
    id: "terrazza-sul-mare", name: "La Terrazza sul Mare", area: "finale", type: "apartment",
    guests: 6, bedrooms: 3, bathrooms: 2, pool: false, seaView: true, bike: false,
    features: ["wifi", "ac", "terrace", "dishwasher"],
    fromPrice: "", image: "/assets/img/case/terrazza-sul-mare/copertina.jpg", photos: 30, bookingUrl: "https://italianrivierarent.kross.travel/la-terrazza-sul-mare", cin: "IT009049B4ZL3POSTL", citra: "009049-LT-1928",
    desc: {
      it: "Attico nel centro di Pietra Ligure con grande terrazza affacciata sul mare, 3 camere e 2 bagni.",
      en: "Penthouse in the centre of Pietra Ligure with a large terrace over the sea, 3 bedrooms and 2 bathrooms."
    }
  },
  {
    id: "eleonora", name: "Eleonora", area: "finale", type: "apartment",
    guests: 6, bedrooms: 2, bathrooms: 1, pool: false, seaView: false, bike: true,
    features: ["wifi", "bikestorage"],
    fromPrice: "", image: "/assets/img/case/eleonora/copertina.jpg", photos: 23, bookingUrl: "https://italianrivierarent.kross.travel/eleonora", cin: "IT009029B453MIN778", citra: "009029-LT-2875",
    desc: {
      it: "Attico spazioso a pochi minuti dal mare di Finale, con ascensore e box per auto e bici (a pagamento).",
      en: "Spacious top-floor flat a few minutes from the sea in Finale, with lift and garage for car and bikes (extra charge)."
    }
  },
  {
    id: "ca-bolla", name: "Ca Bolla sul Mare", area: "finale", type: "apartment",
    guests: 7, bedrooms: 3, bathrooms: 1, pool: false, seaView: true, bike: true,
    features: ["wifi", "balcony", "bikestorage"],
    fromPrice: "", image: "/assets/img/case/ca-bolla/copertina.jpg", photos: 32, bookingUrl: "https://italianrivierarent.kross.travel/ca-bolla-sul-mare-mtb-paradise", cin: "IT009029B4RHYX92E", citra: "009020-LT-2874",
    desc: {
      it: "Nel centro di Finale a due passi dal mare: balcone di 20 m² vista mare e bike room per le MTB.",
      en: "In the centre of Finale, steps from the sea: 20 m² sea-view balcony and a bike room for MTBs."
    }
  },
  {
    id: "sea-terrace", name: "Sea Terrace", area: "finale", type: "apartment",
    guests: 4, bedrooms: 1, bathrooms: 1, pool: false, seaView: true, bike: false,
    features: ["wifi", "terrace"],
    fromPrice: "", image: "/assets/img/case/sea-terrace/copertina.jpg", photos: 7, bookingUrl: "https://italianrivierarent.kross.travel/sea-terrace", cin: "IT009049B4GKT45I4V", citra: "009049-LT-1935",
    desc: {
      it: "Al quarto piano con ascensore a Pietra Ligure, con grande terrazza vista mare, lettini e zona pranzo.",
      en: "Fourth floor with lift in Pietra Ligure, with a large sea-view terrace, sunbeds and outdoor dining."
    }
  },
  {
    id: "villa-alassio", name: "Charming Villa Alassio", area: "hills", type: "apartment",
    guests: 6, bedrooms: 2, bathrooms: 2, pool: true, seaView: true, bike: false,
    features: ["wifi", "pool", "garden"],
    fromPrice: "", image: "/assets/img/case/villa-alassio/copertina.jpg", photos: 43, bookingUrl: "https://italianrivierarent.kross.travel/charming-villa-alassio-with-pool-and-garden", cin: "IT009001B4T7VE2ASB", citra: "009001-LT-1723",
    desc: {
      it: "Appartamento in villa ad Alassio, immerso nel verde, con piscina e giardino, vicino alle spiagge.",
      en: "Apartment in a villa in Alassio surrounded by greenery, with pool and garden, close to the beaches."
    }
  },
  {
    id: "dadda-house", name: "Dadda House", area: "hills", type: "house",
    guests: 7, bedrooms: 3, bathrooms: 2, pool: false, seaView: false, bike: false,
    features: ["wifi"],
    fromPrice: "", image: "/assets/img/case/dadda-house/copertina.jpg", photos: 49, bookingUrl: "https://italianrivierarent.kross.travel/dadda-house", cin: "IT009044B4RYRQV78K", citra: "009044-LT-0046",
    desc: {
      it: "Casa ristrutturata su tre piani a Orco Feglino: 3 camere, 2 bagni e spazio esterno privato.",
      en: "Renovated three-storey house in Orco Feglino: 3 bedrooms, 2 bathrooms and a private outdoor space."
    }
  },
  {
    id: "chez-rita", name: "Chez Rita", area: "finale", type: "apartment",
    guests: 4, bedrooms: 2, bathrooms: 1, pool: false, seaView: true, bike: false,
    features: ["wifi"],
    fromPrice: "", image: "/assets/img/case/chez-rita/copertina.jpg", photos: 38, bookingUrl: "https://italianrivierarent.kross.travel/chez-rita", cin: "IT009029B43R2QQX83", citra: "009029-LT-2868",
    desc: {
      it: "Ristrutturato, a pochi passi dal mare con vista frontale, comodo per chi arriva in treno a Finale.",
      en: "Renovated, steps from the sea with a front sea view, handy for guests arriving by train in Finale."
    }
  },
  {
    id: "profumo-di-sale", name: "Profumo di Sale", area: "finale", type: "apartment",
    guests: 4, bedrooms: 1, bathrooms: 1, pool: false, seaView: true, bike: false,
    features: ["wifi", "terrace"],
    fromPrice: "", image: "/assets/img/case/profumo-di-sale/copertina.jpg", photos: 14, bookingUrl: "https://italianrivierarent.kross.travel/rivierarent-profumo-di-sale", cin: "IT009029B4MUPMSOFO", citra: "009029-LT-3148",
    desc: {
      it: "Ristrutturato con terrazza privata e splendida vista mare, in zona tranquilla vicino alle spiagge di Finale.",
      en: "Renovated, with private terrace and a beautiful sea view, in a quiet area near the beaches of Finale."
    }
  },
  {
    id: "white-house", name: "White House", area: "finale", type: "apartment",
    guests: 6, bedrooms: 2, bathrooms: 1, pool: false, seaView: false, bike: true,
    features: ["wifi", "bikestorage"],
    fromPrice: "", image: "/assets/img/case/white-house/copertina.jpg", photos: 20, bookingUrl: "https://italianrivierarent.kross.travel/white-house", cin: "IT009029B4N4JBOKVK", citra: "009029-LT-3152",
    desc: {
      it: "Ristrutturato al quarto piano, due grandi camere e cantina privata per bici e attrezzatura da spiaggia.",
      en: "Renovated fourth-floor flat with two large bedrooms and a private cellar for bikes and beach gear."
    }
  },
  {
    archived: true, // archiviata il 12/11/2026: non compare sul sito (togliere la riga per rimetterla)
    id: "rustico-del-borgo", name: "Rustico del Borgo", area: "hills", type: "house",
    guests: 3, bedrooms: 2, bathrooms: 2, pool: false, seaView: false, bike: false,
    features: ["wifi", "terrace"],
    fromPrice: "", image: "/assets/img/case/rustico-del-borgo/copertina.jpg", photos: 23, bookingUrl: "https://italianrivierarent.kross.travel/rustico-del-borgo", cin: "IT009049B4HICQN7S3", citra: "009049-LT-2208",
    desc: {
      it: "Rustico su più livelli a Ranzi, sulle alture di Pietra Ligure, con terrazzo panoramico sulle colline.",
      en: "Traditional house on several levels in Ranzi, above Pietra Ligure, with a panoramic terrace over the hills."
    }
  },
  {
    archived: true, // archiviata il 12/11/2026: non compare sul sito (togliere la riga per rimetterla)
    id: "acquamarina", name: "Acquamarina", area: "finale", type: "apartment",
    guests: 4, bedrooms: 2, bathrooms: 1, pool: false, seaView: false, bike: false,
    features: ["wifi", "ac", "dishwasher", "washer"],
    fromPrice: "", image: "/assets/img/case/acquamarina/copertina.jpg", photos: 18, bookingUrl: "https://italianrivierarent.kross.travel/rivierarent-acquamarina", cin: "IT009013B4NUR7F7BO", citra: "009013-LT-0319",
    desc: {
      it: "Ristrutturato a Borgio Verezzi, cucina moderna, aria condizionata e balconcino con scorcio sul mare.",
      en: "Renovated in Borgio Verezzi, modern kitchen, air conditioning and a small balcony with a glimpse of the sea."
    }
  },
  {
    id: "stellamarina", name: "Stellamarina", area: "finale", type: "apartment",
    guests: 5, bedrooms: 2, bathrooms: 1, pool: false, seaView: false, bike: false,
    features: ["wifi", "ac", "balcony"],
    fromPrice: "", image: "/assets/img/case/stellamarina/copertina.jpg", photos: 19, bookingUrl: "https://italianrivierarent.kross.travel/rivierarent-stellamarina", cin: "IT009029B4MOUUBE9A", citra: "009029-LT-3393",
    desc: {
      it: "A circa 10 minuti a piedi dal mare di Finale e vicino alla stazione, con balcone e aria condizionata.",
      en: "About a 10-minute walk from the sea in Finale and close to the station, with balcony and air conditioning."
    }
  },
  {
    id: "ortensia", name: "Ortensia", area: "finale", type: "apartment",
    guests: 6, bedrooms: 2, bathrooms: 1, pool: false, seaView: false, bike: false,
    features: ["wifi", "ac", "balcony"],
    fromPrice: "", image: "/assets/img/case/ortensia/copertina.jpg", photos: 18, bookingUrl: "https://italianrivierarent.kross.travel/rivierarent-ortensia", cin: "IT009049B4JHJDIAZB", citra: "009049-LT-2237",
    desc: {
      it: "Spazioso e luminoso nel centro di Pietra Ligure, con due balconi e aria condizionata: tutto a piedi.",
      en: "Spacious and bright in the centre of Pietra Ligure, with two balconies and air conditioning: everything on foot."
    }
  },
  {
    id: "casa-pace", name: "Casa Pace", area: "finale", type: "apartment",
    guests: 8, bedrooms: 3, bathrooms: 2, pool: false, seaView: false, bike: false,
    features: ["wifi", "ac", "garden", "parking", "dishwasher"],
    fromPrice: "", image: "/assets/img/case/casa-pace/copertina.jpg", photos: 27, bookingUrl: "https://italianrivierarent.kross.travel/rivierarent-casa-pace", cin: "IT009029B4OZHY7V6B", citra: "009029-LT-3441",
    desc: {
      it: "Ingresso indipendente e giardino privato a Finale, 3 camere e 2 bagni: ideale per famiglie e gruppi.",
      en: "Private entrance and garden in Finale, 3 bedrooms and 2 bathrooms: ideal for families and groups."
    }
  },
  {
    id: "villa-montebello", name: "Villa Montebello", area: "hills", type: "villa",
    guests: 6, bedrooms: 3, bathrooms: 2, pool: false, seaView: true, bike: true,
    features: ["wifi", "ac", "terrace", "parking", "bikestorage", "dishwasher", "washer"],
    fromPrice: "", image: "/assets/img/case/villa-montebello/copertina.jpg", photos: 39, bookingUrl: "https://italianrivierarent.kross.travel/rivierarent-villa-montebello", cin: "IT009029B4HZS46L9O", citra: "009029-LT-3445",
    desc: {
      it: "Villa storica restaurata tra gli ulivi sopra Finale, terrazza vista mare con barbecue e garage per bici.",
      en: "Restored historic villa among olive groves above Finale, sea-view terrace with barbecue and bike garage."
    }
  }
];

// Le case archiviate restano in RR_PROPERTIES_ALL ma spariscono dal sito
window.RR_PROPERTIES_ALL = window.RR_PROPERTIES;
window.RR_PROPERTIES = window.RR_PROPERTIES.filter(function (p) { return !p.archived; });
