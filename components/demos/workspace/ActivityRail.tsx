"use client";

import {
  ArrowRightLeft,
  MessageSquare,
  GitMerge,
  UserPlus,
  Plus,
  Activity as ActivityIcon,
  type LucideIcon,
} from "lucide-react";
import { ACTIVITY, ONLINE, type Activity } from "./data";
import { Avatar, MONO } from "./atoms";

const KIND_ICON: Record<Activity["kind"], { Icon: LucideIcon; color: string }> = {
  move: { Icon: ArrowRightLeft, color: "#8b8bff" },
  comment: { Icon: MessageSquare, color: "#7a7a72" },
  create: { Icon: Plus, color: "#38bdf8" },
  done: { Icon: GitMerge, color: "#34d399" },
  assign: { Icon: UserPlus, color: "#f472b6" },
};

export function ActivityRail() {
  return (
    <aside className="flex h-full w-[276px] shrink-0 flex-col border-l border-[#1c1c20] bg-[#0b0b0d]">
      {/* header */}
      <div className="flex h-[52px] shrink-0 items-center gap-2 border-b border-[#1c1c20] px-4">
        <ActivityIcon size={14} className="text-[#8b8bff]" strokeWidth={1.9} />
        <span className="text-[13px] font-semibold text-[#e9e9e4]">Activity</span>
        <span className="relative ml-auto flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34d399] opacity-60 motion-reduce:hidden" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#34d399]" />
        </span>
        <span className={`text-[10px] uppercase tracking-[0.12em] text-[#5a5a53] ${MONO}`}>
          Live
        </span>
      </div>

      {/* online now */}
      <div className="border-b border-[#1c1c20] px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <span className={`text-[10px] uppercase tracking-[0.16em] text-[#5a5a53] ${MONO}`}>
            Online now
          </span>
          <span className={`text-[10px] text-[#4a4a45] ${MONO}`}>{ONLINE.length}</span>
        </div>
        <div className="flex items-center -space-x-2">
          {ONLINE.map((p) => (
            <span key={p.id} className="relative">
              <Avatar person={p} size={26} ring />
              <span className="absolute bottom-0 right-0 h-[7px] w-[7px] rounded-full border border-[#0b0b0d] bg-[#34d399]" />
            </span>
          ))}
        </div>
      </div>

      {/* feed */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 [scrollbar-width:thin]">
        <ol className="relative flex flex-col gap-3.5">
          {/* timeline rail */}
          <span className="absolute bottom-2 left-[10px] top-2 w-px bg-[#1c1c20]" />
          {ACTIVITY.map((a) => {
            const { Icon, color } = KIND_ICON[a.kind];
            return (
              <li key={a.id} className="relative flex gap-2.5">
                <span
                  className="relative z-10 mt-[1px] flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-full border border-[#26262c] bg-[#141418]"
                  style={{ color }}
                >
                  <Icon size={11} strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1 leading-snug">
                  <p className="text-[12px] text-[#a5a59d]">
                    <span className="font-medium text-[#dededa]">
                      {a.person.name.split(" ")[0]}
                    </span>{" "}
                    {a.action}{" "}
                    <span className={`text-[#8b8bff] ${MONO}`}>{a.target}</span>
                  </p>
                  <span className={`text-[10.5px] text-[#56564f] ${MONO}`}>{a.time} ago</span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* composer */}
      <div className="shrink-0 border-t border-[#1c1c20] p-3">
        <div className="flex items-center gap-2 rounded-[7px] border border-[#232329] bg-[#141418] px-2.5 py-2">
          <Avatar person={ONLINE[0]} size={20} />
          <span className="flex-1 text-[12px] text-[#56564f]">Leave a comment…</span>
          <kbd
            className={`rounded-[4px] border border-[#2c2c33] bg-[#1b1b20] px-1.5 py-[1px] text-[10px] text-[#8a8a82] ${MONO}`}
          >
            ⏎
          </kbd>
        </div>
      </div>
    </aside>
  );
}
