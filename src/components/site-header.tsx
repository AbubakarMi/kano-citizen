
"use client";

import type { UserProfile } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon, Globe, Menu } from "lucide-react";
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
}

export function SiteHeader({
  user,
  language,
  setLanguage,
  t,
  isSidebarCollapsed
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

  const isAdmin = user?.profile?.role === 'Super Admin' || user?.profile?.role === 'System Administrator';
  const isLoggedIn = !!user;

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full border-b",
      isLoggedIn && !isAdmin ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'
      )}>
      <div className={cn(
        "container flex h-20 items-center transition-all duration-300",
        isAdmin && !isSidebarCollapsed ? "lg:pl-[264px]" : "",
        isAdmin && isSidebarCollapsed ? "lg:pl-[96px]" : "",
      )}>
         {user?.profile && (
           <div className={cn("lg:hidden mr-4", isAdmin && "hidden")}>
             <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
               <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" className="hover:bg-primary/90">
                   <Menu className="h-6 w-6" />
                 </Button>
               </SheetTrigger>
               <SheetContent side="left" className="p-0 w-64 bg-primary text-primary-foreground">
                <div className="p-4 border-b border-primary-foreground/20">
                  <Logo />
                </div>
                <DashboardSidebar user={user.profile} className="p-4" />
               </SheetContent>
             </Sheet>
           </div>
         )}
        <div className="flex items-center gap-8">
            <Link href="/" aria-label="Home" className={cn("flex items-center", isLoggedIn && "hidden lg:flex")}>
              <Logo />
            </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden md:flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(isLoggedIn && !isAdmin ? "text-primary-foreground hover:bg-primary-foreground/10" : "text-foreground hover:bg-muted")}>
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
            
            {isLoggedIn && <Separator isAdmin={isAdmin} />}

            {user?.profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={cn("relative h-10 w-10 rounded-full", isAdmin ? "hover:bg-muted" : "hover:bg-primary-foreground/10")}>
                    <Avatar className="h-10 w-10 border-2 border-primary-foreground/50">
                      <AvatarFallback className={cn("font-semibold", isAdmin ? "bg-muted text-foreground" : "bg-transparent text-primary-foreground")}>
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
              <>
                <Button asChild variant="outline">
                  <Link href="/login">{t.signIn}</Link>
                </Button>

                <Button asChild>
                  <Link href="/register">{t.register}</Link>
                </Button>
              </>
            )}
          </nav>
          <div className="md:hidden">
            {/* Mobile menu could be triggered here if needed */}
          </div>
        </div>
      </div>
    </header>
  );
}

const Separator = ({ isAdmin }: { isAdmin?: boolean }) => <div className={cn("h-6 w-px", isAdmin ? 'bg-border' : 'bg-primary-foreground/20')} />;
