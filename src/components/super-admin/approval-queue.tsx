
"use client";

import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileCheck, FileX, Info, RefreshCcw, XCircle, ShieldCheck, Signature, Pencil } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback } from "../ui/avatar";
import type { ApprovalItem, ApprovalStatus } from "@/lib/data";
import { useAppContext } from "@/app/app-provider";
import SignaturePad from "react-signature-canvas";
import Image from "next/image";


export function ApprovalQueue() {
    const { toast } = useToast();
    const { approvalQueue, setApprovalQueue } = useAppContext();
    const sigPad = useRef<SignaturePad>(null);
    
    const [activeItem, setActiveItem] = useState<ApprovalItem | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isActionOpen, setIsActionOpen] = useState(false);
    const [isSignatureOpen, setIsSignatureOpen] = useState(false);
    const [actionType, setActionType] = useState<"Approve" | "Reject">("Approve");
    const [reason, setReason] = useState("");
    const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
    
    const getSubmitterInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

    const openRejectDialog = (item: ApprovalItem) => {
        setActiveItem(item);
        setActionType("Reject");
        setReason("");
        setIsActionOpen(true);
    };

    const openApproveDialog = (item: ApprovalItem) => {
        setActiveItem(item);
        setReason("");
        setSignatureDataUrl(null);
        sigPad.current?.clear();
        setIsSignatureOpen(true);
    }
    
    const openDetailsDialog = (item: ApprovalItem) => {
        setActiveItem(item);
        setIsDetailsOpen(true);
    }

    const handleConfirmRejection = () => {
        if (!activeItem) return;

        setApprovalQueue(prev => prev.map(item => item.id === activeItem.id ? { ...item, status: "Rejected", reason: reason } : item));
        
        toast({
          title: `Decision Recorded`,
          description: `The item has been marked as Rejected.`,
          variant: "destructive",
        });

        setIsActionOpen(false);
        setActiveItem(null);
        setReason("");
    };
    
    const handleConfirmApproval = () => {
        if (!activeItem || !signatureDataUrl) return;

        setApprovalQueue(prev => prev.map(item => 
            item.id === activeItem.id ? { 
                ...item, 
                status: "ReadyForIssuance", 
                governorSignature: signatureDataUrl,
                approvalDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                reason: reason
            } : item));
        
        toast({
          title: `Item Approved`,
          description: `"${activeItem.title}" has been signed and sent to the Special Adviser for issuance.`,
          className: "bg-secondary text-secondary-foreground"
        });
        
        setIsSignatureOpen(false);
        setActiveItem(null);
        setSignatureDataUrl(null);
        setReason("");
        sigPad.current?.clear();
    }

    const handleRevert = (itemToRevert: ApprovalItem) => {
        setApprovalQueue(prev => prev.map(i => i.id === itemToRevert.id ? { ...i, status: 'Pending', reason: undefined, governorSignature: undefined, approvalDate: undefined } : i));
        toast({
            title: "Action Reverted",
            description: `"${itemToRevert.title}" has been moved back to Pending.`,
        });
    }

    const renderTable = (status: ApprovalStatus) => {
        const filteredItems = approvalQueue.filter(item => item.status === status);

        if (filteredItems.length === 0) {
            return <div className="text-center text-muted-foreground p-8">No items in this category.</div>
        }

        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Submitted By</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredItems.map(item => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <div className="font-medium">{item.title}</div>
                                <div className="text-sm text-muted-foreground">{item.type}</div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                                            {getSubmitterInitials(item.submittedBy)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">{item.submittedBy}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => openDetailsDialog(item)}>
                                    <Info className="mr-2 h-4 w-4" /> Details
                                </Button>
                                {status === 'Pending' && (
                                    <>
                                        <Button variant="outline" size="sm" className="text-secondary border-secondary/50 hover:bg-secondary/10 hover:text-secondary" onClick={() => openApproveDialog(item)}>
                                            <FileCheck className="mr-2 h-4 w-4" /> Approve
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive" onClick={() => openRejectDialog(item)}>
                                            <FileX className="mr-2 h-4 w-4" /> Reject
                                        </Button>
                                    </>
                                )}
                                {(status === 'Approved' || status === 'Rejected' || status === 'ReadyForIssuance' || status === 'Issued') && (
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
        <div className="space-y-6 bg-muted/40 p-4 sm:p-6 lg:p-8 rounded-lg -m-4 sm:-m-6 lg:-m-8">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Final Approval Queue</h1>
                    <p className="text-muted-foreground">Review and provide the final sign-off on major SPD outcomes, reports, and system changes.</p>
                </div>
            </div>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-card">
                    <TabsTrigger value="pending">
                        Pending
                        <Badge variant="secondary" className="ml-2">{approvalQueue.filter(i => i.status === 'Pending').length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="ready">Ready for Issuance</TabsTrigger>
                    <TabsTrigger value="issued">Issued</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
                <TabsContent value="pending" className="mt-4">
                     <Card>
                        <CardContent className="p-0">
                            {renderTable('Pending')}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="ready" className="mt-4">
                     <Card>
                        <CardContent className="p-0">
                            {renderTable('ReadyForIssuance')}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="issued" className="mt-4">
                     <Card>
                        <CardContent className="p-0">
                            {renderTable('Issued')}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="rejected" className="mt-4">
                    <Card>
                        <CardContent className="p-0">
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
                        
                        {activeItem?.reason && activeItem.status !== 'Issued' && (
                            <div className="p-4 bg-muted rounded-lg space-y-2">
                                <h4 className="font-semibold flex items-center gap-2 text-sm">
                                    {activeItem.status === 'Rejected' ? <XCircle className="h-4 w-4 text-destructive" /> : <CheckCircle className="h-4 w-4 text-secondary" />}
                                    Governor's Reason for {activeItem.status === "Rejected" ? "Rejection" : "Approval"}
                                </h4>
                                <p className="text-sm text-muted-foreground italic">"{activeItem.reason}"</p>
                            </div>
                        )}
                         {activeItem?.governorSignature && (
                            <div className="p-4 bg-muted rounded-lg space-y-2">
                                <h4 className="font-semibold flex items-center gap-2 text-sm text-secondary">
                                    <Signature className="h-4 w-4" />
                                    Approved by the Executive Governor
                                </h4>
                                <div className="relative h-24 bg-background border border-dashed rounded-md">
                                    <Image src={activeItem.governorSignature} alt="Governor's Signature" layout="fill" objectFit="contain" />
                                </div>
                                 <p className="text-sm text-muted-foreground pt-2">
                                    Date: <span className="font-medium text-foreground">{activeItem.approvalDate}</span>
                                </p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            {/* Rejection Dialog */}
            <Dialog open={isActionOpen} onOpenChange={setIsActionOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Rejection</DialogTitle>
                        <DialogDescription>
                            You are about to reject the item: "{activeItem?.title}". This action can be reverted.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                        <Label htmlFor="reason">Reason for Rejection (Required)</Label>
                        <Textarea 
                            id="reason" 
                            value={reason} 
                            onChange={(e) => setReason(e.target.value)}
                            placeholder={`Provide a clear justification for the rejection...`}
                            rows={4}
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            onClick={handleConfirmRejection}
                            disabled={!reason.trim()}
                            variant={'destructive'}
                        >
                            Confirm Rejection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            {/* Signature (Approval) Dialog */}
            <Dialog open={isSignatureOpen} onOpenChange={setIsSignatureOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Final Executive Approval</DialogTitle>
                        <DialogDescription>
                           To approve "{activeItem?.title}", please provide your e-signature below. This action is final and will forward the item for directive issuance.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label>Governor's E-Signature</Label>
                            <div className="w-full h-40 rounded-lg border border-dashed bg-muted relative">
                                <SignaturePad 
                                    ref={sigPad}
                                    canvasProps={{className: "w-full h-full"}} 
                                    onEnd={() => setSignatureDataUrl(sigPad.current!.toDataURL())}
                                />
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="absolute top-2 right-2 h-7 w-7"
                                    onClick={() => {
                                        sigPad.current?.clear();
                                        setSignatureDataUrl(null);
                                    }}
                                >
                                    <RefreshCcw className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="approval-reason">Reason for Approval (Optional)</Label>
                            <Textarea 
                                id="approval-reason" 
                                value={reason} 
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Optionally, add a comment or reason for approval..."
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            onClick={handleConfirmApproval}
                            disabled={!signatureDataUrl}
                        >
                             <Pencil className="mr-2 h-4 w-4"/>
                            Sign and Approve
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
