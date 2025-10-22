
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Check, X, Send, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/app/app-provider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUser } from "@/firebase/auth/use-user";

const moderationKpis = [
    { title: "Items Moderated (24h)", value: "128" },
    { title: "Approval Rate", value: "92%" },
    { title: "Items Escalated", value: "3" },
    { title: "Avg. Review Time", value: "15 mins" },
];

const initialEscalatedItems = [
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

type EscalatedItem = typeof initialEscalatedItems[0];

export function ModerationOversight() {
    const { toast } = useToast();
    const { user } = useUser();
    const { setApprovalQueue } = useAppContext();
    const [escalated, setEscalated] = useState(initialEscalatedItems);
    const [selectedItem, setSelectedItem] = useState<EscalatedItem | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    
    const handleApproveAndSend = (itemToApprove: EscalatedItem) => {
        // Add to governor's queue
        const newApprovalItem = {
            id: `escalated-${itemToApprove.id}-${Date.now()}`,
            type: `Escalated Item: ${itemToApprove.type}`,
            title: itemToApprove.title,
            description: `Reason for Escalation: ${itemToApprove.reason}`,
            submittedBy: user?.profile?.name || 'Special Adviser',
            status: 'Pending' as const,
        };
        setApprovalQueue(prev => [newApprovalItem, ...prev]);

        // Remove from local state
        setEscalated(prev => prev.filter(item => item.id !== itemToApprove.id));
        
        toast({
            title: "Item Sent to Governor",
            description: `"${itemToApprove.title}" is now pending final executive approval.`,
            className: "bg-primary text-primary-foreground",
        });
        setSelectedItem(null);
    }

    const handleReject = (itemToReject: EscalatedItem) => {
        setEscalated(prev => prev.filter(item => item.id !== itemToReject.id));
        toast({
            variant: "destructive",
            title: "Escalation Rejected",
            description: `"${itemToReject.title}" has been rejected and will not be forwarded.`,
        });
    }

    const handleViewDetails = (item: EscalatedItem) => {
        setSelectedItem(item);
        setIsDetailsOpen(true);
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
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(item)}>
                        <Info className="mr-2 h-4 w-4" /> Details
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="outline" size="sm" className="text-secondary border-secondary/50 hover:bg-secondary/10 hover:text-secondary" onClick={() => setSelectedItem(item)}>
                            <Check className="mr-2 h-4 w-4" /> Approve
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will send the item "{selectedItem?.title}" to the Governor for final approval. Are you sure?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setSelectedItem(null)}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => selectedItem && handleApproveAndSend(selectedItem)}>Confirm</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                     <Button variant="destructive" size="sm" onClick={() => handleReject(item)}>
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

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{selectedItem?.title}</DialogTitle>
                <DialogDescription>Type: {selectedItem?.type} | Submitted By: {selectedItem?.submittedBy}</DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <h4 className="font-semibold mb-2">Reason for Escalation:</h4>
                <p className="text-muted-foreground bg-muted/50 p-3 rounded-md">{selectedItem?.reason}</p>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button>Close</Button></DialogClose>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
