import React, { useState } from 'react';
import { Category, Language } from '../../types';
import { CategoryPill, getCategoryIcon } from '../Classifier/CategoryPill';
import { useI18n } from '../../hooks/useI18n';
import { WasteQuiz } from './WasteQuiz';
import {
  BookOpen,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Shield,
  Leaf,
  Recycle,
  Globe,
  Target,
  Sparkles,
  Heart,
  TreePine,
} from 'lucide-react';
import { motion } from 'motion/react';
import { CATEGORY_ACCENT_COLORS } from '../Map/CampusMap';

interface EducationGuideProps {
  categories: Category[];
  language: Language;
}

export const EducationGuide: React.FC<EducationGuideProps> = ({
  categories,
  language,
}) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'guide' | 'quiz'>('guide');

  // Category icon mapping
    const categoryIcons: Record<string, React.ReactNode> = {
      plastico: <Recycle className="w-5 h-5" />,
      papel_carton: <Leaf className="w-5 h-5" />,
      no_aprovechable: <Globe className="w-5 h-5" />,
      vidrio: <Recycle className="w-5 h-5" />,
      metal: <Recycle className="w-5 h-5" />,
      organico: <Leaf className="w-5 h-5" />,
      peligroso: <AlertTriangle className="w-5 h-5" />,
    };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Switcher Tab between Guide and Quiz */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl text-xs font-bold shadow-xs">
        <button
                  onClick={() => setActiveTab('guide')}
                  className={`flex-1 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    activeTab === 'guide'
                      ? 'bg-white text-uncp-verde shadow-sm ring-1 ring-uncp-verde/20'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
          <BookOpen className="w-4 h-4" />
          <span>{t('education_guide_tab')}</span>
        </button>
        <button
                  onClick={() => setActiveTab('quiz')}
                  className={`flex-1 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    activeTab === 'quiz'
                      ? 'bg-white text-uncp-dorado-dark shadow-sm ring-1 ring-uncp-dorado/30'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
          <HelpCircle className="w-4 h-4 text-uncp-dorado" />
          <span>{t('education_quiz_tab')}</span>
        </button>
      </div>

      {activeTab === 'quiz' ? (
                    <WasteQuiz language={language} />
                  ) : (
                    <div className="space-y-5">
                      {/* Banner Intro - Modern Card with darker green gradient for text readability */}
                      <div className="relative overflow-hidden bg-[#0B5D3B] text-white rounded-2xl p-5 sm:p-6 shadow-lg space-y-3">
                        {/* Dark overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/20" />
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-uncp-dorado/15 rounded-full blur-3xl" />
            
                        <div className="relative z-10 space-y-3">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A017] text-black backdrop-blur-sm text-xs font-bold uppercase tracking-wider border border-white/30">
                            <Shield className="w-3 h-3" />
                            {t('education_norma_badge')}
                          </span>
                          <h2 className="text-xl sm:text-2xl font-black leading-tight">
                            {t('education_norma_title')}
                          </h2>
                          <p className="text-sm sm:text-base text-white/95 leading-relaxed max-w-2xl">
                            {t('education_norma_message')}
                          </p>
                        </div>
                      </div>

                {/* Quick campus tips - Soft green cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 25 }}
                    className="card p-4 hover:shadow-md transition-shadow duration-300 bg-white border-l-4 border-uncp-verde bg-uncp-verde-pale/30"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-uncp-verde/15 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-uncp-verde" />
                      </div>
                      <div>
                        <h4 className="font-bold text-text-primary text-sm">{t('tip_vaciar_title')}</h4>
                        <p className="text-text-secondary text-xs mt-1 leading-relaxed">{t('tip_vaciar_message')}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 25 }}
                    className="card p-4 hover:shadow-md transition-shadow duration-300 bg-white border-l-4 border-uncp-verde bg-uncp-verde-pale/30"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-uncp-verde/15 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-uncp-verde" />
                      </div>
                      <div>
                        <h4 className="font-bold text-text-primary text-sm">{t('tip_grasa_title')}</h4>
                        <p className="text-text-secondary text-xs mt-1 leading-relaxed">{t('tip_grasa_message')}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 25 }}
                    className="card p-4 hover:shadow-md transition-shadow duration-300 bg-white border-l-4 border-uncp-verde bg-uncp-verde-pale/30"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-uncp-verde/15 flex items-center justify-center">
                        <Target className="w-5 h-5 text-uncp-verde" />
                      </div>
                      <div>
                        <h4 className="font-bold text-text-primary text-sm">{t('tip_separar_title')}</h4>
                        <p className="text-text-secondary text-xs mt-1 leading-relaxed">{t('tip_separar_message')}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 260, damping: 25 }}
                    className="card p-4 hover:shadow-md transition-shadow duration-300 bg-white border-l-4 border-uncp-verde bg-uncp-verde-pale/30"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-uncp-verde/15 flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-uncp-verde" />
                      </div>
                      <div>
                        <h4 className="font-bold text-text-primary text-sm">{t('tip_aplastar_title')}</h4>
                        <p className="text-text-secondary text-xs mt-1 leading-relaxed">{t('tip_aplastar_message')}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Categories Detailed Cards - Enhanced Visual Identity with soft green accents */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-uncp-verde" />
                      {t('education_categories_title')}
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">{categories.length} {t('education_categories_count')}</span>
                  </div>

                  {categories.map((cat, index) => {
                    const name = cat.name[language] || cat.name.es;
                    const color = cat.containerColorName[language] || cat.containerColorName.es;
                    const desc = cat.description[language] || cat.description.es;
                    const accentColor = CATEGORY_ACCENT_COLORS[cat.id] || '#556B2F';

                    return (
                      <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08, type: 'spring', stiffness: 260, damping: 25 }}
                        className="card group hover:shadow-lg hover:border-uncp-verde/30 transition-all duration-300 relative overflow-hidden bg-white"
                        style={{ borderLeft: `4px solid ${accentColor}` }}
                      >
                        {/* Accent bar top - subtle */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-[var(--bin-accent)] group-hover:via-[var(--bin-accent)] group-hover:to-transparent transition-all duration-300" style={{ '--bin-accent': accentColor }} />
                  
                        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="space-y-2.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2.5">
                              <CategoryPill category={cat} language={language} size="md" />
                              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-uncp-verde-pale/50">
                                {categoryIcons[cat.id] || <Recycle className="w-4 h-4" />}
                                <span className="font-medium text-text-secondary text-sm">{name}</span>
                              </div>
                            </div>
                            <p className="text-xs text-text-secondary leading-relaxed text-justify">{desc}</p>
                      
                            {/* Category stats/badges */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-uncp-verde-pale text-uncp-verde uppercase tracking-wide border border-uncp-verde/20">
                                {t('education_container')}: {color}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end sm:self-auto shrink-0 space-y-1.5">
                                                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-uncp-verde-pale/50">
                                                  {categoryIcons[cat.id] || <Recycle className="w-6 h-6" />}
                                                </div>
                                              </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* EcoDato Ambiental Cards (FASE 7) - Enhanced with category colors */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, type: 'spring', stiffness: 260, damping: 25 }}
                    className="space-y-3"
                  >
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      {t('education_ecodato_title')}
                    </h4>
              
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* EcoDato 1 - Plastics */}
                      <div className="ecodato-card p-4 bg-white border border-uncp-verde/20">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-uncp-verde/10">
                            <Recycle className="w-5 h-5 text-uncp-verde" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-text-primary text-sm">{t('ecodato_plastico_title')}</h5>
                            <p className="text-xs text-text-secondary mt-1 leading-relaxed">{t('ecodato_plastico_message')}</p>
                          </div>
                        </div>
                      </div>

                      {/* EcoDato 2 - Organic */}
                      <div className="ecodato-card p-4 bg-white border border-uncp-verde/20">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-amber-100">
                            <Leaf className="w-5 h-5 text-amber-700" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-text-primary text-sm">{t('ecodato_organico_title')}</h5>
                            <p className="text-xs text-text-secondary mt-1 leading-relaxed">{t('ecodato_organico_message')}</p>
                          </div>
                        </div>
                      </div>

                      {/* EcoDato 3 - Paper/Cardboard */}
                      <div className="ecodato-card p-4 bg-white border border-uncp-verde/20">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50">
                            <TreePine className="w-5 h-5 text-blue-700" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-text-primary text-sm">{t('ecodato_papel_title')}</h5>
                            <p className="text-xs text-text-secondary mt-1 leading-relaxed">{t('ecodato_papel_message')}</p>
                          </div>
                        </div>
                      </div>

                      {/* EcoDato 4 - Glass */}
                      <div className="ecodato-card p-4 bg-white border border-uncp-verde/20">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-green-50">
                            <Recycle className="w-5 h-5 text-green-700" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-text-primary text-sm">{t('ecodato_vidrio_title')}</h5>
                            <p className="text-xs text-text-secondary mt-1 leading-relaxed">{t('ecodato_vidrio_message')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
    </div>
  );
};
