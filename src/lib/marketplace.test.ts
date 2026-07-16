import { describe, expect, it } from "vitest";
import { allProducts, categories, getCategoryBySlug, getProductById, getProductBySlug, getProductsBySellerId, getSellerById, getSellerBySlug, sellers, validateMarketplaceData } from "@/data/mock/marketplace";
import { getCartDiscount, getCartItemCount, getCartItemsBySeller, getCartShipping, getCartTax, getCartTotals, resolveCartItems, toSlug } from "./marketplace";

describe("canonical marketplace data",()=>{
  it("creates URL-safe slugs",()=>expect(toSlug(" Computers & Office ")).toBe("computers-and-office"));
  it("looks products up by id and slug",()=>expect(getProductBySlug(getProductById("p1")!.slug)?.id).toBe("p1"));
  it("looks sellers up by id and slug",()=>expect(getSellerBySlug(getSellerById("s2")!.slug)?.id).toBe("s2"));
  it("looks categories up by slug",()=>expect(getCategoryBySlug("home-and-kitchen")?.name).toBe("Home & Kitchen"));
  it("returns only products owned by a seller",()=>expect(getProductsBySellerId("s3").every((product)=>product.sellerId==="s3")).toBe(true));
  it("has no broken mock relationships",()=>expect(validateMarketplaceData()).toEqual([]));
  it("has unique, generated routes for every linked entity",()=>{
    expect(new Set(allProducts.map((product)=>product.slug)).size).toBe(allProducts.length);
    expect(new Set(categories.map((category)=>category.slug)).size).toBe(categories.length);
    expect(new Set(sellers.map((seller)=>seller.slug)).size).toBe(sellers.length);
  });
});

describe("cart calculations",()=>{
  const items=resolveCartItems([{productId:"p1",quantity:2},{productId:"p4",quantity:1}],allProducts);
  it("counts quantities",()=>expect(getCartItemCount(items)).toBe(3));
  it("calculates line and subtotal values in minor units",()=>expect(items[0].lineTotalMinor).toBe(Math.round(allProducts.find((p)=>p.id==="p1")!.price*100)*2));
  it("calculates promotional discount",()=>expect(getCartDiscount(20_000)).toBe(2_000));
  it("calculates shipping from the mock rule",()=>{expect(getCartShipping(4_999)).toBe(599);expect(getCartShipping(5_000)).toBe(0)});
  it("calculates rounded tax",()=>expect(getCartTax(10_001)).toBe(750));
  it("calculates a consistent total",()=>{const totals=getCartTotals(items);expect(totals.totalMinor).toBe(totals.subtotalMinor-totals.discountMinor+totals.shippingMinor+totals.taxMinor)});
  it("groups items by their real seller",()=>{const groups=getCartItemsBySeller(items);expect([...groups].every(([sellerId,group])=>group.every((item)=>item.product.sellerId===sellerId))).toBe(true)});
  it("does not resolve phantom products from an empty cart",()=>expect(resolveCartItems([],allProducts)).toEqual([]));
});
