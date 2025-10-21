
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
import { useUser } from "@/firebase/auth/use-user";
import { seededUsers } from "@/lib/data";


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
  const { login } = useUser();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: "", description: "" });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const showWelcomeDialog = async (email: string) => {
    const user = seededUsers.find(u => u.email === email);
    const userName = user ? user.name : "Citizen";
    
    setDialogContent({
        title: `${t.toastWelcome} ${userName.split(' ')[0]}!`,
        description: t.toastDescription,
    });
    setDialogOpen(true);
  };
  
  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find user in seeded data
    const foundUser = seededUsers.find(u => u.email === values.email);

    if (foundUser) {
        login(values.email);
        await showWelcomeDialog(values.email);
    } else {
        toast({
            variant: "destructive",
            title: t.toastErrorTitle,
            description: t.toastErrorDescription,
        });
    }
    
    setIsLoading(false);
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
                  <FormControl>
                    <Input 
                      placeholder="e.g. citizen@test.com" 
                      {...field} 
                      list="emails"
                    />
                  </FormControl>
                  <datalist id="emails">
                    {seededUsers.map(u => <option key={u.email} value={u.email} />)}
                  </datalist>
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
