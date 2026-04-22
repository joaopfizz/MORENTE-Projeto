import React, { useState } from 'react';
import { CheckCircle, XCircle, ArrowRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizPlayer({ lesson, onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  let questions = [];
  try {
    const parsed = JSON.parse(lesson.content_text || '{}');
    questions = parsed.questions || [];
  } catch {
    questions = [];
  }

  if (!questions.length) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Nenhuma questão encontrada neste quiz.</p>
      </div>
    );
  }

  const q = questions[currentQ];
  const isCorrect = selected === q.correct;
  const progress = ((currentQ) / questions.length) * 100;

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    if (isCorrect) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setConfirmed(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= 70;
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-12 text-center gap-6"
      >
        <div className={`w-24 h-24 rounded-full flex items-center justify-center ${passed ? 'bg-emerald-100' : 'bg-amber-100'}`}>
          <Award className={`w-12 h-12 ${passed ? 'text-emerald-600' : 'text-amber-600'}`} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900">{pct}% de Acerto</h2>
          <p className="text-slate-500 mt-2">{score} de {questions.length} questões corretas</p>
        </div>
        <div className={`px-6 py-3 rounded-full font-semibold text-lg ${passed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {passed ? '🎉 Aprovado! Parabéns!' : '📚 Continue estudando e tente novamente'}
        </div>
        <Button onClick={onComplete} className="bg-indigo-600 hover:bg-indigo-700 gap-2">
          Concluir Lição <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 max-w-3xl mx-auto w-full">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <Progress value={progress} className="flex-1 h-2" />
        <span className="text-sm text-slate-500 shrink-0">{currentQ + 1} / {questions.length}</span>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div className="bg-indigo-50 rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500 mb-2">Questão {currentQ + 1}</p>
            <h3 className="text-xl font-bold text-slate-900">{q.text}</h3>
          </div>

          <div className="grid gap-3">
            {q.options.map((opt, i) => {
              let className = "w-full text-left p-4 rounded-xl border-2 font-medium transition-all ";
              if (!confirmed) {
                className += selected === i 
                  ? "border-indigo-500 bg-indigo-50 text-indigo-900" 
                  : "border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 text-slate-700";
              } else {
                if (i === q.correct) className += "border-emerald-500 bg-emerald-50 text-emerald-900";
                else if (i === selected && !isCorrect) className += "border-red-400 bg-red-50 text-red-900";
                else className += "border-slate-100 text-slate-400";
              }
              return (
                <button key={i} onClick={() => !confirmed && setSelected(i)} className={className}>
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0
                      border-current">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                    {confirmed && i === q.correct && <CheckCircle className="w-5 h-5 text-emerald-500 ml-auto" />}
                    {confirmed && i === selected && !isCorrect && i !== q.correct && <XCircle className="w-5 h-5 text-red-500 ml-auto" />}
                  </div>
                </button>
              );
            })}
          </div>

          {!confirmed ? (
            <Button 
              onClick={handleConfirm} 
              disabled={selected === null}
              className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 text-base"
            >
              Confirmar Resposta
            </Button>
          ) : (
            <div className="space-y-3">
              <div className={`p-4 rounded-xl font-semibold text-center ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                {isCorrect ? '✅ Correto! Muito bem!' : '❌ Resposta incorreta. Continue!'}
              </div>
              <Button onClick={handleNext} className="w-full gap-2 bg-slate-900 hover:bg-slate-800 py-6">
                {currentQ < questions.length - 1 ? 'Próxima Questão' : 'Ver Resultado'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}