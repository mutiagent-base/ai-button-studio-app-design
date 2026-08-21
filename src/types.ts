export type ButtonStateType = 'idle' | 'hover' | 'click' | 'loading' | 'disabled' | 'success' | 'error';

export type ButtonCategory = 'primary' | 'secondary' | 'icon' | 'fab';

export type GridSection = 'Header' | 'Hero' | 'Content_Left' | 'Content_Right' | 'Footer';

export type ActionType = 'internal_scroll' | 'open_modal' | 'open_search' | 'external_link';

export type BaseStyleType = 'neon_blue_glow' | 'gradient_fill' | 'outline_rgb' | 'soft_shadow';

export type SpecialFeature = 'none' | 'dynamic_shadow_cursor_tracking' | 'rgb_running_border';

export interface LocationConfig {
  grid_id: string; // e.g. "R1C1", "R2C2" (R1-R4, C1-C4)
  section: GridSection;
}

export interface ContentConfig {
  label: string;
  icon_name?: string; // e.g. 'search', 'plus', 'sparkles', 'rocket', 'arrow-right', 'play', 'download', 'check'
}

export interface ActionConfig {
  type: ActionType;
  target: string;
}

export interface EffectsConfig {
  base_style: BaseStyleType;
  special_features: SpecialFeature[];
}

export interface AccessibilityConfig {
  aria_label: string;
  tab_index: number;
  reduce_motion_safe: boolean;
}

export interface AttributionConfig {
  credit_owner: string;
  license_type: string;
  source_repository?: string;
}

/**
 * Strict Production JSON Intermediate Representation (IR)
 * conforming to README section 3.1 JSON Schema
 */
export interface AIButtonStudioComponent {
  id: string;
  type: ButtonCategory;
  location: LocationConfig;
  content: ContentConfig;
  action: ActionConfig;
  effects: EffectsConfig;
  accessibility: AccessibilityConfig;
  attribution: AttributionConfig;
}

export type AnimationCurvePreset = 'springy' | 'linear' | 'ease-in-out' | 'snappy' | 'smooth';

export interface DesignTokens {
  primaryHue: number;
  accentColor: string;
  borderRadius: number; // in px or 9999 for full pill
  borderThickness: number; // in px (1-8)
  rgbDuration: number; // in seconds (0.5 to 10)
  shadowIntensity: number; // 0.1 to 1.0
  timingPreset: AnimationCurvePreset;
  transitionTiming: string; // mapped to --btn-transition-timing CSS token
  reducedMotion: boolean;
  themeMode: 'dark' | 'light';
}

export type PresetCategory = 'personal' | 'project' | 'shared';

export type PresetUITag = 'Primary' | 'Destructive' | 'Utility' | 'Hero / CTA' | 'Subtle';

export interface TokenPresetCollection {
  id: string;
  name: string;
  description: string;
  category: PresetCategory;
  uiTags?: PresetUITag[];
  isCustom?: boolean;
  badge?: string;
  tokens: DesignTokens;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  category: 'PARSER' | 'STATE' | 'A11Y' | 'CREDIT' | 'ACTION';
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
  details?: Record<string, any>;
}

export interface A11yAuditResult {
  score: number; // 0 - 100
  passedChecks: number;
  totalChecks: number;
  hasAriaLabel: boolean;
  contrastRatio: number;
  contrastPass: boolean;
  keyboardNavPass: boolean;
  reducedMotionReady: boolean;
  touchTargetPass: boolean;
  findings: Array<{
    type: 'pass' | 'warn' | 'fail';
    message: string;
  }>;
}
