# VM Task Core - Centro de Comando de Tarefas

Este projeto é um gerenciador de tarefas móvel corporativo, focado em alta performance, minimalismo e organização eficiente de atividades diárias baseado na metodologia OKR e metodologias ágeis de gestão.

## 🚀 Estrutura de Pastas Entregue

Conforme solicitado pelas diretrizes e gerado fielmente a partir do Google Stitch, o projeto está estruturado em duas camadas complementares:

### 1. Camada React de Alta Performance (Live Preview)
Para garantir uma experiência de desenvolvimento moderna com carregamento instantâneo, animações de transição suaves e controle de estado dinâmico, criamos a versão principal em **React 19 + TypeScript + Tailwind CSS v4 + Motion**:
*   `/src/App.tsx`: Orquestrador de visualização e estados do SPA.
*   `/src/types.ts`: Modelos de dados fortemente tipados e registros iniciais.
*   `/src/components/TaskCard.tsx`: Card interativo individual com checkbox animado, contadores e flags de prioridade.
*   `/src/components/StatsSection.tsx`: Seção visual de análise com gráficos SVG customizados de rendimento geral e categorias.
*   `/src/pages/TaskListPage.tsx`: Painel interativo completo com buscas, filtros de prioridade, categorias e ordenação.
*   `/src/pages/NewTaskPage.tsx`: Formulário completo com adicionador de sub-tarefas integrado e tratamento de erros.
*   `/src/pages/TaskDetailPage.tsx`: Visão profunda da tarefa contendo checklists de sub-tarefas em tempo real, edição de notas rápidas e exclusão protegida.

### 2. Camada Estática Pura (`/projeto-app`)
Para respeitar de forma absoluta a estrutura solicitada no prompt para ambientes que requerem arquivos estáticos legíveis puros (HTML5, CSS3 e JavaScript puro):
*   `/projeto-app/index.html`: Portal inicial de boas-vindas com design corporativo escuro.
*   `/projeto-app/style.css`: Folha de estilos unificada utilizando variáveis CSS modernas e flexbox/grid responsivos com foco mobile-first.
*   `/projeto-app/script.js`: Controlador dinâmico em Vanilla JS com sincronia via `LocalStorage` e ações para as páginas.
*   `/projeto-app/pages/lista-de-tarefas.html`: Painel HTML semântico com busca e renderização dinâmica dos cartões de tarefa.
*   `/projeto-app/pages/nova-tarefa.html`: Formulário de criação de tarefas integrado com a lógica estática.

---

## 🎨 Paleta de Cores & Design (VM Task Core Specs)

*   **Background (Fundo Principal):** `#140445` (Midnight Blue - Reduz fadiga visual)
*   **Surfaces (Containers e Cards):** `#452E5A` (Plum profundo)
*   **Primary Accent (Ações e Destaques):** `#FF653F` (Coral vibrante)
*   **Attention (Prioridades e Alertas):** `#FFC85C` (Ouro vibrante)
*   **Tipografia:** 
    *   *Headings:* `Hanken Grotesk` (Modernidade e rigidez)
    *   *UI & Body:* `Inter` (Altamente legível para dados densos)
    *   *Metadata & Badges:* `JetBrains Mono` (Precisão técnica)

---

## 💾 Persistência de Dados

Ambas as versões compartilham a chave de armazenamento `vm_tasks` e `vm_categories` no `LocalStorage` do navegador, permitindo que as tarefas criadas em uma interface sejam carregadas na outra de forma transparente e durável.
