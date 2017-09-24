/**
 * Globale Felder
 */
var infoPanelDistrictName = document.getElementById('extended-tooltip-district-name'),
    infoPanel = document.getElementById('extended-tooltip'),
    extendedTooltipDetailDistrictInfo = document.getElementById('extended-tooltip-detail-district-info');
    extendedTooltipDetailDistrictInfoErststimme = document.getElementById('pills-erststimme');
    extendedTooltipDetailDistrictInfoZweitstimme = document.getElementById('pills-zweitstimme');
    lastSelectedConstituencyNumber = null;

/**
 * Globale Variabeln
 */
var lastSelectetDistrictName = '',
    lastSelectetDistrictId = null;

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
        elemSvg.getElementById(props.stadtteilnummer).style.fill = '#bbe3fa';

        // letzte ausgewählter Stadtteil speichern
        lastSelectetDistrictId = props.stadtteilnummer;


    } // end if

    // In das HTML schreiben
    infoPanelDistrictName.innerHTML = currentConstituencyObject.properties.wahlbezirksname+"<small> (" + props.stadtteilname + ")</small>";

    // Hat sich der Wahlbezirk begeändert?
    if(lastSelectedConstituencyNumber !== currentConstituencyObject.properties.wahlbezirksnummer){

        if(lastSelectedConstituencyNumber !== null) {
            elemSvg.getElementById(lastSelectedConstituencyNumber).style.fill = '#fff';
        } // end if

        lastSelectedConstituencyNumber = currentConstituencyObject.properties.wahlbezirksnummer;
        elemSvg.getElementById(lastSelectedConstituencyNumber).style.fill = '#57bdeb';
    } // end if

    // Info vom aktullen ausgewählen Wahlbezirk weiter an das ExtendedToolTip geben.
    // currentConstituencyObject wird in der Funktion onMouseOverWahlbezirk gefüllt.

    addDetailDistrictInfo(currentConstituencyObject);
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

    // Array Sortieren
    data2013.zweitstimme = data2013.zweitstimme.sort(function (a, b) {
        return b.stimmen - a.stimmen;
    });

    templateZweistimme = '2013 Wahlbeteiligung '+((100 * data2013['wähler/-innen']) / data2013.wahlberechtigte).toFixed(1) +'%';
    templateZweistimme += buildBar(data2013.zweitstimme, sumDistrict);

    templateZweistimme += 'Zweitstimmen (Parteien)' +
        '<table class="table-sm">' +
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
        '<table class="table-sm">' +
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