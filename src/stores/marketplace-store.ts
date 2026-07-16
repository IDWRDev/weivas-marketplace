"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CheckoutState } from "@/types/marketplace";
import { getCartItemCount } from "@/lib/marketplace";

type State = {
  cart: Record<string, number>;
  wishlist: string[];
  checkout: CheckoutState | null;
  addToCart: (id: string, quantity?:number) => void;
  setQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  toggleWishlist: (id: string) => void;
  beginCartCheckout: () => void;
  beginBuyNow: (item:CartItem) => void;
  cartCount: () => number;
};

const cartItems = (cart:Record<string,number>):CartItem[] => Object.entries(cart).map(([productId, quantity]) => ({ productId, quantity })).filter((item) => item.quantity > 0);

export const useMarketplaceStore = create<State>()(
  persist(
    (set, get) => ({
      cart: {}, wishlist: [], checkout: null,
      addToCart: (id, quantity=1) => set((state) => ({ cart: { ...state.cart, [id]: (state.cart[id] || 0) + quantity } })),
      setQuantity: (id, quantity) => set((state) => { const cart = { ...state.cart }; if (quantity <= 0) delete cart[id]; else cart[id] = quantity; return { cart }; }),
      removeFromCart: (id) => set((state) => { const cart = { ...state.cart }; delete cart[id]; return { cart }; }),
      toggleWishlist: (id) => set((state) => ({ wishlist: state.wishlist.includes(id) ? state.wishlist.filter((item) => item !== id) : [...state.wishlist, id] })),
      beginCartCheckout: () => set((state) => ({ checkout: { mode:"cart", items:cartItems(state.cart) } })),
      beginBuyNow: (item) => set({ checkout: { mode:"buy_now", items:[item] } }),
      cartCount: () => getCartItemCount(cartItems(get().cart)),
    }),
    { name: "weivas-marketplace-state", version:2, migrate:(persisted)=>({ ...(persisted as Partial<State>), checkout:null }) as State },
  ),
);
