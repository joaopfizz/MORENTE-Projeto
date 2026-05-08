import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Circle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ClipboardCheck,
  Users,
  TrendingUp,
  FlaskConical,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { calcScore, SCORE_LABEL, PAAC_DEMANDA, PAAC_PDV } from '@/lib/paacConfig';
import {
  MOCK_EVALUATIONS,
  MOCK_REP_PROFILE,
  MOCK_LEADER_PROFILE,
  MOCK_TEAM,
  demoStore,
} from '@/lib/paacMockData';
import CriteriaInfo from '@/components/scanner/CriteriaInfo';

const SCORE_COLOR = {
  N: 'bg-rose-100 text-rose-700 border-rose-200',
  A: 'bg-amber-100 text-amber-700 border-amber-200',
  S: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const TASK_STATUS_CONFIG = {
  pendente: { label: 'Pendente', icon: Circle, color: 'text-rose-500' },
  em_andamento: { label: 'Em andamento', icon: Clock, color: 'text-amber-500' },
  concluido: { label: 'Concluído', icon: CheckCircle2, color: 'text-emerald-600' },
};

function ScorePill({ score }) {
  if (!score) return <span className="text-ink-300 text-xs">—</span>;
  return (
    <span
      className={`inline-flex items-center justify-center h-6 w-6 rounded-md border text-xs font-bold ${SCORE_COLOR[score]}`}
    >
      {score}
    </span>
  );
}

function TaskRow({ task, onToggle }) {
  const status = task.status || 'pendente';
  const cfg = TASK_STATUS_CONFIG[status];
  const Icon = cfg.icon;
  const next = status === 'pendente' ? 'em_andamento' : status === 'em_andamento' ? 'concluido' : 'pendente';

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
        status === 'concluido'
          ? 'bg-emerald-50 border-emerald-100'
          : 'bg-white border-ink-100 hover:border-gold-200'
      }`}
    >
      <button
        onClick={() => onToggle(task.id, next)}
        className={`mt-0.5 shrink-0 ${cfg.color} hover:opacity-70 transition-opacity`}
        title={`Mudar para: ${TASK_STATUS_CONFIG[next].label}`}
      >
        <Icon className="w-5 h-5" />
      </button>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-relaxed ${
            status === 'concluido' ? 'line-through text-ink-400' : 'text-ink-800'
          }`}
        >
          {task.criteria_label}
        </p>
        <p className="text-[11px] text-ink-400 mt-0.5">{task.section_label}</p>
      </div>
      <span
        className={`text-[10px] uppercase tracking-wider font-semibold shrink-0 ${cfg.color}`}
      >
        {cfg.label}
      </span>
    </div>
  );
}

function EvaluationCard({ ev, config }) {
  const [expanded, setExpanded] = useState(false);
  const [tasks, setTasks] = useState(ev.tasks || []);
  const [updatingTask, setUpdatingTask] = useState(false);

  const score = calcScore(ev.scores || {});
  const pendingTasks = tasks.filter((t) => t.status !== 'concluido').length;
  const doneTasks = tasks.filter((t) => t.status === 'concluido').length;
  const totalTasks = tasks.length;

  const handleToggleTask = async (taskId, newStatus) => {
    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);
    setUpdatingTask(true);
    try {
      // Avaliações user-created vão para demoStore; MOCK só atualiza UI local.
      demoStore.updateEvaluation(ev.id, { tasks: updatedTasks });
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingTask(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
      {/* Card Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 hover:bg-paper-50/50 transition-colors"
      >
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
            <Badge
              className={`text-[10px] uppercase tracking-wider font-semibold border-none ${
                ev.type === 'demanda'
                  ? 'bg-violet-100 text-violet-700'
                  : 'bg-sky-100 text-sky-700'
              }`}
            >
              {ev.type === 'demanda' ? 'Demanda' : 'PDV'}
            </Badge>
            <span className="text-xs text-ink-500">
              {new Date(ev.evaluation_date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 h-2 bg-paper-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-500 to-gold-300"
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-ink-900 tabular-nums w-10 text-right">
                {score}%
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-ink-500">
              {totalTasks > 0 && (
                <span className="flex items-center gap-1">
                  <ClipboardCheck className="w-3.5 h-3.5 text-gold-600" />
                  {doneTasks}/{totalTasks} tarefas concluídas
                </span>
              )}
              {ev.combinados && (
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
                  Combinados registrados
                </span>
              )}
            </div>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-1 shrink-0"
          >
            <ChevronDown className="w-4 h-4 text-ink-400" />
          </motion.div>
        </div>
      </button>

      {/* Tasks — sempre visível (mesmo com card colapsado) */}
      {tasks.length > 0 && (
        <div className="border-t border-ink-100 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-ink-800">
              Tarefas de Desenvolvimento
            </p>
            <span className="text-xs text-ink-500 tabular-nums">
              {doneTasks}/{totalTasks} concluídas
            </span>
          </div>
          {totalTasks > 0 && (
            <div className="h-1.5 bg-paper-100 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${Math.round((doneTasks / totalTasks) * 100)}%` }}
              />
            </div>
          )}
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
              />
            ))}
          </div>
        </div>
      )}

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="expanded-detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.32, ease: [0.25, 0.1, 0.25, 1] },
              opacity: { duration: 0.22, ease: 'easeOut' },
            }}
            style={{ overflow: 'hidden' }}
            className="border-t border-ink-100"
          >
            {/* Score grid */}
            <div className="p-4 sm:p-5 space-y-6">
              {config.map((section) => (
                <div key={section.section}>
                  <p className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-3">
                    {section.section}. {section.label}
                  </p>
                  {section.subsections.map((sub) => (
                    <div key={sub.key} className="mb-4">
                      <p className="text-[11px] font-semibold text-gold-700 uppercase tracking-wider mb-2">
                        {sub.key} — {sub.label}
                      </p>
                      <div className="space-y-1.5">
                        {sub.criteria.map((crit) => (
                          <div
                            key={crit.key}
                            className="flex items-start justify-between gap-2"
                          >
                            <div className="flex-1 flex items-start gap-1 min-w-0">
                              <p className="text-sm text-ink-700 leading-relaxed flex-1">
                                {crit.label}
                              </p>
                              <CriteriaInfo criteriaKey={crit.key} type={ev.type} />
                            </div>
                            <ScorePill score={ev.scores?.[crit.key]} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Combinados */}
              {ev.combinados && (
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-sky-600" />
                    <p className="text-sm font-semibold text-sky-800">Combinados</p>
                  </div>
                  <p className="text-sm text-sky-700 whitespace-pre-wrap leading-relaxed">
                    {ev.combinados}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Lidherar() {
  const [role, setRole] = useState(demoStore.getRole());
  const [allEvals, setAllEvals] = useState(demoStore.getEvaluations());
  const [selectedRep, setSelectedRep] = useState(null);
  const [direction, setDirection] = useState(0); // -1 = prev, +1 = next (para animação)
  const isLeader = role === 'gestor';
  const currentUser = isLeader ? MOCK_LEADER_PROFILE : MOCK_REP_PROFILE;
  const team = MOCK_TEAM;

  const currentIndex = selectedRep
    ? team.findIndex((r) => r.email === selectedRep.email)
    : 0;

  const goToRep = (dir) => {
    if (!isLeader) return;
    const nextIdx = (currentIndex + dir + team.length) % team.length;
    setDirection(dir);
    setSelectedRep(team[nextIdx]);
  };

  const jumpToRep = (rep) => {
    const nextIdx = team.findIndex((r) => r.email === rep.email);
    setDirection(nextIdx > currentIndex ? 1 : -1);
    setSelectedRep(rep);
  };

  // Atalhos de teclado ← / → (só para gestor)
  useEffect(() => {
    if (!isLeader) return;
    const onKey = (e) => {
      // Ignora se estiver digitando em input/textarea
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') goToRep(-1);
      if (e.key === 'ArrowRight') goToRep(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isLeader, currentIndex]);

  // Gestor começa vendo o primeiro rep do time; colaborador só vê a própria ficha.
  useEffect(() => {
    if (isLeader) {
      setSelectedRep((prev) => prev || team[0]);
    } else {
      setSelectedRep(MOCK_REP_PROFILE);
    }
  }, [isLeader]);

  useEffect(() => {
    const roleHandler = (e) => setRole(e.detail);
    const evHandler = () => setAllEvals(demoStore.getEvaluations());
    window.addEventListener('paac-role-change', roleHandler);
    window.addEventListener('paac-evals-change', evHandler);
    return () => {
      window.removeEventListener('paac-role-change', roleHandler);
      window.removeEventListener('paac-evals-change', evHandler);
    };
  }, []);

  const viewingRep = selectedRep || currentUser;
  const myProfile = viewingRep;

  const currentEvals = allEvals
    .filter(
      (e) => e.rep_email === viewingRep.email && e.status === 'completed'
    )
    .sort((a, b) => new Date(b.evaluation_date) - new Date(a.evaluation_date));

  const isMock = true; // sempre modo demo enquanto não há backend
  const loading = false;
  const user = currentUser;

  const demandaEvals = currentEvals.filter((e) => e.type === 'demanda');
  const pdvEvals = currentEvals.filter((e) => e.type === 'pdv');

  const overallScore =
    currentEvals.length > 0
      ? Math.round(
          currentEvals.reduce((acc, e) => acc + calcScore(e.scores || {}), 0) /
            currentEvals.length
        )
      : null;

  const totalTasks = currentEvals.flatMap((e) => e.tasks || []).length;
  const doneTasks = currentEvals
    .flatMap((e) => e.tasks || [])
    .filter((t) => t.status === 'concluido').length;

  const displayName =
    selectedRep?.full_name || myProfile?.full_name || user?.full_name || 'Colaborador';

  const heroVariants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <div className="space-y-8">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-ink-grid text-white shadow-ink">
        <div className="absolute -top-20 -right-10 h-64 w-64 rounded-full bg-gold-400/15 blur-3xl pointer-events-none" />

        {/* Setas laterais (somente gestor) */}
        {isLeader && team.length > 1 && (
          <>
            <button
              onClick={() => goToRep(-1)}
              aria-label="Colaborador anterior"
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 h-11 w-11 sm:h-10 sm:w-10 rounded-full bg-white/5 hover:bg-gold-400 hover:text-ink-900 border border-white/15 hover:border-gold-400 text-white backdrop-blur flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => goToRep(1)}
              aria-label="Próximo colaborador"
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 h-11 w-11 sm:h-10 sm:w-10 rounded-full bg-white/5 hover:bg-gold-400 hover:text-ink-900 border border-white/15 hover:border-gold-400 text-white backdrop-blur flex items-center justify-center transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            {/* Indicador "n de N" — escondido em mobile pra não cobrir conteúdo */}
            <div className="hidden sm:block absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-semibold text-gold-200 uppercase tracking-widest backdrop-blur">
              {currentIndex + 1} de {team.length}
            </div>
            {/* Indicador mobile: bolinhas no rodapé do hero */}
            <div className="sm:hidden absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
              {team.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentIndex ? 'w-5 bg-gold-300' : 'w-1.5 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={viewingRep.email}
            custom={direction}
            variants={heroVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
            className={`relative px-5 py-7 sm:px-7 sm:py-8 lg:px-16 lg:py-10 grid lg:grid-cols-[1fr_auto] gap-5 lg:gap-6 items-center ${
              isLeader ? 'lg:px-20' : ''
            }`}
          >
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30">
                <Users className="w-3.5 h-3.5 text-gold-300" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-gold-200 font-semibold">
                  Etapa 2 · Desenvolvimento
                </span>
              </span>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold">
                Ficha de{' '}
                <span className="text-gold-300">
                  {selectedRep ? selectedRep.full_name.split(' ')[0] : displayName.split(' ')[0]}
                </span>
              </h1>
              <p className="text-ink-200 max-w-lg leading-relaxed text-sm sm:text-base">
                {viewingRep.position || 'Representante'}
                {viewingRep.team ? ` · ${viewingRep.team}` : ''}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-4 sm:flex-wrap">
              <div className="rounded-2xl bg-white/5 border border-white/10 px-3 py-3 sm:px-5 sm:py-4 text-center">
                <p className="font-display text-2xl sm:text-3xl font-semibold text-gold-300 tabular-nums">
                  {currentEvals.length}
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-ink-300 mt-1">
                  avaliações
                </p>
              </div>
              {overallScore !== null && (
                <div className="rounded-2xl bg-gold-shine px-3 py-3 sm:px-5 sm:py-4 text-center">
                  <p className="font-display text-2xl sm:text-3xl font-semibold text-ink-900 tabular-nums">
                    {overallScore}%
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-ink-900/70 mt-1">
                    média
                  </p>
                </div>
              )}
              {totalTasks > 0 && (
                <div className="rounded-2xl bg-white/5 border border-white/10 px-3 py-3 sm:px-5 sm:py-4 text-center">
                  <p className="font-display text-2xl sm:text-3xl font-semibold text-white tabular-nums">
                    {doneTasks}/{totalTasks}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-ink-300 mt-1">
                    tarefas
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* DEMO BANNER */}
      {isMock && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <FlaskConical className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Modo demonstração</p>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              {isLeader
                ? 'Você está como Gestor — pode visualizar a ficha de qualquer colaborador do seu time. Avaliações criadas no Scanner aparecem aqui automaticamente.'
                : 'Você está como Colaborador — vê apenas a sua própria ficha. Clique em "Gestor" no topo para alternar a visão.'}
            </p>
          </div>
        </div>
      )}

      {/* LEADER: team selector */}
      {isLeader && team.length > 0 && (
        <section className="bg-white rounded-2xl border border-ink-100 p-4 sm:p-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold-700 font-semibold mb-3">
            Visualizar ficha de
          </p>
          <div className="flex gap-2 flex-nowrap sm:flex-wrap overflow-x-auto scrollbar-thin -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
            {team.map((rep) => (
              <button
                key={rep.id}
                onClick={() => jumpToRep(rep)}
                className={`shrink-0 px-4 py-2 min-h-[44px] rounded-full text-sm font-medium border-2 transition-all whitespace-nowrap ${
                  selectedRep?.id === rep.id
                    ? 'bg-gold-400 text-ink-900 border-gold-400 shadow-gold'
                    : 'bg-white text-ink-600 border-ink-200 hover:border-gold-300'
                }`}
              >
                {rep.full_name.split(' ')[0]}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* NO EVALS STATE */}
      {!loading && currentEvals.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-ink-200 p-12 text-center">
          <ClipboardCheck className="w-12 h-12 text-ink-200 mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold text-ink-900">
            Nenhuma avaliação registrada para {viewingRep.full_name.split(' ')[0]}
          </h3>
          <p className="text-ink-500 text-sm mt-2 max-w-sm mx-auto">
            {isLeader
              ? 'Vá ao Scanner e preencha o PAAC deste representante para gerar a ficha.'
              : 'Seu gestor ainda não registrou nenhuma avaliação de campo para você.'}
          </p>
          {isLeader && (
            <Button
              className="mt-5 bg-ink-900 text-gold-200 hover:bg-ink-800 gap-2"
              onClick={() => (window.location.href = createPageUrl('Scanner'))}
            >
              <ArrowRight className="w-4 h-4" /> Ir para o Scanner
            </Button>
          )}
        </div>
      )}

      {/* DEMANDA */}
      {demandaEvals.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            <p className="font-display text-xl font-semibold text-ink-900">
              PAAC Demanda — Visitas a Médicos
            </p>
            <span className="text-xs text-ink-500">
              {demandaEvals.length} avaliação{demandaEvals.length !== 1 ? 'ões' : ''}
            </span>
          </div>
          <div className="space-y-4">
            {demandaEvals.map((ev) => (
              <EvaluationCard key={ev.id} ev={ev} config={PAAC_DEMANDA} />
            ))}
          </div>
        </section>
      )}

      {/* PDV */}
      {pdvEvals.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="h-2 w-2 rounded-full bg-sky-500" />
            <p className="font-display text-xl font-semibold text-ink-900">
              PAAC PDV — Pontos de Venda
            </p>
            <span className="text-xs text-ink-500">
              {pdvEvals.length} avaliação{pdvEvals.length !== 1 ? 'ões' : ''}
            </span>
          </div>
          <div className="space-y-4">
            {pdvEvals.map((ev) => (
              <EvaluationCard key={ev.id} ev={ev} config={PAAC_PDV} />
            ))}
          </div>
        </section>
      )}

      {/* NEXT STEP */}
      {currentEvals.length > 0 && (
        <section className="relative overflow-hidden rounded-3xl bg-gold-shine p-6 md:p-8">
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="p-3 bg-ink-900 rounded-2xl shrink-0">
              <TrendingUp className="w-6 h-6 text-gold-300" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-900/70 font-semibold">
                Próximo passo
              </p>
              <h3 className="font-display text-xl font-semibold text-ink-900 mt-1">
                Academy — Trilha de Liderança
              </h3>
              <p className="text-ink-900/80 text-sm mt-1 max-w-2xl">
                Use os cursos dos 7 Pilares para trabalhar as competências com nota <strong>N</strong> e executar as tarefas de desenvolvimento.
              </p>
            </div>
            <Button
              className="bg-ink-900 hover:bg-ink-800 text-gold-200 shrink-0 gap-2 rounded-full px-5"
              onClick={() => (window.location.href = createPageUrl('Academy'))}
            >
              Ir para a Academy <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
