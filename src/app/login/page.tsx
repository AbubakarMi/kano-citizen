"use client";

import { useState } from "react";
import { LoginForm } from "@/components/login-form";
import { Logo } from "@/components/logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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


export default function LoginPage() {
    const [language, setLanguage] = useState<Language>('en');
    const t = translations[language];

    return (
      <>
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
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{t.login.title}</CardTitle>
                    <CardDescription>{t.login.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm t={t.login} />
                     <div className="mt-4 text-center text-sm">
                        {t.login.noAccount}{" "}
                        <Link href="/register" className="underline text-primary">
                            {t.login.registerLink}
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
      </>
    );
}
