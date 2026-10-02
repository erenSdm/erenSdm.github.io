"use client";

import { useEffect, useRef } from "react";

export default function ScrollOptimizer() {
    const targetRef = useRef(0);
    const currentRef = useRef(0);
    const rafRef = useRef(0);
    const activeRef = useRef(false);

    useEffect(() => {
        // Skip on touch devices — they have native smooth scroll
        const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        const ease = 0.09;
        const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

        targetRef.current = window.scrollY;
        currentRef.current = window.scrollY;

        const animate = () => {
            const diff = targetRef.current - currentRef.current;

            if (Math.abs(diff) < 0.5) {
                currentRef.current = targetRef.current;
                window.scrollTo(0, currentRef.current);
                activeRef.current = false;
                return;
            }

            currentRef.current += diff * ease;
            window.scrollTo(0, currentRef.current);
            rafRef.current = requestAnimationFrame(animate);
        };

        const startAnimation = () => {
            if (!activeRef.current) {
                activeRef.current = true;
                rafRef.current = requestAnimationFrame(animate);
            }
        };

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            targetRef.current = Math.max(0, Math.min(
                targetRef.current + e.deltaY * 0.55,
                maxScroll()
            ));
            startAnimation();
        };

        // Keyboard scroll support
        const onKeyDown = (e: KeyboardEvent) => {
            const step = window.innerHeight * 0.6;
            let delta = 0;

            switch (e.key) {
                case "ArrowDown": delta = 80; break;
                case "ArrowUp": delta = -80; break;
                case "PageDown": case " ": delta = step; break;
                case "PageUp": delta = -step; break;
                case "Home": targetRef.current = 0; startAnimation(); return;
                case "End": targetRef.current = maxScroll(); startAnimation(); return;
                default: return;
            }

            if (e.key === " " && (e.target as HTMLElement)?.tagName === "INPUT") return;

            e.preventDefault();
            targetRef.current = Math.max(0, Math.min(targetRef.current + delta, maxScroll()));
            startAnimation();
        };

        // Sync on resize or anchor navigation
        const onSync = () => {
            targetRef.current = window.scrollY;
            currentRef.current = window.scrollY;
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("resize", onSync, { passive: true });
        window.addEventListener("hashchange", onSync);

        return () => {
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("resize", onSync);
            window.removeEventListener("hashchange", onSync);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return null;
}
