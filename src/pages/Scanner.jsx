import React, { useState, useEffect } from 'react';
import { createPageUrl } from '@/utils';
import {
  ClipboardCheck,
  Users,
  Plus,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  FileText,
  CheckCircle2,
  Clock,
  Lock,
  X,
  Save,
  FlaskConical,
  Crown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogClose,
} from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { calcScore, PAAC_DEMANDA, PAAC_PDV, SCORE_LABEL, generateTasks } from '@/lib/paacConfig';
import { demoStore, MOCK_TEAM, MOCK_LEADER_PROFILE } from '@/lib/paacMockData';

const SCORE_OPTS = ['N', 'A', 'S'];
const SCORE_STYLE = {
  N: { active: 'bg-rose-600 text-white border-rose-600', idle: 'border-rose-200 text-rose-500 hover:bg-rose-50' },
  A: { active: 'bg-amber-500 text-white border-amber-500', idle: 'border-amber-200 text-amber-600 hover:bg-amber-50' },
  S: { active: 'bg-emerald-600 text-white border-emerald-600', idle: 'border-emerald-200 text-emerald-600 hover:bg-emerald-50' },
};

function ScoreButton({ value, selected, onChange }) {
  const s = SCORE_STYLE[value];
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      title={SCORE_LABEL[value]}
      className={`h-9 w-9 rounded-lg border-2 text-sm font-bold transition-all ${
        selected === value ? s.active : s.idle
      }`}
    >
      {value}
    </button>
  );
}

function CriteriaRow({ crit, score, onChange }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-ink-100 last:border-none group">
      <p className="flex-1 text-sm text-ink-700 leading-relaxed">{crit.label}</p>
      <div className="flex items-center gap-1.5 shrink-0">
        {SCORE_OPTS.map((v) => (
          <ScoreButton key={v} value={v} selected={score} onChange={onChange} />
        ))}
      </div>
    </div>
  );
}

// ---------------- RepCard ----------------
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
            <p className="text-xs text-ink-500 truncate">{rep.team || rep.email}</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-ink-300 group-hover:text-gold-500 mt-1 shrink-0 transition-colors" />
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="text-center">
          <p className="font-display text-xl font-semibold text-ink-900">{evalCount}</p>
          <p className="text-[10px] uppercase tracking-wider text-ink-500">avaliações</p>
        </div>
        {score !== null ? (
          <>
            <div className="w-px h-8 bg-ink-100" />
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-ink-500">Última</span>
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
        ) : (
          <p className="text-xs text-ink-400">Sem avaliação concluída</p>
        )}
      </div>
    </button>
  );
}

// ---------------- PaacDialog ----------------
function PaacDialog({ rep, onClose, onSaved }) {
  const [step, setStep] = useState('type'); // 'type' | 'form'
  const [type, setType] = useState(null);
  const [scores, setScores] = useState({});
  const [combinados, setCombinados] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  const config = type === 'demanda' ? PAAC_DEMANDA : PAAC_PDV;
  const totalCriteria = type
    ? config.flatMap((s) => s.subsections.flatMap((sub) => sub.criteria)).length
    : 0;
  const filled = Object.keys(scores).length;
  const progress = totalCriteria ? Math.round((filled / totalCriteria) * 100) : 0;

  const setScore = (key, val) => setScores((prev) => ({ ...prev, [key]: val }));

  const pickType = (t) => {
    setType(t);
    setStep('form');
  };

  const handleSave = () => {
    if (filled < totalCriteria) return;
    setSaving(true);
    const tasks = generateTasks(scores, config);
    const leader = demoStore.getRole() === 'gestor'
      ? demoStore.getCurrentUser()
      : MOCK_LEADER_PROFILE;
    const newEv = demoStore.createEvaluation({
      rep_email: rep.email,
      rep_name: rep.full_name,
      leader_email: leader.email,
      leader_name: leader.full_name,
      sector: rep.team || rep.department || '',
      type,
      evaluation_date: date,
      status: 'completed',
      scores,
      combinados,
      tasks,
    });
    setSaving(false);
    onSaved?.(newEv);
    onClose();
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-ink-950/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] w-[95vw] max-w-3xl max-h-[90vh] flex flex-col bg-paper-50 rounded-3xl shadow-ink overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-ink-grid text-white flex items-center gap-4 shrink-0">
            <div className="h-11 w-11 rounded-full bg-gold-shine flex items-center justify-center">
              <span className="font-display text-lg font-semibold text-ink-900">
                {rep.full_name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.22em] text-gold-300 font-semibold">
                {step === 'type' ? 'Nova avaliação' : `PAAC ${type === 'demanda' ? 'Demanda' : 'PDV'}`}
              </p>
              <h2 className="font-display text-xl font-semibold truncate">{rep.full_name}</h2>
              <p className="text-xs text-ink-300 truncate">{rep.team || rep.email}</p>
            </div>
            <DialogClose className="text-ink-300 hover:text-white transition-colors shrink-0">
              <X className="w-5 h-5" />
            </DialogClose>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {step === 'type' && (
              <div className="p-6 space-y-5">
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink-900">
                    Qual tipo de PAAC?
                  </h3>
                  <p className="text-sm text-ink-500 mt-1">
                    Escolha o formulário que se aplica ao acompanhamento de hoje.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { t: 'demanda', title: 'PAAC Demanda', desc: 'Acompanhamento de campo em visitas a médicos. 42 critérios.', color: 'from-violet-600 to-violet-800' },
                    { t: 'pdv', title: 'PAAC PDV', desc: 'Acompanhamento em pontos de venda. 13 critérios.', color: 'from-sky-600 to-sky-800' },
                  ].map((item) => (
                    <button
                      key={item.t}
                      onClick={() => pickType(item.t)}
                      className={`relative overflow-hidden text-left rounded-2xl bg-gradient-to-br ${item.color} text-white p-5 hover:scale-[1.02] transition-all shadow-soft`}
                    >
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_80%_20%,white,transparent_60%)]" />
                      <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                          <FileText className="w-6 h-6 text-white/70" />
                          <Plus className="w-5 h-5 text-white/60" />
                        </div>
                        <h4 className="font-display text-lg font-semibold">{item.title}</h4>
                        <p className="text-white/70 text-sm mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'form' && (
              <div className="p-6 space-y-6">
                {/* Date + progress */}
                <div className="bg-white rounded-2xl border border-ink-100 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-ink-500 uppercase tracking-wider">
                      Data
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="mt-1 block px-3 py-2 border border-ink-200 rounded-lg text-sm focus:ring-2 focus:ring-gold-400/40 focus:border-gold-400 outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-ink-500 font-medium">Critérios preenchidos</span>
                      <span className="font-semibold text-ink-900 tabular-nums">
                        {filled}/{totalCriteria}
                      </span>
                    </div>
                    <div className="h-2 bg-paper-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold-500 to-gold-300 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {SCORE_OPTS.map((v) => (
                      <span key={v} className="flex items-center gap-1 text-[11px] font-semibold">
                        <span
                          className={`h-5 w-5 rounded flex items-center justify-center text-white text-[10px] font-bold ${
                            v === 'N' ? 'bg-rose-500' : v === 'A' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                        >
                          {v}
                        </span>
                        {SCORE_LABEL[v]}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sections */}
                {config.map((section) => (
                  <div key={section.section} className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
                    <div className="px-5 py-3 bg-ink-900 flex items-center gap-3">
                      <span className="h-7 w-7 rounded-full bg-gold-400 flex items-center justify-center font-display text-sm font-bold text-ink-900">
                        {section.section}
                      </span>
                      <h3 className="font-semibold text-white">{section.label}</h3>
                    </div>
                    {section.subsections.map((sub) => {
                      const subFilled = sub.criteria.filter((c) => scores[c.key]).length;
                      return (
                        <div key={sub.key} className="border-b border-ink-100 last:border-none">
                          <div className="px-5 py-2.5 bg-ink-50/50 flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold text-gold-700 mr-2">{sub.key}</span>
                              <span className="text-sm font-semibold text-ink-800">{sub.label}</span>
                            </div>
                            <span className="text-[11px] text-ink-400 tabular-nums">
                              {subFilled}/{sub.criteria.length}
                            </span>
                          </div>
                          <div className="px-5">
                            {sub.criteria.map((crit) => (
                              <CriteriaRow
                                key={crit.key}
                                crit={crit}
                                score={scores[crit.key]}
                                onChange={(v) => setScore(crit.key, v)}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* Combinados */}
                <div className="bg-white rounded-2xl border border-ink-100 p-5">
                  <label className="block text-sm font-semibold text-ink-800 mb-2">
                    Combinados — Anotações do acompanhamento
                  </label>
                  <textarea
                    rows={4}
                    placeholder={`Ex: ${new Date().toLocaleDateString('pt-BR')} — Combinamos trabalhar melhor a pré-visita…`}
                    value={combinados}
                    onChange={(e) => setCombinados(e.target.value)}
                    className="w-full px-4 py-3 border border-ink-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-gold-400/40 focus:border-gold-400 outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {step === 'form' && (
            <div className="px-6 py-4 bg-white border-t border-ink-100 flex items-center justify-between shrink-0">
              <button
                onClick={() => setStep('type')}
                className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900"
              >
                <ArrowLeft className="w-4 h-4" /> Trocar tipo
              </button>
              <div className="flex items-center gap-3">
                <span className="text-xs text-ink-500">
                  {filled < totalCriteria
                    ? `Faltam ${totalCriteria - filled} critério(s)`
                    : 'Tudo pronto'}
                </span>
                <Button
                  onClick={handleSave}
                  disabled={saving || filled < totalCriteria}
                  className="bg-gold-400 hover:bg-gold-300 text-ink-900 font-semibold gap-2 shadow-gold"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Salvando…' : 'Salvar e gerar ficha'}
                </Button>
              </div>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

// ---------------- Scanner ----------------
export default function Scanner() {
  const [role, setRole] = useState(demoStore.getRole());
  const [evals, setEvals] = useState(demoStore.getEvaluations());
  const [openRep, setOpenRep] = useState(null);

  useEffect(() => {
    const roleHandler = (e) => setRole(e.detail);
    const evHandler = () => setEvals(demoStore.getEvaluations());
    window.addEventListener('paac-role-change', roleHandler);
    window.addEventListener('paac-evals-change', evHandler);
    return () => {
      window.removeEventListener('paac-role-change', roleHandler);
      window.removeEventListener('paac-evals-change', evHandler);
    };
  }, []);

  const team = MOCK_TEAM;

  // COLABORADOR: sem acesso ao Scanner
  if (role !== 'gestor') {
    return (
      <div className="max-w-xl mx-auto mt-16 bg-white rounded-3xl border border-ink-100 p-10 text-center shadow-soft">
        <div className="w-16 h-16 mx-auto rounded-full bg-paper-100 flex items-center justify-center mb-5">
          <Lock className="w-7 h-7 text-ink-400" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-ink-900">
          Acesso exclusivo para gestores
        </h2>
        <p className="text-ink-500 text-sm mt-2 leading-relaxed">
          O Scanner é usado pelo gestor para preencher a PAAC (Demanda ou PDV) de cada representante do time. Você pode visualizar sua ficha pessoal no <strong>Lidherar</strong>.
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Button
            onClick={() => (window.location.href = createPageUrl('Lidherar'))}
            className="bg-ink-900 hover:bg-ink-800 text-gold-200 gap-2"
          >
            Ir para minha ficha <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => demoStore.setRole('gestor')}
            className="border-ink-200 gap-2"
          >
            <Crown className="w-4 h-4" /> Ver como Gestor
          </Button>
        </div>
      </div>
    );
  }

  // GESTOR: lista do time
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
              Clique em um representante para abrir o formulário e escolher entre{' '}
              <strong className="text-white">PAAC Demanda</strong> ou{' '}
              <strong className="text-white">PDV</strong>. A ficha é gerada automaticamente no Lidherar.
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

      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
        <FlaskConical className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Modo demonstração ativo</p>
          <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
            Time e avaliações fictícios. As avaliações que você criar aqui são salvas no navegador e aparecem automaticamente no Lidherar.
          </p>
        </div>
      </div>

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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map((rep) => (
            <RepCard
              key={rep.id}
              rep={rep}
              evals={evals}
              onSelect={setOpenRep}
            />
          ))}
        </div>
      </section>

      {openRep && (
        <PaacDialog
          rep={openRep}
          onClose={() => setOpenRep(null)}
          onSaved={() => setEvals(demoStore.getEvaluations())}
        />
      )}
    </div>
  );
}
