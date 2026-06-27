import { z } from "zod";

export const accountingDocumentTypeSchema = z.enum([
  "invoice",
  "receipt",
  "expense_voucher",
  "generic",
]);

export type AccountingDocumentType = z.infer<typeof accountingDocumentTypeSchema>;

const partySchema = z.object({
  name: z.string().min(1),
  taxId: z.string().optional(),
  address: z.string().optional(),
});

const documentItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().optional(),
  unitPrice: z.number().optional(),
  amount: z.number(),
});

const financialsSchema = z.object({
  subtotal: z.number().optional(),
  tax: z.number().optional(),
  grand_total: z.number(),
});

const baseDocumentMetadataSchema = z.object({
  document_date: z.string().optional(),
  notes: z.string().optional(),
});

export const invoiceDocumentMetadataSchema = baseDocumentMetadataSchema.extend({
  invoice_number: z.string().min(1),
  issuer: partySchema,
  receiver: partySchema,
  items: z.array(documentItemSchema).min(1),
  financials: financialsSchema,
});

export const receiptDocumentMetadataSchema = baseDocumentMetadataSchema.extend({
  receipt_number: z.string().min(1),
  payer: partySchema,
  payee: partySchema,
  items: z.array(documentItemSchema).min(1),
  financials: financialsSchema,
});

export const expenseVoucherDocumentMetadataSchema =
  baseDocumentMetadataSchema.extend({
    voucher_number: z.string().min(1),
    beneficiary: partySchema,
    concept: z.string().min(1),
    items: z.array(documentItemSchema).optional(),
    financials: financialsSchema,
  });

export const genericDocumentMetadataSchema = baseDocumentMetadataSchema.extend({
  title: z.string().min(1),
  body: z.string().optional(),
  financials: financialsSchema.optional(),
});

export type InvoiceDocumentMetadata = z.infer<
  typeof invoiceDocumentMetadataSchema
>;
export type ReceiptDocumentMetadata = z.infer<
  typeof receiptDocumentMetadataSchema
>;
export type ExpenseVoucherDocumentMetadata = z.infer<
  typeof expenseVoucherDocumentMetadataSchema
>;
export type GenericDocumentMetadata = z.infer<
  typeof genericDocumentMetadataSchema
>;

export type AccountingDocumentMetadata =
  | InvoiceDocumentMetadata
  | ReceiptDocumentMetadata
  | ExpenseVoucherDocumentMetadata
  | GenericDocumentMetadata;

export const accountingLedgerRowPayloadSchema = z.object({
  accountCode: z.string().min(1),
  debit: z.number().min(0),
  credit: z.number().min(0),
});

export const validateAccountingEntryRequestSchema = z.object({
  rows: z.array(accountingLedgerRowPayloadSchema).min(1),
});

export type AccountingLedgerRowPayload = z.infer<
  typeof accountingLedgerRowPayloadSchema
>;
export type ValidateAccountingEntryRequest = z.infer<
  typeof validateAccountingEntryRequestSchema
>;

export const accountingExerciseInstructionsSchema = z.array(z.string().min(1));

export interface AccountingExerciseData {
  lesson_id: string;
  title: string;
  context: string;
  instructions: string[];
  allowed_accounts: string[];
}

export function parseAccountingInstructions(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

export interface ParsedAccountingDocument {
  documentType: AccountingDocumentType;
  metadata: AccountingDocumentMetadata;
}

export function parseAccountingDocumentMetadata(
  documentType: string,
  raw: unknown
): AccountingDocumentMetadata | null {
  const normalizedType = accountingDocumentTypeSchema.safeParse(documentType);
  const type = normalizedType.success ? normalizedType.data : "generic";

  switch (type) {
    case "invoice": {
      const result = invoiceDocumentMetadataSchema.safeParse(raw);
      return result.success ? result.data : null;
    }
    case "receipt": {
      const result = receiptDocumentMetadataSchema.safeParse(raw);
      return result.success ? result.data : null;
    }
    case "expense_voucher": {
      const result = expenseVoucherDocumentMetadataSchema.safeParse(raw);
      return result.success ? result.data : null;
    }
    default: {
      const result = genericDocumentMetadataSchema.safeParse(raw);
      return result.success ? result.data : null;
    }
  }
}

export function parseLedgerRows(raw: unknown): AccountingLedgerRowPayload[] | null {
  const result = validateAccountingEntryRequestSchema.safeParse(raw);
  return result.success ? result.data.rows : null;
}

/** Round to 2 decimal places for balance comparison */
export function roundAccountingAmount(value: number): number {
  return Math.round(value * 100) / 100;
}

export function sumLedgerSide(
  rows: AccountingLedgerRowPayload[],
  side: "debit" | "credit"
): number {
  const total = rows.reduce((sum, row) => sum + row[side], 0);
  return roundAccountingAmount(total);
}

export function isLedgerBalanced(rows: AccountingLedgerRowPayload[]): boolean {
  return sumLedgerSide(rows, "debit") === sumLedgerSide(rows, "credit");
}
