# FoodLens — Australian Food Transparency Platform

## Stack
- Next.js 15 (App Router)
- TypeScript (strict mode)
- Tailwind CSS v4
- PWA (next-pwa)
- ZXing-js (barcode scanning)
- Open Food Facts API (primary data)
- FatSecret API (Australian nutrition data)

## Commands
- `npm run dev` — start dev server (localhost:3000)
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm test` — Jest/Vitest (TBD)

## Architecture

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages + API routes
│   ├── api/                # API route handlers (thin — delegate to lib/)
│   ├── scan/               # Barcode scanner page
│   ├── search/             # Product search page
│   └── product/[barcode]/  # Product detail page
├── components/             # React components (atomic design)
│   ├── atoms/              # Button, Input, Badge, Typography
│   ├── molecules/          # SearchBar, ScoreBar, NutrientRow
│   └── organisms/          # ProductCard, Scanner, NutritionPanel
├── hooks/                  # Custom React hooks
├── lib/                    # Business logic, API clients, utilities
│   ├── api/                # External API clients (Open Food Facts, FatSecret)
│   └── utils/              # Pure utility functions
├── types/                  # TypeScript type definitions
└── styles/                 # Design tokens, global styles
    └── tokens.ts           # Design system tokens
```

### Rules
- Components use atomic design: atoms → molecules → organisms
- API routes are thin handlers — business logic lives in `src/lib/`
- All external API calls go through `src/lib/api/` clients, never called directly from components
- Server components by default. `'use client'` only when needed (interactivity, hooks, browser APIs)
- All data types defined in `src/types/` — no inline type definitions
- Design tokens in `src/styles/tokens.ts` — no hardcoded colors, spacing, or font sizes
- Accessibility: WCAG 2.1 AA minimum. All interactive elements keyboard navigable. All images have alt text.

### Don't Do
- Don't add state management libraries (use React context + server components)
- Don't add an ORM or database (MVP uses external APIs only)
- Don't store user data, auth, or sessions (MVP is stateless)
- Don't add analytics, tracking, or telemetry
- Don't use `any` types or `// @ts-ignore`
- Don't use Inter, Roboto, Arial, or Space Groesk fonts
- Don't add unnecessary dependencies — vanilla JS/React first
- Don't use purple gradients, generic card shadows, or cookie-cutter layouts
- Don't add features not in the approved spec

### Design System
- **Aesthetic:** Clean, restrained, typographic. Inspired by impeccable.style — intentional hierarchy, anti-decoration
- **Theme:** Dark mode primary
- **Typography:** Distinctive display font paired with refined body font. Monospace for data/numbers.
- **Color:** Dominant dark background with sharp accent colors. No pastels. No gradients.
- **Motion:** Purposeful only. No decorative animations. CSS transitions preferred over JS animation libraries.
- **Spacing:** Generous whitespace. Content breathes.
- **Components:** Consistent border radii, shadow levels, and interactive states across all components.

### External APIs
- **Open Food Facts:** `https://world.openfoodfacts.org/api/v2/product/{barcode}.json` — free, ODbL license, 100 req/min
- **FatSecret:** `https://platform.fatsecret.com/rest/` — OAuth 1.0, Premier Free tier for startups <$1M revenue
- Australian barcodes: EAN prefix `93`

### Case Study Documentation
- Every feature gets a build log in `docs/build-log/`
- Design decisions documented in `docs/design-decisions/`
- The docs/ folder IS the portfolio case study source material
