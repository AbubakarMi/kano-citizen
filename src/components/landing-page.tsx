import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowUp, Award, MessageSquareQuote, PencilRuler, Vote, Handshake, Pin, FileText, HelpingHand } from "lucide-react";
import type { Idea, Directive, VolunteerOpportunity, Testimonial, FAQ } from "@/lib/data";
import { Progress } from "@/components/ui/progress";
import { ComplaintForm } from "@/components/complaint-form";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from 'next/link';
import { Badge } from "./ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { Language, Translation } from "@/lib/translations";

interface LandingPageProps {
  language: Language;
  t: Translation['landing'];
  complaintStrings: Translation['complaint'];
  ideas: Idea[];
  directives: Directive[];
  volunteerOpportunities: VolunteerOpportunity[];
  testimonials: Testimonial[];
  faqs: FAQ[];
}

export function LandingPage({ language, t, complaintStrings, ideas, directives, volunteerOpportunities, testimonials, faqs }: LandingPageProps) {
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
              {t.heroTitle}<span className="text-primary">{t.heroTitleSpan}</span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-muted-foreground">
              {t.heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
               <Button asChild size="lg" className="w-full">
                <Link href="/register">{t.registerButton}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full">
                 <Link href="/login">{t.signInButton}</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {t.registerHint}
            </p>
          </div>

          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md shadow-2xl overflow-hidden border-2 border-primary/20">
              <CardHeader className="bg-primary/5 p-4">
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-xl leading-none">{t.topIdeaTitle}</CardTitle>
                    <CardDescription className="text-sm">{t.topIdeaDescription}</CardDescription>
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
                  <span>{t.by} {topIdea.author}</span>
                  <div className="flex items-center gap-2 text-lg font-bold text-primary">
                    <ArrowUp className="h-5 w-5" />
                    <span>{topIdea.upvotes} {t.votes}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">{t.howItWorksTitle}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.howItWorksDescription}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              {speakImage && <Image src={speakImage.imageUrl} alt={speakImage.description} data-ai-hint={speakImage.imageHint} width={600} height={400} className="rounded-t-lg object-cover h-48 w-full" />}
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2"><MessageSquareQuote />{t.step1Title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t.step1Description}</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              {decideImage && <Image src={decideImage.imageUrl} alt={decideImage.description} data-ai-hint={decideImage.imageHint} width={600} height={400} className="rounded-t-lg object-cover h-48 w-full" />}
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2"><Vote />{t.step2Title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t.step2Description}</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
             {buildImage && <Image src={buildImage.imageUrl} alt={buildImage.description} data-ai-hint={buildImage.imageHint} width={600} height={400} className="rounded-t-lg object-cover h-48 w-full" />}
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2"><PencilRuler />{t.step3Title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t.step3Description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Live Polls Section */}
      <section className="bg-white dark:bg-gray-900 py-20 md:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">{t.livePollsTitle}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.livePollsDescription}
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
                        <CardDescription className="text-sm">{t.by} {idea.author}</CardDescription>
                      </div>
                      <div className="flex items-center justify-end gap-4 text-right">
                         <div className="flex items-center gap-2 font-bold text-lg text-primary">
                           <ArrowUp className="h-5 w-5" />
                           {idea.upvotes}
                         </div>
                         <Button asChild>
                            <Link href="/login">{t.voteButton}</Link>
                         </Button>
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
             <Button asChild size="lg">
                <Link href="/register">{t.submitIdeaButton}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* From Idea to Action Section */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">{t.ideaToActionTitle}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.ideaToActionDescription}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {directives.map(dir => (
              <Card key={dir.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className="mb-2" variant={dir.status === 'Completed' || dir.status === 'An kammala' ? 'default' : 'secondary'}>{dir.status}</Badge>
                      <CardTitle>{dir.title}</CardTitle>
                    </div>
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <CardDescription>{dir.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold mb-2">{t.latestUpdates}</h4>
                  <ul className="space-y-2">
                  {dir.updates.map((update, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><Pin className="h-4 w-4 mt-1 shrink-0" /><span>{update}</span></li>
                  ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white dark:bg-gray-900 py-20 md:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">{t.voicesOfKanoTitle}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.voicesOfKanoDescription}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={`https://picsum.photos/seed/${testimonial.name.split(' ')[0]}/40/40`} />
                      <AvatarFallback>{testimonial.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.location}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">{t.getInvolvedTitle}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
             {t.getInvolvedDescription}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {volunteerOpportunities.map(op => (
              <Card key={op.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{op.title}</CardTitle>
                  <CardDescription>{op.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <h4 className="font-semibold text-sm mb-2">{t.skillsNeeded}</h4>
                  <div className="flex flex-wrap gap-2">
                    {op.requiredSkills.map(skill => <Badge key={skill} variant="outline">{skill}</Badge>)}
                  </div>
                </CardContent>
                <CardFooter>
                    <Button asChild>
                        <Link href="/register"><Handshake className="mr-2 h-4 w-4" />{t.volunteerButton}</Link>
                    </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white dark:bg-gray-900 py-20 md:py-24">
        <div className="container max-w-4xl mx-auto">
           <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">{t.faqTitle}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.faqDescription}
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>


      {/* Complaint Section */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">{complaintStrings.title}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {complaintStrings.description}
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <ComplaintForm t={complaintStrings} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50">
        <div className="container py-8 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} {t.footerText}</p>
          <p className="mt-1 font-semibold text-foreground/80">{t.footerSlogan}</p>
        </div>
      </footer>
    </>
  );
}
