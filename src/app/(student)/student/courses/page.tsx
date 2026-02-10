import { CoursesHero } from "@/components/student/CoursesHero";
import { CoursesListClient } from "@/components/student/CoursesListClient";
import { RetryErrorCard } from "@/components/student/RetryErrorCard";
import {
  fetchPublishedCoursesWithInstructors,
  type CourseWithInstructor,
} from "@/lib/supabase/courses";

export default async function CoursesPage() {
  let items: CourseWithInstructor[] = [];
  let error: string | null = null;

  try {
    items = await fetchPublishedCoursesWithInstructors();
  } catch {
    error = "No pudimos cargar los cursos. Intenta de nuevo.";
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <CoursesHero />

        {error ? (
          <RetryErrorCard message={error} />
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
            <h2 className="text-base font-semibold text-foreground">
              Aún no hay cursos publicados
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Cuando haya cursos disponibles, podrás explorarlos y comenzar a
              aprender de inmediato.
            </p>
          </div>
        ) : (
          <CoursesListClient items={items} />
        )}
      </div>
    </div>
  );
}


