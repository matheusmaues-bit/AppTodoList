/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, Plus, HelpCircle, CheckSquare, Clock, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, Category } from '../types';
import TaskCard from '../components/TaskCard';

interface TaskListPageProps {
  tasks: Task[];
  categories: Category[];
  onToggleComplete: (id: string, e: React.MouseEvent) => void;
  onSelectTask: (task: Task) => void;
  onNavigateToCreate: () => void;
}

type SortOption = 'dueDate' | 'priority' | 'createdAt';
type StatusFilter = 'active' | 'completed' | 'all';

export default function TaskListPage({
  tasks,
  categories,
  onToggleComplete,
  onSelectTask,
  onNavigateToCreate
}: TaskListPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');

  // Priority weight map for sorting
  const priorityWeight = {
    high: 3,
    medium: 2,
    low: 1
  };

  // Filter & sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter(task => {
        // Search query filter
        const matchesSearch = 
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.notes && task.notes.toLowerCase().includes(searchQuery.toLowerCase()));

        // Status filter
        const matchesStatus = 
          statusFilter === 'all' ||
          (statusFilter === 'active' && !task.completed) ||
          (statusFilter === 'completed' && task.completed);

        // Priority filter
        const matchesPriority = 
          selectedPriority === 'all' || 
          task.priority === selectedPriority;

        // Category filter
        const matchesCategory = 
          selectedCategory === 'all' || 
          task.category === selectedCategory;

        return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        
        if (sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        
        // Default sort by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [tasks, searchQuery, statusFilter, selectedPriority, selectedCategory, sortBy]);

  // Count active tasks for quick view
  const activeTasksCount = useMemo(() => {
    return tasks.filter(t => !t.completed).length;
  }, [tasks]);

  return (
    <div id="task-list-page" className="space-y-6">
      {/* Header section with Stats Summary & CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display tracking-tight text-brand-text">
            Suas Tarefas
          </h2>
          <p className="text-sm text-brand-text-secondary mt-1 font-mono">
            {activeTasksCount === 0 
              ? 'Todas as tarefas concluídas. Excelente trabalho!' 
              : `Você tem ${activeTasksCount} tarefa${activeTasksCount === 1 ? '' : 's'} pendente${activeTasksCount === 1 ? '' : 's'}.`
            }
          </p>
        </div>

        <button
          id="btn-add-task-header"
          onClick={onNavigateToCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white font-semibold text-sm rounded-lg hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/10 active:scale-95 cursor-pointer self-start md:self-auto"
        >
          <Plus size={18} />
          Nova Tarefa
        </button>
      </div>

      {/* Search and Filters Controls */}
      <div className="p-4 bg-brand-surface/10 border border-brand-surface rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-brand-text-secondary/60 w-5 h-5" />
            <input
              id="task-search-input"
              type="text"
              placeholder="Buscar tarefas pelo título ou notas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-bg-deep border border-brand-surface hover:border-brand-surface-light focus:border-brand-primary rounded-lg pl-10 pr-4 py-2 text-sm text-brand-text placeholder-brand-text-secondary/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Quick Status Buttons */}
          <div className="flex bg-brand-bg-deep p-1 rounded-lg border border-brand-surface self-start md:self-auto shrink-0">
            <button
              id="filter-status-all"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
                statusFilter === 'all'
                  ? 'bg-brand-surface text-brand-text'
                  : 'text-brand-text-secondary hover:text-brand-text'
              }`}
            >
              Todas
            </button>
            <button
              id="filter-status-active"
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
                statusFilter === 'active'
                  ? 'bg-brand-surface text-brand-text'
                  : 'text-brand-text-secondary hover:text-brand-text'
              }`}
            >
              Ativas
            </button>
            <button
              id="filter-status-completed"
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
                statusFilter === 'completed'
                  ? 'bg-brand-surface text-brand-text'
                  : 'text-brand-text-secondary hover:text-brand-text'
              }`}
            >
              Concluídas
            </button>
          </div>
        </div>

        {/* Dropdown Filters & Sorting row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-brand-surface/30">
          <div className="flex flex-wrap items-center gap-3">
            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-brand-text-secondary">Prioridade:</span>
              <select
                id="select-filter-priority"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="bg-brand-bg-deep border border-brand-surface text-xs text-brand-text rounded px-2.5 py-1 focus:outline-none focus:border-brand-primary cursor-pointer font-mono"
              >
                <option value="all">Todas</option>
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-brand-text-secondary">Categoria:</span>
              <select
                id="select-filter-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-brand-bg-deep border border-brand-surface text-xs text-brand-text rounded px-2.5 py-1 focus:outline-none focus:border-brand-primary cursor-pointer font-mono"
              >
                <option value="all">Todas</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sorter */}
          <div className="flex items-center gap-2">
            <ArrowUpDown size={14} className="text-brand-text-secondary" />
            <span className="text-xs font-mono text-brand-text-secondary">Ordenar por:</span>
            <select
              id="select-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-brand-bg-deep border border-brand-surface text-xs text-brand-text rounded px-2.5 py-1 focus:outline-none focus:border-brand-primary cursor-pointer font-mono"
            >
              <option value="dueDate">Prazo (Mais próximo)</option>
              <option value="priority">Prioridade (Mais alta)</option>
              <option value="createdAt">Recentes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List Render */}
      <div className="space-y-3 min-h-[300px]">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedTasks.map((task) => {
            const category = categories.find(c => c.id === task.category);
            return (
              <TaskCard
                key={task.id}
                task={task}
                category={category}
                onToggleComplete={onToggleComplete}
                onSelect={onSelectTask}
              />
            );
          })}
        </AnimatePresence>

        {/* Empty State */}
        {filteredAndSortedTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-brand-surface rounded-xl bg-brand-surface/5"
          >
            <div className="w-12 h-12 rounded-full bg-brand-surface/30 flex items-center justify-center mb-4 text-brand-primary">
              <Search size={24} />
            </div>
            <h3 className="text-lg font-bold text-brand-text font-display">
              Nenhuma tarefa encontrada
            </h3>
            <p className="text-sm text-brand-text-secondary max-w-sm mt-1">
              {searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all' || statusFilter !== 'all'
                ? 'Tente alterar os filtros de busca para encontrar o que procura.'
                : 'Você está livre hoje! Aproveite para cadastrar uma nova tarefa clicando no botão abaixo.'
              }
            </p>
            {(searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all' || statusFilter !== 'all') ? (
              <button
                id="btn-clear-filters"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setSelectedPriority('all');
                  setSelectedCategory('all');
                }}
                className="mt-4 px-4 py-2 bg-brand-surface border border-brand-surface-light rounded-lg text-xs font-semibold text-brand-text hover:bg-brand-surface-light transition-colors cursor-pointer"
              >
                Limpar Filtros
              </button>
            ) : (
              <button
                id="btn-create-empty-state"
                onClick={onNavigateToCreate}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-brand-primary text-white font-semibold text-xs rounded-lg hover:bg-brand-primary/90 transition-all cursor-pointer"
              >
                <Plus size={14} />
                Criar Primeira Tarefa
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
