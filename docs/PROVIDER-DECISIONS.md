# WEIVAS provider decisions

## Nigeria-first pilot stack

- Payments and marketplace settlement: Paystack
- Transactional email: Resend
- Product and seller media: Cloudflare R2
- Shipping rates, labels and tracking: Shipbubble
- Primary launch currency: NGN

## Activation gates

Checkout remains disabled until Paystack and Shipbubble test credentials are both configured. This prevents WEIVAS from charging a product-only total before a real delivery quote is included.

Required production environment variables are documented in `.env.example`. Secrets must be stored in Vercel and local environment files, never committed.

Paystack webhook URL:

`https://weivas.com/api/payments/paystack/webhook`

R2 uploads use five-minute, content-type-restricted PUT URLs. The completion endpoint verifies object ownership, type and size before creating a product image record.

## Implemented safeguards

- Prices, availability, ownership and delivery addresses are re-read from the database.
- One checkout key can initialize only one payment/order.
- Inventory is reserved atomically before payment initialization and restored when initialization fails.
- Orders become paid only after Paystack server-side verification.
- Webhooks require Paystack HMAC SHA-512 signatures and are idempotently recorded.
- Amount or currency mismatches are placed in manual review.
- Buyers cannot cancel an order while its Paystack session is active.
- Card and bank credentials never pass through or persist in WEIVAS.
