// ============================================================
// Athivar — motor de missões com gamificação
// - Toda task N/em-andamento do PAAC vira "missão candidata"
// - Gestor ativa (escolhe dificuldade, prazo, curso sugerido)
// - Colaborador reporta → status "pending_validation"
// - Gestor aprova → soma pontos (com +20% se entregou no prazo)
// - Missões aprovadas viram improvement 'campo' no evolutionStore
// ============================================================

import { MOCK_TEAM, demoStore } from './paacMockData';
import { MOCK_COURSES } from './academyMockData';

const MISSIONS_KEY = 'athivar_missions_v1';

// -------------------- CONFIG --------------------

export const DIFFICULTY = {
  easy: { label: 'Iniciante', points: 50, color: 'emerald', hue: 'from-emerald-500 to-emerald-700' },
  medium: { label: 'Padrão', points: 100, color: 'gold', hue: 'from-gold-500 to-gold-600' },
  hard: { label: 'Desafiador', points: 200, color: 'rose', hue: 'from-rose-500 to-rose-700' },
};

export const ON_TIME_BONUS = 0.2; // +20% se entregar antes do prazo

export const MISSION_STATUS = {
  active: { label: 'Ativa', color: 'amber' },
  pending_validation: { label: 'Aguardando validação', color: 'violet' },
  completed: { label: 'Concluída', color: 'emerald' },
  needs_rework: { label: 'Ajustes solicitados', color: 'rose' },
};

// -------------------- MISSÕES INICIAIS --------------------
// Coerentes com as tasks dos PAACs em paacMockData

const INITIAL_MISSIONS = [
  // ---------- RAFAEL ----------
  {
    id: 'mis-raf-1',
    rep_email: 'rafael.mendes@arese.com.br',
    rep_name: 'Rafael Mendes',
    source: 'paac',
    paac_task_id: 'mock-task-4',
    paac_criteria_key: '2.1.2',
    paac_criteria_label: 'Histórico — Entende a importância? Verifica o "Falado pelo Médico"?',
    section_label: '2.1 — Pré-Visita',
    title: 'Dominar o uso do Histórico e do "Falado pelo Médico"',
    description:
      'Estudar o módulo de Histórico da Academy e aplicar em pelo menos 10 visitas documentando o "Falado pelo Médico" de cada cardiologista-alvo.',
    objective:
      'Que em toda visita subsequente o representante revise o histórico antes de entrar no consultório e registre pós-visita.',
    success_criteria:
      '10 visitas documentadas com registro de histórico e "Falado pelo Médico" verificado.',
    difficulty: 'medium',
    base_points: 100,
    suggested_course_id: 'curso-historico',
    deadline: '2026-05-15',
    activated_at: '2026-04-10',
    activated_by: 'carla.souza@arese.com.br',
    status: 'active',
    report: null,
    manager_feedback: null,
    approved_at: null,
    points_awarded: null,
  },
  {
    id: 'mis-raf-2',
    rep_email: 'rafael.mendes@arese.com.br',
    rep_name: 'Rafael Mendes',
    source: 'paac',
    paac_task_id: 'mock-task-1',
    paac_criteria_key: '2.1.3',
    paac_criteria_label: 'Educacional — mensagem assertiva, treinamento de balconistas',
    section_label: '2.1 — Os 4 Pilares do PDV',
    title: 'Treinar balconistas em 3 PDVs estratégicos',
    description:
      'Preparar material educacional simplificado e conduzir treinamento presencial com balconistas dos 3 PDVs de maior categoria (Drogasil, Droga Raia e Pague Menos do shopping).',
    objective:
      'Balconistas capacitados para indicar corretamente os produtos cardio da Arese.',
    success_criteria:
      '3 treinamentos aplicados (com lista de presença) + relato com fotos do material usado.',
    difficulty: 'hard',
    base_points: 200,
    suggested_course_id: null,
    deadline: '2026-05-05',
    activated_at: '2026-04-16',
    activated_by: 'carla.souza@arese.com.br',
    status: 'active',
    report: null,
    manager_feedback: null,
    approved_at: null,
    points_awarded: null,
  },
  {
    id: 'mis-raf-3',
    rep_email: 'rafael.mendes@arese.com.br',
    rep_name: 'Rafael Mendes',
    source: 'paac',
    paac_task_id: 'mock-task-5',
    paac_criteria_key: '2.2.4.4',
    paac_criteria_label: 'Acompanha os acordos de prescrição estabelecidos?',
    section_label: '2.2.4 — Compromisso',
    title: 'Acompanhar acordos de prescrição com Dra. Patricia Almeida',
    description:
      'Revisitar a Dra. Patricia Almeida, validar as moléculas combinadas e documentar o feedback de prescrição atualizado no Portal.',
    objective:
      'Fechar o ciclo dos acordos firmados na visita de 18/03 e renovar o compromisso para o próximo ciclo.',
    success_criteria:
      'Visita realizada + registro no Portal + feedback de prescrição documentado.',
    difficulty: 'medium',
    base_points: 100,
    suggested_course_id: null,
    deadline: '2026-04-22',
    activated_at: '2026-04-05',
    activated_by: 'carla.souza@arese.com.br',
    status: 'pending_validation',
    report: {
      text:
        'Realizei visita à Dra. Patricia no dia 17/04. Revisei o acordo de prescrição de Valsart 160mg para os pacientes hipertensos e ela confirmou que está prescrevendo para todos os novos hipertensos que chegam. Deixou claro que o principal diferencial percebido foi a tolerabilidade. Registrei tudo no Portal naquele mesmo dia e já marquei próxima visita para 08/05.',
      evidence_url: 'https://portal.arese.com.br/visitas/47823',
      submitted_at: '2026-04-18',
    },
    manager_feedback: null,
    approved_at: null,
    points_awarded: null,
  },
  {
    id: 'mis-raf-4',
    rep_email: 'rafael.mendes@arese.com.br',
    rep_name: 'Rafael Mendes',
    source: 'paac',
    paac_task_id: 'mock-task-6',
    paac_criteria_key: '1.1.3',
    paac_criteria_label: 'Concorrência — Conhece? Pontos fracos e fortes?',
    section_label: '1.1 — Conhecimento Técnico',
    title: 'Estudar a concorrência do território 087',
    description:
      'Concluir o curso "Conhecendo a Concorrência" da Academy e aplicar o mapa competitivo aos 10 principais cardiologistas do setor.',
    objective: 'Conhecer os 3 principais competidores de cada molécula do portfólio cardio.',
    success_criteria: 'Curso concluído + mapa competitivo entregue para a gestora.',
    difficulty: 'medium',
    base_points: 100,
    suggested_course_id: 'curso-concorrencia',
    deadline: '2026-03-31',
    activated_at: '2026-02-14',
    activated_by: 'carla.souza@arese.com.br',
    status: 'completed',
    report: {
      text:
        'Conclui o curso "Conhecendo a Concorrência" com 80% no quiz. Elaborei um mapa competitivo dos 10 cardiologistas principais identificando quem prescreve a concorrência e os motivos. Destaque: Dr. Henrique ainda prescreve Losart 50mg (genérico) mesmo tendo sido visitado pela Arese — oportunidade de revisita com argumentação comparativa.',
      evidence_url: null,
      submitted_at: '2026-03-20',
    },
    manager_feedback:
      'Excelente trabalho, Rafael. O mapa ficou claro e acionável. Já estamos usando seu material como referência no distrito. Parabéns.',
    approved_at: '2026-03-22',
    points_awarded: 120, // 100 * 1.2 (prazo)
  },

  // ---------- JULIANA ----------
  {
    id: 'mis-jul-1',
    rep_email: 'juliana.ferraz@arese.com.br',
    rep_name: 'Juliana Ferraz',
    source: 'manual',
    paac_task_id: null,
    paac_criteria_key: null,
    paac_criteria_label: null,
    section_label: null,
    title: 'Liderar 3 workshops de sondagens no distrito',
    description:
      'Conduzir 3 encontros de 90 min com o time do distrito ensinando a framework de sondagem que você aplica com maestria.',
    objective:
      'Elevar o padrão de sondagem de todo o distrito usando sua prática como referência.',
    success_criteria:
      '3 workshops realizados + feedback dos participantes coletado + material ficar disponível no Portal.',
    difficulty: 'medium',
    base_points: 100,
    suggested_course_id: null,
    deadline: '2026-05-15',
    activated_at: '2026-03-20',
    activated_by: 'carla.souza@arese.com.br',
    status: 'active',
    report: null,
    manager_feedback: null,
    approved_at: null,
    points_awarded: null,
  },
  {
    id: 'mis-jul-2',
    rep_email: 'juliana.ferraz@arese.com.br',
    rep_name: 'Juliana Ferraz',
    source: 'manual',
    paac_task_id: null,
    paac_criteria_key: null,
    paac_criteria_label: null,
    section_label: null,
    title: 'Criar checklist de pré-visita padrão do distrito',
    description:
      'Sistematizar a sua pré-visita num checklist utilizável pelo time todo.',
    objective:
      'Ter um artefato replicável que eleva o patamar de preparação de toda a equipe.',
    success_criteria: 'Checklist finalizado + adotado por ao menos 3 dos 5 reps do distrito.',
    difficulty: 'hard',
    base_points: 200,
    suggested_course_id: null,
    deadline: '2026-03-10',
    activated_at: '2026-02-18',
    activated_by: 'carla.souza@arese.com.br',
    status: 'completed',
    report: {
      text:
        'Desenhei checklist de 8 itens baseado nas 5 últimas PAACs do distrito. Apresentei para o time na reunião de 28/02 e já foi adotado por 4 dos 5 reps (faltou só o Eduardo, que ainda não começou em campo). Documento disponível no Portal > Distrito SP-Interior > Padrões.',
      evidence_url: 'https://portal.arese.com.br/distrito/sp-interior/padroes',
      submitted_at: '2026-02-28',
    },
    manager_feedback:
      'Referência. Seu checklist foi adotado pela direção como padrão sugerido para outros distritos da região Sudeste.',
    approved_at: '2026-03-01',
    points_awarded: 240, // 200 * 1.2 (prazo)
  },
  {
    id: 'mis-jul-3',
    rep_email: 'juliana.ferraz@arese.com.br',
    rep_name: 'Juliana Ferraz',
    source: 'manual',
    paac_task_id: null,
    paac_criteria_key: null,
    paac_criteria_label: null,
    section_label: null,
    title: 'Obter certificação Cardio módulo 2',
    description:
      'Concluir o módulo 2 da certificação externa em Farmácia Clínica Cardiovascular.',
    objective: 'Aprofundar conhecimento técnico nas moléculas de linha cardio.',
    success_criteria: 'Certificado emitido pela instituição.',
    difficulty: 'medium',
    base_points: 100,
    suggested_course_id: null,
    deadline: '2026-04-30',
    activated_at: '2026-03-01',
    activated_by: 'carla.souza@arese.com.br',
    status: 'completed',
    report: {
      text:
        'Conclui módulo 2 com nota 9.1. Estou me inscrevendo no módulo 3 (farmacocinética).',
      evidence_url: null,
      submitted_at: '2026-04-05',
    },
    manager_feedback: 'Parabéns — um passo relevante para sua trajetória.',
    approved_at: '2026-04-06',
    points_awarded: 120, // 100 * 1.2
  },

  // ---------- THIAGO ----------
  {
    id: 'mis-thi-1',
    rep_email: 'thiago.nakamura@arese.com.br',
    rep_name: 'Thiago Nakamura',
    source: 'manual',
    paac_task_id: null,
    paac_criteria_key: null,
    paac_criteria_label: null,
    section_label: null,
    title: 'Completar trilha de ambientação Arese',
    description:
      'Concluir os 7 módulos da trilha de ambientação e aplicar o aprendizado no setor 103.',
    objective: 'Ter base técnica para rodar setor com autonomia até julho/26.',
    success_criteria: '7 módulos concluídos + quiz de cada um acima de 70%.',
    difficulty: 'medium',
    base_points: 100,
    suggested_course_id: null,
    deadline: '2026-05-30',
    activated_at: '2026-02-05',
    activated_by: 'carla.souza@arese.com.br',
    status: 'active',
    report: null,
    manager_feedback: null,
    approved_at: null,
    points_awarded: null,
  },
  {
    id: 'mis-thi-2',
    rep_email: 'thiago.nakamura@arese.com.br',
    rep_name: 'Thiago Nakamura',
    source: 'manual',
    paac_task_id: null,
    paac_criteria_key: null,
    paac_criteria_label: null,
    section_label: null,
    title: 'Role-play quinzenal de sondagens (6 sessões)',
    description:
      'Participar de 6 sessões quinzenais de role-play com a gestora para treinar sondagens e fechamento.',
    objective: 'Reduzir variabilidade da sondagem e preparar para autonomia total.',
    success_criteria: '6 sessões aplicadas + relato de evolução em cada uma.',
    difficulty: 'easy',
    base_points: 50,
    suggested_course_id: null,
    deadline: '2026-06-15',
    activated_at: '2026-03-25',
    activated_by: 'carla.souza@arese.com.br',
    status: 'active',
    report: null,
    manager_feedback: null,
    approved_at: null,
    points_awarded: null,
  },

  // ---------- BEATRIZ ----------
  {
    id: 'mis-bea-1',
    rep_email: 'beatriz.oliveira@arese.com.br',
    rep_name: 'Beatriz Oliveira',
    source: 'manual',
    paac_task_id: null,
    paac_criteria_key: null,
    paac_criteria_label: null,
    section_label: null,
    title: 'Expandir playbook de PDV para 5 novos locais',
    description:
      'Aplicar a estratégia dos 3 melhores PDVs nos 5 seguintes do ranking do território.',
    objective: 'Ampliar share do agente em pelo menos 3 dos 5 PDVs.',
    success_criteria:
      '5 PDVs aplicando o playbook + métrica de share mensurada em 30 dias.',
    difficulty: 'hard',
    base_points: 200,
    suggested_course_id: null,
    deadline: '2026-05-30',
    activated_at: '2026-04-10',
    activated_by: 'carla.souza@arese.com.br',
    status: 'active',
    report: null,
    manager_feedback: null,
    approved_at: null,
    points_awarded: null,
  },
  {
    id: 'mis-bea-2',
    rep_email: 'beatriz.oliveira@arese.com.br',
    rep_name: 'Beatriz Oliveira',
    source: 'manual',
    paac_task_id: null,
    paac_criteria_key: null,
    paac_criteria_label: null,
    section_label: null,
    title: 'Replicar playbook dos 3 melhores PDVs em 3 novos',
    description:
      'Documentar e aplicar a estratégia dos 3 PDVs top em 3 PDVs que estavam dominados pela concorrência.',
    objective: 'Conquistar espaço em PDVs antes dominados pela concorrência.',
    success_criteria:
      '3 PDVs com aumento mensurável de share nos produtos cardio.',
    difficulty: 'hard',
    base_points: 200,
    suggested_course_id: null,
    deadline: '2026-04-15',
    activated_at: '2026-03-05',
    activated_by: 'carla.souza@arese.com.br',
    status: 'completed',
    report: {
      text:
        'Apliquei o playbook nos PDVs Drogaria São Paulo, Droga Raia Vila Madalena e Pague Menos Santana. Aumento médio de 18% no share do agente em 30 dias. Playbook documentado no Portal.',
      evidence_url: 'https://portal.arese.com.br/beatriz/playbook-pdv',
      submitted_at: '2026-03-28',
    },
    manager_feedback:
      'Resultado expressivo. Vou levar seu playbook como caso para a reunião regional.',
    approved_at: '2026-03-31',
    points_awarded: 240, // 200 * 1.2
  },
  {
    id: 'mis-bea-3',
    rep_email: 'beatriz.oliveira@arese.com.br',
    rep_name: 'Beatriz Oliveira',
    source: 'manual',
    paac_task_id: null,
    paac_criteria_key: null,
    paac_criteria_label: null,
    section_label: null,
    title: 'Concluir curso Negociação no PDV',
    description: 'Finalizar o curso de Negociação da Academy.',
    objective: 'Refinar técnicas de fechamento em PDV.',
    success_criteria: 'Curso concluído + quiz final acima de 75%.',
    difficulty: 'medium',
    base_points: 100,
    suggested_course_id: null,
    deadline: '2026-02-28',
    activated_at: '2026-01-30',
    activated_by: 'carla.souza@arese.com.br',
    status: 'completed',
    report: {
      text: 'Concluído com 85% no quiz. Já apliquei em 2 negociações de rebate com retorno positivo.',
      evidence_url: null,
      submitted_at: '2026-02-14',
    },
    manager_feedback: 'Muito bom. Continua.',
    approved_at: '2026-02-16',
    points_awarded: 120,
  },

  // ---------- EDUARDO ----------
  {
    id: 'mis-edu-1',
    rep_email: 'eduardo.castilho@arese.com.br',
    rep_name: 'Eduardo Castilho',
    source: 'manual',
    paac_task_id: null,
    paac_criteria_key: null,
    paac_criteria_label: null,
    section_label: null,
    title: 'Completar onboarding Arese (7 módulos)',
    description: 'Passar pelos 7 módulos de ambientação.',
    objective: 'Estar pronto para a primeira PAAC em 05/05/26.',
    success_criteria: '7 módulos concluídos antes da primeira PAAC.',
    difficulty: 'medium',
    base_points: 100,
    suggested_course_id: null,
    deadline: '2026-05-04',
    activated_at: '2026-04-10',
    activated_by: 'carla.souza@arese.com.br',
    status: 'active',
    report: null,
    manager_feedback: null,
    approved_at: null,
    points_awarded: null,
  },
];

// -------------------- STORAGE --------------------

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
    console.error('[athivarStore] erro ao salvar', err);
  }
}

function emit() {
  window.dispatchEvent(new CustomEvent('athivar-change'));
}

// -------------------- CORE --------------------

// Lê a lista mesclada (iniciais + persistidas + updates)
function readMissions() {
  const patches = readJson(MISSIONS_KEY, { overrides: {}, created: [] });
  const overrides = patches.overrides || {};
  const created = patches.created || [];
  const base = INITIAL_MISSIONS.map((m) =>
    overrides[m.id] ? { ...m, ...overrides[m.id] } : m
  );
  return [...base, ...created];
}

function saveMission(mission) {
  const patches = readJson(MISSIONS_KEY, { overrides: {}, created: [] });
  const patchesOverrides = patches.overrides || {};
  const patchesCreated = patches.created || [];

  // Se é uma missão criada pelo usuário, atualiza/insere em 'created'
  const createdIdx = patchesCreated.findIndex((m) => m.id === mission.id);
  if (createdIdx >= 0) {
    patchesCreated[createdIdx] = mission;
  } else {
    const isInitial = INITIAL_MISSIONS.some((m) => m.id === mission.id);
    if (isInitial) {
      patchesOverrides[mission.id] = mission;
    } else {
      patchesCreated.push(mission);
    }
  }
  writeJson(MISSIONS_KEY, { overrides: patchesOverrides, created: patchesCreated });
  emit();
}

// -------------------- HELPERS PRIVADOS --------------------

function findCourseSuggestion(paacKey) {
  if (!paacKey) return null;
  return MOCK_COURSES.find((c) => c.related_paac_key === paacKey) || null;
}

// -------------------- API --------------------

export const athivarStore = {
  DIFFICULTY,
  ON_TIME_BONUS,
  MISSION_STATUS,

  // Todas as missões
  getAllMissions() {
    return readMissions();
  },

  // Missões de um rep específico
  getMissionsByRep(email) {
    return readMissions()
      .filter((m) => m.rep_email === email)
      .sort((a, b) => new Date(b.activated_at || 0) - new Date(a.activated_at || 0));
  },

  // Todas em aguardando validação (pra gestor priorizar)
  getPendingValidation() {
    return readMissions()
      .filter((m) => m.status === 'pending_validation')
      .sort(
        (a, b) =>
          new Date(a.report?.submitted_at || 0) -
          new Date(b.report?.submitted_at || 0)
      );
  },

  // Todas em andamento no time
  getActive() {
    return readMissions().filter((m) => m.status === 'active');
  },

  // Missões concluídas (todas)
  getCompleted() {
    return readMissions()
      .filter((m) => m.status === 'completed')
      .sort((a, b) => new Date(b.approved_at || 0) - new Date(a.approved_at || 0));
  },

  // Candidatas derivadas do PAAC: tasks pendente/em_andamento sem missão associada
  getCandidateMissions() {
    const missions = readMissions();
    const associatedTaskIds = new Set(
      missions.filter((m) => m.paac_task_id).map((m) => m.paac_task_id)
    );

    const candidates = [];
    for (const ev of demoStore.getEvaluations()) {
      if (ev.status !== 'completed') continue;
      for (const task of ev.tasks || []) {
        if (task.status === 'concluido') continue; // já feito fora do Athivar
        if (associatedTaskIds.has(task.id)) continue; // já virou missão
        const rep = MOCK_TEAM.find((r) => r.email === ev.rep_email);
        const suggestedCourse = findCourseSuggestion(task.criteria_key);
        candidates.push({
          id: `cand-${task.id}`,
          task_id: task.id,
          rep_email: ev.rep_email,
          rep_name: ev.rep_name,
          rep,
          paac_criteria_key: task.criteria_key,
          paac_criteria_label: task.criteria_label,
          section_label: task.section_label,
          evaluation_id: ev.id,
          evaluation_date: ev.evaluation_date,
          current_status: task.status,
          suggested_course: suggestedCourse,
        });
      }
    }
    // Ordena por data da PAAC desc
    candidates.sort(
      (a, b) => new Date(b.evaluation_date) - new Date(a.evaluation_date)
    );
    return candidates;
  },

  // Ativa missão a partir de candidata
  activateMission(candidate, config) {
    const diff = DIFFICULTY[config.difficulty] || DIFFICULTY.medium;
    const mission = {
      id: `mis-user-${Date.now()}`,
      rep_email: candidate.rep_email,
      rep_name: candidate.rep_name,
      source: 'paac',
      paac_task_id: candidate.task_id,
      paac_criteria_key: candidate.paac_criteria_key,
      paac_criteria_label: candidate.paac_criteria_label,
      section_label: candidate.section_label,
      title: config.title,
      description: config.description,
      objective: config.objective || '',
      success_criteria: config.success_criteria || '',
      difficulty: config.difficulty,
      base_points: diff.points,
      suggested_course_id: config.suggested_course_id || null,
      deadline: config.deadline,
      activated_at: new Date().toISOString().slice(0, 10),
      activated_by: demoStore.getCurrentUser().email,
      status: 'active',
      report: null,
      manager_feedback: null,
      approved_at: null,
      points_awarded: null,
    };
    saveMission(mission);
    return mission;
  },

  // Cria missão manual (gestor escolhe o rep)
  createManualMission(config) {
    const diff = DIFFICULTY[config.difficulty] || DIFFICULTY.medium;
    const rep = MOCK_TEAM.find((r) => r.email === config.rep_email);
    const mission = {
      id: `mis-user-${Date.now()}`,
      rep_email: config.rep_email,
      rep_name: rep?.full_name || config.rep_email,
      source: 'manual',
      paac_task_id: null,
      paac_criteria_key: null,
      paac_criteria_label: null,
      section_label: null,
      title: config.title,
      description: config.description,
      objective: config.objective || '',
      success_criteria: config.success_criteria || '',
      difficulty: config.difficulty,
      base_points: diff.points,
      suggested_course_id: config.suggested_course_id || null,
      deadline: config.deadline,
      activated_at: new Date().toISOString().slice(0, 10),
      activated_by: demoStore.getCurrentUser().email,
      status: 'active',
      report: null,
      manager_feedback: null,
      approved_at: null,
      points_awarded: null,
    };
    saveMission(mission);
    return mission;
  },

  // Colaborador envia relato
  submitReport(missionId, reportText, evidenceUrl) {
    const missions = readMissions();
    const m = missions.find((x) => x.id === missionId);
    if (!m) return null;
    const updated = {
      ...m,
      status: 'pending_validation',
      report: {
        text: reportText,
        evidence_url: evidenceUrl || null,
        submitted_at: new Date().toISOString().slice(0, 10),
      },
      manager_feedback: null, // limpa ajuste anterior se era rework
    };
    saveMission(updated);
    return updated;
  },

  // Gestor aprova
  approveMission(missionId, feedback) {
    const missions = readMissions();
    const m = missions.find((x) => x.id === missionId);
    if (!m) return null;
    const approvedAt = new Date().toISOString().slice(0, 10);
    const onTime = !m.deadline || new Date(approvedAt) <= new Date(m.deadline);
    const points = onTime
      ? Math.round(m.base_points * (1 + ON_TIME_BONUS))
      : m.base_points;
    const updated = {
      ...m,
      status: 'completed',
      manager_feedback: feedback || '',
      approved_at: approvedAt,
      points_awarded: points,
      on_time_bonus: onTime,
    };
    saveMission(updated);
    return updated;
  },

  // Gestor pede ajustes
  requestRework(missionId, feedback) {
    const missions = readMissions();
    const m = missions.find((x) => x.id === missionId);
    if (!m) return null;
    const updated = {
      ...m,
      status: 'needs_rework',
      manager_feedback: feedback || '',
    };
    saveMission(updated);
    return updated;
  },

  // -------- POINTS & LEADERBOARD --------

  getUserPoints(email) {
    return readMissions()
      .filter((m) => m.rep_email === email && m.status === 'completed')
      .reduce((acc, m) => acc + (m.points_awarded || 0), 0);
  },

  getUserCompletedCount(email) {
    return readMissions().filter(
      (m) => m.rep_email === email && m.status === 'completed'
    ).length;
  },

  // Leaderboard ordenado: [{rank, rep, points, completed}]
  getLeaderboard() {
    const rows = MOCK_TEAM.map((rep) => ({
      rep,
      points: this.getUserPoints(rep.email),
      completed: this.getUserCompletedCount(rep.email),
      active: readMissions().filter(
        (m) => m.rep_email === rep.email && m.status === 'active'
      ).length,
    }));
    rows.sort((a, b) => b.points - a.points || b.completed - a.completed);
    // assign rank with ties
    let lastPoints = null;
    let lastRank = 0;
    rows.forEach((r, i) => {
      if (r.points !== lastPoints) {
        lastRank = i + 1;
        lastPoints = r.points;
      }
      r.rank = lastRank;
    });
    return rows;
  },

  getUserRank(email) {
    const lb = this.getLeaderboard();
    return lb.find((r) => r.rep.email === email) || null;
  },

  reset() {
    writeJson(MISSIONS_KEY, { overrides: {}, created: [] });
    emit();
  },
};
