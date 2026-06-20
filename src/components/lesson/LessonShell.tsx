"use client";

import { LessonHeader } from "./LessonHeader";
import { LessonFooter } from "./LessonFooter";
import type { LessonViewerLesson, LessonViewerContext } from "@/lib/supabase/lesson-viewer.types";

interface LessonShellProps {
  lesson: LessonViewerLesson;
  context: LessonViewerContext | null;
  children: React.ReactNode;
  onMarkComplete: () => void;
  progressPercent: number;
  nextLessonHref?: string | null;
  showMarkCompleteButton?: boolean;
}

export function LessonShell({
  lesson,
  context,
  children,
  onMarkComplete,
  progressPercent,
  nextLessonHref = null,
  showMarkCompleteButton = true,
}: LessonShellProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <LessonHeader
        courseSlug={context?.courseSlug ?? null}
        context={context}
        xpPoints={lesson.xpPoints}
      />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </main>
      <LessonFooter
        progressPercent={progressPercent}
        onMarkComplete={onMarkComplete}
        nextLessonHref={nextLessonHref}
        showMarkCompleteButton={showMarkCompleteButton}
      />
    </div>
  );
}
