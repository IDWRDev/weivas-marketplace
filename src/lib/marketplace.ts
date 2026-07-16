import type { CartItem, Product } from "@/types/marketplace";

export function toSlug(value: string): string {
  return value.trim().toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export const toMinor = (value: number) => Math.round(value * 100);
export const formatCurrency = (minor: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(minor / 100);

export type ResolvedCartItem = CartItem & { product: Product; lineTotalMinor: number };
export function resolveCartItems(items: CartItem[], products: Product[]): ResolvedCartItem[] {
  const byId = new Map(products.map((product) => [product.id, product]));
  return items.flatMap((item) => {
    const product = byId.get(item.productId);
    if (!product || item.quantity <= 0) return [];
    return [{ ...item, product, lineTotalMinor: toMinor(product.price) * item.quantity }];
  });
}
export const getCartItemCount = (items: CartItem[]) => items.reduce((sum, item) => sum + Math.max(0, item.quantity), 0);
export const getCartSubtotal = (items: ResolvedCartItem[]) => items.reduce((sum, item) => sum + item.lineTotalMinor, 0);
export const getCartDiscount = (subtotalMinor: number) => subtotalMinor >= 20_000 ? Math.round(subtotalMinor * 0.1) : 0;
export const getCartShipping = (subtotalMinor: number) => subtotalMinor === 0 || subtotalMinor >= 5_000 ? 0 : 599;
export const getCartTax = (taxableMinor: number) => Math.round(Math.max(0, taxableMinor) * 0.075);
export function getCartTotals(items: ResolvedCartItem[]) {
  const subtotalMinor = getCartSubtotal(items);
  const discountMinor = getCartDiscount(subtotalMinor);
  const shippingMinor = getCartShipping(subtotalMinor);
  const taxMinor = getCartTax(subtotalMinor - discountMinor);
  return { subtotalMinor, discountMinor, shippingMinor, taxMinor, totalMinor: subtotalMinor - discountMinor + shippingMinor + taxMinor };
}
export function getCartItemsBySeller(items: ResolvedCartItem[]) {
  const groups = new Map<string, ResolvedCartItem[]>();
  for (const item of items) groups.set(item.product.sellerId, [...(groups.get(item.product.sellerId) ?? []), item]);
  return groups;
}
