/* Leaflet JS */
var map = L.map('map').setView([51.505, -0.09], 13);
/* setView() method sets the view of the map (geographical center and zoom) */
/* The first parameter is the geographical center of the map - [51.505, -0.09] */
/* The second parameter is the zoom level - 13 */

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);