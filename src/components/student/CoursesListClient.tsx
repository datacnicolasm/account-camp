"use client";

import { useDeferredValue, useMemo, useState } from "react";

import type { CourseWithInstructor } from "@/lib/supabase/courses";
import { CoursesFilters, type DifficultyFilter } from "./CoursesFilters";
import { CoursesGrid } from "./CoursesGrid";

interface CoursesListClientProps {
  items: CourseWithInstructor[];
}

export function CoursesListClient({ items }: CoursesListClientProps) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const deferredSearch = useDeferredValue(search);

  const filteredItems = useMemo(() => {
    const term = deferredSearch.trim().toLowerCase();

    return items.filter(({ course }) => {
      if (
        difficulty !== "all" &&
        course.difficulty !== difficulty
      ) {
        return false;
      }

      if (!term) return true;

      const haystack = `${course.name} ${course.shortDescription ?? ""}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [items, deferredSearch, difficulty]);

  return (
    <div className="space-y-6">
      <CoursesFilters
        search={search}
        difficulty={difficulty}
        onSearchChange={setSearch}
        onDifficultyChange={setDifficulty}
      />
      <CoursesGrid items={filteredItems} />
    </div>
  );
}

