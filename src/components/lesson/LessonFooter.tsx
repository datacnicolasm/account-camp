"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface LessonFooterProps {
  progressPercent: number;
  onMarkComplete: () => void;
  nextLessonHref: string | null;
}

export function LessonFooter({
  progressPercent,
  onMarkComplete,
  nextLessonHref,
}: LessonFooterProps) {
  return (
    <footer
      className="h-14 shrink-0 border-t border-white/10 px-4"
      style={{
        background:
          "linear-gradient(135deg, #0b1f3a 0%, #0d2a48 50%, rgba(34, 211, 238, 0.12) 100%)",
      }}
    >
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
          <Button
            variant="secondary"
            size="sm"
            onClick={onMarkComplete}
            className="cursor-pointer rounded-lg border-white/20 bg-white/10 text-white no-underline hover:bg-white/20 hover:no-underline"
          >
            Marcar como completada
          </Button>
          {nextLessonHref ? (
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
