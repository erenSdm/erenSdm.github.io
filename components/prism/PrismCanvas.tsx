"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, invalidate } from "@react-three/fiber";
import PrismScene, { type HeroState } from "./PrismScene";

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

export default function PrismCanvas() {
  const stateRef = useRef<HeroState>({ p: 0, mx: 0, my: 0 });
  const wrap = useRef<HTMLDivElement>(null);
  const [tabVisible, setTabVisible] = useState(true);
  const [inHero, setInHero] = useState(true);
  const [ready, setReady] = useState(false);
  const [env] = useState(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.innerWidth < 768;
    const nav = navigator as Navigator & { deviceMemory?: number };
    const weak = (navigator.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
    return { reduced, lowPower: narrow || weak };
  });

  // Hero scroll progress → exit motion + fade; fully hidden (and frameloop stopped) past the hero.
  useEffect(() => {
    const st = stateRef.current;
    let heroH = window.innerHeight;
    const measure = () => {
      const hero = document.querySelector('[data-prism="hero"]');
      heroH = hero ? Math.max(1, hero.getBoundingClientRect().height) : window.innerHeight;
    };
    const update = () => {
      st.p = Math.min(1, Math.max(0, window.scrollY / heroH));
      const o = 1 - smooth(0.3, 0.92, st.p);
      if (wrap.current) {
        wrap.current.style.opacity = String(o);
        wrap.current.style.visibility = o <= 0.001 ? "hidden" : "visible";
      }
      setInHero(o > 0.001);
      if (env.reduced) invalidate();
    };
    measure();
    update();
    const onResize = () => {
      measure();
      update();
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", onResize);
    };
  }, [env.reduced]);

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

  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const frameloop = !tabVisible || !inHero ? "never" : env.reduced ? "demand" : "always";

  return (
    <div
      ref={wrap}
      aria-hidden
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: ready ? 1 : 0,
          transition: "opacity 1.6s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <Canvas
          dpr={[1, env.lowPower ? 1.4 : 1.75]}
          frameloop={frameloop}
          camera={{ position: [0, 0, 6], fov: 35, near: 0.1, far: 50 }}
          gl={{ antialias: !env.lowPower, alpha: false, powerPreference: "high-performance" }}
          style={{ pointerEvents: "none" }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x0b0c10, 1);
            if (env.lowPower) gl.transmissionResolutionScale = 0.6;
            requestAnimationFrame(() => setReady(true));
          }}
        >
          <PrismScene state={stateRef} reduced={env.reduced} lowPower={env.lowPower} />
        </Canvas>
      </div>
      {/* film grain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: GRAIN,
          opacity: 0.09,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}
