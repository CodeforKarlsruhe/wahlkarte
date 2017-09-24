/**
 * Globale Felder
 */
var infoPanelDistrictName = document.getElementById('extended-tooltip-district-name'),
    infoPanel = document.getElementById('extended-tooltip'),
    extendedTooltipDetailDistrictInfo = document.getElementById('extended-tooltip-detail-district-info');
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

    var template = 'Zweitstimmen (Parteien)' +
        '<table class="table-sm">' +
        '<tbody>' +
        '<colgroup>' +
        '   <col style="width: 100px">' +
        '   <col style="width: 25px">' +
        '   <col style="width: 60px">' +
        '</colgroup>';

    // Array Sortieren
    districtInfo.properties.btw2013.zweitstimme = districtInfo.properties.btw2013.zweitstimme.sort(function (a, b) {
        return b.stimmen - a.stimmen;
    });

    // Verhältnis ermitteln
    for(var index in districtInfo.properties.btw2013.zweitstimme){

        var partyItem = PARTY[(districtInfo.properties.btw2013.zweitstimme[index].partei).toUpperCase()];

        if( typeof partyItem === 'undefined'){
            partyItem = {
                color: '#808080'
            }
        } // end if

        template += '<tr>';
        //template += '<div style="height: 25px;width: '+(100 * data.properties[k]) / summe+'%;background-color: #'+PartyColors[index]+'"></div>';
        template += '<td>'+districtInfo.properties.btw2013.zweitstimme[index].partei+'</td>';
        template += '<td align="right">'+((100 * districtInfo.properties.btw2013.zweitstimme[index].stimmen) / districtInfo.sumDistrict).toFixed(1)+'%</td>';
        template += '<td align="right">'+districtInfo.properties.btw2013.zweitstimme[index].stimmen+' <small>Stimmen</small></td>';

        template += '</tr>';

    } // end for

    template += '</tbody>';
    template += '</table>';

    template += '<br>';


    template += 'Erststimmen (Kandidaten)' +
        '<table class="table-sm">' +
        '<tbody>' +
        '<colgroup>' +
        '   <col style="width: 100px">' +
        '   <col style="width: 25px">' +
        '   <col style="width: 60px">' +
        '</colgroup>';

    // Array Sortieren
    districtInfo.properties.btw2013.erststimme = districtInfo.properties.btw2013.erststimme.sort(function (a, b) {
        return b.stimmen - a.stimmen;
    });

    // Verhältnis ermitteln
    for(var index in districtInfo.properties.btw2013.erststimme){

        var partyItem = PARTY[(districtInfo.properties.btw2013.erststimme[index].partei).toUpperCase()];

        if( typeof partyItem === 'undefined'){
            partyItem = {
                color: '#808080'
            }
        } // end if

        template += '<tr>';
        //template += '<div style="height: 25px;width: '+(100 * data.properties[k]) / summe+'%;background-color: #'+PartyColors[index]+'"></div>';
        template += '<td>'+districtInfo.properties.btw2013.erststimme[index].name+' <small>('+districtInfo.properties.btw2013.erststimme[index].partei+')</small></td>';
        template += '<td align="right">'+((100 * districtInfo.properties.btw2013.erststimme[index].stimmen) / districtInfo.sumDistrict).toFixed(1)+'%</td>';
        template += '<td align="right">'+districtInfo.properties.btw2013.erststimme[index].stimmen+' <small>Stimmen</small></td>';

        template += '</tr>';

    } // end for

    template += '</tbody>';
    template += '</table>';


    extendedTooltipDetailDistrictInfo.innerHTML = template;
} // end function