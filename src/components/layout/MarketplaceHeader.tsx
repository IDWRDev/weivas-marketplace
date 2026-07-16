"use client";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  Heart,
  Menu,
  Package,
  Search,
  ShoppingCart,
  Store,
  UserRound,
  X,
} from "lucide-react";
import { WeivasLogo } from "@/components/brand/WeivasLogo";
import { categories } from "@/data/mock/marketplace";
import { useMarketplaceStore } from "@/stores/marketplace-store";
import { useEffect, useState } from "react";
type HeaderPrincipal={name?:string|null;role:"buyer"|"seller"|"admin";sellerApplicationStatus?:"draft"|"submitted"|"under_review"|"needs_information"|"approved"|"rejected"|"suspended"};
export function MarketplaceHeader({principal}:{principal?:HeaderPrincipal}) {
  const [drawer, setDrawer] = useState(false);
  const [viewer,setViewer]=useState<HeaderPrincipal|undefined>(principal);
  const count = useMarketplaceStore((s) => Object.values(s.cart).reduce((total, quantity) => total + quantity, 0));
  useEffect(() => {
    if (!drawer) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setDrawer(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [drawer]);
  useEffect(()=>{if(principal)return;fetch("/api/auth/session").then(response=>response.ok?response.json():null).then(session=>{if(session?.user)setViewer(session.user)}).catch(()=>undefined)},[principal]);
  return (
    <>
      <div className="market-header-stack">
      <header className="market-header">
        <button
          className="mobile-menu"
          aria-label="Open categories"
          aria-expanded={drawer}
          onClick={() => setDrawer(true)}
        >
          <Menu />
        </button>
        <Link href="/" aria-label="Weivas home">
          <WeivasLogo className="brand-logo" />
        </Link>
        <form className="search" action="/search">
          <label>
            <span>All categories</span>
            <ChevronDown />
          </label>
          <input
            name="q"
            aria-label="Search products"
            placeholder="Search products, categories, brands or suppliers"
          />
          <button>Search</button>
        </form>
        <div className="header-actions">
          <span>
            🇳🇬 <small>Deliver to</small>
            <b>Nigeria</b>
          </span>
          <button className="locale">
            🌐 EN / USD <ChevronDown />
          </button>
          <Link href={viewer?"/account":"/auth/sign-in"} className="account-entry">
            <UserRound />
            <span><small>{viewer?"Buyer workspace":"Welcome"}</small><b>{viewer?"My dashboard":"Sign in"}</b></span>
          </Link>
          {viewer?.sellerApplicationStatus==="approved"&&<Link href="/seller" className="seller-entry"><Store/><span><small>Business</small><b>Seller centre</b></span></Link>}
          {viewer&&viewer.sellerApplicationStatus&&viewer.sellerApplicationStatus!=="approved"&&<Link href="/sell/status" className="seller-entry"><Store/><span><small>Seller application</small><b>View status</b></span></Link>}
          <Link href="/account/wishlist" aria-label="Wishlist">
            <Heart />
          </Link>
          <button aria-label="Notifications">
            <Bell />
          </button>
          <Link href="/account/orders" aria-label="Orders">
            <Package />
          </Link>
          <Link href="/cart" aria-label={`Cart with ${count} items`}>
            <ShoppingCart />
            <i>{count}</i>
          </Link>
        </div>
      </header>
      <form className="mobile-search" action="/search">
        <Search />
        <input
          name="q"
          aria-label="Search products"
          placeholder="Search products, brands or suppliers"
        />
      </form>
      <nav className="market-nav" aria-label="Marketplace navigation">
        <button onClick={() => setDrawer(true)}>
          <Menu /> All Categories
        </button>
        {categories.slice(0, 8).map((c) => (
          <Link
            href={`/category/${c.slug}`}
            key={c.name}
          >
            {c.name}
          </Link>
        ))}
        <Link href="/search?deal=true">Deals</Link>
        <Link href="/search?verified=true">Verified Sellers</Link>
        <Link className="sell-link" href="/sell">
          Sell on Weivas
        </Link>
      </nav>
      </div>
      <div className="market-header-placeholder" aria-hidden="true" />
      {drawer && (
        <div className="drawer-backdrop" onClick={() => setDrawer(false)}>
          <aside
            className="category-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="All categories"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <header>
              <b>Shop all categories</b>
              <button
                aria-label="Close categories"
                onClick={() => setDrawer(false)}
              >
                <X />
              </button>
            </header>
            {categories.map((c) => (
              <Link
                key={c.name}
                href={`/category/${c.slug}`}
                onClick={() => setDrawer(false)}
              >
                <span>{c.icon}</span>
                {c.name}
                <b>›</b>
              </Link>
            ))}
          </aside>
        </div>
      )}
    </>
  );
}
