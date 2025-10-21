
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
import { Checkbox } from "./ui/checkbox";
import { WelcomeDialog } from "./welcome-dialog";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth, useFirestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";


const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
  rememberMe: z.boolean().default(false),
});


interface LoginFormProps {
    t: Translation['login'];
}

export function LoginForm({ t }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: "", description: "" });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const showWelcomeDialog = async (userId: string) => {
    if (!firestore) return;
    const userDoc = await getDoc(doc(firestore, "users", userId));
    const userName = userDoc.exists() ? userDoc.data().name : "Citizen";
    
    setDialogContent({
        title: `${t.toastWelcome} ${userName.split(' ')[0]}!`,
        description: t.toastDescription,
    });
    setDialogOpen(true);
  };
  
  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    if (!auth) return;
    setIsLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      await showWelcomeDialog(userCredential.user.uid);
    } catch (error: any) {
        console.error(error);
        toast({
            variant: "destructive",
            title: t.toastErrorTitle,
            description: error.message || t.toastErrorDescription,
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleDialogConfirm = () => {
    setDialogOpen(false);
    router.push('/');
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
                  <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
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
                  <Link href="#" className="text-sm text-secondary hover:underline">
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
