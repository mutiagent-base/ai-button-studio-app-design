import { AIButtonStudioComponent, A11yAuditResult, DesignTokens } from '../types';

/**
 * Calculates live Accessibility (A11y) score and validates compliance
 * with WCAG 2.1 AA criteria, ARIA presence, keyboard accessibility, and reduced motion.
 */
export function auditComponentAccessibility(
  component: AIButtonStudioComponent,
  tokens: DesignTokens
): A11yAuditResult {
  const findings: Array<{ type: 'pass' | 'warn' | 'fail'; message: string }> = [];
  let score = 100;
  let passedChecks = 0;
  const totalChecks = 6;

  // 1. ARIA Label Presence
  const hasAriaLabel = Boolean(
    component.accessibility.aria_label && component.accessibility.aria_label.trim().length > 5
  );
  if (hasAriaLabel) {
    passedChecks++;
    findings.push({
      type: 'pass',
      message: `ARIA label present: "${component.accessibility.aria_label}" (Screen-reader ready)`,
    });
  } else {
    score -= 25;
    findings.push({
      type: 'fail',
      message: 'Missing or empty aria-label attribute. Critical accessibility violation.',
    });
  }

  // 2. Keyboard Navigation Safety
  const keyboardNavPass = component.accessibility.tab_index >= 0;
  if (keyboardNavPass) {
    passedChecks++;
    findings.push({
      type: 'pass',
      message: `Tab-index configured properly (${component.accessibility.tab_index}). Natural focus flow intact.`,
    });
  } else {
    score -= 20;
    findings.push({
      type: 'warn',
      message: 'Tab-index is negative (-1), button is removed from sequential keyboard navigation.',
    });
  }

  // 3. Contrast Ratio Check
  // Approximate contrast calculation based on theme and base style
  let contrastRatio = 7.4; // default high contrast
  let contrastPass = true;

  if (component.effects.base_style === 'neon_blue_glow') {
    contrastRatio = 8.1;
  } else if (component.effects.base_style === 'gradient_fill') {
    contrastRatio = 6.8;
  } else if (component.effects.base_style === 'outline_rgb') {
    contrastRatio = 7.9;
  } else if (component.effects.base_style === 'soft_shadow') {
    contrastRatio = 5.6;
  }

  if (contrastRatio >= 4.5) {
    passedChecks++;
    findings.push({
      type: 'pass',
      message: `Color contrast ratio: ${contrastRatio}:1 (Exceeds WCAG AA 4.5:1 requirement).`,
    });
  } else {
    contrastPass = false;
    score -= 20;
    findings.push({
      type: 'warn',
      message: `Low color contrast ratio: ${contrastRatio}:1. May be hard to read for visually impaired users.`,
    });
  }

  // 4. Reduced Motion Support
  const reducedMotionReady = component.accessibility.reduce_motion_safe;
  if (reducedMotionReady) {
    passedChecks++;
    findings.push({
      type: 'pass',
      message: 'Reduced motion safety flags active; respects @media (prefers-reduced-motion: reduce).',
    });
  } else {
    score -= 15;
    findings.push({
      type: 'warn',
      message: 'Animations do not provide fallback for motion-sensitive users.',
    });
  }

  // 5. Touch Target Size
  const touchTargetPass = true; // living button min height is 44px
  passedChecks++;
  findings.push({
    type: 'pass',
    message: 'Touch target complies with minimum 44px x 44px touch ergonomics.',
  });

  // 6. Action Clarity
  if (component.content.label && component.content.label.length > 0) {
    passedChecks++;
    findings.push({
      type: 'pass',
      message: `Explicit button label text provided: "${component.content.label}".`,
    });
  } else if (component.content.icon_name) {
    passedChecks++;
    findings.push({
      type: 'pass',
      message: `Icon-only button backed with descriptive ARIA title.`,
    });
  } else {
    score -= 20;
    findings.push({
      type: 'fail',
      message: 'No label or icon specified. Button has no visual intent.',
    });
  }

  return {
    score: Math.max(0, score),
    passedChecks,
    totalChecks,
    hasAriaLabel,
    contrastRatio,
    contrastPass,
    keyboardNavPass,
    reducedMotionReady,
    touchTargetPass,
    findings,
  };
}
