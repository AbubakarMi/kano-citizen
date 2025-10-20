"use client";

import { useState } from "react";
import type { User, Idea } from "@/lib/data";
import { ideas as allIdeas, directives, volunteerOpportunities } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Check, Handshake, Users, FileText, Bell, Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  user: User;
}

export function Dashboard({ user }: DashboardProps) {
  const { toast } = useToast();
  const [localIdeas, setLocalIdeas] = useState(allIdeas);
  const [localUser, setLocalUser] = useState(user);

  const handleUpvote = (ideaId: string) => {
    if (localUser.votedOnIdeas.includes(ideaId)) {
      toast({ title: "Already Voted", description: "You can only vote for an idea once." });
      return;
    }
    
    setLocalIdeas(prevIdeas => prevIdeas.map(idea => 
      idea.id === ideaId ? { ...idea, upvotes: idea.upvotes + 1 } : idea
    ));
    setLocalUser(prevUser => ({
      ...prevUser,
      votedOnIdeas: [...prevUser.votedOnIdeas, ideaId]
    }));
    toast({ title: "Vote Cast!", description: "Thank you for participating." });
  };

  const handleFollow = (directiveId: string) => {
    const isFollowing = localUser.followedDirectives.includes(directiveId);
    setLocalUser(prevUser => ({
      ...prevUser,
      followedDirectives: isFollowing
        ? prevUser.followedDirectives.filter(id => id !== directiveId)
        : [...prevUser.followedDirectives, directiveId]
    }));
    toast({ title: isFollowing ? "Unfollowed" : "Followed", description: `You will ${isFollowing ? 'no longer' : 'now'} receive updates for this directive.` });
  };
  
  const handleVolunteer = (opportunityId: string) => {
    toast({ title: "Thank you!", description: "Your interest has been noted. We will contact you shortly." });
  };

  const myIdeas = localIdeas.filter(idea => localUser.submittedIdeas.includes(idea.id));
  const myVotes = localIdeas.filter(idea => localUser.votedOnIdeas.includes(idea.id));

  return (
    <div className="container py-10">
      <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">
        Welcome back, {user.name.split(" ")[0]}!
      </h1>
      <p className="text-muted-foreground mt-2 text-lg">Ready to help build Kano?</p>

      <Tabs defaultValue="decide" className="mt-8">
        <TabsList className="grid w-full grid-cols-1 sm:w-auto sm:grid-cols-3">
          <TabsTrigger value="speak">Speak</TabsTrigger>
          <TabsTrigger value="decide">Decide</TabsTrigger>
          <TabsTrigger value="build">Build Together</TabsTrigger>
        </TabsList>
        
        <TabsContent value="speak" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Submit Your Idea</CardTitle>
              <CardDescription>
                What change do you want to see? Your name ({user.name}) will be attached for accountability.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <Input placeholder="Idea Title (e.g., 'Public Park Renovation')" />
                <Textarea placeholder="Describe your idea in detail. What problem does it solve? Who will benefit?" rows={6} />
              </form>
            </CardContent>
            <CardFooter>
              <Button onClick={() => toast({ title: "Idea Submitted!", description: "Thank you for your contribution to a better Kano."})}>Submit Idea</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="decide" className="mt-6">
           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {localIdeas.sort((a,b) => b.upvotes - a.upvotes).map((idea) => (
               <Card key={idea.id} className="flex flex-col">
                 <CardHeader>
                   <CardTitle className="font-headline">{idea.title}</CardTitle>
                   <CardDescription>by {idea.author}</CardDescription>
                 </CardHeader>
                 <CardContent className="flex-grow">
                   <p className="text-muted-foreground">{idea.description}</p>
                 </CardContent>
                 <CardFooter className="flex justify-between items-center">
                   <div className="flex items-center gap-2 font-bold text-lg">
                     <ArrowUp className="h-5 w-5"/>
                     {idea.upvotes}
                   </div>
                   <Button 
                     variant={localUser.votedOnIdeas.includes(idea.id) ? "secondary" : "outline"}
                     onClick={() => handleUpvote(idea.id)}
                   >
                     {localUser.votedOnIdeas.includes(idea.id) ? <Check className="mr-2 h-4 w-4" /> : <ArrowUp className="mr-2 h-4 w-4" />}
                     {localUser.votedOnIdeas.includes(idea.id) ? "Voted" : "Upvote"}
                   </Button>
                 </CardFooter>
               </Card>
             ))}
           </div>
        </TabsContent>

        <TabsContent value="build" className="mt-6">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList>
              <TabsTrigger value="activity">My Activity</TabsTrigger>
              <TabsTrigger value="directives">Follow Directives</TabsTrigger>
              <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
            </TabsList>
            <TabsContent value="activity" className="mt-4">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><FileText />My Submitted Ideas</CardTitle></CardHeader>
                  <CardContent>{myIdeas.length > 0 ? myIdeas.map(i => <p key={i.id}>{i.title}</p>) : <p className="text-muted-foreground">You haven't submitted any ideas yet.</p>}</CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Vote />My Votes</CardTitle></CardHeader>
                  <CardContent>{myVotes.length > 0 ? myVotes.map(i => <p key={i.id}>{i.title}</p>) : <p className="text-muted-foreground">You haven't voted on any ideas yet.</p>}</CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="directives" className="mt-4 space-y-4">
              {directives.map(dir => (
                <Card key={dir.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="mb-2" variant={dir.status === 'Completed' ? 'default' : 'secondary'}>{dir.status}</Badge>
                        <CardTitle className="font-headline">{dir.title}</CardTitle>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleFollow(dir.id)}>
                        {localUser.followedDirectives.includes(dir.id) ? <Check className="mr-2 h-4 w-4" /> : <Bell className="mr-2 h-4 w-4" />}
                        {localUser.followedDirectives.includes(dir.id) ? 'Following' : 'Follow'}
                      </Button>
                    </div>
                    <CardDescription>{dir.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold mb-2">Latest Updates</h4>
                    <ul className="space-y-2">
                    {dir.updates.map((update, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><Pin className="h-4 w-4 mt-1 shrink-0" /><span>{update}</span></li>
                    ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="volunteer" className="mt-4">
              {volunteerOpportunities.map(op => (
                <Card key={op.id} className="mb-4">
                  <CardHeader>
                    <CardTitle className="font-headline">{op.title}</CardTitle>
                    <CardDescription>{op.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold text-sm mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {op.requiredSkills.map(skill => <Badge key={skill} variant="outline">{skill}</Badge>)}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => handleVolunteer(op.id)}><Handshake className="mr-2 h-4 w-4" />Volunteer</Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
