/**
 * Globale Felder
 */
var infoPanelDistrictName = document.getElementById('extended-tooltip-district-name'),
    infoPanel = document.getElementById('extended-tooltip');

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
        elemSvg.getElementById(props.Stadtteilnummer).style.fill = '#000';

        // letzte ausgewählter Stadtteil speichern
        lastSelectetDistrictId = props.Stadtteilnummer;

        // In das HTML schreiben
        infoPanelDistrictName.innerHTML = "Stadtteil: " + props.Stadtteilname + "\n" +
            "Stadtteilnummer: " + props.Stadtteilnummer;

    } // end if

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