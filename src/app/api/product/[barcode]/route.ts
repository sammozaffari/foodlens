import { getProduct } from '@/lib/api/openfoodfacts';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ barcode: string }> }
): Promise<Response> {
  const { barcode } = await params;

  const result = await getProduct(barcode);

  const statusCode =
    result.status === 'found' ? 200 : result.status === 'not_found' ? 404 : 500;

  return new Response(JSON.stringify(result), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
