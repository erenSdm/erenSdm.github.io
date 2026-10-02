import type { Metadata, Viewport } from "next";
import { DeviceShell } from "@/components/demos/chat/DeviceShell";
import { RelayApp } from "@/components/demos/chat/RelayApp";
import { relaySans } from "@/components/demos/chat/fonts";

export const metadata: Metadata = {
  title: "RELAY — Messaging",
  description:
    "A light, working messenger: searchable inbox, live replies with typing and read receipts, reactions, voice notes, photos and calls.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RELAY",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F3F5F8",
  colorScheme: "light",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ embed?: string }>;
}) {
  const { embed } = await searchParams;
  return (
    <DeviceShell embed={embed === "1"} background="#F3F5F8" tone="light">
      <div className={`${relaySans.className} h-full`}>
        <RelayApp />
      </div>
    </DeviceShell>
  );
}
