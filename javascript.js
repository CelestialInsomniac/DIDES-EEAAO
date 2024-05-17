/* LEAFLET JS */
var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -5
});

var bounds = [[0, 0], [1500, 1500]];
var image = L.imageOverlay('images/test_leaflet map V1.0/Background_V1.png', bounds).addTo(map);

// Fit the map to the bounds of the image
map.fitBounds(bounds);

// Set the initial view to center of the image
map.setView([750, 750], 1);

// Marker 1
var point1 = L.latLng([703, 600]);  // Adjust coordinates to be within bounds
L.marker(point1).addTo(map).bindPopup('This is a test popup - point1').openPopup;

// Marker 2
var point2 = L.latLng([903, 778]);  // Adjust coordinates to be within bounds
L.marker(point2).addTo(map).bindPopup('This is a test popup - point2').openPopup;
