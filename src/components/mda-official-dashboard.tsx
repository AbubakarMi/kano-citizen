
"use client";

import type { UserProfile } from "@/lib/data";
import { useAppContext } from "@/app/app-provider";
import { AssignedDirectives } from "./mda/assigned-directives";

interface MDAOfficialDashboardProps {
  user: UserProfile;
}

export function MDAOfficialDashboard({ user }: MDAOfficialDashboardProps) {
    const { activeView } = useAppContext();

    const renderView = () => {
        switch(activeView) {
            case 'directives':
                return <AssignedDirectives user={user} />;
            default:
                return <AssignedDirectives user={user} />;
        }
    }

  return (
    <div className="space-y-6">
      {renderView()}
    </div>
  );
}
