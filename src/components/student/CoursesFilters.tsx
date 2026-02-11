"use client";

import { ChangeEvent } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export type DifficultyFilter = "all" | "beginner" | "intermediate" | "advanced";

interface CoursesFiltersProps {
  search: string;
  difficulty: DifficultyFilter;
  onSearchChange: (value: string) => void;
  onDifficultyChange: (value: DifficultyFilter) => void;
}

export function CoursesFilters({
  search,
  difficulty,
  onSearchChange,
  onDifficultyChange,
}: CoursesFiltersProps) {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleDifficultyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onDifficultyChange(event.target.value as DifficultyFilter);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="relative w-full max-w-sm">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={search}
          onChange={handleSearchChange}
          placeholder="Buscar cursos…"
          className="pl-9 rounded-full bg-muted/40"
          aria-label="Buscar cursos"
        />
      </div>

      <select
        value={difficulty}
        onChange={handleDifficultyChange}
        className="h-9 rounded-full border border-border bg-card px-3 text-xs font-medium text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Filtrar por dificultad"
      >
        <option value="all">Todas las dificultades</option>
        <option value="beginner">Principiante</option>
        <option value="intermediate">Intermedio</option>
        <option value="advanced">Avanzado</option>
      </select>
    </div>
  );
}

