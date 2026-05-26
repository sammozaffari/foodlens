import { searchProducts } from '@/lib/api/openfoodfacts';

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

  const result = await searchProducts(q.trim(), isNaN(page) ? 1 : page);

  const statusCode = result.status === 'ok' ? 200 : 500;

  return new Response(JSON.stringify(result), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
