import "server-only";

import type { createClient } from "./server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

interface OrderedLessonEntry {
  lessonId: string;
  chapterPosition: number;
  lessonPosition: number;
}

export function buildLessonHref(lessonId: string): string {
  return `/lessons/${lessonId}`;
}

export async function resolveNextLessonHref(
  supabase: SupabaseServerClient,
  currentLessonId: string,
  courseId: string
): Promise<string | null> {
  const { data: chaptersRows, error: chaptersError } = await supabase
    .from("chapters")
    .select("id, position")
    .eq("course_id", courseId)
    .order("position", { ascending: true });

  if (chaptersError) throw chaptersError;

  const chaptersList = chaptersRows ?? [];
  if (chaptersList.length === 0) return null;

  const chapterIds = chaptersList.map((chapter) => chapter.id);
  const chapterPositionById = new Map(
    chaptersList.map((chapter) => [chapter.id, chapter.position] as const)
  );

  const { data: pivotRows, error: pivotError } = await supabase
    .from("chapter_lessons")
    .select(
      `
      chapter_id,
      position,
      lessons (
        id,
        is_published
      )
    `
    )
    .in("chapter_id", chapterIds)
    .order("position", { ascending: true });

  if (pivotError) throw pivotError;

  type PivotRow = {
    chapter_id: string;
    position: number;
    lessons: { id: string; is_published: boolean } | null;
  };

  const orderedLessons: OrderedLessonEntry[] = (
    (pivotRows ?? []) as unknown as PivotRow[]
  )
    .filter((row) => row.lessons?.is_published)
    .map((row) => ({
      lessonId: row.lessons!.id,
      chapterPosition: chapterPositionById.get(row.chapter_id) ?? 0,
      lessonPosition: row.position,
    }))
    .sort((a, b) => {
      if (a.chapterPosition !== b.chapterPosition) {
        return a.chapterPosition - b.chapterPosition;
      }
      return a.lessonPosition - b.lessonPosition;
    });

  const currentIndex = orderedLessons.findIndex(
    (entry) => entry.lessonId === currentLessonId
  );

  if (currentIndex === -1 || currentIndex >= orderedLessons.length - 1) {
    return null;
  }

  return buildLessonHref(orderedLessons[currentIndex + 1].lessonId);
}
