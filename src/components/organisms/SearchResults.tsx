'use client';

import { useReducer, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Body, BodySmall, Button, Heading3 } from '@/components/atoms';
import { Card } from '@/components/atoms';
import { SearchResultRow } from '@/components/molecules';
import type { SearchResultProduct, SearchApiResponse } from '@/types/product';

interface SearchResultsProps {
  query: string;
  className?: string;
  onCompareToggle?: (barcode: string) => void;
  compareBarcodes?: string[];
  onProductsRendered?: (products: SearchResultProduct[]) => void;
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

type SearchAction =
  | { type: 'reset' }
  | { type: 'loading' }
  | { type: 'success'; products: SearchResultProduct[]; hasMore: boolean; totalResults: number; page: number }
  | { type: 'append'; products: SearchResultProduct[]; hasMore: boolean; totalResults: number; page: number }
  | { type: 'error'; error: string }
  | { type: 'loadingMore'; loading: boolean };

function SkeletonRow() {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-surface p-3">
      {/* Square image placeholder */}
      <div className="w-full aspect-square rounded-md bg-surface-raised skeleton-pulse mb-3" />
      {/* Text lines */}
      <div className="space-y-2">
        <div className="w-3/4 h-4 bg-surface-raised skeleton-pulse rounded" />
        <div className="w-1/2 h-3 bg-surface-raised skeleton-pulse rounded" />
      </div>
      {/* Bottom row placeholder */}
      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border">
        <div className="w-6 h-6 rounded bg-surface-raised skeleton-pulse" />
        <div className="w-6 h-6 rounded bg-surface-raised skeleton-pulse" />
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

function reducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'reset':
      return initialState;
    case 'loading':
      return { ...state, status: 'loading', products: [], error: null };
    case 'success':
      return {
        status: 'success',
        products: action.products,
        hasMore: action.hasMore,
        totalResults: action.totalResults,
        page: action.page,
        error: null,
      };
    case 'append':
      return {
        ...state,
        products: [...state.products, ...action.products],
        hasMore: action.hasMore,
        totalResults: action.totalResults,
        page: action.page,
      };
    case 'error':
      return { ...state, status: 'error', error: action.error };
    default:
      return state;
  }
}

export function SearchResults({ query, className, onCompareToggle, compareBarcodes, onProductsRendered }: SearchResultsProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loadingMore, setLoadingMore] = useReducer((_: boolean, v: boolean) => v, false);
  const abortRef = useRef<AbortController | null>(null);
  const onProductsRenderedRef = useRef(onProductsRendered);
  useEffect(() => {
    onProductsRenderedRef.current = onProductsRendered;
  });

  const fetchPage = useCallback((q: string, page: number, signal?: AbortSignal) => {
    return fetch(`/api/search?q=${encodeURIComponent(q)}&page=${page}`, {
      signal,
      cache: 'no-store',
    }).then((res) => res.json() as Promise<SearchApiResponse>);
  }, []);

  // Fetch when query changes
  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      dispatch({ type: 'reset' });
      return;
    }

    // Abort previous request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    dispatch({ type: 'loading' });

    fetchPage(trimmed, 1, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        if (data.status === 'ok' && data.data) {
          dispatch({
            type: 'success',
            products: data.data.products,
            hasMore: data.data.hasMore,
            totalResults: data.data.totalResults,
            page: 1,
          });
          onProductsRenderedRef.current?.(data.data.products);
        } else {
          dispatch({ type: 'error', error: data.error || 'Something went wrong.' });
        }
      })
      .catch((err) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        dispatch({ type: 'error', error: 'Unable to reach food database.' });
      });

    return () => controller.abort();
  }, [query, fetchPage]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    const nextPage = state.page + 1;

    fetchPage(query, nextPage)
      .then((data) => {
        if (data.status === 'ok' && data.data) {
          dispatch({
            type: 'append',
            products: data.data.products,
            hasMore: data.data.hasMore,
            totalResults: data.data.totalResults,
            page: nextPage,
          });
          onProductsRenderedRef.current?.(data.data.products);
        }
      })
      .finally(() => setLoadingMore(false));
  };

  const handleRetry = () => {
    dispatch({ type: 'loading' });
    fetchPage(query, 1)
      .then((data) => {
        if (data.status === 'ok' && data.data) {
          dispatch({
            type: 'success',
            products: data.data.products,
            hasMore: data.data.hasMore,
            totalResults: data.data.totalResults,
            page: 1,
          });
          onProductsRenderedRef.current?.(data.data.products);
        } else {
          dispatch({ type: 'error', error: data.error || 'Something went wrong.' });
        }
      })
      .catch(() => {
        dispatch({ type: 'error', error: 'Unable to reach food database.' });
      });
  };

  // Idle state
  if (!query.trim() || state.status === 'idle') {
    return (
      <div className={`text-center py-16 animate-fade-in ${className || ''}`}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-text-subtle" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <Body className="text-text-muted">Search for a product by name or brand.</Body>
      </div>
    );
  }

  // Loading state
  if (state.status === 'loading') {
    return (
      <div className={className} aria-busy="true" aria-label="Loading results">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (state.status === 'error') {
    return (
      <div className={`animate-fade-in ${className || ''}`} role="alert">
        <Card variant="flat" className="text-center py-10 border-error">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-error" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
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
      <div className={`text-center py-16 animate-fade-in ${className || ''}`} role="status">
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
      <div role="list" aria-label="Search results" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-stagger">
        {state.products.map((product) => (
          <div key={product.barcode} role="listitem">
            <SearchResultRow
              product={product}
              onCompareToggle={onCompareToggle}
              isCompared={compareBarcodes?.includes(product.barcode)}
            />
          </div>
        ))}
      </div>
      {state.hasMore && (
        <div className="py-6 text-center">
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
