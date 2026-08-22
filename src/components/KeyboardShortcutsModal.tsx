import React, { useState, useMemo } from 'react';
import {
  Keyboard,
  X,
  Search,
  Sparkles,
  Command,
  CornerDownLeft,
  Sliders,
  Code2,
  FileJson,
  Plus,
  Play,
  Copy,
  Download,
  Bookmark,
  Layers,
  Zap,
} from 'lucide-react';

export interface ShortcutItem {
  id: string;
  category: 'General' | 'Components' | 'Design & Tokens' | 'Export & Code' | 'Simulation';
  label: string;
  description: string;
  keys: string[];
  actionId?: string;
}

const SHORTCUTS_DATA: ShortcutItem[] = [
  // General
  {
    id: 'toggle-shortcuts',
    category: 'General',
    label: 'Open Shortcuts Overlay',
    description: 'Toggle this keyboard shortcuts cheatsheet modal',
    keys: ['?', 'or', 'Ctrl', '/'],
  },
  {
    id: 'focus-prompt',
    category: 'General',
    label: 'Focus AI Prompt Workspace',
    description: 'Jump cursor directly to natural language prompt input',
    keys: ['Ctrl', 'K'],
    actionId: 'focus_prompt',
  },
  {
    id: 'close-modals',
    category: 'General',
    label: 'Close Active Modal',
    description: 'Dismiss any open modal, dialog, or overlay',
    keys: ['Esc'],
  },

  // Components
  {
    id: 'new-component',
    category: 'Components',
    label: 'Create New Button Component',
    description: 'Instantiate and register a new interactive button in workspace',
    keys: ['Ctrl', 'N'],
    actionId: 'new_component',
  },
  {
    id: 'duplicate-component',
    category: 'Components',
    label: 'Duplicate Active Component',
    description: 'Clone currently selected button with all IR configurations',
    keys: ['Ctrl', 'D'],
    actionId: 'duplicate_component',
  },
  {
    id: 'cycle-prev-component',
    category: 'Components',
    label: 'Previous Button Component',
    description: 'Switch active selection to previous component in list',
    keys: ['Alt', 'ArrowUp'],
    actionId: 'prev_component',
  },
  {
    id: 'cycle-next-component',
    category: 'Components',
    label: 'Next Button Component',
    description: 'Switch active selection to next component in list',
    keys: ['Alt', 'ArrowDown'],
    actionId: 'next_component',
  },

  // Export & Code
  {
    id: 'open-export',
    category: 'Export & Code',
    label: 'Open Code Exporter',
    description: 'Switch right sidebar to Code Exporter tab',
    keys: ['Ctrl', 'E'],
    actionId: 'open_export',
  },
  {
    id: 'open-json-ir',
    category: 'Export & Code',
    label: 'Open JSON IR Inspector',
    description: 'Switch right sidebar to JSON IR compiler inspection',
    keys: ['Ctrl', 'J'],
    actionId: 'open_json',
  },
  {
    id: 'open-docs',
    category: 'Export & Code',
    label: 'Open Specs & Docs Wiki',
    description: 'Browse architectural documentation and specs',
    keys: ['Ctrl', 'B'],
    actionId: 'open_docs',
  },

  // Design & Tokens
  {
    id: 'save-tokens',
    category: 'Design & Tokens',
    label: 'Save Preset / Export JSON',
    description: 'Trigger design token preset save dialog',
    keys: ['Ctrl', 'S'],
    actionId: 'save_tokens',
  },
  {
    id: 'toggle-theme-mode',
    category: 'Design & Tokens',
    label: 'Toggle Light / Dark Mode',
    description: 'Switch global design tokens theme mode',
    keys: ['Ctrl', 'Shift', 'L'],
    actionId: 'toggle_theme',
  },
  {
    id: 'toggle-reduced-motion',
    category: 'Design & Tokens',
    label: 'Toggle Reduced Motion (A11y)',
    description: 'Toggle WCAG reduced motion simulation flag',
    keys: ['Ctrl', 'Shift', 'M'],
    actionId: 'toggle_motion',
  },

  // Simulation States
  {
    id: 'sim-idle',
    category: 'Simulation',
    label: 'State: Reset to Live Idle',
    description: 'Reset button to live pointer interactions',
    keys: ['Alt', '0'],
    actionId: 'sim_idle',
  },
  {
    id: 'sim-hover',
    category: 'Simulation',
    label: 'State: Force Hover',
    description: 'Freeze button in hover elevation & glow state',
    keys: ['Alt', '1'],
    actionId: 'sim_hover',
  },
  {
    id: 'sim-active',
    category: 'Simulation',
    label: 'State: Force Active / Pressed',
    description: 'Freeze button in compressed active state',
    keys: ['Alt', '2'],
    actionId: 'sim_active',
  },
  {
    id: 'sim-focus',
    category: 'Simulation',
    label: 'State: Force Focus Ring',
    description: 'Display accessibility high-contrast focus ring',
    keys: ['Alt', '3'],
    actionId: 'sim_focus',
  },
  {
    id: 'sim-loading',
    category: 'Simulation',
    label: 'State: Force Loading Spinner',
    description: 'Test async pending spinner and disabled state',
    keys: ['Alt', '4'],
    actionId: 'sim_loading',
  },
  {
    id: 'sim-success',
    category: 'Simulation',
    label: 'State: Force Success State',
    description: 'Trigger kinetic success celebration pop and checkmark',
    keys: ['Alt', '5'],
    actionId: 'sim_success',
  },
  {
    id: 'sim-error',
    category: 'Simulation',
    label: 'State: Force Error State',
    description: 'Trigger physics shake and destructive state',
    keys: ['Alt', '6'],
    actionId: 'sim_error',
  },
];

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteAction?: (actionId: string) => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  onExecuteAction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  const categories = useMemo(() => {
    return ['all', 'General', 'Components', 'Design & Tokens', 'Export & Code', 'Simulation'];
  }, []);

  const filteredShortcuts = useMemo(() => {
    return SHORTCUTS_DATA.filter(item => {
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;
      const matchesQuery =
        item.label.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.keys.some(k => k.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const renderKeyBadge = (key: string) => {
    let display = key;
    if (isMac && key === 'Ctrl') display = '⌘';
    if (isMac && key === 'Alt') display = '⌥';
    if (isMac && key === 'Shift') display = '⇧';

    if (key === 'or') {
      return (
        <span key={key} className="text-neutral-500 text-[10px] font-sans px-0.5">
          or
        </span>
      );
    }

    return (
      <kbd
        key={key}
        className="px-2 py-1 rounded bg-neutral-800 text-neutral-200 border border-neutral-700 font-mono text-[11px] font-semibold shadow-sm inline-flex items-center justify-center min-w-[22px]"
      >
        {display}
      </kbd>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden text-neutral-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Keyboard Shortcuts & Power Controls</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {isMac ? 'macOS (⌘)' : 'Windows / Linux (Ctrl)'}
                </span>
              </h2>
              <p className="text-[11px] text-neutral-400">
                Speed up development with keyboard commands and kinetic shortcuts
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-3 border-b border-neutral-800 bg-neutral-900/90 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search shortcuts (e.g. Export, Prompt, State, Duplicate)..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                {cat === 'all' ? 'All Shortcuts' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Shortcuts List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredShortcuts.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 text-xs">
              No shortcuts found matching &quot;{searchQuery}&quot;
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-1.5">
              {filteredShortcuts.map(item => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 hover:border-neutral-700 flex items-center justify-between gap-3 group transition-colors"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 group-hover:text-cyan-400 transition-colors mt-0.5">
                      <Zap className="w-3 h-3" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-neutral-200 group-hover:text-white">
                          {item.label}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-neutral-900 text-neutral-400 border border-neutral-800">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.actionId && onExecuteAction && (
                      <button
                        type="button"
                        onClick={() => {
                          onExecuteAction(item.actionId!);
                          onClose();
                        }}
                        className="opacity-0 group-hover:opacity-100 text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900 transition-all font-medium"
                      >
                        Run Now
                      </button>
                    )}
                    <div className="flex items-center gap-1">{item.keys.map(renderKeyBadge)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Press <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-white font-mono text-[10px]">?</kbd> anywhere to open overlay</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
