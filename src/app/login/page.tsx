"use client";

import { LoginForm } from "@/components/login-form";
import { Logo } from "@/components/logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <div className="mb-8">
                <Link href="/" aria-label="Home">
                    <Logo />
                </Link>
            </div>
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Access Your Account</CardTitle>
                    <CardDescription>Log in to speak, decide, and build with us.</CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                     <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="underline text-primary">
                            Register your voice
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
