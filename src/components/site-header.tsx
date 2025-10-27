
"use client";

import type { UserProfile } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon, Globe, Menu, Home, MessageSquareText } from "lucide-react";
import Link from "next/link";
import type { Language, Translation } from "@/lib/translations";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DashboardSidebar } from "./dashboard-sidebar";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useUser } from "@/firebase/auth/use-user";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/app/app-provider";

interface SiteHeaderProps {
  user: { uid: string; profile: UserProfile | null; } | null;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation['header'];
  isSidebarCollapsed?: boolean;
  pageType?: 'auth' | 'app';
}

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
            <MessageSquareText className="h-5 w-5 text-primary" />
        </div>
        <span className="font-bold text-xl tracking-tight text-inherit">Kano Voice</span>
    </div>
  );
}


export function SiteHeader({
  user,
  language,
  setLanguage,
  t,
  isSidebarCollapsed,
  pageType = 'app',
}: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setActiveView } = useAppContext();
  const { logout } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails, try to redirect to home
      router.push('/');
      router.refresh();
    }
  }
  
  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const isAdmin = user?.profile?.role === 'Governor' || user?.profile?.role === 'Special Adviser';
  const isLoggedIn = !!user;
  const isAuthPage = pageType === 'auth';
  
  const headerBgClass = 'bg-card text-foreground';
  const buttonHoverClass = "hover:bg-muted";
  const logoColorClass = "text-foreground";
  const avatarBgClass = "bg-muted text-foreground";
  const citizenSidebarClasses = "bg-card text-card-foreground";
  const citizenSidebarBorderClass = "border-border";
  const citizenSidebarLogoColorClass = "text-foreground";


  return (
    <header className={cn("sticky top-0 z-40 w-full border-b", headerBgClass)}>
      <div className={cn(
        "container flex h-20 items-center transition-all duration-300",
        isLoggedIn && isAdmin && !isSidebarCollapsed ? "lg:pl-[calc(240px+1rem)]" : "",
        isLoggedIn && isAdmin && isSidebarCollapsed ? "lg:pl-[calc(72px+1rem)]" : "",
      )}>
         {user?.profile && !isAdmin && !isAuthPage && (
           <div className="lg:hidden mr-4">
             <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
               <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" className={cn(buttonHoverClass)}>
                   <Menu className="h-6 w-6" />
                 </Button>
               </SheetTrigger>
               <SheetContent side="left" className={cn("p-0 w-64", citizenSidebarClasses)}>
                <div className={cn("p-4 border-b", citizenSidebarBorderClass)}>
                  <Logo className={citizenSidebarLogoColorClass} />
                </div>
                <DashboardSidebar user={user.profile} className="p-4" />
               </SheetContent>
             </Sheet>
           </div>
         )}
        <div className={cn("flex items-center gap-8", isLoggedIn && !isAdmin && "hidden lg:flex", isAdmin && "hidden")}>
            <Link href="/" aria-label="Home">
              <Logo className={logoColorClass} />
            </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-1 md:gap-2">
            {isAuthPage && (
                 <Button variant="ghost" size="icon" asChild className={buttonHoverClass}>
                    <Link href="/" aria-label="Home">
                        <Home className="h-5 w-5" />
                    </Link>
                </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={buttonHoverClass}>
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('ha')}>
                  Hausa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {isLoggedIn && <div className="h-6 w-px bg-border" />}

            {user?.profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={cn("relative h-10 w-10 rounded-full", buttonHoverClass)}>
                    <Avatar className="h-10 w-10 border-2 border-border">
                      <AvatarFallback className={cn("font-semibold", avatarBgClass)}>
                        {getInitials(user.profile.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.profile.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.profile.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>{t.myProfile}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t.logout}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
             !isAuthPage && (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">{t.signIn}</Link>
                </Button>

                <Button asChild>
                  <Link href="/register">{t.register}</Link>
                </Button>
              </>
            )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
