"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Paperclip, Split } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CATEGORY_META, CONTACTS, contactById } from "./data";
import { formatMoney, longDate } from "./format";
import { useWallet } from "./store";
import { ContactAvatar, ICON, PrimaryButton, SheetHeader, TxnTile } from "./ui";

export function TxnSheet({ txnId, onClose }: { txnId: string; onClose: () => void }) {
  const { state, dispatch, toast } = useWallet();
  const txn = state.txns.find((t) => t.id === txnId);
  const [panel, setPanel] = useState<"none" | "split">("none");
  const [people, setPeople] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  if (!txn) return null;
  const meta = CATEGORY_META[txn.category];
  const incoming = txn.amount > 0;
  const card = txn.cardId ? state.cards.find((c) => c.id === txn.cardId) : undefined;
  const contact = txn.contactId ? contactById(txn.contactId) : undefined;
  const canSplit = !incoming && txn.category !== "transfers";
  const share = Math.abs(txn.amount) / (people.length + 1);

  const attach = () => {
    setUploading(true);
    timer.current = setTimeout(() => {
      const file = `${txn.merchant.toLocaleLowerCase("tr").replace(/[^a-z0-9ğüşöçı]+/g, "-")}-${txn.date.slice(5).replace("-", "")}.jpg`;
      dispatch({ type: "attachReceipt", txnId: txn.id, file });
      setUploading(false);
      toast("Receipt attached");
    }, 900);
  };

  const sendSplit = () => {
    dispatch({
      type: "request",
      contactIds: people,
      amount: Math.round(share * 100) / 100,
      currency: txn.currency,
      reason: txn.merchant,
    });
    toast(`${people.length} split ${people.length === 1 ? "request" : "requests"} sent`);
    setPeople([]);
    setPanel("none");
  };

  const rows: [string, string][] = [
    ["Category", meta.label],
    ["Date", `${longDate(txn.date)} · ${txn.time}`],
    ...(card ? ([["Card", `${card.name} •• ${card.number.slice(-4)}`]] as [string, string][]) : []),
    ...(contact ? ([["Handle", contact.handle]] as [string, string][]) : []),
    ...(txn.location ? ([[contact ? "Method" : "Where", txn.location]] as [string, string][]) : []),
    ...(txn.note ? ([["Note", txn.note]] as [string, string][]) : []),
    ["Status", txn.status],
    ["Reference", txn.reference],
  ];

  return (
    <>
      <SheetHeader title="Transaction" onClose={onClose} />
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-3 [scrollbar-width:none]">
        <div className="flex flex-col items-center gap-2 pb-5 pt-2 text-center">
          <TxnTile txn={txn} size={60} />
          <p className="mt-1 text-[16px] font-semibold text-[#12161C]">{txn.merchant}</p>
          <p
            className={`text-[38px] font-bold tabular-nums tracking-[-0.04em] ${
              incoming ? "text-[#0A7A5E]" : "text-[#12161C]"
            }`}
          >
            {formatMoney(txn.amount, txn.currency, { sign: incoming })}
          </p>
          <span
            className="rounded-full px-2.5 py-1 text-[12px] font-semibold"
            style={{ background: meta.bg, color: meta.fg }}
          >
            {meta.label}
          </span>
        </div>

        {(canSplit || !incoming) && (
          <div className="grid grid-cols-2 gap-2">
            {canSplit && (
              <button
                type="button"
                onClick={() => setPanel(panel === "split" ? "none" : "split")}
                aria-expanded={panel === "split"}
                className={`flex h-12 items-center justify-center gap-2 rounded-2xl text-[14px] font-semibold transition-colors active:scale-[0.98] ${
                  panel === "split" ? "bg-[#12161C] text-white" : "bg-[#F1F2F5] text-[#12161C]"
                }`}
              >
                <Split size={17} strokeWidth={ICON} /> Split bill
              </button>
            )}
            <button
              type="button"
              onClick={attach}
              disabled={!!txn.receipt || uploading}
              className={`flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#F1F2F5] text-[14px] font-semibold text-[#12161C] active:scale-[0.98] disabled:active:scale-100 ${
                canSplit ? "" : "col-span-2"
              }`}
            >
              {txn.receipt ? (
                <>
                  <Check size={17} strokeWidth={ICON} className="text-[#0A7A5E]" /> Receipt saved
                </>
              ) : (
                <>
                  <Paperclip size={17} strokeWidth={ICON} /> {uploading ? "Attaching" : "Add receipt"}
                </>
              )}
            </button>
          </div>
        )}

        <AnimatePresence initial={false}>
          {panel === "split" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-2xl border border-[#E5E7EB] p-3.5">
                <p className="text-[13px] font-semibold text-[#555D6B]">Split with</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {CONTACTS.slice(0, 5).map((c) => {
                    const on = people.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() =>
                          setPeople(on ? people.filter((p) => p !== c.id) : [...people, c.id])
                        }
                        className={`flex items-center gap-1.5 rounded-full border py-1 pl-1 pr-3 text-[13px] font-medium transition-colors ${
                          on
                            ? "border-[#0A7A5E] bg-[#E3F1EC] text-[#0A6B53]"
                            : "border-[#E5E7EB] text-[#12161C]"
                        }`}
                      >
                        <ContactAvatar contact={c} size={24} />
                        {c.name.split(" ")[0]}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-[14px] tabular-nums text-[#12161C]">
                  {people.length === 0
                    ? "Pick who shared this with you."
                    : `${formatMoney(share, txn.currency)} each · ${people.length + 1} people`}
                </p>
                <PrimaryButton className="mt-3 !h-12" disabled={people.length === 0} onClick={sendSplit}>
                  {people.length === 0
                    ? "Request shares"
                    : `Request from ${people.length} ${people.length === 1 ? "person" : "people"}`}
                </PrimaryButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <dl className="mt-4 divide-y divide-[#EEF0F3]">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-start justify-between gap-6 py-3">
              <dt className="text-[14px] text-[#555D6B]">{k}</dt>
              <dd className="text-right text-[14px] font-semibold text-[#12161C]">{v}</dd>
            </div>
          ))}
          {txn.receipt && (
            <div className="flex items-start justify-between gap-6 py-3">
              <dt className="text-[14px] text-[#555D6B]">Receipt</dt>
              <dd className="text-right text-[14px] font-semibold text-[#12161C]">{txn.receipt}</dd>
            </div>
          )}
        </dl>
      </div>
    </>
  );
}
