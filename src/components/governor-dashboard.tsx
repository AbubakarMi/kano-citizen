
"use client";

import { useState } from "react";
import type { UserProfile, MDA, UserRole } from "@/lib/data";
import { mdas as initialMdas, seededUsers } from "@/lib/data";
import { ApprovalQueue } from "./super-admin/approval-queue";
import { SystemLogs } from "./system-admin/system-logs";
import { useAppContext } from "@/app/app-provider";
import { ExecutiveDashboard } from "./super-admin/executive-dashboard";

interface GovernorDashboardProps {
  user: UserProfile;
  activeView: string;
}

export function GovernorDashboard({ user, activeView }: GovernorDashboardProps) {
  const { ideas } = useAppContext();
  const [mdas] = useState<MDA[]>(initialMdas);

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return <ExecutiveDashboard user={user} />;
      case 'approvals':
        return <ApprovalQueue />;
       case 'audit':
         return <SystemLogs />;
      default:
        return <ExecutiveDashboard user={user} />;
    }
  }

  return (
    <div className="space-y-6">
      {renderView()}
    </div>
  );
}
