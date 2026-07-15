# Weivas Marketplace

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

- `/` responsive public marketplace homepage
- `/search` searchable product results and no-results state
- `/account` buyer dashboard overview
- `/seller` seller performance dashboard
- `/seller/products` responsive product management table/cards

Shared UI lives in `src/components`, typed fictional content in `src/data/mock`, and brand assets in `public/brand`. Commerce, authentication, payments, verification, logistics, refunds, payouts, and analytics are demonstrations only; no external service is connected.

## Visual direction

The design uses approved orange, charcoal, cream, peach, white, and light-grey tokens with limited digital blue. Supplied logo and visual reference images guided the product-led hero, compact commerce density, warm surfaces, dashboards, and responsive hierarchy.

## Next stage

Build full product detail, category, cart, checkout, order tracking, seller onboarding, and remaining account/seller route foundations; then connect approved backend services behind explicit mock/service boundaries.
