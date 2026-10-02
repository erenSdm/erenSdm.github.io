"use client";

import dynamic from "next/dynamic";

/**
 * Fixed, scroll-driven glass monolith. Mount once (e.g. at the top of app/page.tsx).
 * Sections opt in with data-prism="hero|manifesto|services|work|mobile|process|contact";
 * service cards with data-prism-step="0..N".
 */
const PrismCanvas = dynamic(() => import("./PrismCanvas"), {
  ssr: false,
  loading: () => null,
});

export default function Prism() {
  return <PrismCanvas />;
}
