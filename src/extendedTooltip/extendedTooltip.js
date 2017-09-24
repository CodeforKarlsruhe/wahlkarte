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
    // In das HTML schreiben
    infoPanelDistrictName.innerHTML = "Stadtteil: " + props.Stadtteilname + "\n" +
        "Stadtteilnummer: " + props.Stadtteilnummer;

    infoPanel.classList.add('isOpen');
} // end function

/**
 * Schließt das Infopanel
 */
function closeInfoPanel() {
    infoPanel.classList.remove('isOpen');
}