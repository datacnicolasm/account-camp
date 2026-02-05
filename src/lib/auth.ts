/**
 * Auth utilities. Stubs until Supabase Auth is wired.
 */

export type UserRole = "admin" | "teacher" | "student";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

/**
 * Returns the current user. Stub: always returns null until auth is implemented.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  // TODO: Integrate with Supabase Auth
  return null;
}

/**
 * Checks if the current user has the required role. Stub: no enforcement yet.
 */
export async function requireRole(
  role: UserRole
): Promise<{ allowed: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { allowed: false };
  if (user.role === role) return { allowed: true };
  // Admin can access teacher/student areas if needed; extend logic later
  if (user.role === "admin") return { allowed: true };
  return { allowed: false };
}
