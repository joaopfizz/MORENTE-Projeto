import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  PlayCircle,
  FileText,
  HelpCircle,
  PenLine,
  Clock,
  Award,
  Sparkles,
  RotateCcw,
  Send,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { academyStore } from '@/lib/academyMockData';
import { demoStore } from '@/lib/paacMockData';

// ============================================================
// HELPERS
// ============================================================

function buildSteps(course) {
  // Sequência linear: [...lessons, 'quiz', 'report']
  const lessonSteps = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({
      kind: 'lesson',
      moduleId: m.id,
      moduleTitle: m.title,
      ...l,
    }))
  );
  return [
    ...lessonSteps,
    { kind: 'quiz', id: '__quiz__', title: course.quiz.title },
    { kind: 'report', id: '__report__', title: 'Relatório final' },
  ];
}

function minutesLabel(min) {
  return `${min} min`;
}

// ============================================================
// SIDEBAR
// ============================================================

function LessonIcon({ step, isCompleted, isActive }) {
  const base = 'w-4 h-4 shrink-0';
  if (isCompleted) return <CheckCircle2 className={`${base} text-emerald-500`} />;
  if (step.kind === 'lesson' && step.type === 'video') {
    return <PlayCircle className={`${base} ${isActive ? 'text-gold-500' : 'text-ink-400'}`} />;
  }
  if (step.kind === 'lesson' && step.type === 'text') {
    return <FileText className={`${base} ${isActive ? 'text-gold-500' : 'text-ink-400'}`} />;
  }
  if (step.kind === 'quiz') return <HelpCircle className={`${base} ${isActive ? 'text-gold-500' : 'text-ink-400'}`} />;
  if (step.kind === 'report') return <PenLine className={`${base} ${isActive ? 'text-gold-500' : 'text-ink-400'}`} />;
  return <Circle className={base} />;
}

function Sidebar({ course, steps, currentIdx, completedIds, quizCompleted, reportSubmitted, onJump }) {
  // Agrupa por módulo + adiciona "Quiz" e "Relatório" como módulos especiais
  const groups = useMemo(() => {
    const map = new Map();
    steps.forEach((s, idx) => {
      if (s.kind === 'lesson') {
        const key = s.moduleId;
        if (!map.has(key)) map.set(key, { id: key, title: s.moduleTitle, items: [] });
        map.get(key).items.push({ step: s, idx });
      } else {
        const key = s.kind === 'quiz' ? '__quiz__' : '__report__';
        const title = s.kind === 'quiz' ? 'Avaliação' : 'Conclusão';
        if (!map.has(key)) map.set(key, { id: key, title, items: [] });
        map.get(key).items.push({ step: s, idx });
      }
    });
    return Array.from(map.values());
  }, [steps]);

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-white border border-ink-100 rounded-2xl overflow-hidden flex flex-col max-h-[55vh] lg:max-h-none">
      <div className="px-5 py-4 bg-ink-grid text-white">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gold-300 font-semibold">
          Conteúdo do curso
        </p>
        <p className="text-sm font-medium text-white mt-1 line-clamp-2">{course.title}</p>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {groups.map((group) => (
          <div key={group.id} className="border-b border-ink-100 last:border-none">
            <div className="px-5 py-2.5 bg-paper-50 border-b border-ink-100">
              <p className="text-[11px] font-bold text-ink-500 uppercase tracking-wider">
                {group.title}
              </p>
            </div>
            <div>
              {group.items.map(({ step, idx }) => {
                const isActive = idx === currentIdx;
                const isCompleted =
                  (step.kind === 'lesson' && completedIds.has(step.id)) ||
                  (step.kind === 'quiz' && quizCompleted) ||
                  (step.kind === 'report' && reportSubmitted);
                return (
                  <button
                    key={step.id}
                    onClick={() => onJump(idx)}
                    className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors border-l-2 ${
                      isActive
                        ? 'bg-gold-50 border-gold-400'
                        : 'border-transparent hover:bg-paper-50'
                    }`}
                  >
                    <LessonIcon step={step} isCompleted={isCompleted} isActive={isActive} />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm truncate ${
                          isActive
                            ? 'font-semibold text-ink-900'
                            : isCompleted
                            ? 'text-ink-500 line-through'
                            : 'text-ink-700'
                        }`}
                      >
                        {step.title}
                      </p>
                      {step.duration_min && (
                        <p className="text-[11px] text-ink-400 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {minutesLabel(step.duration_min)}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

// ============================================================
// VIEWERS
// ============================================================

function VideoViewer({ lesson }) {
  return (
    <div className="space-y-5">
      <div className="relative aspect-video bg-ink-950 rounded-2xl overflow-hidden shadow-ink">
        <iframe
          src={lesson.video_url}
          title={lesson.title}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-gold-700 font-semibold">
          Vídeo · {minutesLabel(lesson.duration_min)}
        </p>
        <h2 className="font-display text-2xl font-semibold text-ink-900 mt-1">
          {lesson.title}
        </h2>
        {lesson.description && (
          <p className="text-ink-600 mt-3 leading-relaxed max-w-3xl">{lesson.description}</p>
        )}
      </div>
    </div>
  );
}

// Render markdown básico (H1, H2, H3, **bold**, listas, blockquote, tabela simples)
function renderMarkdown(src) {
  const lines = src.split('\n');
  const out = [];
  let listBuf = [];
  let tableBuf = null;

  const flushList = () => {
    if (listBuf.length) {
      out.push(
        <ul key={`ul-${out.length}`} className="list-disc pl-6 space-y-1.5 text-ink-700 my-3">
          {listBuf.map((t, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: inlineMd(t) }} />
          ))}
        </ul>
      );
      listBuf = [];
    }
  };
  const flushTable = () => {
    if (!tableBuf) return;
    const [header, , ...rows] = tableBuf;
    out.push(
      <div key={`tbl-${out.length}`} className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-ink-50">
              {header.map((h, i) => (
                <th key={i} className="text-left px-3 py-2 border border-ink-100 font-semibold text-ink-900">
                  {h.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className="odd:bg-white even:bg-paper-50">
                {r.map((c, ci) => (
                  <td key={ci} className="px-3 py-2 border border-ink-100 text-ink-700">
                    {c.trim()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableBuf = null;
  };

  const inlineMd = (t) =>
    t
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-paper-100 rounded text-[0.9em]">$1</code>');

  lines.forEach((raw, idx) => {
    const line = raw.trimEnd();
    if (line.startsWith('| ')) {
      flushList();
      if (!tableBuf) tableBuf = [];
      const cells = line.slice(1, -1).split('|');
      tableBuf.push(cells);
      return;
    } else {
      flushTable();
    }
    if (!line.trim()) {
      flushList();
      return;
    }
    if (line.startsWith('### ')) {
      flushList();
      out.push(<h3 key={idx} className="font-display text-lg font-semibold text-ink-900 mt-5 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith('## ')) {
      flushList();
      out.push(<h2 key={idx} className="font-display text-xl font-semibold text-ink-900 mt-6 mb-2">{line.slice(3)}</h2>);
    } else if (line.startsWith('# ')) {
      flushList();
      out.push(<h1 key={idx} className="font-display text-2xl font-semibold text-ink-900 mt-4 mb-3">{line.slice(2)}</h1>);
    } else if (/^\d+\.\s/.test(line)) {
      flushList();
      out.push(<p key={idx} className="text-ink-700 leading-relaxed my-1.5" dangerouslySetInnerHTML={{ __html: inlineMd(line) }} />);
    } else if (line.startsWith('- ')) {
      listBuf.push(line.slice(2));
    } else if (line.startsWith('> ')) {
      flushList();
      out.push(
        <blockquote key={idx} className="border-l-4 border-gold-400 bg-gold-50 pl-4 py-2 my-4 text-ink-800 italic" dangerouslySetInnerHTML={{ __html: inlineMd(line.slice(2)) }} />
      );
    } else {
      flushList();
      out.push(<p key={idx} className="text-ink-700 leading-relaxed my-2.5" dangerouslySetInnerHTML={{ __html: inlineMd(line) }} />);
    }
  });
  flushList();
  flushTable();
  return out;
}

function TextViewer({ lesson }) {
  return (
    <article className="bg-white rounded-2xl border border-ink-100 p-6 lg:p-10 shadow-soft">
      <div className="mb-6 pb-6 border-b border-ink-100">
        <p className="text-[10px] uppercase tracking-[0.22em] text-gold-700 font-semibold">
          Leitura · {minutesLabel(lesson.duration_min)}
        </p>
        <h2 className="font-display text-2xl font-semibold text-ink-900 mt-1">{lesson.title}</h2>
      </div>
      <div className="prose prose-ink max-w-none">{renderMarkdown(lesson.content || '')}</div>
    </article>
  );
}

// ============================================================
// QUIZ
// ============================================================

function QuizViewer({ course, initialAnswers, initialScore, onSave }) {
  const [answers, setAnswers] = useState(initialAnswers || {});
  const [submitted, setSubmitted] = useState(initialScore !== null && initialScore !== undefined);
  const [score, setScore] = useState(initialScore);

  const questions = course.quiz.questions;
  const allAnswered = questions.every((q) => answers[q.id]);

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct) correct += 1;
    });
    const s = Math.round((correct / questions.length) * 100);
    setScore(s);
    setSubmitted(true);
    onSave(answers, s);
  };

  const handleRetry = () => {
    setAnswers({});
    setScore(null);
    setSubmitted(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-gold-700 font-semibold">
          Avaliação
        </p>
        <h2 className="font-display text-2xl font-semibold text-ink-900 mt-1">
          {course.quiz.title}
        </h2>
        <p className="text-ink-500 mt-2 text-sm">
          {questions.length} perguntas · Nota mínima: {course.quiz.passing_score}%
        </p>
      </div>

      {submitted && (
        <div
          className={`rounded-2xl p-5 border-2 ${
            score >= course.quiz.passing_score
              ? 'bg-emerald-50 border-emerald-300'
              : 'bg-amber-50 border-amber-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <Award className={`w-7 h-7 ${score >= course.quiz.passing_score ? 'text-emerald-600' : 'text-amber-600'}`} />
            <div className="flex-1">
              <p className="font-display text-xl font-semibold text-ink-900">
                {score >= course.quiz.passing_score ? 'Aprovado!' : 'Quase lá!'}
              </p>
              <p className="text-sm text-ink-700">
                Sua nota: <strong>{score}%</strong> · Mínimo: {course.quiz.passing_score}%
              </p>
            </div>
            {score < course.quiz.passing_score && (
              <Button variant="outline" onClick={handleRetry} className="gap-2">
                <RotateCcw className="w-4 h-4" /> Refazer
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {questions.map((q, qi) => {
          const chosen = answers[q.id];
          return (
            <div key={q.id} className="bg-white rounded-2xl border border-ink-100 p-5">
              <p className="text-sm font-semibold text-ink-900 mb-4">
                <span className="text-gold-700 mr-2">{qi + 1}.</span>
                {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isChosen = chosen === opt.id;
                  const isCorrect = opt.id === q.correct;
                  let style = 'border-ink-200 hover:border-ink-300';
                  if (submitted) {
                    if (isCorrect) style = 'border-emerald-400 bg-emerald-50';
                    else if (isChosen && !isCorrect) style = 'border-rose-400 bg-rose-50';
                  } else if (isChosen) {
                    style = 'border-gold-400 bg-gold-50';
                  }
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-3 p-4 sm:p-3 rounded-xl border-2 cursor-pointer transition-all min-h-[52px] ${style} ${
                        submitted ? 'cursor-default' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        checked={isChosen}
                        disabled={submitted}
                        onChange={() => setAnswers({ ...answers, [q.id]: opt.id })}
                        className="mt-1 w-5 h-5 sm:w-4 sm:h-4 accent-gold-500"
                      />
                      <span className="text-sm text-ink-800 flex-1">{opt.text}</span>
                      {submitted && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {submitted && isChosen && !isCorrect && (
                        <X className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </label>
                  );
                })}
              </div>
              {submitted && q.explanation && (
                <p className="mt-3 text-xs text-ink-600 italic bg-paper-50 border-l-2 border-gold-400 px-3 py-2 rounded-r">
                  💡 {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <div className="flex items-center justify-between bg-white rounded-2xl border border-ink-100 p-4">
          <p className="text-sm text-ink-500">
            {Object.keys(answers).length}/{questions.length} respondidas
          </p>
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="bg-gold-400 hover:bg-gold-300 text-ink-900 font-semibold gap-2 shadow-gold"
          >
            Enviar respostas <Send className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// RELATÓRIO FINAL
// ============================================================

function ReportViewer({ course, existingReport, onSubmit }) {
  const [text, setText] = useState(existingReport?.text || '');
  const [submitted, setSubmitted] = useState(Boolean(existingReport));

  const handleSubmit = () => {
    if (text.trim().length < 80) return;
    onSubmit(text.trim());
    setSubmitted(true);
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  if (submitted) {
    return (
      <div className="space-y-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-gold-700 font-semibold">
            Conclusão
          </p>
          <h2 className="font-display text-2xl font-semibold text-ink-900 mt-1">
            Curso concluído!
          </h2>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gold-shine p-8">
          <div className="relative flex flex-col md:flex-row items-start gap-5">
            <div className="p-3 bg-ink-900 rounded-2xl shrink-0">
              <Sparkles className="w-7 h-7 text-gold-300" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-900/70 font-semibold">
                Parabéns
              </p>
              <h3 className="font-display text-2xl font-semibold text-ink-900 mt-1">
                Você concluiu "{course.title}"
              </h3>
              <p className="text-ink-900/80 text-sm mt-2 leading-relaxed">
                Seu relatório foi enviado ao gestor. {course.related_paac_key ? `Esta competência está ligada ao critério ${course.related_paac_key} do seu PAAC — as tarefas relacionadas serão atualizadas automaticamente.` : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-ink-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-ink-800">Seu relatório enviado</p>
            <p className="text-xs text-ink-400">
              {new Date(existingReport?.submittedAt || Date.now()).toLocaleString('pt-BR')}
            </p>
          </div>
          <p className="text-sm text-ink-700 whitespace-pre-wrap leading-relaxed">{text}</p>
        </div>

        <div className="flex justify-end">
          <Link to={createPageUrl('Academy')}>
            <Button variant="outline" className="gap-2 border-ink-200">
              <ArrowLeft className="w-4 h-4" /> Voltar para Academy
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-gold-700 font-semibold">
          Conclusão
        </p>
        <h2 className="font-display text-2xl font-semibold text-ink-900 mt-1">
          Relatório final — o que você aprendeu?
        </h2>
        <p className="text-ink-600 mt-3 leading-relaxed max-w-3xl">
          Escreva com suas palavras os principais aprendizados do curso e como você pretende aplicar no dia a dia de campo. Esse relatório vai para o seu gestor acompanhar sua evolução.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-ink-100 p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-ink-800 mb-2">
            Principais aprendizados e plano de aplicação
          </label>
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Ex: Aprendi que conhecer a concorrência em 3 camadas (produto, comercial, relacionamento) transforma a visita. Vou começar segunda-feira listando os 10 médicos alvo do setor 087 e mapear cada um seguindo a tabela do módulo 2...`}
            className="w-full px-4 py-3 border border-ink-200 rounded-xl text-sm resize-y focus:ring-2 focus:ring-gold-400/40 focus:border-gold-400 outline-none text-ink-800 placeholder:text-ink-400 leading-relaxed"
          />
          <div className="mt-2 flex items-center justify-between text-xs">
            <p className={`${text.trim().length < 80 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {text.trim().length < 80
                ? `Faltam ${80 - text.trim().length} caracteres (mínimo 80)`
                : `✓ Pronto para enviar · ${wordCount} palavras`}
            </p>
            <p className="text-ink-400 tabular-nums">{text.length} caracteres</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={text.trim().length < 80}
            className="bg-gold-400 hover:bg-gold-300 text-ink-900 font-semibold gap-2 shadow-gold"
          >
            <Send className="w-4 h-4" /> Enviar relatório e concluir curso
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE
// ============================================================

export default function Course() {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('id') || 'curso-concorrencia';
  const course = academyStore.getCourse(courseId);
  const user = demoStore.getCurrentUser();

  const steps = useMemo(() => (course ? buildSteps(course) : []), [course]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const [progress, setProgress] = useState(() =>
    course ? academyStore.getCourseProgress(user.email, course.id) : null
  );
  const [report, setReport] = useState(() =>
    course ? academyStore.getReport(user.email, course.id) : null
  );

  useEffect(() => {
    if (!course) return;
    const handler = () => {
      setProgress(academyStore.getCourseProgress(user.email, course.id));
      setReport(academyStore.getReport(user.email, course.id));
    };
    window.addEventListener('academy-progress-change', handler);
    window.addEventListener('paac-role-change', handler);
    return () => {
      window.removeEventListener('academy-progress-change', handler);
      window.removeEventListener('paac-role-change', handler);
    };
  }, [course, user.email]);

  if (!course) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-ink-200 p-12 text-center">
        <h2 className="font-display text-xl font-semibold text-ink-900">Curso não encontrado</h2>
        <p className="text-ink-500 mt-2">
          Volte para a <Link to={createPageUrl('Academy')} className="text-gold-700 underline">Academy</Link> e escolha um curso.
        </p>
      </div>
    );
  }

  const step = steps[currentIdx];
  const completedIds = new Set(progress?.completedLessons || []);
  const quizCompleted = progress?.quizScore !== null && progress?.quizScore !== undefined &&
    progress?.quizScore >= course.quiz.passing_score;
  const reportSubmitted = Boolean(progress?.reportSubmittedAt);

  const totalSteps = steps.length;
  const completedCount = completedIds.size + (quizCompleted ? 1 : 0) + (reportSubmitted ? 1 : 0);
  const percent = Math.round((completedCount / totalSteps) * 100);

  const goTo = (nextIdx, dir = 0) => {
    setDirection(dir || (nextIdx > currentIdx ? 1 : -1));
    setCurrentIdx(Math.max(0, Math.min(steps.length - 1, nextIdx)));
  };

  const handleMarkAndAdvance = () => {
    if (step.kind === 'lesson') {
      academyStore.markLessonComplete(user.email, course.id, step.id);
    }
    if (currentIdx < steps.length - 1) goTo(currentIdx + 1, 1);
  };

  const canAdvance = (() => {
    if (step.kind === 'lesson') return true;
    if (step.kind === 'quiz') return quizCompleted;
    if (step.kind === 'report') return false; // último, sem "próximo"
    return true;
  })();

  const stepVariants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to={createPageUrl('Academy')}
            className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para Academy
          </Link>
          <h1 className="font-display text-2xl font-semibold text-ink-900 mt-2">
            {course.title}
          </h1>
          <p className="text-sm text-ink-500 mt-0.5">
            {course.instructor} · {course.pillar_label}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="text-right shrink-0">
            <p className="text-[10px] uppercase tracking-wider text-ink-500 font-semibold">
              Progresso
            </p>
            <p className="font-display text-xl font-semibold text-ink-900">{percent}%</p>
          </div>
          <div className="flex-1 sm:w-36 h-2 bg-paper-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-500 to-gold-300 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Body: viewer + sidebar */}
      <div className="flex flex-col-reverse lg:flex-row gap-6">
        {/* Viewer principal */}
        <div className="flex-1 min-w-0 space-y-6">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={step.id}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {step.kind === 'lesson' && step.type === 'video' && <VideoViewer lesson={step} />}
              {step.kind === 'lesson' && step.type === 'text' && <TextViewer lesson={step} />}
              {step.kind === 'quiz' && (
                <QuizViewer
                  course={course}
                  initialAnswers={progress?.quizAnswers}
                  initialScore={progress?.quizScore}
                  onSave={(answers, score) => {
                    academyStore.saveQuiz(user.email, course.id, answers, score);
                  }}
                />
              )}
              {step.kind === 'report' && (
                <ReportViewer
                  course={course}
                  existingReport={report}
                  onSubmit={(text) => academyStore.submitReport(user.email, course.id, text)}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Controles prev/next */}
          {step.kind !== 'report' && (
            <div className="flex items-center justify-between bg-white rounded-2xl border border-ink-100 p-4">
              <Button
                variant="outline"
                onClick={() => goTo(currentIdx - 1, -1)}
                disabled={currentIdx === 0}
                className="gap-2 border-ink-200"
              >
                <ArrowLeft className="w-4 h-4" /> Anterior
              </Button>

              <p className="text-xs text-ink-500 hidden sm:block">
                Etapa <strong>{currentIdx + 1}</strong> de {totalSteps}
              </p>

              {step.kind === 'lesson' ? (
                <Button
                  onClick={handleMarkAndAdvance}
                  className="bg-gold-400 hover:bg-gold-300 text-ink-900 font-semibold gap-2 shadow-gold"
                >
                  {completedIds.has(step.id) ? 'Próxima' : 'Concluir e avançar'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => goTo(currentIdx + 1, 1)}
                  disabled={!canAdvance || currentIdx === steps.length - 1}
                  className="bg-gold-400 hover:bg-gold-300 text-ink-900 font-semibold gap-2 shadow-gold"
                >
                  {canAdvance ? 'Avançar' : 'Complete o quiz'} <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <Sidebar
          course={course}
          steps={steps}
          currentIdx={currentIdx}
          completedIds={completedIds}
          quizCompleted={quizCompleted}
          reportSubmitted={reportSubmitted}
          onJump={(idx) => goTo(idx)}
        />
      </div>
    </div>
  );
}
