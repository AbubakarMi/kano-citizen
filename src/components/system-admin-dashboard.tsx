
"use client";

import type { User } from "@/lib/data";
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

const allUsers = [
  { name: "Super Admin", email: "superadmin@test.com", role: "Super Admin", status: "Active" },
  { name: "Aisha Bello", email: "citizen1@test.com", role: "Citizen", status: "Active" },
  { name: "MDA Official", email: "mda@test.com", role: "MDA Official", status: "Active" },
  { name: "Musa Ibrahim", email: "citizen2@test.com", role: "Citizen", status: "Suspended" },
  { name: "Content Moderator", email: "moderator@test.com", role: "Moderator", status: "Active" },
];


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
    </div>
);

const UserManagement = () => (
     <Card>
        <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3"><Users className="h-6 w-6" /> User Management</CardTitle>
            <CardDescription>View, edit, suspend, or delete any user account.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-4">
                <Input placeholder="Search users by name or email..." />
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
                    {allUsers.map(user => (
                        <TableRow key={user.email}>
                            <TableCell>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                            </TableCell>
                            <TableCell><Badge variant={user.role === 'Citizen' ? 'outline' : 'secondary'}>{user.role}</Badge></TableCell>
                            <TableCell><Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>{user.status}</Badge></TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm">Edit</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
)

const Analytics = () => (
     <Card>
        <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3"><BarChart2 className="h-6 w-6" /> Platform Analytics</CardTitle>
            <CardDescription>Full platform data - participation metrics, traffic sources, etc.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">A comprehensive analytics dashboard will be displayed here.</p>
        </CardContent>
    </Card>
)

const SystemLogs = () => (
     <Card>
        <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3"><FileClock className="h-6 w-6" /> System Logs</CardTitle>
            <CardDescription>For security, auditing, and debugging purposes.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">A searchable log viewer will be available here.</p>
        </CardContent>
    </Card>
)

const Configuration = () => (
     <Card>
        <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3"><Settings className="h-6 w-6" /> Platform Configuration</CardTitle>
            <CardDescription>Manage available sectors, M&E metrics, and other platform-wide settings.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Configuration options will be available here.</p>
        </CardContent>
    </Card>
)

export function SystemAdminDashboard({ user }: SystemAdminDashboardProps) {
    // This would be controlled by the sidebar in a real app
    const activeView = "health";

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
