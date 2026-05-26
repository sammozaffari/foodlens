import { cache } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getProduct } from '@/lib/api/openfoodfacts';
import { searchWoolworths } from '@/lib/api/woolworths';
import { Button, Heading3, Body } from '@/components/atoms';
import { ProductCard } from '@/components/organisms';
import { BackButton } from './BackButton';

const getCachedProduct = cache(async (barcode: string) => {
  // Fetch OFF and Woolworths in parallel
  const [offResult, woolworthsResult] = await Promise.all([
    getProduct(barcode),
    searchWoolworths(barcode).catch(() => null),
  ]);

  // Enrich OFF product with Woolworths pricing
  if (offResult.status === 'found' && offResult.product) {
    const wp = woolworthsResult?.results?.find(
      (r) => String(r.barcode) === barcode || String(r.barcode).padStart(13, '0') === barcode.padStart(13, '0')
    );
    if (wp) {
      offResult.product.woolworthsPrice = wp.current_price ?? null;
      offResult.product.woolworthsUrl = wp.url || null;
      offResult.product.productSize = wp.product_size || null;
      // Use Woolworths name/brand if OFF name is empty
      if (!offResult.product.name || offResult.product.name === 'Unknown product') {
        offResult.product.name = wp.product_name;
      }
      if (!offResult.product.brand || offResult.product.brand === 'Unknown brand') {
        offResult.product.brand = wp.product_brand;
      }
    }
  }

  // If OFF didn't find it but Woolworths did, create a minimal product from Woolworths data
  if (offResult.status === 'not_found' && woolworthsResult?.results?.length) {
    const wp = woolworthsResult.results[0];
    return {
      status: 'found' as const,
      product: {
        barcode,
        name: wp.product_name,
        brand: wp.product_brand || 'Unknown brand',
        imageUrl: null,
        imageSmallUrl: null,
        nutriScore: null,
        healthStarRating: null,
        novaGroup: null,
        ingredientScore: null,
        ingredientsText: null,
        additivesTags: [],
        additivesCount: 0,
        allergens: [],
        traces: [],
        servingSize: null,
        nutrients: [],
        woolworthsPrice: wp.current_price ?? null,
        woolworthsUrl: wp.url || null,
        productSize: wp.product_size || null,
        dataSource: 'openfoodfacts' as const,
        lastUpdated: null,
      },
    };
  }

  return offResult;
});

interface ProductPageProps {
  params: Promise<{ barcode: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { barcode } = await params;
  const result = await getCachedProduct(barcode);

  if (result.status === 'found' && result.product) {
    return {
      title: `${result.product.name} — FoodLens`,
      description: `View nutrition information for ${result.product.name} by ${result.product.brand}`,
    };
  }

  return {
    title: 'Product — FoodLens',
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { barcode } = await params;
  const result = await getCachedProduct(barcode);

  return (
    <main className="max-w-4xl mx-auto px-6 pb-8 min-h-screen">
      {/* Top bar */}
      <div className="flex items-center gap-3 py-3 border-b border-border">
        <BackButton />
        <Heading3 as="h1">Product</Heading3>
      </div>

      <div className="pt-6 animate-fade-in-up">
        {result.status === 'found' && result.product ? (
          <ProductCard product={result.product} />
        ) : result.status === 'not_found' ? (
          <div className="text-center py-16 space-y-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 text-text-subtle" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <path d="M8 11h6" />
            </svg>
            <Heading3>Product Not Found</Heading3>
            <Body className="text-text-muted">
              We don&apos;t have this product yet. Try searching by name or scanning a different barcode.
            </Body>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/search">
                <Button variant="secondary">Search by Name</Button>
              </Link>
              <Link href="/scan">
                <Button variant="ghost">Scan Another</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 text-error" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <Heading3>Something Went Wrong</Heading3>
            <Body className="text-text-muted">{result.error || 'An unexpected error occurred.'}</Body>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/product/${barcode}`}>
                <Button>Try Again</Button>
              </Link>
              <Link href="/">
                <Button variant="ghost">Go Home</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
