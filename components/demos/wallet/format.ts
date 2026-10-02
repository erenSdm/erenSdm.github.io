import { CURRENCY_META, TODAY, YESTERDAY, type Currency } from "./data";

/* Turkish-locale money formatting, done by hand so server and client
   always agree (no ICU differences): ₺12.480,35 / €2.418,60 / $1.067,42. */

const MINUS = "−";

export function groupDigits(int: string): string {
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function splitMoney(amount: number): { int: string; dec: string } {
  const fixed = Math.abs(amount).toFixed(2);
  const [int, dec] = fixed.split(".");
  return { int: groupDigits(int), dec };
}

export function formatMoney(
  amount: number,
  currency: Currency,
  opts: { sign?: boolean; decimals?: boolean } = {},
): string {
  const { int, dec } = splitMoney(amount);
  const symbol = CURRENCY_META[currency].symbol;
  const sign = opts.sign ? (amount < 0 ? MINUS : "+") : amount < 0 ? MINUS : "";
  return `${sign}${symbol}${int}${opts.decimals === false ? "" : `,${dec}`}`;
}

/** Keypad input ("1250.5") rendered as "1.250,5". */
export function formatInput(raw: string): string {
  if (!raw) return "0";
  const [int, dec] = raw.split(".");
  return dec === undefined ? groupDigits(int || "0") : `${groupDigits(int || "0")},${dec}`;
}

export function parseInput(raw: string): number {
  const n = Number.parseFloat(raw || "0");
  return Number.isFinite(n) ? n : 0;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return { y, m, d, wd };
}

export function dayLabel(iso: string): string {
  if (iso === TODAY) return "Today";
  if (iso === YESTERDAY) return "Yesterday";
  const { m, d, wd } = parts(iso);
  return `${WEEKDAYS[wd]}, ${d} ${MONTHS[m - 1]}`;
}

export function longDate(iso: string): string {
  const { m, d, wd, y } = parts(iso);
  return `${WEEKDAYS[wd]}, ${d} ${MONTHS[m - 1]} ${y}`;
}

export function weekdayShort(iso: string): string {
  return WEEKDAYS[parts(iso).wd].slice(0, 1);
}

export function shiftDay(iso: string, delta: number): string {
  const { y, m, d } = parts(iso);
  const dt = new Date(Date.UTC(y, m - 1, d + delta));
  return dt.toISOString().slice(0, 10);
}
