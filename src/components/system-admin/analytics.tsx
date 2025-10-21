
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Users,
  Activity,
  Vote,
  Lightbulb,
  BarChart2
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, BarChart as RechartsBarChart } from 'recharts';

const analyticsKpis = [
    { title: "Total Users", value: "15,342", icon: Users },
    { title: "Total Ideas Submitted", value: "4,821", icon: Lightbulb },
    { title: "Total Votes Cast", value: "121,988", icon: Vote },
    { title: "Engagement Rate", value: "62.5%", icon: Activity },
]

const userGrowthData = [
    { month: "Jan", users: 800 },
    { month: "Feb", users: 1200 },
    { month: "Mar", users: 2500 },
    { month: "Apr", users: 4000 },
    { month: "May", users: 9000 },
    { month: "Jun", users: 15342 },
];

const ideaSubmissionData = [
    { month: "Jan", ideas: 150 },
    { month: "Feb", ideas: 300 },
    { month: "Mar", ideas: 600 },
    { month: "Apr", ideas: 1100 },
    { month: "May", ideas: 1800 },
    { month: "Jun", ideas: 871 },
];

export const Analytics = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <BarChart2 className="h-6 w-6" />
            Platform Analytics
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             {analyticsKpis.map(kpi => (
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
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>Total platform users over the last 6 months.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                         <LineChart data={userGrowthData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{
                                    background: "hsl(var(--background))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "var(--radius)",
                                }}
                            />
                            <Legend iconSize={10} wrapperStyle={{paddingTop: '20px'}}/>
                            <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} name="New Users" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Idea Submission Trends</CardTitle>
                    <CardDescription>New ideas submitted by citizens each month.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <RechartsBarChart data={ideaSubmissionData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                            <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{
                                    background: "hsl(var(--background))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "var(--radius)",
                                }}
                            />
                            <Legend iconSize={10} wrapperStyle={{paddingTop: '20px'}} />
                            <Bar dataKey="ideas" fill="hsl(var(--primary))" name="New Ideas" radius={[4, 4, 0, 0]} />
                        </RechartsBarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    </div>
)
