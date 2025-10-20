
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

const RoleBasedDashboard = ({ user, t, activeView, setActiveView }: { user: User, t: Translation, activeView: string, setActiveView: (view: string) => void }) => {
    const ideas = t.ideas;
    const directives = t.directives;
    const volunteerOpportunities = t.volunteerOpportunities;

  const dashboardContent = () => {
      switch (user.role) {
        case "Citizen":
          return <CitizenDashboard user={user} t={t.dashboard} ideas={ideas} directives={directives} volunteerOpportunities={volunteerOpportunities} activeView={activeView} setActiveView={setActiveView} />;
        case "MDA Official":
          return <MDAOfficialDashboard user={user} />;
        case "Moderator":
          return <ModeratorDashboard user={user} />;
        case "SPD Coordinator":
          return <SPDScoordinatorDashboard user={user} />;
        case "System Administrator":
          return <SystemAdminDashboard user={user} activeView={activeView} />;
        case "Super Admin":
          return <SuperAdminDashboard user={user} ideas={ideas} activeView={activeView} />;
        default:
          return <CitizenDashboard user={user} t={t.dashboard} ideas={ideas} directives={directives} volunteerOpportunities={volunteerOpportunities} activeView={activeView} setActiveView={setActiveView} />;
      }
  }

  return (
      <div className="flex">
        <aside className="fixed left-0 top-20 h-full w-[240px] border-r hidden lg:block">
            <DashboardSidebar user={user} activeView={activeView} setActiveView={setActiveView} />
        </aside>
        <div className="flex-1 lg:ml-[240px] p-6 lg:p-8">
            {dashboardContent()}
        </div>
      </div>
  )
};

const DashboardLoading = () => (
    <div className="flex h-screen">
      <div className="hidden lg:block w-[240px] border-r p-4">
        <div className="flex flex-col gap-2 mt-20">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
        </div>
      </div>
      <div className="flex-1 p-8 mt-20">
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
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    // This effect runs only once on the client after initial mount.
    if (typeof window !== 'undefined') {
        try {
            const session = localStorage.getItem(FAKE_USER_SESSION_KEY);
            if (session) {
                const loggedInUser = JSON.parse(session);
                // Find user in seeded list to get correct role
                const seededUser = seededUsers.find(u => u.email.toLowerCase() === loggedInUser.email.toLowerCase());
                
                if (seededUser) {
                    loggedInUser.role = seededUser.role;
                    loggedInUser.mda = seededUser.mda;
                } else {
                    loggedInUser.role = loggedInUser.role || 'Citizen';
                }
                setUser(loggedInUser);
                
                // Set default view based on role
                switch(loggedInUser.role) {
                    case 'Citizen':
                        setActiveView('decide');
                        break;
                    case 'MDA Official':
                        setActiveView('directives');
                        break;
                    case 'Moderator':
                        setActiveView('queue');
                        break;
                    case 'SPD Coordinator':
                        setActiveView('events');
                        break;
                    case 'System Administrator':
                        setActiveView('health');
                        break;
                    default:
                        setActiveView('overview');
                }
            }
        } catch (error) {
            console.error("Failed to parse user session", error);
            localStorage.removeItem(FAKE_USER_SESSION_KEY);
        } finally {
            // Stop loading only after the session check is complete.
            setIsLoading(false); 
        }
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem(FAKE_USER_SESSION_KEY);
    setUser(null);
    setActiveView('overview'); // Reset view on logout
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
        activeView={activeView}
        setActiveView={setActiveView}
      />
      <main className="flex-1 pt-20">
        {isLoading ? (
            <DashboardLoading />
        ) : user ? (
          <RoleBasedDashboard user={user} t={t} activeView={activeView} setActiveView={setActiveView} />
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
