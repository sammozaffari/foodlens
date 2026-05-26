'use client';

import Link from 'next/link';
import { Button, Heading2, Heading3, Body, BodySmall, Card, Caption } from '@/components/atoms';
import { AllergenProfileSetup } from '@/components/organisms/AllergenProfileSetup';
import { useAllergenProfile } from '@/hooks/useAllergenProfile';
import { ALLERGENS } from '@/types/product';
import { useState } from 'react';

export default function ProfilePage() {
  const { allergens, hasProfile, clearProfile } = useAllergenProfile();
  const [editing, setEditing] = useState(false);

  return (
    <main className="max-w-4xl mx-auto px-6 pb-8 min-h-screen">
      {/* Top bar */}
      <div className="flex items-center gap-3 py-3 border-b border-border">
        <Link href="/" className="text-text-muted hover:text-text transition-colors" aria-label="Back to home">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <Heading3 as="h1">Allergen Profile</Heading3>
      </div>

      <div className="pt-8 animate-fade-in-up">
        {!hasProfile || editing ? (
          <AllergenProfileSetup
            editMode={editing}
            onComplete={() => setEditing(false)}
          />
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <Heading2>Your Allergen Profile</Heading2>
              <Body className="text-text-muted mt-2">
                Products you view will show alerts for these allergens.
              </Body>
            </div>

            {allergens.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-3 animate-stagger">
                {allergens.map((id) => {
                  const info = ALLERGENS.find((a) => a.id === id);
                  return (
                    <div
                      key={id}
                      className="px-4 py-2.5 rounded-lg border-2 border-error bg-error-muted transition-transform duration-150 hover:scale-105"
                    >
                      <BodySmall className="text-error font-semibold">{info?.label ?? id}</BodySmall>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Card variant="flat" padding="lg" className="text-center">
                <BodySmall className="text-text-muted">
                  You have no allergens set. All products will show as safe.
                </BodySmall>
              </Card>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button onClick={() => setEditing(true)} variant="secondary">
                Edit Allergens
              </Button>
              <Button onClick={clearProfile} variant="ghost">
                Clear Profile
              </Button>
            </div>

            <Card variant="flat" padding="sm" className="max-w-md mx-auto">
              <Caption className="text-text-subtle">
                Your allergen profile is stored locally on this device.
                No data is sent to any server.
              </Caption>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
