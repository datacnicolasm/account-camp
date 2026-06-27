import type { LessonViewerAccountingExercise } from "@/lib/supabase/lesson-viewer.types";

import { AccountingDocumentVoucherList } from "./AccountingDocumentVoucherList";

interface AccountingContextPanelProps {
  exercise: LessonViewerAccountingExercise;
}

export function AccountingContextPanel({ exercise }: AccountingContextPanelProps) {
  const contextText = exercise.context.trim();

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          {exercise.title}
        </h1>
        {contextText ? (
          <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">
            {contextText}
          </p>
        ) : null}
      </header>

      <AccountingDocumentVoucherList documents={exercise.documents} />
    </div>
  );
}
