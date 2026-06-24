/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckSquare, 
  TrendingUp, 
  Tag, 
  Layers, 
  HelpCircle, 
  ListTodo, 
  AlertCircle, 
  Laptop, 
  Clock, 
  User, 
  Award,
  BookOpen
} from 'lucide-react';
import { Task, Category, DEFAULT_CATEGORIES, DEFAULT_TASKS } from './types';

// Importing page components
import TaskListPage from './pages/TaskListPage';
import NewTaskPage from './pages/NewTaskPage';
import TaskDetailPage from './pages/TaskDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import StatsSection from './components/StatsSection';

type ActiveTab = 'list' | 'stats' | 'categories';
type ActivePage = 'list' | 'create' | 'detail';

export default function App() {
  // --- Persistent State Hooks ---
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem('vm_tasks');
      return stored ? JSON.parse(stored) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const stored = localStorage.getItem('vm_categories');
      return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  // Navigation states
  const [activeTab, setActiveTab] = useState<ActiveTab>('list');
  const [activePage, setActivePage] = useState<ActivePage>('list');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Sync to local storage when tasks or categories update
  useEffect(() => {
    localStorage.setItem('vm_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('vm_categories', JSON.stringify(categories));
  }, [categories]);

  // --- Handlers ---
  
  // Toggle complete state of a task
  const handleToggleComplete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Avoid opening detail page when checking task
    
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, completed: !t.completed };
      }
      return t;
    }));

    // If the active viewed task in detail page was checked, update reference
    if (selectedTask && selectedTask.id === id) {
      setSelectedTask(prev => prev ? { ...prev, completed: !prev.completed } : null);
    }
  };

  // Open detailed view for a single task
  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setActivePage('detail');
  };

  // Save new task
  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      completed: false
    };

    setTasks(prev => [newTask, ...prev]);
    setActivePage('list');
  };

  // Update an existing task (e.g. subtask toggling, editing notes)
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setSelectedTask(updatedTask);
  };

  // Delete a task
  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setSelectedTask(null);
    setActivePage('list');
  };

  // Add new category
  const handleCreateCategory = (newCat: Category) => {
    setCategories(prev => [...prev, newCat]);
  };

  // Delete custom category
  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    // Tasks attached to this category are reassigned to 'pessoal' or remain with invalid key which is gracefully ignored or fallback in card
    setTasks(prev => prev.map(t => t.category === id ? { ...t, category: 'pessoal' } : t));
  };

  // Returns count of active tasks for navigation badges
  const activeCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col md:flex-row font-sans selection:bg-brand-primary/30 selection:text-white">
      
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex flex-col w-64 bg-brand-bg-deep border-r border-brand-surface p-5 shrink-0 justify-between">
        <div className="space-y-6">
          {/* Logo Brand Panel */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded bg-brand-primary flex items-center justify-center text-white shadow-md shadow-brand-primary/20">
              <CheckSquare size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-sm font-bold font-display tracking-tight text-brand-text">
                VM Task Core
              </h1>
              <span className="text-[10px] font-mono text-brand-text-secondary tracking-wider block">
                COMMAND & CONTROL
              </span>
            </div>
          </div>

          {/* Navigation Menus */}
          <nav className="space-y-1.5 pt-4">
            <span className="text-[9px] font-mono font-semibold text-brand-text-secondary/60 tracking-widest uppercase block px-2.5 mb-2">
              Navegação
            </span>
            
            <button
              id="sidebar-tab-list"
              onClick={() => {
                setActiveTab('list');
                setActivePage('list');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-brand-surface text-brand-text border border-brand-surface-light/30'
                  : 'text-brand-text-secondary hover:text-brand-text hover:bg-brand-surface/20'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckSquare size={16} />
                <span>Minhas Tarefas</span>
              </div>
              {activeCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-primary text-white">
                  {activeCount}
                </span>
              )}
            </button>

            <button
              id="sidebar-tab-stats"
              onClick={() => {
                setActiveTab('stats');
                setActivePage('list'); // Return back to core template list of tab
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-brand-surface text-brand-text border border-brand-surface-light/30'
                  : 'text-brand-text-secondary hover:text-brand-text hover:bg-brand-surface/20'
              }`}
            >
              <TrendingUp size={16} />
              <span>Desempenho</span>
            </button>

            <button
              id="sidebar-tab-categories"
              onClick={() => {
                setActiveTab('categories');
                setActivePage('list');
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-brand-surface text-brand-text border border-brand-surface-light/30'
                  : 'text-brand-text-secondary hover:text-brand-text hover:bg-brand-surface/20'
              }`}
            >
              <Tag size={16} />
              <span>Categorias</span>
            </button>
          </nav>
        </div>

        {/* User Workspace Info (Bottom Sidebar) */}
        <div className="p-3 bg-brand-surface/10 border border-brand-surface/40 rounded-xl space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-brand-surface flex items-center justify-center text-[10px] font-bold text-brand-primary">
              VM
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-brand-text truncate">Mauro Acmaúes</p>
              <span className="text-[9px] font-mono text-brand-text-secondary/80">workspace-prod</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MOBILE HEADER ================= */}
      <header className="md:hidden flex items-center justify-between bg-brand-bg-deep border-b border-brand-surface px-4 py-3.5 shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7.5 h-7.5 rounded bg-brand-primary flex items-center justify-center text-white">
            <CheckSquare size={16} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xs font-bold font-display tracking-tight text-brand-text leading-tight">
              VM Task Core
            </h1>
            <span className="text-[8px] font-mono text-brand-text-secondary/70 tracking-wider block">
              MOBILE CONSOLE
            </span>
          </div>
        </div>

        {activeCount > 0 && (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-brand-primary text-white">
            {activeCount} pendentes
          </span>
        )}
      </header>

      {/* ================= MAIN CONTENT SPACE ================= */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <AnimatePresence mode="wait">
          {/* Main List & Secondary page Router */}
          {activeTab === 'list' && (
            <div key="list-container">
              {activePage === 'list' && (
                <TaskListPage
                  tasks={tasks}
                  categories={categories}
                  onToggleComplete={handleToggleComplete}
                  onSelectTask={handleSelectTask}
                  onNavigateToCreate={() => setActivePage('create')}
                />
              )}

              {activePage === 'create' && (
                <NewTaskPage
                  categories={categories}
                  onCreateTask={handleCreateTask}
                  onCancel={() => setActivePage('list')}
                />
              )}

              {activePage === 'detail' && selectedTask && (
                <TaskDetailPage
                  task={selectedTask}
                  category={categories.find(c => c.id === selectedTask.category)}
                  onBack={() => {
                    setSelectedTask(null);
                    setActivePage('list');
                  }}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                />
              )}
            </div>
          )}

          {/* Stats Page */}
          {activeTab === 'stats' && (
            <motion.div
              key="stats-container"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold font-display tracking-tight text-brand-text">
                  Estatísticas de Desempenho
                </h2>
                <p className="text-sm text-brand-text-secondary mt-1 font-mono">
                  Métricas de produtividade e rendimento de tarefas.
                </p>
              </div>

              <StatsSection tasks={tasks} categories={categories} />
            </motion.div>
          )}

          {/* Categories Page */}
          {activeTab === 'categories' && (
            <motion.div
              key="categories-container"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold font-display tracking-tight text-brand-text">
                  Suas Categorias
                </h2>
                <p className="text-sm text-brand-text-secondary mt-1 font-mono">
                  Organize suas atividades corporativas em coleções customizadas.
                </p>
              </div>

              <CategoriesPage
                categories={categories}
                tasks={tasks}
                onCreateCategory={handleCreateCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ================= MOBILE BOTTOM BAR ================= */}
      <footer className="md:hidden flex items-center justify-around bg-brand-bg-deep border-t border-brand-surface py-2 sticky bottom-0 z-40 shrink-0">
        <button
          id="mobile-tab-list"
          onClick={() => {
            setActiveTab('list');
            setActivePage('list');
          }}
          className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'list' ? 'text-brand-primary' : 'text-brand-text-secondary hover:text-brand-text'
          }`}
        >
          <CheckSquare size={18} />
          <span className="text-[9px] font-semibold">Tarefas</span>
        </button>

        <button
          id="mobile-tab-stats"
          onClick={() => {
            setActiveTab('stats');
            setActivePage('list');
          }}
          className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'stats' ? 'text-brand-primary' : 'text-brand-text-secondary hover:text-brand-text'
          }`}
        >
          <TrendingUp size={18} />
          <span className="text-[9px] font-semibold">Desempenho</span>
        </button>

        <button
          id="mobile-tab-categories"
          onClick={() => {
            setActiveTab('categories');
            setActivePage('list');
          }}
          className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'categories' ? 'text-brand-primary' : 'text-brand-text-secondary hover:text-brand-text'
          }`}
        >
          <Tag size={18} />
          <span className="text-[9px] font-semibold">Categorias</span>
        </button>
      </footer>

    </div>
  );
}
