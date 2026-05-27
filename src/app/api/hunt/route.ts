import { hunt } from '@/lib/hunt';
import type { AllergenId } from '@/types/product';

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const query = body.query as string;
    const allergens = (body.allergens || []) as AllergenId[];

    if (!query || query.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: 'Please describe what you\'re looking for' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await hunt(query.trim(), allergens);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: 'Hunt failed. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
