import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Sparkles, Filter } from 'lucide-react';
import { WasteItem, Category, Language } from '../../types';
import { filterWasteItems } from '../../utils/search';
import { CategoryPill, getCategoryIcon } from './CategoryPill';
import { useI18n } from '../../hooks/useI18n';
import { CATEGORY_ACCENT_COLORS } from '../Map/CampusMap';
import { Link, useSearchParams } from 'react-router-dom';

interface WasteClassifierProps {
  items: WasteItem[];
  categories: Category[];
  onNavigateToMap: (categoryId: string) => void;
}

export const WasteClassifier: React.FC<WasteClassifierProps> = ({
  items,
  categories,
  onNavigateToMap,
}) => {
  const { language, t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  // Sync selectedCategoryId with URL query parameter
  const selectedCategoryId = searchParams.get('category') || null;

  // Category lookup dictionary
  const categoryMap = useMemo(() => {
    return new Map<string, Category>(categories.map((c) => [c.id, c]));
  }, [categories]);

  // Filtered waste list
  const filteredItems = useMemo(() => {
    return filterWasteItems(items, searchQuery, selectedCategoryId, language);
  }, [items, searchQuery, selectedCategoryId, language]);

  // Frequent campus items shortcuts
  const popularItems = useMemo(() => {
    return items.filter((i) => i.commonInCampus).slice(0, 6);
  }, [items]);

  // Update URL when search query changes
  useEffect(() => {
    if (searchQuery) {
      setSearchParams({ q: searchQuery, ...(selectedCategoryId && { category: selectedCategoryId }) });
    } else {
      setSearchParams({ ...(selectedCategoryId && { category: selectedCategoryId }) });
    }
  }, [searchQuery, selectedCategoryId, setSearchParams]);

  // Handle category selection
  const handleCategorySelect = (categoryId: string | null) => {
    if (categoryId === selectedCategoryId) {
      // Deselect if same category clicked
      setSearchParams({ ...(searchQuery && { q: searchQuery }) });
    } else if (categoryId) {
      setSearchParams({ category: categoryId, ...(searchQuery && { q: searchQuery }) });
    } else {
      setSearchParams({ ...(searchQuery && { q: searchQuery }) });
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input Box - HIGH CONTRAST */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="w-7 h-7 absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none flex-shrink-0 stroke-2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('search_placeholder')}
                      className="input input-with-icon w-full pl-16 pr-12 py-3.5 rounded-2xl bg-white/90 border border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/30"
                      aria-label={t('search_placeholder')}
                    />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10"
              aria-label="Borrar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick shortcuts for common campus items */}
      {!searchQuery && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A017]" />
            <span>{t('common_items')}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {popularItems.map((item) => (
              <Link
                key={item.id}
                to={`/clasificador/residuo/${item.id}`}
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 hover:text-slate-900 border border-slate-300 hover:border-[#D4A017]/50 text-xs font-medium transition shadow-2xs active:scale-95 text-left"
              >
                {item.name[language] || item.name.es}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Category filter tabs - HIGH CONTRAST (FASE 5) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-700 font-medium px-0.5">
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>{t('category')}:</span>
          </div>
          <span>{filteredItems.length} {t('points_count')}</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <Link
                      to="/clasificador"
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition filter-pill ${
                        selectedCategoryId === null ? 'filter-pill-selected' : 'filter-pill-unselected'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategorySelect(null);
                      }}
                    >
            {t('all_categories')}
          </Link>
          {categories.map((category) => {
                      const isSelected = selectedCategoryId === category.id;
                      const accentColor = CATEGORY_ACCENT_COLORS[category.id] || '#556B2F';
                      return (
                        <Link
                          key={category.id}
                          to={`/clasificador?category=${category.id}`}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition filter-pill ${
                            isSelected ? 'filter-pill-selected' : 'filter-pill-unselected'
                          }`}
                          style={{ ...(isSelected ? {} : { '--pill-accent': accentColor }) }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleCategorySelect(category.id);
                          }}
                        >
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: accentColor,
                  flexShrink: 0
                }} />
                <span>{category.name[language] || category.name.es}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Items list */}
      <div className="space-y-2 pt-1">
        {filteredItems.length === 0 ? (
          <div className="p-6 text-center bg-white/10 rounded-2xl border border-white/20 border-dashed text-slate-700">
            <p className="text-sm font-medium">{t('search_no_results')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredItems.map((item) => {
              const category = categoryMap.get(item.categoryId);
              if (!category) return null;

              return (
                              <Link
                                key={item.id}
                                to={`/clasificador/residuo/${item.id}`}
                                className={`p-3 rounded-xl border-2 text-left cursor-pointer transition bg-white/10 border-[#14532D] hover:border-[#0B5D3B] hover:bg-white/20 ${selectedCategoryId === category.id ? 'ring-2 ring-[#0B5D3B]/50 bg-white/20 border-[#0B5D3B]' : ''}`}
                              >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-slate-900 text-sm leading-snug">
                      {item.name[language] || item.name.es}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <CategoryPill category={category} language={language} size="sm" />
                    <span className="text-[11px] text-[#16A34A] font-semibold hover:underline">
                      Ver detalle →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};