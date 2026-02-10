export function getInitials(fullName?: string | null): string {
  if (!fullName) return "AC";
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.[0];
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  const initials = `${first ?? ""}${last ?? ""}`.toUpperCase();
  return initials || "AC";
}

export function getSafeDisplayName(fullName?: string | null): string {
  if (!fullName || !fullName.trim()) {
    return "Instructor";
  }
  return fullName.trim();
}

