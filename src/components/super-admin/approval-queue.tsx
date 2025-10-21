

"use client";

import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileCheck, FileX } from "lucide-react";

const approvalItems = [
    { id: "app-1", type: "SPD Communiqué", title: "Report from Q2 Special Public Dialogue on Security", submittedBy: "SPD Coordinator", status: "Pending"},
    { id: "app-2", type: "Policy Brief", title: "Recommendations for Waste Management Improvement", submittedBy: "Moderator", status: "Pending"},
    { id: "app-3", type: "System Change", title: "New User Role: 'Community Champion'", submittedBy: "System Administrator", status: "Approved"},
]

export function ApprovalQueue() {
    const { toast } = useToast();

    const handleApproval = (status: "Approved" | "Rejected") => {
        toast({
          title: `Decision Recorded`,
          description: `The item has been marked as ${status}.`,
          className: status === 'Approved' ? 'bg-secondary text-secondary-foreground' : 'bg-destructive text-destructive-foreground',
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Approval Queue</CardTitle>
                <CardDescription>Review and approve major SPD outcomes, reports, and system changes before they are made public or implemented.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Submitted By</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {approvalItems.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.title}</TableCell>
                                <TableCell><Badge variant="outline">{item.type}</Badge></TableCell>
                                <TableCell>{item.submittedBy}</TableCell>
                                <TableCell><Badge variant={item.status === 'Approved' ? 'secondary' : item.status === 'Pending' ? 'default' : 'destructive'}>{item.status}</Badge></TableCell>
                                <TableCell className="text-right space-x-2">
                                    {item.status === "Pending" && <>
                                        <Button variant="ghost" size="sm" className="text-secondary hover:text-secondary" onClick={() => handleApproval('Approved')}>
                                            <FileCheck className="mr-2 h-4 w-4" /> Approve
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleApproval('Rejected')}>
                                            <FileX className="mr-2 h-4 w-4" /> Reject
                                        </Button>
                                    </>}
                                    {item.status === "Approved" && <span className="flex items-center justify-end text-secondary text-sm font-medium"><CheckCircle className="mr-2 h-4 w-4"/>Approved</span>}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
