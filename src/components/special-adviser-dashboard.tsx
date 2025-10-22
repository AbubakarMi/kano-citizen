
"use client";

import { useState } from "react";
import type { UserProfile, MDA } from "@/lib/data";
import { mdas as initialMdas, initialApprovalItems as allItems } from "@/lib/data";
import { useAppContext } from "@/app/app-provider";
import { Analytics } from "./system-admin/analytics";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { FileUp, Send, Signature, Building, ShieldCheck, Gavel } from "lucide-react";
import { Badge } from "./ui/badge";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useToast } from "@/hooks/use-toast";
import { SpecialAdviserMainDashboard } from "./super-admin/special-adviser-main-dashboard";

interface SpecialAdviserDashboardProps {
  user: UserProfile;
  activeView: string;
}

function ReadyForIssuance() {
    const { approvalQueue, setApprovalQueue } = useAppContext();
    const { toast } = useToast();
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [isIssuanceOpen, setIsIssuanceOpen] = useState(false);
    const [assignedMdaId, setAssignedMdaId] = useState<string>('');
    const mdas = initialMdas;

    const itemsReady = approvalQueue.filter(item => item.status === 'ReadyForIssuance');

    const handleOpenIssuance = (item: any) => {
        setSelectedItem(item);
        setAssignedMdaId('');
        setIsIssuanceOpen(true);
    }

    const handleIssueDirective = () => {
        if (!selectedItem || !assignedMdaId) {
             toast({ variant: "destructive", title: "Error", description: "You must select an MDA to issue the directive." });
            return;
        }

        setApprovalQueue(prev => prev.map(item => 
            item.id === selectedItem.id 
                ? { ...item, status: 'Issued', assignedMdaId: assignedMdaId } 
                : item
        ));
        
        const mdaName = mdas.find(m => m.id === assignedMdaId)?.name;
        toast({
            title: "Directive Issued!",
            description: `"${selectedItem.title}" has been formally issued to ${mdaName}.`,
            className: "bg-primary text-primary-foreground"
        });

        setIsIssuanceOpen(false);
        setSelectedItem(null);
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                <FileUp className="h-6 w-6" />
                Reviewed Submissions: Ready for Issuance
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {itemsReady.length > 0 ? itemsReady.map(item => (
                    <Card key={item.id} className="flex flex-col">
                        <CardHeader>
                            <Badge variant="secondary" className="w-fit mb-2">Approved by Governor</Badge>
                            <CardTitle>{item.title}</CardTitle>
                            <CardDescription>{item.type}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            <div className="p-3 bg-muted rounded-md text-sm space-y-1">
                                <p className="font-semibold flex items-center gap-2"><Signature className="h-4 w-4"/> E-Signature:</p>
                                <div className="relative h-16 w-full">
                                    <img src={item.governorSignature} alt="Governor's Signature" className="h-full w-full object-contain" />
                                </div>
                                <p className="text-xs text-muted-foreground pt-1">Approved on: {item.approvalDate}</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => handleOpenIssuance(item)}>
                                <Send className="mr-2 h-4 w-4"/>
                                Prepare Directive
                            </Button>
                        </CardFooter>
                    </Card>
                )) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        <p>There are no items awaiting directive issuance.</p>
                    </div>
                )}
            </div>

            <Dialog open={isIssuanceOpen} onOpenChange={setIsIssuanceOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Issue Directive: {selectedItem?.title}</DialogTitle>
                        <DialogDescription>
                            Assign this approved item to an MDA for implementation. This will send it to their dashboard.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Select value={assignedMdaId} onValueChange={setAssignedMdaId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an MDA to assign..." />
                            </SelectTrigger>
                            <SelectContent>
                                {mdas.map(mda => (
                                    <SelectItem key={mda.id} value={mda.id}>{mda.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                        <Button onClick={handleIssueDirective} disabled={!assignedMdaId}>Issue Directive</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

const PlaceholderView = ({ title, icon: Icon }: { title: string, icon: React.ElementType }) => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <Icon className="h-6 w-6" />
            {title}
        </h2>
        <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
                <p>The interface for '{title}' will be implemented here.</p>
            </CardContent>
        </Card>
    </div>
);


export function SpecialAdviserDashboard({ user, activeView }: SpecialAdviserDashboardProps) {

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <SpecialAdviserMainDashboard />;
      case 'submissions':
        return <ReadyForIssuance />;
      case 'drafting':
        return <PlaceholderView title="Directive Drafting" icon={Gavel} />;
      case 'mda-monitor':
        return <PlaceholderView title="MDA Performance Monitor" icon={Building} />;
      case 'moderation':
        return <PlaceholderView title="Moderation Oversight" icon={ShieldCheck} />;
      case 'analytics':
        return <Analytics />;
      default:
        return <SpecialAdviserMainDashboard />;
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Special Adviser Command Center</h1>
      {renderView()}
    </div>
  );
}
