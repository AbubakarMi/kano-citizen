

"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileCheck, FileText, FileX, Info, RefreshCcw, XCircle, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

type ApprovalStatus = "Pending" | "Approved" | "Rejected";

type ApprovalItem = { 
    id: string; 
    type: string; 
    title: string; 
    description: string;
    submittedBy: string; 
    status: ApprovalStatus;
    reason?: string;
};

const initialApprovalItems: ApprovalItem[] = [
    { id: "app-1", type: "SPD Communiqué", title: "Report from Q2 Special Public Dialogue on Security", description: "This is a detailed report from the Q2 SPD meeting focused on community policing initiatives and neighborhood watch programs.", submittedBy: "SPD Coordinator", status: "Pending"},
    { id: "app-2", type: "Policy Brief", title: "Recommendations for Waste Management Improvement", description: "A policy brief outlining three key recommendations for improving waste collection efficiency and introducing recycling incentives.", submittedBy: "Moderator", status: "Pending"},
    { id: "app-3", type: "System Change", title: "New User Role: 'Community Champion'", description: "Proposal for a new user role to recognize and grant additional privileges to highly active and constructive community members.", submittedBy: "System Administrator", status: "Approved", reason: "Excellent idea for boosting engagement. Approved for implementation in Q3."},
    { id: "app-4", type: "Idea for Directive", title: "Kano Market Modernization", description: "An idea to modernize the Kantin Kwari market with better stalls, improved sanitation, and a digital payment system.", submittedBy: "Citizen via Moderator", status: "Rejected", reason: "This project is too large for the current budget cycle. Please resubmit with a phased approach for consideration next year."},
]

export function ApprovalQueue() {
    const { toast } = useToast();
    const [items, setItems] = useState<ApprovalItem[]>(initialApprovalItems);
    const [activeItem, setActiveItem] = useState<ApprovalItem | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isActionOpen, setIsActionOpen] = useState(false);
    const [actionType, setActionType] = useState<"Approved" | "Rejected">("Approved");
    const [reason, setReason] = useState("");

    const openActionDialog = (item: ApprovalItem, type: "Approved" | "Rejected") => {
        setActiveItem(item);
        setActionType(type);
        setReason("");
        setIsActionOpen(true);
    };
    
    const openDetailsDialog = (item: ApprovalItem) => {
        setActiveItem(item);
        setIsDetailsOpen(true);
    }

    const handleAction = () => {
        if (!activeItem) return;

        const newStatus = actionType;
        setItems(items.map(item => item.id === activeItem.id ? { ...item, status: newStatus, reason: reason } : item));
        
        toast({
          title: `Decision Recorded`,
          description: `The item has been marked as ${newStatus}.`,
          className: newStatus === 'Approved' ? 'bg-secondary text-secondary-foreground' : 'bg-destructive text-destructive-foreground',
        });

        setIsActionOpen(false);
        setActiveItem(null);
        setReason("");
    };

    const handleRevert = (item: ApprovalItem) => {
        setItems(items.map(i => i.id === item.id ? { ...i, status: 'Pending', reason: undefined } : i));
        toast({
            title: "Action Reverted",
            description: `"${item.title}" has been moved back to Pending.`,
        });
    }

    const renderTable = (status: ApprovalStatus) => {
        const filteredItems = items.filter(item => item.status === status);

        if (filteredItems.length === 0) {
            return <div className="text-center text-muted-foreground p-8">No items in this category.</div>
        }

        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Submitted By</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredItems.map(item => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell><Badge variant="outline">{item.type}</Badge></TableCell>
                            <TableCell>{item.submittedBy}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => openDetailsDialog(item)}>
                                    <Info className="mr-2 h-4 w-4" /> View Details
                                </Button>
                                {status === 'Pending' && (
                                    <>
                                        <Button variant="ghost" size="sm" className="text-secondary hover:text-secondary" onClick={() => openActionDialog(item, 'Approved')}>
                                            <FileCheck className="mr-2 h-4 w-4" /> Approve
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => openActionDialog(item, 'Rejected')}>
                                            <FileX className="mr-2 h-4 w-4" /> Reject
                                        </Button>
                                    </>
                                )}
                                {(status === 'Approved' || status === 'Rejected') && (
                                     <Button variant="ghost" size="sm" onClick={() => handleRevert(item)}>
                                        <RefreshCcw className="mr-2 h-4 w-4" /> Revert to Pending
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Final Approval Queue</h1>
                    <p className="text-muted-foreground">Review and provide the final sign-off on major SPD outcomes, reports, and system changes.</p>
                </div>
            </div>

            <Tabs defaultValue="pending">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pending">
                        Pending
                        <Badge variant="secondary" className="ml-2">{items.filter(i => i.status === 'Pending').length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
                <TabsContent value="pending" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Items Awaiting Your Decision</CardTitle>
                            <CardDescription>These items have been vetted and are ready for your final approval or rejection.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {renderTable('Pending')}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="approved" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Approved Items</CardTitle>
                            <CardDescription>A log of all items that have received your final approval.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {renderTable('Approved')}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="rejected" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Rejected Items</CardTitle>
                            <CardDescription>A log of all items that were rejected during the final review stage.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {renderTable('Rejected')}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{activeItem?.title}</DialogTitle>
                        <DialogDescription>
                            <Badge variant="outline">{activeItem?.type}</Badge> submitted by <span className="font-medium">{activeItem?.submittedBy}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <p className="text-sm text-muted-foreground">{activeItem?.description}</p>
                        {activeItem?.reason && (
                            <div className="p-4 bg-muted rounded-lg space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    {activeItem.status === 'Approved' ? <CheckCircle className="h-4 w-4 text-secondary" /> : <XCircle className="h-4 w-4 text-destructive" />}
                                    Reason for {activeItem.status}
                                </h4>
                                <p className="text-sm text-muted-foreground italic">"{activeItem.reason}"</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            {/* Action Dialog (Approve/Reject) */}
            <Dialog open={isActionOpen} onOpenChange={setIsActionOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm {actionType}</DialogTitle>
                        <DialogDescription>
                            You are about to {actionType.toLowerCase()} the item: "{activeItem?.title}".
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                        <Label htmlFor="reason">Reason (optional for approval, required for rejection)</Label>
                        <Textarea 
                            id="reason" 
                            value={reason} 
                            onChange={(e) => setReason(e.target.value)}
                            placeholder={`Provide a clear justification for the ${actionType.toLowerCase()}...`}
                            rows={4}
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            onClick={handleAction}
                            disabled={actionType === 'Rejected' && !reason.trim()}
                            variant={actionType === 'Rejected' ? 'destructive' : 'default'}
                        >
                            Confirm {actionType}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
