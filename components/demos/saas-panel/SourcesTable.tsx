"use client";

import { useMemo, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SOURCES, fmtUSD, type Source } from "./data";

type SortKey = "sessions" | "conv" | "revenue" | "share";
type Dir = "asc" | "desc";

const COLS: { key: SortKey; label: string; align: "right" }[] = [
  { key: "sessions", label: "SESSIONS", align: "right" },
  { key: "conv", label: "CONV", align: "right" },
  { key: "revenue", label: "REVENUE", align: "right" },
];

export function SourcesTable() {
  const [sort, setSort] = useState<SortKey>("revenue");
  const [dir, setDir] = useState<Dir>("desc");

  const rows = useMemo(() => {
    const sorted = [...SOURCES].sort((a, b) => {
      const d = a[sort] - b[sort];
      return dir === "asc" ? d : -d;
    });
    return sorted;
  }, [sort, dir]);

  const maxShare = Math.max(...SOURCES.map((s) => s.share));

  function toggle(key: SortKey) {
    if (key === sort) {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSort(key);
      setDir("desc");
    }
  }

  const HeadBtn = ({ col }: { col: (typeof COLS)[number] }) => (
    <button
      type="button"
      onClick={() => toggle(col.key)}
      aria-sort={sort === col.key ? (dir === "asc" ? "ascending" : "descending") : "none"}
      className={cn(
        "flex w-full items-center justify-end gap-1 font-mono text-[10px] uppercase tracking-[0.14em] outline-none transition-colors focus-visible:text-paper",
        sort === col.key ? "text-acid" : "text-ash hover:text-bone"
      )}
    >
      {col.label}
      {sort === col.key &&
        (dir === "asc" ? (
          <ArrowUp size={11} strokeWidth={2} />
        ) : (
          <ArrowDown size={11} strokeWidth={2} />
        ))}
    </button>
  );

  return (
    <section className="flex flex-col border border-line bg-ink">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="label text-[9px] text-ash">TOP SOURCES</span>
          <span className="font-mono text-[9px] tracking-[0.14em] text-dim">
            LAST 30D · ATTRIBUTED
          </span>
        </div>
        <span className="font-mono text-[10px] text-dim tabular-nums">
          {SOURCES.length} OF 214
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse">
          <thead>
            <tr className="border-b border-line">
              <th className="px-4 py-2.5 text-left">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash">
                  SOURCE
                </span>
              </th>
              {COLS.map((col) => (
                <th key={col.key} className="px-4 py-2.5">
                  <HeadBtn col={col} />
                </th>
              ))}
              <th className="w-[26%] px-4 py-2.5 text-left">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash">
                  SHARE
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: Source, i) => (
              <tr
                key={r.host}
                className="group border-b border-line-soft transition-colors last:border-b-0 hover:bg-coal/50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[10px] text-dim tabular-nums">
                      {(i + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[12px] text-paper">
                      {r.host}
                    </span>
                    <span className="hidden border border-line px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-ash sm:inline-block">
                      {r.tag}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono text-[12px] text-bone tabular-nums">
                  {r.sessions.toLocaleString("en-US")}
                </td>
                <td className="px-4 py-3 text-right font-mono text-[12px] tabular-nums">
                  <span className={r.conv >= 4 ? "text-acid" : "text-bone"}>
                    {r.conv.toFixed(2)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-[12px] text-paper tabular-nums">
                  {fmtUSD(r.revenue)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="relative h-1.5 flex-1 bg-line-soft">
                      <span
                        className="absolute inset-y-0 left-0 bg-acid/70 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-acid"
                        style={{ width: `${(r.share / maxShare) * 100}%` }}
                      />
                    </span>
                    <span className="w-10 text-right font-mono text-[10px] text-ash tabular-nums">
                      {r.share.toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
