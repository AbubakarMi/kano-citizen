import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowUp, Award, MessageSquareQuote, PencilRuler, Vote, Handshake, Pin, FileText, HelpingHand, ChevronRight } from "lucide-react";
import type { Idea, Directive, VolunteerOpportunity, Testimonial, FAQ } from "@/lib/data";
import { Progress } from "@/components/ui/progress";
import { ComplaintForm } from "@/components/complaint-form";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from 'next/link';
import { Badge } from "./ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { Language, Translation } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";

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
  const otherIdeas = sortedIdeas.slice(1);
  const totalVotes = ideas.reduce((sum, idea) => sum + idea.upvotes, 0);
  
  const speakImage = PlaceHolderImages.find(p => p.id === 'speak');
  const decideImage = PlaceHolderImages.find(p => p.id === 'decide');
  const buildImage = PlaceHolderImages.find(p => p.id === 'build');

  return (
    <>
      {/* Hero Section */}
      <section className="bg-background">
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
            <Card className="w-full max-w-md shadow-2xl overflow-hidden border-2 border-primary/20 bg-card">
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
      <section id="how-it-works" className="py-20 md:py-24 bg-white dark:bg-card">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t.howItWorksTitle}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.howItWorksDescription}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              {speakImage && <Image src={speakImage.imageUrl} alt={speakImage.description} data-ai-hint={speakImage.imageHint} width={600} height={400} className="rounded-t-lg object-cover h-48 w-full" />}
              <CardHeader className="p-6">
                <CardTitle className="flex items-center justify-center gap-2 text-xl"><MessageSquareQuote />{t.step1Title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-muted-foreground">{t.step1Description}</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              {decideImage && <Image src={decideImage.imageUrl} alt={decideImage.description} data-ai-hint={decideImage.imageHint} width={600} height={400} className="rounded-t-lg object-cover h-48 w-full" />}
              <CardHeader className="p-6">
                <CardTitle className="flex items-center justify-center gap-2 text-xl"><Vote />{t.step2Title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-muted-foreground">{t.step2Description}</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
             {buildImage && <Image src={buildImage.imageUrl} alt={buildImage.description} data-ai-hint={buildImage.imageHint} width={600} height={400} className="rounded-t-lg object-cover h-48 w-full" />}
              <CardHeader className="p-6">
                <CardTitle className="flex items-center justify-center gap-2 text-xl"><PencilRuler />{t.step3Title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-muted-foreground">{t.step3Description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Complaint Section */}
      <section className="bg-white dark:bg-black py-20 md:py-24 overflow-hidden">
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-blue-900 dark:text-white">
                Complaint Management System
              </h2>
              <p className="text-lg text-muted-foreground">
                With Kano Citizens' Voice, you can easily <span className="text-blue-600 font-semibold">track</span>, <span className="text-blue-600 font-semibold">investigate</span>, and <span className="text-blue-600 font-semibold">correct</span> issues affecting your community, which helps in our complaint handling.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Button asChild size="lg" className="bg-blue-800 hover:bg-blue-900 text-white rounded-full">
                  <Link href="/register">Get started</Link>
                </Button>
                <Link href="/login" className="flex items-center font-semibold text-blue-700 hover:text-blue-800">
                  Or take our quick Guided Tour <ChevronRight className="ml-1 h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="hidden lg:block relative h-[450px] -mr-32">
                <div className="absolute inset-0 bg-white dark:bg-black [clip-path:url(#complaint-clip)]">
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
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t.livePollsTitle}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.livePollsDescription}
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
             <Card className="w-full shadow-2xl overflow-hidden border-2 border-primary/20 bg-card">
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
                <h3 className="text-xl font-bold mb-2">{topIdea.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {topIdea.description}
                </p>
                <div className="space-y-1">
                    <Progress value={(topIdea.upvotes / totalVotes) * 100} className="h-2" />
                    <p className="text-right text-sm font-medium text-primary">{((topIdea.upvotes / totalVotes) * 100).toFixed(1)}%</p>
                </div>

                <div className="mt-4 flex justify-between items-center text-sm font-medium">
                  <div className="flex items-center gap-2 font-bold text-lg text-primary">
                    <ArrowUp className="h-5 w-5" />
                    <span>{topIdea.upvotes} {t.votes}</span>
                  </div>
                   <Button asChild size="lg">
                    <Link href="/login">{t.voteButton}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="relative">
                <Carousel
                    opts={{
                    align: "start",
                    loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                    {otherIdeas.map((idea, index) => {
                        const votePercentage = totalVotes > 0 ? (idea.upvotes / totalVotes) * 100 : 0;
                        return(
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-full">
                           <Card className="shadow-md transition-all hover:shadow-lg duration-300 h-full">
                            <CardContent className="p-6 flex flex-col justify-between h-full">
                                <div>
                                    <h3 className="text-lg font-semibold mb-1 line-clamp-2">{idea.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{t.by} {idea.author}</p>
                                    <div className="space-y-1 mb-4">
                                        <Progress value={votePercentage} className="h-2" />
                                        <p className="text-right text-xs font-medium text-primary">{votePercentage.toFixed(1)}%</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 font-bold text-primary">
                                        <ArrowUp className="h-4 w-4" />
                                        {idea.upvotes}
                                    </div>
                                    <Button asChild variant="secondary">
                                        <Link href="/login">{t.voteButton}</Link>
                                    </Button>
                                </div>
                            </CardContent>
                            </Card>
                        </CarouselItem>
                    )})}
                    </CarouselContent>
                    <div className="flex justify-center gap-2 mt-4">
                        <CarouselPrevious />
                        <CarouselNext />
                    </div>
                </Carousel>
                 <div className="text-center mt-8">
                    <Button asChild size="lg" variant="outline">
                        <Link href="/register">{t.submitIdeaButton}</Link>
                    </Button>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* From Idea to Action Section */}
      <section id="directives" className="py-20 md:py-24 bg-white dark:bg-card">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t.ideaToActionTitle}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.ideaToActionDescription}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {directives.map(dir => (
              <Card key={dir.id} className="flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <Badge className="mb-2" variant={dir.status === 'Completed' || dir.status === 'An kammala' ? 'default' : 'secondary'}>{dir.status}</Badge>
                      <CardTitle className="text-xl">{dir.title}</CardTitle>
                    </div>
                    <FileText className="h-8 w-8 text-muted-foreground/50 shrink-0" />
                  </div>
                  <CardDescription>{dir.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <h4 className="font-semibold mb-3 text-base">{t.latestUpdates}</h4>
                  <ul className="space-y-3">
                  {dir.updates.map((update, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground"><Pin className="h-4 w-4 mt-1 shrink-0 text-primary/70" /><span>{update}</span></li>
                  ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-background py-20 md:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t.voicesOfKanoTitle}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.voicesOfKanoDescription}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="flex flex-col justify-between bg-card shadow-md">
                <CardContent className="p-6">
                  <p className="text-muted-foreground italic mb-6">"{testimonial.quote}"</p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={`https://picsum.photos/seed/${testimonial.name.split(' ')[0]}/40/40`} />
                      <AvatarFallback>{testimonial.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-base">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="py-20 md:py-24 bg-white dark:bg-card">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t.getInvolvedTitle}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
             {t.getInvolvedDescription}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {volunteerOpportunities.map(op => (
              <Card key={op.id} className="flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{op.title}</CardTitle>
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
      <section className="bg-background py-20 md:py-24">
        <div className="container max-w-4xl mx-auto">
           <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t.faqTitle}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.faqDescription}
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-card px-6 rounded-lg mb-2 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-lg text-left font-semibold py-5">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="container py-8 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} {t.footerText}</p>
          <p className="mt-1 font-semibold text-foreground/80">{t.footerSlogan}</p>
        </div>
      </footer>
    </>
  );
}
