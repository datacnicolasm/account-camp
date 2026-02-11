"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { Clock, Signal } from "lucide-react";

import type { CourseWithInstructor } from "@/lib/supabase/courses";
import { Button } from "@/components/ui/button";
import { getInitials, getSafeDisplayName } from "@/lib/ui/avatars";
import {
  difficultyToLabel,
  formatMinutesToDurationLabel,
} from "@/lib/courses/formatters";

interface CoursesGridProps {
  items: CourseWithInstructor[];
}

export function CoursesGrid({ items }: CoursesGridProps) {
  const shouldReduceMotion = useReducedMotion();

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
        <h2 className="text-base font-semibold text-foreground">
          No encontramos cursos con estos filtros
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Ajusta la búsqueda o la dificultad para ver más resultados.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {items.map((item, index) => {
        const { course, instructor } = item;
        const durationLabel = formatMinutesToDurationLabel(course.estimatedMinutes);
        const difficultyLabel = difficultyToLabel(course.difficulty);

        return (
          <motion.div
            key={course.id}
            initial={
              shouldReduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
              delay: shouldReduceMotion ? 0 : index * 0.05,
            }}
            className="group flex h-full flex-col"
          >
            <div className="relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-transform transition-colors hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 transition-opacity group-hover:bg-primary/10" />

              <div className="flex min-h-0 flex-1 flex-col">
                <div className="relative space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    CURSO
                  </p>
                  <h2 className="line-clamp-2 min-h-[2.5rem] text-base font-semibold tracking-tight text-foreground sm:text-lg">
                    {course.name}
                  </h2>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary-foreground">
                    <Signal className="h-3.5 w-3.5" aria-hidden="true" />
                    {difficultyLabel}
                  </span>
                </div>

                {course.shortDescription ? (
                  <p className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-muted-foreground">
                    {course.shortDescription}
                  </p>
                ) : (
                  <div className="mt-3 min-h-[2.5rem]" aria-hidden />
                )}

                <div className="my-4 flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {instructor?.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={instructor.avatarUrl}
                        alt={getSafeDisplayName(instructor.fullName)}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary-foreground">
                        {getInitials(instructor?.fullName)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-muted-foreground">
                        {getSafeDisplayName(instructor?.fullName)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto border-t border-border/60 pt-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {durationLabel}
                  </span>
                  <Button
                    asChild
                    size="sm"
                    className="rounded-full px-4 text-xs font-semibold"
                  >
                    <Link href={`/student/courses/${course.slug}`}>
                      Quiero aprender
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

