"use client";

import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Columns3,
  List,
  GanttChartSquare,
  Plus,
  ChevronRight,
} from "lucide-react";
import { ONLINE } from "./data";
import { Avatar, MONO } from "./atoms";

const VIEWS = [
  { id: "board", label: "Board", Icon: Columns3 },
  { id: "list", label: "List", Icon: List },
  { id: "timeline", label: "Timeline", Icon: GanttChartSquare },
] as const;

export function TopBar() {
  const [view, setView] = useState<string>("board");

  return (
    <header className="flex h-[52px] shrink-0 items-center gap-3 border-b border-[#1c1c20] bg-[#0d0d10] px-4">
      {/* breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5">
        <span className="text-[13px] text-[#8a8a82]">Nebula</span>
        <ChevronRight size={13} className="text-[#3f3f44]" />
        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[#f4f4ef]">
          <span className="h-[9px] w-[9px] rounded-[3px] bg-[#6366f1]" />
          Core Platform
        </span>
        <span
          className={`ml-1 rounded-[4px] border border-[#26262c] px-1.5 py-[1px] text-[10px] text-[#7a7a72] ${MONO}`}
        >
          Cycle 24
        </span>
      </nav>

      {/* search / command hint */}
      <button
        type="button"
        className="ml-2 hidden h-[30px] items-center gap-2 rounded-[7px] border border-[#232329] bg-[#141418] pl-2.5 pr-2 text-[12px] text-[#6b6b64] transition-colors hover:border-[#2f2f37] hover:text-[#8a8a82] lg:flex lg:w-[220px]"
      >
        <Search size={13} />
        <span className="flex-1 text-left">Search or jump to…</span>
        <kbd
          className={`rounded-[4px] border border-[#2c2c33] bg-[#1b1b20] px-1.5 py-[1px] text-[10px] text-[#8a8a82] ${MONO}`}
        >
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        {/* filter / sort chips */}
        <button
          type="button"
          className="flex h-[30px] items-center gap-1.5 rounded-[7px] border border-[#232329] bg-[#141418] px-2.5 text-[12px] text-[#a5a59d] transition-colors hover:border-[#2f2f37] hover:text-[#dededa]"
        >
          <SlidersHorizontal size={13} strokeWidth={1.9} />
          Filter
        </button>
        <button
          type="button"
          className="hidden h-[30px] items-center gap-1.5 rounded-[7px] border border-[#232329] bg-[#141418] px-2.5 text-[12px] text-[#a5a59d] transition-colors hover:border-[#2f2f37] hover:text-[#dededa] sm:flex"
        >
          <ArrowUpDown size={13} strokeWidth={1.9} />
          Priority
        </button>

        {/* view switcher */}
        <div className="flex items-center rounded-[7px] border border-[#232329] bg-[#141418] p-[2px]">
          {VIEWS.map(({ id, label, Icon }) => {
            const isActive = id === view;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                aria-pressed={isActive}
                title={label}
                className={
                  "flex h-[24px] items-center gap-1.5 rounded-[5px] px-2 text-[12px] transition-colors " +
                  (isActive
                    ? "bg-[#26262e] text-[#f4f4ef]"
                    : "text-[#6b6b64] hover:text-[#a5a59d]")
                }
              >
                <Icon size={13} strokeWidth={1.9} />
                <span className="hidden md:inline">{label}</span>
              </button>
            );
          })}
        </div>

        {/* presence stack */}
        <div className="ml-1 hidden items-center xl:flex">
          <div className="flex items-center -space-x-2">
            {ONLINE.slice(0, 4).map((p) => (
              <Avatar key={p.id} person={p} size={24} ring />
            ))}
          </div>
          <span
            className={`ml-1.5 flex h-[24px] items-center rounded-full bg-[#17171c] px-2 text-[10.5px] text-[#8a8a82] ${MONO}`}
          >
            +{ONLINE.length - 4}
          </span>
        </div>

        {/* new issue */}
        <button
          type="button"
          className="flex h-[30px] items-center gap-1.5 rounded-[7px] bg-[#6366f1] pl-2 pr-3 text-[12px] font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,0.12)_inset] transition-colors hover:bg-[#5457e5]"
        >
          <Plus size={15} strokeWidth={2.4} />
          New
        </button>
      </div>
    </header>
  );
}
