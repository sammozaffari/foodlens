'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge, Card, Heading3, Body, BodySmall, Caption, Mono } from '@/components/atoms';
import { useAllergenProfile } from '@/hooks/useAllergenProfile';
import type { Alternative } from '@/lib/alternatives';

interface AlternativesSectionProps {
  barcode: string;
  className?: string;
}

function SkeletonCard() {
  return (
    <div className="min-w-[180px] w-[180px] flex-shrink-0">
      <Card variant="flat" padding="sm" className="h-full">
        <div className="w-full aspect-square rounded bg-surface-raised skeleton-pulse mb-2" />
        <div className="w-3/4 h-3 bg-surface-raised skeleton-pulse rounded mb-1" />
        <div className="w-1/2 h-3 bg-surface-raised skeleton-pulse rounded mb-2" />
        <div className="w-full h-5 bg-surface-raised skeleton-pulse rounded" />
      </Card>
    </div>
  );
}

export function AlternativesSection({ barcode, className }: AlternativesSectionProps) {
  const { allergens } = useAllergenProfile();
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    const allergenParam = allergens.length > 0 ? `?allergens=${allergens.join(',')}` : '';

    fetch(`/api/alternatives/${barcode}${allergenParam}`, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then((data) => {
        setAlternatives(data.alternatives || []);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [barcode, allergens]);

  if (error) return null;

  if (loading) {
    return (
      <div className={className}>
        <Heading3>Healthier Alternatives</Heading3>
        <div className="flex gap-3 mt-3 overflow-x-auto pb-2">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (alternatives.length === 0) return null;

  return (
    <div className={className}>
      <Heading3>Healthier Alternatives</Heading3>
      {allergens.length > 0 && (
        <Caption className="text-text-muted mt-1 block">
          Filtered for your allergen profile
        </Caption>
      )}

      <div className="flex gap-3 mt-3 overflow-x-auto pb-2 -mx-1 px-1">
        {alternatives.map((alt) => (
          <Link
            key={alt.product.barcode}
            href={`/product/${alt.product.barcode}`}
            className="min-w-[180px] w-[180px] flex-shrink-0 block"
          >
            <Card
              variant="flat"
              padding="sm"
              className="h-full hover:border-primary hover:shadow-sm transition-all duration-200 cursor-pointer"
            >
              {/* Image */}
              <div className="w-full aspect-square rounded bg-surface-raised mb-2 overflow-hidden relative">
                {alt.product.imageSmallUrl ? (
                  <Image
                    src={alt.product.imageSmallUrl}
                    alt={alt.product.name}
                    fill
                    className="object-contain p-2"
                    sizes="180px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Caption className="text-text-subtle">No image</Caption>
                  </div>
                )}
              </div>

              {/* Name + brand */}
              <BodySmall className="font-medium leading-snug line-clamp-2">
                {alt.product.name}
              </BodySmall>
              <Caption className="text-text-muted truncate block mt-0.5">
                {alt.product.brand}
              </Caption>

              {/* Price */}
              {alt.product.price != null && (
                <Mono className="text-sm font-semibold mt-1 block">
                  ${alt.product.price.toFixed(2)}
                  {alt.product.size ? ` · ${alt.product.size}` : ''}
                </Mono>
              )}

              {/* Improvement badges */}
              <div className="flex flex-wrap gap-1 mt-2">
                {alt.reasons.map((reason, i) => (
                  <Badge key={i} variant="success" size="sm">
                    {reason.split('(')[0].trim()}
                  </Badge>
                ))}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
