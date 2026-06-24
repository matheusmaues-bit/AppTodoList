/**
 * VM Task Core - Script de Funcionalidade Vanilla JS
 * Mantém sincronia via LocalStorage e gerencia a interatividade do front-end estático.
 */

// Inicialização de Dados Padrão (Sincronizado com o App React principal)
const DEFAULT_CATEGORIES = [
  { id: 'trabalho', name: 'Trabalho', color: '#FF653F', iconName: 'Briefcase' },
  { id: 'pessoal', name: 'Pessoal', color: '#CBADE2', iconName: 'User' },
  { id: 'estudos', name: 'Estudos', color: '#FFC85C', iconName: 'BookOpen' },
  { id: 'saude', name: 'Saúde', color: '#5AD7E7', iconName: 'Heart' }
];

const DEFAULT_TASKS = [
  {
    id: 'task-1',
    title: 'Finalizar design VM Task Core',
    description: 'Revisar paleta de cores corporativa, tipografia Hanken Grotesk e responsividade móvel.',
    completed: true,
    priority: 'high',
    category: 'trabalho',
    dueDate: '2026-06-25',
    createdAt: new Date().toISOString(),
    subtasks: []
  },
  {
    id: 'task-2',
    title: 'Implementar lógica de persistência e sub-tarefas',
    description: 'Utilizar LocalStorage para salvar as tarefas criadas pelo usuário e sincronizar com o estado global.',
    completed: false,
    priority: 'high',
    category: 'trabalho',
    dueDate: '2026-06-26',
    createdAt: new Date().toISOString(),
    subtasks: []
  }
];

// Helper seguro para acesso ao LocalStorage (evita quebrar em modo de arquivo local file://)
const safeStorage = {
  memory: {},
  getItem(key) {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
    } catch (e) {
      console.warn("LocalStorage bloqueado ou indisponível. Usando memória temporária.", e);
    }
    return this.memory[key] || null;
  },
  setItem(key, value) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      console.warn("LocalStorage bloqueado ou indisponível para gravação. Usando memória temporária.", e);
    }
    this.memory[key] = value;
  }
};

// Helper para gerenciar o Estado de Dados localmente
class TaskCoreStorage {
  static getTasks() {
    try {
      const stored = safeStorage.getItem('vm_tasks');
      return stored ? JSON.parse(stored) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  }

  static saveTasks(tasks) {
    try {
      safeStorage.setItem('vm_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error("Falha ao salvar tarefas:", e);
    }
  }

  static getCategories() {
    try {
      const stored = safeStorage.getItem('vm_categories');
      return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  }

  static saveCategories(cats) {
    try {
      safeStorage.setItem('vm_categories', JSON.stringify(cats));
    } catch (e) {
      console.error("Falha ao salvar categorias:", e);
    }
  }
}

// Inicializar Dados ao carregar
document.addEventListener('DOMContentLoaded', () => {
  // Garantir existência de dados básicos no LocalStorage ou memória
  if (!safeStorage.getItem('vm_tasks')) {
    TaskCoreStorage.saveTasks(DEFAULT_TASKS);
  }
  if (!safeStorage.getItem('vm_categories')) {
    TaskCoreStorage.saveCategories(DEFAULT_CATEGORIES);
  }

  // Chamar função de inicialização específica da página ativa
  initActivePage();
});

function initActivePage() {
  const path = window.location.pathname;
  
  if (path.includes('lista-de-tarefas') || document.getElementById('tasks-container')) {
    initTaskListPage();
  } else if (path.includes('nova-tarefa') || document.getElementById('new-task-form')) {
    initNewTaskPage();
  }
}

// Lógica para a Página de Lista de Tarefas
function initTaskListPage() {
  const container = document.getElementById('tasks-container');
  if (!container) return;

  const tasks = TaskCoreStorage.getTasks();
  const categories = TaskCoreStorage.getCategories();

  if (tasks.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 48px; border: 1px dashed var(--color-surface); border-radius: var(--rounded-xl);">
        <p style="color: var(--color-text-secondary); font-size: 14px;">Nenhuma tarefa encontrada. Crie sua primeira tarefa!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = ''; // Limpar antes de renderizar

  tasks.forEach(task => {
    const cat = categories.find(c => c.id === task.category) || { name: 'Sem Categoria', color: '#b0a7c1' };
    const card = document.createElement('div');
    card.className = 'task-card';
    card.id = `task-card-${task.id}`;

    card.innerHTML = `
      <div class="task-main">
        <button class="checkbox-btn ${task.completed ? 'checked' : ''}" onclick="toggleTaskStatus('${task.id}', event)"></button>
        <div class="task-details-header">
          <h3 class="task-title ${task.completed ? 'completed' : ''}">${task.title}</h3>
          <p class="task-desc">${task.description || 'Sem descrição.'}</p>
        </div>
      </div>
      <div class="task-badges">
        <span class="chip" style="color: ${cat.color}; border-color: ${cat.color}30; background: ${cat.color}10">
          ● ${cat.name}
        </span>
        <span class="chip chip-priority-${task.priority}">
          ${task.priority.toUpperCase()}
        </span>
        ${task.dueDate ? `<span class="chip">📅 ${task.dueDate}</span>` : ''}
      </div>
    `;

    // Navegar para detalhes ao clicar no card (excluindo botão checkbox)
    card.addEventListener('click', (e) => {
      if (e.target.className.includes('checkbox-btn')) return;
      alert(`Visualizando tarefa:\n\nTítulo: ${task.title}\nDescrição: ${task.description || '-'}\nPrioridade: ${task.priority.toUpperCase()}`);
    });

    container.appendChild(card);
  });

  updatePendingBadgeCount(tasks);
}

// Lógica para a Página de Criação de Novas Tarefas
function initNewTaskPage() {
  const form = document.getElementById('new-task-form');
  if (!form) return;

  // Carregar e preencher select de categorias
  const categorySelect = document.getElementById('category-select');
  if (categorySelect) {
    const categories = TaskCoreStorage.getCategories();
    categorySelect.innerHTML = categories.map(cat => 
      `<option value="${cat.id}">${cat.name}</option>`
    ).join('');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const titleInput = document.getElementById('title-input');
    const descInput = document.getElementById('desc-input');
    const prioritySelect = document.getElementById('priority-select');
    const categorySelect = document.getElementById('category-select');
    const dateInput = document.getElementById('date-input');

    if (!titleInput.value.trim()) {
      alert('Por favor, preencha o título da tarefa.');
      return;
    }

    const newTask = {
      id: `task-${Date.now()}`,
      title: titleInput.value.trim(),
      description: descInput ? descInput.value.trim() : '',
      completed: false,
      priority: prioritySelect ? prioritySelect.value : 'medium',
      category: categorySelect ? categorySelect.value : 'pessoal',
      dueDate: dateInput ? dateInput.value : '',
      createdAt: new Date().toISOString(),
      subtasks: []
    };

    const tasks = TaskCoreStorage.getTasks();
    tasks.unshift(newTask);
    TaskCoreStorage.saveTasks(tasks);

    alert('Tarefa criada com sucesso!');
    window.location.href = './lista-de-tarefas.html';
  });
}

// Ações Globais Interativas
window.toggleTaskStatus = function(id, event) {
  if (event) event.stopPropagation();

  const tasks = TaskCoreStorage.getTasks();
  const updated = tasks.map(t => {
    if (t.id === id) {
      t.completed = !t.completed;
    }
    return t;
  });

  TaskCoreStorage.saveTasks(updated);
  initTaskListPage(); // Atualizar listagem ativa na tela
};

function updatePendingBadgeCount(tasks) {
  const activeCount = tasks.filter(t => !t.completed).length;
  const badges = document.querySelectorAll('.badge');
  badges.forEach(badge => {
    badge.textContent = activeCount;
    badge.style.display = activeCount > 0 ? 'inline-block' : 'none';
  });
}
