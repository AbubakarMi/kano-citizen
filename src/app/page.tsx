"use client";

import { useState } from "react";
import type { User } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { LandingPage } from "@/components/landing-page";
import { Dashboard } from "@/components/dashboard";
import { AuthDialog } from "@/components/auth-dialog";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setIsAuthDialogOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const openAuthDialog = (mode: "login" | "register") => {
    setAuthMode(mode);
    setIsAuthDialogOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col">
      <SiteHeader
        user={user}
        onLogin={() => openAuthDialog("login")}
        onRegister={() => openAuthDialog("register")}
        onLogout={handleLogout}
      />
      <main className="flex-1">
        {user ? (
          <Dashboard user={user} />
        ) : (
          <LandingPage
            onRegister={() => openAuthDialog("register")}
            onLogin={() => openAuthDialog("login")}
          />
        )}
      </main>
      <AuthDialog
        isOpen={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
