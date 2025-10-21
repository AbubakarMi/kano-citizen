
'use client';
import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

/**
 * A client component that listens for globally emitted 'permission-error'
 * events and throws them, which Next.js will catch and display in the
 * development overlay. This is for development-time debugging of security
 * rules ONLY.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const handler = (error: Error) => {
      // Throw the error so the Next.js development overlay can catch it.
      // This is far more visible than a console.error.
      throw error;
    };

    errorEmitter.on('permission-error', handler);

    return () => {
      errorEmitter.off('permission-error', handler);
    };
  }, []);

  return null; // This component doesn't render anything.
}
