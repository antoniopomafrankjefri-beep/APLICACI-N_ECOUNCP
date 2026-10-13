import React from 'react';
import { Search, MapPin, BookOpen, Database } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { Link } from 'react-router-dom';

export type ActiveTab = 'classifier' | 'map' | 'education' | 'survey';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  filteredCategoryCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  filteredCategoryCount,
}) => {
  const { t } = useI18n();

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; path: string; badge?: number }[] = [
    {
      id: 'classifier',
      label: t('nav_classify'),
      icon: <Search className="w-5 h-5" />,
      path: '/clasificador',
    },
    {
      id: 'map',
      label: t('nav_map'),
      icon: <MapPin className="w-5 h-5" />,
      path: '/mapa',
    },
    {
      id: 'education',
      label: t('nav_education'),
      icon: <BookOpen className="w-5 h-5" />,
      path: '/educacion',
    },
    {
      id: 'survey',
      label: t('nav_field_survey'),
      icon: <Database className="w-5 h-5" />,
      path: '/levantamiento',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 shadow-xl safe-area-inset-bottom">
      <div className="max-w-md mx-auto grid grid-cols-4 px-2 py-1.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Link
              key={tab.id}
              to={tab.path}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 text-[11px] font-semibold relative ${
                isActive
                  ? 'text-uncp-verde font-bold bg-uncp-verde-pale shadow-sm'
                  : 'text-text-tertiary hover:text-text-primary hover:bg-neutral-100'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                {tab.icon}
                {tab.id === 'map' && filteredCategoryCount !== undefined && filteredCategoryCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-uncp-verde animate-pulse" />
                )}
              </div>
              <span className="mt-1 tracking-tight leading-none truncate max-w-full">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};