const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatAccountingCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

export function parseLedgerAmount(value: string): number {
  const normalized = value.replace(/,/g, ".").trim();
  if (!normalized) return 0;
  const parsed = Number.parseFloat(normalized);
  if (Number.isNaN(parsed) || parsed < 0) return 0;
  return Math.round(parsed * 100) / 100;
}
