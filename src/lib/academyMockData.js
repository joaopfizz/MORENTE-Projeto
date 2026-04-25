// ============================================================
// Cursos, módulos, aulas, quizzes e relatórios (mock)
// Progresso do colaborador persiste em localStorage
// ============================================================

const PROGRESS_KEY = 'academy_progress_v1';
const REPORTS_KEY = 'academy_reports_v1';

// -------------------- CURSOS --------------------

export const MOCK_COURSES = [
  {
    id: 'curso-concorrencia',
    title: 'Conhecendo a Concorrência',
    subtitle: 'Como mapear, analisar e agir sobre os diferenciais dos competidores no seu território.',
    pillar: 'pillar_4',
    pillar_label: 'Análise e Estratégia',
    cover_color: 'from-rose-600 to-rose-800',
    duration_min: 42,
    level: 'Intermediário',
    instructor: 'Ricardo Aleixo',
    instructor_role: 'Diretor Comercial · Arese',
    // Associa ao PAAC — ao completar, fecha a task N do critério 1.1.3
    related_paac_key: '1.1.3',
    description:
      'Neste curso você vai desenvolver a capacidade de analisar a concorrência de forma sistemática — identificando pontos fortes e fracos, diferenciais percebidos pelo médico e oportunidades de posicionamento. A cada módulo, um exemplo prático do nosso portfólio cardio.',
    modules: [
      {
        id: 'm1',
        title: 'Módulo 1 — Fundamentos',
        lessons: [
          {
            id: 'l1-1',
            type: 'video',
            title: 'Por que conhecer a concorrência é inegociável',
            duration_min: 6,
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description:
              'Abertura do curso. Como o representante que conhece os competidores ganha 3x mais respeito nas visitas médicas.',
          },
          {
            id: 'l1-2',
            type: 'text',
            title: 'Leitura — O mapa do terreno',
            duration_min: 5,
            content: `# O mapa do terreno

Antes de sair para o campo, o representante experiente **já tem o mapa da concorrência na cabeça**. Ele sabe quem são os 3 principais competidores de cada molécula do portfólio, qual o posicionamento que eles usam e quais são os pontos vulneráveis.

## Os três níveis de análise

1. **Produto** — mecanismo de ação, posologia, preço, apresentação
2. **Estratégia comercial** — bônus, parcelamento, amostragem, VR oferecido
3. **Relacionamento** — frequência de visita, material promocional, treinamento de balconistas

## Onde buscar informação

- Portal Arese > Análise Competitiva (atualizada semanalmente)
- Conversa direta com o balconista do PDV
- Observação do material do concorrente no consultório
- Perguntas abertas ao médico: "tem usado mais o X ou o Y?"

> **Regra de ouro:** nunca fale mal do concorrente na frente do médico. Apresente os seus diferenciais.`,
          },
          {
            id: 'l1-3',
            type: 'video',
            title: 'Estudo de caso — Enalapril vs Losartana',
            duration_min: 9,
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description:
              'Como a Juliana Ferraz (setor 091) reposicionou a Losartana após mapear as 4 objeções mais comuns da concorrência.',
          },
        ],
      },
      {
        id: 'm2',
        title: 'Módulo 2 — Aplicação em Campo',
        lessons: [
          {
            id: 'l2-1',
            type: 'video',
            title: 'Como fazer a pergunta certa ao médico',
            duration_min: 7,
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description:
              'A arte da sondagem. Três scripts para descobrir o que o médico está prescrevendo sem parecer invasivo.',
          },
          {
            id: 'l2-2',
            type: 'text',
            title: 'Leitura — Construindo seu quadro competitivo',
            duration_min: 6,
            content: `# Construindo seu quadro competitivo

Um exercício prático: pegue seus **10 médicos alvo principais** e preencha, para cada um:

| Campo | Como descobrir |
|-------|----------------|
| Produto mais prescrito hoje | Sondagem + observação receita |
| Razão da preferência | Pergunta aberta |
| Objeção ao nosso produto | Feedback direto |
| Gatilho de troca | Quando ele trocaria de marca? |

## Exemplo prático

**Dra. Patricia Almeida** — hoje prescreve Captopril da concorrência. Motivo: hábito de 15 anos. Objeção ao nosso: "não vejo diferença". Gatilho: se tivéssemos uma apresentação combinada 1x dia (dose única) com preço competitivo.

Com esse mapa, o plano de visita muda completamente. Em vez de falar de produto genérico, você fala diretamente do que move a prescrição daquele médico.`,
          },
          {
            id: 'l2-3',
            type: 'video',
            title: 'Como lidar com objeções baseadas em concorrência',
            duration_min: 8,
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description:
              'As 5 objeções mais comuns ("já prescrevo", "paciente adaptado", "preço mais caro"…) e como responder sem atacar o concorrente.',
          },
        ],
      },
    ],
    quiz: {
      title: 'Quiz final — Conhecendo a Concorrência',
      passing_score: 60,
      questions: [
        {
          id: 'q1',
          question: 'Qual é a regra de ouro ao falar de um produto concorrente na frente do médico?',
          options: [
            { id: 'a', text: 'Apontar sempre as fraquezas do concorrente com dados' },
            { id: 'b', text: 'Nunca falar mal do concorrente — apresentar nossos diferenciais' },
            { id: 'c', text: 'Ignorar a concorrência e focar apenas em nossos produtos' },
            { id: 'd', text: 'Comparar preço a preço para mostrar vantagem' },
          ],
          correct: 'b',
          explanation:
            'Desqualificar o concorrente mina sua credibilidade. O médico quer ouvir por que seu produto é a melhor escolha, não por que o outro é ruim.',
        },
        {
          id: 'q2',
          question:
            'Quais os TRÊS níveis de análise da concorrência apresentados no Módulo 1?',
          options: [
            { id: 'a', text: 'Produto, Estratégia comercial e Relacionamento' },
            { id: 'b', text: 'Preço, Marca e Distribuição' },
            { id: 'c', text: 'Visitação, Amostragem e Material promocional' },
            { id: 'd', text: 'Mecanismo, Indicação e Posologia' },
          ],
          correct: 'a',
          explanation:
            'Produto (o que é), Estratégia comercial (como é vendido) e Relacionamento (como é comunicado) — essa é a tríade completa.',
        },
        {
          id: 'q3',
          question: 'No caso da Dra. Patricia Almeida, qual foi o gatilho identificado para troca de marca?',
          options: [
            { id: 'a', text: 'Preço mais baixo' },
            { id: 'b', text: 'Dose única (1x ao dia) com preço competitivo' },
            { id: 'c', text: 'Maior volume de amostras' },
            { id: 'd', text: 'Treinamento da equipe' },
          ],
          correct: 'b',
          explanation:
            'Hábito é uma barreira forte. O gatilho de troca surge quando o concorrente oferece algo objetivamente diferente — nesse caso, dose única a preço competitivo.',
        },
        {
          id: 'q4',
          question: 'Qual é a melhor fonte para atualizar semanalmente o mapa competitivo do seu setor?',
          options: [
            { id: 'a', text: 'Redes sociais dos concorrentes' },
            { id: 'b', text: 'Portal Arese — Análise Competitiva' },
            { id: 'c', text: 'Grupos de WhatsApp do setor' },
            { id: 'd', text: 'Congressos médicos anuais' },
          ],
          correct: 'b',
          explanation:
            'O Portal consolida dados de prescrição, campanhas e lançamentos da concorrência. É seu ponto de partida toda segunda-feira.',
        },
        {
          id: 'q5',
          question: 'Uma boa sondagem ao médico para descobrir o que está prescrevendo deve ser:',
          options: [
            { id: 'a', text: 'Direta e fechada: "Você prescreve o X?"' },
            { id: 'b', text: 'Aberta e observacional: "Tem usado mais o X ou o Y ultimamente?"' },
            { id: 'c', text: 'Por escrito, em formulário' },
            { id: 'd', text: 'Via balconista do PDV' },
          ],
          correct: 'b',
          explanation:
            'Perguntas abertas convidam ao compartilhamento sem criar defensividade. O médico responde naturalmente e você ainda capta pistas sobre o raciocínio dele.',
        },
      ],
    },
  },

  // ============ Curso 2 — mais curto, sem PAAC ============
  {
    id: 'curso-historico',
    title: 'Histórico e "Falado pelo Médico"',
    subtitle: 'Como usar o histórico de cada médico para construir relacionamentos duradouros.',
    pillar: 'pillar_2',
    pillar_label: 'Desenvolver Pessoas',
    cover_color: 'from-sky-600 to-sky-800',
    duration_min: 28,
    level: 'Iniciante',
    instructor: 'Fernanda Guerra',
    instructor_role: 'Gerente Nacional de Treinamento',
    related_paac_key: '2.1.2',
    description:
      'O "Falado pelo Médico" é o seu caderno secreto. Neste curso você aprende a extrair, registrar e resgatar as informações que transformam visitas genéricas em conversas pessoais.',
    modules: [
      {
        id: 'm1',
        title: 'Módulo único',
        lessons: [
          {
            id: 'l1',
            type: 'video',
            title: 'A importância do Falado pelo Médico',
            duration_min: 10,
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Por que médicos que se sentem lembrados prescrevem até 40% mais.',
          },
          {
            id: 'l2',
            type: 'text',
            title: 'Como registrar no Portal em tempo real',
            duration_min: 6,
            content: `# Registro em tempo real

Registrar depois da visita parece econômico de tempo, mas custa detalhes. Nos primeiros 5 minutos após sair do consultório, você ainda lembra:

- Tom da voz quando falou do paciente X
- O que ele **não** disse (silêncios importam)
- O material que estava na mesa dele
- Comentário sobre a família, time de futebol, viagem…

Um bom registro tem 3 camadas:
1. **Clínico** — que produto usou, em qual paciente, resultado
2. **Comercial** — interesse, sinais de compra, objeções
3. **Pessoal** — algo que aproxima humanamente`,
          },
          {
            id: 'l3',
            type: 'video',
            title: 'Resgatando o histórico antes da próxima visita',
            duration_min: 8,
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Como transformar 30s de pré-visita numa entrada memorável.',
          },
        ],
      },
    ],
    quiz: {
      title: 'Quiz final — Histórico',
      passing_score: 60,
      questions: [
        {
          id: 'q1',
          question: 'Qual o melhor momento para registrar o "Falado pelo Médico"?',
          options: [
            { id: 'a', text: 'No fim do dia, com calma' },
            { id: 'b', text: 'Durante a visita, tomando notas visíveis' },
            { id: 'c', text: 'Nos primeiros 5 minutos após sair do consultório' },
            { id: 'd', text: 'Na manhã seguinte, ao planejar o dia' },
          ],
          correct: 'c',
          explanation:
            'Quanto mais próximo da visita, mais detalhes você captura — especialmente os não-verbais e pessoais.',
        },
        {
          id: 'q2',
          question: 'Quais são as TRÊS camadas de um bom registro de Falado pelo Médico?',
          options: [
            { id: 'a', text: 'Produto, Preço, Concorrência' },
            { id: 'b', text: 'Clínico, Comercial, Pessoal' },
            { id: 'c', text: 'Sondagem, Objeção, Fechamento' },
            { id: 'd', text: 'Visita, PDV, Portal' },
          ],
          correct: 'b',
          explanation:
            'Clínico (contexto terapêutico), Comercial (oportunidade) e Pessoal (humanização) — os três juntos criam relacionamento real.',
        },
        {
          id: 'q3',
          question: 'Segundo o curso, médicos que se sentem lembrados podem prescrever até quanto a mais?',
          options: [
            { id: 'a', text: '10%' },
            { id: 'b', text: '20%' },
            { id: 'c', text: '30%' },
            { id: 'd', text: '40%' },
          ],
          correct: 'd',
          explanation:
            '40%. Memória relacional é um diferencial competitivo enorme — e praticamente gratuito.',
        },
      ],
    },
  },
];

// -------------------- PROGRESSO (localStorage) --------------------

function readProgress() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeProgress(data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
}

function readReports() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeReports(data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REPORTS_KEY, JSON.stringify(data));
}

export const academyStore = {
  getCourses() {
    return MOCK_COURSES;
  },

  getCourse(id) {
    return MOCK_COURSES.find((c) => c.id === id);
  },

  // Lesson progress: { [userEmail]: { [courseId]: { completedLessons: [], quizScore, quizAnswers, reportSubmittedAt } } }
  getCourseProgress(userEmail, courseId) {
    const all = readProgress();
    return all[userEmail]?.[courseId] || {
      completedLessons: [],
      quizScore: null,
      quizAnswers: {},
      reportSubmittedAt: null,
    };
  },

  markLessonComplete(userEmail, courseId, lessonId) {
    const all = readProgress();
    all[userEmail] = all[userEmail] || {};
    all[userEmail][courseId] = all[userEmail][courseId] || {
      completedLessons: [],
      quizScore: null,
      quizAnswers: {},
      reportSubmittedAt: null,
    };
    const completed = new Set(all[userEmail][courseId].completedLessons);
    completed.add(lessonId);
    all[userEmail][courseId].completedLessons = Array.from(completed);
    writeProgress(all);
    window.dispatchEvent(new CustomEvent('academy-progress-change'));
  },

  saveQuiz(userEmail, courseId, answers, score) {
    const all = readProgress();
    all[userEmail] = all[userEmail] || {};
    all[userEmail][courseId] = all[userEmail][courseId] || {
      completedLessons: [],
      quizScore: null,
      quizAnswers: {},
      reportSubmittedAt: null,
    };
    all[userEmail][courseId].quizAnswers = answers;
    all[userEmail][courseId].quizScore = score;
    writeProgress(all);
    window.dispatchEvent(new CustomEvent('academy-progress-change'));
  },

  submitReport(userEmail, courseId, reportText) {
    // Guarda o texto do relatório (separado pra não inchar progress)
    const reports = readReports();
    reports[userEmail] = reports[userEmail] || {};
    reports[userEmail][courseId] = {
      text: reportText,
      submittedAt: new Date().toISOString(),
    };
    writeReports(reports);

    // Marca timestamp em progress também
    const all = readProgress();
    all[userEmail] = all[userEmail] || {};
    all[userEmail][courseId] = all[userEmail][courseId] || {
      completedLessons: [],
      quizScore: null,
      quizAnswers: {},
      reportSubmittedAt: null,
    };
    all[userEmail][courseId].reportSubmittedAt = new Date().toISOString();
    writeProgress(all);
    window.dispatchEvent(new CustomEvent('academy-progress-change'));
  },

  getReport(userEmail, courseId) {
    const reports = readReports();
    return reports[userEmail]?.[courseId] || null;
  },

  // Helpers para UI
  getCoursePercent(userEmail, course) {
    const progress = this.getCourseProgress(userEmail, course.id);
    const totalLessons = course.modules.flatMap((m) => m.lessons).length;
    const done = progress.completedLessons.length;
    // Relatório vale 1 unidade extra
    const totalSteps = totalLessons + 1;
    const completedSteps = done + (progress.reportSubmittedAt ? 1 : 0);
    return Math.round((completedSteps / totalSteps) * 100);
  },

  isCourseCompleted(userEmail, course) {
    const progress = this.getCourseProgress(userEmail, course.id);
    const totalLessons = course.modules.flatMap((m) => m.lessons).length;
    return (
      progress.completedLessons.length >= totalLessons &&
      progress.reportSubmittedAt !== null
    );
  },
};
