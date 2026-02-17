"use client";

import { createClient } from "./client";

const isDev = process.env.NODE_ENV !== "production";

export interface LessonProgress {
  lastPositionSeconds: number;
  progressPercent: number;
  status: "not_started" | "in_progress" | "completed";
}

export function getLessonHref(lessonId: string): string {
  return `/lessons/${lessonId}`;
}

export async function fetchProgressForLessons(
  lessonIds: string[]
): Promise<Record<string, LessonProgress>> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || lessonIds.length === 0) return {};

  const { data, error } = await supabase
    .from("user_lesson_progress")
    .select("lesson_id, status, progress_percent")
    .eq("user_id", user.id)
    .in("lesson_id", lessonIds);

  if (error) {
    if (isDev) console.warn("[fetchProgressForLessons]", error.message);
    return {};
  }

  const map: Record<string, LessonProgress> = {};
  for (const row of data ?? []) {
    const status = (row.status as LessonProgress["status"]) ?? "not_started";
    const percent = Number(row.progress_percent) || 0;
    map[row.lesson_id] = {
      lastPositionSeconds: 0,
      progressPercent: percent,
      status: percent >= 100 ? "completed" : status,
    };
  }
  return map;
}

export async function getProgress(
  lessonId: string
): Promise<LessonProgress | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("user_lesson_progress")
    .select("last_position_seconds, progress_percent, status")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (error) {
    if (isDev) console.warn("[getProgress]", error.message);
    return null;
  }
  if (!data) return null;

  return {
    lastPositionSeconds: Number(data.last_position_seconds) || 0,
    progressPercent: Number(data.progress_percent) || 0,
    status: (data.status as LessonProgress["status"]) ?? "not_started",
  };
}

export async function upsertProgress(params: {
  lessonId: string;
  status: "in_progress" | "completed";
  progressPercent?: number;
  lastPositionSeconds?: number;
  durationSeconds?: number | null;
}): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const {
    lessonId,
    status,
    progressPercent = 0,
    lastPositionSeconds = 0,
    durationSeconds,
  } = params;

  const { error } = await supabase.from("user_lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      status,
      progress_percent: progressPercent,
      last_position_seconds: lastPositionSeconds,
      duration_seconds: durationSeconds ?? null,
      last_activity_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" }
  );

  if (error && isDev) console.warn("[upsertProgress]", error.message);
}

export async function updateProgress(params: {
  lessonId: string;
  lastPositionSeconds: number;
  progressPercent: number;
  durationSeconds?: number | null;
}): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { lessonId, lastPositionSeconds, progressPercent, durationSeconds } =
    params;

  const { error } = await supabase
    .from("user_lesson_progress")
    .update({
      last_position_seconds: lastPositionSeconds,
      progress_percent: progressPercent,
      duration_seconds: durationSeconds ?? null,
      last_activity_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId);

  if (error && isDev) console.warn("[updateProgress]", error.message);
}

/**
 * Marks lesson as completed. Only updates if status != 'completed' (idempotent).
 * XP trigger should use UNIQUE(user_id, dedupe_key) on xp_transactions
 * with dedupe_key = `lesson_complete_${lesson_id}` to avoid double XP.
 */
export async function completeLesson(
  lessonId: string,
  durationSeconds?: number | null
): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("user_lesson_progress")
    .update({
      status: "completed",
      progress_percent: 100,
      last_position_seconds: durationSeconds ?? null,
      duration_seconds: durationSeconds ?? null,
      last_activity_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .neq("status", "completed");

  if (error && isDev) console.warn("[completeLesson]", error.message);
}
