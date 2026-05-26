/**
 * Woolworths Products RapidAPI Client
 *
 * Primary search source for Australian product availability and pricing.
 * Nutrition data comes from Open Food Facts — this API provides:
 * - Product name, brand, barcode
 * - Current price and product size
 * - Woolworths product page URL
 */

const RAPIDAPI_KEY = '8a3197babamshdce75d6bf232d2dp17a512jsn0433fee263d5';
const RAPIDAPI_HOST = 'woolworths-products-api.p.rapidapi.com';
const BASE_URL = `https://${RAPIDAPI_HOST}/woolworths`;

export interface WoolworthsProduct {
  barcode: number;
  product_name: string;
  product_brand: string;
  current_price: number;
  product_size: string;
  url: string;
}

export interface WoolworthsSearchResponse {
  query: string;
  results: WoolworthsProduct[];
  total_results: number;
  total_pages: number;
  current_page: number;
}

export async function searchWoolworths(
  query: string,
  page: number = 1,
  pageSize: number = 20
): Promise<WoolworthsSearchResponse | null> {
  try {
    const params = new URLSearchParams({
      query,
      page: String(page),
      page_size: String(pageSize),
    });

    const response = await fetch(`${BASE_URL}/product-search?${params}`, {
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY,
      },
      next: { revalidate: 300 }, // cache for 5 minutes
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (data.detail) return null; // "404: No products found"

    return data as WoolworthsSearchResponse;
  } catch {
    return null;
  }
}
