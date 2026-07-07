"use client";

import { useState } from "react";
import {
  Inbox,
  CircleUser,
  Columns3,
  Map,
  Orbit,
  FileText,
  ChevronsUpDown,
  Plus,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { NAV, PROJECTS, PEOPLE } from "./data";
import { Avatar, MONO } from "./atoms";

const ICONS: Record<string, LucideIcon> = {
  inbox: Inbox,
  "circle-user": CircleUser,
  columns: Columns3,
  map: Map,
  orbit: Orbit,
  "file-text": FileText,
};

export function Sidebar() {
  const [active, setActive] = useState("board");

  return (
    <nav
      aria-label="Primary"
      className="flex h-full w-full flex-col border-r border-[#1c1c20] bg-[#0c0c0e]"
    >
      {/* workspace switcher */}
      <button
        type="button"
        className="group flex items-center gap-2.5 border-b border-[#1c1c20] px-3.5 py-3 text-left transition-colors hover:bg-[#131316]"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-gradient-to-br from-[#6366f1] to-[#4f46e5] text-[13px] font-bold text-white shadow-[0_1px_0_rgba(255,255,255,0.15)_inset]">
          H
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-[13px] font-semibold text-[#ededea]">
            Horizon
          </span>
          <span className={`block text-[10px] tracking-wide text-[#6b6b64] ${MONO}`}>
            nebula-labs
          </span>
        </span>
        <ChevronsUpDown size={14} className="shrink-0 text-[#56564f]" />
      </button>

      {/* nav */}
      <ul className="flex flex-col gap-0.5 px-2 py-3">
        {NAV.map((item) => {
          const Icon = ICONS[item.icon];
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setActive(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={
                  "group relative flex w-full items-center gap-2.5 rounded-[6px] px-2.5 py-[7px] text-left outline-none transition-colors focus-visible:ring-1 focus-visible:ring-[#6366f1] " +
                  (isActive
                    ? "bg-[#17171c] text-[#f4f4ef]"
                    : "text-[#8a8a82] hover:bg-[#131316] hover:text-[#cbcbc2]")
                }
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-[#6366f1]" />
                )}
                <Icon
                  size={15}
                  strokeWidth={1.9}
                  className={isActive ? "text-[#a5a6ff]" : "text-current"}
                />
                <span className="flex-1 text-[13px] font-medium">{item.label}</span>
                {item.count ? (
                  <span
                    className={`rounded-full bg-[#6366f1] px-1.5 py-[1px] text-[10px] font-semibold text-white ${MONO}`}
                  >
                    {item.count}
                  </span>
                ) : (
                  <span
                    className={`text-[10px] text-[#3f3f44] opacity-0 transition-opacity group-hover:opacity-100 ${MONO}`}
                  >
                    {item.shortcut}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* projects */}
      <div className="mt-1 flex items-center justify-between px-3.5 pb-1.5 pt-2">
        <span className={`text-[10px] uppercase tracking-[0.16em] text-[#5a5a53] ${MONO}`}>
          Projects
        </span>
        <Plus size={13} className="text-[#4a4a45] transition-colors hover:text-[#8a8a82]" />
      </div>
      <ul className="flex flex-col gap-0.5 px-2">
        {PROJECTS.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              className="group flex w-full items-center gap-2.5 rounded-[6px] px-2.5 py-[6px] text-left text-[#8a8a82] transition-colors hover:bg-[#131316] hover:text-[#cbcbc2]"
            >
              <span
                className="h-[9px] w-[9px] shrink-0 rounded-[3px]"
                style={{ backgroundColor: p.color }}
              />
              <span className="flex-1 truncate text-[12.5px]">{p.name}</span>
              <span className={`text-[10px] text-[#4a4a45] ${MONO}`}>{p.count}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* user footer */}
      <div className="mt-auto flex items-center gap-2.5 border-t border-[#1c1c20] px-3 py-2.5">
        <span className="relative shrink-0">
          <Avatar person={PEOPLE.maya} size={26} />
          <span className="absolute -bottom-0 -right-0 h-[9px] w-[9px] rounded-full border-2 border-[#0c0c0e] bg-[#34d399]" />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-[12.5px] font-medium text-[#dededa]">
            Maya Rodriguez
          </span>
          <span className="block truncate text-[10.5px] text-[#6b6b64]">
            Staff Engineer
          </span>
        </span>
        <Settings
          size={15}
          className="shrink-0 text-[#4a4a45] transition-colors hover:text-[#8a8a82]"
        />
      </div>
    </nav>
  );
}
