import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, Award, MessageSquareQuote, PencilRuler, Vote } from "lucide-react";
import { ideas } from "@/lib/data";
import { Progress } from "@/components/ui/progress";
import { ComplaintForm } from "@/components/complaint-form";
import { PlaceHolderImages } from "@/lib/placeholder-images";

interface LandingPageProps {
  onRegister: () => void;
  onLogin: () => void;
}

export function LandingPage({ onRegister, onLogin }: LandingPageProps) {
  const sortedIdeas = [...ideas].sort((a, b) => b.upvotes - a.upvotes);
  const topIdea = sortedIdeas[0];
  const totalVotes = ideas.reduce((sum, idea) => sum + idea.upvotes, 0);
  
  const speakImage = PlaceHolderImages.find(p => p.id === 'speak');
  const decideImage = PlaceHolderImages.find(p => p.id === 'decide');
  const buildImage = PlaceHolderImages.find(p => p.id === 'build');

  return (
    <>
      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-900">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32">
          <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Your Voice, <span className="text-primary">Your Kano</span>.
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-muted-foreground">
              Join thousands of citizens shaping the future of our state.
              Submit ideas, vote on priorities, and see your vision come to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="lg" onClick={onRegister} className="w-full">
                Register to Participate
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onLogin}
                className="w-full"
              >
                Sign In
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              It's free, secure, and takes less than a minute.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md shadow-2xl overflow-hidden border-2 border-primary/20">
              <CardHeader className="bg-primary/5 p-4">
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-xl leading-none">Top Community Idea</CardTitle>
                    <CardDescription className="text-sm">Currently leading the polls</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative h-48 w-full mb-4">
                  <Image
                    src="https://picsum.photos/seed/kano-hero/600/400"
                    alt="A vibrant depiction of Kano city"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                    data-ai-hint="vibrant city"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{topIdea.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {topIdea.description}
                </p>
                <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                  <span>by {topIdea.author}</span>
                  <div className="flex items-center gap-2 text-lg font-bold text-primary">
                    <ArrowUp className="h-5 w-5" />
                    <span>{topIdea.upvotes} Votes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-secondary/20 dark:bg-secondary/20 py-20 md:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">A Simple Path to Progress</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Your engagement drives real change in three straightforward steps.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              {speakImage && <Image src={speakImage.imageUrl} alt={speakImage.description} data-ai-hint={speakImage.imageHint} width={600} height={400} className="rounded-t-lg object-cover h-48 w-full" />}
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2"><MessageSquareQuote />Speak Up</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Submit your innovative ideas to address challenges and improve our community.</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              {decideImage && <Image src={decideImage.imageUrl} alt={decideImage.description} data-ai-hint={decideImage.imageHint} width={600} height={400} className="rounded-t-lg object-cover h-48 w-full" />}
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2"><Vote />Decide</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Vote on the ideas submitted by fellow citizens to prioritize what matters most.</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
             {buildImage && <Image src={buildImage.imageUrl} alt={buildImage.description} data-ai-hint={buildImage.imageHint} width={600} height={400} className="rounded-t-lg object-cover h-48 w-full" />}
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2"><PencilRuler />Build</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Follow the progress as top-voted ideas are turned into official directives and projects.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Live Polls Section */}
      <section className="bg-white dark:bg-gray-900 py-20 md:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Live Community Polls</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See what matters most to the people of Kano right now. Your vote can change these rankings.
            </p>
          </div>
          <div className="max-w-4xl mx-auto space-y-8">
            {sortedIdeas.map((idea) => {
              const votePercentage = totalVotes > 0 ? (idea.upvotes / totalVotes) * 100 : 0;
              return (
                <Card key={idea.id} className="overflow-hidden shadow-md transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div className="md:col-span-3">
                        <CardTitle className="text-lg font-semibold mb-1">{idea.title}</CardTitle>
                        <CardDescription className="text-sm">by {idea.author}</CardDescription>
                      </div>
                      <div className="flex items-center justify-end gap-4 text-right">
                         <div className="flex items-center gap-2 font-bold text-lg text-primary">
                           <ArrowUp className="h-5 w-5" />
                           {idea.upvotes}
                         </div>
                         <Button onClick={onLogin}>Vote</Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={votePercentage} aria-label={`${votePercentage.toFixed(0)}% of votes`} />
                      <p className="text-right text-sm font-medium text-primary mt-1">{votePercentage.toFixed(1)}%</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" onClick={onRegister}>
                Have an Idea? Register to Submit Yours!
            </Button>
          </div>
        </div>
      </section>

      {/* Complaint Section */}
      <section className="bg-secondary/20 dark:bg-secondary/20 py-20 md:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Voice a Concern</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Report issues or submit complaints. You can choose to remain anonymous or provide your details for a follow-up.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <ComplaintForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50">
        <div className="container py-8 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Kano Citizens' Voice Project. All Rights Reserved.</p>
          <p className="mt-1 font-semibold text-foreground/80">Speak. Decide. Build Together.</p>
        </div>
      </footer>
    </>
  );
}
