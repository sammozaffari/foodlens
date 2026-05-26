'use client';

import { useState } from 'react';
import { Card, Button, Heading4, Caption, Body, Mono } from '@/components/atoms';
import type { Nutrient } from '@/types/product';

interface NutritionPanelProps {
  nutrients: Nutrient[];
  servingSize: string | null;
  className?: string;
}

const SUB_NUTRIENTS = new Set(['Saturated fat', 'Sugars']);

function formatValue(value: number | null): string {
  if (value === null) return '—';
  if (value < 0.1 && value > 0) return '<0.1';
  return value.toFixed(1);
}

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
      <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
        <div>
          <Heading4>Nutrition Facts</Heading4>
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

      <div className="divide-y divide-border" role="table" aria-label="Nutrition information">
        {nutrients.map((nutrient) => {
          const isIndented = SUB_NUTRIENTS.has(nutrient.name);
          const displayValue = view === '100g' ? nutrient.per100g : nutrient.perServing;

          return (
            <div
              key={nutrient.name}
              role="row"
              className="flex items-center justify-between py-2"
            >
              <span
                role="cell"
                className={`text-sm ${isIndented ? 'pl-4 text-text-muted' : 'font-medium text-text'}`}
              >
                {nutrient.name}
              </span>
              <div role="cell" className="flex items-center gap-2">
                <Mono className="text-sm">
                  {formatValue(displayValue)}
                </Mono>
                <Caption className="text-text-muted w-8 text-right">{nutrient.unit}</Caption>
                {nutrient.dailyPercent !== null && (
                  <Caption className="text-text-subtle w-10 text-right">
                    {nutrient.dailyPercent}%
                  </Caption>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {view === 'serving' && !servingSize && (
        <Caption className="text-text-subtle mt-2 block">
          Serving size not specified by manufacturer. Values may be approximate.
        </Caption>
      )}
    </Card>
  );
}
