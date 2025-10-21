
'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot, type DocumentData } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';
import type { UserProfile } from '@/lib/data';

// Define a type for the user state which includes the profile
type UserState = {
  loading: boolean;
  user: {
    uid: string;
    profile: UserProfile | null;
  } | null;
};

export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [userState, setUserState] = useState<UserState>({
    loading: true,
    user: null,
  });

  useEffect(() => {
    if (!auth) {
      setUserState({ loading: false, user: null });
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (authUser: User | null) => {
      if (authUser && firestore) {
        const userDocRef = doc(firestore, 'users', authUser.uid);
        const unsubscribeSnapshot = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            setUserState({
              loading: false,
              user: {
                uid: authUser.uid,
                profile: snapshot.data() as UserProfile,
              },
            });
          } else {
            // Handle case where user exists in Auth but not in Firestore
             setUserState({
              loading: false,
              user: {
                uid: authUser.uid,
                profile: null, // Or a default profile
              },
            });
          }
        }, (error) => {
           console.error("Error fetching user profile:", error);
           setUserState({ loading: false, user: null });
        });

        // Return the snapshot listener's unsubscribe function
        return () => unsubscribeSnapshot();

      } else {
        // No user is authenticated
        setUserState({ loading: false, user: null });
      }
    });

    // Return the auth listener's unsubscribe function
    return () => unsubscribeAuth();
  }, [auth, firestore]);

  return userState;
}
