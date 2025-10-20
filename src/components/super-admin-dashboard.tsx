
"use client";

import { useState } from "react";
import type { User, Idea } from "@/lib/data";
import { ExecutiveDashboard } from "./super-admin/executive-dashboard";
import { OngoingVotes } from "./super-admin/ongoing-votes";
import { DirectiveIssuance } from "./super-admin/directive-issuance";
import { ApprovalQueue } from "./super-admin/approval-queue";
import { UserManagement } from "./super-admin/user-management";
import { SystemSettings } from "./super-admin/system-settings";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

interface SuperAdminDashboardProps {
  user: User;
  ideas: Idea[];
}

export function SuperAdminDashboard({ user, ideas }: SuperAdminDashboardProps) {
  const [activeView, setActiveView] = useState('overview');

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return <ExecutiveDashboard />;
      case 'votes':
        return <OngoingVotes initialIdeas={ideas} />;
      case 'directives':
        return <DirectiveIssuance ideas={ideas} />;
      case 'approvals':
        return <ApprovalQueue />;
      case 'users':
        return <UserManagement />;
      case 'settings':
         return <SystemSettings />;
      default:
        return <ExecutiveDashboard />;
    }
  }
  
  // This is a bit of a hack to pass the state down to the sidebar in a clean way
  // when it's rendered inside the mobile sheet. A context would be better for a real app.
  const MobileSidebar = () => (
    <DashboardSidebar user={user} activeView={activeView} setActiveView={setActiveView} className="p-4" />
  );

  return (
    <>
      <div className="lg:hidden">
         {renderView()}
      </div>

       <div className="hidden lg:flex">
          <DashboardSidebar user={user} activeView={activeView} setActiveView={setActiveView} />
          <div className="flex-1 space-y-6">
            {renderView()}
          </div>
       </div>
    </>
  );
}
