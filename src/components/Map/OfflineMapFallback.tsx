import React from 'react';
import { DisposalPoint, UserCoords, Category, Language } from '../../types';
import { MapPin, Navigation, Star, Compass } from 'lucide-react';
import { haversineDistance, formatDistance } from '../../utils/distance';

// VIVID category colors matching the design system - NTP 900.058:2019 OFFICIAL COLORS
const CATEGORY_VIVID_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  plastico: { bg: '#FFFFFF', text: '#1E293B', border: '#CBD5E1' },
  papel_carton: { bg: '#2563EB', text: '#FFFFFF', border: '#60A5FA' },
  no_aprovechable: { bg: '#171717', text: '#FFFFFF', border: '#52525B' },
  vidrio: { bg: '#16A34A', text: '#FFFFFF', border: '#4ADE80' },
  metal: { bg: '#FEF3C7', text: '#713F12', border: '#F59E0B' },
  organico: { bg: '#78350F', text: '#FFFFFF', border: '#B45309' },
  peligroso: { bg: '#DC2626', text: '#FFFFFF', border: '#F87171' },
};

const getCategoryColor = (categoryId: string) => {
  return CATEGORY_VIVID_COLORS[categoryId] || CATEGORY_VIVID_COLORS.plastico;
};

interface OfflineMapFallbackProps {
  points: DisposalPoint[];
  selectedCategoryId: string | null;
  nearestPointId: string | null;
  userCoords: UserCoords | null;
  onSelectPoint: (point: DisposalPoint) => void;
  language: Language;
}

export const OfflineMapFallback: React.FC<OfflineMapFallbackProps> = ({
  points,
  selectedCategoryId,
  nearestPointId,
  userCoords,
  onSelectPoint,
  language,
}) => {
  // Convert lat/lng in UNCP bounds (-12.0350 to -12.0300, -75.2410 to -75.2330) to SVG coordinates (0..400 x 0..300)
  const minLat = -12.0350;
  const maxLat = -12.0300;
  const minLng = -75.2410;
  const maxLng = -75.2330;

  const toSvgX = (lng: number) => {
    return Math.max(30, Math.min(370, ((lng - minLng) / (maxLng - minLng)) * 340 + 30));
  };

  const toSvgY = (lat: number) => {
    // Invert lat because higher lat is North (top of map)
    return Math.max(30, Math.min(270, ((maxLat - lat) / (maxLat - minLat)) * 240 + 30));
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[460px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-inner flex flex-col justify-between">
      {/* Top Banner overlay */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-slate-800/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-200 font-medium flex items-center gap-1.5 shadow-sm">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>Croquis Esquema UNCP (Modo Offline)</span>
        </div>
        <div className="bg-emerald-950/80 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-800 text-[11px] font-bold">
          1 Marcador = 1 Punto Oficial
        </div>
      </div>

      {/* SVG Canvas Map */}
      <svg
        className="w-full h-full"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="campusGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#064e3b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#022c22" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* Campus ground area */}
        <rect x="20" y="20" width="360" height="260" rx="16" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
        <rect x="35" y="35" width="330" height="230" rx="12" fill="url(#campusGlow)" />

        {/* Campus paths/alleys */}
        <path d="M 40 180 L 360 180" stroke="#334155" strokeWidth="3" strokeDasharray="4 4" />
        <path d="M 200 40 L 200 260" stroke="#334155" strokeWidth="3" strokeDasharray="4 4" />
        <path d="M 120 70 L 280 230" stroke="#1e293b" strokeWidth="2" />

        {/* Major campus building footprint boxes */}
        {/* Rectorado / Pabellón Central */}
        <rect x="160" y="110" width="80" height="40" rx="4" fill="#1e293b" stroke="#334155" />
        <text x="200" y="134" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">
          Plaza Central
        </text>

        {/* Biblioteca Central */}
        <rect x="250" y="80" width="60" height="35" rx="4" fill="#1e293b" stroke="#334155" />
        <text x="280" y="101" fill="#94a3b8" fontSize="7.5" fontWeight="bold" textAnchor="middle">
          Biblioteca
        </text>

        {/* Comedor Universitario */}
        <rect x="260" y="190" width="70" height="35" rx="4" fill="#1e293b" stroke="#334155" />
        <text x="295" y="211" fill="#94a3b8" fontSize="7.5" fontWeight="bold" textAnchor="middle">
          Comedor
        </text>

        {/* FICA / Civil */}
        <rect x="80" y="65" width="65" height="35" rx="4" fill="#1e293b" stroke="#334155" />
        <text x="112" y="86" fill="#94a3b8" fontSize="7.5" fontWeight="bold" textAnchor="middle">
          Ing. Civil
        </text>

        {/* Puerta Principal */}
        <rect x="140" y="235" width="120" height="22" rx="4" fill="#1e293b" stroke="#059669" />
        <text x="200" y="250" fill="#34d399" fontSize="8" fontWeight="bold" textAnchor="middle">
          Puerta Principal (Av. Mariscal Castilla)
        </text>

        {/* Estadio UNCP */}
        <circle cx="310" cy="55" r="22" fill="#134e4a" opacity="0.4" stroke="#2dd4bf" strokeWidth="1" />
        <text x="310" y="58" fill="#5eead4" fontSize="7" fontWeight="bold" textAnchor="middle">
          Estadio
        </text>

        {/* User location dot if available */}
        {userCoords && (
          <g transform={`translate(${toSvgX(userCoords.lng)}, ${toSvgY(userCoords.lat)})`}>
            <circle cx="0" cy="0" r="10" fill="#3b82f6" opacity="0.3" className="animate-ping" />
            <circle cx="0" cy="0" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
            <text x="0" y="-8" fill="#60a5fa" fontSize="7" fontWeight="bold" textAnchor="middle">
              Tú estás aquí
            </text>
          </g>
        )}

        {/* Disposal Station points */}
        {points.map((point) => {
          const hasRequiredBin = !selectedCategoryId || point.bins.some((b) => b.categoryId === selectedCategoryId);
          const isNearest = point.id === nearestPointId;
          const x = toSvgX(point.lng);
          const y = toSvgY(point.lat);
          const primaryBin = point.bins[0];
          const catColor = primaryBin ? getCategoryColor(primaryBin.categoryId) : getCategoryColor('plastico');

          if (!hasRequiredBin) {
            // dimmed out
            return (
              <g key={point.id} opacity="0.25">
                <circle cx={x} cy={y} r="6" fill="#64748b" />
                <text x={x} y={y + 12} fill="#64748b" fontSize="7" textAnchor="middle">
                  {point.code}
                </text>
              </g>
            );
          }

          return (
            <g
              key={point.id}
              onClick={() => onSelectPoint(point)}
              className="cursor-pointer group"
              transform={`translate(${x}, ${y})`}
            >
              {isNearest && (
                <circle cx="0" cy="0" r="14" fill={catColor.bg} opacity="0.35" />
              )}
              <circle
                cx="0"
                cy="0"
                r={isNearest ? "9" : "8"}
                fill={catColor.bg}
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text
                cx="0"
                cy="0"
                y="3"
                fill={catColor.text}
                fontSize="7"
                fontWeight="bold"
                textAnchor="middle"
              >
                🗑
              </text>
              <rect
                x="-14"
                y="9"
                width="28"
                height="12"
                rx="3"
                fill={catColor.border}
                stroke={catColor.bg}
                strokeWidth="0.8"
              />
              <text
                x="0"
                y="18"
                fill="#FFFFFF"
                fontSize="7.5"
                fontWeight="black"
                textAnchor="middle"
              >
                {point.code}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Bottom hint */}
      <div className="p-3 bg-slate-800/90 border-t border-slate-700/80 text-center text-xs text-slate-300">
        Toca cualquier punto verde/dorado para ver qué recipientes contiene y sus fotos.
      </div>
    </div>
  );
};
