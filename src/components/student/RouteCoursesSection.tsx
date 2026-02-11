"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { RouteCourseWithCourse } from "@/lib/supabase/routes";
import { formatDifficulty } from "@/lib/courses/formatters";

interface RouteCoursesSectionProps {
  routeDescription: string | null;
  courses: RouteCourseWithCourse[];
}

function formatIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function RouteCoursesSection({
  routeDescription,
  courses,
}: RouteCoursesSectionProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(
    courses[0]?.course.slug ?? null
  );
  const shouldReduceMotion = useReducedMotion();

  const handleToggle = (slug: string) => {
    setOpenSlug((current) => (current === slug ? null : slug));
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          Descripción
        </h2>
        {routeDescription ? (
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {routeDescription}
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Esta ruta aún no tiene una descripción detallada.
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-semibold text-foreground">
            Cursos incluidos
          </h2>
          <p className="text-xs text-muted-foreground">
            {courses.length} curso{courses.length !== 1 ? "s" : ""}
          </p>
        </div>

        {courses.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aún no hay cursos publicados en esta ruta.
          </p>
        ) : (
          <div className="space-y-3">
            {courses.map((item, index) => {
              const isOpen = openSlug === item.course.slug;
              const difficultyLabel = formatDifficulty(item.course.difficulty);

              return (
                <motion.div
                  key={item.course.id}
                  initial={
                    shouldReduceMotion ? undefined : { opacity: 0, y: 6 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="rounded-xl border border-border bg-card/60"
                >
                  <button
                    type="button"
                    onClick={() => handleToggle(item.course.slug)}
                    className="flex w-full items-center gap-4 px-4 py-3 text-left"
                    aria-expanded={isOpen}
                    aria-controls={`course-panel-${item.course.slug}`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary-foreground">
                      {formatIndex(index)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-medium text-foreground">
                          {item.course.name}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                          {difficultyLabel}
                        </span>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium">
                          {item.isRequired
                            ? "Requerido"
                            : "Opcional"}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`course-panel-${item.course.slug}`}
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
                        className="border-t border-border/60 px-4 pb-4 pt-3 text-sm text-muted-foreground"
                      >
                        <p>
                          {item.course.shortDescription ??
                            "Pronto verás más detalles de este curso."}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {item.course.keywords &&
                            item.course.keywords.length > 0 &&
                            item.course.keywords.map((keyword) => (
                              <span
                                key={keyword}
                                className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                              >
                                {keyword}
                              </span>
                            ))}

                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="ml-auto rounded-full px-4 text-xs font-medium"
                          >
                            <Link href={`/student/courses/${item.course.slug}`}>
                              Ver curso
                            </Link>
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

