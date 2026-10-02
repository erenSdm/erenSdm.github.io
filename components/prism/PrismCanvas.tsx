"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollTrigger } from "@/lib/gsap";
import PrismScene from "./PrismScene";
import { STAGES, createScrollState, type ScrollState, type Stage } from "./stages";

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/** Document-space vertical centre; uses the pin-spacer when a section is pinned. */
function docCenter(el: Element) {
  const host =
    el.parentElement && el.parentElement.classList.contains("pin-spacer")
      ? el.parentElement
      : el;
  const r = host.getBoundingClientRect();
  return r.top + window.scrollY + r.height / 2;
}

function parseRGBA(s: string): [number, number, number, number] | null {
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
  return [parts[0], parts[1], parts[2], parts.length > 3 ? parts[3] : 1];
}

/** Is the content behind the viewport centre light? (canvas is pointer-events:none so it's skipped) */
function sampleBackdrop(st: ScrollState) {
  let el = document.elementFromPoint(window.innerWidth * 0.5, window.innerHeight * 0.5);
  while (el) {
    const c = parseRGBA(getComputedStyle(el).backgroundColor);
    if (c && c[3] > 0.5) {
      st.bg = [c[0] / 255, c[1] / 255, c[2] / 255];
      const lum = 0.2126 * st.bg[0] + 0.7152 * st.bg[1] + 0.0722 * st.bg[2];
      st.light = lum > 0.55 ? 1 : 0;
      return;
    }
    el = el.parentElement;
  }
  st.bg = [0.04, 0.04, 0.04];
  st.light = 0;
}

export default function PrismCanvas() {
  const stateRef = useRef(createScrollState());
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [env] = useState(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.innerWidth < 768;
    const nav = navigator as Navigator & { deviceMemory?: number };
    const weak =
      (navigator.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
    return { reduced, lowPower: narrow || weak, narrow };
  });

  // Scroll → stage mapping
  useEffect(() => {
    const st = stateRef.current;
    let keys: { idx: number; c: number }[] = [];
    let steps: number[] = [];
    let lastSample = 0;

    const measure = () => {
      keys = [];
      for (let i = 0; i < STAGES.length; i++) {
        const el = document.querySelector(`[data-prism="${STAGES[i] as Stage}"]`);
        if (el) keys.push({ idx: i, c: docCenter(el) });
      }
      keys.sort((a, b) => a.c - b.c);
      steps = Array.from(document.querySelectorAll("[data-prism-step]"))
        .sort(
          (a, b) =>
            Number(a.getAttribute("data-prism-step")) -
            Number(b.getAttribute("data-prism-step")),
        )
        .map(docCenter);
    };

    const update = () => {
      const y = window.scrollY + window.innerHeight / 2;
      if (keys.length === 0) {
        // Fallback: spread stages over overall scroll progress.
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const f = (window.scrollY / max) * (STAGES.length - 1);
        st.a = Math.floor(f);
        st.b = Math.min(STAGES.length - 1, st.a + 1);
        st.w = smooth(0.15, 0.85, f - st.a);
      } else if (y <= keys[0].c) {
        st.a = st.b = keys[0].idx;
        st.w = 0;
      } else if (y >= keys[keys.length - 1].c) {
        st.a = st.b = keys[keys.length - 1].idx;
        st.w = 0;
      } else {
        for (let i = 0; i < keys.length - 1; i++) {
          if (y >= keys[i].c && y < keys[i + 1].c) {
            st.a = keys[i].idx;
            st.b = keys[i + 1].idx;
            st.w = smooth(0.2, 0.8, (y - keys[i].c) / (keys[i + 1].c - keys[i].c));
            break;
          }
        }
      }

      if (steps.length > 1) {
        if (y <= steps[0]) st.step = 0;
        else if (y >= steps[steps.length - 1]) st.step = steps.length - 1;
        else {
          for (let i = 0; i < steps.length - 1; i++) {
            if (y >= steps[i] && y < steps[i + 1]) {
              st.step = i + smooth(0.25, 0.75, (y - steps[i]) / (steps[i + 1] - steps[i]));
              break;
            }
          }
        }
      }

      const now = performance.now();
      if (now - lastSample > 120) {
        lastSample = now;
        sampleBackdrop(st);
      }
    };

    measure();
    update();

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: update,
      onRefresh: () => {
        measure();
        update();
      },
    });

    let t: ReturnType<typeof setTimeout> | undefined;
    const debounced = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        measure();
        update();
      }, 150);
    };
    const mo = new MutationObserver(debounced);
    mo.observe(document.body, { childList: true, subtree: true });
    const ro = new ResizeObserver(debounced);
    ro.observe(document.body);
    window.addEventListener("resize", debounced);
    window.addEventListener("scroll", update, { passive: true });

    return () => {
      clearTimeout(t);
      trigger.kill();
      mo.disconnect();
      ro.disconnect();
      window.removeEventListener("resize", debounced);
      window.removeEventListener("scroll", update);
    };
  }, []);

  // Pointer parallax (fine pointers only)
  useEffect(() => {
    if (env.reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const st = stateRef.current;
    const onMove = (e: PointerEvent) => {
      st.mx = (e.clientX / window.innerWidth) * 2 - 1;
      st.my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [env.reduced]);

  // Pause when the tab is hidden
  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: ready ? (env.narrow ? 0.62 : 1) : 0,
        transition: "opacity 1.4s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <Canvas
        dpr={[1, env.lowPower ? 1.4 : 1.75]}
        frameloop={!visible ? "never" : "always"}
        camera={{ position: [0, 0, 6], fov: 35, near: 0.1, far: 50 }}
        gl={{ antialias: !env.lowPower, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          const r = gl as typeof gl & { transmissionResolutionScale?: number };
          if (env.lowPower && "transmissionResolutionScale" in r) r.transmissionResolutionScale = 0.5;
          requestAnimationFrame(() => setReady(true));
        }}
      >
        <PrismScene state={stateRef} reduced={env.reduced} lowPower={env.lowPower} />
      </Canvas>
    </div>
  );
}
