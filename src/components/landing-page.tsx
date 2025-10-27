
"use client"

import Image from "next/image";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ArrowUp, Award, MessageSquareQuote, PencilRuler, Vote, Handshake, Pin, CheckCircle2, FolderClock, ChevronRight, Quote, Users, Sparkles, MapPin } from "lucide-react";
import type { Idea, Directive, VolunteerOpportunity, Testimonial, FAQ } from "@/lib/data";
import { Progress } from "@/components/ui/progress";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from 'next/link';
import { Badge } from "./ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { Language, Translation } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { HeroDashboard } from "./hero-dashboard";

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
  const livePolls = (ideas || []).filter(idea => idea.status === 'Approved');
  const sortedIdeas = [...livePolls].sort((a, b) => b.upvotes.length - a.upvotes.length);
  const topIdea = sortedIdeas[0];
  const otherIdeas = sortedIdeas.slice(1);
  const totalVotes = livePolls.reduce((sum, idea) => sum + idea.upvotes.length, 0);
  
  const speakImage = PlaceHolderImages.find(p => p.id === 'speak');
  const decideImage = PlaceHolderImages.find(p => p.id === 'decide');
  const buildImage = PlaceHolderImages.find(p => p.id === 'build');
  
  const [selectedTestimonial, setSelectedTestimonial] = useState(testimonials[0]);

  return (
    <div className="bg-warm-white text-charcoal">
      {/* Hero Section */}
       <section className="relative bg-warm-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute -inset-2 bg-gradient-to-tr from-primary to-secondary rounded-xl blur-3xl opacity-10"></div>
           <div className="absolute h-[500px] w-[500px] bg-primary/5 rounded-full -top-40 -left-40"></div>
           <div className="absolute h-[400px] w-[400px] bg-secondary/5 rounded-full -bottom-20 -right-20"></div>
        </div>
        <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-start text-left gap-6">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight font-headline">
                    {t.heroTitle} <span className="text-primary">{t.heroTitleSpan}</span>
                </h1>
                <p className="max-w-xl text-lg md:text-xl text-charcoal/80">
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
                 <p className="text-sm text-charcoal/60">{t.registerHint}</p>
            </div>
            <div>
              <HeroDashboard ideas={ideas} directives={directives} />
            </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-24 bg-pure-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline text-primary">{t.howItWorksTitle}</h2>
            <p className="mt-4 text-lg text-charcoal/80">
              {t.howItWorksDescription}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            
            {/* Step 1: Speak Up */}
            <div className="flex flex-col items-center gap-6">
                <div className="relative w-48 h-48 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-[10px] border-accent/20"></div>
                    <div className="absolute inset-[10px] rounded-full border-[10px] border-accent"></div>
                    <div className="relative w-40 h-40 rounded-full overflow-hidden clip-circle">
                         {speakImage && <Image src={speakImage.imageUrl} alt={t.step1Title} layout="fill" objectFit="cover" data-ai-hint={speakImage.imageHint} />}
                        <div className="absolute inset-0 bg-accent/30 flex items-center justify-center">
                            <MessageSquareQuote className="h-16 w-16 text-pure-white" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold font-headline text-primary">{t.step1Title}</h3>
                    <p className="text-charcoal/80 max-w-xs mx-auto">{t.step1Description}</p>
                </div>
            </div>

            {/* Step 2: Decide */}
             <div className="flex flex-col items-center gap-6">
                <div className="relative w-48 h-48 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-[10px] border-secondary/20"></div>
                    <div className="absolute inset-[10px] rounded-full border-[10px] border-secondary"></div>
                     <div className="relative w-40 h-40 rounded-full overflow-hidden clip-circle">
                         {decideImage && <Image src={decideImage.imageUrl} alt={t.step2Title} layout="fill" objectFit="cover" data-ai-hint={decideImage.imageHint} />}
                        <div className="absolute inset-0 bg-secondary/30 flex items-center justify-center">
                            <Vote className="h-16 w-16 text-pure-white" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold font-headline text-primary">{t.step2Title}</h3>
                    <p className="text-charcoal/80 max-w-xs mx-auto">{t.step2Description}</p>
                </div>
            </div>

            {/* Step 3: Build */}
             <div className="flex flex-col items-center gap-6">
                <div className="relative w-48 h-48 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-[10px] border-primary/20"></div>
                    <div className="absolute inset-[10px] rounded-full border-[10px] border-primary"></div>
                    <div className="relative w-40 h-40 rounded-full overflow-hidden clip-circle">
                        {buildImage && <Image src={buildImage.imageUrl} alt={t.step3Title} layout="fill" objectFit="cover" data-ai-hint={buildImage.imageHint} />}
                        <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                           <PencilRuler className="h-16 w-16 text-pure-white" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold font-headline text-primary">{t.step3Title}</h3>
                    <p className="text-charcoal/80 max-w-xs mx-auto">{t.step3Description}</p>
                </div>
            </div>
            
          </div>
        </div>
      </section>
      
      {/* Live Polls Section */}
      {topIdea && (
      <section id="live-polls" className="py-20 md:py-24">
        <div className="container">
           <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline text-primary">{t.livePollsTitle}</h2>
            <p className="mt-4 text-lg text-charcoal/80">
              {t.livePollsDescription}
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="lg:sticky top-24">
             <Card className="w-full shadow-lg overflow-hidden border-2 border-accent/20">
              <CardHeader className="bg-accent/5 p-6">
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8 text-accent" />
                  <div>
                    <CardTitle className="text-xl leading-none font-headline text-accent">{t.topIdeaTitle}</CardTitle>
                    <CardDescription className="text-sm text-charcoal/80">{t.topIdeaDescription}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 font-headline text-primary">{topIdea.title}</h3>
                 <p className="text-sm text-charcoal/80 mb-4">{t.by} {topIdea.author}
                   {topIdea.location && <span className="flex items-center gap-1.5 text-xs mt-1 text-muted-foreground"><MapPin className="h-3 w-3"/>{topIdea.location}</span>}
                 </p>
                <p className="text-charcoal/80 mb-4 line-clamp-3">
                  {topIdea.description}
                </p>
                <div className="space-y-1">
                    <Progress value={totalVotes > 0 ? (topIdea.upvotes.length / totalVotes) * 100 : 0} className="h-2" />
                    <p className="text-right text-sm font-medium text-secondary">{totalVotes > 0 ? ((topIdea.upvotes.length / totalVotes) * 100).toFixed(1) : 0}% of votes</p>
                </div>

                <div className="mt-4 flex justify-between items-center text-sm font-medium">
                  <div className="flex items-center gap-2 font-bold text-lg text-secondary">
                    <ArrowUp className="h-5 w-5" />
                    <span>{topIdea.upvotes.length} {t.votes}</span>
                  </div>
                   <Button asChild size="lg" variant="secondary">
                    <Link href="/login">{t.voteButton}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            </div>

            <div className="space-y-6">
                {otherIdeas.map((idea) => {
                    const votePercentage = totalVotes > 0 ? (idea.upvotes.length / totalVotes) * 100 : 0;
                    return (
                        <Card key={idea.id} className="shadow-md transition-all hover:shadow-lg duration-300">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-1 line-clamp-2 font-headline text-primary">{idea.title}</h3>
                                <p className="text-sm text-charcoal/80 mb-4">{t.by} {idea.author}
                                    {idea.location && <span className="flex items-center gap-1.5 text-xs mt-1 text-muted-foreground"><MapPin className="h-3 w-3"/>{idea.location}</span>}
                                </p>
                                <div className="space-y-1 mb-4">
                                    <Progress value={votePercentage} className="h-2" />
                                    <p className="text-right text-xs font-medium text-secondary">{votePercentage.toFixed(1)}%</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 font-bold text-secondary">
                                        <ArrowUp className="h-4 w-4" />
                                        {idea.upvotes.length}
                                    </div>
                                    <Button asChild variant="secondary">
                                        <Link href="/login">{t.voteButton}</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
                 <div className="text-center mt-8 pt-4 border-t">
                    <Button asChild size="lg">
                        <Link href="/register">{t.submitIdeaButton}</Link>
                    </Button>
                </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* From Idea to Action Section */}
      {directives && directives.length > 0 && (
      <section id="directives" className="py-20 md:py-24 bg-pure-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline text-primary">{t.ideaToActionTitle}</h2>
            <p className="mt-4 text-lg text-charcoal/80">
              {t.ideaToActionDescription}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {directives.map(dir => {
              const isCompleted = dir.status === 'Completed' || dir.status === 'An kammala';
              const isInProgress = dir.status === 'In Progress' || dir.status === 'Ana ci gaba';
              const isUnderReview = dir.status === 'Under Review' || dir.status === 'Ana dubawa';
              
              return (
                <Card key={dir.id} className="flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <CardHeader className="p-6 bg-warm-white/50">
                    <div className="flex items-start gap-4">
                        <div className={cn("h-8 w-8 shrink-0 mt-1 rounded-full flex items-center justify-center", 
                            isCompleted ? "bg-secondary" : isInProgress ? "bg-primary" : "bg-accent"
                        )}>
                            {isCompleted ? <CheckCircle2 className="h-5 w-5 text-pure-white" /> : <FolderClock className="h-5 w-5 text-pure-white" />}
                        </div>
                        <div className="flex-1">
                          <Badge className="mb-2" variant={isCompleted ? 'secondary' : isInProgress ? 'default' : isUnderReview ? 'accent' : 'outline'}>{dir.status}</Badge>
                          <CardTitle className="text-xl font-headline text-primary">{dir.title}</CardTitle>
                        </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 flex-grow">
                    <p className="text-charcoal/80 mb-6">{dir.description}</p>
                    
                    <h4 className="font-semibold mb-4 text-base font-headline text-primary">{t.latestUpdates}</h4>
                    <div className="relative pl-6">
                        <div className="absolute left-[11px] top-1 h-full w-0.5 bg-border"></div>
                        <ul className="space-y-8">
                        {dir.updates.map((update, i) => (
                          <li key={i} className="relative flex items-start gap-4 text-sm">
                            <div className="absolute left-[-15px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-pure-white border-2 border-primary">
                                <Pin className="h-3 w-3 text-primary" />
                            </div>
                            <span className="text-charcoal/80">{update}</span>
                          </li>
                        ))}
                        </ul>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
      )}

     {/* Get Involved Section */}
     {volunteerOpportunities && volunteerOpportunities.length > 0 && (
     <section id="get-involved" className="py-20 md:py-24 bg-primary text-pure-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">{t.getInvolvedTitle}</h2>
            <p className="mt-4 text-lg text-pure-white/80">{t.getInvolvedDescription}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-card text-card-foreground p-2 rounded-lg shadow-2xl grid md:grid-cols-2 gap-2 overflow-hidden">
              <div className="p-6 space-y-6">
                  {volunteerOpportunities.map(op => (
                    <div key={op.id}>
                      <h3 className="text-xl font-bold font-headline text-primary">{op.title}</h3>
                       <div className="flex flex-wrap gap-2 my-3">
                          {op.requiredSkills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                      </div>
                      <p className="text-card-foreground/80 mt-1 mb-4 line-clamp-2">{op.description}</p>
                      
                       <Dialog>
                          <DialogTrigger asChild>
                             <Button variant="accent">View Details</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle className="font-headline text-primary">{op.title}</DialogTitle>
                              <div className="flex flex-wrap gap-2 pt-2">
                                {op.requiredSkills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                              </div>
                            </DialogHeader>
                            <div className="py-4">
                              <p className="text-charcoal/80">{op.description}</p>
                            </div>
                            <DialogFooter>
                              <Button asChild><Link href="/register">Volunteer Now</Link></Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                    </div>
                  ))}
              </div>
              <div className="hidden md:flex flex-col justify-center">
                 <Image 
                    src="https://picsum.photos/seed/cathedral/600/800"
                    alt="Cityscape at night"
                    width={600}
                    height={800}
                    className="rounded-md object-cover w-full h-full min-h-[450px]"
                    data-ai-hint="cathedral night"
                  />
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Testimonials Section */}
      <section className="bg-pure-white py-20 md:py-24">
        <div className="container max-w-6xl">
            <div className="mb-16">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-4 bg-accent"></div>
                  <p className="text-sm font-bold uppercase tracking-wider text-accent font-sans">TESTIMONIALS</p>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 font-headline text-primary">{t.voicesOfKanoTitle}</h2>
                <p className="mt-4 text-lg text-charcoal/80 max-w-2xl">{t.voicesOfKanoDescription}</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-16 items-start">
                <div className="flex flex-col gap-4">
                    {testimonials.map((testimonial) => (
                        <button 
                            key={testimonial.name}
                            onClick={() => setSelectedTestimonial(testimonial)}
                            className={cn(
                                "flex items-center gap-4 text-left p-4 rounded-lg transition-all duration-300",
                                selectedTestimonial.name === testimonial.name 
                                    ? "bg-warm-white shadow-lg scale-105" 
                                    : "hover:bg-warm-white"
                            )}
                        >
                            <Avatar className="h-14 w-14 border-2 border-primary/20">
                               <AvatarImage src={`https://picsum.photos/seed/${testimonial.name.split(' ')[0]}/56/56`} />
                               <AvatarFallback>{testimonial.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold text-lg font-headline text-primary">{testimonial.name}</p>
                                <p className="text-sm text-charcoal/80">{testimonial.location}</p>
                            </div>
                             <Quote className={cn(
                                 "h-10 w-10 ml-auto shrink-0 transition-colors",
                                 selectedTestimonial.name === testimonial.name ? "text-accent" : "text-charcoal/20"
                             )} />
                        </button>
                    ))}
                </div>
                 <div className="relative pt-8 lg:pt-0">
                    <Quote className="h-24 w-24 text-accent/10 absolute -top-8 -left-8" />
                    <div className="relative z-10">
                        <p className="text-2xl lg:text-3xl font-medium leading-relaxed text-charcoal/80">
                            "{selectedTestimonial.quote}"
                        </p>
                        <div className="mt-8">
                            <p className="text-xl font-bold font-headline text-primary">{selectedTestimonial.name}</p>
                            <p className="text-charcoal/80">{selectedTestimonial.location}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-24">
        <div className="container max-w-4xl mx-auto">
           <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline text-primary">{t.faqTitle}</h2>
            <p className="mt-4 text-lg text-charcoal/80">
              {t.faqDescription}
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-pure-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-lg text-left font-semibold p-6 font-headline hover:text-primary">
                    {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-charcoal/80 px-6 pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-primary text-pure-white border-t">
        <div className="container py-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {t.footerText}</p>
          <p className="mt-1 font-semibold font-headline">{t.footerSlogan}</p>
        </div>
      </footer>
    </div>
  );
}
