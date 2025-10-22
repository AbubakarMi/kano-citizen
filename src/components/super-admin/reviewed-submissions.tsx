
"use client";

import { useState } from "react";
import type { Idea } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Badge } from "../ui/badge";

interface ReviewedSubmissionsProps {
    ideas: Idea[];
    setIdeas: (ideas: Idea[]) => void;
}

export function ReviewedSubmissions({ ideas, setIdeas }: ReviewedSubmissionsProps) {
    const { toast } = useToast();
    const pendingIdeas = ideas.filter(idea => idea.status === 'Pending');

    const handleDecision = (ideaId: string, decision: 'Approved' | 'Rejected') => {
        setIdeas(ideas.map(idea => 
            idea.id === ideaId ? { ...idea, status: decision } : idea
        ));

        const ideaTitle = ideas.find(idea => idea.id === ideaId)?.title;
        toast({
            title: `Submission ${decision}`,
            description: `The idea "${ideaTitle}" has been ${decision.toLowerCase()} and will now proceed to the next stage.`,
            className: decision === 'Approved' ? "bg-secondary text-secondary-foreground" : "bg-destructive text-destructive-foreground",
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Reviewed Citizen Submissions</CardTitle>
                <CardDescription>
                    These ideas have passed initial moderation and are awaiting your approval to become live polls.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Submission</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pendingIdeas.length > 0 ? pendingIdeas.map(idea => (
                            <TableRow key={idea.id}>
                                <TableCell>
                                    <p className="font-medium">{idea.title}</p>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{idea.description}</p>
                                </TableCell>
                                <TableCell>{idea.author}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="outline" size="sm" className="text-secondary border-secondary hover:bg-secondary/10 hover:text-secondary" onClick={() => handleDecision(idea.id, 'Approved')}>
                                        <Check className="mr-2 h-4 w-4" /> Approve for Polling
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDecision(idea.id, 'Rejected')}>
                                        <X className="mr-2 h-4 w-4" /> Reject
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                                    There are no submissions awaiting your review.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

    