/* LEAFLET JS */
var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -5
});

var ring = L.icon({
    iconUrl: 'images/test_leaflet map V1.0/icons/icon_ring.png',
    //shadowUrl: 'leaf-shadow.png',
    iconSize: [120, 120], // size of the icon
    //shadowSize:   [50, 64], // size of the shadow
    iconAnchor: [60, 60], // point of the icon which will correspond to marker's location
    //shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var customPopupContent  = "<div class='custom-popup'>Das ist ein benutzerdefiniertes Popup.</div>";

var bounds = [[0, 0], [1500, 1500]];
var image = L.imageOverlay('images/test_leaflet map V1.0/Background_V1.png', bounds).addTo(map);

// Fit the map to the bounds of the image
map.fitBounds(bounds);

// Set the initial view to center of the image, and zoom level 1
map.setView([750, 750], 1);

// Test-Marker
//var point1 = L.latLng([703, 600]);  // Adjust coordinates to be within bounds
//L.marker(point1).addTo(map).bindPopup('This is a test popup - point1').openPopup;

//Marker 3
L.marker([910, 780], { icon: ring }).addTo(map).bindPopup('This is a test popup - custompoint1').openPopup;

//Marker 4
L.marker([703, 600], { icon: ring }).addTo(map).bindPopup(customPopupContent, {
    className: 'custom-popup'
}).openPopup();



//QUIZFRAGEN

var quizContent = `
  <div id="Frage 1">
    <p>Welche Farbe hat der Himmel?</p>
    <button id="answer1" class="answer">Blau</button>
    <button id="answer2" class="answer">Grün</button>
    <button id="answer3" class="answer">Rot</button>
  </div>
`;