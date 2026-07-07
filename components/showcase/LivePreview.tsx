"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface LivePreviewProps {
  src: string;
  title: string;
  /** design resolution the demo is rendered at before scaling */
  baseWidth?: number;
  baseHeight?: number;
  /** allow pointer interaction (off inside scroll-hijack sections) */
  interactive?: boolean;
  className?: string;
}

/**
 * Renders a live demo route in an iframe at a fixed design resolution, then
 * scales it to *cover* its container — so a real 1440px site reads as a crisp
 * shrunk screenshot inside a frame.
 *
 * Loading strategy — mockups must never scroll into view empty, so instead of
 * the browser's native `loading="lazy"` (which defers the request until the
 * frame is basically on-screen and leaves it blank mid-scroll) we:
 *   1. mount the iframe as soon as it's within ~1.2 screens of the viewport
 *      (IntersectionObserver + generous rootMargin), then keep it mounted so
 *      scrolling away never triggers a reload; and
 *   2. warm the route's HTML in the background on idle, so when the iframe does
 *      mount it paints from cache almost instantly.
 */
export function LivePreview({
  src,
  title,
  baseWidth = 1440,
  baseHeight = 900,
  interactive = false,
  className,
}: LivePreviewProps) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);

  /* begin loading ahead of the viewport rather than waiting for the frame to be
     centred — one-shot: once we start, we keep the iframe mounted. */
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "1200px 1200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* prefetch the route's document on idle so the iframe paints from cache the
     moment it mounts. Skipped once we're already loading it for real. */
  useEffect(() => {
    if (visible) return;
    const warm = () => {
      if (document.querySelector(`link[data-warm="${src}"]`)) return;
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "document";
      link.href = src;
      link.dataset.warm = src;
      document.head.appendChild(link);
    };
    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(warm);
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(warm, 1500);
    return () => window.clearTimeout(t);
  }, [src, visible]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      // offsetWidth/Height report the *layout* box, unaffected by any ancestor
      // CSS transform (e.g. the coverflow's scale). getBoundingClientRect would
      // return the visually-scaled size, which — combined with ResizeObserver
      // only firing on layout changes — would leave the preview mis-scaled once
      // a scaled-down window grows to full size.
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      if (width && height) {
        setScale(Math.max(width / baseWidth, height / baseHeight));
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseWidth, baseHeight]);

  return (
    <div ref={box} className={cn("absolute inset-0 overflow-hidden bg-ink", className)}>
      {/* skeleton until iframe paints */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-coal transition-opacity duration-700",
          loaded ? "opacity-0" : "opacity-100"
        )}
      >
        <span className="label animate-pulse">LOADING · {title}</span>
      </div>
      {scale > 0 && visible && (
        <iframe
          src={src}
          title={title}
          tabIndex={interactive ? 0 : -1}
          onLoad={() => setLoaded(true)}
          aria-hidden={!interactive}
          className="origin-top-left border-0"
          style={{
            width: baseWidth,
            height: baseHeight,
            transform: `scale(${scale})`,
            pointerEvents: interactive ? "auto" : "none",
          }}
        />
      )}
    </div>
  );
}
