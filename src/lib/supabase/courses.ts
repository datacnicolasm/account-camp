import { createClient } from "./server";

export type CourseDifficulty = "beginner" | "intermediate" | "advanced" | null;

export interface CourseListItem {
  id: string;
  name: string;
  slug: string;
  difficulty: CourseDifficulty;
  shortDescription: string | null;
  tutorId: string | null;
  estimatedMinutes: number | null;
  createdAt: string;
}

export interface InstructorSummary {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: string | null;
}

export interface CourseWithInstructor {
  course: CourseListItem;
  instructor: InstructorSummary | null;
}

const isDev = process.env.NODE_ENV !== "production";

/** Memoized instructor table: try public_profiles first, fallback to profiles once on missing relation. */
let instructorTable: "public_profiles" | "profiles" = "public_profiles";

function isRelationNotFoundError(error: { message?: string; code?: string }): boolean {
  const msg = (error?.message ?? "").toLowerCase();
  return (
    msg.includes("relation") && (msg.includes("does not exist") || msg.includes("not found"))
  ) || (error?.code === "42P01");
}

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function fetchInstructorsForList(
  supabase: SupabaseClient,
  tutorIds: string[]
): Promise<Record<string, InstructorSummary>> {
  if (tutorIds.length === 0) return {};

  const table = instructorTable;
  const { data, error } = await supabase
    .from(table)
    .select("id, full_name, avatar_url, role")
    .in("id", tutorIds);

  if (error) {
    if (isRelationNotFoundError(error) && table === "public_profiles") {
      instructorTable = "profiles";
      return fetchInstructorsForList(supabase, tutorIds);
    }
    if (isDev) {
      // eslint-disable-next-line no-console
      console.warn("[fetchPublishedCoursesWithInstructors] instructors error", {
        source: table,
        message: error.message,
      });
    }
    return {};
  }

  return (
    data?.reduce<Record<string, InstructorSummary>>((acc, row: any) => {
      acc[row.id] = {
        id: row.id,
        fullName: (row.full_name as string | null) ?? null,
        avatarUrl: (row.avatar_url as string | null) ?? null,
        role: (row.role as string | null) ?? null,
      };
      return acc;
    }, {}) ?? {}
  );
}

export async function fetchPublishedCoursesWithInstructors(): Promise<
  CourseWithInstructor[]
> {
  const supabase = await createClient();

  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select(
      "id, name, slug, difficulty, short_description, tutor_id, estimated_minutes, created_at"
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (coursesError) {
    throw coursesError;
  }

  if (!courses || courses.length === 0) {
    return [];
  }

  const normalizedCourses: CourseListItem[] = courses.map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    difficulty: (c.difficulty as CourseDifficulty) ?? null,
    shortDescription: c.short_description ?? null,
    tutorId: c.tutor_id ?? null,
    estimatedMinutes:
      typeof c.estimated_minutes === "number" ? c.estimated_minutes : null,
    createdAt: c.created_at,
  }));

  const tutorIds = Array.from(
    new Set(
      normalizedCourses
        .map((c) => c.tutorId)
        .filter((id): id is string => Boolean(id))
    )
  );

  const instructorsById = await fetchInstructorsForList(supabase, tutorIds);

  return normalizedCourses.map((course) => ({
    course,
    instructor: course.tutorId ? instructorsById[course.tutorId] ?? null : null,
  }));
}

// ---------------------------------------------------------------------------
// Course detail (single course + chapters + lessons)
// ---------------------------------------------------------------------------

export interface LessonSummary {
  id: string;
  name: string;
  xpPoints: number;
  typeSlug: string;
  typeNameEs: string;
  estimatedMinutes: number | null;
  position: number;
  isRequired: boolean;
}

export interface ChapterWithLessons {
  id: string;
  name: string;
  description: string | null;
  position: number;
  lessons: LessonSummary[];
  totalXp: number;
  totalMinutes: number;
  totalsByType: Record<string, number>;
}

export interface CourseDetailCourse {
  id: string;
  name: string;
  slug: string;
  difficulty: CourseDifficulty;
  shortDescription: string | null;
  longDescription: string | null;
  tutorId: string | null;
  estimatedMinutes: number | null;
}

export interface CourseDetailResult {
  course: CourseDetailCourse;
  instructor: InstructorSummary | null;
  chapters: ChapterWithLessons[];
  totalEstimatedMinutesFromLessons: number;
  totalXpFromLessons: number;
  totalsByType: Record<string, number>;
  /** type_slug -> name_es for display in hero */
  typeLabels: Record<string, string>;
}

export async function fetchCourseDetailBySlug(
  slug: string
): Promise<CourseDetailResult | null> {
  const supabase = await createClient();

  const { data: courseRow, error: courseError } = await supabase
    .from("courses")
    .select(
      "id, name, slug, difficulty, short_description, long_description, tutor_id, estimated_minutes, is_published"
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (courseError) throw courseError;
  if (!courseRow) return null;

  const course: CourseDetailCourse = {
    id: courseRow.id,
    name: courseRow.name,
    slug: courseRow.slug,
    difficulty: (courseRow.difficulty as CourseDifficulty) ?? null,
    shortDescription: courseRow.short_description ?? null,
    longDescription: courseRow.long_description ?? null,
    tutorId: courseRow.tutor_id ?? null,
    estimatedMinutes:
      typeof courseRow.estimated_minutes === "number"
        ? courseRow.estimated_minutes
        : null,
  };

  const { data: chaptersRows, error: chaptersError } = await supabase
    .from("chapters")
    .select("id, name, description, position")
    .eq("course_id", course.id)
    .order("position", { ascending: true });

  if (chaptersError) throw chaptersError;
  const chaptersList = chaptersRows ?? [];
  if (chaptersList.length === 0) {
    const instructor = await fetchInstructorForCourse(supabase, course.tutorId);
    return {
      course,
      instructor,
      chapters: [],
      totalEstimatedMinutesFromLessons: 0,
      totalXpFromLessons: 0,
      totalsByType: {},
      typeLabels: {},
    };
  }

  const chapterIds = chaptersList.map((c: { id: string }) => c.id);

  const { data: pivotRows, error: pivotError } = await supabase
    .from("chapter_lessons")
    .select(
      `
      chapter_id,
      position,
      is_required,
      lessons (
        id,
        name,
        xp_points,
        type_slug,
        estimated_minutes,
        is_published
      )
    `
    )
    .in("chapter_id", chapterIds)
    .order("position", { ascending: true });

  if (pivotError) throw pivotError;

  const typeSlugs = new Set<string>();
  type PivotRow = {
    chapter_id: string;
    position: number;
    is_required: boolean;
    lessons:
      | {
          id: string;
          name: string;
          xp_points: number;
          type_slug: string;
          estimated_minutes: number | null;
          is_published: boolean;
        }
      | null;
  };
  const rawRows = (pivotRows ?? []) as unknown as PivotRow[];

  const byChapter: Record<
    string,
    Array<{
      position: number;
      isRequired: boolean;
      lesson: {
        id: string;
        name: string;
        xpPoints: number;
        typeSlug: string;
        estimatedMinutes: number | null;
      };
    }>
  > = {};

  for (const row of rawRows) {
    const lesson = row.lessons;
    if (!lesson || !lesson.is_published) continue;

    if (lesson.type_slug) typeSlugs.add(lesson.type_slug);

    if (!byChapter[row.chapter_id]) byChapter[row.chapter_id] = [];
    byChapter[row.chapter_id].push({
      position: row.position,
      isRequired: row.is_required ?? false,
      lesson: {
        id: lesson.id,
        name: lesson.name,
        xpPoints: lesson.xp_points ?? 0,
        typeSlug: lesson.type_slug ?? "",
        estimatedMinutes:
          typeof lesson.estimated_minutes === "number"
            ? lesson.estimated_minutes
            : null,
      },
    });
  }

  let typeNameBySlug: Record<string, string> = {};
  if (typeSlugs.size > 0) {
    const { data: typesRows } = await supabase
      .from("lesson_types")
      .select("slug, name_es")
      .in("slug", Array.from(typeSlugs));

    typeNameBySlug =
      typesRows?.reduce<Record<string, string>>((acc, row: any) => {
        acc[row.slug] = row.name_es ?? row.slug;
        return acc;
      }, {}) ?? {};
  }

  const chapters: ChapterWithLessons[] = chaptersList.map((ch: any) => {
    const lessonItems = (byChapter[ch.id] ?? [])
      .sort((a, b) => a.position - b.position)
      .map((item, idx) => ({
        id: item.lesson.id,
        name: item.lesson.name,
        xpPoints: item.lesson.xpPoints,
        typeSlug: item.lesson.typeSlug,
        typeNameEs: typeNameBySlug[item.lesson.typeSlug] ?? item.lesson.typeSlug,
        estimatedMinutes: item.lesson.estimatedMinutes,
        position: idx + 1,
        isRequired: item.isRequired,
      }));

    const totalXp = lessonItems.reduce((s, l) => s + l.xpPoints, 0);
    const totalMinutes = lessonItems.reduce(
      (s, l) => s + (l.estimatedMinutes ?? 0),
      0
    );
    const totalsByType: Record<string, number> = {};
    for (const l of lessonItems) {
      totalsByType[l.typeSlug] = (totalsByType[l.typeSlug] ?? 0) + 1;
    }

    return {
      id: ch.id,
      name: ch.name,
      description: ch.description ?? null,
      position: ch.position,
      lessons: lessonItems,
      totalXp,
      totalMinutes,
      totalsByType,
    };
  });

  const totalEstimatedMinutesFromLessons = chapters.reduce(
    (s, c) => s + c.totalMinutes,
    0
  );
  const totalXpFromLessons = chapters.reduce((s, c) => s + c.totalXp, 0);
  const totalsByType: Record<string, number> = {};
  for (const c of chapters) {
    for (const [slug, count] of Object.entries(c.totalsByType)) {
      totalsByType[slug] = (totalsByType[slug] ?? 0) + count;
    }
  }

  const instructor = await fetchInstructorForCourse(supabase, course.tutorId);

  return {
    course,
    instructor,
    chapters,
    totalEstimatedMinutesFromLessons,
    totalXpFromLessons,
    totalsByType,
    typeLabels: typeNameBySlug,
  };
}

async function fetchInstructorForCourse(
  supabase: Awaited<ReturnType<typeof createClient>>,
  tutorId: string | null
): Promise<InstructorSummary | null> {
  if (!tutorId) return null;

  const { data, error } = await supabase
    .from("public_profiles")
    .select("id, full_name, avatar_url, role")
    .eq("id", tutorId)
    .maybeSingle();

  if (error && isDev) {
    // eslint-disable-next-line no-console
    console.warn("[fetchCourseDetailBySlug] instructor error", {
      message: error.message,
    });
  }
  if (error || !data) return null;

  return {
    id: data.id,
    fullName: (data.full_name as string | null) ?? null,
    avatarUrl: (data.avatar_url as string | null) ?? null,
    role: (data.role as string | null) ?? null,
  };
}

