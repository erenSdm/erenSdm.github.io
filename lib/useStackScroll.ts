"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Scroll-driven phone stack. Pins `wrapRef` and, as the user scrolls, raises
 * each incoming `.stack-phone` up over the previous one (which sinks slightly
 * behind), while the matching `.stack-text` panel drops away and the next one
 * rises into place. Distance scales with the number of cards. No-op when
 * `enabled` is false (reduced motion renders a plain list instead).
 */
export function useStackScroll(
  wrapRef: RefObject<HTMLElement | null>,
  count: number,
  enabled = true
) {
  useEffect(() => {
    if (!enabled || count < 2) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const ctx = gsap.context(() => {
      const phones = gsap.utils.toArray<HTMLElement>(".stack-phone");
      const texts = gsap.utils.toArray<HTMLElement>(".stack-text");

      // resting state: first card shown, the rest waiting below / hidden
      phones.forEach((p, i) => {
        gsap.set(p, {
          zIndex: i,
          yPercent: i === 0 ? 0 : 120,
          scale: i === 0 ? 1 : 0.96,
          autoAlpha: 1,
          transformOrigin: "center center",
        });
      });
      texts.forEach((t, i) => {
        gsap.set(t, {
          zIndex: i,
          yPercent: i === 0 ? 0 : 55,
          autoAlpha: i === 0 ? 1 : 0,
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: () => "+=" + window.innerHeight * (count - 1),
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      for (let i = 1; i < count; i++) {
        const at = "seg" + i;
        tl.addLabel(at)
          // outgoing copy drops down and fades out
          .to(
            texts[i - 1],
            { yPercent: 55, autoAlpha: 0, ease: "power2.in", duration: 0.4 },
            at
          )
          // previous phone sinks behind the stack, peeking at the top
          .to(
            phones[i - 1],
            {
              scale: 0.9,
              yPercent: -7,
              autoAlpha: 0.55,
              ease: "power2.inOut",
              duration: 1,
            },
            at
          )
          // incoming phone rises up and settles on top
          .fromTo(
            phones[i],
            { yPercent: 120, scale: 0.96 },
            { yPercent: 0, scale: 1, ease: "power3.out", duration: 1 },
            at
          )
          // incoming copy rises into place
          .fromTo(
            texts[i],
            { yPercent: 55, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, ease: "power2.out", duration: 0.6 },
            at + "+=0.4"
          );
      }
    }, wrap);

    return () => ctx.revert();
  }, [enabled, wrapRef, count]);
}
