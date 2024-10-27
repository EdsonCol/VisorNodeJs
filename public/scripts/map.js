// Inicializar el mapa
var map = L.map('map').setView([6.268658, -75.565801], 13);

// Mapas base
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
})

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).addTo(map);

var darkmap = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
})

var baseMaps = {
    "Open Street Map": osm,
    "Esri World Imagery": Esri_WorldImagery,
    "Dark Map": darkmap
};


// Control de capas para los overlays
var overlayMaps = {};

// Agregar control de capas al mapa
var layerControl = L.control.layers(baseMaps, overlayMaps, darkmap).addTo(map);



// Función para definir el estilo de la capa de Comunas
function estiloComunas() {
  return {
      color: "black",       
      weight: 2,            
      fillColor: "none",    
      fillOpacity: 0       
  };
}

// Función para definir el estilo de la capa Barrios
function estiloBarrios() {
  return {
      color: "black",       
      weight: 1,            
      dashArray: "2, 2",
      fillColor: "none",    
      fillOpacity: 0       
  };
}



// Función para definir el estilo de la capa Estaciones
function estiloEstaciones(feature, latlng) {
  const iconosEstaciones = {
    "Línea 1": { url: "icons/metroplus_linea1.svg", size: [16, 16] },
    "Línea 2": { url: "icons/metroplus_linea2.svg", size: [16, 16] },
    "Línea A": { url: "icons/metro_lineaA.svg", size: [20, 20] },
    "Línea B": { url: "icons/metro_lineaB.svg", size: [20, 20] },
    "Línea H": { url: "icons/metrocable_lineaH.svg", size: [18, 18] },
    "Línea J": { url: "icons/metrocable_lineaJ.svg", size: [18, 18] },
    "Línea K": { url: "icons/metrocable_lineaK.svg", size: [18, 18] },
    "Línea L": { url: "icons/metrocable_lineaL.svg", size: [18, 18] },
    "Línea M": { url: "icons/metrocable_lineaM.svg", size: [18, 18] },
    "Línea P": { url: "icons/metrocable_lineaP.svg", size: [18, 18] },
    "Línea T-A": { url: "icons/tranvia_lineaT.svg", size: [20, 20] }
  }
  const linea = feature.properties.linea;
  const iconConfig = iconosEstaciones[linea]

  const icono = L.icon({
    iconUrl: iconConfig.url,
    iconSize: iconConfig.size,      // Tamaño del ícono
    iconAnchor: [iconConfig.size[0] / 2, iconConfig.size[1] / 2] // Centro del ícono
  });

  return L.marker(latlng, { icon: icono });
}

// Función para definir el estilo de la capa Paradas
function estiloParadas(latlng) {
  const iconoParadas = L.icon({
    iconUrl: "icons/busStop.png",
    iconSize: [6, 6],
    iconAnchor: [4, 4]
  });
  return L.marker(latlng, { icon: iconoParadas });
}

// Función para definir el estilo de la capa Rutas
function estiloRutas(feature) {
  const colorRutas = {
    "2A": "#3A91FA",
    "2B": "#10F90A",
    "3A": "#FE360A",
    "5A": "#E1E1E1",
    "6A": "#FB0BAC",
    "6B": "#0018F3",
    "6C": "#FED317",
    "6D": "#26EEEC",
    "6E": "#FAB3BC",
    "6F": "#E61100",
    "6G": "#52D962",
    "6H": "#B885E7",
    "8A": "#7B1EBB",
    "Circular 286": "#DC6505",
    "Circular 304, 305, 308, 308D, 309, 309D": "#ED96F8",
    "Circular 313": "#E40CFB",
    "Circular 315 Y 316": "#E40CFB",
    "Circular Coonatra 300, 301, 310, 311": "#C7D246",
    "Circular Derecha 303": "#36E700",
    "Circular Izquierda 302": "#0E9471",
    "default": "gray",
  }
  // Obtener el valor de "sistema" desde las propiedades del feature
  const sistema = feature.properties.sistema;
  // Obtener el color correspondiente o usar el color por defecto
  const color = colorRutas[sistema] || colorRutas["default"];
  return {
      color: color,
      weight: 0.5,            
      dashArray: "10, 5",
      opacity: 0.5
  };
}

// Mapeo de nombres de capa a sus funciones de estilo
const estilosCapas = {
  "comunas": estiloComunas,
  "barrios": estiloBarrios,
  "estaciones_tmasivo": estiloEstaciones,
  "paradas_wgs84": estiloParadas,
  "rutas_transporte": estiloRutas
};

// Función para cargar todas las tablas con geometría y añadirlas al mapa
fetch('/tablasgeo')
    .then(response => response.json())
    .then(tablas => {
        tablas.forEach(tabla => {
            const nombreTabla = tabla.table_name;
            const capaConfig = estilosCapas[nombreTabla];

            if (!capaConfig) return; // Salta las tablas sin configuración específica

            const layer = L.layerGroup();
            layerControl.addOverlay(layer, nombreTabla);
            
            if (nombreTabla == "comunas") {
                fetch(`/tablas/${nombreTabla}`)
                    .then(response => response.json())
                    .then(data => {
                        const geoLayer = L.geoJSON(data, {
                            style: estiloComunas,         
                        });
                        layer.addLayer(geoLayer);
                        layer.addTo(map); // Añadir la capa directamente al mapa
                    })
                    .catch(err => console.error(`Error cargando datos para ${nombreTabla}:`, err));
                  } else if(nombreTabla == "barrios") {
                    fetch(`/tablas/${nombreTabla}`)
                    .then(response => response.json())
                    .then(data => {
                        const geoLayer = L.geoJSON(data, {
                            style: estiloBarrios,         
                        });
                        layer.addLayer(geoLayer);
                        layer.addTo(map); // Añadir la capa directamente al mapa
                    })
                    .catch(err => console.error(`Error cargando datos para ${nombreTabla}:`, err));
                  } else if(nombreTabla == "estaciones_tmasivo") {
                    fetch(`/tablas/${nombreTabla}`)
                    .then(response => response.json())
                    .then(data => {
                        const geoLayer = L.geoJSON(data, {
                          pointToLayer: estiloEstaciones          
                        });
                        layer.addLayer(geoLayer);
                        layer.addTo(map); // Añadir la capa directamente al mapa
                    })
                    .catch(err => console.error(`Error cargando datos para ${nombreTabla}:`, err));
                  } else if(nombreTabla == "barrios") {
                    fetch(`/tablas/${nombreTabla}`)
                    .then(response => response.json())
                    .then(data => {
                        const geoLayer = L.geoJSON(data, {
                            style: estiloBarrios,         
                        });
                        layer.addLayer(geoLayer);
                        layer.addTo(map); // Añadir la capa directamente al mapa
                    })
                    .catch(err => console.error(`Error cargando datos para ${nombreTabla}:`, err));
                  } else if(nombreTabla == "rutas_transporte") {
                    map.on('overlayadd', event => {
                      if (event.name === nombreTabla) {
                          fetch(`/tablas/${nombreTabla}`)
                              .then(response => response.json())
                              .then(data => {
                                  const geoLayer = L.geoJSON(data, {
                                      style: estiloRutas
                                  });
                                  layer.addLayer(geoLayer);
                              })
                              .catch(err => console.error(`Error cargando datos para ${nombreTabla}:`, err));
                      }
                  });
                  } else if(nombreTabla == "paradas_wgs84") {
                // Para "paradas_wgs84", solo se carga cuando se activa en el control de capas
                map.on('overlayadd', event => {
                    if (event.name === nombreTabla) {
                        fetch(`/tablas/${nombreTabla}`)
                            .then(response => response.json())
                            .then(data => {
                                const geoLayer = L.geoJSON(data, {
                                  pointToLayer: (feature, latlng) => estiloParadas(latlng)
                                });
                                layer.addLayer(geoLayer);
                            })
                            .catch(err => console.error(`Error cargando datos para ${nombreTabla}:`, err));
                    }
                });
            }

            // Evento para limpiar la capa cuando se desactiva
            map.on('overlayremove', event => {
                if (event.name === nombreTabla) {
                    layer.clearLayers();
                }
            });
        });
    })
    .catch(err => console.error('Error obteniendo las tablas con geometría:', err));

