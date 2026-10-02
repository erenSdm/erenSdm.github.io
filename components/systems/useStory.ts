"use client";

import { useCallback, useEffect, useState } from "react";
import type { StoryDef } from "./types";

const LEAD_IN = 700;
/** time to travel one lane, before the station lights up */
export const TRAVEL = 720;
const HOLD = 1650;
const TAIL = 3200;

/**
 * Walks the tracked item through each story and moves on to the next one.
 * Only ticks while `enabled`, so off-screen panels cost nothing.
 */
export function useStory(stories: StoryDef[], enabled: boolean) {
  const [sIdx, setSIdx] = useState(0);
  const [step, setStep] = useState(-1);
  const [run, setRun] = useState(0);

  const story = stories[sIdx];

  useEffect(() => {
    if (!enabled) return;
    const last = step >= story.steps.length - 1;
    const cur = story.steps[step];
    const hops = cur?.via ? (Array.isArray(cur.via) ? cur.via.length : 1) : 0;
    const hold = step < 0 ? LEAD_IN : hops * TRAVEL + HOLD + (last ? TAIL : 0);
    const id = window.setTimeout(() => {
      if (last) {
        setSIdx((i) => (i + 1) % stories.length);
        setStep(-1);
        setRun((r) => r + 1);
      } else {
        setStep((s) => s + 1);
      }
    }, hold);
    return () => window.clearTimeout(id);
  }, [enabled, step, story, stories.length, run]);

  const select = useCallback((i: number) => {
    setSIdx(i);
    setStep(-1);
    setRun((r) => r + 1);
  }, []);

  return { sIdx, step, story, run, select };
}
