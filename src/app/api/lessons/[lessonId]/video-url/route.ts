import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const SIGNED_URL_EXPIRY_SECONDS = 60 * 10; // 10 min

export async function GET(
  _request: Request,
  context: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await context.params;

  if (!lessonId) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();

    const { data: videoRow, error: videoError } = await supabase
      .from("lesson_videos")
      .select("lesson_id, storage_bucket, storage_path")
      .eq("lesson_id", lessonId)
      .maybeSingle();

    if (videoError) {
      return NextResponse.json(
        { error: "Failed to fetch lesson video", details: videoError.message },
        { status: 500 }
      );
    }

    if (!videoRow) {
      return NextResponse.json(
        { error: "Video record not found for lesson" },
        { status: 404 }
      );
    }

    const storagePath = (videoRow.storage_path as string | null) ?? "";

    if (!storagePath) {
      return NextResponse.json(
        { error: "No storage path in lesson_videos" },
        { status: 404 }
      );
    }

    const bucket =
      (videoRow.storage_bucket as string | null) ?? "lesson-videos";

    const { data: signedData, error: signedError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(storagePath, SIGNED_URL_EXPIRY_SECONDS);

    if (signedError) {
      return NextResponse.json(
        { error: "Failed to create signed URL", details: signedError.message },
        { status: 500 }
      );
    }

    if (!signedData?.signedUrl) {
      return NextResponse.json(
        { error: "No signed URL returned" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: signedData.signedUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("SUPABASE_SERVICE_ROLE_KEY")) {
      return NextResponse.json(
        { error: "Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY required" },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
