

"use client";

import { useState } from "react";
import type { UserProfile, MDA } from "@/lib/data";
import { mdas as initialMdas, initialApprovalItems as allItems } from "@/lib/data";
import { useAppContext } from "@/app/app-provider";
import { Analytics } from "./system-admin/analytics";
import { SpecialAdviserMainDashboard } from "./super-admin/special-adviser-main-dashboard";
import { DirectiveIssuance } from "./super-admin/directive-issuance";
import { MDAPerformanceMonitor } from "./super-admin/mda-performance-monitor";
import { OngoingVotes } from "./super-admin/ongoing-votes";
import { ReviewedSubmissions } from "./super-admin/reviewed-submissions";

interface SpecialAdviserDashboardProps {
  user: UserProfile;
  activeView: string;
}

export function SpecialAdviserDashboard({ user, activeView }: SpecialAdviserDashboardProps) {
  const { ideas, setIdeas, setApprovalQueue } = useAppContext();
  const mdas = initialMdas;

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <SpecialAdviserMainDashboard />;
      case 'submissions':
        return <ReviewedSubmissions ideas={ideas} setIdeas={setIdeas} />;
      case 'drafting':
        return <DirectiveIssuance ideas={ideas} mdas={mdas} setApprovalQueue={setApprovalQueue} />;
      case 'ongoing-votes':
        return <OngoingVotes />;
      case 'mda-monitor':
        return <MDAPerformanceMonitor />;
      case 'analytics':
        return <Analytics />;
      default:
        return <SpecialAdviserMainDashboard />;
    }
  }

  return (
    <div className="space-y-6">
      {renderView()}
    </div>
  );
}
