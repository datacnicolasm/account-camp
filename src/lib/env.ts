/**
 * Environment variable validation. Stub structure for future validation.
 */

const REQUIRED_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

/**
 * Validates that required env vars exist. Stub: structure only, no runtime validation yet.
 */
export function validateEnv(): { valid: boolean; missing: string[] } {
  const missing = REQUIRED_KEYS.filter((key) => !process.env[key]);
  return {
    valid: missing.length === 0,
    missing: [...missing],
  };
}
