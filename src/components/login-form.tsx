"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Translation } from "@/lib/translations";
import { seededUsers, type User } from "@/lib/data";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const FAKE_USER_SESSION_KEY = 'fake_user_session';

interface LoginFormProps {
    t: Translation['login'];
}

export function LoginForm({ t }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if the user is one of the seeded admins
    const seededUser = seededUsers.find(u => u.email.toLowerCase() === values.email.toLowerCase());
    
    let userToLogin: User;

    if (seededUser) {
      // It's a seeded admin user
      userToLogin = {
        name: seededUser.name,
        email: seededUser.email,
        role: seededUser.role,
        mda: seededUser.mda,
        submittedIdeas: ["idea-1"],
        votedOnIdeas: ["idea-2", "idea-3"],
        followedDirectives: ["dir-1"],
        volunteeredFor: [],
      };
    } else {
      // It's a regular citizen user
       userToLogin = {
        name: "Kano Citizen",
        email: values.email,
        role: "Citizen",
        submittedIdeas: [],
        votedOnIdeas: [],
        followedDirectives: [],
        volunteeredFor: [],
      };
    }

    // Simulate session by storing user in localStorage
    localStorage.setItem(FAKE_USER_SESSION_KEY, JSON.stringify(userToLogin));

    toast({
      title: `${t.toastWelcome} ${userToLogin.name.split(' ')[0]}!`,
      description: t.toastDescription,
    });
    
    router.push('/');
    router.refresh();

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.emailLabel}</FormLabel>
              <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.passwordLabel}</FormLabel>
              <FormControl><Input type="password" placeholder="any password" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center pt-2">
            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? t.signingInButton : t.submitButton}
            </Button>
        </div>
        <div className="text-center text-sm text-muted-foreground">
            <Link href="#" className="text-primary hover:underline">{t.forgotPasswordLink}</Link>
        </div>
      </form>
    </Form>
  );
}
