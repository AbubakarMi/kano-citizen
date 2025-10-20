
"use client";

import { useState } from "react";
import type { User } from "@/lib/data";
import { seededUsers } from "@/lib/data";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Settings,
  Activity,
  Users,
  BarChart2,
  FileClock,
  Server,
  Zap,
  Vote,
  Lightbulb,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, BarChart as RechartsBarChart } from 'recharts';


interface SystemAdminDashboardProps {
  user: User;
  activeView: string;
}

const healthMetrics = [
  {
    title: "Server Load",
    value: "15%",
    status: "Healthy",
    icon: Server,
    color: "text-green-500",
  },
  {
    title: "Active Users (1h)",
    value: "1,204",
    status: "",
    icon: Users,
    color: "text-blue-500",
  },
  {
    title: "API Response Time",
    value: "85ms",
    status: "Fast",
    icon: Zap,
    color: "text-green-500",
  },
  {
    title: "Database Connections",
    value: "42 / 100",
    status: "Nominal",
    icon: Activity,
    color: "text-yellow-500",
  },
];

const allUsers: (User & {status: "Active" | "Suspended"})[] = seededUsers.map((u, i) => ({
    ...u,
    name: u.name,
    email: u.email,
    submittedIdeas: [],
    votedOnIdeas: [],
    followedDirectives: [],
    volunteeredFor: [],
    status: i % 4 === 0 ? "Suspended" : "Active"
}));
// Add more diverse citizens
allUsers.push({ name: "Aisha Bello", email: "citizen1@test.com", role: "Citizen", status: "Active", submittedIdeas:[], votedOnIdeas:[], followedDirectives:[], volunteeredFor:[] });
allUsers.push({ name: "Musa Ibrahim", email: "citizen2@test.com", role: "Citizen", status: "Suspended", submittedIdeas:[], votedOnIdeas:[], followedDirectives:[], volunteeredFor:[] });
allUsers.push({ name: "Fatima Sani", email: "citizen3@test.com", role: "Citizen", status: "Active", submittedIdeas:[], votedOnIdeas:[], followedDirectives:[], volunteeredFor:[] });


const SystemHealth = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <Activity className="h-6 w-6" />
            System Health
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {healthMetrics.map((metric) => (
                <Card key={metric.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                        <metric.icon className={`h-5 w-5 text-muted-foreground ${metric.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metric.value}</div>
                        {metric.status && <p className={`text-xs ${metric.color}`}>{metric.status}</p>}
                    </CardContent>
                </Card>
            ))}
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Real-time Error Logs</CardTitle>
                <CardDescription>Live feed of system errors and warnings.</CardDescription>
            </CardHeader>
            <CardContent>
                <pre className="p-4 bg-muted rounded-lg text-xs h-64 overflow-y-auto">
                    <code>
                        [INFO] 2024-05-21 10:00:15 - User 'citizen@test.com' logged in successfully.<br/>
                        [WARN] 2024-05-21 10:01:03 - API endpoint /api/ideas returned in 350ms (above threshold).<br/>
                        [INFO] 2024-05-21 10:02:40 - New idea 'idea-123' submitted by 'citizen1@test.com'.<br/>
                        [ERROR] 2024-05-21 10:05:22 - Failed to connect to Redis cache: Connection timed out.<br/>
                    </code>
                </pre>
            </CardContent>
        </Card>
    </div>
);

const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3"><Users className="h-6 w-6" /> User Management</CardTitle>
                <CardDescription>View, edit, suspend, or delete any user account.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <Input 
                        placeholder="Search users by name or email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map(user => (
                            <TableRow key={user.email}>
                                <TableCell>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                </TableCell>
                                <TableCell><Badge variant={user.role === 'Citizen' ? 'outline' : 'secondary'}>{user.role}</Badge></TableCell>
                                <TableCell><Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>{user.status}</Badge></TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">Edit</Button>
                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Suspend</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

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

const Analytics = () => (
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
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{
                                    background: "hsl(var(--background))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "var(--radius)",
                                }}
                            />
                            <Legend iconSize={10} />
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
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{
                                    background: "hsl(var(--background))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "var(--radius)",
                                }}
                            />
                            <Legend iconSize={10} />
                            <Bar dataKey="ideas" fill="hsl(var(--primary))" name="New Ideas" radius={[4, 4, 0, 0]} />
                        </RechartsBarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    </div>
)

const SystemLogs = () => (
     <Card>
        <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3"><FileClock className="h-6 w-6" /> System Logs</CardTitle>
            <CardDescription>Access detailed, searchable logs for security, auditing, and advanced debugging purposes.</CardDescription>
        </CardHeader>
        <CardContent>
            <pre className="p-4 bg-muted rounded-lg text-xs h-[400px] overflow-y-auto">
                <code>
                    [INFO] 2024-05-21 10:00:15 - User 'citizen@test.com' logged in successfully.<br/>
                    [WARN] 2024-05-21 10:01:03 - API endpoint /api/ideas returned in 350ms (above threshold).<br/>
                    [INFO] 2024-05-21 10:02:40 - New idea 'idea-123' submitted by 'citizen1@test.com'.<br/>
                    [ERROR] 2024-05-21 10:05:22 - Failed to connect to Redis cache: Connection timed out.<br/>
                    [AUDIT] 2024-05-21 10:08:00 - Super Admin 'superadmin@test.com' changed role of 'moderator@test.com' to 'System Administrator'.<br/>
                    [INFO] 2024-05-21 10:10:11 - User 'citizen3@test.com' upvoted idea 'idea-2'.<br/>
                    [SECURITY] 2024-05-21 10:12:54 - Failed login attempt for user 'unknown@user.com' from IP 192.168.1.10.<br/>
                </code>
            </pre>
        </CardContent>
    </Card>
)

const Configuration = () => (
     <Card>
        <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3"><Settings className="h-6 w-6" /> Platform Configuration</CardTitle>
            <CardDescription>Manage available sectors, M&E metrics, notification templates, and other platform-wide settings.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Detailed configuration options for tailoring the platform's functionality will be available here.</p>
        </CardContent>
    </Card>
)

export function SystemAdminDashboard({ user, activeView }: SystemAdminDashboardProps) {
  const renderView = () => {
    switch (activeView) {
      case 'health':
        return <SystemHealth />;
      case 'users':
        return <UserManagement />;
      case 'analytics':
        return <Analytics />;
      case 'logs':
        return <SystemLogs />;
      case 'settings':
        return <Configuration />;
      default:
        return <SystemHealth />;
    }
  }

  return (
    <div className="space-y-6">
      {renderView()}
    </div>
  );
}
