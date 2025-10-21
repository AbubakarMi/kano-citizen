
'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { FirebaseClientProvider } from './client-provider';

// Define the context shape
interface FirebaseContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

// Create the context
const FirebaseContext = createContext<FirebaseContextValue>({
  app: null,
  auth: null,
  firestore: null,
});

// Define the provider props
interface FirebaseProviderProps {
  children: ReactNode;
  app?: FirebaseApp;
  auth?: Auth;
  firestore?: Firestore;
}

/**
 * Provides the Firebase app, auth, and firestore instances to the component tree.
 * If instances are not passed as props, it will render a client-side provider
 * that initializes them.
 */
export function FirebaseProvider({
  children,
  app,
  auth,
  firestore,
}: FirebaseProviderProps) {
  // If instances are provided, use them. Otherwise, use the client provider.
  if (app && firestore) {
     // auth is optional now with mock
    return (
      <FirebaseContext.Provider value={{ app, auth, firestore }}>
        {children}
      </FirebaseContext.Provider>
    );
  }

  // This will initialize Firebase on the client side
  return <FirebaseClientProvider>{children}</FirebaseClientProvider>;
}

// Custom hooks to access the Firebase instances
export const useFirebase = () => useContext(FirebaseContext);

export const useFirebaseApp = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebaseApp must be used within a FirebaseProvider');
  }
  return context.app;
};

// useAuth is no longer used for user state, but can be kept for other auth operations if needed later
export const useAuth = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context.auth;
};

export const useFirestore = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }
  return context.firestore;
};
