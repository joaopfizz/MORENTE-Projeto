import React, { useState, useEffect, useCallback } from 'react';
import { createPageUrl } from '@/utils';
import { academyStore } from '@/lib/academyMockData';
import { demoStore } from '@/lib/paacMockData';
import {
  Search,
  BookOpen,
  Clock,
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  Sparkles,
  Users,
  MessageSquare,
  Brain,
  Compass,
  Target,
  TrendingUp,
  LayoutGrid,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const PILLARS = [
  {
    id: 1,
    name: 'Liderança Inspiradora',
    short: 'Inspirar',
    tag: 'pillar_1',
    icon: Sparkles,
    hue: 'from-violet-500/90 to-violet-700',
  },
  {
    id: 2,
    name: 'Desenvolver Pessoas',
    short: 'Desenvolver',
    tag: 'pillar_2',
    icon: Users,
    hue: 'from-sky-500/90 to-sky-700',
  },
  {
    id: 3,
    name: 'Comunicação Assertiva',
    short: 'Comunicar',
    tag: 'pillar_3',
    icon: MessageSquare,
    hue: 'from-cyan-500/90 to-cyan-700',
  },
  {
    id: 4,
    name: 'Capacidade Analítica',
    short: 'Analisar',
    tag: 'pillar_4',
    icon: Brain,
    hue: 'from-emerald-500/90 to-emerald-700',
  },
  {
    id: 5,
    name: 'Planejamento Estratégico',
    short: 'Planejar',
    tag: 'pillar_5',
    icon: Compass,
    hue: 'from-amber-500/90 to-amber-700',
  },
  {
    id: 6,
    name: 'Execução e Disciplina',
    short: 'Executar',
    tag: 'pillar_6',
    icon: Target,
    hue: 'from-orange-500/90 to-orange-700',
  },
  {
    id: 7,
    name: 'Gestão de Resultados',
    short: 'Entregar',
    tag: 'pillar_7',
    icon: TrendingUp,
    hue: 'from-rose-500/90 to-rose-700',
  },
];

function PillarTile({ pillar, isActive, onClick, courseCount }) {
  const Icon = pillar.icon;
  return (
    <button
      onClick={onClick}
      className={`group relative text-left rounded-2xl overflow-hidden transition-all duration-300 p-4 border-2 min-h-[140px] flex flex-col justify-between ${
        isActive
          ? 'border-gold-400 shadow-gold scale-[1.02] bg-white'
          : 'border-ink-100 bg-white hover:border-ink-300 hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`h-11 w-11 rounded-xl bg-gradient-to-br ${pillar.hue} flex items-center justify-center shadow-soft`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-ink-400">
          Pilar {pillar.id}
        </span>
      </div>
      <div>
        <h3 className="font-display text-base font-semibold text-ink-900 leading-tight mt-3">
          {pillar.name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-[11px] text-ink-500">
            {courseCount} {courseCount === 1 ? 'curso' : 'cursos'}
          </p>
          {isActive && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-gold-700">
              Ativo <CheckCircle2 className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function AllTile({ isActive, onClick, total }) {
  return (
    <button
      onClick={onClick}
      className={`group relative text-left rounded-2xl overflow-hidden transition-all duration-300 p-4 border-2 min-h-[140px] flex flex-col justify-between ${
        isActive
          ? 'border-gold-400 shadow-gold scale-[1.02] bg-ink-grid text-white'
          : 'border-ink-200 bg-ink-grid text-white hover:border-gold-400/60 hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="h-11 w-11 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
          <LayoutGrid className="w-5 h-5 text-gold-300" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-gold-300">
          Todos
        </span>
      </div>
      <div>
        <h3 className="font-display text-base font-semibold leading-tight mt-3">
          Ver todos os pilares
        </h3>
        <p className="text-[11px] text-ink-300 mt-2">{total} cursos no total</p>
      </div>
    </button>
  );
}

function CourseCard({ course, userEmail }) {
  const lessonCount = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const percent = academyStore.getCoursePercent(userEmail, course);
  const completed = academyStore.isCourseCompleted(userEmail, course);
  const pillar = PILLARS.find((p) => p.tag === course.pillar);
  const Icon = pillar?.icon;

  const navigate = () => {
    window.location.href = createPageUrl('Course') + `?id=${course.id}`;
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-ink-100 hover:border-gold-300 hover:shadow-soft transition-all duration-300 flex flex-col cursor-pointer group"
      onClick={navigate}
    >
      {/* Cover */}
      <div className="relative h-40 overflow-hidden">
        <div className={`w-full h-full bg-gradient-to-br ${course.cover_color}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />

        {pillar && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full text-white bg-black/40 backdrop-blur-md border border-white/10">
            {Icon && <Icon className="w-3 h-3" />}
            <span className="uppercase tracking-wider">
              P{pillar.id} · {pillar.short}
            </span>
          </div>
        )}

        {completed && (
          <div className="absolute top-3 right-3 bg-emerald-500 rounded-full p-1.5 shadow-lg">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          </div>
        )}

        <div className="absolute bottom-3 right-3 bg-white/95 rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
          <PlayCircle className="w-4 h-4 text-ink-900" />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-display font-semibold text-ink-900 line-clamp-2 leading-snug mb-1.5">
          {course.title}
        </h3>
        <p className="text-xs text-ink-500 line-clamp-2 flex-1 mb-3 leading-relaxed">
          {course.description}
        </p>

        <div className="flex items-center gap-3 text-[11px] text-ink-400 mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {course.duration_min} min
          </span>
          <span className="h-1 w-1 rounded-full bg-ink-200" />
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> {lessonCount} aulas
          </span>
        </div>

        {/* Progress */}
        {percent > 0 ? (
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-ink-500 font-medium">
                {completed ? 'Concluído' : 'Em andamento'}
              </span>
              <span className="font-semibold text-gold-700 tabular-nums">{percent}%</span>
            </div>
            <div className="h-1.5 bg-paper-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-500 to-gold-300 transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="text-[11px] text-ink-400 flex items-center gap-1.5">
            <PlayCircle className="w-3 h-3" /> Não iniciado
          </div>
        )}
      </div>
    </div>
  );
}

export default function Academy() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePillar, setActivePillar] = useState('all');
  const [userEmail, setUserEmail] = useState('');
  const [tick, setTick] = useState(0); // forces re-render on progress change

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    setCourses(academyStore.getCourses());
    setUserEmail(demoStore.getCurrentUser().email);

    const onRole = () => {
      setUserEmail(demoStore.getCurrentUser().email);
    };
    const onProgress = () => refresh();

    window.addEventListener('paac-role-change', onRole);
    window.addEventListener('academy-progress-change', onProgress);
    return () => {
      window.removeEventListener('paac-role-change', onRole);
      window.removeEventListener('academy-progress-change', onProgress);
    };
  }, [refresh]);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPillar = activePillar === 'all' || course.pillar === activePillar;
    return matchesSearch && matchesPillar;
  });

  const completedCount = courses.filter((c) =>
    academyStore.isCourseCompleted(userEmail, c)
  ).length;
  const inProgressCount = courses.filter((c) => {
    const pct = academyStore.getCoursePercent(userEmail, c);
    return pct > 0 && !academyStore.isCourseCompleted(userEmail, c);
  }).length;

  const coursesPerPillar = PILLARS.reduce((acc, p) => {
    acc[p.tag] = courses.filter((c) => c.pillar === p.tag).length;
    return acc;
  }, {});

  return (
    <div className="space-y-10 min-h-[80vh]">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-ink-grid text-white shadow-ink">
        <div className="absolute -top-20 -right-10 h-64 w-64 rounded-full bg-gold-400/15 blur-3xl" />
        <div className="relative grid lg:grid-cols-[1.6fr_auto] gap-8 px-7 py-8 lg:px-10 lg:py-10 items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30">
              <BookOpen className="w-3.5 h-3.5 text-gold-300" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-gold-200 font-semibold">
                Etapa 3 · Aprendizado
              </span>
            </span>
            <h1 className="font-display text-3xl lg:text-4xl font-semibold leading-[1.1]">
              A Academia dos <span className="text-gold-300">7 Pilares</span>
            </h1>
            <p className="text-ink-200 max-w-xl leading-relaxed">
              Desenvolva sua liderança curso a curso, pilar a pilar. Escolha por
              competência ou siga a sequência recomendada na sua trilha.
            </p>
          </div>
          <div className="flex gap-4 justify-self-start lg:justify-self-end">
            <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 px-5 py-4 text-center min-w-[110px]">
              <p className="font-display text-3xl font-semibold text-gold-300 tabular-nums">
                {completedCount}
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-ink-300 mt-1">
                Concluídos
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 px-5 py-4 text-center min-w-[110px]">
              <p className="font-display text-3xl font-semibold text-white tabular-nums">
                {inProgressCount}
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-ink-300 mt-1">
                Em curso
              </p>
            </div>
            <div className="rounded-2xl bg-gold-shine px-5 py-4 text-center min-w-[110px]">
              <p className="font-display text-3xl font-semibold text-ink-900 tabular-nums">
                {courses.length}
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-ink-900/70 mt-1">
                Disponíveis
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PILLAR GRID */}
      <section>
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold-700 font-semibold">
              Filtrar por pilar
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink-900 mt-1">
              Escolha sua competência
            </h2>
          </div>
          {activePillar !== 'all' && (
            <button
              onClick={() => setActivePillar('all')}
              className="text-xs font-semibold text-ink-600 hover:text-gold-700"
            >
              Limpar filtro
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-3">
          <AllTile
            isActive={activePillar === 'all'}
            onClick={() => setActivePillar('all')}
            total={courses.length}
          />
          {PILLARS.map((p) => (
            <PillarTile
              key={p.tag}
              pillar={p}
              isActive={activePillar === p.tag}
              onClick={() => setActivePillar(p.tag)}
              courseCount={coursesPerPillar[p.tag] || 0}
            />
          ))}
        </div>
      </section>

      {/* SEARCH */}
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
        <Input
          placeholder="Buscar cursos, competências…"
          className="pl-11 pr-4 py-6 bg-white border-ink-200 rounded-full focus-visible:ring-gold-400/40 focus-visible:border-gold-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* COURSE GRID */}
      <section>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-display text-xl font-semibold text-ink-900">
            {activePillar === 'all'
              ? 'Todos os cursos'
              : PILLARS.find((p) => p.tag === activePillar)?.name}
          </h2>
          <p className="text-xs text-ink-500">
            {filteredCourses.length} resultado{filteredCourses.length !== 1 ? 's' : ''}
          </p>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id + tick}
                course={course}
                userEmail={userEmail}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-ink-100">
            <BookOpen className="w-12 h-12 text-ink-200 mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold text-ink-900">
              Nenhum curso encontrado
            </h3>
            <p className="text-ink-500 text-sm mt-1">
              Tente outro filtro ou termo de busca.
            </p>
          </div>
        )}
      </section>

      {/* NEXT STEP */}
      <section className="relative overflow-hidden rounded-3xl bg-gold-shine p-6 md:p-8">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_10%_20%,#0b1120_0,transparent_40%)]" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="p-3 bg-ink-900 rounded-2xl shrink-0">
            <Sparkles className="w-6 h-6 text-gold-300" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-[0.22em] text-ink-900/70 font-semibold">
              Próximo passo da jornada
            </p>
            <h3 className="font-display text-xl font-semibold text-ink-900 mt-1">
              Coloque em prática no Athivar
            </h3>
            <p className="text-ink-900/80 text-sm mt-1 max-w-2xl">
              Complete desafios reais baseados nos 7 Pilares. Cada entrega
              desbloqueia pontos e habilidades validadas pelo seu time.
            </p>
          </div>
          <Button
            className="bg-ink-900 hover:bg-ink-800 text-gold-200 shrink-0 gap-2 rounded-full px-5"
            onClick={() => (window.location.href = createPageUrl('Athivar'))}
          >
            Ver Desafios <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
