import Image from 'next/image';
import { Card, Heading4, Body, BodySmall, Caption, Mono } from '@/components/atoms';
import { ScoreBadge, AllergenBadge } from '@/components/molecules';
import type { Product, Nutrient } from '@/types/product';

interface CompareTableProps {
  products: (Product | null)[];
  barcodes: string[];
}

/** Key nutrients to compare, in display order */
const NUTRIENT_KEYS = [
  { name: 'Energy', unit: 'kJ' },
  { name: 'Protein', unit: 'g' },
  { name: 'Fat', unit: 'g' },
  { name: 'Saturated Fat', unit: 'g' },
  { name: 'Carbohydrates', unit: 'g' },
  { name: 'Sugars', unit: 'g' },
  { name: 'Fibre', unit: 'g' },
  { name: 'Salt', unit: 'g' },
] as const;

/** Lower is better for these nutrients */
const LOWER_IS_BETTER = new Set(['Fat', 'Saturated Fat', 'Sugars', 'Salt', 'Energy']);

function findNutrient(nutrients: Nutrient[], name: string): Nutrient | undefined {
  // Try exact case-insensitive match first, fall back to partial only if no exact match
  return (
    nutrients.find((n) => n.name.toLowerCase() === name.toLowerCase()) ??
    nutrients.find((n) => n.name.toLowerCase().includes(name.toLowerCase()))
  );
}

function getBestIndex(values: (number | null)[], lowerIsBetter: boolean): number | null {
  let bestIdx: number | null = null;
  let bestVal: number | null = null;

  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v === null) continue;
    if (bestVal === null) {
      bestVal = v;
      bestIdx = i;
    } else if (lowerIsBetter ? v < bestVal : v > bestVal) {
      bestVal = v;
      bestIdx = i;
    }
  }

  // Only highlight if there are at least 2 non-null values and they differ
  const nonNull = values.filter((v) => v !== null);
  if (nonNull.length < 2) return null;
  const allSame = nonNull.every((v) => v === nonNull[0]);
  if (allSame) return null;

  return bestIdx;
}

function ProductHeader({ product, barcode }: { product: Product | null; barcode: string }) {
  if (!product) {
    return (
      <div className="flex flex-col items-center gap-2 min-w-[140px]">
        <div className="w-16 h-16 rounded-lg bg-surface-raised flex items-center justify-center">
          <Caption className="text-text-subtle">N/A</Caption>
        </div>
        <BodySmall className="text-text-muted text-center">Product not found</BodySmall>
        <Caption className="text-text-subtle">{barcode}</Caption>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 min-w-[140px]">
      {product.imageUrl ? (
        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-surface">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="64px"
            className="object-contain"
          />
        </div>
      ) : (
        <div className="w-16 h-16 rounded-lg bg-surface-raised flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" className="text-text-subtle" opacity="0.4"/>
          </svg>
        </div>
      )}
      <BodySmall className="text-center font-medium line-clamp-2">{product.name}</BodySmall>
      <Caption className="text-text-muted text-center">{product.brand}</Caption>
    </div>
  );
}

export function CompareTable({ products, barcodes }: CompareTableProps) {
  const validProducts = products.filter((p): p is Product => p !== null);

  if (validProducts.length < 2) {
    return (
      <Card variant="flat" padding="lg">
        <div className="text-center py-8 space-y-3">
          <Heading4>Not enough products to compare</Heading4>
          <Body className="text-text-muted">
            {validProducts.length === 0
              ? 'None of the selected products could be found. Please try different barcodes.'
              : 'Only one product was found. Select at least 2 products to compare them side by side.'}
          </Body>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Product headers */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full min-w-[480px] border-collapse" role="table" aria-label="Product comparison">
          <thead>
            <tr className="sticky top-14 z-10 bg-background">
              <th className="text-left p-3 align-top min-w-[120px] border-b border-border" scope="col">
                <Caption className="text-text-subtle uppercase tracking-wide">Metric</Caption>
              </th>
              {barcodes.map((barcode, i) => (
                <th key={barcode} className="p-3 align-top border-b border-border" scope="col">
                  <ProductHeader product={products[i]} barcode={barcode} />
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Nutri-Score */}
            <tr className="border-b border-border">
              <td className="p-3 align-middle">
                <Heading4 as="span" className="text-sm">Nutri-Score</Heading4>
              </td>
              {products.map((product, i) => (
                <td key={barcodes[i]} className="p-3 align-middle">
                  {product?.nutriScore ? (
                    <ScoreBadge
                      type="nutriscore"
                      value={product.nutriScore.grade}
                      label={product.nutriScore.label}
                      color={product.nutriScore.color}
                      bgColor={product.nutriScore.bgColor}
                    />
                  ) : (
                    <Caption className="text-text-subtle">N/A</Caption>
                  )}
                </td>
              ))}
            </tr>

            {/* NOVA Group */}
            <tr className="border-b border-border">
              <td className="p-3 align-middle">
                <Heading4 as="span" className="text-sm">NOVA Group</Heading4>
              </td>
              {products.map((product, i) => (
                <td key={barcodes[i]} className="p-3 align-middle">
                  {product?.novaGroup ? (
                    <ScoreBadge
                      type="nova"
                      value={product.novaGroup.group}
                      label={product.novaGroup.label}
                      color={product.novaGroup.color}
                      bgColor={product.novaGroup.bgColor}
                    />
                  ) : (
                    <Caption className="text-text-subtle">N/A</Caption>
                  )}
                </td>
              ))}
            </tr>

            {/* Ingredients / Additives */}
            <tr className="border-b border-border">
              <td className="p-3 align-middle">
                <Heading4 as="span" className="text-sm">Additives</Heading4>
              </td>
              {products.map((product, i) => (
                <td key={barcodes[i]} className="p-3 align-middle">
                  {product?.ingredientScore ? (
                    <ScoreBadge
                      type="ingredients"
                      value={product.ingredientScore.additiveCount}
                      label={product.ingredientScore.label}
                      color={product.ingredientScore.color}
                      bgColor={product.ingredientScore.bgColor}
                    />
                  ) : (
                    <Caption className="text-text-subtle">N/A</Caption>
                  )}
                </td>
              ))}
            </tr>

            {/* Allergens */}
            <tr className="border-b border-border">
              <td className="p-3 align-top">
                <Heading4 as="span" className="text-sm">Allergens</Heading4>
              </td>
              {products.map((product, i) => (
                <td key={barcodes[i]} className="p-3 align-top">
                  {product ? (
                    product.allergens.length > 0 || product.traces.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {product.allergens.map((a) => (
                          <AllergenBadge key={a.id} allergen={a} />
                        ))}
                        {product.traces.map((a) => (
                          <AllergenBadge key={`trace-${a.id}`} allergen={a} />
                        ))}
                      </div>
                    ) : (
                      <Caption className="text-success">None declared</Caption>
                    )
                  ) : (
                    <Caption className="text-text-subtle">N/A</Caption>
                  )}
                </td>
              ))}
            </tr>

            {/* Nutrient rows */}
            {NUTRIENT_KEYS.map(({ name, unit: fallbackUnit }, rowIdx) => {
              const nutrients = products.map((product) => {
                if (!product) return null;
                return findNutrient(product.nutrients, name) ?? null;
              });
              const values = nutrients.map((n) => n?.per100g ?? null);
              // Use unit from the first product that has this nutrient, fall back to hardcoded
              const unit = nutrients.find((n) => n?.unit)?.unit ?? fallbackUnit;

              const bestIdx = getBestIndex(values, LOWER_IS_BETTER.has(name));
              const isEven = rowIdx % 2 === 0;

              return (
                <tr key={name} className={`border-b border-border ${isEven ? 'bg-surface/50' : ''}`}>
                  <td className="p-3 align-middle">
                    <Body className="text-sm" as="span">{name}</Body>
                    <Caption className="text-text-subtle ml-1" as="span">per 100g</Caption>
                  </td>
                  {values.map((value, i) => (
                    <td
                      key={barcodes[i]}
                      className={`p-3 align-middle text-center transition-colors ${bestIdx === i ? 'bg-success-muted' : ''}`}
                    >
                      {value !== null ? (
                        <Mono className={bestIdx === i ? 'font-semibold' : ''}>{value}{unit}</Mono>
                      ) : (
                        <Caption className="text-text-subtle">--</Caption>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <Card variant="flat" padding="sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-success-muted border border-success/20" />
          <Caption className="text-text-muted">Best value in row</Caption>
        </div>
      </Card>
    </div>
  );
}
