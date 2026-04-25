import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Trophy,
  Flame,
  Medal,
  Crown,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  Target,
  Sparkles,
  Calendar,
  Send,
  ThumbsUp,
  RotateCcw,
  Plus,
  Users,
  BookOpen,
  ChevronRight,
  Upload,
  ShieldCheck,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { demoStore, MOCK_TEAM } from '@/lib/paacMockData';
import { athivarStore, DIFFICULTY } from '@/lib/athivarMockData';
import { evolutionStore } from '@/lib/evolutionMockData';
import { MOCK_COURSES } from '@/lib/academyMockData';

// ============================================================
// HELPERS
// ============================================================

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  } catch {
    return iso;
  }
}

function formatFullDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function daysUntil(deadline) {
  if (!deadline) return null;
  const diff = new Date(deadline) - new Date();
  return Math.ceil(diff / 86400000);
}

const INITIALS = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

const DIFFICULTY_STYLE = {
  easy: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  medium: 'bg-gold-100 text-gold-800 border-gold-300',
  hard: 'bg-rose-100 text-rose-800 border-rose-200',
};

const STATUS_STYLE = {
  active: {
    label: 'Ativa',
    icon: Zap,
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    accent: 'bg-amber-500',
  },
  pending_validation: {
    label: 'Aguardando validação',
    icon: ShieldCheck,
    text: 'text-violet-700',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    accent: 'bg-violet-500',
  },
  completed: {
    label: 'Concluída',
    icon: CheckCircle2,
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    accent: 'bg-emerald-500',
  },
  needs_rework: {
    label: 'Ajustes solicitados',
    icon: AlertCircle,
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    accent: 'bg-rose-500',
  },
};

// ============================================================
// UI BITS
// ============================================================

function Avatar({ name, size = 'md', ring = false, podium = null }) {
  const sizes = {
    xs: 'w-7 h-7 text-[9px]',
    sm: 'w-9 h-9 text-[10px]',
    md: 'w-11 h-11 text-xs',
    lg: 'w-14 h-14 text-sm',
    xl: 'w-20 h-20 text-lg',
  };
  const ringColors = {
    1: 'ring-gold-400',
    2: 'ring-slate-300',
    3: 'ring-amber-400',
  };
  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br from-ink-700 to-ink-900 text-gold-300 font-display font-semibold flex items-center justify-center shadow-soft ${
        ring ? `ring-2 ring-offset-2 ring-offset-paper-50 ${podium ? ringColors[podium] : 'ring-gold-400'}` : ''
      }`}
    >
      {INITIALS(name)}
    </div>
  );
}

function StatusPill({ status, size = 'md' }) {
  const cfg = STATUS_STYLE[status];
  if (!cfg) return null;
  const Icon = cfg.icon;
  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-[11px] px-2.5 py-1';
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border} ${sizeClass}`}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function DifficultyPill({ difficulty, size = 'md' }) {
  const diff = DIFFICULTY[difficulty];
  if (!diff) return null;
  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-[11px] px-2.5 py-1';
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${DIFFICULTY_STYLE[difficulty]} ${sizeClass}`}
    >
      <Flame className="w-3 h-3" />
      {diff.label} · {diff.points} pts
    </span>
  );
}

function PointsBadge({ points, size = 'md', prefix = '+' }) {
  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-sm px-3 py-1';
  return (
    <span
      className={`inline-flex items-center gap-1 font-display font-semibold rounded-full bg-gold-shine text-ink-900 ${sizeClass}`}
    >
      <Star className="w-3.5 h-3.5 fill-ink-900" />
      {prefix}
      {points} pts
    </span>
  );
}

function DeadlinePill({ deadline, size = 'md' }) {
  if (!deadline) return null;
  const days = daysUntil(deadline);
  const late = days < 0;
  const urgent = days >= 0 && days <= 7;
  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-[11px] px-2.5 py-1';
  const tone = late
    ? 'bg-rose-100 text-rose-800 border-rose-200'
    : urgent
      ? 'bg-amber-100 text-amber-800 border-amber-200'
      : 'bg-ink-50 text-ink-700 border-ink-200';
  const text = late
    ? `Atrasada (${Math.abs(days)}d)`
    : days === 0
      ? 'Vence hoje'
      : `${days}d restantes`;
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${tone} ${sizeClass}`}
    >
      <Clock className="w-3 h-3" />
      {text}
    </span>
  );
}

function SectionHeader({ eyebrow, title, action, count }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        {eyebrow && (
          <p className="text-[10px] uppercase tracking-[0.22em] text-gold-700 font-semibold">
            {eyebrow}
          </p>
        )}
        <h3 className="font-display text-lg font-semibold text-ink-900 mt-0.5 flex items-center gap-2">
          {title}
          {count != null && (
            <span className="text-xs font-medium text-ink-400 bg-ink-100 rounded-full px-2 py-0.5">
              {count}
            </span>
          )}
        </h3>
      </div>
      {action}
    </div>
  );
}

// ============================================================
// LEADERBOARD — PÓDIO
// ============================================================

function PodiumPlace({ row, place, isCurrent }) {
  const heights = { 1: 'h-36', 2: 'h-28', 3: 'h-24' };
  const styles = {
    1: 'bg-gold-shine text-ink-900 border-gold-400',
    2: 'bg-gradient-to-b from-slate-100 to-slate-200 text-ink-900 border-slate-300',
    3: 'bg-gradient-to-b from-amber-100 to-amber-200 text-ink-900 border-amber-300',
  };
  const icons = {
    1: <Crown className="w-5 h-5" />,
    2: <Medal className="w-5 h-5" />,
    3: <Medal className="w-5 h-5" />,
  };

  return (
    <div className="flex flex-col items-center flex-1 max-w-[180px]">
      {/* Avatar */}
      <div className="relative mb-2">
        <Avatar name={row.rep.full_name} size="lg" ring podium={place} />
        <div className="absolute -top-2 -right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow-soft border border-ink-100">
          <span className="text-[11px] font-display font-bold text-ink-900">
            {place}º
          </span>
        </div>
      </div>

      {/* Name */}
      <p className="font-display text-sm font-semibold text-ink-900 text-center leading-tight">
        {row.rep.full_name}
      </p>
      {isCurrent && (
        <span className="text-[9px] uppercase tracking-[0.18em] text-gold-700 font-bold mt-0.5">
          Você
        </span>
      )}

      {/* Podium block */}
      <div
        className={`${heights[place]} ${styles[place]} mt-2 w-full rounded-t-2xl border-2 border-b-0 flex flex-col items-center justify-center px-3`}
      >
        <div className="flex items-center gap-1 mb-0.5">{icons[place]}</div>
        <p className="font-display text-2xl font-bold tabular-nums leading-none">
          {row.points}
        </p>
        <p className="text-[10px] uppercase tracking-wider opacity-75 mt-0.5">
          pontos
        </p>
        <p className="text-[10px] mt-1">
          {row.completed} missão{row.completed !== 1 ? 'ões' : ''}
        </p>
      </div>
    </div>
  );
}

function Podium({ leaderboard, currentEmail }) {
  // Top 3 — reordenar pra mostrar 2-1-3 visualmente
  const sorted = [...leaderboard].slice(0, 3);
  const getByRank = (r) => sorted.find((x) => x.rank === r);
  const first = getByRank(1);
  const second = getByRank(2);
  const third = getByRank(3);
  const visualOrder = [second, first, third].filter(Boolean);

  return (
    <div className="flex items-end justify-center gap-3 pb-0">
      {visualOrder.map((row) => (
        <PodiumPlace
          key={row.rep.email}
          row={row}
          place={row.rank}
          isCurrent={row.rep.email === currentEmail}
        />
      ))}
    </div>
  );
}

function LeaderboardList({ leaderboard, currentEmail }) {
  return (
    <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
      <div className="px-5 py-3 border-b border-ink-100 flex items-center justify-between">
        <p className="font-display font-semibold text-sm text-ink-900">
          Classificação completa
        </p>
        <p className="text-[11px] text-ink-500">Pontos acumulados no ciclo</p>
      </div>
      <ul className="divide-y divide-ink-100">
        {leaderboard.map((row) => {
          const isMe = row.rep.email === currentEmail;
          const rankBg =
            row.rank === 1
              ? 'bg-gold-shine text-ink-900'
              : row.rank === 2
                ? 'bg-slate-200 text-ink-900'
                : row.rank === 3
                  ? 'bg-amber-200 text-ink-900'
                  : 'bg-ink-50 text-ink-700';
          return (
            <li
              key={row.rep.email}
              className={`px-5 py-3 flex items-center gap-4 transition ${
                isMe ? 'bg-gold-50' : ''
              }`}
            >
              <span
                className={`w-8 h-8 rounded-lg ${rankBg} font-display font-bold text-sm flex items-center justify-center shrink-0`}
              >
                {row.rank}
              </span>
              <Avatar name={row.rep.full_name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-sm text-ink-900 truncate">
                  {row.rep.full_name}
                  {isMe && (
                    <span className="text-[9px] uppercase tracking-wider text-gold-700 font-bold ml-2">
                      você
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-ink-500 truncate">{row.rep.team}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display text-lg font-semibold text-ink-900 tabular-nums leading-none">
                  {row.points}
                </p>
                <p className="text-[10px] text-ink-500 uppercase tracking-wider mt-0.5">
                  {row.completed} feitas · {row.active} ativas
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ============================================================
// MISSION CARD
// ============================================================

function MissionCard({ mission, actions, onClick, compact = false, showRep = false }) {
  const late = mission.deadline && daysUntil(mission.deadline) < 0;
  return (
    <div
      className={`bg-white rounded-2xl border ${
        late && mission.status === 'active'
          ? 'border-rose-200'
          : 'border-ink-100'
      } ${onClick ? 'hover:border-ink-300 hover:shadow-soft cursor-pointer' : ''} transition-all p-5 flex flex-col gap-3`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {showRep && (
          <Avatar name={mission.rep_name} size="md" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <StatusPill status={mission.status} size="sm" />
            <DifficultyPill difficulty={mission.difficulty} size="sm" />
            {mission.status === 'active' && (
              <DeadlinePill deadline={mission.deadline} size="sm" />
            )}
            {mission.source === 'paac' && mission.paac_criteria_key && (
              <span className="text-[10px] font-mono bg-ink-100 text-ink-700 px-1.5 py-0.5 rounded">
                PAAC {mission.paac_criteria_key}
              </span>
            )}
          </div>
          <p className="font-display font-semibold text-ink-900 leading-snug">
            {mission.title}
          </p>
          {showRep && (
            <p className="text-xs text-ink-500 mt-0.5">
              {mission.rep_name} · {mission.rep_email.split('@')[0]}
            </p>
          )}
          {!compact && (
            <p className="text-xs text-ink-600 mt-1.5 line-clamp-2 leading-relaxed">
              {mission.description}
            </p>
          )}
        </div>
        {mission.status === 'completed' && (
          <div className="text-right shrink-0">
            <PointsBadge points={mission.points_awarded} size="sm" />
            {mission.on_time_bonus && (
              <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                +20% bônus
              </p>
            )}
          </div>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 pt-2">{actions}</div>}
    </div>
  );
}

// ============================================================
// CANDIDATE CARD (tasks PAAC que viram missões)
// ============================================================

function CandidateCard({ candidate, onActivate, showRep = false }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-dashed border-ink-200 p-5 flex flex-col gap-3 hover:border-gold-400 transition-all">
      <div className="flex items-start gap-3">
        {showRep && <Avatar name={candidate.rep_name} size="md" />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gold-50 border border-gold-200 text-gold-800">
              <Sparkles className="w-3 h-3" /> Candidata da PAAC
            </span>
            <span className="text-[10px] font-mono bg-ink-100 text-ink-700 px-1.5 py-0.5 rounded">
              {candidate.paac_criteria_key}
            </span>
            <span className="text-[10px] text-ink-500">
              {formatDate(candidate.evaluation_date)}
            </span>
          </div>
          <p className="font-display font-semibold text-ink-900 leading-snug text-sm">
            {candidate.paac_criteria_label}
          </p>
          <p className="text-[11px] text-ink-500 mt-0.5">
            {candidate.section_label}
            {showRep && ` · ${candidate.rep_name}`}
          </p>
          {candidate.suggested_course && (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-sky-700">
              <BookOpen className="w-3 h-3" />
              Curso sugerido: <span className="font-semibold">{candidate.suggested_course.title}</span>
            </div>
          )}
        </div>
      </div>
      <Button
        onClick={() => onActivate(candidate)}
        className="bg-ink-900 hover:bg-ink-800 text-gold-200 w-full gap-1.5"
        size="sm"
      >
        <Zap className="w-4 h-4" /> Ativar missão
      </Button>
    </div>
  );
}

// ============================================================
// DIALOG — ATIVAR MISSÃO (a partir de candidata ou manual)
// ============================================================

function MissionConfigDialog({
  open,
  onClose,
  onSubmit,
  candidate = null, // se vier, é ativação
  defaultRep = null,
  mode = 'activate',
}) {
  const isManual = mode === 'manual';
  const defaultCourseId = candidate?.suggested_course?.id || '';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [objective, setObjective] = useState('');
  const [successCriteria, setSuccessCriteria] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [deadline, setDeadline] = useState('');
  const [suggestedCourseId, setSuggestedCourseId] = useState(defaultCourseId);
  const [repEmail, setRepEmail] = useState(defaultRep || '');

  // Reinitialize when opened
  useEffect(() => {
    if (!open) return;
    if (candidate) {
      setTitle(`Desenvolver: ${candidate.paac_criteria_label.split(' —')[0]}`);
      setDescription(
        `A partir do combinado na PAAC de ${formatFullDate(candidate.evaluation_date)} no critério ${candidate.paac_criteria_key}, o colaborador vai trabalhar para passar de "${candidate.current_status === 'em_andamento' ? 'em andamento' : 'pendente'}" para Atende/Supera.`
      );
      setObjective('');
      setSuccessCriteria('');
      setDifficulty('medium');
      setDeadline(() => {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        return d.toISOString().slice(0, 10);
      });
      setSuggestedCourseId(candidate.suggested_course?.id || '');
      setRepEmail(candidate.rep_email);
    } else {
      setTitle('');
      setDescription('');
      setObjective('');
      setSuccessCriteria('');
      setDifficulty('medium');
      setDeadline(() => {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        return d.toISOString().slice(0, 10);
      });
      setSuggestedCourseId('');
      setRepEmail(defaultRep || MOCK_TEAM[0].email);
    }
  }, [open, candidate, defaultRep]);

  const canSubmit = title.trim() && description.trim() && deadline && repEmail;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const config = {
      title: title.trim(),
      description: description.trim(),
      objective: objective.trim(),
      success_criteria: successCriteria.trim(),
      difficulty,
      deadline,
      suggested_course_id: suggestedCourseId || null,
      rep_email: repEmail,
    };
    onSubmit(config);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {candidate ? 'Ativar missão da PAAC' : 'Criar missão manual'}
          </DialogTitle>
          <DialogDescription>
            {candidate
              ? `Para: ${candidate.rep_name} · Critério ${candidate.paac_criteria_key}`
              : 'Defina uma nova missão para alguém do time.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {isManual && !candidate && (
            <div>
              <label className="text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5 block">
                Colaborador
              </label>
              <select
                value={repEmail}
                onChange={(e) => setRepEmail(e.target.value)}
                className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none"
              >
                {MOCK_TEAM.map((r) => (
                  <option key={r.email} value={r.email}>
                    {r.full_name} — {r.team}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5 block">
              Título
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Dominar o uso do Histórico e Falado pelo Médico"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5 block">
              Descrição
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="O que o colaborador precisa fazer exatamente?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5 block">
                Objetivo
              </label>
              <Textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                rows={2}
                placeholder="Qual a finalidade?"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5 block">
                Critério de sucesso
              </label>
              <Textarea
                value={successCriteria}
                onChange={(e) => setSuccessCriteria(e.target.value)}
                rows={2}
                placeholder="Como saberemos que foi concluída?"
              />
            </div>
          </div>

          {/* Dificuldade */}
          <div>
            <label className="text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5 block">
              Dificuldade (define os pontos-base)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(DIFFICULTY).map(([key, diff]) => {
                const active = difficulty === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setDifficulty(key)}
                    className={`relative rounded-xl border-2 p-3 text-left transition-all ${
                      active
                        ? 'border-gold-400 bg-gold-50 shadow-soft'
                        : 'border-ink-200 hover:border-ink-300'
                    }`}
                  >
                    <p className={`font-display font-semibold text-sm ${active ? 'text-ink-900' : 'text-ink-700'}`}>
                      {diff.label}
                    </p>
                    <p className={`text-xs mt-0.5 ${active ? 'text-gold-800 font-semibold' : 'text-ink-500'}`}>
                      {diff.points} pts base
                    </p>
                    {active && (
                      <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-gold-600" />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-ink-500 mt-2">
              💡 Entregar antes do prazo dá +20% de bônus em pontos.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5 block">
                Prazo
              </label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5 block">
                Curso sugerido (Academy)
              </label>
              <select
                value={suggestedCourseId}
                onChange={(e) => setSuggestedCourseId(e.target.value)}
                className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none"
              >
                <option value="">Nenhum</option>
                {MOCK_COURSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="bg-ink-900 hover:bg-ink-800 text-gold-200 gap-1.5"
          >
            <Zap className="w-4 h-4" />
            {candidate ? 'Ativar missão' : 'Criar missão'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// DIALOG — VALIDAR MISSÃO (gestor)
// ============================================================

function ValidateMissionDialog({ open, mission, onClose, onApprove, onRework }) {
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (open) setFeedback('');
  }, [open, mission?.id]);

  if (!mission) return null;

  const potentialPoints = (() => {
    const onTime = !mission.deadline || new Date() <= new Date(mission.deadline);
    return onTime ? Math.round(mission.base_points * 1.2) : mission.base_points;
  })();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Validar missão</DialogTitle>
          <DialogDescription>
            {mission.rep_name} reportou a conclusão em{' '}
            {formatFullDate(mission.report?.submitted_at)}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Mission header */}
          <div className="bg-paper-50 rounded-xl p-4 border border-ink-100">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <DifficultyPill difficulty={mission.difficulty} size="sm" />
              <PointsBadge points={potentialPoints} size="sm" />
              {mission.paac_criteria_key && (
                <span className="text-[10px] font-mono bg-ink-100 text-ink-700 px-1.5 py-0.5 rounded">
                  PAAC {mission.paac_criteria_key}
                </span>
              )}
            </div>
            <p className="font-display font-semibold text-ink-900">{mission.title}</p>
            <p className="text-xs text-ink-600 mt-1">{mission.description}</p>
            {mission.success_criteria && (
              <div className="mt-3 pt-3 border-t border-ink-100">
                <p className="text-[11px] uppercase tracking-wider text-gold-700 font-semibold">
                  Critério de sucesso
                </p>
                <p className="text-xs text-ink-700 mt-1">{mission.success_criteria}</p>
              </div>
            )}
          </div>

          {/* Report */}
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gold-700 font-semibold mb-2">
              Relato do colaborador
            </p>
            <div className="bg-white rounded-xl p-4 border border-ink-100">
              <p className="text-sm text-ink-800 whitespace-pre-wrap leading-relaxed">
                {mission.report?.text}
              </p>
              {mission.report?.evidence_url && (
                <a
                  href={mission.report.evidence_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-sky-700 hover:underline mt-3"
                >
                  <ExternalLink className="w-3 h-3" />
                  {mission.report.evidence_url}
                </a>
              )}
            </div>
          </div>

          {/* Feedback */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-gold-700 font-semibold mb-1.5 block">
              Seu feedback (aparece pra quem fez)
            </label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              placeholder="Comente o que foi bem e/ou o que precisa ajustar…"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            variant="ghost"
            onClick={() => onRework(mission, feedback)}
            disabled={!feedback.trim()}
            className="text-rose-700 hover:text-rose-800 hover:bg-rose-50 gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            Pedir ajuste
          </Button>
          <Button
            onClick={() => onApprove(mission, feedback)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
          >
            <ThumbsUp className="w-4 h-4" />
            Aprovar e creditar {potentialPoints} pts
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// DIALOG — REPORTAR CONCLUSÃO (colaborador)
// ============================================================

function ReportMissionDialog({ open, mission, onClose, onSubmit }) {
  const [text, setText] = useState('');
  const [evidence, setEvidence] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setText(mission?.status === 'needs_rework' ? mission.report?.text || '' : '');
      setEvidence(mission?.report?.evidence_url || '');
      setSubmitting(false);
    }
  }, [open, mission?.id, mission?.status, mission?.report]);

  if (!mission) return null;

  const canSubmit = text.trim().length >= 40 && !submitting;

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    onSubmit(mission, text.trim(), evidence.trim() || null);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {mission.status === 'needs_rework' ? 'Enviar novo relato' : 'Reportar conclusão'}
          </DialogTitle>
          <DialogDescription>
            {mission.status === 'needs_rework'
              ? 'O gestor pediu ajustes no último relato. Envie nova versão.'
              : 'Descreva como você executou a missão. O gestor irá validar e creditar os pontos.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Mission summary */}
          <div className="bg-paper-50 rounded-xl p-4 border border-ink-100">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <DifficultyPill difficulty={mission.difficulty} size="sm" />
              <DeadlinePill deadline={mission.deadline} size="sm" />
            </div>
            <p className="font-display font-semibold text-ink-900">{mission.title}</p>
            {mission.success_criteria && (
              <div className="mt-2 pt-2 border-t border-ink-100">
                <p className="text-[11px] uppercase tracking-wider text-gold-700 font-semibold">
                  Critério de sucesso
                </p>
                <p className="text-xs text-ink-700 mt-0.5">{mission.success_criteria}</p>
              </div>
            )}
          </div>

          {/* Feedback anterior se rework */}
          {mission.status === 'needs_rework' && mission.manager_feedback && (
            <div className="bg-rose-50 rounded-xl p-4 border border-rose-200">
              <p className="text-[11px] uppercase tracking-wider text-rose-700 font-semibold mb-1.5">
                Feedback do gestor
              </p>
              <p className="text-sm text-rose-800 whitespace-pre-wrap">
                {mission.manager_feedback}
              </p>
            </div>
          )}

          <div>
            <label className="text-[11px] uppercase tracking-wider text-gold-700 font-semibold mb-1.5 block">
              Como você executou a missão?
            </label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              placeholder="Descreva o que foi feito, como foi feito e quais resultados você mediu. Mínimo 40 caracteres."
            />
            <p className="text-[11px] text-ink-500 mt-1">
              {text.length} caracteres {text.length < 40 && '· mínimo 40'}
            </p>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-gold-700 font-semibold mb-1.5 block">
              Link de evidência (opcional)
            </label>
            <Input
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              placeholder="https://portal.arese.com.br/…"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="bg-ink-900 hover:bg-ink-800 text-gold-200 gap-1.5"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Enviando…' : 'Enviar para validação'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// APPROVAL FEEDBACK TOAST (celebração ao aprovar ou reportar)
// ============================================================

function ToastCelebrate({ show, message, icon: Icon = Trophy }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          className="fixed bottom-6 right-6 z-50 bg-gold-shine text-ink-900 rounded-2xl shadow-2xl px-5 py-4 flex items-center gap-3 border-2 border-gold-500 max-w-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-ink-900 flex items-center justify-center">
            <Icon className="w-5 h-5 text-gold-300" />
          </div>
          <div>
            <p className="font-display font-semibold text-sm">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// VIEWS — GESTOR
// ============================================================

function GestorView({
  leaderboard,
  candidates,
  pending,
  allActive,
  allCompleted,
  onActivate,
  onValidate,
  onCreateManual,
  currentEmail,
}) {
  const [tab, setTab] = useState('candidates');

  return (
    <div className="space-y-10">
      {/* LEADERBOARD */}
      <section>
        <SectionHeader
          eyebrow="Ranking"
          title="Pódio do distrito"
          action={
            <span className="text-xs text-ink-500">
              <Trophy className="w-3 h-3 inline mr-1" />
              Competição saudável do ciclo
            </span>
          }
        />
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-5 items-start">
          <div className="bg-paper-50 border border-ink-100 rounded-3xl p-6">
            <Podium leaderboard={leaderboard} currentEmail={currentEmail} />
          </div>
          <LeaderboardList leaderboard={leaderboard} currentEmail={currentEmail} />
        </div>
      </section>

      {/* PENDING VALIDATION */}
      {pending.length > 0 && (
        <section className="bg-gradient-to-br from-violet-50 to-paper-50 rounded-3xl p-6 border border-violet-200">
          <SectionHeader
            eyebrow="Ação sua"
            title="Aguardando sua validação"
            count={pending.length}
          />
          <div className="grid md:grid-cols-2 gap-3">
            {pending.map((m) => (
              <MissionCard
                key={m.id}
                mission={m}
                showRep
                actions={
                  <Button
                    onClick={() => onValidate(m)}
                    className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5 w-full"
                    size="sm"
                  >
                    <ShieldCheck className="w-4 h-4" /> Validar relato
                  </Button>
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* TABS */}
      <section>
        <SectionHeader
          eyebrow="Gestão"
          title="Missões do time"
          action={
            <Button
              onClick={onCreateManual}
              className="bg-ink-900 hover:bg-ink-800 text-gold-200 gap-1.5"
              size="sm"
            >
              <Plus className="w-4 h-4" /> Criar missão manual
            </Button>
          }
        />

        <div className="flex gap-1 p-1 bg-paper-100 rounded-xl w-fit mb-5">
          {[
            { id: 'candidates', label: 'Candidatas PAAC', count: candidates.length },
            { id: 'active', label: 'Ativas', count: allActive.length },
            { id: 'completed', label: 'Concluídas', count: allCompleted.length },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition ${
                tab === t.id
                  ? 'bg-white shadow-soft text-ink-900'
                  : 'text-ink-500 hover:text-ink-700'
              }`}
            >
              {t.label}{' '}
              <span className="text-xs opacity-60 ml-1">{t.count}</span>
            </button>
          ))}
        </div>

        {tab === 'candidates' &&
          (candidates.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
              {candidates.map((c) => (
                <CandidateCard
                  key={c.id}
                  candidate={c}
                  onActivate={onActivate}
                  showRep
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CheckCircle2}
              title="Nenhuma candidata pendente"
              subtitle="Todas as tasks do PAAC já estão convertidas em missão."
            />
          ))}

        {tab === 'active' &&
          (allActive.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-3">
              {allActive.map((m) => (
                <MissionCard key={m.id} mission={m} showRep />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Target}
              title="Nenhuma missão em andamento"
              subtitle="Ative candidatas ou crie uma missão manual."
            />
          ))}

        {tab === 'completed' &&
          (allCompleted.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-3">
              {allCompleted.map((m) => (
                <MissionCard key={m.id} mission={m} showRep compact />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Trophy}
              title="Nada concluído ainda"
              subtitle="Os pontos começam a chegar quando as primeiras missões forem aprovadas."
            />
          ))}
      </section>
    </div>
  );
}

// ============================================================
// VIEWS — COLABORADOR
// ============================================================

function ColaboradorView({
  myMissions,
  leaderboard,
  myRank,
  currentEmail,
  onReport,
}) {
  const active = myMissions.filter((m) => m.status === 'active');
  const pending = myMissions.filter((m) => m.status === 'pending_validation');
  const rework = myMissions.filter((m) => m.status === 'needs_rework');
  const completed = myMissions.filter((m) => m.status === 'completed');

  return (
    <div className="space-y-10">
      {/* LEADERBOARD */}
      <section>
        <SectionHeader
          eyebrow="Ranking"
          title="Pódio do distrito"
          action={
            myRank && (
              <span className="text-xs text-ink-500">
                Você está em{' '}
                <span className="font-bold text-gold-700">{myRank.rank}º</span>{' '}
                · {myRank.points} pts
              </span>
            )
          }
        />
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-5 items-start">
          <div className="bg-paper-50 border border-ink-100 rounded-3xl p-6">
            <Podium leaderboard={leaderboard} currentEmail={currentEmail} />
          </div>
          <LeaderboardList leaderboard={leaderboard} currentEmail={currentEmail} />
        </div>
      </section>

      {/* Needs rework — prioridade */}
      {rework.length > 0 && (
        <section className="bg-rose-50 rounded-3xl p-6 border border-rose-200">
          <SectionHeader
            eyebrow="Atenção"
            title="Ajustes solicitados pelo gestor"
            count={rework.length}
          />
          <div className="space-y-3">
            {rework.map((m) => (
              <MissionCard
                key={m.id}
                mission={m}
                actions={
                  <>
                    <div className="flex-1 text-xs text-rose-800 italic">
                      "{m.manager_feedback}"
                    </div>
                    <Button
                      onClick={() => onReport(m)}
                      className="bg-rose-600 hover:bg-rose-700 text-white gap-1.5"
                      size="sm"
                    >
                      <Send className="w-4 h-4" /> Reenviar relato
                    </Button>
                  </>
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* Active missions */}
      <section>
        <SectionHeader
          eyebrow="Em andamento"
          title="Minhas missões ativas"
          count={active.length}
        />
        {active.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-3">
            {active.map((m) => (
              <MissionCard
                key={m.id}
                mission={m}
                actions={
                  <>
                    {m.suggested_course_id && (
                      <a
                        href={`/Course?id=${m.suggested_course_id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-sky-200 bg-sky-50 text-sky-700 text-xs font-semibold hover:bg-sky-100 transition"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Ver curso sugerido
                      </a>
                    )}
                    <Button
                      onClick={() => onReport(m)}
                      className={`${m.suggested_course_id ? '' : 'w-full'} bg-ink-900 hover:bg-ink-800 text-gold-200 gap-1.5`}
                      size="sm"
                    >
                      <Upload className="w-4 h-4" /> Reportar conclusão
                    </Button>
                  </>
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Target}
            title="Nada ativo agora"
            subtitle="Aguarde seu gestor ativar uma nova missão a partir da sua PAAC."
          />
        )}
      </section>

      {/* Pending validation */}
      {pending.length > 0 && (
        <section>
          <SectionHeader
            eyebrow="Aguardando"
            title="Em validação pelo gestor"
            count={pending.length}
          />
          <div className="grid md:grid-cols-2 gap-3">
            {pending.map((m) => (
              <MissionCard key={m.id} mission={m} compact />
            ))}
          </div>
        </section>
      )}

      {/* Completed */}
      <section>
        <SectionHeader
          eyebrow="Troféus"
          title="Minhas conquistas"
          count={completed.length}
        />
        {completed.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-3">
            {completed.map((m) => (
              <MissionCard key={m.id} mission={m} compact />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Trophy}
            title="Sua primeira conquista te espera"
            subtitle="Conclua uma missão e envie pra validação pra começar a somar pontos."
          />
        )}
      </section>
    </div>
  );
}

function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="bg-paper-50 rounded-2xl p-10 text-center border border-ink-100">
      <Icon className="w-10 h-10 text-ink-300 mx-auto mb-3" />
      <p className="font-display font-semibold text-ink-900">{title}</p>
      {subtitle && <p className="text-sm text-ink-500 mt-1">{subtitle}</p>}
    </div>
  );
}

// ============================================================
// PAGE
// ============================================================

export default function Athivar() {
  const [role, setRole] = useState(demoStore.getRole());
  const [tick, setTick] = useState(0);
  const [activateTarget, setActivateTarget] = useState(null); // candidate
  const [createManual, setCreateManual] = useState(false);
  const [validateTarget, setValidateTarget] = useState(null); // mission
  const [reportTarget, setReportTarget] = useState(null); // mission
  const [toast, setToast] = useState(null); // { msg, icon }

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    const onRoleChange = () => setRole(demoStore.getRole());
    const onDataChange = () => refresh();
    window.addEventListener('paac-role-change', onRoleChange);
    window.addEventListener('athivar-change', onDataChange);
    window.addEventListener('paac-evals-change', onDataChange);
    return () => {
      window.removeEventListener('paac-role-change', onRoleChange);
      window.removeEventListener('athivar-change', onDataChange);
      window.removeEventListener('paac-evals-change', onDataChange);
    };
  }, [refresh]);

  const isGestor = role === 'gestor';
  const currentUser = demoStore.getCurrentUser();
  const currentEmail = currentUser.email;

  // Data
  const leaderboard = useMemo(
    () => athivarStore.getLeaderboard(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick]
  );
  const candidates = useMemo(
    () => athivarStore.getCandidateMissions(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick]
  );
  const pending = useMemo(
    () => athivarStore.getPendingValidation(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick]
  );
  const allActive = useMemo(
    () => athivarStore.getActive(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick]
  );
  const allCompleted = useMemo(
    () => athivarStore.getCompleted(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick]
  );
  const myMissions = useMemo(
    () => athivarStore.getMissionsByRep(currentEmail),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick, currentEmail]
  );
  const myRank = useMemo(
    () => athivarStore.getUserRank(currentEmail),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick, currentEmail]
  );

  // Gestor team stats
  const gestorStats = useMemo(() => {
    const totalPoints = leaderboard.reduce((acc, r) => acc + r.points, 0);
    const totalCompleted = leaderboard.reduce((acc, r) => acc + r.completed, 0);
    return { totalPoints, totalCompleted, pendingCount: pending.length };
  }, [leaderboard, pending]);

  // Handlers
  const showToast = (msg, icon) => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 2500);
  };

  const handleActivate = (config) => {
    if (!activateTarget) return;
    athivarStore.activateMission(activateTarget, config);
    setActivateTarget(null);
    showToast('Missão ativada com sucesso', Zap);
  };

  const handleCreateManual = (config) => {
    athivarStore.createManualMission(config);
    setCreateManual(false);
    showToast('Missão criada', Plus);
  };

  const handleApprove = (mission, feedback) => {
    const updated = athivarStore.approveMission(mission.id, feedback);
    if (updated) {
      // registra em evolution como melhoria de campo
      evolutionStore.addImprovement(mission.rep_email, {
        date: updated.approved_at,
        title: updated.title,
        description: `Missão aprovada (+${updated.points_awarded} pts). ${updated.report?.text || ''}`,
        category: mission.suggested_course_id ? 'curso' : 'campo',
        paac_key: mission.paac_criteria_key || undefined,
      });
    }
    setValidateTarget(null);
    showToast(`+${updated.points_awarded} pts creditados a ${mission.rep_name}`, Trophy);
  };

  const handleRework = (mission, feedback) => {
    athivarStore.requestRework(mission.id, feedback);
    setValidateTarget(null);
    showToast('Ajuste solicitado', RotateCcw);
  };

  const handleReport = (mission, text, evidence) => {
    athivarStore.submitReport(mission.id, text, evidence);
    setReportTarget(null);
    showToast('Relato enviado para validação', Send);
  };

  return (
    <div className="space-y-10 min-h-[80vh]">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-ink-grid text-white shadow-ink">
        <div className="absolute -top-20 -right-10 h-64 w-64 rounded-full bg-gold-400/15 blur-3xl" />
        <div className="relative grid lg:grid-cols-[1.6fr_auto] gap-8 px-7 py-8 lg:px-10 lg:py-10 items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30">
              <Trophy className="w-3.5 h-3.5 text-gold-300" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-gold-200 font-semibold">
                Etapa 4 · Ativação
              </span>
            </span>
            <h1 className="font-display text-3xl lg:text-4xl font-semibold leading-[1.1]">
              {isGestor ? (
                <>
                  Athivar — <span className="text-gold-300">Missões do Time</span>
                </>
              ) : (
                <>
                  Minhas <span className="text-gold-300">Missões</span>
                </>
              )}
            </h1>
            <p className="text-ink-200 max-w-xl leading-relaxed">
              {isGestor
                ? 'Transforme as tasks da PAAC em missões ativas. O time ganha pontos, compete de forma saudável e a evolução vira visível.'
                : 'Execute as missões ativadas pelo seu gestor. Cada entrega soma pontos — e entregar antes do prazo dá +20% de bônus.'}
            </p>
          </div>

          {/* Stats */}
          {isGestor ? (
            <div className="grid grid-cols-3 gap-3 justify-self-start lg:justify-self-end">
              <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 px-5 py-4 text-center min-w-[110px]">
                <p className="font-display text-3xl font-semibold text-gold-300 tabular-nums">
                  {gestorStats.totalPoints}
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-ink-300 mt-1">
                  pts no distrito
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 px-5 py-4 text-center min-w-[110px]">
                <p className="font-display text-3xl font-semibold text-white tabular-nums">
                  {gestorStats.totalCompleted}
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-ink-300 mt-1">
                  concluídas
                </p>
              </div>
              <div className="rounded-2xl bg-gold-shine px-5 py-4 text-center min-w-[110px]">
                <p className="font-display text-3xl font-semibold text-ink-900 tabular-nums">
                  {gestorStats.pendingCount}
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-ink-900/70 mt-1">
                  p/ validar
                </p>
              </div>
            </div>
          ) : (
            myRank && (
              <div className="grid grid-cols-3 gap-3 justify-self-start lg:justify-self-end">
                <div className="rounded-2xl bg-gold-shine px-5 py-4 text-center min-w-[110px]">
                  <p className="font-display text-3xl font-semibold text-ink-900 tabular-nums">
                    {myRank.rank}º
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-ink-900/70 mt-1">
                    posição
                  </p>
                </div>
                <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 px-5 py-4 text-center min-w-[110px]">
                  <p className="font-display text-3xl font-semibold text-gold-300 tabular-nums">
                    {myRank.points}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-ink-300 mt-1">
                    pontos
                  </p>
                </div>
                <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 px-5 py-4 text-center min-w-[110px]">
                  <p className="font-display text-3xl font-semibold text-white tabular-nums">
                    {myRank.completed}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-ink-300 mt-1">
                    concluídas
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* CONTENT */}
      {isGestor ? (
        <GestorView
          leaderboard={leaderboard}
          candidates={candidates}
          pending={pending}
          allActive={allActive}
          allCompleted={allCompleted}
          onActivate={setActivateTarget}
          onValidate={setValidateTarget}
          onCreateManual={() => setCreateManual(true)}
          currentEmail={currentEmail}
        />
      ) : (
        <ColaboradorView
          myMissions={myMissions}
          leaderboard={leaderboard}
          myRank={myRank}
          currentEmail={currentEmail}
          onReport={setReportTarget}
        />
      )}

      {/* DIALOGS */}
      <MissionConfigDialog
        open={!!activateTarget}
        candidate={activateTarget}
        onClose={() => setActivateTarget(null)}
        onSubmit={handleActivate}
        mode="activate"
      />
      <MissionConfigDialog
        open={createManual}
        onClose={() => setCreateManual(false)}
        onSubmit={handleCreateManual}
        mode="manual"
      />
      <ValidateMissionDialog
        open={!!validateTarget}
        mission={validateTarget}
        onClose={() => setValidateTarget(null)}
        onApprove={handleApprove}
        onRework={handleRework}
      />
      <ReportMissionDialog
        open={!!reportTarget}
        mission={reportTarget}
        onClose={() => setReportTarget(null)}
        onSubmit={handleReport}
      />

      {/* TOAST */}
      <ToastCelebrate
        show={!!toast}
        message={toast?.msg}
        icon={toast?.icon || Trophy}
      />
    </div>
  );
}
