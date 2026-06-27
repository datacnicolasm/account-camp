import { CircleCheck } from "lucide-react";

import { XpPointsBadge } from "@/components/lesson/XpPointsBadge";
import { cn } from "@/lib/utils";

interface AccountingInstructionsSectionProps {
  instructions: string[];
  xpPoints: number;
  className?: string;
}

export function AccountingInstructionsSection({
  instructions,
  xpPoints,
  className,
}: AccountingInstructionsSectionProps) {
  if (instructions.length === 0) return null;

  return (
    <section
      className={cn("shrink-0 border-t border-border", className)}
      aria-label="Instrucciones"
    >
      <header className="flex shrink-0 items-center border-b border-slate-200/80 bg-slate-50/90 px-3.5 py-2.5 dark:border-slate-700/50 dark:bg-slate-900/45">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/90 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-800/90 dark:ring-slate-600/40"
            aria-hidden="true"
          >
            <CircleCheck className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
          </span>
          <h3 className="truncate text-sm font-medium tracking-tight text-slate-700 dark:text-slate-200">
            Instrucciones
          </h3>
        </div>
        <XpPointsBadge
          points={xpPoints}
          variant="panel"
          className="ml-auto shrink-0"
        />
      </header>

      <div className="max-h-[min(45vh,320px)] overflow-y-auto p-4">
        <ul className="list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
          {instructions.map((instruction, index) => (
            <li key={`${index}-${instruction}`}>{instruction}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
