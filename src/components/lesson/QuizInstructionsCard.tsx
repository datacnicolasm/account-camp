import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface QuizInstructionsCardProps {
  className?: string;
}

export function QuizInstructionsCard({ className }: QuizInstructionsCardProps) {
  return (
    <section
      className={cn(
        "rounded-lg border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-stone-900/30",
        className
      )}
      aria-label="Instrucciones"
    >
      <div className="flex items-center gap-2">
        <Check
          className="h-4 w-4 shrink-0 text-primary"
          aria-hidden="true"
        />
        <span className="text-sm font-semibold text-foreground">
          Instrucciones
        </span>
      </div>
    </section>
  );
}

interface QuizQuestionPromptProps {
  questionText: string;
  className?: string;
}

export function QuizQuestionPrompt({
  questionText,
  className,
}: QuizQuestionPromptProps) {
  return (
    <p
      className={cn(
        "text-base font-medium leading-relaxed text-foreground",
        className
      )}
    >
      {questionText}
    </p>
  );
}
