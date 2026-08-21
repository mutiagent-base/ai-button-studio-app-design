import React, { useState } from 'react';
import { Code2, Copy, Check, Download, Layers, Sparkles } from 'lucide-react';
import { AIButtonStudioComponent, DesignTokens } from '../types';
import { generateReactCode, generateHtmlCssCode, generateVueCode } from '../utils/codeGenerators';

interface CodeExporterProps {
  component: AIButtonStudioComponent;
  tokens: DesignTokens;
}

type FrameworkTab = 'react' | 'html' | 'vue';

export const CodeExporter: React.FC<CodeExporterProps> = ({ component, tokens }) => {
  const [tab, setTab] = useState<FrameworkTab>('react');
  const [copied, setCopied] = useState(false);

  const getCode = () => {
    switch (tab) {
      case 'react':
        return generateReactCode(component, tokens);
      case 'html':
        return generateHtmlCssCode(component, tokens);
      case 'vue':
        return generateVueCode(component, tokens);
    }
  };

  const currentCode = getCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = tab === 'react' ? 'tsx' : tab === 'html' ? 'html' : 'vue';
    const filename = `${component.content.label.toLowerCase().replace(/\s+/g, '-') || 'living-button'}.${ext}`;
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full gap-2.5">
      <div className="flex items-center justify-between">
        {/* Framework Selector Tabs */}
        <div className="flex items-center gap-1 bg-neutral-950 p-0.5 rounded-lg border border-neutral-800">
          <button
            type="button"
            onClick={() => setTab('react')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              tab === 'react'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            React (TSX)
          </button>
          <button
            type="button"
            onClick={() => setTab('html')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              tab === 'html'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            HTML + CSS
          </button>
          <button
            type="button"
            onClick={() => setTab('vue')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              tab === 'vue'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Vue 3 SFC
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors"
            title="Download Component File"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Code Editor Preview */}
      <div className="relative flex-1 min-h-[300px]">
        <pre className="w-full h-full p-3 bg-neutral-950 rounded-lg border border-neutral-800 font-mono text-[11px] leading-relaxed text-neutral-200 overflow-auto select-all">
          <code>{currentCode}</code>
        </pre>
      </div>

      <div className="flex items-center justify-between text-[10px] text-neutral-400">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Includes automated header credit watermark</span>
        </span>
        <span className="font-mono">{component.attribution.license_type} License</span>
      </div>
    </div>
  );
};
