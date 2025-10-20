
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, FileText, Smile, HardHat, LayoutDashboard } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const kpis = [
    { title: "Total Citizen Participation", value: "15,432", icon: Users },
    { title: "Directives Issued vs. Completed", value: "25 / 18", icon: FileText },
    { title: "Citizen Satisfaction Score", value: "88%", icon: Smile },
    { title: "Top Sector of Concern", value: "Infrastructure", icon: HardHat },
];

const sectorData = [
  { name: 'Health', ideas: 45, directives: 5 },
  { name: 'Infrastructure', ideas: 82, directives: 8 },
  { name: 'Education', ideas: 65, directives: 4 },
  { name: 'Security', ideas: 32, directives: 3 },
  { name: 'Environment', ideas: 51, directives: 5 },
];


export function ExecutiveDashboard() {
  return (
    <div className="space-y-6">
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
      
       <Card>
        <CardHeader>
          <CardTitle>Sector Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={sectorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ideas" fill="hsl(var(--primary))" name="Citizen Ideas" />
              <Bar dataKey="directives" fill="hsl(var(--secondary))" name="Issued Directives" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
}
