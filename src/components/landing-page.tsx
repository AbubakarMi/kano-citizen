import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { CheckCircle2, MessageCircle, Vote } from "lucide-react";

interface LandingPageProps {
  onRegister: () => void;
  onLogin: () => void;
}

export function LandingPage({ onRegister, onLogin }: LandingPageProps) {
  const features = [
    {
      icon: <MessageCircle className="h-10 w-10 text-primary" />,
      title: "Speak",
      description: "Submit your ideas and concerns directly. Your voice is the starting point for change.",
      image: PlaceHolderImages.find(img => img.id === 'speak')
    },
    {
      icon: <Vote className="h-10 w-10 text-accent" />,
      title: "Decide",
      description: "Vote on community priorities and influence what gets done. Every vote shapes our collective future.",
      image: PlaceHolderImages.find(img => img.id === 'decide')
    },
    {
      icon: <CheckCircle2 className="h-10 w-10 text-secondary" />,
      title: "Build Together",
      description: "Track government responses, follow directives, and volunteer for initiatives. Be part of the solution.",
      image: PlaceHolderImages.find(img => img.id === 'build')
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="container grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32">
        <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter">
            Your Voice Shapes Kano.
          </h1>
          <p className="max-w-xl text-lg md:text-xl text-foreground/80">
            Register to Speak, Decide, and Build Together. Create your secure account to submit ideas, vote on community priorities, and track the government's response to your input.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={onRegister}>
              Register Your Voice
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-secondary hover:text-secondary-foreground hover:border-secondary"
              onClick={onLogin}
            >
              Access Your Account
            </Button>
          </div>
        </div>
        <div className="relative h-64 md:h-96 w-full">
           <Image
            src="https://picsum.photos/seed/kano-hero/1200/800"
            alt="A vibrant depiction of Kano city"
            layout="fill"
            objectFit="cover"
            className="rounded-xl shadow-lg"
            data-ai-hint="vibrant city"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background/70 py-20 md:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Your Account for a Better Kano</h2>
            <p className="mt-4 text-lg text-foreground/70">
              Our platform ensures one voice, one vote, creating a credible and powerful space for every citizen.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="flex flex-col overflow-hidden text-center">
                {feature.image && (
                    <div className="aspect-video relative w-full">
                        <Image src={feature.image.imageUrl} alt={feature.image.description} layout="fill" objectFit="cover" data-ai-hint={feature.image.imageHint} />
                    </div>
                )}
                <CardHeader>
                  <div className="mx-auto bg-background p-3 rounded-full -mt-12 mb-4 border shadow-sm">
                    {feature.icon}
                  </div>
                  <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted">
        <div className="container py-8 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Kano Citizens' Voice Project. All Rights Reserved.</p>
          <p className="mt-1">Speak. Decide. Build Together.</p>
        </div>
      </footer>
    </>
  );
}
