"use client";

import { CartProvider } from "./cart";
import { TopBar } from "./TopBar";
import { DropHero } from "./DropHero";
import { ProductGrid } from "./ProductGrid";
import { Lookbook } from "./Lookbook";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";

export function CadenceStore() {
  return (
    <CartProvider>
      <div className="min-h-[100dvh] w-full bg-ink text-paper antialiased selection:bg-[#ff2e88] selection:text-ink">
        <TopBar />
        <main>
          <DropHero />
          <ProductGrid />
          <Lookbook />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
