"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { CommandBar } from "./CommandBar";
import { KpiStrip } from "./KpiStrip";
import { PrimaryChart } from "./PrimaryChart";
import { LiveFeed } from "./LiveFeed";
import { SourcesTable } from "./SourcesTable";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export function HelmDashboard() {
  const reduce = useReducedMotion();
  const mv = reduce ? undefined : item;

  return (
    <div className="flex h-full min-h-[100dvh] w-full bg-ink text-paper">
      {/* sidebar */}
      <aside className="hidden w-[210px] shrink-0 md:block">
        <Sidebar />
      </aside>

      {/* main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* mobile wordmark strip */}
        <div className="flex items-center justify-between border-b border-line bg-ink px-3 py-2.5 md:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center bg-acid">
              <span className="h-2 w-2 bg-ink" />
            </span>
            <span className="font-display text-base tracking-tight">HELM</span>
          </div>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse bg-acid motion-reduce:animate-none" />
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ash">
              NOMINAL
            </span>
          </span>
        </div>

        <CommandBar />

        {/* deck */}
        <motion.main
          variants={reduce ? undefined : container}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="flex-1 overflow-y-auto"
        >
          <div className="mx-auto flex max-w-[1440px] flex-col gap-3 p-3 sm:p-4">
            {/* breadcrumb / title row */}
            <motion.div
              variants={mv}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
            >
              <div className="flex items-baseline gap-2">
                <h1 className="font-display text-2xl tracking-tight text-paper">
                  OVERVIEW
                </h1>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
                  / ORG-04 · ALL REGIONS
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash">
                UPDATED 2026-07-07 · 14:42 UTC
              </span>
            </motion.div>

            <motion.div variants={mv}>
              <KpiStrip />
            </motion.div>

            <motion.div
              variants={mv}
              className="grid gap-3 lg:grid-cols-12"
            >
              <div className="h-[320px] lg:col-span-8 lg:h-[360px]">
                <PrimaryChart />
              </div>
              <div className="h-[320px] lg:col-span-4 lg:h-[360px]">
                <LiveFeed />
              </div>
            </motion.div>

            <motion.div variants={mv}>
              <SourcesTable />
            </motion.div>

            <div className="flex items-center justify-between px-1 pb-1 pt-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-dim">
                HELM CONSOLE ® · TELEMETRY PIPELINE v4.2.11
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-dim">
                p50 41ms · p95 142ms · p99 318ms
              </span>
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
