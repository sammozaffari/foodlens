'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BodySmall } from '@/components/atoms';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/search', label: 'Search' },
  { href: '/scan', label: 'Scan' },
  { href: '/profile', label: 'Profile' },
] as const;

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-background" aria-label="Main navigation">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-12">
        <Link href="/" className="font-[family-name:var(--font-heading)] font-bold text-text">
          FoodLens
        </Link>
        <div className="flex items-center gap-6">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors ${
                  isActive
                    ? 'text-primary font-medium'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                <BodySmall>{item.label}</BodySmall>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
