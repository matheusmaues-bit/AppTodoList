/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tag, Plus, Trash2, Check, Briefcase, User, BookOpen, Heart, ShoppingBag, Award, Terminal, CheckSquare, Layers, HelpCircle } from 'lucide-react';
import { Category, Task } from '../types';
import DynamicIcon from '../components/DynamicIcon';

interface CategoriesPageProps {
  categories: Category[];
  tasks: Task[];
  onCreateCategory: (cat: Category) => void;
  onDeleteCategory: (id: string) => void;
}

// Curated colors for standard tags
const COLOR_PALETTE = [
  { hex: '#FF653F', text: '#ffffff', label: 'Coral' },
  { hex: '#FFC85C', text: '#3c0700', label: 'Ouro' },
  { hex: '#5AD7E7', text: '#001f23', label: 'Ciano' },
  { hex: '#CBADE2', text: '#27103b', label: 'Lavanda' },
  { hex: '#10B981', text: '#ffffff', label: 'Esmeralda' },
  { hex: '#F43F5E', text: '#ffffff', label: 'Rosa' },
  { hex: '#3B82F6', text: '#ffffff', label: 'Azul' },
  { hex: '#EC4899', text: '#ffffff', label: 'Magenta' }
];

// Curated icons for task management
const ICON_LIST = [
  { name: 'Briefcase', label: 'Trabalho' },
  { name: 'User', label: 'Pessoal' },
  { name: 'BookOpen', label: 'Estudos' },
  { name: 'Heart', label: 'Saúde' },
  { name: 'ShoppingBag', label: 'Compras' },
  { name: 'Award', label: 'Metas' },
  { name: 'Terminal', label: 'Código' },
  { name: 'Layers', label: 'Projetos' },
  { name: 'CheckSquare', label: 'Geral' }
];

export default function CategoriesPage({
  categories,
  tasks,
  onCreateCategory,
  onDeleteCategory
}: CategoriesPageProps) {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICON_LIST[0].name);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('O nome da categoria é obrigatório.');
      return;
    }

    // Check for duplicate name
    if (categories.some(c => c.name.toLowerCase() === name.trim().toLowerCase())) {
      setError('Já existe uma categoria com este nome.');
      return;
    }

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      color: selectedColor.hex,
      textColor: selectedColor.text,
      iconName: selectedIcon
    };

    onCreateCategory(newCategory);
    setName('');
    setError(null);
  };

  return (
    <div id="categories-page" className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Create Category Panel */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 md:p-6 bg-brand-surface/10 border border-brand-surface rounded-xl space-y-4 md:col-span-1"
      >
        <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-brand-text-secondary uppercase">
          <Tag size={12} className="text-brand-primary" />
          Gerenciar Tags
        </div>
        <h2 className="text-lg font-bold font-display text-brand-text">Nova Categoria</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div id="cat-error-banner" className="p-2.5 bg-brand-primary/10 border border-brand-primary/20 rounded-md text-xs text-brand-primary">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-1">
            <label htmlFor="cat-name-input" className="text-[10px] font-mono text-brand-text-secondary uppercase">Nome</label>
            <input
              id="cat-name-input"
              type="text"
              placeholder="Ex: Urgente, Viagens..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              className="w-full bg-brand-bg-deep border border-brand-surface focus:border-brand-primary rounded-lg px-3 py-2 text-xs text-brand-text focus:outline-none transition-colors"
            />
          </div>

          {/* Color Blocks Picker */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-brand-text-secondary uppercase">Cor de Destaque</span>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_PALETTE.map((col) => (
                <button
                  id={`color-picker-${col.hex.replace('#', '')}`}
                  key={col.hex}
                  type="button"
                  onClick={() => setSelectedColor(col)}
                  className="h-8 rounded-md relative cursor-pointer border border-brand-surface transition-transform hover:scale-105"
                  style={{ backgroundColor: col.hex }}
                  title={col.label}
                >
                  {selectedColor.hex === col.hex && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Check size={14} style={{ color: col.text }} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selector Grid */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-brand-text-secondary uppercase">Ícone Associado</span>
            <div className="grid grid-cols-5 gap-1.5 bg-brand-bg-deep p-2 border border-brand-surface rounded-lg">
              {ICON_LIST.map((ic) => (
                <button
                  id={`icon-picker-${ic.name}`}
                  key={ic.name}
                  type="button"
                  onClick={() => setSelectedIcon(ic.name)}
                  className={`p-2 rounded flex items-center justify-center transition-colors cursor-pointer ${
                    selectedIcon === ic.name
                      ? 'bg-brand-primary text-white'
                      : 'text-brand-text-secondary hover:bg-brand-surface/30 hover:text-brand-text'
                  }`}
                  title={ic.label}
                >
                  <DynamicIcon name={ic.name} size={15} />
                </button>
              ))}
            </div>
          </div>

          <button
            id="btn-submit-category"
            type="submit"
            className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 bg-brand-primary text-white font-semibold text-xs rounded-lg hover:bg-brand-primary/90 transition-all cursor-pointer"
          >
            <Plus size={14} />
            Adicionar Categoria
          </button>
        </form>
      </motion.div>

      {/* Categories List View */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-lg font-bold font-display text-brand-text">Categorias Existentes ({categories.length})</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {categories.map((cat) => {
              // Calculate tasks in this category
              const catTasks = tasks.filter(t => t.category === cat.id);
              const totalTasks = catTasks.length;
              const completedTasks = catTasks.filter(t => t.completed).length;

              // Prevent deleting core categories (default 4) to ensure stable environment
              const isDefault = ['trabalho', 'pessoal', 'estudos', 'saude'].includes(cat.id);

              return (
                <motion.div
                  id={`cat-card-${cat.id}`}
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -1 }}
                  className="p-4 bg-brand-surface/5 border border-brand-surface rounded-xl flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Visual icon container */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${cat.color}15`,
                        color: cat.color,
                        border: `1px solid ${cat.color}30`
                      }}
                    >
                      <DynamicIcon name={cat.iconName} size={20} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-brand-text truncate">
                        {cat.name}
                      </h3>
                      <p className="text-[10px] font-mono text-brand-text-secondary mt-0.5">
                        {totalTasks === 0
                          ? 'Sem tarefas vinculadas'
                          : `${completedTasks} de ${totalTasks} concluidas`
                        }
                      </p>
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex items-center gap-2">
                    {/* Inline progress bar preview */}
                    {totalTasks > 0 && (
                      <div className="w-12 h-1 bg-brand-surface rounded-full overflow-hidden shrink-0 hidden sm:block">
                        <div
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: cat.color,
                            width: `${(completedTasks / totalTasks) * 100}%`
                          }}
                        />
                      </div>
                    )}

                    {/* Delete tag button (for non-default ones) */}
                    {!isDefault ? (
                      <button
                        id={`btn-delete-cat-${cat.id}`}
                        onClick={() => onDeleteCategory(cat.id)}
                        className="p-1.5 text-brand-text-secondary hover:text-brand-primary hover:bg-brand-primary/10 rounded transition-all cursor-pointer"
                        title="Excluir Categoria"
                      >
                        <Trash2 size={13} />
                      </button>
                    ) : (
                      <span className="text-[9px] font-mono text-brand-surface-light bg-brand-surface-light/10 border border-brand-surface/60 px-1.5 py-0.5 rounded uppercase shrink-0">
                        Nativa
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
