"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Pins `wrapRef` and translates `trackRef` horizontally as the user scrolls
 * vertically (scroll-hijack). Distance is derived from the track's overflow,
 * so it adapts to any number/size of cards. No-op when `enabled` is false.
 *
 * `onProgress` receives 0..1 while pinned. Returns `jumpTo(el)`, which scrolls
 * the page to the point where `el` (a child of the track) is in view.
 */
export function useHorizontalPin(
  wrapRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLElement | null>,
  enabled = true,
  onProgress?: (p: number) => void
) {
  const stRef = useRef<ScrollTrigger | null>(null);
  const distRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const ctx = gsap.context(() => {
      const distance = () => (distRef.current = Math.max(0, track.scrollWidth - window.innerWidth));
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: () => "+=" + (distance() + window.innerHeight * 0.4),
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: onProgress ? (self) => onProgress(self.progress) : undefined,
        },
      });
      stRef.current = tween.scrollTrigger ?? null;
    }, wrap);

    return () => {
      stRef.current = null;
      ctx.revert();
    };
  }, [enabled, wrapRef, trackRef, onProgress]);

  return useCallback((el: HTMLElement) => {
    const st = stRef.current;
    const dist = distRef.current;
    if (!st || dist <= 0) return false;
    // the tween maps [start, end] linearly onto x = [0, -dist]
    const p = Math.min(1, Math.max(0, (el.offsetLeft - (window.innerWidth - el.offsetWidth) / 2) / dist));
    const y = st.start + (st.end - st.start) * p;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: "smooth" });
    return true;
  }, []);
}
