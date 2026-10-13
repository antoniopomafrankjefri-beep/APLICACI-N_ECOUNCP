import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Leaf, Sparkles, ArrowRight, GraduationCap, TreePine } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { Language } from '../types';

interface WelcomeScreenProps {
  onComplete: () => void;
  language: Language;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete, language }) => {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [showCharacter, setShowCharacter] = useState(false);

  const steps = [
    {
      title: language === 'es' ? '¡Bienvenido a EcoUNCP!' : language === 'pt' ? 'Bem-vindo ao EcoUNCP!' : 'Welcome to EcoUNCP!',
      message: language === 'es' 
        ? 'Tu asistente para segregar residuos y encontrar puntos de acopio en el campus UNCP Huancayo.'
        : language === 'pt'
        ? 'Seu assistente para separar resíduos e encontrar pontos de coleta no campus UNCP Huancayo.'
        : 'Your assistant to sort waste and find disposal points on the UNCP Huancayo campus.',
      icon: Leaf,
      character: '🌱',
    },
    {
      title: language === 'es' ? '¿Cómo funciona?' : language === 'pt' ? 'Como funciona?' : 'How it works?',
      message: language === 'es'
        ? '1️⃣ Busca tu residuo\n2️⃣ Descubre su contenedor y color\n3️⃣ Encuentra el punto más cercano en el mapa\n4️⃣ ¡Aprende y gana puntos con el Quiz!'
        : language === 'pt'
        ? '1️⃣ Busque seu resíduo\n2️⃣ Descubra seu recipiente e cor\n3️⃣ Encontre o ponto mais próximo no mapa\n4️⃣ Aprenda e ganhe pontos com o Quiz!'
        : '1️⃣ Search your waste\n2️⃣ Discover its bin and color\n3️⃣ Find the nearest point on map\n4️⃣ Learn and earn points with Quiz!',
      icon: Sparkles,
      character: '✨',
    },
    {
      title: language === 'es' ? 'Norma NTP 900.058:2019' : language === 'pt' ? 'Norma NTP 900.058:2019' : 'NTP 900.058:2019 Standard',
      message: language === 'es'
        ? 'Aplicamos el código de colores oficial peruano: Blanco (Plásticos), Azul (Papel), Negro/Gris (No aprovechables/Inorgánicos), Verde (Vidrio), Amarillo (Metales), Marrón (Orgánicos), Rojo (Peligrosos).'
        : language === 'pt'
        ? 'Aplicamos o código de cores oficial peruano: Branco (Plásticos), Azul (Papel), Preto/Cinza (Não aproveitáveis/Inorgânicos), Verde (Vidro), Amarelo (Metais), Marrom (Orgânicos), Vermelho (Perigosos).'
        : 'We apply the official Peruvian color code: White (Plastics), Blue (Paper), Black/Gray (Non-recyclable/Inorganics), Green (Glass), Yellow (Metals), Brown (Organics), Red (Hazardous).',
      icon: GraduationCap,
      character: '🎓',
    },
    {
      title: language === 'es' ? '¡Listo para empezar!' : language === 'pt' ? 'Pronto para começar!' : 'Ready to start!',
      message: language === 'es'
        ? 'Funciona 100% offline. Tu ubicación GPS y el mapa del campus están siempre disponibles.'
        : language === 'pt'
        ? 'Funciona 100% offline. Sua localização GPS e o mapa do campus estão sempre disponíveis.'
        : 'Works 100% offline. Your GPS location and campus map are always available.',
      icon: TreePine,
      character: '🌲',
    },
  ];

  const currentStep = steps[step];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCharacter(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [step]);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setShowCharacter(false);
      setTimeout(() => setStep(step + 1), 200);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
      <div className="w-full max-w-md">
        {/* Animated Character */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
          className="flex justify-center mb-4"
        >
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-5xl shadow-lg shadow-emerald-400/30">
              {currentStep.character}
            </div>
            {/* Speech bubble */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-64 bg-white rounded-2xl shadow-lg border border-emerald-100 p-3 text-center text-sm text-slate-700 font-medium"
            >
              {step === 0 && language === 'es' && '¡Hola! Soy Eco, tu guía verde 🌿'}
              {step === 0 && language === 'pt' && 'Oi! Sou o Eco, seu guia verde 🌿'}
              {step === 0 && language === 'en' && 'Hi! I\'m Eco, your green guide 🌿'}
              {step === 1 && language === 'es' && 'Te ayudo a clasificar todo ♻️'}
              {step === 1 && language === 'pt' && 'Te ajudo a classificar tudo ♻️'}
              {step === 1 && language === 'en' && 'I help you classify everything ♻️'}
              {step === 2 && language === 'es' && 'Promovemos una correcta segregación de residuos📋'}
              {step === 2 && language === 'pt' && 'Conhecemos a norma de cor 📋'}
              {step === 2 && language === 'en' && 'We know the standard by heart 📋'}
              {step === 3 && language === 'es' && '¡Vamos a cuidar el campus! 💚'}
              {step === 3 && language === 'pt' && 'Vamos cuidar o campus! 💚'}
              {step === 3 && language === 'en' && 'Let\'s take care of campus! 💚'}
              <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent border-t-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/95 backdrop-blur-md rounded-3xl border border-emerald-100 shadow-xl p-6 sm:p-8 text-center"
        >
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white">
                <currentStep.icon className="w-6 h-6" />
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {currentStep.title}
            </h2>

            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {currentStep.message}
            </p>
          </motion.div>

          {/* Progress dots */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {steps.map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: i === step ? 1.2 : 1 }}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === step ? 'bg-emerald-500' : 'bg-emerald-200'
                }`}
              />
            ))}
          </div>

          {/* Next/Start button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="mt-8 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-base shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
          >
            <span>
              {step < steps.length - 1
                ? language === 'es'
                  ? 'Continuar'
                  : language === 'pt'
                  ? 'Continuar'
                  : 'Continue'
                : language === 'es'
                ? '¡Empezar!'
                : language === 'pt'
                ? 'Começar!'
                : 'Get Started!'}
            </span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          <p className="mt-4 text-xs text-slate-400">
            {language === 'es' ? 'Desarrollado para UNCP Huancayo' : language === 'pt' ? 'Desenvolvido para UNCP Huancayo' : 'Developed for UNCP Huancayo'}
          </p>
        </motion.div>
      </div>
    </div>
  );
};