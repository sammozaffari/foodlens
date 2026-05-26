import type { Metadata } from 'next';
import Link from 'next/link';
import { getProduct } from '@/lib/api/openfoodfacts';
import { Button, Heading3, Body } from '@/components/atoms';
import { ProductCard } from '@/components/organisms';
import { BackButton } from './BackButton';

interface ProductPageProps {
  params: Promise<{ barcode: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { barcode } = await params;
  const result = await getProduct(barcode);

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
  const result = await getProduct(barcode);

  return (
    <main className="max-w-4xl mx-auto px-6 pb-8 min-h-screen">
      {/* Top bar */}
      <div className="flex items-center gap-3 py-3 border-b border-border">
        <BackButton />
        <Heading3 as="h1">Product</Heading3>
      </div>

      <div className="pt-6">
        {result.status === 'found' && result.product ? (
          <ProductCard product={result.product} />
        ) : result.status === 'not_found' ? (
          <div className="text-center py-16 space-y-4">
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
