/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Calendar, CheckCircle2, Circle, ListTodo, AlertCircle } from 'lucide-react';
import { Task, Category } from '../types';
import DynamicIcon from './DynamicIcon';

interface TaskCardProps {
  key?: string | number;
  task: Task;
  category: Category | undefined;
  onToggleComplete: (id: string, e: React.MouseEvent) => void;
  onSelect: (task: Task) => void;
}

export default function TaskCard({ task, category, onToggleComplete, onSelect }: TaskCardProps) {
  // Determine subtask completion status
  const totalSubtasks = task.subtasks.length;
  const completedSubtasks = task.subtasks.filter(s => s.completed).length;

  // Format date nicely (DD/MM)
  const formatTaskDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}`;
    }
    return dateStr;
  };

  // Check if task is overdue
  const isOverdue = () => {
    if (task.completed || !task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(task.dueDate + 'T12:00:00');
    return taskDate < today;
  };

  return (
    <motion.div
      id={`task-card-${task.id}`}
      layoutId={`task-container-${task.id}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -2, backgroundColor: 'rgba(69, 46, 90, 0.4)' }}
      onClick={() => onSelect(task)}
      className="group relative flex flex-col md:flex-row md:items-center justify-between p-4 bg-brand-bg-deep/40 border border-brand-surface rounded-lg cursor-pointer transition-all gap-4 select-none"
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {/* Custom Checkbox */}
        <button
          id={`task-check-btn-${task.id}`}
          onClick={(e) => onToggleComplete(task.id, e)}
          className="mt-0.5 relative flex items-center justify-center focus:outline-none shrink-0"
        >
          {task.completed ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.1, 1] }}
              transition={{ duration: 0.2 }}
            >
              <CheckCircle2 className="w-5.5 h-5.5 text-brand-primary fill-brand-primary/10" />
            </motion.div>
          ) : (
            <Circle className="w-5.5 h-5.5 text-brand-surface-light group-hover:text-brand-primary transition-colors" />
          )}
        </button>

        {/* Task Title & Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`text-base font-semibold leading-snug tracking-tight truncate ${
                task.completed ? 'text-brand-text-secondary/50 line-through' : 'text-brand-text'
              }`}
            >
              {task.title}
            </h3>
            
            {/* Overdue alert */}
            {isOverdue() && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 bg-brand-primary/10 text-brand-primary rounded-sm border border-brand-primary/20 shrink-0">
                <AlertCircle size={10} />
                ATRASADA
              </span>
            )}
          </div>

          <p
            className={`text-sm mt-1 line-clamp-1 ${
              task.completed ? 'text-brand-text-secondary/40' : 'text-brand-text-secondary'
            }`}
          >
            {task.description || 'Sem descrição.'}
          </p>
        </div>
      </div>

      {/* Metadata & Badges */}
      <div className="flex items-center gap-2.5 ml-8 md:ml-0 self-end md:self-auto shrink-0 flex-wrap">
        {/* Category Chip */}
        {category && (
          <span
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${category.color}15`,
              color: category.color,
              border: `1px solid ${category.color}30`
            }}
          >
            <DynamicIcon name={category.iconName} size={12} />
            {category.name}
          </span>
        )}

        {/* Subtasks Counter */}
        {totalSubtasks > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-brand-surface/50 border border-brand-surface-light/30 text-xs text-brand-text-secondary font-mono">
            <ListTodo size={12} />
            {completedSubtasks}/{totalSubtasks}
          </span>
        )}

        {/* Priority Badge */}
        {task.priority === 'high' && (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
            ALTA
          </span>
        )}
        {task.priority === 'medium' && (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono font-medium bg-brand-gold/10 text-brand-gold border border-brand-gold/20">
            MÉDIA
          </span>
        )}
        {task.priority === 'low' && (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono font-medium bg-brand-surface-light/25 text-brand-text-secondary border border-brand-surface/50">
            BAIXA
          </span>
        )}

        {/* Due Date */}
        {task.dueDate && (
          <span className={`inline-flex items-center gap-1 text-xs font-mono font-medium px-2 py-1 rounded bg-brand-bg-deep/80 border border-brand-surface ${isOverdue() ? 'text-brand-primary border-brand-primary/20' : 'text-brand-text-secondary'}`}>
            <Calendar size={12} />
            {formatTaskDate(task.dueDate)}
          </span>
        )}
      </div>
    </motion.div>
  );
}
