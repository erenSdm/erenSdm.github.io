"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Mic, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { GLASS, PRESS } from "./glass";

export function Composer({ onSend }: { onSend: (text: string) => void }) {
  const [value, setValue] = useState("");
  const hasText = value.trim().length > 0;

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!hasText) return;
    onSend(value.trim());
    setValue("");
  }

  return (
    <form
      onSubmit={submit}
      className="absolute inset-x-0 bottom-0 z-20 px-3 pb-[calc(var(--safe-bottom)+6px)] pt-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/75 to-transparent" />
      <div className="relative flex items-end gap-2">
        <button
          type="button"
          aria-label="Add attachment"
          className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-full text-white/85", GLASS, PRESS)}
        >
          <Plus className="h-[22px] w-[22px]" strokeWidth={2} />
        </button>

        <div className={cn("flex min-h-11 min-w-0 flex-1 items-center rounded-[22px] pl-4 pr-1", GLASS)}>
          <label htmlFor="relay-composer" className="sr-only">
            Message
          </label>
          <input
            id="relay-composer"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="iMessage"
            autoComplete="off"
            enterKeyHint="send"
            className="min-w-0 flex-1 bg-transparent py-2.5 text-[17px] text-white caret-[#3E7BFA] placeholder:text-white/35 focus:outline-none"
          />
          <div className="relative h-9 w-9 shrink-0">
            <AnimatePresence initial={false} mode="popLayout">
              {hasText ? (
                <motion.button
                  key="send"
                  type="submit"
                  aria-label="Send message"
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.4 }}
                  transition={{ type: "spring", stiffness: 520, damping: 30 }}
                  className="absolute inset-0 grid place-items-center rounded-full bg-[#3E7BFA] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_14px_-4px_rgba(62,123,250,0.8)] active:scale-90"
                >
                  <ArrowUp className="h-[19px] w-[19px]" strokeWidth={2.6} />
                </motion.button>
              ) : (
                <motion.button
                  key="mic"
                  type="button"
                  aria-label="Record voice message"
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.4 }}
                  transition={{ type: "spring", stiffness: 520, damping: 30 }}
                  className="absolute inset-0 grid place-items-center rounded-full text-white/55 active:scale-90"
                >
                  <Mic className="h-[19px] w-[19px]" strokeWidth={2} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </form>
  );
}
