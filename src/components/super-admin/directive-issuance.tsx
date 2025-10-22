

"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Idea, MDA, Directive } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gavel } from "lucide-react";
import { useAppContext } from "@/app/app-provider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface DirectiveIssuanceProps {
    ideas: Idea[];
    mdas: MDA[];
}

type IssuedDirective = {
    title: string;
    mdaName: string;
    relatedIdea: string;
    deadline: string;
}

export function DirectiveIssuance({ ideas, mdas }: DirectiveIssuanceProps) {
  const { toast } = useToast();
  const { directives, setDirectives } = useAppContext();
  const [issuedDirectives, setIssuedDirectives] = useState<IssuedDirective[]>([]);

  // Form state
  const [selectedIdea, setSelectedIdea] = useState('');
  const [directiveTitle, setDirectiveTitle] = useState('');
  const [directiveDetails, setDirectiveDetails] = useState('');
  const [assignedMda, setAssignedMda] = useState('');
  const [deadline, setDeadline] = useState('');
  
  const handleIssueDirective = () => {
    if (!selectedIdea || !directiveTitle || !assignedMda) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please select an idea, provide a title, and assign an MDA.",
        });
        return;
    }

    const idea = ideas.find(i => i.id === selectedIdea);
    const mda = mdas.find(m => m.id === assignedMda);

    const newDirective: IssuedDirective = {
        title: directiveTitle,
        mdaName: mda?.name || 'N/A',
        relatedIdea: idea?.title || 'N/A',
        deadline: deadline || 'Not set',
    };

    setIssuedDirectives(prev => [newDirective, ...prev]);

    toast({
        title: "Directive Issued",
        description: "The directive has been sent to the assigned MDA and is now being tracked.",
        className: "bg-primary text-primary-foreground border-primary"
    });

    // Reset form
    setSelectedIdea('');
    setDirectiveTitle('');
    setDirectiveDetails('');
    setAssignedMda('');
    setDeadline('');
  }

  const sortedIdeas = [...ideas].sort((a, b) => b.upvotes.length - a.upvotes.length);

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Issue a New Directive</CardTitle>
                <CardDescription>Select a top citizen submission, draft an official directive, and assign it to an MDA with a deadline.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Select a Top-Voted Idea</label>
                    <Select value={selectedIdea} onValueChange={setSelectedIdea}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose a citizen idea..." />
                        </SelectTrigger>
                        <SelectContent>
                            {sortedIdeas.map(idea => (
                                <SelectItem key={idea.id} value={idea.id}>{idea.title} ({idea.upvotes.length} votes)</SelectItem>
                            ))}
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
                <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <label className="text-sm font-medium">Assign to MDA</label>
                        <Select value={assignedMda} onValueChange={setAssignedMda}>
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
                        <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleIssueDirective}>Issue Official Directive</Button>
            </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Recently Issued Directives</CardTitle>
                <CardDescription>A log of all directives issued from this panel.</CardDescription>
            </CardHeader>
            <CardContent>
                {issuedDirectives.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Directive Title</TableHead>
                                <TableHead>Assigned MDA</TableHead>
                                <TableHead>From Idea</TableHead>
                                <TableHead>Deadline</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {issuedDirectives.map((dir, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{dir.title}</TableCell>
                                    <TableCell><Badge variant="secondary">{dir.mdaName}</Badge></TableCell>
                                    <TableCell>{dir.relatedIdea}</TableCell>
                                    <TableCell>{dir.deadline}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center text-muted-foreground p-8">
                        No directives have been issued yet.
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
