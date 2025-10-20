"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import type { User, UserRole } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { LandingPage } from "@/components/landing-page";
import { CitizenDashboard } from "@/components/citizen-dashboard";
import { MDAOfficialDashboard } from "@/components/mda-official-dashboard";
import { ModeratorDashboard } from "@/components/moderator-dashboard";
import { SPDScoordinatorDashboard } from "@/components/spd-coordinator-dashboard";
import { SystemAdminDashboard } from "@/components/system-admin-dashboard";
import { SuperAdminDashboard } from "@/components/super-admin-dashboard";
import { onAuthStateChanged, User as FirebaseUser, signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { translations, type Language, type Translation } from "@/lib/translations";
import { seededUsers } from "@/lib/data";

const RoleBasedDashboard = ({ user, t }: { user: User, t: Translation }) => {
  switch (user.role) {
    case "Citizen":
      return <CitizenDashboard user={user} t={t.dashboard} ideas={t.ideas} directives={t.directives} volunteerOpportunities={t.volunteerOpportunities} />;
    case "MDA Official":
      return <MDAOfficialDashboard user={user} />;
    case "Moderator":
      return <ModeratorDashboard user={user} />;
    case "SPD Coordinator":
      return <SPDScoordinatorDashboard user={user} />;
    case "System Administrator":
      return <SystemAdminDashboard user={user} />;
    case "Super Admin":
      return <SuperAdminDashboard user={user} />;
    default:
      // Fallback to citizen dashboard for any unhandled roles
      return <CitizenDashboard user={user} t={t.dashboard} ideas={t.ideas} directives={t.directives} volunteerOpportunities={t.volunteerOpportunities} />;
  }
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      if (firebaseUser) {
        // Check if the logged-in user is one of the seeded admins
        const seededUser = seededUsers.find(u => u.email === firebaseUser.email);
        const role = seededUser ? seededUser.role : "Citizen";
        
        const appUser: User = {
          name: firebaseUser.displayName || seededUser?.name || "Kano Citizen",
          email: firebaseUser.email!,
          role: role,
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
          <RoleBasedDashboard user={user} t={t} />
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
