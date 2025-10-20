import { Layers3, MessageSquareText } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <h1 className="text-2xl font-bold tracking-tight text-blue-900 dark:text-white">
        bizzmine
      </h1>
    </div>
  );
}

    