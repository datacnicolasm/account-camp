import { createClient } from "@supabase/supabase-js";

/**
 * Admin client using service role key. Use ONLY on server (API routes, server actions).
 * Never expose SUPABASE_SERVICE_ROLE_KEY to the client.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for admin operations (signed URLs, etc.)"
    );
  }
  return createClient(url, serviceRoleKey);
}
