"use client";

import { FadeIn } from "@/components/motion/FadeIn";

function PlaceholderCard({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-card shadow-sm p-4 ${className ?? ""}`}
    >
      <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
      <div className="space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-[80%] animate-pulse rounded bg-muted" />
        <div className="h-3 w-[60%] animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export default function StudentPage() {
  return (
    <FadeIn duration={0.35} y={10} className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Bienvenido
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Continúa donde lo dejaste
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <PlaceholderCard title="Cursos en progreso" />
          <PlaceholderCard title="Continuar donde lo dejaste" />
          <PlaceholderCard title="Racha diaria" />
          <PlaceholderCard title="Recomendado para ti" />
        </div>
      </div>
    </FadeIn>
  );
}
