import { formatAccountingCurrency } from "@/lib/accounting/format-currency";

interface AccountingLedgerTotalsRowProps {
  totalDebit: number;
  totalCredit: number;
}

export function AccountingLedgerTotalsRow({
  totalDebit,
  totalCredit,
}: AccountingLedgerTotalsRowProps) {
  return (
    <tr className="border-t-2 border-stone-300 bg-stone-50 font-semibold dark:border-stone-600 dark:bg-stone-900/40">
      <td className="px-3 py-3 text-sm text-foreground">Totales</td>
      <td className="px-3 py-3 text-right text-sm text-foreground">
        {formatAccountingCurrency(totalDebit)}
      </td>
      <td className="px-3 py-3 text-right text-sm text-foreground">
        {formatAccountingCurrency(totalCredit)}
      </td>
      <td className="px-3 py-3" />
    </tr>
  );
}
