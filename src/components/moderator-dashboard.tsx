"use client";

import type { User } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

interface ModeratorDashboardProps {
  user: User;
}

export function ModeratorDashboard({ user }: ModeratorDashboardProps) {
  return (
    <div className="container py-10">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
        Moderator Dashboard
      </h1>
      <p className="text-muted-foreground mt-2 text-lg">Welcome, {user.name}.</p>

       <div className="mt-8 grid gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1.5">
                    <CardTitle>Content Moderation Queue</CardTitle>
                    <CardDescription>
                        Review and categorize citizen submissions.
                    </CardDescription>
                </div>
                <ShieldCheck className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Content review and filtering tools will be available here.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
