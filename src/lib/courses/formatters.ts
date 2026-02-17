import type { CourseDifficulty } from "@/lib/supabase/courses";

type DifficultyInput = CourseDifficulty | undefined;

/** Spanish label for difficulty (Principiante / Intermedio / Avanzado). */
export function difficultyToLabel(difficulty: DifficultyInput): string {
  if (difficulty === "beginner") return "Principiante";
  if (difficulty === "intermediate") return "Intermedio";
  if (difficulty === "advanced") return "Avanzado";
  return "Sin nivel";
}

/** Duration string: "1.5 h" / "45 min" / "Duración variable". */
export function formatMinutesToDurationLabel(minutes: number | null): string {
  if (minutes == null || minutes <= 0) {
    return "Duración variable";
  }
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = minutes / 60;
  const rounded = Number.isInteger(hours) ? hours.toString() : hours.toFixed(1);
  return `${rounded} h`;
}

/** @deprecated Use difficultyToLabel. */
export function formatDifficulty(difficulty: DifficultyInput): string {
  return difficultyToLabel(difficulty);
}

/** @deprecated Use formatMinutesToDurationLabel. */
export function formatDuration(estimatedMinutes: number | null): string {
  return formatMinutesToDurationLabel(estimatedMinutes);
}

