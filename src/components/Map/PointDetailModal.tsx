import React from 'react';
import {
  DisposalPoint,
  Category,
  UserCoords,
  Language,
} from '../../types';
import {
  X,
  Navigation,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Accessibility,
  WifiOff,
  Star,
  ExternalLink,
  Layers,
  Info,
} from 'lucide-react';
import { haversineDistance, formatDistance } from '../../utils/distance';
import { CategoryPill } from '../Classifier/CategoryPill';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useI18n } from '../../hooks/useI18n';
import { 
  getStationPhotoSync, 
  getStationCategoryColors 
} from '../../utils/photos';

interface PointDetailModalProps {
  point: DisposalPoint;
  categories: Category[];
  userCoords: UserCoords | null;
  language: Language;
  isNearest?: boolean;
  onClose: () => void;
}

export const PointDetailModal: React.FC<PointDetailModalProps> = ({
  point,
  categories,
  userCoords,
  language,
  isNearest = false,
  onClose,
}) => {
  const isOnline = useOnlineStatus();
  const { t } = useI18n();

  const categoryMap = new Map<string, Category>(categories.map((c) => [c.id, c]));

  const distanceMeters = userCoords
    ? haversineDistance(userCoords.lat, userCoords.lng, point.lat, point.lng)
    : null;

  const handleStartNavigation = () => {
    if (!isOnline || !userCoords) return;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${point.lat},${point.lng}&travelmode=walking`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleViewOnMap = () => {
    onClose();
    window.location.hash = `point-${point.id}`;
  };

  const getConservationLabel = () => {
    switch (point.conservationState) {
      case 'bueno':
        return { text: t('condition_good'), color: 'bg-uncp-verde-pale text-uncp-verde border-uncp-verde/30', icon: <CheckCircle2 className="w-3 h-3" /> };
      case 'regular':
        return { text: t('condition_regular'), color: 'bg-uncp-dorado-pale text-uncp-dorado-dark border-uncp-dorado/30', icon: <AlertCircle className="w-3 h-3" /> };
      case 'malo':
        return { text: t('condition_fair'), color: 'bg-red-50 text-red-700 border-red-200', icon: <AlertCircle className="w-3 h-3" /> };
      default:
        return { text: point.conservationState, color: 'bg-neutral-100 text-neutral-700 border-neutral-300', icon: <Info className="w-3 h-3" /> };
    }
  };

  const getAccessibilityLabel = () => {
    switch (point.accessibility) {
      case 'rampa':
        return { text: t('access_ramp'), icon: <Accessibility className="w-3.5 h-3.5 text-uncp-verde" />, color: 'bg-uncp-verde-pale text-uncp-verde border-uncp-verde/30' };
      case 'nivel':
        return { text: t('access_level'), icon: <CheckCircle2 className="w-3.5 h-3.5 text-uncp-verde" />, color: 'bg-uncp-verde-pale text-uncp-verde border-uncp-verde/30' };
      case 'escalones':
        return { text: t('access_stairs'), icon: <AlertCircle className="w-3.5 h-3.5 text-uncp-dorado-dark" />, color: 'bg-uncp-dorado-pale text-uncp-dorado-dark border-uncp-dorado/30' };
      default:
        return { text: point.accessibility, icon: <Info className="w-3.5 h-3.5 text-neutral-500" />, color: 'bg-neutral-100 text-neutral-700 border-neutral-300' };
    }
  };

  const consState = getConservationLabel();
  const accessState = getAccessibilityLabel();

  // Get station photo from point data (photoUrl already assigned in points.json)
  const photoData = getStationPhotoSync(point);
  const displayImageUrl = photoData.url;
  const isRealPhoto = photoData.source === 'data';

  // Group bins by category and count total bins per category
  const binsByCategory = new Map<string, { category: Category; quantity: number; binCount: number }>();
  point.bins.forEach(bin => {
    const category = categoryMap.get(bin.categoryId);
    if (!category) return;
    const existing = binsByCategory.get(bin.categoryId);
    if (existing) {
      existing.quantity += bin.quantity;
      existing.binCount += 1;
    } else {
      binsByCategory.set(bin.categoryId, { category, quantity: bin.quantity, binCount: 1 });
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[85vh] overflow-y-auto shadow-2xl border border-neutral-200 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header with image & station code badge */}
        <div className="relative h-36 sm:h-44 bg-neutral-800 shrink-0 overflow-hidden">
          <img
            src={displayImageUrl}
            alt={point.name}
            className="w-full h-full object-cover opacity-80"
            onError={(e) => {
              // Ultimate fallback if even the photo fails
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80';
            }}
          />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all duration-200"
            aria-label={t('close')}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on image */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-uncp-verde font-black text-sm tracking-wider uppercase shadow-sm flex items-center gap-1.5">
                {point.code}
                {isNearest && (
                  <span className="px-2 py-0.5 rounded-full bg-uncp-dorado text-uncp-dorado-dark/95 font-bold text-xs flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-current" />
                    {t('nearest_point_badge')}
                  </span>
                )}
              </span>
            </div>

            {distanceMeters !== null && (
              <span className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md text-xs font-bold flex items-center gap-1.5 border border-white/20">
                <MapPin className="w-3.5 h-3.5 text-uncp-dorado" />
                {formatDistance(distanceMeters, language)}
                <span className="text-white/70 hidden sm:inline">{t('away')}</span>
              </span>
            )}
          </div>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-6 space-y-5 flex-1" style={{ paddingBottom: '100px' }}>
          {/* Station Name & Reference */}
          <div className="space-y-1">
            <h3 id="modal-title" className="text-lg sm:text-xl font-black text-text-primary leading-tight">
              {point.name}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-text-secondary font-medium">
              <MapPin className="w-4 h-4 text-uncp-dorado flex-shrink-0" />
              <span>{point.referenceBuilding}</span>
            </div>
          </div>

          {/* State & Accessibility Pills */}
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1.5 rounded-xl border font-medium flex items-center gap-1.5 ${consState.color}`}>
              {consState.icon}
              <span>{t('condition_label')} {consState.text}</span>
            </span>
            <span className={`px-3 py-1.5 rounded-xl border font-medium flex items-center gap-1.5 ${accessState.color}`}>
              {accessState.icon}
              <span>{t('accessibility_label')} {accessState.text}</span>
            </span>
          </div>

          {/* Bins in this point - Improved layout */}
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                {t('bins_in_point')}
              </h4>
              <span className="text-xs text-text-tertiary bg-white px-2 py-0.5 rounded-full border border-neutral-200">
                {binsByCategory.size} {t('category_count', { count: binsByCategory.size })}
              </span>
            </div>
            <div className="space-y-2">
              {Array.from(binsByCategory.entries()).map(([categoryId, data], idx) => {
                const category = data.category;
                return (
                  <div key={categoryId} className="flex items-center justify-between p-3 bg-white rounded-xl border border-neutral-200 hover:border-uncp-verde/50 hover:shadow-sm transition-all duration-200">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <CategoryPill category={category} language={language} size="lg" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">
                          {category.name[language] || category.name.es}
                        </p>
                        <p className="text-xs text-text-tertiary flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-current" style={{ color: category.colorHex }} />
                          {t('container_color')} {category.containerColorName[language] || category.containerColorName.es}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                      {/* Quantity badge */}
                      <span className="px-3 py-1.5 rounded-xl bg-uncp-verde/10 text-uncp-verde font-bold text-sm border border-uncp-verde/20">
                        ×{data.quantity}
                        {data.binCount > 1 && (
                          <span className="ml-1 text-[10px] opacity-80">({data.binCount} {t('bins_label')})</span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Observations - Improved */}
          {point.observations && point.observations.trim() && (
            <div className="p-4 rounded-2xl bg-uncp-verde-pale/30 border border-uncp-verde/20">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center shadow-sm">
                  <Info className="w-4 h-4 text-uncp-verde" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-uncp-verde uppercase tracking-wider mb-1">
                    {t('observations_label', { defaultValue: 'Observaciones' })}
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                    {point.observations}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Distance info - clarify straight line vs route */}
          {distanceMeters !== null && (
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center gap-2 text-xs text-text-secondary mb-1.5">
                <Info className="w-3.5 h-3.5 text-uncp-dorado flex-shrink-0" />
                <span className="font-medium text-text-primary">{t('distance_info_title')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">{t('straight_line_distance')}</span>
                <span className="font-bold text-text-primary flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {formatDistance(distanceMeters, language)}
                </span>
              </div>
              <p className="text-[11px] text-text-tertiary mt-2">
                {t('walking_route_note')}
              </p>
            </div>
          )}

          {/* Navigation Button - Primary Action */}
                    <div className="pt-2 space-y-3">
                      {isOnline && userCoords ? (
                        <button
                          onClick={handleStartNavigation}
                          className="w-full flex items-center justify-center gap-2.5 py-4 px-5 rounded-xl bg-green-700 hover:bg-green-600 active:scale-[0.99] text-white font-semibold text-base shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                          <Navigation className="w-5 h-5 fill-white" />
                          <span>{t('navigate_button')}</span>
                          <ExternalLink className="w-4 h-4 opacity-80" />
                        </button>
                      ) : isOnline && !userCoords ? (
                        <div className="space-y-2">
                          <button
                            onClick={() => {
                              if ('geolocation' in navigator) {
                                navigator.geolocation.getCurrentPosition(
                                  () => {},
                                  () => {}
                                );
                              }
                            }}
                            className="w-full flex items-center justify-center gap-2.5 py-4 px-5 rounded-xl border-2 border-dashed border-uncp-verde/50 bg-uncp-verde-pale/50 hover:bg-uncp-verde-pale text-uncp-verde font-semibold text-base transition-all duration-200"
                          >
                            <MapPin className="w-5 h-5" />
                            <span>{t('use_gps_device')}</span>
                          </button>
                          <p className="text-center text-xs text-text-tertiary">
                            {t('gps_permission_note')}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <button
                            disabled
                            className="w-full flex items-center justify-center gap-2.5 py-4 px-5 rounded-xl bg-neutral-200 text-text-tertiary font-semibold text-base cursor-not-allowed"
                          >
                            <WifiOff className="w-5 h-5" />
                            <span>{t('navigate_disabled_offline')}</span>
                          </button>
                          <p className="text-center text-xs text-text-tertiary">
                            {t('offline_notice')}
                          </p>
                        </div>
                      )}
                    </div>
        </div>
      </div>
    </div>
  );
};