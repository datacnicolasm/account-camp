"use client";

import { LessonHeader } from "./LessonHeader";
import { LessonFooter } from "./LessonFooter";
import type { LessonViewerLesson, LessonViewerContext } from "@/lib/supabase/lessons";

interface LessonShellProps {
  lesson: LessonViewerLesson;
  context: LessonViewerContext | null;
  children: React.ReactNode;
  onMarkComplete: () => void;
  progressPercent: number;
  nextLessonHref?: string | null;
}

export function LessonShell({
  lesson,
  context,
  children,
  onMarkComplete,
  progressPercent,
  nextLessonHref = null,
}: LessonShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <LessonHeader
        courseSlug={context?.courseSlug ?? null}
        context={context}
        xpPoints={lesson.xpPoints}
      />
      <main className="flex-1 min-h-0 overflow-auto">{children}</main>
      <LessonFooter
        progressPercent={progressPercent}
        onMarkComplete={onMarkComplete}
        nextLessonHref={nextLessonHref}
      />
    </div>
  );
}
