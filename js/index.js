/* 1. Inicializar mapa: "map" es el id del div del html*/
var map = L.map('map').setView([-11.928499721110041, -77.05091118363637], 13);

/* 2. Agregar mapas Bases*/

// TileLayer
const OSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 19,
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                        zIndex: 1 // Orden de visualización
                    }).addTo(map);

/* 3. Agregar capas */
const mzWMS = L.tileLayer.wms("http://localhost:8080/geoserver/Comas/wms?", {
                              layers:'manzanas', // Nombre de la capa del servicio WMS
                              maxZoom: 19,
                              format: 'image/png',
                              transparent: true,
                              attribution: "&chlopezgis",
                              zIndex: 2 // Orden de visualización
                })

const huWMS = L.tileLayer.wms("http://localhost:8080/geoserver/Comas/wms?", {
                              layers:'neighborhoods', // Nombre de la capa del servicio WMS
                              maxZoom: 19,
                              format: 'image/png',
                              transparent: true,
                              attribution: "&chlopezgis",
                              zIndex: 3 // Orden de visualización
                })

/* 4. Agregar controlador de capas */
const capaBase = {
                  'Manzanas':mzWMS,
                  'Barrios': huWMS
                }

let layerControl = L.control.layers(capaBase).addTo(map)

/* 4. Agregar barra de Escala */
L.control.scale().addTo(map);