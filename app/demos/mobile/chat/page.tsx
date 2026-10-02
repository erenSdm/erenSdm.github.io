import type { Metadata, Viewport } from "next";
import { ChatScreen } from "@/components/demos/chat/ChatScreen";
import { DeviceShell } from "@/components/demos/chat/DeviceShell";

export const metadata: Metadata = {
  title: "RELAY — Messaging",
  description: "A mobile messaging conversation with presence, live typing, and read receipts.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RELAY",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0B0B0D",
  colorScheme: "dark",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ embed?: string }>;
}) {
  const { embed } = await searchParams;
  return (
    <DeviceShell embed={embed === "1"} background="#0B0B0D">
      <ChatScreen />
    </DeviceShell>
  );
}
