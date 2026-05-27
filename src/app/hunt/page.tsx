'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge, Button, Card, Display, Heading3, Body, BodySmall, Caption, Mono } from '@/components/atoms';
import { useAllergenProfile } from '@/hooks/useAllergenProfile';
import type { HuntResponse } from '@/lib/hunt';
import { getNutriScoreColor, getNutriScoreBgColor, getNovaLabel } from '@/types/product';

const EXAMPLES = [
  'Healthy yoghurt under $5',
  'Gluten free bread',
  'High protein snacks, no artificial sweeteners',
  'Organic pasta sauce under $4',
  'Nut free muesli bars for kids',
  'Minimally processed cereal',
];

type Status = 'idle' | 'searching' | 'analyzing' | 'ranking' | 'done' | 'error';

export default function HuntPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [response, setResponse] = useState<HuntResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { allergens } = useAllergenProfile();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setStatus('searching');
    setResponse(null);
    setError(null);

    try {
      // Simulate progress steps
      setTimeout(() => setStatus('analyzing'), 1500);
      setTimeout(() => setStatus('ranking'), 3000);

      const res = await fetch('/api/hunt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), allergens }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Hunt failed');
      }

      const data: HuntResponse = await res.json();
      setResponse(data);
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  };

  const handleExample = (example: string) => {
    setQuery(example);
  };

  return (
    <main className="max-w-4xl mx-auto px-6 pb-12 min-h-screen">
      {/* Header */}
      <section className="py-12 text-center">
        <Display className="text-text">AI Product Hunter</Display>
        <Body className="text-text-muted mt-3 max-w-xl mx-auto">
          Describe what you want in plain English. We&apos;ll search Woolworths, analyse ingredients, and find the best matches.
        </Body>
      </section>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., healthy muesli bars under $4, no added sugar, gluten-free"
            rows={3}
            className="w-full rounded-lg border border-border bg-background text-text p-4 pr-24 text-base resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-border-focus shadow-sm transition-all"
          />
          <Button
            type="submit"
            className="absolute bottom-3 right-3"
            disabled={!query.trim() || (status !== 'idle' && status !== 'done' && status !== 'error')}
          >
            Hunt
          </Button>
        </div>

        {allergens.length > 0 && (
          <Caption className="text-text-muted mt-2 block">
            Your allergen profile ({allergens.join(', ')}) will be applied automatically.
          </Caption>
        )}
      </form>

      {/* Example queries */}
      {status === 'idle' && !response && (
        <div className="max-w-2xl mx-auto mt-6">
          <Caption className="text-text-muted block mb-2">Try these:</Caption>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => handleExample(ex)}
                className="px-3 py-1.5 rounded-full border border-border text-sm text-text-muted hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Progress */}
      {(status === 'searching' || status === 'analyzing' || status === 'ranking') && (
        <div className="max-w-2xl mx-auto mt-12 text-center space-y-6">
          <div className="space-y-3">
            <ProgressStep label="Searching Woolworths" active={status === 'searching'} done={status !== 'searching'} />
            <ProgressStep label="Analysing ingredients & nutrition" active={status === 'analyzing'} done={status === 'ranking'} />
            <ProgressStep label="Ranking best matches" active={status === 'ranking'} done={false} />
          </div>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div className="max-w-2xl mx-auto mt-8">
          <Card variant="flat" className="text-center py-6 border-error">
            <Body className="text-text-muted">{error}</Body>
            <Button className="mt-4" onClick={() => setStatus('idle')}>Try Again</Button>
          </Card>
        </div>
      )}

      {/* Results */}
      {status === 'done' && response && (
        <div className="mt-10 animate-fade-in-up">
          {/* Criteria summary */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Caption className="text-text-muted">Searched {response.totalSearched} products</Caption>
            {response.criteria.maxPrice && (
              <Badge variant="default" size="sm">Under ${response.criteria.maxPrice}</Badge>
            )}
            {response.criteria.excludeAllergens.map((a) => (
              <Badge key={a} variant="warning" size="sm">{a}-free</Badge>
            ))}
            {response.criteria.excludeIngredients.length > 0 && (
              <Badge variant="default" size="sm">No {response.criteria.excludeIngredients[0]}</Badge>
            )}
            {response.criteria.novaMax && (
              <Badge variant="info" size="sm">NOVA ≤{response.criteria.novaMax}</Badge>
            )}
            {response.criteria.preferOrganic && (
              <Badge variant="success" size="sm">Organic</Badge>
            )}
          </div>

          {response.results.length === 0 ? (
            <Card variant="flat" className="text-center py-12">
              <Heading3>No matches found</Heading3>
              <Body className="text-text-muted mt-2">
                Try broadening your criteria — remove a constraint or try a different product type.
              </Body>
            </Card>
          ) : (
            <div className="space-y-4">
              {response.results.map((result, index) => (
                <Link key={result.product.barcode} href={`/product/${result.product.barcode}`} className="block">
                  <Card
                    variant="flat"
                    padding="md"
                    className="hover:border-primary hover:shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex gap-4">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>

                      {/* Image */}
                      <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-surface-raised relative">
                        {result.product.imageUrl ? (
                          <Image
                            src={result.product.imageUrl}
                            alt={result.product.name}
                            fill
                            className="object-contain p-1"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Caption className="text-text-subtle text-[10px]">No img</Caption>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <BodySmall className="font-medium">{result.product.name}</BodySmall>
                        <Caption className="text-text-muted block">{result.product.brand}</Caption>

                        <div className="flex items-center gap-3 mt-1">
                          {result.woolworthsPrice != null && (
                            <Mono className="text-sm font-semibold">
                              ${result.woolworthsPrice.toFixed(2)}
                            </Mono>
                          )}
                          {result.woolworthsSize && (
                            <Caption className="text-text-muted">{result.woolworthsSize}</Caption>
                          )}
                          {result.product.nutriScore && (
                            <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold ${getNutriScoreBgColor(result.product.nutriScore.grade)} ${getNutriScoreColor(result.product.nutriScore.grade)}`}>
                              {result.product.nutriScore.grade.toUpperCase()}
                            </span>
                          )}
                          {result.product.novaGroup && (
                            <Caption className="text-text-muted">
                              NOVA {result.product.novaGroup.group}
                            </Caption>
                          )}
                        </div>

                        {/* Match reasons */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {result.matchReasons.map((reason, i) => (
                            <Badge key={i} variant="success" size="sm">{reason}</Badge>
                          ))}
                        </div>
                      </div>

                      {/* Score */}
                      <div className="flex-shrink-0 text-right">
                        <Mono className="text-lg font-bold text-primary">{result.matchScore}</Mono>
                        <Caption className="text-text-subtle block">/100</Caption>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

function ProgressStep({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <div className={`flex items-center gap-3 justify-center transition-opacity ${active ? 'opacity-100' : done ? 'opacity-50' : 'opacity-30'}`}>
      {done ? (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-success flex-shrink-0">
          <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.15" />
          <path d="M6 10l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : active ? (
        <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin flex-shrink-0" />
      ) : (
        <div className="w-5 h-5 rounded-full border-2 border-border flex-shrink-0" />
      )}
      <Body className={active ? 'text-text font-medium' : 'text-text-muted'}>{label}</Body>
    </div>
  );
}
