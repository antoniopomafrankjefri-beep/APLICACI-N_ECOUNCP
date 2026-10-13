import React from 'react';
import { WasteItem, Category, Language } from '../../types';
import { CategoryPill } from './CategoryPill';
import { MapPin, Info, AlertCircle, Sparkles, ArrowLeft, Recycle, Leaf, Globe } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { Link, useNavigate, useParams } from 'react-router-dom';

interface WasteDetailProps {
  items: WasteItem[];
  categories: Category[];
  onNavigateToMap: (categoryId: string) => void;
}

export const WasteDetail: React.FC<WasteDetailProps> = ({
  items,
  categories,
  onNavigateToMap,
}) => {
  const { language, t } = useI18n();
  const navigate = useNavigate();
  const { itemId } = useParams<{ itemId: string }>();

  const item = items.find(i => i.id === itemId);
  const category = item ? categories.find(c => c.id === item.categoryId) : null;

  if (!item || !category) {
    return (
      <div className="p-6 text-center text-white/70">
        <p>{t('item_not_found')}</p>
        <Link to="/clasificador" className="mt-4 inline-flex items-center gap-2 text-[#D4A017] font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" />
          {t('back_to_list')}
        </Link>
      </div>
    );
  }

  const itemName = item.name[language] || item.name.es;
  const explanation = item.explanation[language] || item.explanation.es;
  const observation = item.observation[language] || item.observation.es;
  const colorName = category.containerColorName[language] || category.containerColorName.es;

  const categoryIcons: Record<string, React.ReactNode> = {
      plastico: <Recycle className="w-6 h-6" />,
      papel_carton: <Leaf className="w-6 h-6" />,
      no_aprovechable: <Globe className="w-6 h-6" />,
      vidrio: <Recycle className="w-6 h-6" />,
      metal: <Recycle className="w-6 h-6" />,
      organico: <Leaf className="w-6 h-6" />,
      peligroso: <AlertCircle className="w-6 h-6" />,
    };

  const presentationItems = item.presentation?.[language] || item.presentation?.es || [];
  const tips = item.tips?.[language] || item.tips?.es || [];

  return (
    <div className="animate-in fade-in duration-300">
      {/* Back button */}
            <Link
              to="/clasificador"
              className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>

      {/* Detail card - full width */}
      <div className="p-5 sm:p-6 relative animate-in fade-in zoom-in-95 duration-300 border-2 border-[#D4A017]/40 overflow-hidden bg-gradient-to-br from-[#0B5D3B] via-[#084C2E] to-[#1A1A1A] rounded-2xl">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-uncp-verde via-uncp-dorado to-uncp-verde" />

        {/* Header */}
        <div className="space-y-3 mb-6">
          <span className="text-[11px] font-bold text-[#D4A017] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            {t('waste_selected')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-snug">{itemName}</h1>

          {/* Category & Container Color */}
          <div className="flex flex-wrap items-center gap-3">
            <CategoryPill category={category} language={language} size="lg" />
            <span className="text-xs text-white/70 font-medium">{t('container_color')}: {colorName}</span>
          </div>

          {/* Category icon */}
          <div className="flex items-center gap-2 text-sm text-white/70">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10">
              {categoryIcons[category.id] || <Recycle className="w-4 h-4" />}
              <span className="font-medium text-white/90">{t('category')}: {category.name[language] || category.name.es}</span>
            </span>
          </div>
        </div>

        {/* Presentation / How to prepare */}
        {presentationItems.length > 0 && (
          <div className="mb-5 p-4 rounded-xl bg-white/10 border border-white/20">
            <h3 className="font-bold text-white text-xs uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Recycle className="w-3 h-3 text-[#D4A017]" />
              </span>
              {t('presentation') || 'Presentación'}
            </h3>
            <ul className="space-y-2">
              {presentationItems.map((p, idx) => (
                <li key={idx} className="flex items-start gap-2 text-white/90 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017] mt-2 flex-shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Why this bin */}
        <div className="mb-5 p-4 rounded-xl bg-white/10 border border-white/20">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Info className="w-4 h-4 text-[#D4A017]" />
            </div>
            <div>
              <h3 className="font-bold text-white text-xs uppercase tracking-wide mb-1">{t('why_this_bin')}</h3>
              <p className="text-white/80 leading-relaxed text-sm">{explanation}</p>
            </div>
          </div>
        </div>

        {/* Practical Tips */}
        {tips.length > 0 && (
          <div className="mb-5 p-4 rounded-xl bg-white/10 border border-white/20">
            <h3 className="font-bold text-white text-xs uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <AlertCircle className="w-3 h-3 text-[#D4A017]" />
              </span>
              {t('practical_tips') || 'Consejos prácticos'}
            </h3>
            <ul className="space-y-2">
              {tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-white/80 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017] mt-2 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Observation */}
        {observation && (
          <div className="mb-5 p-4 rounded-xl bg-white/10 border border-white/20">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-[#D4A017]" />
              </div>
              <div>
                <h3 className="font-bold text-white/90 text-xs uppercase tracking-wide mb-1">{t('practical_tip')}</h3>
                <p className="text-white/80 leading-relaxed text-sm font-medium">{observation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Environmental Impact */}
        <div className="mb-5 p-4 rounded-xl bg-white/10 border border-white/20">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-[#D4A017]" />
            </div>
            <div>
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

        {/* CTA: Ver puntos en el mapa */}
                        <div className="pt-4 border-t border-white/20">
                          <button
                            onClick={() => {
                              if (category) {
                                onNavigateToMap(category.id);
                                navigate('/mapa');
                              }
                            }}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#0B5D3B] to-[#084C2E] hover:from-[#084C2E] hover:to-[#1A1A1A] active:scale-[0.98] text-white font-semibold text-sm shadow-sm transition-all duration-200"
                            disabled={!category}
                          >
                            <MapPin className="w-4 h-4" />
                            <span>{t('view_points_on_map')}</span>
                          </button>
                        </div>
      </div>
    </div>
  );
};