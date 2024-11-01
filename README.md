# Geovisor con Node.js y Leaflet

Este proyecto es un Geovisor interactivo desarrollado con **Node.js**, **Leaflet**, y **PostgreSQL**. Está diseñado para visualizar los elementos de los sistemas de transporte de Medellín, incluyendo estaciones de metro, metrocable, tranvía y paradas de buses.

## Características Principales

### Funcionalidades del Mapa

-   **Mapas Base**: Incluye tres capas de mapas base:

    -   **Open Street Map**
    -   **Esri World Imagery**
    -   **Dark Map**

-   **Botón de Inicio**: Ubicado en la parte inferior izquierda, permite restablecer la vista inicial del mapa centrada en Medellín con un nivel de zoom específico.

-   **Botones de Zoom**: Ubicado en la parte inferior izquierda, permite realizar zoom in y zoom out.

-   **Botón de Leyenda**: Ubicado en la parte inferior derecha, permite mostrar u ocultar la leyenda del mapa con un ícono de fácil acceso.

-   **Leyenda Interactiva**: Ofrece información sobre:
    -   Capas de barrios y comunas.
    -   Estaciones de metro, metrocable, y tranvía con íconos diferenciados por línea.
    -   Paradas de buses y rutas, con colores distintivos por tipo de sistema.

### Capas y Elementos Visuales

1. **Capas Base**: Cada mapa base se puede alternar a través del control de capas en la esquina superior derecha.
2. **Capas Base**:
    - **Comunas**: Presentadas con un borde negro sólido.
    - **Barrios**: Representados con un borde negro punteado.
3. **Estaciones de Transporte del Sistema Integrado**:
    - Visualizadas con íconos personalizados según la línea.
    - Colores y estilos específicos por cada línea del sistema integrado.
4. **Paradas de Buses**:
    - Agrupadas en clústeres para facilitar la visualización en zonas de alta densidad.
    - Íconos de parada con colores de fondo que representan diferentes sistemas de rutas.
5. **Rutas de Transporte**:
    - Las rutas se visualizan con líneas de colores que representan cada sistema de transporte.

### Popups Informativos

Cada elemento del mapa incluye un **popup informativo** que muestra información detallada:

-   **Estaciones de Transporte**: Incluyen el nombre, línea, y tipo de estación.
-   **Paradas de Buses**: Detallan el número de parada, sistema, dirección, recorrido, ruta y empresa.

## Créditos

# Mapas y datos provistos por:

-   OpenStreetMap
-   Esri
-   Stadia Maps

# Información de capas de datos abiertos GeoMedellín [GeoMedellín](https://www.medellin.gov.co/geomedellin)

-   Límite Catastral de Barrios y Veredas
-   Límite Catastral de Comunas y Corregimientos
-   Estaciones del Sistema de transporte masivo (MR)
-   Paradas de Transporte Público Colectivo
-   Rutas de Transporte Público

## Autores

-   **Edson Colmenares** - [GitHub](https://github.com/EdsonCol)
