import { DesignTokens, PresetCategory, PresetUITag } from '../types';

export interface PaletteAnalysisResult {
  hue: number; // 0 - 360
  saturation: number; // 0 - 100
  lightness: number; // 0 - 100
  contrastDark: number; // WCAG contrast against #090d16
  contrastLight: number; // WCAG contrast against #ffffff
  effectiveContrast: number;
  contrastRating: 'AAA' | 'AA' | 'AA Large' | 'Fail';
  suggestedTags: PresetUITag[];
  suggestedCategory: PresetCategory;
  tagExplanations: Array<{ tag: PresetUITag; reason: string }>;
  summaryExplanation: string;
}

/**
 * Parses Hex to RGB [0-255]
 */
export function hexToRgb(hex: string): [number, number, number] {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map(c => c + c)
      .join('');
  }
  if (clean.length !== 6) {
    return [2, 132, 199]; // fallback #0284c7
  }
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Converts RGB [0-255] to HSL [h: 0-360, s: 0-100, l: 0-100]
 */
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * Computes relative luminance per WCAG 2.1 specifications
 */
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculates WCAG contrast ratio between two RGB colors (X:1)
 */
export function getContrastRatio(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  const lum1 = getRelativeLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const lum2 = getRelativeLuminance(rgb2[0], rgb2[1], rgb2[2]);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);
  return Math.round(ratio * 10) / 10;
}

/**
 * Analyzes design tokens, extracting contrast ratios, hue spectrum, and saturation
 * to suggest matching UI categories ('Primary', 'Destructive', 'Utility', 'Hero / CTA', 'Subtle').
 */
export function analyzeColorPalette(tokens: DesignTokens): PaletteAnalysisResult {
  const accentHex = tokens.accentColor || '#0284c7';
  const rgb = hexToRgb(accentHex);
  const [derivedHue, sat, light] = rgbToHsl(rgb[0], rgb[1], rgb[2]);

  // Use primaryHue if explicitly varied or accent color derived
  const hue = tokens.primaryHue !== undefined ? tokens.primaryHue : derivedHue;
  const saturation = sat;
  const lightness = light;

  // Background canvases
  const darkBgRgb: [number, number, number] = [9, 13, 22]; // #090d16
  const lightBgRgb: [number, number, number] = [255, 255, 255]; // #ffffff

  const contrastDark = getContrastRatio(rgb, darkBgRgb);
  const contrastLight = getContrastRatio(rgb, lightBgRgb);
  const effectiveContrast = tokens.themeMode === 'light' ? contrastLight : contrastDark;

  let contrastRating: 'AAA' | 'AA' | 'AA Large' | 'Fail' = 'Fail';
  if (effectiveContrast >= 7.0) {
    contrastRating = 'AAA';
  } else if (effectiveContrast >= 4.5) {
    contrastRating = 'AA';
  } else if (effectiveContrast >= 3.0) {
    contrastRating = 'AA Large';
  }

  const suggestedTags: PresetUITag[] = [];
  const tagExplanations: Array<{ tag: PresetUITag; reason: string }> = [];

  // 1. Destructive Check:
  // Hue in red/rose/crimson/warm alert range [330-360] or [0-25] with saturation >= 45%
  const isDestructiveHue = (hue >= 330 && hue <= 360) || (hue >= 0 && hue <= 25);
  if (isDestructiveHue && saturation >= 40) {
    suggestedTags.push('Destructive');
    tagExplanations.push({
      tag: 'Destructive',
      reason: `Crimson/Red hue (${hue}°) with ${saturation}% saturation signifies critical/destructive actions.`,
    });
  }

  // 2. Utility Check:
  // Green/Emerald matrix [80-165], Amber/Yellow [30-65], or moderate saturation terminal tones
  const isUtilityHue = (hue >= 80 && hue <= 165) || (hue >= 30 && hue <= 65);
  if (isUtilityHue || (saturation <= 45 && saturation >= 20 && tokens.borderRadius <= 8)) {
    suggestedTags.push('Utility');
    tagExplanations.push({
      tag: 'Utility',
      reason: isUtilityHue
        ? `Balanced emerald/amber hue (${hue}°) aligns with operational/system utility tools.`
        : `Structured geometry (${tokens.borderRadius}px) and balanced saturation (${saturation}%) fit utility components.`,
    });
  }

  // 3. Primary Check:
  // Blue/Cyan/Indigo/Purple [170-280] or high contrast (>= 4.5:1) with vibrant saturation (>= 40%)
  const isPrimaryHue = hue >= 170 && hue <= 280;
  if ((isPrimaryHue && saturation >= 40) || (effectiveContrast >= 5.0 && saturation >= 50 && !isDestructiveHue)) {
    suggestedTags.push('Primary');
    tagExplanations.push({
      tag: 'Primary',
      reason: `High contrast (${effectiveContrast}:1) and vibrant brand spectrum (${hue}°) provide maximum focal hierarchy.`,
    });
  }

  // 4. Hero / CTA Check:
  // High saturation (>= 75%) and intense shadow / rapid loop
  if (saturation >= 75 && (effectiveContrast >= 5.5 || tokens.shadowIntensity >= 0.6)) {
    suggestedTags.push('Hero / CTA');
    tagExplanations.push({
      tag: 'Hero / CTA',
      reason: `Ultra-high saturation (${saturation}%) and vivid depth (${Math.round(tokens.shadowIntensity * 100)}% shadow) indicate prominent hero call-to-action.`,
    });
  }

  // 5. Subtle Check:
  // Low saturation (< 35%), low shadow (<= 0.25), or soft contrast
  if (saturation < 35 || tokens.shadowIntensity <= 0.25 || effectiveContrast < 4.0) {
    suggestedTags.push('Subtle');
    tagExplanations.push({
      tag: 'Subtle',
      reason: `Subdued saturation (${saturation}%) and soft shadow intensity (${tokens.shadowIntensity.toFixed(2)}) suited for secondary/quiet triggers.`,
    });
  }

  // Fallback if none matched
  if (suggestedTags.length === 0) {
    suggestedTags.push('Primary');
    tagExplanations.push({
      tag: 'Primary',
      reason: `Standard default interactive component intent with ${effectiveContrast}:1 contrast ratio.`,
    });
  }

  // Determine suggested Preset Category (personal, project, shared)
  let suggestedCategory: PresetCategory = 'personal';
  if (suggestedTags.includes('Hero / CTA') || suggestedTags.includes('Destructive')) {
    suggestedCategory = 'shared';
  } else if (suggestedTags.includes('Utility')) {
    suggestedCategory = 'project';
  } else {
    suggestedCategory = 'personal';
  }

  // Summary explanation sentence
  const topReason = tagExplanations[0]?.reason || `Analyzed contrast (${effectiveContrast}:1) and saturation (${saturation}%).`;
  const summaryExplanation = `Detected ${suggestedTags.join(' & ')} intent: ${topReason}`;

  return {
    hue,
    saturation,
    lightness,
    contrastDark,
    contrastLight,
    effectiveContrast,
    contrastRating,
    suggestedTags,
    suggestedCategory,
    tagExplanations,
    summaryExplanation,
  };
}
