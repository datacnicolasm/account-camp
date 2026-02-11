"use client";

import { useState } from "react";
import { BadgeCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { RouteInstructor } from "@/lib/supabase/routes";
import { getInitials, getSafeDisplayName } from "@/lib/ui/avatars";

interface RouteSidebarProps {
  instructors: RouteInstructor[];
}

export function RouteSidebar({ instructors }: RouteSidebarProps) {
  const [showAll, setShowAll] = useState(false);

  const visibleInstructors = showAll ? instructors : instructors.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-cyan-400/40 bg-gradient-to-br from-[#0b1f3a] via-[#0f2946] to-[#1b3b5f] p-5 shadow-lg shadow-cyan-500/20 space-y-4">
        {/* Watermark icon */}
        <BadgeCheck
          className="pointer-events-none absolute -right-2 -top-2 h-16 w-16 text-cyan-300/10"
          aria-hidden="true"
        />

        <div className="relative flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/20 ring-1 ring-cyan-400/40">
            <BadgeCheck
              className="h-5 w-5 text-cyan-200"
              aria-hidden="true"
            />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              Certificación incluida
            </h2>
            <p className="mt-0.5 text-xs text-cyan-100/80">
              por AccountCamp
            </p>
          </div>
        </div>

        <span className="relative inline-flex items-center rounded-full border border-amber-300/60 bg-amber-400/10 px-2.5 py-1 text-[11px] font-medium text-amber-100">
          Solo para Premium
        </span>

        <p className="relative text-sm text-cyan-50/90">
          Obtén un certificado verificable al completar esta ruta. Úsalo para
          demostrar tu avance y destacar tu perfil.
        </p>

        <Button
          variant="outline"
          size="sm"
          className="relative mt-1 rounded-full border-amber-300/70 bg-amber-400/15 px-4 text-xs font-semibold text-amber-50 hover:bg-amber-400/25"
        >
          Quiero mi certificado
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Instructores</h2>

        {instructors.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Pronto verás a los instructores de esta ruta.
          </p>
        ) : (
          <>
            <ul className="space-y-3">
              {visibleInstructors.map((instructor) => (
                <li key={instructor.id} className="flex items-center gap-3">
                  {instructor.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={instructor.avatarUrl}
                      alt={getSafeDisplayName(instructor.fullName)}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary-foreground">
                      {getInitials(instructor.fullName)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {getSafeDisplayName(instructor.fullName)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {instructor.role ?? "Instructor"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {instructors.length > 3 && (
              <button
                type="button"
                onClick={() => setShowAll((prev) => !prev)}
                className="text-xs font-medium text-primary hover:underline"
              >
                {showAll ? "Ver menos" : "Ver todos"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

