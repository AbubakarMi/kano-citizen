

"use client";

import React, { useState } from "react";
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
  Activity,
  BarChart2,
  FileClock,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { Logo } from "./logo";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface SidebarLink {
  id: string;
  label: string;
  icon: React.ElementType;
  group?: "MARKETING" | "SYSTEM" | "PAYMENTS" | "CITIZEN";
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
};

const citizenLinks: SidebarLink[] = [
  { id: "speak", label: "Speak Up", icon: MessageSquareQuote, group: "CITIZEN" },
  { id: "decide", label: "Decide", icon: Vote, group: "CITIZEN" },
  { id: "build", label: "Build Together", icon: Handshake, group: "CITIZEN" },
];

const superAdminLinks: SidebarLink[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard, group: "MARKETING" },
  { id: "votes", label: "Ongoing Votes", icon: Vote, group: "MARKETING" },
  { id: "directives", label: "Directive Issuance", icon: Gavel, group: "MARKETING" },
  { id: "approvals", label: "Approval Queue", icon: CheckCircle, group: "PAYMENTS" },
  { id: "users", label: "User Management", icon: Users, group: "PAYMENTS" },
  { id: "settings", label: "System Settings", icon: Settings, group: "SYSTEM" },
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
    { id: "health", label: "System Health", icon: Activity },
    { id: "users", label: "User Management", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
    { id: "logs", label: "System Logs", icon: FileClock },
    { id: "settings", label: "Configuration", icon: Settings },
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
  activeView?: string;
  setActiveView?: (view: string) => void;
  onLogout: () => void;
  className?: string;
}

const SidebarGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">{title}</h3>
        <div className="flex flex-col gap-1">
            {children}
        </div>
    </div>
)

export function DashboardSidebar({ user, activeView, setActiveView, onLogout, className }: DashboardSidebarProps) {
  const links = roleLinks[user.role] || [];
  const [internalActiveView, setInternalActiveView] = useState('overview');

  const currentView = activeView || internalActiveView;
  const setCurrentView = setActiveView || setInternalActiveView;
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setCurrentView(id);
  };
  
  const groupedLinks = links.reduce((acc, link) => {
    const group = link.group || 'GENERAL';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(link);
    return acc;
  }, {} as Record<string, SidebarLink[]>);

  if (user.role === 'Super Admin') {
      return (
          <div className={cn("h-full flex flex-col justify-between text-card-foreground", className)}>
              <div>
                  <div className="flex items-center justify-between p-4 mb-4">
                      <Logo className="text-foreground"/>
                      <button className="p-2 rounded-md hover:bg-muted">
                        <ChevronLeft className="h-5 w-5"/>
                      </button>
                  </div>
                  <nav className="flex flex-col gap-6 px-2">
                     {Object.entries(groupedLinks).map(([group, links]) => (
                        <SidebarGroup key={group} title={group}>
                            {links.map((link) => (
                                <a
                                    key={link.id}
                                    href={`#${link.id}`}
                                    onClick={(e) => handleClick(e, link.id)}
                                    className={cn(
                                    buttonVariants({ variant: currentView === link.id ? "secondary" : "ghost" }),
                                    "justify-start text-sm font-medium",
                                     currentView === link.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                    )}
                                >
                                    <link.icon className="mr-3 h-5 w-5" />
                                    {link.label}
                                </a>
                            ))}
                        </SidebarGroup>
                    ))}
                  </nav>
              </div>

              <div className="p-4 border-t border-border/10 space-y-4">
                 <div className="flex items-center gap-3">
                     <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">Admin Manager</p>
                    </div>
                 </div>
                 <button
                    onClick={onLogout}
                    className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start text-muted-foreground hover:text-foreground")}
                 >
                    <LogOut className="mr-3 h-5 w-5" />
                    Log out
                 </button>
              </div>
          </div>
      )
  }

  return (
    <nav className={cn("flex flex-col gap-1 py-6 pr-6 lg:py-8", className)}>
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={(e) => handleClick(e, link.id)}
            className={cn(
              buttonVariants({ variant: currentView === link.id ? "secondary" : "ghost" }),
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
