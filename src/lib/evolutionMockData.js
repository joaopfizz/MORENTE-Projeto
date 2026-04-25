// ============================================================
// Evolução do time — agregados, melhorias e review do gestor
// Agrega dados do paacMockData + academyMockData
// Persiste review e melhorias novas em localStorage
// ============================================================

import { MOCK_TEAM, demoStore } from './paacMockData';
import { academyStore, MOCK_COURSES } from './academyMockData';

const IMPROVEMENTS_KEY = 'evolution_improvements_v1';
const REVIEWS_KEY = 'evolution_reviews_v1';

// -------------------- MELHORIAS (inicial) --------------------
// categorias: curso | campo | mentoria | certificado

const INITIAL_IMPROVEMENTS = {
  'rafael.mendes@arese.com.br': [
    {
      id: 'imp-raf-1',
      date: '2026-02-20',
      title: 'Registro diário de OPV no Portal',
      description:
        'Após o feedback da primeira PAAC, passou a registrar o objetivo da próxima visita no mesmo dia, antes de encerrar o expediente. Taxa de registro subiu de 42% para 94%.',
      category: 'campo',
      paac_key: '2.4.3',
    },
    {
      id: 'imp-raf-2',
      date: '2026-03-05',
      title: 'Role-play quinzenal de sondagens',
      description:
        'Sessões de 30 min com a Carla para treinar abordagem no histórico e verificação do "Falado pelo Médico".',
      category: 'mentoria',
      paac_key: '2.1.2',
    },
    {
      id: 'imp-raf-3',
      date: '2026-03-22',
      title: 'Concluiu curso Conhecendo a Concorrência',
      description:
        'Completou os 6 módulos, passou no quiz (score 80%) e entregou o relatório aplicando ao território 087.',
      category: 'curso',
      paac_key: '1.1.3',
      course_id: 'curso-concorrencia',
    },
  ],
  'juliana.ferraz@arese.com.br': [
    {
      id: 'imp-jul-1',
      date: '2026-02-28',
      title: 'Checklist de pré-visita do distrito',
      description:
        'Desenhou um checklist de 8 itens para pré-visita que está sendo adotado como padrão pelos 5 reps do distrito.',
      category: 'campo',
    },
    {
      id: 'imp-jul-2',
      date: '2026-03-15',
      title: 'Facilitou workshop de sondagens (2h)',
      description:
        'Conduziu um treinamento interno para o distrito sobre perguntas de sondagem que revelam objeção real do médico.',
      category: 'mentoria',
    },
    {
      id: 'imp-jul-3',
      date: '2026-04-05',
      title: 'Certificação técnica em Cardiologia (módulo 2)',
      description:
        'Concluiu o módulo 2 da certificação externa em Farmácia Clínica Cardiovascular.',
      category: 'certificado',
    },
  ],
  'thiago.nakamura@arese.com.br': [
    {
      id: 'imp-thi-1',
      date: '2026-02-10',
      title: 'Trilha de ambientação Arese (em andamento)',
      description:
        'Completou 4 de 7 módulos da trilha de ambientação. Destaque para o módulo de portfólio cardio.',
      category: 'curso',
    },
    {
      id: 'imp-thi-2',
      date: '2026-03-25',
      title: 'Plano de desenvolvimento estruturado até set/26',
      description:
        'Carla estruturou plano com 4 marcos (técnico, sondagem, compromisso, autonomia). Primeiro marco atingido.',
      category: 'mentoria',
    },
  ],
  'beatriz.oliveira@arese.com.br': [
    {
      id: 'imp-bea-1',
      date: '2026-02-15',
      title: 'Curso Negociação no PDV concluído',
      description:
        'Aplicou as técnicas de fechamento aprendidas em 3 PDVs estratégicos — conquistou 2 espaços antes ocupados pela concorrência.',
      category: 'curso',
    },
    {
      id: 'imp-bea-2',
      date: '2026-03-30',
      title: 'Replicou estratégia de posicionamento em 3 PDVs',
      description:
        'Documentou o playbook dos 3 PDVs de melhor desempenho e aplicou em 3 novos. Aumento de 18% no share do agente.',
      category: 'campo',
    },
  ],
  'eduardo.castilho@arese.com.br': [
    {
      id: 'imp-edu-1',
      date: '2026-04-10',
      title: 'Onboarding em andamento',
      description:
        'Ingressou em abril/26. Cumprindo trilha de integração. Primeira PAAC agendada para 05/05/26.',
      category: 'curso',
    },
  ],
};

// -------------------- REVIEWS (inicial) --------------------

const INITIAL_REVIEWS = {
  'rafael.mendes@arese.com.br': {
    updated_at: '2026-04-16',
    highlights:
      'Evolução consistente desde a chegada ao setor 087. Muito forte no relacionamento técnico com cardiologistas (Dr. Henrique Prado, Dra. Patricia Almeida). Disciplina no registro de OPV virou referência do distrito.',
    areas_to_improve:
      'Precisa fechar o ciclo de acompanhamento dos acordos de prescrição (2.2.4.4) — ainda deixa escapar. Média de visitação subindo, mas ainda abaixo do padrão do distrito.',
    next_steps:
      'Concluir curso de Histórico & "Falado pelo Médico". Atingir média 9.5 no próximo ciclo. Liderar role-play de fechamento para a Beatriz.',
    overall_rating: 4,
  },
  'juliana.ferraz@arese.com.br': {
    updated_at: '2026-04-03',
    highlights:
      'Top performer do distrito. Conduz visitas com segurança técnica e emocional. Já é a referência de sondagens. Iniciativa própria de facilitar workshops para o time.',
    areas_to_improve:
      'Elevar o ciclo de prescrição dos novos alvos (growth targets do ciclo 2). Oportunidade de começar a desenvolver liderança informal.',
    next_steps:
      'Assumir mentoria do Thiago. Candidatar-se ao programa Next Gen Leader. Expandir presença em 2 hospitais universitários do território.',
    overall_rating: 5,
  },
  'thiago.nakamura@arese.com.br': {
    updated_at: '2026-03-26',
    highlights:
      'Postura aberta ao feedback. Aprendeu rápido o portfólio cardio e já tem domínio dos 3 produtos principais. Bom relacionamento inicial com cardiologistas do setor 103.',
    areas_to_improve:
      'Sondagem ainda muito genérica — precisa personalizar por perfil de médico. Frequência de visita oscilando. Argumentação precisa apoiar mais no posicionamento de ciclo.',
    next_steps:
      'Continuar role-play quinzenal. Dupla de visita com Juliana 1x/mês. Completar trilha de ambientação até maio/26.',
    overall_rating: 3,
  },
  'beatriz.oliveira@arese.com.br': {
    updated_at: '2026-04-09',
    highlights:
      'Muito forte na negociação comercial de PDV. Conquistou espaços antes dominados pela concorrência. Excelente relacionamento com agentes (balconistas e farmacêuticos).',
    areas_to_improve:
      'Expandir a estratégia dos 3 melhores PDVs para os 5 seguintes. Estruturar argumentação educacional para além do comercial.',
    next_steps:
      'Replicar playbook em 5 PDVs. Participar do módulo Educacional PDV. Acompanhar Rafael num PDV estratégico em maio.',
    overall_rating: 4,
  },
  'eduardo.castilho@arese.com.br': {
    updated_at: null,
    highlights: '',
    areas_to_improve: '',
    next_steps: '',
    overall_rating: 0,
  },
};

// -------------------- HELPERS DE STORAGE --------------------

function readJson(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('[evolutionStore] Erro ao salvar', err);
  }
}

function emit() {
  window.dispatchEvent(new CustomEvent('evolution-change'));
}

// -------------------- AGREGADORES --------------------

// extrai todas as tasks do rep a partir das PAACs
function collectTasks(email) {
  const evs = demoStore.getEvaluations().filter((e) => e.rep_email === email);
  const tasks = [];
  for (const ev of evs) {
    for (const t of ev.tasks || []) {
      tasks.push({
        ...t,
        evaluation_id: ev.id,
        evaluation_date: ev.evaluation_date,
        evaluation_type: ev.type,
      });
    }
  }
  return tasks;
}

// conta S / A / N nos scores agregados do rep
function aggregateScores(email) {
  const evs = demoStore.getEvaluations().filter((e) => e.rep_email === email);
  const counters = { S: 0, A: 0, N: 0, total: 0 };
  const perCriteria = {}; // lastStatus por criteria
  for (const ev of evs) {
    for (const [key, status] of Object.entries(ev.scores || {})) {
      counters.total += 1;
      counters[status] = (counters[status] || 0) + 1;
      perCriteria[key] = status; // guarda o mais recente (evs são em ordem decrescente no mock)
    }
  }
  const performance =
    counters.total > 0
      ? Math.round(((counters.S * 100 + counters.A * 70) / (counters.total * 100)) * 100)
      : 0;
  // identifica top strengths (S) e gaps (N) pelos criteria mais recentes
  const strengths = Object.entries(perCriteria)
    .filter(([, s]) => s === 'S')
    .map(([k]) => k)
    .slice(0, 5);
  const gaps = Object.entries(perCriteria)
    .filter(([, s]) => s === 'N')
    .map(([k]) => k)
    .slice(0, 5);
  return { counters, performance, strengths, gaps };
}

// cursos concluídos pelo rep
function collectCourses(email) {
  const done = [];
  const inProgress = [];
  for (const course of MOCK_COURSES) {
    const pct = academyStore.getCoursePercent(email, course);
    if (academyStore.isCourseCompleted(email, course)) {
      done.push({ ...course, percent: 100 });
    } else if (pct > 0) {
      inProgress.push({ ...course, percent: pct });
    }
  }
  return { done, inProgress };
}

// -------------------- STORE --------------------

export const evolutionStore = {
  // --- Improvements ---
  getImprovements(email) {
    const saved = readJson(IMPROVEMENTS_KEY, {});
    const initial = INITIAL_IMPROVEMENTS[email] || [];
    const userAdded = saved[email] || [];
    return [...initial, ...userAdded].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  },

  addImprovement(email, action) {
    const saved = readJson(IMPROVEMENTS_KEY, {});
    const list = saved[email] || [];
    const newAction = {
      id: `imp-user-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      ...action,
    };
    list.push(newAction);
    saved[email] = list;
    writeJson(IMPROVEMENTS_KEY, saved);
    emit();
    return newAction;
  },

  // --- Reviews ---
  getReview(email) {
    const saved = readJson(REVIEWS_KEY, {});
    if (saved[email]) return saved[email];
    return INITIAL_REVIEWS[email] || {
      updated_at: null,
      highlights: '',
      areas_to_improve: '',
      next_steps: '',
      overall_rating: 0,
    };
  },

  saveReview(email, review) {
    const saved = readJson(REVIEWS_KEY, {});
    saved[email] = {
      ...review,
      updated_at: new Date().toISOString().slice(0, 10),
    };
    writeJson(REVIEWS_KEY, saved);
    emit();
    return saved[email];
  },

  // --- Summary por rep ---
  getRepSummary(rep) {
    const email = rep.email;
    const tasks = collectTasks(email);
    const scores = aggregateScores(email);
    const courses = collectCourses(email);
    const improvements = this.getImprovements(email);
    const review = this.getReview(email);

    const completedTasks = tasks.filter((t) => t.status === 'concluido').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'em_andamento').length;
    const pendingTasks = tasks.filter((t) => t.status === 'pendente').length;
    const taskCompletionRate =
      tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    return {
      rep,
      tasks: {
        all: tasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        pending: pendingTasks,
        total: tasks.length,
        rate: taskCompletionRate,
      },
      paac: scores,
      courses,
      improvements,
      review,
    };
  },

  getTeamSummary() {
    return MOCK_TEAM.map((rep) => this.getRepSummary(rep));
  },

  // reset dos dados que o usuário acrescentou
  reset() {
    writeJson(IMPROVEMENTS_KEY, {});
    writeJson(REVIEWS_KEY, {});
    emit();
  },
};
