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

// ---------- Score Explanations ----------

export function getNutriScoreExplanation(grade: NutriScoreGrade): string {
  switch (grade) {
    case 'a': return 'Very good nutritional quality. Low in saturated fat, sugar, and salt. High in fibre, protein, and fruit/vegetable content.';
    case 'b': return 'Good nutritional quality. A balanced product with mostly positive nutritional characteristics.';
    case 'c': return 'Average nutritional quality. Moderate levels of fats, sugars, or salt.';
    case 'd': return 'Poor nutritional quality. High in saturated fat, sugar, or salt. Limited beneficial nutrients.';
    case 'e': return 'Very poor nutritional quality. Very high in saturated fat, sugar, and/or salt.';
  }
}

export function getNovaExplanation(group: NovaGroup): string {
  switch (group) {
    case 1: return 'Unprocessed or minimally processed. Fresh, dried, or frozen foods with no added substances.';
    case 2: return 'Processed culinary ingredients. Substances extracted from foods for cooking — oils, butter, sugar, salt.';
    case 3: return 'Processed food. Made by adding salt, oil, or sugar to whole foods — canned vegetables, cheese, bread.';
    case 4: return 'Ultra-processed. Industrial formulations with additives not used in home cooking. Population studies link high intake to increased risk of obesity, heart disease, and type 2 diabetes.';
  }
}

export function getIngredientExplanation(additiveCount: number): string {
  if (additiveCount === 0) return 'No additives detected. Simple, recognisable ingredients.';
  if (additiveCount === 1) return 'Contains 1 food additive. See details below.';
  return `Contains ${additiveCount} food additives. See details below for each.`;
}

// ---------- Additive Database ----------

export interface AdditiveInfo {
  code: string;
  name: string;
  description: string;
  concern: 'low' | 'moderate' | 'high';
  source: string;
}

const ADDITIVE_DB: Record<string, AdditiveInfo> = {
  'e100': { code: 'E100', name: 'Curcumin', description: 'Natural yellow colour from turmeric. Generally considered safe.', concern: 'low', source: 'FSANZ' },
  'e102': { code: 'E102', name: 'Tartrazine', description: 'Synthetic yellow dye. One of the "Southampton Six" linked to hyperactivity in children. Requires warning label in EU.', concern: 'high', source: 'EFSA / Southampton Study' },
  'e110': { code: 'E110', name: 'Sunset Yellow', description: 'Synthetic orange-yellow dye. Southampton Six — linked to hyperactivity in children.', concern: 'high', source: 'EFSA / Southampton Study' },
  'e120': { code: 'E120', name: 'Cochineal / Carmine', description: 'Natural red colour from insects. Safe but not suitable for vegetarians/vegans.', concern: 'moderate', source: 'FSANZ' },
  'e122': { code: 'E122', name: 'Carmoisine', description: 'Synthetic red dye. Southampton Six — linked to hyperactivity in children.', concern: 'high', source: 'EFSA / Southampton Study' },
  'e124': { code: 'E124', name: 'Ponceau 4R', description: 'Synthetic red dye. Southampton Six — linked to hyperactivity in children.', concern: 'high', source: 'EFSA / Southampton Study' },
  'e129': { code: 'E129', name: 'Allura Red', description: 'Synthetic red dye. Southampton Six — linked to hyperactivity in children. Banned in some European countries.', concern: 'high', source: 'EFSA / Southampton Study' },
  'e150a': { code: 'E150a', name: 'Plain Caramel', description: 'Simple caramel colour made by heating sugar. Generally safe.', concern: 'low', source: 'FSANZ' },
  'e150c': { code: 'E150c', name: 'Ammonia Caramel', description: 'Caramel colour produced with ammonia. Contains 4-MEI, classified as "possibly carcinogenic" by IARC. Common in soy sauce and dark beverages.', concern: 'moderate', source: 'IARC Group 2B' },
  'e150d': { code: 'E150d', name: 'Sulfite Ammonia Caramel', description: 'Most common caramel colour. Contains 4-MEI (possibly carcinogenic per IARC). Used in colas, sauces, breads.', concern: 'moderate', source: 'IARC Group 2B' },
  'e160a': { code: 'E160a', name: 'Beta-Carotene', description: 'Natural orange colour, precursor to Vitamin A. Found in carrots. Safe.', concern: 'low', source: 'FSANZ' },
  'e160b': { code: 'E160b', name: 'Annatto', description: 'Natural orange-yellow colour from seeds. Generally safe.', concern: 'low', source: 'FSANZ' },
  'e200': { code: 'E200', name: 'Sorbic Acid', description: 'Preservative against mould and yeast. Naturally found in berries. Safe.', concern: 'low', source: 'EFSA' },
  'e202': { code: 'E202', name: 'Potassium Sorbate', description: 'Common preservative. Widely used and generally safe.', concern: 'low', source: 'EFSA' },
  'e210': { code: 'E210', name: 'Benzoic Acid', description: 'Preservative. Can form benzene (a carcinogen) when combined with Vitamin C in acidic drinks.', concern: 'moderate', source: 'EFSA' },
  'e211': { code: 'E211', name: 'Sodium Benzoate', description: 'Preservative. Southampton Six — linked to hyperactivity in children. Can form benzene with Vitamin C.', concern: 'high', source: 'EFSA / Southampton Study' },
  'e220': { code: 'E220', name: 'Sulfur Dioxide', description: 'Preservative. Can trigger asthma in sensitive individuals. Destroys vitamin B1.', concern: 'moderate', source: 'FSANZ' },
  'e250': { code: 'E250', name: 'Sodium Nitrite', description: 'Cured meat preservative. Can form nitrosamines (carcinogenic) during cooking. IARC classifies processed meat as Group 1 carcinogen.', concern: 'high', source: 'IARC Group 1 (processed meat)' },
  'e300': { code: 'E300', name: 'Ascorbic Acid (Vitamin C)', description: 'Antioxidant and vitamin. Naturally occurring. Safe.', concern: 'low', source: 'FSANZ' },
  'e306': { code: 'E306', name: 'Vitamin E (Tocopherols)', description: 'Natural antioxidant and vitamin. Safe at food levels.', concern: 'low', source: 'FSANZ' },
  'e320': { code: 'E320', name: 'BHA', description: 'Synthetic antioxidant. Classified as "possibly carcinogenic" by IARC.', concern: 'high', source: 'IARC Group 2B' },
  'e321': { code: 'E321', name: 'BHT', description: 'Synthetic antioxidant. Some animal studies suggest tumour promotion. Restricted in several countries.', concern: 'moderate', source: 'EFSA' },
  'e322': { code: 'E322', name: 'Lecithins', description: 'Natural emulsifier from soy or sunflower. Generally safe. May contain soy allergen.', concern: 'low', source: 'FSANZ' },
  'e330': { code: 'E330', name: 'Citric Acid', description: 'Natural acid found in citrus fruits. Very common. Safe.', concern: 'low', source: 'FSANZ' },
  'e331': { code: 'E331', name: 'Sodium Citrate', description: 'Salt of citric acid. Acidity regulator. Safe.', concern: 'low', source: 'FSANZ' },
  'e407': { code: 'E407', name: 'Carrageenan', description: 'Thickener from seaweed. Controversial — some studies suggest gut inflammation, but EFSA considers it safe. Debate ongoing.', concern: 'moderate', source: 'EFSA (under review)' },
  'e412': { code: 'E412', name: 'Guar Gum', description: 'Natural thickener from guar beans. Safe.', concern: 'low', source: 'FSANZ' },
  'e415': { code: 'E415', name: 'Xanthan Gum', description: 'Thickener produced by fermentation. Safe. Common in gluten-free products.', concern: 'low', source: 'FSANZ' },
  'e420': { code: 'E420', name: 'Sorbitol', description: 'Sugar alcohol sweetener. Can cause digestive discomfort in large quantities. FODMAP trigger.', concern: 'moderate', source: 'FSANZ' },
  'e440': { code: 'E440', name: 'Pectin', description: 'Natural gelling agent from fruit. Safe. Also a dietary fibre.', concern: 'low', source: 'FSANZ' },
  'e450': { code: 'E450', name: 'Diphosphates', description: 'Raising agent in baking. Safe at typical levels.', concern: 'low', source: 'EFSA' },
  'e460': { code: 'E460', name: 'Cellulose', description: 'Plant fibre. Anti-caking agent. Safe and natural.', concern: 'low', source: 'FSANZ' },
  'e471': { code: 'E471', name: 'Mono- and Diglycerides', description: 'Emulsifiers made from fats. Generally safe. May be animal or plant derived.', concern: 'low', source: 'EFSA' },
  'e500': { code: 'E500', name: 'Sodium Carbonate', description: 'Baking soda. Natural mineral. Safe.', concern: 'low', source: 'FSANZ' },
  'e508': { code: 'E508', name: 'Potassium Chloride', description: 'Salt substitute. Naturally occurring mineral. Safe.', concern: 'low', source: 'FSANZ' },
  'e621': { code: 'E621', name: 'MSG', description: 'Flavour enhancer. Naturally occurs in tomatoes and parmesan. Systematic reviews find no evidence of harm at food levels.', concern: 'low', source: 'FSANZ / WHO JECFA' },
  'e950': { code: 'E950', name: 'Acesulfame K', description: 'Artificial sweetener. EFSA considers safe. Some studies suggest effects on gut bacteria.', concern: 'moderate', source: 'EFSA' },
  'e951': { code: 'E951', name: 'Aspartame', description: 'Artificial sweetener. IARC "possibly carcinogenic" (Group 2B, 2023), but WHO reaffirmed safe daily intake. Dose matters.', concern: 'moderate', source: 'IARC 2B / WHO JECFA' },
  'e955': { code: 'E955', name: 'Sucralose', description: 'Artificial sweetener. Some studies suggest effects on gut bacteria and insulin. Debate ongoing.', concern: 'moderate', source: 'EFSA' },
  'e960': { code: 'E960', name: 'Stevia', description: 'Natural sweetener from stevia plant. Generally safe. No calories.', concern: 'low', source: 'FSANZ / JECFA' },
};

export function getAdditiveInfo(tag: string): AdditiveInfo | null {
  const code = tag.replace('en:', '').toLowerCase();
  return ADDITIVE_DB[code] || null;
}

export function getAdditiveConcernColor(concern: 'low' | 'moderate' | 'high'): string {
  switch (concern) {
    case 'low': return 'text-success';
    case 'moderate': return 'text-warning';
    case 'high': return 'text-error';
  }
}

export function getAdditiveConcernBg(concern: 'low' | 'moderate' | 'high'): string {
  switch (concern) {
    case 'low': return 'bg-success-muted';
    case 'moderate': return 'bg-warning-muted';
    case 'high': return 'bg-error-muted';
  }
}
