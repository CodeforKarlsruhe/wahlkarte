/**
 * Globale Felder
 */
var infoPanelDistrictName;
var infoPanel;
var extendedTooltipDetailDistrictInfo;
var extendedTooltipDetailDistrictInfoErststimme;
var extendedTooltipDetailDistrictInfoZweitstimme;
var lastSelectedConstituencyNumber = null;

var EXTENDED_TOOLTIP_TABLE_HEADER_TEMPLATE = '<table class="table-sm table-stimmen">';

/**
 * Globale Variabeln
 */
var lastSelectetDistrictName = '',
    lastSelectetDistrictId = null;

/*
obvious
*/
function rgb2hex(rgba) {
    var regex = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
        parsed = regex.exec(rgba);
    var red, green, blue, alpha, elems;
    if (!parsed) {
        console.log(rgba);
        throw "Invalid format: " + rgba;
    }
    red   = parsed[1];
    green = parsed[2];
    blue  = parsed[3];
    alpha = parsed[4];
    elems = [hex(red), hex(green), hex(blue)];
    if (alpha) {
        // elems.push(hex(alpha));
    }
    return "#" + elems.join("");

    function hex(number) {
        if (number > 255) {
            throw "'" + number + "'' is greater than 255(0xff);";
        }
        var str = Number(number).toString(16);
        return ("0" + str).slice(-2);
    }
}

/**
 * Wird aufgerufen wenn der User auf eine Region klickt
 * @param featureData das aktuelle "feature"
 */
function selectDistrict(featureData) {
    // Karte Reference setzten wenn nicht vorhanden
    if(elemSvg === null){
        getSVGMap();
    }

    // Hat sich der Wahlbezirk begeändert?
    let constituencyNumber = featureData.properties.wahlbezirksnummer;
    if(lastSelectedConstituencyNumber !== constituencyNumber) {
        // Ruecksetzen der alten Selektion
        if(lastSelectedConstituencyNumber !== null) {
            let el = elemSvg.getElementById(lastSelectedConstituencyNumber);
            el.style.stroke = '#000';
            el.style.strokeWidth = '1px';
        } // end if

        lastSelectedConstituencyNumber = constituencyNumber;
        let el = elemSvg.getElementById(lastSelectedConstituencyNumber);
        el.style.stroke = 'rgb(26, 188, 156)';
        el.style.strokeWidth = '5px';

        infoPanelDistrictName.innerHTML = featureData.properties.wahlbezirksname;
    } // end if

    // Info vom aktullen ausgewählen Wahlbezirk weiter an das ExtendedToolTip geben.
    // featureData wird in der Funktion onMouseOverWahlbezirk gefüllt.

    addDetailDistrictInfo(featureData);
    infoPanel.classList.add('isOpen');
} // end function

/**
 * Schließt das Infopanel
 */
function closeInfoPanel() {
    if (lastSelectedConstituencyNumber) {
        let el = elemSvg.getElementById(lastSelectedConstituencyNumber);
        el.style.stroke = '#000';
        el.style.strokeWidth = '1px';
    }
    lastSelectetDistrictId = null;
    infoPanel.classList.remove('isOpen');
} // end function

/**
 * Fügt die Detalierte Wahlinfo hinzu
 *
 * @param districtInfo {object}
 */
function addDetailDistrictInfo(districtInfo) {

    var data2017 = districtInfo.properties.btw2017,
        sumDistrict = districtInfo.sumDistrict,
        template = '';

    sumDistrict = districtInfo.properties.btw2017.gueltige_zweitstimmen;

    // Array Sortieren
    data2017.zweitstimme = data2017.zweitstimme.sort(function (a, b) {
        return b.stimmen - a.stimmen;
    });

    templateZweistimme = buildBar(data2017.zweitstimme, sumDistrict);
    templateZweistimme += EXTENDED_TOOLTIP_TABLE_HEADER_TEMPLATE;

    // Array Sortieren
    data2017.zweitstimme = data2017.zweitstimme.sort(function (a, b) {
        return b.stimmen - a.stimmen;
    });

    // Verhältnis ermitteln
    for(var index in data2017.zweitstimme){

        // Nur anzeigen, wenn mehr als 0 Stimmen vorhanden sind
        if( data2017.zweitstimme[index].stimmen > 0) {
            var partyItem = PARTY[(data2017.zweitstimme[index].partei).toUpperCase()];

            if (typeof partyItem === 'undefined') {
                partyItem = {
                    color: '#808080'
                }
            } // end if

            templateZweistimme += '<tr>';
            //template += '<div style="height: 25px;width: '+(100 * data.properties[k]) / summe+'%;background-color: #'+PartyColors[index]+'"></div>';
            templateZweistimme += '<td>' + data2017.zweitstimme[index].partei + '</td>';
            templateZweistimme += '<td align="right">' + ((100 * data2017.zweitstimme[index].stimmen) / sumDistrict).toFixed(1) + '%</td>';
            templateZweistimme += '<td align="right">' + data2017.zweitstimme[index].stimmen + ' <small>Stimmen</small></td>';

            templateZweistimme += '</tr>';
        }
    } // end for

    templateZweistimme += '</table>';

    templateZweistimme += '<br>';

    var templateErststimme = EXTENDED_TOOLTIP_TABLE_HEADER_TEMPLATE;

    // Array Sortieren
    data2017.erststimme = data2017.erststimme.sort(function (a, b) {
        return b.stimmen - a.stimmen;
    });

    // Verhältnis ermitteln
    for(var index in data2017.erststimme){

        // Nur anzeigen, wenn mehr als 0 Stimmen vorhanden sind
        if( data2017.erststimme[index].stimmen > 0) {
            var partyItem = PARTY[(data2017.erststimme[index].partei).toUpperCase()];

            if (typeof partyItem === 'undefined') {
                partyItem = {
                    color: '#808080'
                }
            } // end if

            templateErststimme += '<tr>';
            //template += '<div style="height: 25px;width: '+(100 * data.properties[k]) / summe+'%;background-color: #'+PartyColors[index]+'"></div>';
            templateErststimme += '<td>' + data2017.erststimme[index].name + ' <small>(' + data2017.erststimme[index].partei + ')</small></td>';
            templateErststimme += '<td align="right">' + ((100 * data2017.erststimme[index].stimmen) / sumDistrict).toFixed(1) + '%</td>';
            templateErststimme += '<td align="right">' + data2017.erststimme[index].stimmen + ' <small>Stimmen</small></td>';

            templateErststimme += '</tr>';
        } // end if
    } // end for

    templateErststimme += '</table>';

    extendedTooltipDetailDistrictInfoErststimme.innerHTML = templateErststimme;
    extendedTooltipDetailDistrictInfoZweitstimme.innerHTML = templateZweistimme;
} // end function
