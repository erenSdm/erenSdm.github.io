import { BUDGETS, EARLY_WEEKS, SPEND_CATEGORIES, TODAY, type Category, type Txn } from "./data";
import { shiftDay } from "./format";

const isSpend = (t: Txn) =>
  t.currency === "TRY" && t.amount < 0 && SPEND_CATEGORIES.includes(t.category) && t.date.startsWith("2026-09");

export interface BudgetLine {
  category: Category;
  limit: number;
  spent: number;
}

export function budgetLines(txns: Txn[]): BudgetLine[] {
  return BUDGETS.map((b) => ({
    category: b.category,
    limit: b.limit,
    spent:
      b.before +
      txns.filter((t) => isSpend(t) && t.category === b.category).reduce((s, t) => s - t.amount, 0),
  }));
}

export interface Bar {
  label: string;
  value: number;
  current: boolean;
}

/** Daily TRY spend for the 7 days ending today. */
export function weekSeries(txns: Txn[]): Bar[] {
  const days = Array.from({ length: 7 }, (_, i) => shiftDay(TODAY, i - 6));
  const letters = ["F", "S", "S", "M", "T", "W", "T"];
  return days.map((d, i) => ({
    label: letters[i],
    value: txns.filter((t) => isSpend(t) && t.date === d).reduce((s, t) => s - t.amount, 0),
    current: d === TODAY,
  }));
}

/** Weekly TRY spend across September so far. */
export function monthSeries(txns: Txn[]): Bar[] {
  const inRange = (from: string, to: string) =>
    txns.filter((t) => isSpend(t) && t.date >= from && t.date <= to).reduce((s, t) => s - t.amount, 0);
  return [
    { label: "1–7", value: EARLY_WEEKS[0], current: false },
    { label: "8–14", value: EARLY_WEEKS[1], current: false },
    { label: "15–21", value: inRange("2026-09-15", "2026-09-21"), current: false },
    { label: "22–24", value: inRange("2026-09-22", "2026-09-30"), current: true },
  ];
}
