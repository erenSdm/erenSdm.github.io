"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { BellOff, Check, CheckCheck, Pin, Search, SquarePen, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";
import { memberName, previewOf, type Conversation, type Message } from "./data";
import { ICON, PRESS, SPRING, visibleStatus, type Prefs } from "./ui";
import type { TypingMap } from "./RelayApp";

type Filter = "all" | "unread" | "groups";

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.04 } },
};
const row: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 26 } },
};

export function Inbox({
  convs,
  typing,
  prefs,
  onOpen,
  onCompose,
}: {
  convs: Conversation[];
  typing: TypingMap;
  prefs: Prefs;
  onOpen: (id: string) => void;
  onCompose: () => void;
}) {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const q = query.trim().toLocaleLowerCase("tr");

  const results = useMemo(() => {
    const sorted = [...convs].sort((a, b) => b.updatedAt - a.updatedAt);
    return sorted
      .filter((c) => (filter === "unread" ? c.unread > 0 : filter === "groups" ? !!c.group : true))
      .map((c) => {
        if (!q) return { conv: c, hit: undefined as Message | undefined };
        const titleHit = c.title.toLocaleLowerCase("tr").includes(q);
        const hit = [...c.messages]
          .reverse()
          .find((m) => (m.kind === "text" || m.kind === "image") && (m.text ?? "").toLocaleLowerCase("tr").includes(q));
        if (!titleHit && !hit) return null;
        return { conv: c, hit: titleHit ? undefined : hit };
      })
      .filter((r): r is { conv: Conversation; hit: Message | undefined } => r !== null);
  }, [convs, filter, q]);

  const pinned = q ? [] : results.filter((r) => r.conv.pinned);
  const rest = q ? results : results.filter((r) => !r.conv.pinned);
  const unreadChats = convs.filter((c) => c.unread > 0).length;

  const chips: { id: Filter; label: string; count?: number }[] = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread", count: unreadChats || undefined },
    { id: "groups", label: "Groups" },
  ];

  return (
    <div className="flex h-full flex-col">
      <header className="shrink-0 px-5 pb-3" style={{ paddingTop: "calc(var(--safe-top) + 6px)" }}>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[12.5px] font-medium text-(--ink-2)">RELAY</p>
            <h1 className="text-[30px] font-bold leading-[1.1] tracking-[-0.035em]">Chats</h1>
          </div>
          <button
            type="button"
            onClick={onCompose}
            aria-label="New message"
            className={cn(
              PRESS,
              "mb-0.5 grid size-10 place-items-center rounded-full bg-(--accent) text-white shadow-[0_6px_16px_-6px_rgba(47,98,230,0.6)] active:bg-(--accent-press)",
            )}
          >
            <SquarePen className="size-[18px]" {...ICON} />
          </button>
        </div>

        <label className="mt-4 flex h-11 items-center gap-2.5 rounded-2xl bg-(--surface) px-3.5 shadow-[0_1px_2px_rgba(28,40,70,0.05)] ring-1 ring-(--line) focus-within:ring-2 focus-within:ring-(--accent)">
          <Search className="size-[17px] shrink-0 text-(--ink-2)" {...ICON} />
          <span className="sr-only">Search chats</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search names and messages"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-(--ink) outline-none placeholder:text-(--ink-2)"
            enterKeyHint="search"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="grid size-6 place-items-center rounded-full bg-(--sunk) text-(--ink-2)"
            >
              <X className="size-3.5" {...ICON} />
            </button>
          )}
        </label>

        <div className="mt-3 flex gap-2" role="tablist" aria-label="Filter chats">
          {chips.map((chip) => {
            const on = filter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setFilter(chip.id)}
                className={cn(
                  PRESS,
                  "relative flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[13.5px] font-semibold",
                  on ? "text-white" : "bg-(--surface) text-(--ink) ring-1 ring-(--line)",
                )}
              >
                {on && (
                  <motion.span
                    layoutId="inbox-chip"
                    className="absolute inset-0 rounded-full bg-(--ink)"
                    transition={reduce ? { duration: 0 } : SPRING}
                  />
                )}
                <span className="relative">{chip.label}</span>
                {chip.count !== undefined && (
                  <span
                    className={cn(
                      "relative rounded-full px-1.5 text-[11.5px] tabular-nums leading-[18px]",
                      on ? "bg-white/20 text-white" : "bg-(--accent-soft) text-(--accent)",
                    )}
                  >
                    {chip.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4">
        {results.length === 0 ? (
          <EmptyState query={query} filter={filter} onReset={() => { setQuery(""); setFilter("all"); }} />
        ) : (
          <motion.div variants={list} initial={reduce ? false : "hidden"} animate="show" key={`${filter}-${q ? "q" : ""}`}>
            {pinned.length > 0 && <SectionLabel>Pinned</SectionLabel>}
            <ul>
              {pinned.map((r) => (
                <Row key={r.conv.id} conv={r.conv} hit={r.hit} q={q} typing={typing} prefs={prefs} onOpen={onOpen} />
              ))}
            </ul>
            {pinned.length > 0 && rest.length > 0 && <SectionLabel>Recent</SectionLabel>}
            <ul>
              {rest.map((r) => (
                <Row key={r.conv.id} conv={r.conv} hit={r.hit} q={q} typing={typing} prefs={prefs} onOpen={onOpen} />
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.p variants={row} className="px-5 pb-1 pt-3 text-[12.5px] font-semibold text-(--ink-2)">
      {children}
    </motion.p>
  );
}

function Row({
  conv,
  hit,
  q,
  typing,
  prefs,
  onOpen,
}: {
  conv: Conversation;
  hit?: Message;
  q: string;
  typing: TypingMap;
  prefs: Prefs;
  onOpen: (id: string) => void;
}) {
  const last = hit ?? conv.messages[conv.messages.length - 1];
  const isTyping = conv.id in typing;
  const unread = conv.unread > 0;
  const fresh = conv.updatedAt > 1000; // touched during this session
  const stamp = fresh || hit ? last.time : conv.stamp;
  const author = last.from === "me" ? "You" : conv.group ? memberName(conv, last.author)?.split(" ")[0] : undefined;
  const status = last.from === "me" && last.status ? visibleStatus(last.status, prefs.readReceipts) : undefined;
  const preview = prefs.previews || !unread ? previewOf(last) : "New message";

  return (
    <motion.li variants={row} layout="position" transition={SPRING} className="group">
      <button
        type="button"
        onClick={() => onOpen(conv.id)}
        className="flex w-full items-center gap-3.5 px-5 py-2.5 text-left transition-colors active:bg-(--sunk)"
      >
        <Avatar name={conv.title} tint={conv.tint} online={conv.online} members={conv.group?.members} />
        <span className="min-w-0 flex-1 border-b border-(--line) pb-2.5 pt-0.5 group-last:border-transparent">
          <span className="flex items-baseline gap-2">
            <span className="min-w-0 flex-1 truncate text-[15.5px] font-semibold tracking-[-0.015em]">
              <Highlight text={conv.title} q={q} />
            </span>
            <span
              className={cn(
                "shrink-0 text-[12.5px] tabular-nums",
                unread && !conv.muted ? "font-semibold text-(--accent)" : "text-(--ink-2)",
              )}
            >
              {stamp}
            </span>
          </span>
          <span className="mt-0.5 flex items-center gap-2">
            <span className="flex min-w-0 flex-1 items-center gap-1 text-[14px] leading-[1.35] text-(--ink-2)">
              {isTyping ? (
                <span className="font-medium text-(--accent)">
                  {conv.group && typing[conv.id] ? `${memberName(conv, typing[conv.id])?.split(" ")[0]} is typing` : "typing"}
                  <span className="inline-block w-4 animate-pulse">...</span>
                </span>
              ) : (
                <>
                  {status &&
                    (status === "sent" ? (
                      <Check className="size-[15px] shrink-0" {...ICON} />
                    ) : (
                      <CheckCheck
                        className={cn("size-[15px] shrink-0", status === "read" && "text-(--accent)")}
                        {...ICON}
                      />
                    ))}
                  <span className={cn("truncate", unread && "text-(--ink)")}>
                    {author && <span className="font-medium text-(--ink)">{author}: </span>}
                    <Highlight text={preview} q={hit ? q : ""} />
                  </span>
                </>
              )}
            </span>
            {conv.muted && <BellOff className="size-3.5 shrink-0 text-(--ink-2)" {...ICON} aria-label="Muted" />}
            {conv.pinned && !unread && <Pin className="size-3.5 shrink-0 rotate-45 text-(--ink-2)" {...ICON} aria-label="Pinned" />}
            {unread && (
              <motion.span
                key={conv.unread}
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={SPRING}
                className={cn(
                  "grid h-5 min-w-5 shrink-0 place-items-center rounded-full px-1.5 text-[11.5px] font-bold tabular-nums text-white",
                  conv.muted ? "bg-[#8A93A3]" : "bg-(--accent)",
                )}
                aria-label={`${conv.unread} unread`}
              >
                {conv.unread}
              </motion.span>
            )}
          </span>
        </span>
      </button>
    </motion.li>
  );
}

function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const i = text.toLocaleLowerCase("tr").indexOf(q);
  if (i < 0) return <>{text}</>;
  // keep the match visible in a one-line preview
  const start = i > 24 ? i - 18 : 0;
  return (
    <>
      {start > 0 && "..."}
      {text.slice(start, i)}
      <mark className="rounded-[4px] bg-(--accent-soft) px-0.5 text-(--accent)">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

function EmptyState({ query, filter, onReset }: { query: string; filter: Filter; onReset: () => void }) {
  const title = query
    ? `Nothing matches "${query.trim()}"`
    : filter === "unread"
      ? "You're all caught up"
      : "No group chats yet";
  const body = query
    ? "Try a first name, or a word from a message."
    : filter === "unread"
      ? "New messages will show up here first."
      : "Start one from the compose button and add a few people.";
  return (
    <div className="flex flex-col items-center px-10 pt-16 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-(--surface) text-(--accent) ring-1 ring-(--line)">
        {query ? <Search className="size-6" {...ICON} /> : <CheckCheck className="size-6" {...ICON} />}
      </span>
      <p className="mt-4 text-[16px] font-semibold tracking-[-0.015em]">{title}</p>
      <p className="mt-1 text-[14px] leading-relaxed text-(--ink-2)">{body}</p>
      <button
        type="button"
        onClick={onReset}
        className={cn(PRESS, "mt-5 rounded-full bg-(--ink) px-4 py-2 text-[13.5px] font-semibold text-white")}
      >
        Show all chats
      </button>
    </div>
  );
}
