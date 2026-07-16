# Authenticated deployment

The original Weivas frontend used `output: "export"` and GitHub Pages. That architecture remains visible in repository history, but GitHub Pages cannot run secure sessions, Prisma, PostgreSQL queries, server actions, route handlers, or ownership checks.

The authenticated application therefore requires a server-capable Next.js host. Vercel is the recommended default; another Node.js host is acceptable if it supports Next.js 16, environment secrets, PostgreSQL connectivity, and persistent server execution.

No hosting migration is performed by this change. Before production deployment, provision PostgreSQL and configure the variables in `.env.example`. The GitHub Pages workflow is retained as a manual legacy notice and no longer attempts to upload an invalid static artifact.

Development seed accounts use fictional `example.test` addresses and the local-only password documented in `prisma/seed.ts`. Never reuse those credentials in production.
