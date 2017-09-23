
/**
 * Diese Funktion händelt die Funktion für das ToolTip
 */

var toolTip = document.getElementById('tool-tip'),
    currentConstituencyNumber = null,
    constituencyNumberElement = document.getElementById('constituency-number');

document.addEventListener('mousemove',function(event){

    // Position von der Maus dem Div übergeben
    toolTip.style.top   = event.screenY+'px';
    toolTip.style.left  = (event.screenX + 25)+'px';
},false);


/**
 * Diese Funktion wird aufgeruden wenn der User über ein Wahlbezirk ist
 * @param data Daten vom Wahlbezik
 */
function onMouseOverWahlbezirk(data){
    console.log(data);
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