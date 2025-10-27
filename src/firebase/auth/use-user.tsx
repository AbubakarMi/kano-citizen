
'use client';
import {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from 'react';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useFirebaseApp, useFirestore } from '../provider';
import { UserProfile, seededUsers } from '@/lib/data';

// 1. The shape of our user context
type UserContextType = {
  user: (FirebaseUser & { displayName: string | null }) | null;
  profile: UserProfile | null;
  loading: boolean;
  register: (
    email: string,
    password: string,
    fullName: string,
    location?: string
  ) => Promise<FirebaseUser>;
  login: (email: string, password: string) => Promise<FirebaseUser>;
  logout: () => Promise<void>;
};

// 2. Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// 3. Create the provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const app = useFirebaseApp();
  const firestore = useFirestore();
  const auth = app ? getAuth(app) : null;

  const [user, setUser] = useState<(FirebaseUser & { displayName: string | null }) | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Effect to listen for auth state changes from Firebase
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // User is signed in, fetch their profile from Firestore
        if (firestore) {
          const userRef = doc(firestore, 'users', firebaseUser.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            console.warn('User profile not found in Firestore for UID:', firebaseUser.uid);
            setProfile(null);
          }
        }
      } else {
        // Check for seeded user in session storage on page load
        const seededUserJson = sessionStorage.getItem('seeded-user');
        if (seededUserJson) {
            const seededUser = JSON.parse(seededUserJson);
            // This is a mock user object, adapt as needed
            setUser({ uid: seededUser.uid, displayName: seededUser.name, email: seededUser.email } as any); 
            setProfile(seededUser);
        } else {
            // User is signed out
            setUser(null);
            setProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  // Registration function for citizens
  const register = useCallback(
    async (email: string, password: string, fullName: string, location?: string) => {
      if (!auth || !firestore) {
        throw new Error('Firebase not initialized for registration.');
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;

      const userRef = doc(firestore, 'users', newUser.uid);
      const newUserProfile: UserProfile = {
        uid: newUser.uid,
        name: fullName,
        email: email,
        role: 'Citizen',
        location: location || '',
        createdAt: serverTimestamp(),
        submittedIdeas: [],
        votedOnIdeas: [],
        followedDirectives: [],
        volunteeredFor: [],
      };
      await setDoc(userRef, newUserProfile);
      return newUser;
    },
    [auth, firestore]
  );

  // Login function
  const login = useCallback(
    async (email: string, password: string) => {
      
      // Check if the user is a seeded admin user
      const seededUser = seededUsers.find(u => u.email === email);
      if (seededUser && seededUser.password === password) {
          // Mock login for seeded user
          const mockUser = { uid: seededUser.uid, displayName: seededUser.name, email: seededUser.email } as any;
          setUser(mockUser);
          setProfile(seededUser as UserProfile);
          sessionStorage.setItem('seeded-user', JSON.stringify(seededUser));
          return mockUser;
      }
      
      // Proceed with real Firebase auth for non-admin users
      if (!auth) {
        throw new Error('Firebase not initialized for login.');
      }
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      sessionStorage.removeItem('seeded-user'); // Clear any session-based mock user
      return userCredential.user;
    },
    [auth]
  );

  // Logout function
  const logout = useCallback(async () => {
    sessionStorage.removeItem('seeded-user');
    if (!auth) {
      // Still clear local state if auth is not available
      setUser(null);
      setProfile(null);
      return;
    }
    await signOut(auth);
  }, [auth]);

  const value = {
    user, 
    profile,
    loading,
    register,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
}

// 4. Custom hook to use the auth context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within an AuthProvider');
  }
  // Return a combined user object for convenience
  return {
    ...context,
    authedUser:
      context.user && context.profile
        ? {
            uid: context.user.uid,
            ...context.user,
            profile: context.profile,
          }
        : null,
  };
}
