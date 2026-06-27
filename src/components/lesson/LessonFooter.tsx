"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface LessonFooterProps {
  progressPercent: number;
  onMarkComplete: () => void;
  nextLessonHref: string | null;
  showMarkCompleteButton?: boolean;
  requireCompletionToContinue?: boolean;
  validationAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    isLoading?: boolean;
  };
}

export function LessonFooter({
  progressPercent,
  onMarkComplete,
  nextLessonHref,
  showMarkCompleteButton = true,
  requireCompletionToContinue = false,
  validationAction,
}: LessonFooterProps) {
  const canContinue =
    Boolean(nextLessonHref) &&
    (!requireCompletionToContinue || progressPercent >= 100);
  return (
    <footer className="h-14 shrink-0 border-t border-white/10 bg-brand-navy px-4">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4">
        <div className="min-w-0 text-xs font-medium text-white/85">
          Progreso {progressPercent}%
        </div>

        <div className="flex-1 px-4">
          <div className="h-1.5 w-full max-w-xs rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {validationAction ? (
            <Button
              size="sm"
              onClick={validationAction.onClick}
              disabled={validationAction.disabled || validationAction.isLoading}
              className="cursor-pointer rounded-lg"
            >
              {validationAction.isLoading
                ? "Validando…"
                : validationAction.label}
            </Button>
          ) : showMarkCompleteButton ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={onMarkComplete}
              className="cursor-pointer rounded-lg border-white/20 bg-white/10 text-white no-underline hover:bg-white/20 hover:no-underline"
            >
              Marcar como completada
            </Button>
          ) : null}
          {canContinue && nextLessonHref ? (
            <Button asChild size="sm" className="cursor-pointer rounded-lg no-underline hover:no-underline">
              <Link href={nextLessonHref}>Continuar</Link>
            </Button>
          ) : (
            <Button size="sm" disabled className="rounded-lg">
              Continuar
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
}
