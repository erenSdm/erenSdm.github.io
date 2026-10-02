"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { Check, Copy, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AmountDisplay, AmountPad, pressKey } from "./AmountPad";
import {
  CONTACTS,
  CURRENCIES,
  CURRENCY_META,
  FUNDING_SOURCES,
  OWNER,
  contactById,
  type Contact,
  type Currency,
} from "./data";
import { formatInput, formatMoney, parseInput } from "./format";
import { nowTime, useWallet } from "./store";
import { ContactAvatar, ICON, PrimaryButton, SheetHeader, SuccessMark, spring } from "./ui";

/* ---------------- shared pieces ---------------- */

function Step({ id, dir, children }: { id: string; dir: number; children: ReactNode }) {
  const reduce = useReducedMotion();
  const dx = reduce ? 0 : 36 * dir;
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, x: dx }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -dx }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="flex min-h-0 flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}

function useStep<T extends string>(first: T) {
  const [step, setStepState] = useState<T>(first);
  const [dir, setDir] = useState(1);
  const go = (next: T, d = 1) => {
    setDir(d);
    setStepState(next);
  };
  return { step, dir, go };
}

function useTimer() {
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (t.current) clearTimeout(t.current);
  }, []);
  return (fn: () => void, ms: number) => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(fn, ms);
  };
}

function CurrencySwitch({ value, onChange }: { value: Currency; onChange: (c: Currency) => void }) {
  return (
    <LayoutGroup id="flow-currency">
      <div className="mx-auto flex rounded-full bg-[#F1F2F5] p-1" role="radiogroup" aria-label="Currency">
        {CURRENCIES.map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={value === c}
            onClick={() => onChange(c)}
            className={`relative h-8 rounded-full px-3.5 text-[13px] font-semibold transition-colors ${
              value === c ? "text-[#12161C]" : "text-[#555D6B]"
            }`}
          >
            {value === c && (
              <motion.span
                layoutId="flow-currency-pill"
                transition={spring}
                className="absolute inset-0 rounded-full bg-white shadow-[0_1px_2px_rgba(18,22,28,0.12)]"
              />
            )}
            <span className="relative">{c}</span>
          </button>
        ))}
      </div>
    </LayoutGroup>
  );
}

function NoteChips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value?: string;
  onChange: (v?: string) => void;
}) {
  return (
    <div className="flex justify-center gap-2 px-4">
      {options.map((o) => {
        const on = value === o;
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(on ? undefined : o)}
            className={`h-8 rounded-full border px-3 text-[13px] font-medium transition-colors ${
              on
                ? "border-[#0A7A5E] bg-[#E3F1EC] text-[#0A6B53]"
                : "border-[#E5E7EB] bg-white text-[#555D6B]"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function AmountStep({
  top,
  currency,
  onCurrency,
  raw,
  setRaw,
  helper,
  error,
  chips,
  cta,
  onContinue,
}: {
  top?: ReactNode;
  currency: Currency;
  onCurrency: (c: Currency) => void;
  raw: string;
  setRaw: (r: string) => void;
  helper: string;
  error: string | null;
  chips?: ReactNode;
  cta: string;
  onContinue: () => void;
}) {
  const amount = parseInput(raw);
  return (
    <>
      {top}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-5">
        <CurrencySwitch
          value={currency}
          onChange={(c) => {
            onCurrency(c);
          }}
        />
        <AmountDisplay raw={raw} currency={currency} error={error} />
        <p
          className={`min-h-[20px] text-center text-[13px] font-medium ${
            error ? "text-[#BE3A2C]" : "text-[#555D6B]"
          }`}
          role={error ? "alert" : undefined}
        >
          {error ?? helper}
        </p>
      </div>
      {chips}
      <div className="mt-3">
        <AmountPad onKey={(k) => setRaw(pressKey(raw, k))} />
      </div>
      <div className="px-4 pb-2 pt-3">
        <PrimaryButton disabled={amount <= 0 || !!error} onClick={onContinue}>
          {cta}
        </PrimaryButton>
      </div>
    </>
  );
}

function ContactPicker({ onPick }: { onPick: (c: Contact) => void }) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const needle = q.trim().toLocaleLowerCase("tr");
    return CONTACTS.filter(
      (c) =>
        !needle ||
        c.name.toLocaleLowerCase("tr").includes(needle) ||
        c.handle.toLocaleLowerCase("tr").includes(needle),
    );
  }, [q]);
  const recents = CONTACTS.slice(0, 4);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-4">
        <label className="flex h-11 items-center gap-2 rounded-2xl bg-[#F1F2F5] px-3.5 text-[#555D6B] focus-within:ring-2 focus-within:ring-[#0A7A5E]/40">
          <Search size={18} strokeWidth={ICON} aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Name or @handle"
            aria-label="Search contacts"
            className="h-full flex-1 bg-transparent text-[15px] text-[#12161C] outline-none placeholder:text-[#727986]"
          />
        </label>
      </div>
      {!q && (
        <div className="mt-4 px-4">
          <p className="mb-2.5 text-[13px] font-semibold text-[#555D6B]">Recent</p>
          <div className="flex gap-4">
            {recents.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onPick(c)}
                className="flex w-[62px] flex-col items-center gap-1.5 active:scale-95"
              >
                <ContactAvatar contact={c} size={52} />
                <span className="w-full truncate text-center text-[12px] font-medium text-[#12161C]">
                  {c.name.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      <p className="mb-1 mt-5 px-4 text-[13px] font-semibold text-[#555D6B]">
        {q ? `${list.length} ${list.length === 1 ? "match" : "matches"}` : "All contacts"}
      </p>
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2 [scrollbar-width:none]">
        {list.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onPick(c)}
            className="flex w-full items-center gap-3 rounded-2xl px-2 py-2.5 text-left active:bg-[#F0F1F4]"
          >
            <ContactAvatar contact={c} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[15px] font-semibold text-[#12161C]">{c.name}</span>
              <span className="block text-[13px] text-[#555D6B]">{c.handle}</span>
            </span>
          </button>
        ))}
        {list.length === 0 && (
          <p className="px-3 py-8 text-center text-[14px] text-[#555D6B]">
            No contact matches &ldquo;{q}&rdquo;. Check the spelling or search by @handle.
          </p>
        )}
      </div>
    </div>
  );
}

function ContactChip({ contact, label }: { contact: Contact; label: string }) {
  return (
    <div className="mx-4 flex items-center gap-3 rounded-2xl bg-[#F6F7F9] px-3 py-2.5">
      <ContactAvatar contact={contact} size={36} />
      <div className="min-w-0">
        <p className="text-[12px] text-[#555D6B]">{label}</p>
        <p className="truncate text-[15px] font-semibold text-[#12161C]">{contact.name}</p>
      </div>
    </div>
  );
}

function Done({
  title,
  lines,
  children,
  onClose,
}: {
  title: string;
  lines: string[];
  children?: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center px-6">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <SuccessMark />
        <h3 className="text-[26px] font-bold tracking-[-0.03em] text-[#12161C]">{title}</h3>
        <div className="space-y-1">
          {lines.map((l) => (
            <p key={l} className="text-[15px] text-[#555D6B] tabular-nums">
              {l}
            </p>
          ))}
        </div>
        {children}
      </div>
      <div className="w-full pb-2">
        <PrimaryButton tone="ink" onClick={onClose}>
          Done
        </PrimaryButton>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <span className="text-[15px] text-[#555D6B]">{label}</span>
      <span className="text-right text-[15px] font-semibold tabular-nums text-[#12161C]">{value}</span>
    </div>
  );
}

/* ---------------- send ---------------- */

export function SendFlow({ initialContactId, onClose }: { initialContactId?: string; onClose: () => void }) {
  const { state, dispatch, currency, setCurrency } = useWallet();
  const initial = initialContactId ? contactById(initialContactId) : undefined;
  const { step, dir, go } = useStep<"contact" | "amount" | "review" | "done">(
    initial ? "amount" : "contact",
  );
  const [contact, setContact] = useState<Contact | undefined>(initial);
  const [raw, setRaw] = useState("");
  const [note, setNote] = useState<string>();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<{ amount: number; currency: Currency } | null>(null);
  const later = useTimer();

  const balance = state.balances[currency];
  const amount = parseInput(raw);
  const error =
    amount > balance
      ? `That is more than your ${formatMoney(balance, currency)} balance.`
      : null;

  const confirm = () => {
    if (!contact || error || amount <= 0) return;
    setSending(true);
    later(() => {
      dispatch({ type: "send", contactId: contact.id, amount, currency, note, time: nowTime() });
      setSent({ amount, currency });
      setSending(false);
      go("done");
    }, 850);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {step === "contact" && (
        <Step key="contact" id="contact" dir={dir}>
          <SheetHeader title="Send money" onClose={onClose} />
          <ContactPicker
            onPick={(c) => {
              setContact(c);
              go("amount");
            }}
          />
        </Step>
      )}
      {step === "amount" && contact && (
        <Step key="amount" id="amount" dir={dir}>
          <SheetHeader title="Amount" onBack={() => go("contact", -1)} onClose={onClose} />
          <AmountStep
            top={<ContactChip contact={contact} label="Sending to" />}
            currency={currency}
            onCurrency={setCurrency}
            raw={raw}
            setRaw={setRaw}
            helper={`Balance ${formatMoney(balance, currency)}`}
            error={error}
            chips={
              <NoteChips options={["Dinner", "Rent share", "Taxi", "Gift"]} value={note} onChange={setNote} />
            }
            cta="Review"
            onContinue={() => go("review")}
          />
        </Step>
      )}
      {step === "review" && contact && (
        <Step key="review" id="review" dir={dir}>
          <SheetHeader title="Review" onBack={() => go("amount", -1)} onClose={onClose} />
          <div className="flex flex-1 flex-col px-5">
            <div className="flex flex-col items-center gap-3 pb-6 pt-4">
              <ContactAvatar contact={contact} size={64} />
              <p className="text-[15px] text-[#555D6B]">You are sending</p>
              <p className="text-[40px] font-bold tabular-nums tracking-[-0.04em] text-[#12161C]">
                {formatMoney(amount, currency)}
              </p>
            </div>
            <div className="divide-y divide-[#EEF0F3] border-y border-[#EEF0F3]">
              <ReviewRow label="To" value={`${contact.name} · ${contact.handle}`} />
              <ReviewRow label="From" value={`${CURRENCY_META[currency].name} balance`} />
              <ReviewRow label="Fee" value="Free" />
              <ReviewRow label="Arrives" value="Instantly" />
              {note && <ReviewRow label="Note" value={note} />}
            </div>
            <p className="mt-4 text-[13px] text-[#555D6B] tabular-nums">
              Balance after: {formatMoney(balance - amount, currency)}
            </p>
            <div className="mt-auto pb-2 pt-4">
              <PrimaryButton onClick={confirm} disabled={sending}>
                {sending ? (
                  <>
                    <Spinner /> Sending
                  </>
                ) : (
                  `Send ${formatMoney(amount, currency)}`
                )}
              </PrimaryButton>
            </div>
          </div>
        </Step>
      )}
      {step === "done" && contact && sent && (
        <Step key="done" id="done" dir={dir}>
          <div className="h-4" />
          <Done
            title="Sent"
            lines={[
              `${formatMoney(sent.amount, sent.currency)} to ${contact.name}`,
              `New balance ${formatMoney(state.balances[sent.currency], sent.currency)}`,
            ]}
            onClose={onClose}
          />
        </Step>
      )}
    </AnimatePresence>
  );
}

function Spinner() {
  return (
    <motion.span
      aria-hidden
      className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
    />
  );
}

/* ---------------- request ---------------- */

const REQUEST_CAP: Record<Currency, number> = { TRY: 25000, EUR: 1500, USD: 1500 };

export function RequestFlow({ initialContactId, onClose }: { initialContactId?: string; onClose: () => void }) {
  const { dispatch, currency, setCurrency, toast } = useWallet();
  const initial = initialContactId ? contactById(initialContactId) : undefined;
  const { step, dir, go } = useStep<"contact" | "amount" | "done">(initial ? "amount" : "contact");
  const [contact, setContact] = useState<Contact | undefined>(initial);
  const [raw, setRaw] = useState("");
  const [reason, setReason] = useState<string>();
  const [copied, setCopied] = useState(false);
  const [requested, setRequested] = useState<{ amount: number; currency: Currency } | null>(null);

  const amount = parseInput(raw);
  const cap = REQUEST_CAP[currency];
  const error = amount > cap ? `Requests are capped at ${formatMoney(cap, currency)}.` : null;
  const link = `mint.me/${OWNER.handle.slice(1)}/${formatInput(raw).replace(/[.,]/g, "")}`;

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(`https://${link}`);
    } catch {
      /* clipboard can be blocked inside iframes; the link stays visible */
    }
    setCopied(true);
    toast("Payment link copied");
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {step === "contact" && (
        <Step key="contact" id="contact" dir={dir}>
          <SheetHeader title="Request money" onClose={onClose} />
          <ContactPicker
            onPick={(c) => {
              setContact(c);
              go("amount");
            }}
          />
        </Step>
      )}
      {step === "amount" && contact && (
        <Step key="amount" id="amount" dir={dir}>
          <SheetHeader title="Request" onBack={() => go("contact", -1)} onClose={onClose} />
          <AmountStep
            top={<ContactChip contact={contact} label="Requesting from" />}
            currency={currency}
            onCurrency={setCurrency}
            raw={raw}
            setRaw={setRaw}
            helper="They get a notification and a payment link"
            error={error}
            chips={
              <NoteChips options={["Dinner", "Tickets", "Groceries", "Trip"]} value={reason} onChange={setReason} />
            }
            cta="Send request"
            onContinue={() => {
              dispatch({ type: "request", contactIds: [contact.id], amount, currency, reason });
              setRequested({ amount, currency });
              go("done");
            }}
          />
        </Step>
      )}
      {step === "done" && contact && requested && (
        <Step key="done" id="done" dir={dir}>
          <div className="h-4" />
          <Done
            title="Request sent"
            lines={[
              `${formatMoney(requested.amount, requested.currency)} from ${contact.name}`,
              "You will be notified when they pay",
            ]}
            onClose={onClose}
          >
            <button
              type="button"
              onClick={copy}
              className="mt-2 flex items-center gap-2 rounded-full border border-[#E5E7EB] px-4 py-2.5 text-[14px] font-medium text-[#12161C] active:scale-[0.98]"
            >
              {copied ? (
                <Check size={16} strokeWidth={ICON} className="text-[#0A7A5E]" />
              ) : (
                <Copy size={16} strokeWidth={ICON} />
              )}
              {link}
            </button>
          </Done>
        </Step>
      )}
    </AnimatePresence>
  );
}

/* ---------------- top up ---------------- */

const TOPUP_CAP: Record<Currency, number> = { TRY: 50000, EUR: 5000, USD: 5000 };

export function TopUpFlow({ onClose }: { onClose: () => void }) {
  const { state, dispatch, currency, setCurrency } = useWallet();
  const { step, dir, go } = useStep<"amount" | "done">("amount");
  const [sourceId, setSourceId] = useState(FUNDING_SOURCES[0].id);
  const [raw, setRaw] = useState("");
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState<{ amount: number; currency: Currency } | null>(null);
  const later = useTimer();

  const source = FUNDING_SOURCES.find((s) => s.id === sourceId) ?? FUNDING_SOURCES[0];
  const amount = parseInput(raw);
  const cap = TOPUP_CAP[currency];
  const error = amount > cap ? `Top-ups are capped at ${formatMoney(cap, currency)} at once.` : null;

  const confirm = () => {
    setBusy(true);
    later(() => {
      dispatch({ type: "topUp", source, amount, currency, time: nowTime() });
      setAdded({ amount, currency });
      setBusy(false);
      go("done");
    }, 700);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {step === "amount" && (
        <Step key="amount" id="amount" dir={dir}>
          <SheetHeader title="Top up" onClose={onClose} />
          <AmountStep
            top={
              <div className="flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]" role="radiogroup" aria-label="Pay from">
                {FUNDING_SOURCES.map((s) => {
                  const on = s.id === sourceId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setSourceId(s.id)}
                      className={`shrink-0 rounded-2xl border px-3.5 py-2.5 text-left transition-colors ${
                        on ? "border-[#0A7A5E] bg-[#E3F1EC]" : "border-[#E5E7EB] bg-white"
                      }`}
                    >
                      <span className="block text-[14px] font-semibold text-[#12161C]">{s.label}</span>
                      <span className="block text-[12px] text-[#555D6B]">{s.detail}</span>
                    </button>
                  );
                })}
              </div>
            }
            currency={currency}
            onCurrency={setCurrency}
            raw={raw}
            setRaw={setRaw}
            helper={`Current balance ${formatMoney(state.balances[currency], currency)}`}
            error={error}
            cta={busy ? "Adding money" : `Top up${amount > 0 ? ` ${formatMoney(amount, currency)}` : ""}`}
            onContinue={confirm}
          />
        </Step>
      )}
      {step === "done" && added && (
        <Step key="done" id="done" dir={dir}>
          <div className="h-4" />
          <Done
            title="Money added"
            lines={[
              `${formatMoney(added.amount, added.currency)} from ${source.label}`,
              `New balance ${formatMoney(state.balances[added.currency], added.currency)}`,
            ]}
            onClose={onClose}
          />
        </Step>
      )}
    </AnimatePresence>
  );
}
