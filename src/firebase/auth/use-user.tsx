
'use client';
import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import type { UserProfile, UserRole } from '@/lib/data';
import { seededUsers } from '@/lib/data';

// Create a new context for our mock auth
type MockAuthContextType = {
  user: { uid: string; profile: UserProfile | null } | null;
  loading: boolean;
  login: (email: string, role: UserRole, name: string, mda?: string) => void;
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
      const foundUser = seededUsers.find(u => u.email === storedUserEmail);
      if(foundUser) {
        login(storedUserEmail, foundUser.role, foundUser.name, foundUser.mda);
      }
    }
    setLoading(false);
  }, []);

  const login = (email: string, role: UserRole, name: string, mda?: string) => {
    const uid = `mock-uid-${email}`;
    const profile: UserProfile = {
      uid,
      name,
      email,
      role,
      mda,
      location: 'Kano',
      submittedIdeas: ['idea-1'],
      votedOnIdeas: ['idea-2'],
      followedDirectives: ['dir-1'],
      volunteeredFor: [],
    };
    setUser({ uid, profile });
    sessionStorage.setItem('mockUserEmail', email);
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
