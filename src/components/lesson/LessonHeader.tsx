"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { LessonViewerContext } from "@/lib/supabase/lessons";

interface LessonHeaderProps {
  courseSlug: string | null;
  context: LessonViewerContext | null;
  xpPoints: number;
}

export function LessonHeader({
  courseSlug,
  context,
  xpPoints,
}: LessonHeaderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(!!user);
    });
  }, []);

  const backHref =
    courseSlug && isAuthenticated
      ? `/student/courses/${courseSlug}`
      : "/student/courses";

  return (
    <header
      className="h-14 shrink-0 border-b border-white/10 px-4"
      style={{
        background:
          "linear-gradient(135deg, #0b1f3a 0%, #0d2a48 50%, rgba(34, 211, 238, 0.12) 100%)",
      }}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4">
        <div className="min-w-0">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="cursor-pointer text-white/90 no-underline hover:bg-white/10 hover:text-white hover:no-underline"
          >
            <Link href={backHref}>
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">Volver al curso</span>
            </Link>
          </Button>
        </div>

        <div className="min-w-0 flex-1 truncate text-center text-sm font-medium text-white/90">
          {context ? (
            <span title={`${context.courseName} · ${context.chapterName}`}>
              {context.courseName}
              {context.chapterName ? ` · ${context.chapterName}` : ""}
            </span>
          ) : (
            <span>Course outline</span>
          )}
        </div>

        <div className="shrink-0">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            XP: {xpPoints}
          </span>
        </div>
      </div>
    </header>
  );
}
