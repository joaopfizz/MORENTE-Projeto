import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Trophy, ArrowRight, Users, Star, Clock, Target, CheckCircle2, Upload, Flame, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const PILLAR_COLORS = {
  individual: 'bg-violet-100 text-violet-700',
  team: 'bg-blue-100 text-blue-700',
  department: 'bg-amber-100 text-amber-700',
  company_wide: 'bg-rose-100 text-rose-700',
};
const PILLAR_LABELS = {
  individual: 'Individual',
  team: 'Time',
  department: 'Departamento',
  company_wide: 'Empresa',
};

function ChallengeCard({ challenge, onReport }) {
  const [expanded, setExpanded] = useState(false);
  const daysLeft = challenge.deadline
    ? Math.max(0, Math.ceil((new Date(challenge.deadline) - new Date()) / 86400000))
    : null;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      {challenge.cover_image && (
        <div className="h-40 overflow-hidden">
          <img src={challenge.cover_image} alt={challenge.title} className="w-full h-full object-cover" />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className={`${PILLAR_COLORS[challenge.challenge_type]} border-none text-xs`}>
                {PILLAR_LABELS[challenge.challenge_type]}
              </Badge>
              <Badge className="bg-amber-50 text-amber-700 border-none text-xs flex items-center gap-1">
                <Star className="w-3 h-3" /> {challenge.points_reward} pts
              </Badge>
              {daysLeft !== null && (
                <Badge className={`border-none text-xs ${daysLeft <= 7 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                  <Clock className="w-3 h-3 mr-1" /> {daysLeft}d restantes
                </Badge>
              )}
            </div>
            <CardTitle className="text-base leading-snug">{challenge.title}</CardTitle>
            <CardDescription className="mt-1 text-sm line-clamp-2">{challenge.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-indigo-600 text-sm font-medium hover:text-indigo-800 mt-1"
        >
          {expanded ? <><ChevronUp className="w-4 h-4" /> Ocultar instruções</> : <><ChevronDown className="w-4 h-4" /> Ver instruções completas</>}
        </button>

        {expanded && (
          <div className="mt-3 space-y-3 text-sm text-slate-700">
            {challenge.objective && (
              <div className="bg-blue-50 rounded-lg p-3">
                <strong className="text-blue-800">Objetivo:</strong>
                <p className="mt-1 text-blue-700">{challenge.objective}</p>
              </div>
            )}
            <div className="bg-slate-50 rounded-lg p-3">
              <strong className="text-slate-700">Instruções:</strong>
              <div className="mt-1 whitespace-pre-line text-slate-600">{challenge.instructions}</div>
            </div>
            {challenge.success_criteria && (
              <div className="bg-emerald-50 rounded-lg p-3">
                <strong className="text-emerald-800">Critério de sucesso:</strong>
                <p className="mt-1 text-emerald-700">{challenge.success_criteria}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          className="w-full bg-amber-500 hover:bg-amber-600"
          onClick={() => onReport(challenge)}
        >
          <Upload className="w-4 h-4 mr-2" /> Reportar Conclusão
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function Athivar() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportChallenge, setReportChallenge] = useState(null);
  const [reportText, setReportText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await base44.entities.Challenge.filter({ status: 'active' });
        setChallenges(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmitReport = async () => {
    if (!reportText.trim()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitted(prev => [...prev, reportChallenge.id]);
    setReportChallenge(null);
    setReportText('');
    setSubmitting(false);
  };

  const totalPoints = submitted.reduce((acc, id) => {
    const ch = challenges.find(c => c.id === id);
    return acc + (ch?.points_reward || 0);
  }, 0);

  return (
    <div className="space-y-8">
      {/* Hero — compact */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-700 rounded-2xl px-6 py-5 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <Badge className="bg-white/20 text-white border-none mb-2 text-xs">Passo 4 da Jornada</Badge>
          <h1 className="text-2xl font-bold leading-tight">Athivar — Desafios Práticos</h1>
          <p className="text-white/70 text-sm mt-1">Pratique os <strong>7 Pilares</strong> em situações reais. Reporte e ganhe pontos.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-2 text-center">
            <p className="text-xl font-bold">{challenges.length}</p>
            <p className="text-white/60 text-xs">Ativos</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-2 text-center">
            <Flame className="w-5 h-5 mx-auto mb-0.5" />
            <p className="text-xl font-bold">{totalPoints}</p>
            <p className="text-white/60 text-xs">Pontos</p>
          </div>
        </div>
      </div>

      {/* Challenges */}
      {loading ? (
        <div className="text-slate-500">Carregando desafios...</div>
      ) : challenges.length > 0 ? (
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Desafios Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map(ch => (
              <div key={ch.id} className="relative">
                {submitted.includes(ch.id) && (
                  <div className="absolute inset-0 bg-emerald-50/95 backdrop-blur-sm rounded-xl z-10 flex flex-col items-center justify-center gap-3">
                    <div className="bg-emerald-100 rounded-full p-4">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <p className="font-bold text-emerald-800">Desafio Reportado!</p>
                    <Badge className="bg-emerald-200 text-emerald-800 border-none">+{ch.points_reward} pontos</Badge>
                  </div>
                )}
                <ChallengeCard challenge={ch} onReport={setReportChallenge} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">Nenhum desafio ativo</h3>
            <p className="text-slate-500">Aguarde novos desafios do seu RH/Líder.</p>
          </CardContent>
        </Card>
      )}

      {/* Next Step */}
      {submitted.length > 0 && (
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="p-6 flex flex-col md:flex-row items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl shrink-0">
              <Trophy className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-emerald-900">Próximo passo: Evoluthion</h3>
              <p className="text-emerald-700 text-sm">Você já tem dados suficientes para gerar seu relatório de jornada com Avaliação de Desempenho e Nine Box.</p>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700 shrink-0" onClick={() => window.location.href = createPageUrl('Evoluthion')}>
              Ver meu relatório <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Report Dialog */}
      <Dialog open={!!reportChallenge} onOpenChange={() => { setReportChallenge(null); setReportText(''); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Reportar conclusão</DialogTitle>
          </DialogHeader>
          {reportChallenge && (
            <div className="space-y-4">
              <div className="bg-amber-50 rounded-xl p-4">
                <p className="font-semibold text-amber-900">{reportChallenge.title}</p>
                <Badge className="bg-amber-200 text-amber-800 border-none mt-1">+{reportChallenge.points_reward} pontos</Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Descreva como você executou o desafio, o que aconteceu e quais foram os resultados:
                </label>
                <Textarea
                  placeholder="Ex: Realizei a reunião de visão na segunda-feira com 8 colaboradores. A reação inicial foi de tensão, mas ao apresentar os 5 pontos propostos, o clima mudou... Os colaboradores fizeram 3 compromissos claros..."
                  className="min-h-[140px]"
                  value={reportText}
                  onChange={e => setReportText(e.target.value)}
                />
                <p className="text-xs text-slate-400 mt-1">{reportText.length} caracteres</p>
              </div>
              <Button
                className="w-full bg-amber-500 hover:bg-amber-600"
                disabled={reportText.trim().length < 20 || submitting}
                onClick={handleSubmitReport}
              >
                {submitting ? 'Enviando...' : <><Send className="w-4 h-4 mr-2" /> Enviar Relato</>}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}