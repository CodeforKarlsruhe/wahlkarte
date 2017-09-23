
/**
 * Diese Datei händelt die Funktionen für das ToolTip
 */

var toolTip = document.getElementById('tool-tip'),
    currentConstituencyNumber = null,
    constituencyNumberElement = document.getElementById('constituency-number');

/**
 * Listener der schaut wo der User gerade mit der Maus ist
 */
document.addEventListener('mousemove',function(event){

    // Position von der Maus dem Div übergeben
    toolTip.style.top   = (event.screenY - toolTip.offsetHeight)+'px';
    toolTip.style.left  = (event.screenX + 25)+'px';
},false);


/**
 * Diese Funktion wird aufgeruden wenn der User über ein Wahlbezirk ist
 * @param data Daten vom Wahlbezik
 */
function onMouseOverWahlbezirk(data){

    constituencyNumberElement.innerHTML = currentConstituencyNumber = data.properties.Wahlbezirksnummer;
    toolTip.style.display = 'block';
} // end function

/**
 * Wird aufgerufen wenn der User das Wahlbezirk verlässt
 */
function onMouseLeaveWahlbezirk() {

    constituencyNumberElement.innerHTML = 'Keine auswahl';
    toolTip.style.display = 'none';
} // end function