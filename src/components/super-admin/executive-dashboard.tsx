
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Users, FileText, Smile, HardHat, LayoutDashboard, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';


const kpis = [
    { title: "Active Admins", value: "6", icon: Users },
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

const sentimentData = [
  { month: 'Jan', satisfaction: 75 },
  { month: 'Feb', satisfaction: 78 },
  { month: 'Mar', satisfaction: 82 },
  { month: 'Apr', satisfaction: 80 },
  { month: 'May', satisfaction: 85 },
  { month: 'Jun', satisfaction: 88 },
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
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
            <CardTitle>Sector Activity</CardTitle>
             <CardDescription>Citizen ideas vs. issued directives per sector.</CardDescription>
            </CardHeader>
            <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sectorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                    contentStyle={{
                        background: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                    }}
                 />
                <Legend iconSize={10} />
                <Bar dataKey="ideas" fill="hsl(var(--primary))" name="Citizen Ideas" radius={[4, 4, 0, 0]} />
                <Bar dataKey="directives" fill="hsl(var(--secondary))" name="Issued Directives" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5"/>Citizen Sentiment</CardTitle>
             <CardDescription>Satisfaction score trend over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={sentimentData}>
                        <defs>
                            <linearGradient id="colorSatisfaction" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis domain={[70, 90]} fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                             contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                            }}
                        />
                        <Area type="monotone" dataKey="satisfaction" stroke="hsl(var(--primary))" fill="url(#colorSatisfaction)" name="Satisfaction %" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
