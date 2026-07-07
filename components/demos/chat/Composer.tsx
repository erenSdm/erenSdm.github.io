"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Mic, ArrowUp } from "lucide-react";

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
      className="relative z-10 shrink-0 border-t border-white/[0.06] bg-[#0A0A0A]/85 px-3 pb-4 pt-3 backdrop-blur-xl"
    >
      <div className="flex items-end gap-2">
        <button
          type="button"
          aria-label="Add attachment"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#16161A] text-bone ring-1 ring-white/[0.05] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-paper active:scale-90"
        >
          <Plus className="h-5 w-5" strokeWidth={1.75} />
        </button>

        <label htmlFor="relay-composer" className="sr-only">
          Message {""}
        </label>
        <input
          id="relay-composer"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Message"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-full bg-[#16161A] px-4 py-2.5 text-[14.5px] text-paper caret-[#3E6FF0] ring-1 ring-white/[0.06] transition-shadow duration-300 placeholder:text-ash focus:outline-none focus:ring-white/[0.14]"
        />

        <div className="relative h-10 w-10 shrink-0">
          <AnimatePresence initial={false} mode="wait">
            {hasText ? (
              <motion.button
                key="send"
                type="submit"
                aria-label="Send message"
                initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 grid place-items-center rounded-full bg-[#3E6FF0] text-white shadow-[0_0_0_1px_rgba(62,111,240,0.45)] transition-transform active:scale-90"
              >
                <ArrowUp className="h-5 w-5" strokeWidth={2.25} />
              </motion.button>
            ) : (
              <motion.button
                key="mic"
                type="button"
                aria-label="Record voice message"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 grid place-items-center rounded-full bg-[#16161A] text-bone ring-1 ring-white/[0.05] transition-transform hover:text-paper active:scale-90"
              >
                <Mic className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </form>
  );
}
