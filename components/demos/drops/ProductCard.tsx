"use client";

import { Plus } from "lucide-react";
import { useCart } from "./cart";
import { StockTag, MAGENTA } from "./ui";
import { imgUrl, type Product } from "./data";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const sold = product.stock === "sold";

  const quickAdd = () => {
    if (sold) return;
    add({
      id: product.id,
      name: product.name,
      size: product.category === "Footwear" ? "42" : "M",
      price: product.price,
      colorway: product.colorway,
      seed: product.seed,
    });
  };

  return (
    <article className="group relative flex h-full w-full flex-col bg-coal">
      {/* image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgUrl(product.seed, 900, 1100)}
          alt={`${product.name} — ${product.colorway}`}
          loading="lazy"
          decoding="async"
          className={[
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            "group-hover:opacity-0",
            sold ? "grayscale" : "",
          ].join(" ")}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgUrl(product.altSeed, 900, 1100)}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className={[
            "absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100",
            sold ? "grayscale" : "",
          ].join(" ")}
        />

        {/* tag */}
        <div className="absolute left-2 top-2">
          <StockTag stock={product.stock} />
        </div>

        {/* low-stock counter */}
        {product.stock === "low" && product.units != null && (
          <div className="absolute right-2 top-2 bg-ink/85 px-2 py-1 font-[family-name:var(--font-cad-mono)] text-[10px] uppercase tracking-[0.12em] text-paper backdrop-blur-sm">
            {product.units} left
          </div>
        )}

        {sold && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/45">
            <span className="border border-paper/60 px-3 py-1.5 font-[family-name:var(--font-cad-mono)] text-[11px] uppercase tracking-[0.2em] text-paper">
              Sold Out
            </span>
          </div>
        )}

        {/* quick add — slides up on hover */}
        {!sold && (
          <button
            type="button"
            onClick={quickAdd}
            aria-label={`Quick add ${product.name}`}
            className="absolute inset-x-2 bottom-2 flex translate-y-[130%] items-center justify-between gap-2 px-3 py-2.5 font-[family-name:var(--font-cad-mono)] text-[11px] font-bold uppercase tracking-[0.14em] text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            style={{ background: MAGENTA }}
          >
            Quick add
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* meta */}
      <div className="flex items-start justify-between gap-3 border-t border-line px-3 py-3">
        <div className="min-w-0">
          <h3 className="truncate font-[family-name:var(--font-cad-display)] text-[1.35rem] leading-none tracking-[0.01em] text-paper">
            {product.name}
          </h3>
          <p className="mt-1.5 truncate font-[family-name:var(--font-cad-mono)] text-[10px] uppercase tracking-[0.12em] text-ash">
            {product.colorway}
          </p>
        </div>
        <span className="shrink-0 font-[family-name:var(--font-cad-mono)] text-[13px] font-bold text-paper tabular-nums">
          €{product.price}
        </span>
      </div>
    </article>
  );
}
