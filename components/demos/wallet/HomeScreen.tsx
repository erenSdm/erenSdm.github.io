"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, ChevronRight, Eye, EyeOff, Plus, Search } from "lucide-react";
import { CATEGORY_META, CURRENCIES, CURRENCY_META, OWNER, contactById, type Currency } from "./data";
import { formatMoney } from "./format";
import { budgetLines, weekSeries } from "./insights";
import { useWallet } from "./store";
import { ContactAvatar, ICON, MoneyFigure, TxnRow, spring, useAnimatedNumber } from "./ui";

function Balance({ value, currency }: { value: number; currency: Currency }) {
  const shown = useAnimatedNumber(value, 0, 0.9);
  return (
    <MoneyFigure
      value={shown}
      currency={currency}
      className="text-[46px] font-bold leading-none tracking-[-0.045em] text-[#12161C]"
      decClassName="text-[30px] text-[#727986]"
    />
  );
}

export function HomeScreen() {
  const { state, currency, setCurrency, hidden, toggleHidden, openSheet, setTab, focusSearch, dispatch } =
    useWallet();
  const balance = state.balances[currency];
  const recent = state.txns.filter((t) => t.currency === currency).slice(0, 5);
  const lines = budgetLines(state.txns);
  const spent = lines.reduce((s, l) => s + l.spent, 0);
  const planned = lines.reduce((s, l) => s + l.limit, 0);
  const week = weekSeries(state.txns);
  const weekMax = Math.max(...week.map((b) => b.value), 1);
  const requests = state.requests.slice(0, 3);

  return (
    <div className="h-full overflow-y-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {/* header */}
      <header className="flex items-center gap-3 px-5 pb-2 pt-[calc(var(--safe-top)+6px)]">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#12161C] text-[14px] font-semibold text-white">
          {OWNER.initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-[#12161C]">{OWNER.name}</p>
          <p className="text-[12px] text-[#555D6B]">Personal · 3 balances</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setTab("activity");
            focusSearch();
          }}
          aria-label="Search transactions"
          className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#12161C] shadow-[0_1px_2px_rgba(18,22,28,0.06)] active:scale-95"
        >
          <Search size={19} strokeWidth={ICON} />
        </button>
      </header>

      {/* balance */}
      <section className="px-5 pt-4" aria-label="Balance">
        <LayoutGroup id="home-currency">
          <div className="inline-flex rounded-full bg-[#E9EBEF] p-1" role="radiogroup" aria-label="Account currency">
            {CURRENCIES.map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={currency === c}
                onClick={() => setCurrency(c)}
                className={`relative h-8 rounded-full px-3.5 text-[13px] font-semibold transition-colors ${
                  currency === c ? "text-[#12161C]" : "text-[#555D6B]"
                }`}
              >
                {currency === c && (
                  <motion.span
                    layoutId="home-currency-pill"
                    transition={spring}
                    className="absolute inset-0 rounded-full bg-white shadow-[0_1px_2px_rgba(18,22,28,0.12)]"
                  />
                )}
                <span className="relative">{c}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>

        <div className="mt-5 flex items-center gap-1.5">
          <p className="text-[14px] font-medium text-[#555D6B]">{CURRENCY_META[currency].name} balance</p>
          <button
            type="button"
            onClick={toggleHidden}
            aria-label={hidden ? "Show balance" : "Hide balance"}
            aria-pressed={hidden}
            className="grid h-8 w-8 place-items-center rounded-full text-[#555D6B] active:bg-[#E9EBEF]"
          >
            {hidden ? <EyeOff size={17} strokeWidth={ICON} /> : <Eye size={17} strokeWidth={ICON} />}
          </button>
        </div>
        <div className="mt-1 h-[52px]">
          <AnimatePresence mode="wait" initial={false}>
            {hidden ? (
              <motion.p
                key="hidden"
                initial={{ opacity: 0, filter: "blur(6px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: 0.18 }}
                className="text-[46px] font-bold leading-none tracking-[0.04em] text-[#12161C]"
              >
                {CURRENCY_META[currency].symbol}••••••
              </motion.p>
            ) : (
              <motion.div
                key={`shown-${currency}`}
                initial={{ opacity: 0, filter: "blur(6px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: 0.18 }}
              >
                <Balance value={balance} currency={currency} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="mt-2 text-[13px] font-medium tabular-nums text-[#0A7A5E]">
          {hidden ? "Net change hidden" : `${formatMoney(CURRENCY_META[currency].delta, currency, { sign: true })} since 1 Sep`}
        </p>
      </section>

      {/* quick actions */}
      <section className="mt-6 grid grid-cols-3 gap-2.5 px-5" aria-label="Quick actions">
        {(
          [
            { label: "Send", icon: ArrowUpRight, kind: "send" },
            { label: "Request", icon: ArrowDownLeft, kind: "request" },
            { label: "Top up", icon: Plus, kind: "topUp" },
          ] as const
        ).map(({ label, icon: Icon, kind }, i) => (
          <button
            key={kind}
            type="button"
            onClick={() => openSheet({ kind })}
            className={`flex h-[76px] flex-col items-start justify-between rounded-[22px] p-3.5 text-left transition-transform active:scale-[0.97] ${
              i === 0
                ? "bg-[#0A7A5E] text-white"
                : "bg-white text-[#12161C] shadow-[0_1px_2px_rgba(18,22,28,0.05)]"
            }`}
          >
            <Icon size={20} strokeWidth={ICON} />
            <span className="text-[15px] font-semibold">{label}</span>
          </button>
        ))}
      </section>

      {/* pending requests */}
      <AnimatePresence initial={false}>
        {requests.length > 0 && (
          <motion.section
            key="requests"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden px-5"
            aria-label="Requests"
          >
            <div className="mt-5 rounded-[24px] bg-white p-2 shadow-[0_1px_2px_rgba(18,22,28,0.05)]">
              <p className="px-2 pb-1 pt-2 text-[13px] font-semibold text-[#555D6B]">Requests</p>
              {requests.map((r) => {
                const c = contactById(r.contactId);
                if (!c) return null;
                return (
                  <motion.div layout key={r.id} className="flex items-center gap-3 px-2 py-2">
                    <ContactAvatar contact={c} size={38} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-[#12161C]">{c.name}</p>
                      <p className="truncate text-[12px] tabular-nums text-[#555D6B]">
                        {formatMoney(r.amount, r.currency)}
                        {r.reason ? ` · ${r.reason}` : ""}
                      </p>
                    </div>
                    {r.status === "paid" ? (
                      <span className="rounded-full bg-[#E3F1EC] px-2.5 py-1 text-[12px] font-semibold text-[#0A6B53]">
                        Paid
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => dispatch({ type: "cancelRequest", id: r.id })}
                        className="rounded-full border border-[#E5E7EB] px-3 py-1.5 text-[12px] font-semibold text-[#12161C] active:scale-95"
                      >
                        Cancel
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* spending teaser */}
      <section className="mt-5 px-5" aria-label="Spending this month">
        <button
          type="button"
          onClick={() => setTab("budget")}
          className="w-full rounded-[24px] bg-white p-4 text-left shadow-[0_1px_2px_rgba(18,22,28,0.05)] active:scale-[0.99]"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[13px] font-medium text-[#555D6B]">Spent in September</p>
              <p className="mt-1 text-[24px] font-bold tabular-nums tracking-[-0.03em] text-[#12161C]">
                {hidden ? "₺••••" : formatMoney(spent, "TRY")}
              </p>
              <p className="mt-0.5 text-[12px] tabular-nums text-[#555D6B]">
                of {formatMoney(planned, "TRY", { decimals: false })} planned
              </p>
            </div>
            <div className="flex h-[58px] items-end gap-[5px]" aria-hidden>
              {week.map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-[9px] rounded-full ${b.current ? "bg-[#0A7A5E]" : "bg-[#D9DCE2]"}`}
                    style={{ height: Math.max(4, (b.value / weekMax) * 40) }}
                  />
                  <span className="text-[9px] font-semibold text-[#727986]">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex h-2 w-full gap-[3px] overflow-hidden rounded-full" aria-hidden>
            {lines.map((l) => (
              <div
                key={l.category}
                style={{ flexGrow: l.spent, background: CATEGORY_META[l.category].bar }}
                className="h-full first:rounded-l-full"
              />
            ))}
            <div style={{ flexGrow: Math.max(0, planned - spent) }} className="h-full rounded-r-full bg-[#ECEEF1]" />
          </div>
          <span className="mt-3 flex items-center gap-1 text-[13px] font-semibold text-[#0A7A5E]">
            See budget <ChevronRight size={15} strokeWidth={ICON} />
          </span>
        </button>
      </section>

      {/* recent */}
      <section className="mt-6 px-5" aria-label="Recent activity">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[17px] font-bold tracking-[-0.02em] text-[#12161C]">Recent</h2>
          <button
            type="button"
            onClick={() => setTab("activity")}
            className="text-[14px] font-semibold text-[#0A7A5E]"
          >
            See all
          </button>
        </div>
        <div className="rounded-[24px] bg-white p-1.5 shadow-[0_1px_2px_rgba(18,22,28,0.05)]">
          <LayoutGroup id="recent">
            <AnimatePresence initial={false}>
              {recent.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={spring}
                >
                  <TxnRow txn={t} hidden={hidden} onClick={() => openSheet({ kind: "txn", txnId: t.id })} />
                </motion.div>
              ))}
            </AnimatePresence>
          </LayoutGroup>
          {recent.length === 0 && (
            <p className="px-3 py-6 text-center text-[14px] text-[#555D6B]">
              No {CURRENCY_META[currency].name.toLowerCase()} activity yet. Top up to get started.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
