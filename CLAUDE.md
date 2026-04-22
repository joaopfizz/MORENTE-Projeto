# CLAUDE.md — Guia do Projeto Base44 App

## O que é este projeto?

Este é um **aplicativo web de desenvolvimento de liderança** construído com React + Vite e integrado à plataforma **Base44**.

A ideia central é oferecer uma **academia online de cursos sobre liderança**, onde usuários se inscrevem em cursos, assistem aulas, realizam avaliações e acompanham seu progresso — tudo dentro de um painel moderno e responsivo.

---

## Para que serve cada página?

| Página | Finalidade |
|---|---|
| `Dashboard` | Visão geral do usuário: progresso, cursos em andamento, estatísticas |
| `Academy` | Catálogo de cursos organizados por pilares de liderança |
| `Course` | Conteúdo de um curso específico: aulas, quizzes, estudos de caso |
| `AssessmentPlayer` | Player interativo para responder avaliações |
| `Scanner` | Ferramenta de diagnóstico/avaliação de perfil |
| `Lidherar` | Módulo de liderança (funcionalidades específicas do produto) |
| `Athivar` | Módulo de ativação/desenvolvimento |
| `Evoluthion` | Módulo de acompanhamento de evolução/progresso |
| `AdminPanel` | Painel administrativo para gerenciar cursos, usuários e conteúdo |

### Os 7 Pilares de Liderança (Academy)
1. Liderança Inspiradora
2. Desenvolver Pessoas
3. Comunicação Assertiva
4. Capacidade Analítica
5. Planejamento Estratégico
6. Execução e Disciplina
7. Gestão de Resultados

---

## Stack Tecnológica

```
Frontend: React 18 + Vite 6
Estilo:   Tailwind CSS 3 + Radix UI (componentes acessíveis)
Rotas:    React Router v6
Estado:   TanStack React Query (dados do servidor)
Forms:    React Hook Form + Zod (validação)
Backend:  Base44 SDK (@base44/sdk) — BaaS integrado
```

### Bibliotecas notáveis
- **Framer Motion** — animações de UI
- **Recharts** — gráficos e visualização de dados
- **React Quill** — editor de texto rico
- **Leaflet** — mapas interativos
- **Three.js** — gráficos 3D
- **Stripe** — integração de pagamentos
- **@hello-pangea/dnd** — drag and drop

---

## Estrutura de Pastas

```
src/
├── pages/           # Uma pasta por tela do app
├── components/
│   ├── ui/          # Componentes base (Button, Card, Input…) via shadcn/ui
│   ├── admin/       # Abas do painel admin
│   ├── academy/     # Componentes da academia
│   ├── course/      # Componentes de curso
│   ├── layout/      # Wrapper de layout global
│   └── scanner/     # Resultados do scanner
├── api/             # Clientes de API (base44Client, etc.)
├── lib/             # Utilitários internos (AuthContext, QueryClient…)
├── hooks/           # Custom React hooks
├── utils/           # Funções helpers gerais
└── assets/          # Imagens e arquivos estáticos

base44/entities/     # Modelos de entidade do Base44 (schema de dados)
```

---

## Como rodar localmente

### Pré-requisitos
- Node.js v18 ou superior
- npm

### Passos

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev
# Acesse: http://localhost:5173
```

### Outros comandos úteis

```bash
npm run build       # Gera build de produção (pasta dist/)
npm run preview     # Visualiza o build de produção localmente
npm run lint        # Verifica problemas de código com ESLint
npm run lint:fix    # Corrige automaticamente problemas de lint
npm run typecheck   # Verifica tipos com TypeScript
```

---

## Variáveis de Ambiente

O projeto usa o Base44 como backend. Para conectar ao backend real, configure:

```
VITE_BASE44_APP_BASE_URL=<url do seu app Base44>
```

Sem essa variável, o proxy fica desabilitado (aviso no console ao iniciar) — útil para desenvolvimento com mocks.

---

## Autenticação

O app usa um `AuthContext` (`src/lib/AuthContext.jsx`) que gerencia:
- Verificação de login ao carregar
- Redirecionamento para login se não autenticado
- Erro de usuário não registrado

Todas as rotas passam pelo `AuthenticatedApp`, que protege o acesso.

---

## Fluxo típico de um usuário

1. Faz login (gerenciado pelo Base44)
2. Cai no **Dashboard** com resumo do progresso
3. Navega para a **Academy** e escolhe um curso por pilar
4. Assiste aulas na página de **Course**
5. Realiza avaliações no **AssessmentPlayer**
6. Acompanha evolução no **Evoluthion**

---

## Notas para Claude

- Componentes UI ficam em `src/components/ui/` — são baseados em shadcn/ui, não modifique sem necessidade
- Toda comunicação com o backend passa pelo `base44` client em `src/api/base44Client.js`
- A rota raiz `/` sempre aponta para o `Dashboard` (definido em `pages.config.js`)
- O layout global é aplicado em `src/Layout.jsx` e envolve todas as páginas
