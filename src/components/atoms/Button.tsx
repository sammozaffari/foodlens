'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import type { ButtonProps } from '@/types/design-system';

const variantStyles: Record<string, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover active:bg-primary-active disabled:bg-disabled disabled:text-disabled-text',
  secondary:
    'bg-transparent text-primary border border-primary hover:bg-primary-muted active:bg-primary active:text-white disabled:bg-disabled disabled:text-disabled-text disabled:border-disabled',
  ghost:
    'bg-transparent text-text hover:bg-surface-raised active:bg-surface disabled:bg-transparent disabled:text-disabled-text',
};

const sizeStyles: Record<string, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-base gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
};

const iconSizes: Record<string, string> = {
  sm: '[&_svg]:size-4',
  md: '[&_svg]:size-[18px]',
  lg: '[&_svg]:size-5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      iconLeft,
      iconRight,
      fullWidth = false,
      disabled,
      children,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        className={cn(
          'inline-flex items-center justify-center font-semibold rounded-md transition-colors duration-150 cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          iconSizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading && (
          <span className="animate-spin size-4 border-2 border-current border-t-transparent rounded-full" aria-hidden="true" />
        )}
        {!loading && iconLeft}
        {children != null && <span>{children}</span>}
        {!loading && iconRight}
        {loading && <span className="sr-only">Loading</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
