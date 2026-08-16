"use client";
import Link from "next/link";
import { useEffect } from "react";
import { BadgeCheck, Heart, PackageCheck, ShoppingCart, Star } from "lucide-react";
import type { Product, ProductVariant } from "@/types/marketplace";
import { useMarketplaceStore } from "@/stores/marketplace-store";
import { formatCurrency, toMinor } from "@/lib/marketplace";
import { cn } from "@/lib/utils";

export function ProductCard({ product, variant = "standard" }: { product: Product; variant?: ProductVariant }) {
  const wished = useMarketplaceStore(state => state.wishlist.includes(product.id));
  const toggle = useMarketplaceStore(state => state.toggleWishlist);
  const add = useMarketplaceStore(state => state.addToCart);
  const remember = useMarketplaceStore(state => state.rememberProduct);
  useEffect(() => remember(product), [product, remember]);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  return <article className={cn("product-card", `product-${variant}`, product.status === "Out of Stock" && "sold-out")}>
    <button className={wished ? "wished" : ""} aria-label={`${wished ? "Remove" : "Add"} ${product.name} ${wished ? "from" : "to"} wishlist`} aria-pressed={wished} onClick={() => toggle(product.id)}><Heart fill={wished ? "currentColor" : "none"}/></button>
    {discount > 0 && <span className="discount">-{discount}%</span>}
    <Link href={`/product/${product.slug}`}>
      <div className="product-visual" role="img" aria-label={product.imageAlt ?? product.name}>{product.imageUrl ? <span className="product-image" style={{ backgroundImage: `url(${product.imageUrl})` }}/> : product.emoji}{product.status === "Out of Stock" && <b>Sold out</b>}</div>
      <div className="product-copy">
        <p>{product.name}</p>
        <div><strong>{formatCurrency(toMinor(product.price), product.currency)}</strong>{product.oldPrice && <del>{formatCurrency(toMinor(product.oldPrice), product.currency)}</del>}</div>
        {product.reviewCount && product.reviewCount > 0 ? <small className="rating"><Star fill="currentColor"/> {product.rating} ({product.reviewCount.toLocaleString()}) {product.sold ? `· ${product.sold.toLocaleString()} sold` : ""}</small> : <small>No customer reviews yet</small>}
        {product.sellerName && variant !== "compact" && <small className="seller-name">{product.sellerName}</small>}
        {product.verified && <small className="verified-label"><BadgeCheck/> Verified seller</small>}
        {product.productVerified && variant !== "compact" && <small><PackageCheck/> Approved listing</small>}
        {product.delivery && <small>{product.delivery}</small>}
        {variant === "wholesale" && product.moq && product.moq > 1 ? <small className="moq">MOQ {product.moq} · {product.supplierCountry}</small> : null}
      </div>
    </Link>
    {variant === "deal" && <button className="card-action" disabled={product.status === "Out of Stock"} onClick={() => add(product.id)}><ShoppingCart/> Add to cart</button>}
  </article>;
}
