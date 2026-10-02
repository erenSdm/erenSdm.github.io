"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mic, MicOff, PhoneOff, Video, VideoOff, Volume2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";
import { formatSeconds, type Person } from "./data";
import { ICON, PUSH, SPRING } from "./ui";

export interface CallTarget {
  name: string;
  tint: number;
  video: boolean;
  members?: Person[];
}

export function CallOverlay({ target, onEnd }: { target: CallTarget; onEnd: () => void }) {
  const reduce = useReducedMotion();
  const [connectedAt, setConnectedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [camera, setCamera] = useState(target.video);

  useEffect(() => {
    const t = window.setTimeout(() => setConnectedAt(Date.now()), 2600);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (connectedAt === null) return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [connectedAt]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onEnd();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onEnd]);

  const status =
    connectedAt === null ? (target.video ? "Video calling..." : "Calling...") : formatSeconds(Math.max(0, (now - connectedAt) / 1000));

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Call with ${target.name}`}
      className="absolute inset-0 z-50 flex flex-col items-center bg-[linear-gradient(180deg,#E9EFFC_0%,#F3F5F8_55%)]"
      style={{ paddingTop: "calc(var(--safe-top) + 48px)", paddingBottom: "calc(var(--safe-bottom) + 28px)" }}
      initial={reduce ? { opacity: 0 } : { y: "100%" }}
      animate={reduce ? { opacity: 1 } : { y: "0%" }}
      exit={reduce ? { opacity: 0 } : { y: "100%" }}
      transition={PUSH}
    >
      <div className="relative grid place-items-center">
        {connectedAt === null &&
          !reduce &&
          [0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute size-[120px] rounded-full border border-(--accent)/40"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 2.1, opacity: 0 }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
            />
          ))}
        <Avatar name={target.name} tint={target.tint} size={120} members={target.members} />
      </div>

      <h2 className="mt-8 text-[28px] font-bold tracking-[-0.035em]">{target.name}</h2>
      <p className="mt-1 text-[15px] font-medium tabular-nums text-(--ink-2)" aria-live="polite">
        {status}
      </p>
      <p className="mt-3 rounded-full bg-(--surface) px-3 py-1 text-[12px] text-(--ink-2) ring-1 ring-(--line)">
        End-to-end encrypted
      </p>

      <div className="mt-auto grid w-full grid-cols-3 gap-y-6 px-10">
        <Control icon={muted ? MicOff : Mic} label={muted ? "Unmute" : "Mute"} on={muted} onClick={() => setMuted((m) => !m)} />
        <Control icon={camera ? Video : VideoOff} label={camera ? "Camera on" : "Camera off"} on={camera} onClick={() => setCamera((c) => !c)} />
        <Control icon={Volume2} label="Speaker" on={speaker} onClick={() => setSpeaker((s) => !s)} />
        <div className="col-span-3 flex justify-center">
          <motion.button
            type="button"
            onClick={onEnd}
            whileTap={{ scale: 0.92 }}
            transition={SPRING}
            aria-label="End call"
            className="grid size-[72px] place-items-center rounded-full bg-(--danger) text-white shadow-[0_12px_28px_-10px_rgba(214,59,50,0.8)]"
          >
            <PhoneOff className="size-7" {...ICON} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function Control({
  icon: Icon,
  label,
  on,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on} className="flex flex-col items-center gap-2">
      <span
        className={cn(
          "grid size-[60px] place-items-center rounded-full transition-colors duration-200 active:scale-95",
          on ? "bg-(--ink) text-white" : "bg-(--surface) text-(--ink) shadow-[0_4px_14px_-8px_rgba(28,44,82,0.35)] ring-1 ring-(--line)",
        )}
      >
        <Icon className="size-6" {...ICON} />
      </span>
      <span className="text-[12.5px] font-medium text-(--ink-2)">{label}</span>
    </button>
  );
}
