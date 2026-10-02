"use client";

import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "framer-motion";
import { ArrowLeftRight, ChartPie, CreditCard, House, type LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { ActivityScreen } from "./ActivityScreen";
import { BudgetScreen } from "./BudgetScreen";
import { CardsScreen } from "./CardsScreen";
import { contactById, type Currency } from "./data";
import { manrope } from "./fonts";
import { formatMoney } from "./format";
import { HomeScreen } from "./HomeScreen";
import { RequestFlow, SendFlow, TopUpFlow } from "./MoneyFlows";
import {
  WalletContext,
  initialWallet,
  nowTime,
  walletReducer,
  type ActivityFilter,
  type SheetState,
  type Tab,
  type WalletContextValue,
} from "./store";
import { TxnSheet } from "./TxnSheet";
import { ICON, Sheet, spring } from "./ui";

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "Home", icon: House },
  { id: "cards", label: "Cards", icon: CreditCard },
  { id: "activity", label: "Activity", icon: ArrowLeftRight },
  { id: "budget", label: "Budget", icon: ChartPie },
];

function TabBar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav
      aria-label="Main"
      className="relative z-20 shrink-0 border-t border-[#E5E7EB] bg-white/92 px-3 pb-[var(--safe-bottom)] pt-1.5 backdrop-blur-xl"
    >
      <LayoutGroup id="tabbar">
        <ul className="grid grid-cols-4">
          {TABS.map(({ id, label, icon: Icon }) => {
            const on = tab === id;
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => onChange(id)}
                  aria-current={on ? "page" : undefined}
                  className={`relative flex h-[54px] w-full flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${
                    on ? "text-[#12161C]" : "text-[#727986]"
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="tab-indicator"
                      transition={spring}
                      className="absolute top-0 h-[3px] w-6 rounded-full bg-[#0A7A5E]"
                    />
                  )}
                  <Icon size={22} strokeWidth={ICON} />
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </LayoutGroup>
    </nav>
  );
}

const SCREENS: Record<Tab, () => React.JSX.Element> = {
  home: HomeScreen,
  cards: CardsScreen,
  activity: ActivityScreen,
  budget: BudgetScreen,
};

const sheetLabel: Record<SheetState["kind"], string> = {
  send: "Send money",
  request: "Request money",
  topUp: "Top up",
  txn: "Transaction details",
};

/**
 * MINT — light personal-finance wallet. Four tabs, live state:
 * sends, top-ups and requests move balances and land in Activity.
 */
export function WalletApp() {
  const [state, dispatch] = useReducer(walletReducer, initialWallet);
  const [tab, setTab] = useState<Tab>("home");
  const [currency, setCurrency] = useState<Currency>("TRY");
  const [hidden, setHidden] = useState(false);
  const [sheet, setSheet] = useState<SheetState | null>(null);
  const [filter, setFilter] = useState<ActivityFilter>({ category: "all", query: "" });
  const [searchFocus, setSearchFocus] = useState(0);
  const [toastMsg, setToastMsg] = useState<{ id: number; text: string } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const payTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const toast = useCallback((text: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMsg({ id: Date.now(), text });
    toastTimer.current = setTimeout(() => setToastMsg(null), 2400);
  }, []);

  const closeSheet = useCallback(() => setSheet(null), []);

  /** Switching tabs drops any pending search-focus request so it fires once. */
  const goTab = useCallback((t: Tab) => {
    setTab(t);
    setSearchFocus(0);
  }, []);

  // Pending requests get paid a few seconds later, like a friend tapping the link.
  useEffect(() => {
    const timers = payTimers.current;
    state.requests
      .filter((r) => r.status === "pending" && !timers.has(r.id))
      .forEach((r, i) => {
        timers.set(
          r.id,
          setTimeout(
            () => {
              dispatch({ type: "requestPaid", id: r.id, time: nowTime() });
              const c = contactById(r.contactId);
              if (c) toast(`${c.name.split(" ")[0]} paid ${formatMoney(r.amount, r.currency)}`);
            },
            7000 + i * 2600,
          ),
        );
      });
    for (const [id, t] of timers) {
      if (!state.requests.some((r) => r.id === id && r.status === "pending")) {
        clearTimeout(t);
        timers.delete(id);
      }
    }
  }, [state.requests, toast]);

  useEffect(() => {
    const timers = payTimers.current;
    return () => {
      timers.forEach(clearTimeout);
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const ctx = useMemo<WalletContextValue>(
    () => ({
      state,
      dispatch,
      tab,
      setTab: goTab,
      currency,
      setCurrency,
      hidden,
      toggleHidden: () => setHidden((h) => !h),
      openSheet: setSheet,
      closeSheet,
      toast,
      filter,
      setFilter,
      searchFocus,
      focusSearch: () => setSearchFocus((n) => n + 1),
    }),
    [state, tab, goTab, currency, hidden, closeSheet, toast, filter, searchFocus],
  );

  const Screen = SCREENS[tab];

  return (
    <WalletContext.Provider value={ctx}>
      <MotionConfig reducedMotion="user">
        <div
          className={`${manrope.className} relative flex h-full w-full flex-col overflow-hidden bg-[#F3F4F6] text-[#12161C] antialiased`}
          style={{ letterSpacing: "-0.011em" }}
        >
          <main className="relative min-h-0 flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                className="absolute inset-0"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
                <Screen />
              </motion.div>
            </AnimatePresence>
          </main>

          <TabBar tab={tab} onChange={goTab} />

          <AnimatePresence>
            {toastMsg && (
              <motion.div
                key={toastMsg.id}
                role="status"
                initial={{ opacity: 0, y: -12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={spring}
                className="pointer-events-none absolute inset-x-0 top-[calc(var(--safe-top)+6px)] z-50 flex justify-center px-6"
              >
                <span className="rounded-full bg-[#12161C] px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_10px_30px_-10px_rgba(18,22,28,0.5)]">
                  {toastMsg.text}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {sheet && (
              <Sheet key={sheet.kind === "txn" ? `txn-${sheet.txnId}` : sheet.kind} label={sheetLabel[sheet.kind]} onClose={closeSheet} tall={sheet.kind !== "txn"}>
                {sheet.kind === "send" && <SendFlow initialContactId={sheet.contactId} onClose={closeSheet} />}
                {sheet.kind === "request" && <RequestFlow initialContactId={sheet.contactId} onClose={closeSheet} />}
                {sheet.kind === "topUp" && <TopUpFlow onClose={closeSheet} />}
                {sheet.kind === "txn" && <TxnSheet txnId={sheet.txnId} onClose={closeSheet} />}
              </Sheet>
            )}
          </AnimatePresence>
        </div>
      </MotionConfig>
    </WalletContext.Provider>
  );
}

