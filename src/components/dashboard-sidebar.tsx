
"use client";

import type { User } from "@/lib/data";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Gavel,
  CheckCircle,
  Users,
  Settings,
  Vote,
  MessageSquareQuote,
  Handshake,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";

interface SidebarLink {
  id: string;
  label: string;
  icon: React.ElementType;
}

const citizenLinks: SidebarLink[] = [
  { id: "speak", label: "Speak Up", icon: MessageSquareQuote },
  { id: "decide", label: "Decide", icon: Vote },
  { id: "build", label: "Build Together", icon: Handshake },
];

const superAdminLinks: SidebarLink[] = [
  { id: "overview", label: "Executive Dashboard", icon: LayoutDashboard },
  { id: "votes", label: "Ongoing Votes", icon: Vote },
  { id: "directives", label: "Directive Issuance", icon: Gavel },
  { id: "approvals", label: "Approval Queue", icon: CheckCircle },
  { id: "users", label: "User Management", icon: Users },
  { id: "settings", label: "System Settings", icon: Settings },
];

const mdaLinks: SidebarLink[] = [
    { id: "directives", label: "Assigned Directives", icon: FileText },
]

const moderatorLinks: SidebarLink[] = [
    { id: "queue", label: "Moderation Queue", icon: ShieldCheck },
]

const spdLinks: SidebarLink[] = [
    { id: "events", label: "Manage SPD Events", icon: CalendarDays },
]

const sysAdminLinks: SidebarLink[] = [
    { id: "users", label: "User Management", icon: Users },
    { id: "system", label: "System Operations", icon: Settings },
]

const roleLinks: Record<User["role"], SidebarLink[]> = {
  "Citizen": citizenLinks,
  "Super Admin": superAdminLinks,
  "MDA Official": mdaLinks,
  "Moderator": moderatorLinks,
  "SPD Coordinator": spdLinks,
  "System Administrator": sysAdminLinks,
};

interface DashboardSidebarProps {
  user: User;
  activeView: string;
  setActiveView: (view: string) => void;
}

export function DashboardSidebar({ user, activeView, setActiveView }: DashboardSidebarProps) {
  const links = roleLinks[user.role] || [];
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveView(id);
    if (user.role !== 'Super Admin') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={(e) => handleClick(e, link.id)}
            className={cn(
              buttonVariants({ variant: activeView === link.id ? "secondary" : "ghost" }),
              "justify-start text-base md:text-sm"
            )}
          >
            <link.icon className="mr-3 h-4 w-4" />
            {link.label}
          </a>
        ))}
      </nav>
  );
}
