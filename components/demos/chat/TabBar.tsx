"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Phone, Settings, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON, SPRING } from "./ui";

export type Tab = "chats" | "calls" | "settings";

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "chats", label: "Chats", icon: MessageCircle },
  { id: "calls", label: "Calls", icon: Phone },
  { id: "settings", label: "Settings", icon: Settings },
];

export function TabBar({
  tab,
  onSelect,
  unread,
  missed,
}: {
  tab: Tab;
  onSelect: (t: Tab) => void;
  unread: number;
  missed: number;
}) {
  const reduce = useReducedMotion();
  return (
    <nav
      aria-label="Primary"
      className="relative z-10 shrink-0 border-t border-(--line) bg-(--surface)/90 backdrop-blur-xl"
      style={{ paddingBottom: "var(--safe-bottom)" }}
    >
      <ul className="grid grid-cols-3 px-3 pt-1.5">
        {TABS.map(({ id, label, icon: Icon }) => {
          const on = tab === id;
          const badge = id === "chats" ? unread : id === "calls" ? missed : 0;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onSelect(id)}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex w-full flex-col items-center gap-0.5 py-1 transition-colors active:opacity-70",
                  on ? "text-(--accent)" : "text-(--ink-2)",
                )}
              >
                <span className="relative grid h-8 w-14 place-items-center">
                  {on && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-full bg-(--accent-soft)"
                      transition={reduce ? { duration: 0 } : SPRING}
                    />
                  )}
                  <Icon className="relative size-[21px]" {...ICON} />
                  {badge > 0 && (
                    <span
                      className={cn(
                        "absolute -top-0.5 right-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[10.5px] font-bold tabular-nums text-white ring-2 ring-(--surface)",
                        id === "calls" ? "bg-(--danger)" : "bg-(--accent)",
                      )}
                    >
                      {badge}
                      <span className="sr-only">{id === "calls" ? " missed calls" : " unread messages"}</span>
                    </span>
                  )}
                </span>
                <span className={cn("text-[11px]", on ? "font-semibold" : "font-medium")}>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
