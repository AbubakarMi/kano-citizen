
'use client';
import { useState, useEffect } from 'react';
import {
  onSnapshot,
  type DocumentReference,
  type DocumentData,
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';


interface UseDocOptions<T> {
  initialData?: T;
}

export function useDoc<T extends DocumentData>(
  docRef: DocumentReference<T> | null,
  options?: UseDocOptions<T>
) {
  const [data, setData] = useState<T | null>(options?.initialData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docRef) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setData({ ...docSnapshot.data(), id: docSnapshot.id } as T);
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("onSnapshot error in useDoc:", err);
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [docRef]); // The effect re-runs if the docRef object changes.

  return { data, loading, error };
}
