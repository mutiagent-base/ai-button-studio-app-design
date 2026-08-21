import React from 'react';
import { Sliders, Sun, Moon, Zap, Shield, Sparkles } from 'lucide-react';
import { DesignTokens } from '../types';

interface DesignTokenEditorProps {
  tokens: DesignTokens;
  onChangeTokens: (updated: Partial<DesignTokens>) => void;
}

export const DesignTokenEditor: React.FC<DesignTokenEditorProps> = ({
  tokens,
  onChangeTokens,
}) => {
  return (
    <div className="flex flex-col gap-3 bg-neutral-900/70 rounded-xl border border-neutral-800 p-4 backdrop-blur-sm">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
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

        {/* Shadow Intensity */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-neutral-400">Dynamic Shadow Factor</span>
            <span className="font-mono text-cyan-400">{tokens.shadowIntensity}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={tokens.shadowIntensity}
            onChange={e => onChangeTokens({ shadowIntensity: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
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
