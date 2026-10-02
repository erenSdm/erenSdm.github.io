import {
  ArrowLeftRight,
  Banknote,
  CarFront,
  ShoppingBag,
  ShoppingBasket,
  Ticket,
  UtensilsCrossed,
  Zap,
  type LucideIcon,
} from "lucide-react";

/* ---------------------------------------------------------------
   MINT — seed data. The demo's "today" is fixed so server and
   client render identically: Thursday, 24 September 2026.
---------------------------------------------------------------- */

export const TODAY = "2026-09-24";
export const YESTERDAY = "2026-09-23";

export const OWNER = {
  name: "Eren Aydemir",
  initials: "EA",
  handle: "@erenaydemir",
};

export type Currency = "TRY" | "EUR" | "USD";

export const CURRENCIES: Currency[] = ["TRY", "EUR", "USD"];

export const CURRENCY_META: Record<
  Currency,
  { symbol: string; name: string; flag: string; delta: number }
> = {
  TRY: { symbol: "₺", name: "Turkish lira", flag: "TR", delta: 3214.8 },
  EUR: { symbol: "€", name: "Euro", flag: "EU", delta: 1531.6 },
  USD: { symbol: "$", name: "US dollar", flag: "US", delta: 389.1 },
};

export const OPENING_BALANCES: Record<Currency, number> = {
  TRY: 48216.35,
  EUR: 2418.6,
  USD: 1067.42,
};

/* ---------------- categories ---------------- */

export type Category =
  | "groceries"
  | "dining"
  | "transport"
  | "shopping"
  | "bills"
  | "entertainment"
  | "transfers"
  | "income";

export interface CategoryMeta {
  label: string;
  icon: LucideIcon;
  /** tile background */
  bg: string;
  /** tile foreground — AA against bg */
  fg: string;
  /** bar / chart colour */
  bar: string;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  groceries: { label: "Groceries", icon: ShoppingBasket, bg: "#E7F2EC", fg: "#1D6A44", bar: "#2E8A5C" },
  dining: { label: "Dining", icon: UtensilsCrossed, bg: "#FBEDE3", fg: "#8F4416", bar: "#C8682E" },
  transport: { label: "Transport", icon: CarFront, bg: "#E6EDF7", fg: "#2A578E", bar: "#3F72B5" },
  shopping: { label: "Shopping", icon: ShoppingBag, bg: "#F7E8EE", fg: "#8E2F4E", bar: "#B9476D" },
  bills: { label: "Bills", icon: Zap, bg: "#EDEFF3", fg: "#3B4351", bar: "#5D6677" },
  entertainment: { label: "Entertainment", icon: Ticket, bg: "#FAF1D9", fg: "#7D5A08", bar: "#B88A1C" },
  transfers: { label: "Transfers", icon: ArrowLeftRight, bg: "#E3F1EC", fg: "#0A6B53", bar: "#0A7A5E" },
  income: { label: "Income", icon: Banknote, bg: "#E3F1EC", fg: "#0A6B53", bar: "#0A7A5E" },
};

export const FILTER_CATEGORIES: Category[] = [
  "groceries",
  "dining",
  "transport",
  "shopping",
  "bills",
  "entertainment",
  "transfers",
  "income",
];

export const SPEND_CATEGORIES: Category[] = [
  "groceries",
  "dining",
  "transport",
  "shopping",
  "bills",
  "entertainment",
];

/* ---------------- contacts ---------------- */

export interface Contact {
  id: string;
  name: string;
  initials: string;
  handle: string;
  tint: string;
  ink: string;
}

export const CONTACTS: Contact[] = [
  { id: "selin", name: "Selin Kaya", initials: "SK", handle: "@selinkaya", tint: "#F3E3D9", ink: "#7A3A16" },
  { id: "mert", name: "Mert Özdemir", initials: "MÖ", handle: "@mertozd", tint: "#DCE8F5", ink: "#24507F" },
  { id: "deniz", name: "Deniz Arslan", initials: "DA", handle: "@denizarslan", tint: "#E1EFE6", ink: "#1D6340" },
  { id: "zeynep", name: "Zeynep Aksoy", initials: "ZA", handle: "@zeynepaksoy", tint: "#F2E2EA", ink: "#82304F" },
  { id: "lukas", name: "Lukas Brenner", initials: "LB", handle: "@lbrenner", tint: "#E6E6F0", ink: "#3E3F6B" },
  { id: "ines", name: "Inês Duarte", initials: "ID", handle: "@inesduarte", tint: "#F4EBD3", ink: "#6E520C" },
  { id: "can", name: "Can Ertürk", initials: "CE", handle: "@canerturk", tint: "#E3ECEE", ink: "#2C5560" },
];

export const contactById = (id: string) => CONTACTS.find((c) => c.id === id);

/* ---------------- funding sources ---------------- */

export interface FundingSource {
  id: string;
  label: string;
  detail: string;
}

export const FUNDING_SOURCES: FundingSource[] = [
  { id: "garanti", label: "Garanti BBVA", detail: "Debit •• 2291" },
  { id: "isbank", label: "İş Bankası", detail: "Account •• 7730" },
  { id: "applepay", label: "Apple Pay", detail: "Wallet card •• 0418" },
];

/* ---------------- cards ---------------- */

export type CardFace = "evergreen" | "paper" | "graphite";

export interface CardSettings {
  online: boolean;
  contactless: boolean;
  atm: boolean;
}

export interface WalletCard {
  id: string;
  name: string;
  kind: "Physical" | "Virtual";
  currency: Currency;
  network: "visa" | "mastercard";
  number: string;
  expiry: string;
  cvv: string;
  holder: string;
  face: CardFace;
  frozen: boolean;
  limit: number;
  limitMax: number;
  spent: number;
  settings: CardSettings;
}

export const CARDS: WalletCard[] = [
  {
    id: "everyday",
    name: "Everyday",
    kind: "Physical",
    currency: "TRY",
    network: "visa",
    number: "4921 7730 1846 4471",
    expiry: "08/29",
    cvv: "614",
    holder: "EREN AYDEMIR",
    face: "evergreen",
    frozen: false,
    limit: 25000,
    limitMax: 60000,
    spent: 17412.86,
    settings: { online: true, contactless: true, atm: true },
  },
  {
    id: "travel",
    name: "Travel",
    kind: "Physical",
    currency: "EUR",
    network: "mastercard",
    number: "5412 0938 6620 1158",
    expiry: "03/28",
    cvv: "207",
    holder: "EREN AYDEMIR",
    face: "paper",
    frozen: false,
    limit: 2000,
    limitMax: 5000,
    spent: 557.03,
    settings: { online: true, contactless: true, atm: false },
  },
  {
    id: "online",
    name: "Online",
    kind: "Virtual",
    currency: "USD",
    network: "visa",
    number: "4921 7731 0072 9035",
    expiry: "11/27",
    cvv: "833",
    holder: "EREN AYDEMIR",
    face: "graphite",
    frozen: true,
    limit: 300,
    limitMax: 1000,
    spent: 85.58,
    settings: { online: true, contactless: false, atm: false },
  },
];

/* ---------------- transactions ---------------- */

export interface Txn {
  id: string;
  merchant: string;
  category: Category;
  /** signed: negative is money out */
  amount: number;
  currency: Currency;
  /** ISO date, yyyy-mm-dd */
  date: string;
  time: string;
  cardId?: string;
  contactId?: string;
  location?: string;
  status: "Completed" | "Pending";
  reference: string;
  note?: string;
  receipt?: string;
}

type Seed = Omit<Txn, "id" | "status" | "reference"> & { status?: Txn["status"] };

const SEED: Seed[] = [
  { merchant: "BiTaksi", category: "transport", amount: -214.8, currency: "TRY", date: "2026-09-24", time: "19:26", cardId: "everyday", location: "Beşiktaş, İstanbul" },
  { merchant: "Migros Jet", category: "groceries", amount: -612.35, currency: "TRY", date: "2026-09-24", time: "13:10", cardId: "everyday", location: "Caferağa, Kadıköy" },
  { merchant: "Kahve Dünyası", category: "dining", amount: -86.5, currency: "TRY", date: "2026-09-24", time: "08:42", cardId: "everyday", location: "Moda, Kadıköy" },
  { merchant: "Yemeksepeti", category: "dining", amount: -387.9, currency: "TRY", date: "2026-09-23", time: "20:51", cardId: "everyday", location: "Online order" },
  { merchant: "İstanbulkart", category: "transport", amount: -300, currency: "TRY", date: "2026-09-23", time: "08:05", cardId: "everyday", location: "Kadıköy İskele" },
  { merchant: "Turkcell", category: "bills", amount: -449, currency: "TRY", date: "2026-09-23", time: "06:00", cardId: "everyday", location: "Direct debit" },
  { merchant: "Booking.com", category: "entertainment", amount: -318.4, currency: "EUR", date: "2026-09-22", time: "22:14", cardId: "travel", location: "Amsterdam, NL" },
  { merchant: "Trendyol", category: "shopping", amount: -1284.47, currency: "TRY", date: "2026-09-22", time: "21:37", cardId: "everyday", location: "Online order" },
  { merchant: "Simit Sarayı", category: "dining", amount: -67.5, currency: "TRY", date: "2026-09-22", time: "09:12", cardId: "everyday", location: "Levent, Beşiktaş" },
  { merchant: "Kırmızı Yazılım A.Ş.", category: "income", amount: 41237.82, currency: "TRY", date: "2026-09-21", time: "10:00", location: "Salary · September" },
  { merchant: "Macrocenter", category: "groceries", amount: -943.18, currency: "TRY", date: "2026-09-21", time: "17:48", cardId: "everyday", location: "Bağdat Caddesi" },
  { merchant: "Spotify", category: "bills", amount: -109, currency: "TRY", date: "2026-09-21", time: "04:12", cardId: "everyday", location: "Subscription" },
  { merchant: "Shell", category: "transport", amount: -1612.44, currency: "TRY", date: "2026-09-20", time: "11:23", cardId: "everyday", location: "Ataşehir, İstanbul" },
  { merchant: "Albert Heijn", category: "groceries", amount: -23.87, currency: "EUR", date: "2026-09-20", time: "18:02", cardId: "travel", location: "Utrecht, NL" },
  { merchant: "Zara", category: "shopping", amount: -2149.9, currency: "TRY", date: "2026-09-20", time: "15:40", cardId: "everyday", location: "Zorlu Center" },
  { merchant: "Martı", category: "transport", amount: -46.3, currency: "TRY", date: "2026-09-20", time: "13:05", cardId: "everyday", location: "Kadıköy, İstanbul" },
  { merchant: "Mert Özdemir", category: "transfers", amount: -750, currency: "TRY", date: "2026-09-19", time: "21:18", contactId: "mert", location: "Mint transfer", note: "Concert tickets" },
  { merchant: "Biletix", category: "entertainment", amount: -860, currency: "TRY", date: "2026-09-19", time: "20:44", cardId: "everyday", location: "Online order" },
  { merchant: "A101", category: "groceries", amount: -318.65, currency: "TRY", date: "2026-09-19", time: "18:31", cardId: "everyday", location: "Fenerbahçe, Kadıköy" },
  { merchant: "Studio Halden", category: "income", amount: 1850, currency: "EUR", date: "2026-09-18", time: "14:20", location: "Invoice #0412" },
  { merchant: "Enerjisa", category: "bills", amount: -1137.62, currency: "TRY", date: "2026-09-18", time: "09:00", cardId: "everyday", location: "Direct debit" },
  { merchant: "Getir", category: "groceries", amount: -274.15, currency: "TRY", date: "2026-09-18", time: "22:47", cardId: "everyday", location: "Online order" },
  { merchant: "Starbucks", category: "dining", amount: -158, currency: "TRY", date: "2026-09-18", time: "16:09", cardId: "everyday", location: "Nişantaşı, Şişli" },
  { merchant: "Upwork", category: "income", amount: 412.5, currency: "USD", date: "2026-09-17", time: "12:00", location: "Payout" },
  { merchant: "Decathlon", category: "shopping", amount: -1849.35, currency: "TRY", date: "2026-09-17", time: "19:55", cardId: "everyday", location: "Akasya, Acıbadem" },
  { merchant: "Selin Kaya", category: "transfers", amount: 420, currency: "TRY", date: "2026-09-17", time: "23:02", contactId: "selin", location: "Mint transfer", note: "Dinner at Çiya" },
  { merchant: "Amazon", category: "shopping", amount: -47.18, currency: "USD", date: "2026-09-16", time: "10:41", cardId: "online", location: "amazon.com" },
  { merchant: "Lufthansa", category: "transport", amount: -214.76, currency: "EUR", date: "2026-09-16", time: "08:15", cardId: "travel", location: "lufthansa.com" },
  { merchant: "İGDAŞ", category: "bills", amount: -892.4, currency: "TRY", date: "2026-09-16", time: "09:00", cardId: "everyday", location: "Direct debit" },
  { merchant: "Cinemaximum", category: "entertainment", amount: -340, currency: "TRY", date: "2026-09-16", time: "20:30", cardId: "everyday", location: "Kanyon, Levent" },
  { merchant: "Steam", category: "entertainment", amount: -23.4, currency: "USD", date: "2026-09-15", time: "23:51", cardId: "online", location: "store.steampowered.com" },
  { merchant: "Hepsiburada", category: "shopping", amount: -3417.2, currency: "TRY", date: "2026-09-15", time: "12:26", cardId: "everyday", location: "Online order" },
  { merchant: "Kahve Dünyası", category: "dining", amount: -92, currency: "TRY", date: "2026-09-15", time: "08:37", cardId: "everyday", location: "Moda, Kadıköy" },
  { merchant: "Figma", category: "bills", amount: -15, currency: "USD", date: "2026-09-15", time: "03:00", cardId: "online", location: "Subscription" },
];

export const SEED_TXNS: Txn[] = SEED.map((t, i) => ({
  ...t,
  id: `t${i + 1}`,
  status: t.status ?? "Completed",
  reference: `MNT-${(48213 + i * 317).toString(36).toUpperCase()}`,
}));

/* ---------------- budgets (TRY, September) ---------------- */

export interface Budget {
  category: Category;
  limit: number;
  /** spent 1–14 Sep, before the visible activity window */
  before: number;
}

export const BUDGETS: Budget[] = [
  { category: "groceries", limit: 9000, before: 3861.27 },
  { category: "dining", limit: 2800, before: 1742.1 },
  { category: "transport", limit: 2500, before: 1024.6 },
  { category: "shopping", limit: 12000, before: 0 },
  { category: "bills", limit: 5000, before: 1284 },
  { category: "entertainment", limit: 2000, before: 210 },
];

/** Weekly spend for 1–7 and 8–14 Sep (sums to the budgets' `before`). */
export const EARLY_WEEKS = [3702.55, 4419.42];
