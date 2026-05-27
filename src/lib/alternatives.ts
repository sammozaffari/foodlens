/**
 * Smart Alternatives — finds healthier products at Woolworths
 */

import { searchWoolworths } from './api/woolworths';
import { getProductScores } from './api/openfoodfacts';
import type { Product, SearchResultProduct, AllergenId, NutriScoreGrade, NovaGroup } from '@/types/product';

export interface Alternative {
  product: SearchResultProduct;
  reasons: string[];
  improvementCount: number;
}

// Nutri-Score order: a=5 (best) to e=1 (worst)
const NUTRI_SCORE_VALUE: Record<string, number> = { a: 5, b: 4, c: 3, d: 2, e: 1 };

function extractCategory(name: string, brand: string): string {
  // Remove brand from name
  let category = name;
  if (brand) {
    const brandWords = brand.toLowerCase().split(/\s+/);
    for (const word of brandWords) {
      if (word.length > 2) {
        category = category.replace(new RegExp(word, 'gi'), '');
      }
    }
  }

  // Remove sizes, weights, counts
  category = category
    .replace(/\d+\s*(g|kg|ml|l|oz|lb|pack|pk|x|ct|count)\b/gi, '')
    .replace(/\d+\s*%/g, '')
    .replace(/[()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // If too short after stripping, use original minus brand
  if (category.length < 4) {
    category = name.replace(new RegExp(brand, 'gi'), '').trim();
  }

  return category;
}

export async function findAlternatives(
  product: Product,
  avoidAllergens: AllergenId[] = [],
  maxResults: number = 5
): Promise<Alternative[]> {
  const category = extractCategory(product.name, product.brand);
  if (!category || category.length < 3) return [];

  // Search Woolworths for similar products
  const woolworths = await searchWoolworths(category, 1, 20);
  if (!woolworths || !woolworths.results || woolworths.results.length === 0) {
    return [];
  }

  // Filter out the original product
  const candidates = woolworths.results.filter(
    (wp) => String(wp.barcode) !== product.barcode &&
            String(wp.barcode).padStart(13, '0') !== product.barcode.padStart(13, '0')
  );

  if (candidates.length === 0) return [];

  // Fetch OFF scores for top 8 candidates (rate limit)
  const toEnrich = candidates.slice(0, 8);
  const offData = await Promise.all(
    toEnrich.map((wp) => getProductScores(String(wp.barcode)))
  );

  // Build alternatives with scoring
  const originalNutri = product.nutriScore?.grade
    ? NUTRI_SCORE_VALUE[product.nutriScore.grade] || 0
    : 0;
  const originalNova = product.novaGroup?.group || 5;
  const originalAdditives = product.additivesCount || 0;
  const originalPrice = product.woolworthsPrice || Infinity;

  const alternatives: Alternative[] = [];

  for (let i = 0; i < toEnrich.length; i++) {
    const wp = toEnrich[i];
    const off = offData[i];

    // Skip if we couldn't get OFF data
    const nutriGrade = off?.nutriScoreGrade || null;
    const novaGroup = off?.novaGroup || null;

    // Check allergen compatibility (we'd need full allergen data for this,
    // but getProductScores doesn't return allergens — skip filtering for now
    // unless we add it later)

    const reasons: string[] = [];
    let improvements = 0;

    // Compare Nutri-Score
    if (nutriGrade && originalNutri > 0) {
      const altNutri = NUTRI_SCORE_VALUE[nutriGrade] || 0;
      if (altNutri > originalNutri) {
        reasons.push(`Better nutrition (${nutriGrade.toUpperCase()} vs ${product.nutriScore?.grade?.toUpperCase()})`);
        improvements++;
      }
    }

    // Compare NOVA
    if (novaGroup && originalNova < 5) {
      if (novaGroup < originalNova) {
        reasons.push(`Less processed (NOVA ${novaGroup} vs ${originalNova})`);
        improvements++;
      }
    }

    // Compare price
    if (wp.current_price && wp.current_price < originalPrice) {
      reasons.push(`Cheaper ($${wp.current_price.toFixed(2)} vs $${originalPrice.toFixed(2)})`);
      improvements++;
    }

    // Only include if there's at least one improvement
    if (improvements === 0) continue;

    alternatives.push({
      product: {
        barcode: String(wp.barcode),
        name: wp.product_name,
        brand: wp.product_brand || 'Unknown brand',
        imageSmallUrl: off?.imageSmallUrl || null,
        nutriScoreGrade: nutriGrade,
        novaGroup: novaGroup,
        price: wp.current_price ?? null,
        size: wp.product_size || null,
        woolworthsUrl: wp.url || null,
      },
      reasons,
      improvementCount: improvements,
    });
  }

  // Sort by number of improvements (most first), then by Nutri-Score
  alternatives.sort((a, b) => {
    if (b.improvementCount !== a.improvementCount) {
      return b.improvementCount - a.improvementCount;
    }
    const aScore = NUTRI_SCORE_VALUE[a.product.nutriScoreGrade || ''] || 0;
    const bScore = NUTRI_SCORE_VALUE[b.product.nutriScoreGrade || ''] || 0;
    return bScore - aScore;
  });

  return alternatives.slice(0, maxResults);
}
