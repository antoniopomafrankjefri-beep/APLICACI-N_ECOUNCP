import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Sparkles, GraduationCap, TreePine, CheckCircle2, ArrowRight, Shield, Heart, Recycle, Globe } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { Language } from '../../types';

// EcoUNCP Logo component - Using official logo image
const EcoUNCPLogo = ({ size = 80, className = '' }) => (
  <img
    src="/logos/ecouncp/ecouncp-logo-official.jpg"
    alt="EcoUNCP - Universidad Nacional del Centro del Perú"
    className={className}
    width={size}
    height={size}
    style={{ objectFit: 'cover', borderRadius: '50%' }}
  />
);

interface WelcomeScreenProps {
  onComplete: () => void;
  language: Language;
}

const WELCOME_STEPS = [
  {
    id: 'welcome',
    characterState: 'welcome' as const,
    characterMessage: '¡Hola! Soy tu guía en EcoUNCP 🌿',
    titleKey: 'welcome_title',
    messageKey: 'welcome_message',
    icon: Leaf,
    iconColor: 'text-uncp-verde',
    bgGradient: 'from-uncp-verde-pale via-white to-uncp-dorado-pale',
  },
  {
    id: 'how-it-works',
    characterState: 'wave' as const,
    characterMessage: 'Te ayudo a clasificar todo ♻️',
    titleKey: 'how_title',
    messageKey: 'how_message',
    icon: Sparkles,
    iconColor: 'text-uncp-dorado',
    bgGradient: 'from-uncp-dorado-pale via-white to-uncp-verde-pale',
  },
  {
      id: 'norma',
      characterState: 'pointRight' as const,
      characterMessage: 'Infórmate y actúa correctamente 📋',
      titleKey: 'norm_title',
      messageKey: 'norm_message',
    icon: GraduationCap,
    iconColor: 'text-uncp-verde-dark',
    bgGradient: 'from-white via-uncp-verde-pale to-uncp-dorado-pale',
  },
  {
    id: 'ready',
    characterState: 'idle' as const,
    characterMessage: '¡Vamos a cuidar el campus! 💚',
    titleKey: 'ready_title',
    messageKey: 'ready_message',
    icon: TreePine,
    iconColor: 'text-uncp-verde',
    bgGradient: 'from-uncp-verde-pale via-white to-uncp-dorado-pale',
  },
] as const;

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onComplete, 
  language 
}) => {
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);
  const [showCharacter, setShowCharacter] = useState(false);
  const [characterMessage, setCharacterMessage] = useState('');
  const stepRef = useRef(currentStep);
  
  stepRef.current = currentStep;

  // Verificar si ya se mostró la bienvenida en esta sesión
  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('ecouncp_welcome_shown');
    if (hasSeenWelcome) {
      onComplete();
    }
  }, [onComplete]);

  // Animación de entrada del personaje
  useEffect(() => {
    setShowCharacter(false);
    setCharacterMessage('');
    
    const timer = setTimeout(() => {
      setShowCharacter(true);
      const step = WELCOME_STEPS[currentStep];
      if (step.characterMessage) {
        setTimeout(() => setCharacterMessage(step.characterMessage), 800);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleNext = useCallback(() => {
    if (currentStep < WELCOME_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      sessionStorage.setItem('ecouncp_welcome_shown', 'true');
      onComplete();
    }
  }, [currentStep, onComplete]);

  const handleSkip = useCallback(() => {
    sessionStorage.setItem('ecouncp_welcome_shown', 'true');
    onComplete();
  }, [onComplete]);

  const step = WELCOME_STEPS[currentStep];
  const isLastStep = currentStep === WELCOME_STEPS.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ 
        background: `linear-gradient(135deg, var(--color-uncp-verde-pale) 0%, var(--color-bg-primary) 50%, var(--color-uncp-dorado-pale) 100%)` 
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      {/* Fondo decorativo sutil */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-uncp-verde/5 blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-uncp-dorado/5 blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-uncp-verde/3 blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Indicador de progreso superior */}
        <div className="mb-6 flex items-center justify-center gap-2" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={WELCOME_STEPS.length}>
          {WELCOME_STEPS.map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: i === currentStep ? 1.2 : 1,
                backgroundColor: i <= currentStep ? 'var(--color-uncp-verde)' : 'var(--color-neutral-300)',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-2.5 h-2.5 rounded-full transition-colors"
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Tarjeta principal */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 25, delay: 0.1 }}
                  className="bg-white/95 backdrop-blur-md rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden"
                >
                  {/* EcoUNCP Logo - Área superior */}
                  <div className="relative px-6 pt-8 pb-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                        className="flex flex-col items-center"
                      >
                        {/* Logo EcoUNCP */}
                        <div className="relative mb-4">
                          <EcoUNCPLogo size={180} />
                  
                          {/* Elementos decorativos flotantes alrededor del logo */}
                          <motion.div
                            animate={{ 
                              rotate: [0, 3, 0, -3, 0],
                              y: [0, -5, 0, 5, 0]
                            }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute -top-4 -right-4 text-uncp-verde/30"
                          >
                            <Leaf className="w-6 h-6" />
                          </motion.div>
                          <motion.div
                            animate={{ 
                              rotate: [0, -2, 0, 2, 0],
                              y: [0, 5, 0, -5, 0]
                            }}
                            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                            className="absolute -top-8 left-4 text-uncp-dorado/30"
                          >
                            <Sparkles className="w-5 h-5" />
                          </motion.div>
                        </div>

                {/* Mensaje del personaje (fallback para pantallas pequeñas) */}
                <AnimatePresence mode="wait">
                  {showCharacter && characterMessage && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 25 }}
                      className="mt-4 px-4 py-3 bg-white rounded-2xl border border-neutral-200 shadow-lg text-center text-sm font-medium text-text-secondary max-w-xs"
                    >
                      {characterMessage}
                      <svg className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0" viewBox="0 0 16 8" fill="none">
                        <path d="M8 8 L0 0 L16 0 Z" fill="white" stroke="#E5E5E5" strokeWidth="1.5"/>
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Contenido textual - Área inferior */}
          <div className="px-6 sm:px-8 pb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ delay: 0.2, duration: 0.35, ease: 'easeOut' }}
                className="text-center space-y-3"
              >
                {/* Ícono decorativo */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 20 }}
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-2"
                  style={{ background: `linear-gradient(135deg, var(--color-uncp-verde-pale) 0%, var(--color-uncp-dorado-pale) 100%)` }}
                >
                  <step.icon className={`w-7 h-7 ${step.iconColor}`} />
                </motion.div>

                {/* Título */}
                <h2 id="welcome-title" className="text-h1 font-black text-text-primary leading-tight">
                  {t(step.titleKey)}
                </h2>

                {/* Mensaje */}
                <p className="text-body text-text-secondary leading-relaxed whitespace-pre-line">
                  {t(step.messageKey)}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Botón continuar / empezar */}
            <AnimatePresence mode="wait">
              <motion.button
                key={isLastStep ? 'start' : 'continue'}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="mt-6 w-full py-3.5 px-6 rounded-xl font-bold text-base shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                style={{ 
                  background: 'linear-gradient(135deg, var(--color-uncp-verde) 0%, var(--color-uncp-verde-dark) 100%)',
                  boxShadow: '0 10px 25px -5px rgba(85, 107, 47, 0.4), 0 8px 10px -6px rgba(85, 107, 47, 0.2)',
                }}
              >
                <span className="text-white">
                  {isLastStep 
                    ? (language === 'es' ? '¡Empezar!' : language === 'pt' ? 'Começar!' : 'Get Started!')
                    : (language === 'es' ? 'Continuar' : language === 'pt' ? 'Continuar' : 'Continue')
                  }
                </span>
                <ArrowRight className="w-5 h-5 text-white" />
              </motion.button>
            </AnimatePresence>

            {/* Botón saltar (solo en pasos intermedios) */}
            {!isLastStep && (
              <motion.button
                whileHover={{ color: 'var(--color-uncp-verde)' }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSkip}
                className="mt-4 w-full py-2 px-4 text-sm font-medium text-text-tertiary hover:text-text-primary transition-colors"
              >
                {language === 'es' ? 'Saltar presentación' : language === 'pt' ? 'Pular apresentação' : 'Skip intro'}
              </motion.button>
            )}

            {/* Footer institucional */}
            <div className="mt-8 pt-4 border-t border-neutral-100">
              {/* EcoDato Ambiental Card (FASE 7) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 25 }}
                className="ecodato-card p-4 mb-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center shadow-sm">
                    <Leaf className="w-6 h-6 text-eco-leaf" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-text-primary text-sm flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-eco-leaf/10 flex items-center justify-center">
                        <Leaf className="w-3 h-3 text-eco-leaf" />
                      </span>
                      <span className="text-eco-panda">{t('ecodato_title')}</span>
                    </h4>
                    <p className="text-text-secondary text-sm mt-1 leading-relaxed">
                      {t('ecodato_message')}
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex-shrink-0 text-eco-leaf/50"
                  >
                    <Globe className="w-6 h-6" />
                  </motion.div>
                </div>
              </motion.div>
              
              <p className="text-caption text-text-tertiary text-center">
                {language === 'es' 
                  ? 'Universidad Nacional del Centro del Perú • Huancayo'
                  : language === 'pt'
                  ? 'Universidade Nacional do Centro do Peru • Huancayo'
                  : 'National University of Central Peru • Huancayo'}
              </p>
              <p className="text-caption text-text-tertiary text-center mt-1">
                {language === 'es' 
                  ? 'Comprometidos con la sostenibilidad ambiental'
                  : language === 'pt'
                  ? 'Comprometidos com a sustentabilidade ambiental'
                  : 'Committed to environmental sustainability'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Indicador swipe/teclado */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-4 text-center text-caption text-text-tertiary"
        >
          {language === 'es' 
            ? 'Desliza o usa las teclas ← → para navegar'
            : language === 'pt'
            ? 'Deslize ou use as setas ← → para navegar'
            : 'Swipe or use ← → keys to navigate'}
        </motion.p>
      </div>

      {/* Navegación por teclado */}
      <div className="visually-hidden" aria-live="polite">
        Paso {currentStep + 1} de {WELCOME_STEPS.length}: {t(step.titleKey)}
      </div>
    </motion.div>
  );
};

export default WelcomeScreen;