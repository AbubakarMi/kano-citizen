
"use client";

import { useState } from "react";
import { LoginForm } from "@/components/login-form";
import Link from "next/link";
import { translations, type Language, type Translation } from "@/lib/translations";
import { SiteHeader } from "@/components/site-header";
import { useUser } from "@/firebase/auth/use-user";

export default function LoginPage() {
    const [language, setLanguage] = useState<Language>('en');
    const { authedUser } = useUser();
    const t = translations[language];

    return (
      <div className="min-h-screen w-full flex flex-col bg-background">
        <SiteHeader 
            user={authedUser}
            language={language}
            setLanguage={setLanguage}
            t={t.header}
            pageType="auth"
        />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">{t.login.title}</h1>
                    <p className="text-muted-foreground mt-2">{t.login.description}</p>
                </div>
                <LoginForm t={t.login} />
                 <div className="mt-4 text-center text-sm">
                    {t.login.noAccount}{" "}
                    <Link href="/register" className="font-semibold text-primary hover:underline">
                        {t.login.registerLink} &rarr;
                    </Link>
                </div>
            </div>
        </main>
      </div>
    );
}
