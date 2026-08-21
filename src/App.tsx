import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sparkles,
  Layers,
  FileJson,
  Code2,
  BookOpen,
  Sliders,
  Terminal,
  Compass,
  Cpu,
  GitBranch,
  CheckCircle,
  HelpCircle,
  Maximize2,
} from 'lucide-react';
import {
  AIButtonStudioComponent,
  ButtonStateType,
  DesignTokens,
  AuditLog,
  GridSection,
} from './types';
import { PRESET_COMPONENTS } from './data/presetButtons';
import { parsePromptToComponent } from './utils/parser';
import { auditComponentAccessibility } from './utils/a11yAuditor';
import { GridStage } from './components/GridStage';
import { PromptWorkspace } from './components/PromptWorkspace';
import { StateSimulationPanel } from './components/StateSimulationPanel';
import { DesignTokenEditor } from './components/DesignTokenEditor';
import { JsonInspector } from './components/JsonInspector';
import { CodeExporter } from './components/CodeExporter';
import { DocWiki } from './components/DocWiki';
import { AuditTerminal } from './components/AuditTerminal';
import { ActionModals } from './components/ActionModals';

export const App: React.FC = () => {
  // 1. Core Component Collection State
  const [components, setComponents] = useState<AIButtonStudioComponent[]>(PRESET_COMPONENTS);
  const [activeComponentId, setActiveComponentId] = useState<string>(PRESET_COMPONENTS[0].id);

  // 2. Simulation and Token State
  const [forcedState, setForcedState] = useState<ButtonStateType | null>(null);
  const [tokens, setTokens] = useState<DesignTokens>({
    primaryHue: 210,
    accentColor: '#0284c7',
    borderRadius: 9999, // Pill by default
    borderThickness: 2,
    rgbDuration: 4,
    shadowIntensity: 0.45,
    timingPreset: 'springy',
    transitionTiming: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    reducedMotion: false,
    themeMode: 'dark',
  });

  // 3. Right Sidebar Tab State ('json' | 'code' | 'docs')
  const [activeRightTab, setActiveRightTab] = useState<'json' | 'code' | 'docs'>('json');

  // 4. Audit Logs State
  const [logs, setLogs] = useState<AuditLog[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      category: 'PARSER',
      level: 'info',
      message: 'AI Button Studio Living Playground initialized with 5 preset IR components.',
    },
    {
      id: 'init-2',
      timestamp: new Date().toLocaleTimeString(),
      category: 'A11Y',
      level: 'success',
      message: 'Inclusive A11y Engine active. Automated ARIA synthesis and contrast validation enabled.',
    },
    {
      id: 'init-3',
      timestamp: new Date().toLocaleTimeString(),
      category: 'CREDIT',
      level: 'info',
      message: 'Ethical Attribution Registry loaded: All generated code watermarked under open licenses.',
    },
  ]);

  // 5. Action Modal Trigger State
  const [activeModal, setActiveModal] = useState<{
    type: string;
    target: string;
    component: AIButtonStudioComponent;
  } | null>(null);

  // Active Component
  const activeComponent = useMemo(
    () => components.find(c => c.id === activeComponentId) || components[0],
    [components, activeComponentId]
  );

  // Live A11y Audit calculation
  const a11yAudit = useMemo(
    () => auditComponentAccessibility(activeComponent, tokens),
    [activeComponent, tokens]
  );

  const addLog = useCallback(
    (category: AuditLog['category'], message: string, level: AuditLog['level'] = 'info') => {
      const newEntry: AuditLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date().toLocaleTimeString(),
        category,
        level,
        message,
      };
      setLogs(prev => [...prev, newEntry]);
    },
    []
  );

  // Parse prompt and update active component
  const handleParsePrompt = (promptText: string) => {
    const { component: parsed, logs: parseLogs } = parsePromptToComponent(promptText, activeComponentId);

    // Update the component in the list
    setComponents(prev => prev.map(c => (c.id === activeComponentId ? parsed : c)));

    // Emit logs to terminal
    parseLogs.forEach(l => addLog('PARSER', l, 'info'));
    addLog('A11Y', `Audited ARIA label: "${parsed.accessibility.aria_label}"`, 'success');
  };

  // Cell click on the 16:9 grid canvas to move or place
  const handleCellClick = (gridId: string) => {
    const row = parseInt(gridId.charAt(1), 10);
    const col = parseInt(gridId.charAt(3), 10);
    let section: GridSection = 'Hero';
    if (row === 1) section = 'Header';
    else if (row === 2) section = 'Hero';
    else if (row === 3) section = col <= 2 ? 'Content_Left' : 'Content_Right';
    else if (row === 4) section = 'Footer';

    const updated = {
      ...activeComponent,
      location: {
        grid_id: gridId,
        section,
      },
    };

    setComponents(prev => prev.map(c => (c.id === activeComponentId ? updated : c)));
    addLog('ACTION', `Repositioned [${activeComponent.content.label}] to ${gridId} (${section})`, 'info');
  };

  // Add new component
  const handleAddNewComponent = () => {
    const newId = `btn-${Date.now().toString(36)}`;
    const newComp: AIButtonStudioComponent = {
      id: newId,
      type: 'primary',
      location: {
        grid_id: 'R3C3',
        section: 'Content_Right',
      },
      content: {
        label: `Custom Action ${components.length + 1}`,
        icon_name: 'sparkles',
      },
      action: {
        type: 'open_modal',
        target: `Modal_${newId}`,
      },
      effects: {
        base_style: 'outline_rgb',
        special_features: ['rgb_running_border', 'dynamic_shadow_cursor_tracking'],
      },
      accessibility: {
        aria_label: `Custom interactive button ${components.length + 1}`,
        tab_index: 0,
        reduce_motion_safe: true,
      },
      attribution: {
        credit_owner: 'Studio Creator',
        license_type: 'MIT',
        source_repository: 'https://github.com/mutiagent-base/ai-button-studio-app-design',
      },
    };

    setComponents(prev => [...prev, newComp]);
    setActiveComponentId(newId);
    addLog('PARSER', `Created new component "${newComp.content.label}" [${newId}]`, 'success');
  };

  // Handle Action Trigger
  const handleTriggerAction = (actionType: string, target: string, component: AIButtonStudioComponent) => {
    addLog('ACTION', `Execution trigger: ${actionType} -> ${target} (by ${component.content.label})`, 'success');
    setActiveModal({ type: actionType, target, component });
  };

  // Update Design Tokens
  const handleUpdateTokens = (updated: Partial<DesignTokens>) => {
    setTokens(prev => ({ ...prev, ...updated }));
    addLog('STATE', `Updated design tokens: ${Object.keys(updated).join(', ')}`, 'info');
  };

  // Sync JSON IR
  const handleUpdateFromJson = (updated: AIButtonStudioComponent) => {
    setComponents(prev => prev.map(c => (c.id === updated.id ? updated : c)));
    setActiveComponentId(updated.id);
    addLog('PARSER', `JSON IR synchronized: ${updated.id}`, 'success');
  };

  return (
    <div className={`min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans ${tokens.themeMode === 'light' ? 'theme-light' : ''}`}>
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-sky-600 to-indigo-600 p-0.5 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <div className="w-full h-full bg-neutral-950 rounded-[7px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <span>AI Button Studio</span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  v2.4 LIVING
                </span>
              </h1>
            </div>
            <p className="text-[10px] text-neutral-400 hidden sm:block">
              Living Playground & Developer Hub • 6-State Machines & Kinetic Physics
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2.5">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>JSON IR Compiler: ONLINE</span>
          </div>

          <a
            href="https://github.com/mutiagent-base/ai-button-studio-app-design"
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Repository</span>
          </a>
        </div>
      </header>

      {/* Main 4-Column Workspace Grid */}
      <main className="flex-1 p-3 sm:p-4 max-w-[1700px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* LEFT COLUMN: Control Center & Prompt Workspace (4 cols on lg) */}
        <section className="lg:col-span-4 flex flex-col gap-3">
          <PromptWorkspace
            onParsePrompt={handleParsePrompt}
            activeComponent={activeComponent}
            components={components}
            onSelectComponent={setActiveComponentId}
            onAddNewComponent={handleAddNewComponent}
          />

          <StateSimulationPanel
            forcedState={forcedState}
            onSetForcedState={st => {
              setForcedState(st);
              if (st) addLog('STATE', `Forced state transition -> "${st.toUpperCase()}"`, 'info');
              else addLog('STATE', `Reset to live dynamic interaction`, 'info');
            }}
            activeComponentLabel={activeComponent.content.label}
          />

          <DesignTokenEditor
            tokens={tokens}
            onChangeTokens={handleUpdateTokens}
          />
        </section>

        {/* CENTER COLUMN: The 16:9 Grid Stage (5 cols on lg) */}
        <section className="lg:col-span-5 flex flex-col gap-3">
          <GridStage
            components={components}
            activeComponentId={activeComponentId}
            forcedState={forcedState}
            tokens={tokens}
            onSelectComponent={setActiveComponentId}
            onCellClick={handleCellClick}
            onTriggerAction={handleTriggerAction}
          />

          {/* Quick Stats & Active Inspector Card */}
          <div className="bg-neutral-900/60 rounded-xl border border-neutral-800 p-3 flex items-center justify-between text-xs backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="text-neutral-400">Selected ID:</span>
              <span className="font-mono text-cyan-300 font-semibold">{activeComponent.id}</span>
              <span className="text-neutral-400">Type:</span>
              <span className="font-mono uppercase text-indigo-300">{activeComponent.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-400">A11y:</span>
              <span className="font-bold text-emerald-400 font-mono">{a11yAudit.score}%</span>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Code Inspector & Documentation Wiki (3 cols on lg) */}
        <section className="lg:col-span-3 flex flex-col gap-3 bg-neutral-900/70 rounded-xl border border-neutral-800 p-3.5 min-h-[580px] backdrop-blur-sm">
          {/* Tabs */}
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveRightTab('json')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  activeRightTab === 'json'
                    ? 'bg-neutral-800 text-amber-300 border border-neutral-700 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <FileJson className="w-3.5 h-3.5" />
                <span>JSON IR</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveRightTab('code')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  activeRightTab === 'code'
                    ? 'bg-neutral-800 text-cyan-300 border border-neutral-700 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveRightTab('docs')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  activeRightTab === 'docs'
                    ? 'bg-neutral-800 text-emerald-300 border border-neutral-700 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Specs Wiki</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 flex flex-col pt-1">
            {activeRightTab === 'json' && (
              <JsonInspector
                component={activeComponent}
                onUpdateComponent={handleUpdateFromJson}
              />
            )}
            {activeRightTab === 'code' && (
              <CodeExporter
                component={activeComponent}
                tokens={tokens}
              />
            )}
            {activeRightTab === 'docs' && <DocWiki />}
          </div>
        </section>
      </main>

      {/* BOTTOM BAR: Ethical Registry & Audit Console */}
      <footer className="p-3 sm:p-4 max-w-[1700px] w-full mx-auto">
        <AuditTerminal
          logs={logs}
          a11yAudit={a11yAudit}
          onClearLogs={() => setLogs([])}
        />
      </footer>

      {/* Interactive Action Modals */}
      <ActionModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
};
export default App;
