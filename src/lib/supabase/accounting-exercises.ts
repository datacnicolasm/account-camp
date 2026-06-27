import "server-only";

import type { createClient } from "./server";
import {
  accountingDocumentTypeSchema,
  parseAccountingDocumentMetadata,
  parseAccountingInstructions,
} from "./accounting-exercise.schema";
import type {
  AccountingExerciseDocument,
  LessonViewerAccountingExercise,
} from "./lesson-viewer.types";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

const isDev = process.env.NODE_ENV !== "production";

export async function fetchAccountingExerciseData(
  supabase: SupabaseServerClient,
  lessonId: string
): Promise<LessonViewerAccountingExercise | null> {
  const { data: exerciseRow, error: exerciseError } = await supabase
    .from("lesson_accounting_exercises")
    .select("lesson_id, title, context, instructions, allowed_accounts")
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (exerciseError) throw exerciseError;
  if (!exerciseRow) return null;

  const allowedAccountCodes = (exerciseRow.allowed_accounts ?? []).filter(
    (code: unknown): code is string =>
      typeof code === "string" && code.length > 0
  );

  const { data: documentRows, error: documentsError } = await supabase
    .from("lesson_accounting_documents")
    .select("id, lesson_id, document_type, document_metadata")
    .eq("lesson_id", lessonId)
    .order("id", { ascending: true });

  if (documentsError) throw documentsError;

  let accounts: LessonViewerAccountingExercise["accounts"] = [];
  if (allowedAccountCodes.length > 0) {
    const { data: accountRows, error: accountsError } = await supabase
      .from("accounting_accounts")
      .select("code, name")
      .in("code", allowedAccountCodes)
      .order("code", { ascending: true });

    if (accountsError) throw accountsError;

    accounts = (accountRows ?? []).map((row) => ({
      code: row.code,
      name: row.name ?? row.code,
    }));
  }

  const documents: AccountingExerciseDocument[] = [];
  for (const row of documentRows ?? []) {
    const typeResult = accountingDocumentTypeSchema.safeParse(row.document_type);
    const documentType = typeResult.success ? typeResult.data : "generic";
    const metadata = parseAccountingDocumentMetadata(
      documentType,
      row.document_metadata
    );

    if (!metadata) {
      if (isDev) {
        // eslint-disable-next-line no-console
        console.log(
          "[fetchAccountingExerciseData] invalid document_metadata for document:",
          row.id
        );
      }
      continue;
    }

    documents.push({
      id: row.id,
      documentType,
      metadata,
    });
  }

  return {
    title: exerciseRow.title ?? "",
    context: exerciseRow.context ?? "",
    instructions: parseAccountingInstructions(exerciseRow.instructions),
    allowedAccountCodes,
    accounts,
    documents,
  };
}
