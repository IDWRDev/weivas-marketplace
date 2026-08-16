"use client";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  CreditCard,
  Headphones,
  PackageCheck,
  QrCode,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import type { Category, Product } from "@/types/marketplace";
import { ProductCard } from "./ProductCard";
import { useState } from "react";
const slides = [
  {
    tag: "GLOBAL MARKETPLACE",
    title: "Good things, handpicked for you.",
    copy: "Explore approved products from active sellers, with clear pricing and seller information.",
    cta: "Shop Now",
    emoji: ["🧳", "🎧", "⌚", "☕"],
  },
  {
    tag: "SMARTER EVERYDAY",
    title: "Technology that moves with you.",
    copy: "Approved electronics listings with seller-provided warranty and fulfilment information.",
    cta: "Shop Electronics",
    emoji: ["💻", "🎧", "⌚", "📱"],
  },
  {
    tag: "HOME & LIFESTYLE",
    title: "Make every space feel more like you.",
    copy: "Warm, useful finds for kitchens, living rooms and everyday rituals.",
    cta: "Explore Home",
    emoji: ["☕", "🪑", "🍽️", "🪴"],
  },
  {
    tag: "WHOLESALE SOURCING",
    title: "Buy more. Build more. Grow further.",
    copy: "Discover listings that support larger order quantities from approved sellers.",
    cta: "Source in Bulk",
    emoji: ["📦", "🖨️", "💼", "🌍"],
  },
];
function Heading({
  eyebrow,
  title,
  link = "View all",
}: {
  eyebrow: string;
  title: string;
  link?: string;
}) {
  return (
    <div className="section-title">
      <div>
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <Link href="/search">
        {link} <ArrowRight />
      </Link>
    </div>
  );
}
export function HomepageExperience({catalogProducts=[],categories=[],featuredStores=[]}:{catalogProducts?:Product[];categories?:Category[];featuredStores?:{id:string;slug:string;name:string;country:string;verified:boolean;productCount:number}[]}) {
  const products=catalogProducts;
  const [slide, setSlide] = useState(0);
  const s = slides[slide];
  return (
    <main>
      <div className="market-grid">
        <aside className="categories">
          <h2>☷ All Categories</h2>
          {categories.map((c) => (
            <Link
              key={c.name}
              href={`/category/${c.slug}`}
            >
              <span>{c.icon}</span>
              {c.name}
              <b>›</b>
            </Link>
          ))}
        </aside>
        <section
          className="hero"
          aria-roledescription="carousel"
          aria-label="Marketplace highlights"
        >
          <div>
            <span className="eyebrow">{s.tag}</span>
            <h1>
              {s.title.includes("handpicked") ? (
                <>
                  Good things,
                  <br />
                  <em>handpicked for you.</em>
                </>
              ) : (
                s.title
              )}
            </h1>
            <p>{s.copy}</p>
            <div>
              <Link className="button" href="/search">
                {s.cta}
              </Link>
              <Link className="button secondary" href="/sell">
                Become a Seller
              </Link>
            </div>
          </div>
          <div
            className="hero-products"
            aria-label="Featured product composition"
          >
            {s.emoji.map((e, i) => (
              <span key={`${slide}-${i}`}>{e}</span>
            ))}
          </div>
          <div className="carousel-controls">
            <button
              aria-label="Previous slide"
              onClick={() =>
                setSlide((slide + slides.length - 1) % slides.length)
              }
            >
              <ArrowLeft />
            </button>
            <div>
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={i === slide ? "active" : ""}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === slide}
                  onClick={() => setSlide(i)}
                />
              ))}
            </div>
            <button
              aria-label="Next slide"
              onClick={() => setSlide((slide + 1) % slides.length)}
            >
              <ArrowRight />
            </button>
          </div>
        </section>
        <aside className="assurance">
          <div>
            <ShieldCheck />
            <h3>Weivas Pay</h3>
            <p>Payment methods will appear after provider activation.</p>
            <b>No payment credentials are collected yet.</b>
          </div>
          <div>
            <PackageCheck />
            <h3>Buyer Protection</h3>
            <p>Clear seller policies</p>
            <p>Order-linked support</p>
          </div>
          <div className="side-deal">
            <h3>Recently added</h3>
            <p>{products.length?`${products.length} approved product${products.length===1?"":"s"} available`:"Approved products will appear here."}</p>
            <i>📦</i>
          </div>
        </aside>
      </div>
      <section className="trust-strip">
        {[
          ["Approved Catalogue", "Active listings only", PackageCheck],
          ["Verified Suppliers", "Reviewed seller status", BadgeCheck],
          ["Account Security", "Protected sign-in", ShieldCheck],
          ["Order Support", "Trackable help requests", Headphones],
        ].map(([a, b, I]) => (
          <div key={String(a)}>
            {typeof I !== "string" && <I />}
            <span>
              <b>{a as string}</b>
              <small>{b as string}</small>
            </span>
          </div>
        ))}
      </section>
      <section className="section">
        <Heading eyebrow="EXPLORE THE MARKETPLACE" title="Shop by category" />
        <div className="category-row">
          {categories.slice(0, 8).map((c, i) => (
            <Link href={`/category/${c.slug}`} key={c.name}>
              <span>{["📱", "💻", "🎧", "☕", "👟", "⌚", "🧴", "🍽️"][i]}</span>
              <b>{c.name}</b>
            </Link>
          ))}
          <Link href="/search">
            <span>•••</span>
            <b>More Categories</b>
          </Link>
        </div>
      </section>
      <section className="campaigns">
        <article className="campaign orange">
          <small>BUSINESS SAVINGS</small>
          <h2>Bulk Order Discounts</h2>
          <p>Bigger orders. Bigger savings.</p>
          <b>Seller-defined pricing</b>
          <Link href="#wholesale">Explore bulk listings</Link>
          <span>📦</span>
        </article>
        <article className="campaign">
          <small>JUST LANDED</small>
          <h2>New Arrivals</h2>
          <p>Fresh finds for every day.</p>
          <Link href="#new">Shop Now</Link>
          <span>👟</span>
        </article>
        <article className="campaign">
          <small>GROW WITH WEIVAS</small>
          <h2>Sell on Weivas</h2>
          <p>Take your business global.</p>
          <Link href="/sell">Become a Seller</Link>
          <span>↗</span>
        </article>
      </section>
      <section className="section products">
        <Heading eyebrow="CURATED FOR YOU" title="Top picks for you" />
        <div className="product-grid">
          {products.slice(0, 6).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      {products.some(product=>product.oldPrice&&product.oldPrice>product.price)&&<section className="section deal-section">
        <Heading eyebrow="LIMITED-TIME SAVINGS" title="Deals of the day" />
        <div className="deal-layout">
          <div className="deal-clock">
            <small>ACTIVE LISTING SAVINGS</small>
            <h3>
              Handpicked savings,
              <br />
              while they last.
            </h3>
            <Link href="/search">
              Explore all deals <ChevronRight />
            </Link>
          </div>
          <div className="deal-products">
            {products.filter(product=>product.oldPrice&&product.oldPrice>product.price).slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} variant="deal" />
            ))}
          </div>
        </div>
      </section>}
      <section className="section" id="new">
        <Heading eyebrow="FRESHLY ADDED" title="New arrivals" />
        <div className="product-rail">
          {products.slice(5, 12).map((p) => (
            <ProductCard key={p.id} product={p} variant="compact" />
          ))}
        </div>
      </section>
      <section className="section commerce-split">
        <div>
          <Heading
            eyebrow="AUTHENTIC TECHNOLOGY"
            title="Verified electronics"
          />
          <div className="editorial-grid">
            {products
              .filter(
                (p) =>
                  p.category.includes("Electronics") ||
                  p.category.includes("Computers"),
              )
              .slice(0, 3)
              .map((p) => (
                <ProductCard key={p.id} product={p} variant="editorial" />
              ))}
          </div>
        </div>
        <div className="warm-editorial">
          <small>HOME & LIVING</small>
          <h2>
            Everyday comfort,
            <br />
            beautifully considered.
          </h2>
          <div>☕　🍽️　🪴</div>
          <Link href="/search">
            Shop the collection <ArrowRight />
          </Link>
        </div>
      </section>
      <section className="section">
        <Heading eyebrow="STYLE EDIT" title="Fashion picks" />
        <div className="product-rail">
          {products.filter((p) => p.category.toLowerCase().includes("fashion")).slice(0,8).map((p) => (
            <ProductCard key={p.id} product={p} variant="compact" />
          ))}
        </div>
      </section>
      <section className="section business-panel">
        <div>
          <small>WORK BETTER</small>
          <h2>Business supplies for teams that move.</h2>
          <p>
            Office equipment, printers, storage, seating and smart accessories
            from verified sellers.
          </p>
          <Link className="button" href="/search">
            Shop business supplies
          </Link>
        </div>
        <div>🖨️　💻　🪑　🗄️</div>
      </section>
      <section className="section" id="wholesale">
        <Heading
          eyebrow="SOURCE WITH CONFIDENCE"
          title="Wholesale and bulk buying"
          link="Explore sourcing"
        />
        <div className="wholesale-grid">
          {products.filter(product=>(product.moq??1)>1).map((p) => (
            <ProductCard key={p.id} product={p} variant="wholesale" />
          ))}
        </div>
      </section>
      <section className="section">
        <Heading eyebrow="TRUSTED STOREFRONTS" title="Featured sellers" />
        <div className="seller-cards">
          {featuredStores.map((s) => (
            <article key={s.id}>
              <div className="seller-head">
                <i>W</i>
                <div>
                  <h3>{s.name}</h3>
                  <span>
                    <BadgeCheck /> Verified · {s.country}
                  </span>
                </div>
              </div>
              <div className="seller-stats">
                <span>
                  <b>{s.productCount}</b> active products
                </span>
              </div>
              <Link href={`/store/${s.slug}`}>
                Visit Store <ArrowRight />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="brand-strip">
        <small>BRANDS FROM APPROVED LISTINGS</small>
        <div>
          <b>Brand information appears as sellers publish reviewed products.</b>
        </div>
      </section>
      <section className="section pay-protection">
        <article className="pay-panel">
          <div>
            <small>WEIVAS PAY</small>
            <h2>
              Protected from checkout
              <br />
              to successful delivery.
            </h2>
            <p>
              Payment and protection terms will be published when the verified
              payment, refund and fulfilment services are activated.
            </p>
            <div>
              <span>
                <ShieldCheck /> Protected payment
              </span>
              <span>
                <CreditCard /> Multiple methods
              </span>
              <span>
                <PackageCheck /> Eligible refunds
              </span>
            </div>
          </div>
          <div className="pay-phone">
            <ShoppingCart />
            <b>Payment protected</b>
            <small>Order total</small>
            <strong>Provider pending</strong>
          </div>
        </article>
        <article className="protection-panel">
          <small>BUYER PROTECTION</small>
          <h2>Shop with confidence.</h2>
          {[
            "Order-linked support",
            "Seller policy visibility",
            "Secure account access",
            "Trackable support references",
          ].map((x) => (
            <p key={x}>✓ {x}</p>
          ))}
        </article>
      </section>
      <section className="app-promo">
        <div>
          <small>MOBILE-READY MARKETPLACE</small>
          <h2>
            Shop and sell from
            <br />
            any modern browser.
          </h2>
          <p>
            The responsive website supports buyers and sellers without claiming unreleased mobile apps.
          </p>
        </div>
        <div className="app-phones">
          <div>
            <b>WEIVAS</b>
            <span>Buyer app</span>
            <i>🛍️</i>
          </div>
          <div>
            <b>SELLER</b>
            <span>Seller app</span>
            <i>📊</i>
          </div>
          <QrCode />
        </div>
      </section>
      <section className="benefits">
        {[
          [ShieldCheck, "Secure accounts", "Server-protected access"],
          [PackageCheck, "Approved listings", "Active catalogue only"],
          [Truck, "Delivery clarity", "Confirmed before payment"],
          [Headphones, "Customer support", "Trackable requests"],
        ].map(([I, a, b]) => (
          <div key={String(a)}>
            {typeof I !== "string" && <I />}
            <b>{a as string}</b>
            <small>{b as string}</small>
          </div>
        ))}
      </section>
    </main>
  );
}
