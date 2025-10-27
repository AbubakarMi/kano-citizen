
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Users, FileText, Vote, Lightbulb, ArrowUp, ArrowDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, PieChart, Cell } from 'recharts';
import type { UserProfile, Idea, Directive, ApprovalItem } from "@/lib/data";


interface ExecutiveDashboardProps {
    user: UserProfile;
    ideas: Idea[];
    directives: Directive[];
    users: UserProfile[];
    approvalQueue: ApprovalItem[];
}

export function ExecutiveDashboard({ user, ideas, directives, users, approvalQueue }: ExecutiveDashboardProps) {

  const totalUsers = users.length;
  const totalIdeas = ideas.length;
  const directivesIssued = approvalQueue.filter(item => item.status === 'Issued').length;
  const totalVotes = ideas.reduce((sum, idea) => sum + idea.upvotes.length, 0);

  const kpis = [
      { title: "Total Users", value: totalUsers, change: "+2.5%", changeType: 'increase', icon: Users },
      { title: "Directives Issued", value: directivesIssued, change: "+1", changeType: 'increase', icon: FileText },
      { title: "Total Votes Cast", value: totalVotes.toLocaleString(), change: "+10%", changeType: 'increase', icon: Vote },
      { title: "Total Ideas", value: totalIdeas, change: "+5", changeType: 'increase', icon: Lightbulb },
  ];
  
  const recentIdeas = [...ideas].sort((a,b) => (b.createdAt as number) - (a.createdAt as number)).slice(0,2);
  const recentUsers = [...users].sort((a,b) => (b.createdAt as number) - (a.createdAt as number)).slice(0,1);

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-start">
             <h1 className="text-2xl font-semibold tracking-tight">Command Dashboard</h1>
             {/* Time period selector can be added here */}
        </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {kpis.map(kpi => (
                  <Card key={kpi.title} className="shadow-sm">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                          <kpi.icon className="h-5 w-5 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{kpi.value}</div>
                          <p className="text-xs text-muted-foreground">
                            {/* Static change for now */}
                            {kpi.change} vs last month
                          </p>
                      </CardContent>
                  </Card>
              ))}
          </div>
      
      <div className="grid gap-6 grid-cols-1">
        <Card>
            <CardHeader>
                <CardTitle>Activity Feed</CardTitle>
                <CardDescription>Latest actions from citizens and admins.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentIdeas.map(idea => (
                        <div key={idea.id} className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Vote className="h-5 w-5 text-primary"/>
                            </div>
                            <div>
                                <p className="text-sm font-medium">New idea submitted: '{idea.title}'</p>
                                <p className="text-xs text-muted-foreground">by {idea.author} - {new Date(idea.createdAt as Date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                    {recentUsers.map(u => (
                         <div key={u.uid} className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                                <Users className="h-5 w-5 text-destructive"/>
                            </div>
                            <div>
                                <p className="text-sm font-medium">New user '{u.name}' registered.</p>
                                <p className="text-xs text-muted-foreground">{new Date(u.createdAt as Date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-secondary"/>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Directive 'Streetlight Repair' has been marked as Completed</p>
                            <p className="text-xs text-muted-foreground">by MDA Official - Yesterday</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
