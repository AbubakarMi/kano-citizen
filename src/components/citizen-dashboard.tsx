
"use client";

import { useState } from "react";
import { useUser } from "@/firebase/auth/use-user";
import { useFirestore } from "@/firebase";
import { doc, writeBatch, arrayUnion, arrayRemove } from "firebase/firestore";
import type { Idea } from "@/lib/data";
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
import { ArrowUp, Check, Handshake, FileText, Bell, Pin, Vote, MessageSquareQuote, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { Translation } from "@/lib/translations";
import { addIdea } from "@/firebase/firestore/ideas";
import { useAppContext } from "@/app/app-provider";

interface CitizenDashboardProps {
  t: Translation['dashboard'];
}

export function CitizenDashboard({ t }: CitizenDashboardProps) {
  const { authedUser } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { ideas, setIdeas, directives, volunteerOpportunities, activeView } = useAppContext();

  const [newIdeaTitle, setNewIdeaTitle] = useState("");
  const [newIdeaDescription, setNewIdeaDescription] = useState("");

  const handleUpvote = async (ideaId: string) => {
    if (!authedUser || !firestore) return;
    
    const userRef = doc(firestore, "users", authedUser.uid);
    const ideaRef = doc(firestore, "ideas", ideaId);
    
    const isVoted = authedUser.profile?.votedOnIdeas?.includes(ideaId);

    try {
      const batch = writeBatch(firestore);
      if (isVoted) {
        toast({ title: t.alreadyVoted, description: t.alreadyVotedDescription });
        return;
      } else {
        batch.update(ideaRef, { upvotes: arrayUnion(authedUser.uid) });
        batch.update(userRef, { votedOnIdeas: arrayUnion(ideaId) });
      }
      await batch.commit();
      
      // Optimistic UI update
      setIdeas(prevIdeas => prevIdeas.map(idea => 
        idea.id === ideaId 
          ? { ...idea, upvotes: [...idea.upvotes, authedUser.uid] }
          : idea
      ));
      if(authedUser.profile) {
        authedUser.profile.votedOnIdeas.push(ideaId);
      }

      toast({ title: t.voteCasted, description: t.voteCastedDescription, className: "bg-secondary text-secondary-foreground" });
    } catch (error) {
      console.error("Error upvoting:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not cast vote." });
    }
  };

  const handleFollow = async (directiveId: string) => {
    if (!authedUser || !firestore) return;
    const userRef = doc(firestore, "users", authedUser.uid);
    const isFollowing = authedUser.profile?.followedDirectives?.includes(directiveId);
    
    try {
      await writeBatch(firestore).update(userRef, {
        followedDirectives: isFollowing ? arrayRemove(directiveId) : arrayUnion(directiveId)
      }).commit();
      toast({ title: isFollowing ? t.unfollowed : t.followed, description: isFollowing ? t.unfollowedDescription : t.followedDescription, className: "bg-secondary text-secondary-foreground" });
    } catch(e) {
      console.error(e);
    }
  };
  
  const handleVolunteer = (opportunityId: string) => {
    toast({ title: t.volunteerThankYou, description: t.volunteerThankYouDescription, className: "bg-secondary text-secondary-foreground" });
  };
  
  const handleSubmitIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !authedUser?.profile) return;
    
    try {
      await addIdea(firestore, {
        title: newIdeaTitle,
        description: newIdeaDescription,
        author: authedUser.profile.name,
        authorId: authedUser.uid,
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

  const myIdeas = ideas.filter(idea => idea.authorId === authedUser?.uid);
  const myVotes = ideas.filter(idea => authedUser?.profile?.votedOnIdeas?.includes(idea.id));
  const livePolls = ideas.filter(idea => idea.status === 'Approved');

  return (
    <div className="container py-10">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline text-primary">
        {t.welcome} {authedUser?.profile?.name.split(" ")[0]}!
      </h1>
      <p className="text-muted-foreground mt-2 text-lg">{t.welcomeSubtitle}</p>

      <Tabs value={activeView} className="mt-8">
        <TabsContent value="speak" className="mt-6">
          <Card className="max-w-3xl mx-auto shadow-lg border-primary/20 bg-card">
            <CardHeader className="text-center items-center gap-4 p-6 md:p-8">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  <MessageSquareQuote className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-headline text-primary">{t.submitIdeaTitle}</CardTitle>
                <CardDescription className="text-base">
                  {t.submitIdeaDescription}
                </CardDescription>
              </div>
            </CardHeader>
            <form onSubmit={handleSubmitIdea}>
              <CardContent className="p-6 md:p-8 space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="idea-title" className="font-medium">Idea Title</label>
                    <Input 
                        id="idea-title"
                        placeholder={t.ideaTitlePlaceholder} 
                        value={newIdeaTitle}
                        onChange={(e) => setNewIdeaTitle(e.target.value)}
                        required
                        className="text-base py-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="idea-desc" className="font-medium">Idea Description</label>
                    <Textarea
                        id="idea-desc"
                        placeholder={t.ideaDescriptionPlaceholder} 
                        rows={6}
                        value={newIdeaDescription}
                        onChange={(e) => setNewIdeaDescription(e.target.value)}
                        required
                        className="text-base"
                    />
                  </div>
              </CardContent>
              <CardFooter className="flex-col gap-4 p-6 md:p-8 bg-muted/50 rounded-b-lg">
                <Button type="submit" size="lg" className="w-full font-bold text-lg">{t.submitIdeaButton}</Button>
                <p className="text-xs text-muted-foreground text-center">Your idea will be reviewed by moderators before appearing for public vote. This ensures all submissions are constructive.</p>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="decide" className="mt-6">
           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {livePolls.sort((a,b) => b.upvotes.length - a.upvotes.length).map((idea) => (
               <Card key={idea.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
                 <CardHeader>
                   <CardTitle className="font-headline text-lg text-primary">{idea.title}</CardTitle>
                   <CardDescription className="text-xs">{t.by} <span className="font-medium">{idea.author}</span></CardDescription>
                 </CardHeader>
                 <CardContent className="flex-grow">
                   <p className="text-muted-foreground text-sm line-clamp-3">{idea.description}</p>
                 </CardContent>
                 <CardFooter className="flex justify-between items-center bg-muted/50 p-4">
                   <div className="flex items-center gap-2 font-bold text-lg text-secondary">
                     <ArrowUp className="h-5 w-5"/>
                     {idea.upvotes.length}
                   </div>
                   <Button 
                     variant={authedUser?.profile?.votedOnIdeas?.includes(idea.id) ? "secondary" : "outline"}
                     onClick={() => handleUpvote(idea.id)}
                     disabled={authedUser?.profile?.votedOnIdeas?.includes(idea.id)}
                   >
                     {authedUser?.profile?.votedOnIdeas?.includes(idea.id) ? <Check className="mr-2 h-4 w-4" /> : <Vote className="mr-2 h-4 w-4" />}
                     {authedUser?.profile?.votedOnIdeas?.includes(idea.id) ? t.voted : t.upvote}
                   </Button>
                 </CardFooter>
               </Card>
             ))}
           </div>
           {livePolls.length === 0 && (
                <div className="text-center py-20 bg-muted rounded-lg">
                    <Vote className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No Live Polls</h3>
                    <p className="mt-1 text-sm text-muted-foreground">There are no ideas available for voting right now.</p>
                </div>
            )}
        </TabsContent>

        <TabsContent value="build" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-primary"><FileText />{t.myActivity}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">{t.mySubmittedIdeas}</h4>
                        {myIdeas.length > 0 ? (
                            <ul className="space-y-2 text-sm">
                                {myIdeas.map(i => <li key={i.id} className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-muted-foreground" /><span>{i.title}</span></li>)}
                            </ul>
                        ) : <p className="text-muted-foreground text-sm">{t.noSubmittedIdeas}</p>}
                      </div>
                       <div>
                        <h4 className="font-semibold text-sm mb-2">{t.myVotes}</h4>
                         {myVotes.length > 0 ? (
                            <ul className="space-y-2 text-sm">
                                {myVotes.map(i => <li key={i.id} className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-muted-foreground" /><span>{i.title}</span></li>)}
                            </ul>
                        ) : <p className="text-muted-foreground text-sm">{t.noVotes}</p>}
                      </div>
                  </CardContent>
              </Card>

               <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-primary">{t.volunteer}</CardTitle>
                  <CardDescription>Your skills and time can make a huge difference.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {volunteerOpportunities.map(op => (
                        <div key={op.id} className="p-3 border rounded-lg">
                            <h4 className="font-semibold text-sm">{op.title}</h4>
                            <div className="flex flex-wrap gap-1 my-2">
                            {op.requiredSkills.map(skill => <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>)}
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">{op.description}</p>
                            <Button onClick={() => handleVolunteer(op.id)} variant="accent" size="sm"><Handshake className="mr-2 h-4 w-4" />{t.volunteerButton}</Button>
                        </div>
                    ))}
                    {volunteerOpportunities.length === 0 && (
                      <p className="text-muted-foreground text-sm text-center py-4">No volunteer opportunities available right now.</p>
                    )}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                      <CardTitle className="font-headline text-primary">{t.followDirectives}</CardTitle>
                      <CardDescription>Track the progress of ideas that have been turned into official government projects.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {directives.map(dir => (
                            <Card key={dir.id} className="bg-muted/50">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                <div>
                                    <Badge className="mb-2" variant={dir.status === 'An kammala' || dir.status === 'Completed' ? 'secondary' : dir.status === 'In Progress' || dir.status === 'Ana ci gaba' ? 'default' : 'accent'}>{dir.status}</Badge>
                                    <h3 className="font-semibold">{dir.title}</h3>
                                </div>
                                <Button variant={authedUser?.profile?.followedDirectives?.includes(dir.id) ? "secondary" : "outline"} size="sm" onClick={() => handleFollow(dir.id)}>
                                    {authedUser?.profile?.followedDirectives?.includes(dir.id) ? <Check className="mr-2 h-4 w-4" /> : <Bell className="mr-2 h-4 w-4" />}
                                    {authedUser?.profile?.followedDirectives?.includes(dir.id) ? t.following : t.follow}
                                </Button>
                                </div>
                                <p className="text-sm text-muted-foreground pt-1">{dir.description}</p>
                            </CardHeader>
                            <CardContent>
                                <h4 className="font-semibold mb-3 text-sm">{t.latestUpdates}</h4>
                                <ul className="space-y-3">
                                {dir.updates.map((update, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground"><Pin className="h-4 w-4 mt-0.5 shrink-0 text-accent" /><span>{update}</span></li>
                                ))}
                                </ul>
                            </CardContent>
                            </Card>
                        ))}
                        {directives.length === 0 && (
                             <div className="text-center py-20">
                                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-medium">No Directives Issued</h3>
                                <p className="mt-1 text-sm text-muted-foreground">Check back later for updates on implemented ideas.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    