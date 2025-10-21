import { Layers3, MessageSquareText } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
        <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
            <MessageSquareText className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-bold text-xl tracking-tight">Kano Voice</span>
    </div>
  );
}
