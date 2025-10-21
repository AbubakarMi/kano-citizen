
'use client';
import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import type { UserProfile } from '@/lib/data';
import { seededUsers, mdas } from '@/lib/data';

// Create a new context for our mock auth
type MockAuthContextType = {
  user: { uid: string; profile: UserProfile | null } | null;
  loading: boolean;
  login: (email: string) => void;
  logout: () => void;
};

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined);

// Create a provider for this context
export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ uid: string; profile: UserProfile | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On initial load, check if we have a mocked user in session storage
    const storedUserEmail = sessionStorage.getItem('mockUserEmail');
    if (storedUserEmail) {
      login(storedUserEmail);
    }
    setLoading(false);
  }, []);

  const login = (email: string) => {
    const foundUserSeed = seededUsers.find(u => u.email === email);
    if (foundUserSeed) {
      const uid = `mock-uid-${foundUserSeed.email}`;
      const profile: UserProfile = {
        uid: uid,
        name: foundUserSeed.name,
        email: foundUserSeed.email,
        role: foundUserSeed.role,
        mda: foundUserSeed.mda,
        location: foundUserSeed.location,
        submittedIdeas: ['idea-1'],
        votedOnIdeas: ['idea-2'],
        followedDirectives: ['dir-1'],
        volunteeredFor: [],
      };
      setUser({ uid, profile });
      sessionStorage.setItem('mockUserEmail', email);
    } else {
      // Default to citizen if email not found
      const uid = 'mock-uid-citizen';
      setUser({
        uid,
        profile: {
          uid,
          name: 'Mock Citizen',
          email: 'citizen@test.com',
          role: 'Citizen',
          location: 'Kano',
          submittedIdeas: [],
          votedOnIdeas: [],
          followedDirectives: [],
          volunteeredFor: [],
        },
      });
      sessionStorage.setItem('mockUserEmail', 'citizen@test.com');
    }
     setLoading(false);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('mockUserEmail');
    setLoading(false);
  };

  const value = { user, loading, login, logout };

  return <MockAuthContext.Provider value={value}>{children}</MockAuthContext.Provider>;
}

// The new useUser hook that components will use
export function useUser() {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a MockAuthProvider');
  }
  return context;
}
