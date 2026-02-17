import { createClient } from "./server";

const isDev = process.env.NODE_ENV !== "production";

export interface LessonViewerLesson {
  id: string;
  name: string;
  xpPoints: number;
  typeSlug: string;
}

export interface LessonViewerVideo {
  bucket: string;
  videoPath: string;
  posterPath: string | null;
  durationSeconds: number | null;
}

export interface LessonViewerContext {
  courseSlug: string;
  courseName: string;
  chapterName: string;
  chapterPosition: number;
}

export interface LessonViewerData {
  lesson: LessonViewerLesson;
  typeKey: string;
  video: LessonViewerVideo | null;
  context: LessonViewerContext | null;
}

export async function fetchLessonViewerData(
  lessonId: string
): Promise<LessonViewerData | null> {
  const supabase = await createClient();

  const { data: lessonRow, error: lessonError } = await supabase
    .from("lessons")
    .select("id, name, xp_points, type_slug")
    .eq("id", lessonId)
    .maybeSingle();

  if (isDev) {
    // eslint-disable-next-line no-console
    console.log("[fetchLessonViewerData] lessonId:", lessonId, "lessons:", lessonRow ?? null, "lessonError:", lessonError?.message);
  }

  if (lessonError) throw lessonError;
  if (!lessonRow) return null;

  const lesson: LessonViewerLesson = {
    id: lessonRow.id,
    name: lessonRow.name,
    xpPoints: lessonRow.xp_points ?? 0,
    typeSlug: lessonRow.type_slug ?? "",
  };

  let typeKey = lesson.typeSlug;
  const { data: typeRow } = await supabase
    .from("lesson_types")
    .select("slug, name_es")
    .eq("slug", lesson.typeSlug)
    .maybeSingle();
  if (typeRow?.slug) typeKey = typeRow.slug;

  let video: LessonViewerVideo | null = null;
  if (lesson.typeSlug === "video") {
    const { data: videoRow, error: videoError } = await supabase
      .from("lesson_videos")
      .select(
        "lesson_id, storage_bucket, storage_path, duration_seconds, poster_path, captions_path"
      )
      .eq("lesson_id", lessonId)
      .maybeSingle();

    if (isDev && videoError) {
      // eslint-disable-next-line no-console
      console.log("[fetchLessonViewerData] lesson_videos error:", {
        code: videoError.code,
        message: videoError.message,
        details: videoError.details,
      });
    }

    if (videoRow) {
      const storagePath = (videoRow.storage_path as string | null) ?? "";
      video = {
        bucket: (videoRow.storage_bucket as string | null) ?? "lesson-videos",
        videoPath: storagePath,
        posterPath: (videoRow.poster_path as string | null) ?? null,
        durationSeconds:
          typeof videoRow.duration_seconds === "number"
            ? videoRow.duration_seconds
            : null,
      };
      if (isDev) {
        // eslint-disable-next-line no-console
        console.log("[fetchLessonViewerData] storage_bucket:", video.bucket, "storage_path:", video.videoPath);
      }
    }
  }

  let context: LessonViewerContext | null = null;
  const { data: pivotRow } = await supabase
    .from("chapter_lessons")
    .select(
      `
      chapter_id,
      position,
      chapters (
        id,
        name,
        position,
        course_id,
        courses (
          id,
          slug,
          name
        )
      )
    `
    )
    .eq("lesson_id", lessonId)
    .maybeSingle();

  const chapters = pivotRow?.chapters as
    | {
        id?: string;
        name?: string;
        position?: number;
        course_id?: string;
        courses?: { id?: string; slug?: string; name?: string } | null;
      }
    | null
    | undefined;

  const courseRow = chapters?.courses;

  if (chapters && courseRow) {
    context = {
      courseSlug: courseRow.slug ?? "",
      courseName: courseRow.name ?? "",
      chapterName: chapters.name ?? "",
      chapterPosition:
        typeof chapters.position === "number" ? chapters.position : 0,
    };
  }

  return {
    lesson,
    typeKey,
    video,
    context,
  };
}
