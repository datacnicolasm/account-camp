import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { fetchLessonViewerData } from "@/lib/supabase/lessons";
import { createLessonSignedUrl } from "@/lib/supabase/lesson-signed-url";
import { upsertLessonProgressInProgress } from "@/lib/supabase/progress-server";
import { LessonViewerClient } from "@/components/lesson/LessonViewerClient";

const isDev = process.env.NODE_ENV !== "production";

interface LessonPageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.log("[LessonPage] no session, lessonId:", lessonId);
    }
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-foreground">
            Debes iniciar sesión para ver esta lección
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Inicia sesión para acceder al contenido.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  if (isDev) {
    // eslint-disable-next-line no-console
    console.log("[LessonPage] session.user.id:", user.id, "lessonId:", lessonId);
  }

  let data = null;
  let error: string | null = null;

  try {
    data = await fetchLessonViewerData(lessonId);
  } catch {
    error = "No pudimos cargar la lección.";
  }

  if (isDev && data) {
    // eslint-disable-next-line no-console
    console.log("[LessonPage] data:", {
      lesson: data.lesson,
      typeKey: data.typeKey,
      video: data.video,
    });
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-foreground">
            No pudimos cargar la lección
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Intenta de nuevo más tarde.
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-foreground">
            Lección no encontrada
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Puede que esta lección no exista o ya no esté disponible.
          </p>
        </div>
      </div>
    );
  }

  if (data.typeKey === "video" && !data.video) {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.log("[LessonPage] video type but no lesson_videos row");
    }
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-foreground">
            Contenido no disponible
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            El video de esta lección no está disponible en este momento.
          </p>
        </div>
      </div>
    );
  }

  let videoUrl = "";
  let posterUrl: string | null = null;
  let videoError: { status: 403 | 404; message: string } | null = null;

  if (data.video) {
    const result = await createLessonSignedUrl(
      data.video.bucket,
      data.video.videoPath
    );

    if (isDev) {
      // eslint-disable-next-line no-console
      console.log(
        "[LessonPage] lesson_videos storage_path:",
        data.video.videoPath,
        "createSignedUrl ok:",
        result.ok
      );
    }

    if (result.ok && result.signedUrl) {
      videoUrl = result.signedUrl;
      if (data.video.posterPath) {
        const posterResult = await createLessonSignedUrl(
          data.video.bucket,
          data.video.posterPath
        );
        posterUrl =
          posterResult.ok && posterResult.signedUrl
            ? posterResult.signedUrl
            : null;
      }

      await upsertLessonProgressInProgress(
        user.id,
        lessonId,
        data.video.durationSeconds ?? undefined
      );
    } else {
      videoError = {
        status: 403,
        message: "No pudimos generar el enlace del video.",
      };
      if (isDev) {
        // eslint-disable-next-line no-console
        console.log("[LessonPage] createSignedUrl failed:", result.error);
      }
    }
  }

  if (data.video && videoError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-foreground">
            Video no disponible
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{videoError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <LessonViewerClient
      lesson={data.lesson}
      typeKey={data.typeKey}
      video={data.video}
      context={data.context}
      videoUrl={videoUrl}
      posterUrl={posterUrl}
      durationSeconds={data.video?.durationSeconds ?? null}
    />
  );
}
