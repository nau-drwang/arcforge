# Backend

Edit Cloudflare Pages Functions and D1 migrations here.

- `functions/` is the canonical source for API routes.
- `migrations/` contains D1 SQL migration files.

The build script mirrors `backend/functions/` to the root `functions/` directory because Cloudflare Pages expects Functions at the repo root during deployment.
