"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, ClipboardList, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import {
  hasQuizContext,
  hasQuizTopicTitle,
  isEnrichedQuizQuestion,
} from "@/lib/supabase/quiz-lesson.schema";
import type { LessonViewerQuiz } from "@/lib/supabase/lesson-viewer.types";
import { QuizContextBlock } from "./QuizContextBlock";
import { QuizInstructionsCard, QuizQuestionPrompt } from "./QuizInstructionsCard";

type FeedbackState = "idle" | "correct" | "incorrect" | "redirecting";

const SUCCESS_NAV_DELAY_MS = 1200;

interface QuizLessonPlayerProps {
  lessonId: string;
  quiz: LessonViewerQuiz;
  nextLessonHref: string | null;
  onProgressChange: (params: { progressPercent: number }) => void;
  onComplete: () => void;
}

export function QuizLessonPlayer({
  lessonId,
  quiz,
  nextLessonHref,
  onProgressChange,
  onComplete,
}: QuizLessonPlayerProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const redirectTimeoutRef = useRef<number | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { questionData } = quiz;
  const isEnrichedLayout = isEnrichedQuizQuestion(questionData);
  const isAnswerLocked =
    feedbackState === "correct" || feedbackState === "redirecting";

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current !== null) {
        window.clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  const scheduleNavigation = useCallback(
    (href: string) => {
      redirectTimeoutRef.current = window.setTimeout(() => {
        router.push(href);
      }, SUCCESS_NAV_DELAY_MS);
    },
    [router]
  );

  const handleOptionChange = useCallback(
    (value: string) => {
      if (isAnswerLocked) return;
      setSelectedOptionId(value);
      if (feedbackState === "incorrect") {
        setFeedbackState("idle");
      }
    },
    [feedbackState, isAnswerLocked]
  );

  const handleRetry = useCallback(() => {
    setFeedbackState("idle");
    setSelectedOptionId(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedOptionId || isSubmitting || isAnswerLocked) return;

    setIsSubmitting(true);

    const isCorrect = selectedOptionId === questionData.correctOptionId;

    if (isCorrect) {
      setFeedbackState("correct");

      try {
        const response = await fetch(`/api/lessons/${lessonId}/complete`, {
          method: "POST",
        });

        if (response.ok) {
          onProgressChange({ progressPercent: 100 });
          onComplete();

          if (nextLessonHref) {
            setFeedbackState("redirecting");
            scheduleNavigation(nextLessonHref);
          }
        }
      } catch {
        // Completion can be retried via footer.
      }
    } else {
      setFeedbackState("incorrect");
    }

    setIsSubmitting(false);
  }, [
    selectedOptionId,
    isSubmitting,
    isAnswerLocked,
    questionData.correctOptionId,
    lessonId,
    nextLessonHref,
    onProgressChange,
    onComplete,
    scheduleNavigation,
  ]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-auto px-4 py-6">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        {!isEnrichedLayout ? (
          <header className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/60"
              aria-hidden="true"
            >
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Pregunta de cuestionario para aprendizaje
            </p>
          </header>
        ) : null}

        {isEnrichedLayout ? (
          <div className="space-y-0">
            <h1 className="mb-4 text-2xl font-bold text-stone-900 dark:text-stone-100">
              {questionData.topicTitle}
            </h1>
            <QuizContextBlock context={questionData.context} />
            <div className="space-y-4">
              <QuizInstructionsCard />
              <QuizQuestionPrompt questionText={questionData.questionText} />
            </div>
          </div>
        ) : (
          <section className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            {hasQuizTopicTitle(questionData) ? (
              <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                {questionData.topicTitle}
              </h1>
            ) : null}
            {hasQuizContext(questionData) ? (
              <QuizContextBlock context={questionData.context} className="mb-0" />
            ) : null}
            {!hasQuizTopicTitle(questionData) && !hasQuizContext(questionData) ? (
              <p className="text-sm leading-relaxed text-foreground">
                {questionData.questionText}
              </p>
            ) : (
              <div className="space-y-4">
                <QuizInstructionsCard />
                <QuizQuestionPrompt questionText={questionData.questionText} />
              </div>
            )}
          </section>
        )}

        <div className="space-y-6">
          <RadioGroup
            value={selectedOptionId ?? undefined}
            onValueChange={handleOptionChange}
            disabled={isAnswerLocked}
            className="grid gap-3"
            aria-label="Opciones de respuesta"
          >
            {questionData.options.map((option) => (
              <Label
                key={option.id}
                htmlFor={`quiz-option-${option.id}`}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 transition-colors",
                  "hover:border-primary/30 hover:bg-muted/40",
                  selectedOptionId === option.id &&
                    "border-primary/40 bg-primary/5",
                  isAnswerLocked && "cursor-default opacity-80"
                )}
              >
                <RadioGroupItem
                  value={option.id}
                  id={`quiz-option-${option.id}`}
                  aria-label={option.text}
                />
                <span className="text-sm text-foreground">{option.text}</span>
              </Label>
            ))}
          </RadioGroup>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedOptionId || isSubmitting || isAnswerLocked}
              className="cursor-pointer"
            >
              {isSubmitting ? "Enviando…" : "Enviar respuesta"}
            </Button>

            {feedbackState === "incorrect" ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleRetry}
                className="cursor-pointer"
              >
                Intentar de nuevo
              </Button>
            ) : null}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {feedbackState === "correct" || feedbackState === "redirecting" ? (
            <motion.div
              key="quiz-feedback-correct"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex items-start gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-4"
              role="status"
            >
              <CheckCircle2
                className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400"
                aria-hidden="true"
              />
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  ¡Respuesta correcta!
                </p>
                {feedbackState === "redirecting" && nextLessonHref ? (
                  <p className="text-xs text-green-700/90 dark:text-green-300/90">
                    Continuando con la siguiente lección…
                  </p>
                ) : null}
              </div>
            </motion.div>
          ) : null}

          {feedbackState === "incorrect" ? (
            <motion.div
              key="quiz-feedback-incorrect"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4"
              role="alert"
            >
              <XCircle
                className="mt-0.5 h-5 w-5 shrink-0 text-destructive"
                aria-hidden="true"
              />
              <p className="text-sm font-medium text-destructive">
                Respuesta incorrecta. Revisa el caso e inténtalo de nuevo.
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
