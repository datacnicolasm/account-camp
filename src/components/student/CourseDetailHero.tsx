"use client";

import Link from "next/link";
import { ArrowRight, Award, Clock, Sparkles, Video } from "lucide-react";

import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/button";

function formatHours(totalMinutes: number): string {
  if (!totalMinutes || totalMinutes <= 0) return "-";
  return (totalMinutes / 60).toFixed(1);
}

export interface CourseDetailHeroProps {
  courseName: string;
  courseSlug: string;
  totalXp: number;
  totalMinutes: number;
  totalsByType: Record<string, number>;
  typeLabels: Record<string, string>;
  firstLessonId: string | null;
}

export function CourseDetailHero({
  courseName,
  courseSlug,
  totalXp,
  totalMinutes,
  totalsByType,
  typeLabels,
  firstLessonId,
}: CourseDetailHeroProps) {
  const hoursLabel = formatHours(totalMinutes);
  const hasFirstLesson = Boolean(firstLessonId);
  const startHref = hasFirstLesson
    ? `/student/courses/${courseSlug}/lecciones/${firstLessonId}`
    : null;

  const statItems: { label: string; value: string; icon: React.ReactNode }[] = [];
  Object.entries(totalsByType).forEach(([slug, count]) => {
    if (count > 0) {
      const label = typeLabels[slug] ?? slug;
      statItems.push({
        label,
        value: String(count),
        icon: slug === "video" ? <Video className="h-3.5 w-3.5" /> : null,
      });
    }
  });
  if (totalXp > 0) {
    statItems.push({
      label: "XP",
      value: String(totalXp),
      icon: <Sparkles className="h-3.5 w-3.5" />,
    });
  }
  if (totalMinutes > 0) {
    statItems.push({
      label: "Horas",
      value: hoursLabel,
      icon: <Clock className="h-3.5 w-3.5" />,
    });
  }

  return (
    <FadeIn duration={0.4} y={8} delay={0.05}>
      <div className="relative isolate overflow-hidden rounded-2xl border border-white/10 px-6 py-8 shadow-lg md:px-8 md:py-10">
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, #0b1f3a 0%, #0d2a48 35%, #13465c 70%, rgba(34, 211, 238, 0.2) 100%)",
            clipPath: "inset(0 round 1rem)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute right-4 top-4 h-24 w-24 rounded-full bg-[#22d3ee]/25 blur-2xl" />

        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-white/80 leading-none whitespace-nowrap">
                CURSO
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/40 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-100 leading-none whitespace-nowrap">
                <Award className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Certificado incluido
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {courseName}
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                asChild={Boolean(startHref)}
                disabled={!startHref}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-cyan-500/25 transition-transform transition-shadow hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                variant="default"
                size="sm"
              >
                {startHref ? (
                  <Link href={startHref}>
                    <span className="inline-flex items-center gap-2">
                      INICIAR APRENDIZAJE
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    INICIAR APRENDIZAJE
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                )}
              </Button>

              {statItems.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-sm text-white/85">
                  {statItems.map((item) => (
                    <span
                      key={item.label}
                      className="inline-flex items-center rounded-full bg-black/15 px-3 py-1 text-xs font-medium"
                    >
                      {item.icon && (
                        <span className="mr-1.5 text-white/80" aria-hidden>
                          {item.icon}
                        </span>
                      )}
                      {item.label}: {item.value}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hidden shrink-0 md:flex md:items-center md:justify-center">
            <div className="relative flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 rounded-2xl bg-white/5 ring-1 ring-white/10" />
              <div className="absolute -left-2 -top-2 h-11 w-11 rounded-lg bg-white/10 ring-1 ring-white/15" />
              <div className="absolute -bottom-1 -right-1 h-14 w-14 rounded-xl bg-white/10 ring-1 ring-white/15" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-[#22d3ee]/20 ring-1 ring-[#22d3ee]/30">
                <Video className="h-7 w-7 text-[#22d3ee]" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
