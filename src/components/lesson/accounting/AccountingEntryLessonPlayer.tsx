"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, BookOpen, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { LessonViewerAccountingExercise } from "@/lib/supabase/lesson-viewer.types";

import { AccountingContextSidePanel } from "./AccountingContextSidePanel";
import {
  AccountingLedgerTable,
  createInitialLedgerRows,
  ledgerRowsToPayload,
  type LedgerRowState,
} from "./AccountingLedgerTable";
import { LessonSplitPane } from "./LessonSplitPane";

type FeedbackState = "idle" | "warning" | "success" | "redirecting";

const SUCCESS_NAV_DELAY_MS = 1200;

const UNBALANCED_MESSAGE =
  "El asiento contable no cumple con el principio de partida doble. Revisa tus sumas e inténtalo de nuevo.";

export interface AccountingValidationAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

interface AccountingEntryLessonPlayerProps {
  lessonId: string;
  exercise: LessonViewerAccountingExercise;
  xpPoints: number;
  nextLessonHref: string | null;
  onProgressChange: (params: { progressPercent: number }) => void;
  onComplete: () => void;
  onRegisterValidationAction: (action: AccountingValidationAction | null) => void;
}

export function AccountingEntryLessonPlayer({
  lessonId,
  exercise,
  xpPoints,
  nextLessonHref,
  onProgressChange,
  onComplete,
  onRegisterValidationAction,
}: AccountingEntryLessonPlayerProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [rows, setRows] = useState<LedgerRowState[]>(() =>
    createInitialLedgerRows(2)
  );
  const [feedbackState, setFeedbackState] = useState<FeedbackState>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isContextPanelCollapsed, setIsContextPanelCollapsed] = useState(false);

  const isLocked = feedbackState === "success" || feedbackState === "redirecting";

  const handleValidate = useCallback(async () => {
    if (isValidating || isLocked) return;

    const payloadRows = ledgerRowsToPayload(rows);
    if (payloadRows.length === 0) {
      setFeedbackState("warning");
      setFeedbackMessage(
        "Agrega al menos una fila con cuenta y valores antes de validar."
      );
      return;
    }

    setIsValidating(true);
    setFeedbackState("idle");
    setFeedbackMessage(null);

    try {
      const response = await fetch(
        `/api/lessons/${lessonId}/validate-accounting-entry`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rows: payloadRows }),
        }
      );

      const data = (await response.json()) as {
        ok?: boolean;
        errorCode?: string;
      };

      if (!response.ok || !data.ok) {
        if (data.errorCode === "UNBALANCED") {
          setFeedbackState("warning");
          setFeedbackMessage(UNBALANCED_MESSAGE);
        } else {
          setFeedbackState("warning");
          setFeedbackMessage(
            "No pudimos validar el asiento. Revisa tus datos e inténtalo de nuevo."
          );
        }
        return;
      }

      setFeedbackState("success");
      setFeedbackMessage("¡Asiento validado correctamente!");

      const completeResponse = await fetch(
        `/api/lessons/${lessonId}/complete`,
        { method: "POST" }
      );

      if (completeResponse.ok) {
        onProgressChange({ progressPercent: 100 });
        onComplete();

        if (nextLessonHref) {
          setFeedbackState("redirecting");
          window.setTimeout(() => {
            router.push(nextLessonHref);
          }, SUCCESS_NAV_DELAY_MS);
        }
      }
    } catch {
      setFeedbackState("warning");
      setFeedbackMessage(
        "Ocurrió un error al validar. Revisa tu conexión e inténtalo de nuevo."
      );
    } finally {
      setIsValidating(false);
    }
  }, [
    isValidating,
    isLocked,
    rows,
    lessonId,
    nextLessonHref,
    onProgressChange,
    onComplete,
    router,
  ]);

  useEffect(() => {
    onRegisterValidationAction({
      label: "Validar asiento",
      onClick: handleValidate,
      disabled: isLocked,
      isLoading: isValidating,
    });

    return () => {
      onRegisterValidationAction(null);
    };
  }, [handleValidate, isLocked, isValidating, onRegisterValidationAction]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden px-4 py-4">
        <LessonSplitPane
          initialLeftPercent={30}
          isLeftCollapsed={isContextPanelCollapsed}
          onExpandLeft={() => setIsContextPanelCollapsed(false)}
          left={
            <AccountingContextSidePanel
              exercise={exercise}
              xpPoints={xpPoints}
              onCollapse={() => setIsContextPanelCollapsed(true)}
            />
          }
          right={
            <div className="h-full rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <BookOpen
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <h2 className="text-sm font-semibold text-foreground">
                  Libro diario
                </h2>
              </div>
              <AccountingLedgerTable
                rows={rows}
                accounts={exercise.accounts}
                onRowsChange={setRows}
                disabled={isLocked}
              />
            </div>
          }
        />
      </div>

      <AnimatePresence mode="wait">
        {(feedbackState === "warning" ||
          feedbackState === "success" ||
          feedbackState === "redirecting") &&
        feedbackMessage ? (
          <motion.div
            key={feedbackState}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "mx-4 mb-4 flex items-start gap-3 rounded-xl border px-4 py-3",
              feedbackState === "warning"
                ? "border-amber-500/40 bg-amber-500/10"
                : "border-green-500/30 bg-green-500/10"
            )}
            role={feedbackState === "warning" ? "alert" : "status"}
          >
            {feedbackState === "warning" ? (
              <>
                <AlertTriangle
                  className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
                  aria-hidden="true"
                />
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                  {feedbackMessage}
                </p>
              </>
            ) : (
              <>
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400"
                  aria-hidden="true"
                />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    {feedbackMessage}
                  </p>
                  {feedbackState === "redirecting" && nextLessonHref ? (
                    <p className="text-xs text-green-700/90 dark:text-green-300/90">
                      Continuando con la siguiente lección…
                    </p>
                  ) : null}
                </div>
              </>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
