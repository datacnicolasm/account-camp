"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { ChevronDown, BookOpen } from "lucide-react";

import type { ChapterWithLessons } from "@/lib/supabase/courses";

interface CourseChaptersSectionProps {
  chapters: ChapterWithLessons[];
}

function formatIndex(index: number): string {
  return String(index).padStart(2, "0");
}

export function CourseChaptersSection({ chapters }: CourseChaptersSectionProps) {
  const [openChapterId, setOpenChapterId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleToggle = (chapterId: string) => {
    setOpenChapterId((current) => (current === chapterId ? null : chapterId));
  };

  if (chapters.length === 0) {
    return (
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-base font-semibold text-foreground">
          Capítulos
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Aún no hay capítulos publicados en este curso.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-base font-semibold text-foreground">Capítulos</h2>
        <p className="text-xs text-muted-foreground">
          {chapters.length} capítulo{chapters.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-3">
        {chapters.map((chapter, index) => {
          const isOpen = openChapterId === chapter.id;
          const chapterLabel = `Capítulo ${formatIndex(chapter.position)}`;

          return (
            <motion.div
              key={chapter.id}
              initial={
                shouldReduceMotion ? undefined : { opacity: 0, y: 6 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="rounded-xl border border-border bg-card/60"
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
                        style={{ width: "0%" }}
                      />
                    </div>
                    <span className="w-8 text-right text-[11px] font-medium text-muted-foreground tabular-nums">
                      0%
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
                  >
                    Ver detalles
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggle(chapter.id)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground no-underline hover:no-underline hover:bg-muted hover:border-border transition-colors"
                  >
                    <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                    Ver lecciones
                  </button>
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
                      {chapter.lessons.map((lesson, lessonIndex) => (
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
                        </li>
                      ))}
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
