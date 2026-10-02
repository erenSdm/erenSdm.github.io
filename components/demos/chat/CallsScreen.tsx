"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Link2, Phone, PhoneIncoming, PhoneMissed, PhoneOutgoing, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";
import { CALLS, type CallEntry } from "./data";
import { ICON, PRESS, SPRING } from "./ui";
import type { CallTarget } from "./CallOverlay";

const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.035 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 26 } },
};

export function CallsScreen({ onCall }: { onCall: (t: CallTarget) => void }) {
  const reduce = useReducedMotion();
  const [view, setView] = useState<"all" | "missed">("all");
  const [linkCopied, setLinkCopied] = useState(false);
  const calls = view === "all" ? CALLS : CALLS.filter((c) => c.direction === "missed");

  return (
    <div className="flex h-full flex-col">
      <header className="shrink-0 px-5 pb-3" style={{ paddingTop: "calc(var(--safe-top) + 6px)" }}>
        <p className="text-[12.5px] font-medium text-(--ink-2)">RELAY</p>
        <h1 className="text-[30px] font-bold leading-[1.1] tracking-[-0.035em]">Calls</h1>

        <div className="mt-4 grid grid-cols-2 rounded-[14px] bg-(--sunk) p-1" role="tablist" aria-label="Call history">
          {(["all", "missed"] as const).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={cn(
                "relative h-9 rounded-[10px] text-[14px] font-semibold transition-colors",
                view === v ? "text-(--ink)" : "text-(--ink-2)",
              )}
            >
              {view === v && (
                <motion.span
                  layoutId="calls-seg"
                  className="absolute inset-0 rounded-[10px] bg-(--surface) shadow-[0_1px_3px_rgba(28,44,82,0.12)]"
                  transition={reduce ? { duration: 0 } : SPRING}
                />
              )}
              <span className="relative">{v === "all" ? "All" : "Missed"}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4">
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText("https://relay.call/kx7-tb2q").catch(() => {});
            setLinkCopied(true);
          }}
          className="mx-5 mb-2 flex w-[calc(100%-40px)] items-center gap-3.5 rounded-2xl bg-(--surface) p-3 text-left ring-1 ring-(--line) transition-transform active:scale-[0.98]"
        >
          <span className="grid size-11 place-items-center rounded-full bg-(--accent-soft) text-(--accent)">
            <Link2 className="size-5" {...ICON} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold tracking-[-0.015em]">Create call link</span>
            <span className="block truncate text-[13px] text-(--ink-2)" aria-live="polite">
              {linkCopied ? "relay.call/kx7-tb2q copied to clipboard" : "Anyone with the link can join"}
            </span>
          </span>
        </button>

        <p className="px-5 pb-1 pt-3 text-[12.5px] font-semibold text-(--ink-2)">Recent</p>
        <motion.ul key={view} variants={list} initial={reduce ? false : "hidden"} animate="show">
          {calls.map((c) => (
            <CallRow key={c.id} call={c} onCall={onCall} />
          ))}
        </motion.ul>
      </div>
    </div>
  );
}

function CallRow({ call, onCall }: { call: CallEntry; onCall: (t: CallTarget) => void }) {
  const missed = call.direction === "missed";
  const DirIcon = missed ? PhoneMissed : call.direction === "in" ? PhoneIncoming : PhoneOutgoing;
  const kind = call.video ? "video" : "voice";
  const label = missed
    ? `Missed ${kind} call`
    : `${call.direction === "in" ? "Incoming" : "Outgoing"} ${kind}${call.duration ? `, ${call.duration}` : ""}`;

  return (
    <motion.li variants={item} className="group flex items-center gap-3.5 pl-5 pr-3">
      <Avatar name={call.name} tint={call.tint} size={46} />
      <div className="flex min-w-0 flex-1 items-center gap-2 border-b border-(--line) py-3 group-last:border-transparent">
        <div className="min-w-0 flex-1">
          <p className={cn("truncate text-[15.5px] font-semibold tracking-[-0.015em]", missed && "text-(--danger)")}>
            {call.name}
            {call.count && call.count > 1 && <span className="font-medium"> ({call.count})</span>}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[13.5px] text-(--ink-2)">
            <DirIcon className={cn("size-3.5 shrink-0", missed && "text-(--danger)")} {...ICON} />
            <span className="truncate">{label}</span>
          </p>
        </div>
        <span className="shrink-0 text-[12.5px] tabular-nums text-(--ink-2)">{call.when}</span>
        <button
          type="button"
          onClick={() => onCall({ name: call.name, tint: call.tint, video: call.video })}
          aria-label={`${call.video ? "Video call" : "Call"} ${call.name}`}
          className={cn(PRESS, "grid size-10 shrink-0 place-items-center rounded-full text-(--accent) active:bg-(--accent-soft)")}
        >
          {call.video ? <Video className="size-[21px]" {...ICON} /> : <Phone className="size-[19px]" {...ICON} />}
        </button>
      </div>
    </motion.li>
  );
}
