/**
 * WAVES — static "now playing" data.
 * All values are deterministic (no Math.random) to stay hydration-safe.
 */

export const ACCENT = "#9b87e8";

export interface Track {
  title: string;
  artist: string;
  seed: string; // picsum seed for album art
}

export const PLAYLIST = "After Hours FM";

export const NOW_PLAYING: Track & { durationSec: number; startSec: number } = {
  title: "Marble Skyline",
  artist: "Sable & Vail",
  seed: "waves-marble-skyline",
  durationSec: 228, // 3:48
  startSec: 74, // begin partway in so the waveform reads as mid-song
};

export const UP_NEXT: Track[] = [
  {
    title: "Coastline Reverb",
    artist: "Neon Aviary",
    seed: "waves-coastline-reverb",
  },
  {
    title: "Paper Lanterns",
    artist: "Sable & Vail",
    seed: "waves-paper-lanterns",
  },
];

/**
 * Waveform amplitudes (0..1). Hand-shaped so the played/unplayed split
 * reads like a real audio envelope rather than noise.
 */
export const WAVEFORM: number[] = [
  0.42, 0.55, 0.38, 0.62, 0.72, 0.48, 0.58, 0.8, 0.66, 0.5, 0.44, 0.7, 0.85,
  0.6, 0.52, 0.68, 0.9, 0.74, 0.58, 0.46, 0.64, 0.82, 0.95, 0.7, 0.55, 0.48,
  0.6, 0.78, 0.88, 0.66, 0.52, 0.6, 0.74, 0.92, 0.7, 0.5, 0.42, 0.58, 0.8,
  0.68, 0.54, 0.46, 0.62, 0.76, 0.6, 0.5, 0.44, 0.56, 0.7, 0.84, 0.62, 0.48,
  0.4, 0.54, 0.66, 0.5,
];

export function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}
