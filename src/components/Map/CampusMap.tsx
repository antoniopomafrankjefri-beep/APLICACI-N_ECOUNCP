import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} from 'react';
import L from 'leaflet';
import { DisposalPoint, Category, UserCoords, Language } from '../../types';
import { UNCP_CAMPUS_CENTER, UNCP_CAMPUS_BOUNDS } from '../../utils/campus';
import { PointDetailModal } from './PointDetailModal';
import { OfflineMapFallback } from './OfflineMapFallback';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useI18n } from '../../hooks/useI18n';
import { MapPin, Navigation2, Compass, Layers, AlertCircle, Leaf, Sparkles, Map, Locate, Eye, X } from 'lucide-react';
import { motion } from 'motion/react';

interface CampusMapProps {
  points: DisposalPoint[];
  categories: Category[];
  selectedCategoryId: string | null;
  nearestPointId: string | null;
  userCoords: UserCoords | null;
  language: Language;
  onSelectCategoryFilter: (catId: string | null) => void;
}

// Category color mapping for markers (using NTP 900.058:2019 official colors)
const CATEGORY_ACCENT_COLORS: Record<string, string> = {
  plastico: '#94A3B8',       // Blanco (slate-400 for visibility on map)
  papel_carton: '#2563EB',   // Azul
  no_aprovechable: '#171717', // Negro
  vidrio: '#16A34A',         // Verde
  metal: '#FACC15',          // Amarillo
  organico: '#78350F',       // Marrón
  peligroso: '#DC2626',      // Rojo
};

export { CATEGORY_ACCENT_COLORS };

export const CampusMap: React.FC<CampusMapProps> = ({
  points,
  categories,
  selectedCategoryId,
  nearestPointId,
  userCoords,
  language,
  onSelectCategoryFilter,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [activePoint, setActivePoint] = useState<DisposalPoint | null>(null);
  const [mapMode, setMapMode] = useState<'osm' | 'schematic'>('osm');
  const [showLegend, setShowLegend] = useState(false);
  const isOnline = useOnlineStatus();
  const { t } = useI18n();

  // If completely offline and tile loading fails, fallback automatically
  const [tileErrorCount, setTileErrorCount] = useState(0);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapMode !== 'osm') return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [UNCP_CAMPUS_CENTER.lat, UNCP_CAMPUS_CENTER.lng],
        zoom: UNCP_CAMPUS_CENTER.zoom,
        minZoom: UNCP_CAMPUS_CENTER.minZoom,
        maxZoom: UNCP_CAMPUS_CENTER.maxZoom,
        maxBounds: UNCP_CAMPUS_BOUNDS,
        maxBoundsViscosity: 0.8,
        zoomControl: false, // Custom controls
      });

      // OpenStreetMap standard tiles
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | UNCP',
        maxZoom: 19,
      });

      tileLayer.on('tileerror', () => {
        setTileErrorCount((prev) => prev + 1);
      });

      tileLayer.addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Custom zoom control
      L.control.zoom({ position: 'bottomright' }).addTo(map);
    }

    return () => {
      // Keep instance alive during state changes to avoid unnecessary re-creation
    };
  }, [mapMode]);

  // Update Points Markers on the Leaflet Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup || mapMode !== 'osm') return;

    markersGroup.clearLayers();

    points.forEach((point) => {
      const hasRequiredBin =
        !selectedCategoryId || point.bins.some((b) => b.categoryId === selectedCategoryId);

      // If category filter is active and this point doesn't have it, don't show
      if (selectedCategoryId && !hasRequiredBin) {
        return;
      }

      const isNearest = point.id === nearestPointId;

      // Get dominant category color for marker accent
      const primaryBin = point.bins[0];
      const accentColor = primaryBin ? CATEGORY_ACCENT_COLORS[primaryBin.categoryId] || '#556B2F' : '#556B2F';

      // Custom HTML Marker Icon with VIVID category color identity - STATIC FIXED POSITION
      const markerHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; will-change: auto;">
          ${
            isNearest
              ? `<div style="position: absolute; top: -18px; left: 50%; transform: translateX(-50%); background: #F59E0B; color: #451a03; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 9999px; box-shadow: 0 2px 8px rgba(0,0,0,0.25); white-space: nowrap; border: 2px solid #FBBF24;">★ ${t('nearest_point_badge')}</div>`
              : ''
          }
          <div style="
            width: ${isNearest ? '42px' : '36px'};
            height: ${isNearest ? '42px' : '36px'};
            background-color: #FFFFFF;
            border: 3px solid ${accentColor};
            border-radius: 9999px;
            box-shadow: 0 4px 14px rgba(0,0,0,0.2), 0 0 0 2px ${accentColor};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isNearest ? '20px' : '17px'};
            transition: none;
          ">
            🗑️
          </div>
          <div style="
            background: ${accentColor};
            color: #FFFFFF;
            font-size: 10px;
            font-weight: 800;
            padding: 2px 8px;
            border-radius: 4px;
            margin-top: 2px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            border: 1px solid rgba(255,255,255,0.4);
            white-space: nowrap;
          ">
            ${point.code}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-point-marker',
        html: markerHtml,
        iconSize: [44, 54],
        iconAnchor: [22, 27],
      });

      const marker = L.marker([point.lat, point.lng], { icon: customIcon });

      marker.on('click', () => {
        setActivePoint(point);
      });

      marker.addTo(markersGroup);
    });
  }, [points, selectedCategoryId, nearestPointId, mapMode, t]);

  // Update User Location Marker on the Leaflet Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || mapMode !== 'osm') return;

    if (userCoords) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userCoords.lat, userCoords.lng]);
      } else {
        const userIcon = L.divIcon({
          className: 'user-marker-container',
          html: `<div class="user-location-pulse" title="${t('your_location')}"></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([userCoords.lat, userCoords.lng], {
          icon: userIcon,
          zIndexOffset: 1000,
        }).addTo(map);

        userMarkerRef.current = marker;
      }
    } else if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
  }, [userCoords, mapMode, t]);

  // Recenter map on user location
  const handleRecenter = useCallback(() => {
    if (mapInstanceRef.current && userCoords) {
      mapInstanceRef.current.flyTo([userCoords.lat, userCoords.lng], 18, { duration: 0.8 });
    }
  }, [userCoords]);

  // Switch to campus center
  const handleCenterCampus = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([UNCP_CAMPUS_CENTER.lat, UNCP_CAMPUS_CENTER.lng], 17, { duration: 0.8 });
    }
  }, []);

  const activePointsCount = useMemo(() => {
    if (!selectedCategoryId) return points.length;
    return points.filter((p) => p.bins.some((b) => b.categoryId === selectedCategoryId)).length;
  }, [points, selectedCategoryId]);

  // Legend data
  const legendItems = useMemo(() => {
    return categories.map(cat => ({
      id: cat.id,
      name: cat.name[language] || cat.name.es,
      color: CATEGORY_ACCENT_COLORS[cat.id] || '#556B2F',
      label: cat.containerColorName[language] || cat.containerColorName.es,
    }));
  }, [categories, language]);

  return (
    <div className="space-y-3">
      {/* Map Header with Legend Toggle - UNCP Institutional Design */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#084C2E] via-[#0B5D3B] to-[#084C2E] p-4 rounded-2xl border border-[#B8860B]/40 shadow-lg relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#D4A017]/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[#D4A017]/5 blur-3xl" />
        </div>

        <div className="relative flex items-center gap-2 text-xs font-semibold text-white">
          <span className="p-1.5 rounded-lg bg-white/10 text-white border border-[#B8860B]/30">
            <Compass className="w-3.5 h-3.5" />
          </span>
          <span>{t('rule_single_marker')}</span>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {/* Legend Toggle */}
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold hover:bg-white/20 transition shadow-xs backdrop-blur-sm"
          >
            <Eye className="w-3.5 h-3.5 text-[#D4A017]" />
            <span>{showLegend ? t('hide_legend') : t('show_legend')}</span>
          </button>

          {/* View mode toggle button */}
          <button
            onClick={() => setMapMode(mapMode === 'osm' ? 'schematic' : 'osm')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold hover:bg-white/20 transition shadow-xs backdrop-blur-sm"
          >
            <Layers className="w-3.5 h-3.5 text-[#D4A017]" />
            <span>{mapMode === 'osm' ? t('view_schematic') : t('view_satellite')}</span>
          </button>
        </div>
      </div>

      {/* Rule Badge - UNCP Institutional Style */}
      <div className="w-full p-3 bg-gradient-to-r from-[#084C2E] via-[#0B5D3B] to-[#084C2E] rounded-2xl border border-[#B8860B]/40 shadow-md">
        <div className="flex items-center gap-2 text-xs font-semibold text-white">
          <span className="p-1.5 rounded-lg bg-white/10 text-white border border-[#B8860B]/30 shrink-0">
            <Leaf className="w-3.5 h-3.5" />
          </span>
          <span className="text-white/90">{t('rule_single_marker')}</span>
          <span className="ml-auto px-2 py-0.5 rounded-full bg-[#D4A017]/20 text-[#D4A017] text-[10px] font-bold border border-[#D4A017]/30">
            {t('filter_by_bin')}
          </span>
        </div>
      </div>

      {/* Collapsible Legend Panel */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: showLegend ? 1 : 0, height: showLegend ? 'auto' : 0 }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        className="overflow-hidden"
      >
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 animate-in slide-down duration-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-slate-800 text-sm">{t('legend_title')}</h4>
            <span className="text-xs text-slate-700">{t('legend_subtitle')}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {legendItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-2 p-2 rounded-xl border transition-all duration-200 ${
                  selectedCategoryId === item.id
                    ? 'bg-uncp-verde-pale border-uncp-verde/50 ring-2 ring-uncp-verde/30'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
                onClick={() => onSelectCategoryFilter(selectedCategoryId === item.id ? null : item.id)}
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[11px] font-medium text-slate-700 truncate">{item.name}</span>
                <span className="text-[10px] text-slate-700 ml-auto font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Filter by Category Container Pill Selector - HIGH CONTRAST (FASE 5) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              <button
                onClick={() => onSelectCategoryFilter(null)}
                className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition ${selectedCategoryId === null ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 border-2 border-slate-200 hover:bg-slate-50'}`}
              >
                {t('filter_all')}
              </button>
              {categories.map((category) => {
                const isSelected = selectedCategoryId === category.id;
                const accentColor = CATEGORY_ACCENT_COLORS[category.id] || '#556B2F';
                return (
                  <button
                    key={category.id}
                    onClick={() => onSelectCategoryFilter(isSelected ? null : category.id)}
                    className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'ring-2 ring-uncp-verde bg-uncp-verde-pale text-uncp-verde-dark border-2 border-uncp-verde/50'
                        : 'bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50'
                    }`}
                    style={
  isSelected
    ? {}
    : ({ '--pill-accent': accentColor } as React.CSSProperties)
}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: accentColor, flexShrink: 0 }} />
                    <span>{category.name[language] || category.name.es}</span>
                    <span className="text-[10px] font-bold text-slate-500">
                      ({category.containerColorName[language] || category.containerColorName.es})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Clear notification if no points have this container */}
            {selectedCategoryId && activePointsCount === 0 && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2 animate-in slide-up duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{t('no_points_for_category')}</span>
              </div>
            )}

            {/* Map Container View */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md">
              {mapMode === 'osm' ? (
                <div className="relative w-full h-[400px] sm:h-[480px] bg-slate-100">
                  <div ref={mapContainerRef} className="w-full h-full" />

                  {/* In-Map Control Shortcuts */}
                  <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
                    {userCoords && (
                      <button
                        onClick={handleRecenter}
                        className="p-2.5 rounded-xl bg-white/95 text-slate-800 hover:text-blue-600 shadow-md border border-slate-200 backdrop-blur-sm transition active:scale-95"
                        title={t('recenter_map')}
                      >
                        <Navigation2 className="w-5 h-5 text-blue-600" />
                      </button>
                    )}
                    <button
                      onClick={handleCenterCampus}
                      className="p-2.5 rounded-xl bg-white/95 text-slate-800 hover:text-uncp-verde shadow-md border border-slate-200 backdrop-blur-sm transition active:scale-95"
                      title={t('center_campus')}
                    >
                      <Compass className="w-5 h-5 text-uncp-verde" />
                    </button>
                    <button
                      onClick={handleRecenter}
                      className="p-2.5 rounded-xl bg-white/95 text-slate-800 hover:text-uncp-verde shadow-md border border-slate-200 backdrop-blur-sm transition active:scale-95"
                      title={t('locate_me')}
                    >
                      <Locate className="w-5 h-5 text-uncp-verde" />
                    </button>
                  </div>

                  {/* Active Filter Indicator on Map */}
                  {selectedCategoryId && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute top-4 left-4 z-10"
                    >
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/95 backdrop-blur-sm shadow-lg border border-slate-200">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_ACCENT_COLORS[selectedCategoryId] }} />
                        <span className="text-xs font-semibold text-slate-700">
                          {categories.find(c => c.id === selectedCategoryId)?.name[language] || selectedCategoryId}
                        </span>
                        <button
                          onClick={() => onSelectCategoryFilter(null)}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                          aria-label={t('clear_filter')}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <OfflineMapFallback
                  points={points}
                  selectedCategoryId={selectedCategoryId}
                  nearestPointId={nearestPointId}
                  userCoords={userCoords}
                  onSelectPoint={(p) => setActivePoint(p)}
                  language={language}
                />
              )}
            </div>

            {/* Active Point Detail Modal */}
            {activePoint && (
              <PointDetailModal
                point={activePoint}
                categories={categories}
                userCoords={userCoords}
                language={language}
                isNearest={activePoint.id === nearestPointId}
                onClose={() => setActivePoint(null)}
              />
            )}
          </div>
        );
      };

export default CampusMap;
