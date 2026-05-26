import Link from 'next/link';
import Image from 'next/image';
import { searchProducts } from '@/lib/api/openfoodfacts';
import type { SearchResultProduct } from '@/types/product';
import { Card, Badge, Display, Heading2, Heading3, Body, BodySmall, Caption, Mono } from '@/components/atoms';
import { HeroSearch } from '@/components/molecules';
import { AllergenProfileCTA } from '@/components/organisms/AllergenProfileCTA';

// ---------- Data ----------

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

const AU_QUERIES = ['Vegemite', 'Weet-Bix', 'Tim Tam', 'Shapes', 'Sanitarium', "Arnott's"];

// ---------- Data fetching ----------

async function getAustralianProducts(): Promise<SearchResultProduct[]> {
  const seen = new Set<string>();
  const products: SearchResultProduct[] = [];

  const normalizeName = (name: string) =>
    name.toLowerCase().trim()
      .replace(/\d+\s*(g|kg|ml|l|oz|lb|pack|pk|x)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

  for (const query of AU_QUERIES) {
    if (products.length >= 12) break;
    try {
      const result = await searchProducts(query, 1);
      if (result.status === 'ok' && result.data) {
        let added = 0;
        for (const p of result.data.products) {
          if (added >= 2 || products.length >= 12) break;
          const key = `${normalizeName(p.name || '')}|${(p.brand || '').toLowerCase().trim()}`;
          if (key === '|' || key.startsWith('|') || seen.has(key)) continue;
          seen.add(key);
          products.push(p);
          added++;
        }
      }
    } catch {
      // Skip failed queries, continue with next
    }
  }

  return products;
}

// ---------- Page ----------

export default async function HomePage() {
  const australianProducts = await getAustralianProducts();

  return (
    <main className="min-h-screen pb-0">

      {/* Section 1: Hero */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Display className="text-text">Know what&apos;s in your food</Display>
          <Body className="text-text-muted mt-4 max-w-2xl mx-auto">
            Scan or search any product to see ingredients, additives, allergens, and nutrition
            — all backed by evidence, not fear.
          </Body>

          <div className="mt-8">
            <HeroSearch />
          </div>

          <BodySmall className="text-text-subtle mt-4">
            <Link href="/scan" className="text-primary hover:underline">Or scan a barcode</Link>
          </BodySmall>

          {/* Stats bar */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mt-10">
            <Mono className="text-text-muted">22,500+ Australian products</Mono>
            <span className="hidden sm:inline text-border-strong" aria-hidden="true">&middot;</span>
            <Mono className="text-text-muted">Evidence-based ratings</Mono>
            <span className="hidden sm:inline text-border-strong" aria-hidden="true">&middot;</span>
            <Mono className="text-text-muted">14 allergens tracked</Mono>
          </div>
        </div>
      </section>

      {/* Allergen Profile CTA — only shows if no profile set */}
      <AllergenProfileCTA />

      {/* Section 2: How It Works */}
      <section className="py-16 border-t border-border">
        <div className="max-w-5xl mx-auto px-6">
          <Heading2 className="text-center">How it works</Heading2>
          <div className="grid md:grid-cols-3 gap-10 mt-10">
            {[
              {
                step: '01',
                title: 'Search or Scan',
                description: 'Find any product by name or barcode.',
              },
              {
                step: '02',
                title: 'Get the Full Picture',
                description: 'See nutrition score, processing level, and every additive explained.',
              },
              {
                step: '03',
                title: 'Make Informed Choices',
                description: 'Understand what\u2019s good, what\u2019s concerning, and why \u2014 with evidence.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center md:text-left">
                <Mono className="text-primary text-lg">{item.step}</Mono>
                <Heading3 className="mt-2">{item.title}</Heading3>
                <BodySmall className="text-text-muted mt-2">{item.description}</BodySmall>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: What We Analyse */}
      <section className="py-16 border-t border-border">
        <div className="max-w-5xl mx-auto px-6">
          <Heading2 className="text-center">What we analyse</Heading2>
          <div className="grid md:grid-cols-3 gap-6 mt-10">

            {/* Nutri-Score */}
            <Card variant="flat" padding="lg">
              <Caption className="text-primary uppercase tracking-wider">Nutri-Score</Caption>
              <Heading3 className="mt-2">Nutrition Quality</Heading3>
              <div className="flex gap-1.5 mt-4">
                {(['A', 'B', 'C', 'D', 'E'] as const).map((letter) => (
                  <span
                    key={letter}
                    className={`inline-flex items-center justify-center w-8 h-8 rounded text-xs font-bold ${
                      letter <= 'B' ? 'bg-success-muted text-success' :
                      letter === 'C' ? 'bg-warning-muted text-warning' :
                      'bg-error-muted text-error'
                    }`}
                  >
                    {letter}
                  </span>
                ))}
              </div>
              <BodySmall className="text-text-muted mt-4">
                Based on saturated fat, sugar, salt, fibre, and protein. The same system used across Europe and increasingly in Australia.
              </BodySmall>
            </Card>

            {/* NOVA */}
            <Card variant="flat" padding="lg">
              <Caption className="text-primary uppercase tracking-wider">NOVA Classification</Caption>
              <Heading3 className="mt-2">Processing Level</Heading3>
              <div className="flex gap-1.5 mt-4">
                {([1, 2, 3, 4] as const).map((group) => (
                  <span
                    key={group}
                    className={`inline-flex items-center justify-center w-8 h-8 rounded text-xs font-bold ${
                      group <= 2 ? 'bg-success-muted text-success' :
                      group === 3 ? 'bg-warning-muted text-warning' :
                      'bg-error-muted text-error'
                    }`}
                  >
                    {group}
                  </span>
                ))}
              </div>
              <BodySmall className="text-text-muted mt-4">
                From fresh whole foods to ultra-processed industrial formulations. NOVA classification developed by University of S&atilde;o Paulo.
              </BodySmall>
            </Card>

            {/* Additive Safety */}
            <Card variant="flat" padding="lg">
              <Caption className="text-primary uppercase tracking-wider">Additives</Caption>
              <Heading3 className="mt-2">Additive Safety</Heading3>
              <div className="flex gap-1.5 mt-4">
                {([
                  { label: 'Low', variant: 'bg-success-muted text-success' },
                  { label: 'Moderate', variant: 'bg-warning-muted text-warning' },
                  { label: 'High', variant: 'bg-error-muted text-error' },
                ] as const).map((level) => (
                  <span
                    key={level.label}
                    className={`inline-flex items-center justify-center h-8 px-3 rounded text-xs font-bold ${level.variant}`}
                  >
                    {level.label}
                  </span>
                ))}
              </div>
              <BodySmall className="text-text-muted mt-4">
                Every additive identified by name with evidence-based risk assessment. We cite FSANZ, EFSA, and IARC — not fear.
              </BodySmall>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 4: Browse by Category */}
      <section className="py-16 border-t border-border">
        <div className="max-w-5xl mx-auto px-6">
          <Heading2>Browse by Category</Heading2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {CATEGORIES.map((cat) => (
              <Link key={cat.query} href={`/search?q=${encodeURIComponent(cat.query)}`}>
                <Card variant="flat" padding="sm" className="hover:border-primary transition-colors cursor-pointer text-center">
                  <span className="text-2xl block mb-1" role="img" aria-hidden="true">{cat.icon}</span>
                  <BodySmall className="font-medium">{cat.label}</BodySmall>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Popular Australian Products */}
      {australianProducts.length > 0 && (
        <section className="py-16 border-t border-border">
          <div className="max-w-5xl mx-auto px-6">
            <Heading2>Popular Australian Products</Heading2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
              {australianProducts.map((product) => (
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
                    <div className="flex flex-wrap gap-1.5 mt-2">
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
          </div>
        </section>
      )}

      {/* Section 6: Trust & Independence */}
      <section className="py-16 border-t border-border">
        <div className="max-w-5xl mx-auto px-6">
          <Heading2 className="text-center">Why trust FoodLens</Heading2>
          <div className="grid md:grid-cols-3 gap-10 mt-10">
            <div>
              <Heading3>Evidence-based</Heading3>
              <BodySmall className="text-text-muted mt-2">
                Every claim backed by regulatory sources. We cite FSANZ, EFSA, IARC, and WHO. No binary good/bad labels.
              </BodySmall>
            </div>
            <div>
              <Heading3>No ads, no sponsors</Heading3>
              <BodySmall className="text-text-muted mt-2">
                FoodLens has no brand partnerships. Products are rated on ingredients, not marketing budgets.
              </BodySmall>
            </div>
            <div>
              <Heading3>Open data</Heading3>
              <BodySmall className="text-text-muted mt-2">
                Built on Open Food Facts, a community-maintained database recognised by the UN as a digital public good.
              </BodySmall>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Australia-Specific */}
      <section className="py-16 border-t border-border bg-surface">
        <div className="max-w-5xl mx-auto px-6">
          <Heading2>Built for Australia</Heading2>
          <Body className="text-text-muted mt-4 max-w-2xl">
            Australia is the allergy capital of the world. Over 5 million Australians live with allergic disease.
            FoodLens supports PEAL 2026 allergen labelling requirements and Health Star Rating awareness
            — because Australians deserve tools built for their food supply.
          </Body>
          <div className="flex flex-wrap gap-2 mt-6">
            <Badge variant="info" size="md">PEAL 2026 allergen labelling</Badge>
            <Badge variant="info" size="md">14 mandatory allergens</Badge>
            <Badge variant="info" size="md">Health Star Rating</Badge>
            <Badge variant="info" size="md">Australian product focus</Badge>
          </div>
        </div>
      </section>

      {/* Section 8: Footer */}
      <footer className="py-10 border-t border-border">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Caption className="text-text-subtle block">
              Data from Open Food Facts — an open, community-maintained food database.
            </Caption>
            <Caption className="text-text-subtle block mt-1">
              FoodLens does not provide medical or dietary advice.
            </Caption>
          </div>
          <nav className="flex gap-6" aria-label="Footer navigation">
            <Link href="/search" className="text-sm text-text-muted hover:text-text transition-colors">Search</Link>
            <Link href="/scan" className="text-sm text-text-muted hover:text-text transition-colors">Scan</Link>
            <Link href="/profile" className="text-sm text-text-muted hover:text-text transition-colors">Profile</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
