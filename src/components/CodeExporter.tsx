import React, { useState, useMemo, useEffect } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  Layers,
  Sparkles,
  CheckSquare,
  Square,
  FileJson,
  PackageCheck,
  Wind,
  Palette,
  FileCode,
  Rocket,
  Search,
  Plus,
  ArrowRight,
  Play,
  FolderArchive,
  Loader2,
  Folder,
  File,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AIButtonStudioComponent, DesignTokens } from '../types';
import {
  generateReactCode,
  generateHtmlCssCode,
  generateVueCode,
  generateBundledReactCode,
  generateBundledJson,
  generateBundledHtmlCssCode,
  generateBundledVueCode,
  generateTailwindCode,
  generateBundledTailwindCode,
  generateCssModuleCode,
  generateBundledCssModuleCode,
  generateComponentBundleZip,
  generateReactWithCssModule,
} from '../utils/codeGenerators';

interface CodeExporterProps {
  component?: AIButtonStudioComponent;
  components: AIButtonStudioComponent[];
  tokens: DesignTokens;
  activeComponentId?: string;
}

type FrameworkTab = 'react' | 'tailwind' | 'css-module' | 'json' | 'html' | 'vue';

export const CodeExporter: React.FC<CodeExporterProps> = ({
  component,
  components = [],
  tokens,
  activeComponentId,
}) => {
  const [tab, setTab] = useState<FrameworkTab>('react');
  const [copied, setCopied] = useState(false);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [showZipTree, setShowZipTree] = useState(false);
  const [zipSuccessMessage, setZipSuccessMessage] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    components.length > 0 ? components.map(c => c.id) : component ? [component.id] : []
  );

  // Synchronize when new components are added to the studio
  useEffect(() => {
    if (components.length > 0) {
      setSelectedIds(prev => {
        // Keep existing valid selections, or if none selected, select all
        const valid = prev.filter(id => components.some(c => c.id === id));
        return valid.length > 0 ? valid : components.map(c => c.id);
      });
    }
  }, [components]);

  // Filter selected components list
  const selectedComponents = useMemo(() => {
    return components.filter(c => selectedIds.includes(c.id));
  }, [components, selectedIds]);

  // Toggle single component selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Selection presets
  const handleSelectAll = () => {
    setSelectedIds(components.map(c => c.id));
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleSelectActiveOnly = () => {
    const targetId = activeComponentId || (component ? component.id : components[0]?.id);
    if (targetId) {
      setSelectedIds([targetId]);
    }
  };

  // Generate code dynamically based on active tab and selected components
  const currentCode = useMemo(() => {
    if (selectedComponents.length === 0) {
      return `/* ==========================================================================
 * AI Button Studio - Export Notice
 * No components currently selected.
 * Please select one or more buttons from the component checklist above.
 * ========================================================================== */`;
    }

    const isSingle = selectedComponents.length === 1;

    switch (tab) {
      case 'react':
        return isSingle
          ? generateReactCode(selectedComponents[0], tokens)
          : generateBundledReactCode(selectedComponents, tokens, 'ButtonBundle');
      case 'tailwind':
        return isSingle
          ? generateTailwindCode(selectedComponents[0], tokens)
          : generateBundledTailwindCode(selectedComponents, tokens);
      case 'css-module':
        return isSingle
          ? generateCssModuleCode(selectedComponents[0], tokens)
          : generateBundledCssModuleCode(selectedComponents, tokens);
      case 'json':
        return isSingle
          ? JSON.stringify(selectedComponents[0], null, 2)
          : generateBundledJson(selectedComponents, tokens, 'AI Button Studio Export');
      case 'html':
        return isSingle
          ? generateHtmlCssCode(selectedComponents[0], tokens)
          : generateBundledHtmlCssCode(selectedComponents, tokens);
      case 'vue':
        return isSingle
          ? generateVueCode(selectedComponents[0], tokens)
          : generateBundledVueCode(selectedComponents, tokens);
    }
  }, [tab, selectedComponents, tokens]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingleFile = () => {
    if (selectedComponents.length === 0) return;

    let ext = 'tsx';
    let mime = 'text/plain;charset=utf-8';
    if (tab === 'react') {
      ext = 'tsx';
    } else if (tab === 'tailwind') {
      ext = 'tailwind.ts';
    } else if (tab === 'css-module') {
      ext = 'module.css';
      mime = 'text/css;charset=utf-8';
    } else if (tab === 'json') {
      ext = 'json';
      mime = 'application/json;charset=utf-8';
    } else if (tab === 'html') {
      ext = 'html';
      mime = 'text/html;charset=utf-8';
    } else if (tab === 'vue') {
      ext = 'vue';
    }

    const isSingle = selectedComponents.length === 1;
    const baseName = isSingle
      ? selectedComponents[0].content.label.toLowerCase().replace(/\s+/g, '-') || 'living-button'
      : `button-bundle-${selectedComponents.length}-items`;

    const filename = `${baseName}.${ext}`;
    const blob = new Blob([currentCode], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Multi-Component ZIP Download Handler
  const handleDownloadZipPackage = async () => {
    if (selectedComponents.length === 0 || isGeneratingZip) return;

    try {
      setIsGeneratingZip(true);
      const zipBlob = await generateComponentBundleZip(selectedComponents, tokens);
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      const count = selectedComponents.length;
      link.download = `button-studio-bundle-${count}-components.zip`;
      link.click();
      URL.revokeObjectURL(url);

      setZipSuccessMessage(true);
      setTimeout(() => setZipSuccessMessage(false), 4000);
    } catch (err) {
      console.error('Failed to generate ZIP package:', err);
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const lineCount = useMemo(() => currentCode.split('\n').length, [currentCode]);
  const byteSize = useMemo(() => new Blob([currentCode]).size, [currentCode]);

  // Projected ZIP file list for preview
  const zipPreviewFiles = useMemo(() => {
    if (selectedComponents.length === 0) return [];

    const files: { path: string; desc: string; type: 'code' | 'css' | 'config' | 'doc' }[] = [
      { path: 'README.md', desc: 'Integration guide & ethical license registry', type: 'doc' },
      { path: 'package.json', desc: 'Package configuration & peer dependencies', type: 'config' },
      { path: 'src/tokens/designTokens.json', desc: 'Studio token values and timings', type: 'config' },
      { path: 'src/tokens/tokens.css', desc: 'Root CSS custom properties', type: 'css' },
      { path: 'src/components/index.ts', desc: 'Barrel export for all components', type: 'code' },
    ];

    selectedComponents.forEach(c => {
      const { componentName } = generateReactWithCssModule(c, tokens);
      files.push({
        path: `src/components/${componentName}.tsx`,
        desc: `React component for "${c.content.label}"`,
        type: 'code',
      });
      files.push({
        path: `src/components/${componentName}.module.css`,
        desc: `Scoped CSS Module for "${c.content.label}"`,
        type: 'css',
      });
    });

    return files;
  }, [selectedComponents, tokens]);

  const renderIconBadge = (iconName?: string) => {
    switch (iconName) {
      case 'rocket':
        return <Rocket className="w-3 h-3 text-cyan-400" />;
      case 'sparkles':
        return <Sparkles className="w-3 h-3 text-amber-400" />;
      case 'search':
        return <Search className="w-3 h-3 text-sky-400" />;
      case 'plus':
        return <Plus className="w-3 h-3 text-emerald-400" />;
      case 'arrow-right':
        return <ArrowRight className="w-3 h-3 text-indigo-400" />;
      case 'check':
        return <Check className="w-3 h-3 text-emerald-400" />;
      case 'play':
        return <Play className="w-3 h-3 text-teal-400" />;
      default:
        return <Sparkles className="w-3 h-3 text-cyan-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full gap-2.5">
      {/* Top Controls: Framework / Format Selection & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Framework Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-neutral-950 p-0.5 rounded-lg border border-neutral-800">
          <button
            type="button"
            onClick={() => setTab('react')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${
              tab === 'react'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Code2 className="w-3 h-3" />
            <span>React (TSX)</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('tailwind')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${
              tab === 'tailwind'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Wind className="w-3 h-3 text-sky-400" />
            <span>Tailwind CSS</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('css-module')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${
              tab === 'css-module'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Palette className="w-3 h-3 text-purple-400" />
            <span>CSS Module</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('json')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${
              tab === 'json'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileJson className="w-3 h-3 text-amber-400" />
            <span>Bundled JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('html')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${
              tab === 'html'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileCode className="w-3 h-3" />
            <span>HTML + CSS</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('vue')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${
              tab === 'vue'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-3 h-3 text-emerald-400" />
            <span>Vue 3 SFC</span>
          </button>
        </div>

        {/* Action Buttons: Copy, Single Download, and Multi-Component ZIP Export */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            disabled={selectedComponents.length === 0}
            className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-300 text-xs font-medium flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadSingleFile}
            disabled={selectedComponents.length === 0}
            className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-300 text-xs font-medium flex items-center gap-1 transition-colors"
            title="Download Single File"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download File</span>
          </button>

          {/* Primary Multi-Component ZIP Exporter Button */}
          <button
            type="button"
            onClick={handleDownloadZipPackage}
            disabled={selectedComponents.length === 0 || isGeneratingZip}
            className="px-3 py-1 rounded-md bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-950/60 transition-all"
            title="Generate and download .ZIP package with separate React & CSS Module files for each selected component"
          >
            {isGeneratingZip ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            ) : (
              <FolderArchive className="w-3.5 h-3.5 text-cyan-200" />
            )}
            <span>{isGeneratingZip ? 'Compiling ZIP...' : `Download .ZIP Package (${selectedComponents.length})`}</span>
          </button>
        </div>
      </div>

      {/* Multi-Component Selection & Filter Bar */}
      <div className="bg-neutral-950/90 rounded-lg border border-neutral-800 p-2 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold text-neutral-200">
              Bundle Selection:
            </span>
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-semibold">
              {selectedComponents.length} of {components.length} Selected
            </span>

            {/* Toggle ZIP Package Manifest / Tree View */}
            {selectedComponents.length > 0 && (
              <button
                type="button"
                onClick={() => setShowZipTree(!showZipTree)}
                className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-cyan-300 border border-neutral-700/80 flex items-center gap-1 transition-colors"
                title="Preview files that will be bundled in the .ZIP download"
              >
                <FolderArchive className="w-2.5 h-2.5 text-indigo-400" />
                <span>{showZipTree ? 'Hide ZIP Contents' : 'Preview ZIP Tree'}</span>
                {showZipTree ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-1.5 py-0.5 rounded text-neutral-400 hover:text-cyan-300 hover:bg-neutral-900 transition-colors"
            >
              All
            </button>
            <span className="text-neutral-600">|</span>
            <button
              type="button"
              onClick={handleSelectActiveOnly}
              className="px-1.5 py-0.5 rounded text-neutral-400 hover:text-amber-300 hover:bg-neutral-900 transition-colors"
            >
              Active Only
            </button>
            <span className="text-neutral-600">|</span>
            <button
              type="button"
              onClick={handleDeselectAll}
              className="px-1.5 py-0.5 rounded text-neutral-400 hover:text-rose-300 hover:bg-neutral-900 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Horizontal Component Selection Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-neutral-800">
          {components.map(c => {
            const isSelected = selectedIds.includes(c.id);
            const isActive = c.id === activeComponentId;

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleToggleSelect(c.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-all border ${
                  isSelected
                    ? 'bg-neutral-900 text-neutral-100 border-cyan-500/50 shadow-sm'
                    : 'bg-neutral-950/50 text-neutral-500 border-neutral-850 hover:border-neutral-700 hover:text-neutral-300'
                } ${isActive ? 'ring-1 ring-amber-400/60' : ''}`}
                title={`Toggle ${c.content.label} (${c.id})`}
              >
                {isSelected ? (
                  <CheckSquare className="w-3 h-3 text-cyan-400" />
                ) : (
                  <Square className="w-3 h-3 text-neutral-600" />
                )}
                {renderIconBadge(c.content.icon_name)}
                <span className="max-w-[110px] truncate font-medium">{c.content.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" title="Active in Studio" />
                )}
              </button>
            );
          })}
        </div>

        {/* ZIP Tree Preview Accordion */}
        {showZipTree && selectedComponents.length > 0 && (
          <div className="mt-1 p-2.5 rounded-lg bg-neutral-900/90 border border-indigo-500/30 flex flex-col gap-1.5 text-[11px] animate-fadeIn">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5">
              <span className="font-semibold text-indigo-200 flex items-center gap-1">
                <FolderArchive className="w-3.5 h-3.5 text-indigo-400" />
                Package Structure ({zipPreviewFiles.length} files generated)
              </span>
              <button
                type="button"
                onClick={handleDownloadZipPackage}
                disabled={isGeneratingZip}
                className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-semibold flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                <span>Download .ZIP</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 font-mono text-[10px] max-h-48 overflow-y-auto pr-1">
              {zipPreviewFiles.map(f => (
                <div
                  key={f.path}
                  className="flex items-center justify-between gap-2 p-1.5 rounded bg-neutral-950/80 border border-neutral-800"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {f.type === 'code' ? (
                      <Code2 className="w-3 h-3 text-cyan-400 shrink-0" />
                    ) : f.type === 'css' ? (
                      <Palette className="w-3 h-3 text-purple-400 shrink-0" />
                    ) : f.type === 'doc' ? (
                      <File className="w-3 h-3 text-amber-400 shrink-0" />
                    ) : (
                      <FileJson className="w-3 h-3 text-emerald-400 shrink-0" />
                    )}
                    <span className="text-neutral-200 font-semibold truncate">{f.path}</span>
                  </div>
                  <span className="text-[9px] text-neutral-400 shrink-0 truncate max-w-[120px]">
                    {f.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ZIP Success Message Banner */}
        {zipSuccessMessage && (
          <div className="flex items-center gap-1.5 p-2 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              ZIP bundle successfully generated and downloaded with separate React and CSS Module files!
            </span>
          </div>
        )}
      </div>

      {/* Code Editor Preview */}
      <div className="relative flex-1 min-h-[320px] flex flex-col">
        {/* Code Metadata Sub-header */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-900/90 rounded-t-lg border-t border-x border-neutral-800 text-[10px] font-mono text-neutral-400">
          <span>
            {tab === 'react'
              ? selectedComponents.length > 1
                ? 'ButtonBundle.tsx (Multi-Button TSX)'
                : `${toCamelOrPascal(selectedComponents[0]?.content.label || 'LivingButton')}.tsx`
              : tab === 'tailwind'
              ? selectedComponents.length > 1
                ? 'ButtonBundle.tailwind.ts'
                : `${toCamelOrPascal(selectedComponents[0]?.content.label || 'LivingButton')}.tailwind.ts`
              : tab === 'css-module'
              ? selectedComponents.length > 1
                ? 'ButtonBundle.module.css'
                : `${toCamelOrPascal(selectedComponents[0]?.content.label || 'LivingButton')}.module.css`
              : tab === 'json'
              ? selectedComponents.length > 1
                ? 'bundle-ir.json'
                : `${selectedComponents[0]?.id || 'button'}.json`
              : tab === 'html'
              ? 'living-buttons.html'
              : 'LivingButtons.vue'}
          </span>
          <div className="flex items-center gap-2">
            <span>{lineCount} lines</span>
            <span>•</span>
            <span>{(byteSize / 1024).toFixed(1)} KB</span>
          </div>
        </div>

        <pre className="w-full flex-1 p-3 bg-neutral-950 rounded-b-lg border border-neutral-800 font-mono text-[11px] leading-relaxed text-neutral-200 overflow-auto select-all">
          <code>{currentCode}</code>
        </pre>
      </div>

      {/* Footer Info & Watermark */}
      <div className="flex items-center justify-between text-[10px] text-neutral-400">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>
            {tab === 'tailwind'
              ? 'Includes ready-to-copy utility strings, state breakdowns, and @apply rules'
              : tab === 'css-module'
              ? 'Includes scoped CSS variables, keyframe animations, and reduced motion queries'
              : selectedComponents.length > 1
              ? `Bundled ${selectedComponents.length} components with shared timing & physics`
              : 'Includes automated header credit watermark'}
          </span>
        </span>
        <span className="font-mono">
          {selectedComponents.length > 1
            ? `${Array.from(new Set(selectedComponents.map(c => c.attribution.license_type))).join(', ')} Licenses`
            : `${selectedComponents[0]?.attribution?.license_type || 'MIT'} License`}
        </span>
      </div>
    </div>
  );
};

function toCamelOrPascal(str: string): string {
  return (
    str
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join('') || 'LivingButton'
  );
}
