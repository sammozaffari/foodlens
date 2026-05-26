'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BodySmall, Caption, Card } from '@/components/atoms';
import { CompareButton } from './CompareButton';
import type { SearchResultProduct } from '@/types/product';
import { getNutriScoreColor, getNutriScoreBgColor } from '@/types/product';

interface SearchResultRowProps {
  product: SearchResultProduct;
  className?: string;
  onCompareToggle?: (barcode: string) => void;
  isCompared?: boolean;
}

function PlaceholderImage() {
  return (
    <div className="w-full aspect-square rounded-md bg-surface-raised flex items-center justify-center">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" className="text-text-subtle" opacity="0.3"/>
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" className="text-text-subtle" opacity="0.3"/>
        <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-subtle" opacity="0.3"/>
      </svg>
    </div>
  );
}

export function SearchResultRow({ product, className, onCompareToggle, isCompared }: SearchResultRowProps) {
  const [imageError, setImageError] = useState(false);
  const showImage = product.imageSmallUrl && !imageError;

  return (
    <Link
      href={`/product/${product.barcode}`}
      aria-label={`${product.name} by ${product.brand}`}
      className={`block h-full ${className || ''}`}
    >
      <Card
        variant="flat"
        padding="sm"
        className="flex flex-col h-full hover:border-primary hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 cursor-pointer focus-ring"
      >
        {/* Product image — full width at top */}
        <div className="w-full aspect-square rounded-md overflow-hidden bg-surface-raised mb-3">
          {showImage ? (
            <Image
              src={product.imageSmallUrl!}
              alt={product.name}
              width={200}
              height={200}
              className="w-full h-full object-contain p-2"
              onError={() => setImageError(true)}
            />
          ) : (
            <PlaceholderImage />
          )}
        </div>

        {/* Product info */}
        <div className="flex-1 min-w-0">
          <BodySmall className="font-medium leading-snug line-clamp-2">
            {product.name}
          </BodySmall>
          <Caption className="text-text-muted mt-0.5 truncate block">
            {product.brand}
          </Caption>
        </div>

        {/* Bottom row: badges + compare */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
          <div className="flex gap-1.5">
            {product.nutriScoreGrade && (
              <span
                className={`inline-flex items-center justify-center w-6 h-6 rounded text-[10px] font-bold ${getNutriScoreBgColor(product.nutriScoreGrade)} ${getNutriScoreColor(product.nutriScoreGrade)}`}
                title={`Nutri-Score ${product.nutriScoreGrade.toUpperCase()}`}
              >
                {product.nutriScoreGrade.toUpperCase()}
              </span>
            )}
            {product.novaGroup && (
              <span
                className={`inline-flex items-center justify-center w-6 h-6 rounded text-[10px] font-bold ${
                  product.novaGroup <= 2 ? 'bg-success-muted text-success' :
                  product.novaGroup === 3 ? 'bg-warning-muted text-warning' :
                  'bg-error-muted text-error'
                }`}
                title={`NOVA ${product.novaGroup}`}
              >
                {product.novaGroup}
              </span>
            )}
          </div>
          {onCompareToggle && (
            <CompareButton
              barcode={product.barcode}
              isSelected={isCompared ?? false}
              onToggle={onCompareToggle}
            />
          )}
        </div>
      </Card>
    </Link>
  );
}
