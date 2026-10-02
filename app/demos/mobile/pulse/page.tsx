import type { Metadata, Viewport } from "next";
import { PulseApp } from "@/components/demos/pulse/PulseApp";
import { DeviceShell } from "@/components/demos/chat/DeviceShell";

export const metadata: Metadata = {
  title: "PULSE — Activity",
  description:
    "PULSE — a light, fully interactive fitness tracker: tappable week, activity rings, a scrubbable heart-rate chart, water logging, live workout sessions and editable goals.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PULSE",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F4F5F7",
  colorScheme: "light",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ embed?: string }> }) {
  const { embed } = await searchParams;
  return (
    <DeviceShell embed={embed === "1"} background="#F4F5F7" tone="light">
      <PulseApp />
    </DeviceShell>
  );
}
