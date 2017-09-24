/**
 *  Ermittelt die Farbe fuer gegeben Parteinamen
 * @param {String} partyName
 */
function getColorForParty(partyName) {
    let party = findParty(partyName)

    if (party !== null){
        return party.color;
    } else {
        console.error("Party not found!")
    }
}

/**
 * Ermittel aus Konstante PARTY jenes Objekt welches mit dem Namen uebereinstimmt
 * @param {String} name
 */
function findParty(name) {
    let winner = null
    Object.keys(PARTY).forEach(function(p){
        found = PARTY[p]
        if (found.name.toLowerCase() === name.toLowerCase()){
            winner = found
        }
    });

    if (winner !== null){
        return winner;
    } else {
        console.error("Can't find party ", name)
    }
}

/**
 *  Ermittelt die Partei mit den meisten Stimmen im Wahlkreis
 * @param {Object} properties
 */
function getAnalyseForWahlergebnisse(properties) {
    if (properties.btw2013.zweitstimme !== 'undefined') {
      var zweitstimmen = properties.btw2013.zweitstimme;
      var max = 0;
      var partyName = null;
      zweitstimmen.forEach(function(party) {
         if (max < party.stimmen) {
             max = party.stimmen;
             partyName = party.partei;
         }
      });

      if (max >= 0 && partyName !== null) {
        var color = getColorForParty(partyName);
        return {
          "color": color,
          "tooltipShowValue": "Stimmen des Siegers: " + max,
          "tooltipShowKey": "zuzuege"
        }
      }
    } else {
        console.error("Error in analysis");
    }
}

/**
 *  Ermittelt die Partei des Kandidaten mit den meisten Stimmen im Wahlkreis
 * @param {Object} properties
 */
function getAnalyseForErststimmen(properties) {
    if (properties.btw2013.erststimme !== 'undefined') {
      var erststimmen = properties.btw2013.erststimme;
      var max = 0;
      var partyName = null;
      erststimmen.forEach(function(kandidat) {
         if (max < kandidat.stimmen) {
             max = kandidat.stimmen;
             partyName = kandidat.partei;
         }
      });

      if (max >= 0 && partyName !== null) {
        var color = getColorForParty(partyName);
        return {
          "color": color,
          "tooltipShowValue": "Stimmen des Siegers: " + max,
        }
      }
    } else {
        console.error("Error in analysis");
    }
}

/**
 *  Findet Wahlkreise in denen der Gewinner der Erststimme einer anderen Partei angehört als die Partei, die die Zweitstimme gewonnen hat.
 * @param {Object} properties
 */
function getAnalyseForErstVsZweit(properties) {
  if (properties.btw2013.erststimme !== 'undefined') {
    var erststimmen = properties.btw2013.erststimme;
    var erststimme_max = 0;
    var erststimme_partyName = null;
    erststimmen.forEach(function(kandidat) {
      if (erststimme_max < kandidat.stimmen) {
        erststimme_max = kandidat.stimmen;
        erststimme_partyName = kandidat.partei;
      }
    });

    var zweitstimmen = properties.btw2013.erststimme;
    var zweitstimme_max = 0;
    var zweitstimme_partyName = null;
    zweitstimmen.forEach(function(kandidat) {
      if (zweitstimme_max < kandidat.stimmen) {
        zweitstimme_max = kandidat.stimmen;
        zweitstimme_partyName = kandidat.partei;
      }
    });

    if (erststimme_max >= 0 && erststimme_partyName !== null && zweitstimme_max >= 0 && zweitstimme_partyName !== null) {

      var color = getColorForParty(erststimme_partyName);
      if (erststimme_partyName != zweitstimme_partyName) {
        return {
          "color": color,
          "tooltipShowValue": "Erststimmen: " + erststimme_max + "<br/>Zweitstimmen: " + zweitstimme_max,
        }
      } else {
        return {
          "color": color,
          "tooltipShowValue": "Die Partei '" + erststimme_partyName + "' hat sowohl die Erststimme als auch die Zweitstimme gewonnen.",
        }
      }
    }
  } else {
    console.error("Error in analysis");
  }
}
