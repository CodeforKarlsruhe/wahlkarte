/**
 * Hier werden die Szenario-Elemente für das Carousel erzeugt.
 */

var innerCarousel = document.getElementById('innerCarousel');
var indicators = document.getElementById('indicators');

for(var i = 0; i < SZENARIEN.length; i++) {
  createSzenario(i);
  createIndicator(i);
}

function createSzenario(index) {
  var szenario = document.createElement('div');
  szenario.id = SZENARIEN[index].id;
  if (index === 0)
  {
    szenario.className = 'carousel-item active';
  } else {
    szenario.className = 'carousel-item';
  }
  innerCarousel.appendChild(szenario);

  var szenarioContent = document.createElement('div');
  szenarioContent.className = 'wahl-carousel-caption d-block';
  szenario.appendChild(szenarioContent);

  var titel = document.createElement('h3');
  titel.innerHTML = SZENARIEN[index].titel;
  szenarioContent.appendChild(titel);

  var untertitel = document.createElement('h6');
  untertitel.innerHTML = SZENARIEN[index].untertitel;
  szenarioContent.appendChild(untertitel);

  var beschreibung = document.createElement('p');
  beschreibung.innerHTML = SZENARIEN[index].beschreibung;
  szenarioContent.appendChild(beschreibung);
}

function createIndicator(index) {
  var indicator = document.createElement('li');
  if (index === 0)
  {
    indicator.className = 'active';
  }
  indicator.setAttribute('data-target', '#szenarien-carousel');
  indicator.setAttribute('data-slide-to', index);
  indicators.appendChild(indicator);
}
