/**
 *  Ermittelt die Partei mit den meisten Stimmen im Wahlkreis
 * @param {Object} properties
 */
function getAnalyseForWechselwaehler(properties) {
    // FIXME Ergebnisse von 2017 einbauen
    if (properties.btw2013.zweitstimme !== 'undefined'
        && properties.btw2013.zweitstimme !== 'undefined') {
      var zweitstimmen2013 = properties.btw2013.zweitstimme;
      var zweitstimmen2017 = properties.btw2013.zweitstimme;
      var sieger2013 = getParteiMitMeistenStimmen(zweitstimmen2013);
      var sieger2017 = getParteiMitMeistenStimmen(zweitstimmen2017);

      var color = '#fff';
      var tooltip = "Kein Wechsel";
      if (sieger2013.partyName.toLowerCase() !== sieger2017.partyName.toLowerCase()) {
        color = getColorForParty(sieger2017.partyName);
        tooltip = "Wechsel von " + sieger2013.partyName + " (" + sieger2013.stimmen + ") zu " + sieger2017.partyName + " (" + sieger2013.stimmen + ")";
      }
      return {
        "color": color,
        "tooltipShowValue": tooltip,
      }
    } else {
        console.error("Error in analysis");
    }
}

function getParteiMitMeistenStimmen(zweitstimmen) {
  var max = 0;
  var partyName = null;
  zweitstimmen.forEach(function(party) {
     if (max < party.stimmen) {
         max = party.stimmen;
         partyName = party.partei;
     }
  });
  return {
    "partyName": partyName,
    "stimmen": max,
  };
}
