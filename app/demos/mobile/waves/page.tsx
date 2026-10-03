import type { Metadata, Viewport } from "next";
import { DeviceShell } from "@/components/demos/chat/DeviceShell";
import { WavesApp } from "@/components/demos/waves/WavesApp";

export const metadata: Metadata = {
  title: "WAVES — Music",
  description:
    "WAVES — a dark music app that takes its colour from the artwork: home shelves, search, library, and a full player with waveform scrubbing, synced lyrics and an editable queue.",
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
  themeColor: "#131211",
  colorScheme: "dark",
};

export default function Page() {
  return (
    <DeviceShell background="#131211">
      <WavesApp />
    </DeviceShell>
  );
}
