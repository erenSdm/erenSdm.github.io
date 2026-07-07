"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Plus, MoreHorizontal } from "lucide-react";
import { COLUMNS, type Column } from "./data";
import { IssueCard } from "./IssueCard";
import { StatusGlyph, MONO } from "./atoms";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.06 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

function ColumnView({
  column,
  reduce,
  focusId,
}: {
  column: Column;
  reduce: boolean;
  focusId?: string;
}) {
  const pts = column.issues.reduce((s, i) => s + i.points, 0);
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      {/* column header */}
      <div className="mb-2 flex items-center gap-2 px-0.5">
        <StatusGlyph status={column.status} size={14} />
        <span className="text-[12.5px] font-semibold text-[#dededa]">{column.title}</span>
        <span
          className={`flex h-[17px] min-w-[17px] items-center justify-center rounded-[5px] bg-[#17171c] px-1 text-[10.5px] text-[#8a8a82] ${MONO}`}
        >
          {column.issues.length}
        </span>
        <span className={`ml-auto text-[10px] text-[#4a4a45] ${MONO}`}>{pts}p</span>
        <button
          type="button"
          className="text-[#4a4a45] transition-colors hover:text-[#8a8a82]"
          title="Add issue"
        >
          <Plus size={14} />
        </button>
        <button
          type="button"
          className="text-[#4a4a45] transition-colors hover:text-[#8a8a82]"
          title="Column options"
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* cards */}
      <motion.div
        variants={reduce ? undefined : container}
        className="flex flex-col gap-2 overflow-y-auto pr-0.5 [scrollbar-width:thin]"
      >
        {column.issues.map((issue) => (
          <motion.div key={issue.id} variants={reduce ? undefined : card}>
            <IssueCard issue={issue} focused={issue.id === focusId} />
          </motion.div>
        ))}
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-[7px] border border-dashed border-[#232329] px-2.5 py-1.5 text-[11.5px] text-[#5a5a53] transition-colors hover:border-[#33333c] hover:text-[#8a8a82]"
        >
          <Plus size={13} />
          Add issue
        </button>
      </motion.div>
    </div>
  );
}

export function Board({ focusId }: { focusId?: string }) {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.div
      initial={reduce ? false : "hidden"}
      animate="show"
      variants={reduce ? undefined : container}
      className="flex h-full min-h-0 flex-1 gap-3 overflow-x-auto px-4 py-4"
    >
      {COLUMNS.map((column) => (
        <ColumnView
          key={column.status}
          column={column}
          reduce={reduce}
          focusId={focusId}
        />
      ))}
    </motion.div>
  );
}
