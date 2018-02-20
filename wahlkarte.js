var KA_LAT  = 49.00921;
var KA_LNG  = 8.45003951;
var elemSvg = null;

var GEOJSON = null;
var TILES_URL = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2x.png';

var MAP_ATTRIBUTION = 'Map data &copy; <a href="//openstreetmap.org">' +
                      'OpenStreetMap</a> contributors | Tiles &copy; ' +
                      '<a href="//carto.com/attribution">Carto</a>';

var map;
var svg;
var wahlbezirke;
var stadtteile;


/**
 * Adapter to use Leaflet's projection in D3.
 */
function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
}
var transform = d3.geo.transform({ point: projectPoint }),
    path = d3.geo.path().projection(transform);


/**
 * Create SVG paths from a GeoJSON file.
 *
 * Returns a promise that resolves to a D3 selection of the created
 * paths.
 */
function pathsFromGeoJSON(filename, group, setGeoJson) {

    var loadJson = Promise.promisify(d3.json);

    return loadJson(filename)
        .then(function(collection) {

            if (GEOJSON === null && setGeoJson){
                GEOJSON = collection
            }
            var feature = group.selectAll("path")
                .data(collection.features)
                .enter().append("path");

            map.on("viewreset", reset);
            reset();

            return feature;

            // Reposition the SVG to cover the features.
            function reset() {
                var bounds = path.bounds(collection);
                var topLeft = bounds[0];
                var bottomRight = bounds[1];
                svg.attr("width", bottomRight[0] - topLeft[0])
                    .attr("height", bottomRight[1] - topLeft[1])
                    .style("left", topLeft[0] + "px")
                    .style("top", topLeft[1] + "px");
                group.attr("transform", "translate(" + -topLeft[0] + "," +
                           -topLeft[1] + ")");
                feature.attr("d", path);
            }
        });
}


/**
 * Aktualisiert die Twitter und Facebook Links.
 */
function updateSharingLinks() {
    var param = encodeURIComponent(window.location.href);
    $('#facebookButton').attr('href', 'https://www.facebook.com/sharer/sharer.php?u=' + param);
    $('#twitterButton').attr('href', 'https://twitter.com/home?status=' + param);
    $('#whatsappButton').attr('href', 'whatsapp://send?text=' + param);
}


/**
 * Springt zum Szenario mit der angegebenen ID.
 */
function setScenario(scenarioId) {
    if (window.location.hash.slice(1) !== scenarioId) {
        window.location.hash = scenarioId;
        return;  // Function will be called a second time from onHashChange
    }
    closeInfoPanel();
    var currentSlideIndex = $('#szenarien-carousel div.active').index();
    for (var i = 0; i < SZENARIEN.length; i++) {
        if (SZENARIEN[i].id === scenarioId) {
            var szenario = SZENARIEN[i];
            if (i !== currentSlideIndex) {
                $("#szenarien-carousel").carousel(i);
            }
            break;
        }
    }
    colorMapWinDistrict(szenario);
    updateSharingLinks();
}

function colorMapNeutrally() {

    // Karte Reference setzten wenn nicht vorhanden
    if(elemSvg === null){
        getSVGMap();
    } // end if

    if (GEOJSON !== null) {
        elemSvg.getElementById(item.properties.wahlbezirksnummer).style.fill = '#fff';
    } else {
        console.error("GEOJSON null!")
    }
}

/**
 * Faerbt die Karte nach dem Gewinner fuer jeden Wahlbezirk. Falls keine
 * Farbe fuer die Partei gesetzt, so wird eine 'DefaultColor' gewaehlt.
 */
function colorMapWinDistrict(szenario) {
    // Karte Reference setzten wenn nicht vorhanden
    if(elemSvg === null){
        getSVGMap();
    } // end if

    if (GEOJSON !== null){
        for(var item of GEOJSON.features){
            var analyse = szenario.getAnalyse(item.properties);
            currentAnalysis[item.properties.wahlbezirksnummer] = analyse;
            var color = analyse.color;
            if (typeof color !== 'undefined'){
                elemSvg.getElementById(item.properties.wahlbezirksnummer).style.fill = color
            }
        }
    } else {
        console.error("GEOJSON null!")
    }
}


/**
 * Initialisierung wenn die Seite vollständig geladen ist.
 */
$(function() {

    map = new L.Map("map", {center: [KA_LAT, KA_LNG], zoom: 12})
        .addLayer(new L.TileLayer(TILES_URL, {attribution: MAP_ATTRIBUTION}));
    svg = d3.select(map.getPanes().overlayPane).append("svg");
    var g = svg.append("g").attr("class", "leaflet-zoom-hide");
    svg.attr("id", "karte")
    stadtteile = g.append('g')
        .classed('stadtteile', true);
    wahlbezirke = g.append('g')
        .classed('wahlbezirke', true);

    var stadtteilePromise = pathsFromGeoJSON("ka_stadtteile.geojson", stadtteile, false)
        .then(function (paths) {
            paths
                .attr("id", function (d) { return d.properties.Stadtteilnummer })
                .attr('class', 'district')
                .style('fill', 'rgba(255, 255, 255, 0.7)')
                .style('stroke', '#000')
                .style('stroke-width', 2);
        });

    var wahlbezirkePromise = pathsFromGeoJSON("wahlbezirke.geojson", wahlbezirke, true)
        .then(function (paths) {
            paths
                .attr("id", function (d) { return d.properties.wahlbezirksnummer })
                .attr('class', 'wahlbezirk')
                .on('mousemove', onMouseOverWahlbezirk)
                .on('mouseleave', onMouseLeaveWahlbezirk)
                .style('fill', '#fff')
                .style('stroke', '#000')
                .style('stroke-width', 1)
                .on('click', selectDistrict);
        });

    innerCarousel = document.getElementById('innerCarousel');
    indicators = document.getElementById('indicators');
    createSzenarien();

    $('#szenarien-carousel').bind('slid.bs.carousel', function (e) {
        setScenario(e.relatedTarget.id);
    });

    toolTip = document.getElementById('tool-tip'),
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


    infoPanelDistrictName = document.getElementById('extended-tooltip-district-name');
    infoPanel = document.getElementById('extended-tooltip');
    extendedTooltipDetailDistrictInfo = document.getElementById('extended-tooltip-detail-district-info');
    extendedTooltipDetailDistrictInfoErststimme = document.getElementById('pills-erststimme');
    extendedTooltipDetailDistrictInfoZweitstimme = document.getElementById('pills-zweitstimme');

    Promise.all([stadtteilePromise, wahlbezirkePromise])
        .then(function() {
            function onHashChange(e) {
                setScenario(getScenarioIdFromUrl());
            }
            $(window).on('hashchange', onHashChange);
            onHashChange();
        });

});

