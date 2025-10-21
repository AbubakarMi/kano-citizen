
"use client";

import { useState } from "react";
import { RegisterForm } from "@/components/register-form";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { translations, type Language } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Globe, Home } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export default function RegisterPage() {
    const [language, setLanguage] = useState<Language>('en');
    const t = translations[language];

    return (
        <div className="relative min-h-screen w-full">
            <header className="absolute top-0 z-40 w-full bg-primary text-primary-foreground">
                <div className="container flex h-20 items-center justify-between">
                    <Link href="/" aria-label="Home">
                        <Logo />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild className="hover:bg-primary/90 text-primary-foreground hover:text-primary-foreground">
                            <Link href="/" aria-label="Home">
                                <Home className="h-5 w-5" />
                            </Link>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="hover:bg-primary/90 text-primary-foreground hover:text-primary-foreground">
                                <Globe className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setLanguage('en')}>
                                English
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setLanguage('ha')}>
                                Hausa
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <div className="w-full max-w-sm space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">{t.register.title}</h1>
                        <p className="text-muted-foreground mt-2">{t.register.description}</p>
                    </div>
                    <RegisterForm t={t.register} />
                    <div className="mt-4 text-center text-sm">
                        {t.register.hasAccount}{" "}
                        <Link href="/login" className="font-semibold text-primary hover:underline">
                            {t.register.signInLink} &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
