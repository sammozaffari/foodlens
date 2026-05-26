'use client';

import Link from 'next/link';
import { Button, Card, Heading3, BodySmall } from '@/components/atoms';
import { useAllergenProfile } from '@/hooks/useAllergenProfile';

export function AllergenProfileCTA() {
  const { hasProfile } = useAllergenProfile();

  if (hasProfile) return null;

  return (
    <section className="py-8">
      <div className="max-w-5xl mx-auto px-6">
        <Card variant="flat" padding="lg" className="border-2 border-primary text-center">
          <Heading3>Set up your allergen profile</Heading3>
          <BodySmall className="text-text-muted mt-2 max-w-md mx-auto">
            Select the allergens you avoid and every product will instantly
            show whether it is safe for you. Takes 10 seconds.
          </BodySmall>
          <div className="mt-4">
            <Link href="/profile">
              <Button size="md">Set Up Profile</Button>
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}
