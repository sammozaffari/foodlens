import Link from 'next/link';
import { searchProducts } from '@/lib/api/openfoodfacts';
import { Button, Card, Badge, Display, Heading2, Heading3, Body, BodySmall, Caption, Mono } from '@/components/atoms';
import Image from 'next/image';

const POPULAR_SEARCHES = [
  'Vegemite', 'Tim Tam', 'Weet-Bix', 'Shapes', 'Vita Brits',
  'Sanitarium', 'Barilla', 'Doritos', 'Woolworths', 'Coles',
];

const CATEGORIES = [
  { label: 'Breakfast Cereals', query: 'breakfast cereal', icon: '🥣' },
  { label: 'Snack Bars', query: 'muesli bar', icon: '🍫' },
  { label: 'Yoghurt', query: 'yoghurt', icon: '🥛' },
  { label: 'Bread', query: 'bread', icon: '🍞' },
  { label: 'Pasta Sauce', query: 'pasta sauce', icon: '🍝' },
  { label: 'Chips & Crisps', query: 'chips crisps', icon: '🥔' },
  { label: 'Drinks', query: 'soft drink', icon: '🥤' },
  { label: 'Baby Food', query: 'baby food', icon: '👶' },
];

async function getFeaturedProducts() {
  const result = await searchProducts('popular australian', 1);
  if (result.status === 'ok' && result.data) {
    return result.data.products.slice(0, 6);
  }
  return [];
}

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <main className="max-w-5xl mx-auto px-6 pb-12 min-h-screen">
      {/* Hero */}
      <section className="py-16 md:py-24 text-center">
        <Display>FoodLens</Display>
        <Body className="text-text-muted mt-3 max-w-xl mx-auto">
          See what&apos;s really in your food. Scan a barcode or search any product to get ingredient analysis, nutrition facts, additive breakdowns, and allergen alerts — all backed by evidence.
        </Body>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href="/scan">
            <Button size="lg" iconLeft={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="13" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="2" y="13" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="13" y="13" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="10" y1="2" x2="10" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            }>
              Scan a Barcode
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="secondary" size="lg" iconLeft={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            }>
              Search by Name
            </Button>
          </Link>
        </div>
      </section>

      {/* Browse Categories */}
      <section className="py-8 border-t border-border">
        <Heading2>Browse by Category</Heading2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.query} href={`/search?q=${encodeURIComponent(cat.query)}`}>
              <Card variant="flat" padding="sm" className="hover:border-primary transition-colors cursor-pointer text-center">
                <span className="text-2xl block mb-1" role="img" aria-hidden="true">{cat.icon}</span>
                <BodySmall className="font-medium">{cat.label}</BodySmall>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Searches */}
      <section className="py-8 border-t border-border">
        <Heading3>Popular Searches</Heading3>
        <div className="flex flex-wrap gap-2 mt-3">
          {POPULAR_SEARCHES.map((term) => (
            <Link key={term} href={`/search?q=${encodeURIComponent(term)}`}>
              <Badge variant="default" size="md">
                {term}
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-8 border-t border-border">
          <Heading3>Discover Products</Heading3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {featured.map((product) => (
              <Link key={product.barcode} href={`/product/${product.barcode}`}>
                <Card variant="flat" padding="sm" className="hover:border-primary transition-colors cursor-pointer h-full">
                  <div className="w-full h-24 relative rounded bg-surface-raised mb-2 overflow-hidden">
                    {product.imageSmallUrl ? (
                      <Image
                        src={product.imageSmallUrl}
                        alt={product.name}
                        fill
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Caption className="text-text-subtle">No image</Caption>
                      </div>
                    )}
                  </div>
                  <BodySmall className="font-medium line-clamp-2">{product.name}</BodySmall>
                  <Caption className="text-text-muted">{product.brand}</Caption>
                  <div className="flex gap-2 mt-2">
                    {product.nutriScoreGrade && (
                      <Badge
                        variant={['a', 'b'].includes(product.nutriScoreGrade) ? 'success' : product.nutriScoreGrade === 'c' ? 'warning' : 'error'}
                        size="sm"
                      >
                        Nutri-Score {product.nutriScoreGrade.toUpperCase()}
                      </Badge>
                    )}
                    {product.novaGroup && (
                      <Badge
                        variant={product.novaGroup <= 2 ? 'success' : product.novaGroup === 3 ? 'warning' : 'error'}
                        size="sm"
                      >
                        NOVA {product.novaGroup}
                      </Badge>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* What FoodLens Shows You */}
      <section className="py-8 border-t border-border">
        <Heading2>What You&apos;ll See</Heading2>
        <div className="grid md:grid-cols-3 gap-6 mt-4">
          <Card variant="flat">
            <Heading3>Nutrition Score</Heading3>
            <BodySmall className="text-text-muted mt-2">
              Nutri-Score grades (A–E) based on saturated fat, sugar, salt, fibre, and protein content. Understand nutritional quality at a glance.
            </BodySmall>
          </Card>
          <Card variant="flat">
            <Heading3>Processing Level</Heading3>
            <BodySmall className="text-text-muted mt-2">
              NOVA classification (1–4) showing how processed a food is — from whole foods to ultra-processed industrial formulations.
            </BodySmall>
          </Card>
          <Card variant="flat">
            <Heading3>Additive Analysis</Heading3>
            <BodySmall className="text-text-muted mt-2">
              Every additive identified with its name, description, concern level, and regulatory source. Evidence-based — no fear-mongering.
            </BodySmall>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border text-center">
        <Caption className="text-text-subtle">
          Data from Open Food Facts — an open, community-maintained food database.
          <br />
          FoodLens does not provide medical or dietary advice.
        </Caption>
      </footer>
    </main>
  );
}
