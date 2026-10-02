"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Search, SearchX, X } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { CATEGORY_META, FILTER_CATEGORIES, type Category, type Txn } from "./data";
import { dayLabel } from "./format";
import { useWallet } from "./store";
import { ICON, PrimaryButton, TxnRow, spring } from "./ui";

export function ActivityScreen() {
  const { state, filter, setFilter, openSheet, hidden, searchFocus } = useWallet();
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchFocus > 0) input.current?.focus();
  }, [searchFocus]);

  const groups = useMemo(() => {
    const q = filter.query.trim().toLocaleLowerCase("tr");
    const list = state.txns
      .filter((t) => filter.category === "all" || t.category === filter.category)
      .filter(
        (t) =>
          !q ||
          t.merchant.toLocaleLowerCase("tr").includes(q) ||
          (t.location ?? "").toLocaleLowerCase("tr").includes(q) ||
          (t.note ?? "").toLocaleLowerCase("tr").includes(q),
      )
      .sort((a, b) => (a.date === b.date ? b.time.localeCompare(a.time) : b.date.localeCompare(a.date)));
    const map = new Map<string, Txn[]>();
    for (const t of list) map.set(t.date, [...(map.get(t.date) ?? []), t]);
    return { count: list.length, days: [...map.entries()] };
  }, [state.txns, filter]);

  const setCategory = (category: Category | "all") => setFilter({ ...filter, category });
  const catLabel = filter.category === "all" ? null : CATEGORY_META[filter.category].label;

  return (
    <div className="flex h-full flex-col">
      <header className="shrink-0 px-5 pt-[calc(var(--safe-top)+10px)]">
        <div className="flex items-end justify-between">
          <h1 className="text-[28px] font-bold tracking-[-0.035em] text-[#12161C]">Activity</h1>
          <p className="pb-1 text-[13px] font-medium tabular-nums text-[#555D6B]">
            {groups.count} {groups.count === 1 ? "transaction" : "transactions"}
          </p>
        </div>
        <label className="mt-3 flex h-11 items-center gap-2 rounded-2xl bg-white px-3.5 text-[#555D6B] shadow-[0_1px_2px_rgba(18,22,28,0.05)] focus-within:ring-2 focus-within:ring-[#0A7A5E]/40">
          <Search size={18} strokeWidth={ICON} aria-hidden />
          <input
            ref={input}
            value={filter.query}
            onChange={(e) => setFilter({ ...filter, query: e.target.value })}
            placeholder="Search merchants, people, notes"
            aria-label="Search transactions"
            className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-[#12161C] outline-none placeholder:text-[#727986]"
          />
          {filter.query && (
            <button
              type="button"
              onClick={() => setFilter({ ...filter, query: "" })}
              aria-label="Clear search"
              className="grid h-6 w-6 place-items-center rounded-full bg-[#E5E7EB] text-[#12161C]"
            >
              <X size={13} strokeWidth={ICON} />
            </button>
          )}
        </label>
      </header>

      <LayoutGroup id="activity-chips">
        <div
          className="mt-3 flex shrink-0 gap-2 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="radiogroup"
          aria-label="Category"
        >
          {(["all", ...FILTER_CATEGORIES] as const).map((c) => {
            const on = filter.category === c;
            return (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setCategory(c)}
                className={`relative h-9 shrink-0 rounded-full px-3.5 text-[14px] font-semibold transition-colors ${
                  on ? "text-white" : "bg-white text-[#12161C] shadow-[0_1px_2px_rgba(18,22,28,0.05)]"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="activity-chip"
                    transition={spring}
                    className="absolute inset-0 rounded-full bg-[#12161C]"
                  />
                )}
                <span className="relative">{c === "all" ? "All" : CATEGORY_META[c].label}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <LayoutGroup id="activity-list">
          <AnimatePresence mode="popLayout" initial={false}>
            {groups.days.map(([date, txns]) => (
              <motion.section
                key={date}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={spring}
                className="mb-4"
                aria-label={dayLabel(date)}
              >
                <h2 className="mb-1.5 px-1 text-[13px] font-semibold text-[#555D6B]">{dayLabel(date)}</h2>
                <div className="rounded-[24px] bg-white p-1.5 shadow-[0_1px_2px_rgba(18,22,28,0.05)]">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {txns.map((t) => (
                      <motion.div
                        key={t.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={spring}
                      >
                        <TxnRow txn={t} hidden={hidden} onClick={() => openSheet({ kind: "txn", txnId: t.id })} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.section>
            ))}
          </AnimatePresence>
        </LayoutGroup>

        {groups.count === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center px-6 pt-14 text-center"
          >
            <span className="grid h-16 w-16 place-items-center rounded-full bg-white text-[#555D6B] shadow-[0_1px_2px_rgba(18,22,28,0.05)]">
              <SearchX size={26} strokeWidth={ICON} />
            </span>
            <h2 className="mt-4 text-[18px] font-bold tracking-[-0.02em] text-[#12161C]">No matching transactions</h2>
            <p className="mt-1.5 max-w-[260px] text-[14px] leading-relaxed text-[#555D6B]">
              {filter.query && catLabel
                ? `Nothing in ${catLabel} matches “${filter.query.trim()}”.`
                : filter.query
                  ? `Nothing matches “${filter.query.trim()}”. Try a merchant name or a person.`
                  : `No ${catLabel} transactions this month.`}
            </p>
            <div className="mt-5 w-full max-w-[220px]">
              <PrimaryButton tone="ink" onClick={() => setFilter({ category: "all", query: "" })}>
                Clear filters
              </PrimaryButton>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
