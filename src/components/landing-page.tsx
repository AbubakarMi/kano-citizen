

"use client"

import Image from "next/image";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ArrowUp, Award, MessageSquareQuote, PencilRuler, Vote, Handshake, Pin, CheckCircle2, FolderClock, ChevronRight, Quote, FileText, Check } from "lucide-react";
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
  const sortedIdeas = [...ideas].sort((a, b) => b.upvotes.length - a.upvotes.length);
  const topIdea = sortedIdeas[0];
  const otherIdeas = sortedIdeas.slice(1);
  const totalVotes = ideas.reduce((sum, idea) => sum + idea.upvotes.length, 0);
  
  const speakImage = PlaceHolderImages.find(p => p.id === 'speak');
  const decideImage = PlaceHolderImages.find(p => p.id === 'decide');
  const buildImage = PlaceHolderImages.find(p => p.id === 'build');
  
  const [activeInvolvedTab, setActiveInvolvedTab] = useState('volunteer');
  const [selectedTestimonial, setSelectedTestimonial] = useState(testimonials[0]);


  return (
    <>
      {/* Hero Section */}
      <section className="bg-background py-20 md:py-24 lg:py-32">
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight font-headline">
              {t.heroTitle}<span className="text-primary">{t.heroTitleSpan}</span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-muted-foreground">
              {t.heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
               <Button asChild size="lg" variant="landing" className="w-full">
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

          <div>
             <HeroDashboard />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-24 bg-card">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">{t.howItWorksTitle}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
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
                            <MessageSquareQuote className="h-16 w-16 text-white" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold font-headline">{t.step1Title}</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">{t.step1Description}</p>
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
                            <Vote className="h-16 w-16 text-white" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold font-headline">{t.step2Title}</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">{t.step2Description}</p>
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
                           <PencilRuler className="h-16 w-16 text-white" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold font-headline">{t.step3Title}</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">{t.step3Description}</p>
                </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Complaint Section */}
      <section className="bg-muted/30 py-20 md:py-24 overflow-hidden">
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">
                Complaint Management System
              </h2>
              <p className="text-lg text-muted-foreground">
                With Kano Citizens' Voice, you can easily <span className="text-primary font-semibold">track</span>, <span className="text-primary font-semibold">investigate</span>, and <span className="text-primary font-semibold">correct</span> issues affecting your community, which helps in our complaint handling.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Button asChild size="lg" variant="landing">
                  <Link href="/register">Get started</Link>
                </Button>
                <Link href="/login" className="flex items-center font-semibold text-primary hover:text-primary/80">
                  Or take our quick Guided Tour <ChevronRight className="ml-1 h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="hidden lg:block relative h-[450px] -mr-32">
                <div className="absolute inset-0 bg-background [clip-path:url(#complaint-clip)]">
                    <Image
                        src="https://picsum.photos/seed/complaint/800/600"
                        alt="A professional discussing a document"
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint="professional document"
                    />
                </div>
            </div>
          </div>
        </div>
        <svg width="0" height="0">
            <defs>
                <clipPath id="complaint-clip" clipPathUnits="objectBoundingBox">
                <path d="M0.25,0 C0.2,0,0.1,0.05,0.05,0.1 C-0.05,0.25,0,0.75,0.1,0.9 C0.15,0.95,0.25,1,0.3,1 L1,1 L1,0 Z" />
                </clipPath>
            </defs>
        </svg>
      </section>

      {/* Live Polls Section */}
      <section id="live-polls" className="bg-background py-20 md:py-24">
        <div className="container">
           <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">{t.livePollsTitle}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.livePollsDescription}
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="lg:sticky top-24">
             <Card className="w-full shadow-2xl overflow-hidden border-2 border-primary/20 bg-card">
              <CardHeader className="bg-primary/5 p-4">
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-xl leading-none font-headline">{t.topIdeaTitle}</CardTitle>
                    <CardDescription className="text-sm">{t.topIdeaDescription}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 font-headline">{topIdea.title}</h3>
                 <p className="text-sm text-muted-foreground mb-4">{t.by} {topIdea.author}</p>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {topIdea.description}
                </p>
                <div className="space-y-1">
                    <Progress value={(topIdea.upvotes.length / totalVotes) * 100} className="h-2 [&>*]:bg-secondary" />
                    <p className="text-right text-sm font-medium text-secondary">{((topIdea.upvotes.length / totalVotes) * 100).toFixed(1)}% of votes</p>
                </div>

                <div className="mt-4 flex justify-between items-center text-sm font-medium">
                  <div className="flex items-center gap-2 font-bold text-lg text-secondary">
                    <ArrowUp className="h-5 w-5" />
                    <span>{topIdea.upvotes.length} {t.votes}</span>
                  </div>
                   <Button asChild size="lg">
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
                                <h3 className="text-lg font-semibold mb-1 line-clamp-2 font-headline">{idea.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4">{t.by} {idea.author}</p>
                                <div className="space-y-1 mb-4">
                                    <Progress value={votePercentage} className="h-2 [&>*]:bg-secondary" />
                                    <p className="text-right text-xs font-medium text-secondary">{votePercentage.toFixed(1)}%</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 font-bold text-secondary">
                                        <ArrowUp className="h-4 w-4" />
                                        {idea.upvotes.length}
                                    </div>
                                    <Button asChild variant="outline">
                                        <Link href="/login">{t.voteButton}</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
                 <div className="text-center mt-8 pt-4 border-t">
                    <Button asChild size="lg" variant="outline">
                        <Link href="/register">{t.submitIdeaButton}</Link>
                    </Button>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* From Idea to Action Section */}
      <section id="directives" className="py-20 md:py-24 bg-card">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">{t.ideaToActionTitle}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.ideaToActionDescription}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {directives.map(dir => {
              const isCompleted = dir.status === 'Completed' || dir.status === 'An kammala';
              const Icon = isCompleted ? CheckCircle2 : FolderClock;
              
              return (
                <Card key={dir.id} className="flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <CardHeader className="p-6 bg-muted/30">
                    <div className="flex items-start gap-4">
                        <Icon className={cn("h-8 w-8 shrink-0 mt-1", isCompleted ? "text-secondary" : "text-amber-500")} />
                        <div className="flex-1">
                          <Badge className="mb-2" variant={isCompleted ? 'secondary' : 'default'}>{dir.status}</Badge>
                          <CardTitle className="text-xl font-headline">{dir.title}</CardTitle>
                        </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 flex-grow">
                    <p className="text-muted-foreground mb-6">{dir.description}</p>
                    
                    <h4 className="font-semibold mb-4 text-base font-headline">{t.latestUpdates}</h4>
                    <div className="relative pl-6">
                        <div className="absolute left-[11px] top-1 h-full w-0.5 bg-border"></div>
                        <ul className="space-y-8">
                        {dir.updates.map((update, i) => (
                          <li key={i} className="relative flex items-start gap-4 text-sm">
                            <div className="absolute left-[-15px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background border-2 border-primary">
                                <Pin className="h-3 w-3 text-primary" />
                            </div>
                            <span className="text-muted-foreground">{update}</span>
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

     {/* Get Involved Section */}
      <section id="get-involved" className="py-20 md:py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">{t.getInvolvedTitle}</h2>
            <p className="mt-4 text-lg text-primary-foreground/80">{t.getInvolvedDescription}</p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="flex items-start">
              <div className="flex flex-col">
                <button
                  onClick={() => setActiveInvolvedTab('volunteer')}
                  className={cn(
                    "px-8 py-3 text-lg font-semibold rounded-t-lg transition-colors",
                    activeInvolvedTab === 'volunteer' ? 'bg-background text-primary' : 'bg-transparent hover:bg-primary/80'
                  )}
                >
                  Volunteer
                </button>
              </div>
            </div>

            <div className="bg-background p-8 rounded-b-lg rounded-tr-lg shadow-2xl grid md:grid-cols-2 gap-12 items-center text-foreground">
              <div className="space-y-6">
                  {volunteerOpportunities.map(op => (
                    <div key={op.id} className="p-4 rounded-lg hover:bg-muted transition-colors">
                      <h3 className="text-xl font-bold font-headline">{op.title}</h3>
                       <div className="flex flex-wrap gap-2 my-3">
                          {op.requiredSkills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                      </div>
                      <p className="text-muted-foreground mt-1 mb-4 line-clamp-2">{op.description}</p>
                      
                       <Dialog>
                          <DialogTrigger asChild>
                             <Button variant="outline">View Details</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle className="font-headline">{op.title}</DialogTitle>
                              <div className="flex flex-wrap gap-2 pt-2">
                                {op.requiredSkills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                              </div>
                            </DialogHeader>
                            <div className="py-4">
                              <p className="text-muted-foreground">{op.description}</p>
                            </div>
                            <DialogFooter>
                              <Button asChild><Link href="/register">Volunteer Now</Link></Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                    </div>
                  ))}
              </div>
              <div className="flex flex-col justify-center">
                 <Image 
                    src="https://picsum.photos/seed/teamwork/600/800"
                    alt="Community volunteering"
                    width={600}
                    height={800}
                    className="rounded-lg object-cover w-full h-[450px]"
                    data-ai-hint="community teamwork"
                  />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-card py-20 md:py-24">
        <div className="container max-w-6xl">
            <div className="mb-16">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-4 bg-accent"></div>
                  <p className="text-sm font-bold uppercase tracking-wider text-accent font-sans">TESTIMONIALS</p>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 font-headline">{t.voicesOfKanoTitle}</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{t.voicesOfKanoDescription}</p>
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
                                    ? "bg-background shadow-lg scale-105" 
                                    : "hover:bg-background/50"
                            )}
                        >
                            <Avatar className="h-14 w-14 border-2 border-primary/20">
                               <AvatarImage src={`https://picsum.photos/seed/${testimonial.name.split(' ')[0]}/56/56`} />
                               <AvatarFallback>{testimonial.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold text-lg font-headline">{testimonial.name}</p>
                                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                            </div>
                             <Quote className={cn(
                                 "h-10 w-10 ml-auto shrink-0 transition-colors",
                                 selectedTestimonial.name === testimonial.name ? "text-accent" : "text-muted-foreground/20"
                             )} />
                        </button>
                    ))}
                </div>
                 <div className="relative pt-8 lg:pt-0">
                    <Quote className="h-24 w-24 text-accent/10 absolute -top-8 -left-8" />
                    <div className="relative z-10">
                        <p className="text-2xl lg:text-3xl font-medium leading-relaxed text-foreground/80">
                            "{selectedTestimonial.quote}"
                        </p>
                        <div className="mt-8">
                            <p className="text-xl font-bold font-headline">{selectedTestimonial.name}</p>
                            <p className="text-muted-foreground">{selectedTestimonial.location}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/30 py-20 md:py-24">
        <div className="container max-w-4xl mx-auto">
           <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">{t.faqTitle}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.faqDescription}
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-lg text-left font-semibold p-6 font-headline">
                    {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground px-6 pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-card border-t">
        <div className="container py-8 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} {t.footerText}</p>
          <p className="mt-1 font-semibold text-foreground/80 font-headline">{t.footerSlogan}</p>
        </div>
      </footer>
    </>
  );
}
