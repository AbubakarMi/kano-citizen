
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
import { ArrowUp, Check, Handshake, FileText, Bell, Pin, Vote, MessageSquareQuote, ChevronRight, Loader2, Info, ChevronDown, ChevronUpIcon, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { Translation } from "@/lib/translations";
import { addIdea } from "@/firebase/firestore/ideas";
import { useAppContext } from "@/app/app-provider";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";

interface CitizenDashboardProps {
  t: Translation['dashboard'];
}

export function CitizenDashboard({ t }: CitizenDashboardProps) {
  const { authedUser, profile, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { ideas, setIdeas, directives, volunteerOpportunities, activeView } = useAppContext();

  const [newIdeaTitle, setNewIdeaTitle] = useState("");
  const [newIdeaDescription, setNewIdeaDescription] = useState("");
  const [newIdeaLocation, setNewIdeaLocation] = useState("");
  const [votingFor, setVotingFor] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllMyIdeas, setShowAllMyIdeas] = useState(false);

  const handleUpvote = async (ideaId: string) => {
    if (!authedUser || !firestore || !profile) return;
    
    // Prevent multiple clicks
    if (votingFor) return;
    
    const isVoted = profile.votedOnIdeas?.includes(ideaId);
    if (isVoted) {
        toast({ title: t.alreadyVoted, description: t.alreadyVotedDescription });
        return;
    }
    
    setVotingFor(ideaId);

    const userRef = doc(firestore, "users", authedUser.uid);
    const ideaRef = doc(firestore, "ideas", ideaId);

    try {
      // Optimistic UI update first
      setIdeas(prevIdeas => prevIdeas.map(idea => 
        idea.id === ideaId 
          ? { ...idea, upvotes: [...idea.upvotes, authedUser.uid] }
          : idea
      ));
      if(authedUser.profile) {
          authedUser.profile.votedOnIdeas.push(ideaId);
      }

      const batch = writeBatch(firestore);
      batch.update(ideaRef, { upvotes: arrayUnion(authedUser.uid) });
      batch.update(userRef, { votedOnIdeas: arrayUnion(ideaId) });
      await batch.commit();

      toast({ title: t.voteCasted, description: t.voteCastedDescription, className: "bg-secondary text-secondary-foreground" });
    } catch (error) {
      console.error("Error upvoting:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not cast vote." });

      // Revert optimistic update on error
       setIdeas(prevIdeas => prevIdeas.map(idea => 
        idea.id === ideaId 
          ? { ...idea, upvotes: idea.upvotes.filter(uid => uid !== authedUser.uid) }
          : idea
      ));
       if(authedUser.profile) {
          authedUser.profile.votedOnIdeas = authedUser.profile.votedOnIdeas.filter(id => id !== ideaId);
      }
    } finally {
        setVotingFor(null);
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
    if (!firestore || !authedUser?.profile || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addIdea(firestore, {
        title: newIdeaTitle,
        description: newIdeaDescription,
        location: newIdeaLocation,
        author: authedUser.profile.name,
        authorId: authedUser.uid,
        upvotes: [],
      });
      setNewIdeaTitle("");
      setNewIdeaDescription("");
      setNewIdeaLocation("");
      toast({ title: t.ideaSubmitted, description: t.ideaSubmittedDescription, className: "bg-secondary text-secondary-foreground" });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Could not submit idea."});
    } finally {
        setIsSubmitting(false);
    }
  }

  const myIdeas = ideas.filter(idea => idea.authorId === authedUser?.uid).sort((a, b) => (b.createdAt as any) - (a.createdAt as any));
  const myVotes = ideas.filter(idea => authedUser?.profile?.votedOnIdeas?.includes(idea.id));
  const livePolls = ideas.filter(idea => idea.status === 'Approved');
  const totalVotes = livePolls.reduce((sum, idea) => sum + idea.upvotes.length, 0);
  
  const getStatusVariant = (status: Idea['status']) => {
    switch (status) {
      case 'Approved':
        return 'secondary';
      case 'Rejected':
        return 'destructive';
      case 'Completed':
        return 'default';
      case 'Pending':
      default:
        return 'outline';
    }
  };

  const visibleIdeas = showAllMyIdeas ? myIdeas : myIdeas.slice(0, 3);


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
                  <div className="space-y-2">
                    <label htmlFor="idea-location" className="font-medium">Location (Optional)</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input 
                          id="idea-location"
                          placeholder="e.g., Fagge, Kano"
                          value={newIdeaLocation}
                          onChange={(e) => setNewIdeaLocation(e.target.value)}
                          className="text-base py-6 pl-10"
                      />
                    </div>
                  </div>
              </CardContent>
              <CardFooter className="flex-col gap-4 p-6 md:p-8 bg-muted/50 rounded-b-lg">
                <Button type="submit" size="lg" className="w-full font-bold text-lg" disabled={isSubmitting}>
                   {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                   {isSubmitting ? 'Submitting...' : t.submitIdeaButton}
                </Button>
                <p className="text-xs text-muted-foreground text-center">Your idea will be reviewed by moderators before appearing for public vote. This ensures all submissions are constructive.</p>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="decide" className="mt-6">
          <div className="space-y-6">
              {livePolls.length > 0 ? (
                  livePolls.sort((a,b) => b.upvotes.length - a.upvotes.length).map((idea) => {
                  const hasVoted = authedUser?.profile?.votedOnIdeas?.includes(idea.id);
                  const votePercentage = totalVotes > 0 ? (idea.upvotes.length / totalVotes) * 100 : 0;
                  return (
                      <Card key={idea.id} className="w-full overflow-hidden shadow-md transition-shadow hover:shadow-xl duration-300">
                      <div className="grid md:grid-cols-3">
                          <div className="md:col-span-2 p-6">
                          <CardTitle className="text-2xl font-headline text-primary mb-2">{idea.title}</CardTitle>
                          <CardDescription className="text-sm mb-4">{t.by} <span className="font-semibold">{idea.author}</span></CardDescription>
                          <p className="text-muted-foreground text-base leading-relaxed">{idea.description}</p>
                          </div>
                          <div className="md:col-span-1 bg-muted/50 p-6 flex flex-col justify-center items-center gap-4 text-center">
                              <div className="space-y-2">
                                  <div className="flex items-baseline justify-center gap-2">
                                      <span className="text-5xl font-bold text-secondary">{idea.upvotes.length}</span>
                                      <span className="text-lg font-medium text-muted-foreground">Votes</span>
                                  </div>
                                  <div className="w-full">
                                    <Progress value={votePercentage} className="h-2" />
                                    <p className="text-sm font-semibold text-secondary mt-1">{votePercentage.toFixed(1)}% of total votes</p>
                                  </div>
                              </div>
                              <Button 
                                  size="lg"
                                  className="w-full font-bold text-base"
                                  variant={hasVoted ? "secondary" : "default"}
                                  onClick={() => handleUpvote(idea.id)}
                                  disabled={hasVoted || votingFor === idea.id}
                              >
                                  {hasVoted ? <Check className="mr-2 h-5 w-5" /> : <Vote className="mr-2 h-5 w-5" />}
                                  {hasVoted ? t.voted : (votingFor === idea.id ? 'Voting...' : t.upvote)}
                              </Button>
                          </div>
                      </div>
                      </Card>
                  );
                  })
              ) : (
                <div className="text-center py-20 bg-muted rounded-lg border border-dashed">
                    <Vote className="mx-auto h-16 w-16 text-muted-foreground/50" />
                    <h3 className="mt-6 text-2xl font-bold font-headline">No Live Polls</h3>
                    <p className="mt-2 text-lg text-muted-foreground">There are no ideas available for voting right now.</p>
                    <p className="mt-1 text-base text-muted-foreground">Why not be the first to submit one?</p>
                </div>
              )}
          </div>
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
                        <h4 className="font-semibold text-sm mb-3">My Submitted Ideas</h4>
                        {myIdeas.length > 0 ? (
                            <ul className="space-y-3">
                                {visibleIdeas.map(idea => (
                                <li key={idea.id} className="text-sm space-y-1">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium pr-2">{idea.title}</span>
                                      <Badge variant={getStatusVariant(idea.status)} className="text-xs">{idea.status}</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Submitted on {new Date(idea.createdAt as any).toLocaleDateString()}
                                    </p>
                                </li>
                                ))}
                            </ul>
                        ) : <p className="text-muted-foreground text-sm">{t.noSubmittedIdeas}</p>}
                      </div>
                       <div className="border-t pt-4">
                        <h4 className="font-semibold text-sm mb-2">{t.myVotes}</h4>
                         {myVotes.length > 0 ? (
                            <ul className="space-y-2 text-sm">
                                {myVotes.map(i => <li key={i.id} className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-muted-foreground" /><span>{i.title}</span></li>)}
                            </ul>
                        ) : <p className="text-muted-foreground text-sm">{t.noVotes}</p>}
                      </div>
                  </CardContent>
                    {myIdeas.length > 3 && (
                        <CardFooter>
                            <Button variant="ghost" size="sm" className="w-full text-primary" onClick={() => setShowAllMyIdeas(!showAllMyIdeas)}>
                                {showAllMyIdeas ? 'Show Less' : 'View All'}
                                {showAllMyIdeas ? <ChevronUpIcon className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                            </Button>
                        </CardFooter>
                    )}
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
