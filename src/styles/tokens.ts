/**
 * FoodLens Design Tokens — Single Source of Truth
 *
 * All values are mirrored as CSS custom properties in globals.css.
 * Components should use Tailwind utilities referencing those custom properties.
 * This file provides TypeScript type safety and documentation.
 */

export const colors = {
  // Backgrounds
  background: 'oklch(0.99 0.002 90)',
  surface: 'oklch(0.96 0.004 90)',
  surfaceRaised: 'oklch(0.93 0.006 90)',

  // Text
  text: 'oklch(0.15 0.01 60)',
  textMuted: 'oklch(0.45 0.01 60)',
  textSubtle: 'oklch(0.62 0.01 60)',

  // Primary — deep teal-green
  primary: 'oklch(0.45 0.12 170)',
  primaryHover: 'oklch(0.40 0.12 170)',
  primaryActive: 'oklch(0.35 0.12 170)',
  primaryMuted: 'oklch(0.92 0.04 170)',

  // Semantic
  success: 'oklch(0.55 0.15 145)',
  successMuted: 'oklch(0.93 0.04 145)',
  warning: 'oklch(0.70 0.15 75)',
  warningMuted: 'oklch(0.94 0.04 75)',
  error: 'oklch(0.55 0.18 25)',
  errorMuted: 'oklch(0.94 0.04 25)',
  info: 'oklch(0.55 0.12 240)',
  infoMuted: 'oklch(0.93 0.04 240)',

  // Borders
  border: 'oklch(0.88 0.005 90)',
  borderStrong: 'oklch(0.75 0.01 90)',
  borderFocus: 'oklch(0.45 0.12 170)',

  // Interactive
  disabled: 'oklch(0.88 0.005 90)',
  disabledText: 'oklch(0.65 0.005 90)',

  // Overlay
  overlay: 'oklch(0.15 0.01 60 / 0.5)',
} as const;

export const typography = {
  display: {
    fontSize: '2.5rem',
    lineHeight: '1.1',
    fontWeight: '700',
    fontFamily: 'var(--font-display)',
    letterSpacing: '-0.02em',
  },
  h1: {
    fontSize: '2rem',
    lineHeight: '1.2',
    fontWeight: '700',
    fontFamily: 'var(--font-display)',
    letterSpacing: '-0.015em',
  },
  h2: {
    fontSize: '1.5rem',
    lineHeight: '1.25',
    fontWeight: '600',
    fontFamily: 'var(--font-display)',
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '1.25rem',
    lineHeight: '1.3',
    fontWeight: '600',
    fontFamily: 'var(--font-display)',
    letterSpacing: '-0.005em',
  },
  h4: {
    fontSize: '1.125rem',
    lineHeight: '1.4',
    fontWeight: '600',
    fontFamily: 'var(--font-display)',
    letterSpacing: '0',
  },
  body: {
    fontSize: '1rem',
    lineHeight: '1.5',
    fontWeight: '400',
    fontFamily: 'var(--font-body)',
    letterSpacing: '0',
  },
  bodySmall: {
    fontSize: '0.875rem',
    lineHeight: '1.5',
    fontWeight: '400',
    fontFamily: 'var(--font-body)',
    letterSpacing: '0',
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: '1.4',
    fontWeight: '500',
    fontFamily: 'var(--font-body)',
    letterSpacing: '0.01em',
  },
  mono: {
    fontSize: '0.875rem',
    lineHeight: '1.5',
    fontWeight: '500',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0',
    fontVariantNumeric: 'tabular-nums' as const,
  },
  monoLarge: {
    fontSize: '1.25rem',
    lineHeight: '1.3',
    fontWeight: '600',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '-0.01em',
    fontVariantNumeric: 'tabular-nums' as const,
  },
} as const;

export const spacing = {
  0: '0px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

export const radii = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;

export const shadows = {
  none: 'none',
  sm: '0 1px 2px oklch(0.15 0.01 60 / 0.05)',
  md: '0 2px 4px oklch(0.15 0.01 60 / 0.06), 0 1px 2px oklch(0.15 0.01 60 / 0.04)',
  lg: '0 4px 8px oklch(0.15 0.01 60 / 0.07), 0 2px 4px oklch(0.15 0.01 60 / 0.04)',
} as const;
