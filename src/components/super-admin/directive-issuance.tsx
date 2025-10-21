

"use client";

import { useToast } from "@/hooks/use-toast";
import type { Idea, MDA } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gavel } from "lucide-react";

interface DirectiveIssuanceProps {
    ideas: Idea[];
    mdas: MDA[];
}

export function DirectiveIssuance({ ideas, mdas }: DirectiveIssuanceProps) {
  const { toast } = useToast();
  
  const handleIssueDirective = () => {
    toast({
        title: "Directive Issued",
        description: "The directive has been sent to the assigned MDA and is now being tracked.",
        className: "bg-primary text-primary-foreground border-primary"
    });
  }

  const sortedIdeas = [...ideas].sort((a, b) => b.upvotes - a.upvotes);

  return (
    <Card className="shadow-sm">
        <CardHeader>
            <CardTitle>Issue a New Directive</CardTitle>
            <CardDescription>Select a top citizen submission, draft an official directive, and assign it to an MDA with a deadline.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Select a Top-Voted Idea</label>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose a citizen idea..." />
                    </SelectTrigger>
                    <SelectContent>
                        {sortedIdeas.map(idea => (
                            <SelectItem key={idea.id} value={idea.id}>{idea.title} ({idea.upvotes} votes)</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <label htmlFor="directive-title" className="text-sm font-medium">Directive Title</label>
                <Input id="directive-title" placeholder="e.g., 'Phase 1 Rollout of Waste-to-Wealth Project'" />
            </div>
                <div className="space-y-2">
                <label htmlFor="directive-details" className="text-sm font-medium">Directive Details & Objectives</label>
                <Textarea id="directive-details" rows={5} placeholder="Provide a clear, actionable summary of the objective, key milestones, and expected outcomes." />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <label className="text-sm font-medium">Assign to MDA</label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an MDA..." />
                        </SelectTrigger>
                        <SelectContent>
                            {mdas.map(mda => (
                                <SelectItem key={mda.id} value={mda.id}>{mda.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <label htmlFor="deadline" className="text-sm font-medium">Deadline</label>
                    <Input id="deadline" type="date" />
                </div>
            </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleIssueDirective}>Issue Official Directive</Button>
        </CardFooter>
    </Card>
  );
}
