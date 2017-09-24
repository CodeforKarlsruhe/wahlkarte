var currentAnalysis = {};

var translateStatisticsObject = {
    'alter_0-19':                               'Alter zwischen 0-19',
    'alter_0_19_pe':                            'Alter zwischen 0-19 pro Einheit',
    'alter_20-64':                              'Alter zwischen 20-64',
    'alter_20_64_pe':                           'Alter zwischen 20-64 pro Einheit',
    anteiluebergaengegemeinschaftsschule:       'Anteil übergänge Gemeinschaftsschule',
    anteiluebergaengegymnasium:                 'Anteil Übergänge Gymnasium',
    anteiluebergaengehauptundwerkrealschule:    'Anteil Übergänge Hauptundwerkrealschule',
    anteiluebergaengerealschule:                'Anteil Übergänge Realschule',
    anteiluebergaengesonstige:                  'Anteil Übergänge Sonstige',
    auslaenderinnen:                            'Ausländerinnen',
    auslanderinnen_pe:                          'Ausländerinnen pro Einwohner',
    deutschemitmigrationshintergrund:           'Deutsche mit Migrationshintergrund',
    deutschemitmigrationshintergrund_pe:        'Deutsche mit Migrationshintergrund pro Einwohner',
    einwohner:                                  'Einwohner',
    geburten:                                   'Geburten',
    geburten_pe:                                'Geburten pro Einwohner',
    gestorbene:                                 'Gestorbene',
    gestorbene_pe:                              'Gestorbene pro Einwohner',
    wahlbezirksnummer:                          'Wahlbezirksnummer',
    wegzuege:                                   'Wegzüge',
    wegzuege_pe:                                'Wegzüge pro Einwohner',
    zuzuege:                                    'Zuzüge',
    zuzuege_pe:                                 'Zuzüge pro Einwohner'
};






/**
 * Baut das Mengen Diagramm
 */
function buildBar(data, summe) {

    var template = '<div class="flex">';

    for(var index in data) {
        // Nur anzeigen, wenn mehr als 0 Stimmen vorhanden sind
        if (data[index].stimmen > 0) {
            var partyItem = findParty(data[index].partei);

            if (typeof partyItem === 'undefined') {
                partyItem = {
                    color: '#808080'
                }
            } // end if

            template += '<div style="' +
                'height: 25px;' +
                'width: ' + (100 * data[index].stimmen) / summe + '%;' +
                'background-color: ' + partyItem.color + '"' +
                '></div>';
        } // if
    } // end for

    return template + '</div>';
} // end function

// Holt die SVG Karte
function getSVGMap() {
    return elemSvg = document.getElementById("karte");
} // end function

/**
 * Ermittel aus Konstante PARTY jenes Objekt welches mit dem Namen uebereinstimmt
 * @param {String} name
 */
function findParty(name){
    var winner = null;
    Object.keys(PARTY).forEach(function(p){
        found = PARTY[p];
        if (found.name.toLowerCase() === name.toLowerCase()){
            winner = found
        }
    });

    if (winner !== null){
        return winner;
    } else {
        console.error("Can't find party ", name)
    }
}

/**
 * Liefert die aktuelle Szenarien-ID aus der Browser-URL zurück.
 *
 * Wenn keine oder eine ungültige Szenarien-ID gesetzt ist wird die ID
 * des ersten Szenarios zurückgeliefert.
 */
function getScenarioIdFromUrl() {
    if (window.location.hash) {
        var hash = window.location.hash.slice(1);
        for(var i = 0; i < SZENARIEN.length; i++) {
            if (SZENARIEN[i].id === hash) {
                return hash;
            }
        }
    }
    return SZENARIEN[0].id;
}

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}
