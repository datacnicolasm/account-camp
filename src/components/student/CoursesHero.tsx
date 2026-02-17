"use client";

import { BookOpen } from "lucide-react";

import { FadeIn } from "@/components/motion/FadeIn";

export function CoursesHero() {
  return (
    <FadeIn duration={0.4} y={8} delay={0.05}>
      <div className="relative isolate overflow-hidden rounded-2xl border border-white/10 px-6 py-8 shadow-lg md:px-8 md:py-10">
        {/* Gradient on inner layer to prevent border-radius bleed */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, #0b1f3a 0%, #0d2a48 35%, #13465c 70%, rgba(34, 211, 238, 0.18) 100%)",
            clipPath: "inset(0 round 1rem)",
          }}
        />
        {/* Subtle grid texture */}
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

        {/* Soft blur accent in corner */}
        <div className="absolute right-4 top-4 h-24 w-24 rounded-full bg-[#22d3ee]/25 blur-2xl" />

        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 flex-1 space-y-4">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-white/80 leading-none whitespace-nowrap">
              APRENDIZAJE PRÁCTICO
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Cursos
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
              Aprende con clases cortas, prácticas y enfocadas. Elige un curso
              y empieza hoy.
            </p>
          </div>

          <div className="hidden shrink-0 md:flex md:items-center md:justify-center">
            <div className="relative flex h-28 w-28 items-center justify-center">
              <div className="absolute inset-0 rounded-2xl bg-white/5 ring-1 ring-white/10" />
              <div className="absolute -left-2 -top-2 h-12 w-12 rounded-lg bg-white/10 ring-1 ring-white/15" />
              <div className="absolute -bottom-1 -right-1 h-16 w-16 rounded-xl bg-white/10 ring-1 ring-white/15" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-[#22d3ee]/20 ring-1 ring-[#22d3ee]/30">
                <BookOpen
                  className="h-8 w-8 text-[#22d3ee]"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

