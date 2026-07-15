# Weivas Marketplace

Production site: [https://weivas.com/](https://weivas.com/)

GitHub Pages fallback: [https://idwrdev.github.io/weivas-marketplace/](https://idwrdev.github.io/weivas-marketplace/)

Weivas is a premium global multi-vendor marketplace connecting buyers with independent sellers, brands, manufacturers, distributors, and verified suppliers. Its consumer promise is **“Good things, handpicked for you.”** and its wider brand promise is **“Verify. Connect. Empower.”**

## Stack and setup

- Next.js App Router, React, strict TypeScript
- Tailwind CSS foundation plus central CSS design tokens
- Lucide icons, clsx, tailwind-merge, Zustand

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Implemented experiences

- `/` complete responsive marketplace homepage with a four-slide hero, category navigation, product departments, daily deals, wholesale sourcing, featured sellers, Weivas Pay and buyer-protection education, app promotion, and global footer
- `/search` searchable product results and no-results state
- `/account` buyer dashboard overview
- `/seller` seller performance dashboard
- `/seller/products` responsive product management table/cards

Shared UI lives in `src/components`, typed fictional content in `src/data/mock`, and brand assets in `public/brand`. Homepage interactions use persisted local browser state for wishlist and cart counts. The category drawer, hero controls, search form, countdown, horizontal product rails, and mobile navigation are working frontend demonstrations. Commerce, authentication, payments, verification, logistics, refunds, payouts, and analytics are demonstrations only; no external service is connected.

## Visual direction

The design uses approved orange, charcoal, cream, peach, white, and light-grey tokens with limited digital blue. Supplied logo and visual reference images guided the product-led hero, compact commerce density, warm surfaces, dashboards, and responsive hierarchy.

## Next stage

Build complete product detail, category/search discovery, cart, and checkout experiences, followed by order tracking and seller onboarding; then connect approved backend services behind explicit mock/service boundaries.
