import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { ArrowLeft, ArrowRight, BrainCircuit, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

const PILLARS = [
  { id: 1, key: 'p1', name: 'Liderança Inspiradora', color: '#7c3aed', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', qs: ['p1q1','p1q2','p1q3'] },
  { id: 2, key: 'p2', name: 'Desenvolver Pessoas', color: '#2563eb', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', qs: ['p2q1','p2q2','p2q3'] },
  { id: 3, key: 'p3', name: 'Comunicação Assertiva', color: '#0891b2', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', qs: ['p3q1','p3q2','p3q3'] },
  { id: 4, key: 'p4', name: 'Capacidade Analítica', color: '#059669', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', qs: ['p4q1','p4q2','p4q3'] },
  { id: 5, key: 'p5', name: 'Planejamento Estratégico', color: '#d97706', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', qs: ['p5q1','p5q2','p5q3'] },
  { id: 6, key: 'p6', name: 'Execução e Disciplina', color: '#ea580c', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', qs: ['p6q1','p6q2','p6q3'] },
  { id: 7, key: 'p7', name: 'Gestão de Resultados', color: '#e11d48', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', qs: ['p7q1','p7q2','p7q3'] },
];

function getScore(answer) {
  if (!answer) return null;
  const n = parseInt(answer.charAt(0));
  return isNaN(n) ? null : n;
}

function computePillarScores(answers) {
  const scores = {};
  PILLARS.forEach(p => {
    const vals = p.qs.map(qId => {
      const ans = answers?.find(a => a.question_id === qId);
      return ans ? (getScore(ans.answer) || 3) : null;
    }).filter(v => v !== null);
    scores[p.key] = vals.length > 0
      ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 20)
      : 0;
  });
  return scores;
}

function getLevel(score) {
  if (score >= 80) return { label: 'Avançado', color: 'bg-emerald-100 text-emerald-700' };
  if (score >= 60) return { label: 'Intermediário', color: 'bg-blue-100 text-blue-700' };
  if (score >= 40) return { label: 'Em desenvolvimento', color: 'bg-amber-100 text-amber-700' };
  return { label: 'Atenção', color: 'bg-red-100 text-red-700' };
}

function ScoreBar({ value, color }) {
  return (
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  );
}

function PillarDetail({ pillar, answers, questionMap }) {
  const [openQ, setOpenQ] = useState(null);

  return (
    <div className={`rounded-xl border ${pillar.border} overflow-hidden`}>
      <div className={`${pillar.bg} px-4 py-3 flex items-center justify-between`}>
        <h4 className={`font-semibold text-sm ${pillar.text}`}>{pillar.id}. {pillar.name}</h4>
        <div className="flex items-center gap-2">
          {pillar.qs.map((qId, idx) => {
            const ans = answers?.find(a => a.question_id === qId);
            const score = ans ? getScore(ans.answer) : null;
            return (
              <div key={qId} className="flex items-center gap-1">
                <span className="text-xs text-slate-500">P{idx + 1}:</span>
                <span className={`text-xs font-bold ${pillar.text}`}>{score ? `${score}/5` : '—'}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {pillar.qs.map((qId, idx) => {
          const ans = answers?.find(a => a.question_id === qId);
          const score = ans ? getScore(ans.answer) : null;
          const questionText = questionMap[qId] || `Pergunta ${idx + 1}`;
          const isOpen = openQ === qId;

          return (
            <div key={qId} className="bg-white">
              <button
                className="w-full text-left px-4 py-3 flex items-start justify-between gap-3 hover:bg-slate-50 transition-colors"
                onClick={() => setOpenQ(isOpen ? null : qId)}
              >
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5`} style={{ backgroundColor: pillar.color }}>
                    {idx + 1}
                  </span>
                  <p className="text-sm text-slate-700 leading-snug line-clamp-2">{questionText}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {score && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getLevel(score * 20).color}`}>
                      {score}/5
                    </span>
                  )}
                  {ans?.comment && <MessageSquare className="w-3.5 h-3.5 text-slate-400" />}
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-3">
                  {ans ? (
                    <>
                      <div className={`rounded-lg p-3 ${pillar.bg} border ${pillar.border}`}>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Resposta escolhida</p>
                        <div className="flex items-start gap-2">
                          <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white`} style={{ backgroundColor: pillar.color }}>
                            {score}
                          </span>
                          <p className="text-sm text-slate-700">{ans.answer}</p>
                        </div>
                      </div>
                      {ans.comment ? (
                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                          <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> Evidência registrada
                          </p>
                          <p className="text-sm text-slate-700 italic">"{ans.comment}"</p>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">Nenhuma evidência registrada para esta pergunta.</p>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Pergunta não respondida.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ScannerResults({ response, onBack }) {
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiDone, setAiDone] = useState(false);
  const [questionMap, setQuestionMap] = useState({});

  // Load question texts from assessment
  useEffect(() => {
    const load = async () => {
      try {
        const assessment = await base44.entities.Assessment.get(response.assessment_id);
        const map = {};
        (assessment.questions || []).forEach(q => { map[q.id] = q.text; });
        setQuestionMap(map);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [response.assessment_id]);

  const scores = computePillarScores(response.answers);
  const avgScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 7);

  const radarData = PILLARS.map(p => ({
    subject: `P${p.id}`,
    value: scores[p.key] || 0,
    fullMark: 100
  }));

  // Sort pillars by score for strengths/gaps
  const sorted = [...PILLARS].sort((a, b) => (scores[b.key] || 0) - (scores[a.key] || 0));
  const strengths = sorted.filter(p => (scores[p.key] || 0) >= 65).slice(0, 3);
  const gaps = sorted.filter(p => (scores[p.key] || 0) < 60).reverse().slice(0, 3);

  const generateAIAnalysis = async () => {
    setLoadingAI(true);
    try {
      const scoresText = PILLARS.map(p => {
        const rawVals = p.qs.map(qId => {
          const ans = response.answers?.find(a => a.question_id === qId);
          return ans ? (getScore(ans.answer) || 3) : 3;
        });
        const avg = (rawVals.reduce((a, b) => a + b, 0) / rawVals.length).toFixed(1);
        return `${p.name}: média ${avg}/5 (${scores[p.key]}%)`;
      }).join('\n');

      const evidences = PILLARS.map(p => {
        const pillarAnswers = p.qs
          .map(qId => {
            const ans = response.answers?.find(a => a.question_id === qId);
            if (!ans || !ans.comment) return null;
            return `  - Nota ${getScore(ans.answer)}/5 | "${ans.comment}"`;
          })
          .filter(Boolean);
        if (!pillarAnswers.length) return null;
        return `${p.name}:\n${pillarAnswers.join('\n')}`;
      }).filter(Boolean).join('\n\n');

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Você é consultor sênior em desenvolvimento de liderança. Analise o diagnóstico abaixo e escreva um feedback executivo em português brasileiro.

SCORES POR PILAR (média das 3 perguntas, escala 0-100%):
${scoresText}

SCORE MÉDIO GERAL: ${avgScore}%

EVIDÊNCIAS ESCRITAS PELO LÍDER:
${evidences || 'Sem evidências registradas.'}

INSTRUÇÕES DE FORMATO:
Escreva exatamente em 3 blocos, separados por linha em branco:

**Visão Geral**
2-3 frases honestas e diretas sobre o perfil de liderança revelado pelo diagnóstico. Cite o score médio. Seja preciso: nem excessivamente positivo, nem pessimista. O líder precisa sentir que o resultado é um retrato fiel da sua realidade atual.

**O que os dados revelam**
Cite os 2 pilares mais fortes com o que isso diz sobre o estilo desse líder. Em seguida, cite os 2 pilares com maior gap — e seja criterioso: use as evidências escritas para mostrar que o diagnóstico é fundamentado no comportamento real, não em percepção. Seja acolhedor mas provocativo. O objetivo é que o líder reconheça os gaps sem se sentir atacado — mas também sem escapar deles.

**Seu próximo passo**
Conecte o resultado ao Acordo de Desenvolvimento que será construído com sua liderança direta. Diga que os gaps identificados aqui serão a base do plano de ação. Termine com uma frase que motive a ação, não o conforto.

Máximo 280 palavras. Tom: direto, respeitoso, provocador no bom sentido.`,
        model: 'claude_sonnet_4_6'
      });
      setAiAnalysis(result);
      setAiDone(true);
    } catch (err) {
      setAiAnalysis('Não foi possível gerar a análise no momento. Tente novamente.');
      setAiDone(true);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900">Relatório do Diagnóstico</h1>
          <p className="text-sm text-slate-500">Scanner de Liderança — 7 Pilares</p>
        </div>
        <div className="bg-indigo-600 text-white rounded-xl px-4 py-2 text-center">
          <p className="text-2xl font-bold">{avgScore}%</p>
          <p className="text-xs text-indigo-200">Score geral</p>
        </div>
      </div>

      {/* Radar + Score Bars */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-sm text-slate-600">Radar — Média por Pilar</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <ResponsiveContainer width="100%" height={230}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Radar name="Score" dataKey="value" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip formatter={(v) => [`${v}%`, 'Média']} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-sm text-slate-600">Score por Pilar (média das 3 perguntas)</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            {PILLARS.map(p => {
              const s = scores[p.key] || 0;
              const level = getLevel(s);
              // Show individual question scores
              const qScores = p.qs.map(qId => {
                const ans = response.answers?.find(a => a.question_id === qId);
                return ans ? (getScore(ans.answer) || 0) : 0;
              });
              return (
                <div key={p.key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-600 font-medium">{p.id}. {p.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{qScores.map(q => `${q}/5`).join(' · ')}</span>
                      <Badge className={`text-xs border-none px-2 py-0 ${level.color}`}>{s}%</Badge>
                    </div>
                  </div>
                  <ScoreBar value={s} color={p.color} />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Strengths & Gaps */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-emerald-200">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Pontos Fortes
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            {strengths.length > 0 ? strengths.map(p => (
              <div key={p.key} className="flex items-center justify-between bg-emerald-50 rounded-lg px-3 py-2">
                <span className="text-sm font-medium text-slate-700">{p.id}. {p.name}</span>
                <span className="text-sm font-bold text-emerald-700">{scores[p.key]}%</span>
              </div>
            )) : (
              <p className="text-sm text-slate-400 italic">Nenhum pilar com score ≥ 65%.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm text-amber-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Prioridades de Desenvolvimento
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            {gaps.length > 0 ? gaps.map(p => (
              <div key={p.key} className="flex items-center justify-between bg-amber-50 rounded-lg px-3 py-2">
                <span className="text-sm font-medium text-slate-700">{p.id}. {p.name}</span>
                <span className="text-sm font-bold text-amber-700">{scores[p.key]}%</span>
              </div>
            )) : (
              <p className="text-sm text-slate-400 italic">Nenhum pilar crítico identificado.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pillar detail — accordion per question */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Detalhamento por Pergunta</h3>
        <div className="space-y-3">
          {PILLARS.map(p => (
            <PillarDetail
              key={p.key}
              pillar={p}
              answers={response.answers}
              questionMap={questionMap}
            />
          ))}
        </div>
      </div>

      {/* AI Analysis */}
      <Card className="border-indigo-200">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
              Análise por Inteligência Artificial
            </CardTitle>
            {!aiDone && (
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 h-8 text-xs" onClick={generateAIAnalysis} disabled={loadingAI}>
                {loadingAI
                  ? <><span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />Analisando...</>
                  : <><Star className="w-3 h-3 mr-1" /> Gerar Análise</>}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {aiDone ? (
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{aiAnalysis}</div>
          ) : (
            <div className="text-center py-6">
              <BrainCircuit className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm text-slate-400">Clique em "Gerar Análise" para receber um feedback criterioso baseado nos seus resultados e evidências.</p>
              <p className="text-xs text-slate-300 mt-1">Powered by Claude Sonnet · ~15 segundos</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CTA */}
      <Button className="w-full bg-blue-700 hover:bg-blue-800" onClick={() => window.location.href = createPageUrl('Lidherar')}>
        Próximo passo: Construir meu Acordo de Desenvolvimento <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}