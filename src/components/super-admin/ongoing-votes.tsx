
"use client";

import { useState } from "react";
import type { Idea } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, PlusCircle, Vote } from "lucide-react";
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

interface OngoingVotesProps {
  initialIdeas: Idea[];
}

export function OngoingVotes({ initialIdeas }: OngoingVotesProps) {
  const [ideas, setIdeas] = useState(initialIdeas);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [newIdeaTitle, setNewIdeaTitle] = useState("");
  const [newIdeaDescription, setNewIdeaDescription] = useState("");
  const { toast } = useToast();

  const sortedIdeas = [...ideas].sort((a, b) => b.upvotes - a.upvotes);
  const totalVotes = ideas.reduce((sum, idea) => sum + idea.upvotes, 0);

  const handleCreatePoll = () => {
    if (!newIdeaTitle || !newIdeaDescription) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please provide a title and description for the new poll.",
        });
        return;
    }

    const newIdea: Idea = {
        id: `idea-${Date.now()}`,
        title: newIdeaTitle,
        description: newIdeaDescription,
        author: "Super Admin",
        upvotes: 0,
    };

    setIdeas(prevIdeas => [newIdea, ...prevIdeas]);
    setIsSheetOpen(false);
    setNewIdeaTitle("");
    setNewIdeaDescription("");
    toast({
        title: "Poll Created",
        description: `The poll "${newIdea.title}" is now live.`,
        className: "bg-primary text-primary-foreground border-primary"
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-3"><Vote className="h-6 w-6" /> Live Community Polls</CardTitle>
            <CardDescription>Real-time view of top-voted ideas from citizens.</CardDescription>
          </div>
          <Button onClick={() => setIsSheetOpen(true)}>
            <PlusCircle className="mr-2" />
            Create New Poll
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedIdeas.map((idea) => {
            const votePercentage = totalVotes > 0 ? (idea.upvotes / totalVotes) * 100 : 0;
            return (
              <div key={idea.id} className="space-y-2 border-b pb-4 last:border-none last:pb-0">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-semibold">{idea.title}</h3>
                    <p className="text-xs text-muted-foreground">by {idea.author}</p>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-lg text-primary">
                    <ArrowUp className="h-5 w-5" />
                    {idea.upvotes}
                  </div>
                </div>
                <div>
                  <Progress value={votePercentage} aria-label={`${votePercentage.toFixed(0)}% of votes`} />
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
