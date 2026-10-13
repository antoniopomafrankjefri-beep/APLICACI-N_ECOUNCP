# EcoUNCP — Segregación y Puntos de Acopio (PWA)

Aplicación web progresiva (PWA) offline-first para estudiantes de la **Universidad Nacional del Centro del Perú (UNCP)** en Huancayo. Facilita la clasificación de residuos sólidos según la norma técnica peruana **NTP 900.058:2019** y ayuda a ubicar rápidamente el punto de acopio más cercano dentro del campus universitario.

---

## 1. Arquitectura y Justificación Tecnológica

### Stack Tecnológico
- **React 19 + TypeScript + Vite**: 
  - *¿Por qué React frente a Vanilla?* La reactividad del cálculo de distancias (Haversine en tiempo real según el GPS), la alternancia fluida entre modo online/offline, el filtrado instantáneo con tolerancia a sinónimos y la sincronización con el ciclo de vida del mapa de Leaflet se gestionan de manera limpia, declarativa y tipada, evitando fugas de memoria y manipulación frágil del DOM.
- **Tailwind CSS v4**: Interfaz accesible (WCAG AA), alto contraste, apta para daltonismo (doble codificación visual: color + icono + texto explicativo).
- **Leaflet + OpenStreetMap**: Motor de mapa ligero sin costos de API por uso, con límites acotados al campus de la UNCP.
- **vite-plugin-pwa (Workbox)**: Cacheo automático de app shell, fuentes, datos JSON y teselas de OpenStreetMap para navegación sin internet.
- **Zero Backend / Serverless**: 100% estático; privacidad total (la ubicación GPS nunca abandona el dispositivo del usuario).

---

## 2. Estructura del Proyecto

```
/
├── index.html                           # Entrada HTML con metadatos PWA y Leaflet
├── metadata.json                        # Identidad del applet y permisos
├── template_levantamiento_uncp.csv      # Plantilla CSV para brigadas de campo
├── public/                              # Iconos y manifiesto PWA
│   ├── icon.svg
│   ├── apple-touch-icon.png
│   ├── pwa-192x192.png
│   └── pwa-512x512.png
└── src/
    ├── types/
    │   └── index.ts                     # Modelos TypeScript (WasteItem, Category, DisposalPoint)
    ├── data/                            # 📁 Base de datos JSON (editable sin tocar código)
    │   ├── categories.json              # NTP 900.058:2019 (colores y normas)
    │   ├── items.json                   # ~40 residuos comunes y casos ambiguos
    │   ├── points.json                  # P01..P08 puntos georreferenciados del campus
    │   └── translations.json            # Textos en es-PE (por defecto), pt-BR y en-US
    ├── hooks/
    │   ├── useGeolocation.ts            # GPS del dispositivo + puntos de referencia del campus
    │   ├── useOnlineStatus.ts           # Detección en tiempo real de conexión
    │   ├── usePWAInstall.ts             # Instalador PWA (Chromium y guía iOS)
    │   └── useI18n.ts                   # Hook de internacionalización con persistencia local
    ├── utils/
    │   ├── distance.ts                  # Fórmula de Haversine (metros y km)
    │   ├── search.ts                    # Búsqueda tolerante a tildes y sinónimos
    │   └── campus.ts                    # Coordenadas y límites del campus UNCP
    ├── components/
    │   ├── Header.tsx                   # Barra superior con estado online e instalación
    │   ├── OfflineIndicator.tsx         # Aviso visual permanente al perder conexión
    │   ├── PWAInstallButton.tsx         # Botón de instalación PWA
    │   ├── Classifier/
    │   │   ├── WasteClassifier.tsx      # Buscador con autocompletar y filtros
    │   │   ├── WasteCard.tsx            # Ficha del residuo (color, por qué y tip)
    │   │   └── CategoryPill.tsx         # Badge de contenedor accesible (WCAG AA)
    │   ├── Map/
    │   │   ├── CampusMap.tsx            # Mapa Leaflet interactivo con P01..P08
    │   │   ├── PointDetailModal.tsx     # Ficha completa del punto de acopio
    │   │   └── OfflineMapFallback.tsx   # Croquis vectorial esquemático offline
    │   ├── Recommendation/
    │   │   └── NearestPointBanner.tsx   # Destacado del punto más cercano al estudiante
    │   ├── Education/
    │   │   ├── EducationGuide.tsx       # Guía de código de colores
    │   │   └── WasteQuiz.tsx            # Test interactivo de 5 preguntas
    │   ├── FieldSurvey/
    │   │   └── SurveyExportModal.tsx    # Guía de campo y descarga de CSV
    │   └── Navigation/
    │       └── BottomNav.tsx            # Barra inferior móvil con 4 secciones
    ├── App.tsx                          # Coordinador principal
    └── index.css                        # Estilos globales y pulso de marcador
```

---

## 3. Modelo de Datos JSON (Sin tocar código)

Todos los datos se encuentran en `src/data/`:

### A. `categories.json`
Define los contenedores según la norma peruana **NTP 900.058:2019**:
- Blanco: Plásticos (PET, PEAD)
- Azul: Papel y cartón
- Negro: No aprovechables
- Verde: Vidrio
- Amarillo: Metales
- Marrón: Orgánicos
- Rojo: Peligrosos (pilas, solventes, biocontaminados)

*Nota:* Marcados con estado `"pending_confirmation"` para validación final con las autoridades de la UNCP.

### B. `items.json`
Catálogo de ~40 residuos con:
- `name`: Nombre en varios idiomas.
- `synonyms`: Términos coloquiales (ej. *hoja bond*, *separata*, *lata de monster*, *pucho*, *chicle*).
- `categoryId`: Identificador del contenedor.
- `explanation`: ¿Por qué va en este contenedor?
- `observation`: Consejo práctico (ej. *vaciar líquido antes*, *retirar grasa*).

### C. `points.json`
**Regla central:** 1 Marcador = 1 Punto de Acopio (estación con uno o más recipientes).
- `id`: Código identificador (`P01`, `P02`...).
- `name`: Nombre de la estación.
- `referenceBuilding`: Edificio o facultad de referencia.
- `lat` / `lng`: Coordenadas WGS84.
- `bins`: Arreglo de recipientes presentes: `[{ "categoryId": "plastico", "quantity": 2 }]`.
- `conservationState`: `"bueno" | "regular" | "malo"`.
- `accessibility`: `"rampa" | "nivel" | "escalones"`.
- `observations`: Notas operativas de mantenimiento.

---

## 4. Guía de Levantamiento de Campo (Sustituir datos DEMO)

Para reemplazar los datos de demostración con la información real del campus:

1. **Descarga o copia la plantilla:**
   Usa el archivo `template_levantamiento_uncp.csv` incluido en la raíz del proyecto o desde la pestaña **Campo / Datos** en la aplicación.
2. **Campos requeridos en el levantamiento:**
   - `codigo`: P01, P02, P03...
   - `nombre_lugar`: Nombre descriptivo de la estación.
   - `referencia_edificio`: Ej. "Frente a Biblioteca Central".
   - `latitud` / `longitud`: Coordenadas tomadas in situ con GPS.
   - `foto_url`: Enlace a fotografía del módulo.
   - `estado_conservacion`: `bueno`, `regular` o `malo`.
   - `accesibilidad`: `rampa`, `nivel` o `escalones`.
   - `recipientes_detalle`: Ej. `plastico:2;papel_carton:2;no_aprovechable:2`.
   - `observaciones`: Iluminación, techo, capacidad.
3. **Actualización de la base de datos:**
   Abre `src/data/points.json` y sustituye los registros existentes por los datos obtenidos del levantamiento.

---

## 5. Instalación y Ejecución Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción (Build)
npm run build

# 4. Vista previa de la compilación de producción
npm run preview
```

---

## 6. Comportamiento Offline y PWA

- **Service Worker**: Cachea la aplicación completa y los archivos JSON en la primera visita.
- **Mapa en modo Offline**:
  - Las teselas visitadas de OpenStreetMap se guardan en caché local (`osm-tiles-cache`).
  - La aplicación incluye un **Croquis Esquemático Vectorial (SVG)** interactivo del campus de la UNCP que funciona con 0% de internet.
  - La geolocalización GPS del teléfono móvil funciona mediante satélite sin necesidad de datos móviles o señal celular.
- **Navegación Externa**: El botón de ruta en Google Maps se deshabilita automáticamente cuando no hay conexión, mostrando un aviso amigable.

---

## 7. Fases Futuras (Fase 2 y 3)

- **Fase 2**: Ampliación del módulo educativo, guardado anónimo de evaluaciones pre/post test para investigación universitaria y desafíos de aula.
- **Fase 3**: Empaquetado nativo para Google Play Store mediante **Capacitor** o **Trusted Web Activity (TWA)**.
