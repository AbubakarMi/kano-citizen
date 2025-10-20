"use client";

import type { User, Idea } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Smile, HardHat, FileCheck, FileX, ArrowUp, Settings, Gavel, CheckCircle, Vote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mdas } from "@/lib/data";
import { Progress } from "@/components/ui/progress";
import { Separator } from "./ui/separator";


interface SuperAdminDashboardProps {
  user: User;
  ideas: Idea[];
}

const kpis = [
    { title: "Total Citizen Participation", value: "15,432", icon: Users },
    { title: "Directives: Issued vs. Completed", value: "25 / 18", icon: FileText },
    { title: "Citizen Satisfaction Score", value: "88%", icon: Smile },
    { title: "Top Sector of Concern", value: "Infrastructure", icon: HardHat },
]

const approvalItems = [
    { id: "app-1", type: "SPD Communiqué", title: "Report from Q2 Special Public Dialogue on Security", submittedBy: "SPD Coordinator", status: "Pending"},
    { id: "app-2", type: "Policy Brief", title: "Recommendations for Waste Management Improvement", submittedBy: "Moderator", status: "Pending"},
    { id: "app-3", type: "System Change", title: "New User Role: 'Community Champion'", submittedBy: "System Administrator", status: "Approved"},
]

export function SuperAdminDashboard({ user, ideas }: SuperAdminDashboardProps) {
  const { toast } = useToast();
  const sortedIdeas = [...ideas].sort((a, b) => b.upvotes - a.upvotes);
  const totalVotes = ideas.reduce((sum, idea) => sum + idea.upvotes, 0);

  const handleIssueDirective = () => {
    toast({
        title: "Directive Issued",
        description: "The directive has been sent to the assigned MDA and is now being tracked.",
        className: "bg-primary text-primary-foreground border-primary"
    });
  }
  
  const handleApproval = (status: "Approved" | "Rejected") => {
      toast({
        title: `Decision Recorded`,
        description: `The item has been marked as ${status}.`,
      });
  }

  return (
    <div className="flex flex-col gap-12">
      
      {/* Executive Dashboard Section */}
      <div id="overview" className="space-y-6 scroll-mt-24">
        <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                Executive Dashboard
            </h2>
            <p className="text-muted-foreground mt-1">High-level oversight of the Kano Citizens' Voice Project.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpis.map(kpi => (
                <Card key={kpi.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                        <kpi.icon className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpi.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>

      <Separator />

      {/* Ongoing Votes Section */}
       <div id="votes" className="space-y-6 scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                <Vote /> Ongoing Votes
            </h2>
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Live Community Polls</CardTitle>
                    <CardDescription>Real-time view of top-voted ideas from citizens.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {sortedIdeas.map((idea) => {
                    const votePercentage = totalVotes > 0 ? (idea.upvotes / totalVotes) * 100 : 0;
                    return (
                        <Card key={idea.id} className="overflow-hidden shadow-sm">
                        <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            <div className="md:col-span-3">
                                <h3 className="text-base font-semibold mb-1">{idea.title}</h3>
                                <p className="text-xs text-muted-foreground">by {idea.author}</p>
                            </div>
                            <div className="flex items-center justify-start md:justify-end gap-4 text-right">
                                <div className="flex items-center gap-2 font-bold text-lg text-primary">
                                <ArrowUp className="h-5 w-5" />
                                {idea.upvotes}
                                </div>
                            </div>
                            </div>
                            <div className="mt-3">
                            <Progress value={votePercentage} aria-label={`${votePercentage.toFixed(0)}% of votes`} />
                            <p className="text-right text-xs font-medium text-primary mt-1">{votePercentage.toFixed(1)}%</p>
                            </div>
                        </CardContent>
                        </Card>
                    );
                    })}
                </CardContent>
            </Card>
      </div>

      <Separator />

      {/* Directive Issuance Section */}
      <div id="directives" className="space-y-6 scroll-mt-24">
         <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <Gavel /> Directive Issuance
        </h2>
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Issue a New Directive</CardTitle>
                <CardDescription>Select a top citizen submission, draft an official directive, and assign it to an MDA with a deadline.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Select a Top-Voted Idea</label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose a citizen idea..." />
                        </SelectTrigger>
                        <SelectContent>
                            {ideas.map(idea => (
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
                <div className="grid md:grid-cols-2 gap-6">
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
      </div>
      
      <Separator />

      {/* Approval Queue Section */}
      <div id="approvals" className="space-y-6 scroll-mt-24">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <CheckCircle /> Approval Queue
        </h2>
         <Card>
            <CardHeader>
                <CardTitle className="text-xl">Approval Queue</CardTitle>
                <CardDescription>Review and approve major SPD outcomes, reports, and system changes before they are made public or implemented.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Submitted By</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {approvalItems.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.title}</TableCell>
                                <TableCell><Badge variant="secondary">{item.type}</Badge></TableCell>
                                <TableCell>{item.submittedBy}</TableCell>
                                <TableCell><Badge variant={item.status === 'Approved' ? 'default' : 'outline'}>{item.status}</Badge></TableCell>
                                <TableCell className="text-right space-x-2">
                                    {item.status === "Pending" && <>
                                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700" onClick={() => handleApproval('Approved')}>
                                            <FileCheck className="mr-2 h-4 w-4" /> Approve
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleApproval('Rejected')}>
                                            <FileX className="mr-2 h-4 w-4" /> Reject
                                        </Button>
                                    </>}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>

      <Separator />

       {/* User Management Section (Placeholder) */}
      <div id="users" className="space-y-6 scroll-mt-24">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <Users /> User Management
        </h2>
        <Card>
            <CardHeader>
                <CardTitle>Manage Users & Roles</CardTitle>
                <CardDescription>This section is under development.</CardDescription>
            </CardHeader>
            <CardContent>
                 <p className="text-muted-foreground">A table for viewing, editing, and assigning roles to users will be available here.</p>
            </CardContent>
        </Card>
      </div>

      <Separator />

       {/* System Settings Section (Placeholder) */}
      <div id="settings" className="space-y-6 scroll-mt-24">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <Settings /> System Settings
        </h2>
        <Card>
            <CardHeader>
                <CardTitle>Configure Platform Settings</CardTitle>
                <CardDescription>This section is under development.</CardDescription>
            </CardHeader>
            <CardContent>
                 <p className="text-muted-foreground">Controls for system-wide settings, such as voting thresholds and content categories, will be available here.</p>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}

    