"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, Map, Award } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/motion/FadeIn";

interface RouteItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  courseCount: number;
  excerpt: string;
}

interface RoutesListProps {
  routes: RouteItem[];
  error: string | null;
}

export function RoutesList({ routes, error }: RoutesListProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  if (error) {
    return (
      <FadeIn duration={0.35} y={10}>
        <div
          className="rounded-2xl border border-destructive/50 bg-destructive/10 p-8 text-center"
          role="alert"
        >
          <p className="text-sm text-destructive">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => router.refresh()}
          >
            Reintentar
          </Button>
        </div>
      </FadeIn>
    );
  }

  if (routes.length === 0) {
    return (
      <FadeIn duration={0.35} y={10}>
        <div className="rounded-2xl border border-border bg-card p-16 text-center">
          <p className="text-base text-muted-foreground">
            No hay rutas publicadas todavía.
          </p>
          <p className="mt-2 text-sm text-muted-foreground/80">
            Vuelve pronto para explorar rutas profesionales.
          </p>
        </div>
      </FadeIn>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <span
          className={cn(
            "inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground",
            "transition-colors hover:border-primary/30 hover:bg-primary/5"
          )}
        >
          Todas
        </span>
      </div>

      <motion.div
        className="grid gap-6 sm:grid-cols-1 md:grid-cols-2"
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {routes.map((route, index) => (
          <motion.div
            key={route.id}
            initial={
              shouldReduceMotion ? undefined : { opacity: 0, y: 10 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: shouldReduceMotion ? 0 : index * 0.05,
              ease: "easeOut",
            }}
            className="group"
          >
            <div
              className={cn(
                "relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm",
                "transition-colors hover:border-primary/20 hover:shadow-md"
              )}
            >
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 transition-opacity group-hover:bg-primary/10" />
              <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/10">
                <Map className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>

              <div className="relative space-y-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Ruta profesional
                </p>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground"
                    )}
                  >
                    {route.courseCount} curso{route.courseCount !== 1 ? "s" : ""}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent-foreground"
                    )}
                  >
                    <Award className="h-3 w-3" aria-hidden="true" />
                    Certificado incluido
                  </span>
                </div>
              </div>

              <h2 className="relative mt-4 text-xl font-bold tracking-tight text-foreground">
                {route.name}
              </h2>

              {route.excerpt && (
                <p className="relative mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {route.excerpt}
                </p>
              )}

              <div className="relative mt-6 flex flex-1 items-end justify-end">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={cn(
                    "rounded-full border-primary/30 px-5 font-medium",
                    "hover:bg-primary/10 hover:border-primary/50 hover:text-primary"
                  )}
                >
                  <Link
                    href={`/student/routes/${route.slug}`}
                    className="inline-flex items-center gap-2"
                  >
                    Ver ruta
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
