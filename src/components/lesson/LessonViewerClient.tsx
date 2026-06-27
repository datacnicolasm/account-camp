"use client";

import { useState, useCallback } from "react";

import { LessonShell } from "./LessonShell";
import { VideoLessonPlayer } from "./VideoLessonPlayer";
import { QuizLessonPlayer } from "./QuizLessonPlayer";
import { ComingSoonLessonType } from "./ComingSoonLessonType";
import {
  AccountingEntryLessonPlayer,
  type AccountingValidationAction,
} from "./accounting/AccountingEntryLessonPlayer";
import type {
  LessonViewerLesson,
  LessonViewerContext,
  LessonViewerVideo,
  LessonViewerQuiz,
  LessonViewerAccountingExercise,
} from "@/lib/supabase/lesson-viewer.types";

interface LessonViewerClientProps {
  lesson: LessonViewerLesson;
  typeKey: string;
  video: LessonViewerVideo | null;
  quiz: LessonViewerQuiz | null;
  accountingExercise: LessonViewerAccountingExercise | null;
  context: LessonViewerContext | null;
  nextLessonHref: string | null;
  videoUrl: string;
  posterUrl: string | null;
  durationSeconds: number | null;
}

export function LessonViewerClient({
  lesson,
  typeKey,
  video,
  quiz,
  accountingExercise,
  context,
  nextLessonHref,
  videoUrl,
  posterUrl,
  durationSeconds,
}: LessonViewerClientProps) {
  const [progressPercent, setProgressPercent] = useState(0);
  const [validationAction, setValidationAction] =
    useState<AccountingValidationAction | null>(null);

  const handleProgressChange = useCallback(
    (params: { lastPositionSeconds: number; progressPercent: number }) => {
      setProgressPercent(params.progressPercent);
    },
    []
  );

  const handleComplete = useCallback(() => {
    setProgressPercent(100);
  }, []);

  const handleMarkComplete = useCallback(() => {
    fetch(`/api/lessons/${lesson.id}/complete`, { method: "POST" }).catch(
      () => {}
    );
    setProgressPercent(100);
  }, [lesson.id]);

  const handleQuizProgressChange = useCallback(
    (params: { progressPercent: number }) => {
      setProgressPercent(params.progressPercent);
    },
    []
  );

  const handleAccountingProgressChange = useCallback(
    (params: { progressPercent: number }) => {
      setProgressPercent(params.progressPercent);
    },
    []
  );

  const handleRegisterValidationAction = useCallback(
    (action: AccountingValidationAction | null) => {
      setValidationAction(action);
    },
    []
  );

  const isQuizLesson = typeKey === "quiz" && quiz !== null;
  const isAccountingLesson =
    typeKey === "accounting_entries" && accountingExercise !== null;

  const content = isAccountingLesson ? (
    <AccountingEntryLessonPlayer
      lessonId={lesson.id}
      exercise={accountingExercise}
      xpPoints={lesson.xpPoints}
      nextLessonHref={nextLessonHref}
      onProgressChange={handleAccountingProgressChange}
      onComplete={handleComplete}
      onRegisterValidationAction={handleRegisterValidationAction}
    />
  ) : isQuizLesson ? (
    <QuizLessonPlayer
      lessonId={lesson.id}
      quiz={quiz}
      nextLessonHref={nextLessonHref}
      onProgressChange={handleQuizProgressChange}
      onComplete={handleComplete}
    />
  ) : typeKey === "video" && video ? (
    <VideoLessonPlayer
      lessonId={lesson.id}
      videoUrl={videoUrl}
      posterUrl={posterUrl}
      durationSeconds={durationSeconds}
      initialPositionSeconds={0}
      onProgressChange={handleProgressChange}
      onComplete={handleComplete}
    />
  ) : (
    <ComingSoonLessonType typeKey={typeKey} />
  );

  return (
    <LessonShell
      lesson={lesson}
      context={context}
      onMarkComplete={handleMarkComplete}
      progressPercent={progressPercent}
      nextLessonHref={nextLessonHref}
      showMarkCompleteButton={!isQuizLesson && !isAccountingLesson}
      requireCompletionToContinue={isQuizLesson || isAccountingLesson}
      validationAction={isAccountingLesson ? validationAction ?? undefined : undefined}
    >
      {content}
    </LessonShell>
  );
}
