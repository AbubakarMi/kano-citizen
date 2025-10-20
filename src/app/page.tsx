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
import { translations, type Language, type Translation } from "@/lib/translations";
import { seededUsers } from "@/lib/data";

// This is a temporary solution to handle user state without real auth
const FAKE_USER_SESSION_KEY = 'fake_user_session';

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
  const [language, setLanguage] = useState<Language>('en');
  const router = useRouter();

  useEffect(() => {
    // Check for a fake session on component mount
    try {
      const session = localStorage.getItem(FAKE_USER_SESSION_KEY);
      if (session) {
        const loggedInUser = JSON.parse(session);
        setUser(loggedInUser);
      }
    } catch (error) {
      console.error("Failed to parse user session", error);
      localStorage.removeItem(FAKE_USER_SESSION_KEY);
    }
  }, []);


  const handleLogout = async () => {
    // Clear the fake session
    localStorage.removeItem(FAKE_USER_SESSION_KEY);
    setUser(null);
    router.push('/');
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
