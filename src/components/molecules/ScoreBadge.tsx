import { Card } from '@/components/atoms';
import { Caption, MonoLarge } from '@/components/atoms';

interface ScoreBadgeProps {
  type: 'nutriscore' | 'nova' | 'ingredients' | 'hsr';
  value: string | number | null;
  label: string;
  color: string;
  bgColor: string;
  className?: string;
}

const typeLabels: Record<string, string> = {
  nutriscore: 'Nutrition',
  nova: 'Processing',
  ingredients: 'Ingredients',
  hsr: 'Health Stars',
};

export function ScoreBadge({
  type,
  value,
  label,
  color,
  bgColor,
  className,
}: ScoreBadgeProps) {
  const displayValue = value !== null ? String(value).toUpperCase() : 'N/A';
  const displayLabel = value !== null ? label : 'No data';
  const colorClass = value !== null ? color : 'text-text-subtle';
  const bgClass = value !== null ? bgColor : '';

  const ariaLabel = value !== null
    ? `${typeLabels[type]} score: ${displayValue}, ${displayLabel}`
    : `${typeLabels[type]} score: No data`;

  return (
    <Card
      variant="flat"
      padding="sm"
      className={`flex flex-col items-center gap-1 min-w-[80px] ${bgClass} ${className || ''}`}
    >
      <div role="img" aria-label={ariaLabel} className="flex flex-col items-center gap-1">
        <MonoLarge className={colorClass}>{displayValue}</MonoLarge>
        <Caption className="text-text-muted">{typeLabels[type]}</Caption>
        <Caption className={colorClass}>{displayLabel}</Caption>
      </div>
    </Card>
  );
}
