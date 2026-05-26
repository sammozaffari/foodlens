import Link from 'next/link';
import { Button, Display, Body, Caption } from '@/components/atoms';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="text-center space-y-6 max-w-lg w-full">
        <Display>FoodLens</Display>
        <Body className="text-text-muted">See what&apos;s really in your food.</Body>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/scan">
            <Button size="lg" iconLeft={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="13" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="2" y="13" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="13" y="13" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="10" y1="2" x2="10" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            }>
              Scan a Barcode
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="secondary" size="lg" iconLeft={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            }>
              Search by Name
            </Button>
          </Link>
        </div>

        <Caption className="text-text-subtle">Powered by Open Food Facts</Caption>
      </div>
    </main>
  );
}
