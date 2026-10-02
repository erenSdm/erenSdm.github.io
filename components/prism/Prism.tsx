"use client";

import dynamic from "next/dynamic";

/**
 * Hero glass prism + atmospheric background (fixed canvas, z-index 0).
 * Reads the hero's height from [data-prism="hero"]; fades out and stops rendering once scrolled past it.
 */
const PrismCanvas = dynamic(() => import("./PrismCanvas"), {
  ssr: false,
  loading: () => null,
});

export default function Prism() {
  return <PrismCanvas />;
}
