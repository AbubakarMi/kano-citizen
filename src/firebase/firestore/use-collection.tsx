
'use client';
import { useState, useEffect } from 'react';
import {
  onSnapshot,
  type Query,
  type DocumentData,
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

interface UseCollectionOptions<T> {
  // You can add options like 'listen' to disable real-time updates
  // listen?: boolean;
  initialData?: T[];
}

export function useCollection<T extends DocumentData>(
  query: Query<T> | null,
  options?: UseCollectionOptions<T>
) {
  const [data, setData] = useState<T[] | null>(options?.initialData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setData(null);
      setLoading(false);
      return;
    }
    
    setLoading(true);

    const unsubscribe = onSnapshot(
      query,
      (querySnapshot) => {
        const result: T[] = [];
        querySnapshot.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id } as T);
        });
        setData(result);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("onSnapshot error in useCollection:", err);
        const permissionError = new FirestorePermissionError({
          path: query.path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]); // The effect re-runs if the query object changes.

  return { data, loading, error };
}
