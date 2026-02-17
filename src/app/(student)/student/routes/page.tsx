import { FadeIn } from "@/components/motion/FadeIn";
import { RoutesHero } from "@/components/student/RoutesHero";
import { fetchPublishedRoutes } from "@/lib/supabase/routes";
import { RoutesList } from "./RoutesList";

const EXCERPT_LENGTH = 120;

function truncateDescription(text: string | null): string {
  if (!text?.trim()) return "";
  const trimmed = text.trim();
  if (trimmed.length <= EXCERPT_LENGTH) return trimmed;
  return trimmed.slice(0, EXCERPT_LENGTH).trim() + "…";
}

export default async function RoutesPage() {
  let routes: Awaited<ReturnType<typeof fetchPublishedRoutes>> = [];
  let error: string | null = null;

  try {
    routes = await fetchPublishedRoutes();
  } catch {
    error = "No pudimos cargar las rutas. Intenta de nuevo.";
  }

  return (
    <FadeIn duration={0.35} y={10} className="p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <RoutesHero />

        <RoutesList
          routes={routes.map((r) => ({
            id: r.id,
            name: r.name,
            slug: r.slug,
            description: r.description,
            courseCount: r.courseCount,
            excerpt: truncateDescription(r.description),
          }))}
          error={error}
        />
      </div>
    </FadeIn>
  );
}
