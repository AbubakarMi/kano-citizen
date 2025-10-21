
import { MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
        <div className="h-8 w-8 bg-card rounded-full flex items-center justify-center">
            <MessageSquareText className="h-5 w-5 text-primary" />
        </div>
        <span className="font-bold text-xl tracking-tight">Kano Voice</span>
    </div>
  );
}
