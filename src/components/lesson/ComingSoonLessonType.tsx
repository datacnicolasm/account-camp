"use client";

import { BookOpen } from "lucide-react";

interface ComingSoonLessonTypeProps {
  typeKey: string;
}

export function ComingSoonLessonType({ typeKey }: ComingSoonLessonTypeProps) {
  return (
    <div className="px-6 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card px-8 py-16 text-center shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted">
            <BookOpen className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            Esta tipología estará disponible pronto
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tipo: {typeKey || "Lección"}
          </p>
        </div>
      </div>
    </div>
  );
}
