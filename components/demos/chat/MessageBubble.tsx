"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, CheckCheck, Clock3, Flame, Heart, ImageOff, Laugh, Pause, Play, ThumbsUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AVATAR_TINTS, formatSeconds, type DeliveryStatus, type Message, type ReactionKey } from "./data";
import { ICON, SPRING } from "./ui";

export const REACTIONS: { key: ReactionKey; icon: LucideIcon; label: string; color: string }[] = [
  { key: "heart", icon: Heart, label: "Love", color: "#D6334A" },
  { key: "up", icon: ThumbsUp, label: "Like", color: "#2F62E6" },
  { key: "laugh", icon: Laugh, label: "Haha", color: "#B7791F" },
  { key: "flame", icon: Flame, label: "Fire", color: "#D9561E" },
  { key: "check", icon: Check, label: "Agree", color: "#16A06F" },
];

const reactionMeta = (k: ReactionKey) => REACTIONS.find((r) => r.key === k) ?? REACTIONS[0];

export function MessageBubble({
  message,
  first,
  author,
  textClass,
  status,
  pickerOpen,
  onOpenPicker,
  onReact,
}: {
  message: Message;
  first: boolean;
  author?: { name: string; tint: number };
  textClass: string;
  status?: DeliveryStatus;
  pickerOpen: boolean;
  onOpenPicker: () => void;
  onReact: (key: ReactionKey) => void;
}) {
  const mine = message.from === "me";
  const gesture = useBubbleGestures({ onLongPress: onOpenPicker, onDoubleTap: () => onReact("heart") });
  const reactions = [message.reactions?.theirs, message.reactions?.mine].filter(Boolean) as ReactionKey[];

  const shape = mine
    ? cn("rounded-[20px]", !first && "rounded-tr-[6px]", "rounded-br-[6px]")
    : cn("rounded-[20px]", !first && "rounded-tl-[6px]", "rounded-bl-[6px]");

  const surface = mine
    ? "bg-(--accent) text-white shadow-[0_6px_16px_-10px_rgba(47,98,230,0.7)]"
    : "bg-(--surface) text-(--ink) shadow-[0_1px_1.5px_rgba(28,44,82,0.06),0_6px_16px_-10px_rgba(28,44,82,0.22)]";

  const meta = (
    <Meta time={message.time} mine={mine} status={status} onImage={message.kind === "image" && !message.text} />
  );

  return (
    <div className={cn("relative flex", mine ? "justify-end" : "justify-start", pickerOpen && "z-40")}>
      <div className={cn("relative max-w-[78%]", reactions.length > 0 && "mb-3.5")}>
        {author && first && (
          <p className="mb-1 ml-3 text-[12.5px] font-semibold" style={{ color: AVATAR_TINTS[author.tint % 6].fg }}>
            {author.name}
          </p>
        )}

        <AnimatePresence>
          {pickerOpen && (
            <motion.div
              role="menu"
              aria-label="React to message"
              initial={{ opacity: 0, scale: 0.7, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 4 }}
              transition={SPRING}
              className={cn(
                "absolute bottom-full z-10 mb-2 flex gap-0.5 rounded-full bg-(--surface) p-1.5 shadow-[0_12px_32px_-10px_rgba(16,20,31,0.35)] ring-1 ring-(--line)",
                mine ? "right-0 origin-bottom-right" : "left-0 origin-bottom-left",
              )}
            >
              {REACTIONS.map((r, i) => {
                const on = message.reactions?.mine === r.key;
                return (
                  <motion.button
                    key={r.key}
                    type="button"
                    role="menuitemradio"
                    aria-label={r.label}
                    aria-checked={on}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...SPRING, delay: i * 0.03 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => onReact(r.key)}
                    className={cn(
                      "grid size-10 place-items-center rounded-full transition-colors",
                      on ? "bg-(--accent-soft)" : "hover:bg-(--sunk)",
                    )}
                    style={{ color: r.color }}
                  >
                    <r.icon className="size-[20px]" {...ICON} fill={r.key === "heart" ? "currentColor" : "none"} />
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          {...gesture}
          animate={{ scale: pickerOpen ? 1.03 : 1 }}
          transition={SPRING}
          className={cn(
            shape,
            surface,
            textClass,
            "relative select-none leading-[1.38] [-webkit-touch-callout:none]",
            message.kind === "image" ? "overflow-hidden p-1" : message.kind === "voice" ? "px-2.5 py-2" : "px-3.5 py-2",
          )}
        >
          {message.kind === "text" && (
            <p className="flow-root whitespace-pre-wrap break-words">
              {message.text}
              {meta}
            </p>
          )}
          {message.kind === "image" && (
            <>
              <Photo image={message.image} />
              {message.text ? (
                <p className="flow-root px-2.5 pb-1.5 pt-2">
                  {message.text}
                  {meta}
                </p>
              ) : (
                meta
              )}
            </>
          )}
          {message.kind === "voice" && (
            <div className="flex items-end gap-2">
              <Voice seconds={message.voice.seconds} wave={message.voice.wave} mine={mine} />
              <span className="-mb-0.5">{meta}</span>
            </div>
          )}
        </motion.div>

        {reactions.length > 0 && (
          <motion.button
            type="button"
            onClick={onOpenPicker}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={SPRING}
            aria-label={`Reactions: ${reactions.map((k) => reactionMeta(k).label).join(", ")}`}
            className={cn(
              "absolute -bottom-3.5 flex h-[26px] items-center gap-0.5 rounded-full bg-(--surface) px-1.5 shadow-[0_3px_10px_-4px_rgba(16,20,31,0.3)] ring-1 ring-(--line)",
              mine ? "right-2" : "left-2",
            )}
          >
            {reactions.map((k, i) => {
              const r = reactionMeta(k);
              return (
                <r.icon
                  key={`${k}-${i}`}
                  className="size-[14px]"
                  style={{ color: r.color }}
                  {...ICON}
                  fill={k === "heart" ? "currentColor" : "none"}
                />
              );
            })}
            {reactions.length > 1 && <span className="pl-0.5 text-[11px] font-semibold tabular-nums text-(--ink-2)">2</span>}
          </motion.button>
        )}
      </div>
    </div>
  );
}

function Meta({
  time,
  mine,
  status,
  onImage,
}: {
  time: string;
  mine: boolean;
  status?: DeliveryStatus;
  onImage: boolean;
}) {
  const StatusIcon = status === "sending" ? Clock3 : status === "sent" ? Check : CheckCheck;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[3px] text-[11px] font-medium tabular-nums",
        onImage
          ? "absolute bottom-2.5 right-2.5 rounded-full bg-[rgba(16,20,31,0.55)] px-2 py-0.5 text-white backdrop-blur-md"
          : "float-right ml-2.5 mt-[6px] translate-y-[2px] leading-none",
        !onImage && (mine ? "text-white/80" : "text-(--ink-2)"),
      )}
    >
      {time}
      {mine && status && (
        <StatusIcon
          className={cn("size-[14px] transition-opacity", status === "read" ? "opacity-100" : "opacity-70")}
          {...ICON}
          aria-label={status}
        />
      )}
    </span>
  );
}

function Photo({ image }: { image: { seed: string; w: number; h: number; alt: string } }) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const w = 248;
  const ratio = Math.max(0.75, Math.min(1.34, image.w / image.h));
  return (
    <div
      className="relative overflow-hidden rounded-[16px] bg-(--sunk)"
      style={{ width: w, aspectRatio: ratio }}
    >
      {state === "loading" && <div className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,#E6EAF0,#F1F3F7,#E6EAF0)]" />}
      {state === "error" ? (
        <div className="absolute inset-0 grid place-items-center text-(--ink-2)">
          <span className="flex flex-col items-center gap-1.5 text-[12.5px]">
            <ImageOff className="size-5" {...ICON} />
            Photo unavailable offline
          </span>
        </div>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element -- remote demo photo, fixed box */
        <img
          src={`https://picsum.photos/seed/${image.seed}/${image.w}/${image.h}`}
          alt={image.alt}
          draggable={false}
          onLoad={() => setState("ready")}
          onError={() => setState("error")}
          className={cn("absolute inset-0 size-full object-cover transition-opacity duration-500", state === "ready" ? "opacity-100" : "opacity-0")}
        />
      )}
    </div>
  );
}

function Voice({ seconds, wave, mine }: { seconds: number; wave: number[]; mine: boolean }) {
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rate, setRate] = useState<1 | 1.5 | 2>(1);
  const frame = useRef<number | null>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    if (!playing) return;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = (now - prev) / 1000;
      prev = now;
      const next = progressRef.current + (dt * rate) / seconds;
      if (next >= 1) {
        progressRef.current = 0;
        setProgress(0);
        setPlaying(false);
        return;
      }
      progressRef.current = next;
      setProgress(next);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [playing, rate, seconds]);

  const stop = (e: React.PointerEvent) => e.stopPropagation();
  const shown = playing || progress > 0 ? seconds * (1 - progress) : seconds;

  return (
    <div className="flex items-center gap-2.5" onPointerDown={stop} onPointerUp={stop}>
      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        aria-label={playing ? "Pause voice message" : "Play voice message"}
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-full transition-transform active:scale-90",
          mine ? "bg-white text-(--accent)" : "bg-(--accent) text-white",
        )}
      >
        {playing ? <Pause className="size-4" fill="currentColor" {...ICON} /> : <Play className="ml-0.5 size-4" fill="currentColor" {...ICON} />}
      </button>
      <div className="flex flex-col gap-1">
        <div className="flex h-7 items-center gap-[2px]" aria-hidden="true">
          {wave.map((v, i) => {
            const played = i / wave.length < progress;
            return (
              <motion.span
                key={i}
                className={cn(
                  "w-[3px] rounded-full",
                  mine ? (played ? "bg-white" : "bg-white/45") : played ? "bg-(--accent)" : "bg-[#C5CCD8]",
                )}
                style={{ height: `${Math.round(v * 100)}%` }}
                animate={playing && !reduce && Math.abs(i / wave.length - progress) < 0.06 ? { scaleY: 1.25 } : { scaleY: 1 }}
                transition={{ duration: 0.15 }}
              />
            );
          })}
        </div>
        <div className={cn("flex items-center gap-2 text-[11.5px] font-medium tabular-nums", mine ? "text-white/85" : "text-(--ink-2)")}>
          <span>{formatSeconds(Math.ceil(shown))}</span>
          <button
            type="button"
            onClick={() => setRate((r) => (r === 1 ? 1.5 : r === 1.5 ? 2 : 1))}
            aria-label={`Playback speed ${rate}x`}
            className={cn("rounded-full px-1.5 leading-[16px]", mine ? "bg-white/20" : "bg-(--sunk) text-(--ink)")}
          >
            {rate}x
          </button>
        </div>
      </div>
    </div>
  );
}

/** long-press opens the reaction picker, double-tap toggles a heart */
function useBubbleGestures({ onLongPress, onDoubleTap }: { onLongPress: () => void; onDoubleTap: () => void }) {
  const timer = useRef<number | null>(null);
  const lastTap = useRef(0);
  const fired = useRef(false);
  const origin = useRef({ x: 0, y: 0 });

  const clear = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  };

  useEffect(() => clear, []);

  return {
    onPointerDown: (e: React.PointerEvent) => {
      fired.current = false;
      origin.current = { x: e.clientX, y: e.clientY };
      clear();
      timer.current = window.setTimeout(() => {
        fired.current = true;
        navigator.vibrate?.(8);
        onLongPress();
      }, 420);
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (Math.hypot(e.clientX - origin.current.x, e.clientY - origin.current.y) > 8) clear();
    },
    onPointerUp: () => {
      clear();
      if (fired.current) return;
      const now = Date.now();
      if (now - lastTap.current < 300) {
        lastTap.current = 0;
        onDoubleTap();
      } else {
        lastTap.current = now;
      }
    },
    onPointerCancel: clear,
    onPointerLeave: clear,
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault();
      onLongPress();
    },
  };
}
