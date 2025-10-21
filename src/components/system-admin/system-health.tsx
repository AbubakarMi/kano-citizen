
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Activity,
  Users,
  Server,
  Zap,
} from "lucide-react";

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

export const SystemHealth = () => (
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
                        [ERROR] 2024-05-21 10:05:22 - Failed to connect to Redis cache: Connection timed out.
                    </code>
                </pre>
            </CardContent>
        </Card>
    </div>
);
