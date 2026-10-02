"use client";

import { createContext, useContext } from "react";
import {
  CARDS,
  OPENING_BALANCES,
  SEED_TXNS,
  TODAY,
  contactById,
  type CardSettings,
  type Category,
  type Currency,
  type FundingSource,
  type Txn,
  type WalletCard,
} from "./data";

/* ---------------- domain state ---------------- */

export interface MoneyRequest {
  id: string;
  contactId: string;
  amount: number;
  currency: Currency;
  reason?: string;
  status: "pending" | "paid";
}

export interface WalletState {
  balances: Record<Currency, number>;
  txns: Txn[];
  cards: WalletCard[];
  requests: MoneyRequest[];
  seq: number;
}

export type WalletAction =
  | { type: "send"; contactId: string; amount: number; currency: Currency; note?: string; time: string }
  | { type: "topUp"; source: FundingSource; amount: number; currency: Currency; time: string }
  | { type: "request"; contactIds: string[]; amount: number; currency: Currency; reason?: string }
  | { type: "requestPaid"; id: string; time: string }
  | { type: "cancelRequest"; id: string }
  | { type: "toggleFreeze"; cardId: string }
  | { type: "setLimit"; cardId: string; limit: number }
  | { type: "toggleSetting"; cardId: string; key: keyof CardSettings }
  | { type: "attachReceipt"; txnId: string; file: string };

export const initialWallet: WalletState = {
  balances: { ...OPENING_BALANCES },
  txns: SEED_TXNS,
  cards: CARDS,
  requests: [],
  seq: 1,
};

const round2 = (n: number) => Math.round(n * 100) / 100;

const ref = (seq: number) => `MNT-${(91207 + seq * 433).toString(36).toUpperCase()}`;

export function walletReducer(state: WalletState, action: WalletAction): WalletState {
  switch (action.type) {
    case "send": {
      const contact = contactById(action.contactId);
      if (!contact || action.amount > state.balances[action.currency]) return state;
      const txn: Txn = {
        id: `n${state.seq}`,
        merchant: contact.name,
        category: "transfers",
        amount: -action.amount,
        currency: action.currency,
        date: TODAY,
        time: action.time,
        contactId: contact.id,
        location: "Mint transfer",
        status: "Completed",
        reference: ref(state.seq),
        note: action.note,
      };
      return {
        ...state,
        seq: state.seq + 1,
        balances: {
          ...state.balances,
          [action.currency]: round2(state.balances[action.currency] - action.amount),
        },
        txns: [txn, ...state.txns],
      };
    }
    case "topUp": {
      const txn: Txn = {
        id: `n${state.seq}`,
        merchant: `Top up from ${action.source.label}`,
        category: "transfers",
        amount: action.amount,
        currency: action.currency,
        date: TODAY,
        time: action.time,
        location: action.source.detail,
        status: "Completed",
        reference: ref(state.seq),
      };
      return {
        ...state,
        seq: state.seq + 1,
        balances: {
          ...state.balances,
          [action.currency]: round2(state.balances[action.currency] + action.amount),
        },
        txns: [txn, ...state.txns],
      };
    }
    case "request": {
      const reqs: MoneyRequest[] = action.contactIds.map((contactId, i) => ({
        id: `r${state.seq + i}`,
        contactId,
        amount: action.amount,
        currency: action.currency,
        reason: action.reason,
        status: "pending",
      }));
      return { ...state, seq: state.seq + reqs.length, requests: [...reqs, ...state.requests] };
    }
    case "requestPaid": {
      const req = state.requests.find((r) => r.id === action.id);
      const contact = req && contactById(req.contactId);
      if (!req || !contact || req.status !== "pending") return state;
      const txn: Txn = {
        id: `n${state.seq}`,
        merchant: contact.name,
        category: "transfers",
        amount: req.amount,
        currency: req.currency,
        date: TODAY,
        time: action.time,
        contactId: contact.id,
        location: "Paid your request",
        status: "Completed",
        reference: ref(state.seq),
        note: req.reason,
      };
      return {
        ...state,
        seq: state.seq + 1,
        balances: {
          ...state.balances,
          [req.currency]: round2(state.balances[req.currency] + req.amount),
        },
        txns: [txn, ...state.txns],
        requests: state.requests.map((r) => (r.id === req.id ? { ...r, status: "paid" } : r)),
      };
    }
    case "cancelRequest":
      return { ...state, requests: state.requests.filter((r) => r.id !== action.id) };
    case "toggleFreeze":
      return {
        ...state,
        cards: state.cards.map((c) => (c.id === action.cardId ? { ...c, frozen: !c.frozen } : c)),
      };
    case "setLimit":
      return {
        ...state,
        cards: state.cards.map((c) => (c.id === action.cardId ? { ...c, limit: action.limit } : c)),
      };
    case "toggleSetting":
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === action.cardId
            ? { ...c, settings: { ...c.settings, [action.key]: !c.settings[action.key] } }
            : c,
        ),
      };
    case "attachReceipt":
      return {
        ...state,
        txns: state.txns.map((t) => (t.id === action.txnId ? { ...t, receipt: action.file } : t)),
      };
  }
}

/* ---------------- ui state ---------------- */

export type Tab = "home" | "cards" | "activity" | "budget";

export type SheetState =
  | { kind: "send"; contactId?: string }
  | { kind: "request"; contactId?: string }
  | { kind: "topUp" }
  | { kind: "txn"; txnId: string };

export interface ActivityFilter {
  category: Category | "all";
  query: string;
}

export interface WalletContextValue {
  state: WalletState;
  dispatch: (action: WalletAction) => void;
  tab: Tab;
  setTab: (tab: Tab) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  hidden: boolean;
  toggleHidden: () => void;
  openSheet: (sheet: SheetState) => void;
  closeSheet: () => void;
  toast: (message: string) => void;
  filter: ActivityFilter;
  setFilter: (f: ActivityFilter) => void;
  /** increments when another screen asks Activity to focus its search field */
  searchFocus: number;
  focusSearch: () => void;
}

export const WalletContext = createContext<WalletContextValue | null>(null);

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside <WalletApp>");
  return ctx;
}

export function nowTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
