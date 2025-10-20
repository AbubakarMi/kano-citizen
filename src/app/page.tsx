"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import type { User, UserRole } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { LandingPage } from "@/components/landing-page";
import { Dashboard } from "@/components/dashboard";
import { onAuthStateChanged, User as FirebaseUser, signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { translations, type Language, type Translation } from "@/lib/translations";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        // In a real app, you would fetch your application-specific user profile
        // from Firestore using the user.uid to get their role and other data.
        // For now, we are simulating the user role.
        const appUser: User = {
          name: user.displayName || "Kano Citizen",
          email: user.email!,
          // You can manually change this to test different roles:
          // "Citizen", "MDA Official", "Moderator", "System Administrator", etc.
          role: "Super Admin", 
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
  
  const t = translations[language];

  return (
    <div className="flex-1 flex flex-col">
      <SiteHeader
        user={user}
        onLogout={handleLogout}
        language={language}
        setLanguage={setLanguage}
        t={t.header}
      />
      <main className="flex-1">
        {user ? (
          <Dashboard user={user} t={t.dashboard} ideas={t.ideas} directives={t.directives} volunteerOpportunities={t.volunteerOpportunities} />
        ) : (
          <LandingPage 
            language={language} 
            t={t.landing} 
            complaintStrings={t.complaint}
            ideas={t.ideas}
            directives={t.directives}
            volunteerOpportunities={t.volunteerOpportunities}
            testimonials={t.testimonials}
            faqs={t.faqs}
          />
        )}
      </main>
    </div>
  );
}
