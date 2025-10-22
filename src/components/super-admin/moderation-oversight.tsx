
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, ShieldCheck, Check, X, ArrowUpCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const moderationKpis = [
    { title: "Items Moderated (24h)", value: "128" },
    { title: "Approval Rate", value: "92%" },
    { title: "Items Escalated", value: "3" },
    { title: "Avg. Review Time", value: "15 mins" },
];

const escalatedItems = [
    { id: "idea-esc-1", type: "Citizen Idea", title: "Proposal for a state-wide public transportation overhaul", submittedBy: "citizenX@test.com", reason: "High-impact, requires executive review for feasibility." },
    { id: "idea-esc-2", type: "Citizen Idea", title: "Complaint about alleged misconduct in Ministry of Works", submittedBy: "citizenY@test.com", reason: "Serious allegation, beyond standard moderator scope." },
    { id: "idea-esc-3", type: "Comment", title: "Comment on 'Streetlight Repair' directive", submittedBy: "citizenZ@test.com", reason: "Contains potentially sensitive political commentary." },
];

const recentActivity = [
    { id: 1, item: "Idea: 'Community Garden Initiative'", action: "Approved", moderator: "Content Moderator", time: "5m ago" },
    { id: 2, item: "Idea: 'Request for personal loan'", action: "Rejected", moderator: "Content Moderator", time: "12m ago" },
    { id: 3, item: "Comment on 'Public Wi-Fi' poll", action: "Approved", moderator: "Content Moderator", time: "18m ago" },
    { id: 4, item: "Idea: 'Install more traffic lights'", action: "Approved", moderator: "Content Moderator", time: "25m ago" },
];

export function ModerationOversight() {
    const { toast } = useToast();
    const [escalated, setEscalated] = useState(escalatedItems);

    const handleAction = (itemId: string, action: "Approve" | "Reject") => {
        setEscalated(prev => prev.filter(item => item.id !== itemId));
        toast({
            title: `Item ${action}d`,
            description: "The escalated item has been resolved.",
        });
    }
    
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
        <ShieldCheck className="h-6 w-6" />
        Moderation Oversight
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {moderationKpis.map(kpi => (
          <Card key={kpi.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items Escalated for Review</CardTitle>
          <CardDescription>
            These items were flagged by moderators for your review and final decision.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Reason for Escalation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {escalated.length > 0 ? escalated.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">Type: {item.type}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.reason}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => handleAction(item.id, "Approve")}>
                        <Check className="mr-2 h-4 w-4" /> Approve
                    </Button>
                     <Button variant="destructive" size="sm" onClick={() => handleAction(item.id, "Reject")}>
                        <X className="mr-2 h-4 w-4" /> Reject
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                    <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                        No items are currently escalated for review.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Log</CardTitle>
          <CardDescription>A log of recent decisions made by the moderation team.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-start gap-3 text-sm">
                <div>
                  <Badge variant={activity.action === "Approved" ? "secondary" : "destructive"}>
                    {activity.action}
                  </Badge>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground leading-tight">{activity.item}</p>
                  <p className="text-xs text-muted-foreground">by {activity.moderator} - {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
