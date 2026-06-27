import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import {
  isLedgerBalanced,
  validateAccountingEntryRequestSchema,
} from "@/lib/supabase/accounting-exercise.schema";

const isDev = process.env.NODE_ENV !== "production";

type ValidateSuccessResponse = {
  ok: true;
  stage: 2;
  solutionCheck: "stub_passed";
};

type ValidateFailureResponse = {
  ok: false;
  stage: 1;
  errorCode: "UNBALANCED" | "INVALID_PAYLOAD" | "INVALID_LESSON_TYPE";
};

export async function POST(
  request: Request,
  context: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await context.params;

  if (!lessonId) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        stage: 1,
        errorCode: "INVALID_PAYLOAD",
      } satisfies ValidateFailureResponse,
      { status: 400 }
    );
  }

  const parsed = validateAccountingEntryRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        stage: 1,
        errorCode: "INVALID_PAYLOAD",
      } satisfies ValidateFailureResponse,
      { status: 400 }
    );
  }

  const { data: lessonRow } = await supabase
    .from("lessons")
    .select("id, type_slug")
    .eq("id", lessonId)
    .maybeSingle();

  if (!lessonRow) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  if (lessonRow.type_slug !== "accounting_entries") {
    return NextResponse.json(
      {
        ok: false,
        stage: 1,
        errorCode: "INVALID_LESSON_TYPE",
      } satisfies ValidateFailureResponse,
      { status: 400 }
    );
  }

  const rows = parsed.data.rows;

  if (!isLedgerBalanced(rows)) {
    return NextResponse.json(
      {
        ok: false,
        stage: 1,
        errorCode: "UNBALANCED",
      } satisfies ValidateFailureResponse,
      { status: 422 }
    );
  }

  const solutionPayload = {
    lessonId,
    userId: user.id,
    rows,
  };

  if (isDev) {
    // eslint-disable-next-line no-console
    console.log("[validate-accounting-entry] stage 2 stub payload:", solutionPayload);
  }

  return NextResponse.json({
    ok: true,
    stage: 2,
    solutionCheck: "stub_passed",
  } satisfies ValidateSuccessResponse);
}
