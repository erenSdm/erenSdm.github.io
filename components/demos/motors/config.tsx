"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  INTERIORS,
  MODEL,
  PAINTS,
  WHEELS,
  type Interior,
  type Paint,
  type Wheel,
} from "./data";

type ConfigState = {
  paint: Paint;
  wheel: Wheel;
  interior: Interior;
  setPaintId: (id: string) => void;
  setWheelId: (id: string) => void;
  setInteriorId: (id: string) => void;
  total: number;
  rangeKm: number;
};

const ConfigCtx = createContext<ConfigState | null>(null);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [paintId, setPaintId] = useState(PAINTS[0].id);
  const [wheelId, setWheelId] = useState(WHEELS[0].id);
  const [interiorId, setInteriorId] = useState(INTERIORS[0].id);

  const value = useMemo<ConfigState>(() => {
    const paint = PAINTS.find((p) => p.id === paintId) ?? PAINTS[0];
    const wheel = WHEELS.find((w) => w.id === wheelId) ?? WHEELS[0];
    const interior =
      INTERIORS.find((i) => i.id === interiorId) ?? INTERIORS[0];
    const total =
      MODEL.basePrice + paint.priceDelta + wheel.priceDelta + interior.priceDelta;
    const rangeKm = 724 + wheel.rangeDelta;
    return {
      paint,
      wheel,
      interior,
      setPaintId,
      setWheelId,
      setInteriorId,
      total,
      rangeKm,
    };
  }, [paintId, wheelId, interiorId]);

  return <ConfigCtx.Provider value={value}>{children}</ConfigCtx.Provider>;
}

export function useConfig(): ConfigState {
  const ctx = useContext(ConfigCtx);
  if (!ctx) throw new Error("useConfig must be used within ConfigProvider");
  return ctx;
}
