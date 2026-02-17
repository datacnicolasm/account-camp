import type { SupabaseClient } from "@supabase/supabase-js";

const SIGNED_URL_EXPIRY_SECONDS = 3600;

/**
 * Returns a URL for lesson media (video/poster).
 * Uses getPublicUrl by default; use createSignedUrl for private buckets.
 *
 * For premium/private content, set NEXT_PUBLIC_LESSON_VIDEOS_PRIVATE=true
 * or pass useSignedUrl: true.
 */
export async function getLessonMediaUrl(
  supabase: SupabaseClient,
  bucket: string,
  path: string,
  options?: { useSignedUrl?: boolean }
): Promise<string> {
  const useSigned =
    options?.useSignedUrl ??
    (process.env.NEXT_PUBLIC_LESSON_VIDEOS_PRIVATE === "true");

  if (useSigned) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, SIGNED_URL_EXPIRY_SECONDS);

    if (!error && data?.signedUrl) {
      return data.signedUrl;
    }
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
