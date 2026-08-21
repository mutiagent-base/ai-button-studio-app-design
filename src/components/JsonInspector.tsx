import React, { useState, useEffect } from 'react';
import { FileJson, Check, Copy, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { AIButtonStudioComponent } from '../types';

interface JsonInspectorProps {
  component: AIButtonStudioComponent;
  onUpdateComponent: (updated: AIButtonStudioComponent) => void;
}

export const JsonInspector: React.FC<JsonInspectorProps> = ({
  component,
  onUpdateComponent,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setJsonText(JSON.stringify(component, null, 2));
    setError(null);
  }, [component]);

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText) as AIButtonStudioComponent;
      if (!parsed.id || !parsed.location || !parsed.content || !parsed.action || !parsed.effects) {
        throw new Error('Missing required schema fields (id, location, content, action, effects)');
      }
      setError(null);
      onUpdateComponent(parsed);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON syntax');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <FileJson className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
            JSON Intermediate Representation (IR)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Apply Sync</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-2 rounded bg-rose-950/80 border border-rose-600/50 text-rose-300 text-xs flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="relative flex-1 min-h-[300px]">
        <textarea
          value={jsonText}
          onChange={e => {
            setJsonText(e.target.value);
            setError(null);
          }}
          className="w-full h-full p-3 bg-neutral-950 rounded-lg border border-neutral-800 focus:border-cyan-500 font-mono text-[11px] leading-relaxed text-cyan-300 selection:bg-cyan-500/30 resize-none focus:outline-none"
          spellCheck={false}
        />
      </div>

      <div className="text-[10px] text-neutral-400 flex items-center justify-between">
        <span>Strict Schema: RFC-Draft-07 AIButtonStudioComponent</span>
        <span>Bi-directional IR Sync</span>
      </div>
    </div>
  );
};
