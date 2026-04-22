import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import {
  ClipboardCheck,
  Users,
  Plus,
  ArrowRight,
  ChevronRight,
  FileText,
  CheckCircle2,
  Clock,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { calcScore } from '@/lib/paacConfig';
import PaacForm from '@/components/scanner/PaacForm';

function TypeBadge({ type }) {
  return (
    <Badge
      className={`text-[10px] uppercase tracking-wider font-semibold border-none ${
        type === 'demanda'
          ? 'bg-violet-100 text-violet-700'
          : 'bg-sky-100 text-sky-700'
      }`}
    >
      {type === 'demanda' ? 'Demanda' : 'PDV'}
    </Badge>
  );
}

function EvalCard({ ev, onClick }) {
  const score = calcScore(ev.scores || {});
  const isComplete = ev.status === 'completed';
  return (
    <button
      onClick={() => onClick(ev)}
      className="w-full text-left flex items-center gap-4 p-3 rounded-xl border border-ink-100 hover:border-gold-300 hover:bg-gold-50/30 transition-all group"
    >
      <div
        className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 font-display text-sm font-semibold ${
          isComplete
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-amber-100 text-amber-700'
        }`}
      >
        {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <TypeBadge type={ev.type} />
          <span className="text-xs text-ink-500">
            {new Date(ev.evaluation_date).toLocaleDateString('pt-BR')}
          </span>
        </div>
        {isComplete && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-paper-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-500 to-gold-300"
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-ink-700 tabular-nums w-8 text-right">
              {score}%
            </span>
          </div>
        )}
        {!isComplete && (
          <p className="text-xs text-amber-600 mt-0.5 font-medium">Rascunho — incompleto</p>
        )}
      </div>
      <ChevronRight className="w-4 h-4 text-ink-300 group-hover:text-gold-500 transition-colors" />
    </button>
  );
}

function RepCard({ rep, evals, onSelect }) {
  const latest = evals
    .filter((e) => e.rep_email === rep.email && e.status === 'completed')
    .sort((a, b) => new Date(b.evaluation_date) - new Date(a.evaluation_date))[0];

  const score = latest ? calcScore(latest.scores || {}) : null;
  const evalCount = evals.filter((e) => e.rep_email === rep.email).length;

  return (
    <button
      onClick={() => onSelect(rep)}
      className="w-full text-left bg-white rounded-2xl border border-ink-100 hover:border-gold-300 hover:shadow-soft transition-all group p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-11 w-11 rounded-full bg-ink-900 flex items-center justify-center shrink-0">
            <span className="font-display text-lg font-semibold text-gold-300">
              {rep.full_name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-ink-900 truncate">{rep.full_name}</p>
            <p className="text-xs text-ink-500 truncate">{rep.position || rep.email}</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-ink-300 group-hover:text-gold-500 mt-1 shrink-0 transition-colors" />
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="text-center">
          <p className="font-display text-xl font-semibold text-ink-900">{evalCount}</p>
          <p className="text-[10px] uppercase tracking-wider text-ink-500">avaliações</p>
        </div>
        {score !== null && (
          <>
            <div className="w-px h-8 bg-ink-100" />
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-ink-500">Última pontuação</span>
                <span className="font-semibold text-ink-900 tabular-nums">{score}%</span>
              </div>
              <div className="h-1.5 bg-paper-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-500 to-gold-300"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          </>
        )}
        {score === null && (
          <p className="text-xs text-ink-400">Nenhuma avaliação concluída</p>
        )}
      </div>
    </button>
  );
}

export default function Scanner() {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState([]);
  const [evals, setEvals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRep, setSelectedRep] = useState(null);
  const [formType, setFormType] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const u = await base44.auth.me();
        setUser(u);
        if (!u) return;
        const [participants, allEvals] = await Promise.all([
          base44.entities.Participant.filter({ manager_email: u.email }),
          base44.entities.PaacEvaluation.filter({ leader_email: u.email }),
        ]);
        setTeam(participants);
        setEvals(allEvals);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      await base44.entities.PaacEvaluation.create({
        ...data,
        rep_email: selectedRep.email,
        rep_name: selectedRep.full_name,
        leader_email: user.email,
        leader_name: user.full_name,
        sector: selectedRep.team || selectedRep.department || '',
      });
      const allEvals = await base44.entities.PaacEvaluation.filter({ leader_email: user.email });
      setEvals(allEvals);
      setFormType(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // --- FORM VIEW ---
  if (formType) {
    return (
      <PaacForm
        rep={selectedRep}
        type={formType}
        onSave={handleSave}
        onCancel={() => setFormType(null)}
        saving={saving}
      />
    );
  }

  // --- REP DETAIL VIEW ---
  if (selectedRep) {
    const repEvals = evals
      .filter((e) => e.rep_email === selectedRep.email)
      .sort((a, b) => new Date(b.evaluation_date) - new Date(a.evaluation_date));

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedRep(null)}
            className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900"
          >
            <ArrowRight className="w-4 h-4 rotate-180" /> Voltar ao time
          </button>
        </div>

        <div className="bg-ink-grid rounded-3xl p-6 text-white shadow-ink">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gold-shine flex items-center justify-center shrink-0">
              <span className="font-display text-3xl font-semibold text-ink-900">
                {selectedRep.full_name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold">{selectedRep.full_name}</h2>
              <p className="text-ink-300 text-sm mt-1">
                {selectedRep.position || 'Representante'}{' '}
                {selectedRep.team ? `· ${selectedRep.team}` : ''}
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-gold-700 font-semibold">
                Nova avaliação
              </p>
              <h3 className="font-display text-xl font-semibold text-ink-900 mt-1">
                Selecione o tipo de PAAC
              </h3>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                type: 'demanda',
                title: 'PAAC Demanda',
                desc: 'Acompanhamento de campo em visitas a médicos. Avalia capacitação, estratégia, técnica de visita e pós-visita.',
                color: 'from-violet-600 to-violet-800',
              },
              {
                type: 'pdv',
                title: 'PAAC PDV',
                desc: 'Acompanhamento em pontos de venda. Avalia planejamento, os 4 pilares, cadastros e abordagem.',
                color: 'from-sky-600 to-sky-800',
              },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => setFormType(item.type)}
                className={`relative overflow-hidden text-left rounded-2xl bg-gradient-to-br ${item.color} text-white p-5 group hover:scale-[1.02] transition-all shadow-soft`}
              >
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_80%_20%,white,transparent_60%)]" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <FileText className="w-6 h-6 text-white/70" />
                    <Plus className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="font-display text-lg font-semibold">{item.title}</h4>
                  <p className="text-white/70 text-sm mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {repEvals.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold-700 font-semibold mb-2">
              Histórico de avaliações
            </p>
            <h3 className="font-display text-xl font-semibold text-ink-900 mb-4">
              {repEvals.length} avaliação{repEvals.length !== 1 ? 'ões' : ''} registrada{repEvals.length !== 1 ? 's' : ''}
            </h3>
            <div className="bg-white rounded-2xl border border-ink-100 p-4 space-y-2">
              {repEvals.map((ev) => (
                <EvalCard key={ev.id} ev={ev} onClick={() => {}} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- TEAM LIST VIEW ---
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-ink-grid text-white shadow-ink">
        <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-gold-400/15 blur-3xl" />
        <div className="relative px-7 py-8 lg:px-10 lg:py-10 grid lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30">
              <ClipboardCheck className="w-3.5 h-3.5 text-gold-300" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-gold-200 font-semibold">
                Etapa 1 · Diagnóstico
              </span>
            </span>
            <h1 className="font-display text-3xl lg:text-4xl font-semibold">
              Scanner — <span className="text-gold-300">PAAC</span>
            </h1>
            <p className="text-ink-200 max-w-lg leading-relaxed">
              Preencha o formulário PAAC para cada representante do seu time.
              Os resultados geram a <strong className="text-white">ficha pessoal</strong>{' '}
              e as tarefas de desenvolvimento no Lidherar.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4 text-center">
              <p className="font-display text-3xl font-semibold text-gold-300 tabular-nums">
                {team.length}
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-ink-300 mt-1">
                no time
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4 text-center">
              <p className="font-display text-3xl font-semibold text-white tabular-nums">
                {evals.filter((e) => e.status === 'completed').length}
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-ink-300 mt-1">
                avaliações
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold-700 font-semibold">
              Meu time
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink-900 mt-1">
              Selecione um representante
            </h2>
          </div>
        </div>

        {loading ? (
          <p className="text-ink-400 text-sm">Carregando time…</p>
        ) : team.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-ink-200 p-12 text-center">
            <Users className="w-12 h-12 text-ink-200 mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold text-ink-900">
              Nenhum representante encontrado
            </h3>
            <p className="text-ink-500 text-sm mt-2 max-w-sm mx-auto">
              Cadastre os representantes do seu time no painel Admin e vincule-os ao seu e-mail como gestor.
            </p>
            <Button
              className="mt-4 bg-ink-900 text-gold-200 hover:bg-ink-800"
              onClick={() => (window.location.href = createPageUrl('AdminPanel'))}
            >
              <Building2 className="w-4 h-4 mr-2" /> Ir para Admin
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.map((rep) => (
              <RepCard
                key={rep.id}
                rep={rep}
                evals={evals}
                onSelect={setSelectedRep}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
