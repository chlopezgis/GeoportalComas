/* 1. Inicializar mapa */
var map = L.map('map').setView([-11.928499721110041, -77.05091118363637], 13);

/* 2. Agregar mapas base */
const OSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    zIndex: 1
}).addTo(map);

const positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '©OpenStreetMap, ©CartoDB',
    zIndex: 1
});

// Contenedor para las capas base
const mapBase = {
    'OSM': OSM,
    'Carto Positron': positron
};

// Control para capas base
var control = L.control.layers(mapBase).addTo(map);

/* 3. Agregar botón y panel dentro del #sidebar */
const sidebar = document.getElementById("sidebar");

const layerButton = document.createElement("button");
layerButton.textContent = "C";
layerButton.id = "layerButton"; // Agregar ID para CSS
sidebar.appendChild(layerButton);

const layersPanel = document.createElement("div");
layersPanel.id = "layersPanel"; // Agregar ID para CSS
layersPanel.style.display = "none";
sidebar.appendChild(layersPanel);

layerButton.addEventListener("click", () => {
    if (layersPanel.style.display === "none") {
        layersPanel.style.display = "block";
        sidebar.style.width = "300px"; // Expande el sidebar
    } else {
        layersPanel.style.display = "none";
        sidebar.style.width = "50px"; // Reduce el sidebar
    }
});

/* 4. Cargar capas WMS dinámicamente */
const geoserverUrl = "http://localhost:8080/geoserver/Comas/wms?service=WMS&version=1.3.0&request=GetCapabilities";
const activeLayers = {};

fetch(geoserverUrl)
    .then(response => response.text())
    .then(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "application/xml");
        const layers = Array.from(xml.querySelectorAll("Layer > Name")).map(layer => layer.textContent);

        layers.forEach(layerName => {
            const listItem = document.createElement("div");
            listItem.classList.add("layer-item");

            const label = document.createElement("span");
            label.textContent = layerName;

            const toggleSwitch = document.createElement("input");
            toggleSwitch.type = "checkbox";

            toggleSwitch.onchange = () => {
                if (toggleSwitch.checked) {
                    activeLayers[layerName] = L.tileLayer.wms("http://localhost:8080/geoserver/Comas/wms", {
                        layers: layerName,
                        maxZoom: 19,
                        format: "image/png",
                        transparent: true,
                        zIndex: 2
                    });
                    activeLayers[layerName].addTo(map);

                    // Ajustar el tamaño del sidebar cuando una capa es activada
                    adjustSidebarSize();
                } else {
                    map.removeLayer(activeLayers[layerName]);
                    delete activeLayers[layerName];

                    // Ajustar el tamaño del sidebar cuando una capa es desactivada
                    adjustSidebarSize();
                }
            };

            listItem.appendChild(toggleSwitch);
            listItem.appendChild(label);
            layersPanel.appendChild(listItem);
        });
    })
    .catch(error => console.error("Error obteniendo capas:", error));

/* 5. Agregar barra de escala */
L.control.scale().addTo(map);

// Ajustar el tamaño del sidebar dependiendo de las capas activadas
function adjustSidebarSize() {
    const activeItemsCount = Object.keys(activeLayers).length;
    if (activeItemsCount > 0) {
        sidebar.style.width = `${200 + activeItemsCount * 30}px`; // Ajusta el tamaño del sidebar según las capas activas
    } else {
        sidebar.style.width = "200px"; // Tamaño base
    }
}