
'use client';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
// Auth is no longer needed for initialization in the mock setup
// import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// Export hooks and providers
export { FirebaseProvider, useFirebase, useFirebaseApp, useAuth, useFirestore } from './provider';
export { FirebaseClientProvider } from './client-provider';
// useUser is now exported from its own file which includes the mock provider
// export { useUser } from './auth/use-user';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';

let app: FirebaseApp;
// let auth: Auth;
let firestore: Firestore;

export function initializeFirebase(): {
  app: FirebaseApp;
  auth: null; // Return null for auth in mock setup
  firestore: Firestore;
} {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  // auth = getAuth(app);
  firestore = getFirestore(app);
  
  return { app, auth: null, firestore };
}
