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

L.control.zoom().setPosition('bottomright').addTo(map);

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

const colorSistemas = {
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
};

const colorLineas = {
  "Línea 1": "#007C88",
  "Línea 2": "#60A9AF",
  "Línea A": "#005496",
  "Línea B": "#F6821F",
  "Línea H": "#DC3591",
  "Línea J": "#FDB913",
  "Línea K": "#ACD258",
  "Línea L": "#98671B",
  "Línea M": "#6E2C8D",
  "Línea P": "#ED1A3B",
  "Línea T-A": "#1D9D48",
  "default": "gray",
};

const iconosLineas={
  "Línea 1": "icons/metroplus_linea1.svg",
  "Línea 2": "icons/metroplus_linea2.svg",
  "Línea A": "icons/metro_lineaA.svg",
  "Línea B": "icons/metro_lineaB.svg",
  "Línea H": "icons/metrocable_lineaH.svg",
  "Línea J": "icons/metrocable_lineaJ.svg",
  "Línea K": "icons/metrocable_lineaK.svg",
  "Línea L": "icons/metrocable_lineaL.svg",
  "Línea M": "icons/metrocable_lineaM.svg",
  "Línea P": "icons/metrocable_lineaP.svg",
  "Línea T-A": "icons/tranvia_lineaT.svg",
  "default": "icons/metroplus_linea1.svg",
}

// Función para definir el estilo de la capa Paradas
function estiloParadas(feature, latlng) {

  const sistema = feature.properties.sistema_ru;
  const color = colorSistemas[sistema] || colorSistemas["default"];

  // Crear el HTML personalizado del ícono con fondo circular
  const iconoHTML = `
      <div style="
          width: 24px;
          height: 24px;
          background-color: ${color};   
          border-radius: 50%;           
          display: flex;
          align-items: center;
          justify-content: center;
      ">
          <img src="icons/busStop.png" style="width: 12px; height: 12px;" />  <!-- Ícono PNG en el centro -->
      </div>`;

  // Crear el ícono personalizado con L.divIcon
  const iconoParadas = L.divIcon({
      html: iconoHTML,
      className: '',           
      iconSize: [24, 24],      
      iconAnchor: [12, 12]     
  });

  return L.marker(latlng, { icon: iconoParadas });
}

// Función para definir el estilo de la capa Rutas
function estiloRutas(feature) {
  // Obtener el valor de "sistema" desde las propiedades del feature
  const sistema = feature.properties.sistema;
  // Obtener el color correspondiente o usar el color por defecto
  const color = colorSistemas[sistema] || colorSistemas["default"];
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


// Función para definir el estilo del popup de "estaciones_tmasivo"
function popupEstaciones(feature, layer) {
  // Verificar si las propiedades existen antes de mostrarlas
  const nombre = feature.properties.nombre || "N/A";
  const linea = feature.properties.linea || "N/A";
  const tipoEst = feature.properties.tipo_est || "N/A";

  const colorFondo = colorLineas[linea] || colorLineas["default"];
    
  const rutaImagen = iconosLineas[linea] || iconosLineas["default"];

  // Crear el contenido del popup
  const popupContent = `
      <div class="card" style="width: 10rem; text-align: center; background-color: ${colorFondo};">
        <img src="${rutaImagen}" class="card-img-top" style="width: 50px; height: 50px; margin: auto;">
        <div class="card-header" style="color: white;">
          <strong>${linea}</strong>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">${nombre}</li>
          <li class="list-group-item">${tipoEst}</li>
        </ul>
      </div>
  `;

  // Asociar el contenido del popup al feature
  layer.bindPopup(popupContent);
}

function popupParadas(feature, layer) {
  const nro_parada = parseInt(feature.properties.nro_parada) || "N/A";
  const direccion = feature.properties.direccion || "N/A";
  const recorrido = feature.properties.recorrido || "N/A";
  const ruta = feature.properties.nombre_rut || "N/A";
  const sistema = feature.properties.sistema_ru || "N/A";
  const tipo_ruta = feature.properties.tipo_ruta || "N/A";
  const empresa = feature.properties.empresa || "N/A";

  const colorFondo = colorSistemas[sistema] || colorSistemas["default"];

  // Crear el contenido del popup
  const popupContent = `
      <div class="card" style="width: 12rem; text-align: center; background-color: ${colorFondo};">
        <img src="icons/busStop.png" class="card-img-top" style="width: 50px; height: 50px; margin: auto; margin-top: 10px;">  
        <div class="card-header" style="color: white;">
            <strong>${direccion}</strong>
          </div>
          <table class="table table-striped">
            <tbody>
              <tr>
                <td style="vertical-align:middle"><strong>Número parada</strong></td>
                <td style="vertical-align:middle">${nro_parada}</td>
              </tr>
              <tr>
                <td style="vertical-align:middle"><strong>Sistema</strong></td>
                <td style="vertical-align:middle">${sistema}</td>
              </tr>
              <tr>
                <td style="vertical-align:middle"><strong>Recorrido</strong></td>
                <td style="vertical-align:middle">${recorrido}</td>
              </tr>
              <tr>
                <td style="vertical-align:middle"><strong>Ruta</strong></td>
                <td style="vertical-align:middle">${ruta}</td>
              </tr>
              <tr>
                <td style="vertical-align:middle"><strong>Tipo de Ruta</strong></td>
                <td style="vertical-align:middle">${tipo_ruta}</td>
              </tr>
              <tr>
                <td style="vertical-align:middle"><strong>Empresa</strong></td>
                <td style="vertical-align:middle">${empresa}</td>
              </tr>
            </tbody>
          </table>
      </div>
  `;
    // Asociar el contenido del popup al feature
    layer.bindPopup(popupContent);
}


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
                          pointToLayer: estiloEstaciones,
                          onEachFeature: popupEstaciones
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
                } else if (nombreTabla == "paradas_wgs84") {
                  // Configurar capa de clusters para "paradas_wgs84"
                  map.on('overlayadd', event => {
                      if (event.name === nombreTabla) {
                          const clusterGroup = L.markerClusterGroup();
  
                          fetch(`/tablas/${nombreTabla}`)
                              .then(response => response.json())
                              .then(data => {
                                  const geoLayer = L.geoJSON(data, {
                                      pointToLayer: (feature, latlng) => estiloParadas(feature,latlng),
                                      onEachFeature: popupParadas
                                  });
  
                                  // Añadir todos los puntos del geoLayer al grupo de clusters
                                  clusterGroup.addLayer(geoLayer);
  
                                  // Agregar el grupo de clusters al mapa
                                  map.addLayer(clusterGroup);
  
                                  // Guardar el grupo de clusters en "layer" para limpiar al desactivar
                                  layer.addLayer(clusterGroup);
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

