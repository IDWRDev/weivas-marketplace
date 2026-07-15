"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
type State = {
  cart: Record<string, number>;
  wishlist: string[];
  addToCart: (id: string) => void;
  toggleWishlist: (id: string) => void;
  cartCount: () => number;
};
export const useMarketplaceStore = create<State>()(
  persist(
    (set, get) => ({
      cart: {},
      wishlist: [],
      addToCart: (id) =>
        set((s) => ({ cart: { ...s.cart, [id]: (s.cart[id] || 0) + 1 } })),
      toggleWishlist: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id)
            ? s.wishlist.filter((x) => x !== id)
            : [...s.wishlist, id],
        })),
      cartCount: () => Object.values(get().cart).reduce((a, b) => a + b, 0),
    }),
    { name: "weivas-marketplace-state", skipHydration: true },
  ),
);
