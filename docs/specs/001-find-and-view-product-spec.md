# Spec 001: Find and View a Product — Technical Brief

**Story:** [001-find-and-view-product](../stories/001-find-and-view-product.md)
**Date:** 2026-05-19
**Status:** DRAFT

---

## Table of Contents

1. [Types](#1-types)
2. [API Client](#2-api-client)
3. [API Routes](#3-api-routes)
4. [Hooks](#4-hooks)
5. [Molecules](#5-molecules)
6. [Organisms](#6-organisms)
7. [Pages](#7-pages)
8. [Dependencies](#8-dependencies)

---

## 1. Types

All types live in `src/types/`. No inline type definitions.

### `src/types/product.ts`

```typescript
// ---------- Nutri-Score ----------

export type NutriScoreGrade = 'a' | 'b' | 'c' | 'd' | 'e';

export interface NutriScoreDisplay {
  grade: NutriScoreGrade;
  /** Numeric score from Open Food Facts (-15 to 40) */
  score: number | null;
  label: string;   // "Excellent" | "Good" | "Moderate" | "Poor" | "Bad"
  color: string;   // Tailwind class: "text-success" | "text-warning" | "text-error"
  bgColor: string; // Tailwind class: "bg-success-muted" | "bg-warning-muted" | "bg-error-muted"
}

/**
 * Mapping table (used in the mapper, not a runtime type):
 *   a → label: "Excellent",  color: "text-success",  bgColor: "bg-success-muted"
 *   b → label: "Good",       color: "text-success",  bgColor: "bg-success-muted"
 *   c → label: "Moderate",   color: "text-warning",  bgColor: "bg-warning-muted"
 *   d → label: "Poor",       color: "text-error",    bgColor: "bg-error-muted"
 *   e → label: "Bad",        color: "text-error",    bgColor: "bg-error-muted"
 */

// ---------- NOVA Group ----------

export type NovaGroup = 1 | 2 | 3 | 4;

export interface NovaGroupDisplay {
  group: NovaGroup;
  label: string;   // "Minimally processed" | "Processed ingredients" | "Processed" | "Ultra-processed"
  color: string;   // Tailwind class
  bgColor: string; // Tailwind class
}

/**
 * Mapping table:
 *   1 → label: "Minimally processed",  color: "text-success",  bgColor: "bg-success-muted"
 *   2 → label: "Processed ingredients", color: "text-success",  bgColor: "bg-success-muted"
 *   3 → label: "Processed",            color: "text-warning",  bgColor: "bg-warning-muted"
 *   4 → label: "Ultra-processed",      color: "text-error",    bgColor: "bg-error-muted"
 */

// ---------- Health Star Rating ----------

/** HSR is 0.5 to 5.0 in 0.5 increments. Prefer HSR for Australian products (EAN prefix 93). */
export type HealthStarRating = number; // 0.5 - 5.0

export interface HealthStarDisplay {
  stars: HealthStarRating;
  color: string;
  bgColor: string;
}

/**
 * Mapping:
 *   >= 3.5 → success
 *   >= 2.0 → warning
 *   < 2.0  → error
 */

// ---------- Ingredients Score ----------

export type IngredientConcernLevel = 'low' | 'moderate' | 'high';

export interface IngredientScoreDisplay {
  level: IngredientConcernLevel;
  additiveCount: number;
  novaGroup: NovaGroup | null;
  label: string;   // "Few concerns" | "Some concerns" | "Many concerns"
  color: string;
  bgColor: string;
}

/**
 * Scoring logic (derived from OFF data, no custom methodology):
 *   additiveCount from product.additives_n
 *   novaGroup from product.nova_group
 *
 *   high:     additiveCount >= 5 OR novaGroup === 4
 *   moderate: additiveCount >= 2 OR novaGroup === 3
 *   low:      everything else
 *
 *   high     → label: "Many concerns",  color: "text-error",   bgColor: "bg-error-muted"
 *   moderate → label: "Some concerns",  color: "text-warning", bgColor: "bg-warning-muted"
 *   low      → label: "Few concerns",   color: "text-success", bgColor: "bg-success-muted"
 */

// ---------- Allergens ----------

/**
 * PEAL 2026 mandatory 14 allergens.
 * OFF returns these as "en:gluten", "en:milk", etc. in allergens_tags and traces_tags.
 */
export type AllergenId =
  | 'gluten'
  | 'crustaceans'
  | 'eggs'
  | 'fish'
  | 'peanuts'
  | 'soy'
  | 'milk'
  | 'tree-nuts'
  | 'celery'
  | 'mustard'
  | 'sesame'
  | 'sulfites'
  | 'lupine'
  | 'mollusks';

export interface Allergen {
  id: AllergenId;
  /** Human-readable name, title case: "Gluten", "Tree Nuts", etc. */
  name: string;
  /** "declared" = listed in allergens_tags. "trace" = listed in traces_tags ("may contain"). */
  type: 'declared' | 'trace';
}

/**
 * Mapping from OFF tag to AllergenId:
 *   "en:gluten" → "gluten", "en:crustaceans" → "crustaceans", etc.
 *   Strip the "en:" prefix and normalize.
 *   Ignore any tags not in the PEAL 14 list.
 */

// ---------- Nutrients ----------

export interface Nutrient {
  /** e.g. "Energy", "Fat", "Sugars", "Salt", "Protein", "Fibre" */
  name: string;
  /** Value per 100g. Null if data missing. */
  per100g: number | null;
  /** Value per serving. Null if data missing or no serving size. */
  perServing: number | null;
  /** e.g. "kJ", "g", "mg" */
  unit: string;
  /** Daily intake percentage per serving, if available. */
  dailyPercent: number | null;
}

// ---------- Product ----------

export interface Product {
  barcode: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  imageSmallUrl: string | null;

  // Scores — null when data not available from OFF
  nutriScore: NutriScoreDisplay | null;
  healthStarRating: HealthStarDisplay | null;
  novaGroup: NovaGroupDisplay | null;
  ingredientScore: IngredientScoreDisplay | null;

  // Ingredients
  ingredientsText: string | null;
  additivesTags: string[];     // Raw OFF tags, e.g. ["en:e300", "en:e330"]
  additivesCount: number;

  // Allergens
  allergens: Allergen[];       // Declared allergens (from allergens_tags)
  traces: Allergen[];          // "May contain" (from traces_tags)

  // Nutrition
  servingSize: string | null;  // e.g. "30g"
  nutrients: Nutrient[];

  // Metadata
  dataSource: 'openfoodfacts';
  lastUpdated: string | null;
}

// ---------- Search ----------

export interface SearchResultProduct {
  barcode: string;
  name: string;
  brand: string;
  imageSmallUrl: string | null;
  nutriScoreGrade: NutriScoreGrade | null;
  novaGroup: NovaGroup | null;
}

export interface SearchResponse {
  products: SearchResultProduct[];
  totalResults: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ---------- API Response Wrappers ----------

export interface ProductApiResponse {
  status: 'found' | 'not_found' | 'error';
  product: Product | null;
  error?: string;
}

export interface SearchApiResponse {
  status: 'ok' | 'error';
  data: SearchResponse | null;
  error?: string;
}
```

---

## 2. API Client

### `src/lib/api/openfoodfacts.ts`

**Purpose:** Encapsulates all Open Food Facts HTTP calls. Components and pages never call OFF directly.

```typescript
// Exported functions:
export async function getProduct(barcode: string): Promise<ProductApiResponse>
export async function searchProducts(query: string, page?: number): Promise<SearchApiResponse>
```

**`getProduct(barcode)`**

- Calls `GET https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
- Sets `User-Agent: FoodLens/1.0 (https://foodlens.app)` header (OFF requires this for polite clients)
- If `response.status === 0` (OFF's "not found" indicator), returns `{ status: 'not_found', product: null }`
- If `response.status === 1`, maps raw response through `mapProduct()` (see below), returns `{ status: 'found', product }`
- On fetch failure (network error, timeout), returns `{ status: 'error', product: null, error: 'message' }`
- **Timeout:** 8 seconds via `AbortController`

**`searchProducts(query, page = 1)`**

- Calls `GET https://world.openfoodfacts.org/cgi/search.pl` with params:
  - `search_terms={query}`
  - `search_simple=1`
  - `action=process`
  - `json=1`
  - `page_size=20`
  - `page={page}`
  - `country=australia`
- Maps each result through `mapSearchResult()`
- Returns `SearchApiResponse` with pagination metadata
- **Timeout:** 10 seconds

**Internal: `mapProduct(raw: OFFProductRaw): Product`**

Maps the raw OFF response to our `Product` type. This function handles:

1. `name` ← `raw.product_name || 'Unknown product'`
2. `brand` ← `raw.brands || 'Unknown brand'`
3. `imageUrl` ← `raw.image_url || null`
4. `nutriScore` ← calls `mapNutriScore(raw.nutriscore_grade, raw.nutriscore_score)`
5. `healthStarRating` ← null for MVP (OFF does not reliably provide HSR; add when available)
6. `novaGroup` ← calls `mapNovaGroup(raw.nova_group)`
7. `ingredientScore` ← calls `mapIngredientScore(raw.additives_n, raw.nova_group)`
8. `allergens` ← calls `mapAllergens(raw.allergens_tags, 'declared')`
9. `traces` ← calls `mapAllergens(raw.traces_tags, 'trace')`
10. `nutrients` ← calls `mapNutrients(raw.nutriments, raw.serving_size)`
11. `additivesTags` ← `raw.additives_tags || []`
12. `additivesCount` ← `raw.additives_n || 0`
13. `servingSize` ← `raw.serving_size || null`
14. `ingredientsText` ← `raw.ingredients_text || null`

**Internal: `mapAllergens(tags: string[], type: 'declared' | 'trace'): Allergen[]`**

- Input: `["en:gluten", "en:milk", "en:nuts"]`
- Strip `"en:"` prefix from each tag
- Normalize: `"nuts"` → `"tree-nuts"` (handle OFF naming variations)
- Filter: only include tags that match a valid `AllergenId` from the PEAL 14 list
- Output: `[{ id: "gluten", name: "Gluten", type: "declared" }, ...]`

**Internal: `mapNutrients(nutriments: object, servingSize: string | null): Nutrient[]`**

Maps the following nutrients in this order:

| Nutrient | OFF key prefix | Unit |
|----------|---------------|------|
| Energy | `energy` | kJ |
| Fat | `fat` | g |
| Saturated fat | `saturated-fat` | g |
| Carbohydrates | `carbohydrates` | g |
| Sugars | `sugars` | g |
| Fibre | `fiber` | g |
| Protein | `proteins` | g |
| Salt | `salt` | g |
| Sodium | `sodium` | mg |

For each: `per100g = nutriments[`${key}_100g`]`, `perServing = nutriments[`${key}_serving`]`. If either key is missing or not a number, set to `null`.

**Internal raw type (not exported):**

```typescript
interface OFFProductRaw {
  product_name?: string;
  brands?: string;
  image_url?: string;
  image_small_url?: string;
  ingredients_text?: string;
  allergens_tags?: string[];
  traces_tags?: string[];
  additives_tags?: string[];
  additives_n?: number;
  nova_group?: number;
  nutriscore_grade?: string;
  nutriscore_score?: number;
  nutriments?: Record<string, number>;
  serving_size?: string;
  // ... other fields we ignore
}
```

**Error handling:**

- Network failures: catch fetch errors, return `{ status: 'error', error: 'Unable to reach food database. Check your connection.' }`
- Timeout: return `{ status: 'error', error: 'Request timed out. Please try again.' }`
- Malformed response: wrap in try/catch, return error status
- Never throw. Always return a typed response.

---

## 3. API Routes

### `src/app/api/product/[barcode]/route.ts`

```typescript
export async function GET(
  request: Request,
  { params }: { params: Promise<{ barcode: string }> }
): Promise<Response>
```

- Extracts `barcode` from route params
- Calls `getProduct(barcode)` from `src/lib/api/openfoodfacts.ts`
- Returns JSON with appropriate status codes:
  - `200` + `ProductApiResponse` when found
  - `404` + `{ status: 'not_found', product: null }` when not found
  - `500` + `{ status: 'error', error: '...' }` on failure
- Sets `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` (products don't change often)
- **Thin handler.** No business logic. Just calls the client and returns.

### `src/app/api/search/route.ts`

```typescript
export async function GET(request: Request): Promise<Response>
```

- Reads `q` and `page` from `request.nextUrl.searchParams`
- If `q` is empty or missing, returns `400` with `{ status: 'error', error: 'Search query is required' }`
- Calls `searchProducts(q, page)` from `src/lib/api/openfoodfacts.ts`
- Returns JSON with status codes:
  - `200` + `SearchApiResponse` on success
  - `500` + `{ status: 'error', error: '...' }` on failure
- Sets `Cache-Control: public, s-maxage=300, stale-while-revalidate=3600`
- **Thin handler.**

---

## 4. Hooks

### `src/hooks/useDebounce.ts`

```typescript
export function useDebounce<T>(value: T, delay: number): T
```

- **File path:** `src/hooks/useDebounce.ts`
- **Purpose:** Debounces a value (typically search input text). Returns the debounced value after `delay` ms of inactivity.
- **Implementation:** `useState` + `useEffect` with `setTimeout` / `clearTimeout`
- **Usage:** `const debouncedQuery = useDebounce(searchInput, 300)`
- **Client component:** Yes (`'use client'`)
- **Dependencies:** None (vanilla React)
- **Tests:** Pure hook, easy to test with `renderHook`

### `src/hooks/useBarcodeScanner.ts`

```typescript
export interface BarcodeScannerState {
  status: 'idle' | 'requesting-permission' | 'scanning' | 'error' | 'no-camera';
  error: string | null;
  lastBarcode: string | null;
}

export interface BarcodeScannerControls {
  start: (videoElement: HTMLVideoElement) => Promise<void>;
  stop: () => void;
  toggleFlashlight: () => Promise<void>;
  isFlashlightOn: boolean;
  isFlashlightSupported: boolean;
}

export function useBarcodeScanner(
  onDetected: (barcode: string) => void
): [BarcodeScannerState, BarcodeScannerControls]
```

- **File path:** `src/hooks/useBarcodeScanner.ts`
- **Purpose:** Wraps ZXing-js barcode reading and camera access. Handles permission flow, flashlight, and cleanup.
- **Client component:** Yes (`'use client'`)
- **Dependencies:** `@aspect-dev/zxing-js` (see section 8)

**Behavior:**

1. `start(videoElement)`:
   - Checks `navigator.mediaDevices` existence. If absent, sets `status: 'no-camera'`.
   - Calls `navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })`.
   - Sets `status: 'requesting-permission'` while the browser prompt is open.
   - On grant: attaches stream to `videoElement`, creates ZXing `BrowserMultiFormatReader`, starts continuous decode. Sets `status: 'scanning'`.
   - On deny: sets `status: 'error'`, `error: 'Camera access denied'`.
   - On detection: calls `onDetected(barcode)`, then calls `stop()`.
2. `stop()`:
   - Stops all media tracks on the stream.
   - Resets ZXing reader.
   - Sets `status: 'idle'`.
3. `toggleFlashlight()`:
   - Uses `MediaStreamTrack.applyConstraints({ advanced: [{ torch: true/false }] })`.
   - Only works if `isFlashlightSupported` is true (check `track.getCapabilities().torch`).
4. Cleanup: `useEffect` return calls `stop()` on unmount.

**Supported formats:** EAN-13, EAN-8 (configured in ZXing reader hints).

**Scope boundaries:**
- Does NOT handle navigation after scan (the consuming component does that)
- Does NOT validate barcode format
- Does NOT call any API

---

## 5. Molecules

### `src/components/molecules/SearchBar.tsx`

- **File path:** `src/components/molecules/SearchBar.tsx`
- **Client component:** Yes (`'use client'`)

```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  loading?: boolean;
  className?: string;
}
```

**Uses atoms:** `Input`

**Design tokens:**
- Border: `border-border`, focus: `border-focus` (via Input atom)
- Icon color: `text-text-subtle`
- Clear button: `text-text-muted`, hover: `text-text`

**Rendering:**
- Wraps the `Input` atom with `leftIcon` set to a search icon (magnifying glass SVG, inline, no icon library)
- When `value` is non-empty, renders a clear button as `rightIcon` (X icon)
- Clear button calls `onChange('')`
- `onSubmit` fires on Enter key press
- `loading` prop shows a small spinner in place of the search icon

**Accessibility:**
- `role="search"` on the wrapping `<form>` element
- `aria-label="Search for food products"`
- Input: `type="search"`, `inputMode="search"`, `enterKeyHint="search"`
- Clear button: `aria-label="Clear search"`, `type="button"`
- Auto-focus on desktop when `autoFocus` is true (respects `prefers-reduced-motion`)

**States:**
- Empty: search icon visible, no clear button
- Typing: search icon, clear button appears
- Loading: spinner replaces search icon
- Focused: focus ring from Input atom

**Scope boundaries:**
- Does NOT debounce internally (parent uses `useDebounce` hook)
- Does NOT fetch results
- Does NOT render results

---

### `src/components/molecules/ScoreBadge.tsx`

- **File path:** `src/components/molecules/ScoreBadge.tsx`
- **Client component:** No (server component)

```typescript
interface ScoreBadgeProps {
  type: 'nutriscore' | 'nova' | 'ingredients' | 'hsr';
  value: string | number | null;  // grade letter, NOVA group number, concern level, or star rating
  label: string;                   // "Excellent", "Ultra-processed", "Few concerns", etc.
  color: string;                   // Tailwind text color class
  bgColor: string;                 // Tailwind bg color class
  className?: string;
}
```

**Uses atoms:** `Badge`, `Caption`, `MonoLarge`

**Design tokens:**
- Colors: `success`, `success-muted`, `warning`, `warning-muted`, `error`, `error-muted` (passed via props, not hardcoded)
- Typography: `MonoLarge` for the score value, `Caption` for the label
- Radius: `rounded-lg` (from `radii.lg`)
- Padding: `p-3` (from `spacing.3`)

**Rendering:**
- Vertical stack inside a `Card` (flat variant, sm padding)
- Top: score value in `MonoLarge` with the semantic `color` class
- Middle: type label in `Caption` with `text-text-muted` (e.g., "Nutrition", "Processing", "Ingredients")
- Bottom: descriptive label in `Caption` with the semantic `color` class

**When `value` is null:**
- Display "N/A" in `MonoLarge` with `text-text-subtle`
- Label shows "No data" in `Caption` with `text-text-subtle`

**Accessibility:**
- `aria-label` combining type and label: e.g., `"Nutrition score: A, Excellent"`
- Wrapping element uses `role="img"` since this is a visual indicator

**Scope boundaries:**
- Does NOT fetch scores
- Does NOT determine which score type to show (parent decides)
- Pure presentational

---

### `src/components/molecules/NutrientRow.tsx`

- **File path:** `src/components/molecules/NutrientRow.tsx`
- **Client component:** No (server component)

```typescript
interface NutrientRowProps {
  name: string;          // "Energy", "Fat", "Sugars"
  per100g: number | null;
  perServing: number | null;
  unit: string;          // "kJ", "g", "mg"
  dailyPercent: number | null;
  isSubRow?: boolean;    // For indented child nutrients (e.g., "Saturated fat" under "Fat")
  className?: string;
}
```

**Uses atoms:** `Body`, `BodySmall`, `Mono`, `Caption`

**Design tokens:**
- Typography: `Mono` for numeric values (tabular-nums for alignment)
- Border: `border-border` for bottom separator
- Spacing: `py-2` (`spacing.2`)
- Indentation: `pl-4` (`spacing.4`) when `isSubRow` is true
- Text color: `text-text` for name, `text-text-muted` for unit

**Rendering:**
- Horizontal flex row with three columns:
  1. Nutrient name (`BodySmall`, left-aligned, `flex-1`)
  2. Per-serving value (`Mono`, right-aligned, fixed width `w-20`)
  3. Per-100g value (`Mono`, right-aligned, fixed width `w-20`)
- If a value is null, display `"--"` in `text-text-subtle`
- Daily percentage shown in `Caption` next to per-serving value when available
- Bottom border on each row except the last (use `border-b border-border`)

**Accessibility:**
- Rows are inside a `<table>` in the parent (`NutritionPanel`), so these render as `<tr>` + `<td>` elements
- Numeric values use `aria-label` for screen readers: e.g., `"Fat: 12 grams per serving, 24 grams per 100 grams"`

**Scope boundaries:**
- Single row only. The table structure is in `NutritionPanel`.
- Does NOT toggle between per-serve and per-100g (the parent controls column visibility)

---

### `src/components/molecules/AllergenBadge.tsx`

- **File path:** `src/components/molecules/AllergenBadge.tsx`
- **Client component:** No (server component)

```typescript
interface AllergenBadgeProps {
  allergen: Allergen;    // From src/types/product.ts
  className?: string;
}
```

**Uses atoms:** `Badge`

**Design tokens:**
- Declared allergens: `Badge` with `variant="error"` (error-muted bg, error text)
- Trace allergens ("may contain"): `Badge` with `variant="warning"` (warning-muted bg, warning text)

**Rendering:**
- Renders a `Badge` atom
- Text content: allergen name in bold, e.g., **"Gluten"** or **"May contain: Peanuts"**
- Declared: `<Badge variant="error"><strong>{allergen.name}</strong></Badge>`
- Trace: `<Badge variant="warning">May contain: <strong>{allergen.name}</strong></Badge>`
- Bold text satisfies PEAL 2026 requirement for allergen emphasis

**Accessibility:**
- `role="status"` for declared allergens (they're alerts)
- `aria-label`: `"Contains {name}"` for declared, `"May contain {name}"` for trace

**Scope boundaries:**
- Single allergen only. Parent arranges multiple badges in a flex row.

---

### `src/components/molecules/SearchResultRow.tsx`

- **File path:** `src/components/molecules/SearchResultRow.tsx`
- **Client component:** No (server component)

```typescript
interface SearchResultRowProps {
  product: SearchResultProduct;  // From src/types/product.ts
  className?: string;
}
```

**Uses atoms:** `Body`, `BodySmall`, `Caption`

**Design tokens:**
- Background: `bg-background` default, `hover:bg-surface` on hover
- Border: `border-b border-border`
- Padding: `p-3` (`spacing.3`)
- Radius: none (list rows don't round)
- Image: `w-12 h-12` (`spacing.12`), `rounded-md`, `object-cover`

**Rendering:**
- Horizontal flex row wrapped in a `<Link href={`/product/${product.barcode}`}>`
- Left: product image (48x48). If `imageSmallUrl` is null, render a placeholder div with `bg-surface-raised` and a generic food icon (inline SVG).
- Center (flex-1, `min-w-0` for truncation):
  - Product name in `Body`, single line, `truncate`
  - Brand in `BodySmall` with `text-text-muted`, single line, `truncate`
- Right: Nutri-Score letter in a small colored circle if available, otherwise nothing
- Next.js `<Image>` component for the product image with `alt={product.name}`

**Accessibility:**
- The entire row is a single `<a>` (via `<Link>`)
- `aria-label`: `"${product.name} by ${product.brand}"`
- Focus: `focus-ring` class (from globals.css)
- Keyboard: Enter/Space navigates to product page

**Image error handling:**
- Use `onError` on `<Image>` to swap to placeholder
- This requires `'use client'` only if using `onError` — alternative: use CSS `object-fit` with a background fallback on the container. Prefer the CSS approach to keep this a server component.
- **Decision: make this a client component** to handle image `onError` gracefully.
- Update: `'use client'`

**Scope boundaries:**
- Does NOT fetch data
- Does NOT handle click navigation (Next.js `<Link>` does)

---

## 6. Organisms

### `src/components/organisms/Scanner.tsx`

- **File path:** `src/components/organisms/Scanner.tsx`
- **Client component:** Yes (`'use client'`)

```typescript
interface ScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
  className?: string;
}
```

**Uses atoms:** `Button`, `Input`, `Body`, `BodySmall`, `Heading3`
**Uses hooks:** `useBarcodeScanner`

**Design tokens:**
- Background: `bg-overlay` for the full-screen overlay behind the viewfinder
- Viewfinder border: `border-2 border-white` (white against camera feed)
- Controls: `bg-background/80 backdrop-blur-sm` for the bottom control bar
- Spacing: `p-4` for control bar padding

**Rendering:**

The scanner has four visual states based on `BarcodeScannerState.status`:

1. **`requesting-permission`:**
   - Full-screen dark background
   - Centered card (`Card` elevated, `max-w-sm`)
   - `Heading3`: "Camera Access Needed"
   - `Body`: "FoodLens needs camera access to scan barcodes on food products. Your camera feed is processed on your device and never sent to our servers."
   - `Button` primary: "Allow Camera Access" (triggers `controls.start()`)
   - `Button` ghost: "Search Instead" (navigates to `/search`)
   - `Button` ghost: "Enter Barcode Manually" (toggles manual entry)

2. **`scanning`:**
   - `<video>` element fills the viewport, `object-cover`
   - Scan region indicator: centered rectangle (280x160px) with animated border (subtle pulse via CSS `@keyframes`, respects `prefers-reduced-motion`)
   - Top bar: close button (X icon, `Button` ghost, white text) positioned top-left
   - Bottom bar: semi-transparent control strip
     - Flashlight toggle button (torch icon) — only rendered if `isFlashlightSupported`
     - "Enter manually" text button
   - Manual entry: when toggled, an `Input` slides up from the bottom with `inputMode="numeric"`, placeholder "Enter barcode number", and a "Look up" `Button`

3. **`error`:**
   - Same layout as permission request
   - `Heading3`: "Camera Not Available"
   - `Body`: error message from hook
   - If permission denied: include instructions for re-enabling in device settings (iOS Safari, Android Chrome)
   - `Button` primary: "Search by Name" (navigates to `/search`)
   - `Button` secondary: "Enter Barcode Manually" (toggles manual entry)

4. **`no-camera`:**
   - Same as error state but with messaging: "No camera detected. You can search for products by name or enter a barcode number directly."

**Manual entry behavior:**
- Text field with `inputMode="numeric"`, `pattern="[0-9]*"`, `maxLength={13}`
- On submit (Enter or button click): calls `onScan(value)` with the typed barcode
- No client-side format validation (per resolved open question: send to API, let it return "not found" if invalid)

**Accessibility:**
- Close button: `aria-label="Close scanner"`
- Flashlight: `aria-label="Toggle flashlight"`, `aria-pressed={isFlashlightOn}`
- Video element: `aria-hidden="true"` (purely visual)
- Manual entry form: `role="form"`, `aria-label="Manual barcode entry"`
- Focus management: when scanner opens, focus the close button. When switching to manual entry, focus the input.
- `Escape` key closes the scanner

**Scope boundaries:**
- Does NOT call the product API (parent handles navigation)
- Does NOT display product results
- Does NOT queue multiple scans — one scan, then stop

---

### `src/components/organisms/ProductCard.tsx`

- **File path:** `src/components/organisms/ProductCard.tsx`
- **Client component:** Yes (`'use client'`) — needed for expandable sections

```typescript
interface ProductCardProps {
  product: Product;       // From src/types/product.ts
  className?: string;
}
```

**Uses atoms:** `Card`, `Badge`, `Heading2`, `Heading3`, `Heading4`, `Body`, `BodySmall`, `Caption`, `Mono`
**Uses molecules:** `ScoreBadge`, `AllergenBadge`, `NutrientRow`
**Uses organisms:** `NutritionPanel`

**Design tokens:**
- Product image: `rounded-lg`, `shadow-md`, max height `h-48`, `object-contain` (not cover — product images vary)
- Score badges row: `gap-3` (`spacing.3`), horizontal flex, wrap on mobile
- Allergen section: `mt-4` (`spacing.4`), `gap-2` (`spacing.2`) for badge spacing
- Section dividers: `border-t border-border`, `py-6` (`spacing.6`)

**Layer 1 -- Glance:**
- Product image (or placeholder if `imageUrl` is null)
- Product name (`Heading2`), brand (`BodySmall`, `text-text-muted`)
- Three `ScoreBadge` components in a row:
  1. Nutrition: uses `product.nutriScore` (prefer HSR for EAN-93 products — but HSR is null for MVP, so always use Nutri-Score)
  2. Processing: uses `product.novaGroup`
  3. Ingredients: uses `product.ingredientScore`
- Allergen alerts: if `product.allergens.length > 0`, render a row of `AllergenBadge` components. Declared first, then traces.

**Layer 2 -- Scan:**
- **Ingredients list:** Render `product.ingredientsText` as `Body` text. Additives from `product.additivesTags` are highlighted within the text: wrap matching additive names in `<mark>` tags with `bg-warning-muted text-warning rounded px-0.5`. If `ingredientsText` is null, show `BodySmall` with `text-text-subtle`: "Ingredient list not available."
- **Nutrition panel:** `NutritionPanel` organism (see below)
- **Allergen summary:** Full list of declared + traces with visual distinction

**Layer 3 -- Deep Dive (expandable):**
- Each additive in `additivesTags` is rendered as a collapsible item (using `<details>`/`<summary>` for no-JS support)
  - Summary: additive code (e.g., "E300")
  - Detail: additive name, category, and a note "Data from Open Food Facts"
  - For MVP, deep additive info is limited to what OFF provides. No custom risk database.
- Full nutrition breakdown: the `NutritionPanel` with all nutrients (not just key ones)
- Data source attribution: `Caption` at the bottom: "Data from Open Food Facts. Last updated: {date}."

**States:**
- **Loading:** Handled by the parent page (see section 7), not by ProductCard itself. ProductCard always receives a fully loaded `Product`.
- **Missing data:** Each section handles nulls independently:
  - Null image → placeholder
  - Null scores → ScoreBadge shows "N/A"
  - Null ingredients → "Ingredient list not available"
  - Empty allergens → allergen section not rendered
  - Null nutrients → NutritionPanel shows "Nutrition data not available"

**Accessibility:**
- Product image: `alt="{product.name} by {product.brand}"`
- Score badges section: `role="group"`, `aria-label="Health scores"`
- Allergen section: `role="alert"` (allergens are critical safety info), `aria-label="Allergen information"`
- Expandable additive details: `<details>` + `<summary>` is natively accessible
- Section headings use `Heading3` for Layer 2, `Heading4` for sub-sections

**Scope boundaries:**
- Does NOT fetch data (receives `Product` as prop)
- Does NOT show alternatives or suggestions
- Does NOT handle sharing or saving

---

### `src/components/organisms/NutritionPanel.tsx`

- **File path:** `src/components/organisms/NutritionPanel.tsx`
- **Client component:** Yes (`'use client'`) — needed for per-serve/per-100g toggle

```typescript
interface NutritionPanelProps {
  nutrients: Nutrient[];    // From src/types/product.ts
  servingSize: string | null;
  className?: string;
}
```

**Uses atoms:** `Card`, `Heading4`, `Caption`, `Button`
**Uses molecules:** `NutrientRow`

**Design tokens:**
- Container: `Card` flat variant
- Header row: `border-b border-border-strong`, `pb-2`
- Column headers: `Caption`, `text-text-muted`, uppercase
- Toggle: two `Button` ghost/primary variants for "Per serve" / "Per 100g"

**Rendering:**

- Header: `Heading4` "Nutrition", serving size in `Caption` if available (e.g., "Serving size: 30g")
- Toggle buttons: "Per serve" and "Per 100g" — controls which column is visually emphasized. Both columns always visible on desktop. On mobile (`< sm` breakpoint), only the selected column is shown.
- `<table>` with:
  - `<thead>`: column headers — "Nutrient", "Per serve", "Per 100g"
  - `<tbody>`: one `NutrientRow` per nutrient
  - Sub-rows (indented): "Saturated fat" under "Fat", "Sugars" under "Carbohydrates"
- If `nutrients` array is empty, display: `Body` with `text-text-subtle`: "Nutrition data not available."

**Accessibility:**
- `<table>` with `aria-label="Nutrition information"`
- Column headers in `<th scope="col">`
- Row headers in `<th scope="row">`
- Toggle buttons: `aria-pressed` on the active one

**Scope boundaries:**
- Does NOT calculate daily percentages (those come from the `Product` data)
- Does NOT show/hide itself (parent controls visibility)

---

### `src/components/organisms/SearchResults.tsx`

- **File path:** `src/components/organisms/SearchResults.tsx`
- **Client component:** Yes (`'use client'`) — handles infinite scroll / load more

```typescript
interface SearchResultsProps {
  query: string;
  className?: string;
}
```

**Uses atoms:** `Body`, `BodySmall`, `Button`, `Caption`
**Uses molecules:** `SearchResultRow`

**Design tokens:**
- List container: `divide-y divide-border` for row separators
- Loading skeleton: `bg-surface-raised animate-pulse rounded-md`
- Empty state icon: `text-text-subtle`
- Error card: `Card` flat with `border-error`

**Rendering:**

This component owns the data fetching for search results.

- Calls `GET /api/search?q=${query}&page=${page}` using `fetch` inside a `useEffect` triggered by `query` changes
- **State machine:**

  1. **`idle`:** Query is empty. Show recent searches if available in session state (stored in `useState`, not persisted). Each recent search is a clickable `BodySmall` item. If no recent searches, show: `Body` "Search for a product by name or brand."

  2. **`loading`:** Show 5 skeleton rows. Each skeleton: horizontal flex with a `w-12 h-12` rounded square (image placeholder), two horizontal bars (name + brand), all pulsing.

  3. **`success` with results:** Render `SearchResultRow` for each product. If `hasMore` is true, show a "Load more" `Button` (secondary variant) at the bottom. Pressing it fetches the next page and appends results.

  4. **`success` with no results:** Centered empty state. SVG icon (magnifying glass with X). `Heading3`: "No products found". `Body`: "Try a different search term or scan the barcode." `Button` secondary: "Scan a Barcode" linking to `/scan`.

  5. **`error`:** `Card` flat with error styling. `Body`: user-friendly error message (from API response). `Button` primary: "Try Again" (re-triggers fetch).

- Stores the query that triggered each fetch to avoid stale result rendering (race condition guard).

**Accessibility:**
- Results list: `role="list"`, `aria-label="Search results"`
- Each result row: `role="listitem"`
- Loading: `aria-busy="true"` on the list container, `aria-label="Loading results"`
- Empty state: `role="status"`
- Error: `role="alert"`
- "Load more" button: `aria-label="Load more results"`
- Result count announced: `aria-live="polite"` region with `"${count} products found"` when results load

**Scope boundaries:**
- Does NOT contain the search input (that's in the parent page)
- Does NOT handle barcode scanning
- Does NOT render product details

---

## 7. Pages

### `src/app/page.tsx` — Home

- **Server component:** Yes (no interactivity needed on the home page itself)

**Rendering:**
- Full-height centered layout (`min-h-screen flex flex-col items-center justify-center`)
- App title: `Display` — "FoodLens"
- Tagline: `Body` with `text-text-muted` — "See what's really in your food."
- Two entry points, equally prominent, stacked on mobile, side-by-side on desktop (`flex flex-col sm:flex-row gap-4`):
  1. `<Link href="/scan">` wrapping a `Button` primary, size `lg`, with camera icon: "Scan a Barcode"
  2. `<Link href="/search">` wrapping a `Button` secondary, size `lg`, with search icon: "Search by Name"
- Data source attribution at bottom: `Caption` with `text-text-subtle`: "Powered by Open Food Facts"

**Uses atoms:** `Button`, `Display`, `Body`, `Caption`

**Design tokens:**
- Background: `bg-background` (from body default)
- Spacing: `gap-4` between buttons, `gap-6` between sections

**Accessibility:**
- Landmark: `<main>` wrapping content
- Skip link not needed (only two interactive elements)

**Scope boundaries:**
- No data fetching
- No state
- Pure navigation hub

---

### `src/app/scan/page.tsx` — Scanner

- **Client component:** Yes (`'use client'`)

**Rendering:**
- Renders the `Scanner` organism full-screen
- `onScan` callback: navigates to `/product/${barcode}` using `useRouter().push()`
- `onClose` callback: navigates back using `useRouter().back()`

**Uses organisms:** `Scanner`

**Layout:** Full viewport, no header/footer. The Scanner fills everything.

**Accessibility:**
- `<main>` wrapping
- Page title via `<title>` in metadata: "Scan — FoodLens"

**Scope boundaries:**
- Purely a wrapper around Scanner with navigation logic

---

### `src/app/search/page.tsx` — Search

- **Client component:** Yes (`'use client'`)

```typescript
// Internal state:
// - searchInput: string (raw input value)
// - debouncedQuery: string (from useDebounce hook, 300ms delay)
```

**Rendering:**
- Top bar: back button (`Button` ghost, arrow-left icon) + `Heading3` "Search"
- `SearchBar` molecule below the header, `autoFocus={true}` on desktop
- `SearchResults` organism below the search bar, receives `debouncedQuery` as `query` prop
- When `debouncedQuery` is empty, `SearchResults` shows idle state

**Uses atoms:** `Button`, `Heading3`
**Uses molecules:** `SearchBar`
**Uses organisms:** `SearchResults`
**Uses hooks:** `useDebounce`

**Design tokens:**
- Layout: `max-w-2xl mx-auto px-4` for comfortable reading width
- Top bar: `py-3` (`spacing.3`), `border-b border-border`

**Accessibility:**
- Page title: "Search — FoodLens"
- `<main>` landmark
- Back button: `aria-label="Go back"`
- Search bar auto-focused on mount (desktop only; on mobile, auto-focus triggers keyboard which is desired for a search page)

**State preservation (edge case from story):**
- When user navigates to a product and comes back, the search query and results should be preserved. Use `useSearchParams` to store `q` in the URL: `/search?q=vegemite`. This way, browser back navigation restores the query.

**Scope boundaries:**
- Does NOT render product details
- Does NOT handle barcode scanning

---

### `src/app/product/[barcode]/page.tsx` — Product Detail

- **Server component with async data fetching** (Next.js server component calling the API client directly, not through the API route — server-to-server does not need the proxy)

```typescript
interface ProductPageProps {
  params: Promise<{ barcode: string }>;
}
```

**Rendering:**

Uses `getProduct(barcode)` directly from `src/lib/api/openfoodfacts.ts` (server-side, no round-trip through own API route).

1. **Loading state:** Use Next.js `loading.tsx` file (`src/app/product/[barcode]/loading.tsx`) for Suspense-based loading. The loading file renders a skeleton:
   - Image placeholder: `w-full h-48 bg-surface-raised animate-pulse rounded-lg`
   - Title placeholder: `w-3/4 h-6 bg-surface-raised animate-pulse rounded`
   - Brand placeholder: `w-1/2 h-4 bg-surface-raised animate-pulse rounded`
   - Three score badge placeholders: `w-24 h-20 bg-surface-raised animate-pulse rounded-lg`
   - Several nutrient row placeholders

2. **Product found:** Render `ProductCard` organism with the `Product` data.

3. **Product not found:** Centered empty state.
   - `Heading3`: "Product Not Found"
   - `Body`: "We don't have this product yet. Try searching by name or scanning a different barcode."
   - `Button` secondary: "Search by Name" → `/search`
   - `Button` ghost: "Scan Another" → `/scan`

4. **Error:** Centered error state.
   - `Heading3`: "Something Went Wrong"
   - `Body`: user-friendly error message
   - `Button` primary: "Try Again" (reloads the page)
   - `Button` ghost: "Go Home" → `/`

**Layout:**
- Top bar: back button + `Heading3` "Product"
- Content: `max-w-2xl mx-auto px-4 pb-8`
- Back button navigates to previous page via `<Link>` with client-side back (needs a small client component wrapper for `useRouter().back()`)

**Uses atoms:** `Button`, `Heading3`, `Body`
**Uses organisms:** `ProductCard`

**Design tokens:**
- Top bar: `py-3`, `border-b border-border`
- Content padding: `pt-6` below top bar

**Accessibility:**
- Page title: `"{product.name} — FoodLens"` (dynamic metadata via `generateMetadata`)
- `<main>` landmark
- Back button: `aria-label="Go back"`

**Scope boundaries:**
- Does NOT handle scanning
- Does NOT handle search
- Receives barcode from URL, fetches data, renders ProductCard

---

### `src/app/product/[barcode]/loading.tsx` — Loading skeleton

- **Server component**
- Renders skeleton placeholder matching the ProductCard layout
- Uses `animate-pulse` on `bg-surface-raised` blocks
- No interactivity, no data

---

## 8. Dependencies

### Required

| Package | Purpose | Why this one |
|---------|---------|-------------|
| `@aspect-dev/zxing-js` | Barcode scanning | Pure JS ZXing port. Works in browser. No native dependencies. Supports EAN-13/EAN-8. Actively maintained fork of `@aspect-dev/zxing-js`. |

**Note on ZXing wrapper selection:**

After research, the options are:
1. **`@aspect-dev/zxing-js`** — Well-maintained fork of `@aspect-dev/zxing-js/library`. Provides `BrowserMultiFormatReader`. Used directly with a `<video>` element. No React wrapper needed. This is the recommended choice.
2. **`html5-qrcode`** — Heavier, includes QR code support we don't need, but has a simpler API. Fallback if ZXing has issues.
3. **`react-zxing`** — React wrapper around ZXing. Adds a React dependency layer. Our `useBarcodeScanner` hook achieves the same thing with more control. Skip.

**Decision:** Use `@aspect-dev/zxing-js`. If unavailable or deprecated at implementation time, fall back to `html5-qrcode` using its barcode-only mode. The `useBarcodeScanner` hook abstracts this choice, so swapping libraries only affects the hook internals.

### Already in the project

- `next` (App Router, `<Image>`, `<Link>`, routing)
- `tailwindcss` v4
- No additional UI libraries, icon libraries, or state management needed

### Not adding

- No icon library. All icons (search, X, camera, arrow-left, flashlight, placeholder food) are inline SVGs in the components. Keeps bundle small. If icon count exceeds 10 in the future, reconsider `lucide-react`.
- No animation library. CSS `@keyframes` and `transition` only.
- No state management library. React `useState` + URL search params + server components.

---

## File Manifest

Every new file this spec introduces:

| File | Type | Client? |
|------|------|---------|
| `src/types/product.ts` | Types | N/A |
| `src/lib/api/openfoodfacts.ts` | API client | No |
| `src/hooks/useDebounce.ts` | Hook | Yes |
| `src/hooks/useBarcodeScanner.ts` | Hook | Yes |
| `src/components/molecules/SearchBar.tsx` | Molecule | Yes |
| `src/components/molecules/ScoreBadge.tsx` | Molecule | No |
| `src/components/molecules/NutrientRow.tsx` | Molecule | No |
| `src/components/molecules/AllergenBadge.tsx` | Molecule | No |
| `src/components/molecules/SearchResultRow.tsx` | Molecule | Yes |
| `src/components/organisms/Scanner.tsx` | Organism | Yes |
| `src/components/organisms/ProductCard.tsx` | Organism | Yes |
| `src/components/organisms/NutritionPanel.tsx` | Organism | Yes |
| `src/components/organisms/SearchResults.tsx` | Organism | Yes |
| `src/app/page.tsx` | Page (rewrite) | No |
| `src/app/scan/page.tsx` | Page | Yes |
| `src/app/search/page.tsx` | Page | Yes |
| `src/app/product/[barcode]/page.tsx` | Page | No |
| `src/app/product/[barcode]/loading.tsx` | Loading UI | No |
| `src/app/api/product/[barcode]/route.ts` | API route | No |
| `src/app/api/search/route.ts` | API route | No |

**Total: 20 files** (1 types, 1 API client, 2 hooks, 5 molecules, 4 organisms, 5 pages/loading, 2 API routes)

---

## Implementation Order

Recommended build sequence to minimize blocked work:

1. **Types** — `src/types/product.ts` (everything else depends on this)
2. **API client** — `src/lib/api/openfoodfacts.ts` (test with curl/Postman equivalent)
3. **API routes** — both routes (thin, can test immediately)
4. **Hooks** — `useDebounce` (trivial), then `useBarcodeScanner` (complex, test with device)
5. **Atoms** — no new atoms needed; existing set covers all needs
6. **Molecules** — `ScoreBadge` → `AllergenBadge` → `NutrientRow` → `SearchResultRow` → `SearchBar` (each can be built and previewed independently)
7. **Organisms** — `NutritionPanel` → `ProductCard` → `SearchResults` → `Scanner` (Scanner last because it requires device testing)
8. **Pages** — `page.tsx` (home) → `product/[barcode]/page.tsx` → `search/page.tsx` → `scan/page.tsx`
