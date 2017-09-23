
/**
 * Diese Datei händelt die Funktionen für das ToolTip
 */

var toolTip = document.getElementById('tool-tip'),
    currentConstituencyNumber = null,
    xpos = 0,
    ypos = 0;

/**
 * Listener der schaut wo der User gerade mit der Maus ist
 */
document.body.addEventListener('mousemove',function(mouseEvent){

    // Prüfen ob der Brwoser das Objekt untersützt
    if (mouseEvent) {
        xpos = mouseEvent.clientX;
        ypos = mouseEvent.clientY;
    } else {
        //IE
        xpos = window.event.clientX;
        ypos = window.event.clientY;
    } // end if else

    // Position von der Maus dem Div übergeben
    toolTip.style.top   = (ypos - (toolTip.offsetHeight / 2))+'px';
    toolTip.style.left  = (xpos + 25)+'px';
},false);


/**
 * Diese Funktion wird aufgeruden wenn der User über ein Wahlbezirk ist
 * @param data Daten vom Wahlbezik
 */
function onMouseOverWahlbezirk(data){

    // Nur ausführen, wenn wirklich der Bezirk geändert wurde
    if(currentConstituencyNumber !== data.properties.Wahlbezirksnummer){

        currentConstituencyNumber = data.properties.Wahlbezirksnummer;

        var template = 'Wahlbezirksnummer: '+currentConstituencyNumber+' <div class="flex">';
        var summe = 0;
        // Stimme von diesem Wahlkreis zusammen rechnen
        Object.keys(data.properties).forEach(function(k, v){

            var index = Party.indexOf(k);
            if (index >= 0) {
                summe += data.properties[k];
            } // end if
        });

        // Verhältnis ermitteln
        Object.keys(data.properties).forEach(function(k, v){
            var index = Party.indexOf(k);
            if (index >= 0 && v > 0) {
                template += '<div style="height: 25px;width: '+(100 * data.properties[k]) / summe+'%;background-color: #'+PartyColors[index]+'"></div>';
            } // end if
        });

        template += '</div>';

        // HTML hinzufügen
        toolTip.innerHTML = template;
    } // end if

    toolTip.style.display = 'block';
} // end function

/**
 * Wird aufgerufen wenn der User das Wahlbezirk verlässt
 */
function onMouseLeaveWahlbezirk() {

    toolTip.innerHTML = 'Keine auswahl';
    toolTip.style.display = 'none';
} // end function