'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Body, BodySmall } from '@/components/atoms';
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
    <div className="w-12 h-12 rounded-md bg-surface-raised flex items-center justify-center flex-shrink-0">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z" fill="currentColor" className="text-text-subtle" opacity="0.4"/>
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
      className={`flex items-center gap-3 p-3 border-b border-border hover:bg-surface transition-colors focus-ring ${className || ''}`}
    >
      {showImage ? (
        <Image
          src={product.imageSmallUrl!}
          alt={product.name}
          width={48}
          height={48}
          className="w-12 h-12 rounded-md object-cover flex-shrink-0"
          onError={() => setImageError(true)}
        />
      ) : (
        <PlaceholderImage />
      )}
      <div className="flex-1 min-w-0">
        <Body className="truncate" as="span">{product.name}</Body>
        <BodySmall className="text-text-muted truncate" as="span">{product.brand}</BodySmall>
      </div>
      {product.nutriScoreGrade && (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getNutriScoreBgColor(product.nutriScoreGrade)} ${getNutriScoreColor(product.nutriScoreGrade)}`}>
          {product.nutriScoreGrade.toUpperCase()}
        </div>
      )}
      {onCompareToggle && (
        <CompareButton
          barcode={product.barcode}
          isSelected={isCompared ?? false}
          onToggle={onCompareToggle}
        />
      )}
    </Link>
  );
}
