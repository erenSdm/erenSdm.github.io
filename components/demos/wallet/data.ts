import {
  Bike,
  Car,
  Cloud,
  Coffee,
  Fuel,
  Landmark,
  Music,
  ShoppingBag,
  ShoppingBasket,
  Tv,
  type LucideIcon,
} from "lucide-react";

/* ---------------------------------------------------------------
   MINT — mock wallet data.
   Believable merchants, organic amounts, no round fakes.
---------------------------------------------------------------- */

export const OWNER = {
  firstName: "Eren",
  avatar: "https://i.pravatar.cc/120?img=12",
};

/** Total balance, this-month delta. */
export const BALANCE = {
  total: 8412.6,
  currency: "$",
  deltaAmount: 1240.18,
  deltaPct: 17.3,
  deltaUp: true,
};

export interface WalletCard {
  id: string;
  label: string;
  last4: string;
  network: "visa" | "mastercard";
  balance: number;
  holder: string;
  /** CSS gradient for the card face. */
  face: string;
  /** foreground text tint */
  ink: string;
}

export const CARDS: WalletCard[] = [
  {
    id: "mint-emerald",
    label: "Everyday",
    last4: "4471",
    network: "visa",
    balance: 3210.44,
    holder: "E. AYDEMIR",
    face: "linear-gradient(135deg, #0C7A5E 0%, #1FA97F 52%, #46C29B 100%)",
    ink: "#052A20",
  },
  {
    id: "graphite",
    label: "Savings",
    last4: "8820",
    network: "mastercard",
    balance: 4980.12,
    holder: "E. AYDEMIR",
    face: "linear-gradient(135deg, #202523 0%, #14181B 60%, #0C0F10 100%)",
    ink: "#EAF3EF",
  },
  {
    id: "plum",
    label: "Travel",
    last4: "2093",
    network: "visa",
    balance: 222.04,
    holder: "E. AYDEMIR",
    face: "linear-gradient(135deg, #3E2559 0%, #5B3688 55%, #8E6BC0 100%)",
    ink: "#F3ECFA",
  },
];

export interface SpendSlice {
  label: string;
  pct: number;
  color: string;
}

/** Sums to 100.0 — organic distribution. */
export const SPENDING: SpendSlice[] = [
  { label: "Groceries", pct: 31.4, color: "#2FBF8C" },
  { label: "Dining", pct: 22.8, color: "#F5B14C" },
  { label: "Transport", pct: 16.3, color: "#5EA0F2" },
  { label: "Subscriptions", pct: 12.9, color: "#A78BFA" },
  { label: "Shopping", pct: 9.7, color: "#FB7185" },
  { label: "Other", pct: 6.9, color: "#6B7280" },
];

export const SPENT_THIS_MONTH = 2184.55;

export interface Txn {
  id: string;
  merchant: string;
  category: string;
  time: string;
  amount: number; // negative = outflow
  icon: LucideIcon;
  tint: string;
}

export const TRANSACTIONS: Txn[] = [
  {
    id: "t1",
    merchant: "Payoneer",
    category: "Freelance payout",
    time: "Today, 08:14",
    amount: 1842.5,
    icon: Landmark,
    tint: "#2FBF8C",
  },
  {
    id: "t2",
    merchant: "Kahve Dünyası",
    category: "Dining",
    time: "Today, 09:37",
    amount: -4.75,
    icon: Coffee,
    tint: "#F5B14C",
  },
  {
    id: "t3",
    merchant: "Uber",
    category: "Transport",
    time: "Today, 10:02",
    amount: -12.4,
    icon: Car,
    tint: "#5EA0F2",
  },
  {
    id: "t4",
    merchant: "Migros",
    category: "Groceries",
    time: "Yesterday, 19:48",
    amount: -47.3,
    icon: ShoppingBasket,
    tint: "#2FBF8C",
  },
  {
    id: "t5",
    merchant: "Spotify",
    category: "Subscriptions",
    time: "Yesterday, 14:20",
    amount: -5.99,
    icon: Music,
    tint: "#A78BFA",
  },
  {
    id: "t6",
    merchant: "Getir",
    category: "Groceries",
    time: "Tue, 21:11",
    amount: -18.65,
    icon: Bike,
    tint: "#2FBF8C",
  },
  {
    id: "t7",
    merchant: "Trendyol",
    category: "Shopping",
    time: "Tue, 16:54",
    amount: -63.2,
    icon: ShoppingBag,
    tint: "#FB7185",
  },
  {
    id: "t8",
    merchant: "Netflix",
    category: "Subscriptions",
    time: "Mon, 07:03",
    amount: -15.49,
    icon: Tv,
    tint: "#A78BFA",
  },
  {
    id: "t9",
    merchant: "Shell",
    category: "Transport",
    time: "Mon, 08:41",
    amount: -71.85,
    icon: Fuel,
    tint: "#5EA0F2",
  },
  {
    id: "t10",
    merchant: "iCloud+",
    category: "Subscriptions",
    time: "Sun, 12:00",
    amount: -2.99,
    icon: Cloud,
    tint: "#A78BFA",
  },
];

/** Format a money figure without symbol: 8412.6 -> "8,412.60". */
export function money(n: number): string {
  return Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
