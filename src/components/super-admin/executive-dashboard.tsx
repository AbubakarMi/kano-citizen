
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Users, FileText, Smile, HardHat, TrendingUp, Sun } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import type { User } from "@/lib/data";


const kpis = [
    { title: "Active Admins", value: "6", icon: Users },
    { title: "Directives Issued", value: "25", icon: FileText, footer: "18 Completed" },
    { title: "Citizen Satisfaction", value: "88%", icon: Smile, footer: "Trending Up" },
    { title: "Top Sector", value: "Infrastructure", icon: HardHat, footer: "Most ideas submitted" },
];

const sectorData = [
  { name: 'Health', ideas: 45, directives: 5 },
  { name: 'Infra', ideas: 82, directives: 8 },
  { name: 'Edu', ideas: 65, directives: 4 },
  { name: 'Security', ideas: 32, directives: 3 },
  { name: 'Env', ideas: 51, directives: 5 },
  { name: 'Agric', ideas: 28, directives: 2 },
];

const sentimentData = [
  { month: 'Jan', satisfaction: 75 },
  { month: 'Feb', satisfaction: 78 },
  { month: 'Mar', satisfaction: 82 },
  { month: 'Apr', satisfaction: 80 },
  { month: 'May', satisfaction: 85 },
  { month: 'Jun', satisfaction: 88 },
];

interface ExecutiveDashboardProps {
    user: User;
}

export function ExecutiveDashboard({ user }: ExecutiveDashboardProps) {
  return (
    <div className="space-y-8">
       <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">
              Executive Overview
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {kpis.map(kpi => (
                  <Card key={kpi.title}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                          <kpi.icon className="h-5 w-5 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{kpi.value}</div>
                          {kpi.footer && <p className="text-xs text-muted-foreground">{kpi.footer}</p>}
                      </CardContent>
                  </Card>
              ))}
          </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-5">
        <Card className="md:col-span-3">
            <CardHeader>
            <CardTitle>Sector Activity</CardTitle>
             <CardDescription>Citizen ideas vs. issued directives per sector.</CardDescription>
            </CardHeader>
            <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sectorData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        cursor={{fill: 'hsl(var(--muted))'}}
                        contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)",
                        }}
                    />
                    <Legend iconSize={10} wrapperStyle={{paddingTop: '20px'}}/>
                    <Bar dataKey="ideas" fill="hsl(var(--chart-1))" name="Citizen Ideas" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="directives" fill="hsl(var(--chart-2))" name="Issued Directives" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card className="md:col-span-2">
            <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5"/>Citizen Sentiment</CardTitle>
             <CardDescription>Satisfaction score trend over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={sentimentData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorSatisfaction" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                        <YAxis domain={[70, 90]} fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                             contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                            }}
                        />
                        <Area type="monotone" dataKey="satisfaction" stroke="hsl(var(--chart-1))" fill="url(#colorSatisfaction)" name="Satisfaction %" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
