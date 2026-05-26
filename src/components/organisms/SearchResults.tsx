'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Body, BodySmall, Button, Heading3 } from '@/components/atoms';
import { Card } from '@/components/atoms';
import { SearchResultRow } from '@/components/molecules';
import type { SearchResultProduct, SearchApiResponse } from '@/types/product';

interface SearchResultsProps {
  query: string;
  className?: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

interface SearchState {
  status: Status;
  products: SearchResultProduct[];
  hasMore: boolean;
  totalResults: number;
  page: number;
  error: string | null;
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-3 border-b border-border">
      <div className="w-12 h-12 rounded-md bg-surface-raised animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="w-3/4 h-4 bg-surface-raised animate-pulse rounded" />
        <div className="w-1/2 h-3 bg-surface-raised animate-pulse rounded" />
      </div>
    </div>
  );
}

const initialState: SearchState = {
  status: 'idle',
  products: [],
  hasMore: false,
  totalResults: 0,
  page: 1,
  error: null,
};

export function SearchResults({ query, className }: SearchResultsProps) {
  const [state, setState] = useState<SearchState>(initialState);
  const [loadingMore, setLoadingMore] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Fetch when query changes
  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setState(initialState);
      return;
    }

    // Abort previous request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({ ...prev, status: 'loading', products: [], error: null }));

    fetch(`/api/search?q=${encodeURIComponent(trimmed)}&page=1`, {
      signal: controller.signal,
      cache: 'no-store',
    })
      .then((res) => res.json())
      .then((data: SearchApiResponse) => {
        if (controller.signal.aborted) return;
        if (data.status === 'ok' && data.data) {
          setState({
            status: 'success',
            products: data.data.products,
            hasMore: data.data.hasMore,
            totalResults: data.data.totalResults,
            page: 1,
            error: null,
          });
        } else {
          setState((prev) => ({
            ...prev,
            status: 'error',
            error: data.error || 'Something went wrong.',
          }));
        }
      })
      .catch((err) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: 'Unable to reach food database.',
        }));
      });

    return () => controller.abort();
  }, [query]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    const nextPage = state.page + 1;

    fetch(`/api/search?q=${encodeURIComponent(query)}&page=${nextPage}`)
      .then((res) => res.json())
      .then((data: SearchApiResponse) => {
        if (data.status === 'ok' && data.data) {
          setState((prev) => ({
            ...prev,
            products: [...prev.products, ...data.data!.products],
            hasMore: data.data!.hasMore,
            totalResults: data.data!.totalResults,
            page: nextPage,
          }));
        }
      })
      .finally(() => setLoadingMore(false));
  };

  const handleRetry = () => {
    // Re-trigger the useEffect by toggling a state
    setState(initialState);
    // The useEffect will re-run because state changed back to idle,
    // but query hasn't changed. Force it by setting status and letting effect run.
    setTimeout(() => {
      setState((prev) => ({ ...prev, status: 'loading' }));
      fetch(`/api/search?q=${encodeURIComponent(query)}&page=1`)
        .then((res) => res.json())
        .then((data: SearchApiResponse) => {
          if (data.status === 'ok' && data.data) {
            setState({
              status: 'success',
              products: data.data.products,
              hasMore: data.data.hasMore,
              totalResults: data.data.totalResults,
              page: 1,
              error: null,
            });
          } else {
            setState((prev) => ({
              ...prev,
              status: 'error',
              error: data.error || 'Something went wrong.',
            }));
          }
        })
        .catch(() => {
          setState((prev) => ({
            ...prev,
            status: 'error',
            error: 'Unable to reach food database.',
          }));
        });
    }, 0);
  };

  // Idle state
  if (!query.trim() || state.status === 'idle') {
    return (
      <div className={`text-center py-12 ${className || ''}`}>
        <Body className="text-text-muted">Search for a product by name or brand.</Body>
      </div>
    );
  }

  // Loading state
  if (state.status === 'loading') {
    return (
      <div className={className} aria-busy="true" aria-label="Loading results">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    );
  }

  // Error state
  if (state.status === 'error') {
    return (
      <div className={className} role="alert">
        <Card variant="flat" className="text-center py-8 border-error">
          <Body className="text-text-muted">{state.error}</Body>
          <Button className="mt-4" onClick={handleRetry}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  // Empty results
  if (state.products.length === 0) {
    return (
      <div className={`text-center py-12 ${className || ''}`} role="status">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4 text-text-subtle" aria-hidden="true">
          <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2.5"/>
          <path d="M30 30L42 42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M15 20H25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <Heading3>No products found</Heading3>
        <Body className="text-text-muted mt-2">Try a different search term or scan the barcode.</Body>
        <Link href="/scan">
          <Button variant="secondary" className="mt-4">Scan a Barcode</Button>
        </Link>
      </div>
    );
  }

  // Results
  return (
    <div className={className}>
      <div aria-live="polite" className="sr-only">
        {state.totalResults} products found
      </div>
      <div role="list" aria-label="Search results" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {state.products.map((product) => (
          <div key={product.barcode} role="listitem">
            <SearchResultRow product={product} />
          </div>
        ))}
      </div>
      {state.hasMore && (
        <div className="py-4 text-center">
          <Button
            variant="secondary"
            onClick={handleLoadMore}
            loading={loadingMore}
            aria-label="Load more results"
          >
            Load more
          </Button>
        </div>
      )}
      <BodySmall className="text-center text-text-subtle py-2">
        {state.totalResults} results
      </BodySmall>
    </div>
  );
}
