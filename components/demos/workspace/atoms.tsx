"use client";

import {
  CircleDashed,
  CircleDot,
  CircleCheck,
  Eye,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import { avatar, type Person, type Priority, type Status } from "./data";

export const MONO = "font-[family-name:var(--font-hzn-mono)]";

/* ---------- Avatar ---------- */

export function Avatar({
  person,
  size = 22,
  ring = false,
}: {
  person: Person;
  size?: number;
  ring?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatar(person.id, 64)}
      alt={person.name}
      width={size}
      height={size}
      loading="lazy"
      title={`${person.name} · ${person.role}`}
      className={
        "shrink-0 rounded-full object-cover grayscale-[0.35] " +
        (ring ? "ring-2 ring-[#0d0d10]" : "")
      }
      style={{ width: size, height: size }}
    />
  );
}

/* ---------- Status glyph ---------- */

const STATUS_MAP: Record<Status, { Icon: LucideIcon; color: string }> = {
  backlog: { Icon: CircleDashed, color: "#6b6b64" },
  in_progress: { Icon: CircleDot, color: "#f5a623" },
  in_review: { Icon: Eye, color: "#6366f1" },
  done: { Icon: CircleCheck, color: "#34d399" },
};

export function StatusGlyph({ status, size = 14 }: { status: Status; size?: number }) {
  const { Icon, color } = STATUS_MAP[status];
  return <Icon size={size} strokeWidth={2} style={{ color }} className="shrink-0" />;
}

/* ---------- Priority bars ---------- */

const PRIORITY_LEVEL: Record<Priority, number> = {
  none: 0,
  low: 1,
  medium: 2,
  high: 3,
  urgent: -1,
};

export function PriorityIcon({ priority }: { priority: Priority }) {
  if (priority === "urgent") {
    return (
      <span
        title="Urgent"
        className="flex h-[15px] w-[15px] items-center justify-center rounded-[3px] bg-[#f5544620]"
      >
        <AlertTriangle size={11} strokeWidth={2.5} className="text-[#f87368]" />
      </span>
    );
  }
  if (priority === "none") {
    return (
      <span title="No priority" className="flex h-[15px] w-[15px] items-center justify-center">
        <span className="h-[2px] w-[9px] rounded-full bg-[#3a3a40]" />
      </span>
    );
  }
  const level = PRIORITY_LEVEL[priority];
  const heights = [4, 7, 10];
  return (
    <span
      title={`${priority[0].toUpperCase()}${priority.slice(1)} priority`}
      className="flex h-[15px] w-[15px] items-end justify-center gap-[2px]"
      aria-label={`${priority} priority`}
    >
      {heights.map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-[1px]"
          style={{
            height: h,
            backgroundColor: i < level ? "#8b8bff" : "#33333a",
          }}
        />
      ))}
    </span>
  );
}

/* ---------- Label pill ---------- */

export function LabelPill({ name, color }: { name: string; color: string }) {
  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-[4px] border border-[#26262c] bg-[#141418] px-1.5 py-[2px] text-[10px] leading-none tracking-wide text-[#b7b7b0] " +
        MONO
      }
    >
      <span
        className="h-[6px] w-[6px] shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      {name}
    </span>
  );
}
