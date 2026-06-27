"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { AccountingAccountOption } from "@/lib/supabase/lesson-viewer.types";

interface AccountCodeComboboxProps {
  accounts: AccountingAccountOption[];
  value: string | null;
  onChange: (accountCode: string) => void;
  disabled?: boolean;
  rowId: string;
}

export function AccountCodeCombobox({
  accounts,
  value,
  onChange,
  disabled = false,
  rowId,
}: AccountCodeComboboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedAccount = accounts.find((account) => account.code === value);

  useEffect(() => {
    if (selectedAccount) {
      setQuery(`${selectedAccount.code} — ${selectedAccount.name}`);
    } else if (!value) {
      setQuery("");
    }
  }, [selectedAccount, value]);

  const filteredAccounts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return accounts;
    return accounts.filter(
      (account) =>
        account.code.toLowerCase().includes(normalized) ||
        account.name.toLowerCase().includes(normalized)
    );
  }, [accounts, query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative min-w-0">
      <Input
        id={`account-${rowId}`}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        disabled={disabled}
        placeholder="Buscar cuenta…"
        aria-label="Seleccionar cuenta contable"
        aria-expanded={isOpen}
        aria-controls={`account-list-${rowId}`}
        autoComplete="off"
        className="h-9"
      />
      {isOpen && !disabled ? (
        <ul
          id={`account-list-${rowId}`}
          role="listbox"
          className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-border bg-popover py-1 shadow-md"
        >
          {filteredAccounts.length === 0 ? (
            <li className="px-3 py-2 text-xs text-muted-foreground">
              No hay cuentas que coincidan
            </li>
          ) : (
            filteredAccounts.map((account) => (
              <li key={account.code} role="option">
                <button
                  type="button"
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm hover:bg-muted/60",
                    value === account.code && "bg-primary/10"
                  )}
                  onClick={() => {
                    onChange(account.code);
                    setQuery(`${account.code} — ${account.name}`);
                    setIsOpen(false);
                  }}
                >
                  <span className="font-medium">{account.code}</span>
                  <span className="text-muted-foreground"> — {account.name}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
