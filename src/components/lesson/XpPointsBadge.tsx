import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

interface XpPointsBadgeProps {
  points: number;
  variant?: "header" | "panel";
  className?: string;
}

export function XpPointsBadge({
  points,
  variant = "header",
  className,
}: XpPointsBadgeProps) {
  if (variant === "panel") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-md bg-amber-300 px-2.5 py-1 text-xs font-semibold text-amber-950",
          className
        )}
      >
        {points} XP
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90",
        className
      )}
    >
      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
      XP: {points}
    </span>
  );
}
