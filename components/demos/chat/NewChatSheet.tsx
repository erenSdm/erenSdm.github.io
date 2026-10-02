"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";
import type { Conversation } from "./data";
import { FADE, ICON, PRESS, PUSH } from "./ui";

/** bottom sheet for starting a conversation; drag down to dismiss */
export function NewChatSheet({
  open,
  convs,
  onClose,
  onPick,
}: {
  open: boolean;
  convs: Conversation[];
  onClose: () => void;
  onPick: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const q = query.trim().toLocaleLowerCase("tr");

  const { people, groups } = useMemo(() => {
    const sorted = [...convs]
      .filter((c) => !q || c.title.toLocaleLowerCase("tr").includes(q))
      .sort((a, b) => a.title.localeCompare(b.title, "tr"));
    return { people: sorted.filter((c) => !c.group), groups: sorted.filter((c) => c.group) };
  }, [convs, q]);

  const close = () => {
    setQuery("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            key="scrim"
            type="button"
            aria-label="Close new message"
            className="absolute inset-0 z-40 cursor-default bg-[rgba(16,20,31,0.28)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={FADE}
            onClick={close}
          />
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label="New message"
            className="absolute inset-x-0 bottom-0 z-40 flex h-[88%] flex-col rounded-t-[28px] bg-(--paper) shadow-[0_-20px_50px_-20px_rgba(16,20,31,0.35)]"
            initial={reduce ? { opacity: 0 } : { y: "100%" }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: "100%" }}
            transition={reduce ? FADE : PUSH}
            drag={reduce ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) close();
            }}
          >
            <div className="flex justify-center pt-2.5">
              <span className="h-[5px] w-10 rounded-full bg-[#C9CFD8]" aria-hidden="true" />
            </div>
            <div className="flex items-center justify-between px-5 pt-3">
              <h2 className="text-[19px] font-bold tracking-[-0.025em]">New message</h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className={cn(PRESS, "grid size-8 place-items-center rounded-full bg-(--sunk) text-(--ink-2)")}
              >
                <X className="size-4" {...ICON} />
              </button>
            </div>
            <label className="mx-5 mt-4 flex h-11 items-center gap-2.5 rounded-2xl bg-(--surface) px-3.5 ring-1 ring-(--line) focus-within:ring-2 focus-within:ring-(--accent)">
              <Search className="size-[17px] text-(--ink-2)" {...ICON} />
              <span className="sr-only">Search people</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onPointerDownCapture={(e) => e.stopPropagation()}
                placeholder="To: name"
                className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-(--ink-2)"
              />
            </label>

            <div className="mt-3 min-h-0 flex-1 overflow-y-auto pb-6" onPointerDownCapture={(e) => e.stopPropagation()}>
              {people.length + groups.length === 0 && (
                <p className="px-8 pt-10 text-center text-[14px] text-(--ink-2)">
                  No one called &ldquo;{query.trim()}&rdquo; yet. Check the spelling or invite them with your link.
                </p>
              )}
              {people.length > 0 && <Label>People</Label>}
              {people.map((c) => (
                <PickRow key={c.id} conv={c} onPick={onPick} sub={c.online ? "online" : (c.lastSeen ?? "")} />
              ))}
              {groups.length > 0 && <Label>Groups</Label>}
              {groups.map((c) => (
                <PickRow key={c.id} conv={c} onPick={onPick} sub={`${(c.group?.members.length ?? 0) + 1} members`} group />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="px-5 pb-1 pt-3 text-[12.5px] font-semibold text-(--ink-2)">{children}</p>;
}

function PickRow({
  conv,
  sub,
  group,
  onPick,
}: {
  conv: Conversation;
  sub: string;
  group?: boolean;
  onPick: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onPick(conv.id)}
      className="flex w-full items-center gap-3 px-5 py-2 text-left transition-colors active:bg-(--sunk)"
    >
      <Avatar name={conv.title} tint={conv.tint} size={42} online={conv.online} members={conv.group?.members} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold tracking-[-0.015em]">{conv.title}</span>
        <span className={cn("flex items-center gap-1 text-[13px]", sub === "online" ? "text-(--accent)" : "text-(--ink-2)")}>
          {group && <Users className="size-3.5" {...ICON} />}
          {sub}
        </span>
      </span>
    </button>
  );
}
