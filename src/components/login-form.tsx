
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
import { Checkbox } from "./ui/checkbox";
import { WelcomeDialog } from "./welcome-dialog";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
  rememberMe: z.boolean().default(false),
});

const FAKE_USER_SESSION_KEY = 'fake_user_session';

interface LoginFormProps {
    t: Translation['login'];
}

export function LoginForm({ t }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: "", description: "" });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
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

    setDialogContent({
        title: `${t.toastWelcome} ${userToLogin.name.split(' ')[0]}!`,
        description: t.toastDescription,
    });
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
        title={dialogContent.title}
        description={dialogContent.description}
        onConfirm={handleDialogConfirm}
      />
      <div className="space-y-6">
          <Button variant="outline" className="w-full">
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 400.2 0 261.8 0 123.8 111.8 12.8 244 12.8c70.3 0 129.8 27.8 174.2 71.9l-65.4 63.8C324.7 114.6 289.4 96 244 96c-82.6 0-149.7 67.5-149.7 150.9s67.1 150.9 149.7 150.9c97.1 0 131.2-70.9 135.9-108.9H244v-75.3h236.1c2.4 12.6 3.9 26.1 3.9 40.2z"></path></svg>
              Login with Google
          </Button>

          <div className="relative">
              <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                  or Login with Email
                  </span>
              </div>
          </div>

          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              <div className="flex items-center justify-between">
                  <FormField
                      control={form.control}
                      name="rememberMe"
                      render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                  <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                  />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                  Remember Me
                              </FormLabel>
                          </FormItem>
                      )}
                  />
                  <Link href="#" className="text-sm text-primary hover:underline">
                      {t.forgotPasswordLink}
                  </Link>
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? t.signingInButton : t.submitButton}
              </Button>
          </form>
          </Form>
      </div>
    </>
  );
}
