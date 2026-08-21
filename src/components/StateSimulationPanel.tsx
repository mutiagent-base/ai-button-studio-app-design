import React, { useState, useEffect } from 'react';
import { ButtonStateType } from '../types';
import { Play, Pause, RotateCcw, Activity, MousePointer, Hand, Loader2, Ban, CheckCircle2, AlertTriangle } from 'lucide-react';

interface StateSimulationPanelProps {
  forcedState: ButtonStateType | null;
  onSetForcedState: (state: ButtonStateType | null) => void;
  activeComponentLabel: string;
}

const STATES: Array<{ id: ButtonStateType; label: string; icon: React.ReactNode; color: string; desc: string }> = [
  {
    id: 'idle',
    label: 'Idle State',
    icon: <Activity className="w-3.5 h-3.5" />,
    color: 'text-neutral-300 border-neutral-700',
    desc: 'Default living state with slow ambient RGB rotation',
  },
  {
    id: 'hover',
    label: 'Hover State',
    icon: <MousePointer className="w-3.5 h-3.5" />,
    color: 'text-cyan-300 border-cyan-500/50',
    desc: 'Inverse vector shadow projection & accelerated RGB',
  },
  {
    id: 'click',
    label: 'Click / Depress',
    icon: <Hand className="w-3.5 h-3.5" />,
    color: 'text-amber-300 border-amber-500/50',
    desc: 'Tactile shadow retraction & instantaneous border flash',
  },
  {
    id: 'loading',
    label: 'Loading State',
    icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
    color: 'text-sky-300 border-sky-500/50',
    desc: 'Rotating SVG spinner, pulsing & pointer lock',
  },
  {
    id: 'disabled',
    label: 'Disabled State',
    icon: <Ban className="w-3.5 h-3.5" />,
    color: 'text-neutral-400 border-neutral-700',
    desc: 'Desaturated grayscale, faded opacity & event freeze',
  },
  {
    id: 'success',
    label: 'Success State',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    color: 'text-emerald-300 border-emerald-500/50',
    desc: 'Emerald green confirmation pop for 1.5s',
  },
  {
    id: 'error',
    label: 'Error State',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    color: 'text-rose-300 border-rose-500/50',
    desc: 'Crimson shift & physical shake keyframe reaction',
  },
];

export const StateSimulationPanel: React.FC<StateSimulationPanelProps> = ({
  forcedState,
  onSetForcedState,
  activeComponentLabel,
}) => {
  const [isCycleRunning, setIsCycleRunning] = useState(false);

  // Auto-cycle through states
  useEffect(() => {
    if (!isCycleRunning) return;

    const cycleOrder: ButtonStateType[] = ['idle', 'hover', 'click', 'loading', 'success', 'idle', 'error'];
    let index = 0;

    const interval = setInterval(() => {
      onSetForcedState(cycleOrder[index]);
      index = (index + 1) % cycleOrder.length;
    }, 1800);

    return () => clearInterval(interval);
  }, [isCycleRunning, onSetForcedState]);

  const toggleCycle = () => {
    if (isCycleRunning) {
      setIsCycleRunning(false);
      onSetForcedState(null);
    } else {
      setIsCycleRunning(true);
    }
  };

  return (
    <div className="flex flex-col gap-2.5 bg-neutral-900/70 rounded-xl border border-neutral-800 p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-neutral-200">
              6-State Machine Simulator
            </h3>
            <p className="text-[11px] text-neutral-400">
              Force state overrides & verify physical motion transitions
            </p>
          </div>
        </div>

        {/* Live Interaction vs Simulation Reset */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleCycle}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all border
              ${isCycleRunning
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700'
              }
            `}
          >
            {isCycleRunning ? (
              <>
                <Pause className="w-3 h-3" />
                <span>Stop Loop</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                <span>Auto Loop</span>
              </>
            )}
          </button>

          {forcedState && (
            <button
              type="button"
              onClick={() => {
                setIsCycleRunning(false);
                onSetForcedState(null);
              }}
              title="Reset to Live Interaction"
              className="p-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-cyan-400 border border-neutral-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* State Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
        <button
          type="button"
          onClick={() => {
            setIsCycleRunning(false);
            onSetForcedState(null);
          }}
          className={`px-2.5 py-2 rounded-lg border text-left text-xs font-medium transition-all col-span-2 sm:col-span-3 flex items-center justify-between
            ${forcedState === null
              ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 ring-1 ring-cyan-500/30'
              : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400 hover:bg-neutral-800/60'
            }
          `}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">Live Interactive Physics (Default)</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">Mouse & Tap Reactive</span>
        </button>

        {STATES.map(st => {
          const isSelected = forcedState === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => {
                setIsCycleRunning(false);
                onSetForcedState(st.id);
              }}
              className={`p-2 rounded-lg border text-left text-xs transition-all flex flex-col gap-1
                ${isSelected
                  ? `bg-neutral-800 ${st.color} ring-1 ring-cyan-400/40 shadow-sm`
                  : 'bg-neutral-950/50 border-neutral-800/80 text-neutral-400 hover:bg-neutral-800/40 hover:text-neutral-200'
                }
              `}
            >
              <div className="flex items-center gap-1.5 font-semibold">
                {st.icon}
                <span>{st.label}</span>
              </div>
              <span className="text-[10px] text-neutral-400 line-clamp-1">{st.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
