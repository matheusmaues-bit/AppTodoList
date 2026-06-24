/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string; // ID of the category
  dueDate: string;  // YYYY-MM-DD
  createdAt: string; // ISO String
  subtasks: SubTask[];
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string; // Hex color code
  textColor: string; // For contrast
  iconName: string; // Lucide icon name
}

// Default initial categories
export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'trabalho',
    name: 'Trabalho',
    color: '#FF653F',
    textColor: '#ffffff',
    iconName: 'Briefcase'
  },
  {
    id: 'pessoal',
    name: 'Pessoal',
    color: '#CBADE2',
    textColor: '#27103b',
    iconName: 'User'
  },
  {
    id: 'estudos',
    name: 'Estudos',
    color: '#FFC85C',
    textColor: '#3c0700',
    iconName: 'BookOpen'
  },
  {
    id: 'saude',
    name: 'Saúde',
    color: '#5AD7E7',
    textColor: '#001f23',
    iconName: 'Heart'
  }
];

// Default initial tasks
export const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Finalizar design VM Task Core',
    description: 'Revisar paleta de cores corporativa, tipografia Hanken Grotesk e responsividade móvel baseada no Google Stitch.',
    completed: true,
    priority: 'high',
    category: 'trabalho',
    dueDate: '2026-06-25',
    createdAt: '2026-06-24T08:00:00.000Z',
    subtasks: [
      { id: 'sub-1-1', title: 'Definir paleta de cores no Tailwind v4', completed: true },
      { id: 'sub-1-2', title: 'Garantir adaptabilidade mobile-first', completed: true }
    ],
    notes: 'Inspirado no visual minimalista do Linear. Ficou excelente!'
  },
  {
    id: 'task-2',
    title: 'Implementar lógica de persistência e sub-tarefas',
    description: 'Utilizar LocalStorage para salvar as tarefas criadas pelo usuário e sincronizar com o estado global.',
    completed: false,
    priority: 'high',
    category: 'trabalho',
    dueDate: '2026-06-26',
    createdAt: '2026-06-24T08:15:00.000Z',
    subtasks: [
      { id: 'sub-2-1', title: 'Escrever utilitários de LocalStorage', completed: true },
      { id: 'sub-2-2', title: 'Criar ações para adicionar, marcar e remover sub-tarefas', completed: false },
      { id: 'sub-2-3', title: 'Validar formulários na criação de novas tarefas', completed: false }
    ],
    notes: 'Lógica deve ser isolada e modular para evitar re-renderizações infinitas.'
  },
  {
    id: 'task-3',
    title: 'Consultar materiais de estudo de Design de Interação',
    description: 'Estudar micro-interações do Motion, transições de tela fluidas e feedback tátil simulado.',
    completed: false,
    priority: 'medium',
    category: 'estudos',
    dueDate: '2026-06-28',
    createdAt: '2026-06-24T08:20:00.000Z',
    subtasks: [
      { id: 'sub-3-1', title: 'Assistir a vídeos de transições de UI corporativas', completed: false },
      { id: 'sub-3-2', title: 'Aplicar motion.div para navegação entre telas', completed: false }
    ],
    notes: 'Focar em transições suaves ao mudar de aba.'
  },
  {
    id: 'task-4',
    title: 'Treino de corrida de 5km',
    description: 'Manter rotina saudável de aeróbico ao ar livre.',
    completed: false,
    priority: 'low',
    category: 'saude',
    dueDate: '2026-06-24',
    createdAt: '2026-06-24T08:25:00.000Z',
    subtasks: [],
    notes: 'Hidratar-se bem antes do treino.'
  }
];
