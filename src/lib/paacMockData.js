// ============================================================
// Dados fictícios + store local (localStorage) para demo
// Usado quando o backend Base44 não está conectado
// ============================================================

const STORAGE_KEY = 'paac_demo_store_v1';
const ROLE_KEY = 'paac_demo_role_v1';
const AUTH_KEY = 'paac_demo_auth_v1';

// Contas fake de demo: email → role. Qualquer senha funciona.
export const DEMO_ACCOUNTS = {
  'carla.souza@arese.com.br': 'gestor',
  'rafael.mendes@arese.com.br': 'colaborador',
};

// -------------------- PERFIS --------------------

export const MOCK_REP_PROFILE = {
  id: 'mock-rep-1',
  full_name: 'Rafael Mendes',
  email: 'rafael.mendes@arese.com.br',
  position: 'Representante de Propaganda Médica',
  team: 'Setor 087 - Campinas/SP',
  department: 'Linha Cardio',
  manager_email: 'carla.souza@arese.com.br',
};

export const MOCK_LEADER_PROFILE = {
  id: 'mock-leader-1',
  full_name: 'Carla Souza',
  email: 'carla.souza@arese.com.br',
  position: 'Gerente Distrital',
  team: 'Distrito SP-Interior',
  department: 'Linha Cardio',
};

// Time do gestor (Carla)
export const MOCK_TEAM = [
  MOCK_REP_PROFILE,
  {
    id: 'mock-rep-2',
    full_name: 'Juliana Ferraz',
    email: 'juliana.ferraz@arese.com.br',
    position: 'Representante de Propaganda Médica',
    team: 'Setor 091 - Sorocaba/SP',
    department: 'Linha Cardio',
    manager_email: 'carla.souza@arese.com.br',
  },
  {
    id: 'mock-rep-3',
    full_name: 'Thiago Nakamura',
    email: 'thiago.nakamura@arese.com.br',
    position: 'Representante de Propaganda Médica',
    team: 'Setor 103 - Ribeirão Preto/SP',
    department: 'Linha Cardio',
    manager_email: 'carla.souza@arese.com.br',
  },
  {
    id: 'mock-rep-4',
    full_name: 'Beatriz Oliveira',
    email: 'beatriz.oliveira@arese.com.br',
    position: 'Representante de Propaganda Médica',
    team: 'Setor 115 - São José dos Campos/SP',
    department: 'Linha Cardio',
    manager_email: 'carla.souza@arese.com.br',
  },
  {
    id: 'mock-rep-5',
    full_name: 'Eduardo Castilho',
    email: 'eduardo.castilho@arese.com.br',
    position: 'Representante de Propaganda Médica',
    team: 'Setor 122 - Piracicaba/SP',
    department: 'Linha Cardio',
    manager_email: 'carla.souza@arese.com.br',
  },
];

// -------------------- AVALIAÇÕES BASE --------------------

export const MOCK_EVALUATIONS = [
  {
    id: 'mock-ev-3',
    rep_email: 'rafael.mendes@arese.com.br',
    rep_name: 'Rafael Mendes',
    leader_email: 'carla.souza@arese.com.br',
    leader_name: 'Carla Souza',
    sector: 'Setor 087',
    type: 'pdv',
    evaluation_date: '2026-04-15',
    status: 'completed',
    scores: {
      '1.1.1': 'A', '1.2.1': 'A',
      '2.1.1': 'S', '2.1.2': 'A', '2.1.3': 'N', '2.1.4': 'A',
      '3.1.1': 'A', '3.1.2': 'S',
      '4.1.1': 'A', '4.1.2': 'N', '4.1.3': 'A',
      '5.1.1': 'S', '5.1.2': 'A',
    },
    combinados:
      '15/04/26 — Combinamos reforçar o treinamento dos balconistas nos 3 PDVs de maior categoria (Drogasil, Droga Raia e Pague Menos do shopping).\n\nRafael vai estruturar material educacional simplificado até 22/04 e compartilhar comigo antes de aplicar em campo.\n\nTambém combinei acompanhá-lo no dia 28/04 para observar a abordagem junto aos agentes do PDV Drogaria São Paulo.',
    tasks: [
      { id: 'mock-task-1', criteria_key: '2.1.3', criteria_label: 'Educacional — mensagem assertiva, treinamento de balconistas', section_label: '2.1 — Os 4 Pilares do PDV', status: 'em_andamento', note: '' },
      { id: 'mock-task-2', criteria_key: '4.1.2', criteria_label: 'Identifica oportunidades para melhorar Conversão, Reduzir Trocas e conquistar Recomendações?', section_label: '4.1 — Agentes do PDV', status: 'pendente', note: '' },
    ],
  },
  {
    id: 'mock-ev-2',
    rep_email: 'rafael.mendes@arese.com.br',
    rep_name: 'Rafael Mendes',
    leader_email: 'carla.souza@arese.com.br',
    leader_name: 'Carla Souza',
    sector: 'Setor 087',
    type: 'demanda',
    evaluation_date: '2026-03-18',
    status: 'completed',
    scores: {
      '1.1.1':'A','1.1.2':'S','1.1.3':'A','1.1.4':'A','1.2.1':'A','1.2.2':'N',
      '1.3.1':'A','1.3.2':'A','1.3.3':'S','1.3.4':'A','1.4.1':'A','1.4.2':'A',
      '1.4.3':'A','1.4.4':'S','1.4.5':'A','2.1.1':'A','2.1.2':'N','2.1.3':'A',
      '2.1.4':'A','2.1.5':'A','2.2.1.1':'S','2.2.1.2':'A','2.2.1.3':'A',
      '2.2.1.4':'A','2.2.1.5':'A','2.2.2.1':'A','2.2.2.2':'S','2.2.3.1':'A',
      '2.2.3.2':'A','2.2.3.3':'A','2.2.3.4':'S','2.2.3.5':'A','2.2.4.1':'A',
      '2.2.4.2':'A','2.2.4.3':'A','2.2.4.4':'N','2.2.4.5':'A','2.4.1':'A',
      '2.4.2':'A','2.4.3':'A','3.1.1':'A','3.1.2':'A',
    },
    combinados:
      '18/03/26 — Visita de acompanhamento com o Dr. Henrique Prado (cardiologia). Rafael demonstrou excelente sintonia e conhecimento técnico — ponto forte da visita.\n\nCombinamos: (1) melhorar registro do histórico pós-visita no Portal no mesmo dia; (2) elevar a média de visitação do ciclo de 8.2 para 9.5 até o fim do próximo ciclo; (3) intensificar acompanhamento dos acordos de prescrição — revisar na próxima visita o combinado com Dra. Patricia Almeida.',
    tasks: [
      { id: 'mock-task-3', criteria_key: '1.2.2', criteria_label: 'Como está a média de visitação do ciclo?', section_label: '1.2 — Roteiros e Média de Visitação', status: 'concluido', note: '' },
      { id: 'mock-task-4', criteria_key: '2.1.2', criteria_label: 'Histórico — Entende a importância? Verifica o "Falado pelo Médico"?', section_label: '2.1 — Pré-Visita', status: 'em_andamento', note: '' },
      { id: 'mock-task-5', criteria_key: '2.2.4.4', criteria_label: 'Acompanha os acordos de prescrição estabelecidos?', section_label: '2.2.4 — Compromisso', status: 'pendente', note: '' },
    ],
  },
  {
    id: 'mock-ev-1',
    rep_email: 'rafael.mendes@arese.com.br',
    rep_name: 'Rafael Mendes',
    leader_email: 'carla.souza@arese.com.br',
    leader_name: 'Carla Souza',
    sector: 'Setor 087',
    type: 'demanda',
    evaluation_date: '2026-02-12',
    status: 'completed',
    scores: {
      '1.1.1':'A','1.1.2':'A','1.1.3':'N','1.1.4':'A','1.2.1':'N','1.2.2':'N',
      '1.3.1':'A','1.3.2':'A','1.3.3':'A','1.3.4':'N','1.4.1':'A','1.4.2':'A',
      '1.4.3':'A','1.4.4':'A','1.4.5':'A','2.1.1':'A','2.1.2':'N','2.1.3':'A',
      '2.1.4':'N','2.1.5':'A','2.2.1.1':'A','2.2.1.2':'A','2.2.1.3':'A',
      '2.2.1.4':'A','2.2.1.5':'A','2.2.2.1':'A','2.2.2.2':'A','2.2.3.1':'A',
      '2.2.3.2':'N','2.2.3.3':'A','2.2.3.4':'A','2.2.3.5':'A','2.2.4.1':'A',
      '2.2.4.2':'A','2.2.4.3':'A','2.2.4.4':'N','2.2.4.5':'A','2.4.1':'A',
      '2.4.2':'A','2.4.3':'N','3.1.1':'A','3.1.2':'A',
    },
    combinados:
      '12/02/26 — Primeira PAAC do ciclo. Rafael está em adaptação ao novo setor 087 (chegou em janeiro).\n\nPontos a trabalhar imediatamente: (1) estudar a concorrência do território; (2) estruturar o roteiro respeitando categorização; (3) dominar o uso do AUDIT antes de cada visita; (4) registrar OPV no Portal sistematicamente.\n\nPróximo acompanhamento: 18/03.',
    tasks: [
      { id: 'mock-task-6', criteria_key: '1.1.3', criteria_label: 'Concorrência — Conhece? Pontos fracos e fortes?', section_label: '1.1 — Conhecimento Técnico', status: 'concluido', note: '' },
      { id: 'mock-task-7', criteria_key: '1.2.1', criteria_label: 'Conhece o território? Segue o roteiro e faz boa programação?', section_label: '1.2 — Roteiros e Média de Visitação', status: 'concluido', note: '' },
      { id: 'mock-task-8', criteria_key: '1.2.2', criteria_label: 'Como está a média de visitação do ciclo?', section_label: '1.2 — Roteiros e Média de Visitação', status: 'concluido', note: '' },
      { id: 'mock-task-9', criteria_key: '1.3.4', criteria_label: 'Administração de Recursos — Avalia e apresenta possibilidades de investimento?', section_label: '1.3 — Planejamento Estratégico', status: 'em_andamento', note: '' },
      { id: 'mock-task-10', criteria_key: '2.1.2', criteria_label: 'Histórico — Entende a importância? Verifica o "Falado pelo Médico"?', section_label: '2.1 — Pré-Visita', status: 'concluido', note: '' },
      { id: 'mock-task-11', criteria_key: '2.1.4', criteria_label: 'AUDIT — Verifica informações e elabora estratégia antes das visitas?', section_label: '2.1 — Pré-Visita', status: 'concluido', note: '' },
      { id: 'mock-task-12', criteria_key: '2.2.3.2', criteria_label: 'Usa o posicionamento e segredo de vendas dos produtos do ciclo vigente?', section_label: '2.2.3 — Apresentação e Argumentação', status: 'concluido', note: '' },
      { id: 'mock-task-13', criteria_key: '2.2.4.4', criteria_label: 'Acompanha os acordos de prescrição estabelecidos?', section_label: '2.2.4 — Compromisso', status: 'em_andamento', note: '' },
      { id: 'mock-task-14', criteria_key: '2.4.3', criteria_label: 'Define objetivo para a próxima visita (OPV) e registra no Portal?', section_label: '2.4 — Pós-Visita', status: 'concluido', note: '' },
    ],
  },
  {
    id: 'mock-ev-4',
    rep_email: 'juliana.ferraz@arese.com.br',
    rep_name: 'Juliana Ferraz',
    leader_email: 'carla.souza@arese.com.br',
    leader_name: 'Carla Souza',
    sector: 'Setor 091',
    type: 'demanda',
    evaluation_date: '2026-04-02',
    status: 'completed',
    scores: {
      '1.1.1':'S','1.1.2':'S','1.1.3':'A','1.1.4':'S','1.2.1':'A','1.2.2':'A',
      '1.3.1':'A','1.3.2':'S','1.3.3':'A','1.3.4':'A','1.4.1':'S','1.4.2':'A',
      '1.4.3':'A','1.4.4':'S','1.4.5':'A','2.1.1':'A','2.1.2':'A','2.1.3':'S',
      '2.1.4':'A','2.1.5':'A','2.2.1.1':'S','2.2.1.2':'S','2.2.1.3':'A',
      '2.2.1.4':'A','2.2.1.5':'S','2.2.2.1':'S','2.2.2.2':'A','2.2.3.1':'A',
      '2.2.3.2':'A','2.2.3.3':'S','2.2.3.4':'A','2.2.3.5':'A','2.2.4.1':'S',
      '2.2.4.2':'A','2.2.4.3':'S','2.2.4.4':'A','2.2.4.5':'A','2.4.1':'S',
      '2.4.2':'A','2.4.3':'A','3.1.1':'S','3.1.2':'A',
    },
    combinados:
      '02/04/26 — Visita excepcional com Dr. Ribeiro (cardio). Juliana conduz com segurança e aproveita as sondagens como ninguém — é a referência do distrito. Mantemos foco em elevar o ciclo de prescrição dos novos alvos. Próximo acompanhamento: 05/05.',
    tasks: [],
  },
  {
    id: 'mock-ev-5',
    rep_email: 'thiago.nakamura@arese.com.br',
    rep_name: 'Thiago Nakamura',
    leader_email: 'carla.souza@arese.com.br',
    leader_name: 'Carla Souza',
    sector: 'Setor 103',
    type: 'demanda',
    evaluation_date: '2026-03-25',
    status: 'completed',
    scores: {
      '1.1.1':'A','1.1.2':'N','1.1.3':'N','1.1.4':'A','1.2.1':'A','1.2.2':'N',
      '1.3.1':'A','1.3.2':'N','1.3.3':'A','1.3.4':'N','1.4.1':'A','1.4.2':'A',
      '1.4.3':'A','1.4.4':'A','1.4.5':'N','2.1.1':'N','2.1.2':'N','2.1.3':'A',
      '2.1.4':'A','2.1.5':'N','2.2.1.1':'A','2.2.1.2':'A','2.2.1.3':'A',
      '2.2.1.4':'A','2.2.1.5':'A','2.2.2.1':'N','2.2.2.2':'N','2.2.3.1':'A',
      '2.2.3.2':'A','2.2.3.3':'A','2.2.3.4':'A','2.2.3.5':'A','2.2.4.1':'N',
      '2.2.4.2':'A','2.2.4.3':'A','2.2.4.4':'N','2.2.4.5':'N','2.4.1':'A',
      '2.4.2':'A','2.4.3':'A','3.1.1':'A','3.1.2':'N',
    },
    combinados:
      '25/03/26 — Thiago é novo na Arese (3 meses). Temos plano de desenvolvimento estruturado até set/26. Foco imediato: domínio técnico, sondagem e fechamento do compromisso. Combinamos uma sessão de role-play quinzenal às sextas.',
    tasks: [],
  },
  {
    id: 'mock-ev-6',
    rep_email: 'beatriz.oliveira@arese.com.br',
    rep_name: 'Beatriz Oliveira',
    leader_email: 'carla.souza@arese.com.br',
    leader_name: 'Carla Souza',
    sector: 'Setor 115',
    type: 'pdv',
    evaluation_date: '2026-04-08',
    status: 'completed',
    scores: {
      '1.1.1':'A','1.2.1':'S',
      '2.1.1':'A','2.1.2':'A','2.1.3':'A','2.1.4':'S',
      '3.1.1':'S','3.1.2':'A',
      '4.1.1':'A','4.1.2':'A','4.1.3':'S',
      '5.1.1':'A','5.1.2':'S',
    },
    combinados:
      '08/04/26 — Beatriz domina a negociação comercial e está conquistando espaços em PDVs que antes eram quase exclusivamente da concorrência. Próximo passo: replicar a estratégia dos 3 melhores PDVs para os 5 seguintes do ranking.',
    tasks: [],
  },
];

// -------------------- DEMO STORE (localStorage) --------------------

function readStore() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStore(data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('[demoStore] Erro ao salvar', err);
  }
}

export const demoStore = {
  getEvaluations() {
    const userCreated = readStore();
    return [...MOCK_EVALUATIONS, ...userCreated];
  },

  filterEvaluations(filters = {}) {
    return this.getEvaluations().filter((ev) =>
      Object.entries(filters).every(([k, v]) => ev[k] === v)
    );
  },

  createEvaluation(data) {
    const userCreated = readStore();
    const newEv = {
      id: `user-ev-${Date.now()}`,
      status: 'completed',
      ...data,
    };
    userCreated.push(newEv);
    writeStore(userCreated);
    window.dispatchEvent(new CustomEvent('paac-evals-change'));
    return newEv;
  },

  updateEvaluation(id, patch) {
    const userCreated = readStore();
    const idx = userCreated.findIndex((ev) => ev.id === id);
    if (idx >= 0) {
      userCreated[idx] = { ...userCreated[idx], ...patch };
      writeStore(userCreated);
      window.dispatchEvent(new CustomEvent('paac-evals-change'));
      return userCreated[idx];
    }
    return null;
  },

  reset() {
    writeStore([]);
    window.dispatchEvent(new CustomEvent('paac-evals-change'));
  },

  // -------- ROLE (gestor vs colaborador) --------
  getRole() {
    if (typeof window === 'undefined') return 'colaborador';
    return localStorage.getItem(ROLE_KEY) || 'colaborador';
  },

  setRole(role) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ROLE_KEY, role);
    window.dispatchEvent(new CustomEvent('paac-role-change', { detail: role }));
  },

  getCurrentUser() {
    return this.getRole() === 'gestor' ? MOCK_LEADER_PROFILE : MOCK_REP_PROFILE;
  },

  getTeam() {
    return MOCK_TEAM;
  },

  // -------- AUTH (demo) --------
  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(AUTH_KEY) === '1';
  },

  login(email) {
    if (typeof window === 'undefined') return null;
    const normalized = (email || '').trim().toLowerCase();
    const role = DEMO_ACCOUNTS[normalized];
    if (!role) return null;
    localStorage.setItem(AUTH_KEY, '1');
    localStorage.setItem(ROLE_KEY, role);
    window.dispatchEvent(new CustomEvent('paac-role-change', { detail: role }));
    window.dispatchEvent(new CustomEvent('paac-auth-change', { detail: true }));
    return role;
  },

  logout() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_KEY);
    window.dispatchEvent(new CustomEvent('paac-auth-change', { detail: false }));
  },
};
