var KA_LAT  = 49.00921;
var KA_LNG  = 8.45003951;
var elemSvg = null;

var GEOJSON = null;
var TILES_URL = '//a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png';

var MAP_ATTRIBUTION = 'Map data &copy; <a href="//openstreetmap.org">' +
                      'OpenStreetMap</a> contributors | Tiles &copy; ' +
                      '<a href="//carto.com/attribution">Carto</a>';

var map = new L.Map("map", {center: [KA_LAT, KA_LNG], zoom: 12})
    .addLayer(new L.TileLayer(TILES_URL, {attribution: MAP_ATTRIBUTION}));

var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");

// SVG ID
svg.attr("id", "karte")

var stadtteile = g.append('g')
    .classed('stadtteile', true);

var wahlbezirke = g.append('g')
    .classed('wahlbezirke', true);


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
 */
function pathsFromGeoJSON(filename, group, setGeoJson, callback) {

    d3.json(filename, function (error, collection) {
        if (error) return callback(error, null);

        if (GEOJSON === null && setGeoJson){
            GEOJSON = collection
        }
        var feature = group.selectAll("path")
            .data(collection.features)
            .enter().append("path");

        map.on("viewreset", reset);
        reset();

        return callback(null, feature);

        // Reposition the SVG to cover the features.
        function reset() {
            var bounds = path.bounds(collection);
            var topLeft = bounds[0];
            var bottomRight = bounds[1];

            svg.attr("width", bottomRight[0] - topLeft[0])
                .attr("height", bottomRight[1] - topLeft[1])
                .style("left", topLeft[0] + "px")
                .style("top", topLeft[1] + "px");

            group.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

            feature.attr("d", path);
        }
    });
}

pathsFromGeoJSON("ka_stadtteile.geojson", stadtteile,false, function (error, paths) {
    paths
        .attr("id", function (d) { return d.properties.Stadtteilnummer })
        .attr('class', 'district')
        .style('fill', 'rgba(255, 255, 255, 0.7)')
        .style('stroke', '#000')
        .style('stroke-width', 2);
});

pathsFromGeoJSON("wahlbezirke.geojson", wahlbezirke, true, function (error, paths) {
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

$('#szenarien-carousel').bind('slid.bs.carousel', function (e) {
    setScenario(e.relatedTarget.id);
});


/**
 * Springt zum Szenario mit der angegebenen ID.
 */
function setScenario(scenarioId) {
    if (window.location.hash.slice(1) !== scenarioId) {
        window.location.hash = scenarioId;
        return;  // Function will be called a second time from onHashChange
    }
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
            var analyse = szenario.colorMap(item.properties);
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
    createSzenarien();

    // FIXME: Warten bis GeoJSON vollständig geladen ist.

    function onHashChange(e) {
        setScenario(getScenarioIdFromUrl());
    }
    $(window).on('hashchange', onHashChange);
    onHashChange();
});


/**
 * Liefert die aktuelle Szenarien-ID aus der Browser-URL zurück.
 *
 * Wenn keine oder eine ungültige Szenarien-ID gesetzt ist wird die ID
 * des ersten Szenarios zurückgeliefert.
 */
function getScenarioIdFromUrl() {
    if (window.location.hash) {
        var hash = window.location.hash.slice(1);
        for(var i = 0; i < SZENARIEN.length; i++) {
            if (SZENARIEN[i].id === hash) {
                return hash;
            }
        }
    }
    return SZENARIEN[0].id;
}
