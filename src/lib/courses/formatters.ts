import type { CourseDifficulty } from "@/lib/supabase/courses";

type DifficultyInput = CourseDifficulty | undefined;

export function formatDifficulty(difficulty: DifficultyInput): string {
  if (difficulty === "beginner") return "Principiante";
  if (difficulty === "intermediate") return "Intermedio";
  if (difficulty === "advanced") return "Avanzado";
  return "Sin nivel";
}

export function formatDuration(estimatedMinutes: number | null): string {
  if (!estimatedMinutes || estimatedMinutes <= 0) {
    return "Duración variable";
  }
  if (estimatedMinutes < 60) {
    return `${estimatedMinutes} min`;
  }
  const hours = estimatedMinutes / 60;
  const rounded = Number.isInteger(hours) ? hours.toString() : hours.toFixed(1);
  return `${rounded} h`;
}

