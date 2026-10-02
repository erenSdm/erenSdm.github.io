"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CALLS, CONVERSATIONS, nowTime, wave, type Conversation, type Message, type ReactionKey } from "./data";
import { advance, DEFAULT_PREFS, FADE, PUSH, TOKEN_STYLE, type Prefs } from "./ui";
import { Inbox } from "./Inbox";
import { ConversationView } from "./Conversation";
import { CallsScreen } from "./CallsScreen";
import { SettingsScreen } from "./SettingsScreen";
import { TabBar, type Tab } from "./TabBar";
import { CallOverlay, type CallTarget } from "./CallOverlay";
import { NewChatSheet } from "./NewChatSheet";

export type Outgoing =
  | { kind: "text"; text: string }
  | { kind: "image"; seed: string; alt: string }
  | { kind: "voice"; seconds: number };

/** conversation id -> who is typing (author id in groups, "" for 1:1) */
export type TypingMap = Record<string, string>;

export function RelayApp() {
  const reduce = useReducedMotion();
  const [convs, setConvs] = useState<Conversation[]>(CONVERSATIONS);
  const [openId, setOpenId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("chats");
  const [typing, setTyping] = useState<TypingMap>({});
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [call, setCall] = useState<CallTarget | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [missedSeen, setMissedSeen] = useState(false);

  const openRef = useRef<string | null>(null);
  const scriptIdx = useRef<Record<string, number>>({});
  const pendingReply = useRef<Set<string>>(new Set());
  const timers = useRef<number[]>([]);

  useEffect(() => {
    openRef.current = openId;
  }, [openId]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const patch = useCallback((id: string, fn: (c: Conversation) => Conversation) => {
    setConvs((prev) => prev.map((c) => (c.id === id ? fn(c) : c)));
  }, []);

  const markMine = useCallback(
    (id: string, status: "delivered" | "read") =>
      patch(id, (c) => ({
        ...c,
        messages: c.messages.map((m) => (m.from === "me" ? { ...m, status: advance(m.status, status) } : m)),
      })),
    [patch],
  );

  const open = useCallback(
    (id: string) => {
      setOpenId(id);
      patch(id, (c) => ({ ...c, unread: 0 }));
    },
    [patch],
  );

  const send = useCallback(
    (id: string, out: Outgoing) => {
      const base = {
        id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        from: "me" as const,
        day: "Today",
        time: nowTime(),
        status: "sent" as const,
      };
      const msg: Message =
        out.kind === "text"
          ? { ...base, kind: "text", text: out.text }
          : out.kind === "image"
            ? { ...base, kind: "image", image: { seed: out.seed, w: 600, h: 600, alt: out.alt } }
            : { ...base, kind: "voice", voice: { seconds: out.seconds, wave: wave(out.seconds + 5) } };

      patch(id, (c) => ({ ...c, messages: [...c.messages, msg], updatedAt: Date.now(), suggestions: [] }));

      later(650, () => markMine(id, "delivered"));
      later(1400, () => markMine(id, "read"));

      if (pendingReply.current.has(id)) return;
      pendingReply.current.add(id);

      // scripts are static, so the seed copy is the source of truth
      const source = CONVERSATIONS.find((c) => c.id === id);
      if (!source || source.script.length === 0) {
        pendingReply.current.delete(id);
        return;
      }
      const idx = scriptIdx.current[id] ?? 0;
      scriptIdx.current[id] = idx + 1;
      const reply = source.script[idx % source.script.length];
      const typingFor = Math.min(3400, 900 + reply.text.length * 28);

      later(1900, () => setTyping((t) => ({ ...t, [id]: reply.author ?? "" })));
      later(1900 + typingFor, () => {
        pendingReply.current.delete(id);
        setTyping((t) => {
          const next = { ...t };
          delete next[id];
          return next;
        });
        const incoming: Message = {
          id: `r-${Date.now()}`,
          from: "them",
          author: reply.author,
          kind: "text",
          text: reply.text,
          day: "Today",
          time: nowTime(),
        };
        patch(id, (c) => ({
          ...c,
          messages: [...c.messages, incoming],
          updatedAt: Date.now(),
          suggestions: reply.suggestions ?? [],
          unread: openRef.current === id ? 0 : c.unread + 1,
        }));
      });
    },
    [later, markMine, patch],
  );

  const react = useCallback(
    (id: string, messageId: string, key: ReactionKey) =>
      patch(id, (c) => ({
        ...c,
        messages: c.messages.map((m) =>
          m.id === messageId
            ? { ...m, reactions: { ...m.reactions, mine: m.reactions?.mine === key ? undefined : key } }
            : m,
        ),
      })),
    [patch],
  );

  const selectTab = useCallback((t: Tab) => {
    setTab(t);
    if (t === "calls") setMissedSeen(true);
  }, []);

  const unreadTotal = useMemo(
    () => convs.reduce((sum, c) => sum + (c.muted ? 0 : c.unread), 0),
    [convs],
  );
  const missed = missedSeen ? 0 : CALLS.filter((c) => c.direction === "missed").length;
  const active = convs.find((c) => c.id === openId) ?? null;
  const otherUnread = unreadTotal - (active && !active.muted ? active.unread : 0);

  return (
    <div
      style={TOKEN_STYLE}
      className="relative h-full w-full overflow-hidden bg-(--paper) text-(--ink) antialiased"
    >
      <motion.div
        className="absolute inset-0 flex flex-col"
        animate={reduce ? { opacity: active ? 0 : 1 } : { x: active ? "-26%" : "0%" }}
        transition={reduce ? FADE : PUSH}
        aria-hidden={active ? true : undefined}
        inert={active ? true : undefined}
      >
        <div className="relative min-h-0 flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              className="absolute inset-0"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              {tab === "chats" && (
                <Inbox
                  convs={convs}
                  typing={typing}
                  prefs={prefs}
                  onOpen={open}
                  onCompose={() => setComposeOpen(true)}
                />
              )}
              {tab === "calls" && <CallsScreen onCall={setCall} />}
              {tab === "settings" && <SettingsScreen prefs={prefs} onChange={setPrefs} />}
            </motion.div>
          </AnimatePresence>
        </div>
        <TabBar tab={tab} onSelect={selectTab} unread={unreadTotal} missed={missed} />
      </motion.div>

      {/* dim the inbox as the conversation pushes over it */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-(--ink)"
        initial={false}
        animate={{ opacity: active && !reduce ? 0.06 : 0 }}
        transition={FADE}
      />

      <AnimatePresence>
        {active && (
          <motion.div
            key="conversation"
            className="absolute inset-0 z-20 shadow-[-14px_0_36px_-16px_rgba(16,20,31,0.28)]"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: "0%" }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={reduce ? FADE : PUSH}
          >
            <ConversationView
              conv={active}
              typingAuthor={typing[active.id]}
              prefs={prefs}
              otherUnread={otherUnread}
              onBack={() => setOpenId(null)}
              onSend={(out) => send(active.id, out)}
              onReact={(mid, key) => react(active.id, mid, key)}
              onCall={setCall}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <NewChatSheet
        open={composeOpen}
        convs={convs}
        onClose={() => setComposeOpen(false)}
        onPick={(id) => {
          setComposeOpen(false);
          open(id);
        }}
      />

      <AnimatePresence>
        {call && <CallOverlay key="call" target={call} onEnd={() => setCall(null)} />}
      </AnimatePresence>
    </div>
  );
}
