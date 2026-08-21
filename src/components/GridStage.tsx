import React from 'react';
import { AIButtonStudioComponent, ButtonStateType, DesignTokens } from '../types';
import { LivingButton } from './LivingButton';
import { Grid, Eye, Compass, Move, Sparkles, Plus } from 'lucide-react';

interface GridStageProps {
  components: AIButtonStudioComponent[];
  activeComponentId: string;
  forcedState: ButtonStateType | null;
  tokens: DesignTokens;
  onSelectComponent: (id: string) => void;
  onCellClick: (gridId: string) => void;
  onTriggerAction: (actionType: string, target: string, component: AIButtonStudioComponent) => void;
  showHelperCoordinates?: boolean;
}

const ROWS = ['R1', 'R2', 'R3', 'R4'];
const COLS = ['C1', 'C2', 'C3', 'C4'];

export const GridStage: React.FC<GridStageProps> = ({
  components,
  activeComponentId,
  forcedState,
  tokens,
  onSelectComponent,
  onCellClick,
  onTriggerAction,
  showHelperCoordinates = true,
}) => {
  const activeComponent = components.find(c => c.id === activeComponentId) || components[0];

  const getSectionBadge = (rIdx: number, cIdx: number) => {
    if (rIdx === 0) return 'Header';
    if (rIdx === 1) return 'Hero';
    if (rIdx === 2) return cIdx < 2 ? 'Content_Left' : 'Content_Right';
    return 'Footer';
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900/60 rounded-xl border border-neutral-800 p-4 relative overflow-hidden backdrop-blur-sm">
      {/* Stage Header Info */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold tracking-wider uppercase text-neutral-300">
              16:9 Living Canvas Stage
            </h2>
            <p className="text-[11px] text-neutral-400">
              4x4 Matrix Coordinate Grid (R1C1 - R4C4) • Real-Time Kinetic Physics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-neutral-800 text-neutral-300 font-mono text-[11px] border border-neutral-700/60">
            Active: <strong className="text-cyan-400">{activeComponent?.location.grid_id || 'R2C2'}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-neutral-800/80 text-neutral-400 font-mono text-[11px]">
            {activeComponent?.location.section}
          </span>
        </div>
      </div>

      {/* Main 16:9 Grid Canvas */}
      <div className="relative flex-1 w-full aspect-video min-h-[360px] max-h-[580px] mx-auto bg-neutral-950/90 rounded-lg border border-neutral-800 shadow-2xl shadow-black/80 p-3 flex flex-col justify-between overflow-hidden">
        {/* Subtle grid background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-25 pointer-events-none" />

        {/* The 4x4 Grid Cells */}
        <div className="relative z-10 grid grid-rows-4 grid-cols-4 gap-2 w-full h-full">
          {ROWS.map((row, rIdx) =>
            COLS.map((col, cIdx) => {
              const cellId = `${row}${col}`;
              const sectionName = getSectionBadge(rIdx, cIdx);
              const cellComponents = components.filter(c => c.location.grid_id === cellId);
              const isTargetCell = activeComponent?.location.grid_id === cellId;

              return (
                <div
                  key={cellId}
                  id={`cell-${cellId}`}
                  onClick={() => onCellClick(cellId)}
                  className={`group relative rounded-md border transition-all duration-200 flex items-center justify-center p-2 cursor-pointer
                    ${isTargetCell
                      ? 'border-cyan-500/60 bg-cyan-950/20 shadow-[inset_0_0_15px_rgba(6,182,212,0.15)]'
                      : 'border-neutral-800/60 bg-neutral-900/30 hover:border-neutral-700 hover:bg-neutral-800/40'
                    }
                  `}
                >
                  {/* Coordinate Tag */}
                  {showHelperCoordinates && (
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                      <span
                        className={`text-[9px] font-mono font-medium px-1 rounded transition-colors
                          ${isTargetCell ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-neutral-400 group-hover:text-neutral-300'}
                        `}
                      >
                        {cellId}
                      </span>
                      <span className="text-[8px] text-neutral-400 hidden xl:inline">
                        {sectionName}
                      </span>
                    </div>
                  )}

                  {/* Render Component(s) inside this cell */}
                  {cellComponents.length > 0 ? (
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {cellComponents.map(comp => (
                        <div
                          key={comp.id}
                          onClick={e => {
                            e.stopPropagation();
                            onSelectComponent(comp.id);
                          }}
                        >
                          <LivingButton
                            component={comp}
                            forcedState={comp.id === activeComponentId ? forcedState : null}
                            tokens={tokens}
                            isSelected={comp.id === activeComponentId}
                            onTriggerAction={onTriggerAction}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-neutral-400 flex items-center gap-1 font-mono pointer-events-none">
                      <Plus className="w-3 h-3 text-cyan-400" />
                      <span>Place here</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Section Label Rail on the left and right borders */}
        <div className="absolute left-1 top-2 bottom-2 w-1 bg-gradient-to-b from-sky-500/40 via-indigo-500/40 to-emerald-500/40 rounded-full pointer-events-none" />
      </div>

      {/* Grid Canvas Footer Hint */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 px-1">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Move cursor over button to observe inverse dynamic shadow vector.</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Click any cell to reposition button or trigger actions.</span>
        </div>
      </div>
    </div>
  );
};
