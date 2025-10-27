
"use client";

import type { UserProfile } from "@/lib/data";
import { seededUsers } from "@/lib/data";
import { ApprovalQueue } from "./super-admin/approval-queue";
import { SystemLogs } from "./system-admin/system-logs";
import { useAppContext } from "@/app/app-provider";
import { ExecutiveDashboard } from "./super-admin/executive-dashboard";

interface GovernorDashboardProps {
  user: UserProfile;
  activeView: string;
}

export function GovernorDashboard({ user, activeView }: GovernorDashboardProps) {
  const { ideas, directives, approvalQueue } = useAppContext();
  const allUsers: UserProfile[] = seededUsers.map(u => ({...u, submittedIdeas:[], votedOnIdeas:[], followedDirectives:[], volunteeredFor:[] }));


  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return <ExecutiveDashboard 
                    user={user} 
                    ideas={ideas}
                    directives={directives}
                    users={allUsers}
                    approvalQueue={approvalQueue}
                />;
      case 'approvals':
        return <ApprovalQueue />;
       case 'audit':
         return <SystemLogs />;
      default:
        return <ExecutiveDashboard 
                    user={user}
                    ideas={ideas}
                    directives={directives}
                    users={allUsers}
                    approvalQueue={approvalQueue}
                />;
    }
  }

  return (
    <div className="space-y-6">
      {renderView()}
    </div>
  );
}
