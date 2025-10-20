"use client";

import { RegisterForm } from "@/components/register-form";
import { Logo } from "@/components/logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
             <div className="mb-8">
                <Link href="/" aria-label="Home">
                    <Logo />
                </Link>
            </div>
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Register Your Voice</CardTitle>
                    <CardDescription>Create your secure account to join the conversation.</CardDescription>
                </CardHeader>
                <CardContent>
                    <RegisterForm />
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="underline text-primary">
                            Sign In
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
