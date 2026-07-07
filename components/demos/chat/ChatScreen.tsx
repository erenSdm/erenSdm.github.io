"use client";

import { useEffect, useRef, useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { Composer } from "./Composer";
import { CONTACT, SEED_MESSAGES, type Message } from "./data";

function formatNow(): string {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes();
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m.toString().padStart(2, "0")}`;
}

export function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view on mount and after sending.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  function handleSend(text: string) {
    setMessages((prev) => [
      ...prev,
      {
        id: `local-${prev.length}-${Date.now()}`,
        from: "me",
        kind: "text",
        text,
        time: formatNow(),
        read: false,
      },
    ]);
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-[#0A0A0A]">
      <ChatHeader contact={CONTACT} />

      <div
        ref={scrollRef}
        role="log"
        aria-label={`Conversation with ${CONTACT.name}`}
        aria-live="polite"
        className="relative flex-1 space-y-2.5 overflow-y-auto overscroll-contain px-3.5 py-4"
      >
        {/* date separator chip */}
        <div className="flex justify-center pb-1 pt-1">
          <span className="rounded-full bg-[#16161A] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ash ring-1 ring-white/[0.05]">
            Today
          </span>
        </div>

        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}

        <TypingIndicator name={CONTACT.name} />

        <div ref={bottomRef} className="h-1 w-full" aria-hidden="true" />
      </div>

      <Composer onSend={handleSend} />
    </div>
  );
}
