/**
 * Server-only: creates signed URL for lesson video (private bucket).
 * Uses server client with user session (JWT). No service role required.
 */

import { createClient } from "./server";

const SIGNED_URL_EXPIRY_SECONDS = 60 * 30; // 30 min

export type SignedUrlError =
  | "AUTH_REQUIRED"
  | "SIGNED_URL_FAILED"
  | "EXCEPTION";

export type CreateLessonSignedUrlResult =
  | { ok: true; error: null; signedUrl: string }
  | { ok: false; error: SignedUrlError; signedUrl: null };

export async function createLessonSignedUrl(
  bucket: string,
  path: string
): Promise<CreateLessonSignedUrlResult> {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return { ok: false, error: "AUTH_REQUIRED", signedUrl: null };
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, SIGNED_URL_EXPIRY_SECONDS);

    if (error) {
      // eslint-disable-next-line no-console
      console.error("[createLessonSignedUrl] storage error", {
        message: error.message,
        name: (error as { name?: string }).name,
      });
      return { ok: false, error: "SIGNED_URL_FAILED", signedUrl: null };
    }

    return { ok: true, error: null, signedUrl: data.signedUrl ?? "" };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[createLessonSignedUrl] exception", e);
    return { ok: false, error: "EXCEPTION", signedUrl: null };
  }
}
