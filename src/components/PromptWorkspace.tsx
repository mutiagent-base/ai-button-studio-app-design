import React, { useState } from 'react';
import { Terminal, Wand2, Sparkles, Send, Plus, ListOrdered, ArrowRight } from 'lucide-react';
import { AIButtonStudioComponent } from '../types';
import { PROMPT_FORMULA_EXAMPLES } from '../data/presetButtons';

interface PromptWorkspaceProps {
  onParsePrompt: (promptText: string) => void;
  activeComponent: AIButtonStudioComponent;
  components: AIButtonStudioComponent[];
  onSelectComponent: (id: string) => void;
  onAddNewComponent: () => void;
}

export const PromptWorkspace: React.FC<PromptWorkspaceProps> = ({
  onParsePrompt,
  activeComponent,
  components,
  onSelectComponent,
  onAddNewComponent,
}) => {
  const [promptInput, setPromptInput] = useState<string>(
    `[${activeComponent.location.section} ${activeComponent.location.grid_id}] + [${activeComponent.content.label} via ${activeComponent.action.type.replace('_', ' ')}] + [${activeComponent.effects.base_style.replace(/_/g, ' ')} with ${activeComponent.effects.special_features.join(' & ')}]`
  );

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

  return (
    <div className="flex flex-col gap-3 bg-neutral-900/70 rounded-xl border border-neutral-800 p-4 backdrop-blur-sm">
      {/* Component Selector & Creator */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {components.map(comp => (
            <button
              key={comp.id}
              onClick={() => onSelectComponent(comp.id)}
              className={`text-xs px-2.5 py-1 rounded-md transition-all whitespace-nowrap font-medium flex items-center gap-1.5
                ${comp.id === activeComponent.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-neutral-800/80 text-neutral-400 hover:text-neutral-200 border border-transparent'
                }
              `}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>{comp.content.label || comp.id}</span>
              <span className="text-[10px] text-neutral-400 font-mono">({comp.location.grid_id})</span>
            </button>
          ))}
        </div>

        <button
          onClick={onAddNewComponent}
          title="Create New Component"
          className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-cyan-400 border border-neutral-700/60 transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
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
