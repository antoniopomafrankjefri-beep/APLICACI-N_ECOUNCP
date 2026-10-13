/**
 * Tipos para GuideCharacter
 * Centraliza la definición de estados y props del personaje guía
 */

export type GuideCharacterState = 
  | 'idle' 
  | 'wave' 
  | 'pointLeft' 
  | 'pointRight' 
  | 'speak' 
  | 'welcome';

export interface GuideCharacterProps {
  /** Estado de animación actual del personaje */
  state?: GuideCharacterState;
  /** Tamaño en píxeles (ancho = alto, mantiene aspect ratio) */
  size?: number;
  /** Mensaje opcional para mostrar en burbuja de habla */
  message?: string;
  /** Dirección hacia donde mira/apunta el personaje */
  direction?: 'left' | 'right';
  /** Clases CSS adicionales */
  className?: string;
  /** Etiqueta ARIA para accesibilidad */
  ariaLabel?: string;
}

// Configuración de animaciones por estado
export const GUIDE_ANIMATION_CONFIG: Record<GuideCharacterState, {
  duration: string;
  easing: string;
  loop: boolean;
}> = {
  idle: { duration: '4s', easing: 'ease-in-out', loop: true },
  wave: { duration: '1.5s', easing: 'ease-in-out', loop: true },
  pointLeft: { duration: '2s', easing: 'ease-in-out', loop: true },
  pointRight: { duration: '2s', easing: 'ease-in-out', loop: true },
  speak: { duration: '0.5s', easing: 'ease-in-out', loop: true },
  welcome: { duration: '3s', easing: 'ease-out', loop: false },
};

// Mensajes institucionales predefinidos
export const GUIDE_MESSAGES = {
  welcome: [
    '¡Bienvenido a la Universidad Nacional del Centro del Perú!',
    'Gracias por contribuir al cuidado del medio ambiente.',
    'Tu participación ayuda a construir un campus más limpio y sostenible.',
    'Juntos protegemos nuestros espacios naturales.',
    'Cada acción responsable genera un impacto positivo para nuestra universidad.',
    'Gracias por ser parte del cambio.',
  ],
  guidance: [
    'Te encuentras cerca de esta ubicación. ¿Deseas conocer más información?',
    'Esta zona forma parte de las áreas verdes protegidas de la universidad.',
    'Aquí encontrarás servicios importantes para los estudiantes.',
    'Gracias por contribuir al cuidado de este espacio.',
  ],
  achievement: [
    '¡Excelente! Has clasificado correctamente el residuo.',
    'Bien hecho. Tu acción cuida el campus.',
    'Punto para el medio ambiente. ¡Continúa así!',
  ],
  environmental: [
    'Recuerda: cada residuo en su contenedor correcto.',
    'El reciclaje comienza con una buena separación.',
    'Los residuos orgánicos nutren nuestros jardines.',
    'Los plásticos reciclados vuelven a ser útiles.',
  ],
} as const;

export type GuideMessageCategory = keyof typeof GUIDE_MESSAGES;