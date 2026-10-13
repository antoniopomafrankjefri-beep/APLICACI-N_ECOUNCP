import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DisposalPoint, Category, UserCoords, Language } from '../../types';
import { haversineDistance, formatDistance } from '../../utils/distance';
import { useI18n } from '../../hooks/useI18n';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { GuideCharacter } from '../GuideCharacter';
import {
  MapPin,
  Navigation,
  Star,
  Map,
  Compass,
  AlertTriangle,
  ChevronDown,
  CheckCircle2,
  X,
  Locate,
  Layers,
} from 'lucide-react';
import { CAMPUS_REFERENCE_SPOTS } from '../../utils/campus';

// Configuración del detector de proximidad
const PROXIMITY_CONFIG = {
  // Radio en metros para considerar "cerca"
  NEAR_RADIUS: 50,
  // Radio para "muy cerca" (listo para tirar)
  VERY_NEAR_RADIUS: 15,
  // Intervalo de verificación (ms)
  CHECK_INTERVAL: 5000,
  // Distancia mínima para notificar cambio significativo (metros)
  SIGNIFICANT_CHANGE: 10,
};

interface EnhancedNearestPointBannerProps {
  nearestPoint: DisposalPoint | null;
  category: Category | null;
  userCoords: UserCoords | null;
  language: Language;
  onOpenPoint: (point: DisposalPoint) => void;
  onSelectReferenceSpot: (spotId: string) => void;
  onRequestGps: () => void;
  gpsStatus: string;
  // Callbacks para integración con personaje guía
  onGuideAction?: (action: 'point' | 'speak' | 'celebrate' | 'idle', message?: string) => void;
}

function EnhancedNearestPointBanner(props: EnhancedNearestPointBannerProps) {
  const {
    nearestPoint,
    category,
    userCoords,
    language,
    onOpenPoint,
    onSelectReferenceSpot,
    onRequestGps,
    gpsStatus,
    onGuideAction,
  } = props;
  const { t } = useI18n();
  const isOnline = useOnlineStatus();
  
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);
  const [proximityLevel, setProximityLevel] = useState<'far' | 'near' | 'very-near' | 'none'>('none');
  const [lastNotifiedDistance, setLastNotifiedDistance] = useState<number | null>(null);
  const [showNavigateConfirm, setShowNavigateConfirm] = useState(false);
  const [guideMessage, setGuideMessage] = useState<string>('');
  
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUserCoordsRef = useRef<UserCoords | null>(null);

  // Calcular distancia
  useEffect(() => {
    if (nearestPoint && userCoords) {
      const dist = haversineDistance(
        userCoords.lat,
        userCoords.lng,
        nearestPoint.lat,
        nearestPoint.lng
      );
      setDistanceMeters(dist);
      
      // Determinar nivel de proximidad
      if (dist <= PROXIMITY_CONFIG.VERY_NEAR_RADIUS) {
        setProximityLevel('very-near');
      } else if (dist <= PROXIMITY_CONFIG.NEAR_RADIUS) {
        setProximityLevel('near');
      } else {
        setProximityLevel('far');
      }
      
      // Notificar al personaje guía
      handleProximityChange(dist, nearestPoint);
    } else {
      setDistanceMeters(null);
      setProximityLevel('none');
    }
  }, [nearestPoint, userCoords]);

  // Manejar cambios de proximidad y activar personaje guía
  const handleProximityChange = useCallback((dist: number, point: DisposalPoint) => {
    // Verificar cambio significativo
    if (lastNotifiedDistanceRef.current !== null) {
      const change = Math.abs(dist - lastNotifiedDistanceRef.current);
      if (change < PROXIMITY_CONFIG.SIGNIFICANT_CHANGE) return;
    }
    lastNotifiedDistanceRef.current = dist;

    // Activar personaje guía según proximidad
    if (dist <= PROXIMITY_CONFIG.VERY_NEAR_RADIUS) {
      onGuideAction?.('celebrate', t('guide_very_near', { point: point.name }));
      setGuideMessage(t('guide_very_near', { point: point.name }));
    } else if (dist <= PROXIMITY_CONFIG.NEAR_RADIUS) {
      onGuideAction?.('point', t('guide_near', { point: point.name, distance: formatDistance(dist, language) }));
      setGuideMessage(t('guide_near', { point: point.name, distance: formatDistance(dist, language) }));
    } else if (dist <= PROXIMITY_CONFIG.NEAR_RADIUS * 2) {
      onGuideAction?.('speak', t('guide_approaching', { point: point.name, distance: formatDistance(dist, language) }));
      setGuideMessage(t('guide_approaching', { point: point.name, distance: formatDistance(dist, language) }));
    }
  }, [language, onGuideAction]);

  const lastNotifiedDistanceRef = useRef<number | null>(null);

  // Auto-check interval cuando hay GPS activo
  useEffect(() => {
    if (gpsStatus === 'active' && userCoords) {
      checkIntervalRef.current = setInterval(() => {
        // Forzar recálculo si las coords cambiaron
        if (lastUserCoordsRef.current) {
          const latDiff = Math.abs(userCoords.lat - lastUserCoordsRef.current.lat);
          const lngDiff = Math.abs(userCoords.lng - lastUserCoordsRef.current.lng);
          if (latDiff > 0.00001 || lngDiff > 0.00001) {
            lastNotifiedDistanceRef.current = null; // Forzar notificación
          }
        }
        lastUserCoordsRef.current = userCoords;
      }, PROXIMITY_CONFIG.CHECK_INTERVAL);
    }

    return () => {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    };
  }, [gpsStatus, userCoords]);

  // Obtener message del guía según categoría filtrada
  const getCategoryAwareMessage = () => {
    if (!nearestPoint || !category) return null;
    
    const hasCategory = nearestPoint.bins.some(b => b.categoryId === category.id);
    if (!hasCategory) {
      return t('guide_wrong_category', { 
        category: category.name[language] || category.name.es,
        point: nearestPoint.name 
      });
    }
    return null;
  };

  const categoryWarning = getCategoryAwareMessage();

  // Renderizado principal
  if (!nearestPoint) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3 animate-in fade-in duration-200">
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{t('no_points_for_category')}</span>
        </div>
        
        {category && (
          <div className="text-xs text-slate-700 text-center">
            {t('guide_no_points_for_category', { category: category.name[language] || category.name.es })}
          </div>
        )}
      </div>
    );

  const hasNeededBin = nearestPoint.bins.some(b => b.categoryId === category?.id);
  const binForCategory = nearestPoint.bins.find(b => b.categoryId === category?.id);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3 animate-in fade-in duration-200">
      {/* Header con selector de ubicación */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>{t('your_location')}:</span>
          <span className="font-bold text-slate-800 flex items-center gap-1">
            {userCoords?.referenceName || (userCoords?.isCustomReference ? 'Punto UNCP' : 'GPS')}
            {userCoords?.accuracy && (
              <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                ±{Math.round(userCoords.accuracy)}m
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowLocationPicker(!showLocationPicker)}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-blue-50 transition"
          >
            <span>{showLocationPicker ? 'Ocultar' : 'Cambiar'} referencia</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showLocationPicker ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Selector de puntos de referencia */}
      {showLocationPicker && (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 animate-in fade-in duration-150">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            {t('select_reference_spot')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
            {CAMPUS_REFERENCE_SPOTS.map((spot) => (
              <button
                key={spot.id}
                onClick={() => {
                  onSelectReferenceSpot(spot.id);
                  setShowLocationPicker(false);
                }}
                className={`text-left text-xs px-2.5 py-1.5 rounded-lg border transition font-medium ${
                  userCoords?.referenceName === spot.name.es
                    ? 'bg-uncp-verde-pale border-uncp-verde text-uncp-verde font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                📍 {spot.name[language] || spot.name.es}
              </button>
            ))}
          </div>
          <div className="pt-1 flex items-center justify-between">
            <button
              onClick={() => {
                onRequestGps();
                setShowLocationPicker(false);
              }}
              className="text-xs text-uncp-verde hover:underline font-semibold flex items-center gap-1"
            >
              <Locate className="w-3.5 h-3.5" />
              <span>{t('use_gps_device')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Advertencia de categoría no compatible */}
      {categoryWarning && (
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2 animate-in slide-up duration-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{categoryWarning}</span>
        </div>
      )}

      {/* Tarjeta principal del punto más cercano */}
      <div className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
        proximityLevel === 'very-near' 
          ? 'bg-gradient-to-r from-uncp-verde via-uncp-verde/90 to-uncp-dorado border-uncp-verde shadow-lg shadow-uncp-verde/30 animate-pulse-soft'
        : proximityLevel === 'near'
          ? 'bg-gradient-to-r from-uncp-verde-pale via-white to-uncp-dorado-pale border-uncp-verde/50'
          : 'bg-gradient-to-r from-slate-50 via-white to-uncp-dorado-pale border-slate-200'
      }`}>
        
        {/* Badge de proximidad animado */}
        <div className="absolute -top-3 left-4 right-4 flex items-center justify-center">
          {proximityLevel === 'very-near' && (
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="px-3 py-1 rounded-full bg-uncp-verde text-white font-black text-xs tracking-wider flex items-center gap-1.5 shadow-lg"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t('very_near_badge')}
            </motion.span>
          )}
          {proximityLevel === 'near' && (
            <span className="px-3 py-1 rounded-full bg-uncp-dorado text-uncp-dorado-dark/95 font-bold text-xs tracking-wider flex items-center gap-1.5 shadow">
              <Star className="w-3 h-3 fill-current" />
              {t('near_badge')}
            </span>
          )}
        </div>

        {/* Contenido principal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-uncp-verde text-white font-bold text-xs">
                {nearestPoint.code}
              </span>
              {distanceMeters !== null && (
                <span className={`text-xs font-bold ${proximityLevel === 'very-near' ? 'text-white' : 'text-uncp-verde'}`}>
                  {proximityLevel === 'very-near' 
                    ? t('distance_very_close', { m: Math.round(distanceMeters) })
                    : `${formatDistance(distanceMeters, language)} ${t('away')}`}
                </span>
              )}
              {binForCategory && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/90 text-uncp-verde">
                  ×{binForCategory.quantity} {category?.containerColorName[language] || category?.containerColorName.es}
                </span>
              )}
            </div>

            <h4 className="text-base sm:text-lg font-black text-slate-900">
              {nearestPoint.name}
            </h4>
            <p className="text-xs text-slate-700 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {nearestPoint.referenceBuilding}
            </p>

            {/* Indicador visual de distancia */}
            {distanceMeters !== null && (
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${Math.max(5, Math.min(100, 100 - (distanceMeters / PROXIMITY_CONFIG.NEAR_RADIUS) * 100))}%` 
                  }}
                  transition={{ duration: 800, ease: [0.34, 1.56, 0.64, 1] }}
                  className={`h-full rounded-full ${
                    proximityLevel === 'very-near' ? 'bg-uncp-dorado' : 'bg-uncp-verde'
                  }`}
                />
              </div>
            )}

            {/* Bins disponibles en este punto */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {nearestPoint.bins.slice(0, 4).map((bin, idx) => {
                const cat = category?.id === bin.categoryId ? category : null;
                // Buscar categoría completa
                return (
                  <CategoryPill 
                    key={idx} 
                    category={cat || { 
                      id: bin.categoryId, 
                      name: { es: bin.categoryId, pt: bin.categoryId, en: bin.categoryId },
                      containerColorName: { es: bin.categoryId, pt: bin.categoryId, en: bin.categoryId },
                      colorHex: '#556B2F', textColorHex: '#fff', borderHex: '#556B2F', iconName: 'Package',
                      description: { es: '', pt: '', en: '' }, ntpNorm: '', confirmationStatus: 'confirmed'
                    }} 
                    language={language} 
                    size="sm" 
                    showColorName={false}
                  />
                );
              })}
              {nearestPoint.bins.length > 4 && (
                <span className="px-2 py-0.5 text-[10px] text-slate-700 bg-slate-100 rounded">
                  +{nearestPoint.bins.length - 4} más
                </span>
              )}
            </div>
          </div>

          {/* Acciones principales */}
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            {/* Botón principal: Ver en mapa / Navegar */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (proximityLevel === 'very-near' || proximityLevel === 'near') {
                  setShowNavigateConfirm(true);
                } else {
                  onOpenPoint(nearestPoint);
                }
              }}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-sm shadow-lg transition-all duration-200 ${
                proximityLevel === 'very-near' || proximityLevel === 'near'
                  ? 'bg-uncp-dorado text-uncp-dorado-dark hover:bg-uncp-dorado-light active:scale-[0.98]'
                  : 'bg-uncp-verde text-white hover:bg-uncp-verde-dark active:scale-[0.98]'
              }`}
            >
              {proximityLevel === 'very-near' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('arrive_and_deposit')}</span>
                </>
              ) : proximityLevel === 'near' ? (
                <>
                  <Navigation className="w-4 h-4" />
                  <span>{t('navigate_here')}</span>
                </>
              ) : (
                <>
                  <Map className="w-4 h-4" />
                  <span>{t('view_on_map')}</span>
                </>
              )}
            </motion.button>

            {/* Botón secundario: Ver detalles */}
            <button
              onClick={() => onOpenPoint(nearestPoint)}
              className="w-full sm:w-auto px-4 py-3 rounded-xl border border-uncp-verde/50 bg-white text-uncp-verde font-semibold text-sm hover:bg-uncp-verde-pale transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <Layers className="w-4 h-4" />
              <span>{t('view_details')}</span>
            </button>
          </div>
        </div>

        {/* Mensaje del guía contextual */}
        {guideMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-3 bg-uncp-verde-pale/50 rounded-xl border border-uncp-verde/20 flex items-start gap-2"
          >
            <GuideCharacter 
              state="speak" 
              size={40} 
              message={guideMessage}
              ariaLabel="Guía Eco"
            />
            <span className="text-xs text-uncp-verde-dark font-medium flex-1 pt-1">
              {guideMessage}
            </span>
          </motion.div>
        )}
      </div>

      {/* Modal de confirmación de navegación */}
      {showNavigateConfirm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowNavigateConfirm(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-uncp-dorado/20 flex items-center justify-center">
                <Navigation className="w-8 h-8 text-uncp-dorado" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {t('confirm_navigation_title')}
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                {t('confirm_navigation_message', { point: nearestPoint.name, distance: formatDistance(distanceMeters || 0, language) })}
              </p>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowNavigateConfirm(false);
                  // Abrir Google Maps
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${nearestPoint.lat},${nearestPoint.lng}`;
                  window.open(url, '_blank', 'noopener,noreferrer');
                  onGuideAction?.('celebrate', t('guide_navigation_started'));
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-uncp-dorado text-uncp-dorado-dark font-bold text-sm shadow-md hover:bg-uncp-dorado-light transition flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>{t('open_google_maps')}</span>
              </button>
              
              <button
                onClick={() => {
                  setShowNavigateConfirm(false);
                  onOpenPoint(nearestPoint);
                }}
                className="w-full py-3.5 px-4 rounded-xl border border-uncp-verde text-uncp-verde font-bold text-sm hover:bg-uncp-verde-pale transition flex items-center justify-center gap-2"
              >
                <Map className="w-4 h-4" />
                <span>{t('view_details_first')}</span>
              </button>
              
              <button
                onClick={() => setShowNavigateConfirm(false)}
                className="w-full py-2 px-4 text-sm text-slate-700 hover:text-slate-900 font-medium"
              >
                {t('cancel')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
}
export { EnhancedNearestPointBanner };
export default EnhancedNearestPointBanner;