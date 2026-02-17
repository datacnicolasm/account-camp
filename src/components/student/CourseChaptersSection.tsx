"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import {
  fetchProgressForLessons,
  getLessonHref,
  type LessonProgress,
} from "@/lib/supabase/progress";
import type { ChapterWithLessons } from "@/lib/supabase/courses";

interface CourseChaptersSectionProps {
  chapters: ChapterWithLessons[];
}

function formatIndex(index: number): string {
  return String(index).padStart(2, "0");
}

function isLessonCompleted(p: LessonProgress | undefined): boolean {
  if (!p) return false;
  return p.status === "completed" || p.progressPercent >= 100;
}

function isLessonInProgress(p: LessonProgress | undefined): boolean {
  if (!p) return false;
  return (
    p.status === "in_progress" ||
    (p.progressPercent > 0 && p.progressPercent < 100)
  );
}

function getLessonCtaLabel(p: LessonProgress | undefined): string {
  if (isLessonCompleted(p)) return "Repetir lección";
  if (isLessonInProgress(p)) return "Continuar lección";
  return "Empezar lección";
}

export function CourseChaptersSection({ chapters }: CourseChaptersSectionProps) {
  const [openChapterId, setOpenChapterId] = useState<string | null>(null);
  const [progressByLessonId, setProgressByLessonId] = useState<
    Record<string, LessonProgress>
  >({});
  const shouldReduceMotion = useReducedMotion();

  const allLessonIds = useMemo(
    () => chapters.flatMap((c) => c.lessons.map((l) => l.id)),
    [chapters]
  );

  useEffect(() => {
    fetchProgressForLessons(allLessonIds).then(setProgressByLessonId);
  }, [allLessonIds]);

  const chapterStates = useMemo(() => {
    const prevCompleted: boolean[] = [];
    return chapters.map((chapter, index) => {
      const lessons = chapter.lessons;
      const totalLessons = lessons.length;
      const completedLessons = lessons.filter((l) =>
        isLessonCompleted(progressByLessonId[l.id])
      ).length;
      const hasAnyProgress = lessons.some(
        (l) =>
          isLessonInProgress(progressByLessonId[l.id]) ||
          isLessonCompleted(progressByLessonId[l.id])
      );
      const chapterCompleted =
        totalLessons > 0 && completedLessons === totalLessons;
      const chapterProgressPercent =
        totalLessons > 0 ? Math.floor((completedLessons / totalLessons) * 100) : 0;

      const prevChapterCompleted = index === 0 ? true : prevCompleted[index - 1];
      prevCompleted.push(chapterCompleted);
      const isUnlocked = prevChapterCompleted;

      const firstLesson = lessons[0];
      const resumeLesson =
        lessons.find((l) => isLessonInProgress(progressByLessonId[l.id])) ??
        lessons.find((l) => !isLessonCompleted(progressByLessonId[l.id])) ??
        firstLesson;

      return {
        totalLessons,
        completedLessons,
        hasAnyProgress,
        chapterCompleted,
        chapterProgressPercent,
        isUnlocked,
        resumeLesson,
        firstLesson,
      };
    });
  }, [chapters, progressByLessonId]);

  const handleToggle = (chapterId: string) => {
    setOpenChapterId((current) => (current === chapterId ? null : chapterId));
  };

  if (chapters.length === 0) {
    return (
      <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="text-base font-semibold text-foreground">Capítulos</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Aún no hay capítulos publicados en este curso.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-base font-semibold text-foreground">Capítulos</h2>
        <p className="text-xs text-muted-foreground">
          {chapters.length} capítulo{chapters.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-3">
        {chapters.map((chapter, index) => {
          const isOpen = openChapterId === chapter.id;
          const state = chapterStates[index];
          const chapterLabel = `Capítulo ${formatIndex(chapter.position)}`;

          return (
            <motion.div
              key={chapter.id}
              initial={
                shouldReduceMotion ? undefined : { opacity: 0, y: 6 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="rounded-lg border border-border bg-card/60"
            >
              <div className="px-4 py-3 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                      {chapterLabel}
                    </p>
                    <h3 className="text-sm font-semibold text-foreground mt-0.5">
                      {chapter.name}
                    </h3>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="h-1.5 w-32 rounded-full bg-muted overflow-hidden sm:w-40">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                          width: `${state.chapterProgressPercent}%`,
                        }}
                      />
                    </div>
                    <span className="w-8 text-right text-[11px] font-medium text-muted-foreground tabular-nums">
                      {state.chapterProgressPercent}%
                    </span>
                  </div>
                </div>

                {chapter.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {chapter.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => handleToggle(chapter.id)}
                    className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-primary no-underline hover:no-underline hover:text-primary/90 transition-colors"
                    aria-expanded={isOpen}
                  >
                    Ver detalles
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {!state.isUnlocked ? (
                    <p className="text-xs text-muted-foreground">
                      Completa el capítulo anterior para desbloquear este.
                    </p>
                  ) : state.chapterCompleted ? (
                    <span className="inline-flex items-center rounded-lg border border-emerald-300/40 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-200">
                      Completado
                    </span>
                  ) : state.firstLesson ? (
                    <Link
                      href={getLessonHref(
                        (state.hasAnyProgress ? state.resumeLesson : state.firstLesson)!.id
                      )}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground no-underline hover:no-underline hover:bg-muted hover:border-border transition-colors"
                    >
                      {state.hasAnyProgress
                        ? "Continuar aprendizaje"
                        : "Empezar aprendizaje"}
                    </Link>
                  ) : null}
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`chapter-panel-${chapter.id}`}
                    initial={
                      shouldReduceMotion
                        ? undefined
                        : { opacity: 0, height: 0 }
                    }
                    animate={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 1, height: "auto" }
                    }
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, height: 0 }
                    }
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="border-t border-border/60 overflow-hidden"
                  >
                    <ul className="px-4 pb-4 pt-3 space-y-2">
                      {chapter.lessons.map((lesson, lessonIndex) => {
                        const p = progressByLessonId[lesson.id];
                        const href = getLessonHref(lesson.id);
                        const label = getLessonCtaLabel(p);

                        return (
                          <li
                            key={lesson.id}
                            className="flex flex-wrap items-center gap-2 py-2 border-b border-border/40 last:border-0 last:pb-0"
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-semibold text-muted-foreground">
                              {formatIndex(lessonIndex + 1)}
                            </span>
                            <span className="text-sm font-medium text-foreground min-w-0 flex-1">
                              {lesson.name}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                              {lesson.typeNameEs}
                            </span>
                            {lesson.xpPoints > 0 && (
                              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                +{lesson.xpPoints} XP
                              </span>
                            )}
                            {lesson.estimatedMinutes != null &&
                              lesson.estimatedMinutes > 0 && (
                                <span className="text-[10px] text-muted-foreground">
                                  {lesson.estimatedMinutes} min
                                </span>
                              )}
                            <Link
                              href={href}
                              className="inline-flex cursor-pointer shrink-0 items-center rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[10px] font-medium text-foreground no-underline hover:no-underline hover:bg-muted transition-colors"
                            >
                              {label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
