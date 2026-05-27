/**
 * AI Product Hunter — natural language product search
 *
 * Parses user intent, searches Woolworths, enriches with OFF data,
 * filters by criteria, ranks by health quality.
 */

import { searchWoolworths } from './api/woolworths';
import { getProduct } from './api/openfoodfacts';
import type { Product, AllergenId, NutriScoreGrade, NovaGroup } from '@/types/product';

// ---------- Types ----------

export interface HuntCriteria {
  searchTerms: string[];
  maxPrice: number | null;
  nutriScoreMin: NutriScoreGrade | null;
  novaMax: NovaGroup | null;
  excludeAllergens: AllergenId[];
  excludeIngredients: string[];
  preferOrganic: boolean;
}

export interface HuntResult {
  product: Product;
  woolworthsPrice: number | null;
  woolworthsUrl: string | null;
  woolworthsSize: string | null;
  matchReasons: string[];
  matchScore: number;
}

export interface HuntResponse {
  criteria: HuntCriteria;
  results: HuntResult[];
  totalSearched: number;
  totalFiltered: number;
}

// ---------- Parser ----------

const PRICE_PATTERN = /(?:under|less than|cheaper than|below|max|maximum)\s*\$?\s*(\d+(?:\.\d{1,2})?)/i;
const PRICE_PATTERN_2 = /\$\s*(\d+(?:\.\d{1,2})?)\s*(?:or less|max|maximum)?/i;

const ALLERGEN_KEYWORDS: Record<string, AllergenId[]> = {
  'gluten free': ['gluten'],
  'no gluten': ['gluten'],
  'celiac safe': ['gluten'],
  'coeliac safe': ['gluten'],
  'celiac friendly': ['gluten'],
  'dairy free': ['milk'],
  'no dairy': ['milk'],
  'lactose free': ['milk'],
  'milk free': ['milk'],
  'nut free': ['tree-nuts', 'peanuts'],
  'no nuts': ['tree-nuts', 'peanuts'],
  'peanut free': ['peanuts'],
  'no peanuts': ['peanuts'],
  'egg free': ['eggs'],
  'no eggs': ['eggs'],
  'soy free': ['soy'],
  'no soy': ['soy'],
  'sesame free': ['sesame'],
  'no sesame': ['sesame'],
  'fish free': ['fish'],
  'no fish': ['fish'],
  'shellfish free': ['crustaceans', 'mollusks'],
  'no shellfish': ['crustaceans', 'mollusks'],
};

const INGREDIENT_KEYWORDS: Record<string, string[]> = {
  'no sugar': ['sugar', 'added sugar'],
  'sugar free': ['sugar', 'added sugar'],
  'without sugar': ['sugar'],
  'no added sugar': ['added sugar'],
  'no artificial': ['artificial'],
  'no additives': ['artificial', 'additive'],
  'no preservatives': ['preservative'],
  'no palm oil': ['palm oil'],
  'no seed oil': ['seed oil', 'canola', 'sunflower oil', 'soybean oil'],
  'no sweetener': ['sweetener', 'aspartame', 'sucralose', 'acesulfame'],
  'no artificial sweetener': ['aspartame', 'sucralose', 'acesulfame', 'artificial sweetener'],
  'no msg': ['msg', 'monosodium glutamate', '621'],
  'no colours': ['colour', 'color', 'dye'],
  'no artificial colours': ['artificial colour', 'artificial color'],
};

const NOVA_KEYWORDS: Record<string, NovaGroup> = {
  'minimally processed': 1,
  'not ultra processed': 3,
  'not ultraprocessed': 3,
  'whole food': 1,
  'whole foods': 1,
  'unprocessed': 1,
  'less processed': 2,
};

export function parseCriteria(query: string): HuntCriteria {
  let remaining = query.toLowerCase().trim();
  const criteria: HuntCriteria = {
    searchTerms: [],
    maxPrice: null,
    nutriScoreMin: null,
    novaMax: null,
    excludeAllergens: [],
    excludeIngredients: [],
    preferOrganic: false,
  };

  // Extract price
  const priceMatch = remaining.match(PRICE_PATTERN) || remaining.match(PRICE_PATTERN_2);
  if (priceMatch) {
    criteria.maxPrice = parseFloat(priceMatch[1]);
    remaining = remaining.replace(priceMatch[0], ' ');
  }

  // Extract allergen exclusions
  for (const [keyword, allergens] of Object.entries(ALLERGEN_KEYWORDS)) {
    if (remaining.includes(keyword)) {
      criteria.excludeAllergens.push(...allergens.filter(a => !criteria.excludeAllergens.includes(a)));
      remaining = remaining.replace(keyword, ' ');
    }
  }

  // Extract ingredient exclusions
  for (const [keyword, ingredients] of Object.entries(INGREDIENT_KEYWORDS)) {
    if (remaining.includes(keyword)) {
      criteria.excludeIngredients.push(...ingredients.filter(i => !criteria.excludeIngredients.includes(i)));
      remaining = remaining.replace(keyword, ' ');
    }
  }

  // Extract NOVA preference
  for (const [keyword, maxNova] of Object.entries(NOVA_KEYWORDS)) {
    if (remaining.includes(keyword)) {
      criteria.novaMax = (criteria.novaMax === null || maxNova < criteria.novaMax)
        ? maxNova as NovaGroup
        : criteria.novaMax;
      remaining = remaining.replace(keyword, ' ');
    }
  }

  // Extract organic preference
  if (remaining.includes('organic')) {
    criteria.preferOrganic = true;
    remaining = remaining.replace('organic', ' ');
  }

  // Extract Nutri-Score preference
  if (remaining.includes('healthy') || remaining.includes('nutritious') || remaining.includes('high protein')) {
    criteria.nutriScoreMin = 'c'; // At least average
  }

  // Clean remaining text as search terms
  remaining = remaining
    .replace(/\b(no|free|without|not|and|or|the|a|an|with|for|good|best|find|me|some|any)\b/g, ' ')
    .replace(/[,;.!?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (remaining.length > 1) {
    criteria.searchTerms = [remaining];
  }

  return criteria;
}

// ---------- Scorer ----------

const NUTRI_VALUE: Record<string, number> = { a: 5, b: 4, c: 3, d: 2, e: 1 };

function scoreProduct(product: Product, criteria: HuntCriteria, price: number | null): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 50; // Base score

  // Nutri-Score bonus
  if (product.nutriScore?.grade) {
    const val = NUTRI_VALUE[product.nutriScore.grade] || 0;
    score += val * 8; // Up to +40
    if (val >= 4) reasons.push(`Nutri-Score ${product.nutriScore.grade.toUpperCase()}`);
  }

  // NOVA bonus (lower is better)
  if (product.novaGroup?.group) {
    const novaBonus = (5 - product.novaGroup.group) * 8; // NOVA 1 = +32, NOVA 4 = +8
    score += novaBonus;
    if (product.novaGroup.group <= 2) reasons.push(`Minimally processed (NOVA ${product.novaGroup.group})`);
  }

  // Additive penalty
  if (product.additivesCount > 0) {
    score -= product.additivesCount * 3; // -3 per additive
    if (product.additivesCount === 0) reasons.push('No additives');
  } else {
    score += 10;
    reasons.push('No additives');
  }

  // Price
  if (price != null) {
    if (criteria.maxPrice && price <= criteria.maxPrice) {
      reasons.push(`$${price.toFixed(2)}`);
      score += 5;
    } else if (price != null) {
      reasons.push(`$${price.toFixed(2)}`);
    }
  }

  // Allergen-free bonus
  if (criteria.excludeAllergens.length > 0 && product.allergens.length === 0 && product.traces.length === 0) {
    reasons.push('Allergen-free');
    score += 10;
  }

  // Organic bonus
  if (criteria.preferOrganic) {
    const name = product.name.toLowerCase();
    if (name.includes('organic') || name.includes('macro organic')) {
      reasons.push('Organic');
      score += 10;
    }
  }

  return { score: Math.max(0, Math.min(100, score)), reasons };
}

// ---------- Hunt Engine ----------

export async function hunt(query: string, userAllergens: AllergenId[] = []): Promise<HuntResponse> {
  const criteria = parseCriteria(query);

  // Merge user's allergen profile with query-extracted allergens
  const allExcludedAllergens = [
    ...criteria.excludeAllergens,
    ...userAllergens.filter(a => !criteria.excludeAllergens.includes(a)),
  ];
  criteria.excludeAllergens = allExcludedAllergens;

  if (criteria.searchTerms.length === 0) {
    return { criteria, results: [], totalSearched: 0, totalFiltered: 0 };
  }

  // Search Woolworths
  const woolworths = await searchWoolworths(criteria.searchTerms[0], 1, 20);
  if (!woolworths || !woolworths.results || woolworths.results.length === 0) {
    return { criteria, results: [], totalSearched: 0, totalFiltered: 0 };
  }

  const totalSearched = woolworths.results.length;

  // Deduplicate
  const seen = new Set<string>();
  const deduped = woolworths.results.filter((wp) => {
    const key = wp.product_name.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Price filter first (cheap, no API calls needed)
  let filtered = deduped;
  if (criteria.maxPrice) {
    filtered = filtered.filter((wp) => wp.current_price <= criteria.maxPrice!);
  }

  // Enrich top 8 with full OFF data
  const toEnrich = filtered.slice(0, 8);
  const enriched = await Promise.all(
    toEnrich.map(async (wp) => {
      const offResult = await getProduct(String(wp.barcode));
      return { wp, product: offResult.status === 'found' ? offResult.product : null };
    })
  );

  // Filter and score
  const results: HuntResult[] = [];

  for (const { wp, product } of enriched) {
    if (!product) continue;

    // Allergen filter
    if (criteria.excludeAllergens.length > 0) {
      const productAllergenIds = product.allergens.map(a => a.id);
      const productTraceIds = product.traces.map(a => a.id);
      const hasExcluded = criteria.excludeAllergens.some(
        a => productAllergenIds.includes(a) || productTraceIds.includes(a)
      );
      if (hasExcluded) continue;
    }

    // NOVA filter
    if (criteria.novaMax && product.novaGroup?.group && product.novaGroup.group > criteria.novaMax) {
      continue;
    }

    // Nutri-Score filter
    if (criteria.nutriScoreMin && product.nutriScore?.grade) {
      const minVal = NUTRI_VALUE[criteria.nutriScoreMin] || 0;
      const prodVal = NUTRI_VALUE[product.nutriScore.grade] || 0;
      if (prodVal < minVal) continue;
    }

    // Ingredient filter (check ingredients text)
    if (criteria.excludeIngredients.length > 0 && product.ingredientsText) {
      const ingredientsLower = product.ingredientsText.toLowerCase();
      const hasExcluded = criteria.excludeIngredients.some(ing => ingredientsLower.includes(ing));
      if (hasExcluded) continue;
    }

    // Score
    const { score, reasons } = scoreProduct(product, criteria, wp.current_price);

    // Enrich product with Woolworths data
    product.woolworthsPrice = wp.current_price ?? null;
    product.woolworthsUrl = wp.url || null;
    product.productSize = wp.product_size || null;

    results.push({
      product,
      woolworthsPrice: wp.current_price ?? null,
      woolworthsUrl: wp.url || null,
      woolworthsSize: wp.product_size || null,
      matchReasons: reasons,
      matchScore: score,
    });
  }

  // Sort by score descending
  results.sort((a, b) => b.matchScore - a.matchScore);

  return {
    criteria,
    results: results.slice(0, 5),
    totalSearched,
    totalFiltered: totalSearched - results.length,
  };
}
