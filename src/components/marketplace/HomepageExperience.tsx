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
import {
  categories,
  products as mockProducts,
  sellers,
  wholesale,
} from "@/data/mock/marketplace";
import { ProductCard } from "./ProductCard";
import { useEffect, useState } from "react";
const slides = [
  {
    tag: "GLOBAL MARKETPLACE",
    title: "Good things, handpicked for you.",
    copy: "Millions of quality products from verified suppliers, delivered with care.",
    cta: "Shop Now",
    emoji: ["🧳", "🎧", "⌚", "☕"],
  },
  {
    tag: "SMARTER EVERYDAY",
    title: "Technology that moves with you.",
    copy: "Verified electronics, helpful warranties and fast global delivery.",
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
    copy: "Request quotes from verified suppliers with global shipping options.",
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
export function HomepageExperience({catalogProducts=[]}:{catalogProducts?:import("@/types/marketplace").Product[]}) {
  const products=[...catalogProducts,...mockProducts.filter(mock=>!catalogProducts.some(product=>product.id===mock.id))];
  const [slide, setSlide] = useState(0);
  const [time, setTime] = useState(8 * 3600 + 45 * 60 + 22);
  useEffect(() => {
    const id = setInterval(() => setTime((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const s = slides[slide];
  const clock = [
    Math.floor(time / 3600),
    Math.floor((time % 3600) / 60),
    time % 60,
  ]
    .map((n) => String(n).padStart(2, "0"))
    .join(" : ");
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
            <p>Safe checkout demonstration.</p>
            <b>VISA · Mastercard · PayPal</b>
          </div>
          <div>
            <PackageCheck />
            <h3>Buyer Protection</h3>
            <p>Refund-eligible purchases</p>
            <p>Dispute support</p>
          </div>
          <div className="side-deal">
            <span>-40%</span>
            <h3>Deal of the Day</h3>
            <b>{clock}</b>
            <i>⌚</i>
            <strong>$59.99</strong>
          </div>
        </aside>
      </div>
      <section className="trust-strip">
        {[
          ["Global Sourcing", "Millions of products", CreditCard],
          ["Verified Suppliers", "Quality assured", BadgeCheck],
          ["Secure Payments", "Protected checkout", ShieldCheck],
          ["Fast Delivery", "Worldwide shipping", Truck],
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
          <b>Up to 30% off</b>
          <Link href="#wholesale">Request a Quote</Link>
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
      <section className="section deal-section">
        <Heading eyebrow="LIMITED-TIME SAVINGS" title="Deals of the day" />
        <div className="deal-layout">
          <div className="deal-clock">
            <small>ENDS IN</small>
            <b>{clock}</b>
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
            {products.slice(1, 5).map((p) => (
              <ProductCard key={p.id} product={p} variant="deal" />
            ))}
          </div>
        </div>
      </section>
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
          {[products[3], products[5], ...products.filter((p) => ["f3", "f4", "f5"].includes(p.id))].map((p) => (
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
          {wholesale.map((p) => (
            <ProductCard key={p.id} product={p} variant="wholesale" />
          ))}
        </div>
      </section>
      <section className="section">
        <Heading eyebrow="TRUSTED STOREFRONTS" title="Featured sellers" />
        <div className="seller-cards">
          {sellers.map((s) => (
            <article key={s.id}>
              <div className="seller-head">
                <i>{s.logo}</i>
                <div>
                  <h3>{s.name}</h3>
                  <span>
                    <BadgeCheck /> Verified · {s.country}
                  </span>
                </div>
              </div>
              <div className="seller-stats">
                <span>
                  <b>{s.rating}</b> rating
                </span>
                <span>
                  <b>{s.feedback}%</b> feedback
                </span>
                <span>
                  <b>{s.responseRate}%</b> response
                </span>
                <span>
                  <b>{s.completedOrders.toLocaleString()}</b> orders
                </span>
              </div>
              <div className="seller-products">
                {s.featured.map((x, i) => (
                  <span key={i}>{x}</span>
                ))}
              </div>
              <Link href={`/store/${s.slug}`}>
                Visit Store <ArrowRight />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="brand-strip">
        <small>TRUSTED GLOBAL BRANDS</small>
        <div>
          <b>NOVA</b>
          <b>kinetic</b>
          <b>ORIGO</b>
          <b>HEARTH</b>
          <b>MOTION</b>
          <b>ARC & CO.</b>
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
              Secure checkout, multiple payment methods, eligible refunds and
              seller settlement after confirmed fulfilment—all shown as a
              frontend demonstration.
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
            <strong>$249.80</strong>
          </div>
        </article>
        <article className="protection-panel">
          <small>BUYER PROTECTION</small>
          <h2>Shop with confidence.</h2>
          {[
            "Item not received",
            "Item not as described",
            "Damaged item",
            "Refund eligibility",
            "Dispute support",
          ].map((x) => (
            <p key={x}>✓ {x}</p>
          ))}
        </article>
      </section>
      <section className="app-promo">
        <div>
          <small>WEIVAS ON THE GO</small>
          <h2>
            One marketplace.
            <br />
            Two powerful apps.
          </h2>
          <p>
            Shop confidently or manage your store wherever business takes you.
          </p>
          <div className="store-buttons">
            <button> App Store</button>
            <button>▶ Google Play</button>
          </div>
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
          [CreditCard, "Secure payments", "100% protected"],
          [PackageCheck, "Easy returns", "30-day support"],
          [Truck, "Fast delivery", "Worldwide shipping"],
          [Headphones, "24/7 support", "Always here for you"],
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
