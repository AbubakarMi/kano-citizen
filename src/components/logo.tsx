import { Building2, MessageSquare } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <MessageSquare className="h-8 w-8 text-primary" />
        <Building2 className="h-4 w-4 absolute bottom-1 right-0 transform translate-x-1/4 translate-y-1/4 text-secondary" />
      </div>
      <h1 className="font-headline text-xl font-bold tracking-tight text-foreground">
        Kano Citizens' Voice
      </h1>
    </div>
  );
}
