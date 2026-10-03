import type { Metadata, Viewport } from "next";
import { WalletApp } from "@/components/demos/wallet/WalletApp";
import { DeviceShell } from "@/components/demos/chat/DeviceShell";

export const metadata: Metadata = {
  title: "MINT — Wallet",
  description: "Send, split and budget in lira, euro and dollar from one light, fast wallet.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MINT",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F3F4F6",
  colorScheme: "light",
};

export default function Page() {
  return (
    <DeviceShell background="#F3F4F6" tone="light">
      <WalletApp />
    </DeviceShell>
  );
}
