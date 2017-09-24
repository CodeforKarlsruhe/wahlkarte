/**
 * Globale Felder
 */
var infoPanelDistrictName;
var infoPanel;
var extendedTooltipDetailDistrictInfo;
var extendedTooltipDetailDistrictInfoErststimme;
var extendedTooltipDetailDistrictInfoZweitstimme;
var lastSelectedConstituencyNumber = null;
var lastSelectetDistrictColor = '';

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

    var props = featureData.properties;

    // Karte Reference setzten wenn nicht vorhanden
    if(elemSvg === null){
        getSVGMap();
    } // end if

    if(lastSelectetDistrictId !== props.stadtteilnummer){

        if(lastSelectetDistrictId !== null) {
            // Letzer Stadtteil wieder zurück setzen
            elemSvg.getElementById(lastSelectetDistrictId).style.fill = '#fff';
        } // end if

        // Neuer Stadtteil färben
        let oldColor = rgb2hex(elemSvg.getElementById(props.stadtteilnummer).style.fill)
        elemSvg.getElementById(props.stadtteilnummer).style.fill = lightenDarkenColor(oldColor, -20);


        // letzte ausgewählter Stadtteil speichern
        lastSelectetDistrictId = props.stadtteilnummer;


    } // end if

    // In das HTML schreiben
    console.log(featureData);
    infoPanelDistrictName.innerHTML = featureData.properties.wahlbezirksname+"<small> (" + props.stadtteilname + ")</small>";

    // Hat sich der Wahlbezirk begeändert?
    if(lastSelectedConstituencyNumber !== featureData.properties.wahlbezirksnummer){

        if(lastSelectedConstituencyNumber !== null) {
            elemSvg.getElementById(lastSelectedConstituencyNumber).style.fill = currentAnalysis[lastSelectedConstituencyNumber].color;
        } // end if

        lastSelectedConstituencyNumber = featureData.properties.wahlbezirksnummer;
        lastSelectetDistrictColor = elemSvg.getElementById(lastSelectedConstituencyNumber).style.fill;
        elemSvg.getElementById(lastSelectedConstituencyNumber).style.fill = '#57bdeb';
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

    if(lastSelectetDistrictId !== null) {
        // Letzer Stadtteil wieder zurück setzen
        elemSvg.getElementById(lastSelectetDistrictId).style.fill = '#fff';
    } // end if

    if (lastSelectedConstituencyNumber) {
        elemSvg.getElementById(lastSelectedConstituencyNumber).style.fill = lastSelectetDistrictColor;
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

    var data2013 = districtInfo.properties.btw2013,
        sumDistrict = districtInfo.sumDistrict,
        template = '';

    sumDistrict = 0; // this code is redundant. took it from tooltip.js
    for(var index in districtInfo.properties.btw2013.zweitstimme){
        sumDistrict += districtInfo.properties.btw2013.zweitstimme[index].stimmen;
    } // end for

    // Array Sortieren
    data2013.zweitstimme = data2013.zweitstimme.sort(function (a, b) {
        return b.stimmen - a.stimmen;
    });

    templateZweistimme = '2013 Wahlbeteiligung '+((100 * data2013['wähler/-innen']) / data2013.wahlberechtigte).toFixed(1) +'%';
    templateZweistimme += buildBar(data2013.zweitstimme, sumDistrict);

    templateZweistimme += 'Zweitstimmen (Parteien)' +
        '<table class="table-sm table-zweitstimme">' +
        '<tbody>' +
        '<colgroup>' +
        '   <col style="width: 100px">' +
        '   <col style="width: 25px">' +
        '   <col style="width: 60px">' +
        '</colgroup>';

    // Array Sortieren
    data2013.zweitstimme = data2013.zweitstimme.sort(function (a, b) {
        return b.stimmen - a.stimmen;
    });

    // Verhältnis ermitteln
    for(var index in data2013.zweitstimme){

        // Nur anzeigen, wenn mehr als 0 Stimmen vorhanden sind
        if( data2013.zweitstimme[index].stimmen > 0) {
            var partyItem = PARTY[(data2013.zweitstimme[index].partei).toUpperCase()];

            if (typeof partyItem === 'undefined') {
                partyItem = {
                    color: '#808080'
                }
            } // end if

            templateZweistimme += '<tr>';
            //template += '<div style="height: 25px;width: '+(100 * data.properties[k]) / summe+'%;background-color: #'+PartyColors[index]+'"></div>';
            templateZweistimme += '<td>' + data2013.zweitstimme[index].partei + '</td>';
            templateZweistimme += '<td align="right">' + ((100 * data2013.zweitstimme[index].stimmen) / sumDistrict).toFixed(1) + '%</td>';
            templateZweistimme += '<td align="right">' + data2013.zweitstimme[index].stimmen + ' <small>Stimmen</small></td>';

            templateZweistimme += '</tr>';
        }
    } // end for

    templateZweistimme += '</tbody>';
    templateZweistimme += '</table>';

    templateZweistimme += '<br>';


    var templateErststimme = 'Erststimmen (Kandidaten)' +
        '<table class="table-sm table-erststimme">' +
        '<tbody>' +
        '<colgroup>' +
        '   <col style="width: 100px">' +
        '   <col style="width: 25px">' +
        '   <col style="width: 60px">' +
        '</colgroup>';

    // Array Sortieren
    data2013.erststimme = data2013.erststimme.sort(function (a, b) {
        return b.stimmen - a.stimmen;
    });

    // Verhältnis ermitteln
    for(var index in data2013.erststimme){

        // Nur anzeigen, wenn mehr als 0 Stimmen vorhanden sind
        if( data2013.erststimme[index].stimmen > 0) {
            var partyItem = PARTY[(data2013.erststimme[index].partei).toUpperCase()];

            if (typeof partyItem === 'undefined') {
                partyItem = {
                    color: '#808080'
                }
            } // end if

            templateErststimme += '<tr>';
            //template += '<div style="height: 25px;width: '+(100 * data.properties[k]) / summe+'%;background-color: #'+PartyColors[index]+'"></div>';
            templateErststimme += '<td>' + data2013.erststimme[index].name + ' <small>(' + data2013.erststimme[index].partei + ')</small></td>';
            templateErststimme += '<td align="right">' + ((100 * data2013.erststimme[index].stimmen) / sumDistrict).toFixed(1) + '%</td>';
            templateErststimme += '<td align="right">' + data2013.erststimme[index].stimmen + ' <small>Stimmen</small></td>';

            templateErststimme += '</tr>';
        } // end if
    } // end for

    templateErststimme += '</tbody>';
    templateErststimme += '</table>';


    extendedTooltipDetailDistrictInfoErststimme.innerHTML = templateErststimme;
    extendedTooltipDetailDistrictInfoZweitstimme.innerHTML = templateZweistimme;
} // end function
