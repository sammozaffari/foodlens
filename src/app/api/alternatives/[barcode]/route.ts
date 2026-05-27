import { getProduct } from '@/lib/api/openfoodfacts';
import { findAlternatives } from '@/lib/alternatives';
import type { AllergenId } from '@/types/product';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ barcode: string }> }
): Promise<Response> {
  const { barcode } = await params;
  const { searchParams } = new URL(request.url);
  const allergens = (searchParams.get('allergens')?.split(',').filter(Boolean) || []) as AllergenId[];

  const result = await getProduct(barcode);

  if (result.status !== 'found' || !result.product) {
    return new Response(
      JSON.stringify({ alternatives: [], error: 'Product not found' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const alternatives = await findAlternatives(result.product, allergens);

    return new Response(JSON.stringify({ alternatives }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ alternatives: [], error: 'Failed to find alternatives' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
