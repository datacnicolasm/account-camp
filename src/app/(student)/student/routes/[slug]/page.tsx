import {
  fetchRouteDetailBySlug,
  type RouteDetailResult,
} from "@/lib/supabase/routes";
import { RouteDetailHero } from "@/components/student/RouteDetailHero";
import { RouteSidebar } from "@/components/student/RouteSidebar";
import { RouteCoursesSection } from "@/components/student/RouteCoursesSection";
import { RouteErrorState } from "@/components/student/RouteErrorState";

interface RoutePageProps {
  params: Promise<{ slug: string }>;
}

export default async function RoutePage({ params }: RoutePageProps) {
  const { slug } = await params;

  let result: RouteDetailResult | null = null;
  let error: string | null = null;

  try {
    result = await fetchRouteDetailBySlug(slug);
  } catch {
    error = "No pudimos cargar esta ruta. Intenta de nuevo.";
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mx-auto max-w-5xl">
          <RouteErrorState message={error} />
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
            <h1 className="text-xl font-semibold text-foreground">
              Ruta no encontrada
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Puede que esta ruta no exista o ya no esté disponible.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { route, courses, instructors } = result as RouteDetailResult;

  const totalEstimatedMinutes = courses.reduce((sum, item) => {
    return sum + (item.course.estimatedMinutes ?? 0);
  }, 0);

  const firstCourseSlug = courses[0]?.course.slug ?? null;

  return (
    <div className="p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <RouteDetailHero
          routeName={route.name}
          courseCount={courses.length}
          totalEstimatedMinutes={totalEstimatedMinutes}
          firstCourseSlug={firstCourseSlug}
        />

        <div className="space-y-8 lg:grid lg:grid-cols-4 lg:gap-8 lg:space-y-0">
          <div className="lg:col-span-1">
            <RouteSidebar instructors={instructors} />
          </div>
          <div className="lg:col-span-3">
            <RouteCoursesSection
              routeDescription={route.description}
              courses={courses}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

