"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, Lock, Phone, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { Composer } from "./Composer";
import { memberName, type Conversation, type Message, type ReactionKey } from "./data";
import { ICON, PRESS, SPRING, TEXT_SIZE_CLASS, visibleStatus, type Prefs } from "./ui";
import type { Outgoing } from "./RelayApp";
import type { CallTarget } from "./CallOverlay";

const STATUS_LABEL = { sending: "Sending", sent: "Sent", delivered: "Delivered", read: "Read" } as const;

export function ConversationView({
  conv,
  typingAuthor,
  prefs,
  otherUnread,
  onBack,
  onSend,
  onReact,
  onCall,
}: {
  conv: Conversation;
  /** undefined when nobody is typing */
  typingAuthor?: string;
  prefs: Prefs;
  otherUnread: number;
  onBack: () => void;
  onSend: (out: Outgoing) => void;
  onReact: (messageId: string, key: ReactionKey) => void;
  onCall: (target: CallTarget) => void;
}) {
  const reduce = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [picker, setPicker] = useState<string | null>(null);
  // messages present when the thread opens render without the pop-in
  const [seededIds] = useState(() => new Set(conv.messages.map((m) => m.id)));
  const isTyping = typingAuthor !== undefined;
  const typingName = conv.group ? memberName(conv, typingAuthor)?.split(" ")[0] : undefined;

  const subtitle = isTyping
    ? typingName
      ? `${typingName} is typing...`
      : "typing..."
    : conv.group
      ? conv.group.members.map((m) => m.name.split(" ")[0]).join(", ") + ", You"
      : conv.online
        ? "online"
        : (conv.lastSeen ?? "");

  // land on the newest message instantly, then follow new ones smoothly
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [conv.messages.length, isTyping, reduce]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (picker) setPicker(null);
      else onBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [picker, onBack]);

  const lastMineId = [...conv.messages].reverse().find((m) => m.from === "me")?.id;
  const lastMine = conv.messages.find((m) => m.id === lastMineId);
  const textClass = TEXT_SIZE_CLASS[prefs.textSize];
  const suggestions = prefs.quickReplies && !isTyping ? conv.suggestions : [];

  return (
    <div className="relative flex h-full flex-col bg-(--paper)">
      <header
        className="relative z-10 shrink-0 border-b border-(--line) bg-(--surface)/90 backdrop-blur-xl"
        style={{ paddingTop: "var(--safe-top)" }}
      >
        <div className="flex h-[56px] items-center gap-1 pl-1.5 pr-2.5">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to chats"
            className={cn(PRESS, "flex h-11 items-center rounded-full pl-0.5 pr-1.5 text-(--accent) active:bg-(--sunk)")}
          >
            <ChevronLeft className="size-[28px]" {...ICON} />
            {otherUnread > 0 && (
              <span className="-ml-1 grid h-[22px] min-w-[22px] place-items-center rounded-full bg-(--accent) px-1.5 text-[12px] font-bold tabular-nums text-white">
                {otherUnread}
              </span>
            )}
          </button>
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <Avatar name={conv.title} tint={conv.tint} size={38} online={conv.online} members={conv.group?.members} />
            <div className="min-w-0">
              <p className="truncate text-[16px] font-semibold leading-tight tracking-[-0.02em]">{conv.title}</p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={subtitle}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "truncate text-[12.5px] leading-tight",
                    isTyping || (conv.online && !conv.group) ? "font-medium text-(--accent)" : "text-(--ink-2)",
                  )}
                >
                  {subtitle}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
          <button
            type="button"
            aria-label={`Video call ${conv.title}`}
            onClick={() => onCall({ name: conv.title, tint: conv.tint, video: true, members: conv.group?.members })}
            className={cn(PRESS, "grid size-10 place-items-center rounded-full text-(--accent) active:bg-(--sunk)")}
          >
            <Video className="size-[22px]" {...ICON} />
          </button>
          <button
            type="button"
            aria-label={`Call ${conv.title}`}
            onClick={() => onCall({ name: conv.title, tint: conv.tint, video: false, members: conv.group?.members })}
            className={cn(PRESS, "grid size-10 place-items-center rounded-full text-(--accent) active:bg-(--sunk)")}
          >
            <Phone className="size-[20px]" {...ICON} />
          </button>
        </div>
      </header>

      <div
        ref={scrollRef}
        role="log"
        aria-label={`Conversation with ${conv.title}`}
        className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3 pt-2"
      >
        <p className="mx-auto mb-2 mt-1 flex w-fit items-center gap-1.5 rounded-full bg-(--surface) px-3 py-1.5 text-[11.5px] text-(--ink-2) ring-1 ring-(--line)">
          <Lock className="size-3" {...ICON} />
          Messages are end-to-end encrypted
        </p>

        {conv.messages.map((m, i) => {
            const prev = conv.messages[i - 1];
            const next = conv.messages[i + 1];
            const newDay = !prev || prev.day !== m.day;
            const first = newDay || !sameRun(prev, m);
            const last = !next || next.day !== m.day || !sameRun(m, next);
            const person = conv.group && m.from === "them" ? conv.group.members.find((p) => p.id === m.author) : undefined;
            return (
              <Fragment key={m.id}>
                {newDay && <DaySeparator label={m.day} />}
                <motion.div
                  layout="position"
                  initial={seededIds.has(m.id) ? false : reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={SPRING}
                  className={cn(
                    "relative flex items-end gap-2",
                    picker === m.id && "z-40",
                    m.from === "me" ? "origin-bottom-right" : "origin-bottom-left",
                    first ? "mt-2.5" : "mt-[3px]",
                  )}
                >
                  {conv.group && m.from === "them" && (
                    <span className="mb-0.5 w-7 shrink-0">
                      {last && person && <Avatar name={person.name} tint={person.tint} size={28} />}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <MessageBubble
                      message={m}
                      first={first}
                      author={person}
                      textClass={textClass}
                      status={m.status ? visibleStatus(m.status, prefs.readReceipts) : undefined}
                      pickerOpen={picker === m.id}
                      onOpenPicker={() => setPicker(m.id)}
                      onReact={(key) => {
                        onReact(m.id, key);
                        setPicker(null);
                      }}
                    />
                  </div>
                </motion.div>
                {m.id === lastMineId && lastMine?.status && i === conv.messages.length - 1 && (
                  <motion.p
                    key={lastMine.status}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mr-1 mt-1 text-right text-[11.5px] font-medium text-(--ink-2)"
                  >
                    {STATUS_LABEL[visibleStatus(lastMine.status, prefs.readReceipts)]}
                    {visibleStatus(lastMine.status, prefs.readReceipts) === "read" && ` ${lastMine.time}`}
                  </motion.p>
                )}
              </Fragment>
            );
          })}

        <AnimatePresence>
          {isTyping && (
            <TypingIndicator
              key="typing"
              className={cn("mt-2.5", conv.group && "pl-9")}
              label={`${typingName ?? conv.title} is typing`}
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {suggestions.length > 0 && (
          <motion.div
            key={suggestions.join("|")}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={SPRING}
            className="shrink-0"
          >
            <div className="flex gap-2 overflow-x-auto px-3 pb-2 [scrollbar-width:none]" aria-label="Suggested replies">
              {suggestions.map((s, i) => (
                <motion.button
                  key={s}
                  type="button"
                  initial={reduce ? false : { opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...SPRING, delay: i * 0.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSend({ kind: "text", text: s })}
                  className="shrink-0 rounded-full bg-(--surface) px-3.5 py-2 text-[13.5px] font-semibold text-(--accent) shadow-[0_1px_2px_rgba(28,44,82,0.06)] ring-1 ring-[#D3DDF6]"
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Composer
        onSend={onSend}
        enterToSend={prefs.enterToSend}
        placeholder={conv.group ? `Message ${conv.title}` : `Message ${conv.title.split(" ")[0]}`}
      />

      <AnimatePresence>
        {picker && (
          <motion.button
            type="button"
            aria-label="Close reactions"
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setPicker(null)}
            className="absolute inset-0 z-30 cursor-default bg-[rgba(16,20,31,0.12)] backdrop-blur-[3px]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function sameRun(a: Message, b: Message): boolean {
  return a.from === b.from && a.author === b.author;
}

function DaySeparator({ label }: { label: string }) {
  return (
    <div className="sticky top-1 z-[1] flex justify-center pb-1 pt-3" role="separator" aria-label={label}>
      <span className="rounded-full bg-(--surface)/90 px-3 py-1 text-[12px] font-semibold text-(--ink-2) shadow-[0_1px_2px_rgba(28,44,82,0.06)] ring-1 ring-(--line) backdrop-blur">
        {label}
      </span>
    </div>
  );
}
