
"use client";

import { useState } from "react";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, doc, writeBatch, arrayUnion, arrayRemove } from "firebase/firestore";
import type { Idea, Directive } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Check, Handshake, FileText, Bell, Pin, Vote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { Translation } from "@/lib/translations";
import { Separator } from "./ui/separator";
import { addIdea } from "@/firebase/firestore/ideas";
import { useAppContext } from "@/app/app-provider";

interface CitizenDashboardProps {
  t: Translation['dashboard'];
}

export function CitizenDashboard({ t }: CitizenDashboardProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { ideas, directives, volunteerOpportunities, activeView } = useAppContext();

  const [newIdeaTitle, setNewIdeaTitle] = useState("");
  const [newIdeaDescription, setNewIdeaDescription] = useState("");

  const handleUpvote = async (ideaId: string) => {
    if (!user || !firestore) return;
    
    const userRef = doc(firestore, "users", user.uid);
    const ideaRef = doc(firestore, "ideas", ideaId);
    
    const isVoted = user.profile?.votedOnIdeas?.includes(ideaId);

    try {
      const batch = writeBatch(firestore);
      if (isVoted) {
        toast({ title: t.alreadyVoted, description: t.alreadyVotedDescription });
        return;
      } else {
        batch.update(ideaRef, { upvotes: arrayUnion(user.uid) });
        batch.update(userRef, { votedOnIdeas: arrayUnion(ideaId) });
      }
      await batch.commit();
      toast({ title: t.voteCasted, description: t.voteCastedDescription, className: "bg-secondary text-secondary-foreground" });
    } catch (error) {
      console.error("Error upvoting:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not cast vote." });
    }
  };

  const handleFollow = async (directiveId: string) => {
    if (!user || !firestore) return;
    const userRef = doc(firestore, "users", user.uid);
    const isFollowing = user.profile?.followedDirectives?.includes(directiveId);
    
    try {
      await writeBatch(firestore).update(userRef, {
        followedDirectives: isFollowing ? arrayRemove(directiveId) : arrayUnion(directiveId)
      }).commit();
      toast({ title: isFollowing ? t.unfollowed : t.followed, description: isFollowing ? t.unfollowedDescription : t.followedDescription });
    } catch(e) {
      console.error(e);
    }
  };
  
  const handleVolunteer = (opportunityId: string) => {
    toast({ title: t.volunteerThankYou, description: t.volunteerThankYouDescription, className: "bg-secondary text-secondary-foreground" });
  };
  
  const handleSubmitIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !user?.profile) return;
    
    try {
      await addIdea(firestore, {
        title: newIdeaTitle,
        description: newIdeaDescription,
        author: user.profile.name,
        authorId: user.uid,
        upvotes: [],
      });
      setNewIdeaTitle("");
      setNewIdeaDescription("");
      toast({ title: t.ideaSubmitted, description: t.ideaSubmittedDescription, className: "bg-secondary text-secondary-foreground" });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Could not submit idea."});
    }
  }

  const myIdeas = ideas.filter(idea => idea.authorId === user?.uid);
  const myVotes = ideas.filter(idea => user?.profile?.votedOnIdeas?.includes(idea.id));

  return (
    <div className="container py-10">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline text-primary">
        {t.welcome} {user?.profile?.name.split(" ")[0]}!
      </h1>
      <p className="text-muted-foreground mt-2 text-lg">{t.welcomeSubtitle}</p>

      <Tabs value={activeView} className="mt-8">
        <TabsContent value="speak" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-headline text-primary">{t.submitIdeaTitle}</CardTitle>
              <CardDescription>
                {t.submitIdeaDescription}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmitIdea}>
              <CardContent className="space-y-4">
                  <Input 
                    placeholder={t.ideaTitlePlaceholder} 
                    value={newIdeaTitle}
                    onChange={(e) => setNewIdeaTitle(e.target.value)}
                    required
                  />
                  <Textarea 
                    placeholder={t.ideaDescriptionPlaceholder} 
                    rows={6}
                    value={newIdeaDescription}
                    onChange={(e) => setNewIdeaDescription(e.target.value)}
                    required
                  />
              </CardContent>
              <CardFooter>
                <Button type="submit">{t.submitIdeaButton}</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="decide" className="mt-6">
           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {ideas.sort((a,b) => b.upvotes.length - a.upvotes.length).map((idea) => (
               <Card key={idea.id} className="flex flex-col">
                 <CardHeader>
                   <CardTitle className="font-headline text-primary">{idea.title}</CardTitle>
                   <CardDescription>{t.by} {idea.author}</CardDescription>
                 </CardHeader>
                 <CardContent className="flex-grow">
                   <p className="text-muted-foreground">{idea.description}</p>
                 </CardContent>
                 <CardFooter className="flex justify-between items-center">
                   <div className="flex items-center gap-2 font-bold text-lg text-secondary">
                     <ArrowUp className="h-5 w-5"/>
                     {idea.upvotes.length}
                   </div>
                   <Button 
                     variant={user?.profile?.votedOnIdeas?.includes(idea.id) ? "secondary" : "outline"}
                     onClick={() => handleUpvote(idea.id)}
                     disabled={user?.profile?.votedOnIdeas?.includes(idea.id)}
                   >
                     {user?.profile?.votedOnIdeas?.includes(idea.id) ? <Check className="mr-2 h-4 w-4" /> : <ArrowUp className="mr-2 h-4 w-4" />}
                     {user?.profile?.votedOnIdeas?.includes(idea.id) ? t.voted : t.upvote}
                   </Button>
                 </CardFooter>
               </Card>
             ))}
           </div>
        </TabsContent>

        <TabsContent value="build" className="mt-6 space-y-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight font-headline text-primary">{t.myActivity}</h2>
                <p className="text-muted-foreground">An overview of your contributions to the platform.</p>
                <div className="grid gap-6 md:grid-cols-2 mt-4">
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2 text-lg font-headline text-primary"><FileText />{t.mySubmittedIdeas}</CardTitle></CardHeader>
                        <CardContent className="pl-6">
                            {myIdeas.length > 0 ? (
                                <ul className="list-disc space-y-1 text-sm">
                                    {myIdeas.map(i => <li key={i.id}>{i.title}</li>)}
                                </ul>
                            ) : <p className="text-muted-foreground text-sm">{t.noSubmittedIdeas}</p>}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2 text-lg font-headline text-primary"><Vote />{t.myVotes}</CardTitle></CardHeader>
                        <CardContent className="pl-6">
                           {myVotes.length > 0 ? (
                                <ul className="list-disc space-y-1 text-sm">
                                    {myVotes.map(i => <li key={i.id}>{i.title}</li>)}
                                </ul>
                            ) : <p className="text-muted-foreground text-sm">{t.noVotes}</p>}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Separator />

            <div>
                <h2 className="text-2xl font-bold tracking-tight font-headline text-primary">{t.followDirectives}</h2>
                <p className="text-muted-foreground">Track the progress of ideas that have been turned into official government projects.</p>
                <div className="mt-4 space-y-4">
                    {directives.map(dir => (
                        <Card key={dir.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                            <div>
                                <Badge className="mb-2" variant={dir.status === 'An kammala' || dir.status === 'Completed' ? 'secondary' : dir.status === 'In Progress' || dir.status === 'Ana ci gaba' ? 'default' : 'accent'}>{dir.status}</Badge>
                                <CardTitle className="font-headline text-primary">{dir.title}</CardTitle>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => handleFollow(dir.id)}>
                                {user?.profile?.followedDirectives?.includes(dir.id) ? <Check className="mr-2 h-4 w-4" /> : <Bell className="mr-2 h-4 w-4" />}
                                {user?.profile?.followedDirectives?.includes(dir.id) ? t.following : t.follow}
                            </Button>
                            </div>
                            <CardDescription>{dir.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h4 className="font-semibold mb-2 font-headline">{t.latestUpdates}</h4>
                            <ul className="space-y-2">
                            {dir.updates.map((update, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><Pin className="h-4 w-4 mt-1 shrink-0 text-accent" /><span>{update}</span></li>
                            ))}
                            </ul>
                        </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <Separator />

             <div>
                <h2 className="text-2xl font-bold tracking-tight font-headline text-primary">{t.volunteer}</h2>
                <p className="text-muted-foreground">Your skills and time can make a huge difference. Volunteer for a project today.</p>
                <div className="mt-4 grid md:grid-cols-2 gap-6">
                    {volunteerOpportunities.map(op => (
                        <Card key={op.id} className="mb-4">
                        <CardHeader>
                            <CardTitle className="font-headline text-primary">{op.title}</CardTitle>
                            <CardDescription>{op.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h4 className="font-semibold text-sm mb-2 font-headline">{t.skillsNeeded}</h4>
                            <div className="flex flex-wrap gap-2">
                            {op.requiredSkills.map(skill => <Badge key={skill} variant="outline">{skill}</Badge>)}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => handleVolunteer(op.id)} variant="accent"><Handshake className="mr-2 h-4 w-4" />{t.volunteerButton}</Button>
                        </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>

        </TabsContent>
      </Tabs>
    </div>
  );
}
