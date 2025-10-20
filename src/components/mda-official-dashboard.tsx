"use client";

import type { User } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Building } from "lucide-react";

interface MDAOfficialDashboardProps {
  user: User;
}

export function MDAOfficialDashboard({ user }: MDAOfficialDashboardProps) {
  return (
    <div className="container py-10">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
        MDA Official Dashboard
      </h1>
      <p className="text-muted-foreground mt-2 text-lg">Welcome, {user.name}.</p>

      <div className="mt-8 grid gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1.5">
                    <CardTitle>Assigned Directives</CardTitle>
                    <CardDescription>
                        View and update progress on directives assigned to your MDA.
                    </CardDescription>
                </div>
                <Building className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Directive management features will be available here.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
