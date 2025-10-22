

"use client";

import { useState } from "react";
import type { Idea } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, PlusCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFirestore } from "@/firebase";
import { useUser } from "@/firebase/auth/use-user";
import { addIdea } from "@/firebase/firestore/ideas";
import { useAppContext } from "@/app/app-provider";

export function OngoingVotes() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { ideas, setIdeas, setApprovalQueue } = useAppContext();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [newIdeaTitle, setNewIdeaTitle] = useState("");
  const [newIdeaDescription, setNewIdeaDescription] = useState("");
  const [itemToFinalize, setItemToFinalize] = useState<Idea | null>(null);
  const { toast } = useToast();

  const approvedIdeas = ideas.filter(idea => idea.status === 'Approved');
  const sortedIdeas = [...approvedIdeas].sort((a, b) => b.upvotes.length - a.upvotes.length);
  const totalVotes = approvedIdeas.reduce((sum, idea) => sum + idea.upvotes.length, 0);

  const handleCreatePoll = async () => {
    if (!newIdeaTitle || !newIdeaDescription) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please provide a title and description for the new poll.",
        });
        return;
    }
    if (!firestore || !user?.profile) return;

    try {
        await addIdea(firestore, {
            title: newIdeaTitle,
            description: newIdeaDescription,
            author: user.profile.name,
            authorId: user.uid,
            upvotes: [],
            status: 'Approved',
        });
        setIsSheetOpen(false);
        setNewIdeaTitle("");
        setNewIdeaDescription("");
        toast({
            title: "Poll Created & Approved",
            description: `The poll "${newIdeaTitle}" is now live.`,
            className: "bg-secondary text-secondary-foreground",
        });
    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not create poll.",
        });
    }
  };

  const handleFinalize = () => {
    if (!itemToFinalize) return;

    // Add to Governor's queue
    setApprovalQueue(prev => [{
        id: `idea-final-${itemToFinalize.id}`,
        type: "Citizen-Approved Idea",
        title: itemToFinalize.title,
        description: itemToFinalize.description,
        submittedBy: "Special Adviser (from Public Poll)",
        status: "Pending"
    }, ...prev]);

    // Update local idea status
    setIdeas(prev => prev.map(idea => 
        idea.id === itemToFinalize.id ? { ...idea, status: "Completed" } : idea
    ));

    toast({
        title: "Poll Finalized",
        description: `"${itemToFinalize.title}" has been sent to the Governor for final approval.`,
        className: "bg-primary text-primary-foreground",
    });

    setItemToFinalize(null);
  }

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Live Community Polls</CardTitle>
            <CardDescription>Real-time view of top-voted (and approved) ideas from citizens.</CardDescription>
          </div>
          <Button onClick={() => setIsSheetOpen(true)}>
            <PlusCircle className="mr-2" />
            Create New Poll
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedIdeas.length > 0 ? sortedIdeas.map((idea) => {
            const votePercentage = totalVotes > 0 ? (idea.upvotes.length / totalVotes) * 100 : 0;
            return (
              <div key={idea.id} className="space-y-2 border-b pb-4 last:border-none last:pb-0">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-base font-semibold">{idea.title}</h3>
                    <p className="text-xs text-muted-foreground">by {idea.author}</p>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-lg text-primary flex-shrink-0">
                    <ArrowUp className="h-5 w-5" />
                    {idea.upvotes.length}
                  </div>
                </div>
                <div>
                  <Progress value={votePercentage} aria-label={`${votePercentage.toFixed(0)}% of votes`} className="h-2" />
                  <p className="text-right text-xs font-medium text-primary mt-1">{votePercentage.toFixed(1)}%</p>
                </div>
                <div className="pt-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setItemToFinalize(idea)}>
                                <Send className="mr-2" />
                                Finalize & Send for Approval
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Finalize Poll?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will end voting for "{itemToFinalize?.title}" and submit it to the Governor for final approval to become a directive. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setItemToFinalize(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleFinalize}>Confirm & Send</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
              </div>
            );
          }) : (
            <div className="text-center text-muted-foreground p-8">
              No approved polls are currently live. Create one or approve a pending idea.
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Create a New Poll</SheetTitle>
            <SheetDescription>
              Launch a new idea or question for the community to vote on. Polls created here are automatically approved and go live immediately.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" value={newIdeaTitle} onChange={(e) => setNewIdeaTitle(e.target.value)} className="col-span-3" placeholder="e.g. 'Should we invest in public Wi-Fi?'" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right mt-2">
                Description
              </Label>
              <Textarea id="description" value={newIdeaDescription} onChange={(e) => setNewIdeaDescription(e.target.value)} className="col-span-3" placeholder="Provide some context for the poll." rows={5} />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button onClick={handleCreatePoll}>Create and Publish Poll</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
