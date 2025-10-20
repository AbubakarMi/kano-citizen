
"use client";

import type { User, Idea } from "@/lib/data";
import { ExecutiveDashboard } from "./super-admin/executive-dashboard";
import { OngoingVotes } from "./super-admin/ongoing-votes";
import { DirectiveIssuance } from "./super-admin/directive-issuance";
import { ApprovalQueue } from "./super-admin/approval-queue";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Users, Settings } from "lucide-react";

interface SuperAdminDashboardProps {
  user: User;
  ideas: Idea[];
  activeView: string;
}

export function SuperAdminDashboard({ user, ideas, activeView }: SuperAdminDashboardProps) {

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
        return (
           <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><Users className="h-6 w-6" /> Manage Users & Roles</CardTitle>
                <CardDescription>This section is under development.</CardDescription>
            </CardHeader>
            <CardContent>
                 <p className="text-muted-foreground">A table for viewing, editing, and assigning roles to users will be available here.</p>
            </CardContent>
        </Card>
        );
      case 'settings':
         return (
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><Settings className="h-6 w-6" /> Configure Platform Settings</CardTitle>
                    <CardDescription>This section is under development.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Controls for system-wide settings, such as voting thresholds and content categories, will be available here.</p>
                </CardContent>
            </Card>
         );
      default:
        return <ExecutiveDashboard />;
    }
  }

  return (
    <div className="flex flex-col gap-10">
      {renderView()}
    </div>
  );
}
