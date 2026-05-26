import { cn } from '@/lib/utils/cn';
import type { CardProps } from '@/types/design-system';

const variantStyles: Record<string, string> = {
  flat: 'bg-surface border border-border shadow-none',
  elevated: 'bg-background border-none shadow-md',
};

const paddingStyles: Record<string, string> = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({
  variant = 'flat',
  padding = 'md',
  children,
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg',
        variantStyles[variant],
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
