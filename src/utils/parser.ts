import { AIButtonStudioComponent, GridSection, BaseStyleType, SpecialFeature, ButtonCategory, ActionType } from '../types';

/**
 * Intelligent JSON IR Parser
 * Transforms natural language or modular prompts ([Location] + [Action] + [Effect])
 * into the strict AIButtonStudioComponent JSON Intermediate Representation.
 */
export function parsePromptToComponent(promptText: string, existingId?: string): { component: AIButtonStudioComponent; logs: string[] } {
  const logs: string[] = [];
  logs.push(`Initiating lexical analysis of prompt: "${promptText.slice(0, 80)}..."`);

  const lower = promptText.toLowerCase();

  // 1. Grid Location Detection
  let gridId = 'R2C2';
  let section: GridSection = 'Hero';

  const gridMatch = promptText.match(/R([1-4])C([1-4])/i);
  if (gridMatch) {
    gridId = `R${gridMatch[1]}C${gridMatch[2]}`.toUpperCase();
    const row = parseInt(gridMatch[1], 10);
    const col = parseInt(gridMatch[2], 10);
    if (row === 1) section = 'Header';
    else if (row === 2) section = 'Hero';
    else if (row === 3) section = col <= 2 ? 'Content_Left' : 'Content_Right';
    else if (row === 4) section = 'Footer';
    logs.push(`Mapped coordinate ${gridId} -> section "${section}"`);
  } else {
    if (lower.includes('header') || lower.includes('top') || lower.includes('nav')) {
      section = 'Header';
      gridId = 'R1C2';
    } else if (lower.includes('hero') || lower.includes('center') || lower.includes('main')) {
      section = 'Hero';
      gridId = 'R2C2';
    } else if (lower.includes('left') || lower.includes('sidebar')) {
      section = 'Content_Left';
      gridId = 'R3C1';
    } else if (lower.includes('right') || lower.includes('aside')) {
      section = 'Content_Right';
      gridId = 'R3C4';
    } else if (lower.includes('footer') || lower.includes('bottom')) {
      section = 'Footer';
      gridId = 'R4C2';
    }
    logs.push(`Inferred default placement -> ${gridId} (${section})`);
  }

  // 2. Action Type & Target Detection
  let actionType: ActionType = 'open_modal';
  let target = 'ActionDialog_v1';

  if (lower.includes('search') || lower.includes('find') || lower.includes('lookup') || lower.includes('palette')) {
    actionType = 'open_search';
    target = 'GlobalSearch_CommandK';
  } else if (lower.includes('scroll') || lower.includes('navigate') || lower.includes('jump')) {
    actionType = 'internal_scroll';
    const targetCellMatch = promptText.match(/target\s+([R][1-4][C][1-4])/i);
    target = targetCellMatch ? targetCellMatch[1].toUpperCase() : 'R3C1';
  } else if (lower.includes('link') || lower.includes('http') || lower.includes('github') || lower.includes('external') || lower.includes('redirect')) {
    actionType = 'external_link';
    const urlMatch = promptText.match(/https?:\/\/[^\s\]]+/i);
    target = urlMatch ? urlMatch[0] : 'https://github.com/mutiagent-base/ai-button-studio-app-design';
  } else {
    actionType = 'open_modal';
    target = 'ExecutionSequenceModal';
  }
  logs.push(`Synthesized action handler -> ${actionType} [${target}]`);

  // 3. Effects & Base Style Detection
  let baseStyle: BaseStyleType = 'neon_blue_glow';
  const specialFeatures: SpecialFeature[] = [];

  if (lower.includes('rgb') || lower.includes('running border') || lower.includes('conic') || lower.includes('rainbow') || lower.includes('trail')) {
    baseStyle = 'outline_rgb';
    specialFeatures.push('rgb_running_border');
  } else if (lower.includes('gradient') || lower.includes('mesh') || lower.includes('sunset') || lower.includes('aurora')) {
    baseStyle = 'gradient_fill';
  } else if (lower.includes('soft') || lower.includes('subtle') || lower.includes('ghost') || lower.includes('minimal')) {
    baseStyle = 'soft_shadow';
  } else {
    baseStyle = 'neon_blue_glow';
  }

  if (lower.includes('dynamic shadow') || lower.includes('cursor') || lower.includes('tracking') || lower.includes('float') || lower.includes('3d')) {
    if (!specialFeatures.includes('dynamic_shadow_cursor_tracking')) {
      specialFeatures.push('dynamic_shadow_cursor_tracking');
    }
  }

  if (specialFeatures.length === 0) {
    specialFeatures.push('none');
  }
  logs.push(`Configured physics & effects -> style="${baseStyle}", features=[${specialFeatures.join(', ')}]`);

  // 4. Label & Icon extraction
  let label = 'Launch Engine';
  let iconName = 'sparkles';
  let buttonType: ButtonCategory = 'primary';

  // Extract from quotes or bracketed action
  const quotedMatch = promptText.match(/["']([^"']+)["']/);
  const actionBracketMatch = promptText.match(/\[Action:?\s*([^\]]+)\]/i) || promptText.match(/\+\s*\[([^\]]+)\]/);

  if (quotedMatch) {
    label = quotedMatch[1].trim();
  } else if (actionBracketMatch) {
    const rawAction = actionBracketMatch[1].trim();
    // Strip action words if long
    label = rawAction.replace(/via modal|via search|target.*|with.*$/gi, '').trim() || 'Execute Action';
  } else {
    if (lower.includes('search')) label = 'Search Studio';
    else if (lower.includes('deploy') || lower.includes('launch')) label = 'Deploy Action';
    else if (lower.includes('connect') || lower.includes('sync')) label = 'Connect Node';
    else if (lower.includes('download') || lower.includes('export')) label = 'Export Bundle';
    else if (lower.includes('explore') || lower.includes('learn')) label = 'Explore Docs';
  }

  // Icon detection
  if (lower.includes('search')) {
    iconName = 'search';
    buttonType = 'icon';
  } else if (lower.includes('deploy') || lower.includes('rocket')) {
    iconName = 'rocket';
    buttonType = 'primary';
  } else if (lower.includes('spark') || lower.includes('ai') || lower.includes('magic')) {
    iconName = 'sparkles';
    buttonType = 'primary';
  } else if (lower.includes('plus') || lower.includes('add') || lower.includes('create') || lower.includes('fab')) {
    iconName = 'plus';
    buttonType = lower.includes('fab') ? 'fab' : 'primary';
  } else if (lower.includes('arrow') || lower.includes('doc') || lower.includes('next')) {
    iconName = 'arrow-right';
    buttonType = 'secondary';
  } else if (lower.includes('check') || lower.includes('save')) {
    iconName = 'check';
  }

  if (lower.includes('secondary') || lower.includes('ghost') || lower.includes('outline')) {
    buttonType = 'secondary';
  } else if (lower.includes('fab') || lower.includes('floating')) {
    buttonType = 'fab';
  }

  // 5. Automated ARIA Label and A11y Injection per Section 1.3
  const ariaLabel = `Interactive button to ${label.toLowerCase()} (${actionType.replace('_', ' ')} targeting ${target}) with dynamic visual feedback`;
  logs.push(`Synthesized automated ARIA label -> "${ariaLabel}"`);

  // 6. Automated Code Attribution per Section 1.5
  const creditOwner = 'AI Button Studio Community Contributor';
  const licenseType = 'MIT';
  const sourceRepo = 'https://github.com/mutiagent-base/ai-button-studio-app-design';
  logs.push(`Captured automated attribution -> Author: ${creditOwner} [License: ${licenseType}]`);

  const component: AIButtonStudioComponent = {
    id: existingId || `btn-${Date.now().toString(36)}`,
    type: buttonType,
    location: {
      grid_id: gridId,
      section,
    },
    content: {
      label,
      icon_name: iconName,
    },
    action: {
      type: actionType,
      target,
    },
    effects: {
      base_style: baseStyle,
      special_features: specialFeatures,
    },
    accessibility: {
      aria_label: ariaLabel,
      tab_index: 0,
      reduce_motion_safe: true,
    },
    attribution: {
      credit_owner: creditOwner,
      license_type: licenseType,
      source_repository: sourceRepo,
    },
  };

  return { component, logs };
}
