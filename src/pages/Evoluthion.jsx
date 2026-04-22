import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { BarChart3, TrendingUp, Award, Star, CheckCircle2, ArrowRight, User, Download, Grid, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

const PILLARS = [
  { id: 1, name: 'Liderança Inspiradora', key: 'p1', color: '#7c3aed' },
  { id: 2, name: 'Desenvolver Pessoas', key: 'p2', color: '#2563eb' },
  { id: 3, name: 'Comunicação Assertiva', key: 'p3', color: '#0891b2' },
  { id: 4, name: 'Capacidade Analítica', key: 'p4', color: '#059669' },
  { id: 5, name: 'Planejamento Estratégico', key: 'p5', color: '#d97706' },
  { id: 6, name: 'Execução e Disciplina', key: 'p6', color: '#ea580c' },
  { id: 7, name: 'Gestão de Resultados', key: 'p7', color: '#e11d48' },
];

function computePillarScores(answers) {
  const pillarMap = {
    p1: ['p1q1', 'p1q2'], p2: ['p2q1', 'p2q2'], p3: ['p3q1', 'p3q2'],
    p4: ['p4q1', 'p4q2'], p5: ['p5q1', 'p5q2'], p6: ['p6q1', 'p6q2'], p7: ['p7q1', 'p7q2'],
  };
  const scores = {};
  for (const [key, qIds] of Object.entries(pillarMap)) {
    const vals = qIds.map(qId => {
      const ans = answers?.find(a => a.question_id === qId);
      return ans ? parseInt(ans.answer?.charAt(0)) || 3 : 3;
    });
    scores[key] = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 20);
  }
  return scores;
}

function getNineBoxPosition(score, challenges) {
  const performance = Math.min(100, score + challenges * 5);
  const potential = score;
  let col = performance < 50 ? 0 : performance < 75 ? 1 : 2;
  let row = potential < 50 ? 2 : potential < 75 ? 1 : 0;
  return { col, row, performance, potential };
}

const NINE_BOX_LABELS = [
  ['Estrela em Ascensão', 'Alto Potencial', 'Talento Consistente'],
  ['Dilema', 'Núcleo Sólido', 'Alto Desempenho'],
  ['Risco', 'Em Desenvolvimento', 'Profissional Técnico'],
];
const NINE_BOX_COLORS = [
  ['bg-emerald-500', 'bg-emerald-400', 'bg-emerald-300'],
  ['bg-blue-400', 'bg-blue-300', 'bg-blue-200'],
  ['bg-amber-300', 'bg-amber-200', 'bg-slate-200'],
];

function NineBox({ position }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-1.5">
        {[0, 1, 2].map(row =>
          [0, 1, 2].map(col => {
            const isActive = position.row === row && position.col === col;
            return (
              <div
                key={`${row}-${col}`}
                className={`relative rounded-lg p-2 text-center transition-all ${NINE_BOX_COLORS[row][col]} ${isActive ? 'ring-4 ring-slate-900 ring-offset-1 scale-105 shadow-lg' : 'opacity-70'}`}
              >
                <p className={`text-xs font-semibold ${isActive ? 'text-slate-900' : 'text-slate-600'} leading-tight`}>
                  {NINE_BOX_LABELS[row][col]}
                </p>
                {isActive && (
                  <div className="absolute -top-2 -right-2 bg-slate-900 rounded-full w-5 h-5 flex items-center justify-center">
                    <Star className="w-3 h-3 text-yellow-400" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <div className="flex justify-between text-xs text-slate-500 px-1">
        <span>← Baixo Desempenho</span>
        <span>Alto Desempenho →</span>
      </div>
    </div>
  );
}

function LeaderCard({ response, participant, completedChallenges }) {
  const scores = computePillarScores(response.answers);
  const avgScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 7);
  const nineBox = getNineBoxPosition(avgScore, completedChallenges);
  const radarData = PILLARS.map(p => ({ subject: `P${p.id}`, value: scores[p.key] || 0, fullMark: 100 }));

  const strengths = PILLARS.filter(p => (scores[p.key] || 0) >= 75).map(p => p.name);
  const gaps = PILLARS.filter(p => (scores[p.key] || 0) < 60).map(p => p.name);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{participant?.full_name || response.user_id}</CardTitle>
            <CardDescription className="text-slate-300 mt-1">
              {participant?.position} • {participant?.department}
            </CardDescription>
          </div>
          <div className="text-center">
            <div className="bg-white/20 rounded-xl px-4 py-2">
              <p className="text-2xl font-bold">{avgScore}%</p>
              <p className="text-xs text-white/60">Score geral</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Radar */}
          <div>
            <h4 className="font-semibold text-slate-700 mb-3 text-sm">Radar dos 7 Pilares</h4>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Radar name="Score" dataKey="value" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.25} strokeWidth={2} />
                <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Nine Box */}
          <div>
            <h4 className="font-semibold text-slate-700 mb-3 text-sm">Nine Box — Posicionamento</h4>
            <NineBox position={nineBox} />
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 rounded-lg p-2 text-center">
                <p className="text-slate-500">Desempenho</p>
                <p className="font-bold text-slate-800">{nineBox.performance}%</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2 text-center">
                <p className="text-slate-500">Potencial</p>
                <p className="font-bold text-slate-800">{nineBox.potential}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar Bars */}
        <div>
          <h4 className="font-semibold text-slate-700 mb-3 text-sm">Detalhamento por Pilar</h4>
          <div className="space-y-2.5">
            {PILLARS.map(p => (
              <div key={p.key} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-40 shrink-0">{p.id}. {p.name}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all duration-700"
                    style={{ width: `${scores[p.key] || 0}%`, backgroundColor: p.color }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-700 w-10 text-right">{scores[p.key] || 0}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="grid md:grid-cols-2 gap-4">
          {strengths.length > 0 && (
            <div className="bg-emerald-50 rounded-xl p-4">
              <h5 className="font-semibold text-emerald-800 text-sm mb-2 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Pontos fortes
              </h5>
              <ul className="space-y-1">
                {strengths.map(s => <li key={s} className="text-xs text-emerald-700">• {s}</li>)}
              </ul>
            </div>
          )}
          {gaps.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-4">
              <h5 className="font-semibold text-amber-800 text-sm mb-2 flex items-center gap-1">
                <Target className="w-4 h-4" /> Prioridade de desenvolvimento
              </h5>
              <ul className="space-y-1">
                {gaps.map(g => <li key={g} className="text-xs text-amber-700">• {g}</li>)}
              </ul>
            </div>
          )}
        </div>

        {response.feedback && (
          <div className="bg-indigo-50 rounded-xl p-4 text-sm text-indigo-800">
            <strong>Feedback do diagnóstico:</strong> {response.feedback}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Evoluthion() {
  const [responses, setResponses] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [myResponse, setMyResponse] = useState(null);
  const [viewMode, setViewMode] = useState('personal');

  useEffect(() => {
    const load = async () => {
      try {
        const u = await base44.auth.me();
        setUser(u);
        const [allResponses, allParticipants] = await Promise.all([
          base44.entities.AssessmentResponse.filter({ status: 'completed' }),
          base44.entities.Participant.list()
        ]);
        setResponses(allResponses);
        setParticipants(allParticipants);
        if (u) {
          const mine = allResponses.find(r => r.user_id === u.id);
          setMyResponse(mine);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getParticipant = (userId) => participants.find(p => p.email?.includes(userId) || userId?.includes(p.email)) || null;

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  // Responses to show
  const responsesToShow = viewMode === 'personal'
    ? (myResponse ? [myResponse] : [])
    : responses;

  const avgCompanyScore = responses.length > 0
    ? Math.round(responses.reduce((acc, r) => acc + (r.score || 0), 0) / responses.length)
    : 0;

  return (
    <div className="space-y-8">
      {/* Hero — compact */}
      <div className="bg-gradient-to-br from-emerald-700 to-teal-900 rounded-2xl px-6 py-5 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <Badge className="bg-white/20 text-white border-none mb-2 text-xs">Passo 5 da Jornada</Badge>
          <h1 className="text-2xl font-bold leading-tight">Evoluthion — Avaliação de Desempenho</h1>
          <p className="text-white/70 text-sm mt-1">Radar dos 7 Pilares, Nine Box e análise de continuidade.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-2 text-center">
            <p className="text-xl font-bold">{responses.length}</p>
            <p className="text-white/60 text-xs">Avaliados</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-2 text-center">
            <p className="text-xl font-bold">{avgCompanyScore}%</p>
            <p className="text-white/60 text-xs">Score médio</p>
          </div>
        </div>
      </div>

      {/* View Toggle for Admin */}
      {isAdmin && (
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'personal' ? 'default' : 'outline'}
            onClick={() => setViewMode('personal')}
            className={viewMode === 'personal' ? 'bg-teal-700 hover:bg-teal-800' : ''}
          >
            <User className="w-4 h-4 mr-2" /> Meu Relatório
          </Button>
          <Button
            variant={viewMode === 'team' ? 'default' : 'outline'}
            onClick={() => setViewMode('team')}
            className={viewMode === 'team' ? 'bg-teal-700 hover:bg-teal-800' : ''}
          >
            <Grid className="w-4 h-4 mr-2" /> Visão do Time ({responses.length} líderes)
          </Button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="text-slate-500">Gerando relatório...</div>
      ) : responsesToShow.length > 0 ? (
        <div className="space-y-6">
          {responsesToShow.map(resp => (
            <LeaderCard
              key={resp.id}
              response={resp}
              participant={getParticipant(resp.user_id)}
              completedChallenges={1}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">Nenhum resultado disponível ainda</h3>
            <p className="text-slate-500 mb-6">Complete o Scanner de Liderança para gerar seu relatório de jornada.</p>
            <Button className="bg-teal-700 hover:bg-teal-800" onClick={() => window.location.href = createPageUrl('Scanner')}>
              Iniciar o Scanner <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Nine Box Legend */}
      {responsesToShow.length > 0 && viewMode === 'team' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Grid className="w-5 h-5 text-teal-600" /> Legenda — Nine Box de Desempenho e Potencial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {[0,1,2].map(row => [0,1,2].map(col => (
                <div key={`${row}-${col}`} className={`rounded-lg p-3 ${NINE_BOX_COLORS[row][col]}`}>
                  <p className="font-semibold text-slate-800 text-xs">{NINE_BOX_LABELS[row][col]}</p>
                  <p className="text-xs text-slate-600 mt-1">
                    {row === 0 ? 'Alto Potencial' : row === 1 ? 'Médio Potencial' : 'Baixo Potencial'} ·
                    {col === 2 ? ' Alto Desempenho' : col === 1 ? ' Médio Desempenho' : ' Baixo Desempenho'}
                  </p>
                </div>
              )))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}