import { AIButtonStudioComponent } from '../types';

export const PRESET_COMPONENTS: AIButtonStudioComponent[] = [
  {
    id: 'btn-cyber-launch',
    type: 'primary',
    location: {
      grid_id: 'R2C2',
      section: 'Hero',
    },
    content: {
      label: 'Deploy to Mainnet',
      icon_name: 'rocket',
    },
    action: {
      type: 'open_modal',
      target: 'DeploymentModal_v2',
    },
    effects: {
      base_style: 'neon_blue_glow',
      special_features: ['dynamic_shadow_cursor_tracking', 'rgb_running_border'],
    },
    accessibility: {
      aria_label: 'Trigger mainnet deployment sequence and launch node cluster',
      tab_index: 0,
      reduce_motion_safe: true,
    },
    attribution: {
      credit_owner: 'Satoshi DevLab',
      license_type: 'MIT',
      source_repository: 'https://github.com/mutiagent-base/ai-button-studio-app-design',
    },
  },
  {
    id: 'btn-rgb-quantum',
    type: 'primary',
    location: {
      grid_id: 'R2C3',
      section: 'Hero',
    },
    content: {
      label: 'Explore Living Engine',
      icon_name: 'sparkles',
    },
    action: {
      type: 'internal_scroll',
      target: 'R3C1',
    },
    effects: {
      base_style: 'outline_rgb',
      special_features: ['rgb_running_border', 'dynamic_shadow_cursor_tracking'],
    },
    accessibility: {
      aria_label: 'Explore the living design engine system architecture',
      tab_index: 0,
      reduce_motion_safe: true,
    },
    attribution: {
      credit_owner: 'OpenDesign Foundation',
      license_type: 'Apache-2.0',
      source_repository: 'https://github.com/mutiagent-base/ai-button-studio-app-design',
    },
  },
  {
    id: 'btn-header-search',
    type: 'icon',
    location: {
      grid_id: 'R1C4',
      section: 'Header',
    },
    content: {
      label: 'Search Registry',
      icon_name: 'search',
    },
    action: {
      type: 'open_search',
      target: 'GlobalSearch_CommandK',
    },
    effects: {
      base_style: 'soft_shadow',
      special_features: ['dynamic_shadow_cursor_tracking'],
    },
    accessibility: {
      aria_label: 'Open global search palette across token registry and components',
      tab_index: 0,
      reduce_motion_safe: true,
    },
    attribution: {
      credit_owner: 'CoreUI Kit Contributors',
      license_type: 'MIT',
      source_repository: 'https://github.com/mutiagent-base/ai-button-studio-app-design',
    },
  },
  {
    id: 'btn-gradient-fab',
    type: 'fab',
    location: {
      grid_id: 'R4C4',
      section: 'Footer',
    },
    content: {
      label: 'Sync Cloud State',
      icon_name: 'plus',
    },
    action: {
      type: 'external_link',
      target: 'https://github.com/mutiagent-base/ai-button-studio-app-design',
    },
    effects: {
      base_style: 'gradient_fill',
      special_features: ['dynamic_shadow_cursor_tracking'],
    },
    accessibility: {
      aria_label: 'Floating action button to synchronize component tokens with GitHub repository',
      tab_index: 0,
      reduce_motion_safe: true,
    },
    attribution: {
      credit_owner: 'MotionLab Studio',
      license_type: 'MIT',
      source_repository: 'https://github.com/mutiagent-base/ai-button-studio-app-design',
    },
  },
  {
    id: 'btn-secondary-docs',
    type: 'secondary',
    location: {
      grid_id: 'R3C2',
      section: 'Content_Left',
    },
    content: {
      label: 'Read System Specs',
      icon_name: 'arrow-right',
    },
    action: {
      type: 'internal_scroll',
      target: 'DocumentationWiki',
    },
    effects: {
      base_style: 'soft_shadow',
      special_features: ['none'],
    },
    accessibility: {
      aria_label: 'Navigate to comprehensive living button developer documentation wiki',
      tab_index: 0,
      reduce_motion_safe: true,
    },
    attribution: {
      credit_owner: 'AI Systems Architect Group',
      license_type: 'MIT',
      source_repository: 'https://github.com/mutiagent-base/ai-button-studio-app-design',
    },
  },
];

export const PROMPT_FORMULA_EXAMPLES = [
  {
    title: 'Hero RGB Launch Action',
    prompt: '[Hero R2C2] + [Deploy Node Cluster via Modal] + [Neon Glow with Dynamic Shadow & RGB Border]',
  },
  {
    title: 'Header Quick Search',
    prompt: '[Header R1C4] + [Open Command Palette] + [Soft Shadow with Cursor Float]',
  },
  {
    title: 'Content Section Scroll',
    prompt: '[Content_Left R3C1] + [Scroll to Specs Target R4C1] + [RGB Outline with Kinetic Boundary]',
  },
  {
    title: 'Floating Action Pill',
    prompt: '[Footer R4C4] + [Create New Component] + [Gradient Fill with Dynamic Cursor Tracking]',
  },
];
