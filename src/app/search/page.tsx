'use client';

import { Suspense, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Heading3 } from '@/components/atoms';
import { SearchBar } from '@/components/molecules';
import { SearchResults, CompareBar } from '@/components/organisms';
import { useDebounce } from '@/hooks/useDebounce';
import { useCompareList } from '@/hooks/useCompareList';
import type { SearchResultProduct } from '@/types/product';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(initialQuery);
  const debouncedQuery = useDebounce(searchInput, 300);
  const compareList = useCompareList();

  // Keep a map of barcode -> product info for CompareBar thumbnails
  const [productMap, setProductMap] = useState<Map<string, SearchResultProduct>>(new Map());

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    const params = new URLSearchParams();
    if (value) params.set('q', value);
    router.replace(`/search${value ? `?${params.toString()}` : ''}`, { scroll: false });
  }, [router]);

  const handleCompareToggle = useCallback((barcode: string) => {
    if (compareList.isInList(barcode)) {
      compareList.remove(barcode);
    } else {
      compareList.add(barcode);
    }
  }, [compareList]);

  // Collect product data for CompareBar thumbnails
  const handleProductsRendered = useCallback((products: SearchResultProduct[]) => {
    setProductMap((prev) => {
      const next = new Map(prev);
      let changed = false;
      for (const p of products) {
        if (!next.has(p.barcode)) {
          next.set(p.barcode, p);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, []);

  const compareProducts = compareList.barcodes
    .map((b) => productMap.get(b))
    .filter((p): p is SearchResultProduct => p !== undefined);

  return (
    <>
      {/* Top bar */}
      <div className="flex items-center gap-3 py-3 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          aria-label="Go back"
          iconLeft={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M11.25 13.5L6.75 9L11.25 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        >
          {null}
        </Button>
        <Heading3 as="h1">Search</Heading3>
      </div>

      {/* Search bar */}
      <div className="py-4">
        <SearchBar
          value={searchInput}
          onChange={handleSearchChange}
          autoFocus
          placeholder="Search for food products..."
        />
      </div>

      {/* Results — extra bottom padding when compare bar is visible */}
      <div className={compareList.barcodes.length >= 2 ? 'pb-20' : ''}>
        <SearchResults
          query={debouncedQuery}
          onCompareToggle={handleCompareToggle}
          compareBarcodes={compareList.barcodes}
          onProductsRendered={handleProductsRendered}
        />
      </div>

      {/* Compare bar */}
      <CompareBar
        barcodes={compareList.barcodes}
        products={compareProducts}
        onClear={compareList.clear}
        onRemove={compareList.remove}
      />
    </>
  );
}

export default function SearchPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 min-h-screen">
      <Suspense fallback={
        <div className="py-3 border-b border-border">
          <div className="w-20 h-5 bg-surface-raised animate-pulse rounded" />
        </div>
      }>
        <SearchContent />
      </Suspense>
    </main>
  );
}
