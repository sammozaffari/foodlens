'use client';

import { useCallback, useSyncExternalStore } from 'react';
import type { AllergenId } from '@/types/product';

const STORAGE_KEY = 'foodlens-allergen-profile';

export interface AllergenProfile {
  allergens: AllergenId[];
  setAllergens: (allergens: AllergenId[]) => void;
  toggleAllergen: (id: AllergenId) => void;
  clearProfile: () => void;
  hasProfile: boolean;
}

type StoredProfile = { allergens: AllergenId[]; exists: boolean };

const emptySnapshot: StoredProfile = { allergens: [], exists: false };

let cachedSnapshot: StoredProfile | null = null;

function getSnapshot(): StoredProfile {
  if (cachedSnapshot) return cachedSnapshot;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      cachedSnapshot = emptySnapshot;
      return emptySnapshot;
    }
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      cachedSnapshot = { allergens: parsed as AllergenId[], exists: true };
      return cachedSnapshot;
    }
    cachedSnapshot = emptySnapshot;
    return emptySnapshot;
  } catch {
    cachedSnapshot = emptySnapshot;
    return emptySnapshot;
  }
}

function getServerSnapshot(): StoredProfile {
  return emptySnapshot;
}

const listeners = new Set<() => void>();

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notify() {
  cachedSnapshot = null; // invalidate cache so getSnapshot re-reads
  for (const listener of listeners) {
    listener();
  }
}

function writeToStorage(allergens: AllergenId[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allergens));
  notify();
}

function removeFromStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
  notify();
}

export function useAllergenProfile(): AllergenProfile {
  const { allergens, exists: hasProfile } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setAllergens = useCallback((newAllergens: AllergenId[]) => {
    writeToStorage(newAllergens);
  }, []);

  const toggleAllergen = useCallback((id: AllergenId) => {
    const current = getSnapshot().allergens;
    const next = current.includes(id)
      ? current.filter((a) => a !== id)
      : [...current, id];
    writeToStorage(next);
  }, []);

  const clearProfile = useCallback(() => {
    removeFromStorage();
  }, []);

  return { allergens, setAllergens, toggleAllergen, clearProfile, hasProfile };
}
