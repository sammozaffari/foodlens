/**
 * Open Food Facts API Client
 *
 * Encapsulates all HTTP calls to Open Food Facts.
 * Components and pages never call OFF directly — they use these functions
 * or the API routes that wrap them.
 */

import {
  type AllergenId,
  ALLERGENS,
  type Allergen,
  type IngredientScoreDisplay,
  type NovaGroup,
  type NovaGroupDisplay,
  type Nutrient,
  type NutriScoreDisplay,
  type NutriScoreGrade,
  type Product,
  type ProductApiResponse,
  type SearchApiResponse,
  type SearchResultProduct,
  getNutriScoreColor,
  getNutriScoreBgColor,
  getNutriScoreLabel,
  getNovaColor,
  getNovaBgColor,
  getNovaLabel,
  getIngredientScoreColor,
  getIngredientScoreBgColor,
  getIngredientScoreLabel,
  getIngredientConcernLevel,
} from '@/types/product';

// ---------- Internal types (not exported) ----------

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
  categories_tags?: string[];
}

interface OFFProductResponse {
  status: number;
  product?: OFFProductRaw;
}

interface OFFSearchResponse {
  count?: number;
  page?: number;
  page_size?: number;
  products?: OFFProductRaw[];
}

// ---------- Constants ----------

const USER_AGENT = 'FoodLens/1.0 (https://foodlens.app)';
const PRODUCT_TIMEOUT = 8000;
const SEARCH_TIMEOUT = 10000;
const PRODUCT_FIELDS = [
  'product_name',
  'brands',
  'image_url',
  'image_small_url',
  'ingredients_text',
  'allergens_tags',
  'traces_tags',
  'additives_tags',
  'additives_n',
  'nova_group',
  'nutriscore_grade',
  'nutriscore_score',
  'nutriments',
  'serving_size',
  'categories_tags',
].join(',');

const VALID_ALLERGEN_IDS = new Set<string>(ALLERGENS.map((a) => a.id));

/** Maps OFF tag variations to our canonical AllergenId */
const ALLERGEN_TAG_MAP: Record<string, AllergenId> = {
  gluten: 'gluten',
  crustaceans: 'crustaceans',
  eggs: 'eggs',
  fish: 'fish',
  peanuts: 'peanuts',
  soy: 'soy',
  soybeans: 'soy',
  milk: 'milk',
  'tree-nuts': 'tree-nuts',
  nuts: 'tree-nuts',
  celery: 'celery',
  mustard: 'mustard',
  sesame: 'sesame',
  'sesame-seeds': 'sesame',
  sulfites: 'sulfites',
  sulphites: 'sulfites',
  'sulphur-dioxide': 'sulfites',
  lupine: 'lupine',
  lupin: 'lupine',
  mollusks: 'mollusks',
  molluscs: 'mollusks',
};

const ALLERGEN_LABELS: Record<AllergenId, string> = {
  gluten: 'Gluten',
  crustaceans: 'Crustaceans',
  eggs: 'Eggs',
  fish: 'Fish',
  peanuts: 'Peanuts',
  soy: 'Soy',
  milk: 'Milk',
  'tree-nuts': 'Tree Nuts',
  celery: 'Celery',
  mustard: 'Mustard',
  sesame: 'Sesame',
  sulfites: 'Sulfites',
  lupine: 'Lupine',
  mollusks: 'Mollusks',
};

// ---------- Exported functions ----------

export async function getProduct(barcode: string): Promise<ProductApiResponse> {
  // Try original barcode, then zero-padded to 13 digits
  const barcodes = [barcode];
  if (barcode.length < 13) {
    barcodes.push(barcode.padStart(13, '0'));
  }

  for (const bc of barcodes) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PRODUCT_TIMEOUT);

    try {
      const url = `https://au.openfoodfacts.org/api/v2/product/${bc}.json?fields=${PRODUCT_FIELDS}`;
      const response = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT },
        signal: controller.signal,
      });

      if (!response.ok) {
        clearTimeout(timeout);
        continue;
      }

      const data: OFFProductResponse = await response.json();
      clearTimeout(timeout);

      if (data.status === 0 || !data.product) {
        continue;
      }

      // Check we got meaningful data (not just an empty shell)
      const raw = data.product;
      if (!raw.product_name && !raw.ingredients_text && !raw.nutriscore_grade) {
        continue;
      }

      const product = mapProduct(raw, barcode);
      return { status: 'found', product };
    } catch (error) {
      clearTimeout(timeout);
      if (error instanceof Error && error.name === 'AbortError') {
        continue;
      }
      continue;
    }
  }

  return { status: 'not_found', product: null };
}

export async function searchProducts(
  query: string,
  page: number = 1
): Promise<SearchApiResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SEARCH_TIMEOUT);

  try {
    const params = new URLSearchParams({
      search_terms: query,
      search_simple: '1',
      action: 'process',
      json: '1',
      page_size: '24',
      page: String(page),
    });

    const url = `https://au.openfoodfacts.org/cgi/search.pl?${params.toString()}`;

    // Retry up to 2 times on failure
    let response: Response | null = null;
    let lastError = '';
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        response = await fetch(url, {
          headers: { 'User-Agent': USER_AGENT },
          signal: controller.signal,
          cache: 'no-store',
        });
        if (response.ok) break;
        lastError = `HTTP ${response.status}`;
        // Wait briefly before retry
        if (attempt < 2) await new Promise(r => setTimeout(r, 500));
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') throw e;
        lastError = e instanceof Error ? e.message : 'Network error';
        if (attempt < 2) await new Promise(r => setTimeout(r, 500));
      }
    }

    if (!response || !response.ok) {
      return { status: 'error', data: null, error: lastError || 'Search failed after retries' };
    }

    const data: OFFSearchResponse = await response.json();
    const allProducts: SearchResultProduct[] = (data.products || []).map(mapSearchResult);

    // Deduplicate by normalized name + brand (strip sizes like "150g", "380g", "1kg")
    const normalizeName = (name: string) =>
      name.toLowerCase().trim()
        .replace(/\d+\s*(g|kg|ml|l|oz|lb|pack|pk|x)\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
    const seen = new Set<string>();
    const products = allProducts.filter((p) => {
      const key = `${normalizeName(p.name || '')}|${(p.brand || '').toLowerCase().trim()}`;
      if (key === '|' || key.startsWith('|') || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const totalResults = data.count || 0;
    const pageSize = data.page_size || 20;
    const currentPage = data.page || page;
    const hasMore = currentPage * pageSize < totalResults;

    return {
      status: 'ok',
      data: {
        products,
        totalResults,
        page: currentPage,
        pageSize,
        hasMore,
      },
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { status: 'error', data: null, error: 'Request timed out. Please try again.' };
    }
    return {
      status: 'error',
      data: null,
      error: 'Unable to reach food database. Check your connection.',
    };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Lightweight barcode lookup — returns only the fields needed for search result display.
 * Used to enrich Woolworths search results with OFF nutrition scores and images.
 */
export async function getProductScores(barcode: string): Promise<{
  nutriScoreGrade: NutriScoreGrade | null;
  novaGroup: NovaGroup | null;
  imageSmallUrl: string | null;
} | null> {
  // Try original barcode, then zero-padded to 13 digits (OFF sometimes stores them differently)
  const barcodes = [barcode];
  if (barcode.length < 13) {
    barcodes.push(barcode.padStart(13, '0'));
  }

  for (const bc of barcodes) {
    try {
      const fields = 'nutriscore_grade,nova_group,image_small_url';
      const url = `https://au.openfoodfacts.org/api/v2/product/${bc}.json?fields=${fields}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) continue;

      const data: OFFProductResponse = await response.json();
      if (data.status === 0 || !data.product) continue;

      const raw = data.product;
      const result = {
        nutriScoreGrade: isValidNutriScoreGrade(raw.nutriscore_grade)
          ? (raw.nutriscore_grade as NutriScoreGrade)
          : null,
        novaGroup: isValidNovaGroup(raw.nova_group)
          ? (raw.nova_group as NovaGroup)
          : null,
        imageSmallUrl: raw.image_small_url || null,
      };

      // Only return if we got at least some useful data
      if (result.nutriScoreGrade || result.novaGroup || result.imageSmallUrl) {
        return result;
      }
    } catch {
      continue;
    }
  }

  return null;
}

// ---------- Internal mappers ----------

function mapProduct(raw: OFFProductRaw, barcode: string): Product {
  const novaGroupRaw = isValidNovaGroup(raw.nova_group) ? (raw.nova_group as NovaGroup) : null;
  const additivesCount = raw.additives_n || 0;

  return {
    barcode,
    name: raw.product_name || 'Unknown product',
    brand: raw.brands || 'Unknown brand',
    imageUrl: raw.image_url || null,
    imageSmallUrl: raw.image_small_url || null,

    nutriScore: mapNutriScore(raw.nutriscore_grade, raw.nutriscore_score),
    healthStarRating: null, // Not reliably provided by OFF for MVP
    novaGroup: novaGroupRaw ? mapNovaGroup(novaGroupRaw) : null,
    ingredientScore: mapIngredientScore(additivesCount, novaGroupRaw),

    ingredientsText: raw.ingredients_text || null,
    additivesTags: raw.additives_tags || [],
    additivesCount,

    allergens: mapAllergens(raw.allergens_tags || [], 'declared'),
    traces: mapAllergens(raw.traces_tags || [], 'trace'),

    servingSize: raw.serving_size || null,
    nutrients: mapNutrients(raw.nutriments || {}),

    woolworthsPrice: null,
    woolworthsUrl: null,
    productSize: null,

    dataSource: 'openfoodfacts',
    lastUpdated: null,
  };
}

function mapSearchResult(raw: OFFProductRaw & { code?: string }): SearchResultProduct {
  const grade = isValidNutriScoreGrade(raw.nutriscore_grade)
    ? (raw.nutriscore_grade as NutriScoreGrade)
    : null;
  const nova = isValidNovaGroup(raw.nova_group) ? (raw.nova_group as NovaGroup) : null;

  return {
    barcode: raw.code || '',
    name: raw.product_name || 'Unknown product',
    brand: raw.brands || 'Unknown brand',
    imageSmallUrl: raw.image_small_url || null,
    nutriScoreGrade: grade,
    novaGroup: nova,
    price: null,
    size: null,
    woolworthsUrl: null,
  };
}

function mapNutriScore(
  grade: string | undefined,
  score: number | undefined
): NutriScoreDisplay | null {
  if (!grade || !isValidNutriScoreGrade(grade)) return null;
  const g = grade as NutriScoreGrade;
  return {
    grade: g,
    score: typeof score === 'number' ? score : null,
    label: getNutriScoreLabel(g),
    color: getNutriScoreColor(g),
    bgColor: getNutriScoreBgColor(g),
  };
}

function mapNovaGroup(group: NovaGroup): NovaGroupDisplay {
  return {
    group,
    label: getNovaLabel(group),
    color: getNovaColor(group),
    bgColor: getNovaBgColor(group),
  };
}

function mapIngredientScore(
  additiveCount: number,
  novaGroup: NovaGroup | null
): IngredientScoreDisplay {
  return {
    level: getIngredientConcernLevel(additiveCount, novaGroup),
    additiveCount,
    novaGroup,
    label: getIngredientScoreLabel(additiveCount, novaGroup),
    color: getIngredientScoreColor(additiveCount, novaGroup),
    bgColor: getIngredientScoreBgColor(additiveCount, novaGroup),
  };
}

function mapAllergens(tags: string[], type: 'declared' | 'trace'): Allergen[] {
  const result: Allergen[] = [];

  for (const tag of tags) {
    // Strip language prefix (e.g., "en:gluten" → "gluten")
    const normalized = tag.replace(/^[a-z]{2}:/, '');
    const allergenId = ALLERGEN_TAG_MAP[normalized];

    if (allergenId && VALID_ALLERGEN_IDS.has(allergenId)) {
      // Avoid duplicates
      if (!result.some((a) => a.id === allergenId)) {
        result.push({
          id: allergenId,
          name: ALLERGEN_LABELS[allergenId],
          type,
        });
      }
    }
  }

  return result;
}

function mapNutrients(nutriments: Record<string, number>): Nutrient[] {
  const nutrientDefs: { name: string; key: string; unit: string }[] = [
    { name: 'Energy', key: 'energy', unit: 'kJ' },
    { name: 'Fat', key: 'fat', unit: 'g' },
    { name: 'Saturated fat', key: 'saturated-fat', unit: 'g' },
    { name: 'Carbohydrates', key: 'carbohydrates', unit: 'g' },
    { name: 'Sugars', key: 'sugars', unit: 'g' },
    { name: 'Fibre', key: 'fiber', unit: 'g' },
    { name: 'Protein', key: 'proteins', unit: 'g' },
    { name: 'Salt', key: 'salt', unit: 'g' },
    { name: 'Sodium', key: 'sodium', unit: 'mg' },
  ];

  return nutrientDefs.map(({ name, key, unit }) => {
    const per100gKey = `${key}_100g`;
    const perServingKey = `${key}_serving`;
    const per100g = typeof nutriments[per100gKey] === 'number' ? nutriments[per100gKey] : null;
    const perServing =
      typeof nutriments[perServingKey] === 'number' ? nutriments[perServingKey] : null;

    return {
      name,
      per100g,
      perServing,
      unit,
      dailyPercent: null, // OFF doesn't reliably provide daily percentage
    };
  });
}

// ---------- Validation helpers ----------

function isValidNutriScoreGrade(grade: unknown): boolean {
  return typeof grade === 'string' && ['a', 'b', 'c', 'd', 'e'].includes(grade);
}

function isValidNovaGroup(group: unknown): boolean {
  return typeof group === 'number' && [1, 2, 3, 4].includes(group);
}
