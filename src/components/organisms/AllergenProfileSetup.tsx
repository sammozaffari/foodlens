'use client';

import { useState } from 'react';
import { Button, Card, Heading2, Body, BodySmall, Caption } from '@/components/atoms';
import { ALLERGENS } from '@/types/product';
import type { AllergenId } from '@/types/product';
import { useAllergenProfile } from '@/hooks/useAllergenProfile';

interface AllergenProfileSetupProps {
  /** Called after the user saves or skips */
  onComplete?: () => void;
  /** Show as edit mode (no skip, different heading) */
  editMode?: boolean;
  className?: string;
}

export function AllergenProfileSetup({ onComplete, editMode = false, className }: AllergenProfileSetupProps) {
  const { allergens: savedAllergens, setAllergens } = useAllergenProfile();
  const [selected, setSelected] = useState<AllergenId[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Sync local selection with saved profile once available from useSyncExternalStore
  if (!initialized && savedAllergens.length > 0) {
    setSelected(savedAllergens);
    setInitialized(true);
  }

  function toggle(id: AllergenId) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }

  function handleSave() {
    setAllergens(selected);
    onComplete?.();
  }

  function handleSkip() {
    onComplete?.();
  }

  return (
    <div className={className}>
      <div className="text-center mb-8">
        <Heading2>{editMode ? 'Edit Your Allergens' : 'Set Up Your Allergen Profile'}</Heading2>
        <Body className="text-text-muted mt-2 max-w-lg mx-auto">
          {editMode
            ? 'Update which allergens you need to avoid. Changes apply immediately to all product views.'
            : 'Select the allergens you need to avoid. Every product you view will instantly show whether it is safe for you.'}
        </Body>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
        {ALLERGENS.map((allergen) => {
          const isActive = selected.includes(allergen.id);
          return (
            <button
              key={allergen.id}
              type="button"
              role="checkbox"
              aria-checked={isActive}
              aria-label={`${allergen.label}${isActive ? ' — selected' : ''}`}
              onClick={() => toggle(allergen.id)}
              className={`
                rounded-lg border-2 p-3 text-center transition-colors duration-150 cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background
                ${isActive
                  ? 'border-error bg-error-muted text-error'
                  : 'border-border bg-surface text-text hover:border-text-subtle'}
              `}
            >
              <BodySmall className="font-semibold">{allergen.label}</BodySmall>
              {allergen.alternateNames.length > 0 && (
                <Caption className={`mt-0.5 block ${isActive ? 'text-error' : 'text-text-subtle'}`}>
                  {allergen.alternateNames.slice(0, 3).join(', ')}
                </Caption>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
        <Button onClick={handleSave} size="lg">
          {selected.length > 0
            ? `Save ${selected.length} Allergen${selected.length === 1 ? '' : 's'}`
            : 'Save Profile (No Allergens)'}
        </Button>
        {!editMode && (
          <Button variant="ghost" onClick={handleSkip} size="lg">
            Skip for now
          </Button>
        )}
      </div>

      {selected.length > 0 && (
        <Card variant="flat" padding="sm" className="mt-6 max-w-md mx-auto">
          <Caption className="text-text-muted">
            You will see alerts on products containing:{' '}
            <span className="text-error font-medium">
              {selected.map((id) => ALLERGENS.find((a) => a.id === id)?.label).filter(Boolean).join(', ')}
            </span>
          </Caption>
        </Card>
      )}
    </div>
  );
}
