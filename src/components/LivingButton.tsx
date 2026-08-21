import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Rocket,
  Search,
  Plus,
  ArrowRight,
  Check,
  Loader2,
  AlertCircle,
  ExternalLink,
  Sliders,
  Layers,
} from 'lucide-react';
import { AIButtonStudioComponent, ButtonStateType, DesignTokens } from '../types';

interface LivingButtonProps {
  component: AIButtonStudioComponent;
  forcedState?: ButtonStateType | null;
  tokens: DesignTokens;
  onTriggerAction?: (actionType: string, target: string, component: AIButtonStudioComponent) => void;
  onStateChange?: (state: ButtonStateType) => void;
  isSelected?: boolean;
  onSelect?: () => void;
  scale?: number;
}

export const LivingButton: React.FC<LivingButtonProps> = ({
  component,
  forcedState,
  tokens,
  onTriggerAction,
  onStateChange,
  isSelected = false,
  scale = 1,
}) => {
  const [internalState, setInternalState] = useState<ButtonStateType>('idle');
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Active state is either forced by simulation panel or internal user interaction
  const currentState: ButtonStateType = forcedState || internalState;

  const isRGB = component.effects.special_features.includes('rgb_running_border');
  const isDynamicShadow = component.effects.special_features.includes('dynamic_shadow_cursor_tracking');

  useEffect(() => {
    onStateChange?.(currentState);
  }, [currentState, onStateChange]);

  // Mathematical Dynamic Cursor Shadow Tracking (Section 3.3.A)
  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn || currentState === 'disabled' || currentState === 'loading' || tokens.reducedMotion) {
      if (btn) btn.style.boxShadow = '';
      return;
    }

    if (!isDynamicShadow && !isRGB) {
      btn.style.boxShadow = '';
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!btn) return;
      const bounds = btn.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;

      const diffX = event.clientX - centerX;
      const diffY = event.clientY - centerY;

      // Inverse vector projection dampened by factor 16
      const shadowOffsetX = -(diffX / 16);
      const shadowOffsetY = -(diffY / 16);

      const distance = Math.sqrt(diffX * diffX + diffY * diffY);
      const blurRadius = Math.min(32, Math.max(8, 3800 / (distance + 20)));

      if (currentState === 'click') {
        // Shadow Retraction on click
        btn.style.boxShadow = `${(shadowOffsetX * 0.3).toFixed(1)}px ${(shadowOffsetY * 0.3).toFixed(1)}px ${(blurRadius * 0.4).toFixed(1)}px rgba(0, 0, 0, ${tokens.shadowIntensity * 0.8})`;
      } else {
        btn.style.boxShadow = `${shadowOffsetX.toFixed(1)}px ${shadowOffsetY.toFixed(1)}px ${blurRadius.toFixed(1)}px rgba(0, 0, 0, ${tokens.shadowIntensity})`;
      }
    };

    const handleMouseLeave = () => {
      if (btn && currentState !== 'hover') {
        btn.style.boxShadow = '';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      btn?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [currentState, isDynamicShadow, isRGB, tokens.shadowIntensity, tokens.reducedMotion]);

  // Ripple creation on click
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (currentState === 'disabled' || currentState === 'loading') return;
    const btn = buttonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev.slice(-3), newRipple]);

    if (!forcedState) {
      setInternalState('click');
    }
  };

  const handlePointerUp = () => {
    if (!forcedState && internalState === 'click') {
      setInternalState('hover');
    }
  };

  // Execution handler
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (currentState === 'disabled' || currentState === 'loading') return;

    if (!forcedState) {
      setInternalState('loading');
      setTimeout(() => {
        setInternalState('success');
        onTriggerAction?.(component.action.type, component.action.target, component);
        setTimeout(() => {
          setInternalState('idle');
        }, 1500);
      }, 900);
    } else {
      onTriggerAction?.(component.action.type, component.action.target, component);
    }
  };

  const renderIcon = () => {
    const iconClass = 'w-4 h-4 transition-transform duration-200';
    switch (component.content.icon_name) {
      case 'rocket':
        return <Rocket className={`${iconClass} text-cyan-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5`} />;
      case 'sparkles':
        return <Sparkles className={`${iconClass} text-amber-300 group-hover:rotate-12`} />;
      case 'search':
        return <Search className={`${iconClass} text-sky-200 group-hover:scale-110`} />;
      case 'plus':
        return <Plus className={`${iconClass} text-white group-hover:rotate-90`} />;
      case 'arrow-right':
        return <ArrowRight className={`${iconClass} text-cyan-300 group-hover:translate-x-1`} />;
      case 'check':
        return <Check className={`${iconClass} text-emerald-300`} />;
      default:
        return <Sparkles className={`${iconClass} text-cyan-300`} />;
    }
  };

  // Base Style Classes
  const getStyleClasses = () => {
    if (isRGB) {
      return 'living-btn-rgb';
    }

    switch (component.effects.base_style) {
      case 'neon_blue_glow':
        return 'bg-cyan-950/85 text-cyan-100 border border-cyan-500/60 shadow-[0_0_22px_rgba(6,182,212,0.35)] hover:border-cyan-300 hover:shadow-[0_0_32px_rgba(6,182,212,0.65)]';
      case 'gradient_fill':
        return 'bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 text-white border border-white/20 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:brightness-110';
      case 'outline_rgb':
        return 'bg-neutral-900/90 text-white border border-neutral-700 hover:border-neutral-500';
      case 'soft_shadow':
        return 'bg-neutral-800 text-neutral-100 border border-neutral-700/80 shadow-md shadow-black/40 hover:bg-neutral-750 hover:border-neutral-600';
      default:
        return 'bg-sky-600 text-white shadow-md hover:bg-sky-500';
    }
  };

  // State specific modifier classes
  const getStateClasses = () => {
    switch (currentState) {
      case 'hover':
        return 'scale-[1.03]';
      case 'click':
        return 'scale-[0.97] brightness-125';
      case 'loading':
        return 'cursor-wait opacity-90';
      case 'disabled':
        return 'opacity-35 cursor-not-allowed filter grayscale pointer-events-none';
      case 'success':
        return 'animate-success-pop !bg-emerald-600 !text-white !border-emerald-400 !shadow-[0_0_25px_rgba(16,185,129,0.6)]';
      case 'error':
        return 'animate-shake !bg-rose-600 !text-white !border-rose-400 !shadow-[0_0_25px_rgba(244,63,94,0.6)]';
      default:
        return '';
    }
  };

  const borderRadiusStyle =
    tokens.borderRadius === 9999 ? '9999px' : `${tokens.borderRadius}px`;

  return (
    <div
      className={`relative inline-flex items-center justify-center transition-all ${
        isSelected ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-neutral-950 rounded-full' : ''
      }`}
      style={{ transform: `scale(${scale})` }}
    >
      <button
        ref={buttonRef}
        id={component.id}
        type="button"
        tabIndex={component.accessibility.tab_index}
        aria-label={component.accessibility.aria_label}
        disabled={currentState === 'disabled' || currentState === 'loading'}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onMouseEnter={() => !forcedState && setInternalState('hover')}
        onMouseLeave={() => !forcedState && internalState !== 'loading' && internalState !== 'success' && setInternalState('idle')}
        className={`group relative select-none font-semibold tracking-wide text-xs sm:text-sm px-5 py-2.5 sm:px-6 sm:py-3 inline-flex items-center justify-center gap-2.5 outline-none transition-all duration-200 overflow-hidden
          ${getStyleClasses()}
          ${getStateClasses()}
        `}
        style={{
          borderRadius: borderRadiusStyle,
          ['--rgb-duration' as any]: currentState === 'hover' ? '0.8s' : `${tokens.rgbDuration}s`,
          ['--border-thickness' as any]: `${tokens.borderThickness}px`,
          ['--btn-radius' as any]: borderRadiusStyle,
        }}
      >
        {/* Ripple elements */}
        {ripples.map(r => (
          <span
            key={r.id}
            className="absolute rounded-full bg-white/25 pointer-events-none animate-ping"
            style={{
              left: r.x - 15,
              top: r.y - 15,
              width: 30,
              height: 30,
            }}
          />
        ))}

        {/* Content depending on State */}
        {currentState === 'loading' ? (
          <div className="flex items-center gap-2 animate-pulse text-cyan-200">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
            <span className="font-mono text-xs uppercase tracking-wider">Processing</span>
          </div>
        ) : currentState === 'success' ? (
          <div className="flex items-center gap-1.5 text-white">
            <Check className="w-4 h-4 stroke-[3]" />
            <span className="font-semibold">Success</span>
          </div>
        ) : currentState === 'error' ? (
          <div className="flex items-center gap-1.5 text-white">
            <AlertCircle className="w-4 h-4" />
            <span className="font-semibold">Action Failed</span>
          </div>
        ) : (
          <div className="relative z-10 flex items-center gap-2">
            {renderIcon()}
            <span className="whitespace-nowrap font-medium">{component.content.label}</span>
          </div>
        )}
      </button>
    </div>
  );
};
