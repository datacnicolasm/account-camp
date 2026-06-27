"use client";

import { FileText, PanelLeftClose } from "lucide-react";

import type { LessonViewerAccountingExercise } from "@/lib/supabase/lesson-viewer.types";

import { AccountingContextPanel } from "./AccountingContextPanel";
import { AccountingInstructionsSection } from "./AccountingInstructionsSection";

interface AccountingContextSidePanelProps {
  exercise: LessonViewerAccountingExercise;
  xpPoints: number;
  onCollapse: () => void;
}

export function AccountingContextSidePanel({
  exercise,
  xpPoints,
  onCollapse,
}: AccountingContextSidePanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <header className="flex shrink-0 items-center border-b border-slate-200/80 bg-slate-50/90 px-3.5 py-2.5 dark:border-slate-700/50 dark:bg-slate-900/45">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/90 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-800/90 dark:ring-slate-600/40"
            aria-hidden="true"
          >
            <FileText className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
          </span>
          <h2 className="truncate text-sm font-medium tracking-tight text-slate-700 dark:text-slate-200">
            Ejercicio de causación
          </h2>
        </div>
        <button
          type="button"
          aria-label="Ocultar ejercicio de causación"
          onClick={onCollapse}
          className="ml-auto flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-white/70 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="p-4">
          <AccountingContextPanel exercise={exercise} />
        </div>

        <AccountingInstructionsSection
          instructions={exercise.instructions}
          xpPoints={xpPoints}
        />
      </div>
    </div>
  );
}
