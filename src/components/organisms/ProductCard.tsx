'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Card, Heading2, Heading3, Body, BodySmall, Caption } from '@/components/atoms';
import { ScoreBadge, AllergenBadge } from '@/components/molecules';
import { NutritionPanel } from './NutritionPanel';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  className?: string;
}

function ProductImage({ product }: { product: Product }) {
  const [error, setError] = useState(false);

  if (!product.imageUrl || error) {
    return (
      <div className="w-full h-48 rounded-lg bg-surface-raised flex items-center justify-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" className="text-text-subtle" opacity="0.4"/>
          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" className="text-text-subtle" opacity="0.4"/>
          <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-subtle" opacity="0.4"/>
        </svg>
      </div>
    );
  }

  return (
    <div className="w-full h-48 relative rounded-lg overflow-hidden bg-surface">
      <Image
        src={product.imageUrl}
        alt={`${product.name} by ${product.brand}`}
        fill
        className="object-contain"
        onError={() => setError(true)}
      />
    </div>
  );
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Layer 1: Glance */}
      <section>
        <ProductImage product={product} />

        <div className="mt-4">
          <Heading2>{product.name}</Heading2>
          <BodySmall className="text-text-muted mt-1">{product.brand}</BodySmall>
        </div>

        {/* Score badges */}
        <div role="group" aria-label="Health scores" className="flex flex-wrap gap-3 mt-4">
          <ScoreBadge
            type="nutriscore"
            value={product.nutriScore?.grade ?? null}
            label={product.nutriScore?.label ?? 'No data'}
            color={product.nutriScore?.color ?? 'text-text-subtle'}
            bgColor={product.nutriScore?.bgColor ?? ''}
          />
          <ScoreBadge
            type="nova"
            value={product.novaGroup?.group ?? null}
            label={product.novaGroup?.label ?? 'No data'}
            color={product.novaGroup?.color ?? 'text-text-subtle'}
            bgColor={product.novaGroup?.bgColor ?? ''}
          />
          <ScoreBadge
            type="ingredients"
            value={product.ingredientScore ? product.ingredientScore.additiveCount : null}
            label={product.ingredientScore?.label ?? 'No data'}
            color={product.ingredientScore?.color ?? 'text-text-subtle'}
            bgColor={product.ingredientScore?.bgColor ?? ''}
          />
        </div>

        {/* Allergens */}
        {(product.allergens.length > 0 || product.traces.length > 0) && (
          <div role="alert" aria-label="Allergen information" className="mt-4 flex flex-wrap gap-2">
            {product.allergens.map((allergen) => (
              <AllergenBadge key={`declared-${allergen.id}`} allergen={allergen} />
            ))}
            {product.traces.map((allergen) => (
              <AllergenBadge key={`trace-${allergen.id}`} allergen={allergen} />
            ))}
          </div>
        )}
      </section>

      {/* Layer 2: Scan */}
      <section className="border-t border-border pt-6 space-y-6">
        {/* Ingredients */}
        <div>
          <Heading3>Ingredients</Heading3>
          {product.ingredientsText ? (
            <Body className="mt-2 whitespace-pre-wrap">
              {product.ingredientsText}
            </Body>
          ) : (
            <BodySmall className="text-text-subtle mt-2">Ingredient list not available.</BodySmall>
          )}
          {product.additivesTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {product.additivesTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-warning-muted text-warning rounded px-1.5 py-0.5 text-xs font-medium"
                >
                  {tag.replace('en:', '').toUpperCase()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Nutrition Panel */}
        <NutritionPanel nutrients={product.nutrients} servingSize={product.servingSize} />

        {/* Allergen summary */}
        {(product.allergens.length > 0 || product.traces.length > 0) && (
          <div>
            <Heading3>Allergens</Heading3>
            <div className="mt-2 space-y-2">
              {product.allergens.length > 0 && (
                <div>
                  <Caption className="text-text-muted uppercase">Contains</Caption>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.allergens.map((a) => (
                      <AllergenBadge key={a.id} allergen={a} />
                    ))}
                  </div>
                </div>
              )}
              {product.traces.length > 0 && (
                <div>
                  <Caption className="text-text-muted uppercase">May contain</Caption>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.traces.map((a) => (
                      <AllergenBadge key={a.id} allergen={a} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Layer 3: Deep Dive */}
      <section className="border-t border-border pt-6 space-y-4">
        {product.additivesTags.length > 0 && (
          <div>
            <Heading3>Additives</Heading3>
            <div className="mt-2 space-y-1">
              {product.additivesTags.map((tag) => {
                const code = tag.replace('en:', '').toUpperCase();
                return (
                  <details key={tag} className="border border-border rounded-md">
                    <summary className="px-3 py-2 cursor-pointer hover:bg-surface text-sm font-medium">
                      {code}
                    </summary>
                    <div className="px-3 pb-2">
                      <Caption className="text-text-muted">Data from Open Food Facts</Caption>
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        )}

        {/* Data source attribution */}
        <Card variant="flat" padding="sm">
          <Caption className="text-text-subtle">
            Data from Open Food Facts.{' '}
            {product.lastUpdated && `Last updated: ${product.lastUpdated}.`}
          </Caption>
        </Card>
      </section>
    </div>
  );
}
