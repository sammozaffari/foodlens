'use client';

import { useState } from 'react';
import { Card, Button, Heading4, Caption, Body } from '@/components/atoms';
import { NutrientRow } from '@/components/molecules';
import type { Nutrient } from '@/types/product';

interface NutritionPanelProps {
  nutrients: Nutrient[];
  servingSize: string | null;
  className?: string;
}

const SUB_NUTRIENTS = new Set(['Saturated fat', 'Sugars']);

export function NutritionPanel({ nutrients, servingSize, className }: NutritionPanelProps) {
  const [view, setView] = useState<'serving' | '100g'>('100g');

  if (nutrients.length === 0) {
    return (
      <Card variant="flat" className={className}>
        <Body className="text-text-subtle">Nutrition data not available.</Body>
      </Card>
    );
  }

  return (
    <Card variant="flat" className={className}>
      <div className="flex items-center justify-between border-b border-border-strong pb-2 mb-2">
        <div>
          <Heading4>Nutrition</Heading4>
          {servingSize && (
            <Caption className="text-text-muted">Serving size: {servingSize}</Caption>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            variant={view === 'serving' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setView('serving')}
            aria-pressed={view === 'serving'}
          >
            Per serve
          </Button>
          <Button
            variant={view === '100g' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setView('100g')}
            aria-pressed={view === '100g'}
          >
            Per 100g
          </Button>
        </div>
      </div>

      <table className="w-full" aria-label="Nutrition information">
        <thead>
          <tr className="text-left">
            <th scope="col" className="py-1">
              <Caption className="text-text-muted uppercase">Nutrient</Caption>
            </th>
            <th scope="col" className="py-1 text-right w-20">
              <Caption className="text-text-muted uppercase">Per serve</Caption>
            </th>
            <th scope="col" className="py-1 text-right w-20">
              <Caption className="text-text-muted uppercase">Per 100g</Caption>
            </th>
            <th scope="col" className="py-1 text-right w-10">
              <Caption className="text-text-muted uppercase">Unit</Caption>
            </th>
          </tr>
        </thead>
        <tbody>
          {nutrients.map((nutrient) => (
            <NutrientRow
              key={nutrient.name}
              name={nutrient.name}
              per100g={nutrient.per100g}
              perServing={nutrient.perServing}
              unit={nutrient.unit}
              dailyPercent={nutrient.dailyPercent}
              isSubRow={SUB_NUTRIENTS.has(nutrient.name)}
            />
          ))}
        </tbody>
      </table>
    </Card>
  );
}
