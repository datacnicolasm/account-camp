import { createClient } from "./server";

export interface RouteWithCount {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  courseCount: number;
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
