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
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase/config";
import type { Translation } from "@/lib/translations";
import { seededUsers } from "@/lib/data";


const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required." }),
  email: z.string().email({ message: "Invalid email address." })
    .refine(email => !seededUsers.some(user => user.email === email), {
      message: "This email is reserved for a seeded administrative role. Please use a different email to register as a citizen.",
    }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  location: z.string().optional(),
});

interface RegisterFormProps {
    t: Translation['register'];
}

export function RegisterForm({ t }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "", location: "" },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // Update user profile with full name
      await updateProfile(user, { displayName: values.fullName });
      
      // All registered users are citizens by default.
      // The role is assigned on the main page based on the email.
      
      toast({
        title: t.toastSuccessTitle,
        description: t.toastSuccessDescription,
        variant: "default",
        className: "bg-primary text-primary-foreground border-primary",
      });

      router.push("/");
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: t.toastErrorTitle,
            description: error.message || t.toastErrorDescription,
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
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
            <Button type="submit" disabled={isLoading} className="w-full pt-2">
            {isLoading ? t.creatingAccountButton : t.submitButton}
            </Button>
        </form>
    </Form>
  );
}
