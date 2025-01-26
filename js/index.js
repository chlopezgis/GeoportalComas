/* 1. Inicializar mapa: "map" es el id del div del html*/
var map = L.map('map').setView([-11.928499721110041, -77.05091118363637], 13);

/* 2. Agregar mapas Bases*/
const OSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', 
                        {
                          maxZoom: 19,
                          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                          //zIndex: 1 // Orden de visualización
                        }).addTo(map);

const positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', 
                            {
                              maxZoom: 19,
                              attribution: '©OpenStreetMap, ©CartoDB'
                        });

// Agregar controlador de mapas base
const mapBase = {
                  'OSM':OSM,
                  'Carto Positro': positron
                };

let mapBaseControl = L.control.layers(mapBase).addTo(map);

/* 3. Agregar WMS: Utilizaremos "fetch" para agregar todas las capas disponible del servicio WMS */
const geoserverUrl = "http://localhost:8080/geoserver/Comas/wms?service=WMS&version=1.3.0&request=GetCapabilities";
const layersContainer = document.getElementById("layers"); // Elemento <ul> donde se listarán las capas

fetch(geoserverUrl)
    .then(response => response.text()) // Obtener respuesta como texto
    .then(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "application/xml");

        // Extraer todas las etiquetas <Layer> dentro de <Capability>
        const layers = Array.from(xml.querySelectorAll("Layer > Name")).map(layer => layer.textContent);

        // Objeto para almacenar las capas activas
        const activeLayers = {};

        // Iterar sobre las capas y agregarlas a la lista en HTML
        layers.forEach(layerName => {
            // Crear un nuevo elemento <li>
            const listItem = document.createElement("li");
            listItem.textContent = layerName + " ";

            // Crear un interruptor (checkbox) para controlar la capa
            const toggleSwitch = document.createElement("input");
            toggleSwitch.type = "checkbox";
            
            // Evento para activar o desactivar la capa en el mapa
            toggleSwitch.onchange = () => {
                if (toggleSwitch.checked) {
                    // Agregar la capa al mapa
                    activeLayers[layerName] = L.tileLayer.wms("http://localhost:8080/geoserver/Comas/wms", {
                        layers: layerName,
                        maxZoom: 19,
                        format: "image/png",
                        transparent: true,
                        zIndex: 2
                    });
                    activeLayers[layerName].addTo(map);
                } else {
                    // Remover la capa del mapa
                    map.removeLayer(activeLayers[layerName]);
                    delete activeLayers[layerName];
                }
            };

            // Añadir el interruptor al <li>
            listItem.appendChild(toggleSwitch);
            // Añadir <li> a la lista <ul>
            layersContainer.appendChild(listItem); 
        });

        console.log("Capas cargadas:", layers);
    })
    .catch(error => console.error("Error obteniendo capas:", error));

/* 4. Agregar barra de Escala */
L.control.scale().addTo(map);

    