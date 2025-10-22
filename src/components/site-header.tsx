
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
        <div className="h-8 w-8 bg-card rounded-full flex items-center justify-center">
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
    logout();
    router.push('/');
  }
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const isAdmin = user?.profile?.role === 'Governor' || user?.profile?.role === 'Special Adviser';
  const isLoggedIn = !!user;
  const isAuthPage = pageType === 'auth';

  // Consistent Header Style Logic
  const headerBgClass = isLoggedIn ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground';
  const buttonVariant = isLoggedIn ? "ghost" : "ghost";
  const buttonHoverClass = isLoggedIn ? "text-primary-foreground hover:bg-primary-foreground/10" : "text-foreground hover:bg-muted";

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
                 <Button variant="ghost" size="icon" className="hover:bg-primary/90">
                   <Menu className="h-6 w-6" />
                 </Button>
               </SheetTrigger>
               <SheetContent side="left" className="p-0 w-64 bg-primary text-primary-foreground">
                <div className="p-4 border-b border-primary-foreground/20">
                  <Logo className="text-primary-foreground" />
                </div>
                <DashboardSidebar user={user.profile} className="p-4" />
               </SheetContent>
             </Sheet>
           </div>
         )}
        <div className={cn("flex items-center gap-8", isLoggedIn && !isAdmin && "hidden lg:flex")}>
            <Link href="/" aria-label="Home">
              <Logo className={cn(isLoggedIn ? 'text-primary-foreground' : 'text-foreground')} />
            </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-1 md:gap-2">
            {isAuthPage && (
                 <Button variant={buttonVariant} size="icon" asChild className={buttonHoverClass}>
                    <Link href="/" aria-label="Home">
                        <Home className="h-5 w-5" />
                    </Link>
                </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={buttonVariant} size="icon" className={buttonHoverClass}>
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
            
            {isLoggedIn && <div className={cn("h-6 w-px", isLoggedIn ? 'bg-primary-foreground/20' : 'bg-border')} />}

            {user?.profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={cn("relative h-10 w-10 rounded-full", buttonHoverClass)}>
                    <Avatar className="h-10 w-10 border-2 border-primary-foreground/50">
                      <AvatarFallback className={cn("font-semibold", isLoggedIn ? "bg-transparent text-primary-foreground" : "bg-muted text-foreground")}>
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
                    <UserIcon />
                    {t.myProfile}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut />
                    {t.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
             !isAuthPage && (
              <>
                <Button asChild variant="outline">
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
