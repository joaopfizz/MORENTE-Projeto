import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlayCircle,
  Clock,
  Award,
  ArrowRight,
  Trophy,
  Sparkles,
  Target,
  Users,
  BookOpen,
  BarChart3,
  CheckCircle2,
  Calendar,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';

const JOURNEY_STAGES = [
  { key: 'Scanner', label: 'Scanner', icon: Target, subtitle: 'Diagnóstico' },
  { key: 'Lidherar', label: 'Lidherar', icon: Users, subtitle: 'Fundação' },
  { key: 'Academy', label: 'Academy', icon: BookOpen, subtitle: 'Aprendizado' },
  { key: 'Athivar', label: 'Athivar', icon: Trophy, subtitle: 'Prática' },
  { key: 'Evoluthion', label: 'Evoluthion', icon: BarChart3, subtitle: 'Evolução' },
];

function ProgressRing({ percent = 0, size = 128, stroke = 10 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          className="stroke-white/10"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-gold-400"
          fill="none"
          style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(.22,1,.36,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-semibold text-white leading-none">
          {percent}%
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold-200/70 mt-1">
          Jornada
        </span>
      </div>
    </div>
  );
}

function JourneyPipeline({ currentStage = 'Academy', stageStatus = {} }) {
  return (
    <div className="relative">
      <div className="absolute left-0 right-0 top-[26px] h-px bg-ink-200" aria-hidden="true" />
      <div
        className="absolute left-0 top-[26px] h-px bg-gradient-to-r from-gold-500 via-gold-400 to-gold-300 transition-all duration-700"
        style={{
          width: (() => {
            const idx = JOURNEY_STAGES.findIndex((s) => s.key === currentStage);
            if (idx < 0) return '0%';
            return `${(idx / (JOURNEY_STAGES.length - 1)) * 100}%`;
          })(),
        }}
      />
      <div className="grid grid-cols-5 gap-1 sm:gap-2 relative">
        {JOURNEY_STAGES.map((stage, idx) => {
          const currentIdx = JOURNEY_STAGES.findIndex((s) => s.key === currentStage);
          const isCurrent = stage.key === currentStage;
          const isPast = idx < currentIdx;
          const isLocked = idx > currentIdx;
          const Icon = stage.icon;
          const status = stageStatus[stage.key];
          return (
            <Link
              to={createPageUrl(stage.key)}
              key={stage.key}
              className="flex flex-col items-center group"
            >
              <div
                className={`relative h-10 w-10 sm:h-[52px] sm:w-[52px] rounded-full flex items-center justify-center transition-all border-2 ${
                  isCurrent
                    ? 'bg-gold-400 border-gold-400 text-ink-900 shadow-gold scale-110'
                    : isPast
                    ? 'bg-ink-900 border-gold-400 text-gold-300'
                    : 'bg-white border-ink-200 text-ink-300 group-hover:border-gold-300'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                {isPast && (
                  <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-paper-50 flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                  </span>
                )}
              </div>
              <div className="mt-2 sm:mt-3 text-center">
                <p
                  className={`text-[11px] sm:text-sm font-semibold tracking-tight leading-tight ${
                    isCurrent ? 'text-ink-900' : isPast ? 'text-ink-700' : 'text-ink-400'
                  }`}
                >
                  {stage.label}
                </p>
                <p className="hidden sm:block text-[10px] uppercase tracking-[0.16em] mt-0.5 text-ink-400">
                  {stage.subtitle}
                </p>
                {status && (
                  <p
                    className={`hidden sm:block text-[11px] mt-1 font-medium ${
                      isCurrent ? 'text-gold-700' : 'text-ink-500'
                    }`}
                  >
                    {status}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function ContinueCard({ course }) {
  return (
    <Link
      to={createPageUrl(`Course?id=${course.id}`)}
      className="group relative flex gap-4 items-stretch bg-white rounded-2xl overflow-hidden border border-ink-100 hover:border-gold-300 hover:shadow-soft transition-all"
    >
      <div className="relative h-24 w-24 sm:w-36 shrink-0 overflow-hidden">
        <img
          src={course.cover_image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-ink-950/50 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <PlayCircle className="w-10 h-10 text-white drop-shadow-lg" />
        </div>
      </div>
      <div className="flex-1 py-3 pr-4 min-w-0 flex flex-col justify-center">
        <p className="text-[10px] uppercase tracking-[0.18em] text-gold-700 font-semibold mb-1">
          Retomar
        </p>
        <h4 className="font-semibold text-ink-900 truncate">{course.title}</h4>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex-1 h-1.5 bg-paper-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-500 to-gold-300"
              style={{ width: `${course.progress}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-ink-700 tabular-nums">
            {course.progress}%
          </span>
        </div>
      </div>
    </Link>
  );
}

function HighlightTile({ icon: Icon, label, value, hint, accent = false }) {
  return (
    <div
      className={`rounded-xl p-4 ${
        accent
          ? 'bg-gold-shine text-ink-900 shadow-gold'
          : 'bg-white border border-ink-100'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${accent ? 'text-ink-800' : 'text-gold-600'}`} />
        <span
          className={`text-[10px] uppercase tracking-[0.16em] font-semibold ${
            accent ? 'text-ink-800/80' : 'text-ink-500'
          }`}
        >
          {label}
        </span>
      </div>
      <p
        className={`font-display text-2xl font-semibold leading-none ${
          accent ? 'text-ink-900' : 'text-ink-900'
        }`}
      >
        {value}
      </p>
      {hint && (
        <p className={`text-xs mt-1.5 ${accent ? 'text-ink-800/80' : 'text-ink-500'}`}>
          {hint}
        </p>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState({ full_name: 'Colaborador' });

  const inProgressCourses = [
    {
      id: '69c73ab7384415b36e63b5f8',
      title: 'Fundamentos da Liderança Moderna',
      progress: 75,
      cover_image:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=300',
    },
    {
      id: '69c73ab7384415b36e63b5fb',
      title: 'Técnicas Avançadas de Vendas B2B',
      progress: 32,
      cover_image:
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=300',
    },
    {
      id: '69c73ab7384415b36e63b5fd',
      title: 'Planejamento Estratégico e OKRs',
      progress: 10,
      cover_image:
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=300',
    },
  ];

  const recommendedPaths = [
    {
      title: 'Lidherar: A Jornada do Líder',
      modules: 3,
      hours: 7,
      tag: 'Trilha Fundacional',
      image:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600',
    },
    {
      title: 'Athivar: Desafios Práticos',
      modules: 2,
      hours: 3,
      tag: 'Trilha Prática',
      image:
        'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600',
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      const u = await base44.auth.me();
      if (u) setUser(u);
    };
    loadData();
  }, []);

  const firstName = user.full_name?.split(' ')[0] || 'Colaborador';
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className="space-y-10">
      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-ink-grid text-white shadow-ink"
      >
        <div className="absolute -top-32 -right-20 h-72 w-72 rounded-full bg-gold-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-gold-400/10 blur-3xl" />

        <div className="relative grid lg:grid-cols-[1fr_auto] gap-8 p-8 lg:p-10 items-center">
          <div className="space-y-5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30">
              <Flame className="w-3.5 h-3.5 text-gold-300" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-gold-200 font-semibold">
                Etapa Ativa · Academy
              </span>
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-semibold leading-[1.05]">
              {greeting}, <span className="text-gold-300">{firstName}</span>.
              <br />
              Vamos continuar liderando.
            </h1>
            <p className="text-ink-200 text-base max-w-lg leading-relaxed">
              Você tem <strong className="text-white">3 atividades pendentes</strong>{' '}
              em <em className="not-italic text-gold-200">Lidherar</em>. Mantenha o
              ritmo — sua sequência de estudos chegou ao <strong>7º dia</strong>.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                asChild
                className="bg-gold-400 hover:bg-gold-300 text-ink-900 font-semibold shadow-gold gap-2 rounded-full px-5"
              >
                <Link to={createPageUrl('Academy')}>
                  Continuar Aprendendo
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="text-ink-100 hover:text-white hover:bg-white/10 gap-2 rounded-full"
              >
                <Award className="w-4 h-4 text-gold-300" /> Meus Certificados
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 justify-self-center lg:justify-self-end">
            <div className="space-y-3 text-right hidden sm:block">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-gold-200/70">
                  Nível Atual
                </p>
                <p className="font-display text-2xl font-semibold">
                  Nível 4{' '}
                  <span className="text-gold-300 font-normal">· Estrategista</span>
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-gold-200/70">
                  Pontos XP
                </p>
                <p className="font-display text-2xl font-semibold tabular-nums">
                  850
                </p>
              </div>
            </div>
            <div className="block sm:hidden">
              <ProgressRing percent={62} size={104} />
            </div>
            <div className="hidden sm:block">
              <ProgressRing percent={62} size={140} />
            </div>
          </div>
        </div>
      </motion.section>

      {/* JOURNEY PIPELINE */}
      <section>
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold-700 font-semibold">
              Sua trilha
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink-900 mt-1">
              Onde você está na jornada
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-ink-500">
            <span className="h-2 w-2 rounded-full bg-gold-400" />
            <span>Etapa atual</span>
            <span className="h-2 w-2 rounded-full bg-ink-900 ml-3" />
            <span>Concluída</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-ink-100 p-4 sm:p-6 lg:p-8 shadow-soft">
          <JourneyPipeline
            currentStage="Academy"
            stageStatus={{
              Scanner: 'Concluído',
              Lidherar: '2 módulos',
              Academy: 'Em andamento',
              Athivar: 'Próximo',
              Evoluthion: 'Bloqueado',
            }}
          />
        </div>
      </section>

      {/* METRICS ROW (asymmetric, not cookie-cutter) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <HighlightTile
          icon={Flame}
          label="Sequência"
          value="7 dias"
          hint="Seu recorde é 12"
        />
        <HighlightTile
          icon={Clock}
          label="Tempo investido"
          value="24h"
          hint="Top 10% do time"
        />
        <HighlightTile
          icon={Sparkles}
          label="Pontos XP"
          value="850"
          hint="+120 esta semana"
          accent
        />
        <HighlightTile
          icon={Trophy}
          label="Certificados"
          value="2"
          hint="2 em validação"
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-gold-700 font-semibold">
                  Seus cursos
                </p>
                <h2 className="font-display text-2xl font-semibold text-ink-900 mt-1">
                  Continuar aprendendo
                </h2>
              </div>
              <Link
                to={createPageUrl('Academy')}
                className="text-sm font-semibold text-ink-700 hover:text-gold-700 flex items-center gap-1 group"
              >
                Ver todos
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {inProgressCourses.map((course) => (
                <ContinueCard key={course.id} course={course} />
              ))}
            </div>
          </section>

          <section>
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold-700 font-semibold">
              Recomendado para você
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink-900 mt-1 mb-5">
              Jornadas para explorar
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {recommendedPaths.map((path, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer h-56 shadow-soft"
                >
                  <img
                    src={path.image}
                    alt={path.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-900/50 to-transparent" />
                  <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-gold-300 font-semibold">
                      {path.tag}
                    </span>
                    <h3 className="font-display text-xl font-semibold mt-1">
                      {path.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-ink-100 mt-2">
                      <span>{path.modules} Módulos</span>
                      <span className="h-1 w-1 rounded-full bg-ink-100/40" />
                      <span>{path.hours}h de conteúdo</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* SIDEBAR COLUMN */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-ink-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold-600" />
                <h3 className="font-semibold text-ink-900">Aulas ao Vivo</h3>
              </div>
              <span className="text-[10px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
                Esta semana
              </span>
            </div>
            <div className="p-5 space-y-5">
              {[
                { day: 12, month: 'OUT', title: 'Dominando Feedback Eficaz', time: '14:00 – 15:30' },
                { day: 13, month: 'OUT', title: 'OKRs na Prática', time: '09:30 – 11:00' },
              ].map((e, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center justify-center bg-ink-900 text-white rounded-xl w-14 h-14 shrink-0">
                    <span className="text-[10px] font-semibold uppercase text-gold-300 tracking-wider">
                      {e.month}
                    </span>
                    <span className="font-display text-xl font-semibold leading-none">
                      {e.day}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-ink-900 text-sm line-clamp-1">
                      {e.title}
                    </h4>
                    <p className="text-xs text-ink-500 mt-1">{e.time}</p>
                    <button className="text-xs font-semibold text-gold-700 hover:text-gold-800 mt-1">
                      Entrar na sala →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-ink-grid text-white shadow-ink">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gold-400/15 blur-2xl" />
            <div className="relative p-5">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-4 h-4 text-gold-300" />
                <h3 className="font-semibold text-white">Melhores da Semana</h3>
              </div>
              <div className="space-y-3.5">
                {[
                  { name: 'Ana Silva', pts: 1850, pos: 1 },
                  { name: 'Carlos Lima', pts: 1700, pos: 2 },
                  { name: 'Beatriz Costa', pts: 1550, pos: 3 },
                ].map((u) => (
                  <div key={u.pos} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold font-display ${
                          u.pos === 1
                            ? 'bg-gold-shine text-ink-900 shadow-gold'
                            : u.pos === 2
                            ? 'bg-white/15 text-gold-100'
                            : 'bg-white/10 text-ink-200'
                        }`}
                      >
                        {u.pos}
                      </span>
                      <span className="text-sm font-medium">{u.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gold-200 tabular-nums">
                      {u.pts.toLocaleString()} pts
                    </span>
                  </div>
                ))}
              </div>
              <button className="mt-5 w-full text-xs font-semibold uppercase tracking-[0.18em] text-gold-200 hover:text-gold-100 py-2 border border-white/10 rounded-full transition-colors">
                Ver ranking completo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
