import { createClient } from "./server";

export interface RouteWithCount {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  courseCount: number;
}

export type CourseDifficulty = "beginner" | "intermediate" | "advanced";

export interface RouteCourseWithCourse {
  routeId: string;
  courseId: string;
  position: number;
  isRequired: boolean;
  course: {
    id: string;
    name: string;
    slug: string;
    difficulty: CourseDifficulty | null;
    shortDescription: string | null;
    estimatedMinutes: number | null;
    tutorId: string | null;
    keywords: string[] | null;
  };
}

export interface RouteInstructor {
  id: string;
  fullName: string | null;
  role: string | null;
  avatarUrl: string | null;
}

export interface RouteDetailResult {
  route: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  };
  courses: RouteCourseWithCourse[];
  instructors: RouteInstructor[];
}

const isDev = process.env.NODE_ENV !== "production";

function logRouteDetailDebug(stage: string, payload: unknown) {
  if (!isDev) return;
  // Keep logs concise and dev-only.
  // eslint-disable-next-line no-console
  console.log("[fetchRouteDetailBySlug]", stage, payload);
}

/**
 * Fetches published professional routes with count of published courses.
 * Uses two queries to avoid RPC/view; counts only published courses via pivot.
 */
export async function fetchPublishedRoutes(): Promise<RouteWithCount[]> {
  const supabase = await createClient();

  const { data: routes, error: routesError } = await supabase
    .from("professional_routes")
    .select("id, name, slug, description")
    .eq("is_published", true)
    .order("name");

  if (routesError) {
    throw routesError;
  }

  if (!routes?.length) {
    return [];
  }

  const { data: publishedCourses, error: coursesError } = await supabase
    .from("courses")
    .select("id")
    .eq("is_published", true);

  if (coursesError) {
    throw coursesError;
  }

  const publishedIds = new Set((publishedCourses ?? []).map((c) => c.id));

  const { data: pivotRows, error: pivotError } = await supabase
    .from("route_courses")
    .select("route_id, course_id");

  if (pivotError) {
    throw pivotError;
  }

  const countByRoute: Record<string, number> = {};
  for (const row of pivotRows ?? []) {
    if (publishedIds.has(row.course_id)) {
      countByRoute[row.route_id] = (countByRoute[row.route_id] ?? 0) + 1;
    }
  }

  return (routes ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description ?? null,
    courseCount: countByRoute[r.id] ?? 0,
  }));
}

/**
 * Fetches a single published professional route by slug with its ordered
 * published courses and unique instructor profiles.
 */
export async function fetchRouteDetailBySlug(
  slug: string
): Promise<RouteDetailResult | null> {
  const supabase = await createClient();

  // DEV-only: log which Supabase host we are hitting and a small sample of routes.
  if (isDev) {
    const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    let supabaseHost: string | null = null;
    try {
      if (rawUrl) {
        supabaseHost = new URL(rawUrl).host;
      }
    } catch {
      supabaseHost = null;
    }
    logRouteDetailDebug("A:slug", { slug, supabaseHost });

    try {
      const { data: sampleRoutes, error: sampleError } = await supabase
        .from("professional_routes")
        .select("slug,is_published")
        .limit(5);
      logRouteDetailDebug("A:sample-routes", {
        slugs: (sampleRoutes ?? []).map((r: any) => ({
          slug: r.slug,
          is_published: r.is_published,
        })),
        error: sampleError ? sampleError.message : null,
      });
    } catch (sampleException: any) {
      logRouteDetailDebug("A:sample-routes-exception", {
        message: sampleException?.message,
      });
    }
  }

  const { data: route, error: routeError } = await supabase
    .from("professional_routes")
    .select("id, name, slug, description, is_published")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  logRouteDetailDebug("B:route-query", {
    id: (route as any)?.id ?? null,
    slug: (route as any)?.slug ?? null,
    error: routeError ? routeError.message : null,
  });

  if (routeError) {
    throw routeError;
  }

  if (!route) {
    // Route really not found (or not published) for this slug.
    return null;
  }

  const { data: routeCourses, error: coursesError } = await supabase
    .from("route_courses")
    .select(
      `
        route_id,
        course_id,
        position,
        is_required,
        courses!inner (
          id,
          name,
          slug,
          difficulty,
          short_description,
          estimated_minutes,
          tutor_id,
          keywords,
          is_published
        )
      `
    )
    .eq("route_id", route.id)
    .eq("courses.is_published", true)
    .order("position", { ascending: true });

  logRouteDetailDebug("C:courses-query", {
    count: routeCourses?.length ?? 0,
    error: coursesError ? coursesError.message : null,
  });

  if (coursesError) {
    throw coursesError;
  }

  const courses: RouteCourseWithCourse[] =
    (routeCourses ?? []).map((row: any) => ({
      routeId: row.route_id,
      courseId: row.course_id,
      position: row.position,
      isRequired: row.is_required ?? false,
      course: {
        id: row.courses.id,
        name: row.courses.name,
        slug: row.courses.slug,
        difficulty: (row.courses.difficulty as CourseDifficulty | null) ?? null,
        shortDescription: row.courses.short_description ?? null,
        estimatedMinutes:
          typeof row.courses.estimated_minutes === "number"
            ? row.courses.estimated_minutes
            : null,
        tutorId: row.courses.tutor_id ?? null,
        keywords: Array.isArray(row.courses.keywords)
          ? (row.courses.keywords as string[])
          : null,
      },
    })) ?? [];

  const tutorIds = Array.from(
    new Set(
      courses
        .map((c) => c.course.tutorId)
        .filter((id): id is string => Boolean(id))
    )
  );

  let instructors: RouteInstructor[] = [];

  if (tutorIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, role, avatar_url")
      .in("id", tutorIds);

    logRouteDetailDebug("D:instructors-query", {
      count: profiles?.length ?? 0,
      error: profilesError ? profilesError.message : null,
    });

    if (profilesError) {
      throw profilesError;
    }

    instructors =
      profiles?.map((p) => ({
        id: p.id,
        fullName: (p.full_name as string | null) ?? null,
        role: (p.role as string | null) ?? null,
        avatarUrl: (p.avatar_url as string | null) ?? null,
      })) ?? [];
  }

  return {
    route: {
      id: route.id,
      name: route.name,
      slug: route.slug,
      description: route.description ?? null,
    },
    courses,
    instructors,
  };
}
