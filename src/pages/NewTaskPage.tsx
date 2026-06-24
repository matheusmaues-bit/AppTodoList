/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronLeft, Plus, Trash2, Calendar, FileText, CheckSquare, Tag, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, Task, SubTask } from '../types';

interface NewTaskPageProps {
  categories: Category[];
  onCreateTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  onCancel: () => void;
}

export default function NewTaskPage({ categories, onCreateTask, onCancel }: NewTaskPageProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState(categories[0]?.id || '');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  
  // Subtasks state
  const [subtasks, setSubtasks] = useState<Omit<SubTask, 'id'>[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Form error state
  const [error, setError] = useState<string | null>(null);

  // Add subtask to the list
  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    
    setSubtasks([...subtasks, { title: newSubtaskTitle.trim(), completed: false }]);
    setNewSubtaskTitle('');
  };

  // Remove subtask from the list
  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('O título da tarefa é obrigatório.');
      return;
    }

    if (!category) {
      setError('Selecione uma categoria para a tarefa.');
      return;
    }

    // Pass data back
    onCreateTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate,
      subtasks: subtasks.map((st, index) => ({
        id: `subtask-temp-${Date.now()}-${index}`,
        title: st.title,
        completed: st.completed
      })),
      notes: notes.trim()
    });
  };

  return (
    <motion.div
      id="new-task-page"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      {/* Back button and page title */}
      <div className="flex items-center gap-2">
        <button
          id="btn-back-to-list"
          onClick={onCancel}
          className="p-1.5 rounded-lg bg-brand-surface/30 hover:bg-brand-surface/80 text-brand-text-secondary hover:text-brand-text transition-colors cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold font-display tracking-tight text-brand-text">
            Nova Tarefa
          </h2>
          <p className="text-xs text-brand-text-secondary font-mono mt-0.5">
            Cadastre uma nova atividade de alta performance.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-brand-surface/10 border border-brand-surface rounded-xl p-5 md:p-6">
        {/* Error Notification */}
        {error && (
          <motion.div
            id="error-msg-banner"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-3 bg-brand-primary/10 border border-brand-primary/20 rounded-lg text-brand-primary text-xs flex items-center gap-2"
          >
            <AlertTriangle size={14} className="shrink-0" />
            <span className="font-semibold">{error}</span>
          </motion.div>
        )}

        {/* Task Title */}
        <div className="space-y-1.5">
          <label htmlFor="task-title-input" className="text-xs font-mono font-medium text-brand-text-secondary uppercase tracking-wider block">
            Título da Tarefa <span className="text-brand-primary">*</span>
          </label>
          <input
            id="task-title-input"
            type="text"
            placeholder="Ex: Entregar relatório de métricas..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-brand-bg border border-brand-surface hover:border-brand-surface-light focus:border-brand-primary rounded-lg px-4 py-2.5 text-sm text-brand-text placeholder-brand-text-secondary/40 focus:outline-none transition-colors"
          />
        </div>

        {/* Task Description */}
        <div className="space-y-1.5">
          <label htmlFor="task-desc-input" className="text-xs font-mono font-medium text-brand-text-secondary uppercase tracking-wider block">
            Descrição
          </label>
          <textarea
            id="task-desc-input"
            placeholder="Breve resumo da atividade, escopo ou orientações..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-brand-bg border border-brand-surface hover:border-brand-surface-light focus:border-brand-primary rounded-lg px-4 py-2.5 text-sm text-brand-text placeholder-brand-text-secondary/40 focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Priority & Category selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Priority Toggles */}
          <div className="space-y-1.5">
            <span className="text-xs font-mono font-medium text-brand-text-secondary uppercase tracking-wider block">
              Nível de Prioridade
            </span>
            <div className="grid grid-cols-3 bg-brand-bg border border-brand-surface rounded-lg p-1">
              <button
                id="prio-low-btn"
                type="button"
                onClick={() => setPriority('low')}
                className={`py-1.5 rounded-md text-xs font-semibold font-mono tracking-wide transition-all cursor-pointer ${
                  priority === 'low'
                    ? 'bg-brand-surface-light/30 text-brand-text border border-brand-surface-light/20'
                    : 'text-brand-text-secondary hover:text-brand-text'
                }`}
              >
                BAIXA
              </button>
              <button
                id="prio-medium-btn"
                type="button"
                onClick={() => setPriority('medium')}
                className={`py-1.5 rounded-md text-xs font-semibold font-mono tracking-wide transition-all cursor-pointer ${
                  priority === 'medium'
                    ? 'bg-brand-gold/15 text-brand-gold border border-brand-gold/20'
                    : 'text-brand-text-secondary hover:text-brand-text'
                }`}
              >
                MÉDIA
              </button>
              <button
                id="prio-high-btn"
                type="button"
                onClick={() => setPriority('high')}
                className={`py-1.5 rounded-md text-xs font-semibold font-mono tracking-wide transition-all cursor-pointer ${
                  priority === 'high'
                    ? 'bg-brand-primary/15 text-brand-primary border border-brand-primary/20'
                    : 'text-brand-text-secondary hover:text-brand-text'
                }`}
              >
                ALTA
              </button>
            </div>
          </div>

          {/* Category Select */}
          <div className="space-y-1.5">
            <label htmlFor="task-cat-select" className="text-xs font-mono font-medium text-brand-text-secondary uppercase tracking-wider block">
              Categoria <span className="text-brand-primary">*</span>
            </label>
            <select
              id="task-cat-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-brand-bg border border-brand-surface hover:border-brand-surface-light focus:border-brand-primary text-sm text-brand-text rounded-lg px-4 py-2.5 focus:outline-none transition-colors cursor-pointer"
            >
              <option value="" disabled>Selecione uma categoria...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Due Date & Subtasks Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Due Date */}
          <div className="space-y-1.5">
            <label htmlFor="task-date-input" className="text-xs font-mono font-medium text-brand-text-secondary uppercase tracking-wider block">
              Prazo de Entrega
            </label>
            <div className="relative">
              <input
                id="task-date-input"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-brand-bg border border-brand-surface hover:border-brand-surface-light focus:border-brand-primary rounded-lg px-4 py-2.5 text-sm text-brand-text focus:outline-none transition-colors cursor-pointer"
              />
            </div>
          </div>

          {/* Add Subtasks Interactive Panel */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-brand-text-secondary uppercase tracking-wider block">
              Sub-tarefas ({subtasks.length})
            </label>
            <div className="flex gap-2">
              <input
                id="new-subtask-input"
                type="text"
                placeholder="Adicionar sub-tarefa..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask(e);
                  }
                }}
                className="flex-1 bg-brand-bg border border-brand-surface hover:border-brand-surface-light focus:border-brand-primary rounded-lg px-3 py-1.5 text-xs text-brand-text placeholder-brand-text-secondary/40 focus:outline-none transition-colors"
              />
              <button
                id="btn-add-subtask"
                type="button"
                onClick={handleAddSubtask}
                className="p-2 bg-brand-surface hover:bg-brand-surface-light text-brand-primary rounded-lg transition-colors border border-brand-surface cursor-pointer flex items-center justify-center shrink-0"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* List of pending subtasks */}
            <div className="mt-2 max-h-[120px] overflow-y-auto space-y-1.5 pr-1">
              <AnimatePresence>
                {subtasks.map((st, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center justify-between gap-2 p-2 bg-brand-bg-deep/50 border border-brand-surface/60 rounded-md text-xs text-brand-text"
                  >
                    <span className="truncate flex items-center gap-1.5 text-brand-text-secondary">
                      <span className="font-mono text-[10px] text-brand-primary">#{i + 1}</span>
                      {st.title}
                    </span>
                    <button
                      id={`btn-remove-subtask-${i}`}
                      type="button"
                      onClick={() => handleRemoveSubtask(i)}
                      className="text-brand-text-secondary hover:text-brand-primary p-0.5 rounded transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Notes / Textarea */}
        <div className="space-y-1.5">
          <label htmlFor="task-notes-input" className="text-xs font-mono font-medium text-brand-text-secondary uppercase tracking-wider block">
            Notas Adicionais / Anotações
          </label>
          <textarea
            id="task-notes-input"
            placeholder="Links relevantes, senhas, códigos ou notas de apoio rápidas..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full bg-brand-bg border border-brand-surface hover:border-brand-surface-light focus:border-brand-primary rounded-lg px-4 py-2 text-sm text-brand-text placeholder-brand-text-secondary/40 focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Actions Buttons Row */}
        <div className="flex justify-end items-center gap-3 pt-4 border-t border-brand-surface/30">
          <button
            id="btn-cancel-create"
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-brand-surface rounded-lg text-xs font-semibold text-brand-text-secondary hover:text-brand-text hover:bg-brand-surface/50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            id="btn-submit-task"
            type="submit"
            className="px-5 py-2.5 bg-brand-primary text-white font-semibold text-xs rounded-lg hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/10 cursor-pointer"
          >
            Salvar Tarefa
          </button>
        </div>
      </form>
    </motion.div>
  );
}
