

"use client";

import { useState } from "react";
import type { UserProfile, MDA, UserRole } from "@/lib/data";
import { mdas as initialMdas, seededUsers } from "@/lib/data";
import { ExecutiveDashboard } from "./super-admin/executive-dashboard";
import { OngoingVotes } from "./super-admin/ongoing-votes";
import { DirectiveIssuance } from "./super-admin/directive-issuance";
import { ApprovalQueue } from "./super-admin/approval-queue";
import { UserManagement } from "./super-admin/user-management";
import { SystemSettings } from "./super-admin/system-settings";
import { useAppContext } from "@/app/app-provider";

interface SuperAdminDashboardProps {
  user: UserProfile;
  activeView: string;
}

const initialRoles: UserRole[] = [...new Set(seededUsers.map(u => u.role))];

export function SuperAdminDashboard({ user, activeView }: SuperAdminDashboardProps) {
  const { ideas } = useAppContext();
  const [mdas, setMdas] = useState<MDA[]>(initialMdas);
  const [roles, setRoles] = useState<UserRole[]>(initialRoles);

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return <ExecutiveDashboard user={user} />;
      case 'votes':
        return <OngoingVotes />;
      case 'directives':
        return <DirectiveIssuance ideas={ideas} mdas={mdas} />;
      case 'approvals':
        return <ApprovalQueue />;
      case 'users':
        return <UserManagement 
                 availableRoles={roles.filter(r => r !== 'Citizen')}
                 mdas={mdas}
                 setMdas={setMdas}
                 roles={roles}
                 setRoles={setRoles} 
               />;
      case 'settings':
         return <SystemSettings />;
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
