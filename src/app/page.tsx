
"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import type { UserProfile, Idea, Directive, VolunteerOpportunity } from "@/lib/data";

import { SiteHeader } from "@/components/site-header";
import { LandingPage } from "@/components/landing-page";
import { CitizenDashboard } from "@/components/citizen-dashboard";
import { MDAOfficialDashboard } from "@/components/mda-official-dashboard";
import { ModeratorDashboard } from "@/components/moderator-dashboard";
import { SPDScoordinatorDashboard } from "@/components/spd-coordinator-dashboard";
import { SystemAdminDashboard } from "@/components/system-admin-dashboard";
import { SuperAdminDashboard } from "@/components/super-admin-dashboard";
import { translations, type Language, type Translation } from "@/lib/translations";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { AppProvider, useAppContext } from "@/app/app-provider";

const RoleBasedDashboard = ({ user, t }: { user: UserProfile, t: Translation }) => {
    const { 
        activeView, 
        setActiveView, 
        isSidebarCollapsed, 
        setSidebarCollapsed, 
        ideas, 
        directives, 
        volunteerOpportunities 
    } = useAppContext();

    const isSuperAdmin = user.role === 'Super Admin';

    const dashboardContent = () => {
      switch (user.role) {
        case "Citizen":
          return <CitizenDashboard t={t.dashboard} />;
        case "MDA Official":
          return <MDAOfficialDashboard user={user} />;
        case "Moderator":
          return <ModeratorDashboard user={user} />;
        case "SPD Coordinator":
          return <SPDScoordinatorDashboard user={user} />;
        case "System Administrator":
          return <SystemAdminDashboard user={user} activeView={activeView} />;
        case "Super Admin":
          return <SuperAdminDashboard user={user} activeView={activeView} />;
        default:
          return <CitizenDashboard t={t.dashboard} />;
      }
    }

    return (
        <div className="flex">
            <aside 
            className={cn(
                "fixed left-0 top-0 h-full z-30 pt-20 border-r hidden lg:block bg-card transition-all duration-300",
                isSuperAdmin ? '' : 'bg-primary',
                isSuperAdmin && !isSidebarCollapsed && "w-[240px]",
                isSuperAdmin && isSidebarCollapsed && "w-[72px]",
                !isSuperAdmin && "w-[240px]"
            )}
            >
                <DashboardSidebar 
                    user={user} 
                    isCollapsed={isSidebarCollapsed}
                    setIsCollapsed={setSidebarCollapsed}
                />
            </aside>
            <main className={cn(
            "flex-1 pt-20 transition-all duration-300",
            isSuperAdmin && !isSidebarCollapsed && "lg:ml-[240px]",
            isSuperAdmin && isSidebarCollapsed && "lg:ml-[72px]",
            !isSuperAdmin && "lg:ml-[240px]"
            )}>
                <div className={cn(
                    "p-6 lg:p-8",
                )}>
                    {dashboardContent()}
                </div>
            </main>
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

function HomePageContent() {
  const { user, loading: userLoading } = useUser();
  const [language, setLanguage] = useState<Language>('en');
  const { activeView, setActiveView, isSidebarCollapsed } = useAppContext();
  
  const t = translations[language];

  if (userLoading) {
    return <DashboardLoading />;
  }

  return (
    <div className="flex flex-col min-h-screen">
       <SiteHeader
        user={user}
        language={language}
        setLanguage={setLanguage}
        t={t.header}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      <main className="flex-1">
        {user ? (
          <RoleBasedDashboard user={user.profile!} t={t} />
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

export default function Home() {
    return (
        <AppProvider>
            <HomePageContent />
        </AppProvider>
    )
}
