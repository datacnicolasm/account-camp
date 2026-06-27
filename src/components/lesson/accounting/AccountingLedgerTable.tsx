"use client";

import { useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseLedgerAmount } from "@/lib/accounting/format-currency";
import type { AccountingAccountOption } from "@/lib/supabase/lesson-viewer.types";

import { AccountCodeCombobox } from "./AccountCodeCombobox";
import { AccountingLedgerTotalsRow } from "./AccountingLedgerTotalsRow";

export interface LedgerRowState {
  id: string;
  accountCode: string | null;
  debit: string;
  credit: string;
}

interface AccountingLedgerTableProps {
  rows: LedgerRowState[];
  accounts: AccountingAccountOption[];
  onRowsChange: (rows: LedgerRowState[]) => void;
  disabled?: boolean;
}

function createEmptyRow(id: string): LedgerRowState {
  return {
    id,
    accountCode: null,
    debit: "",
    credit: "",
  };
}

/** Deterministic IDs for SSR — avoids hydration mismatch from crypto.randomUUID(). */
export function createInitialLedgerRows(count = 2): LedgerRowState[] {
  return Array.from({ length: count }, (_, index) =>
    createEmptyRow(`ledger-row-${index}`)
  );
}

function createClientRow(): LedgerRowState {
  return createEmptyRow(`ledger-row-${crypto.randomUUID()}`);
}

export function AccountingLedgerTable({
  rows,
  accounts,
  onRowsChange,
  disabled = false,
}: AccountingLedgerTableProps) {
  const { totalDebit, totalCredit } = useMemo(() => {
    let debit = 0;
    let credit = 0;
    for (const row of rows) {
      debit += parseLedgerAmount(row.debit);
      credit += parseLedgerAmount(row.credit);
    }
    return {
      totalDebit: Math.round(debit * 100) / 100,
      totalCredit: Math.round(credit * 100) / 100,
    };
  }, [rows]);

  const updateRow = (id: string, patch: Partial<LedgerRowState>) => {
    onRowsChange(
      rows.map((row) => (row.id === id ? { ...row, ...patch } : row))
    );
  };

  const removeRow = (id: string) => {
    if (rows.length <= 1) return;
    onRowsChange(rows.filter((row) => row.id !== id));
  };

  const addRow = () => {
    onRowsChange([...rows, createClientRow()]);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-stone-50 text-xs uppercase tracking-wide text-muted-foreground dark:bg-stone-900/40">
            <tr>
              <th className="px-3 py-3 text-left font-medium">Cuenta</th>
              <th className="px-3 py-3 text-right font-medium w-32">Debe</th>
              <th className="px-3 py-3 text-right font-medium w-32">Haber</th>
              <th className="px-3 py-3 w-10" aria-hidden="true" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-border align-top"
              >
                <td className="px-3 py-2 min-w-[220px]">
                  <AccountCodeCombobox
                    rowId={row.id}
                    accounts={accounts}
                    value={row.accountCode}
                    onChange={(accountCode) =>
                      updateRow(row.id, { accountCode })
                    }
                    disabled={disabled}
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={row.debit}
                    onChange={(event) =>
                      updateRow(row.id, { debit: event.target.value })
                    }
                    disabled={disabled}
                    placeholder="0"
                    aria-label="Valor al debe"
                    className="h-9 text-right"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={row.credit}
                    onChange={(event) =>
                      updateRow(row.id, { credit: event.target.value })
                    }
                    disabled={disabled}
                    placeholder="0"
                    aria-label="Valor al haber"
                    className="h-9 text-right"
                  />
                </td>
                <td className="px-2 py-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeRow(row.id)}
                    disabled={disabled || rows.length <= 1}
                    aria-label="Eliminar fila"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </td>
              </tr>
            ))}
            <AccountingLedgerTotalsRow
              totalDebit={totalDebit}
              totalCredit={totalCredit}
            />
          </tbody>
        </table>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addRow}
        disabled={disabled}
        className="cursor-pointer"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Agregar fila
      </Button>
    </div>
  );
}

export function ledgerRowsToPayload(rows: LedgerRowState[]) {
  return rows
    .filter((row) => row.accountCode)
    .map((row) => ({
      accountCode: row.accountCode as string,
      debit: parseLedgerAmount(row.debit),
      credit: parseLedgerAmount(row.credit),
    }))
    .filter((row) => row.debit > 0 || row.credit > 0);
}
