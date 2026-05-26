import { getProduct } from '@/lib/api/openfoodfacts';
import { searchWoolworths } from '@/lib/api/woolworths';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ barcode: string }> }
): Promise<Response> {
  const { barcode } = await params;

  // Fetch OFF and Woolworths in parallel
  const [offResult, woolworthsResult] = await Promise.all([
    getProduct(barcode),
    searchWoolworths(barcode),
  ]);

  // Enrich OFF product with Woolworths pricing if available
  if (offResult.status === 'found' && offResult.product) {
    const wp = woolworthsResult?.results?.find(
      (r) => String(r.barcode) === barcode
    );
    if (wp) {
      offResult.product.woolworthsPrice = wp.current_price ?? null;
      offResult.product.woolworthsUrl = wp.url || null;
      offResult.product.productSize = wp.product_size || null;
    }
  }

  const statusCode =
    offResult.status === 'found' ? 200 : offResult.status === 'not_found' ? 404 : 500;

  return new Response(JSON.stringify(offResult), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
