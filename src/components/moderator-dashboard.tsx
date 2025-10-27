
"use client";

import { useState } from "react";
import type { Idea, UserProfile, Testimonial } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Check, X, Info, Star } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ModeratorDashboardProps {
  user: UserProfile;
}

export function ModeratorDashboard({ user }: ModeratorDashboardProps) {
    const { ideas, setIdeas, testimonials, setTestimonials } = useAppContext();
    const { toast } = useToast();
    const firestore = useFirestore();
    
    const moderationQueue = ideas.filter(idea => idea.status === 'Pending' && !idea.moderatorApproved);
    const testimonialQueue = testimonials.filter(testimonial => testimonial.status === 'Pending');

    const handleApproveIdea = async (idea: Idea) => {
        if (!firestore) return;
        
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

    const handleRejectIdea = async (ideaToReject: Idea) => {
        if (!firestore) return;
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
    
    const handleTestimonialDecision = async (testimonialId: string, decision: "Approved" | "Rejected") => {
        if (!firestore) return;

        const testimonialRef = doc(firestore, "testimonials", testimonialId);
        const testimonialText = testimonials.find(t => t.id === testimonialId)?.text;

        try {
            await updateDoc(testimonialRef, { status: decision });
            setTestimonials(testimonials.map(t => 
                t.id === testimonialId ? { ...t, status: decision } : t
            ));

            toast({
                title: `Testimonial ${decision}`,
                description: `The testimonial has been ${decision.toLowerCase()}.`,
                className: decision === 'Approved' ? "bg-secondary text-secondary-foreground" : "",
                variant: decision === 'Rejected' ? "destructive" : "default",
            });
        } catch (error) {
            console.error(`Error ${decision.toLowerCase()}ing testimonial:`, error);
            toast({ variant: "destructive", title: "Error", description: `Could not update testimonial.` });
        }
    };

  return (
    <div className="container py-10">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
        Moderator Dashboard
      </h1>
      <p className="text-muted-foreground mt-2 text-lg">Welcome, {user.name}.</p>

       <Tabs defaultValue="ideas" className="mt-8">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ideas">
                    Idea Submissions
                    <Badge variant="secondary" className="ml-2">{moderationQueue.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="testimonials">
                    Testimonials
                    <Badge variant="secondary" className="ml-2">{testimonialQueue.length}</Badge>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="ideas" className="mt-6">
                <Card>
                    <CardHeader className="flex flex-row items-start justify-between">
                        <div className="space-y-1.5">
                            <CardTitle>Content Moderation Queue</CardTitle>
                            <CardDescription>
                                Review and filter citizen submissions. Approved items are escalated to the Special Adviser.
                            </CardDescription>
                        </div>
                        <ShieldCheck className="h-8 w-8 text-muted-foreground" />
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
                                                        <AlertDialogAction onClick={() => handleApproveIdea(idea)}>
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
                                                        <AlertDialogAction onClick={() => handleRejectIdea(idea)} className="bg-destructive hover:bg-destructive/90">
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
            </TabsContent>
            <TabsContent value="testimonials" className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Testimonial Approval Queue</CardTitle>
                        <CardDescription>Review user-submitted testimonials. Approved items will be displayed on the homepage.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                             <TableHeader>
                                <TableRow>
                                    <TableHead>Testimonial</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {testimonialQueue.length > 0 ? testimonialQueue.map(t => (
                                    <TableRow key={t.id}>
                                        <TableCell className="italic">"{t.text}"</TableCell>
                                        <TableCell>{t.authorName}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm" className="text-secondary border-secondary/50 hover:bg-secondary/10 hover:text-secondary" onClick={() => handleTestimonialDecision(t.id, 'Approved')}>
                                                <Check className="mr-2 h-4 w-4" /> Approve
                                            </Button>
                                            <Button variant="outline" size="sm" className="text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive" onClick={() => handleTestimonialDecision(t.id, 'Rejected')}>
                                                <X className="mr-2 h-4 w-4" /> Reject
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                                            No testimonials are awaiting approval.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
