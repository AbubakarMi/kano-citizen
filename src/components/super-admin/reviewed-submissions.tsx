"use client";

import { useState } from "react";
import type { Idea } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { useFirestore } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";

interface ReviewedSubmissionsProps {
    ideas: Idea[];
    setIdeas: (ideas: Idea[]) => void;
}

export function ReviewedSubmissions({ ideas, setIdeas }: ReviewedSubmissionsProps) {
    const { toast } = useToast();
    const firestore = useFirestore();

    // The Special Adviser reviews ideas that are 'Pending' but have been approved by a moderator.
    const pendingIdeas = ideas.filter(idea => idea.status === 'Pending' && idea.moderatorApproved);

    const handleDecision = async (ideaId: string, decision: 'Approved' | 'Rejected') => {
        if (!firestore) return;

        const ideaRef = doc(firestore, "ideas", ideaId);
        const ideaTitle = ideas.find(idea => idea.id === ideaId)?.title;

        try {
            await updateDoc(ideaRef, { status: decision });
            setIdeas(ideas.map(idea => 
                idea.id === ideaId ? { ...idea, status: decision } : idea
            ));

            toast({
                title: `Submission ${decision}`,
                description: `The idea "${ideaTitle}" has been ${decision.toLowerCase()} and will now proceed to the next stage.`,
                className: decision === 'Approved' ? "bg-secondary text-secondary-foreground" : "bg-destructive text-destructive-foreground",
            });
        } catch (error) {
            console.error(`Error ${decision.toLowerCase()}ing idea:`, error);
            toast({ variant: "destructive", title: "Error", description: `Could not update submission.` });
        }
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
                                    <Button variant="outline" size="sm" className="text-secondary border-secondary/50 hover:bg-secondary/10 hover:text-secondary" onClick={() => handleDecision(idea.id, 'Approved')}>
                                        <Check className="mr-2 h-4 w-4" /> Approve for Polling
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDecision(idea.id, 'Rejected')}>
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
