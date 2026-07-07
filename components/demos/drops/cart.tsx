"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartLine = {
  key: string;
  id: string;
  name: string;
  size: string;
  price: number;
  colorway: string;
  seed: string;
  qty: number;
};

type AddInput = Omit<CartLine, "key" | "qty">;

type CartApi = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  add: (item: AddInput) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartApi | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([
    {
      key: "seed-og",
      id: "cadence-og-low",
      name: "Cadence OG Low",
      size: "43",
      price: 180,
      colorway: "Onyx / Magenta Hit",
      seed: "cad-og-low",
      qty: 1,
    },
  ]);
  const [open, setOpen] = useState(false);

  const add = useCallback((item: AddInput) => {
    const key = `${item.id}-${item.size}`;
    setLines((prev) => {
      const found = prev.find((l) => l.key === key);
      if (found) {
        return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l));
      }
      return [...prev, { ...item, key, qty: 1 }];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) => (l.key === key ? { ...l, qty } : l)),
    );
  }, []);

  const value = useMemo<CartApi>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0);
    return { lines, count, subtotal, open, add, remove, setQty, setOpen };
  }, [lines, open, add, remove, setQty]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
