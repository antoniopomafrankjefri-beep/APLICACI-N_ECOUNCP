import React from 'react'
import { Category, Language } from '../../types';
import {
  FileText,
  Trash2,
  Wine,
  Disc,
  Apple,
  AlertTriangle,
  Milk,
  Layers,
  CircleDot,
  HelpCircle,
  Package,
} from 'lucide-react';

interface CategoryPillProps {
  category: Category;
  language: Language;
  size?: 'sm' | 'md' | 'lg';
  showColorName?: boolean;
}

export const getCategoryIcon = (iconName: string, className = 'w-4 h-4') => {
  switch (iconName) {
    case 'FileText':
      return <FileText className={className} />;
    case 'Trash2':
      return <Trash2 className={className} />;
    case 'Wine':
      return <Wine className={className} />;
    case 'Disc':
      return <Disc className={className} />;
    case 'Apple':
      return <Apple className={className} />;
    case 'AlertTriangle':
      return <AlertTriangle className={className} />;
    case 'Milk':
      return <Milk className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'CircleDot':
      return <CircleDot className={className} />;
    case 'Package':
      return <Package className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};

export const CategoryPill: React.FC<CategoryPillProps> = ({
  category,
  language,
  size = 'md',
  showColorName = true,
}) => {
  const colorName = category.containerColorName[language] || category.containerColorName.es;
  const catName = category.name[language] || category.name.es;

  const getContainerStyle = () => {
    // Use CSS variables from design system (FASE 3 - Unified Visual Identity)
    const binStyles: Record<string, string> = {
      plastico: 'bg-[var(--bin-plastico-bg)] text-[var(--bin-plastico-text)] border-[var(--bin-plastico-border)]',
      papel_carton: 'bg-[var(--bin-papel_carton-bg)] text-[var(--bin-papel_carton-text)] border-[var(--bin-papel_carton-border)]',
      no_aprovechable: 'bg-[var(--bin-no_aprovechable-bg)] text-[var(--bin-no_aprovechable-text)] border-[var(--bin-no_aprovechable-border)]',
      vidrio: 'bg-[var(--bin-vidrio-bg)] text-[var(--bin-vidrio-text)] border-[var(--bin-vidrio-border)]',
      metal: 'bg-[var(--bin-metal-bg)] text-[var(--bin-metal-text)] border-[var(--bin-metal-border)] font-semibold',
      organico: 'bg-[var(--bin-organico-bg)] text-[var(--bin-organico-text)] border-[var(--bin-organico-border)]',
      peligroso: 'bg-[var(--bin-peligroso-bg)] text-[var(--bin-peligroso-text)] border-[var(--bin-peligroso-border)]',
    };
    return binStyles[category.id] || 'bg-neutral-200 text-neutral-800 border-neutral-300';
  };

  const getColorNameStyle = () => {
    // Color name badge needs contrast against the pill background
    // Light backgrounds (plastico, metal) need dark text
    if (category.id === 'plastico' || category.id === 'metal') {
      return 'bg-black/10 text-neutral-900';
    }
    // Dark backgrounds need white text
    return 'bg-white/20 text-white';
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-lg border font-medium shadow-xs ${sizeClasses} ${getContainerStyle()}`}
      title={`${catName} - Contenedor color ${colorName}`}
    >
      <span className="shrink-0">{getCategoryIcon(category.iconName, size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')}</span>
      <span className="font-semibold">{catName}</span>
      {showColorName && (
        <span
          className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold tracking-wider ${getColorNameStyle()}`}
        >
          {colorName}
        </span>
      )}
    </span>
  );
};
