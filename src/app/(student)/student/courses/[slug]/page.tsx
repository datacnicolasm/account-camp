import { fetchCourseDetailBySlug } from "@/lib/supabase/courses";
import { CourseDetailHero } from "@/components/student/CourseDetailHero";
import { CourseSidebar } from "@/components/student/CourseSidebar";
import { CourseChaptersSection } from "@/components/student/CourseChaptersSection";
import { CourseDescription } from "@/components/student/CourseDescription";
import { RouteErrorState } from "@/components/student/RouteErrorState";

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;

  let result = null;
  let error: string | null = null;

  try {
    result = await fetchCourseDetailBySlug(slug);
  } catch {
    error = "No pudimos cargar este curso. Intenta de nuevo.";
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
              Curso no encontrado
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Puede que este curso no exista o ya no esté disponible.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const {
    course,
    instructor,
    chapters,
    totalEstimatedMinutesFromLessons,
    totalXpFromLessons,
    totalsByType,
    typeLabels,
  } = result;

  const totalMinutes =
    totalEstimatedMinutesFromLessons > 0
      ? totalEstimatedMinutesFromLessons
      : course.estimatedMinutes ?? 0;

  const firstLessonId = chapters[0]?.lessons[0]?.id ?? null;

  return (
    <div className="p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <CourseDetailHero
          courseName={course.name}
          courseSlug={course.slug}
          totalXp={totalXpFromLessons}
          totalMinutes={totalMinutes}
          totalsByType={totalsByType}
          typeLabels={typeLabels}
          firstLessonId={firstLessonId}
        />

        <div className="space-y-8 lg:grid lg:grid-cols-4 lg:gap-8 lg:space-y-0">
          <div className="lg:col-span-1">
            <CourseSidebar instructor={instructor} />
          </div>
          <div className="lg:col-span-3 space-y-8">
            <CourseDescription
              content={
                course.longDescription ??
                course.shortDescription ??
                "Este curso aún no tiene una descripción detallada."
              }
            />

            <CourseChaptersSection chapters={chapters} />
          </div>
        </div>
      </div>
    </div>
  );
}
