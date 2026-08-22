import React, { useState, useEffect, useMemo } from 'react';
import {
  Sliders,
  Sun,
  Moon,
  Shield,
  Activity,
  Bookmark,
  Plus,
  Trash2,
  Check,
  User,
  Folder,
  Users,
  Sparkles,
  Layers,
  Filter,
  Tag,
  X,
  Palette,
  Eye,
  Info,
  Zap,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Move,
} from 'lucide-react';
import {
  DesignTokens,
  AnimationCurvePreset,
  TokenPresetCollection,
  PresetCategory,
  PresetUITag,
} from '../types';
import { ANIMATION_CURVE_PRESETS } from '../data/animationCurves';
import { DEFAULT_TOKEN_PRESETS } from '../data/tokenPresetCollections';
import { analyzeColorPalette, PaletteAnalysisResult } from '../utils/paletteClassifier';

const AVAILABLE_UI_TAGS: PresetUITag[] = ['Primary', 'Destructive', 'Utility', 'Hero / CTA', 'Subtle'];

const PRESET_COLOR_SWATCHES = [
  { name: 'Azure Brand', hue: 210, hex: '#0284c7', archetype: 'Primary' },
  { name: 'Cyber Cyan', hue: 185, hex: '#06b6d4', archetype: 'Primary / CTA' },
  { name: 'Crimson Alert', hue: 345, hex: '#f43f5e', archetype: 'Destructive' },
  { name: 'Emerald Ops', hue: 145, hex: '#10b981', archetype: 'Utility' },
  { name: 'Amber Warning', hue: 45, hex: '#f59e0b', archetype: 'Utility' },
  { name: 'Violet Studio', hue: 255, hex: '#6366f1', archetype: 'Primary' },
  { name: 'Rose Danger', hue: 0, hex: '#ef4444', archetype: 'Destructive' },
];

const getTagConfig = (tag: PresetUITag) => {
  switch (tag) {
    case 'Primary':
      return {
        bg: 'bg-blue-950/70',
        text: 'text-blue-300',
        border: 'border-blue-500/40',
        activeBg: 'bg-blue-600 text-white border-blue-400',
        dot: 'bg-blue-400',
      };
    case 'Destructive':
      return {
        bg: 'bg-rose-950/70',
        text: 'text-rose-300',
        border: 'border-rose-500/40',
        activeBg: 'bg-rose-600 text-white border-rose-400',
        dot: 'bg-rose-400',
      };
    case 'Utility':
      return {
        bg: 'bg-emerald-950/70',
        text: 'text-emerald-300',
        border: 'border-emerald-500/40',
        activeBg: 'bg-emerald-600 text-white border-emerald-400',
        dot: 'bg-emerald-400',
      };
    case 'Hero / CTA':
      return {
        bg: 'bg-amber-950/70',
        text: 'text-amber-300',
        border: 'border-amber-500/40',
        activeBg: 'bg-amber-600 text-white border-amber-400',
        dot: 'bg-amber-400',
      };
    case 'Subtle':
      return {
        bg: 'bg-zinc-800/80',
        text: 'text-zinc-300',
        border: 'border-zinc-600/40',
        activeBg: 'bg-zinc-600 text-white border-zinc-400',
        dot: 'bg-zinc-400',
      };
  }
};

interface MiniPresetThumbnailProps {
  preset: TokenPresetCollection;
}

const MiniPresetThumbnail: React.FC<MiniPresetThumbnailProps> = ({ preset }) => {
  const { tokens } = preset;
  const radius = tokens.borderRadius === 9999 ? '9999px' : `${tokens.borderRadius}px`;
  const isLight = tokens.themeMode === 'light';
  const analysis = analyzeColorPalette(tokens);

  return (
    <div
      className={`p-3 rounded-xl border shadow-2xl flex flex-col items-center gap-2 z-50 w-64 text-left pointer-events-none transition-all duration-200 ${
        isLight
          ? 'bg-slate-900/95 border-slate-700/80 text-white backdrop-blur-md'
          : 'bg-neutral-950/95 border-neutral-700/90 text-white backdrop-blur-md'
      }`}
      style={{
        boxShadow: `0 12px 30px -4px rgba(0, 0, 0, 0.7), 0 0 20px ${tokens.accentColor || '#6366f1'}33`,
      }}
    >
      {/* Thumbnail Header */}
      <div className="flex items-center justify-between w-full text-[10px] border-b border-neutral-800/80 pb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: tokens.accentColor || '#0284c7' }}
          />
          <span className="font-bold text-neutral-100 truncate">{preset.name}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[8.5px] font-mono text-emerald-400 px-1 py-0.2 bg-emerald-950/60 rounded border border-emerald-500/30">
            {analysis.effectiveContrast}:1 {analysis.contrastRating}
          </span>
          <span className="text-[8.5px] font-mono text-cyan-400 uppercase tracking-wider px-1 py-0.2 bg-cyan-950/50 rounded border border-cyan-500/20">
            {tokens.themeMode}
          </span>
        </div>
      </div>

      {/* Rendered Live Mini Button Canvas */}
      <div
        className={`w-full py-3.5 px-2 rounded-lg flex items-center justify-center relative overflow-hidden ${
          isLight ? 'bg-slate-200/90' : 'bg-neutral-900/90'
        }`}
      >
        {/* Glow behind the button */}
        <div
          className="absolute inset-0 blur-lg opacity-50 rounded-full"
          style={{
            background: `radial-gradient(circle, ${tokens.accentColor || '#0284c7'} 0%, transparent 70%)`,
            transform: `scale(${0.9 + tokens.shadowIntensity * 0.4})`,
          }}
        />

        {/* Tiny Button Rendered with Collection's Exact Tokens */}
        <div
          className="relative inline-flex items-center justify-center px-4 py-1.5 text-[11px] font-semibold tracking-wide overflow-hidden select-none"
          style={{
            borderRadius: radius,
            transitionTimingFunction: tokens.transitionTiming || 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: `0 4px 14px rgba(0,0,0, ${0.25 * tokens.shadowIntensity}), 0 0 ${12 * tokens.shadowIntensity}px ${tokens.accentColor || '#0284c7'}55`,
          }}
        >
          {/* Animated Conic Gradient Border */}
          <div
            className="absolute -inset-[150%] animate-spin"
            style={{
              animationDuration: `${tokens.rgbDuration}s`,
              background: `conic-gradient(from 0deg at 50% 50%, #ff0055 0%, #7a00ff 25%, #00e5ff 50%, #00ff66 75%, #ff0055 100%)`,
              opacity: 0.95,
            }}
          />

          {/* Mask / Inner Container */}
          <div
            className="absolute flex items-center justify-center transition-colors"
            style={{
              borderRadius: radius,
              top: `${tokens.borderThickness}px`,
              left: `${tokens.borderThickness}px`,
              right: `${tokens.borderThickness}px`,
              bottom: `${tokens.borderThickness}px`,
              backgroundColor: isLight ? '#ffffff' : '#090d16',
            }}
          />

          {/* Label and Icon */}
          <span
            className="relative z-10 flex items-center gap-1.5 font-medium"
            style={{
              color: isLight ? '#0f172a' : '#ffffff',
            }}
          >
            <Sparkles className="w-3 h-3" style={{ color: tokens.accentColor || '#00e5ff' }} />
            <span>Preset Action</span>
          </span>
        </div>
      </div>

      {/* UI Tags Badge Row in Tooltip */}
      {preset.uiTags && preset.uiTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 w-full">
          {preset.uiTags.map(tag => {
            const cfg = getTagConfig(tag);
            return (
              <span
                key={tag}
                className={`text-[8.5px] px-1.5 py-0.2 rounded font-medium border flex items-center gap-1 ${cfg.bg} ${cfg.text} ${cfg.border}`}
              >
                <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />
                {tag}
              </span>
            );
          })}
        </div>
      )}

      {/* Detailed Token Parameters Spec Strip */}
      <div className="grid grid-cols-3 gap-1 w-full text-[9px] font-mono pt-0.5">
        <div className="flex flex-col items-center bg-neutral-900/80 p-1 rounded border border-neutral-800/60">
          <span className="text-neutral-500 text-[8px]">RADIUS</span>
          <span className="text-neutral-200 font-semibold">{tokens.borderRadius === 9999 ? 'Pill' : `${tokens.borderRadius}px`}</span>
        </div>
        <div className="flex flex-col items-center bg-neutral-900/80 p-1 rounded border border-neutral-800/60">
          <span className="text-neutral-500 text-[8px]">RGB LOOP</span>
          <span className="text-neutral-200 font-semibold">{tokens.rgbDuration}s</span>
        </div>
        <div className="flex flex-col items-center bg-neutral-900/80 p-1 rounded border border-neutral-800/60">
          <span className="text-neutral-500 text-[8px]">SAT / HUE</span>
          <span className="text-cyan-300 font-semibold">{analysis.saturation}% • {analysis.hue}°</span>
        </div>
      </div>

      {/* Description / Summary */}
      <p className="text-[9.5px] text-neutral-400 leading-snug w-full line-clamp-2">
        {preset.description}
      </p>
    </div>
  );
};

const STORAGE_KEY = 'ai_button_studio_custom_token_presets';
const PRESET_ORDER_STORAGE_KEY = 'ai_button_studio_preset_order_v2';

export interface DesignTokenEditorProps {
  tokens: DesignTokens;
  onChangeTokens: (updated: Partial<DesignTokens>) => void;
}

export const DesignTokenEditor: React.FC<DesignTokenEditorProps> = ({
  tokens,
  onChangeTokens,
}) => {
  const activeCurve = ANIMATION_CURVE_PRESETS.find(p => p.id === tokens.timingPreset) || ANIMATION_CURVE_PRESETS[0];

  // Live Auto-Tag & Palette Contrast Analysis
  const paletteAnalysis = useMemo(() => {
    return analyzeColorPalette(tokens);
  }, [tokens]);

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<'all' | PresetCategory>('all');

  // UI Tag filter state (multi-select / toggles)
  const [selectedTags, setSelectedTags] = useState<PresetUITag[]>([]);

  // Show detailed auto-tag rationale banner
  const [showAutoTagDetails, setShowAutoTagDetails] = useState(false);

  // Custom Presets State (saved by user)
  const [customPresets, setCustomPresets] = useState<TokenPresetCollection[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      // Ensure category and uiTags exist for backwards compatibility
      return parsed.map((item: any) => ({
        ...item,
        category: item.category || 'personal',
        uiTags: item.uiTags || ['Primary'],
      }));
    } catch {
      return [];
    }
  });

  // Custom Preset Order state (for drag-and-drop & visual reordering)
  const [presetOrder, setPresetOrder] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(PRESET_ORDER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Drag and drop state for presets
  const [draggingPresetId, setDraggingPresetId] = useState<string | null>(null);
  const [dragOverPresetId, setDragOverPresetId] = useState<string | null>(null);

  // Save dialog / form state
  const [isSavingPreset, setIsSavingPreset] = useState(false);
  const [presetNameInput, setPresetNameInput] = useState('');
  const [presetDescInput, setPresetDescInput] = useState('');
  const [presetCategoryInput, setPresetCategoryInput] = useState<PresetCategory>('personal');
  const [presetTagsInput, setPresetTagsInput] = useState<PresetUITag[]>(['Primary']);

  // Auto-fill tags and category when opening save dialog
  const handleOpenSaveDialog = () => {
    setIsSavingPreset(true);
    setPresetTagsInput(paletteAnalysis.suggestedTags);
    setPresetCategoryInput(paletteAnalysis.suggestedCategory);
  };

  // Persist custom presets
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customPresets));
    } catch (e) {
      console.error('Failed to persist presets to localStorage', e);
    }
  }, [customPresets]);

  // Persist custom preset ordering
  useEffect(() => {
    try {
      if (presetOrder.length > 0) {
        localStorage.setItem(PRESET_ORDER_STORAGE_KEY, JSON.stringify(presetOrder));
      } else {
        localStorage.removeItem(PRESET_ORDER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to persist preset order to localStorage', e);
    }
  }, [presetOrder]);

  const allPresets = useMemo(() => {
    const base = [...DEFAULT_TOKEN_PRESETS, ...customPresets];
    if (presetOrder.length === 0) return base;

    const ordered: TokenPresetCollection[] = [];
    const map = new Map<string, TokenPresetCollection>();
    base.forEach(p => map.set(p.id, p));

    presetOrder.forEach(id => {
      const item = map.get(id);
      if (item) {
        ordered.push(item);
        map.delete(id);
      }
    });

    // Append newly added or non-ordered presets at the end
    map.forEach(item => ordered.push(item));
    return ordered;
  }, [customPresets, presetOrder]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    return {
      all: allPresets.length,
      personal: allPresets.filter(p => p.category === 'personal').length,
      project: allPresets.filter(p => p.category === 'project').length,
      shared: allPresets.filter(p => p.category === 'shared').length,
    };
  }, [allPresets]);

  // Counts by UI tag (within the selected category scope)
  const tagCounts = useMemo(() => {
    const categoryScoped =
      selectedCategory === 'all'
        ? allPresets
        : allPresets.filter(p => p.category === selectedCategory);

    const counts: Record<PresetUITag, number> = {
      Primary: 0,
      Destructive: 0,
      Utility: 0,
      'Hero / CTA': 0,
      Subtle: 0,
    };

    categoryScoped.forEach(p => {
      p.uiTags?.forEach(t => {
        if (counts[t] !== undefined) {
          counts[t]++;
        }
      });
    });

    return counts;
  }, [allPresets, selectedCategory]);

  // Filtered preset list (Category + UI Tag filtering)
  const filteredPresets = useMemo(() => {
    return allPresets.filter(preset => {
      // Category check
      if (selectedCategory !== 'all' && preset.category !== selectedCategory) {
        return false;
      }
      // UI Tag check
      if (selectedTags.length > 0) {
        const presetTags = preset.uiTags || [];
        const hasMatchingTag = selectedTags.some(tag => presetTags.includes(tag));
        if (!hasMatchingTag) return false;
      }
      return true;
    });
  }, [allPresets, selectedCategory, selectedTags]);

  // Reorder preset with arrows
  const handleMovePreset = (presetId: string, direction: 'prev' | 'next', e: React.MouseEvent) => {
    e.stopPropagation();
    const currentList = filteredPresets;
    const currentIndex = currentList.findIndex(p => p.id === presetId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= currentList.length) return;

    const targetPresetId = currentList[targetIndex].id;

    // Apply move to global allPresets order
    const allIds = allPresets.map(p => p.id);
    const sourceIdx = allIds.indexOf(presetId);
    const targetIdx = allIds.indexOf(targetPresetId);

    if (sourceIdx !== -1 && targetIdx !== -1) {
      const newIds = [...allIds];
      const [moved] = newIds.splice(sourceIdx, 1);
      newIds.splice(targetIdx, 0, moved);
      setPresetOrder(newIds);
    }
  };

  // Drag and Drop handlers for presets
  const handleDragStartPreset = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingPresetId(id);
  };

  const handleDragOverPreset = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverPresetId !== id) {
      setDragOverPresetId(id);
    }
  };

  const handleDropPreset = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain') || draggingPresetId;
    setDraggingPresetId(null);
    setDragOverPresetId(null);

    if (!sourceId || sourceId === targetId) return;

    const allIds = allPresets.map(p => p.id);
    const sourceIndex = allIds.indexOf(sourceId);
    const targetIndex = allIds.indexOf(targetId);

    if (sourceIndex !== -1 && targetIndex !== -1) {
      const newIds = [...allIds];
      const [moved] = newIds.splice(sourceIndex, 1);
      newIds.splice(targetIndex, 0, moved);
      setPresetOrder(newIds);
    }
  };

  const handleDragEndPreset = () => {
    setDraggingPresetId(null);
    setDragOverPresetId(null);
  };

  const handleResetPresetOrder = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPresetOrder([]);
    try {
      localStorage.removeItem(PRESET_ORDER_STORAGE_KEY);
    } catch {}
  };

  // Toggle tag filter
  const handleToggleTagFilter = (tag: PresetUITag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleClearTagFilters = () => {
    setSelectedTags([]);
  };

  // Quick apply auto-suggested tags to the preset filter
  const handleApplySuggestedFilter = () => {
    setSelectedTags([...paletteAnalysis.suggestedTags]);
  };

  // Toggle tag in creation form
  const handleToggleFormTag = (tag: PresetUITag) => {
    setPresetTagsInput(prev =>
      prev.includes(tag) ? (prev.length > 1 ? prev.filter(t => t !== tag) : prev) : [...prev, tag]
    );
  };

  // Auto-detect and populate tags from palette in the form
  const handleAutoTagFromPaletteInForm = () => {
    setPresetTagsInput(paletteAnalysis.suggestedTags);
    setPresetCategoryInput(paletteAnalysis.suggestedCategory);
  };

  // Find if current tokens exactly match any known preset
  const currentMatchedPresetId = allPresets.find(p => {
    return (
      p.tokens.borderRadius === tokens.borderRadius &&
      p.tokens.rgbDuration === tokens.rgbDuration &&
      p.tokens.borderThickness === tokens.borderThickness &&
      p.tokens.timingPreset === tokens.timingPreset &&
      p.tokens.themeMode === tokens.themeMode &&
      Math.abs(p.tokens.shadowIntensity - tokens.shadowIntensity) < 0.01
    );
  })?.id;

  const handleSelectCurve = (presetId: AnimationCurvePreset) => {
    const selected = ANIMATION_CURVE_PRESETS.find(p => p.id === presetId);
    if (selected) {
      onChangeTokens({
        timingPreset: selected.id,
        transitionTiming: selected.cssTiming,
      });
    }
  };

  const handleLoadPreset = (preset: TokenPresetCollection) => {
    onChangeTokens({
      ...preset.tokens,
    });
  };

  const handleSaveCurrentPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetNameInput.trim()) return;

    const newPreset: TokenPresetCollection = {
      id: `custom-${Date.now().toString(36)}`,
      name: presetNameInput.trim(),
      description:
        presetDescInput.trim() ||
        `Custom configuration (${tokens.borderRadius === 9999 ? 'Pill' : `${tokens.borderRadius}px`}, ${tokens.rgbDuration}s, ${tokens.timingPreset})`,
      category: presetCategoryInput,
      uiTags: presetTagsInput.length > 0 ? presetTagsInput : ['Primary'],
      isCustom: true,
      badge: presetCategoryInput === 'personal' ? 'PERSONAL' : presetCategoryInput === 'project' ? 'PROJECT' : 'SHARED',
      tokens: { ...tokens },
    };

    setCustomPresets(prev => [newPreset, ...prev]);
    setPresetNameInput('');
    setPresetDescInput('');
    setPresetTagsInput(['Primary']);
    setIsSavingPreset(false);
  };

  const handleDeleteCustomPreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomPresets(prev => prev.filter(p => p.id !== id));
  };

  const getCategoryBadge = (cat: PresetCategory) => {
    switch (cat) {
      case 'personal':
        return {
          label: 'Personal',
          className: 'bg-purple-950/60 text-purple-300 border-purple-500/30',
          icon: <User className="w-2.5 h-2.5" />,
        };
      case 'project':
        return {
          label: 'Project',
          className: 'bg-amber-950/60 text-amber-300 border-amber-500/30',
          icon: <Folder className="w-2.5 h-2.5" />,
        };
      case 'shared':
        return {
          label: 'Shared',
          className: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30',
          icon: <Users className="w-2.5 h-2.5" />,
        };
    }
  };

  return (
    <div className="flex flex-col gap-3.5 bg-neutral-900/70 rounded-xl border border-neutral-800 p-4 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-neutral-200">
              Design Token & Theme Engine
            </h3>
            <p className="text-[11px] text-neutral-400">
              CSS Custom Properties & Kinetic Variable Tuning
            </p>
          </div>
        </div>

        {/* Theme mode toggle */}
        <button
          type="button"
          onClick={() => onChangeTokens({ themeMode: tokens.themeMode === 'dark' ? 'light' : 'dark' })}
          className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors flex items-center gap-1 text-xs"
        >
          {tokens.themeMode === 'dark' ? <Moon className="w-3.5 h-3.5 text-cyan-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          <span className="capitalize">{tokens.themeMode}</span>
        </button>
      </div>

      {/* AUTO-TAGGING & CONTRAST INTELLIGENCE PANEL */}
      <div className="bg-gradient-to-r from-indigo-950/50 via-neutral-950 to-cyan-950/40 p-3 rounded-lg border border-indigo-500/30 flex flex-col gap-2 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-200">
              Palette Auto-Tag Intelligence
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Contrast level badge */}
            <span
              className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded border font-semibold ${
                paletteAnalysis.effectiveContrast >= 4.5
                  ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-950/70 text-amber-300 border-amber-500/40'
              }`}
              title="WCAG 2.1 Contrast Ratio against current background canvas"
            >
              {paletteAnalysis.effectiveContrast}:1 {paletteAnalysis.contrastRating}
            </span>

            {/* Toggle rationale details */}
            <button
              type="button"
              onClick={() => setShowAutoTagDetails(!showAutoTagDetails)}
              className="p-1 rounded text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/80 transition-colors"
              title="Toggle Auto-Tag Diagnostic Breakdown"
            >
              <Info className="w-3 h-3 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Live Suggested Tags Strip */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-0.5">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[10px] text-neutral-400">Suggested Intent:</span>
            {paletteAnalysis.suggestedTags.map(tag => {
              const cfg = getTagConfig(tag);
              return (
                <span
                  key={tag}
                  className={`text-[9.5px] px-2 py-0.5 rounded font-medium border flex items-center gap-1 ${cfg.bg} ${cfg.text} ${cfg.border} shadow-sm`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  <span>{tag}</span>
                </span>
              );
            })}
          </div>

          {/* Quick Apply Button to Preset Filter */}
          <button
            type="button"
            onClick={handleApplySuggestedFilter}
            className="text-[10px] px-2 py-0.5 rounded bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/50 font-medium flex items-center gap-1 transition-all"
            title="Filter collections by auto-detected tags"
          >
            <Zap className="w-2.5 h-2.5 text-amber-300" />
            <span>Filter by Suggested</span>
          </button>
        </div>

        {/* Expandable Diagnostic Breakdown */}
        {showAutoTagDetails && (
          <div className="mt-1 pt-2 border-t border-neutral-800/80 flex flex-col gap-1.5 text-[10px] text-neutral-300 animate-fadeIn">
            <div className="grid grid-cols-3 gap-1 font-mono text-[9px]">
              <div className="bg-neutral-900/80 p-1 rounded border border-neutral-800 flex flex-col items-center">
                <span className="text-neutral-500">HUE SPECTRUM</span>
                <span className="text-cyan-300 font-bold">{paletteAnalysis.hue}°</span>
              </div>
              <div className="bg-neutral-900/80 p-1 rounded border border-neutral-800 flex flex-col items-center">
                <span className="text-neutral-500">SATURATION</span>
                <span className="text-amber-300 font-bold">{paletteAnalysis.saturation}%</span>
              </div>
              <div className="bg-neutral-900/80 p-1 rounded border border-neutral-800 flex flex-col items-center">
                <span className="text-neutral-500">CATEGORY</span>
                <span className="text-purple-300 font-bold capitalize">{paletteAnalysis.suggestedCategory}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 pt-0.5">
              {paletteAnalysis.tagExplanations.map(exp => (
                <div key={exp.tag} className="flex items-start gap-1.5 text-[10px] text-neutral-300 leading-tight">
                  <span className="font-semibold text-indigo-300 shrink-0">• {exp.tag}:</span>
                  <span className="text-neutral-400">{exp.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PRESET COLLECTIONS SECTION */}
      <div className="pt-2 border-t border-neutral-800/80 flex flex-col gap-2.5">
        <div className="flex items-center justify-between flex-wrap gap-1.5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-semibold text-neutral-200">
                Preset Collections
              </span>
            </div>

            {presetOrder.length > 0 && (
              <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-amber-950/80 text-amber-300 border border-amber-500/30 font-medium">
                Custom Order
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {presetOrder.length > 0 && (
              <button
                type="button"
                onClick={handleResetPresetOrder}
                title="Reset presets to default sequence"
                className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-amber-300 text-[10px] font-medium flex items-center gap-1 transition-colors border border-neutral-700/60"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset Order</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => (isSavingPreset ? setIsSavingPreset(false) : handleOpenSaveDialog())}
              className="px-2 py-0.5 rounded-md bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 text-[10px] font-semibold flex items-center gap-1 transition-all"
            >
              <Plus className="w-3 h-3" />
              <span>{isSavingPreset ? 'Cancel' : 'Save Current'}</span>
            </button>
          </div>
        </div>

        {/* 1. Category Filter Tabs */}
        <div className="flex items-center gap-1 bg-neutral-950/80 p-1 rounded-lg border border-neutral-800/90 text-[11px]">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>All</span>
            <span className={`text-[9px] px-1 py-0.2 rounded-full ml-0.5 ${
              selectedCategory === 'all' ? 'bg-indigo-700 text-indigo-100' : 'bg-neutral-800 text-neutral-400'
            }`}>
              {categoryCounts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('personal')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
              selectedCategory === 'personal'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            <User className="w-3 h-3" />
            <span>Personal</span>
            <span className={`text-[9px] px-1 py-0.2 rounded-full ml-0.5 ${
              selectedCategory === 'personal' ? 'bg-purple-700 text-purple-100' : 'bg-neutral-800 text-neutral-400'
            }`}>
              {categoryCounts.personal}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('project')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
              selectedCategory === 'project'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            <Folder className="w-3 h-3" />
            <span>Project-Specific</span>
            <span className={`text-[9px] px-1 py-0.2 rounded-full ml-0.5 ${
              selectedCategory === 'project' ? 'bg-amber-700 text-amber-100' : 'bg-neutral-800 text-neutral-400'
            }`}>
              {categoryCounts.project}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('shared')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
              selectedCategory === 'shared'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            <Users className="w-3 h-3" />
            <span>Shared</span>
            <span className={`text-[9px] px-1 py-0.2 rounded-full ml-0.5 ${
              selectedCategory === 'shared' ? 'bg-cyan-700 text-cyan-100' : 'bg-neutral-800 text-neutral-400'
            }`}>
              {categoryCounts.shared}
            </span>
          </button>
        </div>

        {/* 2. UI Tag Filters Bar (Primary, Destructive, Utility, Hero / CTA, Subtle) */}
        <div className="flex flex-wrap items-center gap-1.5 bg-neutral-950/50 px-2.5 py-1.5 rounded-lg border border-neutral-800/70">
          <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-medium mr-1">
            <Tag className="w-3 h-3 text-neutral-400" />
            <span>UI Tags:</span>
          </div>

          {/* All Tags chip */}
          <button
            type="button"
            onClick={handleClearTagFilters}
            className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-all border ${
              selectedTags.length === 0
                ? 'bg-neutral-800 text-neutral-100 border-neutral-600'
                : 'bg-transparent text-neutral-500 hover:text-neutral-300 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            All
          </button>

          {/* Individual Tag Toggle Pills */}
          {AVAILABLE_UI_TAGS.map(tag => {
            const isTagActive = selectedTags.includes(tag);
            const cfg = getTagConfig(tag);
            const count = tagCounts[tag] || 0;

            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleToggleTagFilter(tag)}
                className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-all border flex items-center gap-1.5 ${
                  isTagActive
                    ? `${cfg.activeBg} shadow-sm ring-1 ring-white/20`
                    : `${cfg.bg} ${cfg.text} ${cfg.border} hover:opacity-100 opacity-85`
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isTagActive ? 'bg-white' : cfg.dot}`} />
                <span>{tag}</span>
                <span
                  className={`text-[8.5px] px-1 py-0.2 rounded-full font-mono ${
                    isTagActive ? 'bg-black/30 text-white' : 'bg-neutral-900/80 text-neutral-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          {/* Clear active tag filters button if any is selected */}
          {selectedTags.length > 0 && (
            <button
              type="button"
              onClick={handleClearTagFilters}
              title="Reset UI tag filters"
              className="text-[10px] px-1.5 py-0.5 rounded text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 flex items-center gap-0.5 ml-auto transition-colors"
            >
              <X className="w-2.5 h-2.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Inline Save Preset Form with Category & Auto-Tag Chooser */}
        {isSavingPreset && (
          <form
            onSubmit={handleSaveCurrentPreset}
            className="p-3 rounded-lg bg-neutral-950/90 border border-indigo-500/40 flex flex-col gap-2.5 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1">
                <Bookmark className="w-3.5 h-3.5" />
                Save New Token Collection
              </span>
              <button
                type="button"
                onClick={handleAutoTagFromPaletteInForm}
                className="px-2 py-0.5 rounded bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/50 text-[10px] font-medium flex items-center gap-1 transition-all"
                title="Auto-detect categories & tags from contrast/hue"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Auto-Tag from Palette</span>
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <input
                type="text"
                value={presetNameInput}
                onChange={e => setPresetNameInput(e.target.value)}
                placeholder="Preset Name (e.g., Plasma Wave, Obsidian Dark)"
                className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-md text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                autoFocus
                required
              />
              <input
                type="text"
                value={presetDescInput}
                onChange={e => setPresetDescInput(e.target.value)}
                placeholder="Optional short description or project notes..."
                className="w-full px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded-md text-[11px] text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Category Selector Buttons */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-400 font-medium">Category / Scope:</span>
                <span className="text-[9.5px] text-indigo-400 font-mono">
                  Suggested: <span className="font-semibold capitalize">{paletteAnalysis.suggestedCategory}</span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: 'personal', label: 'Personal', icon: <User className="w-3 h-3" /> },
                    { id: 'project', label: 'Project-Specific', icon: <Folder className="w-3 h-3" /> },
                    { id: 'shared', label: 'Shared', icon: <Users className="w-3 h-3" /> },
                  ] as const
                ).map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setPresetCategoryInput(cat.id)}
                    className={`px-2 py-1.5 rounded-md text-[11px] font-medium border flex items-center justify-center gap-1 transition-all ${
                      presetCategoryInput === cat.id
                        ? 'bg-indigo-950 border-indigo-400 text-indigo-200 ring-1 ring-indigo-400/30'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* UI Tags Multi-Selector with Auto-Tag Rationale */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-400 font-medium">UI Intent Tags:</span>
                <span className="text-[9px] text-neutral-500">
                  {paletteAnalysis.effectiveContrast}:1 Contrast • {paletteAnalysis.saturation}% Saturation
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_UI_TAGS.map(tag => {
                  const isSelected = presetTagsInput.includes(tag);
                  const isAutoSuggested = paletteAnalysis.suggestedTags.includes(tag);
                  const cfg = getTagConfig(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleFormTag(tag)}
                      className={`text-[10px] px-2 py-1 rounded-md font-medium border flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? `${cfg.activeBg} ring-1 ring-white/30`
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : cfg.dot}`} />
                      <span>{tag}</span>
                      {isAutoSuggested && (
                        <span className="text-[8px] px-1 bg-amber-950/80 text-amber-300 rounded border border-amber-500/30">
                          Auto
                        </span>
                      )}
                      {isSelected && <Check className="w-2.5 h-2.5 ml-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-neutral-800/80">
              <button
                type="button"
                onClick={() => setIsSavingPreset(false)}
                className="px-2.5 py-1 rounded text-[11px] text-neutral-400 hover:text-neutral-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold flex items-center gap-1 shadow-sm"
              >
                <Check className="w-3 h-3" />
                <span>Save Preset</span>
              </button>
            </div>
          </form>
        )}

        {/* Preset Cards Grid (Filtered by Category and UI Tags) */}
        {filteredPresets.length === 0 ? (
          <div className="py-6 px-4 rounded-lg bg-neutral-950/40 border border-neutral-800/60 text-center flex flex-col items-center justify-center gap-1.5">
            <Filter className="w-5 h-5 text-neutral-500" />
            <p className="text-xs text-neutral-400">
              No presets match your active filters (Category:{' '}
              <span className="text-indigo-300 font-semibold capitalize">{selectedCategory}</span>
              {selectedTags.length > 0 && (
                <>
                  , Tags: <span className="text-cyan-300 font-semibold">{selectedTags.join(', ')}</span>
                </>
              )}
              ).
            </p>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedTags([]);
                }}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 underline"
              >
                Reset all filters ({allPresets.length} presets)
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 relative">
            {filteredPresets.map((preset, pIdx) => {
              const isSelected = currentMatchedPresetId === preset.id;
              const catBadge = getCategoryBadge(preset.category);
              const isFirst = pIdx === 0;
              const isLast = pIdx === filteredPresets.length - 1;
              const isDragging = draggingPresetId === preset.id;
              const isDragOver = dragOverPresetId === preset.id && draggingPresetId !== preset.id;

              return (
                <div
                  key={preset.id}
                  draggable
                  onDragStart={e => handleDragStartPreset(e, preset.id)}
                  onDragOver={e => handleDragOverPreset(e, preset.id)}
                  onDrop={e => handleDropPreset(e, preset.id)}
                  onDragEnd={handleDragEndPreset}
                  onClick={() => handleLoadPreset(preset)}
                  className={`p-2.5 rounded-lg text-left transition-all border flex flex-col justify-between gap-2 cursor-pointer relative group hover:z-30 ${
                    isSelected
                      ? 'bg-indigo-950/50 border-indigo-500/70 text-indigo-100 shadow-[0_0_12px_rgba(99,102,241,0.18)] ring-1 ring-indigo-500/40'
                      : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-300 hover:text-white hover:border-neutral-700'
                  } ${isDragging ? 'opacity-35 scale-95 border-dashed border-indigo-400' : ''} ${
                    isDragOver ? 'ring-2 ring-amber-400/80 border-amber-400 bg-amber-950/40 scale-[1.02] shadow-lg shadow-amber-950/50' : ''
                  }`}
                >
                  {/* Floating Live Button Thumbnail on Hover */}
                  <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 ease-out transform scale-95 group-hover:scale-100 z-50 origin-bottom">
                    <MiniPresetThumbnail preset={preset} />
                    {/* Tooltip caret / arrow */}
                    <div className="w-2.5 h-2.5 bg-neutral-900 border-r border-b border-neutral-700/80 rotate-45 mx-auto -mt-1 shadow-md" />
                  </div>

                  <div className="flex items-center justify-between w-full gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {/* Drag Handle */}
                      <span title="Drag to reorder preset" className="shrink-0 flex items-center">
                        <GripVertical className="w-3 h-3 text-neutral-500 hover:text-neutral-300 cursor-grab active:cursor-grabbing -ml-1 opacity-40 group-hover:opacity-100 transition-opacity" />
                      </span>

                      {/* Swatch indicator */}
                      <span
                        className="w-2 h-2 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: preset.tokens.accentColor || '#0284c7' }}
                      />
                      <span className="text-[11px] font-bold tracking-tight truncate group-hover:text-indigo-200 transition-colors">
                        {preset.name}
                      </span>
                    </div>

                    {/* Actions, Reorder Arrows & Badges */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Reorder Arrows */}
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900/90 rounded border border-neutral-800/80 p-0.5">
                        <button
                          type="button"
                          disabled={isFirst}
                          onClick={e => handleMovePreset(preset.id, 'prev', e)}
                          title="Move preset earlier (left)"
                          className="p-0.5 rounded hover:bg-neutral-800 disabled:opacity-20 disabled:hover:bg-transparent text-neutral-400 hover:text-cyan-300 transition-colors"
                        >
                          <ChevronLeft className="w-2.5 h-2.5" />
                        </button>
                        <button
                          type="button"
                          disabled={isLast}
                          onClick={e => handleMovePreset(preset.id, 'next', e)}
                          title="Move preset later (right)"
                          className="p-0.5 rounded hover:bg-neutral-800 disabled:opacity-20 disabled:hover:bg-transparent text-neutral-400 hover:text-cyan-300 transition-colors"
                        >
                          <ChevronRight className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      {preset.isCustom && (
                        <button
                          type="button"
                          onClick={e => handleDeleteCustomPreset(preset.id, e)}
                          title="Delete custom preset"
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-rose-950 hover:text-rose-400 text-neutral-500 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                    </div>
                  </div>

                  {/* UI Tags Badges Row */}
                  {preset.uiTags && preset.uiTags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1">
                      {preset.uiTags.map(tag => {
                        const cfg = getTagConfig(tag);
                        return (
                          <span
                            key={tag}
                            className={`text-[8px] px-1 py-0.2 rounded font-medium border flex items-center gap-0.5 ${cfg.bg} ${cfg.text} ${cfg.border}`}
                          >
                            <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Category Pill Tag & Specs */}
                  <div className="flex items-center justify-between gap-1 text-[9px] pt-0.5 border-t border-neutral-900/60">
                    <span
                      className={`px-1.5 py-0.5 rounded flex items-center gap-1 border font-medium ${catBadge.className}`}
                    >
                      {catBadge.icon}
                      <span>{catBadge.label}</span>
                    </span>

                    <span className="font-mono text-neutral-400 text-[9.5px]">
                      {preset.tokens.borderRadius === 9999 ? 'Pill' : `${preset.tokens.borderRadius}px`} • {preset.tokens.rgbDuration}s
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-neutral-800/80">
        {/* Color Palette & Hue Spectrum */}
        <div className="sm:col-span-2 flex flex-col gap-2 p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
          <div className="flex justify-between items-center text-[11px]">
            <div className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-neutral-300 font-medium">Palette Hue Spectrum</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span className="text-neutral-400">Hue: <span className="text-cyan-300 font-bold">{tokens.primaryHue}°</span></span>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-400">Contrast: <span className="text-emerald-300 font-bold">{paletteAnalysis.effectiveContrast}:1</span></span>
            </div>
          </div>

          {/* Hue Spectrum Slider */}
          <input
            type="range"
            min="0"
            max="360"
            value={tokens.primaryHue}
            onChange={e => {
              const hue = parseInt(e.target.value, 10);
              onChangeTokens({
                primaryHue: hue,
              });
            }}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
            }}
          />

          {/* Quick UI Archetype Swatches */}
          <div className="flex items-center justify-between gap-1 flex-wrap pt-0.5">
            {PRESET_COLOR_SWATCHES.map(swatch => (
              <button
                key={swatch.name}
                type="button"
                onClick={() => {
                  onChangeTokens({
                    primaryHue: swatch.hue,
                    accentColor: swatch.hex,
                  });
                }}
                className={`text-[9.5px] px-2 py-1 rounded-md font-medium flex items-center gap-1.5 border transition-all ${
                  tokens.primaryHue === swatch.hue
                    ? 'bg-neutral-800 border-indigo-400 text-white shadow-sm ring-1 ring-indigo-400/40'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: swatch.hex }} />
                <span>{swatch.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Border Radius */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-neutral-400">Border Radius</span>
            <span className="font-mono text-cyan-400">
              {tokens.borderRadius === 9999 ? 'Pill (Full)' : `${tokens.borderRadius}px`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="40"
              value={tokens.borderRadius === 9999 ? 40 : tokens.borderRadius}
              onChange={e => {
                const val = parseInt(e.target.value, 10);
                onChangeTokens({ borderRadius: val === 40 ? 9999 : val });
              }}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <button
              type="button"
              onClick={() => onChangeTokens({ borderRadius: tokens.borderRadius === 9999 ? 12 : 9999 })}
              className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-mono"
            >
              {tokens.borderRadius === 9999 ? 'Rounded' : 'Pill'}
            </button>
          </div>
        </div>

        {/* RGB Duration / Spin Speed */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-neutral-400">RGB Conic Duration</span>
            <span className="font-mono text-cyan-400">{tokens.rgbDuration}s</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="8"
            step="0.5"
            value={tokens.rgbDuration}
            onChange={e => onChangeTokens({ rgbDuration: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Shadow Intensity (--shadow-intensity) */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[11px]">
            <div className="flex items-center gap-1">
              <span className="text-neutral-300 font-medium">Shadow Intensity</span>
              <code className="text-[9px] text-cyan-400/80 font-mono">--shadow-intensity</code>
            </div>
            <span className="font-mono text-cyan-300 font-bold">
              {tokens.shadowIntensity.toFixed(2)} <span className="text-neutral-500 font-normal text-[10px]">({Math.round(tokens.shadowIntensity * 100)}%)</span>
            </span>
          </div>
          <input
            type="range"
            min="0.05"
            max="1.0"
            step="0.05"
            value={tokens.shadowIntensity}
            onChange={e => onChangeTokens({ shadowIntensity: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex items-center justify-between gap-1 pt-0.5">
            {[
              { label: 'Soft', value: 0.2 },
              { label: 'Default', value: 0.45 },
              { label: 'Vivid', value: 0.75 },
              { label: 'Max', value: 1.0 },
            ].map(opt => (
              <button
                key={opt.label}
                type="button"
                onClick={() => onChangeTokens({ shadowIntensity: opt.value })}
                className={`text-[9px] px-1.5 py-0.5 rounded font-mono transition-colors ${
                  Math.abs(tokens.shadowIntensity - opt.value) < 0.04
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                    : 'bg-neutral-800/80 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Border Thickness */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-neutral-400">RGB Mask Thickness</span>
            <span className="font-mono text-cyan-400">{tokens.borderThickness}px</span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            step="1"
            value={tokens.borderThickness}
            onChange={e => onChangeTokens({ borderThickness: parseInt(e.target.value, 10) })}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>

      {/* Animation Curve Presets & Kinetic Timing */}
      <div className="pt-3 border-t border-neutral-800/80 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold text-neutral-200">
              Animation Curve Presets (<code className="text-[10px] text-cyan-300">--btn-transition-timing</code>)
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
            {activeCurve.badge}
          </span>
        </div>

        {/* Curve Selection Chips / Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {ANIMATION_CURVE_PRESETS.map(curve => {
            const isSelected = tokens.timingPreset === curve.id;
            return (
              <button
                key={curve.id}
                type="button"
                onClick={() => handleSelectCurve(curve.id)}
                className={`p-2 rounded-lg text-left transition-all border flex flex-col justify-between gap-1 group ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30'
                    : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] font-bold tracking-tight">
                    {curve.name}
                  </span>
                  {/* Mini SVG Curve Graphic */}
                  <svg
                    viewBox="0 0 40 24"
                    className={`w-6 h-3.5 transition-colors ${
                      isSelected ? 'text-cyan-400 stroke-cyan-300' : 'text-neutral-600 stroke-neutral-500 group-hover:stroke-neutral-400'
                    }`}
                    fill="none"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d={curve.curveSvgPath} />
                  </svg>
                </div>
                <span className="text-[9px] leading-tight text-neutral-500 line-clamp-1 group-hover:text-neutral-400">
                  {curve.id === 'springy' ? 'Bouncy bounce' : curve.id === 'snappy' ? 'Instant crisp' : curve.id === 'linear' ? 'Uniform rate' : curve.id === 'ease-in-out' ? 'Smooth ease' : 'Refined gentle'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Curve Live Formula & Description Banner */}
        <div className="bg-neutral-950/80 rounded-lg p-2.5 border border-neutral-800/90 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-neutral-400">CSS Curve Formula:</span>
            <code className="font-mono text-amber-300 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/20 text-[10px]">
              {activeCurve.cssTiming}
            </code>
          </div>
          <p className="text-[10.5px] text-neutral-400 leading-snug">
            {activeCurve.description}
          </p>
        </div>
      </div>

      {/* Reduced Motion Toggle per A11y Section 1.3 */}
      <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] text-neutral-300">Force Reduced Motion (@prefers-reduced-motion)</span>
        </div>
        <button
          type="button"
          onClick={() => onChangeTokens({ reducedMotion: !tokens.reducedMotion })}
          className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
            tokens.reducedMotion ? 'bg-emerald-500' : 'bg-neutral-800'
          }`}
        >
          <span
            className={`w-4 h-4 rounded-full bg-white transition-transform ${
              tokens.reducedMotion ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
