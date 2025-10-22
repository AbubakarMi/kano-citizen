
"use client";

import { useState } from "react";
import { RegisterForm } from "@/components/register-form";
import Link from "next/link";
import { translations, type Language } from "@/lib/translations";
import { SiteHeader } from "@/components/site-header";
import { useUser } from "@/firebase/auth/use-user";
import { AppProvider } from "../app-provider";


function RegisterPageContent() {
    const [language, setLanguage] = useState<Language>('en');
    const { user, loading } = useUser();
    const t = translations[language];

    return (
        <div className="min-h-screen w-full flex flex-col bg-background">
             <SiteHeader 
                user={user}
                language={language}
                setLanguage={setLanguage}
                t={t.header}
                pageType="auth"
            />
            <main className="flex-grow flex flex-col items-center justify-center p-4">
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
            </main>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <AppProvider>
            <RegisterPageContent />
        </AppProvider>
    )
}
