import React, { useState } from 'react';
import { DisposalPoint, Category, UserCoords, Language } from '../../types';
import { haversineDistance, formatDistance } from '../../utils/distance';
import { useI18n } from '../../hooks/useI18n';
import {
  MapPin,
  Navigation,
  Star,
  Map,
  Compass,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import { CAMPUS_REFERENCE_SPOTS } from '../../utils/campus';

interface NearestPointBannerProps {
  nearestPoint: DisposalPoint | null;
  category: Category | null;
  userCoords: UserCoords | null;
  language: Language;
  onOpenPoint: (point: DisposalPoint) => void;
  onSelectReferenceSpot: (spotId: string) => void;
  onRequestGps: () => void;
  gpsStatus: string;
}

export const NearestPointBanner: React.FC<NearestPointBannerProps> = ({
  nearestPoint,
  category,
  userCoords,
  language,
  onOpenPoint,
  onSelectReferenceSpot,
  onRequestGps,
  gpsStatus,
}) => {
  const { t } = useI18n();
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const distanceMeters =
    nearestPoint && userCoords
      ? haversineDistance(userCoords.lat, userCoords.lng, nearestPoint.lat, nearestPoint.lng)
      : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
      {/* Location Source / Selector Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>{t('your_location')}:</span>
          <span className="font-bold text-slate-800">
            {userCoords?.referenceName || (userCoords?.isCustomReference ? 'Punto UNCP' : 'GPS')}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowLocationPicker(!showLocationPicker)}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-blue-50 transition"
          >
            <span>Cambiar referencia</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Campus Reference Spots Quick Chooser */}
      {showLocationPicker && (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 animate-in fade-in duration-150">
          <p className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">
            {t('select_reference_spot')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {CAMPUS_REFERENCE_SPOTS.map((spot) => (
              <button
                key={spot.id}
                onClick={() => {
                  onSelectReferenceSpot(spot.id);
                  setShowLocationPicker(false);
                }}
                className={`text-left text-xs px-2.5 py-1.5 rounded-lg border transition font-medium ${
                  userCoords?.referenceName === spot.name.es
                    ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold'
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
              className="text-xs text-emerald-700 hover:underline font-semibold flex items-center gap-1"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Usar mi GPS del dispositivo</span>
            </button>
          </div>
        </div>
      )}

      {/* Nearest Point Highlight Card */}
      {nearestPoint ? (
        <div className="p-3.5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 rounded-xl border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-amber-400 text-amber-950 font-black text-[11px] tracking-wide flex items-center gap-1 shadow-2xs">
                <Star className="w-3 h-3 fill-amber-950" />
                {t('nearest_point_badge')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white font-bold text-xs">
                {nearestPoint.code}
              </span>
              {distanceMeters !== null && (
                <span className="text-xs font-black text-emerald-800">
                  ~ {formatDistance(distanceMeters, language)}
                </span>
              )}
            </div>

            <h4 className="text-sm font-bold text-slate-900">
              {nearestPoint.name}
            </h4>
            <p className="text-xs text-slate-700">
              {nearestPoint.referenceBuilding}
            </p>
          </div>

          <button
            onClick={() => onOpenPoint(nearestPoint)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-1.5 shrink-0"
          >
            <Map className="w-3.5 h-3.5" />
            <span>Ver detalles</span>
          </button>
        </div>
      ) : (
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{t('no_points_for_category')}</span>
        </div>
      )}
    </div>
  );
};
