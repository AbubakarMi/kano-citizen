
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, FileText, Smile, HardHat, LayoutDashboard } from "lucide-react";

const kpis = [
    { title: "Total Citizen Participation", value: "15,432", icon: Users },
    { title: "Directives Issued vs. Completed", value: "25 / 18", icon: FileText },
    { title: "Citizen Satisfaction Score", value: "88%", icon: Smile },
    { title: "Top Sector of Concern", value: "Infrastructure", icon: HardHat },
];

export function ExecutiveDashboard() {
  return (
    <div className="space-y-4">
      <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              <LayoutDashboard className="h-6 w-6" />
              Executive Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">High-level oversight of the Kano Citizens' Voice Project.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpis.map(kpi => (
              <Card key={kpi.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                      <kpi.icon className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{kpi.value}</div>
                  </CardContent>
              </Card>
          ))}
      </div>
    </div>
  );
}
