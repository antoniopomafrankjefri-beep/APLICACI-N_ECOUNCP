/**
 * GuideCharacter - Personaje guía SVG vectorial semirrealista
 * Representa a un joven profesional UNCP con gorra y uniforme institucional
 * Estados: idle, wave, pointLeft, pointRight, speak, welcome
 * Placeholders para logos UNCP (gorra y pecho) - reemplazo fácil sin tocar lógica
 */

import React, { useEffect, useRef } from 'react';
import { GuideCharacterProps, GuideCharacterState } from './GuideCharacter.types';

const LOGO_UNCP = '/logos/uncp-logo.jpg';
const LOGO_FIQ = '/logos/fiq-logo.png';

export const GuideCharacter: React.FC<GuideCharacterProps> = ({
  state = 'idle',
  size = 200,
  message,
  direction = 'right',
  className = '',
  ariaLabel = 'Guía virtual UNCP',
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [animationsRef] = useRef<Map<string, number>>(new Map());

  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      animationsRef.current.forEach((id) => cancelAnimationFrame(id));
    };
  }, []);

  const getStateStyles = (state: GuideCharacterState) => {
    const baseStyles = {
      transformOrigin: 'center bottom',
      transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    };

    switch (state) {
      case 'idle':
        return { ...baseStyles, animation: 'idle-breathe 4s ease-in-out infinite' };
      case 'wave':
        return { ...baseStyles, animation: 'wave-arm 1.5s ease-in-out infinite' };
      case 'pointLeft':
        return { ...baseStyles, animation: 'point-left 2s ease-in-out infinite' };
      case 'pointRight':
        return { ...baseStyles, animation: 'point-right 2s ease-in-out infinite' };
      case 'speak':
        return { ...baseStyles, animation: 'speak-mouth 0.5s ease-in-out infinite' };
      case 'welcome':
        return { ...baseStyles, animation: 'welcome-sequence 3s ease-out forwards' };
      default:
        return baseStyles;
    }
  };

  const characterStyle = getStateStyles(state);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 200 280"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={{ 
        ...characterStyle,
        filter: 'drop-shadow(0 8px 24px rgba(85, 107, 47, 0.15))',
      } as React.CSSProperties}
    >
      <defs>
        {/* Animaciones CSS-in-SVG para mejor performance */}
        <style>{`@keyframes idle-breathe {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-3px) scale(1.005); }
          }
          @keyframes wave-arm {
            0%, 100% { transform: rotate(-15deg); }
            25% { transform: rotate(25deg); }
            50% { transform: rotate(-15deg); }
            75% { transform: rotate(20deg); }
          }
          @keyframes point-left {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-30deg); }
          }
          @keyframes point-right {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(30deg); }
          }
          @keyframes speak-mouth {
            0%, 100% { transform: scaleY(0.3); }
            50% { transform: scaleY(1); }
          }
          @keyframes welcome-sequence {
            0% { opacity: 0; transform: translateY(20px) scale(0.95); }
            20% { opacity: 1; transform: translateY(-5px) scale(1.02); }
            40% { transform: translateY(0) scale(1); }
            60% { transform: translateY(-3px) scale(1.005); }
            100% { transform: translateY(0) scale(1); }
          }
          .blink { animation: blink 4s ease-in-out infinite; }
          @keyframes blink {
            0%, 45%, 55%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(0.05); }
          }
          .pulse-gentle { animation: pulse-gentle 3s ease-in-out infinite; }
          @keyframes pulse-gentle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }`}</style>

        {/* Gradientes reutilizables */}
        <linearGradient id="skin-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F5D9C7"/>
          <stop offset="100%" stopColor="#E8C5A8"/>
        </linearGradient>
        <linearGradient id="uniform-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#556B2F"/>
          <stop offset="100%" stopColor="#3F4F1F"/>
        </linearGradient>
        <linearGradient id="cap-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#556B2F"/>
          <stop offset="100%" stopColor="#3F4F1F"/>
        </linearGradient>
        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D4B884"/>
          <stop offset="100%" stopColor="#B09058"/>
        </linearGradient>
        <linearGradient id="hair-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3D2B1F"/>
          <stop offset="100%" stopColor="#2D1F15"/>
        </linearGradient>
        <radialGradient id="cheek-blush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4A59A" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#D4A59A" stopOpacity="0"/>
        </radialGradient>
        <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#556B2F" floodOpacity="0.15"/>
        </filter>
      </defs>

      {/* GRUPO PRINCIPAL - Transformaciones de estado aplicadas aquí */}
      <g 
        id="character-root" 
        filter="url(#soft-shadow)"
        transform-origin="100 260"
      >
        {/* ========================================
             PIERNAS
             ======================================== */}
        <g id="legs">
          {/*  */}
          <path
            d="M70 200 L70 260"
            stroke="url(#uniform-gradient)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/*  */}
          <path
            d="M130 200 L130 260"
            stroke="url(#uniform-gradient)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/*  */}
          <ellipse cx="70" cy="262" rx="14" ry="8" fill="#2D2D2D"/>
          <ellipse cx="130" cy="262" rx="14" ry="8" fill="#2D2D2D"/>
        </g>

        {/* ========================================
             CUERPO / TORSO
             ======================================== */}
        <g id="torso">
          {/*  */}
          <path
            d="M55 130 
               Q45 130 45 145 
               L45 200 
               Q45 210 55 210 
               L145 210 
               Q155 210 155 200 
               L155 145 
               Q155 130 145 130 
               Z"
            fill="url(#uniform-gradient)"
          />
          {/*  */}
          <path
            d="M85 130 Q100 120 115 130 L105 138 Q100 142 95 138 Z"
            fill="#FFFFFF"
            opacity="0.95"
          />
          {/*  */}
          <g transform="translate(100, 135)">
            <path
              d="M0 -5 L-6 15 L6 15 Z"
              fill="#C9A86A"
            />
            <circle cx="0" cy="2" r="3" fill="#556B2F"/>
          </g>
          
          {/* LOGO UNCP EN PECHO (IZQUIERDO - ZONA CORAZÓN) */}
          <g id="logo-pecho" transform="translate(72, 148) scale(0.35)">
            <image
              href={LOGO_UNCP}
              width="128"
              height="128"
              preserveAspectRatio="xMidYMid meet"
            />
            {/* Badge ambiental pequeño */}
            <circle cx="45" cy="45" r="18" fill="#556B2F" opacity="0.9"/>
            <text x="45" y="50" fontFamily="Arial" fontSize="14" fontWeight="bold" fill="#C9A86A" textAnchor="middle" dy=".3em">♻</text>
          </g>

          {/*  */}
          <rect x="68" y="165" width="22" height="24" fill="#4A5D2A" rx="2"/>
          <rect x="75" y="162" width="4" height="28" fill="#C9A86A" rx="1"/>
        </g>

        {/* ========================================
             BRAZOS
             ======================================== */}
        <g id="arms">
          {/* Brazo IZQUIERDO */}
          <g id="arm-left" transform-origin="55 135">
            <path
              id="arm-left-path"
              d="M55 135 Q40 155 35 185"
              stroke="url(#uniform-gradient)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/*  */}
            <g id="hand-left" transform="translate(35, 185)" transform-origin="0 0">
              <ellipse cx="0" cy="0" rx="10" ry="7" fill="url(#skin-gradient)"/>
              <ellipse cx="-6" cy="-2" rx="3" ry="5" fill="url(#skin-gradient)"/> {/*  */}
            </g>
          </g>

          {/* Brazo DERECHO */}
          <g id="arm-right" transform-origin="145 135">
            <path
              id="arm-right-path"
              d="M145 135 Q160 155 165 185"
              stroke="url(#uniform-gradient)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/*  */}
            <g id="hand-right" transform="translate(165, 185)" transform-origin="0 0">
              <ellipse cx="0" cy="0" rx="10" ry="7" fill="url(#skin-gradient)"/>
              <ellipse cx="6" cy="-2" rx="3" ry="5" fill="url(#skin-gradient)"/> {/*  */}
            </g>
          </g>
        </g>

        {/* ========================================
             CABEZA
             ======================================== */}
        <g id="head" transform-origin="100 95">
          {/*  */}
          <path
            d="M85 130 Q85 125 90 125 Q110 125 115 130"
            fill="url(#skin-gradient)"
          />
          
          {/*  */}
          <ellipse cx="100" cy="80" rx="38" ry="42" fill="url(#skin-gradient)"/>
          
          {/* Orejas */}
          <ellipse cx="62" cy="80" rx="6" ry="10" fill="url(#skin-gradient)"/>
          <ellipse cx="138" cy="80" rx="6" ry="10" fill="url(#skin-gradient)"/>
          
          {/* Cabello - estilo profesional moderno */}
          <path
            d="M62 50 
               Q62 40 70 38 Q85 35 100 38 Q115 35 130 38 Q138 40 138 50
               Q138 55 130 58 Q100 62 70 58 Q62 55 62 50 Z"
            fill="url(#hair-gradient)"
          />
          {/*  */}
          <path
            d="M75 55 Q70 50 65 55 Q75 52 85 55"
            fill="#352518"
            opacity="0.8"
          />
          
          {/* GORRA UNCP */}
          <g id="cap" transform-origin="100 45">
            {/*  */}
            <path
              d="M55 55 Q55 48 65 45 Q100 42 135 45 Q145 48 145 55 Q100 58 100 55 Z"
              fill="url(#cap-gradient)"
            />
            {/*  */}
            <path
              d="M55 55 Q50 35 70 30 Q100 25 130 30 Q150 35 145 55 Z"
              fill="url(#cap-gradient)"
            />
            {/*  */}
            <circle cx="100" cy="32" r="4" fill="#3F4F1F"/>
            
            {/* LOGO UNCP EN GORRA (FRONTAL) */}
            <g id="logo-gorra" transform="translate(36, 20) scale(0.22)">
              <defs>
                <clipPath id="cap-logo-clip">
                  <ellipse cx="64" cy="64" rx="55" ry="40"/>
                </clipPath>
              </defs>
              <image
                href={LOGO_UNCP}
                width="128"
                height="128"
                clipPath="url(#cap-logo-clip)"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
            
            {/*  */}
            <path
              d="M60 55 Q100 50 140 55"
              stroke="#C9A86A"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
          </g>

          {/* ========================================
               ROSTRO
               ======================================== */}
          <g id="face">
            {/* Cejas */}
            <path
              d="M72 62 Q80 58 88 62"
              stroke="#3D2B1F"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M112 62 Q120 58 128 62"
              stroke="#3D2B1F"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            
            {/* Ojos - con parpadeo */}
            <g className="blink" transform-origin="80 72">
              {/*  */}
              <ellipse cx="80" cy="72" rx="9" ry="11" fill="#FFFFFF"/>
              <ellipse cx="80" cy="72" rx="4.5" ry="5.5" fill="#3D2B1F"/>
              <circle cx="77" cy="69" r="2" fill="#FFFFFF" opacity="0.9"/> {/*  */}
              
              {/*  */}
              <path
                d="M71 63 Q80 60 89 63"
                stroke="url(#skin-gradient)"
                strokeWidth="2"
                fill="none"
                opacity="0.8"
              />
            </g>
            
            <g className="blink" transform-origin="120 72">
              {/*  */}
              <ellipse cx="120" cy="72" rx="9" ry="11" fill="#FFFFFF"/>
              <ellipse cx="120" cy="72" rx="4.5" ry="5.5" fill="#3D2B1F"/>
              <circle cx="117" cy="69" r="2" fill="#FFFFFF" opacity="0.9"/>
              
              {/*  */}
              <path
                d="M111 63 Q120 60 129 63"
                stroke="url(#skin-gradient)"
                strokeWidth="2"
                fill="none"
                opacity="0.8"
              />
            </g>
            
            {/* Mejillas / sonrojo sutil */}
            <ellipse cx="68" cy="85" rx="10" ry="6" fill="url(#cheek-blush)"/>
            <ellipse cx="132" cy="85" rx="10" ry="6" fill="url(#cheek-blush)"/>
            
            {/* Nariz - estilo semirrealista */}
            <path
              d="M95 80 Q100 88 105 80 Q100 84 95 80"
              fill="#E8C5A8"
              opacity="0.9"
            />
            <ellipse cx="93" cy="82" rx="2.5" ry="2" fill="#D4B8A0"/>
            <ellipse cx="107" cy="82" rx="2.5" ry="2" fill="#D4B8A0"/>
            
            {/* Boca - animada para speak */}
            <g id="mouth" className={state === 'speak' ? 'speak-mouth' : ''} transform-origin="100 100">
              <path
                id="mouth-path"
                d="M88 100 Q100 106 112 100"
                stroke="#3D2B1F"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              {/*  */}
              <path
                d="M88 100 Q100 102 112 100"
                stroke="#C9A86A"
                strokeWidth="1"
                fill="none"
                opacity="0.5"
              />
            </g>
          </g>
        </g>
      </g>

      {/* ========================================
           MENSAJE / BURBUJA DE HABLA
           ======================================== */}
      {message && (
        <g id="speech-bubble" transform="translate(180, 60)">
          <path
            d="M0 0 
               L180 0 
               Q190 0 190 10 
               L190 50 
               Q190 60 180 60 
               L160 60 
               L140 75 
               L120 60 
               L0 60 
               Q-10 60 -10 50 
               L-10 10 
               Q-10 0 0 0 Z"
            fill="#FFFFFF"
            stroke="#E5E5E5"
            strokeWidth="1.5"
            filter="url(#soft-shadow)"
          />
          <foreignObject x="16" y="12" width="150" height="45">
            <div xmlns="http://www.w3.org/1999/xhtml" style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '12px',
              fontWeight: 500,
              color: '#222222',
              lineHeight: '1.4',
              textAlign: 'center',
              padding: '0 8px',
            }}>
              {message}
            </div>
          </foreignObject>
        </g>
      )}
    </svg>
  );
};

export default GuideCharacter;