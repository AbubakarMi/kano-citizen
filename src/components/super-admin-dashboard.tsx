"use client";

import type { User } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Crown } from "lucide-react";

interface SuperAdminDashboardProps {
  user: User;
}

export function SuperAdminDashboard({ user }: SuperAdminDashboardProps) {
  return (
    <div className="container py-10">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
        Super Admin Dashboard
      </h1>
      <p className="text-muted-foreground mt-2 text-lg">Welcome, {user.name}.</p>

      <div className="mt-8 grid gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1.5">
                    <CardTitle>Platform Oversight</CardTitle>
                    <CardDescription>
                        Access all data, issue directives, and manage KCVP operations.
                    </CardDescription>
                </div>
                <Crown className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Full analytics, directive issuance, and system management tools will be available here.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
