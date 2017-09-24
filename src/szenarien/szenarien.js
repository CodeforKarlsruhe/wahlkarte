/**
 * Hier werden die Szenario-Elemente für das Carousel erzeugt.
 */

var innerCarousel = document.getElementById('innerCarousel');

for(var i = 0; i < SZENARIEN.length; i++) {
   var szenario = document.createElement('div');
   szenario.id = SZENARIEN[i].id;
   if (i === 0)
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
   titel.innerHTML = SZENARIEN[i].titel;
   szenarioContent.appendChild(titel);

   var untertitel = document.createElement('h6');
   untertitel.innerHTML = SZENARIEN[i].untertitel;
   szenarioContent.appendChild(untertitel);

   var beschreibung = document.createElement('p');
   beschreibung.innerHTML = SZENARIEN[i].beschreibung;
   szenarioContent.appendChild(beschreibung);
}
