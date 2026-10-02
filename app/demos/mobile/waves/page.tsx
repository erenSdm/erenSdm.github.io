import type { Metadata, Viewport } from "next";
import { NowPlaying } from "@/components/demos/waves/NowPlaying";
import { DeviceShell } from "@/components/demos/chat/DeviceShell";

export const metadata: Metadata = {
  title: "WAVES — Now Playing",
  description: "WAVES — a mobile music player with a live waveform scrubber and queue.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WAVES",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0A090C",
  colorScheme: "dark",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ embed?: string }>;
}) {
  const { embed } = await searchParams;
  return (
    <DeviceShell embed={embed === "1"} background="#0A090C">
      <NowPlaying />
    </DeviceShell>
  );
}
