# Codex instruction — Weivas professional marketplace redesign

Work inside the existing Weivas Next.js repository. Do not create a replacement project, reset working files, alter the data model unnecessarily, or remove functioning routes. Preserve buyer/seller authentication, database-backed catalogue and checkout behavior, dashboards, responsive navigation, favicon, and deployment configuration.

## Objective

Transform Weivas into a premium, contemporary global marketplace that feels commercially credible at first glance. The experience should communicate trust, product quality, international reach, and operational maturity without looking like a generic template. Use the supplied Weivas logo as the visual anchor and orange as a disciplined action color—not a decorative fill applied everywhere.

## Design direction

- Use warm white and very light neutral page surfaces, refined charcoal typography, measured orange calls to action, and restrained blue/green trust signals.
- Establish consistent design tokens for spacing, type scale, radii, borders, shadows, container widths, motion, and focus states.
- Prefer generous whitespace, strong alignment, clear hierarchy, subtle borders, and layered shadows over large gradients or noisy decoration.
- Use product photography when approved assets exist. Where no real imagery exists, use deliberate branded compositions or clean iconography; never show broken images, corrupted glyphs, or unexplained placeholders.
- Keep commercial density high enough for marketplace discovery while maintaining readable titles, prices, metadata, and actions.

## Required improvements

1. Build a compact, stable commerce header with prominent search, category access, delivery context, account state, wishlist, orders, cart, and seller entry points. Keep it intelligently sticky without disappearing or covering content.
2. Redesign the homepage hero as a premium editorial-commerce composition with decisive messaging, two clear actions, visible buyer trust, and a polished product/capability visual.
3. Standardize section rhythm and headings across categories, campaigns, deals, products, sellers, wholesale, buyer protection, payment, applications, and footer content.
4. Refine product cards into equal-height components with clear image hierarchy, two-line titles, price emphasis, restrained metadata, meaningful stock/verification states, and polished hover/focus behavior.
5. Apply the same system to search, category, product, cart, checkout, authentication, buyer account, seller centre, onboarding, and admin screens.
6. Make forms and tables feel production-ready: clear labels, validation, disabled/loading states, touch-friendly controls, readable rows, and useful empty/error states.
7. Clearly identify capabilities that still require external payment, email, logistics, verification, analytics, or storage providers. Never fabricate operational claims.

## Responsive and accessibility requirements

- Verify layouts at 390px, 768px, 1024px, 1440px, and wider desktop sizes.
- Prevent horizontal overflow, clipped controls, overlapping sticky regions, unstable card heights, and hidden primary actions.
- Keep practical touch targets at least 44px.
- Preserve semantic HTML, keyboard navigation, visible focus, sufficient contrast, reduced-motion support, and meaningful accessible names.

## Working method

- Inspect the existing implementation before editing and reuse its components, brand assets, working flows, and data services.
- Keep visual overrides organized and reversible while iterating.
- Test representative public, buyer, seller, authentication, and admin routes in the browser on desktop and mobile.
- Do not commit or push until the user reviews the live local preview and explicitly approves it.

## Acceptance criteria

- The homepage gives an immediately premium first impression and has no placeholder-looking hero content.
- Product discovery is dense, consistent, and readable.
- Buyer and seller areas are unmistakably distinct but share one brand system.
- Sticky navigation behaves predictably across breakpoints.
- No route or working interaction regresses.
- Encoding is clean, favicon and brand assets render, and there is no horizontal overflow.
- `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` all pass before requesting approval to commit.
