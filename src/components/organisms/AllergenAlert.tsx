'use client';

import { Card, BodySmall } from '@/components/atoms';
import { useAllergenProfile } from '@/hooks/useAllergenProfile';
import type { Product } from '@/types/product';
import { ALLERGENS } from '@/types/product';

interface AllergenAlertProps {
  product: Product;
  className?: string;
}

function allergenIdToLabel(id: string): string {
  return ALLERGENS.find((a) => a.id === id)?.label ?? id;
}

export function AllergenAlert({ product, className }: AllergenAlertProps) {
  const { allergens: userAllergens, hasProfile } = useAllergenProfile();

  if (!hasProfile || userAllergens.length === 0) return null;

  const declaredMatches = product.allergens
    .filter((a) => userAllergens.includes(a.id))
    .map((a) => allergenIdToLabel(a.id));

  const traceMatches = product.traces
    .filter((a) => userAllergens.includes(a.id))
    .map((a) => allergenIdToLabel(a.id));

  const hasDeclared = declaredMatches.length > 0;
  const hasTraces = traceMatches.length > 0;

  if (hasDeclared) {
    return (
      <Card
        variant="flat"
        padding="sm"
        className={`border-2 border-error bg-error-muted ${className ?? ''}`}
      >
        <div role="alert" aria-live="assertive">
          <BodySmall className="text-error font-semibold">
            &#9888; Contains allergens you avoid: {declaredMatches.join(', ')}
          </BodySmall>
          {hasTraces && (
            <BodySmall className="text-warning mt-1">
              Also may contain traces of: {traceMatches.join(', ')}
            </BodySmall>
          )}
        </div>
      </Card>
    );
  }

  if (hasTraces) {
    return (
      <Card
        variant="flat"
        padding="sm"
        className={`border-2 border-warning bg-warning-muted ${className ?? ''}`}
      >
        <div role="alert" aria-live="polite">
          <BodySmall className="text-warning font-semibold">
            &#9888; May contain traces of: {traceMatches.join(', ')}
          </BodySmall>
        </div>
      </Card>
    );
  }

  return (
    <Card
      variant="flat"
      padding="sm"
      className={`border-2 border-success bg-success-muted ${className ?? ''}`}
    >
      <div role="status" aria-live="polite">
        <BodySmall className="text-success font-semibold">
          &#10003; Safe for your allergen profile
        </BodySmall>
      </div>
    </Card>
  );
}
