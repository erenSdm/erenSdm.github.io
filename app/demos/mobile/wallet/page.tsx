import type { Metadata } from "next";
import { WalletScreen } from "@/components/demos/wallet/WalletScreen";

export const metadata: Metadata = {
  title: "MINT — Wallet",
  description: "A wallet you actually open. Cards, balances, and spending at a glance.",
};

export default function WalletDemoPage() {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#050607] p-0 sm:p-6">
      <div className="relative h-[100dvh] w-full max-w-[430px] overflow-hidden bg-[#0A0C0B] sm:h-[900px] sm:max-h-[92dvh] sm:rounded-[2.25rem] sm:border sm:border-white/10 sm:shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
        <WalletScreen />
      </div>
    </div>
  );
}
