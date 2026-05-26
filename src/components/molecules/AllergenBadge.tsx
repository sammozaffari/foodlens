import { Badge } from '@/components/atoms';
import type { Allergen } from '@/types/product';

interface AllergenBadgeProps {
  allergen: Allergen;
  className?: string;
}

export function AllergenBadge({ allergen, className }: AllergenBadgeProps) {
  const isDeclared = allergen.type === 'declared';
  const variant = isDeclared ? 'error' : 'warning';
  const ariaLabel = isDeclared ? `Contains ${allergen.name}` : `May contain ${allergen.name}`;

  return (
    <Badge
      variant={variant}
      className={className}
    >
      <span role="status" aria-label={ariaLabel}>
        {isDeclared ? (
          <strong>{allergen.name}</strong>
        ) : (
          <>May contain: <strong>{allergen.name}</strong></>
        )}
      </span>
    </Badge>
  );
}
