import React, { useState } from 'react';
import {
  Terminal,
  Wand2,
  Sparkles,
  Send,
  Plus,
  ListOrdered,
  ArrowRight,
  GripVertical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { AIButtonStudioComponent } from '../types';
import { PROMPT_FORMULA_EXAMPLES } from '../data/presetButtons';

interface PromptWorkspaceProps {
  onParsePrompt: (promptText: string) => void;
  activeComponent: AIButtonStudioComponent;
  components: AIButtonStudioComponent[];
  onSelectComponent: (id: string) => void;
  onAddNewComponent: () => void;
  onReorderComponents?: (newComponents: AIButtonStudioComponent[]) => void;
}

export const PromptWorkspace: React.FC<PromptWorkspaceProps> = ({
  onParsePrompt,
  activeComponent,
  components,
  onSelectComponent,
  onAddNewComponent,
  onReorderComponents,
}) => {
  const [promptInput, setPromptInput] = useState<string>(
    `[${activeComponent.location.section} ${activeComponent.location.grid_id}] + [${activeComponent.content.label} via ${activeComponent.action.type.replace('_', ' ')}] + [${activeComponent.effects.base_style.replace(/_/g, ' ')} with ${activeComponent.effects.special_features.join(' & ')}]`
  );
  const [draggingCompId, setDraggingCompId] = useState<string | null>(null);
  const [dragOverCompId, setDragOverCompId] = useState<string | null>(null);

  const handleExecute = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (promptInput.trim()) {
      onParsePrompt(promptInput.trim());
    }
  };

  const handleFormulaSelect = (formula: string) => {
    setPromptInput(formula);
    onParsePrompt(formula);
  };

  // Move component by index offset (-1 = left, +1 = right)
  const handleMoveComponent = (index: number, direction: 'left' | 'right', e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onReorderComponents) return;
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= components.length) return;

    const newComps = [...components];
    const [moved] = newComps.splice(index, 1);
    newComps.splice(targetIndex, 0, moved);
    onReorderComponents(newComps);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingCompId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCompId !== id) {
      setDragOverCompId(id);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain') || draggingCompId;
    setDraggingCompId(null);
    setDragOverCompId(null);

    if (!sourceId || sourceId === targetId || !onReorderComponents) return;

    const sourceIndex = components.findIndex(c => c.id === sourceId);
    const targetIndex = components.findIndex(c => c.id === targetId);
    if (sourceIndex === -1 || targetIndex === -1) return;

    const newComps = [...components];
    const [moved] = newComps.splice(sourceIndex, 1);
    newComps.splice(targetIndex, 0, moved);
    onReorderComponents(newComps);
  };

  const handleDragEnd = () => {
    setDraggingCompId(null);
    setDragOverCompId(null);
  };

  return (
    <div className="flex flex-col gap-3 bg-neutral-900/70 rounded-xl border border-neutral-800 p-4 backdrop-blur-sm">
      {/* Component Selector & Organizer */}
      <div className="flex flex-col gap-1.5 pb-2 border-b border-neutral-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium">
            <ListOrdered className="w-3.5 h-3.5 text-cyan-400" />
            <span>Components ({components.length})</span>
            <span className="text-[10px] text-neutral-500 hidden sm:inline">• Drag or use arrows to reorder</span>
          </div>

          <button
            onClick={onAddNewComponent}
            title="Create New Component"
            className="px-2 py-0.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-cyan-400 border border-neutral-700/60 transition-colors text-[11px] font-semibold flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Add Button</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {components.map((comp, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === components.length - 1;
            const isDragging = draggingCompId === comp.id;
            const isDragOver = dragOverCompId === comp.id && draggingCompId !== comp.id;
            const isActive = comp.id === activeComponent.id;

            return (
              <div
                key={comp.id}
                draggable
                onDragStart={e => handleDragStart(e, comp.id)}
                onDragOver={e => handleDragOver(e, comp.id)}
                onDrop={e => handleDrop(e, comp.id)}
                onDragEnd={handleDragEnd}
                onClick={() => onSelectComponent(comp.id)}
                className={`group text-xs px-2 py-1 rounded-md transition-all whitespace-nowrap font-medium flex items-center gap-1 cursor-pointer border ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm ring-1 ring-cyan-500/20'
                    : 'bg-neutral-800/80 text-neutral-400 hover:text-neutral-200 border-neutral-700/50 hover:border-neutral-600'
                } ${isDragging ? 'opacity-40 scale-95 border-dashed border-cyan-400' : ''} ${
                  isDragOver ? 'border-l-2 border-l-amber-400 bg-amber-950/30' : ''
                }`}
                title="Click to select, drag or use arrows to reorder"
              >
                {/* Drag handle */}
                <GripVertical className="w-3 h-3 text-neutral-500 group-hover:text-neutral-300 cursor-grab active:cursor-grabbing -ml-0.5 opacity-60 group-hover:opacity-100 transition-opacity" />

                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>{comp.content.label || comp.id}</span>
                <span className="text-[10px] text-neutral-500 font-mono">({comp.location.grid_id})</span>

                {/* Reorder Arrows */}
                <div className="flex items-center gap-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    disabled={isFirst}
                    onClick={e => handleMoveComponent(idx, 'left', e)}
                    className="p-0.5 rounded hover:bg-neutral-700 disabled:opacity-20 disabled:hover:bg-transparent text-neutral-400 hover:text-cyan-300 transition-colors"
                    title="Move earlier"
                  >
                    <ChevronLeft className="w-2.5 h-2.5" />
                  </button>
                  <button
                    type="button"
                    disabled={isLast}
                    onClick={e => handleMoveComponent(idx, 'right', e)}
                    className="p-0.5 rounded hover:bg-neutral-700 disabled:opacity-20 disabled:hover:bg-transparent text-neutral-400 hover:text-cyan-300 transition-colors"
                    title="Move later"
                  >
                    <ChevronRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prompt Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-950/80 border border-indigo-500/30 text-indigo-400">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-neutral-200">
              Natural Language Prompt Box
            </h3>
            <p className="text-[11px] text-neutral-400">
              [Location] + [Action] + [Effect] Grammar Specification
            </p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleExecute} className="flex flex-col gap-2">
        <div className="relative">
          <textarea
            value={promptInput}
            onChange={e => setPromptInput(e.target.value)}
            rows={3}
            placeholder="e.g. [Hero R2C2] + [Deploy Cluster via Modal] + [Neon Glow with Dynamic Cursor Shadow]"
            className="w-full bg-neutral-950 border border-neutral-700/80 focus:border-cyan-500 rounded-lg p-2.5 text-xs text-neutral-100 font-mono placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-none transition-all shadow-inner leading-relaxed"
          />
          <button
            type="submit"
            className="absolute bottom-2.5 right-2.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-950/50 transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Parse & Compile</span>
          </button>
        </div>
      </form>

      {/* Quick Prompt Presets */}
      <div className="flex flex-col gap-1.5">
        <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Quick Modular Formulas</span>
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          {PROMPT_FORMULA_EXAMPLES.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleFormulaSelect(ex.prompt)}
              className="text-left px-2.5 py-1.5 rounded bg-neutral-950/60 hover:bg-neutral-800/60 border border-neutral-800/80 hover:border-cyan-500/40 text-[11px] text-neutral-300 transition-all flex items-center justify-between group"
            >
              <span className="font-medium text-neutral-200 group-hover:text-cyan-300">{ex.title}</span>
              <span className="text-[10px] text-neutral-400 font-mono truncate max-w-[200px] ml-2">{ex.prompt}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

