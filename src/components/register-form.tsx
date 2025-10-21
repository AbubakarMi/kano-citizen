
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
import { useRouter } from "next/navigation";
import type { Translation } from "@/lib/translations";
import type { User } from "@/lib/data";
import { WelcomeDialog } from "./welcome-dialog";

const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  location: z.string().optional(),
});

const FAKE_USER_SESSION_KEY = 'fake_user_session';

interface RegisterFormProps {
    t: Translation['register'];
}

export function RegisterForm({ t }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "", location: "" },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    
    // Simulate API call for user creation
    await new Promise(resolve => setTimeout(resolve, 500));

    // All registered users are citizens by default.
    const newUser: User = {
        name: values.fullName,
        email: values.email,
        role: "Citizen",
        location: values.location,
        submittedIdeas: [],
        votedOnIdeas: [],
        followedDirectives: [],
        volunteeredFor: [],
    };
    
    // Simulate session by storing user in localStorage
    localStorage.setItem(FAKE_USER_SESSION_KEY, JSON.stringify(newUser));

    setDialogOpen(true);
    setIsLoading(false);
  };
  
  const handleDialogConfirm = () => {
    setDialogOpen(false);
    router.push('/');
    router.refresh();
  }

  return (
    <>
        <WelcomeDialog 
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            title={t.toastSuccessTitle}
            description={t.toastSuccessDescription}
            onConfirm={handleDialogConfirm}
        />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <p className="text-xs text-muted-foreground text-center">{t.formHint}</p>
                <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t.nameLabel}</FormLabel>
                    <FormControl><Input placeholder={t.namePlaceholder} {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
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
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t.locationLabel}</FormLabel>
                    <FormControl><Input placeholder={t.locationPlaceholder} {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? t.creatingAccountButton : t.submitButton}
                </Button>
            </form>
        </Form>
    </>
  );
}
