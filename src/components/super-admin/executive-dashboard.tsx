

"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Users, FileText, Smile, HardHat, TrendingUp, Sun, CircleDollarSign, ShoppingCart, Repeat, ArrowUp, ArrowDown, Vote } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, PieChart, Cell } from 'recharts';
import type { User } from "@/lib/data";


const kpis = [
    { title: "Active Users", value: "15,342", change: "+2.5%", changeType: 'increase', icon: Users },
    { title: "Directives Issued", value: "25", change: "+0.5%", changeType: 'increase', icon: FileText },
    { title: "Citizen Satisfaction", value: "88%", change: "-0.2%", changeType: 'decrease', icon: Smile },
    { title: "Total Ideas", value: "4,821", change: "+0.12%", changeType: 'increase', icon: HardHat },
];

const sectorData = [
  { name: 'Health', ideas: 45, directives: 5 },
  { name: 'Infrastructure', ideas: 82, directives: 8 },
  { name: 'Education', ideas: 65, directives: 4 },
  { name: 'Security', ideas: 32, directives: 3 },
  { name: 'Environment', ideas: 51, directives: 5 },
  { name: 'Agriculture', ideas: 28, directives: 2 },
  { name: 'Economy', ideas: 41, directives: 3 },
];

const ideasBySector = [
  { name: 'Infrastructure', value: 82, color: 'hsl(var(--chart-1))' },
  { name: 'Education', value: 65, color: 'hsl(var(--chart-2))' },
  { name: 'Environment', value: 51, color: 'hsl(var(--chart-3))' },
  { name: 'Health', value: 45, color: 'hsl(var(--chart-4))' },
  { name: 'Economy', value: 41, color: 'hsl(var(--chart-5))' },
  { name: 'Security', value: 32, color: 'hsl(var(--chart-3))' },
  { name: 'Agriculture', value: 28, color: 'hsl(var(--chart-2))' },
]


interface ExecutiveDashboardProps {
    user: User;
}

export function ExecutiveDashboard({ user }: ExecutiveDashboardProps) {
  return (
    <div className="space-y-6">
        <div className="flex justify-between items-start">
             <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
             {/* Time period selector can be added here */}
        </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {kpis.map(kpi => (
                  <Card key={kpi.title} className="shadow-sm">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                          <kpi.icon className="h-5 w-5 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{kpi.value}</div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                              {kpi.changeType === 'increase' ? <ArrowUp className="h-3 w-3 text-green-500" /> : <ArrowDown className="h-3 w-3 text-red-500" />}
                              <span className={kpi.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}>{kpi.change}</span>
                          </p>
                      </CardContent>
                  </Card>
              ))}
          </div>
      
      <div className="grid gap-6 grid-cols-1">
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Sector Activity</CardTitle>
                <CardDescription>Citizen ideas vs. issued directives per sector.</CardDescription>
            </CardHeader>
            <CardContent>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={sectorData}>
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
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{paddingTop: '20px'}}/>
                    <Bar dataKey="ideas" fill="hsl(var(--chart-2))" name="Citizen Ideas" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="directives" fill="hsl(var(--chart-1))" name="Issued Directives" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Ideas by Sector</CardTitle>
                <CardDescription>Breakdown of all submitted ideas by their assigned sector.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={ideasBySector}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            innerRadius={70}
                            dataKey="value"
                            strokeWidth={2}
                        >
                            {ideasBySector.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
                    {ideasBySector.map(entry => (
                        <div key={entry.name} className="flex items-center text-sm">
                            <span className="w-2.5 h-2.5 rounded-full mr-2" style={{backgroundColor: entry.color}}></span>
                            <span>{entry.name}</span>
                            <span className="ml-auto font-medium">{entry.value}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
        <Card>
            {/* Placeholder for another chart or table, e.g. "Directives by Country" from the design */}
             <CardHeader>
                <CardTitle>Activity Feed</CardTitle>
                <CardDescription>Latest actions from citizens and admins.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Vote className="h-5 w-5 text-primary"/>
                        </div>
                        <div>
                            <p className="text-sm font-medium">New vote cast for 'Community Solar Power Initiative'</p>
                            <p className="text-xs text-muted-foreground">by citizen@test.com - 2 minutes ago</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-secondary"/>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Directive 'Streetlight Repair' has been marked as Completed</p>
                            <p className="text-xs text-muted-foreground">by mda@test.com - 1 hour ago</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-destructive"/>
                        </div>
                        <div>
                            <p className="text-sm font-medium">New user 'Aisha Bello' registered.</p>
                            <p className="text-xs text-muted-foreground">3 hours ago</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
