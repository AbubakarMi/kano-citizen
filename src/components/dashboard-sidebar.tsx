"use client";

import type { User } from "@/lib/data";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
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
  href: string;
  label: string;
  icon: React.ElementType;
}

const citizenLinks: SidebarLink[] = [
  { href: "#speak", label: "Speak Up", icon: MessageSquareQuote },
  { href: "#decide", label: "Decide", icon: Vote },
  { href: "#build", label: "Build Together", icon: Handshake },
];

const superAdminLinks: SidebarLink[] = [
  { href: "#overview", label: "Executive Dashboard", icon: LayoutDashboard },
  { href: "#votes", label: "Ongoing Votes", icon: Vote },
  { href: "#directives", label: "Directive Issuance", icon: Gavel },
  { href: "#approvals", label: "Approval Queue", icon: CheckCircle },
  { href: "#users", label: "User Management", icon: Users },
  { href: "#settings", label: "System Settings", icon: Settings },
];

const mdaLinks: SidebarLink[] = [
    { href: "#directives", label: "Assigned Directives", icon: FileText },
]

const moderatorLinks: SidebarLink[] = [
    { href: "#queue", label: "Moderation Queue", icon: ShieldCheck },
]

const spdLinks: SidebarLink[] = [
    { href: "#events", label: "Manage SPD Events", icon: CalendarDays },
]

const sysAdminLinks: SidebarLink[] = [
    { href: "#users", label: "User Management", icon: Users },
    { href: "#system", label: "System Operations", icon: Settings },
]


const roleLinks: Record<User["role"], SidebarLink[]> = {
  "Citizen": citizenLinks,
  "Super Admin": superAdminLinks,
  "MDA Official": mdaLinks,
  "Moderator": moderatorLinks,
  "SPD Coordinator": spdLinks,
  "System Administrator": sysAdminLinks,
};


export function DashboardSidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const links = roleLinks[user.role] || [];
  
  return (
    <nav className="flex flex-col gap-1 sticky top-24">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              // TODO: Add active link styling based on scroll position
              // pathname === link.href ? "bg-muted" : "",
              "justify-start text-base md:text-sm"
            )}
          >
            <link.icon className="mr-3 h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </nav>
  );
}
