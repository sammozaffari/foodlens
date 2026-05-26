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
      <section className="py-24 md:py-32 animate-fade-in">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Display className="text-text">Know what&apos;s in your food</Display>
          <Body className="text-text-muted mt-5 max-w-2xl mx-auto text-lg">
            Scan or search any product to see ingredients, additives, allergens, and nutrition
            — all backed by evidence, not fear.
          </Body>

          <div className="mt-10">
            <HeroSearch />
          </div>

          <BodySmall className="text-text-subtle mt-5">
            <Link href="/scan" className="text-primary hover:underline">Or scan a barcode</Link>
          </BodySmall>

          {/* Stats bar */}
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 mt-12 py-4 border-t border-b border-border">
            <div className="flex items-center gap-2">
              <Mono className="text-text font-semibold text-base">22,500+</Mono>
              <Caption className="text-text-muted">Australian products</Caption>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border-strong" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <Mono className="text-text font-semibold text-base">3</Mono>
              <Caption className="text-text-muted">Evidence-based scores</Caption>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border-strong" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <Mono className="text-text font-semibold text-base">14</Mono>
              <Caption className="text-text-muted">Allergens tracked</Caption>
            </div>
          </div>
        </div>
      </section>

      {/* Allergen Profile CTA — only shows if no profile set */}
      <AllergenProfileCTA />

      {/* Section 2: How It Works */}
      <section className="py-20 border-t border-border">
        <div className="max-w-5xl mx-auto px-6">
          <Heading2 className="text-center animate-fade-in">How it works</Heading2>
          <div className="grid md:grid-cols-3 gap-10 mt-12 relative">
            {/* Connecting lines on desktop */}
            <div className="hidden md:block absolute top-8 left-[calc(33.333%-20px)] right-[calc(33.333%-20px)] h-px bg-border" aria-hidden="true" />
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
            ].map((item, i) => (
              <div key={item.step} className="text-center md:text-left animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-muted relative z-10">
                  <Mono className="text-primary text-sm font-bold">{item.step}</Mono>
                </div>
                <Heading3 className="mt-3">{item.title}</Heading3>
                <BodySmall className="text-text-muted mt-2">{item.description}</BodySmall>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: What We Analyse */}
      <section className="py-20 border-t border-border">
        <div className="max-w-5xl mx-auto px-6">
          <Heading2 className="text-center animate-fade-in">What we analyse</Heading2>
          <div className="grid md:grid-cols-3 gap-6 mt-12 animate-stagger">

            {/* Nutri-Score */}
            <Card variant="flat" padding="lg">
              <Caption className="text-primary uppercase tracking-wider font-semibold">Nutri-Score</Caption>
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
              <Caption className="text-primary uppercase tracking-wider font-semibold">NOVA Classification</Caption>
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
              <Caption className="text-primary uppercase tracking-wider font-semibold">Additives</Caption>
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
      <section className="py-20 border-t border-border">
        <div className="max-w-5xl mx-auto px-6">
          <Heading2 className="animate-fade-in">Browse by Category</Heading2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 animate-stagger">
            {CATEGORIES.map((cat) => (
              <Link key={cat.query} href={`/search?q=${encodeURIComponent(cat.query)}`}>
                <Card variant="flat" padding="sm" className="hover:border-primary hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-center">
                  <span className="text-2xl block mb-1.5" role="img" aria-hidden="true">{cat.icon}</span>
                  <BodySmall className="font-medium">{cat.label}</BodySmall>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Popular Australian Products */}
      {australianProducts.length > 0 && (
        <section className="py-20 border-t border-border">
          <div className="max-w-5xl mx-auto px-6">
            <Heading2 className="animate-fade-in">Popular Australian Products</Heading2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8 animate-stagger">
              {australianProducts.map((product) => (
                <Link key={product.barcode} href={`/product/${product.barcode}`}>
                  <Card variant="flat" padding="sm" className="hover:border-primary hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 cursor-pointer h-full flex flex-col">
                    <div className="w-full h-24 relative rounded-md bg-surface-raised mb-2 overflow-hidden">
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
                    <BodySmall className="font-medium line-clamp-2 flex-1">{product.name}</BodySmall>
                    <Caption className="text-text-muted mt-1">{product.brand}</Caption>
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
      <section className="py-20 border-t border-border">
        <div className="max-w-5xl mx-auto px-6">
          <Heading2 className="text-center animate-fade-in">Why trust FoodLens</Heading2>
          <div className="grid md:grid-cols-3 gap-10 mt-12">
            {[
              {
                title: 'Evidence-based',
                desc: 'Every claim backed by regulatory sources. We cite FSANZ, EFSA, IARC, and WHO. No binary good/bad labels.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
                    <path d="M9 12l2 2 4-4" />
                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
                  </svg>
                ),
              },
              {
                title: 'No ads, no sponsors',
                desc: 'FoodLens has no brand partnerships. Products are rated on ingredients, not marketing budgets.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
              },
              {
                title: 'Open data',
                desc: 'Built on Open Food Facts, a community-maintained database recognised by the UN as a digital public good.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div key={item.title} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-10 h-10 rounded-lg bg-primary-muted flex items-center justify-center mb-3">
                  {item.icon}
                </div>
                <Heading3>{item.title}</Heading3>
                <BodySmall className="text-text-muted mt-2">{item.desc}</BodySmall>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Australia-Specific */}
      <section className="py-20 border-t border-border bg-surface">
        <div className="max-w-5xl mx-auto px-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-info-muted flex items-center justify-center flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-info" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <Heading2>Built for Australia</Heading2>
          </div>
          <Body className="text-text-muted mt-4 max-w-2xl text-lg leading-relaxed">
            Australia is the allergy capital of the world. Over 5 million Australians live with allergic disease.
            FoodLens supports PEAL 2026 allergen labelling requirements and Health Star Rating awareness
            — because Australians deserve tools built for their food supply.
          </Body>
          <div className="flex flex-wrap gap-2 mt-8">
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
