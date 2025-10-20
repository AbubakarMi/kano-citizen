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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Translation } from "@/lib/translations";


const complaintSchema = z.object({
  complaint: z.string().min(10, { message: "Please describe your complaint in at least 10 characters." }),
  isAnonymous: z.boolean().default(true),
  fullName: z.string().optional(),
  email: z.string().optional(),
  location: z.string().optional(),
}).refine(data => {
    if (!data.isAnonymous) {
        return !!data.fullName && !!data.email;
    }
    return true;
}, {
    message: "Full name and email are required if not anonymous.",
    path: ["fullName"],
});


export function ComplaintForm({ t }: { t: Translation['complaint'] }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof complaintSchema>>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      complaint: "",
      isAnonymous: true,
      fullName: "",
      email: "",
      location: "",
    },
  });

  const isAnonymous = form.watch("isAnonymous");

  const onSubmit = (values: z.infer<typeof complaintSchema>) => {
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      console.log("Complaint submitted:", values);
      toast({
        title: t.toastTitle,
        description: t.toastDescription,
      });
      form.reset();
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="complaint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.detailsLabel}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t.detailsPlaceholder}
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
                control={form.control}
                name="isAnonymous"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                        <FormControl>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>
                                {t.anonymousLabel}
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                                {t.anonymousDescription}
                            </p>
                        </div>
                    </FormItem>
                )}
            />

            {!isAnonymous && (
              <div className="space-y-4 p-4 border rounded-md bg-background/50">
                <p className="text-sm text-muted-foreground">{t.followUp}</p>
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
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.locationLabel}</FormLabel>
                      <FormControl><Input placeholder={t.locationPlaceholder} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? t.submittingButton : t.submitButton}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
