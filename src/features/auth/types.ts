/**
 * Auth feature types. Stubs for User, Session until Supabase Auth is wired.
 */

export interface User {
  id: string;
  email: string;
  role: "admin" | "teacher" | "student";
}

export interface Session {
  user: User;
  expiresAt: Date;
}
