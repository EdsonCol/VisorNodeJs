// Inicializar el mapa
var map = L.map('map').setView([6.268658, -75.565801], 13);

// Mapas base
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var darkmap = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
}).addTo(map);

var baseMaps = {
    "OpenStreetMap": osm,
    "Esri World Imagery": Esri_WorldImagery,
    "DarkMap": darkmap
};


// Control de capas para los overlays
var overlayMaps = {};

// Agregar control de capas al mapa
var layerControl = L.control.layers(baseMaps, overlayMaps, darkmap).addTo(map);

var marker = L.marker([6.268658, -75.565801]).addTo(map);
marker.bindPopup("<b>ESTO ES UN POPUP</b><br>ESTO ES MEDELLIN")

var circle = L.circle([6.268658, -75.565801], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

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
        fillOpacity: 0.3
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



// Función para cargar tablas con geometría y agregarlas al control de capas
fetch('/tablasgeo')
    .then(response => response.json())
    .then(tablas => {
    console.log('Tablas con geometría:', tablas); // Verifica la estructura de los datos

    tablas.forEach(tabla => {
        var nombreTabla = tabla.table_name;

      // Crear una capa vacía para esta tabla y añadirla al control de capas
        var layer = L.layerGroup();
        console.log('Añadiendo capa:', nombreTabla); // Verifica que se están añadiendo las capas
        layerControl.addOverlay(layer, nombreTabla); // Añadir al control de capas

      // Escuchar cuando el usuario activa la capa en el control
        map.on('overlayadd', function(event) {
        if (event.name === nombreTabla) {
          console.log('Cargando datos para la tabla:', nombreTabla); // Verifica que la tabla esté siendo seleccionada

          // Cargar los datos de la tabla y mostrarlos en el mapa
            fetch(`/tablas/${nombreTabla}`)
            .then(response => response.json())
            .then(data => {
              console.log('Datos GeoJSON para', nombreTabla, data); // Verifica los datos recibidos
              var geoLayer = L.geoJSON(data, {
                onEachFeature: function (feature, layer) {
                  if (feature.properties) {
                    layer.bindPopup(JSON.stringify(feature.properties)); // Personaliza el popup si lo deseas
                  }
                }
              });
              layer.addLayer(geoLayer); // Añadir los datos a la capa
            })
            .catch(err => console.error('Error cargando los datos de la tabla:', err));
        }
      });

      // Escuchar cuando el usuario desactiva la capa en el control
      map.on('overlayremove', function(event) {
        if (event.name === nombreTabla) {
          layer.clearLayers();  // Limpia la capa cuando se desactiva
        }
      });
    });
  })
  .catch(err => console.error('Error obteniendo las tablas con geometría:', err));

