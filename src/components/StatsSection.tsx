/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { CheckCircle2, Circle, TrendingUp, AlertCircle, BarChart3, PieChart } from 'lucide-react';
import { Task, Category } from '../types';

interface StatsSectionProps {
  tasks: Task[];
  categories: Category[];
}

export default function StatsSection({ tasks, categories }: StatsSectionProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Stats by priority
  const highPriority = tasks.filter(t => t.priority === 'high');
  const highCompleted = highPriority.filter(t => t.completed).length;
  
  const medPriority = tasks.filter(t => t.priority === 'medium');
  const medCompleted = medPriority.filter(t => t.completed).length;
  
  const lowPriority = tasks.filter(t => t.priority === 'low');
  const lowCompleted = lowPriority.filter(t => t.completed).length;

  // Circular gauge coordinates (radius = 40, circumference = 2 * PI * 40 ≈ 251.2)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  return (
    <div id="stats-dashboard" className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Circle Completion Gauge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 bg-brand-surface/20 border border-brand-surface rounded-xl flex flex-col items-center justify-center text-center relative overflow-hidden"
      >
        <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-brand-text-secondary uppercase">
          <TrendingUp size={12} className="text-brand-primary" />
          Rendimento Geral
        </div>

        <div className="relative w-32 h-32 mt-4 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-brand-surface-light/30"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Foreground Circle */}
            <motion.circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-brand-primary"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-bold font-display text-brand-text">
              {completionRate}%
            </span>
            <span className="text-[10px] font-mono text-brand-text-secondary/80">
              CONCLUÍDO
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1">
            <CheckCircle2 size={12} className="text-brand-primary" />
            <span>{completedTasks} Feitas</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-brand-surface-light" />
          <div className="flex items-center gap-1">
            <Circle size={12} className="text-brand-text-secondary" />
            <span>{activeTasks} Ativas</span>
          </div>
        </div>
      </motion.div>

      {/* Progress by Category */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="p-6 bg-brand-surface/20 border border-brand-surface rounded-xl flex flex-col justify-between"
      >
        <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-brand-text-secondary uppercase mb-4">
          <BarChart3 size={12} className="text-brand-primary" />
          Por Categoria
        </div>

        <div className="space-y-3.5 flex-1 flex flex-col justify-center">
          {categories.map(cat => {
            const catTasks = tasks.filter(t => t.category === cat.id);
            const totalCat = catTasks.length;
            const completedCat = catTasks.filter(t => t.completed).length;
            const percentage = totalCat > 0 ? Math.round((completedCat / totalCat) * 100) : 0;

            return (
              <div id={`stats-cat-${cat.id}`} key={cat.id} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-brand-text/90 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    {cat.name}
                  </span>
                  <span className="font-mono text-brand-text-secondary">
                    {completedCat}/{totalCat} ({percentage}%)
                  </span>
                </div>
                {/* Custom Bar Chart */}
                <div className="h-1.5 w-full bg-brand-bg-deep rounded-full overflow-hidden border border-brand-surface/30">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                </div>
              </div>
            );
          })}
          {categories.length === 0 && (
            <p className="text-xs text-brand-text-secondary italic text-center py-4">
              Nenhuma categoria cadastrada.
            </p>
          )}
        </div>
      </motion.div>

      {/* Priorities Breakdown */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="p-6 bg-brand-surface/20 border border-brand-surface rounded-xl flex flex-col justify-between"
      >
        <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-brand-text-secondary uppercase mb-4">
          <PieChart size={12} className="text-brand-primary" />
          Nível de Prioridade (Ativas)
        </div>

        <div className="space-y-3.5 flex-1 flex flex-col justify-center">
          {/* High Priority */}
          <div id="stats-priority-high" className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary" />
              <span className="text-xs font-semibold text-brand-text">Alta Prioridade</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded border border-brand-primary/20">
                {highPriority.filter(t => !t.completed).length} Ativas
              </span>
              <span className="text-xs font-mono text-brand-text-secondary">
                {highCompleted}/{highPriority.length}
              </span>
            </div>
          </div>

          {/* Medium Priority */}
          <div id="stats-priority-medium" className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-gold" />
              <span className="text-xs font-semibold text-brand-text">Média Prioridade</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono bg-brand-gold/10 text-brand-gold px-1.5 py-0.5 rounded border border-brand-gold/20">
                {medPriority.filter(t => !t.completed).length} Ativas
              </span>
              <span className="text-xs font-mono text-brand-text-secondary">
                {medCompleted}/{medPriority.length}
              </span>
            </div>
          </div>

          {/* Low Priority */}
          <div id="stats-priority-low" className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-text-secondary" />
              <span className="text-xs font-semibold text-brand-text">Baixa Prioridade</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono bg-brand-surface-light/25 text-brand-text-secondary px-1.5 py-0.5 rounded border border-brand-surface/40">
                {lowPriority.filter(t => !t.completed).length} Ativas
              </span>
              <span className="text-xs font-mono text-brand-text-secondary">
                {lowCompleted}/{lowPriority.length}
              </span>
            </div>
          </div>
        </div>

        {totalTasks > 0 && (
          <div className="mt-4 pt-3 border-t border-brand-surface/30 flex justify-between items-center text-[10px] font-mono text-brand-text-secondary">
            <span>TOTAL DE TAREFAS ATIVAS</span>
            <span className="text-brand-primary font-bold">{activeTasks}</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
