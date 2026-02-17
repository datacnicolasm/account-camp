import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const isDev = process.env.NODE_ENV !== "production";

export async function POST(
  _request: Request,
  context: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await context.params;

  if (!lessonId) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: lessonRow } = await supabase
    .from("lessons")
    .select("id, xp_points")
    .eq("id", lessonId)
    .maybeSingle();

  if (!lessonRow) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  const xpAmount = Number(lessonRow.xp_points) || 0;

  const now = new Date().toISOString();
  const { error: updateError } = await supabase
    .from("user_lesson_progress")
    .upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        status: "completed",
        progress_percent: 100,
        completed_at: now,
        last_activity_at: now,
      },
      { onConflict: "user_id,lesson_id" }
    );

  if (updateError && isDev) {
    // eslint-disable-next-line no-console
    console.warn("[complete] upsert error:", updateError.message);
  }

  const dedupeKey = `lesson_completed:${user.id}:${lessonId}`;

  const { error: xpError } = await supabase.from("xp_transactions").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      event_type: "lesson_completed",
      xp_amount: xpAmount,
      dedupe_key: dedupeKey,
      metadata: {},
    },
    { onConflict: "user_id,dedupe_key", ignoreDuplicates: true }
  );

  if (xpError && isDev) {
    // eslint-disable-next-line no-console
    console.warn("[complete] xp insert error:", xpError.message);
  }

  return NextResponse.json({ ok: true });
}
