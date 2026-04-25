# CLAUDE.md — Guia do Projeto Morente Academy

## O que é este projeto?

App web de **desenvolvimento de liderança** para representantes de propaganda médica da **Arese (linha cardio)**. O app implementa a metodologia interna **PAAC** (Planilha ARESE de Acompanhamento de Campo) num produto digital com gamificação.

Construído com **React 18 + Vite 6**, integrado opcionalmente ao **Base44 SDK** como backend. O app **roda inteiramente em modo demo** quando o backend não está conectado — todos os dados ficam em `localStorage` via mock stores.

---

## A Jornada (fluxo principal)

```
1. Scanner   →  Gestor faz a PAAC com o representante em campo (avaliação N/A/S por critério)
                Cada critério N gera uma "task combinada"

2. Lidherar  →  Hub do gestor: revisa fichas das PAACs do time, navega entre reps,
                escreve combinados, vê histórico

3. Academy   →  Colaborador estuda cursos vinculados aos critérios PAAC para se preparar

4. Athivar   →  Tasks PAAC viram "missões candidatas". O gestor ATIVA → vira missão
                gamificada. O colaborador executa → reporta → gestor valida → ganha pontos.
                Tem leaderboard com pódio (competição saudável do distrito).

5. Evoluthion → Painel consolidado de evolução: tasks feitas, performance PAAC, cursos,
                ações de melhoria (timeline) e review escrito do gestor.
```

---

## Páginas

| Página | Finalidade |
|---|---|
| `Dashboard` | Visão geral do usuário (placeholder, ainda não migrado pro modo demo) |
| `Scanner` | Aplica a PAAC (Demanda ou PDV). Dialog 2-step: tipo → formulário. **Só gestor** acessa. Cada critério marcado N/A vira task combinada. |
| `Lidherar` | Hub do gestor com fichas das PAACs. Navegação por **carrossel** entre reps (setas + arrows do teclado). |
| `Academy` | Catálogo de cursos por pilar. Card → abre player. |
| `Course` | Player tipo Alura: vídeo (YouTube embed) ou texto (markdown), sidebar com módulos, quiz com feedback colorido, **relatório final escrito pelo colaborador**. |
| `Athivar` | **Motor de missões com gamificação**. Pódio do distrito + leaderboard. Gestor: ativa candidatas, valida relatos, cria missões manuais. Colaborador: reporta conclusões, vê seu rank. |
| `Evoluthion` | Performance do time. Gestor: grid de 5 cards do time, painel detalhado por rep com editor de review. Colaborador: seu painel pessoal com review do gestor (read-only). |
| `AdminPanel` | Painel admin (não migrado pro modo demo) |
| `AssessmentPlayer` | Player de avaliações antigas (não usado no fluxo principal) |

### Os 7 Pilares de Liderança
1. Liderança Inspiradora · 2. Desenvolver Pessoas · 3. Comunicação Assertiva · 4. Capacidade Analítica · 5. Planejamento Estratégico · 6. Execução e Disciplina · 7. Gestão de Resultados

---

## Modo Demo: Como Funciona

O app tem **dois perfis simulados** que o usuário alterna pelo `RoleSwitcher` na sidebar:

- **Gestor** = `Carla Souza` (carla.souza@arese.com.br) — Gerente Distrital, vê o time todo
- **Colaborador** = `Rafael Mendes` (rafael.mendes@arese.com.br) — Representante do setor 087

Ao trocar o role, todo o app se adapta: nome no perfil, conteúdo das páginas, permissões, fichas visíveis, etc. As páginas escutam o evento `paac-role-change` para reagir.

### Time mockado (5 reps + 1 gestora)
1. Rafael Mendes — Setor 087 (Campinas/SP)
2. Juliana Ferraz — Setor 091 (Sorocaba/SP) — **top performer**
3. Thiago Nakamura — Setor 103 (Ribeirão Preto/SP) — **novo na empresa**
4. Beatriz Oliveira — Setor 115 (S. José dos Campos/SP) — forte em PDV
5. Eduardo Castilho — Setor 122 (Piracicaba/SP) — onboarding

---

## Mock Stores (`src/lib/`)

Cada store tem **dados iniciais hardcoded + persistência em localStorage** + dispara **eventos customizados** para sync em tempo real entre componentes.

### `paacMockData.js` — Avaliações PAAC + Roles

| API | O que faz |
|---|---|
| `MOCK_TEAM`, `MOCK_REP_PROFILE`, `MOCK_LEADER_PROFILE` | Perfis fixos |
| `MOCK_EVALUATIONS` | PAACs iniciais (Rafael tem 3, outros 1 cada, Eduardo nenhuma) |
| `demoStore.getEvaluations()` | Mock + user-created merged |
| `demoStore.createEvaluation(data)` | Salva nova PAAC no localStorage |
| `demoStore.getRole()` / `setRole(role)` | Toggle gestor ↔ colaborador |
| `demoStore.getCurrentUser()` | Retorna leader ou rep conforme role |
| **localStorage** | `paac_demo_store_v1`, `paac_demo_role_v1` |
| **eventos** | `paac-role-change`, `paac-evals-change` |

### `paacConfig.js` — Estrutura PAAC
- `PAAC_DEMANDA` e `PAAC_PDV` — árvore de seções → subseções → critérios
- `SCORE_LABEL` (`{N: 'Não atende', A: 'Atende', S: 'Supera'}`)
- `generateTasks(scores, config)` — extrai critérios N/A para virarem tasks

### `academyMockData.js` — Cursos

| API | O que faz |
|---|---|
| `MOCK_COURSES` | 2 cursos demo: `curso-concorrencia` (linkado ao critério `1.1.3`), `curso-historico` (linkado ao `2.1.2`) |
| `academyStore.getCourse(id)` | Curso por id |
| `academyStore.markLessonComplete(email, courseId, lessonId)` | Marca aula como concluída |
| `academyStore.saveQuiz(email, courseId, answers, score)` | Salva quiz |
| `academyStore.submitReport(email, courseId, text)` | Salva relatório final |
| `academyStore.getCoursePercent`, `isCourseCompleted` | Progresso |
| **localStorage** | `academy_progress_v1`, `academy_reports_v1` |
| **eventos** | `academy-progress-change` |

Cada curso tem: `modules[].lessons[]` (`type: 'video' | 'text'`), `quiz.questions[]` (multiple choice + explicação), `related_paac_key` (link com PAAC).

### `athivarMockData.js` — Missões + Gamificação

| API | O que faz |
|---|---|
| `INITIAL_MISSIONS` | ~13 missões iniciais distribuídas pelos 5 reps em vários estados |
| `DIFFICULTY` | `easy` (50pts), `medium` (100pts), `hard` (200pts) |
| `ON_TIME_BONUS` | `0.2` — entregar antes do prazo dá +20% |
| `athivarStore.getCandidateMissions()` | Tasks PAAC pendente/em-andamento sem missão associada |
| `athivarStore.activateMission(candidate, config)` | Gestor ativa candidata |
| `athivarStore.createManualMission(config)` | Gestor cria missão do zero |
| `athivarStore.submitReport(missionId, text, evidence)` | Colaborador reporta |
| `athivarStore.approveMission(missionId, feedback)` | Gestor aprova → calcula pontos com bônus |
| `athivarStore.requestRework(missionId, feedback)` | Gestor pede ajuste |
| `athivarStore.getLeaderboard()` | Ranking ordenado com tie-handling |
| `athivarStore.getUserPoints(email)`, `getUserRank(email)` | Stats individuais |
| **localStorage** | `athivar_missions_v1` |
| **eventos** | `athivar-change` |

Status de missão: `active` → `pending_validation` → `completed` (ou `needs_rework` que volta para `pending_validation`).

### `evolutionMockData.js` — Performance + Reviews

| API | O que faz |
|---|---|
| `INITIAL_IMPROVEMENTS`, `INITIAL_REVIEWS` | Dados iniciais (review da Carla pra cada rep) |
| `evolutionStore.getRepSummary(rep)` | Agrega tasks (PAAC) + scores S/A/N + cursos (Academy) + improvements + review |
| `evolutionStore.getTeamSummary()` | Todos os reps |
| `evolutionStore.saveReview(email, review)` | Persiste edição do gestor |
| `evolutionStore.addImprovement(email, action)` | Adiciona melhoria (chamado pelo Athivar quando aprova missão) |
| **localStorage** | `evolution_improvements_v1`, `evolution_reviews_v1` |
| **eventos** | `evolution-change` |

**Categorias de improvement**: `curso`, `campo`, `mentoria`, `certificado`.

---

## Integração entre as páginas

```
Scanner (PAAC criada)
   ↓ paac-evals-change
Lidherar (mostra a nova ficha) ← navegação por reps com setas/teclado
   ↓
Athivar (tasks N viram candidatas automáticas)
   ↓ ativa(candidate, config)
   missão active → colaborador reporta → pending_validation
   ↓ approveMission()
   completed + pts → athivarStore.approveMission também chama
                     evolutionStore.addImprovement (na UI do Athivar.jsx)
   ↓ evolution-change
Evoluthion (improvement aparece na timeline + review do gestor)
```

Reviews escritos no Evoluthion ficam em `evolution_reviews_v1`. Pontos do Athivar consolidam no leaderboard. Tudo reativo via custom events.

---

## Stack Tecnológica

```
Frontend:  React 18 + Vite 6
Estilo:    Tailwind CSS 3 (paleta custom: ink/gold/paper)
UI:        Radix UI + shadcn/ui (Dialog, Button, Textarea, Input…)
Animação:  Framer Motion (AnimatePresence, layoutId, custom variants)
Rotas:     React Router v6 (useSearchParams para Course?id=…)
Backend:   Base44 SDK (@base44/sdk) — opcional, app roda 100% em mock
Charts:    Recharts (Evoluthion antigo usava radar/nine-box)
Ícones:    lucide-react
```

### Paleta custom (Tailwind)
- `ink-*` — escuros (ink-900 = preto principal, ink-grid = padrão de fundo)
- `gold-*` — dourados (acentos, gold-shine = gradient gold)
- `paper-*` — fundos claros (paper-50 = off-white)

---

## Estrutura de Pastas

```
src/
├── pages/                  # Uma tela por arquivo
│   ├── Scanner.jsx         # PAAC dialog flow (gestor only)
│   ├── Lidherar.jsx        # Hub de fichas com carrossel de reps
│   ├── Academy.jsx         # Catálogo de cursos (mock)
│   ├── Course.jsx          # Player Alura-like
│   ├── Athivar.jsx         # Missões + leaderboard pódio
│   ├── Evoluthion.jsx      # Performance team/individual + review editor
│   ├── Dashboard.jsx, AdminPanel.jsx, AssessmentPlayer.jsx, Home.jsx
│   └── ...
├── components/
│   ├── ui/                 # shadcn/ui base (button, dialog, textarea, …)
│   ├── layout/AppLayout.jsx # Sidebar + RoleSwitcher + perfil dinâmico
│   ├── academy/, admin/, course/, scanner/
├── lib/                    # ★ Mock stores e helpers
│   ├── paacMockData.js     # Avaliações + roles (★ mais importante)
│   ├── paacConfig.js       # Estrutura dos critérios PAAC
│   ├── academyMockData.js  # Cursos
│   ├── athivarMockData.js  # Missões + leaderboard
│   ├── evolutionMockData.js # Performance + reviews
│   ├── AuthContext.jsx, NavigationTracker.jsx, …
├── api/base44Client.js     # Cliente Base44 (não usado em modo demo)
├── hooks/, utils/, assets/
```

---

## Eventos customizados (cross-component sync)

Disparados via `window.dispatchEvent(new CustomEvent(...))` e ouvidos via `window.addEventListener(...)`:

| Evento | Quando dispara | Quem ouve |
|---|---|---|
| `paac-role-change` | `demoStore.setRole()` | AppLayout (perfil), todas as páginas role-aware |
| `paac-evals-change` | `demoStore.createEvaluation/update` | Lidherar, Athivar, Evoluthion |
| `academy-progress-change` | qualquer mutação do `academyStore` | Academy, Course, Evoluthion |
| `athivar-change` | qualquer mutação do `athivarStore` | Athivar, Evoluthion |
| `evolution-change` | `evolutionStore.saveReview/addImprovement` | Evoluthion |

Padrão: cada página tem `useEffect` registrando listeners e força re-render via `setTick(t => t+1)`.

---

## Como rodar localmente

```bash
# 1. Instalar (uma vez)
cd C:\Users\pichau\Documents\Projetos
npm install

# 2. Subir o dev server
npm run dev
# Abre em http://localhost:5173
```

```bash
npm run build       # Build de produção (dist/)
npm run preview     # Preview do build
npm run lint        # ESLint
```

### Verificar erros sem rodar o servidor
```bash
npx vite build --logLevel error
```

---

## Variáveis de Ambiente

```
VITE_BASE44_APP_BASE_URL=<opcional — backend real>
```

Sem essa variável, o app **roda 100% em modo demo** com os mock stores. É o fluxo principal de desenvolvimento atual.

---

## Convenções importantes

### Identificação visual de role
- **Gestor**: ícone `ShieldCheck` ou `Crown`, ações com bg-ink-900 + texto gold-200
- **Colaborador**: ícone `User`, ações em gold-shine ou amber

### Cores de status (consistente cross-page)
- `active` / `em_andamento` → **amber**
- `pending_validation` → **violet**
- `completed` / `concluido` → **emerald**
- `needs_rework` / `pendente` → **rose**
- `S` (Supera) → **emerald**
- `A` (Atende) → **sky**
- `N` (Não atende) → **rose**

### Pontuação Athivar
- Easy 50 / Medium 100 / Hard 200
- Bônus +20% se aprovado dentro do prazo (`approved_at <= deadline`)

### Padrões de página
- **Hero** com `bg-ink-grid` e chip "Etapa N · Nome"
- Stats de KPI em grid de cards no canto direito do hero
- `SectionHeader` com eyebrow gold-700 + título font-display

---

## Notas para Claude

- **Sempre prefira editar o mock store** ao invés de adicionar novos backends. O modo demo é o caminho principal.
- Quando criar nova feature: defina o **store em `src/lib/`** primeiro, depois a página. Use `localStorage` + custom event para sync.
- Quando adicionar novo evento de sync: registre na tabela acima e em **todas** as páginas que dependem dele.
- Componentes UI base ficam em `src/components/ui/` (shadcn) — não modifique esses, prefira compor.
- Roteamento usa `createPageUrl(name)` de `@/utils` — sempre use isso, não strings hardcoded.
- Para diálogos com layout custom, use `DialogPrimitive.Content` direto (ver Scanner.jsx) — `DialogContent` padrão tem espaçamento default.
- Animações de troca de página/role: `motion.div` keyed em `${pathname}-${role}` com `AnimatePresence mode="wait"`.
- Carrosséis com direção: estado `direction` + `custom` prop nos variants do Framer Motion.

---

## Histórico de evolução do projeto

1. **v0** — Estrutura base com Base44, páginas placeholder
2. **Demo mode** — paacMockData + role switcher + Lidherar com mock data
3. **Scanner refactor** — Dialog 2-step + persistência local + role-gated
4. **Lidherar carrossel** — navegação entre reps (setas + keyboard)
5. **Academy + Course player** — catálogo mock + player Alura-like com quiz e relatório
6. **Evoluthion v2** — visão consolidada team/individual com editor de review
7. **Athivar v2** — sistema completo de missões com gamificação, leaderboard pódio, integração com PAAC e Evoluthion (atual)
