/* Crear mapa */
var map = L.map('map').setView([-11.928499721110041, -77.05091118363637], 13);

/* Agregar TileLayer */
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 1,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

/* Agregar WMS */
wmsComas = L.tileLayer.wms("http://localhost:8080/geoserver/Comas/wms?", {
            layers:'manzanas',
            format: 'image/png',
            transparent: true,
            attribution: "chlopezgis"
            }).addTo(map)