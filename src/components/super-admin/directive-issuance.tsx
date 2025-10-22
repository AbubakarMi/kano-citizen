
"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Idea, MDA, ApprovalItem } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gavel } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/firebase/auth/use-user";

interface DirectiveIssuanceProps {
    ideas: Idea[];
    mdas: MDA[];
    setApprovalQueue: React.Dispatch<React.SetStateAction<ApprovalItem[]>>;
}

export function DirectiveIssuance({ ideas, mdas, setApprovalQueue }: DirectiveIssuanceProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [draftedDirectives, setDraftedDirectives] = useState<ApprovalItem[]>([]);

  // Form state
  const [selectedIdea, setSelectedIdea] = useState('');
  const [directiveTitle, setDirectiveTitle] = useState('');
  const [directiveDetails, setDirectiveDetails] = useState('');
  
  const handleDraftDirective = () => {
    if (!selectedIdea || !directiveTitle || !directiveDetails) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please select an idea and provide a title and details.",
        });
        return;
    }

    const idea = ideas.find(i => i.id === selectedIdea);

    const newDraft: ApprovalItem = {
        id: `draft-${Date.now()}`,
        type: "Drafted Directive",
        title: directiveTitle,
        description: directiveDetails,
        submittedBy: user?.profile?.name || 'Special Adviser',
        status: "Pending", // This will now go to the Governor for approval
    };

    setApprovalQueue(prev => [newDraft, ...prev]);
    setDraftedDirectives(prev => [newDraft, ...prev]);

    toast({
        title: "Directive Drafted for Approval",
        description: `"${directiveTitle}" has been sent to the Governor for final approval.`,
        className: "bg-primary text-primary-foreground border-primary"
    });

    // Reset form
    setSelectedIdea('');
    setDirectiveTitle('');
    setDirectiveDetails('');
  }

  const sortedIdeas = [...ideas].sort((a, b) => b.upvotes.length - a.upvotes.length).filter(i => i.status === 'Approved');

  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <Gavel className="h-6 w-6" />
            Directive Drafting
        </h2>
        <Card>
            <CardHeader>
                <CardTitle>Draft a New Directive</CardTitle>
                <CardDescription>Select a top citizen submission, draft a formal directive, and submit it to the Governor for approval.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Select an Approved Citizen Idea</label>
                    <Select value={selectedIdea} onValueChange={setSelectedIdea}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose an idea to formalize..." />
                        </SelectTrigger>
                        <SelectContent>
                            {sortedIdeas.length > 0 ? sortedIdeas.map(idea => (
                                <SelectItem key={idea.id} value={idea.id}>{idea.title} ({idea.upvotes.length} votes)</SelectItem>
                            )) : <p className="p-4 text-sm text-muted-foreground">No approved ideas to display.</p>}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <label htmlFor="directive-title" className="text-sm font-medium">Directive Title</label>
                    <Input id="directive-title" placeholder="e.g., 'Phase 1 Rollout of Waste-to-Wealth Project'" value={directiveTitle} onChange={(e) => setDirectiveTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="directive-details" className="text-sm font-medium">Directive Details & Objectives</label>
                    <Textarea id="directive-details" rows={5} placeholder="Provide a clear, actionable summary of the objective, key milestones, and expected outcomes." value={directiveDetails} onChange={(e) => setDirectiveDetails(e.target.value)}/>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleDraftDirective}>Submit for Governor's Approval</Button>
            </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Recently Drafted Directives</CardTitle>
                <CardDescription>A log of all directives you have drafted and sent for approval.</CardDescription>
            </CardHeader>
            <CardContent>
                {draftedDirectives.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Directive Title</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {draftedDirectives.map((dir) => (
                                <TableRow key={dir.id}>
                                    <TableCell className="font-medium">{dir.title}</TableCell>
                                    <TableCell><Badge variant="outline">Pending Governor Approval</Badge></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center text-muted-foreground p-8">
                        You have not drafted any directives yet.
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
