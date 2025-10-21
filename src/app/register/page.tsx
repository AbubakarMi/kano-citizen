"use client";

import { useState } from "react";
import { RegisterForm } from "@/components/register-form";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { translations, type Language } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
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
        <div className="relative min-h-screen w-full bg-background">
            <div className="absolute top-0 left-0 h-full w-1.5 bg-primary/20"></div>
            <header className="absolute top-0 z-40 w-full">
                <div className="container flex h-20 items-center justify-between">
                    <Link href="/" aria-label="Home">
                        <Logo />
                    </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
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
            </header>
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <div className="w-full max-w-sm space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight">{t.register.title}</h1>
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
