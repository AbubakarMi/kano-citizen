
"use client";

import type { UserProfile } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Building, CheckCircle, FileText, Signature } from "lucide-react";
import { useAppContext } from "@/app/app-provider";
import { Badge } from "./ui/badge";
import { mdas } from "@/lib/data";

interface MDAOfficialDashboardProps {
  user: UserProfile;
}

export function MDAOfficialDashboard({ user }: MDAOfficialDashboardProps) {
    const { approvalQueue } = useAppContext();
    const assignedMda = mdas.find(m => m.id === user.mda);

    const myDirectives = approvalQueue.filter(item => item.status === 'Issued' && item.assignedMdaId === user.mda);

  return (
    <div className="container py-10">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
        MDA Dashboard: {assignedMda?.name}
      </h1>
      <p className="text-muted-foreground mt-2 text-lg">Welcome, {user.name}.</p>

      <div className="mt-8 grid gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1.5">
                    <CardTitle>Assigned Directives</CardTitle>
                    <CardDescription>
                        View and update progress on directives assigned to your MDA by the Governor's office.
                    </CardDescription>
                </div>
                <Building className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
                 {myDirectives.length > 0 ? myDirectives.map(item => (
                    <Card key={item.id} className="bg-muted/50">
                        <CardHeader>
                            <CardTitle>{item.title}</CardTitle>
                            <CardDescription>Type: {item.type}</CardDescription>
                        </CardHeader>
                         <CardContent>
                            <p className="text-sm mb-4">{item.description}</p>
                            <div className="p-3 bg-background rounded-md text-sm space-y-2 border">
                                <p className="font-semibold flex items-center gap-2 text-secondary"><CheckCircle className="h-4 w-4"/>Approved by Executive Governor</p>
                                <p className="text-muted-foreground flex items-center gap-2"><Signature className="h-4 w-4"/> Signed by: <span className="font-medium text-foreground">{item.governorSignature}</span></p>
                                <p className="text-xs text-muted-foreground pt-1">on {item.approvalDate}</p>
                            </div>
                         </CardContent>
                    </Card>
                )) : (
                    <p className="text-center py-8 text-muted-foreground">No directives are currently assigned to your MDA.</p>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
