'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Badge, Button, Card, Heading2, Heading3, Body, BodySmall, Caption, Mono } from '@/components/atoms';
import { ScoreBadge, AllergenBadge } from '@/components/molecules';
import { NutritionPanel } from './NutritionPanel';
import { AllergenAlert } from './AllergenAlert';
import type { Product } from '@/types/product';
import {
  getNutriScoreExplanation,
  getNovaExplanation,
  getIngredientExplanation,
  getAdditiveInfo,
  getAdditiveConcernBg,
} from '@/types/product';

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
        sizes="(max-width: 768px) 100vw, 240px"
        className="object-contain"
        onError={() => setError(true)}
      />
    </div>
  );
}

function generateNutritionalSummary(product: Product): string {
  const parts: string[] = [];

  if (product.nutriScore) {
    parts.push(getNutriScoreExplanation(product.nutriScore.grade));
  }

  if (product.novaGroup) {
    parts.push(getNovaExplanation(product.novaGroup.group));
  }

  if (product.additivesCount > 0) {
    parts.push(getIngredientExplanation(product.additivesCount));
  } else {
    parts.push('No additives detected.');
  }

  return parts.join(' ');
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Allergen profile alert — first thing users see */}
      <AllergenAlert product={product} />

      {/* Layer 1: Glance */}
      <section className="animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          <ProductImage product={product} />
          <div>
            <Heading2>{product.name}</Heading2>
            <BodySmall className="text-text-muted mt-1">{product.brand}</BodySmall>
            {product.woolworthsPrice != null && (
              <Mono className="text-text text-lg font-bold mt-2 block">
                ${product.woolworthsPrice.toFixed(2)}{product.productSize ? ` · ${product.productSize}` : ''}
              </Mono>
            )}
            {product.woolworthsUrl && (
              <a
                href={product.woolworthsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3"
                onClick={(e) => e.stopPropagation()}
              >
                <Button variant="secondary" size="sm">
                  View on Woolworths
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Score badges — only show if we have at least one score */}
        {(product.nutriScore || product.novaGroup || product.ingredientScore) ? (
        <div role="group" aria-label="Health scores" className="flex flex-wrap gap-3 mt-5">
          {product.nutriScore && (
          <button onClick={() => scrollToSection('section-nutrition')} className="text-left cursor-pointer">
            <ScoreBadge
              type="nutriscore"
              value={product.nutriScore.grade}
              label={product.nutriScore.label}
              color={product.nutriScore.color}
              bgColor={product.nutriScore.bgColor}
            />
          </button>
          )}
          {product.novaGroup && (
          <button onClick={() => scrollToSection('section-processing')} className="text-left cursor-pointer">
            <ScoreBadge
              type="nova"
              value={product.novaGroup.group}
              label={product.novaGroup.label}
              color={product.novaGroup.color}
              bgColor={product.novaGroup.bgColor}
            />
          </button>
          )}
          {product.ingredientScore && (
          <button onClick={() => scrollToSection('section-additives')} className="text-left cursor-pointer">
            <ScoreBadge
              type="ingredients"
              value={product.ingredientScore.additiveCount}
              label={product.ingredientScore.label}
              color={product.ingredientScore.color}
              bgColor={product.ingredientScore.bgColor}
            />
          </button>
          )}
        </div>
        ) : (
        <Card variant="flat" padding="sm" className="mt-4">
          <BodySmall className="text-text-muted">
            Nutrition scores not yet available for this product. Ingredient and nutrition data may still be shown below if available.
          </BodySmall>
        </Card>
        )}

        {/* Allergens */}
        {(product.allergens.length > 0 || product.traces.length > 0) && (
          <div role="region" aria-label="Allergen information" className="mt-4 flex flex-wrap gap-2">
            {product.allergens.map((allergen) => (
              <AllergenBadge key={`declared-${allergen.id}`} allergen={allergen} />
            ))}
            {product.traces.map((allergen) => (
              <AllergenBadge key={`trace-${allergen.id}`} allergen={allergen} />
            ))}
          </div>
        )}

        {/* Nutritional Profile Summary */}
        <Card variant="flat" padding="sm" className="mt-4">
          <Body className="text-text-muted text-sm leading-relaxed">
            {generateNutritionalSummary(product)}
          </Body>
        </Card>
      </section>

      {/* Layer 2: Detailed Breakdowns */}
      <section className="border-t border-border pt-6 space-y-8 animate-fade-in-up" style={{ animationDelay: '150ms' }}>

        {/* Nutrition Breakdown */}
        <div id="section-nutrition" className="scroll-mt-20">
          <Heading3>Nutrition</Heading3>
          {product.nutriScore && (
            <Card variant="flat" padding="sm" className="mt-3 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-primary-muted)' }}>
                  <Mono className={`${product.nutriScore.color} text-lg font-bold`}>
                    {product.nutriScore.grade.toUpperCase()}
                  </Mono>
                </div>
                <BodySmall className="text-text-muted">
                  {getNutriScoreExplanation(product.nutriScore.grade)}
                </BodySmall>
              </div>
            </Card>
          )}
          <NutritionPanel nutrients={product.nutrients} servingSize={product.servingSize} />
        </div>

        {/* Processing Breakdown */}
        <div id="section-processing" className="scroll-mt-20">
          <Heading3>Processing Level</Heading3>
          {product.novaGroup ? (
            <Card variant="flat" padding="sm" className="mt-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-primary-muted)' }}>
                  <Mono className={`${product.novaGroup.color} text-lg font-bold`}>
                    {product.novaGroup.group}
                  </Mono>
                </div>
                <div>
                  <BodySmall className={product.novaGroup.color + ' font-medium'}>
                    {product.novaGroup.label}
                  </BodySmall>
                  <BodySmall className="text-text-muted mt-1">
                    {getNovaExplanation(product.novaGroup.group)}
                  </BodySmall>
                </div>
              </div>
            </Card>
          ) : (
            <BodySmall className="text-text-subtle mt-2">Processing level data not available.</BodySmall>
          )}
        </div>

        {/* Ingredients & Additives */}
        <div id="section-additives" className="scroll-mt-20">
          <Heading3>Ingredients</Heading3>
          {product.ingredientsText ? (
            <Body className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
              {product.ingredientsText}
            </Body>
          ) : (
            <BodySmall className="text-text-subtle mt-2">Ingredient list not available.</BodySmall>
          )}

          {/* Additives with descriptions */}
          {product.additivesTags.length > 0 && (
            <div className="mt-5 space-y-2">
              <BodySmall className="text-text-muted font-medium">
                {getIngredientExplanation(product.additivesCount)}
              </BodySmall>
              {product.additivesTags.map((tag) => {
                const info = getAdditiveInfo(tag);
                const code = tag.replace('en:', '').toUpperCase();

                if (info) {
                  return (
                    <details key={tag} className="border border-border rounded-lg overflow-hidden group">
                      <summary className="px-4 py-3 cursor-pointer hover:bg-surface transition-colors duration-150 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mono className="text-sm font-medium">{info.code}</Mono>
                          <BodySmall>{info.name}</BodySmall>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={info.concern === 'high' ? 'error' : info.concern === 'moderate' ? 'warning' : 'success'}
                            size="sm"
                          >
                            {info.concern === 'high' ? 'High concern' : info.concern === 'moderate' ? 'Moderate' : 'Low concern'}
                          </Badge>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-text-subtle transition-transform duration-200 group-open:rotate-180" aria-hidden="true">
                            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </summary>
                      <div className={`px-4 py-3 border-t border-border ${getAdditiveConcernBg(info.concern)}`}>
                        <Body className="text-sm">{info.description}</Body>
                        <Caption className="text-text-muted mt-2 block">
                          Source: {info.source}
                        </Caption>
                      </div>
                    </details>
                  );
                }

                return (
                  <details key={tag} className="border border-border rounded-lg overflow-hidden group">
                    <summary className="px-4 py-3 cursor-pointer hover:bg-surface transition-colors duration-150 flex items-center justify-between">
                      <Mono className="text-sm font-medium">{code}</Mono>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" size="sm">Unknown</Badge>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-text-subtle transition-transform duration-200 group-open:rotate-180" aria-hidden="true">
                          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </summary>
                    <div className="px-4 py-3 border-t border-border bg-surface">
                      <BodySmall className="text-text-muted">
                        This additive is not yet in our database. Data from Open Food Facts.
                      </BodySmall>
                    </div>
                  </details>
                );
              })}
            </div>
          )}
        </div>

        {/* Allergen summary */}
        {(product.allergens.length > 0 || product.traces.length > 0) && (
          <div>
            <Heading3>Allergens</Heading3>
            <div className="mt-3 space-y-3">
              {product.allergens.length > 0 && (
                <div>
                  <Caption className="text-text-muted uppercase font-medium tracking-wide">Contains</Caption>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {product.allergens.map((a) => (
                      <AllergenBadge key={a.id} allergen={a} />
                    ))}
                  </div>
                </div>
              )}
              {product.traces.length > 0 && (
                <div>
                  <Caption className="text-text-muted uppercase font-medium tracking-wide">May contain</Caption>
                  <div className="flex flex-wrap gap-2 mt-1.5">
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

      {/* Data source */}
      <Card variant="flat" padding="sm">
        <Caption className="text-text-subtle">
          Nutrition data from Open Food Facts. Pricing from Woolworths.
        </Caption>
      </Card>
    </div>
  );
}
