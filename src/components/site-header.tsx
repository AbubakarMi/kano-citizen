
"use client";

import type { User } from "@/lib/data";
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

interface SiteHeaderProps {
  user: User | null;
  onLogout: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation['header'];
}

export function SiteHeader({
  user,
  onLogout,
  language,
  setLanguage,
  t,
}: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
         {user && (
           <div className="lg:hidden mr-4">
             <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
               <SheetTrigger asChild>
                 <Button variant="ghost" size="icon">
                   <Menu className="h-6 w-6" />
                 </Button>
               </SheetTrigger>
               <SheetContent side="left" className="p-0 w-64">
                <div className="p-4 border-b">
                  <Logo />
                </div>
                {/* This is a temporary way to handle sidebar state for mobile */}
                {user.role === 'Super Admin' && (
                    <DashboardSidebar user={user} className="p-4" />
                )}
               </SheetContent>
             </Sheet>
           </div>
         )}
        <Link href="/" aria-label="Home" className="hidden sm:flex">
          <Logo />
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
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
            
            <Separator />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary/50">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserIcon />
                    {t.myProfile}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-red-500 focus:text-red-500">
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

const Separator = () => <div className="h-6 w-px bg-border" />;
