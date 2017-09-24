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
      if (sieger2013.party.name.toLowerCase() !== sieger2017.party.name.toLowerCase()) {
        color = getColorForParty(sieger2017.party.name);
        tooltip = "Wechsel von " + sieger2013.party.name + " (" + sieger2013.stimmen + " Stimmen) zu " + sieger2017.party.name + " (" + sieger2013.stimmen + " Stimmen)";
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
  var gewinner = findParty(partyName);
  return {
    "party": gewinner,
    "stimmen": max,
  };
}
