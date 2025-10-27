
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileUp, Send, Signature, Check, MessageSquareWarning, ArrowRight, BookMarked, DraftingCompass, Vote } from "lucide-react";
import { useAppContext } from "@/app/app-provider";

export function SpecialAdviserMainDashboard() {
  const { ideas, approvalQueue, setActiveView } = useAppContext();
  
  const submissionsAwaitingReview = ideas.filter(idea => idea.status === 'Pending' && idea.moderatorApproved).length;
  const directivesReadyForIssuance = approvalQueue.filter(item => item.status === 'ReadyForIssuance').length;
  const activePolls = ideas.filter(i => i.status === 'Approved').length;
  const completedDirectives = approvalQueue.filter(dir => dir.status === 'Issued').length;

  const kpis = [
    { title: "Submissions For Review", value: submissionsAwaitingReview, icon: MessageSquareWarning, action: "submissions" },
    { title: "Active Polls", value: activePolls, icon: Vote, action: "ongoing-votes" },
    { title: "Ready for Issuance", value: directivesReadyForIssuance, icon: FileUp, action: "drafting" },
    { title: "Issued Directives", value: completedDirectives, icon: Check, action: "mda-monitor" },
  ];

  const readyForIssuance = approvalQueue.filter(item => item.status === 'ReadyForIssuance').slice(0, 3);

  return (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Special Adviser Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpis.map(kpi => (
                <Card key={kpi.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                        <kpi.icon className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="pb-2">
                        <div className="text-3xl font-bold">{kpi.value}</div>
                    </CardContent>
                     <CardFooter>
                         <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveView(kpi.action)}>
                            View <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                     </CardFooter>
                </Card>
            ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Jump directly to your primary tasks.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => setActiveView('submissions')}>
                        <BookMarked />
                        <span>Review Submissions</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => setActiveView('drafting')}>
                        <DraftingCompass />
                        <span>Draft Directive</span>
                    </Button>
                     <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => setActiveView('ongoing-votes')}>
                        <Vote />
                        <span>Manage Polls</span>
                    </Button>
                     <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => setActiveView('mda-monitor')}>
                        <Send />
                        <span>Monitor MDAs</span>
                    </Button>
                </CardContent>
            </Card>
      
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
                                        <Button variant="outline" size="sm" onClick={() => setActiveView('drafting')}>
                                            Prepare <ArrowRight className="ml-2 h-4 w-4" />
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
        </div>
    </div>
  );
}
