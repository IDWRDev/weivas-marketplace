# Weivas Marketplace

Production site: [https://weivas.com/](https://weivas.com/)

Weivas is a multi-vendor marketplace connecting buyers with independent sellers and verified suppliers. Its consumer promise is **“Good things, handpicked for you.”** and its wider brand promise is **“Verify. Connect. Empower.”**

## Local setup

Requirements: Node.js 20+, npm, and a PostgreSQL database (Neon is supported).

```bash
npm ci
copy .env.example .env.local
```

Fill in `DATABASE_URL`, `AUTH_SECRET`, and the other required values in `.env.local`, then run:

```bash
npm run db:generate
npm run db:migrate
npm run dev
```

`npm ci` succeeds before environment setup because Prisma Client generation uses a non-connecting placeholder URL when `DATABASE_URL` is absent. Database commands and the running application still require a real connection string.

## Validation

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Implemented areas

- Database-backed public catalogue, search, category and product pages
- Separate buyer and seller authentication and dashboards
- Persistent authenticated carts and wishlists
- Buyer addresses and database-backed multi-seller order creation
- Seller onboarding, stores and product management
- Admin metrics sourced from operational data
- Rate-limited authentication, password reset email delivery, and session revocation after password changes

Payment collection remains intentionally disabled until a payment provider is configured. New orders are saved with a pending-payment status and no card data is collected.

## Password-reset email

Production reset delivery uses the Resend HTTP API. Configure `EMAIL_PROVIDER_API_KEY`, `EMAIL_FROM`, and `APP_URL`. The application never writes reset URLs or tokens to logs. If the provider is not configured, production reset delivery fails safely and the generic response does not reveal whether an account exists.
