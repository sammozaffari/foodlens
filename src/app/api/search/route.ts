import { searchWoolworths } from '@/lib/api/woolworths';
import { getProductScores } from '@/lib/api/openfoodfacts';
import type { SearchResultProduct, SearchApiResponse } from '@/types/product';

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const page = parseInt(searchParams.get('page') || '1', 10);

  if (!q || q.trim() === '') {
    return new Response(
      JSON.stringify({ status: 'error', data: null, error: 'Search query is required' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // 1. Search Woolworths as primary source
    const woolworthsData = await searchWoolworths(q.trim(), isNaN(page) ? 1 : page, 24);

    if (!woolworthsData || !woolworthsData.results || woolworthsData.results.length === 0) {
      const result: SearchApiResponse = {
        status: 'ok',
        data: {
          products: [],
          totalResults: 0,
          page: isNaN(page) ? 1 : page,
          pageSize: 24,
          hasMore: false,
        },
      };
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    // Deduplicate Woolworths results by normalized name + brand
    const normalizeName = (name: string) =>
      name.toLowerCase().trim()
        .replace(/\d+\s*(g|kg|ml|l|oz|lb|pack|pk|x)\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

    const seen = new Set<string>();
    const dedupedResults = woolworthsData.results.filter((p) => {
      const key = `${normalizeName(p.product_name || '')}|${(p.product_brand || '').toLowerCase().trim()}`;
      if (key === '|' || key.startsWith('|') || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // 2. Enrich first 12 results with OFF nutrition data (in parallel)
    const limitedResults = dedupedResults.slice(0, 12);
    const offScores = await Promise.all(
      limitedResults.map((wp) => getProductScores(String(wp.barcode)))
    );

    // 3. Merge into SearchResultProduct
    const products: SearchResultProduct[] = limitedResults.map((wp, i) => {
      const off = offScores[i];
      return {
        barcode: String(wp.barcode),
        name: wp.product_name,
        brand: wp.product_brand || 'Unknown brand',
        imageSmallUrl: off?.imageSmallUrl || null,
        nutriScoreGrade: off?.nutriScoreGrade || null,
        novaGroup: off?.novaGroup || null,
        price: wp.current_price ?? null,
        size: wp.product_size || null,
        woolworthsUrl: wp.url || null,
      };
    });

    // Also include remaining deduped results beyond 12 (without OFF enrichment)
    for (let i = 12; i < dedupedResults.length; i++) {
      const wp = dedupedResults[i];
      products.push({
        barcode: String(wp.barcode),
        name: wp.product_name,
        brand: wp.product_brand || 'Unknown brand',
        imageSmallUrl: null,
        nutriScoreGrade: null,
        novaGroup: null,
        price: wp.current_price ?? null,
        size: wp.product_size || null,
        woolworthsUrl: wp.url || null,
      });
    }

    const totalResults = woolworthsData.total_results || products.length;
    const currentPage = woolworthsData.current_page || (isNaN(page) ? 1 : page);
    const totalPages = woolworthsData.total_pages || 1;

    const result: SearchApiResponse = {
      status: 'ok',
      data: {
        products,
        totalResults,
        page: currentPage,
        pageSize: 24,
        hasMore: currentPage < totalPages,
      },
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ status: 'error', data: null, error: 'Search failed. Please try again.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
