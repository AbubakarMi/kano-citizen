
"use client";

import { useState } from "react";
import type { User, Idea, MDA } from "@/lib/data";
import { mdas as initialMdas } from "@/lib/data";
import { ExecutiveDashboard } from "./super-admin/executive-dashboard";
import { OngoingVotes } from "./super-admin/ongoing-votes";
import { DirectiveIssuance } from "./super-admin/directive-issuance";
import { ApprovalQueue } from "./super-admin/approval-queue";
import { UserManagement } from "./super-admin/user-management";
import { SystemSettings } from "./super-admin/system-settings";

interface SuperAdminDashboardProps {
  user: User;
  ideas: Idea[];
  activeView: string;
}

export function SuperAdminDashboard({ user, ideas, activeView }: SuperAdminDashboardProps) {
  const [mdas, setMdas] = useState<MDA[]>(initialMdas);

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return <ExecutiveDashboard />;
      case 'votes':
        return <OngoingVotes initialIdeas={ideas} />;
      case 'directives':
        return <DirectiveIssuance ideas={ideas} mdas={mdas} />;
      case 'approvals':
        return <ApprovalQueue />;
      case 'users':
        return <UserManagement />;
      case 'settings':
         return <SystemSettings mdas={mdas} setMdas={setMdas} />;
      default:
        return <ExecutiveDashboard />;
    }
  }

  return (
    <div className="space-y-6">
      {renderView()}
    </div>
  );
}
