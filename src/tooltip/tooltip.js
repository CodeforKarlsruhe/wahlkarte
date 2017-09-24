
/**
 * Diese Datei händelt die Funktionen für das ToolTip
 */

var toolTip = document.getElementById('tool-tip'),
    currentConstituencyNumber = null,
    currentConstituencyObject = null,
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
    if(currentConstituencyNumber !== data.properties.wahlbezirksnummer){

        currentConstituencyNumber = data.properties.wahlbezirksnummer;

        var template = '<span id="tool-tip-district-name">'+data.properties.wahlbezirksname+"<small> (" + data.properties.stadtteilname + ")</small></span>";
        var summe = 0;

        // Stimme von diesem Wahlkreis zusammen rechnen
        for(var index in data.properties.btw2013.zweitstimme){
            summe += data.properties.btw2013.zweitstimme[index].stimmen;
        } // end for

        // Array Sortieren
        data.properties.btw2013.zweitstimme = data.properties.btw2013.zweitstimme.sort(function (a, b) {
            return b.stimmen - a.stimmen;
        });


        template += buildBar(data.properties.btw2013.zweitstimme, summe);


        template += 'Summe der Stimmen: '+summe;

        // HTML hinzufügen
        toolTip.innerHTML = template;

        // Infos an das extended Tooltip weiter geben

        currentConstituencyObject = {
            sumDistrict:    summe,
            properties:     data.properties
        };
    } // end if

    toolTip.style.display = 'block';
} // end function

/**
 * Wird aufgerufen wenn der User das Wahlbezirk verlässt
 */
function onMouseLeaveWahlbezirk() {

    currentConstituencyNumber = null;
    toolTip.innerHTML = 'Keine Auswahl';
    toolTip.style.display = 'none';
} // end function
