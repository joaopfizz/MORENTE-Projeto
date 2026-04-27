// ============================================================
// Athivar — Desafios coletivos com feed social
// ============================================================
// Modelo:
//   Challenge: gestor lança um desafio, time inteiro reporta ações
//   Post: cada reporte (situação/objetivo/resultado + foto) num desafio
//         passa por aprovação do gestor antes de publicar no feed
// ============================================================

import { MOCK_TEAM, MOCK_LEADER_PROFILE } from './paacMockData';

const CHALLENGES_KEY = 'athivar_challenges_v2';
const POSTS_KEY = 'athivar_posts_v2';

// -------------------- helpers de data --------------------

const today = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString();
};

// -------------------- SEED --------------------

export const INITIAL_CHALLENGES = [
  {
    id: 'ch-1',
    title: 'Abordagem comercial — Aplicar SPIN no ciclo Catapres',
    description:
      'Aplique a metodologia de abordagem comercial treinada na convenção (SPIN) em pelo menos uma visita esta semana e poste o resultado. Foco no Catapres 0,150mg.',
    created_by: MOCK_LEADER_PROFILE.email,
    created_by_name: MOCK_LEADER_PROFILE.full_name,
    created_at: today(-6),
    deadline: today(7),
    status: 'active',
    metric_label: 'caixas vendidas',
    metric_unit: 'cx',
    participants: MOCK_TEAM.map((r) => r.email),
    cover_emoji: '🎯',
  },
  {
    id: 'ch-2',
    title: 'Estoque saudável — Selozok 50mg nos PDVs Top-20',
    description:
      'Aumente o estoque de Selozok 50mg nos PDVs categoria A do seu setor. Reporte cada negociação com situação inicial, objetivo e resultado.',
    created_by: MOCK_LEADER_PROFILE.email,
    created_by_name: MOCK_LEADER_PROFILE.full_name,
    created_at: today(-3),
    deadline: today(14),
    status: 'active',
    metric_label: 'unidades em estoque',
    metric_unit: 'un',
    participants: MOCK_TEAM.map((r) => r.email),
    cover_emoji: '📦',
  },
];

const placeholder = (seed) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/500`;

export const INITIAL_POSTS = [
  {
    id: 'p-1',
    challenge_id: 'ch-1',
    author_email: 'juliana.ferraz@arese.com.br',
    author_name: 'Juliana Ferraz',
    author_team: 'Setor 091 - Sorocaba/SP',
    situacao:
      'Dr. Ribeiro estava prescrevendo concorrente alegando que o paciente não tolerava bem a posologia atual.',
    objetivo:
      'Apresentar o Catapres 0,150 como alternativa de meia-vida estendida e fechar 5 caixas iniciais.',
    resultado:
      'Após sondagem com SPIN, o doutor entendeu o ganho posológico e fechou compromisso. Resultado: 8 caixas geradas via 2 farmácias parceiras.',
    result_value: 8,
    image_url: placeholder('catapres-juliana'),
    status: 'published',
    created_at: today(-4),
    approved_at: today(-4),
    approved_by: MOCK_LEADER_PROFILE.email,
    feedback: '',
    likes: ['carla.souza@arese.com.br', 'beatriz.oliveira@arese.com.br', 'rafael.mendes@arese.com.br'],
    comments: [
      {
        author_email: MOCK_LEADER_PROFILE.email,
        author_name: 'Carla Souza',
        text: 'Excelente uso de SPIN, Ju! Compartilha esse roteiro com a equipe na próxima reunião.',
        created_at: today(-3),
      },
      {
        author_email: 'beatriz.oliveira@arese.com.br',
        author_name: 'Beatriz Oliveira',
        text: 'Juliana é fenomenal. 👏',
        created_at: today(-3),
      },
    ],
  },
  {
    id: 'p-2',
    challenge_id: 'ch-1',
    author_email: 'beatriz.oliveira@arese.com.br',
    author_name: 'Beatriz Oliveira',
    author_team: 'Setor 115 - S. José dos Campos/SP',
    situacao:
      'Visita ao Dr. Henrique. Paciente com hipertensão resistente, ele estava cético com a troca.',
    objetivo: 'Aplicar S-P-I-N e gerar 4 caixas de Catapres 0,150.',
    resultado:
      'Sondei muito bem na fase de Implicação. O doutor pediu literatura. Voltei na quinta com material e fechou 6 caixas.',
    result_value: 6,
    image_url: placeholder('catapres-beatriz'),
    status: 'published',
    created_at: today(-2),
    approved_at: today(-2),
    approved_by: MOCK_LEADER_PROFILE.email,
    feedback: '',
    likes: ['carla.souza@arese.com.br', 'juliana.ferraz@arese.com.br'],
    comments: [
      {
        author_email: 'juliana.ferraz@arese.com.br',
        author_name: 'Juliana Ferraz',
        text: 'A volta com material foi a chave! 💡',
        created_at: today(-2),
      },
    ],
  },
  {
    id: 'p-3',
    challenge_id: 'ch-2',
    author_email: 'rafael.mendes@arese.com.br',
    author_name: 'Rafael Mendes',
    author_team: 'Setor 087 - Campinas/SP',
    situacao:
      'Drogasil shopping Iguatemi. Estoque de Selozok 50 estava em 8 unidades, frequente ruptura aos finais de semana.',
    objetivo: 'Levar para 18 unidades, garantindo cobertura mensal.',
    resultado:
      'Negociei com a balconista responsável pelo pedido, mostrei histórico de saída. Pedido entrou em 20 unidades. +12 unidades no PDV.',
    result_value: 12,
    image_url: placeholder('selozok-rafael'),
    status: 'published',
    created_at: today(-1),
    approved_at: today(-1),
    approved_by: MOCK_LEADER_PROFILE.email,
    feedback: '',
    likes: ['carla.souza@arese.com.br'],
    comments: [],
  },
  {
    id: 'p-4',
    challenge_id: 'ch-1',
    author_email: 'rafael.mendes@arese.com.br',
    author_name: 'Rafael Mendes',
    author_team: 'Setor 087 - Campinas/SP',
    situacao:
      'Visita Dra. Patricia (cardiologia). Já era prescritora ocasional, focada em outro setor.',
    objetivo: 'Reposicionar Catapres como 1ª linha em pacientes refratários.',
    resultado:
      'Apresentei caso clínico real do ciclo. Ela aceitou testar com 3 pacientes do dia.',
    result_value: 3,
    image_url: '',
    status: 'pending_approval',
    created_at: today(0),
    approved_at: null,
    approved_by: null,
    feedback: '',
    likes: [],
    comments: [],
  },
];

// -------------------- helpers de localStorage --------------------

function read(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key, data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('[athivarStore] erro ao salvar', err);
  }
}

function notify() {
  window.dispatchEvent(new CustomEvent('athivar-change'));
}

function loadChallenges() {
  const stored = read(CHALLENGES_KEY, null);
  if (Array.isArray(stored) && stored.length) return stored;
  return [...INITIAL_CHALLENGES];
}
function loadPosts() {
  const stored = read(POSTS_KEY, null);
  if (Array.isArray(stored) && stored.length) return stored;
  return [...INITIAL_POSTS];
}

let challenges = loadChallenges();
let posts = loadPosts();

function save() {
  write(CHALLENGES_KEY, challenges);
  write(POSTS_KEY, posts);
}

// -------------------- store --------------------

export const athivarStore = {
  // -------- CHALLENGES --------
  getChallenges() {
    return [...challenges].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  },

  getChallenge(id) {
    return challenges.find((c) => c.id === id) || null;
  },

  createChallenge({
    title,
    description,
    deadline,
    metric_label,
    metric_unit,
    participants,
    cover_emoji,
  }) {
    const newCh = {
      id: `ch-${Date.now()}`,
      title,
      description: description || '',
      created_by: MOCK_LEADER_PROFILE.email,
      created_by_name: MOCK_LEADER_PROFILE.full_name,
      created_at: today(0),
      deadline: deadline || today(14),
      status: 'active',
      metric_label: metric_label || '',
      metric_unit: metric_unit || '',
      participants:
        Array.isArray(participants) && participants.length
          ? participants
          : MOCK_TEAM.map((r) => r.email),
      cover_emoji: cover_emoji || '🚀',
    };
    challenges = [newCh, ...challenges];
    save();
    notify();
    return newCh;
  },

  closeChallenge(id) {
    const idx = challenges.findIndex((c) => c.id === id);
    if (idx >= 0) {
      challenges[idx] = { ...challenges[idx], status: 'closed' };
      save();
      notify();
    }
  },

  // -------- POSTS --------
  getPostsByChallenge(challengeId, { onlyPublished = false } = {}) {
    return posts
      .filter((p) => p.challenge_id === challengeId)
      .filter((p) => (onlyPublished ? p.status === 'published' : true))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  getPostsByAuthor(email) {
    return posts
      .filter((p) => p.author_email === email)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  getPendingPosts() {
    return posts
      .filter((p) => p.status === 'pending_approval')
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  },

  submitPost(challengeId, { author_email, situacao, objetivo, resultado, result_value, image_url }) {
    const author =
      MOCK_TEAM.find((r) => r.email === author_email) ||
      (MOCK_LEADER_PROFILE.email === author_email ? MOCK_LEADER_PROFILE : null);
    const newPost = {
      id: `p-${Date.now()}`,
      challenge_id: challengeId,
      author_email,
      author_name: author?.full_name || author_email,
      author_team: author?.team || '',
      situacao: situacao || '',
      objetivo: objetivo || '',
      resultado: resultado || '',
      result_value:
        result_value === '' || result_value == null ? null : Number(result_value),
      image_url: image_url || '',
      status: 'pending_approval',
      created_at: today(0),
      approved_at: null,
      approved_by: null,
      feedback: '',
      likes: [],
      comments: [],
    };
    posts = [newPost, ...posts];
    save();
    notify();
    return newPost;
  },

  approvePost(postId) {
    const idx = posts.findIndex((p) => p.id === postId);
    if (idx < 0) return null;
    posts[idx] = {
      ...posts[idx],
      status: 'published',
      approved_at: today(0),
      approved_by: MOCK_LEADER_PROFILE.email,
      feedback: '',
    };
    save();
    notify();
    return posts[idx];
  },

  requestPostRework(postId, feedback) {
    const idx = posts.findIndex((p) => p.id === postId);
    if (idx < 0) return null;
    posts[idx] = {
      ...posts[idx],
      status: 'needs_rework',
      feedback: feedback || 'Faltam mais detalhes — revise e reenvie.',
    };
    save();
    notify();
    return posts[idx];
  },

  resubmitPost(postId, patch) {
    const idx = posts.findIndex((p) => p.id === postId);
    if (idx < 0) return null;
    posts[idx] = {
      ...posts[idx],
      ...patch,
      status: 'pending_approval',
      feedback: '',
    };
    save();
    notify();
    return posts[idx];
  },

  toggleLike(postId, email) {
    const idx = posts.findIndex((p) => p.id === postId);
    if (idx < 0) return;
    const has = posts[idx].likes.includes(email);
    posts[idx] = {
      ...posts[idx],
      likes: has
        ? posts[idx].likes.filter((e) => e !== email)
        : [...posts[idx].likes, email],
    };
    save();
    notify();
  },

  addComment(postId, { author_email, author_name, text }) {
    const idx = posts.findIndex((p) => p.id === postId);
    if (idx < 0) return;
    posts[idx] = {
      ...posts[idx],
      comments: [
        ...posts[idx].comments,
        { author_email, author_name, text, created_at: today(0) },
      ],
    };
    save();
    notify();
  },

  // -------- métricas --------
  getChallengeMetrics(challengeId) {
    const published = posts.filter(
      (p) => p.challenge_id === challengeId && p.status === 'published'
    );
    const sumValue = published.reduce(
      (acc, p) => acc + (Number(p.result_value) || 0),
      0
    );
    const uniqueAuthors = new Set(published.map((p) => p.author_email));
    return {
      posts_count: published.length,
      sum_value: sumValue,
      participants_count: uniqueAuthors.size,
    };
  },

  // -------- reset (debug) --------
  reset() {
    challenges = [...INITIAL_CHALLENGES];
    posts = [...INITIAL_POSTS];
    save();
    notify();
  },
};
