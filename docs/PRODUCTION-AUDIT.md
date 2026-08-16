# WEIVAS production audit

Audit date: 2026-08-16

## Current architecture

WEIVAS is a Next.js 16 App Router application deployed as a server-capable application, with React 19, TypeScript, NextAuth credentials authentication, Prisma 7, PostgreSQL on Neon, server actions for mutations, Zustand for anonymous browser cart state, and Vercel-oriented deployment configuration. Protected buyer, seller and administrator routes are enforced by middleware and repeated server-side ownership checks. The approved visual system is implemented with shared CSS and brand assets.

## Capability classification

### LIVE

- PostgreSQL-backed users, buyer profiles, addresses, sellers, stores, categories, products, variants, product images, carts, wishlists, orders and support tickets.
- Buyer registration, password hashing, email-verification token lifecycle, sign-in, sign-out, password reset, password change and session revocation.
- Server-enforced buyer, approved-seller and administrator access.
- Seller application draft/submission states, product drafts, submission, archive, inventory display, store settings and seller-owned order access.
- Public database catalogue queries, product/category routes, persistent authenticated carts and wishlists.
- Server-side stock validation and transactional stock reservation when an order draft is created.
- Buyer addresses, profile, notification preferences, order list/detail and unpaid-order cancellation with stock restoration.
- Database-backed support intake with rate limiting, references and an administrator queue.
- Health endpoint, legal/help pages, favicon, robots rules, sitemap foundation, organization metadata and structured site search data.

### PARTIAL

- Email: Resend transport exists, but production sending requires a verified domain and API key; order and fulfilment templates are absent.
- Checkout: validates real products, prices and stock on the server, but no payment session or verified webhook exists.
- Orders: buyer and seller records exist, but there is no payment record, status history, shipment record, tracking event, invoice or notification fan-out.
- Product management: core commercial fields exist, but brands are not relational, media upload is disabled, specifications/dimensions are absent and variants have no seller UI.
- Search: database text search works across products, descriptions, categories and stores, but lacks filters, sorting, autocomplete, typo tolerance and pagination beyond a fixed limit.
- Seller dashboard: metrics derive from owned data, but payments, payouts, returns, messaging and traffic analytics are not implemented.
- Admin: real summary metrics and support queue exist, but users, seller verification, product moderation, orders, payments, shipments, returns, disputes, settings and audit workspaces are missing.
- SEO: global metadata and static sitemap exist, but product/category/store metadata, database sitemap entries, Product/Offer/Breadcrumb schema and Merchant feeds are incomplete.
- Security: strong ownership and authentication foundations exist, but payment webhook verification, upload scanning, admin MFA, distributed rate limiting and CSP hardening remain.

### MOCKED

- Homepage appends fictional products, wholesale products, sellers, ratings, order counts, brands, discounts, deal timers and mobile-app badges to real catalogue data.
- Public store pages are generated entirely from mock sellers and mock products.
- Product detail seller statistics, reviews, variants, gallery, related products, delivery dates and buyer-protection statements are demonstration data.
- Anonymous cart and checkout resolve products from the mock catalogue.
- Cart totals apply invented discount, shipping and tax formulas that do not match server-created orders.
- Homepage claims for payment methods, worldwide delivery, returns, protection and 24/7 support exceed current operational capability.
- Development seed accounts/orders are correctly labelled fictional, but production seeding is not explicitly prevented.

### MISSING

- Payment, payment attempt, refund, commission, ledger and payout models.
- Provider-neutral payment service plus Paystack/Flutterwave implementation and verified webhook processing.
- Shipment, delivery quote, courier, tracking-event and order-status-history models.
- Return, dispute, review, rating, notification, audit-log, promotion/coupon, brand, warehouse and marketplace-settings models.
- Product media upload implementation, bulk CSV/Jiji migration workflow and product feeds.
- First-party WEIVAS Store provisioning workflow.
- Full admin operating system, customer/seller messaging, invoices/receipts and observability integration.
- Staging environment, production CI checks, backup/restore runbook and pilot launch controls.

### BLOCKED

- Real payments: choose Paystack or Flutterwave and supply test credentials first, then production credentials after sandbox acceptance.
- Transactional email: verified Resend domain, API key and approved sender address.
- Product/document media: approved S3-compatible provider, bucket, region/endpoint and scoped credentials.
- Logistics: provider selection, account and sandbox/API credentials.
- Analytics/Search Console: GA4 measurement ID, Search Console verification value and consent policy.
- Legal claims: approved return window, buyer-protection scope, prohibited products, seller eligibility, supported countries and dispute rules.
- Commercial rules: launch currency, commission, payout cycle, taxes, shipping calculation and free-delivery threshold.

## Technical weaknesses

- Real and mock commerce data are mixed in customer-facing components.
- Client totals and server totals differ.
- Order drafts reserve stock before a real payment attempt exists and have no automatic expiry/release job.
- Parent order status is not consistently derived from seller-order transitions.
- Store pages cannot display database sellers.
- Product image records exist but are not rendered through a real media pipeline.
- Search and catalogue queries use fixed limits rather than cursor pagination.
- Support rate limiting is database-backed but authentication rate limits are not distributed at edge scale.
- The deployment workflow is only a legacy GitHub Pages notice; Vercel checks are not represented in repository CI.

## Priority plan

### P0 — required before first sale

1. Remove customer-facing mock commerce data and inaccurate trust/payment/delivery claims.
2. Make cart and checkout totals server-authoritative and identical.
3. Add payment records, idempotent checkout initiation, verified webhook handling and stock-release rules.
4. Add real product media and first-party WEIVAS Store provisioning.
5. Add order history/state events, seller confirmation, fulfilment and manual/provider shipment tracking.
6. Send verified registration, payment, order and shipment emails.
7. Add essential admin product/seller/order/payment controls and audit logs.
8. Complete end-to-end sandbox transaction and browser/mobile QA.

### P1 — professional operations

- Returns, refunds, disputes, seller payouts, configurable commissions, notifications, reviews, bulk CSV import, advanced search/filtering, legal policy completion, analytics, Merchant feed, accessibility and observability.

### P2 — scale

- Multi-warehouse inventory, advanced recommendations, international tax/logistics, seller automation, social commerce feeds, sophisticated fraud/risk scoring and data warehouse analytics.

## Recommended production architecture

- Vercel for the Next.js application, route handlers, server actions and verified webhooks.
- Neon PostgreSQL for transactional relational data, using pooled runtime connections and isolated branches for development/staging.
- S3-compatible object storage with signed uploads and private seller-document access.
- Provider interfaces for payment, logistics, email and storage so vendors can be replaced.
- Durable database event/history tables for payments, orders, shipments, refunds and administrator actions.
- Scheduled jobs for abandoned payment expiry, stock release, reconciliation and notification retries.
- Error monitoring plus structured server logs with request/provider correlation IDs.

## Implementation order

Commerce-data integrity → payment architecture → real media/first-party inventory → fulfilment/tracking → operational email → admin controls → returns/refunds/disputes → import/search/SEO feeds → release hardening and pilot.
