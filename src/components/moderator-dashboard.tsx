
"use client";

import { useState } from "react";
import type { Idea, UserProfile } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Check, X, Info } from "lucide-react";
import { useAppContext } from "@/app/app-provider";
import { useToast } from "@/hooks/use-toast";
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
import { useFirestore } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";

interface ModeratorDashboardProps {
  user: UserProfile;
}

export function ModeratorDashboard({ user }: ModeratorDashboardProps) {
    const { ideas, setIdeas } = useAppContext();
    const { toast } = useToast();
    const firestore = useFirestore();
    
    // The moderator's queue consists of ideas that are "Pending" and have not yet been approved by a moderator.
    const moderationQueue = ideas.filter(idea => idea.status === 'Pending' && !idea.moderatorApproved);

    const handleApprove = async (idea: Idea) => {
        if (!firestore) return;
        
        // "Approving" an idea means it's good to go to the Special Adviser.
        // It remains in the "Pending" state for the Special Adviser to review.
        // We set a flag to remove it from the moderator's view.
        const ideaRef = doc(firestore, "ideas", idea.id);
        try {
            await updateDoc(ideaRef, { moderatorApproved: true });
            setIdeas(prev => prev.map(i => i.id === idea.id ? { ...i, moderatorApproved: true } : i));
            toast({
                title: "Submission Approved",
                description: `"${idea.title}" has been escalated to the Special Adviser.`,
                className: "bg-secondary text-secondary-foreground"
            });
        } catch (error) {
            console.error("Error approving idea:", error);
            toast({ variant: "destructive", title: "Error", description: "Could not approve submission." });
        }
    };

    const handleReject = async (ideaToReject: Idea) => {
        if (!firestore) return;
        // Rejecting an idea sets its status to "Rejected".
        const ideaRef = doc(firestore, "ideas", ideaToReject.id);
        try {
            await updateDoc(ideaRef, { status: "Rejected" });
            setIdeas(prevIdeas => prevIdeas.map(idea => 
                idea.id === ideaToReject.id ? { ...idea, status: "Rejected" } : idea
            ));
            toast({
                title: "Submission Rejected",
                description: `"${ideaToReject.title}" has been removed from the platform.`,
                variant: "destructive"
            });
        } catch (error) {
            console.error("Error rejecting idea:", error);
            toast({ variant: "destructive", title: "Error", description: "Could not reject submission." });
        }
    };

  return (
    <div className="container py-10">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
        Moderator Dashboard
      </h1>
      <p className="text-muted-foreground mt-2 text-lg">Welcome, {user.name}.</p>

       <div className="mt-8 grid gap-6">
        <Card>
            <CardHeader className="flex flex-row items-start justify-between">
                <div className="space-y-1.5">
                    <CardTitle>Content Moderation Queue</CardTitle>
                    <CardDescription>
                        Review and filter citizen submissions. Approved items are escalated to the Special Adviser.
                    </CardDescription>
                </div>
                 <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-base">
                        {moderationQueue.length}
                    </Badge>
                    <ShieldCheck className="h-8 w-8 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Submission Details</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {moderationQueue.length > 0 ? moderationQueue.map(idea => (
                            <TableRow key={idea.id}>
                                <TableCell>
                                    <p className="font-medium">{idea.title}</p>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{idea.description}</p>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">{idea.author}</TableCell>
                                <TableCell className="text-right space-x-2">
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="text-secondary border-secondary/50 hover:bg-secondary/10 hover:text-secondary">
                                                <Check className="mr-2 h-4 w-4" /> Approve
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Approve this Submission?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will escalate the idea "{idea.title}" to the Office of the Special Adviser for review. It will be removed from your queue.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleApprove(idea)}>
                                                    Yes, Approve
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                             <Button variant="outline" size="sm" className="text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive">
                                                <X className="mr-2 h-4 w-4" /> Reject
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Reject this Submission?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. It will permanently mark the idea "{idea.title}" as "Rejected" and remove it from the platform.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleReject(idea)} className="bg-destructive hover:bg-destructive/90">
                                                    Yes, Reject
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                                    The moderation queue is empty. Well done!
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
