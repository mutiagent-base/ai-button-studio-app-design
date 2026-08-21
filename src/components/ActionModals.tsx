import React, { useState } from 'react';
import { X, Search, Rocket, Sparkles, ExternalLink, Check, Terminal, Layers } from 'lucide-react';
import { AIButtonStudioComponent } from '../types';

interface ActionModalProps {
  activeModal: {
    type: string;
    target: string;
    component: AIButtonStudioComponent;
  } | null;
  onClose: () => void;
}

export const ActionModals: React.FC<ActionModalProps> = ({ activeModal, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!activeModal) return null;

  const { type, target, component } = activeModal;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-neutral-900 border border-neutral-700/80 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
                Action Execution Target: {target}
              </h3>
              <p className="text-[11px] text-neutral-400">
                Triggered by: <span className="text-cyan-300 font-semibold">{component.content.label}</span> ({component.id})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content based on Action Type */}
        <div className="p-5">
          {type === 'open_search' ? (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search token parameters, prompt templates, components..."
                  className="w-full pl-9 pr-3 py-2 bg-neutral-950 rounded-lg border border-neutral-700 text-xs text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto font-mono text-xs">
                <div className="p-2 rounded bg-neutral-950/60 border border-neutral-800/80 text-neutral-300 flex items-center justify-between">
                  <span>--btn-radius</span>
                  <span className="text-cyan-400">9999px</span>
                </div>
                <div className="p-2 rounded bg-neutral-950/60 border border-neutral-800/80 text-neutral-300 flex items-center justify-between">
                  <span>--rgb-duration</span>
                  <span className="text-cyan-400">4s (0.8s on hover)</span>
                </div>
                <div className="p-2 rounded bg-neutral-950/60 border border-neutral-800/80 text-neutral-300 flex items-center justify-between">
                  <span>dynamic_shadow_cursor_tracking</span>
                  <span className="text-emerald-400">ACTIVE</span>
                </div>
              </div>
            </div>
          ) : type === 'open_modal' ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Rocket className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-neutral-100">
                Action Sequence Complete
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto">
                Target <code className="text-cyan-300 font-mono">{target}</code> was invoked successfully via the 6-state machine execution cycle.
              </p>
              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 text-left font-mono text-[11px] text-neutral-300 space-y-1">
                <div><span className="text-neutral-400">Action:</span> {type}</div>
                <div><span className="text-neutral-400">Target ID:</span> {target}</div>
                <div><span className="text-neutral-400">A11y Label:</span> {component.accessibility.aria_label}</div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
                <ExternalLink className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-neutral-100">External Navigation Target</h4>
              <p className="text-xs text-neutral-400 font-mono truncate">{target}</p>
              <a
                href={target}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
              >
                <span>Proceed to URL</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-neutral-950/80 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
