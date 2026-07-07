"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TRANSACTIONS, money, type Txn } from "./data";

function Row({ txn, index }: { txn: Txn; index: number }) {
  const reduce = useReducedMotion();
  const Icon = txn.icon;
  const income = txn.amount > 0;

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index, 6) * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="flex items-center gap-3 py-2.5"
    >
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
        style={{ backgroundColor: `${txn.tint}1f`, color: txn.tint }}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-medium tracking-tight text-white">
          {txn.merchant}
        </p>
        <p className="truncate text-[11.5px] text-white/40">
          {txn.category} · {txn.time}
        </p>
      </div>

      <span
        className={`font-mono text-[14px] font-semibold tabular-nums ${
          income ? "text-[#2FBF8C]" : "text-white/85"
        }`}
      >
        {income ? "+" : "-"}${money(txn.amount)}
      </span>
    </motion.li>
  );
}

export function TransactionList() {
  return (
    <section aria-label="Recent transactions" className="mt-6 px-5">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-[13px] font-semibold tracking-tight text-white">
          Recent activity
        </h2>
        <button
          type="button"
          className="text-[12px] font-medium text-[#2FBF8C] transition-opacity duration-200 hover:opacity-80"
        >
          See all
        </button>
      </div>

      <ul className="divide-y divide-white/[0.05]">
        {TRANSACTIONS.map((txn, i) => (
          <Row key={txn.id} txn={txn} index={i} />
        ))}
      </ul>
    </section>
  );
}
