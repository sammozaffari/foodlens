import { cn } from '@/lib/utils/cn';
import type { BadgeProps } from '@/types/design-system';

const variantStyles: Record<string, string> = {
  default: 'bg-surface-raised text-text',
  success: 'bg-success-muted text-success',
  warning: 'bg-warning-muted text-warning',
  error: 'bg-error-muted text-error',
  info: 'bg-info-muted text-info',
};

const sizeStyles: Record<string, string> = {
  sm: 'h-5 px-1.5 text-xs',
  md: 'h-6 px-2 text-sm',
};

export function Badge({
  variant = 'default',
  size = 'md',
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
