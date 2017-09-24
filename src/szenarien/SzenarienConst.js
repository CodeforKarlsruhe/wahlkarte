const SZENARIEN_IDS = {
  WAHLERGEBNISSE: "WAHLERGEBNISSE",
  KANDIDATEN: "KANDIDATEN",
  WECHSELWAEHLER: "WECHSELWAEHLER",
  HUNDEBESITZER: "HUNDEBESITZER",
  ERST_VS_ZWEIT: "ERST_VS_ZWEIT",
  MIGRATIONSHINTERGRUND: "MIGRATIONSHINTERGRUND",
  GROESSTE_AENDERUNG: "GROESSTE_AENDERUNG",
  SONSTIGE: "SONSTIGE",
  UNGEUELTIGE_ERST: "UNGEUELTIGE_ERST",
  UNGUELTIGE_ZWEIT: "UNGUELTIGE_ZWEIT",
}

const SZENARIEN = [
  {
    "id": SZENARIEN_IDS.WAHLERGEBNISSE,
    "titel": "Wahlergebnisse",
    "untertitel": "Hier findest du die Wahlergebnisse in der klassischen Ansicht",
    "beschreibung": "In der klassischen Ansicht sind die Wahlbezirke in der Farbe der meistgewählten Partei eingefärbt.",
  },
  {
    "id": SZENARIEN_IDS.KANDIDATEN,
    "titel": "Erststimme",
    "untertitel": "Übersicht der gewählten Kandidaten",
    "beschreibung": "Die Wahlbezirke sind in der Farbe der Partei des meistegwählten Kandidaten gefärbt.",
  },
  {
    "id": SZENARIEN_IDS.WECHSELWAEHLER,
    "titel": "Wechselwähler",
    "untertitel": "Welche Wahlbezirke haben die Farbe gewechselt?",
    "beschreibung": "Die Wahlbezirke, in denen die meistgewählte Partei im Vergleich zur Bundestagswahl 2013 gewechselt ist, sind hier hervorgehoben.",
  },
  {
    "id": SZENARIEN_IDS.HUNDEBESITZER,
    "titel": "Hundebesitzer",
    "untertitel": "Wie haben Hundebesitzer gewählt?",
    "beschreibung": "Die Wahlbezirke mit den meisten Hundebesitzern werden farblich hervorgehoben.",
  },
  {
    "id": SZENARIEN_IDS.ERST_VS_ZWEIT,
    "titel": "Erst- vs. Zweitstimmen",
    "untertitel": "Wo unterscheiden sich die Sieger?",
    "beschreibung": "Hervorgehoben sind die Wahlbezirke, in denen sich die meistgewählte Partei von der Partei des meistegwählten Kandidaten unterscheiden.",
  },
  {
    "id": SZENARIEN_IDS.MIGRATIONSHINTERGRUND,
    "titel": "Migrationshintergrund",
    "untertitel": "Wird in Wahlbezirken mit mehr Menschen mit Migrationshintergrund anders gewählt?",
    "beschreibung": "Hervorgehoben sind die Wahlbezirke, in denen mehr Menschen mit Migrationshintergrund leben.",
  },
  {
    "id": SZENARIEN_IDS.GROESSTE_AENDERUNG,
    "titel": "Größte Änderung",
    "untertitel": "Welche Partei hat am meisten zugelegt?",
    "beschreibung": "Die Wahlbezirke sind in der Farbe der Partei eingefärbt, die im Vergleich zur letzten Bundestagswahl absolut betrachtet die größten Stimmgewinne hat.",
  },
  {
    "id": SZENARIEN_IDS.UNGEUELTIGE_ERST,
    "titel": "Ungültige Erststimmen",
    "untertitel": "Wie viele ungültige Erststimmen gibt es in den jeweiligen Wahlbezirken?",
    "beschreibung": "Je dunkler die Farbe des Wahlbezirks ist, desto mehr ungültige Erststimmen gab es.",
  },
  {
    "id": SZENARIEN_IDS.UNGEUELTIGE_ZWEIT,
    "titel": "Ungültige Zweitstimme",
    "untertitel": "Wie viele ungültige Zweitstimmen gibt es in den jeweiligen Wahlbezirken?",
    "beschreibung": "Je dunkler die Farbe des Wahlbezirks ist, desto mehr ungültige Zweitstimmen gab es.",
  },
]
