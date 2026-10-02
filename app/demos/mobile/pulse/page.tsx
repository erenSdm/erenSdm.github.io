import type { Metadata, Viewport } from "next";
import { PulseScreen } from "@/components/demos/pulse/PulseScreen";
import { DeviceShell } from "@/components/demos/chat/DeviceShell";

export const metadata: Metadata = {
  title: "PULSE — Activity",
  description: "PULSE — a mobile fitness today screen with animated activity rings, heart-rate telemetry, and streaks.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PULSE",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0B0A09",
  colorScheme: "dark",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ embed?: string }>;
}) {
  const { embed } = await searchParams;
  return (
    <DeviceShell embed={embed === "1"} background="#0B0A09">
      <PulseScreen />
    </DeviceShell>
  );
}
