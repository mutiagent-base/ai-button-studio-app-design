import { AnimationCurvePreset } from '../types';

export interface AnimationCurvePresetConfig {
  id: AnimationCurvePreset;
  name: string;
  cssTiming: string;
  description: string;
  badge: string;
  curveSvgPath: string;
}

export const ANIMATION_CURVE_PRESETS: AnimationCurvePresetConfig[] = [
  {
    id: 'springy',
    name: 'Springy',
    cssTiming: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    description: 'Kinetic overshoot with dynamic bounce rebound for responsive tactile feel',
    badge: 'KINETIC',
    curveSvgPath: 'M 4,20 C 14,-2 26,4 36,4',
  },
  {
    id: 'ease-in-out',
    name: 'Ease-In-Out',
    cssTiming: 'cubic-bezier(0.4, 0, 0.2, 1)',
    description: 'Standard natural acceleration and deceleration curve',
    badge: 'STANDARD',
    curveSvgPath: 'M 4,20 C 18,20 22,4 36,4',
  },
  {
    id: 'snappy',
    name: 'Snappy',
    cssTiming: 'cubic-bezier(0.16, 1, 0.3, 1)',
    description: 'Ultra-fast initial response with sudden velocity and crisp settling',
    badge: 'PRODUCTIVE',
    curveSvgPath: 'M 4,20 C 10,4 20,4 36,4',
  },
  {
    id: 'linear',
    name: 'Linear',
    cssTiming: 'linear',
    description: 'Constant uniform velocity throughout the entire motion cycle',
    badge: 'UNIFORM',
    curveSvgPath: 'M 4,20 L 36,4',
  },
  {
    id: 'smooth',
    name: 'Smooth',
    cssTiming: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    description: 'Subtle and balanced easing for refined UI states and transitions',
    badge: 'REFINED',
    curveSvgPath: 'M 4,20 C 14,18 26,6 36,4',
  },
];
