import type {
  ExpenseVoucherDocumentMetadata,
  InvoiceDocumentMetadata,
  ReceiptDocumentMetadata,
} from "@/lib/supabase/accounting-exercise.schema";
import { formatAccountingCurrency } from "@/lib/accounting/format-currency";

interface VoucherShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

function VoucherShell({ title, subtitle, children }: VoucherShellProps) {
  return (
    <article className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-stone-950">
      <header className="border-b border-stone-200 pb-4 dark:border-stone-700">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Comprobante
        </p>
        <h3 className="mt-1 text-lg font-semibold text-stone-900 dark:text-stone-100">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </header>
      <div className="mt-4 space-y-4">{children}</div>
    </article>
  );
}

function PartyBlock({
  label,
  name,
  taxId,
  address,
}: {
  label: string;
  name: string;
  taxId?: string;
  address?: string;
}) {
  return (
    <div className="rounded-lg border border-stone-100 bg-stone-50/80 p-3 dark:border-stone-800 dark:bg-stone-900/40">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">{name}</p>
      {taxId ? (
        <p className="text-xs text-muted-foreground">NIT/CC: {taxId}</p>
      ) : null}
      {address ? (
        <p className="text-xs text-muted-foreground">{address}</p>
      ) : null}
    </div>
  );
}

function ItemsTable({
  items,
}: {
  items: { description: string; quantity?: number; unitPrice?: number; amount: number }[];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 dark:border-stone-700">
      <table className="w-full text-left text-sm">
        <thead className="bg-stone-50 text-xs uppercase text-muted-foreground dark:bg-stone-900/60">
          <tr>
            <th className="px-3 py-2 font-medium">Descripción</th>
            <th className="px-3 py-2 font-medium text-right">Valor</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={`${item.description}-${index}`}
              className="border-t border-stone-100 dark:border-stone-800"
            >
              <td className="px-3 py-2 text-foreground">
                {item.description}
                {item.quantity != null && item.unitPrice != null ? (
                  <span className="block text-xs text-muted-foreground">
                    {item.quantity} × {formatAccountingCurrency(item.unitPrice)}
                  </span>
                ) : null}
              </td>
              <td className="px-3 py-2 text-right font-medium text-foreground">
                {formatAccountingCurrency(item.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TotalBlock({ total }: { total: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 dark:border-stone-700 dark:bg-stone-900/40">
      <span className="text-sm font-semibold text-foreground">Total</span>
      <span className="text-base font-bold text-stone-900 dark:text-stone-100">
        {formatAccountingCurrency(total)}
      </span>
    </div>
  );
}

interface InvoiceVoucherViewProps {
  metadata: InvoiceDocumentMetadata;
}

export function InvoiceVoucherView({ metadata }: InvoiceVoucherViewProps) {
  return (
    <VoucherShell
      title="Factura de venta"
      subtitle={
        metadata.document_date
          ? `No. ${metadata.invoice_number} · ${metadata.document_date}`
          : `No. ${metadata.invoice_number}`
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <PartyBlock label="Emisor" {...metadata.issuer} />
        <PartyBlock label="Receptor" {...metadata.receiver} />
      </div>
      <ItemsTable items={metadata.items} />
      <TotalBlock total={metadata.financials.grand_total} />
    </VoucherShell>
  );
}

interface ReceiptVoucherViewProps {
  metadata: ReceiptDocumentMetadata;
}

export function ReceiptVoucherView({ metadata }: ReceiptVoucherViewProps) {
  return (
    <VoucherShell
      title="Recibo de caja"
      subtitle={
        metadata.document_date
          ? `No. ${metadata.receipt_number} · ${metadata.document_date}`
          : `No. ${metadata.receipt_number}`
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <PartyBlock label="Pagador" {...metadata.payer} />
        <PartyBlock label="Beneficiario" {...metadata.payee} />
      </div>
      <ItemsTable items={metadata.items} />
      <TotalBlock total={metadata.financials.grand_total} />
    </VoucherShell>
  );
}

interface ExpenseVoucherViewProps {
  metadata: ExpenseVoucherDocumentMetadata;
}

export function ExpenseVoucherView({ metadata }: ExpenseVoucherViewProps) {
  return (
    <VoucherShell
      title="Comprobante de egreso"
      subtitle={
        metadata.document_date
          ? `No. ${metadata.voucher_number} · ${metadata.document_date}`
          : `No. ${metadata.voucher_number}`
      }
    >
      <PartyBlock label="Beneficiario" {...metadata.beneficiary} />
      <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">
        <span className="font-semibold text-foreground">Concepto: </span>
        {metadata.concept}
      </p>
      {metadata.items?.length ? <ItemsTable items={metadata.items} /> : null}
      <TotalBlock total={metadata.financials.grand_total} />
    </VoucherShell>
  );
}
