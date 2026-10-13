/**
 * EcoUNCP Design System Tokens
 * Tokens de diseño centralizados para consistencia visual institucional
 * Basado en identidad visual UNCP + normas de accesibilidad WCAG AA
 */

export const colors = {
  // Colores Institucionales UNCP (basados en escudo oficial)
  uncp: {
    verde: '#006000',        // Verde UNCP del escudo
    verdeDark: '#004000',    // Verde oscuro
    verdeLight: '#008000',   // Verde claro
    verdePale: '#E8F5E9',    // Verde muy pálido para fondos
    dorado: '#E0C000',       // Dorado/Amarillo oro UNCP del escudo
    doradoLight: '#F0D800',  // Dorado claro
    doradoDark: '#B89600',   // Dorado oscuro
    doradoPale: '#FFF8E1',   // Dorado muy pálido para fondos
    negro: '#000000',        // Negro institucional
    negroSuave: '#1A1A1A',   // Negro suave para textos
  },

  // Colores FIQ (Facultad de Ingeniería Química)
  fiq: {
    dorado: '#E0C000',       // Dorado compartido con UNCP
    azul: '#C0E0E0',         // Azul claro del emblema FIQ
    grisOscuro: '#404040',   // Gris oscuro
    grisMedio: '#606060',    // Gris medio
  },

  // Colores EcoUNCP (identidad propia del proyecto)
  eco: {
    negro: '#000000',        // Negro principal
    dorado: '#E0A000',       // Dorado ámbar del logo propio
    verde: '#60A020',        // Verde sostenibilidad del logo propio
    verdeOscuro: '#408020',  // Verde oscuro
    verdeClaro: '#81C784',   // Verde claro
  },

  // Colores semánticos (derivados de institucionales UNCP)
  semantic: {
    primary: '#006000',           // Verde UNCP principal
    primaryHover: '#004000',      // Verde UNCP hover
    primaryLight: '#E8F5E9',      // Verde UNCP fondo claro
    secondary: '#E0C000',         // Dorado UNCP secundario
    secondaryHover: '#B89600',    // Dorado UNCP hover
    secondaryLight: '#FFF8E1',    // Dorado UNCP fondo claro
    success: '#006000',           // Verde UNCP
    warning: '#E0C000',           // Dorado UNCP
    error: '#C62828',             // Rojo error (no institucional, pero estándar)
    info: '#1565C0',              // Azul info (no institucional, pero estándar)
  },

  // Colores de contenedores (NTP 900.058:2019) - COLORES OFICIALES NORMA PERUANA
  bins: {
    plastico: { 
      bg: '#FFFFFF', 
      text: '#1E293B', 
      border: '#CBD5E1', 
      icon: 'Milk',
      label: { es: 'Blanco', pt: 'Branco', en: 'White' },
      accent: '#94A3B8',
      markerBg: '#94A3B8',
      markerText: '#FFFFFF',
      markerRing: 'rgba(148, 163, 184, 0.4)'
    },
    papel_carton: { 
      bg: '#1E3A8A', 
      text: '#FFFFFF', 
      border: '#2563EB', 
      icon: 'FileText',
      label: { es: 'Azul', pt: 'Azul', en: 'Blue' },
      accent: '#2563EB',
      markerBg: '#2563EB',
      markerText: '#FFFFFF',
      markerRing: 'rgba(37, 99, 235, 0.4)'
    },
    no_aprovechable: { 
      bg: '#0A0A0A', 
      text: '#FFFFFF', 
      border: '#171717', 
      icon: 'Trash2',
      label: { es: 'Negro', pt: 'Preto', en: 'Black' },
      accent: '#171717',
      markerBg: '#171717',
      markerText: '#FFFFFF',
      markerRing: 'rgba(23, 23, 23, 0.4)'
    },
    peligroso: { 
      bg: '#DC2626', 
      text: '#FFFFFF', 
      border: '#EF4444', 
      icon: 'AlertTriangle',
      label: { es: 'Rojo', pt: 'Vermelho', en: 'Red' },
      accent: '#DC2626',
      markerBg: '#DC2626',
      markerText: '#FFFFFF',
      markerRing: 'rgba(220, 38, 38, 0.4)'
    },
    vidrio: { 
      bg: '#14532D', 
      text: '#FFFFFF', 
      border: '#16A34A', 
      icon: 'Wine',
      label: { es: 'Verde', pt: 'Verde', en: 'Green' },
      accent: '#16A34A',
      markerBg: '#16A34A',
      markerText: '#FFFFFF',
      markerRing: 'rgba(22, 163, 74, 0.4)'
    },
    metal: { 
      bg: '#FEF3C7', 
      text: '#713F12', 
      border: '#F59E0B', 
      icon: 'Disc',
      label: { es: 'Amarillo', pt: 'Amarelo', en: 'Yellow' },
      accent: '#F59E0B',
      markerBg: '#F59E0B',
      markerText: '#FFFFFF',
      markerRing: 'rgba(245, 158, 11, 0.4)'
    },
    organico: { 
      bg: '#78350F', 
      text: '#FFFFFF', 
      border: '#92400E', 
      icon: 'Apple',
      label: { es: 'Marrón', pt: 'Marrom', en: 'Brown' },
      accent: '#78350F',
      markerBg: '#78350F',
      markerText: '#FFFFFF',
      markerRing: 'rgba(120, 53, 15, 0.4)'
    },
  },

  // Paleta EcoDato / Badges informativos (usando colores institucionales)
  eco: {
    panda: '#4B5563',
    pandaLight: '#F3F4F6',
    leaf: '#006000',        // Verde UNCP
    earth: '#1565C0',
    recycle: '#E0C000',     // Dorado UNCP
    water: '#06B6D4',
  },

  // Neutrales - MÁS CONTRASTE
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },

  // Fondos
  background: {
    primary: '#FFFFFF',
    secondary: '#FAFAFA',
    tertiary: '#F0F2EB',
    card: '#FFFFFF',
    cardHover: '#F5F5F5',
    modal: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },

  // Texto - MÁS CONTRASTE
  text: {
    primary: '#1A1A1A',
    secondary: '#374151',
    tertiary: '#6B7280',
    inverse: '#FFFFFF',
    link: '#006000',        // Verde UNCP
    linkHover: '#004000',   // Verde UNCP oscuro
  },

  // Bordes - MÁS VISIBLES
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
    focus: '#006000',       // Verde UNCP
    error: '#C62828',
  },

  // Estados (usando colores institucionales)
  state: {
    hover: 'rgba(0, 96, 0, 0.1)',        // Verde UNCP
    active: 'rgba(0, 96, 0, 0.15)',      // Verde UNCP
    focus: 'rgba(0, 96, 0, 0.25)',       // Verde UNCP
    disabled: 'rgba(115, 115, 115, 0.4)',
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.375rem',    // 6px
  md: '0.5rem',      // 8px
  lg: '0.75rem',     // 12px
  xl: '1rem',        // 16px
  '2xl': '1.5rem',   // 24px
  full: '9999px',
} as const;

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    display: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
    '5xl': ['3rem', { lineHeight: '1' }],         // 48px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
    wider: '0.04em',
    uppercase: '0.08em',
  },
} as const;

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  focus: '0 0 0 3px rgba(85, 107, 47, 0.4)',
  focusError: '0 0 0 3px rgba(168, 64, 64, 0.4)',
} as const;

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  spring: '400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  toast: 800,
} as const;

export const animation = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

// Tipos derivados para TypeScript
export type ColorScale = typeof colors.neutral;
export type SpacingScale = typeof spacing;
export type BorderRadiusScale = typeof borderRadius;
export type FontSizeScale = typeof typography.fontSize;
export type ShadowScale = typeof shadows;
export type TransitionScale = typeof transitions;
export type ZIndexScale = typeof zIndex;