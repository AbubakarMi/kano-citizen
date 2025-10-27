
"use client";

import { useMemo } from "react";
import { format, toDate } from "date-fns";
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
import { useAppContext } from "@/app/app-provider";
import { seededUsers, type UserProfile, type Idea } from "@/lib/data";

const processDataByMonth = (data: (Idea[] | UserProfile[] | undefined)) => {
    if (!data) return [];
    
    const monthlyCounts: { [key: string]: number } = {};

    data.forEach(item => {
        // Firebase Timestamps can be objects with seconds, or JS Dates from seeded data
        const date = item.createdAt ? toDate(item.createdAt.seconds ? item.createdAt.seconds * 1000 : item.createdAt) : new Date();
        const month = format(date, "MMM");
        monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    });

    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const chartData = monthOrder.map(month => ({
        month,
        count: monthlyCounts[month] || 0
    }));

    return chartData;
};


export const Analytics = () => {
    const { ideas } = useAppContext();
    const allUsers = seededUsers;

    const ideaSubmissionData = useMemo(() => processDataByMonth(ideas).map(d => ({ month: d.month, ideas: d.count })), [ideas]);
    const userGrowthData = useMemo(() => processDataByMonth(allUsers).map(d => ({ month: d.month, users: d.count })), [allUsers]);

    const totalIdeas = ideas.length;
    const totalVotes = ideas.reduce((acc, idea) => acc + (idea.upvotes?.length || 0), 0);
    const totalUsers = allUsers.length; 
    const engagementRate = "N/A"; // True engagement requires more detailed tracking

    const analyticsKpis = [
        { title: "Total Users", value: totalUsers.toString(), icon: Users },
        { title: "Total Ideas Submitted", value: totalIdeas.toString(), icon: Lightbulb },
        { title: "Total Votes Cast", value: totalVotes.toLocaleString(), icon: Vote },
        { title: "Engagement Rate", value: engagementRate, icon: Activity },
    ]

    return (
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
                        <CardDescription>Total platform users registered per month.</CardDescription>
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
}
