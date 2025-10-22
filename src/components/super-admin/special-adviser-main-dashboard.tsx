
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileUp, Send, Signature, Check, MessageSquareWarning, ArrowRight } from "lucide-react";
import { useAppContext } from "@/app/app-provider";

const kpis = [
    { title: "Submissions Awaiting Review", value: "24", icon: MessageSquareWarning },
    { title: "Directives Ready for Issuance", value: "3", icon: FileUp },
    { title: "Active Directives", value: "12", icon: Send },
    { title: "Completed Directives (30d)", value: "5", icon: Check },
];

export function SpecialAdviserMainDashboard() {
  const { approvalQueue, setActiveView } = useAppContext();
  
  const readyForIssuance = approvalQueue.filter(item => item.status === 'ReadyForIssuance').slice(0, 3);
  
  // Mock data for moderation activity
  const moderationActivity = [
    { id: 1, action: "Approved", item: "Idea: 'Community Garden Initiative'", moderator: "Content Moderator", time: "5m ago" },
    { id: 2, action: "Rejected", item: "Idea: 'Request for personal loan'", moderator: "Content Moderator", time: "12m ago" },
    { id: 3, action: "Escalated", item: "Idea: 'Kano Market Modernization'", moderator: "Content Moderator", time: "28m ago" },
  ]

  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpis.map(kpi => (
                <Card key={kpi.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
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
                <CardTitle>Ready for Directive Issuance</CardTitle>
                <CardDescription>Items approved by the Governor awaiting your action.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {readyForIssuance.length > 0 ? readyForIssuance.map(item => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <div className="font-medium">{item.title}</div>
                                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                        <Signature className="h-4 w-4"/>
                                        Signed on {item.approvalDate}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" onClick={() => setActiveView('submissions')}>
                                        Prepare Directive <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                           <TableRow>
                               <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                                   No items are currently awaiting issuance.
                               </TableCell>
                           </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Recent Moderation Activity</CardTitle>
                <CardDescription>A summary of the latest content reviews.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {moderationActivity.map(activity => (
                    <div key={activity.id} className="flex items-start gap-3 text-sm">
                        <div>
                            <Badge variant={activity.action === "Approved" ? "secondary" : activity.action === "Rejected" ? "destructive" : "default"}>
                                {activity.action}
                            </Badge>
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-foreground leading-tight">{activity.item}</p>
                            <p className="text-xs text-muted-foreground">by {activity.moderator} - {activity.time}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
