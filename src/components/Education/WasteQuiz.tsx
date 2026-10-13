import React, { useState } from 'react';
import { Language } from '../../types';
import { CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '¿En qué contenedor debe depositarse una servilleta de papel usada con restos de grasa o comida?',
    options: [
      'Contenedor Azul (Papel y Cartón)',
      'Contenedor Negro (No Aprovechables)',
      'Contenedor Marrón (Orgánicos)',
      'Contenedor Blanco (Plásticos)',
    ],
    correctIndex: 1,
    explanation: 'Correcto. Las fibras manchadas con grasa no se pueden reciclar y estropean el hidropulpado. Va al tacho negro.',
  },
  {
    id: 2,
    question: '¿Qué paso previo es fundamental antes de tirar una botella plástica de gaseosa en el contenedor blanco?',
    options: [
      'Llenarla con agua para que pese más',
      'Vaciar todo el líquido y aplastarla para reducir volumen',
      'Quitarle la etiqueta y quemarla',
      'Romperla en trozos con tijera',
    ],
    correctIndex: 1,
    explanation: 'Correcto. Los líquidos derramados estropean la recolección, y aplastarla ahorra hasta un 70% de espacio.',
  },
  {
    id: 3,
    question: 'Según la norma técnica NTP 900.058:2019, ¿qué color de contenedor corresponde al papel bond y cartón limpio?',
    options: [
      'Amarillo',
      'Verde',
      'Azul',
      'Blanco',
    ],
    correctIndex: 2,
    explanation: 'Correcto. El contenedor Azul es para papeles limpios, cartones, exámenes y fotocopias.',
  },
  {
    id: 4,
    question: '¿Por qué las pilas gastadas (AA, AAA) nunca deben tirarse al tacho de basura común de las aulas?',
    options: [
      'Porque atraen moscas',
      'Porque contienen metales pesados tóxicos que pueden contaminar miles de litros de agua',
      'Porque pesan mucho',
      'Porque se pueden volver a cargar si se dejan al sol',
    ],
    correctIndex: 1,
    explanation: 'Correcto. El mercurio, cadmio y plomo lixivian en el suelo. Deben ir exclusivamente al punto rojo de acopio de RAEE.',
  },
  {
    id: 5,
    question: '¿Una bolsa brillante y metalizada de papas fritas o galleta puede reciclarse en el contenedor amarillo de metales?',
    options: [
      'Sí, porque brilla como el aluminio',
      'No, es un plástico trilaminado no reciclable y va en el contenedor negro',
      'Sí, siempre que esté limpia',
      'Va en el contenedor marrón',
    ],
    correctIndex: 1,
    explanation: 'Correcto. Son empaques multicapa que fusionan plástico y película de aluminio que no se pueden separar mecánicamente.',
  },
];

export const WasteQuiz: React.FC<{ language: Language }> = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleFinish = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const totalQuestions = QUIZ_QUESTIONS.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  const score = QUIZ_QUESTIONS.reduce((acc, q) => {
    return selectedAnswers[q.id] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900">
            Mini-Test de Segregación Universitaria
          </h3>
          <p className="text-xs text-slate-700">
            5 preguntas rápidas para verificar tu conocimiento antes del descarte.
          </p>
        </div>

        {showResults && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Puntaje: {score} / {totalQuestions}</span>
          </div>
        )}
      </div>

      <div className="space-y-5">
        {QUIZ_QUESTIONS.map((q, idx) => {
          const selected = selectedAnswers[q.id];
          const isAnswered = selected !== undefined;
          const isCorrect = isAnswered && selected === q.correctIndex;

          return (
            <div key={q.id} className="space-y-2 p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                {idx + 1}. {q.question}
              </p>

              <div className="grid grid-cols-1 gap-1.5 pt-1">
                {q.options.map((opt, optIdx) => {
                  let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';

                  if (showResults) {
                    if (optIdx === q.correctIndex) {
                      btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                    } else if (selected === optIdx && optIdx !== q.correctIndex) {
                      btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 line-through';
                    }
                  } else if (selected === optIdx) {
                    btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`text-left text-xs p-2.5 rounded-lg border transition font-medium flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {showResults && optIdx === q.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                      )}
                      {showResults && selected === optIdx && optIdx !== q.correctIndex && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {showResults && (
                <div className={`mt-2 p-2 rounded-lg text-xs ${isCorrect ? 'bg-emerald-100/70 text-emerald-900' : 'bg-amber-100/70 text-amber-900'}`}>
                  <strong>{isCorrect ? '¡Excelente! ' : 'Explicación: '}</strong>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-2 flex items-center justify-between gap-3">
        {!showResults ? (
          <button
            onClick={handleFinish}
            disabled={answeredCount === 0}
            className={`w-full py-3 rounded-xl font-bold text-sm transition shadow-sm ${
              answeredCount > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Verificar respuestas ({answeredCount}/{totalQuestions})
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Intentar de nuevo</span>
          </button>
        )}
      </div>
    </div>
  );
};
