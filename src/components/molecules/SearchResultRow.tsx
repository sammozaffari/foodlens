'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Body, BodySmall, Card } from '@/components/atoms';
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
    <div className="w-14 h-14 rounded-md bg-surface-raised flex items-center justify-center flex-shrink-0">
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
      className={`block ${className || ''}`}
    >
      <Card
        variant="flat"
        padding="sm"
        className="flex items-center gap-3 hover:border-primary hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 cursor-pointer h-full focus-ring"
      >
        {showImage ? (
          <Image
            src={product.imageSmallUrl!}
            alt={product.name}
            width={56}
            height={56}
            className="w-14 h-14 rounded-md object-cover flex-shrink-0 bg-surface-raised"
            onError={() => setImageError(true)}
          />
        ) : (
          <PlaceholderImage />
        )}
        <div className="flex-1 min-w-0">
          <Body className="truncate text-sm font-medium" as="span">{product.name}</Body>
          <BodySmall className="text-text-muted truncate block" as="span">{product.brand}</BodySmall>
        </div>
        {product.nutriScoreGrade && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${getNutriScoreBgColor(product.nutriScoreGrade)} ${getNutriScoreColor(product.nutriScoreGrade)}`}>
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
      </Card>
    </Link>
  );
}
