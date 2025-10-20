"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import type { User } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { LandingPage } from "@/components/landing-page";
import { Dashboard } from "@/components/dashboard";
import { onAuthStateChanged, User as FirebaseUser, signOut } from "firebase/auth";
import { auth } from "@/firebase/config";

export default function Home() {
  const [user, setUser] = useState<User | null>(null); // This would be your app's user type
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        // In a real app, you would fetch your application-specific user profile
        // from Firestore using the user.uid
        const appUser: User = {
          name: user.displayName || "Kano Citizen",
          email: user.email!,
          // These are examples and would be fetched from your database
          submittedIdeas: ["idea-1"],
          votedOnIdeas: ["idea-2", "idea-3"],
          followedDirectives: ["dir-1"],
          volunteeredFor: [],
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);


  const handleLogout = async () => {
    try {
      await signOut(auth);
      // This will trigger the onAuthStateChanged listener, which will update the state
      router.push('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <SiteHeader
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-1">
        {user ? (
          <Dashboard user={user} />
        ) : (
          <LandingPage />
        )}
      </main>
    </div>
  );
}
