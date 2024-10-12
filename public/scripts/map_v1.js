var map = L.map('map', {
    center: [6.2607491,-75.5743929],
    zoom: 13
});


var darkmap = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
}).addTo(map);

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});

var sitios_turisticos
// Cargar el archivo GeoJSON
fetch('./data/sitios_turisticos.geojson')
    .then(response => response.json())
    .then(data => {
        // Añadir el GeoJSON al mapa con estilos y eventos
        sitios_turisticos = L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                // Crear un marcador con el ícono personalizado
                return L.marker(latlng, { icon: customIconSitios });
            },
            style: style_sitios_turisticos,
            onEachFeature: function (feature, layer) {
                // Añadir popups para los sitios turísticos
                if (feature.properties && feature.properties.nombresiti) {
                    layer.bindPopup("Sitio turístico: " + feature.properties.nombresiti);
            }}
        }).addTo(map);
        layerControl.addOverlay(sitios_turisticos, 'Sitios turísticos');
    })
    .catch(err => console.error('Error cargando el archivo GeoJSON: ', err));

// Definir la función de estilo para los sitios turísticos
style_sitios_turisticos = {
    color: 'blue',
    weight: 5,
    fillColor: 'blue',
    fillOpacity: 0.5,
    shadowSize: 10
} 

var customIconSitios = L.icon({
    iconUrl: './icons/sitios_t.svg',  // Ruta a la imagen del icono
    iconSize: [32, 32],               // Tamaño del ícono (ancho, alto)
    iconAnchor: [16, 32],             // Punto de anclaje del ícono (coordenadas en la imagen)
    popupAnchor: [0, -32],             // Punto de anclaje del popup relativo al ícono
});


var camaras
fetch('./data/camaras_wgs84.geojson')
    .then(response => response.json())
    .then(data => {
        camaras = L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                // Crear un marcador con el ícono personalizado
                return L.marker(latlng, { icon: customIconsCamaras });
            },

            onEachFeature: function (feature, layer) {
                // Añadir popups para las camaras
                if (feature.properties && feature.properties.localizaci) {
                    layer.bindPopup("Localización: " + feature.properties.localizaci);
            }}
        }).addTo(map);
        layerControl.addOverlay(camaras, 'Camaras');
    })
    .catch(err => console.error('Error cargando el archivo GeoJSON: ', err));



var customIconsCamaras = L.icon({
    iconUrl:'./icons/camara.svg',
    iconSize: [32,32],
    iconAnchor: [16, 32],
    popupAnchor: [0,-32]
})

var barrios
// Cargar el archivo GeoJSON
fetch('./data/barrios_veredas.geojson')
    .then(response => response.json())
    .then(data => {
        // Añadir el GeoJSON al mapa con estilos y eventos
        barrios = L.geoJSON(data, {
            style: style_barrios,
            onEachFeature: function (feature, layer) {
                // Añadir popups para los barrios
                if (feature.properties && feature.properties.nombre) {
                    layer.bindPopup("Barrio: " + feature.properties.nombre);
            }}
        }).addTo(map);
        layerControl.addOverlay(barrios, 'Barrios');
    })
    .catch(err => console.error('Error cargando el archivo GeoJSON: ', err));

// Definir la función de estilo para los barrios
function style_barrios(feature) {
    // Asignar colores o estilos dependiendo de la propiedad del barrio, por ejemplo 'nombre_barrio'
    return {
        fillColor: getColor(feature.properties.limitecomu),
        weight: 2, 
        opacity: 1, 
        color: 'black', 
        fillOpacity: 0.7
    };
}

// Función para asignar color según el nombre del barrio u otra propiedad
function getColor(limitecomu) {
    switch (limitecomu) {
        case '01': return '#ff0000';
        case '02': return '#00ff00';
        case '03': return '#0000ff';
        case '04': return '#8aff33';
        case '05': return '#33a2ff';
        case '06': return '#ff33d4';
        case '07': return '#33ffff';
        case '08': return '#fff933';
        case '09': return '#ff8a33';
        case '10': return '#f0ff33';
        case '11': return '#ffe033';
        case '12': return '#ff3361';
        case '13': return '#c133ff';
        case '14': return '#3339ff';
        case '15': return '#68ff33';
        case '16': return '#c7ff33';
        default: return '#808080'; // Gris para barrios no especificados
    }
}

var vias
// Cargar el archivo GeoJSON
fetch('./data/vias.geojson')
    .then(response => response.json())
    .then(data => {
        // Añadir el GeoJSON al mapa con estilos y eventos
        vias = L.geoJSON(data, {
            style: style_vias
        }).addTo(map);
        layerControl.addOverlay(vias, 'Vias');
    })

style_vias = {
    color:'red',
    weight: 1,
    dash: [10, 10]
}

//Resaltar barrio revisar
var highlightLayer;
function highlightFeature(e) {
    highlightLayer = e.target;
    if (e.target.feature.geometry.type === 'LineString' || e.target.feature.geometry.type === 'MultiLineString') {
    highlightLayer.setStyle({
        color: '#ffff00',
    });
    } else {
        highlightLayer.setStyle({
                fillColor: '#ffff00',
                fillOpacity: 1
            });
            }
        }

//Selector de capas y mapa base
var baseMaps = {
    "OpenStreetMap": osm,
    "DarkMap": darkmap
};


var overley = {}

var layerControl = L.control.layers(baseMaps, overley).addTo(map);
