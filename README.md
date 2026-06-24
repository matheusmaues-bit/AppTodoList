# VM Task Core - Gerenciador de Tarefas Corporativo e de Alta Performance

> **Projeto Acadêmico de Gestão de Atividades de Alta Performance**  
> Desenvolvido com base em padrões de design modernos (Inspirado no Linear e no Google Stitch), contendo uma camada React + TypeScript de alta fidelidade e uma camada estática pura (HTML/CSS/JS) para máxima portabilidade.

---

## 📷 Screenshots do Projeto



---

## 🎓 Informações Acadêmicas

*   **Disciplina:** [Projeto de Interface Web - 2º Ano Técnico em Informática]
*   **Professor:** [Professor: Thiago Guimarães Tavares]
*   **Alunos:** 
    *  [vinicius bernardino lisita] 
    *   [Matheus Rafael de oliveira maues] 


---

## 🚀 Sobre o VM Task Core

O **VM Task Core** é uma plataforma minimalista de controle e monitoramento de tarefas diárias focada em produtividade. A aplicação foi estruturada em duas versões independentes que sincronizam dados entre si de forma transparente:

1.  **Versão React 19 + TypeScript (Live Preview):** Interface de altíssimo nível, modularizada, com animações fluidas via *Motion*, busca avançada, filtros dinâmicos por prioridade/categoria, controle de sub-tarefas integrado e gráficos SVG interativos de desempenho geral.
2.  **Versão Estática Pura (`/projeto-app`):** Versão portátil de alta fidelidade construída com HTML5 semântico, CSS3 personalizado (mobile-first) e lógica Vanilla JS pura, totalmente protegida para execução local (protocolo `file://`) via mecanismos de armazenamento resilientes.

---

## 🎨 Especificações de Identidade Visual

*   **Background Principal:** `#140445` (Midnight Blue - Reduz a fadiga visual durante longas sessões de trabalho)
*   **Containers e Cards:** `#452E5A` (Plum profundo elegante)
*   **Destaque e Ações Primárias:** `#FF653F` (Coral vibrante de alto contraste)
*   **Alertas e Atenção:** `#FFC85C` (Ouro vibrante)
*   **Tipografia:** 
    *   *Headings/Títulos:* `Hanken Grotesk` (Modernidade e solidez)
    *   *UI & Body:* `Inter` (Legibilidade excelente para informações densas)
    *   *Métricas & Badges:* `JetBrains Mono` (Precisão técnica)

---

## 🛠️ Tecnologias Utilizadas

*   **Frontend Moderno:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/)
*   **Biblioteca de Animação:** [Motion](https://motion.dev/) (antigo Framer Motion)
*   **Ícones:** [Lucide React](https://lucide.dev/)
*   **Camada Estática:** HTML5, CSS3, JavaScript Vanilla (ES6)
*   **Persistência:** Sincronização automatizada e segura via `LocalStorage` do Navegador

---

## 📦 Como Executar o Projeto

### 1. Executando a Versão React (Desenvolvimento)
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

```bash
# Instalar as dependências do projeto
npm install

# Iniciar o servidor de desenvolvimento local
npm run dev
```
O projeto estará disponível em `http://localhost:3000` (ou na porta configurada pelo console).

### 2. Executando a Versão Estática Pura
Você pode abrir a versão estática diretamente no seu navegador de preferência (como o **Opera GX**, Chrome, Firefox ou Edge):
1.  Navegue até a pasta `projeto-app`.
2.  Dê um duplo clique no arquivo `index.html`.
3.  Pronto! A aplicação funcionará localmente sem a necessidade de rodar nenhum servidor backend.

---

## 💾 Estrutura de Arquivos Entregue

```text
├── .env.example          # Exemplo de variáveis de ambiente
├── .gitignore            # Arquivos ignorados pelo Git
├── index.html            # Ponto de entrada do SPA React
├── metadata.json         # Metadados do Google AI Studio
├── package.json          # Manifest de dependências e scripts Node.js
├── tsconfig.json         # Configurações do TypeScript compiler
├── vite.config.ts        # Configurações do Vite bundler
│
├── img/                  # Pasta para armazenar os prints e wireframes (Ex: wireframe.png)
│   └── .gitkeep
│
├── src/                  # Código-fonte principal do app React
│   ├── App.tsx           # Componente principal / Orquestrador
│   ├── index.css         # Importações do Tailwind e temas globais
│   ├── main.tsx          # Inicializador do React
│   ├── types.ts          # Definições de tipos e dados mock padrão
│   ├── components/       # Componentes React (Card de Tarefa, Seção de Métricas)
│   └── pages/            # Páginas do SPA (Lista de Tarefas, Detalhes, Nova Tarefa, Categorias)
│
└── projeto-app/          # Camada Estática Pura requisitada
    ├── index.html        # Portal inicial estático
    ├── style.css         # Estilização completa mobile-first
    ├── script.js         # Lógica Vanilla JS com tratamento safeStorage
    └── pages/            # Telas da aplicação em HTML puro
        ├── lista-de-tarefas.html
        └── nova-tarefa.html
```

---

*VM Task Core © 2026. Desenvolvido para fins educacionais e corporativos.*
