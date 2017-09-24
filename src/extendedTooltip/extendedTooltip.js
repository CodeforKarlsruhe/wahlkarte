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

    if(lastSelectetDistrictId !== props.Stadtteilnummer){

        if(lastSelectetDistrictId !== null) {
            // Letzer Stadtteil wieder zurück setzen
            elemSvg.getElementById(lastSelectetDistrictId).style.fill = '#fff';
        } // end if

        // Neuer Stadtteil färben
        elemSvg.getElementById(props.Stadtteilnummer).style.fill = '#bbe3fa';

        // letzte ausgewählter Stadtteil speichern
        lastSelectetDistrictId = props.Stadtteilnummer;


    } // end if

    // In das HTML schreiben
    infoPanelDistrictName.innerHTML = currentConstituencyObject.properties.Wahlbezirksname+"<small> (" + props.Stadtteilname + ")</small>";

    // Hat sich der Wahlbezirk begeändert?
    if(lastSelectedConstituencyNumber !== currentConstituencyObject.properties.Wahlbezirksnummer){

        if(lastSelectedConstituencyNumber !== null) {
            elemSvg.getElementById(lastSelectedConstituencyNumber).style.fill = '#fff';
        } // end if

        lastSelectedConstituencyNumber = currentConstituencyNumber;
        elemSvg.getElementById(currentConstituencyNumber).style.fill = '#57bdeb';
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


    // Verhältnis ermitteln
    Object.keys(districtInfo.properties).forEach(function(k, v){
        var index = Party.indexOf(k);
        if (index >= 0 && v > 0 && districtInfo.properties[k] > 0) {

            template += '<tr>';
            //template += '<div style="height: 25px;width: '+(100 * data.properties[k]) / summe+'%;background-color: #'+PartyColors[index]+'"></div>';
                template += '<td>'+k+'</td>';
                template += '<td align="right">'+((100 * districtInfo.properties[k]) / districtInfo.sumDistrict).toFixed(1)+'%</td>';
                template += '<td align="right">'+districtInfo.properties[k]+' <small>Stimmen</small></td>';

            template += '</tr>'
        } // end if
    });

    template += '</tbody>';

    extendedTooltipDetailDistrictInfo.innerHTML = template;
} // end function