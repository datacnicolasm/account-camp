/**
 * Server-only progress helpers. Uses createClient from server (has user session).
 */

import { createClient } from "./server";

const isDev = process.env.NODE_ENV !== "production";

export async function upsertLessonProgressInProgress(
  userId: string,
  lessonId: string,
  durationSeconds?: number | null
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("user_lesson_progress").upsert(
    {
      user_id: userId,
      lesson_id: lessonId,
      status: "in_progress",
      progress_percent: 0,
      last_position_seconds: 0,
      duration_seconds: durationSeconds ?? null,
      last_activity_at: new Date().toISOString(),
      started_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,lesson_id",
      ignoreDuplicates: false,
    }
  );

  if (error && isDev) {
    // eslint-disable-next-line no-console
    console.warn("[upsertLessonProgressInProgress]", error.message);
  }
}
