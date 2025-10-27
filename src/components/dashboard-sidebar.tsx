
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
  Send,
  Building,
  CheckSquare,
  DraftingCompass,
} from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useAppContext } from "@/app/app-provider";
import { useUser } from "@/firebase/auth/use-user";
import { useRouter } from "next/navigation";
import { Logo } from "./site-header";


interface SidebarLink {
  id: string;
  label: string;
  icon: React.ElementType;
  group?: "Engagement" | "Administration" | "CITIZEN" | "OVERSIGHT" | "OPERATIONS" | "MANAGEMENT";
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

const governorLinks: SidebarLink[] = [
  { id: "overview", label: "Command Dashboard", icon: LayoutDashboard, group: "OVERSIGHT" },
  { id: "approvals", label: "Final Approval Queue", icon: CheckCircle, group: "OVERSIGHT" },
  { id: "directives", label: "Directive Issuance", icon: Gavel, group: "OVERSIGHT" },
  { id: "audit", label: "Audit Log", icon: FileClock, group: "OVERSIGHT" },
];

const specialAdviserLinks: SidebarLink[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "OPERATIONS" },
    { id: "submissions", label: "Reviewed Submissions", icon: CheckSquare, group: "OPERATIONS" },
    { id: "ongoing-votes", label: "Ongoing Votes", icon: Vote, group: "OPERATIONS" },
    { id: "drafting", label: "Directive Drafting", icon: Gavel, group: "OPERATIONS" },
    { id: "mda-monitor", label: "MDA Performance", icon: Building, group: "OPERATIONS" },
    { id: "analytics", label: "Analytics", icon: BarChart2, group: "OPERATIONS" },
    { id: "user-management", label: "User Management", icon: Users, group: "MANAGEMENT" },
]

const mdaLinks: SidebarLink[] = [
    { id: "directives", label: "Assigned Directives", icon: FileText },
]

const moderatorLinks: SidebarLink[] = [
    { id: "queue", label: "Submission Queue", icon: ShieldCheck },
]

const roleLinks: Record<string, SidebarLink[]> = {
  "Citizen": citizenLinks,
  "Governor": governorLinks,
  "Special Adviser": specialAdviserLinks,
  "MDA Official": mdaLinks,
  "Moderator": moderatorLinks,
};

interface DashboardSidebarProps {
  user: UserProfile;
  className?: string;
  isCollapsed?: boolean;
  setIsCollapsed?: (isCollapsed: boolean) => void;
}

const SidebarGroup = ({ title, children, isCollapsed }: { title: string, children: React.ReactNode, isCollapsed?: boolean }) => (
    <div className={cn(isCollapsed ? "my-4" : "")}>
        {!isCollapsed && !['CITIZEN'].includes(title) ? (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2 font-sans">{title}</h3>
        ) : (
             !['CITIZEN'].includes(title) && <div className="flex justify-center my-3">
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
  const { logout } = useUser();
  const router = useRouter();

  const isCollapsed = isCollapsedProp !== undefined ? isCollapsedProp : false;
  const setIsCollapsed = setIsCollapsedProp !== undefined ? setIsCollapsedProp : () => {};
  
  const links = roleLinks[user.role] || [];
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveView(id);
  };
  
  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      await logout();
      router.push('/');
      // Full page refresh to ensure all state is cleared
      window.location.href = '/';
    } catch (error) {
      console.error("Logout failed:", error);
       // Even if logout fails, force redirect
      window.location.href = '/';
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

  const isAdmin = user.role === 'Governor' || user.role === 'Special Adviser';

  // Admin Sidebar (Governor, Special Adviser)
  if (isAdmin) {
      return (
        <TooltipProvider delayDuration={0}>
          <div className={cn("h-full flex flex-col justify-between", className)}>
              <div>
                  <div className={cn("flex items-center justify-between p-4 mb-4", isCollapsed && "justify-center")}>
                      <div className={cn(isCollapsed && 'hidden')}>
                        <Logo />
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
                                                buttonVariants({ variant: activeView === link.id ? "default" : "ghost", size: "icon" }),
                                                "h-10 w-10",
                                                activeView !== link.id && "text-muted-foreground hover:bg-muted/50 hover:text-card-foreground"
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
                                        buttonVariants({ variant: activeView === link.id ? "default" : "ghost" }),
                                        "justify-start text-sm font-medium",
                                        activeView !== link.id && "text-card-foreground hover:bg-muted/50"
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
                        <p className="text-xs text-muted-foreground">{user.role}</p>
                    </div>
                 </div>
                 <a
                    href="#"
                    onClick={handleLogout}
                    className={cn(
                        buttonVariants({ variant: "ghost" }), 
                        "w-full justify-start text-muted-foreground hover:text-destructive",
                        isCollapsed && "justify-center"
                        )}
                 >
                    <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                    {!isCollapsed && "Log out"}
                 </a>
              </div>
          </div>
        </TooltipProvider>
      )
  }

  // Citizen, MDA, Moderator Sidebar
  return (
    <nav className={cn("flex flex-col gap-1 py-6", className)}>
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={(e) => handleClick(e, link.id)}
            className={cn(
              buttonVariants({ variant: activeView === link.id ? "secondary" : "ghost" }),
              "justify-start text-base md:text-sm",
               activeView === link.id ? "text-secondary-foreground" : "text-card-foreground hover:bg-muted/10"
            )}
          >
            <link.icon className="mr-3 h-4 w-4" />
            {link.label}
          </a>
        ))}
      </nav>
  );
}
