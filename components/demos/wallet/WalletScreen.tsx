"use client";

import { BalanceHero } from "./BalanceHero";
import { BottomTabBar } from "./BottomTabBar";
import { CardCarousel } from "./CardCarousel";
import { QuickActions } from "./QuickActions";
import { SpendingBreakdown } from "./SpendingBreakdown";
import { TopBar } from "./TopBar";
import { TransactionList } from "./TransactionList";

/**
 * MINT — mobile finance / wallet home screen.
 * Designed at 390px width. App-shell layout: fixed top bar,
 * scrolling content, fixed bottom tab bar.
 */
export function WalletScreen() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#0A0C0B] text-white">
      {/* ambient emerald glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[320px]"
        style={{
          background:
            "radial-gradient(120% 100% at 50% -20%, rgba(47,191,140,0.13), rgba(47,191,140,0.035) 42%, transparent 70%)",
        }}
      />

      <TopBar />

      <main className="relative z-10 flex-1 overflow-y-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <BalanceHero />
        <CardCarousel />
        <QuickActions />
        <SpendingBreakdown />
        <TransactionList />
      </main>

      <BottomTabBar />
    </div>
  );
}
