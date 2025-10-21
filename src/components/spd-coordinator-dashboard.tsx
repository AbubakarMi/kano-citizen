
"use client";

import type { UserProfile } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

interface SPDScoordinatorDashboardProps {
  user: UserProfile;
}

export function SPDScoordinatorDashboard({ user }: SPDScoordinatorDashboardProps) {
  return (
    <div className="container py-10">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
        SPD Coordinator Dashboard
      </h1>
      <p className="text-muted-foreground mt-2 text-lg">Welcome, {user.name}.</p>

      <div className="mt-8 grid gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1.5">
                    <CardTitle>Manage SPD Events</CardTitle>
                    <CardDescription>
                        Coordinate Special Public Dialogue events and manage participation.
                    </CardDescription>
                </div>
                <CalendarDays className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Event management and communication tools will be available here.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
