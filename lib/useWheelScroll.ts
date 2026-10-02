"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const STEP = 34; // degrees between neighbouring phones on the wheel

/**
 * Optional scrubbed sequence that plays after the last phone reaches the apex,
 * inside the same pin. `units` is its length in wheel steps; `build` appends
 * tweens to the timeline starting at time `at`.
 */
export type WheelOutro = {
  units: number;
  build: (tl: gsap.core.Timeline, at: number, wrap: HTMLElement) => void;
};

/**
 * Scroll-driven phone wheel. Pins `wrapRef` and lays every `.wheel-phone`
 * inside it on a half circle whose apex sits at the top centre. Scrolling
 * turns the wheel one STEP per card, so the next phone swings up into the
 * middle while its neighbours tilt away down the arc. `onActive` fires with
 * the index of the phone nearest the apex. Returns `jump(i)`, which scrolls
 * the page to the position where card `i` is centred. No-op when `enabled`
 * is false (touch and reduced motion render a plain list instead).
 * An `outro` extends the pin with an extra scrubbed sequence after the wheel.
 */
export function useWheelScroll(
  wrapRef: RefObject<HTMLElement | null>,
  count: number,
  enabled: boolean,
  onActive: (i: number) => void,
  outro?: WheelOutro
) {
  const stRef = useRef<ScrollTrigger | null>(null);
  const total = count - 1 + (outro?.units ?? 0);

  useEffect(() => {
    if (!enabled || count < 2) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const phones = gsap.utils.toArray<HTMLElement>(".wheel-phone", wrap);
    const state = { p: 0 };
    let radius = 0;
    let last = -1;

    // radius scales with the phone so spacing holds at every viewport size
    const measure = () => {
      radius = (phones[0]?.offsetWidth ?? 260) * 3.8;
    };
    const place = () => {
      phones.forEach((el, i) => {
        const d = i - state.p;
        const ad = Math.abs(d);
        const a = (d * STEP * Math.PI) / 180;
        gsap.set(el, {
          xPercent: -50,
          x: Math.sin(a) * radius,
          y: (1 - Math.cos(a)) * radius,
          rotation: d * STEP,
          scale: 1 - Math.min(ad, 2) * 0.09,
          autoAlpha: ad > 2.6 ? 0 : 1 - Math.min(ad, 2) * 0.3,
          zIndex: 100 - Math.round(ad * 10),
        });
      });
      const i = Math.round(state.p);
      if (i !== last) {
        last = i;
        onActive(i);
      }
    };

    const ctx = gsap.context(() => {
      measure();
      place();
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: () => "+=" + window.innerHeight * total * 0.9,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => {
            measure();
            place();
          },
        },
      });
      tl.to(state, { p: count - 1, duration: count - 1, ease: "none", onUpdate: place });
      if (outro) {
        outro.build(tl, count - 1, wrap);
        // pad so the timeline always spans exactly `total`, whatever build added
        if (tl.duration() < total) tl.to({}, { duration: total - tl.duration() });
      }
      stRef.current = tl.scrollTrigger ?? null;
    }, wrap);

    return () => {
      stRef.current = null;
      ctx.revert();
    };
  }, [enabled, wrapRef, count, total, onActive, outro]);

  return useCallback(
    (i: number) => {
      const st = stRef.current;
      if (!st || count < 2) return;
      const y = st.start + ((st.end - st.start) * i) / total;
      const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } }).__lenis;
      if (lenis) lenis.scrollTo(y);
      else window.scrollTo({ top: y, behavior: "smooth" });
    },
    [count, total]
  );
}
