'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BodySmall } from '@/components/atoms';

const NAV_ITEMS = [
  {
    href: '/',
    label: 'Home',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: '/search',
    label: 'Search',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
  {
    href: '/scan',
    label: 'Scan',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
        <line x1="7" y1="12" x2="17" y2="12" />
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
] as const;

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-all duration-200 ${
        scrolled
          ? 'border-border bg-background/80 backdrop-blur-md shadow-sm'
          : 'border-border bg-background'
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
        {/* Brand mark */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="FoodLens home">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center transition-transform duration-150 group-hover:scale-105">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
              <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="1" fill="white"/>
            </svg>
          </div>
          <span className="font-[family-name:var(--font-display)] font-bold text-text text-lg tracking-tight">
            FoodLens
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors duration-150 ${
                  isActive
                    ? 'text-primary bg-primary-muted font-medium'
                    : 'text-text-muted hover:text-text hover:bg-surface-raised'
                }`}
              >
                {item.icon}
                <BodySmall className={isActive ? 'font-medium' : ''}>{item.label}</BodySmall>
              </Link>
            );
          })}
        </div>

        {/* Mobile nav */}
        <div className="flex sm:hidden items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-center w-10 h-10 rounded-md transition-colors duration-150 ${
                  isActive
                    ? 'text-primary bg-primary-muted'
                    : 'text-text-muted hover:text-text hover:bg-surface-raised'
                }`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.icon}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
