"use client";

import type { User } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

interface SystemAdminDashboardProps {
  user: User;
}

export function SystemAdminDashboard({ user }: SystemAdminDashboardProps) {
  return (
    <div className="container py-10">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
        System Administrator Dashboard
      </h1>
      <p className="text-muted-foreground mt-2 text-lg">Welcome, {user.name}.</p>

      <div className="mt-8 grid gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1.5">
                    <CardTitle>System Management</CardTitle>
                    <CardDescription>
                        Manage user accounts, permissions, and technical operations.
                    </CardDescription>
                </div>
                <Settings className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">User and system configuration tools will be available here.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
