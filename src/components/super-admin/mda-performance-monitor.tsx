
"use client";

import { useAppContext } from "@/app/app-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mdas } from "@/lib/data";
import { Building, CheckCircle, Clock } from "lucide-react";
import { Badge } from "../ui/badge";

export function MDAPerformanceMonitor() {
    const { approvalQueue } = useAppContext();

    const mdaMetrics = mdas.map(mda => {
        const assignedDirectives = approvalQueue.filter(item => item.assignedMdaId === mda.id && (item.status === 'Issued' || item.status === 'Completed'));
        // In a real app, 'Completed' would be a status set by the MDA. Here we simulate it.
        // For simulation, let's say every 2nd directive is completed.
        const completedDirectives = assignedDirectives.filter((_, index) => index % 2 === 0);
        
        const completionRate = assignedDirectives.length > 0
            ? (completedDirectives.length / assignedDirectives.length) * 100
            : 0;

        return {
            ...mda,
            assignedCount: assignedDirectives.length,
            completedCount: completedDirectives.length,
            completionRate: completionRate,
            directives: assignedDirectives,
        };
    });

    return (
        <div className="space-y-6">
             <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                <Building className="h-6 w-6" />
                MDA Performance Monitor
            </h2>
            <div className="grid gap-8">
                {mdaMetrics.map(mda => (
                    <Card key={mda.id}>
                        <CardHeader>
                            <CardTitle>{mda.name}</CardTitle>
                            <CardDescription>Performance overview and assigned directives.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-6 mb-6">
                                <div className="p-4 bg-muted rounded-lg">
                                    <h4 className="text-sm font-medium text-muted-foreground">Directives Assigned</h4>
                                    <p className="text-3xl font-bold">{mda.assignedCount}</p>
                                </div>
                                <div className="p-4 bg-muted rounded-lg">
                                    <h4 className="text-sm font-medium text-muted-foreground">Directives Completed</h4>
                                    <p className="text-3xl font-bold">{mda.completedCount}</p>
                                </div>
                                <div className="p-4 bg-muted rounded-lg">
                                    <h4 className="text-sm font-medium text-muted-foreground">Completion Rate</h4>
                                    <p className="text-3xl font-bold">{mda.completionRate.toFixed(0)}%</p>
                                    <Progress value={mda.completionRate} className="mt-2 h-2" />
                                </div>
                            </div>
                            
                            <h4 className="font-semibold mb-2">Assigned Directives Log</h4>
                            {mda.directives.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Directive</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Approval Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mda.directives.map((dir, index) => (
                                            <TableRow key={dir.id}>
                                                <TableCell className="font-medium">{dir.title}</TableCell>
                                                <TableCell>
                                                    {/* Simulating status */}
                                                    {index % 2 === 0 ? (
                                                        <Badge variant="secondary" className="gap-1.5 pl-1.5">
                                                            <CheckCircle className="h-3.5 w-3.5" />
                                                            Completed
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="default" className="gap-1.5 pl-1.5">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            In Progress
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">{dir.approvalDate}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    No directives assigned to this MDA yet.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
