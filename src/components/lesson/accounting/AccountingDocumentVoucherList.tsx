import type { AccountingExerciseDocument } from "@/lib/supabase/lesson-viewer.types";
import type {
  ExpenseVoucherDocumentMetadata,
  GenericDocumentMetadata,
  InvoiceDocumentMetadata,
  ReceiptDocumentMetadata,
} from "@/lib/supabase/accounting-exercise.schema";
import { formatAccountingCurrency } from "@/lib/accounting/format-currency";

import {
  ExpenseVoucherView,
  InvoiceVoucherView,
  ReceiptVoucherView,
} from "./AccountingDocumentVoucher";

interface AccountingDocumentVoucherListProps {
  documents: AccountingExerciseDocument[];
}

function GenericVoucherView({ metadata }: { metadata: GenericDocumentMetadata }) {
  return (
    <article className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-stone-950">
      <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
        {metadata.title}
      </h3>
      {metadata.body ? (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-stone-700 dark:text-stone-300">
          {metadata.body}
        </p>
      ) : null}
      {metadata.financials?.grand_total != null ? (
        <p className="mt-4 text-sm font-semibold text-foreground">
          Total: {formatAccountingCurrency(metadata.financials.grand_total)}
        </p>
      ) : null}
    </article>
  );
}

export function AccountingDocumentVoucherList({
  documents,
}: AccountingDocumentVoucherListProps) {
  if (documents.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay comprobantes disponibles para este ejercicio.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((document) => {
        switch (document.documentType) {
          case "invoice":
            return (
              <InvoiceVoucherView
                key={document.id}
                metadata={document.metadata as InvoiceDocumentMetadata}
              />
            );
          case "receipt":
            return (
              <ReceiptVoucherView
                key={document.id}
                metadata={document.metadata as ReceiptDocumentMetadata}
              />
            );
          case "expense_voucher":
            return (
              <ExpenseVoucherView
                key={document.id}
                metadata={document.metadata as ExpenseVoucherDocumentMetadata}
              />
            );
          default:
            return (
              <GenericVoucherView
                key={document.id}
                metadata={document.metadata as GenericDocumentMetadata}
              />
            );
        }
      })}
    </div>
  );
}
