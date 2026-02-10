import { createClient } from "./server";

export type CourseDifficulty = "beginner" | "intermediate" | "advanced" | null;

export interface CourseListItem {
  id: string;
  name: string;
  slug: string;
  difficulty: CourseDifficulty;
  shortDescription: string | null;
  keywords: string[];
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

export async function fetchPublishedCoursesWithInstructors(): Promise<
  CourseWithInstructor[]
> {
  const supabase = await createClient();

  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select(
      "id, name, slug, difficulty, short_description, keywords, tutor_id, estimated_minutes, created_at"
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
    keywords: Array.isArray(c.keywords) ? (c.keywords as string[]) : [],
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

  let instructorsById: Record<string, InstructorSummary> = {};

  if (tutorIds.length > 0) {
    const { data, error } = await supabase
      .from("public_profiles")
      .select("id, full_name, avatar_url, role")
      .in("id", tutorIds);

    if (error) {
      if (isDev) {
        // eslint-disable-next-line no-console
        console.warn(
          "[fetchPublishedCoursesWithInstructors] instructors error",
          {
            source: "public_profiles",
            message: error.message,
          }
        );
      }
    } else {
      instructorsById =
        data?.reduce<Record<string, InstructorSummary>>((acc, row: any) => {
          acc[row.id] = {
            id: row.id,
            fullName: (row.full_name as string | null) ?? null,
            avatarUrl: (row.avatar_url as string | null) ?? null,
            role: (row.role as string | null) ?? null,
          };
          return acc;
        }, {}) ?? {};
    }
  }

  return normalizedCourses.map((course) => ({
    course,
    instructor: course.tutorId ? instructorsById[course.tutorId] ?? null : null,
  }));
}

