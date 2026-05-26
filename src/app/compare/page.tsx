import type { Metadata } from 'next';
import Link from 'next/link';
import { getProduct } from '@/lib/api/openfoodfacts';
import { Button, Heading3, Body } from '@/components/atoms';
import { CompareTable } from '@/components/organisms';
import type { Product } from '@/types/product';

export const metadata: Metadata = {
  title: 'Compare Products — FoodLens',
  description: 'Compare nutrition, scores, and allergens side by side.',
};

interface ComparePageProps {
  searchParams: Promise<{ barcodes?: string }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;
  const barcodesParam = params.barcodes ?? '';
  const barcodes = barcodesParam
    .split(',')
    .map((b) => b.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (barcodes.length < 2) {
    return (
      <main className="max-w-4xl mx-auto px-6 pb-8 min-h-screen">
        <div className="flex items-center gap-3 py-3 border-b border-border">
          <Link href="/search">
            <Button
              variant="ghost"
              size="sm"
              aria-label="Back to search"
              iconLeft={
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M11.25 13.5L6.75 9L11.25 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            >
              {null}
            </Button>
          </Link>
          <Heading3 as="h1">Compare</Heading3>
        </div>
        <div className="text-center py-16 space-y-4">
          <Heading3>Not enough products</Heading3>
          <Body className="text-text-muted">
            Select 2 or 3 products from search results to compare them side by side.
          </Body>
          <Link href="/search">
            <Button variant="secondary">Go to Search</Button>
          </Link>
        </div>
      </main>
    );
  }

  // Fetch all products in parallel, catching individual failures
  let results;
  try {
    results = await Promise.all(
      barcodes.map(async (barcode) => {
        try {
          return await getProduct(barcode);
        } catch {
          return { status: 'error' as const, product: null, error: 'Failed to fetch' };
        }
      })
    );
  } catch {
    return (
      <main className="max-w-4xl mx-auto px-6 pb-8 min-h-screen">
        <div className="flex items-center gap-3 py-3 border-b border-border">
          <Link href="/search">
            <Button variant="ghost" size="sm" aria-label="Back to search" iconLeft={
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M11.25 13.5L6.75 9L11.25 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }>{null}</Button>
          </Link>
          <Heading3 as="h1">Compare</Heading3>
        </div>
        <div className="text-center py-16 space-y-4">
          <Heading3>Something went wrong</Heading3>
          <Body className="text-text-muted">
            Unable to fetch product data. Please check your connection and try again.
          </Body>
          <Link href="/search">
            <Button variant="secondary">Go to Search</Button>
          </Link>
        </div>
      </main>
    );
  }

  const products: (Product | null)[] = results.map((r) =>
    r.status === 'found' ? r.product : null
  );

  return (
    <main className="max-w-4xl mx-auto px-6 pb-8 min-h-screen">
      {/* Top bar */}
      <div className="flex items-center gap-3 py-3 border-b border-border">
        <Link href="/search">
          <Button
            variant="ghost"
            size="sm"
            aria-label="Back to search"
            iconLeft={
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M11.25 13.5L6.75 9L11.25 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          >
            {null}
          </Button>
        </Link>
        <Heading3 as="h1">Compare</Heading3>
      </div>

      <div className="pt-6 animate-fade-in">
        <CompareTable products={products} barcodes={barcodes} />
      </div>
    </main>
  );
}
