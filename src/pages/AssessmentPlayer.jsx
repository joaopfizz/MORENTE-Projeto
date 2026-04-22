import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

const PILLAR_COLORS = {
  1: 'bg-violet-500', 2: 'bg-blue-500', 3: 'bg-cyan-500', 4: 'bg-emerald-500',
  5: 'bg-amber-500', 6: 'bg-orange-500', 7: 'bg-rose-500',
};

export default function AssessmentPlayer() {
  const [assessment, setAssessment] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get('id');

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data = await base44.entities.Assessment.get(id);
        setAssessment(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const question = assessment?.questions?.[currentStep];
  const isAnswered = !!answers[question?.id] && (comments[question?.id] || '').trim().length >= 10;

  const handleNext = () => {
    if (currentStep < (assessment.questions?.length || 0) - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const user = await base44.auth.me();
      const answersArray = Object.entries(answers).map(([question_id, answer]) => ({
        question_id,
        answer,
        comment: comments[question_id] || ''
      }));

      const scoredAnswers = answersArray.filter(a => !isNaN(parseInt(a.answer?.charAt(0))));
      const avgScore = scoredAnswers.length > 0
        ? Math.round(scoredAnswers.reduce((acc, a) => acc + parseInt(a.answer?.charAt(0)), 0) / scoredAnswers.length * 20)
        : 70;

      if (user) {
        await base44.entities.AssessmentResponse.create({
          user_id: user.id,
          assessment_id: assessment.id,
          company_id: '',
          answers: answersArray,
          score: avgScore,
          status: 'completed',
        });
      }
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );
  if (!assessment) return <div className="p-8 text-center text-slate-500">Diagnóstico não encontrado.</div>;

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md w-full text-center p-8">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Diagnóstico Concluído!</h2>
          <p className="text-slate-500 mb-8">
            Suas respostas foram salvas. Acesse o Scanner para ver seu relatório completo com análise por IA.
          </p>
          <Button className="w-full mb-3 bg-indigo-600 hover:bg-indigo-700" onClick={() => window.location.href = createPageUrl('Scanner')}>
            Ver meu Relatório
          </Button>
          <Button variant="outline" className="w-full" onClick={() => window.location.href = createPageUrl('Dashboard')}>
            Voltar ao Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const progress = (currentStep / (assessment.questions?.length || 1)) * 100;
  const pillar = question?.pillar;
  const pillarColor = PILLAR_COLORS[pillar] || 'bg-indigo-500';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Sair
        </Button>
        <div className="text-xs font-medium text-slate-500">
          {currentStep + 1} / {assessment.questions?.length}
        </div>
        <div className="text-xs text-slate-400 hidden md:block">
          {question?.pillar_name}
        </div>
      </div>

      <Progress value={progress} className="h-1 rounded-none bg-slate-200" />

      <div className="flex-1 flex items-start justify-center p-4 md:p-8 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-2xl space-y-4"
          >
            {/* Pillar tag */}
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 ${pillarColor} rounded-full text-white text-xs font-bold flex items-center justify-center`}>{pillar}</div>
              <span className="text-sm font-medium text-slate-500">{question?.pillar_name}</span>
            </div>

            <Card className="shadow-lg border-none">
              <CardHeader>
                <CardTitle className="text-lg leading-snug">{question?.text}</CardTitle>
                {question?.context && (
                  <div className="mt-2 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-700">Contexto: </span>{question.context}
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Scale / Single Choice */}
                {(question?.type === 'scale' || question?.type === 'single_choice') && (
                  <RadioGroup
                    value={answers[question.id] || ''}
                    onValueChange={val => setAnswers(prev => ({ ...prev, [question.id]: val }))}
                    className="space-y-2"
                  >
                    {question.options?.map((opt, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 border p-3 rounded-xl transition-colors cursor-pointer
                          ${answers[question.id] === opt ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-200'}`}
                        onClick={() => setAnswers(prev => ({ ...prev, [question.id]: opt }))}
                      >
                        <RadioGroupItem value={opt} id={`opt-${idx}`} className="mt-0.5 shrink-0" />
                        <Label htmlFor={`opt-${idx}`} className="cursor-pointer text-sm text-slate-700 leading-snug">{opt}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {/* Mandatory comment */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <label className="text-sm font-semibold text-slate-700">
                      {question?.comment_prompt || 'Descreva uma evidência concreta que justifique sua nota:'}
                    </label>
                  </div>
                  <Textarea
                    placeholder="Seja específico: descreva uma situação real, o que você fez e qual foi o resultado..."
                    className="min-h-[100px] text-sm"
                    value={comments[question?.id] || ''}
                    onChange={e => setComments(prev => ({ ...prev, [question.id]: e.target.value }))}
                  />
                  <p className={`text-xs mt-1 ${(comments[question?.id] || '').length < 10 ? 'text-amber-500' : 'text-slate-400'}`}>
                    {(comments[question?.id] || '').length} caracteres {(comments[question?.id] || '').length < 10 ? '(mínimo 10)' : '✓'}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-slate-50/50 rounded-b-xl pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(p => p - 1)} disabled={currentStep === 0}>
                  Anterior
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!isAnswered || submitting}
                  className="bg-indigo-600 hover:bg-indigo-700 min-w-[110px]"
                >
                  {submitting ? 'Salvando...' : currentStep === (assessment.questions?.length - 1) ? 'Concluir' : 'Próxima'}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}