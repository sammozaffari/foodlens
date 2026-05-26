import { Mono, Caption } from '@/components/atoms';

interface NutrientRowProps {
  name: string;
  per100g: number | null;
  perServing: number | null;
  unit: string;
  dailyPercent: number | null;
  isSubRow?: boolean;
  className?: string;
}

function formatValue(value: number | null, unit: string): string {
  if (value === null) return '--';
  if (unit === 'kJ') return Math.round(value).toLocaleString();
  return value % 1 === 0 ? String(value) : value.toFixed(1);
}

export function NutrientRow({
  name,
  per100g,
  perServing,
  unit,
  dailyPercent,
  isSubRow = false,
  className,
}: NutrientRowProps) {
  const perServingDisplay = formatValue(perServing, unit);
  const per100gDisplay = formatValue(per100g, unit);
  const ariaLabel = `${name}: ${perServing !== null ? `${perServingDisplay} ${unit} per serving` : 'no data per serving'}, ${per100g !== null ? `${per100gDisplay} ${unit} per 100 grams` : 'no data per 100 grams'}`;

  return (
    <tr className={`border-b border-border last:border-b-0 ${className || ''}`} aria-label={ariaLabel}>
      <th scope="row" className={`py-2 text-left font-normal ${isSubRow ? 'pl-4' : ''}`}>
        <span className="font-[family-name:var(--font-body)] text-sm leading-[1.5]">{name}</span>
      </th>
      <td className="py-2 text-right w-20">
        <Mono className={perServing === null ? 'text-text-subtle' : ''}>
          {perServingDisplay}
        </Mono>
        {dailyPercent !== null && (
          <Caption className="text-text-muted ml-1">({dailyPercent}%)</Caption>
        )}
      </td>
      <td className="py-2 text-right w-20">
        <Mono className={per100g === null ? 'text-text-subtle' : ''}>
          {per100gDisplay}
        </Mono>
      </td>
      <td className="py-2 text-right w-10">
        <Caption className="text-text-muted">{unit}</Caption>
      </td>
    </tr>
  );
}
