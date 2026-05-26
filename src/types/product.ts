/**
 * FoodLens Product Types
 *
 * Normalized product types for the FoodLens application.
 * All data originates from Open Food Facts and is mapped through
 * src/lib/api/openfoodfacts.ts before reaching components.
 */

// ---------- Nutri-Score ----------

export type NutriScoreGrade = 'a' | 'b' | 'c' | 'd' | 'e';

export interface NutriScoreDisplay {
  grade: NutriScoreGrade;
  /** Numeric score from Open Food Facts (-15 to 40) */
  score: number | null;
  label: string;
  color: string;
  bgColor: string;
}

// ---------- NOVA Group ----------

export type NovaGroup = 1 | 2 | 3 | 4;

export interface NovaGroupDisplay {
  group: NovaGroup;
  label: string;
  color: string;
  bgColor: string;
}

// ---------- Health Star Rating ----------

/** HSR is 0.5 to 5.0 in 0.5 increments. */
export type HealthStarRating = number;

export interface HealthStarDisplay {
  stars: HealthStarRating;
  color: string;
  bgColor: string;
}

// ---------- Ingredients Score ----------

export type IngredientConcernLevel = 'low' | 'moderate' | 'high';

export interface IngredientScoreDisplay {
  level: IngredientConcernLevel;
  additiveCount: number;
  novaGroup: NovaGroup | null;
  label: string;
  color: string;
  bgColor: string;
}

// ---------- Allergens ----------

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
  /** Human-readable name, title case */
  name: string;
  /** "declared" = listed in allergens_tags. "trace" = listed in traces_tags. */
  type: 'declared' | 'trace';
}

/** PEAL 2026 mandatory 14 allergens with labels and alternate names */
export const ALLERGENS: readonly {
  id: AllergenId;
  label: string;
  alternateNames: string[];
}[] = [
  { id: 'gluten', label: 'Gluten', alternateNames: ['wheat', 'barley', 'rye', 'oats'] },
  { id: 'crustaceans', label: 'Crustaceans', alternateNames: ['prawns', 'crab', 'lobster', 'shrimp'] },
  { id: 'eggs', label: 'Eggs', alternateNames: ['egg'] },
  { id: 'fish', label: 'Fish', alternateNames: [] },
  { id: 'peanuts', label: 'Peanuts', alternateNames: ['peanut', 'groundnuts'] },
  { id: 'soy', label: 'Soy', alternateNames: ['soya', 'soybeans'] },
  { id: 'milk', label: 'Milk', alternateNames: ['dairy', 'lactose', 'casein', 'whey'] },
  { id: 'tree-nuts', label: 'Tree Nuts', alternateNames: ['nuts', 'almonds', 'cashews', 'walnuts', 'hazelnuts', 'pecans', 'pistachios', 'macadamia'] },
  { id: 'celery', label: 'Celery', alternateNames: ['celeriac'] },
  { id: 'mustard', label: 'Mustard', alternateNames: [] },
  { id: 'sesame', label: 'Sesame', alternateNames: ['sesame-seeds'] },
  { id: 'sulfites', label: 'Sulfites', alternateNames: ['sulphites', 'sulphur-dioxide', 'sulfur-dioxide'] },
  { id: 'lupine', label: 'Lupine', alternateNames: ['lupin'] },
  { id: 'mollusks', label: 'Mollusks', alternateNames: ['molluscs', 'squid', 'octopus', 'mussels', 'oysters', 'clams', 'snails'] },
] as const;

// ---------- Nutrients ----------

export interface Nutrient {
  name: string;
  per100g: number | null;
  perServing: number | null;
  unit: string;
  dailyPercent: number | null;
}

// ---------- Product ----------

export interface Product {
  barcode: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  imageSmallUrl: string | null;

  nutriScore: NutriScoreDisplay | null;
  healthStarRating: HealthStarDisplay | null;
  novaGroup: NovaGroupDisplay | null;
  ingredientScore: IngredientScoreDisplay | null;

  ingredientsText: string | null;
  additivesTags: string[];
  additivesCount: number;

  allergens: Allergen[];
  traces: Allergen[];

  servingSize: string | null;
  nutrients: Nutrient[];

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

// ---------- Helper Functions ----------

export function getNutriScoreColor(grade: NutriScoreGrade): string {
  switch (grade) {
    case 'a':
    case 'b':
      return 'text-success';
    case 'c':
      return 'text-warning';
    case 'd':
    case 'e':
      return 'text-error';
  }
}

export function getNutriScoreBgColor(grade: NutriScoreGrade): string {
  switch (grade) {
    case 'a':
    case 'b':
      return 'bg-success-muted';
    case 'c':
      return 'bg-warning-muted';
    case 'd':
    case 'e':
      return 'bg-error-muted';
  }
}

export function getNutriScoreLabel(grade: NutriScoreGrade): string {
  switch (grade) {
    case 'a':
      return 'Excellent';
    case 'b':
      return 'Good';
    case 'c':
      return 'Moderate';
    case 'd':
      return 'Poor';
    case 'e':
      return 'Bad';
  }
}

export function getNovaColor(group: NovaGroup): string {
  switch (group) {
    case 1:
    case 2:
      return 'text-success';
    case 3:
      return 'text-warning';
    case 4:
      return 'text-error';
  }
}

export function getNovaBgColor(group: NovaGroup): string {
  switch (group) {
    case 1:
    case 2:
      return 'bg-success-muted';
    case 3:
      return 'bg-warning-muted';
    case 4:
      return 'bg-error-muted';
  }
}

export function getNovaLabel(group: NovaGroup): string {
  switch (group) {
    case 1:
      return 'Minimally processed';
    case 2:
      return 'Processed ingredients';
    case 3:
      return 'Processed';
    case 4:
      return 'Ultra-processed';
  }
}

export function getIngredientScoreColor(additiveCount: number, novaGroup: NovaGroup | null): string {
  if (additiveCount >= 5 || novaGroup === 4) return 'text-error';
  if (additiveCount >= 2 || novaGroup === 3) return 'text-warning';
  return 'text-success';
}

export function getIngredientScoreBgColor(additiveCount: number, novaGroup: NovaGroup | null): string {
  if (additiveCount >= 5 || novaGroup === 4) return 'bg-error-muted';
  if (additiveCount >= 2 || novaGroup === 3) return 'bg-warning-muted';
  return 'bg-success-muted';
}

export function getIngredientScoreLabel(additiveCount: number, novaGroup: NovaGroup | null): string {
  if (additiveCount >= 5 || novaGroup === 4) return 'Many concerns';
  if (additiveCount >= 2 || novaGroup === 3) return 'Some concerns';
  return 'Few concerns';
}

export function getIngredientConcernLevel(additiveCount: number, novaGroup: NovaGroup | null): IngredientConcernLevel {
  if (additiveCount >= 5 || novaGroup === 4) return 'high';
  if (additiveCount >= 2 || novaGroup === 3) return 'moderate';
  return 'low';
}
