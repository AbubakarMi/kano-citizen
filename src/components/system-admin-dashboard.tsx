
"use client";

import type { UserProfile } from "@/lib/data";
import { SystemHealth } from "./system-admin/system-health";
import { UserManagement } from "./system-admin/user-management";
import { Analytics } from "./system-admin/analytics";
import { SystemLogs } from "./system-admin/system-logs";
import { Configuration } from "./system-admin/configuration";


interface SystemAdminDashboardProps {
  user: UserProfile;
  activeView: string;
}

export function SystemAdminDashboard({ user, activeView }: SystemAdminDashboardProps) {
  const renderView = () => {
    switch (activeView) {
      case 'health':
        return <SystemHealth />;
      case 'users':
        return <UserManagement />;
      case 'analytics':
        return <Analytics />;
      case 'logs':
        return <SystemLogs />;
      case 'settings':
        return <Configuration />;
      default:
        return <SystemHealth />;
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">System Administrator</h1>
      {renderView()}
    </div>
  );
}
