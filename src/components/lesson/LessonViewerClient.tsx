"use client";

import { useState, useCallback } from "react";

import { LessonShell } from "./LessonShell";
import { VideoLessonPlayer } from "./VideoLessonPlayer";
import { ComingSoonLessonType } from "./ComingSoonLessonType";
import type {
  LessonViewerLesson,
  LessonViewerContext,
  LessonViewerVideo,
} from "@/lib/supabase/lessons";

interface LessonViewerClientProps {
  lesson: LessonViewerLesson;
  typeKey: string;
  video: LessonViewerVideo | null;
  context: LessonViewerContext | null;
  videoUrl: string;
  posterUrl: string | null;
  durationSeconds: number | null;
}

export function LessonViewerClient({
  lesson,
  typeKey,
  video,
  context,
  videoUrl,
  posterUrl,
  durationSeconds,
}: LessonViewerClientProps) {
  const [progressPercent, setProgressPercent] = useState(0);

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

  const content =
    typeKey === "video" && video ? (
      <VideoLessonPlayer
        lessonId={lesson.id}
        lessonName={lesson.name}
        videoUrl={videoUrl}
        posterUrl={posterUrl}
        durationSeconds={durationSeconds}
        initialPositionSeconds={0}
        xpPoints={lesson.xpPoints}
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
      nextLessonHref={null}
    >
      {content}
    </LessonShell>
  );
}
