'use client';

import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils/cn';
import type { InputProps } from '@/types/design-system';

const sizeStyles: Record<string, string> = {
  md: 'h-10 px-3',
  lg: 'h-12 px-4',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      size = 'md',
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;
    const hasError = Boolean(error);

    return (
      <div className={cn('flex flex-col gap-[var(--spacing-1-5)]', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-text-muted"
          >
            {label}
          </label>
        )}
        {hint && !hasError && (
          <span id={hintId} className="text-xs text-text-subtle">
            {hint}
          </span>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle [&_svg]:size-[18px]">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? errorId : hint ? hintId : undefined
            }
            aria-required={props.required}
            className={cn(
              'w-full rounded-md border bg-background text-base text-text placeholder:text-text-subtle transition-all duration-150 shadow-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              hasError
                ? 'border-error focus-visible:border-error focus-visible:ring-error/20'
                : 'border-border focus-visible:border-border-focus focus-visible:ring-primary/20',
              sizeStyles[size],
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle [&_svg]:size-[18px]">
              {rightIcon}
            </span>
          )}
        </div>
        {hasError && (
          <span id={errorId} className="text-xs font-medium text-error" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
