/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronLeft, Calendar, Tag, AlertTriangle, CheckSquare, Trash2, Edit2, Play, Circle, CheckCircle2, Plus, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, Category, SubTask } from '../types';
import DynamicIcon from '../components/DynamicIcon';

interface TaskDetailPageProps {
  task: Task;
  category: Category | undefined;
  onBack: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (id: string) => void;
}

export default function TaskDetailPage({
  task,
  category,
  onBack,
  onUpdateTask,
  onDeleteTask
}: TaskDetailPageProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  
  // Inline editing notes state
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState(task.notes || '');

  // Toggle main task completeness
  const handleToggleMainComplete = () => {
    onUpdateTask({
      ...task,
      completed: !task.completed
    });
  };

  // Toggle subtask status
  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map(sub => {
      if (sub.id === subtaskId) {
        return { ...sub, completed: !sub.completed };
      }
      return sub;
    });

    onUpdateTask({
      ...task,
      subtasks: updatedSubtasks
    });
  };

  // Add new subtask to active task
  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const newSub: SubTask = {
      id: `subtask-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: newSubtaskTitle.trim(),
      completed: false
    };

    onUpdateTask({
      ...task,
      subtasks: [...task.subtasks, newSub]
    });
    setNewSubtaskTitle('');
  };

  // Delete subtask from active task
  const handleDeleteSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.filter(sub => sub.id !== subtaskId);
    onUpdateTask({
      ...task,
      subtasks: updatedSubtasks
    });
  };

  // Save edited notes
  const handleSaveNotes = () => {
    onUpdateTask({
      ...task,
      notes: editedNotes.trim()
    });
    setIsEditingNotes(false);
  };

  // Calculate subtask completion percentage
  const totalSubtasks = task.subtasks.length;
  const completedSubtasks = task.subtasks.filter(s => s.completed).length;
  const subtaskPercentage = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Format date nicely (DD/MM/YYYY)
  const formatFullDate = (dateStr: string) => {
    if (!dateStr) return 'Sem prazo definido';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <motion.div
      id="task-detail-page"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 max-w-2xl mx-auto pb-10"
    >
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-detail-header"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-brand-text-secondary hover:text-brand-text transition-colors cursor-pointer bg-brand-surface/20 hover:bg-brand-surface/60 px-3 py-1.5 rounded-lg border border-brand-surface"
        >
          <ChevronLeft size={16} />
          VOLTAR À LISTA
        </button>

        {/* Delete action button */}
        <button
          id="btn-trigger-delete"
          onClick={() => setIsDeleting(true)}
          className="p-2 text-brand-text-secondary hover:text-brand-primary rounded-lg hover:bg-brand-primary/10 transition-colors border border-brand-surface cursor-pointer"
          title="Excluir tarefa"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Main Task Detail Card */}
      <div className="bg-brand-surface/10 border border-brand-surface rounded-xl p-5 md:p-6 space-y-6 relative overflow-hidden">
        {/* Priority background accent tint */}
        {task.priority === 'high' && <div className="absolute top-0 right-0 w-32 h-1 bg-brand-primary" />}
        {task.priority === 'medium' && <div className="absolute top-0 right-0 w-32 h-1 bg-brand-gold" />}
        {task.priority === 'low' && <div className="absolute top-0 right-0 w-32 h-1 bg-brand-surface-light" />}

        {/* Title and Complete Button */}
        <div className="flex items-start gap-4 justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <h1 className={`text-xl md:text-2xl font-bold font-display tracking-tight leading-snug break-words ${task.completed ? 'text-brand-text-secondary/50 line-through' : 'text-brand-text'}`}>
              {task.title}
            </h1>
            <p className="text-xs font-mono text-brand-text-secondary">
              Criada em: {new Date(task.createdAt).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <button
            id="btn-toggle-main-completed"
            onClick={handleToggleMainComplete}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-mono tracking-wider transition-all cursor-pointer border shrink-0 ${
              task.completed
                ? 'bg-brand-surface-light/30 text-brand-text border-brand-surface-light/50'
                : 'bg-brand-primary text-white border-brand-primary hover:bg-brand-primary/90'
            }`}
          >
            {task.completed ? 'CONCLUÍDA' : 'CONCLUIR'}
          </button>
        </div>

        {/* Task Description */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono tracking-wider text-brand-text-secondary uppercase">
            Descrição do Objetivo
          </span>
          <div className="p-4 bg-brand-bg-deep/50 border border-brand-surface rounded-lg text-sm leading-relaxed text-brand-text/90">
            {task.description || <span className="text-brand-text-secondary/40 italic">Sem descrição disponível para esta tarefa.</span>}
          </div>
        </div>

        {/* Metadata Badges row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-y border-brand-surface/30">
          {/* Category info */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-brand-text-secondary tracking-wider uppercase">Categoria</span>
            {category ? (
              <span className="flex items-center gap-1.5 text-sm font-semibold mt-0.5" style={{ color: category.color }}>
                <DynamicIcon name={category.iconName} size={15} />
                {category.name}
              </span>
            ) : (
              <span className="text-sm font-semibold text-brand-text-secondary mt-0.5">Sem categoria</span>
            )}
          </div>

          {/* Priority info */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-brand-text-secondary tracking-wider uppercase">Prioridade</span>
            <span className="mt-0.5">
              {task.priority === 'high' && (
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-brand-primary px-2 py-0.5 bg-brand-primary/10 border border-brand-primary/20 rounded">
                  ALTA
                </span>
              )}
              {task.priority === 'medium' && (
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-brand-gold px-2 py-0.5 bg-brand-gold/10 border border-brand-gold/20 rounded">
                  MÉDIA
                </span>
              )}
              {task.priority === 'low' && (
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-brand-text-secondary px-2 py-0.5 bg-brand-surface-light/25 border border-brand-surface rounded">
                  BAIXA
                </span>
              )}
            </span>
          </div>

          {/* Due date info */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-brand-text-secondary tracking-wider uppercase">Prazo final</span>
            <span className="text-sm font-semibold text-brand-text/90 mt-0.5 inline-flex items-center gap-1.5">
              <Calendar size={14} className="text-brand-primary" />
              {formatFullDate(task.dueDate)}
            </span>
          </div>
        </div>

        {/* Subtasks checklist panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-brand-text font-display">Sub-tarefas de Apoio</h3>
              <p className="text-xs text-brand-text-secondary font-mono">
                {totalSubtasks > 0 ? `${completedSubtasks} de ${totalSubtasks} concluídas (${subtaskPercentage}%)` : 'Nenhuma sub-tarefa criada.'}
              </p>
            </div>

            {/* Quick add subtask form */}
            <form onSubmit={handleAddSubtask} className="flex gap-1.5 max-w-xs flex-1">
              <input
                id="detail-subtask-add-input"
                type="text"
                placeholder="Nova sub-tarefa..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className="w-full bg-brand-bg-deep border border-brand-surface hover:border-brand-surface-light focus:border-brand-primary rounded px-2.5 py-1 text-xs text-brand-text focus:outline-none transition-colors"
              />
              <button
                id="btn-add-subtask-detail"
                type="submit"
                className="p-1.5 bg-brand-surface hover:bg-brand-surface-light text-brand-primary rounded border border-brand-surface cursor-pointer shrink-0"
              >
                <Plus size={14} />
              </button>
            </form>
          </div>

          {/* Subtasks progress bar */}
          {totalSubtasks > 0 && (
            <div className="h-1.5 w-full bg-brand-bg-deep rounded-full overflow-hidden border border-brand-surface/30">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${subtaskPercentage}%` }}
                className="h-full bg-brand-primary rounded-full"
              />
            </div>
          )}

          {/* Subtasks interactive list */}
          {totalSubtasks > 0 && (
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {task.subtasks.map((sub) => (
                <div
                  id={`detail-sub-${sub.id}`}
                  key={sub.id}
                  className="flex items-center justify-between gap-3 p-2.5 bg-brand-bg-deep/40 border border-brand-surface/40 rounded-lg group hover:border-brand-surface-light transition-colors"
                >
                  <button
                    id={`btn-toggle-sub-${sub.id}`}
                    type="button"
                    onClick={() => handleToggleSubtask(sub.id)}
                    className="flex items-center gap-2.5 text-left flex-1 min-w-0 cursor-pointer focus:outline-none"
                  >
                    {sub.completed ? (
                      <CheckCircle2 size={16} className="text-brand-primary shrink-0" />
                    ) : (
                      <Circle size={16} className="text-brand-surface-light group-hover:text-brand-primary transition-colors shrink-0" />
                    )}
                    <span className={`text-xs truncate ${sub.completed ? 'text-brand-text-secondary/50 line-through' : 'text-brand-text/90'}`}>
                      {sub.title}
                    </span>
                  </button>
                  <button
                    id={`btn-delete-sub-${sub.id}`}
                    type="button"
                    onClick={() => handleDeleteSubtask(sub.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-brand-text-secondary hover:text-brand-primary transition-all cursor-pointer shrink-0"
                    title="Excluir sub-tarefa"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes / Textarea Section */}
        <div className="space-y-2 pt-4 border-t border-brand-surface/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-wider text-brand-text-secondary uppercase">
              Notas & Anotações de Apoio
            </span>
            {isEditingNotes ? (
              <button
                id="btn-save-notes-detail"
                onClick={handleSaveNotes}
                className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-brand-primary hover:text-brand-primary-dim transition-colors cursor-pointer"
              >
                <Save size={12} />
                SALVAR
              </button>
            ) : (
              <button
                id="btn-edit-notes-detail"
                onClick={() => {
                  setEditedNotes(task.notes || '');
                  setIsEditingNotes(true);
                }}
                className="inline-flex items-center gap-1 text-[10px] font-mono text-brand-text-secondary hover:text-brand-text transition-colors cursor-pointer"
              >
                <Edit2 size={10} />
                EDITAR NOTAS
              </button>
            )}
          </div>

          {isEditingNotes ? (
            <textarea
              id="detail-notes-edit-textarea"
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              rows={3}
              placeholder="Digite anotações rápidas ou links..."
              className="w-full bg-brand-bg border border-brand-surface focus:border-brand-primary text-xs text-brand-text rounded-lg p-3 focus:outline-none transition-colors resize-none"
            />
          ) : (
            <div className="p-3 bg-brand-bg-deep/20 rounded-lg border border-brand-surface/40 min-h-[60px] text-xs text-brand-text-secondary font-mono leading-relaxed whitespace-pre-wrap">
              {task.notes ? task.notes : <span className="text-brand-text-secondary/30 italic">Sem anotações adicionadas. Clique em "Editar Notas" para começar.</span>}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal/Overlay */}
      <AnimatePresence>
        {isDeleting && (
          <motion.div
            id="delete-confirmation-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm p-6 bg-brand-bg border border-brand-surface rounded-xl space-y-4 shadow-2xl"
            >
              <div className="flex items-center gap-2 text-brand-primary">
                <AlertTriangle size={24} />
                <h3 className="text-lg font-bold font-display text-brand-text">Excluir Tarefa?</h3>
              </div>
              
              <p className="text-xs text-brand-text-secondary leading-relaxed">
                Você tem certeza que deseja excluir permanentemente a tarefa <strong className="text-brand-text">"{task.title}"</strong>? Esta ação é irreversível.
              </p>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  id="btn-cancel-delete"
                  onClick={() => setIsDeleting(false)}
                  className="px-4 py-2 bg-brand-surface/50 border border-brand-surface rounded-lg text-xs font-semibold text-brand-text-secondary hover:text-brand-text transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="btn-confirm-delete"
                  onClick={() => {
                    onDeleteTask(task.id);
                  }}
                  className="px-4 py-2 bg-brand-primary text-white font-semibold text-xs rounded-lg hover:bg-brand-primary/90 transition-all cursor-pointer"
                >
                  Sim, Excluir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
