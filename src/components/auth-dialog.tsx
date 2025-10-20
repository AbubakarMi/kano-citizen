"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import type { User } from "@/lib/data";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  location: z.string().optional(),
});

interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialMode: "login" | "register";
  onAuthSuccess: (user: User) => void;
}

export function AuthDialog({
  isOpen,
  onOpenChange,
  initialMode,
  onAuthSuccess,
}: AuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "", location: "" },
  });

  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      const mockUser: User = {
        name: "Mock User",
        email: values.email,
        submittedIdeas: ["idea-1"],
        votedOnIdeas: ["idea-2", "idea-3"],
        followedDirectives: ["dir-1"],
        volunteeredFor: [],
      };
      onAuthSuccess(mockUser);
      toast({
        title: `Welcome back, ${mockUser.name.split(' ')[0]}!`,
        description: "Ready to help build Kano?",
      });
      setIsLoading(false);
    }, 1000);
  };

  const onRegisterSubmit = (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      const newUser: User = {
        name: values.fullName,
        email: values.email,
        location: values.location,
        submittedIdeas: [],
        votedOnIdeas: [],
        followedDirectives: [],
        volunteeredFor: [],
      };
      onAuthSuccess(newUser);
      toast({
        title: "Account Created!",
        description: "Your voice can now be heard. Welcome to the platform.",
        variant: "default",
        className: "bg-primary text-primary-foreground border-primary",
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <Tabs defaultValue={initialMode} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Access Account</TabsTrigger>
            <TabsTrigger value="register">Register Voice</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <DialogHeader className="mb-4">
              <DialogTitle>Access Your Account</DialogTitle>
              <DialogDescription>
                Log in to speak, decide, and build with us.
              </DialogDescription>
            </DialogHeader>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between items-center">
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? "Signing In..." : "Access My Account"}
                    </Button>
                </div>
                 <div className="text-center text-sm">
                    <a href="#" className="text-secondary hover:underline">Forgot Password?</a>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="register">
            <DialogHeader className="mb-4">
              <DialogTitle>Register Your Voice</DialogTitle>
              <DialogDescription>
                Create your secure account to join the conversation.
              </DialogDescription>
            </DialogHeader>
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <p className="text-xs text-muted-foreground text-center">Your data is secure and will only be used to manage your participation in the KCVP.</p>
                <FormField
                  control={registerForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="Aisha Bello" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={registerForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location / Ward (Optional)</FormLabel>
                      <FormControl><Input placeholder="e.g., Fagge" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Creating Account..." : "Create My Account"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
