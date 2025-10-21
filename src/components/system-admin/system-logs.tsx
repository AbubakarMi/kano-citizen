
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FileClock } from "lucide-react";

export const SystemLogs = () => (
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
