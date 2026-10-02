import type { Metadata, Viewport } from "next";
import { WalletScreen } from "@/components/demos/wallet/WalletScreen";
import { DeviceShell } from "@/components/demos/chat/DeviceShell";

export const metadata: Metadata = {
  title: "MINT — Wallet",
  description: "A wallet you actually open. Cards, balances, and spending at a glance.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MINT",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#07090A",
  colorScheme: "dark",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ embed?: string }>;
}) {
  const { embed } = await searchParams;
  return (
    <DeviceShell embed={embed === "1"} background="#07090A">
      <WalletScreen />
    </DeviceShell>
  );
}
