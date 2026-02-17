"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getProgress,
  upsertProgress,
  updateProgress,
} from "@/lib/supabase/progress";
import { createClient } from "@/lib/supabase/client";

const THROTTLE_MS = 10000;
const THROTTLE_SECONDS = 10;

interface VideoLessonPlayerProps {
  lessonId: string;
  lessonName: string;
  videoUrl: string;
  posterUrl: string | null;
  durationSeconds: number | null;
  initialPositionSeconds: number;
  xpPoints: number;
  onProgressChange: (params: { lastPositionSeconds: number; progressPercent: number }) => void;
  onComplete: () => void;
}

export function VideoLessonPlayer({
  lessonId,
  lessonName,
  videoUrl,
  posterUrl,
  durationSeconds,
  initialPositionSeconds,
  xpPoints,
  onProgressChange,
  onComplete,
}: VideoLessonPlayerProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSavedAtRef = useRef<number>(0);
  const lastSavedPositionRef = useRef<number>(initialPositionSeconds);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [videoLoadError, setVideoLoadError] = useState(false);
  const hasCompletedRef = useRef(false);
  const resumePositionRef = useRef<number>(initialPositionSeconds);
  const didSeekRef = useRef(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(!!user);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    getProgress(lessonId).then((p) => {
      if (cancelled || !p || p.lastPositionSeconds <= 0) return;
      resumePositionRef.current = p.lastPositionSeconds;
      onProgressChange({
        lastPositionSeconds: p.lastPositionSeconds,
        progressPercent: p.progressPercent,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [lessonId, onProgressChange]);

  useEffect(() => {
    if (isAuthenticated !== true) return;
    upsertProgress({
      lessonId,
      status: "in_progress",
      progressPercent: Math.min(
        99,
        Math.floor(
          (resumePositionRef.current / (durationSeconds || 1)) * 100
        )
      ),
      lastPositionSeconds: resumePositionRef.current,
      durationSeconds,
    }).catch(() => {});
  }, [lessonId, durationSeconds, isAuthenticated]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const seekPosition = resumePositionRef.current;
    if (seekPosition <= 0) return;

    const performSeek = () => {
      if (didSeekRef.current) return;
      if (
        video.duration &&
        !isNaN(video.duration) &&
        seekPosition < video.duration
      ) {
        video.currentTime = seekPosition;
        didSeekRef.current = true;
      }
    };

    const onLoadedMetadata = () => performSeek();
    const onCanPlay = () => performSeek();

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("canplay", onCanPlay);
    if (video.readyState >= 1) performSeek();

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  const saveProgress = useCallback(
    (currentTime: number, duration: number) => {
      const percent = duration > 0 ? Math.min(99, Math.floor((currentTime / duration) * 100)) : 0;
      onProgressChange({ lastPositionSeconds: currentTime, progressPercent: percent });
      updateProgress({
        lessonId,
        lastPositionSeconds: currentTime,
        progressPercent: percent,
        durationSeconds: duration || undefined,
      }).catch(() => {});
      lastSavedAtRef.current = Date.now();
      lastSavedPositionRef.current = currentTime;
    },
    [lessonId, onProgressChange]
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const now = Date.now();
      const elapsed = (now - lastSavedAtRef.current) / 1000;
      const positionDelta = video.currentTime - lastSavedPositionRef.current;
      if (elapsed >= THROTTLE_MS / 1000 || positionDelta >= THROTTLE_SECONDS) {
        saveProgress(video.currentTime, video.duration);
      }
    };

    const handlePause = () => {
      if (video.currentTime - lastSavedPositionRef.current >= 2) {
        saveProgress(video.currentTime, video.duration);
      }
    };

    const handleEnded = () => {
      if (hasCompletedRef.current) return;
      hasCompletedRef.current = true;
      onProgressChange({
        lastPositionSeconds: video.duration || 0,
        progressPercent: 100,
      });
      if (isAuthenticated) {
        fetch(`/api/lessons/${lessonId}/complete`, { method: "POST" }).catch(
          () => {}
        );
      }
      onComplete();
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, [lessonId, saveProgress, onComplete, onProgressChange, durationSeconds, isAuthenticated]);

  const handleVideoError = useCallback(() => {
    setVideoLoadError(true);
  }, []);

  const handleRetry = useCallback(() => {
    setVideoLoadError(false);
    router.refresh();
  }, [router]);

  if (videoLoadError) {
    return (
      <div className="px-6 py-6">
        <div className="mx-auto max-w-6xl space-y-4">
          <p className="text-sm font-medium text-muted-foreground truncate">
            {lessonName}
          </p>
          <div className="rounded-lg border border-border bg-card p-8 text-center shadow-sm">
            <p className="text-muted-foreground">
              No pudimos cargar el video. Reintenta.
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <p className="text-sm font-medium text-muted-foreground truncate">
          {lessonName}
        </p>
        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl ?? undefined}
            controls
            className="w-full aspect-video bg-black"
            preload="metadata"
            playsInline
            onError={handleVideoError}
          />
        </div>
        {isAuthenticated === false && (
          <p className="text-center text-xs text-muted-foreground">
            Inicia sesión para guardar tu avance.
          </p>
        )}
      </div>
    </div>
  );
}
