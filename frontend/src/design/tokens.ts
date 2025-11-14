/**
 * Central TypeScript design tokens mirror for runtime & component usage.
 * Sync with CSS variables in `index.css` and Tailwind extension in `tailwind.config.js`.
 */

export const semanticColors = {
  bg: 'var(--color-bg)',
  bgAlt: 'var(--color-bg-alt)',
  text: 'var(--color-text)',
  textMuted: 'var(--color-text-muted)',
  primary: 'var(--color-primary)',
  primaryHover: 'var(--color-primary-hover)',
  accent: 'var(--color-accent)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
  border: 'var(--color-border)'
} as const

export const radii = {
  none: '0px',
  xs: '4px',
  sm: '6px',
  base: 'var(--radius-base)',
  lg: 'var(--radius-lg)',
  xl: '1rem',
  pill: '9999px'
} as const

export const shadows = {
  card: 'var(--shadow-card)',
  glass: '0 8px 32px rgba(31,41,55,0.12)',
  focus: '0 0 0 3px rgba(59,130,246,0.5)'
} as const

export const gradients = {
  brand: 'var(--gradient-brand)'
} as const

export const easing = {
  soft: 'var(--easing-soft)',
  standard: 'var(--easing-standard)'
} as const

export const durations = {
  fast: 'var(--duration-fast)',
  medium: 'var(--duration-medium)',
  slow: 'var(--duration-slow)'
} as const

export const spacingScale = [0,4,8,12,16,20,24,32,40,48,64] as const

export type SemanticColorKey = keyof typeof semanticColors

export function getColor(name: SemanticColorKey): string {
  return semanticColors[name]
}

export const tokens = {
  colors: semanticColors,
  radii,
  shadows,
  gradients,
  easing,
  durations,
  spacingScale
}

export type Tokens = typeof tokens
// Centralized design tokens for JS/TS consumption (charts, theming logic)
// Mirrors Tailwind + CSS variable setup.

export const COLORS = {
  primary: {
    base: 'var(--color-primary)',
    hover: 'var(--color-primary-hover)'
  },
  accent: 'var(--color-accent)',
  bg: 'var(--color-bg)',
  text: 'var(--color-text)',
  muted: 'var(--color-text-muted)',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444'
};

export const RADII = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 9999
};

export const ELEVATION = {
  base: '0 1px 2px 0 rgba(0,0,0,0.05)',
  card: '0 4px 16px rgba(31,41,55,0.08)',
  popover: '0 8px 32px rgba(31,41,55,0.12)'
};

export const TRANSITIONS = {
  soft: 'cubic-bezier(0.22,1,0.36,1)',
  fast: '150ms',
  normal: '250ms'
};

export const CHART_THEME = {
  gridColor: 'rgba(148,163,184,0.25)',
  axisColor: 'var(--color-text-muted)',
  tooltipBg: 'var(--color-bg-alt, #fff)',
  series: [
    'var(--color-primary)',
    'var(--color-accent)',
    '#22c55e',
    '#f59e0b',
    '#ef4444'
  ]
};

export type ColorRamp = keyof typeof COLORS;

export const tokens = { COLORS, RADII, ELEVATION, TRANSITIONS, CHART_THEME };

export default tokens;