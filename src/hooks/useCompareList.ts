'use client';

import { useState, useCallback, useMemo } from 'react';

const MAX_COMPARE = 3;

export interface CompareList {
  barcodes: string[];
  add: (barcode: string) => void;
  remove: (barcode: string) => void;
  clear: () => void;
  isFull: boolean;
  isInList: (barcode: string) => boolean;
}

export function useCompareList(): CompareList {
  const [barcodes, setBarcodes] = useState<string[]>([]);

  const add = useCallback((barcode: string) => {
    setBarcodes((prev) => {
      if (prev.includes(barcode) || prev.length >= MAX_COMPARE) return prev;
      return [...prev, barcode];
    });
  }, []);

  const remove = useCallback((barcode: string) => {
    setBarcodes((prev) => prev.filter((b) => b !== barcode));
  }, []);

  const clear = useCallback(() => {
    setBarcodes([]);
  }, []);

  const isFull = barcodes.length >= MAX_COMPARE;

  const isInList = useCallback(
    (barcode: string) => barcodes.includes(barcode),
    [barcodes]
  );

  return useMemo(
    () => ({ barcodes, add, remove, clear, isFull, isInList }),
    [barcodes, add, remove, clear, isFull, isInList]
  );
}
