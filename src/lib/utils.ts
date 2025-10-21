import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type DocumentReference, type Query } from 'firebase/firestore';
import { useMemo } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useMemoFirebase<T extends DocumentReference | Query | null>(
  factory: () => T,
  deps: React.DependencyList
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo<T>(factory, deps);
}
