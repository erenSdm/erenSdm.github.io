import type { Metadata } from "next";
import { ChatScreen } from "@/components/demos/chat/ChatScreen";

export const metadata: Metadata = {
  title: "RELAY — Messaging",
  description: "A mobile messaging conversation with presence, live typing, and read receipts.",
};

export default function ChatDemoPage() {
  return (
    <main className="flex min-h-[100dvh] w-full justify-center bg-[#050505] md:items-center md:p-6">
      {/*
        In-frame: fills the phone height (100dvh === frame height).
        Standalone desktop: centers a phone-width column over the dark void.
      */}
      <div className="flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-[#0A0A0A] md:h-[calc(100dvh-3rem)] md:max-h-[900px] md:rounded-[2.25rem] md:shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] md:ring-1 md:ring-white/[0.07]">
        <ChatScreen />
      </div>
    </main>
  );
}
