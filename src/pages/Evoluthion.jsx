import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  User,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Star,
  Award,
  BookOpen,
  Target,
  Sparkles,
  Pencil,
  Save,
  Calendar,
  ChevronRight,
  GraduationCap,
  HandHeart,
  FileText,
  Trophy,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { demoStore } from '@/lib/paacMockData';
import { evolutionStore } from '@/lib/evolutionMockData';
import { PAAC_DEMANDA, PAAC_PDV, SCORE_LABEL } from '@/lib/paacConfig';

// ============================================================
// HELPERS
// ============================================================

// Constrói um mapa {criteria_key -> label} a partir dos configs PAAC
function buildCriteriaLabelMap() {
  const map = {};
  const walk = (nodes) => {
    for (const s of nodes || []) {
      for (const sub of s.subsections || []) {
        for (const c of sub.criteria || []) {
          map[c.key] = { label: c.label, section: sub.label };
        }
      }
    }
  };
  walk(PAAC_DEMANDA);
  walk(PAAC_PDV);
  return map;
}

const INITIALS = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

const CATEGORY_STYLE = {
  curso: {
    label: 'Academy',
    icon: GraduationCap,
    dot: 'bg-sky-500',
    pill: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  campo: {
    label: 'Campo',
    icon: Target,
    dot: 'bg-emerald-500',
    pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  mentoria: {
    label: 'Mentoria',
    icon: HandHeart,
    dot: 'bg-violet-500',
    pill: 'bg-violet-50 text-violet-700 border-violet-200',
  },
  certificado: {
    label: 'Certificado',
    icon: Trophy,
    dot: 'bg-amber-500',
    pill: 'bg-amber-50 text-amber-700 border-amber-200',
  },
};

const TASK_STATUS_STYLE = {
  concluido: {
    label: 'Concluído',
    icon: CheckCircle2,
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    accent: 'bg-emerald-500',
  },
  em_andamento: {
    label: 'Em andamento',
    icon: Clock,
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    accent: 'bg-amber-500',
  },
  pendente: {
    label: 'Pendente',
    icon: AlertCircle,
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    accent: 'bg-rose-500',
  },
};

const SCORE_STYLE = {
  S: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  A: 'bg-sky-100 text-sky-800 border-sky-200',
  N: 'bg-rose-100 text-rose-800 border-rose-200',
};

function formatDate(isoDate) {
  if (!isoDate) return '—';
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoDate;
  }
}

// ============================================================
// UI BITS
// ============================================================

function StarRating({ value, onChange, readOnly = false }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= value;
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange?.(n)}
            className={`transition-all ${
              readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            }`}
          >
            <Star
              className={`w-4 h-4 ${
                active ? 'fill-gold-400 text-gold-500' : 'text-ink-200'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

function Avatar({ name, size = 'md', ring = false }) {
  const sizes = {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-11 h-11 text-xs',
    lg: 'w-14 h-14 text-sm',
    xl: 'w-20 h-20 text-lg',
  };
  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br from-ink-700 to-ink-900 text-gold-300 font-display font-semibold flex items-center justify-center shadow-soft ${
        ring ? 'ring-2 ring-gold-400 ring-offset-2 ring-offset-paper-50' : ''
      }`}
    >
      {INITIALS(name)}
    </div>
  );
}

function ProgressRing({ percent, size = 68, stroke = 6, color = '#d4a436' }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-sm font-semibold text-ink-900 tabular-nums">
          {percent}%
        </span>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, hint, tone = 'ink' }) {
  const toneMap = {
    ink: 'bg-ink-900 text-white',
    gold: 'bg-gold-shine text-ink-900',
    paper: 'bg-white text-ink-900 border border-ink-100',
  };
  return (
    <div className={`rounded-2xl px-4 py-3.5 ${toneMap[tone]} shadow-soft`}>
      <div className="flex items-start justify-between">
        <div>
          <p
            className={`text-[10px] uppercase tracking-[0.18em] font-semibold ${
              tone === 'ink' ? 'text-gold-300' : 'text-ink-500'
            }`}
          >
            {label}
          </p>
          <p className="font-display text-2xl font-semibold mt-0.5 tabular-nums">
            {value}
          </p>
          {hint && (
            <p
              className={`text-[11px] mt-0.5 ${
                tone === 'ink' ? 'text-ink-300' : 'text-ink-500'
              }`}
            >
              {hint}
            </p>
          )}
        </div>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            tone === 'ink' ? 'bg-white/10' : 'bg-ink-900/5'
          }`}
        >
          <Icon className={`w-4 h-4 ${tone === 'ink' ? 'text-gold-300' : 'text-ink-700'}`} />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SECTIONS
// ============================================================

function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        {eyebrow && (
          <p className="text-[10px] uppercase tracking-[0.22em] text-gold-700 font-semibold">
            {eyebrow}
          </p>
        )}
        <h3 className="font-display text-lg font-semibold text-ink-900 mt-0.5">{title}</h3>
      </div>
      {action}
    </div>
  );
}

function TasksBlock({ tasks }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-paper-50 rounded-2xl p-6 text-center border border-ink-100">
        <FileText className="w-8 h-8 text-ink-300 mx-auto mb-2" />
        <p className="text-sm text-ink-500">Nenhuma task combinada ainda.</p>
      </div>
    );
  }
  const grouped = {
    concluido: tasks.filter((t) => t.status === 'concluido'),
    em_andamento: tasks.filter((t) => t.status === 'em_andamento'),
    pendente: tasks.filter((t) => t.status === 'pendente'),
  };
  const order = ['concluido', 'em_andamento', 'pendente'];
  return (
    <div className="space-y-3">
      {order.map((status) => {
        const list = grouped[status];
        if (!list.length) return null;
        const cfg = TASK_STATUS_STYLE[status];
        const Icon = cfg.icon;
        return (
          <div key={status} className={`rounded-2xl border ${cfg.border} ${cfg.bg} overflow-hidden`}>
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/50">
              <Icon className={`w-4 h-4 ${cfg.text}`} />
              <span className={`text-xs font-semibold ${cfg.text} uppercase tracking-wider`}>
                {cfg.label}
              </span>
              <span className={`ml-auto text-xs font-bold tabular-nums ${cfg.text}`}>
                {list.length}
              </span>
            </div>
            <ul className="divide-y divide-white">
              {list.map((t) => (
                <li key={t.id} className="px-4 py-3 flex items-start gap-3 bg-white/60">
                  <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${cfg.accent}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink-900 leading-snug">{t.criteria_label}</p>
                    <p className="text-[11px] text-ink-500 mt-0.5">
                      {t.section_label} · PAAC {formatDate(t.evaluation_date)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function StrengthsGapsBlock({ paac, criteriaMap }) {
  const strengths = paac.strengths.map((k) => ({ key: k, ...(criteriaMap[k] || {}) }));
  const gaps = paac.gaps.map((k) => ({ key: k, ...(criteriaMap[k] || {}) }));

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <h4 className="font-display font-semibold text-emerald-900 text-sm">
            Pontos fortes (S — Supera)
          </h4>
        </div>
        {strengths.length > 0 ? (
          <ul className="space-y-2">
            {strengths.map((s) => (
              <li key={s.key} className="flex items-start gap-2 text-sm text-emerald-800">
                <span className="font-mono text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded mt-0.5 tabular-nums">
                  {s.key}
                </span>
                <span className="leading-snug">{s.label || 'Critério'}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-emerald-700/70">
            Ainda sem critérios marcados como Supera.
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-rose-500 flex items-center justify-center">
            <Target className="w-3.5 h-3.5 text-white" />
          </div>
          <h4 className="font-display font-semibold text-rose-900 text-sm">
            Prioridade de desenvolvimento (N)
          </h4>
        </div>
        {gaps.length > 0 ? (
          <ul className="space-y-2">
            {gaps.map((g) => (
              <li key={g.key} className="flex items-start gap-2 text-sm text-rose-800">
                <span className="font-mono text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded mt-0.5 tabular-nums">
                  {g.key}
                </span>
                <span className="leading-snug">{g.label || 'Critério'}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-rose-700/70">Sem gaps críticos no momento.</p>
        )}
      </div>
    </div>
  );
}

function CoursesBlock({ courses }) {
  const all = [
    ...courses.done.map((c) => ({ ...c, state: 'done' })),
    ...courses.inProgress.map((c) => ({ ...c, state: 'progress' })),
  ];
  if (all.length === 0) {
    return (
      <div className="bg-paper-50 rounded-2xl p-6 text-center border border-ink-100">
        <BookOpen className="w-8 h-8 text-ink-300 mx-auto mb-2" />
        <p className="text-sm text-ink-500">Nenhum curso iniciado ainda.</p>
      </div>
    );
  }
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {all.map((c) => (
        <div
          key={c.id}
          className="rounded-2xl border border-ink-100 bg-white p-4 flex items-start gap-3"
        >
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.cover_color} flex items-center justify-center shrink-0`}
          >
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ink-900 leading-snug truncate">
              {c.title}
            </p>
            <p className="text-[11px] text-ink-500 mt-0.5">
              {c.pillar_label} · {c.duration_min} min
            </p>
            <div className="flex items-center gap-2 mt-2">
              {c.state === 'done' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Concluído
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  <Clock className="w-3 h-3" /> {c.percent}%
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ImprovementsBlock({ improvements }) {
  if (improvements.length === 0) {
    return (
      <div className="bg-paper-50 rounded-2xl p-6 text-center border border-ink-100">
        <TrendingUp className="w-8 h-8 text-ink-300 mx-auto mb-2" />
        <p className="text-sm text-ink-500">Nenhuma ação de melhoria registrada.</p>
      </div>
    );
  }
  return (
    <ol className="relative border-l-2 border-ink-100 pl-5 space-y-4">
      {improvements.map((imp) => {
        const cfg = CATEGORY_STYLE[imp.category] || CATEGORY_STYLE.campo;
        const Icon = cfg.icon;
        return (
          <li key={imp.id} className="relative">
            <span
              className={`absolute -left-[26px] top-1 w-4 h-4 rounded-full ring-4 ring-paper-50 ${cfg.dot}`}
            />
            <div className="bg-white rounded-2xl border border-ink-100 p-4">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.pill}`}
                >
                  <Icon className="w-3 h-3" /> {cfg.label}
                </span>
                <span className="text-[11px] text-ink-500 inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {formatDate(imp.date)}
                </span>
                {imp.paac_key && (
                  <span className="text-[10px] font-mono bg-ink-100 text-ink-700 px-1.5 py-0.5 rounded">
                    PAAC {imp.paac_key}
                  </span>
                )}
              </div>
              <p className="font-display font-semibold text-ink-900 text-sm leading-snug">
                {imp.title}
              </p>
              <p className="text-xs text-ink-600 mt-1 leading-relaxed">{imp.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function ManagerReviewEditor({ email, review, onSaved }) {
  const [draft, setDraft] = useState(review);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(review);
    setEditing(false);
  }, [email, review]);

  const handleSave = () => {
    setSaving(true);
    const saved = evolutionStore.saveReview(email, draft);
    setTimeout(() => {
      setSaving(false);
      setEditing(false);
      onSaved?.(saved);
    }, 300);
  };

  const handleCancel = () => {
    setDraft(review);
    setEditing(false);
  };

  return (
    <div className="rounded-2xl bg-ink-grid text-white overflow-hidden shadow-ink">
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-gold-300" />
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold-200 font-semibold">
            Review do Gestor
          </p>
        </div>
        {editing ? (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-white/70 hover:text-white hover:bg-white/10 h-8"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="bg-gold-500 hover:bg-gold-400 text-ink-900 h-8 gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Salvando…' : 'Salvar review'}
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            onClick={() => setEditing(true)}
            className="bg-white/10 hover:bg-white/20 text-white h-8 gap-1.5 border border-white/20"
          >
            <Pencil className="w-3.5 h-3.5" />
            {review.updated_at ? 'Editar' : 'Escrever review'}
          </Button>
        )}
      </div>

      <div className="p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-gold-200">
              Avaliação geral
            </p>
            <div className="mt-1">
              <StarRating
                value={editing ? draft.overall_rating : review.overall_rating}
                onChange={(v) => setDraft({ ...draft, overall_rating: v })}
                readOnly={!editing}
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-[0.18em] text-gold-200">
              Atualizado em
            </p>
            <p className="text-sm text-white mt-1">
              {review.updated_at ? formatDate(review.updated_at) : '—'}
            </p>
          </div>
        </div>

        {[
          { key: 'highlights', label: 'Destaques', icon: Sparkles },
          { key: 'areas_to_improve', label: 'Áreas a desenvolver', icon: Target },
          { key: 'next_steps', label: 'Próximos passos', icon: ChevronRight },
        ].map(({ key, label, icon: Icon }) => (
          <div key={key}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Icon className="w-3.5 h-3.5 text-gold-300" />
              <p className="text-[11px] uppercase tracking-[0.18em] text-gold-200 font-semibold">
                {label}
              </p>
            </div>
            {editing ? (
              <Textarea
                value={draft[key] || ''}
                onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                rows={3}
                placeholder={`Escreva sobre ${label.toLowerCase()}…`}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-gold-400/40 focus-visible:border-gold-400"
              />
            ) : (
              <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                {review[key] || (
                  <span className="text-white/40 italic">
                    Nada escrito ainda pelo gestor.
                  </span>
                )}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ManagerReviewReadOnly({ review, leaderName }) {
  const hasContent =
    review.updated_at || review.highlights || review.areas_to_improve || review.next_steps;
  return (
    <div className="rounded-2xl bg-ink-grid text-white overflow-hidden shadow-ink">
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-gold-300" />
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold-200 font-semibold">
            Review do Gestor
          </p>
        </div>
        <div className="text-[11px] text-white/70">
          {review.updated_at ? (
            <>
              Atualizado em{' '}
              <span className="text-white font-medium">{formatDate(review.updated_at)}</span>
              {leaderName && <> · por <span className="text-gold-300">{leaderName}</span></>}
            </>
          ) : (
            <span className="italic text-white/40">Aguardando review</span>
          )}
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="flex items-center gap-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold-200">
            Avaliação geral
          </p>
          <StarRating value={review.overall_rating || 0} readOnly />
        </div>

        {!hasContent ? (
          <div className="text-center py-6">
            <p className="text-sm text-white/60">
              Seu gestor ainda não escreveu o review deste ciclo.
            </p>
          </div>
        ) : (
          [
            { key: 'highlights', label: 'Destaques', icon: Sparkles },
            { key: 'areas_to_improve', label: 'Áreas a desenvolver', icon: Target },
            { key: 'next_steps', label: 'Próximos passos', icon: ChevronRight },
          ].map(({ key, label, icon: Icon }) => (
            <div key={key}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Icon className="w-3.5 h-3.5 text-gold-300" />
                <p className="text-[11px] uppercase tracking-[0.18em] text-gold-200 font-semibold">
                  {label}
                </p>
              </div>
              <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                {review[key] || (
                  <span className="text-white/40 italic">—</span>
                )}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================
// TEAM GRID (apenas gestor)
// ============================================================

function TeamRepCard({ summary, isActive, onClick }) {
  const { rep, tasks, paac, courses, improvements, review } = summary;
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
        isActive
          ? 'border-gold-400 bg-white shadow-gold scale-[1.01]'
          : 'border-ink-100 bg-white hover:border-ink-300 hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <Avatar name={rep.full_name} size="md" ring={isActive} />
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-ink-900 text-sm leading-tight truncate">
            {rep.full_name}
          </p>
          <p className="text-[11px] text-ink-500 truncate">{rep.team}</p>
        </div>
        <ProgressRing percent={paac.performance} size={44} stroke={4} />
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        <div className="bg-paper-50 rounded-lg px-2 py-1.5 text-center border border-ink-100">
          <p className="font-display text-sm font-semibold text-ink-900 tabular-nums">
            {tasks.completed}/{tasks.total}
          </p>
          <p className="text-[10px] sm:text-[9px] uppercase tracking-wider text-ink-500 font-semibold">
            Tasks
          </p>
        </div>
        <div className="bg-paper-50 rounded-lg px-2 py-1.5 text-center border border-ink-100">
          <p className="font-display text-sm font-semibold text-ink-900 tabular-nums">
            {courses.done.length}
          </p>
          <p className="text-[10px] sm:text-[9px] uppercase tracking-wider text-ink-500 font-semibold">
            Cursos
          </p>
        </div>
        <div className="bg-paper-50 rounded-lg px-2 py-1.5 text-center border border-ink-100">
          <p className="font-display text-sm font-semibold text-ink-900 tabular-nums">
            {improvements.length}
          </p>
          <p className="text-[10px] sm:text-[9px] uppercase tracking-wider text-ink-500 font-semibold">
            Melhorias
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <StarRating value={review.overall_rating || 0} readOnly />
        {review.updated_at ? (
          <span className="text-[10px] text-emerald-700 inline-flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3" /> Review ok
          </span>
        ) : (
          <span className="text-[10px] text-rose-700 inline-flex items-center gap-1 font-semibold">
            <AlertCircle className="w-3 h-3" /> Sem review
          </span>
        )}
      </div>
    </button>
  );
}

// ============================================================
// DETAIL PANEL
// ============================================================

function RepDetailPanel({ summary, criteriaMap, canEdit, leaderName, onReviewSaved }) {
  const { rep, tasks, paac, courses, improvements, review } = summary;

  return (
    <motion.div
      key={rep.email}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-8"
    >
      {/* Identity banner */}
      <div className="bg-white rounded-2xl border border-ink-100 p-6 flex items-center gap-5 shadow-soft">
        <Avatar name={rep.full_name} size="xl" />
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-[0.22em] text-gold-700 font-semibold">
            Relatório de evolução
          </p>
          <h2 className="font-display text-2xl font-semibold text-ink-900 mt-0.5">
            {rep.full_name}
          </h2>
          <p className="text-sm text-ink-500 mt-0.5">
            {rep.position} · {rep.team}
          </p>
        </div>
        <div className="text-right">
          <StarRating value={review.overall_rating || 0} readOnly />
          <p className="text-[11px] text-ink-500 mt-1">
            {review.updated_at
              ? `Review em ${formatDate(review.updated_at)}`
              : 'Sem review ainda'}
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          icon={CheckCircle2}
          label="Tasks concluídas"
          value={`${tasks.completed}/${tasks.total}`}
          hint={`${tasks.rate}% realizado`}
          tone="ink"
        />
        <MetricCard
          icon={TrendingUp}
          label="Performance PAAC"
          value={`${paac.performance}%`}
          hint={`${paac.counters.S} Supera · ${paac.counters.A} Atende · ${paac.counters.N} Gap`}
          tone="gold"
        />
        <MetricCard
          icon={BookOpen}
          label="Cursos concluídos"
          value={courses.done.length}
          hint={
            courses.inProgress.length > 0
              ? `+${courses.inProgress.length} em curso`
              : 'Academy'
          }
          tone="paper"
        />
        <MetricCard
          icon={Award}
          label="Ações de melhoria"
          value={improvements.length}
          hint="No ciclo"
          tone="paper"
        />
      </div>

      {/* Tasks */}
      <section>
        <SectionHeader
          eyebrow="Campo · PAAC"
          title="Tasks combinadas com o gestor"
        />
        <TasksBlock tasks={tasks.all} />
      </section>

      {/* Strengths & Gaps */}
      <section>
        <SectionHeader
          eyebrow="Pontos pessoais"
          title="O que destaca e o que desenvolver"
        />
        <StrengthsGapsBlock paac={paac} criteriaMap={criteriaMap} />
      </section>

      {/* Courses */}
      <section>
        <SectionHeader
          eyebrow="Academy"
          title="Cursos realizados neste ciclo"
        />
        <CoursesBlock courses={courses} />
      </section>

      {/* Improvements */}
      <section>
        <SectionHeader
          eyebrow="Trajetória"
          title="O que foi feito para melhorar"
        />
        <ImprovementsBlock improvements={improvements} />
      </section>

      {/* Manager Review */}
      <section>
        {canEdit ? (
          <ManagerReviewEditor
            email={rep.email}
            review={review}
            onSaved={onReviewSaved}
          />
        ) : (
          <ManagerReviewReadOnly review={review} leaderName={leaderName} />
        )}
      </section>
    </motion.div>
  );
}

// ============================================================
// PAGE
// ============================================================

export default function Evoluthion() {
  const [role, setRole] = useState(demoStore.getRole());
  const [team, setTeam] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  // Load team + listen to changes
  useEffect(() => {
    const currentRole = demoStore.getRole();
    setRole(currentRole);
    const all = evolutionStore.getTeamSummary();
    setTeam(all);

    // Default selection
    if (currentRole === 'gestor') {
      setSelectedEmail((prev) => prev || all[0]?.rep.email);
    } else {
      setSelectedEmail(demoStore.getCurrentUser().email);
    }

    const onRoleChange = () => {
      const r = demoStore.getRole();
      setRole(r);
      const fresh = evolutionStore.getTeamSummary();
      setTeam(fresh);
      if (r === 'gestor') {
        setSelectedEmail((prev) => prev || fresh[0]?.rep.email);
      } else {
        setSelectedEmail(demoStore.getCurrentUser().email);
      }
    };
    const onDataChange = () => {
      setTeam(evolutionStore.getTeamSummary());
      refresh();
    };

    window.addEventListener('paac-role-change', onRoleChange);
    window.addEventListener('paac-evals-change', onDataChange);
    window.addEventListener('academy-progress-change', onDataChange);
    window.addEventListener('evolution-change', onDataChange);
    return () => {
      window.removeEventListener('paac-role-change', onRoleChange);
      window.removeEventListener('paac-evals-change', onDataChange);
      window.removeEventListener('academy-progress-change', onDataChange);
      window.removeEventListener('evolution-change', onDataChange);
    };
  }, [refresh]);

  const criteriaMap = useMemo(() => buildCriteriaLabelMap(), []);
  const isGestor = role === 'gestor';
  const leaderName = 'Carla Souza';

  // Selected summary
  const selectedSummary = useMemo(() => {
    if (!selectedEmail) return null;
    return (
      team.find((s) => s.rep.email === selectedEmail) ||
      evolutionStore.getRepSummary(demoStore.getCurrentUser())
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmail, team, tick]);

  // Team aggregate stats (gestor)
  const teamStats = useMemo(() => {
    if (!team.length) return null;
    const totalTasks = team.reduce((acc, s) => acc + s.tasks.total, 0);
    const completedTasks = team.reduce((acc, s) => acc + s.tasks.completed, 0);
    const avgPerf = Math.round(
      team.reduce((acc, s) => acc + s.paac.performance, 0) / team.length
    );
    const coursesDone = team.reduce((acc, s) => acc + s.courses.done.length, 0);
    const reviewsWritten = team.filter((s) => s.review.updated_at).length;
    return { totalTasks, completedTasks, avgPerf, coursesDone, reviewsWritten };
  }, [team]);

  return (
    <div className="space-y-8 min-h-[80vh]">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-ink-grid text-white shadow-ink">
        <div className="absolute -top-20 -right-10 h-64 w-64 rounded-full bg-gold-400/15 blur-3xl" />
        <div className="relative grid lg:grid-cols-[1.6fr_auto] gap-8 px-7 py-8 lg:px-10 lg:py-10 items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30">
              <TrendingUp className="w-3.5 h-3.5 text-gold-300" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-gold-200 font-semibold">
                Etapa 5 · Evolução
              </span>
            </span>
            <h1 className="font-display text-3xl lg:text-4xl font-semibold leading-[1.1]">
              {isGestor ? (
                <>Evolução do <span className="text-gold-300">Time</span></>
              ) : (
                <>Minha <span className="text-gold-300">Evolução</span></>
              )}
            </h1>
            <p className="text-ink-200 max-w-xl leading-relaxed">
              {isGestor
                ? 'Quem cumpriu o combinado, o que foi feito para melhorar, pontos pessoais de cada rep e o review que você deixa para cada pessoa do time.'
                : 'Suas tasks combinadas, pontos fortes, cursos concluídos, ações de melhoria e o review do seu gestor.'}
            </p>
          </div>

          {isGestor && teamStats && (
            <div className="grid grid-cols-2 gap-3 justify-self-start lg:justify-self-end">
              <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 px-3 py-3 sm:px-5 sm:py-4 text-center">
                <p className="font-display text-2xl sm:text-3xl font-semibold text-gold-300 tabular-nums">
                  {teamStats.completedTasks}
                  <span className="text-white/40 text-xl">/{teamStats.totalTasks}</span>
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-ink-300 mt-1">
                  Tasks feitas
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 px-3 py-3 sm:px-5 sm:py-4 text-center">
                <p className="font-display text-2xl sm:text-3xl font-semibold text-white tabular-nums">
                  {teamStats.avgPerf}%
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-ink-300 mt-1">
                  PAAC médio
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 px-3 py-3 sm:px-5 sm:py-4 text-center">
                <p className="font-display text-2xl sm:text-3xl font-semibold text-white tabular-nums">
                  {teamStats.coursesDone}
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-ink-300 mt-1">
                  Cursos concluídos
                </p>
              </div>
              <div className="rounded-2xl bg-gold-shine px-3 py-3 sm:px-5 sm:py-4 text-center">
                <p className="font-display text-2xl sm:text-3xl font-semibold text-ink-900 tabular-nums">
                  {teamStats.reviewsWritten}
                  <span className="text-ink-900/40 text-xl">/{team.length}</span>
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-ink-900/70 mt-1">
                  Reviews escritos
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* TEAM GRID — apenas gestor */}
      {isGestor && (
        <section>
          <SectionHeader
            eyebrow="Seu time"
            title="Selecione um colaborador"
            action={
              <span className="text-xs text-ink-500">
                <Users className="w-3 h-3 inline mr-1" /> {team.length} pessoas
              </span>
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {team.map((s) => (
              <TeamRepCard
                key={s.rep.email}
                summary={s}
                isActive={s.rep.email === selectedEmail}
                onClick={() => setSelectedEmail(s.rep.email)}
              />
            ))}
          </div>
        </section>
      )}

      {/* DETAIL PANEL */}
      <AnimatePresence mode="wait">
        {selectedSummary && (
          <RepDetailPanel
            key={selectedSummary.rep.email + tick}
            summary={selectedSummary}
            criteriaMap={criteriaMap}
            canEdit={isGestor}
            leaderName={leaderName}
            onReviewSaved={() => {
              setTeam(evolutionStore.getTeamSummary());
              refresh();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
