
"use client";

import {
  Dialog,
  DialogContent,
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
      <DialogContent className="sm:max-w-md bg-secondary text-secondary-foreground border-secondary/50 overflow-hidden">
        <div className="relative flex flex-col items-center justify-center text-center p-8 space-y-4">
            <Sparkle className="h-6 w-6 text-accent absolute top-8 left-12 animate-pulse" />
            <Sparkle className="h-4 w-4 text-accent absolute top-16 left-24 animate-pulse delay-200" />
            <Sparkle className="h-6 w-6 text-accent absolute top-8 right-12 animate-pulse" />
            <Sparkle className="h-4 w-4 text-accent absolute top-16 right-24 animate-pulse delay-200" />

            <div className="p-3 bg-background/10 rounded-full">
                <CheckCircle2 className="h-16 w-16 text-background" />
            </div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-secondary-foreground/80 max-w-sm">
                {description}
            </p>
            <Button 
                onClick={onConfirm}
                variant="accent"
                className="w-full"
            >
                Let's Go!
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
