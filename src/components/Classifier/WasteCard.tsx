import React from 'react';
import { WasteItem, Category, Language } from '../../types';
import { CategoryPill } from './CategoryPill';
import { MapPin, Info, AlertCircle, Sparkles, X, Recycle, Leaf, Globe } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';

interface WasteCardProps {
  item: WasteItem;
  category: Category;
  language: Language;
  onFindOnMap: (categoryId: string) => void;
  onClose?: () => void;
}

export const WasteCard: React.FC<WasteCardProps> = ({
  item,
  category,
  language,
  onFindOnMap,
  onClose,
}) => {
  const { t } = useI18n();

  const itemName = item.name[language] || item.name.es;
  const explanation = item.explanation[language] || item.explanation.es;
  const observation = item.observation[language] || item.observation.es;
  const colorName = category.containerColorName[language] || category.containerColorName.es;

  // Category-specific icons for enhanced visual identity
    const categoryIcons: Record<string, React.ReactNode> = {
      plastico: <Recycle className="w-5 h-5" />,
      papel_carton: <Leaf className="w-5 h-5" />,
      no_aprovechable: <Globe className="w-5 h-5" />,
      vidrio: <Recycle className="w-5 h-5" />,
      metal: <Recycle className="w-5 h-5" />,
      organico: <Leaf className="w-5 h-5" />,
      peligroso: <AlertCircle className="w-5 h-5" />,
    };

  return (
    <div className="p-4 sm:p-5 relative animate-in fade-in zoom-in-95 duration-300 border-2 border-[#D4A017]/40 overflow-hidden bg-gradient-to-br from-[#0B5D3B] via-[#084C2E] to-[#1A1A1A] rounded-2xl">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-uncp-verde via-uncp-dorado to-uncp-verde" />
      
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-all duration-200"
          aria-label={t('clear_selection')}
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header title & badge */}
      <div className="pr-10">
        <span className="text-[11px] font-bold text-[#D4A017] uppercase tracking-wider flex items-center gap-1 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          {t('waste_selected')}
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
          {itemName}
        </h2>
      </div>

      {/* Container Category & Color Pill */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <CategoryPill category={category} language={language} size="lg" />
        <span className="text-xs text-white/70 font-medium">{t('container_color')}: {colorName}</span>
      </div>

      {/* Category icon visual */}
      <div className="mt-3 flex items-center gap-2 text-sm text-white/70">
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10">
          {categoryIcons[category.id] || <Recycle className="w-4 h-4" />}
          <span className="font-medium text-white/90">{t('category')}: {category.name[language] || category.name.es}</span>
        </span>
      </div>

      {/* Why this bin section */}
      <div className="mt-4 p-4 bg-white/10 rounded-xl border border-white/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Info className="w-4 h-4 text-[#D4A017]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-xs uppercase tracking-wide mb-1">
              {t('why_this_bin')}
            </h3>
            <p className="text-white/80 leading-relaxed text-sm">
              {explanation}
            </p>
          </div>
        </div>
      </div>

      {/* Practical Observation */}
      <div className="mt-3 p-4 bg-white/10 rounded-xl border border-white/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-[#D4A017]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white/90 text-xs uppercase tracking-wide mb-1">
              {t('practical_tip')}
            </h3>
            <p className="text-white/80 leading-relaxed text-sm font-medium">
              {observation}
            </p>
          </div>
        </div>
      </div>

      {/* Environmental Impact (NEW - FASE 4) */}
      <div className="mt-3 p-4 bg-white/10 rounded-xl border border-white/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-[#D4A017]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-xs uppercase tracking-wide mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <Leaf className="w-3 h-3 text-[#D4A017]" />
              </span>
              {t('environmental_impact')}
            </h3>
            <p className="text-white/80 leading-relaxed text-sm">
              {item.environmentalImpact[language] || item.environmentalImpact.es || t('default_environmental_impact')}
            </p>
          </div>
        </div>
      </div>

      {/* Direct CTA: Ver puntos en el mapa */}
      <div className="mt-5 pt-4 border-t border-white/20">
        <button
          onClick={() => onFindOnMap(category.id)}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#0B5D3B] to-[#084C2E] hover:from-[#084C2E] hover:to-[#1A1A1A] active:scale-[0.98] text-white font-semibold text-sm shadow-sm transition-all duration-200 group"
        >
          <MapPin className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          <span>{t('view_points_on_map')}</span>
        </button>
      </div>
    </div>
  );
};