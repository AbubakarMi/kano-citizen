
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUp, CheckCircle, FolderClock } from "lucide-react"
import type { Idea, Directive } from "@/lib/data"

interface HeroDashboardProps {
    ideas: Idea[];
    directives: Directive[];
}

export function HeroDashboard({ ideas, directives }: HeroDashboardProps) {
  const livePolls = ideas.filter(idea => idea.status === 'Approved');
  const sortedIdeas = [...livePolls].sort((a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0));
  const topIdea = sortedIdeas[0];
  const otherPolls = sortedIdeas.slice(1, 4);
  const totalVotes = livePolls.reduce((sum, idea) => sum + (idea.upvotes?.length || 0), 0);

  const inProgressDirectives = directives.filter(d => d.status === 'In Progress' || d.status === 'Ana ci gaba').slice(0, 1);
  const completedDirectives = directives.filter(d => d.status === 'Completed' || d.status === 'An kammala').slice(0, 1);


  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="absolute -inset-2 bg-gradient-to-tr from-primary to-secondary rounded-xl blur-lg opacity-25"></div>
      <div className="relative bg-card/80 backdrop-blur-xl border rounded-xl shadow-2xl">
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary">Kano Progress Dashboard</h2>
          <p className="text-sm text-muted-foreground">A snapshot of citizen engagement & government action.</p>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
            <div className="lg:col-span-3">
              <Card className="h-full bg-background/70">
                <CardHeader>
                  <CardTitle className="text-lg text-primary">Top Community Idea</CardTitle>
                  {topIdea && <CardDescription>{topIdea.title}</CardDescription>}
                </CardHeader>
                <CardContent>
                  {topIdea ? (
                    <>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {topIdea.description}
                      </p>
                      <Progress value={totalVotes > 0 ? ((topIdea.upvotes?.length || 0) / totalVotes) * 100 : 0} className="h-2 mb-2" />
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-secondary">{totalVotes > 0 ? (((topIdea.upvotes?.length || 0) / totalVotes) * 100).toFixed(0) : 0}% of votes</span>
                        <span className="flex items-center font-bold text-secondary"><ArrowUp className="h-4 w-4 mr-1" />{topIdea.upvotes?.length || 0} Votes</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No ideas submitted yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="h-full bg-background/70">
                <CardHeader>
                  <CardTitle className="text-lg text-primary">Live Polls</CardTitle>
                </CardHeader>
                <CardContent>
                  {otherPolls.length > 0 ? (
                    <ul className="space-y-3 text-sm">
                      {otherPolls.map(poll => (
                        <li key={poll.id} className="flex justify-between items-center">
                          <span className="truncate pr-2">{poll.title}</span>
                          <span className="font-bold text-accent flex-shrink-0">{poll.upvotes?.length || 0}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                     <p className="text-sm text-muted-foreground">No other active polls.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-6">
            <Card className="bg-background/70">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Directives in Progress</CardTitle>
              </CardHeader>
              <CardContent>
                {(inProgressDirectives.length > 0 || completedDirectives.length > 0) ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Directive</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inProgressDirectives.map(directive => (
                        <TableRow key={directive.id}>
                            <TableCell className="truncate">{directive.title}</TableCell>
                            <TableCell>
                                <Badge variant="default">
                                <FolderClock className="h-3 w-3 mr-1.5"/> In Progress
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                    {completedDirectives.map(directive => (
                         <TableRow key={directive.id}>
                            <TableCell className="truncate">{directive.title}</TableCell>
                            <TableCell>
                                <Badge variant="secondary">
                                <CheckCircle className="h-3 w-3 mr-1.5"/> Completed
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No directives are currently active.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Community Voices</h3>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="https://picsum.photos/seed/Aisha/40/40" />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="https://picsum.photos/seed/Musa/40/40" />
                <AvatarFallback>MI</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="https://picsum.photos/seed/Fatima/40/40" />
                <AvatarFallback>FS</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="https://picsum.photos/seed/Umar/40/40" />
                <AvatarFallback>UF</AvatarFallback>
              </Avatar>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-xs font-semibold text-accent">
                +15k
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
