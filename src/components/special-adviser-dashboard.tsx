
"use client";

import { useState } from "react";
import type { UserProfile, MDA, UserRole } from "@/lib/data";
import { mdas as initialMdas, seededUsers } from "@/lib/data";
import { useAppContext } from "@/app/app-provider";
import { Analytics } from "./system-admin/analytics";

interface SpecialAdviserDashboardProps {
  user: UserProfile;
  activeView: string;
}

const initialRoles: UserRole[] = [...new Set(seededUsers.map(u => u.role))];

export function SpecialAdviserDashboard({ user, activeView }: SpecialAdviserDashboardProps) {
  const { ideas } = useAppContext();
  const [mdas, setMdas] = useState<MDA[]>(initialMdas);
  const [roles, setRoles] = useState<UserRole[]>(initialRoles);

  const renderView = () => {
    switch (activeView) {
      case 'submissions':
        // Placeholder for Reviewed Submissions view
        return <div>Reviewed Submissions</div>;
      case 'drafting':
        // Placeholder for Directive Drafting view
        return <div>Directive Drafting</div>;
      case 'mda-monitor':
        // Placeholder for MDA Performance view
        return <div>MDA Performance Monitor</div>;
      case 'moderation':
        // Placeholder for Moderation Oversight view
        return <div>Moderation Oversight</div>;
      case 'analytics':
        return <Analytics />;
      default:
        return <div>Reviewed Submissions</div>;
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Special Adviser Command Center</h1>
      {renderView()}
    </div>
  );
}
