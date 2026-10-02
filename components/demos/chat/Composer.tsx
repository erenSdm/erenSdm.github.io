"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Mic, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatSeconds, RECENT_PHOTOS } from "./data";
import { ICON, PRESS, SPRING } from "./ui";
import type { Outgoing } from "./RelayApp";

const MAX_HEIGHT = 124;

export function Composer({
  onSend,
  enterToSend,
  placeholder,
}: {
  onSend: (out: Outgoing) => void;
  enterToSend: boolean;
  placeholder: string;
}) {
  const reduce = useReducedMotion();
  const [text, setText] = useState("");
  const [tray, setTray] = useState(false);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const ref = useRef<HTMLTextAreaElement>(null);
  const hasText = text.trim().length > 0;

  // grow with content up to MAX_HEIGHT, then scroll inside
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(MAX_HEIGHT, el.scrollHeight)}px`;
  }, [text]);

  useEffect(() => {
    if (!recording) return;
    const started = Date.now();
    const id = window.setInterval(() => setElapsed((Date.now() - started) / 1000), 200);
    return () => window.clearInterval(id);
  }, [recording]);

  function submit() {
    const value = text.trim();
    if (!value) return;
    onSend({ kind: "text", text: value });
    setText("");
    ref.current?.focus();
  }

  function startRecording() {
    setTray(false);
    setElapsed(0);
    setRecording(true);
  }

  function finishRecording(send: boolean) {
    setRecording(false);
    if (send) onSend({ kind: "voice", seconds: Math.max(1, Math.round(elapsed)) });
  }

  return (
    <div className="shrink-0 bg-(--surface)/90 backdrop-blur-xl" style={{ paddingBottom: "var(--safe-bottom)" }}>
      <div className="flex items-end gap-2 border-t border-(--line) px-3 pt-2.5 pb-1">
        {recording ? (
          <>
            <button
              type="button"
              onClick={() => finishRecording(false)}
              aria-label="Discard recording"
              className={cn(PRESS, "grid size-10 shrink-0 place-items-center rounded-full text-(--danger) active:bg-(--sunk)")}
            >
              <Trash2 className="size-5" {...ICON} />
            </button>
            <div className="flex h-10 flex-1 items-center gap-3 rounded-[20px] bg-(--paper) px-4 ring-1 ring-(--line)" role="status">
              <motion.span
                className="size-2.5 rounded-full bg-(--danger)"
                animate={reduce ? undefined : { opacity: [1, 0.25, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
              />
              <span className="text-[14.5px] font-semibold tabular-nums">{formatSeconds(elapsed)}</span>
              <span className="flex h-5 flex-1 items-center justify-end gap-[3px] overflow-hidden" aria-hidden="true">
                {Array.from({ length: 18 }, (_, i) => (
                  <motion.span
                    key={i}
                    className="w-[3px] rounded-full bg-(--accent)"
                    initial={{ height: 4 }}
                    animate={reduce ? { height: 8 } : { height: [4, 6 + ((i * 7) % 13), 4] }}
                    transition={{ duration: 0.7 + (i % 4) * 0.15, repeat: Infinity, delay: i * 0.04 }}
                  />
                ))}
              </span>
              <span className="sr-only">Recording voice message</span>
            </div>
            <SendButton label="Send voice message" onClick={() => finishRecording(true)} />
          </>
        ) : (
          <>
            <motion.button
              type="button"
              onClick={() => setTray((t) => !t)}
              aria-label={tray ? "Close attachments" : "Attach a photo"}
              aria-expanded={tray}
              animate={{ rotate: tray ? 45 : 0 }}
              transition={SPRING}
              className="grid size-10 shrink-0 place-items-center rounded-full text-(--ink-2) transition-colors active:bg-(--sunk)"
            >
              <Plus className="size-[22px]" {...ICON} />
            </motion.button>
            <label className="flex min-h-10 flex-1 items-center rounded-[20px] bg-(--paper) px-4 py-[9px] ring-1 ring-(--line) focus-within:ring-2 focus-within:ring-(--accent)">
              <span className="sr-only">Message</span>
              <textarea
                ref={ref}
                rows={1}
                value={text}
                placeholder={placeholder}
                onFocus={() => setTray(false)}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (enterToSend && e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    submit();
                  }
                }}
                enterKeyHint={enterToSend ? "send" : "enter"}
                className="block max-h-[124px] w-full resize-none bg-transparent text-[15.5px] leading-[22px] text-(--ink) outline-none placeholder:text-(--ink-2)"
              />
            </label>
            <AnimatePresence mode="popLayout" initial={false}>
              {hasText ? (
                <motion.span key="send" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={SPRING}>
                  <SendButton label="Send message" onClick={submit} />
                </motion.span>
              ) : (
                <motion.button
                  key="mic"
                  type="button"
                  onClick={startRecording}
                  aria-label="Record voice message"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={SPRING}
                  className="grid size-10 shrink-0 place-items-center rounded-full text-(--ink-2) active:bg-(--sunk)"
                >
                  <Mic className="size-[21px]" {...ICON} />
                </motion.button>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      <AnimatePresence initial={false}>
        {tray && !recording && (
          <motion.div
            key="tray"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={reduce ? { duration: 0 } : SPRING}
            className="overflow-hidden"
          >
            <p className="px-4 pb-2 pt-2 text-[12.5px] font-semibold text-(--ink-2)">Recent photos</p>
            <div className="grid grid-cols-3 gap-1.5 px-3 pb-2">
              {RECENT_PHOTOS.map((p, i) => (
                <motion.button
                  key={p.seed}
                  type="button"
                  aria-label={`Send photo: ${p.alt}`}
                  initial={reduce ? false : { opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...SPRING, delay: i * 0.03 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    setTray(false);
                    onSend({ kind: "image", seed: p.seed, alt: p.alt });
                  }}
                  className="relative aspect-square overflow-hidden rounded-xl bg-(--sunk)"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- remote demo thumbnail */}
                  <img
                    src={`https://picsum.photos/seed/${p.seed}/240/240`}
                    alt=""
                    draggable={false}
                    className="size-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SendButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        PRESS,
        "grid size-10 shrink-0 place-items-center rounded-full bg-(--accent) text-white shadow-[0_6px_14px_-6px_rgba(47,98,230,0.7)] active:bg-(--accent-press)",
      )}
    >
      <ArrowUp className="size-5" {...ICON} />
    </button>
  );
}
