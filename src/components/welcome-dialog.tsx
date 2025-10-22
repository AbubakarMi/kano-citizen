
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { CheckCircle2, Sparkle } from "lucide-react";

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
}

export function WelcomeDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}: WelcomeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-primary text-primary-foreground border-primary/50 overflow-hidden p-0">
        <DialogHeader className="relative flex flex-col items-center justify-center text-center p-8 space-y-4">
            <Sparkle className="h-6 w-6 text-background/80 absolute top-8 left-12 animate-pulse" />
            <Sparkle className="h-4 w-4 text-background/80 absolute top-16 left-24 animate-pulse delay-200" />
            <Sparkle className="h-6 w-6 text-background/80 absolute top-8 right-12 animate-pulse" />
            <Sparkle className="h-4 w-4 text-background/80 absolute top-16 right-24 animate-pulse delay-200" />

            <div className="p-3 bg-primary-foreground/10 rounded-full">
                <CheckCircle2 className="h-16 w-16 text-background" />
            </div>
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
            <DialogDescription className="text-primary-foreground/80 max-w-sm">
                {description}
            </DialogDescription>
        </DialogHeader>
        <div className="px-8 pb-8">
            <Button 
                onClick={onConfirm}
                variant="outline"
                className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
                Let's Go!
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
