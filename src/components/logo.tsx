import { Layers3, MessageSquareText } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
        <MessageSquareText className="h-7 w-7 text-primary" />
        <span className="font-bold text-xl tracking-tight">Kano Voice</span>
    </div>
  );
}
