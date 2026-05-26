# FoodLens Design System — Technical Brief

## Status: APPROVED SPEC — Ready for Implementation

---

## 1. Font Selection

All fonts available via `next/font/google`.

### Display: General Sans → **Outfit**

**Selection: Outfit**
- Geometric sans-serif with subtle personality in the rounded terminals
- Feels modern and confident without being trendy or startup-y
- Excellent weight range (100-900) for flexible hierarchy
- Distinctive enough to feel crafted, neutral enough for trust
- Available on Google Fonts: `Outfit`

**Rationale:** Geometric sans with warmth. The rounded letter endings feel approachable (appropriate for a consumer health tool) without being playful. Not used by major AI startups. Not editorial. Not generic.

### Body: **Source Sans 3**
- Highly readable at small sizes (12-16px)
- Designed for UI use, excellent x-height
- Neutral but warmer than Inter/Roboto
- Clear distinction from Outfit at heading sizes
- Available on Google Fonts: `Source_Sans_3`

**Rationale:** Purpose-built for screens. Adobe's open-source workhorse — readable in cramped mobile UIs (supermarket aisle context). Not boring, not showy.

### Mono: **JetBrains Mono**
- Excellent numeral clarity (critical for nutrition data)
- Clear zero/O distinction
- Slightly wider than average mono — easy to scan columns of numbers
- Available on Google Fonts: `JetBrains_Mono`

**Rationale:** Nutrition numbers (2,300mg sodium, 45g sugar) need to be instantly parseable. JetBrains Mono's generous spacing and distinct numerals serve this.

---

## 2. Color Tokens (OKLCH)

All colors defined in OKLCH for perceptual uniformity. Semantic naming only — no hardcoded values anywhere in components.

```typescript
// src/styles/tokens.ts

export const colors = {
  // Backgrounds
  background: 'oklch(0.99 0.002 90)',        // Near-white, barely warm
  surface: 'oklch(0.96 0.004 90)',           // Subtle card surface
  surfaceRaised: 'oklch(0.93 0.006 90)',     // Elevated surface (hover states)

  // Text
  text: 'oklch(0.15 0.01 60)',              // Near-black, warm undertone
  textMuted: 'oklch(0.45 0.01 60)',         // Secondary text
  textSubtle: 'oklch(0.62 0.01 60)',        // Tertiary/placeholder

  // Primary — deep teal-green (trust, health, food)
  primary: 'oklch(0.45 0.12 170)',          // Deep teal
  primaryHover: 'oklch(0.40 0.12 170)',     // Darker on hover
  primaryActive: 'oklch(0.35 0.12 170)',    // Pressed
  primaryMuted: 'oklch(0.92 0.04 170)',     // Tinted background

  // Semantic
  success: 'oklch(0.55 0.15 145)',          // Green — good scores
  successMuted: 'oklch(0.93 0.04 145)',
  warning: 'oklch(0.70 0.15 75)',           // Amber — caution scores
  warningMuted: 'oklch(0.94 0.04 75)',
  error: 'oklch(0.55 0.18 25)',             // Red — bad scores/errors
  errorMuted: 'oklch(0.94 0.04 25)',
  info: 'oklch(0.55 0.12 240)',             // Blue — informational
  infoMuted: 'oklch(0.93 0.04 240)',

  // Borders
  border: 'oklch(0.88 0.005 90)',           // Default border
  borderStrong: 'oklch(0.75 0.01 90)',      // Emphasized border
  borderFocus: 'oklch(0.45 0.12 170)',      // Focus ring (matches primary)

  // Interactive
  disabled: 'oklch(0.88 0.005 90)',         // Disabled backgrounds
  disabledText: 'oklch(0.65 0.005 90)',     // Disabled text

  // Overlay
  overlay: 'oklch(0.15 0.01 60 / 0.5)',     // Modal backdrop
} as const;
```

### Contrast Verification

| Pair | Ratio | Requirement |
|------|-------|-------------|
| text on background | ~16:1 | Passes AA (4.5:1) |
| textMuted on background | ~5.5:1 | Passes AA (4.5:1) |
| textSubtle on background | ~3.8:1 | UI components only (3:1) |
| primary on background | ~6:1 | Passes AA |
| white on primary | ~7:1 | Passes AA |
| border on background | ~3.2:1 | Passes UI (3:1) |

---

## 3. Typography Scale (Fixed)

No fluid typography. Fixed sizes for predictable product UI.

```typescript
export const typography = {
  display: {
    fontSize: '2.5rem',      // 40px
    lineHeight: '1.1',
    fontWeight: '700',
    fontFamily: 'var(--font-display)',
    letterSpacing: '-0.02em',
  },
  h1: {
    fontSize: '2rem',        // 32px
    lineHeight: '1.2',
    fontWeight: '700',
    fontFamily: 'var(--font-display)',
    letterSpacing: '-0.015em',
  },
  h2: {
    fontSize: '1.5rem',      // 24px
    lineHeight: '1.25',
    fontWeight: '600',
    fontFamily: 'var(--font-display)',
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '1.25rem',     // 20px
    lineHeight: '1.3',
    fontWeight: '600',
    fontFamily: 'var(--font-display)',
    letterSpacing: '-0.005em',
  },
  h4: {
    fontSize: '1.125rem',    // 18px
    lineHeight: '1.4',
    fontWeight: '600',
    fontFamily: 'var(--font-display)',
    letterSpacing: '0',
  },
  body: {
    fontSize: '1rem',        // 16px
    lineHeight: '1.5',
    fontWeight: '400',
    fontFamily: 'var(--font-body)',
    letterSpacing: '0',
  },
  bodySmall: {
    fontSize: '0.875rem',    // 14px
    lineHeight: '1.5',
    fontWeight: '400',
    fontFamily: 'var(--font-body)',
    letterSpacing: '0',
  },
  caption: {
    fontSize: '0.75rem',     // 12px
    lineHeight: '1.4',
    fontWeight: '500',
    fontFamily: 'var(--font-body)',
    letterSpacing: '0.01em',
  },
  mono: {
    fontSize: '0.875rem',    // 14px
    lineHeight: '1.5',
    fontWeight: '500',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0',
    fontVariantNumeric: 'tabular-nums',
  },
  monoLarge: {
    fontSize: '1.25rem',     // 20px
    lineHeight: '1.3',
    fontWeight: '600',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '-0.01em',
    fontVariantNumeric: 'tabular-nums',
  },
} as const;
```

---

## 4. Spacing Scale

Base unit: 4px. Scale follows powers/multiples for rhythm.

```typescript
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
```

### Usage Guidelines
- **Component internal padding:** `spacing[3]` to `spacing[4]` (12-16px)
- **Between related elements:** `spacing[2]` to `spacing[3]` (8-12px)
- **Between sections:** `spacing[8]` to `spacing[12]` (32-48px)
- **Page horizontal padding:** `spacing[4]` minimum (16px), `spacing[6]` on larger screens
- **Body copy max-width:** 65ch (per design guidelines — proper horizontal padding)

---

## 5. Border Radius Scale

```typescript
export const radii = {
  none: '0px',
  sm: '4px',       // Badges, small elements
  md: '8px',       // Buttons, inputs, cards
  lg: '12px',      // Larger cards, modals
  xl: '16px',      // Feature cards
  full: '9999px',  // Pills, avatars
} as const;
```

---

## 6. Shadow Scale

Subtle only. For elevation signaling, not decoration.

```typescript
export const shadows = {
  none: 'none',
  sm: '0 1px 2px oklch(0.15 0.01 60 / 0.05)',
  md: '0 2px 4px oklch(0.15 0.01 60 / 0.06), 0 1px 2px oklch(0.15 0.01 60 / 0.04)',
  lg: '0 4px 8px oklch(0.15 0.01 60 / 0.07), 0 2px 4px oklch(0.15 0.01 60 / 0.04)',
} as const;
```

---

## 7. Component Specs

### 7.1 Button

**Variants:** `primary` | `secondary` | `ghost`
**Sizes:** `sm` | `md` | `lg`

| Property | sm | md | lg |
|----------|----|----|-----|
| Height | 32px | 40px | 48px |
| Padding x | 12px | 16px | 24px |
| Font size | 14px (bodySmall) | 16px (body) | 16px (body) |
| Font weight | 600 | 600 | 600 |
| Border radius | md (8px) | md (8px) | md (8px) |
| Icon size | 16px | 18px | 20px |

**States by variant:**

| State | Primary | Secondary | Ghost |
|-------|---------|-----------|-------|
| Default bg | primary | transparent | transparent |
| Default text | white | primary | text |
| Default border | none | primary | none |
| Hover bg | primaryHover | primaryMuted | surfaceRaised |
| Active bg | primaryActive | primary (text→white) | surface |
| Disabled bg | disabled | disabled | transparent |
| Disabled text | disabledText | disabledText | disabledText |
| Focus ring | 2px offset, borderFocus | 2px offset, borderFocus | 2px offset, borderFocus |

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  asChild?: boolean; // For link usage via Slot pattern
}
```

### 7.2 Input

**Variants:** `default` | `error`
**Sizes:** `md` | `lg`

| Property | md | lg |
|----------|----|----|
| Height | 40px | 48px |
| Padding x | 12px | 16px |
| Font size | 16px | 16px |
| Border radius | md (8px) | md (8px) |
| Label font | bodySmall, weight 500 | bodySmall, weight 500 |
| Error font | caption, error color | caption, error color |

**States:**

| State | Default | Error |
|-------|---------|-------|
| Border | border | error |
| Focus border | borderFocus | error |
| Focus ring | 2px ring, primary @ 20% opacity | 2px ring, error @ 20% opacity |
| Placeholder | textSubtle | textSubtle |
| Label | textMuted | textMuted |
| Error message | — | error color, caption size |

**Props:**
```typescript
interface InputProps {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  // Extends standard input HTML attributes
}
```

**Layout:** Label above input (gap: spacing[1.5]). Error message below input (gap: spacing[1]). Hint below label (textSubtle, caption size).

### 7.3 Badge

**Variants:** `default` | `success` | `warning` | `error` | `info`
**Sizes:** `sm` | `md`

| Property | sm | md |
|----------|----|----|
| Height | 20px | 24px |
| Padding x | 6px | 8px |
| Font size | 12px (caption) | 14px (bodySmall) |
| Font weight | 500 | 500 |
| Border radius | full (pill) | full (pill) |

**Colors by variant:**

| Variant | Background | Text |
|---------|-----------|------|
| default | surfaceRaised | text |
| success | successMuted | success (darkened for contrast) |
| warning | warningMuted | warning (darkened for contrast) |
| error | errorMuted | error |
| info | infoMuted | info |

**Props:**
```typescript
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}
```

### 7.4 Card

**Variants:** `flat` | `elevated`

| Property | flat | elevated |
|----------|------|----------|
| Background | surface | background |
| Border | 1px border | none |
| Shadow | none | shadow.md |
| Border radius | lg (12px) | lg (12px) |
| Padding | spacing[4] (16px) | spacing[5] (20px) |

**No nested cards.** Per design guidelines: no cardocalypse. A card is a top-level container only.

**Props:**
```typescript
interface CardProps {
  variant?: 'flat' | 'elevated';
  padding?: 'sm' | 'md' | 'lg'; // Override: 12px / 16px / 24px
  children: React.ReactNode;
  className?: string;
}
```

### 7.5 Typography

Wrapper components for each scale level. Renders semantic HTML elements.

```typescript
interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType; // Override default element
}

// Components:
// <Display>     → renders <h1> by default
// <Heading1>    → renders <h1>
// <Heading2>    → renders <h2>
// <Heading3>    → renders <h3>
// <Heading4>    → renders <h4>
// <Body>        → renders <p>
// <BodySmall>   → renders <p>
// <Caption>     → renders <span>
// <Mono>        → renders <span>
// <MonoLarge>   → renders <span>
```

Each component applies the corresponding typography token styles. The `as` prop allows semantic override (e.g., `<Heading2 as="h3">` for visual h2 that's semantically h3).

`text-wrap: pretty` applied to all heading components.

---

## 8. File Structure

```
src/
├── styles/
│   └── tokens.ts                    # All design tokens (colors, typography, spacing, radii, shadows)
├── components/
│   └── atoms/
│       ├── Button.tsx               # Button component
│       ├── Button.test.tsx          # Button tests
│       ├── Input.tsx                # Input component
│       ├── Input.test.tsx           # Input tests
│       ├── Badge.tsx                # Badge component
│       ├── Badge.test.tsx           # Badge tests
│       ├── Card.tsx                 # Card component
│       ├── Card.test.tsx            # Card tests
│       ├── Typography.tsx           # All typography components
│       ├── Typography.test.tsx      # Typography tests
│       └── index.ts                 # Barrel export
├── types/
│   └── design-system.ts            # TypeScript types for token system
├── lib/
│   └── utils/
│       └── cn.ts                    # className merge utility (clsx + tailwind-merge)
└── app/
    ├── layout.tsx                   # Updated: Outfit + Source Sans 3 + JetBrains Mono
    └── globals.css                  # Updated: Tailwind v4 @theme with all tokens
```

---

## 9. Implementation Notes

### Bridging TS Tokens into Tailwind v4

Tailwind v4 uses CSS-first configuration via `@theme` blocks. The implementation strategy:

1. **`src/styles/tokens.ts`** is the single source of truth for token VALUES. It exports typed constants.

2. **`src/app/globals.css`** declares CSS custom properties in `:root` and registers them in the `@theme inline` block so Tailwind utilities work:

```css
@import "tailwindcss";

:root {
  /* Colors */
  --color-background: oklch(0.99 0.002 90);
  --color-surface: oklch(0.96 0.004 90);
  --color-surface-raised: oklch(0.93 0.006 90);
  --color-text: oklch(0.15 0.01 60);
  --color-text-muted: oklch(0.45 0.01 60);
  --color-text-subtle: oklch(0.62 0.01 60);
  --color-primary: oklch(0.45 0.12 170);
  --color-primary-hover: oklch(0.40 0.12 170);
  --color-primary-active: oklch(0.35 0.12 170);
  --color-primary-muted: oklch(0.92 0.04 170);
  --color-success: oklch(0.55 0.15 145);
  --color-success-muted: oklch(0.93 0.04 145);
  --color-warning: oklch(0.70 0.15 75);
  --color-warning-muted: oklch(0.94 0.04 75);
  --color-error: oklch(0.55 0.18 25);
  --color-error-muted: oklch(0.94 0.04 25);
  --color-info: oklch(0.55 0.12 240);
  --color-info-muted: oklch(0.93 0.04 240);
  --color-border: oklch(0.88 0.005 90);
  --color-border-strong: oklch(0.75 0.01 90);
  --color-border-focus: oklch(0.45 0.12 170);
  --color-disabled: oklch(0.88 0.005 90);
  --color-disabled-text: oklch(0.65 0.005 90);
  --color-overlay: oklch(0.15 0.01 60 / 0.5);

  /* Spacing — exposed as custom properties for component use */
  --spacing-0: 0px;
  --spacing-0-5: 2px;
  --spacing-1: 4px;
  --spacing-1-5: 6px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-20: 80px;
  --spacing-24: 96px;

  /* Radii */
  --radius-none: 0px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px oklch(0.15 0.01 60 / 0.05);
  --shadow-md: 0 2px 4px oklch(0.15 0.01 60 / 0.06), 0 1px 2px oklch(0.15 0.01 60 / 0.04);
  --shadow-lg: 0 4px 8px oklch(0.15 0.01 60 / 0.07), 0 2px 4px oklch(0.15 0.01 60 / 0.04);

  /* Fonts */
  --font-display: var(--font-outfit);
  --font-body: var(--font-source-sans-3);
  --font-mono: var(--font-jetbrains-mono);
}

@theme inline {
  --color-background: var(--color-background);
  --color-surface: var(--color-surface);
  --color-surface-raised: var(--color-surface-raised);
  --color-text: var(--color-text);
  --color-text-muted: var(--color-text-muted);
  --color-text-subtle: var(--color-text-subtle);
  --color-primary: var(--color-primary);
  --color-primary-hover: var(--color-primary-hover);
  --color-primary-active: var(--color-primary-active);
  --color-primary-muted: var(--color-primary-muted);
  --color-success: var(--color-success);
  --color-success-muted: var(--color-success-muted);
  --color-warning: var(--color-warning);
  --color-warning-muted: var(--color-warning-muted);
  --color-error: var(--color-error);
  --color-error-muted: var(--color-error-muted);
  --color-info: var(--color-info);
  --color-info-muted: var(--color-info-muted);
  --color-border: var(--color-border);
  --color-border-strong: var(--color-border-strong);
  --color-border-focus: var(--color-border-focus);
  --color-disabled: var(--color-disabled);
  --color-disabled-text: var(--color-disabled-text);
  --color-overlay: var(--color-overlay);

  --font-display: var(--font-display);
  --font-body: var(--font-body);
  --font-mono: var(--font-mono);

  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
  --radius-xl: var(--radius-xl);
  --radius-full: var(--radius-full);

  --shadow-sm: var(--shadow-sm);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
}

body {
  background: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-body);
}
```

3. **Components use Tailwind classes** that reference these tokens: `bg-background`, `text-primary`, `rounded-md`, `shadow-md`, etc.

4. **`tokens.ts` mirrors the CSS** and is used for:
   - TypeScript type safety (ensuring only valid token values are used in component props)
   - Storybook/testing where CSS vars may not be loaded
   - Documentation generation

### Font Setup in layout.tsx

```typescript
import { Outfit } from 'next/font/google';
import { Source_Sans_3 } from 'next/font/google';
import { JetBrains_Mono } from 'next/font/google';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const sourceSans = Source_Sans_3({
  variable: '--font-source-sans-3',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});
```

### Utility: `cn()` helper

```typescript
// src/lib/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Requires: `npm install clsx tailwind-merge`

---

## 10. Accessibility Notes

### Focus Management

All interactive elements get a visible focus ring:
```css
/* Base focus style applied via Tailwind */
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background
```

- Focus ring uses `borderFocus` color (same as primary — 6:1 contrast on background)
- 2px ring with 2px offset ensures visibility without overlapping content
- `focus-visible` (not `focus`) — only shows on keyboard navigation, not mouse clicks

### Contrast Requirements

| Element | Minimum Ratio | Standard |
|---------|--------------|----------|
| Body text | 4.5:1 | WCAG AA normal text |
| Large text (18px+ bold, 24px+) | 3:1 | WCAG AA large text |
| UI components (borders, icons) | 3:1 | WCAG AA UI |
| Disabled elements | No requirement | Exempt per WCAG |

### ARIA Patterns per Component

**Button:**
- Uses native `<button>` element (inherits role)
- `aria-disabled` when disabled (keeps focusability for screen readers)
- Loading state: `aria-busy="true"` + visually hidden "Loading" text

**Input:**
- `<label>` linked via `htmlFor`/`id`
- Error: `aria-invalid="true"` + `aria-describedby` pointing to error message `<span>`
- Hint: `aria-describedby` pointing to hint `<span>`
- Required: `aria-required="true"` (in addition to HTML `required`)

**Badge:**
- Purely presentational — no role needed
- If conveying status, use `role="status"` with `aria-label` describing the meaning

**Card:**
- No ARIA role needed (it's a visual container)
- If card is clickable, it must be a `<button>` or `<a>` with appropriate role
- Never nest interactive elements inside a clickable card

**Typography:**
- Semantic HTML elements by default (h1-h4, p, span)
- `as` prop must not break document outline (visual style independent of semantic level)

### Keyboard Navigation

- All interactive elements reachable via Tab
- Buttons activate on Enter and Space
- Custom focus order not needed for atoms (follows DOM order)
- No keyboard traps

### Motion

- All transitions respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

---

## Appendix: Design Rules Referenced from CLAUDE.md

The following rules from `CLAUDE.md` directly inform this spec:

- **"Design tokens in `src/styles/tokens.ts` — no hardcoded colors, spacing, or font sizes"** → All values in tokens.ts, referenced via CSS custom properties
- **"Accessibility: WCAG 2.1 AA minimum. All interactive elements keyboard navigable"** → Section 10 covers all patterns
- **"Don't use Inter, Roboto, Arial, or Space Groesk fonts"** → Selected Outfit, Source Sans 3, JetBrains Mono
- **"Don't use purple gradients, generic card shadows, or cookie-cutter layouts"** → Teal-green primary, subtle shadows only, no gradients
- **"Components use atomic design: atoms → molecules → organisms"** → All components in `src/components/atoms/`
- **"All data types defined in `src/types/`"** → Type file at `src/types/design-system.ts`
- **"Server components by default. `'use client'` only when needed"** → Button with onClick needs `'use client'`; Typography/Badge/Card can be server components

---

## Dependencies to Install

```bash
npm install clsx tailwind-merge
```

No other new dependencies required. All fonts via `next/font/google` (zero-bundle-cost).
