
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
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
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
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
        await signOut(auth);
        router.push('/');
    }
  }
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const isSuperAdmin = user?.profile?.role === 'Super Admin';

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full border-b",
      user ? 'bg-primary text-primary-foreground' : 'bg-card'
      )}>
      <div className={cn(
        "container flex h-20 items-center transition-all duration-300",
        isSuperAdmin && !isSidebarCollapsed ? "lg:pl-[264px]" : "",
        isSuperAdmin && isSidebarCollapsed ? "lg:pl-[96px]" : "",
      )}>
         {user?.profile && !isSuperAdmin && (
           <div className="lg:hidden mr-4">
             <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
               <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" className="hover:bg-primary/90">
                   <Menu className="h-6 w-6" />
                 </Button>
               </SheetTrigger>
               <SheetContent side="left" className="p-0 w-64">
                <div className="p-4 border-b bg-primary text-primary-foreground">
                  <Logo />
                </div>
                <DashboardSidebar user={user.profile} className="p-4" />
               </SheetContent>
             </Sheet>
           </div>
         )}
        <div className="flex items-center gap-8">
            <Link href="/" aria-label="Home" className={cn("flex items-center")}>
              <Logo className={cn(user ? "text-primary-foreground" : "")} />
            </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(user ? "hover:bg-primary/90" : "")}>
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
            
            {user && <Separator />}

            {user?.profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-primary/90">
                    <Avatar className="h-10 w-10 border-2 border-primary-foreground/50">
                      <AvatarFallback className="bg-transparent text-primary-foreground font-semibold">
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
                <Button asChild variant="ghost">
                  <Link href="/login">{t.signIn}</Link>
                </Button>

                <Button asChild>
                  <Link href="/register">{t.register}</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

const Separator = () => <div className="h-6 w-px bg-primary-foreground/20" />;
