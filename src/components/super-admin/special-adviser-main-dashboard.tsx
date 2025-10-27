
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileUp, Send, Signature, Check, MessageSquareWarning, ArrowRight } from "lucide-react";
import { useAppContext } from "@/app/app-provider";

export function SpecialAdviserMainDashboard() {
  const { ideas, directives, approvalQueue, setActiveView } = useAppContext();
  
  const submissionsAwaitingReview = ideas.filter(idea => idea.status === 'Pending' && idea.moderatorApproved).length;
  const directivesReadyForIssuance = approvalQueue.filter(item => item.status === 'ReadyForIssuance').length;
  const activeDirectives = directives.filter(dir => dir.status === 'In Progress' || dir.status === 'Ana ci gaba').length;
  const completedDirectives = directives.filter(dir => dir.status === 'Completed' || dir.status === 'An kammala').length;

  const kpis = [
    { title: "Submissions Awaiting Review", value: submissionsAwaitingReview, icon: MessageSquareWarning },
    { title: "Directives Ready for Issuance", value: directivesReadyForIssuance, icon: FileUp },
    { title: "Active Directives", value: activeDirectives, icon: Send },
    { title: "Completed Directives", value: completedDirectives, icon: Check },
  ];

  const readyForIssuance = approvalQueue.filter(item => item.status === 'ReadyForIssuance').slice(0, 3);

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
    </div>
  );
}
