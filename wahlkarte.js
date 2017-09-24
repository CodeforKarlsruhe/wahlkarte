var KA_LAT  = 49.00921;
var KA_LNG  = 8.45003951;
var elemSvg = null;

var GEOJSON = null;
var Party = ["CDU","SPD","FDP","GRÜNE","DIE LINKE","PIRATEN","NPD","REP","Tierschutzpartei","ÖDP","PBC","Volksabstimmung","MLPD ","BüSo","AfD","BIG","pro Deutschland","FREIE WÄHLER","PARTEI DER VERNUNFT","RENTNER"];

const PartyColors = ["000","f40502","feed01","42a62a","8b1b62","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","009de0","ffffff","ffffff","ffffff","ffffff","ffffff"];

var TILES_URL = 'http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png';

var MAP_ATTRIBUTION = 'Map data &copy; <a href="http://openstreetmap.org">' +
                      'OpenStreetMap</a> contributors | Tiles &copy; ' +
                      '<a href="http://carto.com/attribution">Carto</a>';

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

$('#szenarien-carousel').bind('slide.bs.carousel', function (e) {
    colorMap();
});

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

function colorMap() {

    // Karte Reference setzten wenn nicht vorhanden
    if(elemSvg === null){
        getSVGMap();
    } // end if

    if (GEOJSON !== null){
        for(var item of GEOJSON.features){
            var win = maxPartie(item.properties.btw2013.zweitstimme)
            var color = winnerColor(win[0])
            if (typeof color !== 'undefined'){
                elemSvg.getElementById(item.properties.wahlbezirksnummer).style.fill = color
            }
        }
    } else {
        console.error("GEOJSON null!")
    }
}

function winnerColor(partyName){
    let winner = null
    Object.keys(PARTY).forEach(function(p){
        found = PARTY[p]
        if (found.name.toLowerCase() === partyName.toLowerCase()){
            winner = found
        } 
    });
    
    if (winner !== null){
        return winner.color;
    } else {
        console.error("Party not found!")
    }
}

/**
 *  Ermittelt die Parite mit den meisten Stimmen im Wahlkreist 
 * @param {Object} bezirkZweitstimmen 
 */
function maxPartie(bezirkZweitstimmen){
    if (bezirkZweitstimmen !== 'undefined'){
        var max = 0;
        var partyName = null;
        bezirkZweitstimmen.forEach(function(par){
           if (max < par.stimmen) {
               max = par.stimmen;
               partyName = par;
           }
        });

        if (max >= 0 && partyName !== null)
        return [partyName.partei, max]
    } else {
        console.error("No data")
    }
}

function getSVGMap() {
    return elemSvg = document.getElementById("karte");
}
