import { NowPlaying } from "@/components/demos/waves/NowPlaying";

/**
 * WAVES — mobile music player "now playing" screen.
 * Rendered inside the MONOLITH phone frame; on its own route the app column is
 * centered (max-w ~430px) over a dark backdrop.
 */
export default function WavesPage() {
  return (
    <main className="flex min-h-[100dvh] w-full justify-center bg-[#050406]">
      <div className="flex min-h-[100dvh] w-full max-w-[430px] flex-col">
        <NowPlaying />
      </div>
    </main>
  );
}
