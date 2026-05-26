import { cn } from '@/lib/utils/cn';
import type { TypographyProps } from '@/types/design-system';

export function Display({ children, className, as: Tag = 'h1' }: TypographyProps) {
  return (
    <Tag className={cn('font-[family-name:var(--font-display)] text-[2.5rem] leading-[1.1] font-bold tracking-[-0.02em] text-wrap-pretty', className)}>
      {children}
    </Tag>
  );
}

export function Heading1({ children, className, as: Tag = 'h1' }: TypographyProps) {
  return (
    <Tag className={cn('font-[family-name:var(--font-display)] text-[2rem] leading-[1.2] font-bold tracking-[-0.015em] text-wrap-pretty', className)}>
      {children}
    </Tag>
  );
}

export function Heading2({ children, className, as: Tag = 'h2' }: TypographyProps) {
  return (
    <Tag className={cn('font-[family-name:var(--font-display)] text-[1.5rem] leading-[1.25] font-semibold tracking-[-0.01em] text-wrap-pretty', className)}>
      {children}
    </Tag>
  );
}

export function Heading3({ children, className, as: Tag = 'h3' }: TypographyProps) {
  return (
    <Tag className={cn('font-[family-name:var(--font-display)] text-[1.25rem] leading-[1.3] font-semibold tracking-[-0.005em] text-wrap-pretty', className)}>
      {children}
    </Tag>
  );
}

export function Heading4({ children, className, as: Tag = 'h4' }: TypographyProps) {
  return (
    <Tag className={cn('font-[family-name:var(--font-display)] text-[1.125rem] leading-[1.4] font-semibold tracking-[0] text-wrap-pretty', className)}>
      {children}
    </Tag>
  );
}

export function Body({ children, className, as: Tag = 'p' }: TypographyProps) {
  return (
    <Tag className={cn('font-[family-name:var(--font-body)] text-base leading-[1.5] font-normal', className)}>
      {children}
    </Tag>
  );
}

export function BodySmall({ children, className, as: Tag = 'p' }: TypographyProps) {
  return (
    <Tag className={cn('font-[family-name:var(--font-body)] text-sm leading-[1.5] font-normal', className)}>
      {children}
    </Tag>
  );
}

export function Caption({ children, className, as: Tag = 'span' }: TypographyProps) {
  return (
    <Tag className={cn('font-[family-name:var(--font-body)] text-xs leading-[1.4] font-medium tracking-[0.01em]', className)}>
      {children}
    </Tag>
  );
}

export function Mono({ children, className, as: Tag = 'span' }: TypographyProps) {
  return (
    <Tag className={cn('font-[family-name:var(--font-mono)] text-sm leading-[1.5] font-medium tabular-nums', className)}>
      {children}
    </Tag>
  );
}

export function MonoLarge({ children, className, as: Tag = 'span' }: TypographyProps) {
  return (
    <Tag className={cn('font-[family-name:var(--font-mono)] text-[1.25rem] leading-[1.3] font-semibold tracking-[-0.01em] tabular-nums', className)}>
      {children}
    </Tag>
  );
}
