/**
 * Server-only helper for lesson video URLs.
 * Validates public URL with HEAD request and falls back to signed URL on 403.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "./admin";

const isDev = process.env.NODE_ENV !== "production";

export type VideoUrlResult =
  | { ok: true; url: string }
  | { ok: false; status: 403 | 404; message: string };

export async function resolveLessonVideoUrl(
  supabase: SupabaseClient,
  bucket: string,
  storagePath: string
): Promise<VideoUrlResult> {
  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  const publicUrl = data.publicUrl;

  if (isDev) {
    // eslint-disable-next-line no-console
    console.log("[resolveLessonVideoUrl] bucket:", bucket, "storage_path:", storagePath, "publicUrl:", publicUrl);
  }

  let headStatus: number;
  try {
    const res = await fetch(publicUrl, { method: "HEAD" });
    headStatus = res.status;
    if (isDev) {
      // eslint-disable-next-line no-console
      console.log("[resolveLessonVideoUrl] HEAD fetch status:", headStatus);
    }
  } catch (err) {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.warn("[resolveLessonVideoUrl] HEAD fetch error:", err);
    }
    headStatus = 0;
  }

  if (headStatus === 200) {
    return { ok: true, url: publicUrl };
  }

  if (headStatus === 403 || headStatus === 401) {
    try {
      const admin = createAdminClient();
      const { data: signedData, error } = await admin.storage
        .from(bucket)
        .createSignedUrl(storagePath, 60 * 10);

      if (!error && signedData?.signedUrl) {
        return { ok: true, url: signedData.signedUrl };
      }
      if (isDev) {
        // eslint-disable-next-line no-console
        console.warn("[resolveLessonVideoUrl] createSignedUrl error:", error?.message);
      }
      return {
        ok: false,
        status: 403,
        message: "Sin permisos para acceder al video (storage private/RLS)",
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (isDev) {
        // eslint-disable-next-line no-console
        console.warn("[resolveLessonVideoUrl] signed URL fallback error:", msg);
      }
      return {
        ok: false,
        status: 403,
        message: "Sin permisos para acceder al video (storage private/RLS)",
      };
    }
  }

  if (headStatus === 404 || headStatus === 0) {
    return {
      ok: false,
      status: 404,
      message: "Archivo no encontrado (path mismatch)",
    };
  }

  return {
    ok: false,
    status: 404,
    message: "Archivo no encontrado (path mismatch)",
  };
}
