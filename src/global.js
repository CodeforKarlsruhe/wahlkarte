/**
 * Baut das Mengen Diagramm
 */
function buildBar(data, summe) {

    var template = '<div class="flex">';

    for(var index in data) {
        // Nur anzeigen, wenn mehr als 0 Stimmen vorhanden sind
        if (data[index].stimmen > 0) {
            var partyItem = PARTY[(data[index].partei).toUpperCase()];

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