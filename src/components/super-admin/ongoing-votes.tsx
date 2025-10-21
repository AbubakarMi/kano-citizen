

"use client";

import { useState } from "react";
import type { Idea } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, PlusCircle } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFirestore, useUser } from "@/firebase";
import { addIdea } from "@/firebase/firestore/ideas";
import { useAppContext } from "@/app/app-provider";

export function OngoingVotes() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { ideas, setIdeas } = useAppContext();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [newIdeaTitle, setNewIdeaTitle] = useState("");
  const [newIdeaDescription, setNewIdeaDescription] = useState("");
  const { toast } = useToast();

  const sortedIdeas = [...ideas].sort((a, b) => b.upvotes.length - a.upvotes.length);
  const totalVotes = ideas.reduce((sum, idea) => sum + idea.upvotes.length, 0);

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
        const newIdea = {
            title: newIdeaTitle,
            description: newIdeaDescription,
            author: user.profile.name,
            authorId: user.uid,
            upvotes: [],
        };
        const newIdeaWithId = await addIdea(firestore, newIdea);
        setIdeas(prevIdeas => [newIdeaWithId, ...prevIdeas]);

        setIsSheetOpen(false);
        setNewIdeaTitle("");
        setNewIdeaDescription("");
        toast({
            title: "Poll Created",
            description: `The poll "${newIdea.title}" is now live.`,
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

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Live Community Polls</CardTitle>
            <CardDescription>Real-time view of top-voted ideas from citizens.</CardDescription>
          </div>
          <Button onClick={() => setIsSheetOpen(true)}>
            <PlusCircle className="mr-2" />
            Create New Poll
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedIdeas.map((idea) => {
            const votePercentage = totalVotes > 0 ? (idea.upvotes.length / totalVotes) * 100 : 0;
            return (
              <div key={idea.id} className="space-y-2 border-b pb-4 last:border-none last:pb-0">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-semibold">{idea.title}</h3>
                    <p className="text-xs text-muted-foreground">by {idea.author}</p>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-lg text-primary">
                    <ArrowUp className="h-5 w-5" />
                    {idea.upvotes.length}
                  </div>
                </div>
                <div>
                  <Progress value={votePercentage} aria-label={`${votePercentage.toFixed(0)}% of votes`} className="h-2" />
                  <p className="text-right text-xs font-medium text-primary mt-1">{votePercentage.toFixed(1)}%</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Create a New Poll</SheetTitle>
            <SheetDescription>
              Launch a new idea or question for the community to vote on. This will appear immediately in the ongoing votes.
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
            <Button onClick={handleCreatePoll}>Create Poll</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
