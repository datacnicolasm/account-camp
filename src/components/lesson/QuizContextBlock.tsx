import { cn } from "@/lib/utils";

interface QuizContextBlockProps {
  context: string;
  className?: string;
}

export function QuizContextBlock({ context, className }: QuizContextBlockProps) {
  return (
    <p
      className={cn(
        "mb-6 whitespace-pre-wrap leading-relaxed text-stone-700 dark:text-stone-300",
        className
      )}
    >
      {context}
    </p>
  );
}
