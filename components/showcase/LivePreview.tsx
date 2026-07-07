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
 * shrunk screenshot inside a frame. Loads lazily.
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
      {scale > 0 && (
        <iframe
          src={src}
          title={title}
          loading="lazy"
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
