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
import { seededUsers, ideas as allIdeas } from "@/lib/data";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Skeleton } from "@/components/ui/skeleton";


// This is a temporary solution to handle user state without real auth
const FAKE_USER_SESSION_KEY = 'fake_user_session';

const RoleBasedDashboard = ({ user, t }: { user: User, t: Translation }) => {
    const ideas = t.ideas;
    const directives = t.directives;
    const volunteerOpportunities = t.volunteerOpportunities;
    
  switch (user.role) {
    case "Citizen":
      return <CitizenDashboard user={user} t={t.dashboard} ideas={ideas} directives={directives} volunteerOpportunities={volunteerOpportunities} />;
    case "MDA Official":
      return <MDAOfficialDashboard user={user} />;
    case "Moderator":
      return <ModeratorDashboard user={user} />;
    case "SPD Coordinator":
      return <SPDScoordinatorDashboard user={user} />;
    case "System Administrator":
      return <SystemAdminDashboard user={user} />;
    case "Super Admin":
      return <SuperAdminDashboard user={user} ideas={ideas} />;
    default:
      // Fallback to citizen dashboard for any unhandled roles
      return <CitizenDashboard user={user} t={t.dashboard} ideas={ideas} directives={directives} volunteerOpportunities={volunteerOpportunities} />;
  }
};

const DashboardLoading = () => (
    <div className="flex h-[calc(100vh-80px)]">
      <aside className="hidden lg:block w-[240px] border-r p-4">
        <div className="flex flex-col gap-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
        </div>
      </aside>
      <div className="flex-1 p-8">
        <Skeleton className="h-12 w-1/3 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-8" />
        <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
);


export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true); // Start in loading state
  const router = useRouter();

  useEffect(() => {
    try {
      const session = localStorage.getItem(FAKE_USER_SESSION_KEY);
      if (session) {
        const loggedInUser = JSON.parse(session);
         // Find user in seeded list to get correct role
        const seededUser = seededUsers.find(u => u.email.toLowerCase() === loggedInUser.email.toLowerCase());
        
        loggedInUser.role = seededUser ? seededUser.role : 'Citizen';
        setUser(loggedInUser);
      }
    } catch (error) {
      console.error("Failed to parse user session", error);
      localStorage.removeItem(FAKE_USER_SESSION_KEY);
    } finally {
      setIsLoading(false); // Stop loading after checking session
    }
  }, []);


  const handleLogout = async () => {
    localStorage.removeItem(FAKE_USER_SESSION_KEY);
    setUser(null);
    router.push('/');
  };
  
  const t = translations[language];

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader
        user={user}
        onLogout={handleLogout}
        language={language}
        setLanguage={setLanguage}
        t={t.header}
      />
      <main className="flex-1">
        {isLoading ? (
            <DashboardLoading />
        ) : user ? (
          <div className="flex">
            <aside className="hidden lg:block fixed top-20 h-[calc(100vh-80px)] w-[240px] border-r">
               <div className="p-4">
                 <DashboardSidebar user={user} />
               </div>
            </aside>
            <div className="lg:pl-[240px] flex-1">
              <div className="p-4 sm:p-6 lg:p-8">
                <RoleBasedDashboard user={user} t={t} />
              </div>
            </div>
          </div>
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
