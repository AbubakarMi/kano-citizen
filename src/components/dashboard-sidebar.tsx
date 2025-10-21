

"use client";

import React from "react";
import type { UserProfile } from "@/lib/data";
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
  ChevronRight,
} from "lucide-react";
import { Logo } from "./logo";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useAppContext } from "@/app/app-provider";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";


interface SidebarLink {
  id: string;
  label: string;
  icon: React.ElementType;
  group?: "Engagement" | "Administration" | "SYSTEM" | "CITIZEN";
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
  { id: "overview", label: "Dashboard", icon: LayoutDashboard, group: "Engagement" },
  { id: "votes", label: "Ongoing Votes", icon: Vote, group: "Engagement" },
  { id: "directives", label: "Directive Issuance", icon: Gavel, group: "Engagement" },
  { id: "approvals", label: "Approval Queue", icon: CheckCircle, group: "Administration" },
  { id: "users", label: "User Management", icon: Users, group: "Administration" },
  { id: "settings", label: "System Settings", icon: Settings, group: "Administration" },
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

const roleLinks: Record<UserProfile["role"], SidebarLink[]> = {
  "Citizen": citizenLinks,
  "Super Admin": superAdminLinks,
  "MDA Official": mdaLinks,
  "Moderator": moderatorLinks,
  "SPD Coordinator": spdLinks,
  "System Administrator": sysAdminLinks,
};

interface DashboardSidebarProps {
  user: UserProfile;
  className?: string;
  isCollapsed?: boolean;
  setIsCollapsed?: (isCollapsed: boolean) => void;
}

const SidebarGroup = ({ title, children, isCollapsed }: { title: string, children: React.ReactNode, isCollapsed?: boolean }) => (
    <div className={cn(isCollapsed ? "my-4" : "")}>
        {!isCollapsed ? (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2 font-sans">{title}</h3>
        ) : (
            <div className="flex justify-center my-3">
                <div className="h-px w-8 bg-border"></div>
            </div>
        )}
        <div className={cn("flex flex-col", isCollapsed ? "items-center" : "gap-1")}>
            {children}
        </div>
    </div>
)

export function DashboardSidebar({ user, className, isCollapsed: isCollapsedProp, setIsCollapsed: setIsCollapsedProp }: DashboardSidebarProps) {
  const { activeView, setActiveView } = useAppContext();
  const auth = useAuth();
  const router = useRouter();

  const isCollapsed = isCollapsedProp !== undefined ? isCollapsedProp : false;
  const setIsCollapsed = setIsCollapsedProp !== undefined ? setIsCollapsedProp : () => {};
  
  const links = roleLinks[user.role] || [];
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveView(id);
  };
  
  const handleLogout = async () => {
    if (auth) {
        await signOut(auth);
        router.push('/');
    }
  }

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
        <TooltipProvider delayDuration={0}>
          <div className={cn("h-full flex flex-col justify-between text-card-foreground", className)}>
              <div>
                  <div className={cn("flex items-center justify-between p-4 mb-4", isCollapsed && "justify-center")}>
                      <div className={cn(isCollapsed && 'hidden')}>
                        <Logo className="text-foreground"/>
                      </div>
                      <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-md hover:bg-muted -mr-2">
                        {isCollapsed ? <ChevronRight className="h-5 w-5"/> : <ChevronLeft className="h-5 w-5"/>}
                      </button>
                  </div>
                  <nav className={cn("flex flex-col gap-6", isCollapsed ? 'px-2' : 'px-2')}>
                     {Object.entries(groupedLinks).map(([group, links]) => (
                        <SidebarGroup key={group} title={group} isCollapsed={isCollapsed}>
                            {links.map((link) => (
                                isCollapsed ? (
                                    <Tooltip key={link.id}>
                                        <TooltipTrigger asChild>
                                            <a
                                                href={`#${link.id}`}
                                                onClick={(e) => handleClick(e, link.id)}
                                                className={cn(
                                                buttonVariants({ variant: activeView === link.id ? "secondary" : "ghost", size: "icon" }),
                                                "h-10 w-10",
                                                activeView === link.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                                )}
                                            >
                                                <link.icon className="h-5 w-5" />
                                                <span className="sr-only">{link.label}</span>
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" className="ml-2">
                                            {link.label}
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <a
                                        key={link.id}
                                        href={`#${link.id}`}
                                        onClick={(e) => handleClick(e, link.id)}
                                        className={cn(
                                        buttonVariants({ variant: activeView === link.id ? "secondary" : "ghost" }),
                                        "justify-start text-sm font-medium",
                                        activeView === link.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                        )}
                                    >
                                        <link.icon className="mr-3 h-5 w-5" />
                                        {link.label}
                                    </a>
                                )
                            ))}
                        </SidebarGroup>
                    ))}
                  </nav>
              </div>

              <div className="p-4 border-t border-border/10 space-y-4">
                 <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
                     <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className={cn(isCollapsed && "hidden")}>
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">Admin Manager</p>
                    </div>
                 </div>
                 <button
                    onClick={handleLogout}
                    className={cn(
                        buttonVariants({ variant: "ghost" }), 
                        "w-full justify-start text-muted-foreground hover:text-foreground",
                        isCollapsed && "justify-center"
                        )}
                 >
                    <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                    {!isCollapsed && "Log out"}
                 </button>
              </div>
          </div>
        </TooltipProvider>
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
