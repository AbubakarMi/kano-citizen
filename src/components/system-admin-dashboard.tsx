
"use client";

import { useState } from "react";
import type { User, UserRole } from "@/lib/data";
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

const Analytics = () => (
     <Card>
        <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3"><BarChart2 className="h-6 w-6" /> Platform Analytics</CardTitle>
            <CardDescription>Full platform data - participation metrics, traffic sources, user demographics, etc.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">A comprehensive analytics dashboard with customizable reports and data visualizations will be displayed here.</p>
        </CardContent>
    </Card>
)

const SystemLogs = () => (
     <Card>
        <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3"><FileClock className="h-6 w-6" /> System Logs</CardTitle>
            <CardDescription>Access detailed, searchable logs for security, auditing, and advanced debugging purposes.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">A searchable and filterable log viewer for all system and user actions will be available here.</p>
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

    